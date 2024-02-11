import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { of, ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Client } from '../../../../../model/Client';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { Produit } from '../../../../../model/Produit';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { PoliceService } from '../../../../../services/police.service';
import { ProduitService } from '../../../../../services/produit.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import types from '../../../../data/type.json';
import dateFormatter from 'date-format-conversion';
import { FormatNumberService } from '../../../../../services/formatNumber.service';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { AjoutLotComponent } from './ajout-lot/ajout-lot.component';
import { AjoutAcheteurComponent } from './ajout-acheteur/ajout-acheteur.component';
import { Router } from '@angular/router';
import { Propos } from '../../../../../model/Propos';
import { Prospect } from '../../../../../model/Prospect';
import { BeneficiaireService } from '../../../../../services/beneficiaire.service';
import { Beneficiaire } from '../../../../../model/Beneficiaire';

@Component({
  selector: 'ngx-ajout-police',
  templateUrl: './ajout-police.component.html',
  styleUrls: ['./ajout-police.component.scss']
})
export class AjoutPoliceComponent implements OnInit {
  listeCodeBranche: Branche[];
  listeNumeroIntermediaire: Array<Intermediaire> = new Array<Intermediaire>();
  client: Client;
  prospect: Prospect;
  listeNumeroCategorie: Categorie[];
  propo: Propos;

  primeReduit: any;

  myForm = this.fb.group({

    policeForm: this.fb.group({

      //police
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
      poli_prospect: [''],
      poli_dateeffet1: [''],
      poli_dateanniversaire: [''],
      poli_dateeffetencours: ['', [Validators.required]],
      poli_dateecheance: ['', [Validators.required]],
      poli_duree: [''], //(durée en mois)
      poli_daterevision: [''],
      poli_typecontrat: ['', [Validators.required]],
      poli_typerevision: [''],
      poli_typegestion: ['', [Validators.required]],
      poli_codefractionnement: ['', [Validators.required]],
      poli_primenetreference: [''],
      poli_primenettotal: [''],
      poli_primebruttotal: [''],
      poli_coefbonus: [''],
      poli_remisecommerciale: [''],
      poli_numeroattestation: [''],
      poli_numerocertificat: [''],
      poli_policeremplacee: [''], // oblig pour la reprisse des données
      poli_typefacultive: [''],
      poli_numeroplancoassur: [''],
      poli_numeroplanreassfac: [''],
      poli_numerodernieravenant: [''],
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
      // poli_datemodification: ['', [Validators.required]],

    }),
    risque: this.fb.group({
      risq_numeropolice: [''],
      risq_numero: [''],
      risq_numeroacte: [''],
      risq_typerisque: [''],
      risq_designation1: ['', [Validators.required]],
      risq_designation2: [''],
      risq_localisation1: ['', [Validators.required]],
      risq_localisation2: [''],
      risq_gps: [''],
      risq_capitalassure: ['', [Validators.required]],
      risq_capitalsmp: [''],
      risq_capitallci: [''],
      risq_pourcentfacultativeplacement: [''],
      risq_pourcentfacultativen1: [''],
      risq_pourcentfacultativen2: [''],
      risq_formulegarantierisque: [''],
      risq_codebienassurable: [''],
      risq_mtnglobalcredit: [''],
      risq_nbreecheances: [''],
      risq_nbreecheanceimpayees: [''],
      risq_codeutilisateur: [''],
      risq_datemodification: [''],
      risq_typedeclarationrevision: [''],
      risq_valeurdeclarative: [''],
      risq_typeindemnisationretenue: [''],
      risq_typefranchise: [''],
      risq_franchise: [''],
      risq_typeprotection: [''],
      risq_priseenchargeautorisee: [''],
      risq_visitetechobligatoire: [''],
      risq_visitetechperiodicite: [''],
      risq_visitetechrapport: [''],
      risq_visitetechdate: [''],
      risq_status: [''],
      risq_genrerisque: [''],
      risq_modegestion: [''],
    }),
    risqueLocatif: this.fb.group({
      riskl_numero: [''],
      riskl_numerorisquegenerique: [''],
      riskl_numeroclient: [''],
      riskl_numeroacheteur: [''],
      riskl_numeropolice: [''],
      riskl_type: [''],
      riskl_description: [''],
      riskl_mtnloyer: [''],
      riskl_nombreloyerimpaye: [''],
      riskl_mtnloyerimpaye: [''],
      riskl_mntloyerindemnite: [''],
      riskl_mntloyerrecouvre: [''],
      risql_codeutilisateur: [''],
    }),
    acte: this.fb.group({
      act_numero: [''],
      act_numeropolice: [''],
      act_typegarantie: [''],
      act_typemarche: [''],
      act_numeromarchepublic: [''],
      act_codemarche: [''],
      act_datemarche: [''],
      act_idcontractante: [''],
      act_idbeneficiaire: [''],
      act_idcandidat: [''],
      act_descriptionmarche: [''],
      act_capitalassure: [''],
      act_capitalsmp: [''],
      act_capitallci: [''],
      act_anciennumero: [''],
      act_status: [''],
      act_datecomptabilisation: [''],
    }),
    beneficiaire: this.fb.group({
      benef_id: [''],
      benef_Num: [''],
      benef_typbenef: ['', [Validators.required]],
      benef_nom: [''],
      benef_prenoms: [''],
      benef_denom: ['', [Validators.required]],
      benef_status: [''],
      benef_ccutil: [''],
      benef_datemo: [''],
    }),
    marche: this.fb.group({
      march_numero: [''],
      march_identification: [''],
      march_idcontractante: [''],
      march_donneurordre: ['', [Validators.required]],
      march_descriptionmarche1: ['', [Validators.required]], // * a enlever pour locasure
      march_descriptionmarche2: [''],
      march_nombrelots: [''],
      march_dureeenmois: [''],
      march_capitalglobalmarche: [''],
      march_capitalglobalsmpmarche: [''],
      march_capitalglobalslcimarche: [''],
      march_status: [''],
      march_datemodification: [''],
      march_codeutil: [''],
      march_type: [''],
      march_numeroacte: [''],
      march_date_debut: [''],

    }),
    lots: this.fb.array([]),
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
    risqueR: this.fb.group({
      riskr_numero: [''],
      riskr_numerorisquegenerique: [''],
      riskr_numeroclient: [''],
      riskr_numeropolice: [''],
      riskr_type: ['', [Validators.required]],// seule obligatoire pour locassure
      riskr_description: [''],
      riskr_mtncaution: ['', [Validators.required]],
      riskr_mtncouverturefinanciere: [''],
      riskr_dateexigibilite: [''],
      riskr_daterenouvellement: [''],
      riskr_capitauxgaranti: [''],
      riskr_beneficiaire: [''],
      riskr_revision: [''],
      riskr_daterevision: [''],
      riskr_codeutilisateur: [''],
      riskr_agrement: ['', [Validators.required]],
      riskr_dateagrement: ['', [Validators.required]],
      riskr_adresse: ['', [Validators.required]],
      riskr_typedeposit: ['', [Validators.required]],
      riskr_deposit: ['', [Validators.required]],
    }),
    credit: this.fb.group({
      credit_numero: [''],
      credit_numeroclient: [''],
      credit_numeroachateur: [''],
      credit_type: [''],
      credit_typemarchandise: [''],
      credit_mtncredit: [''],
      credit_nbecheanceaccorde: [''],
      credit_nbechenaceretard: [''],
      credit_nbecheanceimpaye: [''],
      credit_mntindemnite: [''],
      credit_mtnrecours: [''],
      credit_mtnrecoursencaisse: [''],
      credit_chargerecouvrement: [''],
      credit_codeutil: [''],
      credit_datemodification: [''],
      credit_numpol: [''],
    }),
    acheteurs: this.fb.array([]),

  });
  poli_codecategorie: string;
  poli_codeproduit: string;
  listeNumeroProduit: Produit[];
  codeProduitChoisi: any;
  brancheChoisi: string;
  typeBenef: string;



