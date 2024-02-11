import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acte } from '../../../../model/Acte';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Client } from '../../../../model/Client';
import { Facture } from '../../../../model/Facture';
import { Police } from '../../../../model/Police';
import { Produit } from '../../../../model/Produit';
import { Risque } from '../../../../model/Risque';
import { Tarif } from '../../../../model/Tarif';
import { User } from '../../../../model/User';
import { ActeService } from '../../../../services/acte.service';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { ClientService } from '../../../../services/client.service';
import { FactureService } from '../../../../services/facture.service';
import { PoliceService } from '../../../../services/police.service';
import { ProduitService } from '../../../../services/produit.service';
import { RisqueService } from '../../../../services/risque.service';
import { UserService } from '../../../../services/user.service';
import types from '../../../data/types.json';
import dateFormatter from 'date-format-conversion';
import { OtherAcheteurComponent } from '../../gestion-factures/other-acheteur/other-acheteur.component';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { AcheteurService } from '../../../../services/acheteur.service';
import { Acheteur } from '../../../../model/Acheteur';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { sinistreService } from '../../../../services/sinistre.service';
import { Sinistre } from '../../../../model/Sinistre';

@Component({
  selector: 'ngx-other-update',
  templateUrl: './other-update.component.html',
  styleUrls: ['./other-update.component.scss']
})
export class OtherUpdateComponent implements OnInit {
  clientss: Array<Client> = new Array<Client>();
  factures: Array<Facture> = new Array<Facture>();
  polices: Array<Police> = new Array<Police>();
  branches: Array<Branche> = new Array<Branche>();
  categoriess: Array<Categorie> = new Array<Categorie>();
  produitss: Array<Produit> = new Array<Produit>();
  risque: Risque;
  acte: Acte;

  tarif: Tarif;

  traitement: number = 1;
  typeca: String;
  acheteur: string = 'prive';
  typeRisque: string = 'RC';

  brancheSelected: any;
  produitSelected: any;
  categorieSelected: any;

  selectedTypeContrat: any;
  selectedTypeGestion: any;
  selectedTypeRevision: any;
  selectedTypeFractionnement: any;

  police: Police;
  branch: any;

  numcli: any;
  numpol: any;
  numFact: any;
  numQuit: any;

  typeModif: number = 0;

  renouvelPolice: boolean = false;

  autorisation = [];

  errorDateExo: boolean;
  errorDateSub: boolean;

  showTauxPreferentielle: boolean = false;
  afficheTauxPref: boolean = false;
  afficheMesssageTauxPref: boolean = false
  tauxPreferentiel: any = 0;

  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  sinistres: Array<Sinistre> = new Array<Sinistre>();

  public displayedColumns = ['achet_numero', 'achet_numeroclient', 'achet_numeroaffaire',
    'achet_type', 'details'/*, 'update', 'delete'*/];
  public dataSource = new MatTableDataSource<Acheteur>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  addForm = this.fb.group({

    numerofacture: ['', [Validators.required]],
    numeropolice: ['', [Validators.required]],
    numeroclient: ['', [Validators.required]],
    //numeroquittance :  ['', [Validators.required]],
    typeAvenant: ['', [Validators.required]],


  });


  policeForm = this.fb.group({
    //police
    poli_num: [''],
    poli_numero: [''],
    poli_codeproduit: ['', [Validators.required]],
    poli_intermediaire: ['', [Validators.required]],
    poli_compagnie: ['', [Validators.required]],
    poli_codepays: ['', [Validators.required]],
    poli_codegroupe: [''],
    poli_filiale: [''],
    poli_branche: ['', [Validators.required]],
    poli_categorie: ['', [Validators.required]],

    //(1' souscripteur, '2' assuré, '3' souscripteur & assuré, '4' autres)
    poli_souscripteur: ['', [Validators.required]],
    poli_client: ['', [Validators.required]],
    poli_dateeffet1: [''],
    poli_dateanniversaire: [''],
    poli_dateeffetencours: ['', [Validators.required]],
    poli_dateecheance: ['', [Validators.required]],
    poli_duree: ['', [Validators.required]], //(durée en mois)
    poli_daterevision: [''],
    poli_typecontrat: ['', [Validators.required]],
    poli_typerevision: [''],
    poli_typegestion: ['', [Validators.required]],
    poli_codefractionnement: ['', [Validators.required]],
    poli_primenetreference: [''],
    poli_primenettotal: ['', [Validators.required]],
    poli_primebruttotal: ['', [Validators.required]],
    poli_coefbonus: [''],
    poli_remisecommerciale: [''],
    poli_numeroattestation: [''],
    poli_numerocertificat: [''],
    poli_policeremplacee: [''], // oblig pour la reprisse des données
    poli_typefacultive: [''],
    poli_numeroplancoassur: [''],
    poli_numeroplanreassfac: [''],
    poli_numerodernieravenant: ['', [Validators.required]],
    poli_datesuspension: [''],
    poli_dateremisevigueur: [''],
    poli_dateresiliation: [''],
    poli_status: [''], // actif ou non actif
    poli_indice: [''],
    poli_typeindice: [''],
    poli_dateindice: [''], // (à revoir est-ce numérique ou Date)
    poli_valeurindice: [''],
    poli_clauseajustement: [''],
    poli_clauserevision: [''],
    poli_exonerationtaxeenr: [''], //(oui ou non)
    poli_codetaxe: [''],
    poli_exonerationtva: [''], //(oui ou non)
    poli_codetva: [''],
    poli_exonerationtps: [''], // (oui ou non)
    poli_codetps: [''],
    poli_datexoneration: [''],
    poli_formulegarantie: [''],
    poli_participationbenef: [''], // (Oui/Non)
    poli_tauxparticipationbenef: [''],
    poli_codecutilisateur: [''], // obligatoire on l'ajout au moment du submit
    poli_datemodification: [''],

  });

