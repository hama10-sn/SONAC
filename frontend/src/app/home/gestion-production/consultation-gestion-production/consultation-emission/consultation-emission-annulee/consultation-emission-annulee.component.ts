import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { Produit } from '../../../../../model/Produit';
import { User } from '../../../../../model/User';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { ProduitService } from '../../../../../services/produit.service';
import { QuittanceService } from '../../../../../services/quittance.service';
import { UserService } from '../../../../../services/user.service';
import dateFormatter from 'date-format-conversion';
import { Quittance } from '../../../../../model/Quittance';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ClientService } from '../../../../../services/client.service';
import { CodeAnnulationService } from '../../../../../services/codeannulation.service';
import { CodeAnnulationFact } from '../../../../../model/CodeAnnulationFact';

@Component({
  selector: 'ngx-consultation-emission-annulee',
  templateUrl: './consultation-emission-annulee.component.html',
  styleUrls: ['./consultation-emission-annulee.component.scss']
})
export class ConsultationEmissionAnnuleeComponent implements OnInit {

  addForm = this.fb.group({

    // encai_numeroencaissement: [''],
    date_debut: [''],
    date_fin: [''],
  });

  autorisation = [];

  // =============== PARTIE CONSULTATION DE LA LISTE DES EMISSIONS A EDITER ================
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['quit_numero', 'quit_facture', 'quit_numeropolice', 'quit_typologieannulation', 'inter_denomination', /*'quit_typequittance', 'quit_typeecriture',*/ 'quit_dateemission', /*'quit_datecomotable', 'quit_dateeffet', 'quit_dateecheance',*/ 'quit_primenette',/* 'quit_commissionsapporteur1', 'quit_accessoirecompagnie', 'quit_accessoireapporteur', 'quit_tauxte', 'quit_mtntaxete',*/ 'quit_primettc', 'quit_mntprimencaisse', 'details'];
  public displayedColumns2 = ['quit_numero', 'quit_facture', 'quit_numeropolice', 'quit_typologieannulation', /*'inter_denomination',*/ /*'quit_typequittance', 'quit_typeecriture',*/ 'quit_dateemission', /*'quit_datecomotable', 'quit_dateeffet', 'quit_dateecheance',*/ 'quit_primenette',/* 'quit_commissionsapporteur1', 'quit_accessoirecompagnie', 'quit_accessoireapporteur', 'quit_tauxte', 'quit_mtntaxete',*/ 'quit_primettc', 'quit_mntprimencaisse', 'details'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // =============== FIN PARTIE CONSULTATION DE LA LISTE DES ENCAISSEMENTS A EDITER =============

  // clientss: Array<Client> = new Array<Client>();
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();
  produits: Array<Produit> = new Array<Produit>();

  // public clientsCtrl: FormControl = new FormControl();
  public intermediaireCtrl: FormControl = new FormControl();
  public produitCtrl: FormControl = new FormControl();

  // public clientsFilterCtrl: FormControl = new FormControl();
  public intermediaireFilterCtrl: FormControl = new FormControl();
  public produitFilterCtrl: FormControl = new FormControl();


  // public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();
  public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  title = 'La liste des émissions annulées(par ordre de numéro)';
  login_demandeur: string;
  demandeur: string;
  user: User;
  numClient: number;
  numIntermediaire: number = 0;
  numProduit: number = 0;
  date_debut: any = '0';
  date_fin: any = '0';

  problemeDate: boolean = false;
  problemeDateFin: boolean = false;
  erreur: boolean = false;

  afficherIntermediaire: boolean = true;
  nonAfficherIntermediaire: boolean = false;

  codeAnnulations: Array<CodeAnnulationFact> = new Array<CodeAnnulationFact>();

  check: boolean = false ;

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private router: Router,
    private dialogService: NbDialogService,
    private quittanceService: QuittanceService,
    private intermediaireService: IntermediaireService,
    private produitService: ProduitService,
    private clientService: ClientService,
    private codeAnnulationService: CodeAnnulationService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.onGetAllEmissionCAnnuleesConsultation();
    this.onGetAllItermediaires();
    this.onGetAllProduits();
    this.onGetAllCodeAnnulations() ;
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);

          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }

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

  // cancel() {
  //   this.router.navigateByUrl('/home/gestion-encaissement');
  // }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
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

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
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

  onGetAllEmissionCAnnuleesConsultation() {
    this.quittanceService.getAllEmissionsAnnuleesConsulation()
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEmissionsAnnuleesByPeriode(dateDebut: string, dateFin: string) {
    this.quittanceService.getAllEmissionsAnnuleesConsultationByPeriode(dateDebut, dateFin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEmissionsAnnuleesByProduit(numProd: number) {
    this.quittanceService.getAllEmissionsAnnuleesConsultationByProduit(numProd)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEmissionsAnnuleesByIntermediaire(numInterm: number) {
    this.quittanceService.getAllEmissionsAnnuleesConsultationByIntermediaire(numInterm)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEmissionsAnnuleesByPeriodeAndProduit(numProd: number, date_debut: string, date_fin: string) {
    this.quittanceService.getAllEmissionsAnnuleesConsultationByPeriodeAndProduit(numProd, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEmissionsAnnuleesByPeriodeAndIntermediaire(numInterm: number, date_debut: string, date_fin: string) {
    this.quittanceService.getAllEmissionsAnnuleesConsultationByPeriodeAndIntermediaire(numInterm, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEmissionsAnnuleesByProduitAndIntermediaire(numInterm: number, numProd: number) {
    this.quittanceService.getAllEmissionsAnnuleesConsultationByProduitAndIntermediaire(numInterm, numProd)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllEmissionsAnnuleesByCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {
    this.quittanceService.getAllEmissionsAnnuleesConsultationByAllCriteres(numInterm, numProd, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllCodeAnnulations(){
    this.codeAnnulationService.getAllCodeAnnulation()
      .subscribe((data: CodeAnnulationFact[]) => {
          this.codeAnnulations = data;
          console.log("Code annulations: ") ;
          console.log(this.codeAnnulations) ;
      });
  }

  onGetLibelleByCodeAnnulation(numero:number){
    return numero + " : " +  (this.codeAnnulations.find(c => c.id === numero))?.libelle ;       
  }

  // onGetProduitByPolice(numPolice: any) {
  //   this.produitService.getProduitByPolice(numPolice)
  //     .subscribe((data: any) => {
  //       this.police = data ;
  //     });
  // }

  onChangeProduit(event) {
    // console.log("Produit: " + typeof(Number(event.value)));
    this.numProduit = Number(event.value);
  }

  onChangeItermediaire(event) {
    // console.log("Intermdiaire: " + Number(event.value));
    this.numIntermediaire = Number(event.value);
  }

  // onFocusOutEventDateDebut(event: any) {
  //   this.date_debut = this.addForm.get("date_debut").value
  //   console.log("Debut: "+ this.date_debut) ;
  //   console.log(typeof(this.date_debut)) ;
  // }

  // onFocusOutEventDateFin(event: any) {
  //   var date_finRecuperer = new Date(this.addForm.get("date_fin").value) ;
  //   date_finRecuperer.setDate(date_finRecuperer.getDate() + 1) ;

  //   this.date_fin = dateFormatter(date_finRecuperer, 'yyyy-MM-dd') ;

  //   console.log("Fin: "+ this.date_fin) ;
  //   console.log("Type Fin: "+ typeof(this.date_fin)) ;
  // }

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
      this.onGetAllEmissionsAnnuleesByPeriode(this.date_debut, this.date_fin);
      this.title = 'La liste des émissions annulées (par période)';
      this.afficherIntermediaire = true;
      this.nonAfficherIntermediaire = false;
    }
    else if (this.numProduit != 0 && this.numIntermediaire == 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllEmissionsAnnuleesByProduit(this.numProduit);
      this.title = 'La liste des émissions annulées (par produit)';
      this.afficherIntermediaire = true;
      this.nonAfficherIntermediaire = false;

    } else if (this.numProduit == 0 && this.numIntermediaire != 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllEmissionsAnnuleesByIntermediaire(this.numIntermediaire);
      this.title = 'La liste des émissions annulées (par intermédiaire)';
      this.afficherIntermediaire = false;
      this.nonAfficherIntermediaire = true;

    } else if ((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.numProduit != 0 && this.numIntermediaire == 0) {
      this.onGetAllEmissionsAnnuleesByPeriodeAndProduit(this.numProduit, this.date_debut, this.date_fin);
      this.title = 'La liste des émissions annulées (par période et produit)';
      this.afficherIntermediaire = true;
      this.nonAfficherIntermediaire = false;

    } else if ((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.numProduit == 0 && this.numIntermediaire != 0) {
      this.onGetAllEmissionsAnnuleesByPeriodeAndIntermediaire(this.numIntermediaire, this.date_debut, this.date_fin);
      this.title = 'La liste des émissions annulées (par période et intermédiaire)';
      this.afficherIntermediaire = false;
      this.nonAfficherIntermediaire = true;

    } else if (this.numProduit != 0 && this.numIntermediaire != 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllEmissionsAnnuleesByProduitAndIntermediaire(this.numIntermediaire, this.numProduit);
      this.title = 'La liste des émissions annulées (par produit et intermédiaire)';
      this.afficherIntermediaire = false;
      this.nonAfficherIntermediaire = true;

    } else if (this.numProduit != 0 && this.numIntermediaire != 0 && (this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '')) {
      this.onGetAllEmissionsAnnuleesByCriteres(this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin);
      this.title = 'La liste des émissions annulées(par période, produit et intermédiaire)';
      this.afficherIntermediaire = false;
      this.nonAfficherIntermediaire = true;

    } else {
      this.onGetAllEmissionCAnnuleesConsultation();
      this.title = 'La liste des émissions annulées(par ordre de numéro)';
      this.afficherIntermediaire = true;
      this.nonAfficherIntermediaire = false;
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
      this.quittanceService.generateReportEmissionsAnnulees(format, titleNew, demandeurNew, this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin)
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
              saveAs(event.body, 'liste des emissions annulees.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.quittanceService.generateReportEmissionsAnnulees(format, this.title, this.demandeur, this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin)
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
              saveAs(event.body, 'liste des emissions annulees.xlsx');
          }
        });
    }
  }

  onOpen(dialog: TemplateRef<any>, quittance: any) {

    this.produitService.getProduitByPolice(quittance.quit_numeropolice)
      .subscribe((data: any) => {
        quittance.p=data;
      });

      this.clientService.getClientByPolice(quittance.quit_numeropolice)
      .subscribe((data: any) => {
        quittance.cl=data;
      });

    this.dialogService.open(
      dialog,
      {
        context: quittance
      });
  }

  onCancel() {
    this.router.navigateByUrl('/home/gestion-production/consultation/consultation-emission');
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