  public intermediaireCtrl: FormControl = new FormControl();

  public intermediaireFilterCtrl: FormControl = new FormControl();

  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();
  listTypeFractionnement: any;
  listTypeclient: any[] = types;
  codeApporteurChoisi: any;
  proratis: boolean = false;
  errorDomestique: boolean = false;
  duree: number = 0;
  listTypeGestion: any;
  listTypeContrat: any;
  listTypeBenef: any;
  showPlacement: boolean = false;
  listTypeMarche: any;
  nbLots: number;
  addLot: boolean = true;
  somTotLots: number = 0;
  errorSomLots: boolean = false;
  showDateExo: boolean;
  primenette: any;
  accessoirecompagnie: any = 0;
  accessoireapporteur: any;
  commissionsapporteur1: any;
  tauxAp: any;
  taxeTE: number;
  primebrute: number;
  reduction: number;

  showcautionS: boolean = false;
  showcautionR: boolean = false;


  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  tauxCom: any;
  listTypeRisqueRgl: any;
  listTypeDeposit: any;
  listTypeCredit: any;
  listNatureCredit: any;
  listTypeCouverture: any;
  nbAcheteur: any;
  addacheteur: boolean;
  somTotAcheteurs: number = 0;
  errorSomAcheteurs: boolean;
  loading: boolean = false;

  primeNetteDom: number = 0;
  somCapitalExport: number = 0;
  typeAcheteur: string;
  listTypeLocatif: any;
  typpe: number;
  transfert: any;
  errorDateExo: boolean;
  errorDateSub: boolean;
  errorDateSoumi: boolean = true;
  errorDateMarche: boolean = true;
  dateEffet: Date;
  dateSoumission: Date;
  dateEcheance: Date;

  personnePhysique = "1";
  personneMorale = "2";

  numBenef: any = "";
  afficherlisteBenef: boolean = true;
  readonlyPrenom: boolean = false;
  afficherNom_Denom: boolean = true;
  afficherDenom: boolean = false;
  afficherNom: boolean = false;
  afficherPrenom: boolean = true;
  denomBeneficiaire: any = "";
  nomBeneficiaire: any = "";

  showTauxPreferentielle: boolean = false;
  afficheTauxPref: boolean = false;
  afficheMesssageTauxPref: boolean = false
  tauxPreferentiel: any = 0;

  listeBeneficiaires: Array<Beneficiaire> = new Array<Beneficiaire>();
  public beneficiairesCtrl: FormControl = new FormControl();
  public beneficiairesFilterCtrl: FormControl = new FormControl();
  public filteredBeneficiaires: ReplaySubject<Beneficiaire[]> = new ReplaySubject<Beneficiaire[]>();

  constructor(private brancheService: BrancheService, private interService: IntermediaireService,
    private transfertData: TransfertDataService, private categorieService: CategorieService, private fb: FormBuilder,
    private policeService: PoliceService, private produitService: ProduitService,
    private formatNumber: FormatNumberService, private dialogService: NbDialogService,
    private toastrService: NbToastrService, private router: Router,
    private beneficiareService: BeneficiaireService
  ) { }

