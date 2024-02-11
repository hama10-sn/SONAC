import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Client } from '../../../../model/Client';
import { Facture } from '../../../../model/Facture';
import { Police } from '../../../../model/Police';
import { Produit } from '../../../../model/Produit';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { ClientService } from '../../../../services/client.service';
import { FactureService } from '../../../../services/facture.service';
import { PoliceService } from '../../../../services/police.service';
import { ProduitService } from '../../../../services/produit.service';
import types from '../../../data/types.json';
import dateFormatter from 'date-format-conversion';
import { RisqueService } from '../../../../services/risque.service';
import { Risque } from '../../../../model/Risque';
import { Acte } from '../../../../model/Acte';
import { ActeService } from '../../../../services/acte.service';
import { Tarif } from '../../../../model/Tarif';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../model/User';
import { AjoutAcheteurComponent } from '../../police/gestion-police/ajout-police/ajout-acheteur/ajout-acheteur.component';
import { AcheteurService } from '../../../../services/acheteur.service';
import { Acheteur } from '../../../../model/Acheteur';
import { QuittanceService } from '../../../../services/quittance.service';
import { Quittance } from '../../../../model/Quittance';
import { Console } from 'console';

@Component({
  selector: 'ngx-reemetre-facture',
  templateUrl: './reemetre-facture.component.html',
  styleUrls: ['./reemetre-facture.component.scss']
})
export class ReemetreFactureComponent implements OnInit {
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

  autorisation = [];

  renouvelPolice: boolean = false;
  showTauxPreferentielle: boolean = false;
  afficheTauxPref: boolean = false;
  afficheMesssageTauxPref: boolean = false
  tauxPreferentiel: any = 0;

  /* addForm = this.fb.group({

    numerofacture: ['', [Validators.required]],
    numeropolice: ['', [Validators.required]],
    numeroclient: ['', [Validators.required]],
    //numeroquittance :  ['', [Validators.required]],
    typeAvenant: ['', [Validators.required]],

    dateeffetcontrat :  ['']

  }); */


