import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acte } from '../../../../model/Acte';
import { Avenant } from '../../../../model/Avenant';
import { Police } from '../../../../model/Police';
import { ActeService } from '../../../../services/acte.service';
import { EngagementService } from '../../../../services/engagement.service';
import { PoliceService } from '../../../../services/police.service';
import dateFormatter from 'date-format-conversion';
import { User } from '../../../../model/User';
import { Client } from '../../../../model/Client';
import { UserService } from '../../../../services/user.service';
import { AvenantService } from '../../../../services/avenant.service';
import type from '../../../data/type.json';
import { ClientService } from '../../../../services/client.service';
import { Marche } from '../../../../model/Marche';
import { MarcheService } from '../../../../services/marche.service';
import { ProduitService } from '../../../../services/produit.service';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { Engagement } from '../../../../model/Engagement';
import { SureteService } from '../../../../services/surete.service';
import { Branche } from '../../../../model/Branche';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Categorie } from '../../../../model/Categorie';
import { Produit } from '../../../../model/Produit';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { RisqueService } from '../../../../services/risque.service';
import { Risque } from '../../../../model/Risque';
import { Acheteur } from '../../../../model/Acheteur';
import { AcheteurService } from '../../../../services/acheteur.service';
import { sinistreService } from '../../../../services/sinistre.service';
import { Credit } from '../../../../model/Credit';
import { CreditService } from '../../../../services/credit.service';
import { RisqueLocatif } from '../../../../model/RisqueLocatif';
import { RisqueLocatifService } from '../../../../services/risquelocatif.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { BeneficiaireService } from '../../../../services/beneficiaire.service';
import { Beneficiaire } from '../../../../model/Beneficiaire';
import { Sinistre } from '../../../../model/Sinistre';
import { QuittanceService } from '../../../../services/quittance.service';

@Component({
  selector: 'ngx-add-declaration-sinistre',
  templateUrl: './add-declaration-sinistre.component.html',
  styleUrls: ['./add-declaration-sinistre.component.scss']
})
export class AddDeclarationSinistreComponent implements OnInit {

  mySinistreForm = this.fb.group({

    sinistreForm: this.fb.group({

      sini_num: [''],
      sini_police: ['', [Validators.required]],
      sini_risque: [''],
      sini_intermediaire: [''],
      sini_codecompagnie: [''],
      sini_branche: [''],
      sini_categorie: [''],
      sini_produit: ['', [Validators.required]],
      sini_typesinistre: [''],
      sini_datesurvenance: ['', [Validators.required]],
      sini_datedeclaration: ['', [Validators.required]],
      sini_datesaisie: [''],
      sini_souscripteur: ['', [Validators.required]],
      sini_beneficiaire: [''],
      sini_acheteur: ['', [Validators.required]],
      sini_donneurdordre: [''],
      sini_tiersrecours: [''],
      sini_lieu: [''],
      sini_description: [''],
      sini_coderesponsabilite: [''],
      sini_evaluationglobale: [''],
      sini_evaluationprincipale: [''],
      sini_evaluationfrais: [''],
      sini_evaluationhonoraires: [''],
      sini_sapglobale: [''],
      sini_sapprincipale: [''],
      sini_sapfrais: [''],
      sini_saphonoraires: [''],
      sini_reglementglobal: [''],
      sini_reglementprincipal: [''],
      sini_reglementfrais: [''],
      sini_reglementhonoraires: [''],
      sini_recoursglobal: [''],
      sini_recoursprincipal: [''],
      sini_recoursfrais: [''],
      sini_recourshonoraires: [''],
      sini_recoursglobalencaisse: [''],
      sini_recoursprincipalencaisse: [''],
      sini_recoursfraisencaisse: [''],
      sini_recourshonoraieencaisse: [''],
      sini_datederniermvt: [''],
      sini_numderniermvt: [''],
      sini_utilisateur: [''],
      sini_datemodification: [''],
      sini_codeexpert: [''],
      sini_dateexpert: [''],
      sini_rapport: [''], // Oui ou Non
      sini_status: [''],
      sini_motifcloture: [''],
      sini_datecloture: [''],
    }),

    // mvt sinistre
    mvtsinistreForm: this.fb.group({

      mvts_num: [''],
      mvts_poli: [''],
      mvts_numsinistre: [''],
      mvts_datemvt: [''],
      mvts_typemvt: [''],
      mvts_typegestionsinistre: [''],
      mvts_datesaisie: [''],
      mvts_montantmvt: [''],
      mvts_montantfinancier: [''],
      //A', actif/ 'C' comptabilisé/ 'N' annuler/etc.
      mvts_status: [''],
      mvts_montantprincipal: ['', [Validators.required]],
      mvts_montantfrais: [''],
      mvts_montanthonoraire: [''],
      mvts_beneficiaire: [''],
      mvts_tiers: [''],
      mvts_motifannulation: [''],
      mvts_dateannulation: [''],
      mvts_codeutilisateur: [''],
      mvts_datemodification: [''],
      mvts_datecomptabilisation: ['']

    }),

    // crédit
    creditForm: this.fb.group({

      credit_numero: ['', [Validators.required]],
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
    }),

    risque_locatifForm: this.fb.group({

      riskl_numero: ['', [Validators.required]],
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
      riskl_codeutilisateur: [''],
    }),

    // acheteurs : this.fb.array([]),

  });

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  autorisation: [];
  // numAvenant: Number;
  // listActes: any[];
  // lib: any;
  // prod: any;

  // dateComptabilisation: Date;
  // dateEngagement: Date;
  // souscripteur: any;
  // displaytype: boolean = false;
  // displayCaution: boolean = false;

  // verifEngag: boolean = true;
  // verifLib: boolean = true;
  // displaytypedepo: boolean = false;
  // displaytypeNature: boolean = false;
  // displaytypeNature1: boolean = false;
  // displayclient: boolean = false;
  // displayPro: boolean = false;
  // displayProd: boolean = false;
  // produit: any;
  // pro: any;
  // ClientByPolice: any;

  // client: any;
  // listTypes: any[];
  // listTypeCausions: any[];
  // echeance: Date;
  // deposite: Date;
  // dateEng: Date;
  // dateLib: Date;
  // formatcapitalassure: Number;
  // capitalEngagement: Number;
  // problemeRetenuDeposit: boolean = false;

