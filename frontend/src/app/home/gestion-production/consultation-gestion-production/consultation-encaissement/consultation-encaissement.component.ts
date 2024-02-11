import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Client } from '../../../../model/Client';
import { Encaissement } from '../../../../model/Encaissement';
import { Facture } from '../../../../model/Facture';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Police } from '../../../../model/Police';
import { Quittance } from '../../../../model/Quittance';
import { User } from '../../../../model/User';
import { ClientService } from '../../../../services/client.service';
import { EncaissementService } from '../../../../services/encaissement.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { saveAs } from 'file-saver';
import { UserService } from '../../../../services/user.service';
import { Produit } from '../../../../model/Produit';
import { ProduitService } from '../../../../services/produit.service';
import dateFormatter from 'date-format-conversion';

@Component({
  selector: 'ngx-consultation-encaissement',
  templateUrl: './consultation-encaissement.component.html',
  styleUrls: ['./consultation-encaissement.component.scss']
})
export class ConsultationEncaissementComponent implements OnInit {

  // =============== PARTIE CONSULTATION DE LA LISTE DES ENCAISSEMENTS A EDITER ================
  encaissements: Array<Encaissement> = new Array<Encaissement>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['encai_numeroencaissement', 'encai_numeropolice', 'encai_numerofacture', 'encai_souscripteur', /*'encai_numeroquittance',*/ 'encai_datepaiement', /*'encai_typencaissement',*/ 'encai_mtnquittance', /*'encai_mtnpaye',*/ 'encai_solde', /*'encai_codebanque', 'encai_numerocheque',*/ 'encai_datecomptabilisation', 'details'];
  // public dataSource = new MatTableDataSource<Encaissement>();
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // =============== FIN PARTIE CONSULTATION DE LA LISTE DES ENCAISSEMENTS A EDITER =============

  clientss: Array<Client> = new Array<Client>();
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();
  produits: Array<Produit> = new Array<Produit>();

  autorisation = [];

  addForm = this.fb.group({

    // encai_numeroencaissement: [''],
    date_debut: [''],
    date_fin: [''],
  });

  public clientsCtrl: FormControl = new FormControl();
  public intermediaireCtrl: FormControl = new FormControl();
  public produitCtrl: FormControl = new FormControl();

  public clientsFilterCtrl: FormControl = new FormControl();
  public intermediaireFilterCtrl: FormControl = new FormControl();
  public produitFilterCtrl: FormControl = new FormControl();


  public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();
  public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  title = 'La liste des encaissements (par ordre de numéro)';

  login_demandeur: string;
  demandeur: string;
  user: User;
  numClient: number;
  numIntermediaire: number = 0;
  numProduit: number = 0;
  date_debut: any = '0';
  date_fin: any = '0';
  date_fin2: Date;

  problemeDate: boolean = false;
  problemeDateFin: boolean = false;
  erreur: boolean = false;