  reemettre = this.fb.group({
    //police
    myForm: this.fb.group({
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
    }),
    quittanceForm: this.fb.group({
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
    addForm: this.fb.group({

      numerofacture: ['', [Validators.required]],
      numeropolice: ['', [Validators.required]],
      numeroclient: ['', [Validators.required]],
      //numeroquittance :  ['', [Validators.required]],
      typeAvenant: ['', [Validators.required]],

      dateeffetcontrat: ['']

    })

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



  primenette: any;
  accessoirecompagnie: any;
  accessoireapporteur: any;
  commissionsapporteur1: any;
  tauxAp: any;
  taxeTE: number;
  primebrute: number;
  tauxCom: number;
  duree: number;


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
  tarifTrimestrielle: boolean;
  displayFacture: boolean;

  constructor(private fb: FormBuilder, private authService: NbAuthService, private router: Router,
    private toastrService: NbToastrService, private dialogService: NbDialogService,
    private clientService: ClientService
    , private factureService: FactureService
    , private policeService: PoliceService, private quittanceservice: QuittanceService
    , private brancheService: BrancheService, private produitService: ProduitService,
    private categorieService: CategorieService, private risqueService: RisqueService,
    private acteService: ActeService, private userService: UserService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.userService.getUser(token.getPayload().sub)
            .subscribe((data: User) => {
              this.code_utilisateur = data.util_numero;

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

    this.reemettre.get('addForm.numeroclient').setValue(event.value);
    this.onGetAllPolice(this.numcli);
    //this.onGetAllFacture(this.numpol);

  }
  numerofacture: number;
  onChangeFacture(event) {
    this.numFact = event.value;
    this.numpol = 0;
    this.numcli = 0;
    this.onGetfactureBynum(event.value)
    this.reemettre.get('addForm.numerofacture').setValue(event.value);


  }



  onChangePolice(event) {
    this.factureCtrl.setValue("");
    this.reemettre.get('addForm.numeropolice').setValue(event.value);

    this.factures = [];
    this.numcli = 0;
    this.numFact = 0;
    this.numpol = event.value;

    this.onGetAllFacture(this.numpol);
    this.onGetPolice(this.numpol);

    this.numFact = '';
    this.onGetfactureByPolice(this.numpol);



  }
  typemod: number;
  mofiCapital: boolean = false;
  onChangeTypeModif(event) {

    this.typemod == event
    this.policeCtrl.setValue("");
    this.factureCtrl.setValue("");
    this.clientsCtrl.setValue("");
    if (event == "1") {
      this.isCorrectionEngag = true;

    } else {
      this.isCorrectionEngag = false;
    }
    if (event == "4" || event == "3" || event == "2") {
      this.displayFacture = false;

      this.reemettre.get('addForm.numerofacture').clearValidators();

      //this.reemettre.get('addForm.numerofacture').updateValueAndValidity();


    } else {
      this.displayFacture = true;
    }

    if (event == "3" || event == "1") {
      this.mofiCapital = true;
    } else {
      this.mofiCapital = false;
    }
    this.reemettre.get('addForm.numerofacture').updateValueAndValidity();
    this.reemettre.get('addForm.typeAvenant').setValue(event);
  }



  onGetAllClients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientss = data as Client[];
        this.filteredClients.next(this.clientss.slice());
      });
  }

  facture: Facture;
  onGetfactureBynum(num) {
    this.factureService.getFacture(num)
      .subscribe((data: Facture) => {
        this.facture = data as Facture;
        //this.filteredClients.next(this.clientss.slice());
        this.reemettre.get('quittanceForm.quit_dateeffet').setValue(dateFormatter(data.fact_dateeffetcontrat, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateecheance').setValue(dateFormatter(data.fact_dateecheancecontrat, 'yyyy-MM-ddThh:mm'));
      });
  }
  numeroFact: String;
  onGetfactureByPolice(num) {
    this.factureService.getFactureByPolice(num)
      .subscribe((data: Facture) => {
        this.facture = data as Facture;
        //this.filteredClients.next(this.clientss.slice());

        this.numeroFact == (this.facture.fact_numacte).toString();
        this.reemettre.get('addForm.numerofacture').setValue(this.facture.fact_numacte);
      });
  }
  onGetAllFacture(numpol) {
    if (this.isCorrectionEngag == true) {

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
    this.policeService.getAllpoliceClientCMT(numcli)
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        this.filteredPolice.next(this.polices.slice());

      });
  }

  onGetAllBranche() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branches = data as Branche[];

      });
  }

  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.categoriess = data as Categorie[];

      });
  }
  onGetAllProduitByCategorie(categorie: number) {
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.produitss = data as Produit[];

      });
  }

  onGetRisquePolice(numpol) {
    this.risqueService.getRisquePolice(numpol)
      .subscribe((data: Risque) => {
        this.risque = data;

      });
  }

  onGetActePolice(numpol) {
    this.acteService.getActePolice(numpol)
      .subscribe((data: Acte) => {
        this.acte = data;

      });
  }
  quittance: Quittance;
  onGetQuitancePolice(numpol) {
    this.quittanceservice.getQuittanceByNuymPolice(numpol)
      .subscribe((data: Quittance) => {
        this.quittance = data;
        this.dateeffetQuitance = (dateFormatter(this.quittance.quit_dateeffet, 'yyyy-MM-ddThh:mm'))
      });
  }
  onGetPolice(numpol) {
    this.policeService.getPolice(numpol)
      .subscribe((data: Police) => {

        if (data.poli_codeproduit >= 15001001 && data.poli_codeproduit <= 15001005) {
          this.typeModif = 1;
        } else if (data.poli_codeproduit >= 15001006 && data.poli_codeproduit <= 15001009) {
          this.typeModif = 2;
        } else {
          this.typeModif = 3;
        }
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

  onChangeDateEcheance(event) {
    this.showErrorvalidEcheance = true;
    if (this.police.poli_dateecheance < event) {

      this.validEcheance = true;
    } else {

      this.validEcheance = false;
    }
  }
  dateeffetQuitance: Date;
  periode: any=0;
  onChangePeriode(event) {
    this.tarif = null;
    this.validbuttonecheance2 = false;
    const dateE: Date = new Date(this.police.poli_dateecheance);


    //dateE.setDate(dateE.getDate() + 1);
    //this.reemettre.get('myForm.poli_dateeffetencours').setValue(dateFormatter(dateE, 'yyyy-MM-ddThh:mm'));
    const date: Date = new Date(this.police.poli_dateecheance);
    switch (event) {
      case "1": {
        this.showNbJours = false;
        date.setMonth(date.getMonth() + 1);
        this.validEcheance = true;
        this.periode = 12;
        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "2": {
        this.showNbJours = false;
        date.setDate(date.getDate() + 90);
        this.periode = 4;
        this.validEcheance = true;
        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "3": {
        this.showNbJours = false;
        date.setMonth(date.getMonth() + 6);
        this.periode = 6;
        this.validEcheance = true;
        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "4": {
        this.showNbJours = true;
        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }

    }

  }
  typePeriode: number = 0;
  onChangetype(event) {
    this.typePeriode = event;

    /* if(this.typePeriode==1){
      //this.reemettre.get('myForm.poli_dateecheance').clearValidators();
      
    } 
    this.reemettre.get('myForm.poli_dateecheance').updateValueAndValidity();
  */
    this.dateFact = false;
  }
  dateEcheanceQuitance: Date;
  dateFact: boolean = false;
  dateFocus: boolean = true;
  onChangePeriodeByTrimestre(event) {
    this.tarif = null;
    this.validbuttonecheance2 = false;
    const dateE: Date = new Date(this.police.poli_dateecheance);
    const dateEff: Date = new Date();
    const dateEchean: Date = new Date(this.police.poli_dateecheance);
    this.dateFact = true;
    //this.validEcheance = true;
    //dateE.setDate(dateE.getDate() + 1);
    //date.setFullYear(dateE.getFullYear());
    this.reemettre.get('myForm.poli_dateeffetencours').setValue(dateFormatter((this.police.poli_dateeffetencours), 'yyyy-MM-ddThh:mm'));
    const date: Date = new Date();
    const date1: Date = new Date();
    const date2: Date = new Date();
    const date3: Date = new Date();
    const dateRef: Date = new Date();
    date.setMonth(0);
    date.setDate(31);

    date2.setMonth(0);
    date2.setDate(31);
    date1.setMonth(0);
    date1.setDate(31);
    date3.setMonth(0);
    date3.setDate(31);
    dateEff.setMonth(0);
    dateEff.setDate(1);
    //dateEff.setFullYear(dateE.getFullYear());
    date.setFullYear(dateE.getFullYear());
    date1.setFullYear(dateE.getFullYear());
    date2.setFullYear(dateE.getFullYear());
    date3.setFullYear(dateE.getFullYear());

    switch (event) {
      case "1": {
        this.showNbJours = false;
        //dateEff.setMonth(0);
        if (dateRef.getMonth() >= 0 && dateRef.getMonth() < 4 && dateEchean.getMonth() >= 1 && dateEchean.getMonth() < 4 && dateEchean.getFullYear() == dateRef.getFullYear()) {

          this.dateFocus = true;
          this.validEcheance = true;
        } else {
          this.validEcheance = false;
          this.dateFocus = false;
        }

        if (dateEchean.getMonth() >= 9) {
          date.setFullYear(date.getFullYear() + 1);
          this.dateFocus = true;
          this.validEcheance = true;
        }

        dateEff.setMonth(0);
        date.setDate(31);
        date.setMonth(date.getMonth() + 2);
        date.setFullYear(dateEff.getFullYear());
        console.log(date.getFullYear());
        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));


        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateeffet').setValue(dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('addForm.dateeffetcontrat').setValue(dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        this.dateeffetQuitance = (dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.dateEcheanceQuitance = (dateFormatter(date, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "2": {
        this.showNbJours = false;
        //date1.setMonth(5);
        dateEff.setMonth(3);
        date1.setDate(30);
        date1.setMonth(dateEff.getMonth() + 2);
        if (dateRef.getMonth() >= 4 && dateRef.getMonth() < 7 && dateEchean.getMonth() >= 4 && dateEchean.getMonth() < 7 && dateEchean.getFullYear() == dateRef.getFullYear()) {

          this.dateFocus = true;
          this.validEcheance = true;
        } else {
          this.validEcheance = false;
          this.dateFocus = false;
        }

        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date1, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateeffet').setValue(dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateecheance').setValue(dateFormatter(date1, 'yyyy-MM-ddThh:mm'));
        this.dateeffetQuitance = (dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.dateEcheanceQuitance = (dateFormatter(date1, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('addForm.dateeffetcontrat').setValue(dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "3": {
        this.showNbJours = false;
        //date2.setMonth(8);
        dateEff.setMonth(6);
        date2.setDate(30);
        date2.setMonth(dateEff.getMonth() + 2);
        if (dateRef.getMonth() >= 7 && dateRef.getMonth() < 10 && dateEchean.getMonth() >= 7 && dateEchean.getMonth() < 10 && dateEchean.getFullYear() == dateRef.getFullYear()) {

          this.dateFocus = true;
          this.validEcheance = true;
        } else {
          this.validEcheance = false;
          this.dateFocus = false;
        }

        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date2, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateeffet').setValue(dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateecheance').setValue(dateFormatter(date2, 'yyyy-MM-ddThh:mm'));
        this.dateeffetQuitance = (dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.dateEcheanceQuitance = (dateFormatter(date2, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('addForm.dateeffetcontrat').setValue(dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        break;
      }
      case "4": {
        this.showNbJours = false;
        //date3.setMonth(11);
        dateEff.setMonth(9);

        date3.setMonth(dateEff.getMonth() + 2);

        if (dateRef.getMonth() >= 10 && dateEchean.getMonth() >= 10 && dateEchean.getFullYear() == dateRef.getFullYear()) {

          this.dateFocus = true;
          this.validEcheance = true;
        } else {
          this.validEcheance = false;
          this.dateFocus = false;
        }
        this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date3, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateeffet').setValue(dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('quittanceForm.quit_dateecheance').setValue(dateFormatter(date3, 'yyyy-MM-ddThh:mm'));
        this.dateeffetQuitance = (dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        this.dateEcheanceQuitance = (dateFormatter(date3, 'yyyy-MM-ddThh:mm'));
        this.reemettre.get('addForm.dateeffetcontrat').setValue(dateFormatter(dateEff, 'yyyy-MM-ddThh:mm'));
        break;
      }

    }


  }

  onChangeNbJours(event) {
    const date2: Date = new Date(this.police.poli_dateecheance);
    date2.setDate(date2.getDate() + Number(event));
    this.periode = ((event /30) );

    this.validEcheance = true;
    this.reemettre.get('myForm.poli_dateecheance').setValue(dateFormatter(date2, 'yyyy-MM-ddThh:mm'));
  }

  onChangeNbAcheteur(event) {
    /* this.nbAcheteur = Number(event.target.value);
    const acheteurs = this.myForm.get('acheteurs') as FormArray;
    if (this.nbAcheteur > acheteurs.length) {
      this.addacheteur = true;
    } else {
      this.addacheteur = false;
    } */

  }

  ajoutAcheteur(dialog: TemplateRef<any>) {

  }


  deleteAcheteur(i) {
  }




  tariferDomestique(montant, duree, type) {

    let type_traitement: number = 1;
    const type_risque: string = this.risque.risq_modegestion || 'RC';
    const acheteur: string = /*this.myForm.get('achet_type').value || */'prive';
    const ca: string = this.risque.risq_genrerisque || 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;

    this.policeService.tariferPolice(Number(montant), this.produitSelected, this.police.poli_intermediaire, typeCa, type_traitement, type_risque, 1, duree)
      .subscribe((data: any) => {

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

    this.policeService.tariferPolice(Number(montant), this.reemettre.get('myForm.poli_codeproduit').value, this.reemettre.get('myForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0)
      .subscribe((data: any) => {


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

    this.policeService.tariferPolice(Number(montant), this.reemettre.get('myForm.poli_codeproduit').value, this.reemettre.get('myForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0)
      .subscribe((data: any) => {


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
    this.policeService.ajoutAcheteur(this.police.poli_numero, this.reemettre.value)
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




  valider() {


    this.policeService.getPolice(this.reemettre.get('addForm.numeropolice').value)
      .subscribe((data: Police) => {
        this.police = data;
        this.police.poli_dateeffetencours = dateFormatter(this.police?.poli_dateeffetencours, 'yyyy-MM-ddThh:mm');
        this.police.poli_dateecheance = dateFormatter(this.police?.poli_dateecheance, 'yyyy-MM-ddThh:mm');
        this.reemettre.get('myForm').setValue(this.police);


        this.onGetActePolice(this.reemettre.get('addForm.numeropolice').value);
        this.onGetRisquePolice(this.reemettre.get('addForm.numeropolice').value);
        this.onGetAllCategorieByBranche(data.poli_branche);
        this.onGetAllProduitByCategorie(data.poli_categorie);
        this.brancheSelected = data.poli_branche.toString();
        this.categorieSelected = data.poli_categorie.toString();
        this.produitSelected = data.poli_codeproduit.toString();


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

    switch (this.reemettre.get('addForm.typeAvenant').value) {
      case "1": {
        this.showModifDateEcheanceSeule = false;
        this.isCorrectionEngagEcran = true;
        this.affichTarif = true;
        //this.onGetRisquePolice(this.addForm.controls['numeropolice'].value);
        this.showreadonly = true;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.tarifTrimestrielle = false;
        this.displayFacture = true;
        break;
      }
      case "2": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = true;
        this.showreadonly = true;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.tarifTrimestrielle = false;
        this.displayFacture = true;
        break;
      }
      case "3": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = false;
        this.showreadonly = true;
        this.showModifDateEcheanceSeule2 = true;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.tarifTrimestrielle = false;
        this.displayFacture = true;
        break;
      }
      case "4": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = false;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = false;
        this.tarifTrimestrielle = true;
        this.displayFacture = false;
        break;
      }
      case "5": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = false;
        this.renouvelPolice = true;
        this.ajoutAcheteurs = false;
        break;
      }
      case "6": {
        this.isCorrectionEngagEcran = false;
        this.showModifDateEcheanceSeule = false;
        this.renouvelPolice = false;
        this.ajoutAcheteurs = true;
        break;
      }


    }



  }

  reemettreEcheanceSeuleLaste() {

    this.factureService.reemettreFactEcheanceSeuleLaste(this.reemettre.value).
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
  //all reemetre facture
  reemettreEcheanceSeule() {

    this.factureService.reemettreFactEcheanceSeule(this.reemettre.get('myForm').value, this.reemettre.get('addForm.typeAvenant').value, this.reemettre.get('addForm.numerofacture').value).
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


  tarifer() {

    //this.typeca=='CA_GLOBAL-prive';

    console.log(this.periode);
    // this.policeService.tarifer(this.reemettre.get('myForm').value, this.acte, this.typeca, this.traitement, this.typeRisque, Number(this.reemettre.get('addForm.typeAvenant').value)).
    this.policeService.tariferTarifTrimestrielleTauxPref(this.reemettre.get('myForm').value, this.acte, this.typeca, this.traitement, this.typeRisque, Number(this.reemettre.get('addForm.typeAvenant').value), Number(this.tauxPreferentiel))
      .subscribe((data: Tarif) => {

        this.tarif = data;
        this.validbuttonecheance2 = true;
        if (this.CorrectionEngag == true) {
          this.validButtonCorrectionEngag = true;

        }


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


  tariferParPeriode() {

    console.log(this.reemettre.get('myForm').value);
    console.log(this.acte);
    console.log(this.traitement);
    console.log(this.typeRisque);
    console.log(this.reemettre.get('addForm.typeAvenant').value);

    console.log(this.periode);
    this.policeService.tariferPeriode(this.reemettre.get('myForm').value, this.acte, this.traitement, this.typeRisque, Number(this.reemettre.get('addForm.typeAvenant').value), this.periode,Number(this.tauxPreferentiel)).
      subscribe((data: Tarif) => {

        this.tarif = data;
        this.validbuttonecheance2 = true;
        if (this.CorrectionEngag == true) {
          this.validButtonCorrectionEngag = true;

        }


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


    this.reemettre.get('myForm.poli_primenettotal').setValue(this.tarif.primeNette);
    this.reemettre.get('myForm.poli_primebruttotal').setValue(this.tarif.primeTTC);
    //this.reemettre.get('myForm.poli_dateeffetencours').setValue(this.police.poli_dateecheance);

    this.policeService.modifPoliceEcheance2(this.reemettre.get('myForm').value, this.tarif, this.reemettre.get('addForm.typeAvenant').value, this.reemettre.get('addForm.numerofacture').value)
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

  validerEcheance2Trimestrielle() {


    this.reemettre.get('myForm.poli_primenettotal').setValue(this.tarif.primeNette);
    this.reemettre.get('myForm.poli_primebruttotal').setValue(this.tarif.primeTTC);
    this.reemettre.get('myForm.poli_dateeffetencours').setValue(this.police.poli_dateecheance);


    this.policeService.modifPoliceTarifTrimestrielle(this.reemettre.get('addForm').value, this.reemettre.get('myForm').value, this.tarif, this.reemettre.get('addForm.typeAvenant').value, this.reemettre.get('addForm.numerofacture').value)
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

  CorrectionEngag: boolean = false;
  onChangeCapAssure(event) {
    this.acte.act_capitalassure = Number(event);
    this.CorrectionEngag = true;
    // this.validButtonCorrectionEngag = true; 
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



    this.reemettre.get('myForm.poli_primenettotal').setValue(this.tarif?.primeNette);
    this.reemettre.get('myForm.poli_primebruttotal').setValue(this.tarif?.primeTTC);
    // this.reemettre.get('myForm.poli_dateeffetencours').setValue(this.police?.poli_dateecheance);
    console.log(this.reemettre.get('myForm').value);
    this.policeService.modifPoliceCorrectionEngag(this.reemettre.get('myForm').value, this.tarif, this.acte, this.reemettre.get('addForm.typeAvenant').value, this.reemettre.get('addForm.numerofacture').value)
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

    this.getDifferenceInDays(new Date(this.police.poli_dateecheance), new Date(this.police.poli_dateeffetencours));

    /* if(this.myForm.get('type_traitement').value == 'express'){
      type_traitement = 2;
    } */


    if (this.produitSelected == '14003001') {
      this.duree = 0;
    }
    if (this.produitSelected == '14002001' || this.produitSelected == '16008001') {
      capital = this.somCapitalExport;
    }
    // tslint:disable-next-line:max-line-length
    this.policeService.tariferPolice(capital, this.produitSelected, this.police.poli_intermediaire, typeCa, type_traitement, type_risque, 1, this.duree)
      .subscribe((data: any) => {

        this.accessoirecompagnie = data.accessoireCompagnie;
        this.reemettre.get('quittanceForm.quit_accessoirecompagnie').setValue(data.accessoireCompagnie);
        this.accessoireapporteur = data.accessoireapporteur;
        this.reemettre.get('quittanceForm.quit_accessoireapporteur').setValue(this.accessoireapporteur);
        this.tauxCom = data.tauxCommission;
        this.commissionsapporteur1 = data.montantCommission;
        this.reemettre.get('quittanceForm.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);
        this.primenette = data.primeNette;
        this.reemettre.get('quittanceForm.quit_primenette').setValue(this.primenette);
        this.tauxAp = data.tauxProduit;

        this.taxeTE = data.montantTaxe;

        this.reemettre.get('quittanceForm.quit_mtntaxete').setValue(this.taxeTE);

        if (this.produitSelected == '14003001' || this.produitSelected == '14002001' || this.produitSelected == '16008001') {
          this.primenette = this.primeNetteDom;
          this.reemettre.get('quittanceForm.quit_primenette').setValue(this.primenette);
          this.tauxAp = 0;
          this.taxeTE = ((this.primeNetteDom + this.accessoirecompagnie + this.accessoireapporteur) * data.tauxTaxe) / 100;

          this.reemettre.get('quittanceForm.quit_mtntaxete').setValue(this.taxeTE);
          this.commissionsapporteur1 = (this.primeNetteDom * data.tauxCommission) / 100;
          this.reemettre.get('quittanceForm.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);
        }

        this.primebrute = Number(this.primenette) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
        this.reemettre.get('quittanceForm.quit_primettc').setValue(this.primebrute);

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

  clearTarif() {
    this.reemettre.get('quittanceForm.quit_accessoirecompagnie').setValue('');
    this.reemettre.get('quittanceForm.quit_accessoireapporteur').setValue('');
    this.reemettre.get('quittanceForm.quit_commissionsapporteur1').setValue('');
    this.reemettre.get('quittanceForm.quit_primenette').setValue('');
    this.reemettre.get('quittanceForm.quit_mtntaxete').setValue('');
    this.reemettre.get('quittanceForm.quit_primettc').setValue('');
    // this.tauxAp = 0;

    // vider les données de la tarification
    this.tarif.tauxProduit = 0;
    this.tarif.tauxCommission = 0;
    this.tarif.montantCommission = 0;
    this.tarif.primeNette = 0;
    this.tarif.accessoireCompagnie = 0;
    this.tarif.accessoireapporteur = 0;
    this.tarif.montantTaxe = 0;
    this.tarif.primeTTC = 0;

  }
}