  // Listes et tableaux
  avenants: Array<Avenant> = new Array<Avenant>();
  polices: Array<Police> = new Array<Police>();
  actes: Array<Acte> = new Array<Acte>();
  clientes: Array<Client> = new Array<Client>();
  marches: Array<Marche> = new Array<Marche>();
  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  credits: Array<Credit> = new Array<Credit>();
  risqueLocatifs: Array<RisqueLocatif> = new Array<RisqueLocatif>();
  listeCodeBranche: Branche[];
  listeNumeroIntermediaire: Array<Intermediaire> = new Array<Intermediaire>();
  listeNumeroCategorie: Categorie[];
  listeNumeroProduit: Produit[];
  engagements: Array<Engagement> = new Array<Engagement>();
  menaceSinistre: Array<Sinistre> = new Array<Sinistre>();

  // variables de type objet entity
  credit: Credit;
  riskLocatif: RisqueLocatif;
  beneficiaire: Beneficiaire;
  engagement: Engagement;

  // Mes booleans
  afficherCredit: boolean = false;
  afficherRiskLocatif: boolean = false;
  afficherRiskCaution: boolean = false;
  verifDateDeclaration: boolean = false;
  verifDateSurvenance: boolean = false;
  problemeMontantPrincipalCredit: boolean = false;
  problemeMontantPrincipalRiskLocatif: boolean = false;
  problemeMontantPrincipalCaution: boolean = false;
  erreur: boolean = false;
  doublonMenaceSinistre: boolean = false;
  afficherACheteur: boolean = false;
  // saisirBeneficiaire: boolean = false;
  saisirLieuSinistre: boolean = false;
  declarationMenanceSinistre: boolean = false;
  declarationSinistre: boolean = false;

  // Mes variables simples
  sinistre_codecategorie: string;
  sinistre_codeproduit: string;
  libelleInterm: any = "";
  libelleBranche: any = "";
  libelleCategorie: any = "";
  libelleProduit: any = "";
  libelleDonneurDordre: any = "";
  libelleBeneficiaire: any = "";
  libelleTiersRecours: any = "";
  clientChoisi: any;
  policeChoisi: any;
  codeCredit: string;
  codeRisqueLocatif: string;
  codeEngagement: string;
  montantMenace: any = "";
  echeanceRetard: any;
  dateEffet: Date;
  dateEcheance: Date;
  acheteurChoisi: any;
  montantPrincipal: any = "";
  montantFrais: any = "";
  montantHonoraire: any = "";
  nbreLoyerImpaye: any;
  montantLoyer: any = "";
  montantLoyerImpaye: any = "";
  montantCredit: any = "";
  capitalEngage: any = "";
  capitalLibere: any = "";
  capitalRestant: any = "";
  montantPrincipalProposeForEngagement: any = 0;

  @Input() types: any[] = type;

  public typesCtrl: FormControl = new FormControl();
  public policesCtrl: FormControl = new FormControl();
  public clientsCtrl: FormControl = new FormControl();
  public intermediaireCtrl: FormControl = new FormControl();
  public acheteurCtrl: FormControl = new FormControl();
  public creditCtrl: FormControl = new FormControl();

  public typesFilterCtrl: FormControl = new FormControl();
  public policesFilterCtrl: FormControl = new FormControl();
  public clientsFilterCtrl: FormControl = new FormControl();
  public intermediaireFilterCtrl: FormControl = new FormControl();
  public acheteurFilterCtrl: FormControl = new FormControl();
  public creditFilterCtrl: FormControl = new FormControl();