  ngOnInit(): void {
    this.transfert = this.transfertData.getData();

    this.typpe = this.transfert['type'];
    this.client = this.transfert.client;
    this.prospect = this.transfert.prospect;

    this.getLibelleClient();
    this.onGetAlllisteBeneficiaires();
    //fuction a charger

    this.onGetAllIntermediaires();
    this.onGetAllBranches();

    // variable à initialiser
    this.myForm.get('policeForm.poli_compagnie').setValue('SNNVIAS008');
    this.myForm.get('policeForm.poli_codepays').setValue('221: Sénégal');
    this.myForm.get('policeForm.poli_souscripteur').setValue('Souscripteur');
    this.myForm.get('risque.risq_capitalassure').setValue(0);
    this.myForm.get('policeForm.poli_typecontrat').setValue('1');
    this.myForm.get('policeForm.poli_typegestion').setValue('1');
    this.myForm.get('policeForm.poli_codefractionnement').setValue('1');

    this.listTypeFractionnement = this.listTypeclient['TYPE_FRACTIONNEMENT'];
    this.listTypeGestion = this.listTypeclient['TYPE_GESTION'];
    this.listTypeContrat = this.listTypeclient['CLAUSES_CONTRAT'];
    this.listTypeBenef = this.listTypeclient['TYPE_BENEFICIAIRE'];
    this.listTypeMarche = this.listTypeclient['TYPE_MARCHE'];
    this.listTypeRisqueRgl = this.listTypeclient['TYPE_RISQUE_REGL'];
    this.listTypeDeposit = this.listTypeclient['TYPE_DEPOSIT'];
    this.listTypeCredit = this.listTypeclient['TYPE_RISQUE_CREDIT'];
    this.listNatureCredit = this.listTypeclient['TYPE_NATURE_CREDIT'];
    this.listTypeCouverture = this.listTypeclient['TYPE_COUVERTURE'];
    this.listTypeLocatif = this.listTypeclient['TYPE_RISQUE_LOCATIF'];


    this.myForm.get('credit.credit_type').setValue("1");

    this.intermediaireFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererIntermediaires();
      });

    this.beneficiairesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererBeneficiaires();
      });

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filtererIntermediaires() {
    if (!this.listeNumeroIntermediaire) {
      return;
    }

    let search = this.intermediaireFilterCtrl.value;
    if (!search) {
      this.filteredIntermediaire.next(this.listeNumeroIntermediaire.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredIntermediaire.next(
      this.listeNumeroIntermediaire.filter(c => c.inter_denomination.toLowerCase().indexOf(search) > -1 ||
        c.inter_numero.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  protected filtererBeneficiaires() {
    if (!this.listeBeneficiaires) {
      return;
    }

    let search = this.beneficiairesFilterCtrl.value;
    if (!search) {
      this.filteredBeneficiaires.next(this.listeBeneficiaires.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBeneficiaires.next(
      this.listeBeneficiaires.filter(c => c.benef_Num.toString().toLowerCase().indexOf(search) > -1 ||
        c?.benef_nom?.toLowerCase().indexOf(search) > -1 ||
        c?.benef_prenoms?.toLowerCase().indexOf(search) > -1 ||
        c?.benef_denom?.toLowerCase().indexOf(search) > -1)
    );
  }

  onGetAlllisteBeneficiaires() {
    this.beneficiareService.findAllBeneficiaires()
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.listeBeneficiaires = data.data as Beneficiaire[];
          this.filteredBeneficiaires.next(this.listeBeneficiaires.slice());
        } else {
          this.listeBeneficiaires = data.data;
        }

      });
  }

  onChangeNumBenef(event) {

    if (event.value != null && event.value != "") {
      // ================= l'utilisateur a choisi un bénéficiaire existant donc nom/denomination non obligatoire ================
      this.myForm.get('beneficiaire.benef_denom').clearValidators();
      this.readonlyPrenom = true;
      this.afficherNom_Denom = false;
      this.numBenef = Number(event.value);

      this.beneficiareService.findBeneficiaireByNum(this.numBenef)
        .subscribe((data: any) => {
          if (data.code === "ok") {
            this.myForm.get('beneficiaire.benef_Num').setValue(this.numBenef);
            this.myForm.get('beneficiaire.benef_prenoms').setValue(data.data?.benef_prenoms);
            this.nomBeneficiaire = data.data?.benef_nom;
            this.myForm.get('beneficiaire.benef_nom').setValue(this.nomBeneficiaire);
            this.denomBeneficiaire = data.data?.benef_denom;
            this.myForm.get('beneficiaire.benef_denom').setValue(this.denomBeneficiaire);


            if (this.denomBeneficiaire === "" || this.denomBeneficiaire === null) {
              this.afficherDenom = false;
              this.afficherNom = true;
              this.afficherPrenom = true
            } else {
              this.afficherDenom = true;
              this.afficherNom = false;
              this.afficherPrenom = false;
            }
          }
        });

    } else {

      // ============ l'utilisateur n'a pas choisi un bénéficiaire: donc il doit saisir ========

      this.readonlyPrenom = false;
      this.afficherDenom = false;
      this.afficherNom = false;
      this.afficherNom_Denom = true;
      this.afficherPrenom = true;

      this.beneficiairesCtrl.setValue("");
      this.myForm.get('beneficiaire.benef_Num').setValue("");
      this.myForm.get('beneficiaire.benef_prenoms').setValue("");
      this.myForm.get('beneficiaire.benef_nom').setValue("");
      this.nomBeneficiaire = "";
      this.myForm.get('beneficiaire.benef_denom').setValue("");
      this.denomBeneficiaire = "";

      this.myForm.get('beneficiaire.benef_denom').setValidators(Validators.required);
    }

    this.myForm.get('beneficiaire.benef_denom').updateValueAndValidity();

  }

  beneftype: any;

  //chargement

  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.listeCodeBranche = data as Branche[];
      });
  }

  onGetAllIntermediaires() {
    this.interService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.listeNumeroIntermediaire = data as Intermediaire[];
        this.filteredIntermediaire.next(this.listeNumeroIntermediaire.slice());
      });
  }

  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[];
      });
  }

  onGetAllProduitByCategorie(categorie: number) {
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.listeNumeroProduit = data as Produit[];
      });
  }

  onChangeText(event) {

    // this.addForm.controls['risq_designation1'].setValue(event.target.value);
    this.myForm.get('risque.risq_designation1').setValue(event.target.value);
    if (this.showcautionS == true) {
      this.myForm.get('marche.march_descriptionmarche1').setValue(event.target.value);
    }

  }

  onChangeText1(event) {
    this.myForm.get('risqueLocatif.riskl_description').setValue(event.target.value);
    if (this.showcautionS == true) {
      this.myForm.get('marche.march_descriptionmarche1').setValue(event.target.value);
    }

  }

  //Onchange

  onChangeBranche(event) {

    this.onGetAllCategorieByBranche(event);
    this.myForm.get('policeForm.poli_branche').setValue(event);


    this.poli_codecategorie = "".toString();
    this.poli_codeproduit = "".toString();
    this.myForm.get('policeForm.poli_categorie').setValue(this.poli_codecategorie);
    this.myForm.get('policeForm.poli_codeproduit').setValue(this.poli_codeproduit);
    this.brancheChoisi = event;



    if (event == '15') {
      // Remettre les valeurs par defaut
      this.afficherlisteBenef = true;
      this.afficherNom_Denom = true;
      this.afficherDenom = false;
      this.afficherNom = false;
      this.afficherPrenom = true;
      this.readonlyPrenom = false;
      this.denomBeneficiaire = "";
      this.nomBeneficiaire = "";

      this.typeBenef = '1';
      this.myForm.get('beneficiaire.benef_typbenef').setValue(this.typeBenef);
      this.myForm.get('beneficiaire.benef_Num').setValue('');
      this.myForm.get('beneficiaire.benef_nom').setValue('');
      this.myForm.get('beneficiaire.benef_prenoms').setValue('');
      this.myForm.get('beneficiaire.benef_denom').setValue('');

      for (const key in this.myForm.get('credit')['controls']) {
        this.myForm.get(`credit.${key}`).clearValidators();
        this.myForm.get(`credit.${key}`).updateValueAndValidity();
      }

      this.myForm.get('beneficiaire.benef_denom').setValidators(Validators.required);
      this.myForm.get('beneficiaire.benef_denom').updateValueAndValidity();
    }
    else if (event == '16') {
      // Remettre les valeurs par defaut
      this.afficherlisteBenef = true;
      this.afficherNom_Denom = true;
      this.afficherDenom = false;
      this.afficherNom = false;
      this.afficherPrenom = true;
      this.readonlyPrenom = false;
      this.denomBeneficiaire = "";
      this.nomBeneficiaire = "";

      this.myForm.get('beneficiaire.benef_typbenef').setValue('');
      this.myForm.get('beneficiaire.benef_Num').setValue('');
      this.myForm.get('beneficiaire.benef_nom').setValue('');
      this.myForm.get('beneficiaire.benef_prenoms').setValue('');
      this.myForm.get('beneficiaire.benef_denom').setValue('');

      this.myForm.get('beneficiaire.benef_denom').setValidators(Validators.required);
      this.myForm.get('beneficiaire.benef_denom').updateValueAndValidity();

    }
    else if (event == '14') {
      this.typeBenef = '2';

      this.afficherlisteBenef = false;
      this.afficherNom_Denom = false;

      if (this.prospect == null) {

        this.myForm.get('beneficiaire.benef_typbenef').setValue(this.typeBenef);

        // On vérifie d'abord si ce client n'est pas enregistré dans la table bénéficiaire
        if (this.client != null && this.client.clien_nature == this.personnePhysique) {

          this.beneficiareService.findBeneficiaireByNomAndPrenom(this.client.clien_nom, this.client.clien_prenom)
            .subscribe((data: any) => {
              if (data.code === "ok") {
                // Mettre les infos du bénéf avec numéro bénéf
                this.myForm.get('beneficiaire.benef_Num').setValue(data.data[0].benef_Num);
                this.myForm.get('beneficiaire.benef_nom').setValue(this.client.clien_nom || '');
                this.myForm.get('beneficiaire.benef_prenoms').setValue(this.client.clien_prenom || '');

              } else {
                // Mettre les infos du bénéf sans numéro pour qu'on l'enregistre
                this.myForm.get('beneficiaire.benef_nom').setValue(this.client.clien_nom || '');
                this.myForm.get('beneficiaire.benef_prenoms').setValue(this.client.clien_prenom || '');
              }
            });

          // ============ Pour l'affichage ================
          this.afficherDenom = false;
          this.afficherNom = true;
          this.afficherPrenom = true;
          this.readonlyPrenom = true;
          this.denomBeneficiaire = "";
          this.nomBeneficiaire = this.client.clien_nom;

        } else if (this.client != null && this.client.clien_nature == this.personneMorale) {
          this.beneficiareService.findBeneficiaireByDenomination(this.client.clien_denomination)
            .subscribe((data: any) => {
              if (data.code === "ok") {
                this.myForm.get('beneficiaire.benef_Num').setValue(data.data[0].benef_Num);
                this.myForm.get('beneficiaire.benef_denom').setValue(this.client.clien_denomination || '');

              } else {
                this.myForm.get('beneficiaire.benef_denom').setValue(this.client.clien_denomination || '');
              }
            });

          // ===================== Pour l'affichage ================
          this.afficherDenom = true;
          this.afficherNom = false;
          this.afficherPrenom = false;
          this.readonlyPrenom = true;
          this.denomBeneficiaire = this.client.clien_denomination;
          this.nomBeneficiaire = "";
        }

        this.myForm.get('beneficiaire.benef_denom').clearValidators();
        this.myForm.get('beneficiaire.benef_denom').updateValueAndValidity();
        // this.myForm.get('beneficiaire.benef_nom').setValue(this.client.clien_nom || '');
        // this.myForm.get('beneficiaire.benef_prenoms').setValue(this.client.clien_prenom || '');
        // this.myForm.get('beneficiaire.benef_denom').setValue(this.client.clien_denomination || '');
        // this.myForm.get('beneficiaire.benef_denom').setValue(this.myForm.get('beneficiaire.benef_prenoms').value + " " + this.myForm.get('beneficiaire.benef_nom').value + " " + this.myForm.get('beneficiaire.benef_denom').value);


      } else {
        this.myForm.get('beneficiaire.benef_typbenef').setValue(this.typeBenef);
        this.myForm.get('beneficiaire.benef_nom').setValue(this.prospect.prospc_nom || '');
        this.myForm.get('beneficiaire.benef_prenoms').setValue(this.prospect.prospc_prenom || '');
        this.myForm.get('beneficiaire.benef_denom').setValue(this.prospect.prospc_denomination || '');
        this.myForm.get('beneficiaire.benef_denom').setValue(this.myForm.get('beneficiaire.benef_prenoms').value + " " + this.myForm.get('beneficiaire.benef_nom').value + " " + this.myForm.get('beneficiaire.benef_denom').value);

      }

      for (const key in this.myForm.get('risqueR')['controls']) {
        this.myForm.get(`risqueR.${key}`).clearValidators();
        this.myForm.get(`risqueR.${key}`).updateValueAndValidity();
      }

      for (const key in this.myForm.get('marche')['controls']) {
        this.myForm.get(`marche.${key}`).clearValidators();
        this.myForm.get(`marche.${key}`).updateValueAndValidity();
      }

    }

    this.clearTarif();
  }

  onChangeCategorie(event) {
    this.onGetAllProduitByCategorie(event);
    //this.numCategChoisi = event;
    this.myForm.get('policeForm.poli_categorie').setValue(event);
    this.poli_codeproduit = "".toString();
    this.myForm.get('policeForm.poli_codeproduit').setValue(this.poli_codeproduit);
    this.clearTarif();


  }

  onChangeProduit(event) {
    this.codeProduitChoisi = event;
    this.myForm.get('policeForm.poli_codeproduit').setValue(event);

    this.clearTarif();

    this.myForm.get('acte.act_typegarantie').setValue(this.listeNumeroProduit.find(p => p.prod_numero == event).prod_denominationlong);
    this.myForm.get('risque.risq_typerisque').setValue(this.listeNumeroProduit.find(p => p.prod_numero == event).prod_numero);

    if (event >= '15001001' && event <= '15001005') {
      this.showcautionS = true;
      this.showcautionR = false;
      for (const key in this.myForm.get('risqueR')['controls']) {
        this.myForm.get(`risqueR.${key}`).clearValidators();
        this.myForm.get(`risqueR.${key}`).updateValueAndValidity();
      }

    } else if (event >= '15001006' && event <= '15001010') {
      this.showcautionS = false;
      this.showcautionR = true;
      for (const key in this.myForm.get('marche')['controls']) {
        this.myForm.get(`marche.${key}`).clearValidators();
        this.myForm.get(`marche.${key}`).updateValueAndValidity();
      }
      this.errorSomLots = false;
    } else if (event = '16008001') {
      for (const key in this.myForm.get('risqueR')['controls']) {
        this.myForm.get(`risqueR.${key}`).clearValidators();
        this.myForm.get(`risqueR.${key}`).updateValueAndValidity();
      }
      for (const key in this.myForm.get('marche')['controls']) {
        this.myForm.get(`marche.${key}`).clearValidators();
        this.myForm.get(`marche.${key}`).updateValueAndValidity();
      }
    } else {
      this.showcautionS = false;
      this.showcautionR = false;
      this.errorSomLots = false;
    }


  }

  onChangeIntermediaire(event) {

    this.codeApporteurChoisi = event.value;
    this.myForm.get('policeForm.poli_intermediaire').setValue(event.value);
    this.clearTarif();
  }

  onChangeTypeFractionnement(event) {
    this.errorDomestique = false;
    this.myForm.get('policeForm.poli_codefractionnement').setValue((this.listTypeFractionnement.find(p => p.id === event)).id);

    this.getDateEcheanceContrat();
    this.clearTarif();
  }

  onFocusOutEventDateEffetEnCours() {
    let periodeDebut = new Date();
    let periodeFin = new Date();
    periodeDebut.setHours(0, 0, 0, 0);

    periodeDebut.setMonth(0);

    periodeDebut.setDate(periodeDebut.getDate() + 1);


    periodeFin.setFullYear(periodeFin.getFullYear());

    if (periodeFin.getMonth() != 12) {

      periodeFin.setMonth(periodeFin.getMonth() + 1);
    } else {
      periodeFin.setMonth(periodeFin.getMonth())
    }
    periodeFin.setDate(30);
    /* if(periodeFin.getDate()==31){
      periodeFin.setDate(31);
    }else if(periodeFin.getDate()==1){
      periodeFin.setDate(30);
    } */
    periodeDebut.setDate(1);
    periodeDebut.setMonth(0);

    const date: Date = new Date(this.myForm.get('policeForm.poli_dateeffetencours').value);
    date.setHours(0, 0, 0, 0);

    if (periodeDebut <= date && date < periodeFin) {

      this.getDateEcheanceContrat();
      this.errorDateSub = false;
      this.errorDateExo = false;
    } else if (periodeDebut > date && date < periodeFin) {
      this.errorDateExo = true;
      this.myForm.get('policeForm.poli_dateecheance').setValue('');
    } else if (periodeDebut <= date && date > periodeFin) {
      this.errorDateSub = true;
      this.myForm.get('policeForm.poli_dateecheance').setValue('');
    }
    this.dateEffet = this.myForm.get('policeForm.poli_dateeffetencours').value;


    this.clearTarif();
  }
  dateFin: Date;
  onChangeNbJours(event) {
    const date2: Date = new Date(this.myForm.get('marche.march_date_debut').value);
    date2.setMonth(date2.getMonth() + Number(event));

    this.dateFin = dateFormatter(date2, 'yyyy-MM-ddThh:mm')

  }
  onChangeFocus() {

    this.dateSoumission = this.myForm.get('marche.march_date_debut').value;
    if (dateFormatter(this.dateEffet, 'yyyy-MM-dd') <= dateFormatter(this.dateSoumission, 'yyyy-MM-dd') && dateFormatter(this.dateEcheance, 'yyyy-MM-dd') >= dateFormatter(this.dateSoumission, 'yyyy-MM-dd')) {

      this.errorDateSoumi = true;
      this.errorDateMarche = true;
    } else {

      this.errorDateSoumi = false;
      this.errorDateMarche = false;
      this.myForm.get('marche.march_date_debut').setValue('');
    }
  }

  onFocusOutEventProratis(event) {
    this.duree = event.target.value;

    this.getDateEcheanceContrat();
    this.duree = event.target.value;
    this.clearTarif();

  }


  onChangeLibeleTypeContrat(event) {
    this.myForm.get('policeForm.poli_typecontrat').setValue((this.listTypeContrat.find(p => p.id === event)).id);
  }

  onChangeLibeleTypeGestion(event) {
    this.myForm.get('policeForm.poli_typegestion').setValue((this.listTypeGestion.find(p => p.id === event)).id);
  }

  onChangeCapAssure(event) {
    if (Number(this.formatNumber.replaceAll(event.target.value, ' ', '')) > 400000000) {
      this.showPlacement = true;
    } else {
      this.showPlacement = false;
    }

    this.myForm.get('risque.risq_capitalassure').setValue(Number(this.formatNumber.replaceAll(event.target.value, ' ', '')));
    this.myForm.get('acte.act_capitalassure').setValue(Number(this.formatNumber.replaceAll(event.target.value, ' ', '')));
    this.myForm.get('risqueR.riskr_mtncaution').setValue(Number(this.formatNumber.replaceAll(event.target.value, ' ', '')));
    this.clearTarif();
  }

  onChangeTypeBenef(event) {
    this.myForm.get('beneficiaire.benef_typbenef').setValue(event);

  }

  onChangeGEnreRisque(event) {
    this.myForm.get('risque.risq_genrerisque').setValue(event);
    this.clearTarif();
  }

  onChangeModeGestionRisque(event) {
    this.myForm.get('risque.risq_modegestion').setValue(event);
    this.clearTarif();
  }

  onChangeTypeMarche(event) {
    this.myForm.get('marche.march_type').setValue((this.listTypeMarche.find(p => p.id === event)).id);
  }

  onChangeNbLot(event) {
    this.nbLots = Number(event.target.value);
    const lots = this.myForm.get('lots') as FormArray;
    if (this.nbLots > lots.length) {
      this.addLot = true;
    } else {
      this.addLot = false;
    }
    this.myForm.get('marche.march_nombrelots').setValue(this.nbLots);
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

  onChangeExoneration(event) {
    if (event == "oui") {
      this.showDateExo = true;
      this.myForm.get('policeForm.poli_exonerationtaxeenr').setValue(event);
    } else {
      this.showDateExo = false;
      this.myForm.get('policeForm.poli_exonerationtaxeenr').setValue(event);
      this.myForm.get('policeForm.poli_datexoneration').setValue('');
    }
    this.tarifer();
  }

  onChangeTypeRisqueR(event) {
    this.myForm.get('risqueR.riskr_type').setValue(event);

  }

  onChangeTypeDeposit(event) {
    this.myForm.get('risqueR.riskr_typedeposit').setValue(event);

  }

  onChangeTypeCredit(event) {
    //this.myForm.get('credit.credit_type').setValue(event);
  }

  onChangeNatureCredit(event) {
    //this.myForm.get('credit.credit_nature').setValue(event);
    this.myForm.get('credit.credit_type').setValue(event);

  }

  onChangeTypeCouvertureFinassur(event) {

  }


  onChangeTypeLocatif(event) {
    this.myForm.get('risqueLocatif.riskl_type').setValue(event);
  }

  //fonctionnalité

  ajoutLot(dialog: TemplateRef<any>) {
    const lots = this.myForm.get('lots') as FormArray;
    if (this.nbLots > lots.length) {
      this.dialogService.open(AjoutLotComponent).onClose
        .subscribe((lot: FormGroup) => {
          if (lot != null) {
            this.addLot = true;
            lots.push(lot);
            this.somTotLots += Number(lot.controls['lot_capitalass'].value);
            if (Number(this.myForm.get('risque.risq_capitalassure').value) != this.somTotLots) {
              this.errorSomLots = true;
            } else {
              this.errorSomLots = false;
            }
          }
        });

    } else {
      this.addLot = false;

    }

  }

  deleteLot(i) {
    const lots = this.myForm.get('lots') as FormArray;
    if (lots.length > 1) {

      const lot = lots.at(i) as FormGroup;
      this.somTotLots -= Number(lot.controls['lot_capitalass'].value);
      lots.removeAt(i);
    } else {
      this.somTotLots = 0;
      lots.clear();
    }
    this.addLot = true;
  }
errorCred : boolean = false;
  ajoutAcheteur(dialog: TemplateRef<any>) {
    if (this.codeProduitChoisi == '14002001') {
      this.typeAcheteur = '2';
    } else if (this.codeProduitChoisi == '14003001') {
      this.typeAcheteur = '3';
    } else if (this.codeProduitChoisi == '14001001') {
      this.typeAcheteur = '1';
    } else if (this.codeProduitChoisi == '16008001') {
      this.typeAcheteur = '4';
    }

    const acheteurs = this.myForm.get('acheteurs') as FormArray;
    if (this.nbAcheteur > acheteurs.length) {
      this.dialogService.open(AjoutAcheteurComponent, {
        context: this.typeAcheteur,
      }).onClose
        .subscribe((acheteur: FormGroup) => {
          if (acheteur != null) {
            this.addacheteur = true;
            acheteurs.push(acheteur);
            this.somTotAcheteurs += Number(acheteur.controls['achet_montantcredit'].value);
            console.log(this.somTotAcheteurs);
            console.log(Number(this.myForm.get('risque.risq_capitalassure').value));
            if (Number(this.myForm.get('risque.risq_capitalassure').value) != this.somTotAcheteurs) {
              this.errorSomAcheteurs = true;
              this.errorCred = true;
            } else {
              this.errorSomAcheteurs = false;
              this.errorCred = false;
            }
            console.log(this.errorSomAcheteurs);
            if (this.codeProduitChoisi == '14002001') {
              acheteur.get('achet_avis').setValue('');

              this.tariferExport(acheteur.get('achet_montantcredit').value, this.myForm.get('risque.risq_capitalassure').value, acheteur.get('achet_typecouverture').value, acheteur.get('achet_type').value, '1');


            }

            if (this.codeProduitChoisi == '14003001') {
              this.duree = acheteur.get('achet_duree').value;
              this.tariferDomestique(acheteur.get('achet_montantcredit').value, acheteur.get('achet_duree').value, '1');

            }

            if (this.codeProduitChoisi == '16008001') {
              this.tariferLocassur(acheteur.get('achet_montant_loyer').value, acheteur.get('achet_bail').value, acheteur.get('achet_duree_bail').value, '1');

            }

            if (this.codeProduitChoisi == '14002001') {
             // this.errorSomAcheteurs = false;       a revoir
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

    if (this.codeProduitChoisi == '14002001') {
      acheteur.get('achet_avis').setValue('');


      this.tariferExport(acheteur.get('achet_montantcredit').value, this.myForm.get('risque.risq_capitalassure').value, acheteur.get('achet_typecouverture').value, acheteur.get('achet_type').value, '2');
    }

    if (this.codeProduitChoisi == '14003001') {
      this.tariferDomestique(acheteur.get('achet_montantcredit').value, acheteur.get('achet_duree').value, '2');

    }

    if (this.codeProduitChoisi == '16008001') {
      this.tariferLocassur(acheteur.get('achet_montant_loyer').value, acheteur.get('achet_bail').value, acheteur.get('achet_duree_bail').value, '2');

    }

    this.addacheteur = true;
    this.errorSomAcheteurs = true;

    if (this.codeProduitChoisi == '14002001') {
      //this.errorSomAcheteurs = false;  a revoir
      this.somCapitalExport -= acheteur.get('achet_montantcredit').value;
    }
  }
  tariferDomestique(montant, duree, type) {

    let type_traitement: number = 1;
    const type_risque: string = this.myForm.get('risque.risq_modegestion').value || 'RC';
    const acheteur: string = /*this.myForm.get('achet_type').value || */'prive';
    const ca: string = this.myForm.get('risque.risq_genrerisque').value || 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;
    this.myForm.get('credit.credit_type').setValue("2");

    this.policeService.tariferPoliceTauxPref(Number(montant), this.myForm.get('policeForm.poli_codeproduit').value, this.myForm.get('policeForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, duree,Number(this.tauxPreferentiel))
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
    const ca: string = this.myForm.get('risque.risq_genrerisque').value || 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;
    this.myForm.get('credit.credit_type').setValue("3");

    this.policeService.tariferPoliceTauxPref(Number(montant), this.myForm.get('policeForm.poli_codeproduit').value, this.myForm.get('policeForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0,Number(this.tauxPreferentiel))
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
    const type_risque: string = this.myForm.get('risque.risq_modegestion').value || 'RC';
    const acheteur: string = /*this.myForm.get('achet_type').value || */'prive';
    const ca: string = this.myForm.get('risque.risq_genrerisque').value || 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;
    this.myForm.get('credit.credit_type').setValue("4");

    this.policeService.tariferPoliceTauxPref(Number(montant), this.myForm.get('policeForm.poli_codeproduit').value, this.myForm.get('policeForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, 0,Number(this.tauxPreferentiel))
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


  //helpers

  getDifferenceInDays(date1, date2) {
    const diffInMs = Math.abs(date2 - date1);
    this.duree = Math.trunc(diffInMs / (1000 * 60 * 60 * 24));
    return Math.trunc(diffInMs / (1000 * 60 * 60 * 24 * 29));
  }

  getDateEcheanceContrat() {

    const date: Date = new Date(this.myForm.get('policeForm.poli_dateeffetencours').value);
    if (this.myForm.get('policeForm.poli_codefractionnement').value === '4') {
      //mensuel
      date.setMonth(date.getMonth() + 1);

      this.myForm.get('policeForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if (this.myForm.get('policeForm.poli_codefractionnement').value === '1') {
      //annuel

      date.setFullYear(date.getFullYear() + 1);

      this.myForm.get('policeForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));

    }
    else if (this.myForm.get('policeForm.poli_codefractionnement').value === '2') {
      //semestriel
      date.setDate(date.getDate() + 180);

      this.myForm.get('policeForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if (this.myForm.get('policeForm.poli_codefractionnement').value === '3') {
      date.setDate(date.getDate() + 90);
      this.myForm.get('policeForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }
    else if (this.myForm.get('policeForm.poli_codefractionnement').value === '5') {
      date.setDate(date.getDate() + Number(this.duree));

      this.myForm.get('policeForm.poli_dateecheance').setValue(dateFormatter(date, 'yyyy-MM-ddThh:mm'));
    }

    if (this.myForm.get('policeForm.poli_codefractionnement').value === '5')
      this.proratis = true;
    else
      this.proratis = false;

    this.getDifferenceInDays(new Date(this.myForm.get('policeForm.poli_dateecheance').value), new Date(this.myForm.get('policeForm.poli_dateeffetencours').value));
    this.dateEcheance = this.myForm.get('policeForm.poli_dateecheance').value;

  }

  getLibelleClient() {

    if (this.client?.clien_denomination === '' || this.client?.clien_denomination === null) {
      // tslint:disable-next-line:max-line-length

      this.myForm.get('policeForm.poli_client').setValue(this.client?.clien_numero + ': ' + this.client?.clien_prenom + ' ' + this.client?.clien_nom);
      this.myForm.get('marche.march_donneurordre').setValue(this.client?.clien_numero + ': ' + this.client?.clien_prenom + ' ' + this.client?.clien_nom);
    }
    else {

      // tslint:disable-next-line:max-line-length
      this.myForm.get('policeForm.poli_client').setValue(this.client?.clien_numero + ': ' + this.client?.clien_denomination);
      this.myForm.get('marche.march_donneurordre').setValue(this.client?.clien_numero + ': ' + this.client?.clien_denomination);

    }
  }
  getLibelleProspect() {
    if (this.prospect?.prospc_denomination === '' || this.prospect?.prospc_denomination === null) {
      // tslint:disable-next-line:max-line-length
      this.myForm.get('policeForm.poli_prospect').setValue(this.prospect?.prospc_numero + ': ' + this.prospect?.prospc_prenom + ' ' + this.prospect?.prospc_nom);
      this.myForm.get('marche.march_donneurordre').setValue(this.prospect?.prospc_numero + ': ' + this.prospect?.prospc_prenom + ' ' + this.prospect?.prospc_nom);
    }
    else {
      // tslint:disable-next-line:max-line-length
      this.myForm.get('policeForm.poli_prospect').setValue(this.prospect?.prospc_numero + ': ' + this.prospect?.prospc_denomination);
      this.myForm.get('marche.march_donneurordre').setValue(this.prospect?.prospc_numero + ': ' + this.prospect?.prospc_prenom + ' ' + this.prospect?.prospc_nom);

    }
  }

  result: any;
  reduc: any;
  augm: any;
  onChangeAcc(event) {
    this.reduction = this.myForm.get('policeForm.poli_remisecommerciale').value
    this.accessoirecompagnie = Number(this.formatNumber.replaceAll(event.target.value, ' ', ''));
    this.myForm.get('quittance.quit_accessoirecompagnie').setValue(this.accessoirecompagnie);
    console.log(event.target.value);
    /* this.result= ((Number(this.primebrute)* Number(this.reduction))/100);
    this.reduc=(Number(this.primebrute) - Number(this.result));
    this.augm=(Number(this.primebrute) + Number(this.result)); */
    //this.myForm.get('quittance.quit_primettc').setValue(this.primebrute);
    /* if(this.myForm.get('policeForm.poli_remisecommerciale').value==0 || this.myForm.get('policeForm.poli_remisecommerciale').value===null){
      this.myForm.get('quittance.quit_primettc').setValue(this.primebrute);
    }else{
      if(this.reduction<100){
        this.myForm.get('quittance.quit_primettc').setValue(this.reduc);
      }else
      this.myForm.get('quittance.quit_primettc').setValue(this.augm);
      } */
    this.reduction = this.myForm.get('policeForm.poli_remisecommerciale').value;
    if (this.reduction == 0 || this.reduction === null) {
      this.primeReduit = this.primenette;
    } else {
      if (this.reduction < 1) {
        this.primeReduit = (Number(this.primenette) - (Number(this.primenette) * Number(this.reduction)));
      } else
        this.primeReduit = (Number(this.primenette) + (Number(this.primenette) * Number(this.reduction)));
    }
    this.primebrute = Number(this.primeReduit) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
    this.myForm.get('quittance.quit_primettc').setValue(this.primebrute);

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
    this.clearTarif();

  }

  onChangeTauxPreferentielle(event) {
    this.tauxPreferentiel = event.target.value;
    this.afficheMesssageTauxPref = true;
  }

  tarifer() {

    if (Number(this.myForm.get('risque.risq_capitalassure').value) != this.somTotLots && this.showcautionS == true) {
      this.errorSomLots = true;
    } else {
      this.errorSomLots = false;
    }
    let type_traitement: number = 1;
    const type_risque: string = 'RC';
    const acheteur: string = /*this.myForm.get('achet_type').value || */'prive';
    const ca: string = 'CA_GLOBAL';
    const typeCa: string = ca + '-' + acheteur;
    let capital: number = this.myForm.get('risque.risq_capitalassure').value;

    // this.getDifferenceInDays(new Date(this.myForm.get('policeForm.poli_dateecheance').value), new Date(this.myForm.get('policeForm.poli_dateeffetencours').value));


    if (this.codeProduitChoisi != '14003001') {
      // this.duree = 0;
      this.getDifferenceInDays(new Date(this.myForm.get('policeForm.poli_dateecheance').value), new Date(this.myForm.get('policeForm.poli_dateeffetencours').value));
    }
    if (this.codeProduitChoisi == '14002001' || this.codeProduitChoisi == '16008001') {
      capital = this.somCapitalExport;
    }

    // this.policeService.tariferPolice(Number(capital), this.myForm.get('policeForm.poli_codeproduit').value, this.myForm.get('policeForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, this.duree, Number(this.tauxPreferentiel))
    this.policeService.tariferPoliceTauxPref(Number(capital), this.myForm.get('policeForm.poli_codeproduit').value, this.myForm.get('policeForm.poli_intermediaire').value, typeCa, type_traitement, type_risque, 1, this.duree, Number(this.tauxPreferentiel))
      .subscribe((data: any) => {

        // console.log("============= acien accessoire compagnie: " + this.myForm.get('quittance.quit_accessoirecompagnie').value);
        if (this.myForm.get('quittance.quit_accessoirecompagnie').value != '' && this.myForm.get('quittance.quit_accessoirecompagnie').value != data.accessoireCompagnie) {
          this.accessoirecompagnie = this.myForm.get('quittance.quit_accessoirecompagnie').value;
        } else {
          this.accessoirecompagnie = data.accessoireCompagnie;
        }

        // console.log("============= Accessoire compagnie: " + this.accessoirecompagnie);
        this.myForm.get('quittance.quit_accessoirecompagnie').setValue(this.accessoirecompagnie);
        // console.log("============= Nouvel accessoire compagnie: " + this.myForm.get('quittance.quit_accessoirecompagnie').value);

        this.accessoireapporteur = data.accessoireapporteur;
        this.myForm.get('quittance.quit_accessoireapporteur').setValue(this.accessoireapporteur);
        this.tauxCom = data.tauxCommission;
        this.commissionsapporteur1 = data.montantCommission;
        this.myForm.get('quittance.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);
        this.primenette = data.primeNette;
        this.myForm.get('quittance.quit_primenette').setValue(this.primenette);

        this.reduction = this.myForm.get('policeForm.poli_remisecommerciale').value;

        //this.tauxAp = data.tauxProduit;
        if (this.myForm.get('policeForm.poli_exonerationtaxeenr').value == 'oui') {
          this.taxeTE = 0;
        } else {
          this.taxeTE = data.montantTaxe;
        }
        this.myForm.get('quittance.quit_mtntaxete').setValue(this.taxeTE);

        if (this.tauxPreferentiel == 0 && (this.codeProduitChoisi == '14003001' || this.codeProduitChoisi == '14002001' || this.codeProduitChoisi == '16008001')) {
          this.primenette = this.primeNetteDom;

          this.myForm.get('quittance.quit_primenette').setValue(this.primenette);
          this.tauxAp = 0;
          this.taxeTE = ((this.primenette + this.accessoirecompagnie + this.accessoireapporteur) * data.tauxTaxe) / 100;
          if (this.myForm.get('policeForm.poli_exonerationtaxeenr').value == 'oui') {
            this.taxeTE = 0;
          }

          this.myForm.get('quittance.quit_mtntaxete').setValue(this.taxeTE);
          this.commissionsapporteur1 = (this.primenette * data.tauxCommission) / 100;
          this.myForm.get('quittance.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);

        } else if (this.tauxPreferentiel != 0 && (this.codeProduitChoisi == '14003001' || this.codeProduitChoisi == '14002001' || this.codeProduitChoisi == '16008001')) {
          // this.primenette = this.primeNetteDom;

          // this.myForm.get('quittance.quit_primenette').setValue(this.primenette);
          this.tauxAp = 0;
          this.taxeTE = ((this.primenette + this.accessoirecompagnie + this.accessoireapporteur) * data.tauxTaxe) / 100;
          if (this.myForm.get('policeForm.poli_exonerationtaxeenr').value == 'oui') {
            this.taxeTE = 0;
          }

          this.myForm.get('quittance.quit_mtntaxete').setValue(this.taxeTE);
          this.commissionsapporteur1 = (this.primenette * data.tauxCommission) / 100;
          this.myForm.get('quittance.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);
        }
        if (capital < 1500000 && this.codeProduitChoisi == '15001001') {
          this.primenette = 15000;

        } else if (capital < 1500000 && this.codeProduitChoisi > '15001001' && this.codeProduitChoisi < '15001006') {
          this.primenette = 30000;
        }
        this.myForm.get('quittance.quit_primenette').setValue(this.primenette);

        if (this.reduction == 0 || this.reduction === null || this.reduction == 100) {
          this.primeReduit = this.primenette;
          //this.primebrute = Number(this.primeReduit) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);

          this.tauxAp = data.tauxProduit;
        } else {
          if (this.reduction < 100) {
            this.primeReduit = (Number(this.primenette) - ((Number(this.primenette) * Number(this.reduction)) / 100));
            this.tauxAp = data.tauxProduit - (this.reduction / 100);
          /*   this.primebrute = Number(this.primeReduit) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
          this.myForm.get('quittance.quit_primenette').setValue(this.primeReduit);
         */} else {
            this.primeReduit = (Number(this.primenette) + ((Number(this.primenette) * Number(this.reduction)) / 100));
            //this.tauxAp = data.tauxProduit(this.reduction/100);
            this.tauxAp = data.tauxProduit + (this.reduction / 100);
          }


        }
        this.taxeTE = ((this.primeReduit + this.accessoirecompagnie + this.accessoireapporteur) * data.tauxTaxe) / 100;
        this.myForm.get('quittance.quit_mtntaxete').setValue(this.taxeTE);
        if (this.myForm.get('policeForm.poli_exonerationtaxeenr').value == 'oui') {
          this.taxeTE = 0;
        }
        this.commissionsapporteur1 = (this.primeReduit * data.tauxCommission) / 100;
        this.myForm.get('quittance.quit_commissionsapporteur1').setValue(this.commissionsapporteur1);

        this.primebrute = Number(this.primeReduit) + Number(this.taxeTE) + Number(this.accessoirecompagnie) + Number(this.accessoireapporteur);
        this.myForm.get('quittance.quit_primenette').setValue(this.primeReduit);

        this.myForm.get('quittance.quit_primettc').setValue(this.primebrute);

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

  //action valider

  submit() {

    this.loading = true;

    this.myForm.get('marche.march_donneurordre').setValue(this.client?.clien_numero);
    this.myForm.get('policeForm.poli_client').setValue(this.client?.clien_numero);

    //pour tester
    this.myForm.get('acte.act_typegarantie').setValue(this.codeProduitChoisi);

    if (this.codeProduitChoisi == '16008001') {
      this.myForm.get('risqueLocatif.riskl_mtnloyer').setValue(this.somCapitalExport);
    }

    this.policeService.ajoutPolice(this.myForm.value)
      .subscribe((data: any) => {

        this.toastrService.show(
          "Police N° " + data.message + " créé",
          'creation de police réussi',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

        this.transfertData.setData(data.message);
        this.router.navigateByUrl('home/parametrage-production/police/view-police');

      });

  }

  submitPropo() {

    this.loading = true;

    this.myForm.get('marche.march_donneurordre').setValue(this.client?.clien_numero);
    this.myForm.get('policeForm.poli_client').setValue(this.client?.clien_numero);

    //pour tester
    this.myForm.get('acte.act_typegarantie').setValue(this.codeProduitChoisi);

    if (this.codeProduitChoisi == '16008001') {
      this.myForm.get('risqueLocatif.riskl_mtnloyer').setValue(this.somCapitalExport);
    }

    this.policeService.ajoutProposition(this.myForm.value)
      .subscribe((data: any) => {

        this.toastrService.show(
          "Proposition N° " + data.message + " créé",
          'creation de proposition réussi',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

        // this.transfertData.setData(data.message);
        this.router.navigateByUrl('home/gestion-proposition');

      });
  }

  clearTarif() {
    this.myForm.get('quittance.quit_accessoirecompagnie').setValue('');
    this.myForm.get('quittance.quit_accessoireapporteur').setValue('');
    this.myForm.get('quittance.quit_commissionsapporteur1').setValue('');
    this.myForm.get('quittance.quit_primenette').setValue('');
    this.myForm.get('quittance.quit_mtntaxete').setValue('');
    this.myForm.get('quittance.quit_primettc').setValue('');
    this.tauxAp = 0;
    
  }
}
