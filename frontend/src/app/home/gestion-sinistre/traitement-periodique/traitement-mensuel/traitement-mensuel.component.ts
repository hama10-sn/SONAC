import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Branche } from '../../../../model/Branche';
import { Produit } from '../../../../model/Produit';
import { Sinistre } from '../../../../model/Sinistre';
import { User } from '../../../../model/User';
import { BrancheService } from '../../../../services/branche.service';
import { ClientService } from '../../../../services/client.service';
import { ProduitService } from '../../../../services/produit.service';
import { sinistreService } from '../../../../services/sinistre.service';
import { UserService } from '../../../../services/user.service';
import dateFormatter from 'date-format-conversion';
import { Client } from '../../../../model/Client';
import { Police } from '../../../../model/Police';
import { PoliceService } from '../../../../services/police.service';
import { Acheteur } from '../../../../model/Acheteur';
import { AcheteurService } from '../../../../services/acheteur.service';
import { Categorie } from '../../../../model/Categorie';
import { Risque } from '../../../../model/Risque';
import { CategorieService } from '../../../../services/categorie.service';
import { RisqueService } from '../../../../services/risque.service';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-traitement-mensuel',
  templateUrl: './traitement-mensuel.component.html',
  styleUrls: ['./traitement-mensuel.component.scss']
})
export class TraitementMensuelComponent implements OnInit {
  title = 'La liste des annulations (par ordre de numéro)';
  check: boolean = false ;
  numBranche: number = 0;
  numProduit: number = 0;
  numClient: number = 0;
  numPolice: number = 0;
  autorisation = [];
  login_demandeur: string;
  demandeur: string;
  debut: string = '0';
  fin: string = '0';
  user: User;
  client: Client;
  problemeDate: boolean = false;
  problemeDateFin: boolean = false;
  erreur: boolean = false;

  addForm = this.fb.group({
    debut: [''],
    fin: [''],
  });

