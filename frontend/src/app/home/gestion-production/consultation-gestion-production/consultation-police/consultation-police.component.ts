import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
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
import { PoliceService } from '../../../../services/police.service';

@Component({
  selector: 'ngx-consultation-police',
  templateUrl: './consultation-police.component.html',
  styleUrls: ['./consultation-police.component.scss']
})
export class ConsultationPoliceComponent implements OnInit {

  // =============== PARTIE CONSULTATION DE LA LISTE DES ENCAISSEMENTS A EDITER ================
  encaissements: Array<Encaissement> = new Array<Encaissement>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['poli_numero', 'produit', 'intermediaire', 'client', /*'poli_primenetreference', 'poli_primebruttotal',*/ 'poli_dateeffetencours', 'poli_dateecheance', /*'poli_datemodification',*/ 'action'];
  // public displayedColumns = ['encai_numeroencaissement', 'encai_numeropolice', 'encai_numerofacture', 'encai_souscripteur', /*'encai_numeroquittance',*/ 'encai_datepaiement', /*'encai_typencaissement',*/ 'encai_mtnquittance', /*'encai_mtnpaye',*/ 'encai_solde', /*'encai_codebanque', 'encai_numerocheque',*/ 'encai_datecomptabilisation', 'details'];
  // public dataSource = new MatTableDataSource<Encaissement>();
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // =============== FIN PARTIE CONSULTATION DE LA LISTE DES ENCAISSEMENTS A EDITER =============

  clientss: Array<Client> = new Array<Client>();
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();
  produits: Array<Produit> = new Array<Produit>();

  autorisation = [];

  // addForm = this.fb.group({

  //   // encai_numeroencaissement: [''],
  //   date_debut: [''],
  //   date_fin: [''],
  // });

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

  title = 'La liste des polices (par ordre de numéro)';
  titlePorteFeuille = 'La liste porte feuille polices (par ordre de numéro)';

  login_demandeur: string;
  demandeur: string;
  user: User;
  numClient: number = 0;
  numIntermediaire: number = 0;
  numProduit: number = 0;
  // date_debut: any = '0';
  // date_fin: any = '0';
  // date_fin2: Date;

  // problemeDate: boolean = false;
  // problemeDateFin: boolean = false;
  erreur: boolean = false;