  public filteredTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  public filteredPolices: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
  public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
  public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();
  public filteredAcheteur: ReplaySubject<Acheteur[]> = new ReplaySubject<Acheteur[]>();
  public filteredCredit: ReplaySubject<Credit[]> = new ReplaySubject<Credit[]>();


  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private risqueService: RisqueService,
    private quittanceService: QuittanceService,
    private toastrService: NbToastrService,
    private router: Router,
    private userService: UserService,
    private clientService: ClientService,
    private policeService: PoliceService,
    private intermediaireService: IntermediaireService,
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private acheteurServie: AcheteurService,
    private creditService: CreditService,
    private risqueLocatifService: RisqueLocatifService,
    private sinistreService: sinistreService,
    private engagementService: EngagementService,
    private formatNumberService: FormatNumberService,
    private beneficiaireService: BeneficiaireService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });

    this.getlogin();
    // this.listTypes = this.types['TYPE_SURETE'];
    // this.listTypeCausions = this.types['TYPE_CAUTION_SOLIDAIRE'];

    this.onGetAllClient();
    this.onGetAllIntermediaires();
    this.onGetAllBranches();
    this.onGetAllCategorie();
    this.onGetAllProduit();
    // this.onGetAllEngagement();
    // this.onGetAllPolice();
    // this.ClientByPolice = '';

    // this.filteredTypes.next(this.listTypes.slice());

    this.clientsFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });

    this.acheteurFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterAcheteurs();
      });

    // this.typesFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterTypes();
    //   });

    this.policesFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPolices();
      });

    this.intermediaireFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererIntermediaires();

      });

    // this.creditFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterCredit();
    //   });

    // console.log(dateFormatter(new Date(), 'yyyy-MM-dd'))
    this.mySinistreForm.get('sinistreForm.sini_datedeclaration').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    this.mySinistreForm.get('sinistreForm.sini_datesaisie').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    // 1: menace de sinistre
    this.mySinistreForm.get('mvtsinistreForm.mvts_typemvt').setValue(2);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(0);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(0);

    this.mySinistreForm.get('sinistreForm.sini_num').setValue(0);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {
              this.user = data;
              // console.log(this.user);
            });
        }
      });
  }

  protected filterClients() {
    if (!this.clientes) {
      return;
    }
    // get the search keyword
    let search = this.clientsFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.clientes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClients.next(
      this.clientes.filter(clt => clt.clien_numero.toString()?.toLowerCase().indexOf(search) > -1)

    );
  }

  /*
  protected filterTypes() {
    if (!this.listTypes) {
      return;
    }
    // get the search keyword
    let search = this.typesFilterCtrl.value;
    if (!search) {
      this.filteredTypes.next(this.listTypes.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredTypes.next(
      this.listTypes.filter(typ => typ.id.toLowerCase().indexOf(search) > -1 ||
        typ.value.toString().indexOf(search) > -1)
    );
  }
  */

  protected filterPolices() {
    if (!this.polices) {
      return;
    }
    // get the search keyword
    let search = this.policesFilterCtrl.value;
    if (!search) {
      this.filteredPolices.next(this.polices.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPolices.next(
      this.polices.filter(poli => poli.poli_numero.toString()?.toLowerCase().indexOf(search) > -1)

    );
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

  protected filterAcheteurs() {
    if (!this.acheteurs) {
      return;
    }
    // get the search keyword
    let search = this.acheteurFilterCtrl.value;
    if (!search) {
      this.filteredAcheteur.next(this.acheteurs.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredAcheteur.next(
      this.acheteurs.filter(acht => acht.achet_numero.toString()?.toLowerCase().indexOf(search) > -1)

    );
  }

  protected filterCredit() {
    if (!this.credits) {
      return;
    }
    // get the search keyword
    let search = this.creditFilterCtrl.value;
    if (!search) {
      this.filteredCredit.next(this.credits.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCredit.next(
      this.credits.filter(cr => cr.credit_numero.toString()?.toLowerCase().indexOf(search) > -1)

    );
  }

  // ================= OnGetAllMethode ====================
  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientes = data as Client[];
        this.filteredClients.next(this.clientes.slice());
      });
  }

  // onGetClientByIdOld(numero: Number) {
  //   this.clientService.getClient(numero)
  //     .subscribe((data: Client) => {
  //       if (data?.clien_sigle === null || data?.clien_sigle === '') {
  //         this.mySinistreForm.get('sinistreForm.sini_lieu').setValue(data?.clien_adressenumero);
  //       } else {
  //         this.mySinistreForm.get('sinistreForm.sini_lieu').setValue(data?.clien_sigle + " / " + data?.clien_adressenumero);
  //       }
  //     });
  // }

  onGetClientById(numero: Number, branche: Number) {
    this.saisirLieuSinistre = false;

    this.clientService.getClient(numero)
      .subscribe((data: Client) => {

        if (branche === 15) {
          if ((data?.clien_denomination === null || data?.clien_denomination === "") && data?.clien_prenom !== null && data?.clien_prenom !== "" && data?.clien_nom !== null && data?.clien_nom !== "") {
            this.libelleDonneurDordre = numero + " : " + data?.clien_prenom + " " + data?.clien_nom;
            this.libelleTiersRecours = numero + " : " + data?.clien_prenom + " " + data?.clien_nom;

          } else if ((data?.clien_denomination !== null && data?.clien_denomination !== "") && (data?.clien_prenom === null || data?.clien_prenom === "" || data?.clien_nom === null || data?.clien_nom === "")) {
            this.libelleDonneurDordre = numero + " : " + data?.clien_denomination;
            this.libelleTiersRecours = numero + " : " + data?.clien_denomination;
          } else {
            this.libelleDonneurDordre = numero + " : " + data?.clien_prenom + " " + data?.clien_nom + " " + data?.clien_denomination;
            this.libelleTiersRecours = numero + " : " + data?.clien_prenom + " " + data?.clien_nom + " " + data?.clien_denomination;
          }

          // Gestion du lieu du sinistre:
          // this.mySinistreForm.get('sinistreForm.sini_lieu').setValue('');
          // this.saisirLieuSinistre = true;

        } else { // credit ou perte pecuniaire
          if ((data?.clien_denomination === null || data?.clien_denomination === "") && data?.clien_prenom !== null && data?.clien_prenom !== "" && data?.clien_nom !== null && data?.clien_nom !== "") {
            this.libelleDonneurDordre = numero + " : " + data?.clien_prenom + " " + data?.clien_nom;
            this.libelleBeneficiaire = numero + " : " + data?.clien_prenom + " " + data?.clien_nom;

          } else if ((data?.clien_denomination !== null && data?.clien_denomination !== "") && (data?.clien_prenom === null || data?.clien_prenom === "" || data?.clien_nom === null || data?.clien_nom === "")) {
            this.libelleDonneurDordre = numero + " : " + data?.clien_denomination;
            this.libelleBeneficiaire = numero + " : " + data?.clien_denomination;

          } else {
            this.libelleDonneurDordre = numero + " : " + data?.clien_prenom + " " + data?.clien_nom + " " + data?.clien_denomination;
            this.libelleBeneficiaire = numero + " : " + data?.clien_prenom + " " + data?.clien_nom + " " + data?.clien_denomination;
          }

          // Gestion du lieu du sinistre
          if (data?.clien_sigle === null || data?.clien_sigle === '') {
            this.mySinistreForm.get('sinistreForm.sini_lieu').setValue(data?.clien_adressenumero);
          } else {
            this.mySinistreForm.get('sinistreForm.sini_lieu').setValue(data?.clien_sigle + " / " + data?.clien_adressenumero);
          }
        }

      });
  }

  // onGetAllPoliceByClient(numclient: Number) {
  //   this.policeService.getAllPoliceByClient(numclient)
  //     .subscribe((data: Police[]) => {
  //       this.polices = data as Police[];
  //       this.filteredPolices.next(this.polices.slice());
  //     });
  // }

  onGetAllPoliceByClientAndBrancheCaution(numclient: Number) {
    this.policeService.getAllPoliceByClientAndBrancheCaution(numclient)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.polices = data?.data as Police[];
          this.filteredPolices?.next(this.polices.slice());
        } else {
          this.polices = data?.data;
          this.filteredPolices?.next(this.polices.slice());
        }

        console.log(this.polices);
        console.log(this.filteredPolices);
      });
  }

  onGetAllAcheteurByClientAndPolice(numclient: Number, numpolice: Number) {
    this.acheteurServie.getAcheteursByClientAndPolice(numclient, numpolice)
      .subscribe((data: any) => {

        this.acheteurs = data.data as Acheteur[];
        this.filteredAcheteur.next(this.acheteurs.slice());
      });
  }

  onGetPoliceById(id: any) {
    this.policeService.getPolice(id)
      .subscribe((data: Police) => {

        if (data?.poli_branche == 15) {
          // On est en caution
          this.afficherACheteur = false;
          this.mySinistreForm.get('sinistreForm.sini_donneurdordre').setValue(this.clientChoisi);
          this.mySinistreForm.get('sinistreForm.sini_tiersrecours').setValue(this.clientChoisi);
          this.onGetClientById(this.clientChoisi, data?.poli_branche); // Pour mettre les libelle coté affichage

          this.mySinistreForm.get('sinistreForm.sini_codecompagnie').setValue(data?.poli_compagnie);
          this.mySinistreForm.get('sinistreForm.sini_intermediaire').setValue(data?.poli_intermediaire);
          this.mySinistreForm.get('sinistreForm.sini_branche').setValue(data?.poli_branche);
          this.mySinistreForm.get('sinistreForm.sini_categorie').setValue(data?.poli_categorie);
          this.mySinistreForm.get('sinistreForm.sini_produit').setValue(data?.poli_codeproduit);
          // this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(data?.poli_typegestion);

          this.libelleInterm = this.onGetLibelleByIntermediaire(data?.poli_intermediaire);
          this.libelleBranche = this.onGetLibelleByBranche(data?.poli_branche);
          this.libelleCategorie = this.onGetLibelleByCategorie(data?.poli_categorie);
          this.libelleProduit = this.onGetLibelleByProduit(data?.poli_codeproduit);

          /*
          if (data?.poli_codeproduit == 15001001 || data?.poli_codeproduit == 15001002 || data?.poli_codeproduit == 15001003 || data?.poli_codeproduit == 15001004 || data?.poli_codeproduit == 15001005) {
            // On est en caution CMT
            //Bénéficiaire = contractante (bénéficiaire enregistré dans l'acte de la police)
            this.saisirBeneficiaire = false;
            this.onGetBeneficiaireWithActeByPolice(id);

          } else {
            // On est en caution reglementé
            this.saisirBeneficiaire = true;
          }
          */

          // Désormais on cherche le bénéficiaire lié à la police (dans l'acte)
          this.onGetBeneficiaireWithActeByPolice(id);

        } else {
          /*
            * On est en crédit ou perte pecuniaires
            * Donner la possibilité de choisir l'acheteur pour qu'ensuite
          */
          this.afficherACheteur = true;
          // this.saisirBeneficiaire = false;

          this.mySinistreForm.get('sinistreForm.sini_donneurdordre').setValue(this.clientChoisi);
          this.mySinistreForm.get('sinistreForm.sini_beneficiaire').setValue(this.clientChoisi);

          this.onGetClientById(this.clientChoisi, data?.poli_branche); // Pour mettre les libelle coté affichage

          this.mySinistreForm.get('sinistreForm.sini_codecompagnie').setValue(data?.poli_compagnie);
          this.mySinistreForm.get('sinistreForm.sini_intermediaire').setValue(data?.poli_intermediaire);
          this.mySinistreForm.get('sinistreForm.sini_branche').setValue(data?.poli_branche);
          this.mySinistreForm.get('sinistreForm.sini_categorie').setValue(data?.poli_categorie);
          this.mySinistreForm.get('sinistreForm.sini_produit').setValue(data?.poli_codeproduit);
          // this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(data?.poli_typegestion);

          this.libelleInterm = this.onGetLibelleByIntermediaire(data?.poli_intermediaire);
          this.libelleBranche = this.onGetLibelleByBranche(data?.poli_branche);
          this.libelleCategorie = this.onGetLibelleByCategorie(data?.poli_categorie);
          this.libelleProduit = this.onGetLibelleByProduit(data?.poli_codeproduit);
        }

        this.onGetRisqueByPolice(id);

        // Pour afficher l'ecran d'identification du risque en fonction de la branche
        if (data?.poli_branche == 14) {
          this.afficherCredit = true;
          this.afficherRiskLocatif = false;
          this.afficherRiskCaution = false;
          this.mySinistreForm.get('creditForm.credit_numero').setValidators(Validators.required);
          this.mySinistreForm.get('risque_locatifForm.riskl_numero').clearValidators();
          this.mySinistreForm.get('sinistreForm.sini_acheteur').setValidators(Validators.required);
        } else if (data?.poli_branche == 16) {
          this.afficherCredit = false;
          this.afficherRiskLocatif = true;
          this.afficherRiskCaution = false;
          this.mySinistreForm.get('creditForm.credit_numero').clearValidators()
          this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValidators(Validators.required);
          this.mySinistreForm.get('sinistreForm.sini_acheteur').setValidators(Validators.required);
        } else if (data?.poli_branche == 15) {
          this.afficherCredit = false;
          this.afficherRiskLocatif = false;
          this.afficherRiskCaution = true;
          this.mySinistreForm.get('creditForm.credit_numero').clearValidators()
          this.mySinistreForm.get('risque_locatifForm.riskl_numero').clearValidators();
          this.mySinistreForm.get('sinistreForm.sini_acheteur').clearValidators();
        }

        this.mySinistreForm.get('creditForm.credit_numero').updateValueAndValidity()
        this.mySinistreForm.get('risque_locatifForm.riskl_numero').updateValueAndValidity();
        this.mySinistreForm.get('sinistreForm.sini_acheteur').updateValueAndValidity();

        // Je recupere la date d'effet et d'echeance de la police
        this.dateEcheance = data?.poli_dateecheance as Date;
        this.dateEffet = data?.poli_dateeffetencours as Date;
      });
  }

  onGetQuittanceByPolice(police: any) {
    this.quittanceService.findQuittanceByPolice(police)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let quittances = data.data;
          this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(quittances[0].quit_typequittance);
        }
      });

  }

  onGetRisqueByPolice(police: Number) {
    this.risqueService.getRisquePolice(police)
      .subscribe((data: Risque) => {
        this.mySinistreForm.get('sinistreForm.sini_risque').setValue(data?.risq_numero);
        this.mySinistreForm.get('sinistreForm.sini_typesinistre').setValue(data?.risq_typerisque);
        this.mySinistreForm.get('sinistreForm.sini_lieu').setValue(data?.risq_localisation1);
        // this.onGetRisqueById(data.risq_numero);
      });
  }

  onGetAllIntermediaires() {
    this.intermediaireService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.listeNumeroIntermediaire = data as Intermediaire[];
        this.filteredIntermediaire.next(this.listeNumeroIntermediaire.slice());
      });
  }

  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.listeCodeBranche = data as Branche[];
      });
  }

  onGetAllCategorie() {
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[];
      });
  }

  onGetAllProduit() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.listeNumeroProduit = data as Produit[];
      });
  }

  onGetLibelleByIntermediaire(numero: any) {
    return (numero + " : " + (this.listeNumeroIntermediaire.find(int => int.inter_numero === numero))?.inter_denomination);
  }

  onGetLibelleByBranche(numero: number) {
    return (numero + " : " + (this.listeCodeBranche.find(b => b.branche_numero === numero))?.branche_libelleLong);
  }

  onGetLibelleByCategorie(numero: number) {
    return numero + " : " + (this.listeNumeroCategorie.find(c => c.categ_numero === numero))?.categ_libellelong;
  }

  onGetLibelleByProduit(numero: number) {
    return numero + " : " + (this.listeNumeroProduit.find(p => p.prod_numero === numero))?.prod_denominationlong;
  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')
  }

  onGetAllCreditByClientAndAcheteur(numclient: Number, numAcheteur: Number) {
    this.creditService.getCreditByClientAndAcheteur(numclient, numAcheteur)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.credits = data.data as Credit[];
          // this.filteredCredit.next(this.credits?.slice());
        } else {
          this.credits = data.data;
          // this.filteredCredit = null;
        }
      });
  }

  onGetCreditByNumero(numero: Number) {
    this.creditService.getCreditByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.credit = data.data;

          this.montantCredit = this.formatNumberService.numberWithCommas2(Number(this.credit.credit_mtncredit));
          this.mySinistreForm.get('creditForm.credit_mtncredit').setValue(this.credit.credit_mtncredit);
          this.mySinistreForm.get('creditForm.credit_nbecheanceaccorde').setValue(this.credit.credit_nbecheanceaccorde);

          if (this.declarationMenanceSinistre === true) {
            this.mySinistreForm.get('creditForm.credit_nbechenaceretard').setValue(this.credit.credit_nbechenaceretard);
            this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue(this.credit.credit_nbecheanceimpaye);
            // Calcul du montant menacé
            this.echeanceRetard = this.mySinistreForm.get('creditForm.credit_nbechenaceretard').value;
            this.montantMenace = Number((this.credit.credit_mtncredit / this.credit.credit_nbecheanceaccorde) * this.echeanceRetard);
          } else {
            this.mySinistreForm.get('creditForm.credit_nbechenaceretard').setValue(this.credit.credit_nbechenaceretard + 1);
            this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue(this.credit.credit_nbecheanceimpaye + 1);
            // Calcul du montant menacé
            this.echeanceRetard = this.mySinistreForm.get('creditForm.credit_nbechenaceretard').value;
            this.montantMenace = Number((this.credit.credit_mtncredit / this.credit.credit_nbecheanceaccorde) * this.echeanceRetard);

            this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantMenace);
            this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantMenace);

          }

          // Formatage pour affichage
          this.montantMenace = this.formatNumberService.numberWithCommas2(this.montantMenace);

        } else {
          this.credit = data.data;
        }
      });
  }

  onGetAllRisqueLocatifByClientAndAcheteur(numclient: Number, numAcheteur: Number) {
    this.risqueLocatifService.getRisque_locatifsByClientAndAcheteur(numclient, numAcheteur)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.risqueLocatifs = data.data as RisqueLocatif[];
        } else {
          this.risqueLocatifs = data.data;
        }
      });
  }

  onGetRisqueLocatifByNumero(numero: Number) {
    this.risqueLocatifService.getRisqueLocatifByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.riskLocatif = data.data
          this.montantLoyer = this.formatNumberService.numberWithCommas2(Number(this.riskLocatif.riskl_mtnloyer));
          this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').setValue(this.riskLocatif.riskl_mtnloyer);
          if (this.declarationMenanceSinistre === true) {
            // On a déjà une déclaration de menace de sinistre
            this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').setValue(this.riskLocatif.riskl_nombreloyerimpaye);
            this.nbreLoyerImpaye = this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').value;
            this.montantLoyerImpaye = Number((this.riskLocatif.riskl_mtnloyer * this.nbreLoyerImpaye));
          } else {
            this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').setValue(this.riskLocatif.riskl_nombreloyerimpaye + 1);
            this.nbreLoyerImpaye = this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').value;
            this.montantLoyerImpaye = Number((this.riskLocatif.riskl_mtnloyer * this.nbreLoyerImpaye));

            this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantLoyerImpaye);
            this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);
          }

          this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue(this.montantLoyerImpaye);
          // Formatage pour l'affichage
          this.montantLoyerImpaye = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);
        } else {
          this.riskLocatif = data.data;
        }
      });
  }

  onGetEngagementByNumero(numero: Number) {
    this.engagementService.getEngagementByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.engagement = data.data;
          this.montantPrincipalProposeForEngagement = Number(this.engagement.engag_kapassure) - Number(this.engagement.engag_capitalliberationengage);
          this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipalProposeForEngagement);
          this.capitalEngage = this.formatNumberService.numberWithCommas2(Number(this.engagement.engag_kapassure));
          this.capitalLibere = this.formatNumberService.numberWithCommas2(Number(this.engagement.engag_capitalliberationengage));
          this.montantPrincipal = this.formatNumberService.numberWithCommas2(Number(this.montantPrincipalProposeForEngagement));
          this.capitalRestant = this.formatNumberService.numberWithCommas2(Number(this.montantPrincipalProposeForEngagement));
        } else {
          this.engagement = data.data;
        }
      });
  }

  onGetAcheteur(numACheteur: Number) {
    this.acheteurServie.getAcheteur(numACheteur)
      .subscribe((data: Acheteur) => {
        this.acheteurChoisi = data?.achet_prenom + " " + data?.achet_nom;
        this.libelleTiersRecours = numACheteur + " : " + data?.achet_prenom + " " + data?.achet_nom;
      });
  }

  onGetAllEngagementByPolice(police: Number) {
    this.engagementService.getAllEngagementsByPolice(police)
      .subscribe((data: Engagement[]) => {
        this.engagements = data as Engagement[];
      });
  }

  onGetMenaceSinistreByAcheteur(acheteur: Number) {

    this.sinistreService.getMenaceSinistreByAcheteur(acheteur)
      .subscribe((data: any) => {
        if (data.code === "chao") {
          // this.doublonMenaceSinistre = true;
          // Donc pas de declaration de menace de sinistre
          this.declarationMenanceSinistre = false;
          this.toastrService.show(
            data.message,
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          // Lui permettre de continuer en remplissant les champs avec les donnés de la police choisie
          // console.log("Lui permettre de continuer en remplissant les champs avec les donnés de la police choisie")
        } else {
          // Donc il a déjà une menace de sinistre
          // this.doublonMenaceSinistre = false;
          this.menaceSinistre = data.data;
          this.declarationMenanceSinistre = true;
          this.mySinistreForm.get('sinistreForm.sini_num').setValue(this.menaceSinistre[0].sini_num);
          // Après on doit aussi proposer le montant principal déjà recupéré dans la menace de sinistre
          this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.menaceSinistre[0].sini_evaluationprincipale);
          this.montantPrincipal = this.formatNumberService.numberWithCommas2(Number(this.menaceSinistre[0].sini_evaluationprincipale))
          this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.menaceSinistre[0].sini_evaluationfrais);
          this.montantFrais = this.formatNumberService.numberWithCommas2(Number(this.menaceSinistre[0].sini_evaluationfrais));
          this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.menaceSinistre[0].sini_evaluationhonoraires);
          this.montantHonoraire = this.formatNumberService.numberWithCommas2(Number(this.menaceSinistre[0].sini_evaluationhonoraires));
          // console.log(this.menaceSinistre);
          // console.log(this.menaceSinistre[0]);

          // On rempli les champs avec les données de la menace de sinistre
          // console.log("On rempli les champs avec les données de la menace de sinistre")
          // this.mySinistreForm.get('sinistreForm.sini_donneurdordre').setValue(this.menaceSinistre[0].sini_donneurdordre);
          // this.mySinistreForm.get('sinistreForm.sini_tiersrecours').setValue(this.menaceSinistre[0].sini_tiersrecours);
          // this.onGetClientByIdForFormulaire(this.clientChoisi); // Pour mettre les libelle coté affichage

          // this.mySinistreForm.get('sinistreForm.sini_codecompagnie').setValue(this.menaceSinistre[0].sini_codecompagnie);
          // this.mySinistreForm.get('sinistreForm.sini_intermediaire').setValue(this.menaceSinistre[0].sini_intermediaire);
          // this.mySinistreForm.get('sinistreForm.sini_branche').setValue(this.menaceSinistre[0].sini_branche);
          // this.mySinistreForm.get('sinistreForm.sini_categorie').setValue(this.menaceSinistre[0].sini_categorie);
          // this.mySinistreForm.get('sinistreForm.sini_produit').setValue(this.menaceSinistre[0].sini_produit);
          // this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(data?.poli_typegestion);
        }
      });
  }

  onGetSinistreByAcheteur(acheteur: Number) {

    this.sinistreService.getSinistreByAcheteur(acheteur)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          // this.doublonMenaceSinistre = true;
          // Donc il existe déjà une declaration de sinistre pour cet acheteur... interdiction de continuer
          this.declarationSinistre = true;
          this.toastrService.show(
            data.message,
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });

        } else {
          // Donc pas de déclaration de sinistre pour cet acheteur... il peut continuer
          this.declarationSinistre = false;
        }
      });
  }

  onGetBeneficiaireWithActeByPolice(police: Number) {
    this.beneficiaireService.getBeneficiaireWithActeByPolice(police)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.beneficiaire = data.data;
          this.mySinistreForm.get('sinistreForm.sini_beneficiaire').setValue(data.data.benef_Num);

          if ((this.beneficiaire?.benef_denom === null || this.beneficiaire?.benef_denom === "") && this.beneficiaire?.benef_prenoms !== null && this.beneficiaire?.benef_prenoms !== "" && this.beneficiaire?.benef_nom !== null && this.beneficiaire?.benef_nom !== "") {
            this.libelleBeneficiaire = this.beneficiaire?.benef_Num + " : " + this.beneficiaire?.benef_prenoms + " " + this.beneficiaire?.benef_nom;
          } else if ((this.beneficiaire?.benef_denom !== null && this.beneficiaire?.benef_denom !== "") && (this.beneficiaire?.benef_prenoms === null || this.beneficiaire?.benef_prenoms === "" || this.beneficiaire?.benef_nom === null || this.beneficiaire?.benef_nom === "")) {
            this.libelleBeneficiaire = this.beneficiaire?.benef_Num + " : " + this.beneficiaire?.benef_denom;
          } else {
            this.libelleBeneficiaire = this.beneficiaire?.benef_Num + " : " + " " + this.beneficiaire?.benef_prenoms + " " + this.beneficiaire?.benef_nom + " " + this.beneficiaire?.benef_denom;
          }
        } else {
          this.mySinistreForm.get('sinistreForm.sini_beneficiaire').setValue('');
        }
      })
  }

  // ================= Onchange ==================

  onChangeClient(event) {

    this.clientChoisi = event.value;
    this.mySinistreForm.get('sinistreForm.sini_souscripteur').setValue(event.value);
    this.mySinistreForm.get('sinistreForm.sini_donneurdordre').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_beneficiaire').setValue('');

    this.mySinistreForm.get('sinistreForm.sini_police').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_risque').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_typesinistre').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_codecompagnie').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_intermediaire').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_acheteur').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_branche').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_categorie').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_produit').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_tiersrecours').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_lieu').setValue('');
    this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue('');

    // credit
    this.mySinistreForm.get('creditForm.credit_numero').setValue('');
    this.mySinistreForm.get('creditForm.credit_mtncredit').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbecheanceaccorde').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbechenaceretard').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue('');

    //risque locatif
    this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue('');

    // Les champs à vider sur l'onglet information 2
    // this.mySinistreForm.get('sinistreForm.sini_datedeclaration').setValue("");
    this.mySinistreForm.get('sinistreForm.sini_datesurvenance').setValue("");
    this.verifDateDeclaration = false;
    this.verifDateSurvenance = false;

    // Vider les champs de la partie evalution
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue('');
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(0);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(0);

    this.montantMenace = "";
    this.montantPrincipal = "";
    this.montantFrais = "";
    this.montantHonoraire = "";
    this.montantLoyer = "";
    this.montantLoyerImpaye = "";
    this.montantCredit = "";
    this.capitalEngage = "";
    this.capitalLibere = "";

    this.codeCredit = "".toString();
    this.codeRisqueLocatif = "".toString();
    this.codeEngagement = "".toString();
    this.credits = null;
    this.risqueLocatifs = null;
    this.engagements = null

    this.libelleInterm = "";
    this.libelleBranche = "";
    this.libelleCategorie = "";
    this.libelleProduit = "";
    this.libelleDonneurDordre = "";
    this.libelleTiersRecours = "";
    this.libelleBeneficiaire = "";

    this.policesCtrl.setValue('');
    this.acheteurCtrl.setValue('');

    this.problemeMontantPrincipalCredit = false;
    this.problemeMontantPrincipalRiskLocatif = false;
    this.erreur = false;

    // this.onGetAllPoliceByClient(event.value);
    this.onGetAllPoliceByClientAndBrancheCaution(event.value);
    this.onGetAllAcheteurByClientAndPolice(0, 0); // Pour vider la liste des acheteurs
  }

  onChangePolice(event) {

    this.policeChoisi = event.value;
    this.mySinistreForm.get('sinistreForm.sini_police').setValue(event.value);
    this.mySinistreForm.get('sinistreForm.sini_donneurdordre').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_beneficiaire').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_risque').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_typesinistre').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_codecompagnie').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_intermediaire').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_branche').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_categorie').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_produit').setValue('');
    this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_lieu').setValue('');

    // Vider les champs liés à l'acheteur
    this.mySinistreForm.get('sinistreForm.sini_acheteur').setValue('');
    this.mySinistreForm.get('sinistreForm.sini_tiersrecours').setValue('');

    // credit
    this.mySinistreForm.get('creditForm.credit_numero').setValue('');
    this.mySinistreForm.get('creditForm.credit_mtncredit').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbecheanceaccorde').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbechenaceretard').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue('');

    //risque locatif
    this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue('');

    // Les champs à vider sur l'onglet information 2
    // this.mySinistreForm.get('sinistreForm.sini_datedeclaration').setValue("");
    this.mySinistreForm.get('sinistreForm.sini_datesurvenance').setValue("");
    this.verifDateDeclaration = false;
    this.verifDateSurvenance = false;

    // Vider les champs de la partie evalution
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue('');
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(0);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(0);

    this.montantMenace = "";
    this.montantPrincipal = "";
    this.montantFrais = "";
    this.montantHonoraire = "";
    this.montantLoyer = "";
    this.montantLoyerImpaye = "";
    this.montantCredit = "";
    this.capitalEngage = "";
    this.capitalLibere = "";

    this.codeCredit = "".toString();
    this.codeRisqueLocatif = "".toString();
    this.codeEngagement = "".toString();

    this.libelleInterm = "";
    this.libelleBranche = "";
    this.libelleCategorie = "";
    this.libelleProduit = "";
    this.libelleDonneurDordre = "";
    this.libelleTiersRecours = "";
    this.libelleBeneficiaire = "";

    this.acheteurCtrl.setValue('');

    this.problemeMontantPrincipalCredit = false;
    this.problemeMontantPrincipalRiskLocatif = false;
    this.erreur = false;

    // this.onGetRisqueByPolice(event.value);
    this.onGetPoliceById(event.value);
    this.onGetQuittanceByPolice(event.value);
    this.onGetAllAcheteurByClientAndPolice(this.clientChoisi, event.value);
    this.onGetAllEngagementByPolice(event.value);
  }

  onChangeAcheteur(event) {

    this.mySinistreForm.get('sinistreForm.sini_acheteur').setValue(event.value);
    this.mySinistreForm.get('sinistreForm.sini_tiersrecours').setValue(event.value);

    // credit
    this.mySinistreForm.get('creditForm.credit_numero').setValue('');
    this.mySinistreForm.get('creditForm.credit_mtncredit').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbecheanceaccorde').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbechenaceretard').setValue('');
    this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue('');
    this.codeCredit = "".toString();

    //risque locatif
    this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').setValue('');
    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue('');
    this.codeRisqueLocatif = "".toString();

    this.codeEngagement = "".toString();

    // Vider les champs de la partie evalution
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue('');
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(0);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(0);

    this.montantMenace = "";
    this.montantPrincipal = "";
    this.montantFrais = "";
    this.montantHonoraire = "";
    this.montantLoyer = "";
    this.montantLoyerImpaye = "";
    this.montantCredit = "";
    this.capitalEngage = "";
    this.capitalLibere = "";

    this.problemeMontantPrincipalCredit = false;
    this.problemeMontantPrincipalRiskLocatif = false;
    this.erreur = false;

    this.onGetAllCreditByClientAndAcheteur(this.clientChoisi, event.value);
    this.onGetAllRisqueLocatifByClientAndAcheteur(this.clientChoisi, event.value);
    this.onGetMenaceSinistreByAcheteur(event.value);
    this.onGetSinistreByAcheteur(event.value);

    // On recupere les informations de l'acheteur choisi:
    this.onGetAcheteur(event.value);
  }

  onChangeBranche(event) {

    // this.onGetAllCategorieByBranche(event);
    this.mySinistreForm.get('sinistreForm.sini_branche').setValue(event);

    this.sinistre_codecategorie = "".toString();
    this.sinistre_codeproduit = "".toString();
    this.mySinistreForm.get('sinistreForm.sini_categorie').setValue(this.sinistre_codecategorie);
    this.mySinistreForm.get('sinistreForm.sini_produit').setValue(this.sinistre_codeproduit);
    // this.brancheChoisi = event;
  }

  onChangeCategorie(event) {

    // this.onGetAllProduitByCategorie(event);
    this.mySinistreForm.get('sinistreForm.sini_categorie').setValue(event);
    this.sinistre_codeproduit = "".toString();
    this.mySinistreForm.get('sinistreForm.sini_produit').setValue(this.sinistre_codeproduit);
  }

  onChangeProduit(event) {

    this.mySinistreForm.get('sinistreForm.sini_produit').setValue(event);
  }

  onChangeIntermediaire(event) {
    this.mySinistreForm.get('sinistreForm.sini_intermediaire').setValue(event.value);
  }

  onChangeRapportExpertise(event) {
    this.mySinistreForm.get('sinistreForm.sini_rapport').setValue(event);
  }

  onChangeTypeMVT(event) {
    this.mySinistreForm.get('mvtsinistreForm.mvts_typemvt').setValue(event);
  }

  onChangeTypeStatutMVT(event) {
    this.mySinistreForm.get('mvtsinistreForm.mvts_status').setValue(event);
  }

  onChangeCredit(event) {
    this.mySinistreForm.get('creditForm.credit_numero').setValue(event);
    this.onGetCreditByNumero(event);
  }

  onChangeRisqueLocatif(event) {
    this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValue(event);
    this.onGetRisqueLocatifByNumero(event);
  }

  onChangeEngagement(event) {
    this.onGetEngagementByNumero(event);
  }

  onChangeFocusDateSurvenance(event) {
    let dateSurvenance = this.mySinistreForm.get('sinistreForm.sini_datesurvenance').value;

    if ((dateFormatter(dateSurvenance, 'yyyy-MM-dd') >= dateFormatter(this.dateEffet, 'yyyy-MM-dd')) && (dateFormatter(dateSurvenance, 'yyyy-MM-dd') <= dateFormatter(this.dateEcheance, 'yyyy-MM-dd')) && (dateFormatter(dateSurvenance, 'yyyy-MM-dd') <= dateFormatter(new Date(), 'yyyy-MM-dd'))) {
      this.verifDateSurvenance = false;
    } else {
      this.verifDateSurvenance = true;
      this.mySinistreForm.get('sinistreForm.sini_datesurvenance').setValue("");
    }
  }

  onChangeFocusDateDeclaration(event: any) {
    let dateDeclaration = this.mySinistreForm.get('sinistreForm.sini_datedeclaration').value;

    if ((dateFormatter(dateDeclaration, 'yyyy-MM-dd') >= dateFormatter(this.dateEffet, 'yyyy-MM-dd')) && (dateFormatter(dateDeclaration, 'yyyy-MM-dd') <= dateFormatter(new Date(), 'yyyy-MM-dd'))) {
      this.verifDateDeclaration = false;
    } else {
      this.verifDateDeclaration = true;
      this.mySinistreForm.get('sinistreForm.sini_datedeclaration').setValue("");
    }
  }

  onChangeFocusMontantPrincipal(event) {
    this.montantPrincipal = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    let monMontantMenace = Number(this.formatNumberService.replaceAll(this.montantMenace, ' ', ''));
    let monMontantLoyerImpayer = this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').value;

    if (monMontantMenace != 0 && this.montantPrincipal > monMontantMenace) {
      this.problemeMontantPrincipalCredit = true;
      this.erreur = true;
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    } else if (monMontantLoyerImpayer !== '' && this.montantPrincipal > monMontantLoyerImpayer) {
      this.problemeMontantPrincipalRiskLocatif = true;
      this.erreur = true;
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    } else if (this.montantPrincipalProposeForEngagement != 0 && this.montantPrincipal > this.montantPrincipalProposeForEngagement) {
      this.problemeMontantPrincipalCaution = true;
      this.erreur = true;
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    } else {
      this.problemeMontantPrincipalCredit = false;
      this.problemeMontantPrincipalRiskLocatif = false;
      this.problemeMontantPrincipalCaution = false;
      this.erreur = false;
      this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    }
  }

  onChangeFocusMontantFrais(event) {

    this.montantFrais = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.montantFrais);
    this.montantFrais = this.formatNumberService.numberWithCommas2(this.montantFrais);
  }

  onChangeFocusMontantHonoraire(event) {

    this.montantHonoraire = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.montantHonoraire);
    this.montantHonoraire = this.formatNumberService.numberWithCommas2(this.montantHonoraire);
  }

  onChangeFocusNombreLoyersImpayes(event) {

    let montantLoyer = this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').value;
    this.nbreLoyerImpaye = this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').value;

    this.montantLoyerImpaye = Number((montantLoyer * this.nbreLoyerImpaye));

    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue(this.montantLoyerImpaye);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantLoyerImpaye);

    this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);
    this.montantLoyerImpaye = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);

  }

  onChangeFocusNombreEcheanceRetard(event) {

    let montantCredit = this.mySinistreForm.get('creditForm.credit_mtncredit').value
    let nbrEcheanceAccorde = this.mySinistreForm.get('creditForm.credit_nbecheanceaccorde').value;

    let nbreEcheanceEnRetard = this.mySinistreForm.get('creditForm.credit_nbechenaceretard').value;
    this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue(nbreEcheanceEnRetard);

    // Calcul du montant menacé
    this.montantMenace = Number((montantCredit / nbrEcheanceAccorde) * nbreEcheanceEnRetard);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantMenace);

    // Formatage pour affichage
    this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantMenace);
    this.montantMenace = this.formatNumberService.numberWithCommas2(this.montantMenace);

  }

  getColorMontantPrincipal() {

    if (this.problemeMontantPrincipalCredit || this.problemeMontantPrincipalRiskLocatif) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  onChangeTypeSurete(event) {

  }


  onFocusOutEventRetenuDeposit(event) {

  }

  getColorRetenuDeposit() {

  }


  submit() {
    this.mySinistreForm.get('sinistreForm.sini_utilisateur').setValue(this.user.util_numero);

    console.log(this.mySinistreForm.value);

    this.sinistreService.ajouterDeclarationSinistre(this.mySinistreForm.value)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.toastrService.show(
            data.message,
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });

          this.transfertData.setData(data.data);
          this.router.navigateByUrl('home/gestion-sinistre/declaration-sinistre/view');
        } else {
          this.toastrService.show(
            data.message,
            'Notification d\'erreur',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        }
      });

  }

  cancel() {
    // this.router.navigateByUrl('home/engagement/gestion-surete-deposit')
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