  myForm = this.fb.group({
    quittance: this.fb.group({
      quit_id: [''],
      quit_numero: [''],
      quit_Facture: [''],
      quit_numeropolice: [''],
      quit_numavenant: [''],
      quit_numerorisque: [''],
      quit_numerocie: [''],
      quit_numerointermedaire: [''],
      quit_typequittance: [''],
      quit_typeecriture: [''],
      quit_typemvt: [''],
      quit_dateemission: [''],
      quit_datecomotable: [''],
      quit_dateeffet: [''],
      quit_dateecheance: [''],
      quit_typologieannulation: [''],
      quit_dateannulation: [''],
      quit_numeroaperitrice: [''],
      quit_primenette: ['', [Validators.required]],
      quit_primeext: [''],
      quit_commissionsapporteur1: ['', [Validators.required]],
      quit_commissionsapporteur2: [''],
      quit_accessoirecompagnie: ['', [Validators.required]],
      quit_accessoireapporteur: ['', [Validators.required]],
      quit_tauxte: [''],
      quit_codetaxete: [''],
      quit_tauxtva: [''],
      quit_codetva: [''],
      quit_tauxtps: [''],
      quit_codetps: [''],
      quit_mtntaxete: ['', [Validators.required]],
      quit_mtntva: [''],
      quit_mtntps: [''],
      quit_mntreductionprime: [''],
      quit_primettc: ['', [Validators.required]],
      quit_mntprimencaisse: [''],
      quit_dateencaissament: [''],
      quit_tauxreductioncommer: [''],
      quit_tauxbonus: [''],
      quit_tauxreductionautres: [''],
      quit_mtnreduction: [''],
      quit_mtnbonus: [''],
      quit_mtnreductionautres: [''],
      quit_numeroattestationauto: [''],
      quit_numeroressp: [''],
      quit_numerocertif: [''],
      quit_exoneration: [''],
      quit_dateexoneration: [''],
      quit_codeutilisateur: [''],
      quit_numeroquittanceannul: [''],
      quit_datemiseajour: [''],
      quit_datecomptabilisation: [''],
      quit_anciennumerofacture: [''],
      quit_status: [''],
    }),
    acheteurs: this.fb.array([]),
  });


  //json
  listType: any[] = types;
  listTypeContrat: any[];
  listTypeGestion: any[];
  listTypeRevision: any[];
  listTypeFractionnement: any[];


  showModifDateEcheanceSeule: boolean = false;
  showModifDateEcheanceSeule2: boolean = false;
  showreadonly: boolean = false;
  showObligatoire: boolean = false;

  validEcheance: boolean = false;
  showErrorvalidEcheance: boolean = false;
  showNbJours: boolean = false;

  showTypeCa: boolean = false;
  showTraitement: boolean = false;

  validbuttonecheance2: boolean = false;

  nbJours: number = 2;

  isCorrectionEngag: boolean = false;
  isCorrectionEngagEcran: boolean = false;
  affichTarif: boolean = false;
  validButtonCorrectionEngag: boolean = false;
  primeNetteDom: number = 0;
  somCapitalExport: number = 0;
  obligation: boolean = false;


  primenette: any;
  accessoirecompagnie: any;
  accessoireapporteur: any;
  commissionsapporteur1: any;
  tauxAp: any;
  taxeTE: number;
  primebrute: number;
  tauxCom: number;
  duree: number = 0;


  tarifA: boolean = false;


  public clientsCtrl: FormControl = new FormControl();
  public factureCtrl: FormControl = new FormControl();
  public policeCtrl: FormControl = new FormControl();


  public clientsFilterCtrl: FormControl = new FormControl();
  public factureFilterCtrl: FormControl = new FormControl();
  public policeFilterCtrl: FormControl = new FormControl();



  public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredFacture: ReplaySubject<Facture[]> = new ReplaySubject<Facture[]>();
  public filteredPolice: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();


