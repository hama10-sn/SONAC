import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { HttpEventType } from '@angular/common/http';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Encaissement } from '../../../../model/Encaissement';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Produit } from '../../../../model/Produit';
import { User } from '../../../../model/User';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { ProduitService } from '../../../../services/produit.service';
import { UserService } from '../../../../services/user.service';
import { saveAs } from 'file-saver';
import { QuittanceService } from '../../../../services/quittance.service';
import { Quittance } from '../../../../model/Quittance';
import dateFormatter from 'date-format-conversion';

@Component({
  selector: 'ngx-consultation-production',
  templateUrl: './consultation-production.component.html',
  styleUrls: ['./consultation-production.component.scss']
})
export class ConsultationProductionComponent implements OnInit {

  addForm = this.fb.group({

    // encai_numeroencaissement: [''],
    date_debut: [''],
    date_fin: [''],
  });

  autorisation = [];

  encaissements: Array<Encaissement> = new Array<Encaissement>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['quit_numero', 'quit_facture', 'quit_numeropolice', 'inter_denomination', 'quit_typequittance', 'quit_typeecriture', 'quit_dateemission', /*'quit_datecomotable', 'quit_dateeffet', 'quit_dateecheance',*/ 'quit_primenette',/* 'quit_commissionsapporteur1', 'quit_accessoirecompagnie', 'quit_accessoireapporteur', 'quit_tauxte', 'quit_mtntaxete',*/ 'quit_primettc',  'quit_mntprimencaisse', 'details'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();
  produits: Array<Produit> = new Array<Produit>();

  public intermediaireCtrl: FormControl = new FormControl();
  public produitCtrl: FormControl = new FormControl();

  public intermediaireFilterCtrl: FormControl = new FormControl();
  public produitFilterCtrl: FormControl = new FormControl();

  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();
  public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  title = 'La liste des productions (par ordre de numéro)';
  login_demandeur: string;
  demandeur: string;
  user: User;
  numClient: number;
  numIntermediaire: number = 0;
  numProduit: number = 0;
  date_debut: any = '0' ;
  date_fin: any = '0' ;

  problemeDate: boolean = false ;
  problemeDateFin: boolean = false;
  erreur: boolean = false ;

  check: boolean = false ;

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private router: Router,
    private dialogService: NbDialogService,
    private quittanceService: QuittanceService,
    private intermediaireService: IntermediaireService,
    private produitService: ProduitService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.onGetAllProductionsConsultation() ;
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

  onGetAllProductionsConsultation() {
    this.quittanceService.getAllProductionsConsulation()
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProductionsByPeriode(dateDebut: string, dateFin: string) {
    this.quittanceService.getAllProductionsConsulationByPeriode(dateDebut, dateFin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProductionsByProduit(numProd: number) {
    this.quittanceService.getAllProductionsConsulationByProduit(numProd)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProductionsByIntermediaire(numInterm: number) {
    this.quittanceService.getAllProductionsConsulationByIntermediaire(numInterm)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProductionsByPeriodeAndProduit(numProd: number, date_debut: string, date_fin: string) {
    this.quittanceService.getAllProductionsConsulationByPeriodeAndProduit(numProd, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProductionsByPeriodeAndIntermediaire(numInterm: number, date_debut: string, date_fin: string) {
    this.quittanceService.getAllProductionsConsulationByPeriodeAndIntermediaire(numInterm, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProductionsByProduitAndIntermediaire(numInterm: number, numProd: number) {
    this.quittanceService.getAllProductionsConsulationByProduitAndIntermediaire(numInterm, numProd)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onGetAllProductionsByCriteres(numInterm: number, numProd: number, date_debut: string, date_fin: string) {
    this.quittanceService.getAllProductionsConsulationByAllCriteres(numInterm, numProd, date_debut, date_fin)
      .subscribe((data: any) => {
        this.dataSource.data = data;
      });
  }

  onChangeProduit(event) {
    // console.log("Produit: " + typeof(Number(event.value)));
    this.numProduit = Number(event.value);
  }

  onChangeItermediaire(event) {
    // console.log("Intermdiaire: " + Number(event.value));
    this.numIntermediaire = Number(event.value);
  }

  // onFocusOutEventDate(event: any) {
  //   this.date_debut = this.addForm.get("date_debut").value ;
  //   this.date_fin = this.addForm.get("date_fin").value ;
  //   if ((this.date_debut != null && this.date_debut != '') && (this.date_fin != null && this.date_fin != '')) {
  //     if (this.date_debut > this.date_fin) {
  //       this.problemeDate = true;
  //       this.erreur = true;
  //     } else {
  //       this.problemeDate = false;
  //       this.erreur = false;

  //       var date_finRecuperer = new Date(this.date_fin) ;
  //       date_finRecuperer.setDate(date_finRecuperer.getDate() + 1) ;
  //       this.date_fin = dateFormatter(date_finRecuperer, 'yyyy-MM-dd') ;
  //     }
  //   }
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

    if((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.numProduit == 0 && this.numIntermediaire == 0) {
      this.onGetAllProductionsByPeriode(this.date_debut, this.date_fin) ;
      this.title = 'La liste des productions (par période)';
    } else if (this.numProduit != 0 && this.numIntermediaire == 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllProductionsByProduit(this.numProduit);
      this.title = 'La liste des productions (par produit)';

    } else if (this.numProduit == 0 && this.numIntermediaire != 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllProductionsByIntermediaire(this.numIntermediaire);
      this.title = 'La liste des productions (par intermédiaire)';

    } else if ((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.numProduit != 0 && this.numIntermediaire == 0) {
      this.onGetAllProductionsByPeriodeAndProduit(this.numProduit, this.date_debut, this.date_fin) ;
      this.title = 'La liste des productions (par période et produit)' ;
      // console.log("Période et produit !!!") ;

    } else if ((this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '') && this.numProduit == 0 && this.numIntermediaire != 0) {
      this.onGetAllProductionsByPeriodeAndIntermediaire(this.numIntermediaire, this.date_debut, this.date_fin) ;
      this.title = 'La liste des productions (par période et intermédiaire)' ;
      // console.log("Période et intermédiaire !!!") ;

    } else if (this.numProduit != 0 && this.numIntermediaire != 0 && (this.date_debut == '0' || this.date_debut === '') && (this.date_fin == '0' || this.date_fin === '')) {
      this.onGetAllProductionsByProduitAndIntermediaire(this.numIntermediaire, this.numProduit) ;
      this.title = 'La liste des productions (par produit et intermédiaire)' ;
      // console.log("produit et intermédiaire !!!") ;

    } else if (this.numProduit != 0 && this.numIntermediaire != 0 && (this.date_debut != '0' && this.date_debut !== '') && (this.date_fin != '0' && this.date_fin !== '')) {
      this.onGetAllProductionsByCriteres(this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin);
      this.title = 'La liste des productions (par période, produit et intermédiaire)';

    } else {
      this.onGetAllProductionsConsultation() ;
      this.title = 'La liste des productions (par ordre de numéro)';
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
      this.quittanceService.generateReportProductions(format, titleNew, demandeurNew, this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin)
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
              saveAs(event.body, 'liste des productions.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.quittanceService.generateReportProductions(format, this.title, this.demandeur, this.numIntermediaire, this.numProduit, this.date_debut, this.date_fin)
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
              saveAs(event.body, 'liste des productions.xlsx');
          }
        });
    }
  }

  onOpen(dialog: TemplateRef<any>, quittance: Quittance) {
      
    this.dialogService.open(
      dialog,
      { context: quittance,
       });
  }

  // onOpenProductionsAnnulees() {

  //   this.router.navigateByUrl('/home/gestion-production/consultation/consultation-production/production-annulee'); 
  // }

  onOpenProductionsAnnulees() {

    this.router.navigateByUrl('/home/gestion-production/consultation/consultation-encaissement/encaissement-annule'); 
  }

  onReinitialiser() {
    
    this.addForm.controls['date_debut'].setValue("");
    this.addForm.controls['date_fin'].setValue("");
    this.produitCtrl.setValue("") ;
    this.intermediaireCtrl.setValue("") ;

    this.date_debut = '0' ;
    this.date_fin = '0' ;
    this.numProduit = 0 ;
    this.numIntermediaire = 0 ;
    
    this.problemeDate = false ;
    this.problemeDateFin = false ;
    this.erreur = false ;
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