  check: boolean = false;

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private router: Router,
    private encaissementService: EncaissementService,
    private policeService: PoliceService,
    private clientService: ClientService,
    private intermediaireService: IntermediaireService,
    private produitService: ProduitService,
    private userService: UserService,
    private dialogService: NbDialogService) { }

  ngOnInit(): void {

    this.onGetAllPoliceConsultation();
    this.onGetAllClients();
    this.onGetAllItermediaires();
    this.onGetAllProduits();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');

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
    // console.log(typeof(this.numClient));
  }

  onChangeProduit(event) {
    this.numProduit = Number(event.value);
    // console.log(typeof(this.numProduit))
  }

  onChangeItermediaire(event) {
    this.numIntermediaire = Number(event.value);
    // console.log(typeof(this.numIntermediaire))
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

  // onGetAllEncaissementsAndClient() {
  //   this.encaissementService.getAllEncaissementsAndClient()
  //     .subscribe((data: any) => {
  //       this.dataSource.data = data;
  //     });
  // }
  onGetAllPoliceConsultation() {
    this.policeService.getAllPoliceConsultation()
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllPoliceConsultationByClient(numclient: number) {
    this.policeService.getAllPoliceConsultationByClient(numclient)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllPoliceConsultationByProduit(numProduit: number) {
    this.policeService.getAllPoliceConsultationByProduit(numProduit)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllPoliceConsultationByIntermediaire(numIntermediaire: number) {
    this.policeService.getAllPoliceConsultationByIntermediaire(numIntermediaire)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllPoliceConsultationByClientAndProduit(numclient: number, numProduit: number) {
    this.policeService.getAllPoliceConsultationByClientAndProduit(this.numClient, numProduit)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllPoliceConsultationByClientAndIntermediaire(numclient: number, numIntermediaire: number) {
    this.policeService.getAllPoliceConsultationByClientAndIntermediaire(this.numClient, numIntermediaire)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllPoliceConsultationByProduitAndIntermediaire(numProduit: number, numIntermediaire: number) {
    this.policeService.getAllPoliceConsultationByProduitAndIntermediaire(numProduit, numIntermediaire)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllPoliceConsultationByAllCriteres(numclient: number, numProduit: number, numIntermediaire: number) {
    this.policeService.getAllPoliceConsultationByAllCriteres(this.numClient, numProduit, numIntermediaire)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  // onGetAllEncaissementsByProduitAndIntermediaire(numInterm: number, numProd: number) {
  //   this.encaissementService.getAllEncaissementByProduitAndIntermediaire(numInterm, numProd)
  //     .subscribe((data: any) => {
  //       this.dataSource.data = data;
  //     });
  // }

  // onGetAllEncaissementsByCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {
  //   this.encaissementService.getAllEncaissementByCriteres(numInterm, numProd, date_debut, date_fin)
  //     .subscribe((data: any) => {
  //       this.dataSource.data = data;
  //     });
  // }

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

  open(dialog: TemplateRef<any>, police: Police) {

    this.dialogService.open(
      dialog,
      {
        context: police

      });
  }

  onConsulter() {

    /*
    console.log("numClient: " + this.numClient);
    console.log("type numClient: " + typeof(this.numClient));

    console.log("numIntermediaire: " + this.numIntermediaire);
    console.log("type numIntermediaire: " + typeof(this.numIntermediaire));

    console.log("numProduit: " + this.numProduit);
    console.log("type numProduit: " + typeof (this.numProduit));
    */

    if (this.numClient != 0 && this.numProduit == 0 && this.numIntermediaire == 0) {
      this.onGetAllPoliceConsultationByClient(this.numClient);
      this.title = 'La liste des polices (par client)';
    }
    else if (this.numClient == 0 && this.numProduit != 0 && this.numIntermediaire == 0) {
      this.onGetAllPoliceConsultationByProduit(this.numProduit)
      this.title = 'La liste des polices (par produit)';

    } else if (this.numClient == 0 && this.numProduit == 0 && this.numIntermediaire != 0) {
      this.onGetAllPoliceConsultationByIntermediaire(this.numIntermediaire);
      this.title = 'La liste des polices (par intermédiaire)';
    }
    else if (this.numClient != 0 && this.numProduit != 0 && this.numIntermediaire == 0) {
      this.onGetAllPoliceConsultationByClientAndProduit(this.numClient, this.numProduit);
      this.title = 'La liste des polices (par client et produit)';
    }
    else if (this.numClient != 0 && this.numProduit == 0 && this.numIntermediaire != 0) {
      this.onGetAllPoliceConsultationByClientAndIntermediaire(this.numClient, this.numIntermediaire);
      this.title = 'La liste des polices (par client et intermédiaire)';
    }
    else if (this.numClient == 0 && this.numProduit != 0 && this.numIntermediaire != 0) {
      this.onGetAllPoliceConsultationByProduitAndIntermediaire(this.numProduit, this.numIntermediaire);
      this.title = 'La liste des polices (par produit et intermédiaire)';
    }
    else if (this.numClient != 0 && this.numProduit != 0 && this.numIntermediaire != 0) {
      this.onGetAllPoliceConsultationByAllCriteres(this.numClient, this.numProduit, this.numIntermediaire);
      this.title = 'La liste des polices (par client, produit et intermédiaire)';
    }
    else {
      this.onGetAllPoliceConsultation();
      this.title = 'La liste des polices (par ordre de numéro)';
    }

    this.check = true;
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

    let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    const form = new FormData();
    form.append('title', titleNew);
    form.append('demandeur', demandeurNew);
    form.append("numClient", this.numClient.toString());
    form.append('numProduit', this.numProduit.toString());
    form.append('numIntermediaire', this.numIntermediaire.toString());

    if (format === 'pdf') {
      this.policeService.generateReportPolice(format, form)
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
              saveAs(event.body, 'liste des polices.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.policeService.generateReportPolice(format, form)
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
              saveAs(event.body, 'liste des polices.xlsx');
          }
        });
    }
  }

  onExportPorteFeuillePolice(format: String) {

    console.log("=================== Porte feuille police")

    let titleNew = this.titlePorteFeuille.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    const form = new FormData();
    form.append('title', titleNew);
    form.append('demandeur', demandeurNew);
    // form.append("numClient", this.numClient.toString());
    // form.append('numProduit', this.numProduit.toString());
    // form.append('numIntermediaire', this.numIntermediaire.toString());

    if (format === 'pdf') {
      this.policeService.generateReportAllPorteFeuillePolice(format, form)
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
              saveAs(event.body, 'liste porte feuille polices.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.policeService.generateReportAllPorteFeuillePolice(format, form)
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
              saveAs(event.body, 'liste porte feuille polices.xlsx');
          }
        });
    }
  }

  // onOpenEncaissementsAnnules() {

  //   this.router.navigateByUrl('/home/gestion-production/consultation/consultation-encaissement/encaissement-annule');
  // }

  onReinitialiser() {

    // this.addForm.controls['date_debut'].setValue("");
    // this.addForm.controls['date_fin'].setValue("");
    this.clientsCtrl.setValue("");
    this.produitCtrl.setValue("");
    this.intermediaireCtrl.setValue("");

    this.numClient = 0;
    this.numProduit = 0;
    this.numIntermediaire = 0;

    this.erreur = false;
  }

  // Les 3 méthodes suivantes permettent de réinitialser la variable check à false
  onClickClient() {
    this.check = false;
  }

  onClickProduit() {
    this.check = false;
  }

  onClickIntermediaire() {
    this.check = false;
  }

  onGetPrimeNetteRef(montant: any) {
    if(montant != null && montant != ''){
      return montant ;
    } else{
      return '' ;
    }
  }

}