  protected _onDestroy = new Subject<void>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  code_utilisateur: String;
  ajoutAcheteurs: boolean;
  nbAcheteur: number;
  addacheteur: boolean;
  codeProduitChoisi: string;
  errorSomAcheteurs: boolean;
  somTotAcheteurs: number = 0;
  typeAcheteur: string;
  delAcheteur: boolean;
  sinistre: Sinistre;
  constructor(private fb: FormBuilder, private authService: NbAuthService, private router: Router,
    private toastrService: NbToastrService, private dialogService: NbDialogService,
    private clientService: ClientService, private factureService: FactureService,
    private policeService: PoliceService, private brancheService: BrancheService,
    private produitService: ProduitService, private categorieService: CategorieService,
    private risqueService: RisqueService, private acteService: ActeService,
    private transfertData: TransfertDataService, private userService: UserService,
    private acheteurService: AcheteurService, private sinistreService: sinistreService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.userService.getUser(token.getPayload().sub)
            .subscribe((data: User) => {
              this.code_utilisateur = data.util_numero;
              console.log(this.code_utilisateur);
            });
        }

      });


    this.onGetAllClients();
    //this.onGetAllFacture();
    //this.onGetAllPolice();

    this.onGetAllBranche();


    this.listTypeContrat = this.listType['CLAUSES_CONTRAT'];
    this.listTypeRevision = this.listType['CLAUSES_REVISION'];
    this.listTypeGestion = this.listType['TYPE_GESTION'];
    this.listTypeFractionnement = this.listType['TYPE_FRACTIONNEMENT'];


    this.clientsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });



    this.factureFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererFactures();
      });

    this.policeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererPolices();
      });

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }



  protected filterClients() {

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

  protected filtererFactures() {
    if (!this.factures) {
      return;
    }
    // get the search keyword
    let search = this.factureFilterCtrl.value;
    if (!search) {
      this.filteredFacture.next(this.factures.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredFacture.next(
      this.factures.filter(c => c.fact_numacte.toString().indexOf(search) > -1)
    );
  }


  protected filtererPolices() {
    if (!this.polices) {
      return;
    }
    // get the search keyword
    let search = this.policeFilterCtrl.value;
    if (!search) {
      this.filteredPolice.next(this.polices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPolice.next(
      this.polices.filter(c => c.poli_numero.toString().indexOf(search) > -1)
    );
  }



  onChangeClient(event) {
    this.policeCtrl.setValue("");
    this.factureCtrl.setValue("");
    this.polices = [];
    this.factures = [];
    this.numpol = 0;
    this.numFact = 0;
    this.numcli = event.value;
    this.addForm.controls['numeroclient'].setValue(event.value);
    this.onGetAllPolice(this.numcli);
    //this.onGetAllFacture(this.numpol);

  }
  onChangeFacture(event) {
    this.numFact = event.value;
    this.numpol = 0;
    this.numcli = 0;
    this.addForm.controls['numerofacture'].setValue(event.value);


  }


  typeAvenant: any;
  onChangePolice(event) {
    this.factureCtrl.setValue("");
    //this.clientsCtrl.setValue("");
    this.addForm.controls['typeAvenant'].setValue("");
    this.addForm.controls['numeropolice'].setValue(event.value);
    this.typeAvenant = "".toString();
    this.factures = [];
    this.numcli = 0;
    this.numFact = 0;
    this.numpol = event.value;

    this.onGetAllFacture(this.numpol);
    this.onGetPolice(this.numpol);
    //this.onGetAllAcheteurByPolice(event.value);
    //this.onGetDatePolice(this.numpol);
    this.numFact = '';
    this.policeService.getPolice(this.numpol)
      .subscribe((data: Police) => {
        console.log(data.poli_dateecheance);
        let dateRef = new Date();
        let dateRef2 = new Date();
        let date = new Date(data.poli_dateecheance);
        dateRef2.setMonth(dateRef.getMonth() + 1)
        console.log(dateRef2);
        console.log(date);
        if (date >= dateRef && date <= dateRef2) {
          this.prologeable = true;
          console.log(this.prologeable);
          console.log("baxna");
        } else {
          this.prologeable = false;
          console.log(this.prologeable);
          console.log("baxoul");
        }
        //this.prologeable=false;  
      });
    console.log(this.prologeable);
  }

  onChangeTypeModif(event) {
    console.log("========================== onhange type modif ====================");
    console.log(event);
    /*  if(event == "2" || event == "3" ){
        this.addForm.controls['numerofacture'].clearValidators();
        this.showObligatoire = false;
      }else{
        this.showObligatoire = true;
        this.addForm.controls['numerofacture'].setValidators(Validators.required);
      }
      this.addForm.controls['numerofacture'].updateValueAndValidity();*/
    this.obligation = false;
    // this.isCorrectionEngag = false;
    if (event == "1") {
      // this.isCorrectionEngag = true;
      this.obligation = false;
      this.addForm.controls['numerofacture'].setValidators(Validators.required);
    } else if (event == "8") {
      // this.obligation = true;
      this.addForm.controls['numerofacture'].clearValidators();

    } else {
      this.addForm.controls['numerofacture'].setValidators(Validators.required);
      // this.obligation = false;
      // this.isCorrectionEngag = false;
    }

    this.addForm.controls['numerofacture'].updateValueAndValidity();
    this.addForm.controls['typeAvenant'].setValue(event);

    this.renouvelPolice = false;
    this.ajoutAcheteurs = false;
    this.delAcheteur = false;
  }



  onGetAllClients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientss = data as Client[];
        this.filteredClients.next(this.clientss.slice());
      });
  }



  onGetAllFacture(numpol) {
    if (this.isCorrectionEngag == true) {
      console.log('in');
      this.factureService.getAllFacturesAnnulPolice(numpol)
        .subscribe((data: Facture[]) => {
          this.factures = data as Facture[];
          this.filteredFacture.next(this.factures.slice());
        });

    } else {

      this.factureService.getAllFacturesPolice(numpol)
        .subscribe((data: Facture[]) => {
          this.factures = data as Facture[];
          this.filteredFacture.next(this.factures.slice());
        });

    }

  }

  onGetAllPolice(numcli) {
    this.policeService.getAllpoliceClientAutre(numcli)
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        this.filteredPolice.next(this.polices.slice());
      });
  }

  onGetAllBranche() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branches = data as Branche[];
        console.log(this.branches);
      });
  }

  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.categoriess = data as Categorie[];

      });
  }
  onGetAllSinistres() {
    this.sinistreService.getAllSinistres()
      .subscribe((data: Sinistre[]) => {
        this.sinistres = data as Sinistre[];
        //this.filteredClients.next(this.clientss.slice());
      });
  }
  onGetAllAcheteurByPolice(num: any) {
    console.log(num);
    this.acheteurService.getAllAcheteurByPolice(num)
      .subscribe((data: Acheteur[]) => {
        this.acheteurs = data as Acheteur[];
        console.log(this.acheteurs);
        this.dataSource.data = data as Acheteur[];
      });
  }

  onGetLibelleByClient(numero: Number) {
    if (((this.clientss?.find(b => b.clien_numero === numero))?.clien_nature) == "1") {
      return (this.clientss?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clientss?.find(b => b.clien_numero === numero))?.clien_prenom;
    } else
      return (this.clientss?.find(b => b.clien_numero === numero))?.clien_denomination;
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  onGetAllProduitByCategorie(categorie: number) {
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.produitss = data as Produit[];

      });
  }