  public displayedColumns = ['sin_client', 'sin_police', 'sin_branche', 'sin_acheteur', 'sin_produits', 'sin_num', 'mvts_status', 'mvts_dateannulation', 'mvts_motifannulation', 'action'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  branches: Array<Branche> = new Array<Branche>();
  produits: Array<Produit> = new Array<Produit>();
  clients: Array<Client> = new Array<Client>();
  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  police: Array<Police> = new Array<Police>();
  sinistres: Array<Sinistre> = new Array<Sinistre>();
  categories: Array<Categorie> = new Array<Categorie>();
  risques: Array<Risque> = new Array<Risque>();

  public brancheCtrl: FormControl = new FormControl();
  public produitCtr: FormControl = new FormControl();
  public clientCtr: FormControl = new FormControl();
  public policeCtr: FormControl = new FormControl();

  public brancheFilterCtrl: FormControl = new FormControl();
  public produitFilterCtrl: FormControl = new FormControl();
  public clientFilterCtrl: FormControl = new FormControl();
  public policetFilterCtrl: FormControl = new FormControl();

  public filteredBranche: ReplaySubject<Branche[]> = new ReplaySubject<Branche[]>();
  public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();
  public filteredClient: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredPolice: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
  public filteredSinistre: ReplaySubject<Sinistre[]> = new ReplaySubject<Sinistre[]>();

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private router: Router,
    private dialogService: NbDialogService,
    private clientService: ClientService,
    private acheteurService: AcheteurService,
    private policeService: PoliceService,
    private sinistreService: sinistreService,
    private brancheService: BrancheService,
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private risqueService: RisqueService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.onGetAllBranche();
    this.onGetAllProduit();
    this.onGetAllClient();
    this.onGetAllPolice();
    this.onGetAllAcheteur();
    this.onGetAllCategorie();
    this.onGetAllRisque();
    this.onGetAllAnnulation();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });

      this.brancheFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererBranches();
      });

      this.produitFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererProduits();
      });

      this.clientFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererClients();
      });

      this.policetFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererPolices();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onClickBranche() {
    this.check = false;
  }

  onClickProduit() {
    this.check = false;
  }

  onClickPeriode() {
    this.check = false;
  }

  onClickClient() {
    this.check = false;
  }

  onClickPolice() {
    this.check = false;
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  protected filtererBranches() {
    if (!this.branches) {
      return;
    }
    // get the search keyword
    let search = this.brancheFilterCtrl.value;
    if (!search) {
      this.filteredBranche.next(this.branches.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBranche.next(
      this.branches.filter(c => c.branche_libellecourt.toLowerCase().indexOf(search) > -1 ||
        c.branche_numero.toString().toLowerCase().indexOf(search) > -1)
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
      this.produits.filter(c => c.prod_denominationcourt.toLowerCase().indexOf(search) > -1 ||
        c.prod_numero.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  protected filtererClients() {
    if (!this.clients) {
      return;
    }
    // get the search keyword
    let search = this.clientFilterCtrl.value;
    if (!search) {
      this.filteredClient.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClient.next(
      this.clients.filter(c => c.clien_denomination.toLowerCase().indexOf(search) > -1 ||
        c.clien_numero.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  protected filtererPolices() {
    if (!this.police) {
      return;
    }
    // get the search keyword
    let search = this.policetFilterCtrl.value;
    if (!search) {
      this.filteredPolice.next(this.police.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPolice.next(
      this.police.filter(c => c.poli_filiale.toLowerCase().indexOf(search) > -1 ||
        c.poli_numero.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  onChangeBranche(event) {
    this.numBranche = Number(event.value);
  }

  onChangeProduit(event) {
    this.numProduit = Number(event.value);
  }

  onChangeClient(event) {
    this.numClient = Number(event.value);
  }

  onChangePolice(event) {
    this.numPolice = Number(event.value);
  }

  onGetAllBranche() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branches = data as Branche[];
        this.filteredBranche.next(this.branches.slice());
      });
  }

  onGetAllProduit() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.produits = data as Produit[];
        this.filteredProduit.next(this.produits.slice());
      });
  }

  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clients = data as Client[];
        this.filteredClient.next(this.clients.slice());
      });
  }

  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.police = data as Police[];
        this.filteredPolice.next(this.police.slice());
      });
  }

  onGetAllAcheteur() {
    this.acheteurService.getAllAcheteurs()
      .subscribe((data: Acheteur[]) => {
        this.acheteurs = data as Acheteur[];
      });
  }

  onGetAllCategorie() {
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
        this.categories = data as Categorie[];
      });
  }

  onGetAllRisque() {
    this.risqueService.getAllRisques()
      .subscribe((data: Risque[]) => {
        this.risques = data as Risque[];
      });
  }

  onGetAllAnnulation() {
    this.sinistreService.getAllAnnulation()
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      });
  }

  onGetAllAnnulationByPeriode(debut: string, fin: string) {
    this.sinistreService.getAnnulationByPeriode(debut, fin)
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      });
  }

  onGetAllAnnulationByProduit(numProduit: number) {
    this.sinistreService.getAnnulationByProduit(numProduit)
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      });
  }

  onGetAllAnnulationByBranche(numBranche: number) {
    this.sinistreService.getAnnulationByBranche(numBranche)
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      });
  }

  onGetAllAnnulationByPeriodeAndProduit(debut: string, fin: string, numProduit: number) {
    this.sinistreService.getAnnulationByPeriodeAndProduit(debut, fin, numProduit)
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      });
  }

  onGetAllAnnulationByPeriodeAndProduitAndBranche(debut: string, fin: string, numProduit: number, numBranche: number) {
    this.sinistreService.getAnnulationByPeriodeAndProduitAndBranche(debut, fin, numProduit, numBranche)
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      });
  }

  onConsulter() {
    if((this.debut != '0' && this.debut !== '') && (this.fin != '0' && this.fin !== '') && this.numProduit == 0 && this.numBranche == 0) {
      this.onGetAllAnnulationByPeriode(this.debut, this.fin);
      this.title = 'La liste des annulations (par période)';
    } else if((this.debut == '0' && this.fin == '0') && this.numProduit != 0 && this.numBranche == 0) {
      this.onGetAllAnnulationByProduit(this.numProduit);
      this.title = 'La liste des annulations (par produit)' ;
    } else if((this.debut == '0' && this.fin == '0') && this.numProduit == 0 && this.numBranche != 0) {
      this.onGetAllAnnulationByBranche(this.numBranche);
      this.title = 'La liste des annulations (par branche)' ;
    } else if((this.debut != '0' && this.debut !== '') && (this.fin != '0' && this.fin !== '') && this.numProduit != 0 && this.numBranche == 0) {
      this.onGetAllAnnulationByPeriodeAndProduit(this.debut, this.fin, this.numProduit);
      this.title = 'La liste des annulations (par période et produit)' ;
    } else if((this.debut != '0' && this.debut !== '') && (this.fin != '0' && this.fin !== '') && this.numProduit != 0 && this.numBranche != 0) {
      this.onGetAllAnnulationByPeriodeAndProduitAndBranche(this.debut, this.fin, this.numProduit, this.numBranche);
      this.title = 'La liste des annulations (par période et produit et branche)' ;
    } else {
      this.onGetAllAnnulation();
      this.title = 'La liste des annulations (par ordre de numéro)' ;
    }
    this.check = true ;
  }

  onOpen(dialog: TemplateRef<any>, sinistre: Sinistre) {
    this.dialogService.open(
      dialog,
      {
        context: sinistre,
      });
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

  onFocusOutEventDate(event: any) {
    this.debut = this.addForm.get("debut").value;
    this.fin = this.addForm.get("fin").value;
    if ((this.debut != null && this.debut != '') && (this.fin != null && this.fin != '')) {
      if (this.debut > this.fin) {
        this.problemeDate = true;
        this.erreur = true;
      } else {
        this.problemeDate = false;
        if (dateFormatter(new Date(), 'yyyy-MM-dd') < this.fin) {
          this.problemeDateFin = true;
          this.erreur = true;
        } else {
          this.problemeDateFin = false;
          this.erreur = false;
          var date_finRecuperer = new Date(this.fin);
          date_finRecuperer.setDate(date_finRecuperer.getDate() + 1);
          this.fin = dateFormatter(date_finRecuperer, 'yyyy-MM-dd');
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

  onReinitialiser() {
    this.brancheCtrl.setValue("") ;
    this.produitCtr.setValue("");
    this.clientCtr.setValue("");
    this.policeCtr.setValue("");

    this.numBranche = 0 ;
    this.numProduit = 0;
    this.numClient = 0;
    this.numPolice = 0;

    this.problemeDate = false ;
    this.problemeDateFin = false ;
    this.erreur = false ;
  }

  onGetClientByCode(numero: any) {
    return numero + " : " + ((this.clients.find(c => c.client_id == numero))?.clien_prenom ? (this.clients.find(c => c.client_id == numero))?.clien_prenom : "") + " " + ((this.clients.find(c => c.client_id == numero))?.clien_nom ? (this.clients.find(c => c.client_id == numero))?.clien_nom : "") + " " + ((this.clients.find(c => c.client_id == numero))?.clien_denomination ? (this.clients.find(c => c.client_id == numero))?.clien_denomination : "");
  }

  onGetAcheteurByCode(numero: any) {
    if(numero !== null && numero !== '') {
      return numero + " : " + (this.acheteurs.find(a => a.achet_id == numero))?.achet_prenom + " " + (this.acheteurs.find(a => a.achet_id == numero))?.achet_nom;
    } else {
      return '';
    }
  }

  onGetLibelleByStatus(num: any) {
    if (num == 1) {
      return 'Menace sinistre';
    } else if (num == 2) {
      return 'Déclaration sinistre';
    } else if (num == 3) {
      return 'Modification évaluation';
    } else if (num == 4) {
      return 'Modification SAP';
    } else if (num == 5) {
      return 'Proposition règlement';
    } else if (num == 6) {
      return 'Règlement validé';
    } else if (num == 7) {
      return 'Annulation proposition règlement';
    } else if (num == 8) {
      return 'Annulation règlement validé';
    } else if (num == 9) {
      return 'Proposition recours';
    } else if (num == 10) {
      return 'Recours à encaisser validé';
    } else if (num == 11) {
      return 'Annulation proposition recours';
    } else if (num == 12) {
      return 'Annulation recours validé';
    } else if (num == 13) {
      return 'Recours encaissé';
    } else if (num == 14) {
      return 'Annulation recours encaissé';
    } else if (num == 15) {
      return 'Sinistre clôturé';
    } else if (num == 16) {
      return 'Réouverture sinistre';
    } else {
      return '';
    }
  }

  onExport(format: String) {
    let title = this.title.replace(/ /g, "_");
    let demandeur = this.demandeur.replace(/ /g, "_");

    if (format === 'pdf') {
      this.sinistreService.generateReportAnnulation(format, title, demandeur, this.debut, this.fin)
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
              saveAs(event.body, 'liste des sinistres.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.sinistreService.generateReportAnnulation(format, title, demandeur, this.debut, this.fin)
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
              saveAs(event.body, 'liste des sinistres.xlsx');
          }
        });
    }

  }

  cancel() {
    this.router.navigateByUrl('/home/gestion-sinistre');
  }
}
