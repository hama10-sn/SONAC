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

@Component({
  selector: 'ngx-declaration-sinistre-de-la-menace',
  templateUrl: './declaration-sinistre-de-la-menace.component.html',
  styleUrls: ['./declaration-sinistre-de-la-menace.component.scss']
})
export class DeclarationSinistreDeLaMenaceComponent implements OnInit {

  mySinistreForm = this.fb.group({

    sinistreForm: this.fb.group({

      sini_num: [''],
      sini_police: [''],
      sini_risque: [''],
      sini_intermediaire: [''],
      sini_codecompagnie: [''],
      sini_branche: [''],
      sini_categorie: [''],
      sini_produit: [''],
      sini_typesinistre: [''],
      sini_datesurvenance: ['', [Validators.required]],
      sini_datedeclaration: ['', [Validators.required]],
      sini_datesaisie: [''],
      sini_souscripteur: [''],
      sini_beneficiaire: [''],
      sini_acheteur: [''],
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
      mvts_montantprincipal: [''],
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

  sinistre: any;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  autorisation: [];

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

  // variables de type objet entity
  credit: Credit;
  riskLocatif: RisqueLocatif;

  // Mes booleans
  afficherCredit: boolean = false;
  afficherRiskLocatif: boolean = false;
  verifDateDeclaration: boolean = false;
  verifDateSurvenance: boolean = false;
  problemeMontantPrincipalCredit: boolean = false;
  problemeMontantPrincipalRiskLocatif: boolean = false;
  erreur: boolean = false;
  // doublonMenaceSinistre: boolean = false;
  erreurNbreEcheanceRetard: boolean = false;
  erreurNbreLoyerImpaye: boolean = false;

  // Mes variables simples
  sinistre_codecategorie: string;
  sinistre_codeproduit: string;
  libelleClient: any = "";
  libellePolice: any = "";
  libelleAcheteur: any = "";
  libelleInterm: any = "";
  libelleBranche: any = "";
  libelleCategorie: any = "";
  libelleProduit: any = "";
  libelleDonneurDordre: any = "";
  libelleBeneficiaire: any = "";
  libelleTiersRecours: any = "";
  clientChoisi: any;
  codeCredit: string;
  codeRisqueLocatif: string;
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
    private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.sinistre = this.transfertData.getData();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });

    this.getlogin();


    this.onGetClientByNumero(this.sinistre.sini_souscripteur);
    this.libellePolice = this.sinistre.sini_police;
    this.onGetAcheteurByNumero(this.sinistre.sini_acheteur);
    this.onGetBrancheByNumero(this.sinistre.sini_branche);
    this.onGetCatagorieByNumero(this.sinistre.sini_categorie);
    this.onGetProduitByNumero(this.sinistre.sini_produit);
    this.onGetPoliceById(this.sinistre.sini_police);
    // ============== Les données du sinistre =================
    this.mySinistreForm.get('sinistreForm.sini_num').setValue(this.sinistre.sini_num);
    if (this.sinistre.sini_lieu !== null && this.sinistre.sini_lieu !== "") {
      this.mySinistreForm.get('sinistreForm.sini_lieu').setValue(this.sinistre.sini_lieu);
    }
    this.mySinistreForm.get('sinistreForm.sini_datesurvenance').setValue(dateFormatter(this.sinistre.sini_datesurvenance, 'yyyy-MM-dd'));
    this.mySinistreForm.get('sinistreForm.sini_datedeclaration').setValue(dateFormatter(this.sinistre.sini_datedeclaration, 'yyyy-MM-dd'));
    this.mySinistreForm.get('sinistreForm.sini_datesaisie').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    this.mySinistreForm.get('sinistreForm.sini_description').setValue(this.sinistre.sini_description);

    // ============= Les données du mouvement sinistre ================

    this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(this.sinistre.mvts_typegestionsinistre);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.sinistre?.mvts_montantprincipal);
    this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.sinistre?.mvts_montantprincipal);

    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.sinistre.mvts_montantfrais);
    this.montantFrais = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantfrais);

    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.sinistre.mvts_montanthonoraire);
    this.montantHonoraire = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montanthonoraire);

    //  Pour afficher l'ecran d'identification du risque en fonction de la branche
    if (this.sinistre.sini_branche == 14) {
      this.afficherCredit = true;
      this.afficherRiskLocatif = false;
      this.mySinistreForm.get('creditForm.credit_numero').setValidators(Validators.required);
      this.mySinistreForm.get('risque_locatifForm.riskl_numero').clearValidators();
      this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValue(0);
    } else if (this.sinistre.sini_branche == 16) {
      this.afficherCredit = false;
      this.afficherRiskLocatif = true;
      this.mySinistreForm.get('creditForm.credit_numero').clearValidators();
      this.mySinistreForm.get('creditForm.credit_numero').setValue(0);
      this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValidators(Validators.required);
    }

    this.mySinistreForm.get('creditForm.credit_numero').updateValueAndValidity()
    this.mySinistreForm.get('risque_locatifForm.riskl_numero').updateValueAndValidity();

    this.onGetAllCreditByClientAndAcheteur(this.sinistre.sini_souscripteur, this.sinistre.sini_acheteur);
    this.onGetAllRisqueLocatifByClientAndPoliceAndAcheteur(this.sinistre.sini_souscripteur, this.sinistre.sini_police, this.sinistre.sini_acheteur);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // ================= OnGetAllMethode ====================

  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {
              this.user = data;
            });
        }
      });
  }

  onGetPoliceById(id: any) {
    this.policeService.getPolice(id)
      .subscribe((data: Police) => {
        // Je recupere la date d'effet et d'echeance de la police pour faire les controle de la date de
        // survenance et de declaration du sinistre
        this.dateEcheance = data?.poli_dateecheance as Date;
        this.dateEffet = data?.poli_dateeffetencours as Date;
      });
  }

  onGetClientByNumero(numero: Number) {
    this.clientService.getClientByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let client = data.data;

          if ((client?.clien_denomination === null || client.clien_denomination === "") && client?.clien_prenom !== null && client?.clien_prenom !== "" && client?.clien_nom !== null && client?.clien_nom !== "") {
            this.libelleClient = client?.clien_numero + " : " + client?.clien_prenom + " " + client?.clien_nom;

          } else if ((client?.clien_denomination !== null && client?.clien_denomination !== "") && (client?.clien_prenom === null || client?.clien_prenom === "" || client?.clien_nom === null || client?.clien_nom === "")) {
            this.libelleClient = client?.clien_numero + " : " + client?.clien_denomination;
          } else {
            this.libelleClient = client?.clien_numero + " : " + client?.clien_prenom + " " + client?.clien_nom + " / " + client?.clien_denomination;
          }
        } else {
          this.libelleClient = "";
        }
      });
  }

  onGetAcheteurByNumero(numACheteur: any) {
    this.acheteurServie.findAcheteurByNumero(numACheteur)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let acheteur = data.data;
          this.libelleAcheteur = acheteur?.achet_numero + " : " + acheteur?.achet_prenom + " " + acheteur?.achet_nom;
        } else {
          this.libelleAcheteur = "";
        }

      });
  }

  onGetBrancheByNumero(numero: any) {
    this.brancheService.getBrancheByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let branche = data.data;
          this.libelleBranche = branche?.branche_numero + " : " + branche?.branche_libelleLong;
        } else {
          this.libelleBranche = "";
        }
      });
  }

  onGetCatagorieByNumero(numero: any) {
    this.categorieService.getCategorieByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let categorie = data.data;
          this.libelleCategorie = categorie?.categ_numero + " : " + categorie?.categ_libellelong;
        } else {
          this.libelleCategorie = "";
        }
      });
  }

  onGetProduitByNumero(numero: any) {
    this.produitService.getProduitByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let produit = data.data;
          this.libelleProduit = produit?.prod_numero + " : " + produit?.prod_denominationlong;
        } else {
          this.libelleProduit = "";
        }
      });
  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')
  }

  getToday2(): string {
    return dateFormatter(this.sinistre.sini_datesurvenance, 'yyyy-MM-dd')
  }

  onGetAllCreditByClientAndAcheteur(numclient: Number, numAcheteur: Number) {
    this.creditService.getCreditByClientAndAcheteur(numclient, numAcheteur)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let credit = data.data[0];

          this.mySinistreForm.get('creditForm.credit_numero').setValue(credit.credit_numero);
          this.montantCredit = this.formatNumberService.numberWithCommas2(Number(credit.credit_mtncredit));
          this.mySinistreForm.get('creditForm.credit_mtncredit').setValue(credit.credit_mtncredit);
          this.mySinistreForm.get('creditForm.credit_nbecheanceaccorde').setValue(credit.credit_nbecheanceaccorde);
          this.mySinistreForm.get('creditForm.credit_nbechenaceretard').setValue(credit.credit_nbechenaceretard);
          this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue(credit.credit_nbecheanceimpaye);

          // Calcul du montant menacé
          let echeanceRetard = this.mySinistreForm.get('creditForm.credit_nbechenaceretard').value;
          if (credit.credit_nbecheanceaccorde !== null && credit.credit_nbecheanceaccorde !== "") {
            this.montantMenace = Number((credit.credit_mtncredit / credit.credit_nbecheanceaccorde) * echeanceRetard);
            // Formatage pour affichage
            this.montantMenace = this.formatNumberService.numberWithCommas2(this.montantMenace);
          }
        }
      });
  }

  onGetAllRisqueLocatifByClientAndPoliceAndAcheteur(numclient: Number, police: Number, numAcheteur: Number) {
    this.risqueLocatifService.getRisque_locatifsByClientAndPoliceAndAcheteur(numclient, police, numAcheteur)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let risqueLocatif = data.data[0];

          this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValue(risqueLocatif.riskl_numero);

          this.montantLoyer = this.formatNumberService.numberWithCommas2(Number(risqueLocatif.riskl_mtnloyer));
          this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').setValue(risqueLocatif.riskl_mtnloyer);

          this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').setValue(risqueLocatif.riskl_nombreloyerimpaye);
          let nbreLoyerImpaye = this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').value;

          this.montantLoyerImpaye = Number((risqueLocatif.riskl_mtnloyer * nbreLoyerImpaye));

          this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue(this.montantLoyerImpaye);

          // Formatage pour l'affichage
          this.montantLoyerImpaye = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);
        }
      });
  }

  // ================= OnchangeMethode ==================

  onChangeFocusDateSurvenance(event) {

    let dateSurvenance = this.mySinistreForm.get('sinistreForm.sini_datesurvenance').value;

    if ((dateFormatter(dateSurvenance, 'yyyy-MM-dd') >= dateFormatter(this.dateEffet, 'yyyy-MM-dd')) && (dateFormatter(dateSurvenance, 'yyyy-MM-dd') <= dateFormatter(this.dateEcheance, 'yyyy-MM-dd')) && (dateFormatter(dateSurvenance, 'yyyy-MM-dd') <= dateFormatter(new Date(), 'yyyy-MM-dd')) && (dateFormatter(dateSurvenance, 'yyyy-MM-dd') >= dateFormatter(this.sinistre.sini_datesurvenance, 'yyyy-MM-dd'))) {
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
    } else {
      this.problemeMontantPrincipalCredit = false;
      this.problemeMontantPrincipalRiskLocatif = false;
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

    // On se limite au nbre d'échéance accordée
    if (nbreEcheanceEnRetard > nbrEcheanceAccorde) {
      this.erreur = true;
      this.erreurNbreEcheanceRetard = true;
    } else {
      this.erreur = false;
      this.erreurNbreEcheanceRetard = false;
    }

  }

  onChangeFocusNombreLoyersImpayes(event) {

    let montantLoyer = this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').value;
    this.nbreLoyerImpaye = this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').value;

    this.montantLoyerImpaye = Number((montantLoyer * this.nbreLoyerImpaye));

    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue(this.montantLoyerImpaye);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantLoyerImpaye);

    this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);
    this.montantLoyerImpaye = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);

    // On se limite à 4
    if (this.nbreLoyerImpaye > 4) {
      this.erreur = true;
      this.erreurNbreLoyerImpaye = true;
    } else {
      this.erreur = false;
      this.erreurNbreLoyerImpaye = false;
    }
  }

  // ================ onGetColorMethode =========================

  getColorMontantPrincipal() {

    if (this.problemeMontantPrincipalCredit || this.problemeMontantPrincipalRiskLocatif) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNbreEcheanceRetard() {

    if (this.erreurNbreEcheanceRetard) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNbreLoyerImpayees() {

    if (this.erreurNbreLoyerImpaye) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  submit() {
    this.mySinistreForm.get('sinistreForm.sini_utilisateur').setValue(this.user.util_numero);

    // console.log(this.mySinistreForm.value);

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
    this.router.navigateByUrl('home/gestion-sinistre/liste-menace-sinistre')
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