  check: boolean = false ;

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private router: Router,
    private encaissementService: EncaissementService,
    private clientService: ClientService,
    private intermediaireService: IntermediaireService,
    private produitService: ProduitService,
    private userService: UserService,
    private dialogService: NbDialogService) { }

  ngOnInit(): void {

    // this.onGetAllEncaissements();
    this.onGetAllEncaissementsAndClient();
    this.onGetAllClients();
    this.onGetAllItermediaires();
    this.onGetAllProduits();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);

          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }

      });



    this.clientsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });

    this.intermediaireFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererIntermediaires();
      });

    this.produitFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererProduits();
      });

  }

  cancel() {
    this.router.navigateByUrl('/home/gestion-encaissement');
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterClients() {
    console.log(this.clientss.filter(cl => cl.clien_nom));
    if (!this.clientss) {
      return;
    }
    // get the search keyword
    let search = this.clientsFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.clientss.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clientss.filter(cl => cl.clien_prenom?.toLowerCase().indexOf(search) > -1 ||
        cl.clien_nom?.toLowerCase().indexOf(search) > -1 ||
        cl.clien_sigle?.toLowerCase().indexOf(search) > -1 ||
        cl.clien_denomination?.toLowerCase().indexOf(search) > -1 ||
        cl.clien_numero?.toString().indexOf(search) > -1
      )

    );
  }

  protected filtererIntermediaires() {
    if (!this.intermediaires) {
      return;
    }
    // get the search keyword
    let search = this.intermediaireFilterCtrl.value;
    if (!search) {
      this.filteredIntermediaire.next(this.intermediaires.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIntermediaire.next(
      this.intermediaires.filter(c => c.inter_denomination.toLowerCase().indexOf(search) > -1 ||
        c.inter_numero.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  protected filtererProduits() {
    if (!this.produits) {
      return;
    }
    // get the search keyword
    let search = this.produitFilterCtrl.value;
    if (!search) {
      this.filteredProduit.next(this.produits.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProduit.next(
      this.produits.filter(p => p.prod_denominationlong.toLowerCase().indexOf(search) > -1 ||
        p.prod_numero.toString().toLowerCase().indexOf(search) > -1)
    );
  }


  onChangeClient(event) {
    this.numClient = Number(event.value);
    // this.addForm.controls['encai_numerosouscripteur'].setValue(event.value);
  }

  onChangeProduit(event) {
    // console.log("Produit: " + typeof(Number(event.value)));
    this.numProduit = Number(event.value);
  }

  onChangeItermediaire(event) {
    // console.log("Intermdiaire: " + Number(event.value));
    this.numIntermediaire = Number(event.value);
  }

  onFocusOutEventDate(event: any) {
    this.date_debut = this.addForm.get("date_debut").value;
    this.date_fin = this.addForm.get("date_fin").value;

    if ((this.date_debut != null && this.date_debut != '') && (this.date_fin != null && this.date_fin != '')) {
      if (this.date_debut > this.date_fin) {
        this.problemeDate = true;
        this.erreur = true;
      } else {
        this.problemeDate = false;
        // this.erreur = false;

        if (dateFormatter(new Date(), 'yyyy-MM-dd') < this.date_fin) {
          this.problemeDateFin = true;
          this.erreur = true;
        } else {
          this.problemeDateFin = false;
          this.erreur = false;

          var date_finRecuperer = new Date(this.date_fin);
          date_finRecuperer.setDate(date_finRecuperer.getDate() + 1);

          this.date_fin = dateFormatter(date_finRecuperer, 'yyyy-MM-dd');
        }
      }
    }
  }

  getColorDate() {
    if (this.problemeDate) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  // onGetAllEncaissements() {
  //   this.encaissementService.getAllEncaissement()
  //     .subscribe((data: Encaissement[]) => {
  //       // this.groupes = data;
  //       this.dataSource.data = data as Encaissement[];
  //     });
  // }

  onGetAllEncaissementsAndClient() {
    this.encaissementService.getAllEncaissementsAndClient()
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  // onGetAllEncaissementsByClient(numclient: number) {
  //   this.encaissementService.getAllEncaissementByClient(numclient)
  //     .subscribe((data: any) => {
  //       this.dataSource.data = data ;
  //     });
  // }

  onGetAllEncaissementsByPeriode(dateDebut: string, dateFin: string) {
    this.encaissementService.getAllEncaissementByPeriode(dateDebut, dateFin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEncaissementsByProduit(numProd: number) {
    this.encaissementService.getAllEncaissementByProduit(numProd)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEncaissementsByIntermediaire(numInterm: number) {
    this.encaissementService.getAllEncaissementByIntermediaire(numInterm)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEncaissementsByPeriodeAndProduit(numProd: number, date_debut: string, date_fin: string) {
    this.encaissementService.getAllEncaissementByPeriodeAndProduit(numProd, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEncaissementsByPeriodeAndIntermediaire(numInterm: number, date_debut: string, date_fin: string) {
    this.encaissementService.getAllEncaissementByPeriodeAndIntermediaire(numInterm, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEncaissementsByProduitAndIntermediaire(numInterm: number, numProd: number) {
    this.encaissementService.getAllEncaissementByProduitAndIntermediaire(numInterm, numProd)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEncaissementsByCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {
    this.encaissementService.getAllEncaissementByCriteres(numInterm, numProd, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllClients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientss = data as Client[];
        this.filteredClients.next(this.clientss.slice());
      });
  }

  onGetAllProduits() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.produits = data as Produit[];
        this.filteredProduit.next(this.produits.slice());
      });
  }

  onGetAllItermediaires() {
    this.intermediaireService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.intermediaires = data as Intermediaire[];
        this.filteredIntermediaire.next(this.intermediaires.slice());
      });
  }

  open(dialog: TemplateRef<any>, encaissement: Encaissement) {

    this.dialogService.open(
      dialog,
      {
        context: encaissement

      });
  }

  onConsulter() {

    /*
    console.log("numIntermediaire: " + this.numIntermediaire);
    console.log("type numIntermediaire: " + typeof(this.numIntermediaire));

    console.log("numProduit: " + this.numProduit);
    console.log("type numProduit: " + typeof (this.numProduit));

    console.log("date debut: " + this.date_debut);
    console.log("type date debut: " + typeof(this.date_debut));
    console.log("date fin: " + this.date_fin);
    console.log("type date fin: " + typeof(this.date_fin));
    */

    if ((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.numProduit == 0 && this.numIntermediaire == 0) {
      this.onGetAllEncaissementsByPeriode(this.date_debut, this.date_fin);
      this.title = 'La liste des encaissements (par période)';
    }
    else if (this.numProduit != 0 && this.numIntermediaire == 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllEncaissementsByProduit(this.numProduit);
      this.title = 'La liste des encaissements (par produit)';

    } else if (this.numProduit == 0 && this.numIntermediaire != 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllEncaissementsByIntermediaire(this.numIntermediaire);
      this.title = 'La liste des encaissements (par intermédiaire)';

    } else if ((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.numProduit != 0 && this.numIntermediaire == 0) {
      this.onGetAllEncaissementsByPeriodeAndProduit(this.numProduit, this.date_debut, this.date_fin);
      this.title = 'La liste des encaissements (par période et produit)';

    } else if ((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.numProduit == 0 && this.numIntermediaire != 0) {
      this.onGetAllEncaissementsByPeriodeAndIntermediaire(this.numIntermediaire, this.date_debut, this.date_fin);
      this.title = 'La liste des encaissements (par période et intermédiaire)';

    } else if (this.numProduit != 0 && this.numIntermediaire != 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllEncaissementsByProduitAndIntermediaire(this.numIntermediaire, this.numProduit);
      this.title = 'La liste des encaissements (par produit et intermédiaire)';

    } else if (this.numProduit != 0 && this.numIntermediaire != 0 && (this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '')) {
      this.onGetAllEncaissementsByCriteres(this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin);
      this.title = 'La liste des encaissements (par période, produit et intermédiaire)';

    } else {
      this.onGetAllEncaissementsAndClient();
      this.title = 'La liste des encaissements (par ordre de numéro)';
    }

    this.check = true ;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  onExport(format: String) {

    let titleNew = this.title.replace(/ /g, "_") ;
    let demandeurNew = this.demandeur.replace(/ /g, "_") ;

    if (format === 'pdf') {
      this.encaissementService.generateReportEncaissement(format, titleNew, demandeurNew, this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin)
        .subscribe(event => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              break;
            case HttpEventType.Response:
              saveAs(event.body, 'liste des encaissements.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.encaissementService.generateReportEncaissement(format, this.title, this.demandeur, this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin)
        .subscribe(event => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              break;
            case HttpEventType.Response:
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'liste des encaissements.xlsx');
          }
        });
    }
  }

  onOpenEncaissementsAnnules() {

    this.router.navigateByUrl('/home/gestion-production/consultation/consultation-encaissement/encaissement-annule');
  }

  onReinitialiser() {

    this.addForm.controls['date_debut'].setValue("");
    this.addForm.controls['date_fin'].setValue("");
    this.produitCtrl.setValue("");
    this.intermediaireCtrl.setValue("");

    this.date_debut = '0';
    this.date_fin = '0';
    this.numProduit = 0;
    this.numIntermediaire = 0;

    this.problemeDate = false;
    this.problemeDateFin = false;
    this.erreur = false;
  }

  // Les 3 méthodes suivantes permettent de réinitialser la variable check à false
  onClickPeriode(){
    this.check = false ;
  }

  onClickProduit(){
    this.check = false ;
  }

  onClickIntermediaire(){
    this.check = false ;
  }

}