capiAssure:any;
  onGetRisquePolice(numpol) {
    this.risqueService.getRisquePolice(numpol)
      .subscribe((data: Risque) => {
        this.risque = data;
        console.log("==================== RISQUE ==================");
        this.capiAssure=this.risque.risq_capitalassure;
        console.log(this.risque);

      });
  }

  onGetActePolice(numpol) {
    this.acteService.getActePolice(numpol)
      .subscribe((data: Acte) => {
        this.acte = data;

      });
  }
  onGetPolice(numpol) {
    this.policeService.getPolice(numpol)
      .subscribe((data: Police) => {
        console.log(data.poli_codeproduit);
        if (data.poli_codeproduit >= 15001001 && data.poli_codeproduit <= 15001005) {
          this.typeModif = 1;
        } else if (data.poli_codeproduit >= 15001006 && data.poli_codeproduit <= 15001009) {
          this.typeModif = 2;
        } else {
          this.typeModif = 3;//autres police
        }
      });
  }
  onGetDatePolice(numpol) {
    this.policeService.getPolice(numpol)
      .subscribe((data: Police) => {
        console.log(data.poli_dateecheance);
        let dateRef = new Date();
        let dateRef2 = new Date();
        dateRef2.setMonth(dateRef.getMonth() + 1)
        console.log(dateRef2);
        if (data.poli_dateecheance <= dateRef && data.poli_dateecheance >= dateRef2) {
          this.prologeable = true;
        } else {
          this.prologeable = false;
        }
        this.prologeable = false;
      });
  }


  onChangeBranche(event) {
    this.onGetAllCategorieByBranche(event);
    this.categorieSelected = "";
    this.produitSelected = "";


  }
  onChangeCategorie(event) {
    this.onGetAllProduitByCategorie(event);
    this.produitSelected = "";


  }
  prologeable: boolean = false;
  onChangeDateEcheance(event) {
    /* let dateRef = new Date();
    let dateRef2 = new Date();
    dateRef2.setMonth(dateRef2.getMonth()+1)
    if(this.police.poli_dateecheance <= dateRef && this.police.poli_dateecheance >= dateRef2){
this.prologeable=true;
    }else{
      this.prologeable=true;
    } */
    this.showErrorvalidEcheance = true;
    if (this.police.poli_dateecheance < event) {
      console.log("ok");
      this.validEcheance = true;
    } else {
      console.log("ko");
      this.validEcheance = false;
    }
  }

  onChangePeriode(event) {
    this.tarif = null;
    this.validbuttonecheance2 = false;
    const dateE: Date = new Date(this.police.poli_dateecheance);
    //dateE.setDate(dateE.getDate()+ 1);
    //this.policeForm.controls['poli_dateeffetencours'].setValue(dateFormatter(dateE, 'yyyy-MM-ddThh:mm'));
    const date: Date = new Date(this.police.poli_dateecheance);
    switch (event) {
      case "1": {
        this.showNbJours = false;
        date.setMonth(date.getMonth() + 12);
        console.log(date);
        this.policeForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "2": {
        this.showNbJours = false;
        date.setDate(date.getDate() + 90);
        console.log(date);
        this.policeForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "3": {
        this.showNbJours = false;
        date.setMonth(date.getMonth() + 6);
        console.log(date);
        this.policeForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "4": {
        this.showNbJours = true;
        this.policeForm.controls['poli_dateecheance'].setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }

    }

  }

  onChangeNbJours(event) {
    const date2: Date = new Date(this.police.poli_dateecheance);
    date2.setDate(date2.getDate() + Number(event));
    console.log(event);
    console.log(date2);
    this.policeForm.controls['poli_dateecheance'].setValue(dateFormatter(date2, 'yyyy-MM-ddThh:mm'));
  }

  onChangeNbAcheteur(event) {
    this.nbAcheteur = Number(event.target.value);
    const acheteurs = this.myForm.get('acheteurs') as FormArray;
    if (this.nbAcheteur > acheteurs.length) {
      this.addacheteur = true;
    } else {
      this.addacheteur = false;
    }

  }

  newMontCapi:any=0;
  onChangeMontantCapital(event) {
    this.newMontCapi = Number(event.target.value);  
    console.log(this.newMontCapi);
  }
  
  errorCred : boolean = false;
  ajoutAcheteur(dialog: TemplateRef<any>, police: Police) {

    console.log("================== AJOUT ACHETEUR ===================");

    if (this.produitSelected == '14002001') {
      this.typeAcheteur = '2';
    } else if (this.produitSelected == '14003001') {
      this.typeAcheteur = '3';
    } else if (this.produitSelected == '14001001') {
      this.typeAcheteur = '1';
    } else if (this.produitSelected == '16008001') {
      this.typeAcheteur = '4';
    }

    const acheteurs = this.myForm.get('acheteurs') as FormArray;
    console.log(this.myForm);
    if (this.nbAcheteur > acheteurs.length) {
      this.dialogService.open(OtherAcheteurComponent, {
        context: this.typeAcheteur,
      }).onClose
        .subscribe((acheteur: FormGroup) => {
          if (acheteur != null) {
            this.addacheteur = true;
            acheteurs.push(acheteur);
            this.somTotAcheteurs += Number(acheteur.controls['achet_montantcredit'].value);
            console.log(this.somTotAcheteurs);
            if (Number(this.newMontCapi) != this.somTotAcheteurs) {
              this.errorSomAcheteurs = true;
              this.errorCred = true;
            } else {
              this.errorSomAcheteurs = false;
              this.errorCred = false;
            }
            console.log(this.errorSomAcheteurs);

            if (this.produitSelected == '14002001') {
              acheteur.get('achet_avis').setValue('');

              // this.tariferExport(acheteur.get('achet_montantcredit').value, this.myForm.get('risque.risq_capitalassure').value, acheteur.get('achet_typecouverture').value, acheteur.get('achet_type').value, '1');
              this.tariferExport(acheteur.get('achet_montantcredit').value, this.newMontCapi, acheteur.get('achet_typecouverture').value, acheteur.get('achet_type').value, '1');
            }

            console.log("------------------ DUREE -------------------");
            console.log(acheteur.get('achet_duree').value);

            if (this.produitSelected == '14003001') {
              // A REVOIR
              this.duree = acheteur.get('achet_duree').value;
              this.tariferDomestique(acheteur.get('achet_montantcredit').value, acheteur.get('achet_duree').value, '1');

            }

            if (this.produitSelected == '16008001') {
              this.tariferLocassur(acheteur.get('achet_montant_loyer').value, acheteur.get('achet_bail').value, acheteur.get('achet_duree_bail').value, '1');

            }

            if (this.produitSelected == '14002001') {
              this.errorSomAcheteurs = false;
              this.somCapitalExport += acheteur.get('achet_montantcredit').value;
            }

          }
        });
    } else {
      this.addacheteur = false;

    }

  }


  deleteAcheteur(i) {
    const acheteurs = this.myForm.get('acheteurs') as FormArray;
    const acheteur = acheteurs.at(i) as FormGroup;
    if (acheteurs.length > 1) {
      this.somTotAcheteurs -= Number(acheteur.controls['achet_montantcredit'].value);
      acheteurs.removeAt(i);
    } else {
      this.somTotAcheteurs = 0;
      acheteurs.clear();
    }

    if (this.produitSelected == '14002001') {
      acheteur.get('achet_avis').setValue('');


      // this.tariferExport(acheteur.get('achet_montantcredit').value, this.myForm.get('risque.risq_capitalassure').value, acheteur.get('achet_typecouverture').value, acheteur.get('achet_type').value, '2');
      this.tariferExport(acheteur.get('achet_montantcredit').value, this.newMontCapi, acheteur.get('achet_typecouverture').value, acheteur.get('achet_type').value, '2');


    }

    if (this.produitSelected == '14003001') {
      this.tariferDomestique(acheteur.get('achet_montantcredit').value, acheteur.get('achet_duree').value, '2');

    }

    if (this.produitSelected == '16008001') {
      this.tariferLocassur(acheteur.get('achet_montant_loyer').value, acheteur.get('achet_bail').value, acheteur.get('achet_duree_bail').value, '2');

    }

    this.addacheteur = true;
    this.errorSomAcheteurs = true;

    if (this.produitSelected == '14002001') {
      this.errorSomAcheteurs = false;
      this.somCapitalExport -= acheteur.get('achet_montantcredit').value;
    }
  }


  onChangeTarifConventionnelle(event) {
    if (event == "oui") {
      this.showTauxPreferentielle = true;
      this.afficheTauxPref = true;
    } else {
      this.showTauxPreferentielle = false;
      this.afficheTauxPref = false;
      this.afficheMesssageTauxPref = false;
      this.tauxPreferentiel = 0;
    }

    this.validbuttonecheance2 = false;
    this.clearTarif();

  }

  onChangeTauxPreferentielle(event) {
    this.tauxPreferentiel = event.target.value;
    this.afficheMesssageTauxPref = true;
  }

  clearTarif() {

    this.myForm.get('quittance.quit_commissionsapporteur1').setValue('');
    this.myForm.get('quittance.quit_primenette').setValue('');
    this.myForm.get('quittance.quit_accessoirecompagnie').setValue('');
    this.myForm.get('quittance.quit_accessoireapporteur').setValue('');
    this.myForm.get('quittance.quit_mtntaxete').setValue('');
    this.myForm.get('quittance.quit_primettc').setValue('');

    this.tauxAp = 0;
    this.tauxCom = 0;
    this.commissionsapporteur1 = 0;
    this.primenette = 0;
    this.accessoireapporteur = 0;
    this.accessoirecompagnie = 0;
    this.taxeTE = 0;
    this.primebrute = 0;
  }

  tariferDomestique(montant, duree, type) {

    let type_traitement: number = 1;
    const type_risque: string = this.risque.risq_modegestion || 'RC';
    const acheteur: string = /*this.myForm.get('achet_type').value || */'prive';
    const ca: string = this.risque.risq_genrerisque || 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;
    //this.myForm.get('credit.credit_type').setValue("2");

    // this.policeService.tariferPolice(Number(montant), this.produitSelected, this.police.poli_intermediaire, typeCa, type_traitement, type_risque, 1, duree)
    this.policeService.tariferPoliceTauxPref(Number(montant), this.produitSelected, this.police.poli_intermediaire, typeCa, type_traitement, type_risque, 1, duree, Number(this.tauxPreferentiel))
      .subscribe((data: any) => {
        console.log(data);

        if (type == '1') {
          this.primeNetteDom += Number(data.primeNette);
        }
        if (type == '2') {
          this.primeNetteDom -= Number(data.primeNette);
        }



      },
        (error) => {
          this.toastrService.show(
            'Vérifier les informations saisis',
            'Une erreur est survenue',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );

  }

  tariferExport(Mcredit, montant, type_risque, acheteur, type) {

    let type_traitement: number = 1;
    //const type_risque: string = this.myForm.get('risque.risq_modegestion').value || 'RC' ;
    //const acheteur:string = /*this.myForm.get('achet_type').value || */'prive';
    const ca: string = this.risque.risq_genrerisque || 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;
    //this.myForm.get('credit.credit_type').setValue("3");

    // this.policeService.tariferPolice(Number(montant), this.myForm.get('policeForm.poli_codeproduit').value, this.myForm.get('policeForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0)
    // this.policeService.tariferPoliceTauxPref(Number(montant), this.myForm.get('policeForm.poli_codeproduit').value, this.myForm.get('policeForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0, Number(this.tauxPreferentiel))
    this.policeService.tariferPoliceTauxPref(Number(montant), this.policeForm.get('poli_codeproduit').value, this.policeForm.get('poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0, Number(this.tauxPreferentiel))
      .subscribe((data: any) => {
        console.log(data);

        console.log("================ Taux produit ====================");
        console.log(data.tauxProduit);
        if (type == '1') {
          this.primeNetteDom += Number((Mcredit * data.tauxProduit) / 100);
        }
        if (type == '2') {
          this.primeNetteDom -= Number((Mcredit * data.tauxProduit) / 100);
        }
      },
        (error) => {
          this.toastrService.show(
            'Vérifier les informations saisis',
            'Une erreur est survenue',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );

  }

  tariferLocassur(montant, bail, duree_bail, type) {
    this.errorSomAcheteurs = false;

    let type_traitement: number = 1;
    const type_risque: string = this.risque.risq_modegestion || 'RC';
    const acheteur: string = /*this.myForm.get('achet_type').value || */'prive';
    const ca: string = this.risque.risq_genrerisque || 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;
    //this.myForm.get('credit.credit_type').setValue("4");

    // this.policeService.tariferPolice(Number(montant), this.myForm.get('policeForm.poli_codeproduit').value, this.myForm.get('policeForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0)
    this.policeService.tariferPoliceTauxPref(Number(montant), this.policeForm.get('poli_codeproduit').value, this.policeForm.get('poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0, Number(this.tauxPreferentiel))
      .subscribe((data: any) => {
        console.log(data);

        if (type == '1') {
          if (bail == 'indéterminé' || (bail == 'déterminé' && duree_bail > 12)) {
            this.primeNetteDom += Number(((montant * 12) * data.tauxProduit) / 100);
            this.somCapitalExport += Number((montant * 12));
          } else {
            this.primeNetteDom += Number(((montant * duree_bail) * data.tauxProduit) / 100);
            this.somCapitalExport += Number((montant * duree_bail));
          }

        }
        if (type == '2') {
          if (bail == 'indéterminé' || (bail == 'déterminé' && duree_bail > 12)) {
            this.primeNetteDom -= Number(((montant * 12) * data.tauxProduit) / 100);
            this.somCapitalExport -= Number((montant * 12));
          } else {
            this.primeNetteDom -= Number(((montant * duree_bail) * data.tauxProduit) / 100);
            this.somCapitalExport -= Number((montant * duree_bail));
          }
        }



      },
        (error) => {
          this.toastrService.show(
            'Vérifier les informations saisis',
            'Une erreur est survenue',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );

  }


  ajoutAcheteurPolice() {
    console.log(this.police.poli_numero, this.myForm.value);
    this.policeService.ajoutAcheteurNewCapi(this.police.poli_numero,this.newMontCapi, this.addForm.controls['numerofacture'].value, this.myForm.value)
      .subscribe((data: any) => {
        this.toastrService.show(
          data.message,
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 0,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.router.navigateByUrl('home/gestion-facture');

      },
        (error) => {
          this.toastrService.show(
            'une erreur est survenue',
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });


        });
  }


  onFocusOutEventDateEffetEnCours() {
    let periodeDebut = new Date(this.police.poli_dateeffetencours);
    let periodeFin = new Date();
    periodeDebut.setHours(0, 0, 0, 0);
    //console.log(periodeDebut.setMonth(1));
    //periodeDebut.setMonth(0);

    periodeDebut.setDate(periodeDebut.getDate() + 1);




    //console.log(periodeDebut.setFullYear(periodeDebut.getFullYear()))
    console.log(periodeDebut.getDate());
    console.log(periodeDebut.getMonth());
    console.log(periodeDebut.getFullYear());
    console.log(periodeDebut);
    periodeFin.setFullYear(periodeFin.getFullYear() + 1);

    //periodeDebut=this.police.poli_dateeffetencours
    const date: Date = new Date(this.policeForm.get('poli_dateeffetencours').value);
    //date.setDate(date.getDate()+ 1);
    if (periodeDebut <= date) {
      this.errorDateSub = false;
    } else {
      this.errorDateSub = true;
      this.policeForm.get('poli_dateeffetencours').setValue('');
    }

    /*  
    
    const dateE : Date = new Date(this.police.poli_dateecheance);
      //dateE.setDate(dateE.getDate()+ 1);
      this.policeForm.controls['poli_dateeffetencours'].setValue(dateFormatter(dateE, 'yyyy-MM-ddThh:mm'));
      const date : Date = new Date(this.police.poli_dateecheance);
      
    
    if(periodeFin.getMonth()!=12){
          
          periodeFin.setMonth(periodeFin.getMonth()+1);
         }else{
          periodeFin.setMonth(periodeFin.getMonth())
        } 
        periodeFin.setDate(30);
        console.log(periodeFin.setDate(30));
      console.log(periodeDebut +"-------"+periodeFin);
      const date : Date= new Date(this.myForm.get('policeForm.poli_dateeffetencours').value);
      date.setHours(0, 0, 0, 0);
      console.log(date.getFullYear());
      console.log(periodeDebut.getFullYear());
      console.log(periodeFin.getFullYear());
      if(periodeDebut <= date && date < periodeFin ){
        
       this.errorDateSub = false;
        this.errorDateExo = false;
      }else if(periodeDebut > date && date < periodeFin){
        this.errorDateExo = true;
        this.myForm.get('policeForm.poli_dateecheance').setValue('');
      }else if(periodeDebut <= date && date > periodeFin){
        this.errorDateSub = true;
        this.myForm.get('policeForm.poli_dateecheance').setValue('');
      }
      this.dateEffet=this.myForm.get('policeForm.poli_dateeffetencours').value;
        
    
      
      this.clearTarif(); */
  }


  valider() {

    this.policeService.getPolice(this.addForm.controls['numeropolice'].value)
      .subscribe((data: Police) => {
        this.police = data;
        this.police.poli_dateeffetencours = dateFormatter(this.police?.poli_dateeffetencours, 'yyyy-MM-ddThh:mm');
        this.police.poli_dateecheance = dateFormatter(this.police?.poli_dateecheance, 'yyyy-MM-ddThh:mm');
        this.policeForm.setValue(this.police);
        console.log("============= Remplissage police ==========");
        console.log(this.policeForm.value);
        this.onGetActePolice(this.addForm.controls['numeropolice'].value);
        this.onGetRisquePolice(this.addForm.controls['numeropolice'].value);
        this.onGetAllCategorieByBranche(data.poli_branche);
        this.onGetAllProduitByCategorie(data.poli_categorie);
        this.brancheSelected = data.poli_branche.toString();
        this.categorieSelected = data.poli_categorie.toString();
        this.produitSelected = data.poli_codeproduit.toString();
        this.transfertData.setData(data.poli_numero);
        this.onGetAllAcheteurByPolice(data.poli_numero);

        //this.selectedTypeContrat = data.poli_typecontrat.toString();
        //this.selectedTypeGestion = data.poli_typegestion.toString();
        //this.selectedTypeRevision = data.poli_typerevision.toString();
        //this.selectedTypeFractionnement = data.poli_codefractionnement.toString();

        this.branch = this.police.poli_codeproduit.toString().slice(0, 2);
        if (this.police.poli_codeproduit.toString() == "15001001") {
          this.showTraitement = true;
          this.showTypeCa = false;
        } else if (this.police.poli_codeproduit.toString() == "14003001") {
          this.showTraitement = false;
          this.showTypeCa = false;
        } else if (this.police.poli_codeproduit.toString() == "14002001") {
          this.showTraitement = false;
          this.showTypeCa = true;
        }
      });

    switch (this.addForm.controls['typeAvenant'].value) {
      case "1": {
        this.showModifDateEcheanceSeule = false;
        this.isCorrectionEngagEcran = true;
        //this.onGetRisquePolice(this.addForm.controls['numeropolice'].value);
        this.showreadonly = true;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.delAcheteur = false;
        break;
      }
      case "2": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = true;
        this.showreadonly = true;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.delAcheteur = false;
        break;
      }
      case "3": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = false;
        this.showreadonly = true;
        this.showModifDateEcheanceSeule2 = true;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.delAcheteur = false;
        break;
      }
      case "4": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = false;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.delAcheteur = false;
        break;
      }
      case "5": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = false;
        this.renouvelPolice = true;
        this.ajoutAcheteurs = false;
        this.delAcheteur = false;
        break;
      }
      case "6": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = false;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = true;
        this.delAcheteur = false;
        break;
      }
      case "7": {
        this.showModifDateEcheanceSeule = false;
        this.isCorrectionEngagEcran = false;
        this.showreadonly = true;
        this.renouvelPolice = true;
        this.ajoutAcheteurs = false;
        this.delAcheteur = false;
        break;
      }
      case "8": {
        this.showModifDateEcheanceSeule = false;
        this.isCorrectionEngagEcran = false;

        this.showreadonly = false;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.delAcheteur = true;


        break;
      }
    }
  }

  onChechId(id: number) {

    if (this.sinistres.find(p => p.sini_acheteur === id)) {
      return 4;
    }

    if (id == null) {

      return 3;
    }
    if (this.acheteurs.find(p => p.achet_numero === id).achet_montantcredit != null) {
      return 2;
    }
    else {
      return 1;
    }


  }
  open(dialog: TemplateRef<any>, acheteur: Acheteur) {

    this.dialogService.open(
      dialog,
      {
        context: acheteur
      });
  }
  onDeleteAcheteur(id: number) {
    this.acheteurService.deleteAcheteur(id)
      .subscribe(() => {
        this.toastrService.show(
          'Acheteur supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        //this.onGetAllAcheteur();
        this.onGetAllAcheteurByPolice(this.police.poli_numero);

      });
  }

  reemettreEcheanceSeule() {

    this.factureService.reemettreFactEcheanceSeule(this.policeForm.value, this.addForm.controls['typeAvenant'].value, this.addForm.controls['numerofacture'].value).
      subscribe((data: any) => {

        this.toastrService.show(
          data.message,
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 0,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.router.navigateByUrl('home/gestion-facture');

      },
        (error) => {
          this.toastrService.show(
            'une erreur est survenue',
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );




  }


  onChangeTraitement(event) {
    this.traitement = Number(event);
  }

  onChangeTypeCa(event) {
    this.typeca = event;
    this.tarif = null;
    this.validbuttonecheance2 = false;
  }

  onChangeTypeRisque(event) {
    this.typeRisque = event;
    this.tarif = null;
    this.validbuttonecheance2 = false;
  }
  onchangeTypeAcheteur(event) {
    this.acheteur = event;
  }


  tarifer() {


    this.policeService.tarifer(this.policeForm.value, this.acte, this.typeca, this.traitement, this.typeRisque, Number(this.addForm.controls['typeAvenant'].value)).
      subscribe((data: Tarif) => {
        console.log(data);
        this.tarif = data;
        this.validbuttonecheance2 = true;



      },
        (error) => {
          this.toastrService.show(
            'une erreur est survenue',
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );




  }




  validerEcheance2() {

    this.policeForm.controls['poli_primenettotal'].setValue(this.tarif.primeNette);
    this.policeForm.controls['poli_primebruttotal'].setValue(this.tarif.primeTTC);
    this.policeForm.controls['poli_dateeffetencours'].setValue(this.police.poli_dateecheance);

    //console.log(this.policeForm.value);

    this.policeService.modifPoliceEcheance2(this.policeForm.value, this.tarif, this.addForm.controls['typeAvenant'].value, this.addForm.controls['numerofacture'].value)
      .subscribe((data: any) => {

        this.toastrService.show(
          data.message,
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 0,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.router.navigateByUrl('home/gestion-facture');


      },
        (error) => {
          this.toastrService.show(
            'une erreur est survenue',
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );
  }


  onChangeCapAssure(event) {
    this.acte.act_capitalassure = Number(event);

    this.validButtonCorrectionEngag = true;
  }
  onChangeCapSMP(event) {
    this.acte.act_capitalsmp = Number(event);

    this.validButtonCorrectionEngag = true;
  }
  onChangeCapLCI(event) {
    this.acte.act_capitallci = Number(event);

    this.validButtonCorrectionEngag = true;
  }


  onChangeSiRetarif(event) {
    if (event == "1") {
      this.affichTarif = true;
    } else {
      this.affichTarif = false;
    }
  }



  modifPoliceCorrectionEngag() {

    this.policeForm.controls['poli_primenettotal'].setValue(this.tarif.primeNette);
    this.policeForm.controls['poli_primebruttotal'].setValue(this.tarif.primeTTC);
    this.policeForm.controls['poli_dateeffetencours'].setValue(this.police.poli_dateecheance);

    this.policeService.modifPoliceCorrectionEngag(this.policeForm.value, this.tarif, this.acte, this.addForm.controls['typeAvenant'].value, this.addForm.controls['numerofacture'].value)
      .subscribe((data: any) => {

        this.toastrService.show(
          data.message,
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 0,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.router.navigateByUrl('home/gestion-facture');


      },
        (error) => {
          this.toastrService.show(
            'une erreur est survenue',
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 0,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );
  }

  getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    this.duree = Math.trunc(diffInMs / (1000 * 60 * 60 * 24));
    console.log(this.duree);
    console.log(Math.trunc(diffInMs / (1000 * 60 * 60 * 24 * 29)));
    return Math.trunc(diffInMs / (1000 * 60 * 60 * 24 * 29));
  }


  tariferAjoutAcheteur() {
    this.tarifA = true;

    let type_traitement: number = 1;
    const type_risque: string = 'RC';
    const acheteur: string = /*this.myForm.get('achet_type').value || */'prive';
    const ca: string = 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;
    let capital: number = this.somTotAcheteurs;

    // this.getDifferenceInDays(new Date(this.police.poli_dateecheance), new Date(this.police.poli_dateeffetencours));

    /* if(this.myForm.get('type_traitement').value == 'express'){
      type_traitement = 2;
    } */


    // ======================== A REVOIR ====================================
    if (this.produitSelected != '14003001') {
      // this.duree = 0;
      this.getDifferenceInDays(new Date(this.police.poli_dateecheance), new Date(this.police.poli_dateeffetencours));
    }
    
    if (this.produitSelected == '14002001' || this.produitSelected == '16008001') {
      capital = this.somCapitalExport;
    }
    // tslint:disable-next-line:max-line-length
    // this.policeService.tariferPolice(capital, this.produitSelected, this.police.poli_intermediaire, typeCa, type_traitement, type_risque, 1, this.duree)
    this.policeService.tariferPoliceTauxPref(capital, this.produitSelected, this.police.poli_intermediaire, typeCa, type_traitement, type_risque, 1, this.duree, Number(this.tauxPreferentiel))
      .subscribe((data: any) => {
        console.log(data);
        this.accessoirecompagnie = data.accessoireCompagnie;
        this.myForm.get('quittance.quit_accessoirecompagnie').setValue(data.accessoireCompagnie);
        this.accessoireapporteur = data.accessoireapporteur;
        this.myForm.get('quittance.quit_accessoireapporteur').setValue(this.accessoireapporteur);
        this.tauxCom = data.tauxCommission;
        this.commissionsapporteur1 = data.montantCommission;
        this.myForm.get('quittance.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);
        this.primenette = data.primeNette;
        this.myForm.get('quittance.quit_primenette').setValue(this.primenette);
        this.tauxAp = data.tauxProduit;

        this.taxeTE = data.montantTaxe;

        this.myForm.get('quittance.quit_mtntaxete').setValue(this.taxeTE);

        if (this.tauxPreferentiel == 0 && (this.produitSelected == '14003001' || this.produitSelected == '14002001' || this.produitSelected == '16008001')) {
          this.primenette = this.primeNetteDom;
          this.myForm.get('quittance.quit_primenette').setValue(this.primenette);
          // this.tauxAp = 0;
          this.taxeTE = ((this.primeNetteDom + this.accessoirecompagnie + this.accessoireapporteur) * data.tauxTaxe) / 100;

          this.myForm.get('quittance.quit_mtntaxete').setValue(this.taxeTE);
          this.commissionsapporteur1 = (this.primeNetteDom * data.tauxCommission) / 100;
          this.myForm.get('quittance.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);

        } else if (this.tauxPreferentiel != 0 && (this.produitSelected == '14003001' || this.produitSelected == '14002001' || this.produitSelected == '16008001')) {
          // this.primenette = this.primeNetteDom;
          // this.myForm.get('quittance.quit_primenette').setValue(this.primenette);
          this.tauxAp = 0;
          this.taxeTE = ((this.primenette + this.accessoirecompagnie + this.accessoireapporteur) * data.tauxTaxe) / 100;

          this.myForm.get('quittance.quit_mtntaxete').setValue(this.taxeTE);
          this.commissionsapporteur1 = (this.primenette * data.tauxCommission) / 100;
          this.myForm.get('quittance.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);
        }

        this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
        this.myForm.get('quittance.quit_primettc').setValue(this.primebrute);

        /* console.log("========================== données tarif ========================");
        console.log(this.tauxAp);
        console.log(this.tauxCom);
        console.log(this.commissionsapporteur1);

        console.log(this.primeNetteDom);
        console.log(this.primenette);
        console.log(this.accessoirecompagnie + this.accessoireapporteur);
        console.log(this.taxeTE);
        console.log(this.primebrute); */


      },
        (error) => {
          this.toastrService.show(
            'Vérifier les informations saisis',
            'Une erreur est survenue',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }

}
