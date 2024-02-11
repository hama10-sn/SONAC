import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { CategorieSocioprofessionnelle } from '../../../../../model/CategorieSocioprofessionnelle';
import { Civilite } from '../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Client } from '../../../../../model/Client';
import { Groupe } from '../../../../../model/Groupe';
import { User } from '../../../../../model/User';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { ClientService } from '../../../../../services/client.service';
import { FormatNumberService } from '../../../../../services/formatNumber.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';
import type from '../../../../data/type.json';
import dateFormatter from 'date-format-conversion';
import { Prospect } from '../../../../../model/Prospect';
import { ProspectService } from '../../../../../services/prospect.service';

@Component({
  selector: 'ngx-transformer-prospect-en-client',
  templateUrl: './transformer-prospect-en-client.component.html',
  styleUrls: ['./transformer-prospect-en-client.component.scss']
})
export class TransformerProspectEnClientComponent implements OnInit {

  modifForm = this.fb.group({
    client_id: [''],
    clien_numero: [''],
    clien_typeclient: [''],
    clien_numerosolvabilite: [''],
    clien_nature: [''],
    clien_typesociete: [''], // obligatoire si personne morale
    clien_coderegroupgestion: [''],
    clien_titre: [''],
    clien_nom: [''], // obligatoire si personne physique
    clien_prenom: [''], // obligatoire si personne physique
    clien_denomination: [''],  // obligatoire si personne morale
    clien_sigle: [''],   // obligatoire si personne morale
    clien_adressenumero: ['', [Validators.required]],
    clien_adresserue: [''],
    clien_adresseville: ['', [Validators.required]],
    clien_datenaissance: ['', [Validators.required]],
    // clien_datesouscription1: [''],
    clien_categsocioprof: ['', [Validators.required]],
    clien_telephone1: ['', [Validators.required]],
    clien_telephone2: [''],
    clien_portable: ['', [Validators.required]],
    // clien_fax: [''],
    clien_email: ['', [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],   // obligatoire si personne morale
    clien_website: [''],
    clien_ninea: [''],
    // clien_registrecommerce: ['', [Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]],
    clien_registrecommerce: [''],
    clien_codeorigine: ['',],
    clien_sexe: [''],
    //clien_formejuridique: [''],   // obligatoire si personne morale
    clien_effectif: [''],
    clien_chiffreaffaireannuel: [''], // obligatoire si personne morale
    clien_chiffreaffaireprime: [''],
    clien_chargesinistre: [''],       // obligatoire si personne morale
    //clien_contactprinci: ['', [Validators.pattern(/^(221|00221|\+221)?(77|78|75|70|76)[0-9]{7}$/)]],
    clien_contactprinci: [''],
    clien_utilisateur: [''],
    clien_datemodification: [''],
    clien_anciennumero: [''],
    clien_CIN: [''],// obligatoire si personne physique
    clien_capital_social: [''],// obligatoire si personne morale
    clien_date_relation: ['', [Validators.required]],
    clien_secteur_activite: [''],// obligatoire si personne morale
    clien_status: [''],
    clien_princdirigeant: [''],
    //Les champs ajoutés après formation SONAC
    clien_modegouvernance: [''],
    clien_principalactionnaire: [''],
    clien_facebook: [''],
    clien_linkdin: [''],
    clien_activitecommercante: ['', [Validators.required]],
    clien_passeport: [''],
    clien_commentaire: [''],
    clien_numeroprospect: ['']
  });

  //telephone

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  erreur: boolean = false;

  typePersonneChoisi: any;
  personnePhysique = "1";
  personneMorale = "2";
  contactPrincip: string;
  telephone1: string;
  portable: string;
  typeSociete: any;
  code_secteur: any;

  // Variables booléan pour gerer le problème de controle de saisi
  problemePersonnePhysique: boolean = false;
  // problemePersonnePhysiCivilite: boolean = false;
  problemePersonneMorale: boolean = false;
  problemeNom: boolean = false;
  problemePrenom: boolean = false;
  problemeDirigeant: boolean = false;
  problemeDenomination: boolean = false;
  // problemeSigle: boolean = false;
  problemeSite: boolean = false;
  // problemeRC: boolean = false;
  // problemeCodeNinea: boolean = false;
  problemeRCetNINEA: boolean = false;
  // problemeMemeRcNinea: boolean = false;
  problemeMemeRc: boolean = false;
  problemeMemeNinea: boolean = false;
  problemeTypeSociete: boolean = false;
  problemeNumClient: boolean = false;
  problemeMemeNomPrenom: boolean = false;
  problemeAdresseTel: boolean = false;
  problemeDenominationdouble: boolean = false;
  problemeTelephone1: boolean = false;
  problemeTelephone2: boolean = false;
  problemePortable: boolean = false;
  problemeEmail: boolean = false;
  problemeEmail1: boolean = false;
  problemeTelephone11: boolean = false;
  problemeTelephone22: boolean = false;
  problemeportable11: boolean = false;
  problemeRue: boolean = false;
  problemeVille: boolean = false;
  // problemeDenominationGerant: boolean = false;
  // problemeSigleGerant: boolean = false;
  // problemeSiteGerant: boolean = false;
  // problemeRCGerant: boolean = false;
  // problemeCodeNineaGerant: boolean = false;
  // gerer le suffixe du code ninea dénommé: COFI
  problemeErreurCOFI: boolean = false;
  problemefirstSevenNINEA: boolean = false;
  problemefisrtCOFI: boolean = false;
  problemetwoCOFI: boolean = false;
  problemethreeCOFI: boolean = false;
  // problemeCIN: boolean = false;
  porblemeLongeurCIN: boolean = false;
  // problemePasseport: boolean = false;
  problemeCINouPasseport: boolean = false;
  obligatoirEmail: boolean = false;
  problemeCategoriesociopro: boolean = false;
  problemeCapitalSocial: boolean = false;
  problemeChiffreAffaireActivite: boolean = false;
  problemeChargeSinistre: boolean = false;
  problemeClassificationSecteur: boolean = false;
  // problemeAfficheTypeSociete: boolean = false;

  // problemeAfficheNineaValide: boolean = false;
  // problemeAfficheNineaAttente: boolean = false;
  // problemeAfficheRCValide: boolean = false;
  // problemeAfficheRCAttente: boolean = false;

  problemeAfficheStatusValide: boolean = false;
  problemeAfficheStatusAttente: boolean = false;
  // problemeAfficheCivilite: boolean = true;
  // problemeAfficheCiviliteGerant: boolean = false;

  showObligatoire: boolean = false;
  showObligatoireEmail: boolean = false;
  showObligatoireCategSociopro: boolean = false;
  showObligatoirePrincipalDirigeant: boolean = false;
  showObligatoireRCetNinea: boolean = false;
  showObligatoireCINetPasseport: boolean = false;
  bloquerPersPhysique: boolean = true;
  bloquerPersMorale: boolean = true;
  problemeDate: boolean = false;

  attente_ninea_rc: boolean = false;
  attente_ninea: boolean = false;
  attente_rc: boolean = false;

  dateEntreeRelation: any;
  dateCreation: any;

  // Vider le champs titre civilité quand on change nature personne:
  clien_titreCivilite: any;

  // Les variables à gerer pour type personne = personne physique
  prenom: string;
  nom: string;
  gerant = "23";
  categoriesociopro: any;
  dirigeant: string;

  // Les variables à gerer pour type personne = personne morale
  denomination: string;
  sigle: string;
  site: string;
  codeNinea: string;
  registreCommerce: string;
  telephone: string;
  adresse: string;
  email: string;



  categorie: CategorieSocioprofessionnelle;
  civilite: Civilite;
  // listCivilite: any[];
  listeCodeCivilites: any[];
  // listCategoriSocio: any[];
  listType: any[];
  listTypeSociete: any[];
  listGroupes: any[];
  // listesecteurs: any[];

  //listecodecimacomp: Cimacodificationcompagnie [];

  login: any;
  user: User;

  // categories: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();
  // civilites: Array<Civilite> = new Array<Civilite>();
  clients: Array<Client> = new Array<Client>();
  groupes: Array<Groupe> = new Array<Groupe>();
  // secteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  // ================ Déclarations des variables pour la recherche avec filtre ======================

  listeCodeCategorieSociopro: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();
  classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  // listCategoriSocio: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();

  /** control for the selected classification */
  // public categSocioproCtrl: FormControl = new FormControl();
  // public classifCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  // public categSocioproFilterCtrl: FormControl = new FormControl();
  // public classifFilterCtrl: FormControl = new FormControl();

  /** list of classifications filtered by search keyword */
  // public filteredCategSociopro: ReplaySubject<CategorieSocioprofessionnelle[]> = new ReplaySubject<CategorieSocioprofessionnelle[]>();
  // public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();

  protected _onDestroy = new Subject<void>();

  type_client: String;
  code_Civilite: any;
  code_categorie: any;
  code_typeSociete: any;
  code_typeSociete2: any;
  value_typeSociete: any;
  code_natureClient: String;
  code_groupe: String;
  civiliteNature: String;
  cliendatenaissance: Date;
  // cliensouscription: Date;
  cliendateEntreeRelation: Date;
  numRue: any;
  ville: string;
  civile: string;
  cin: string;
  passeport: string;
  code_sexe: any;
  value_status: String;
  client_status: String;
  client_valide = "1";
  client_attente = "2";

  // client: Client;
  prospect: Prospect;

  capitalsocial: any;
  chiffreAffaireActivite: any;
  chargeSinistre: any;
  classificationSecteur: any;

  //Controle sur le code Ninéa
  firstSevenCaract: any = null;
  lastthreecaract: any = null;
  first: any = null
  two: any = null;
  three: any = null;

  longeurCIN = 17;
  codeClassif: any;

  nonModifierChamps: boolean = true;
  profil = 'Administrateur Général';

  OUI = "1";
  NON = "2";
  code_activitecommercante: String;
  activiteCommercante: string;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  autorisation = [];
  listeClients: any[];
  listeClients2: any[];
  listeModeGouvernance: any[];
  code_modegouvernance: any;
  value_modegouvernance: any;
  modifModeGouvernance: boolean = false;

  adminGeneral = "Administrateur Général";
  // modifPrincipalActionnaire: boolean = false;
  modifPrincipDirigeant: boolean = false;
  numeroProspect: number;

  codeSouscripteur = "1";

  @Input() listTypeclient: any[] = type;
  @Input() listeModeGouver: any[] = type;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  constructor(private fb: FormBuilder,
    private categorieService: CategorieSocioprofessionnelleService,
    private clientService: ClientService,
    private userService: UserService,
    private civiliteService: CiviliteService,
    private groupeService: GroupeService,
    private secteurService: ClassificationSecteurService,
    private authService: NbAuthService,
    private formatNumberService: FormatNumberService,
    private router: Router,
    private toastrService: NbToastrService,
    private transfertData: TransfertDataService,
    private prospectService: ProspectService) { }

  ngOnInit(): void {
    this.prospect = this.transfertData.getData();
    // console.log(this.prospect);
    // console.log(typeof(this.prospect.prospc_numero));
    this.numeroProspect = this.prospect.prospc_numero;
    this.onGetAllClients2();
    this.onGetAllCategorieSociopro();
    this.onGetAllClassificationSecteurs();
    this.onGetAllGroupe();
    this.getlogin();

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');

          // this.login_demandeur = token.getPayload().sub;
          this.onGetUser(token.getPayload().sub);

          this.userService.getUser(token.getPayload().sub)
            .subscribe((data: User) => {
              if (data.util_profil == this.adminGeneral) {
                this.nonModifierChamps = false;
              } else {
                this.nonModifierChamps = true;
              }
            });
        }
      });

    this.listType = this.listTypeclient['TYPE_CLIENT'];
    // console.log(this.prospect.prospc_nature);
    this.modifForm.controls['clien_numeroprospect'].setValue(this.prospect.prospc_numero);
    this.modifForm.controls['clien_nature'].setValue(this.prospect.prospc_nature);
    this.typePersonneChoisi = this.prospect.prospc_nature;

    if (this.prospect.prospc_nature == this.personnePhysique) {
      this.code_natureClient = this.prospect.prospc_nature + " : Personne physique";
      this.bloquerPersPhysique = false;
      this.bloquerPersMorale = true;

    } else if (this.prospect.prospc_nature == this.personneMorale) {
      this.code_natureClient = this.prospect.prospc_nature + " : Personne morale";
      this.bloquerPersPhysique = true;
      this.bloquerPersMorale = false;
    }

    if (this.prospect.prospc_datenaissance != null) {
      this.cliendatenaissance = dateFormatter(this.prospect?.prospc_datenaissance, 'yyyy-MM-dd');
    }
    if (this.prospect.prospc_date_relation != null) {
      this.cliendateEntreeRelation = dateFormatter(this.prospect.prospc_date_relation, 'yyyy-MM-dd');
    }

    this.modifForm.controls['clien_datenaissance'].setValue(this.cliendatenaissance);
    this.modifForm.controls['clien_date_relation'].setValue(this.cliendateEntreeRelation);

    this.modifForm.controls['clien_activitecommercante'].setValue(this.prospect.prospc_activitecommercante);

    if (this.prospect.prospc_activitecommercante == this.OUI) {
      this.code_activitecommercante = "OUI";
      this.modifForm.controls['clien_princdirigeant'].setValidators(Validators.required);
      // this.modifForm.controls['clien_ninea'].setValidators(Validators.required);
      // this.modifForm.controls['clien_registrecommerce'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]));
      this.showObligatoirePrincipalDirigeant = true;
      this.showObligatoireRCetNinea = true;
      this.showObligatoireCINetPasseport = false;

    } else if (this.prospect.prospc_activitecommercante == this.NON) {
      this.code_activitecommercante = "NON";
      this.modifForm.controls['clien_princdirigeant'].clearValidators();
      // this.modifForm.controls['clien_ninea'].clearValidators();
      // this.modifForm.controls['clien_registrecommerce'].clearValidators();
      // this.modifForm.controls['clien_registrecommerce'].setValidators(Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/));
      this.showObligatoirePrincipalDirigeant = false;
      this.showObligatoireRCetNinea = false;

      if (this.typePersonneChoisi == this.personnePhysique) {
        // this.addForm.controls['clien_CIN'].setValidators(Validators.required);
        // this.addForm.controls['clien_passeport'].setValidators(Validators.required);
        this.showObligatoireCINetPasseport = true
      } else {
        this.showObligatoireCINetPasseport = false;
      }
    }
    this.modifForm.controls['clien_princdirigeant'].updateValueAndValidity();
    // this.modifForm.controls['clien_ninea'].updateValueAndValidity();
    // this.modifForm.controls['clien_registrecommerce'].updateValueAndValidity();
    // this.modifForm.controls['clien_modegouvernance'].setValue(this.client.clien_modegouvernance);

    // this.code_modegouvernance = this.client.clien_modegouvernance;
    this.listeModeGouvernance = this.listeModeGouver['MODE_GOUVERNANCE'];
    // this.value_modegouvernance = (this.listeModeGouvernance.find(p => p?.id == this.code_modegouvernance))?.value;

    // if (this.client.clien_modegouvernance == "" || this.client.clien_modegouvernance == null) {
    //   this.modifModeGouvernance = true;
    // } else {
    //   this.modifModeGouvernance = false;
    // }

    //================================================

    this.modifForm.controls['clien_categsocioprof'].setValue(this.prospect.prospc_categosocioprof);
    this.code_categorie = this.prospect?.prospc_categosocioprof;
    // if (this.client.clien_categsocioprof != null) {
    //   this.categSocioproCtrl.setValue(this.client.clien_categsocioprof.toString());
    // }

    // this.modifForm.controls['clien_coderegroupgestion'].setValue(this.client.clien_coderegroupgestion);
    // this.code_groupe = this.client?.clien_coderegroupgestion?.toString();

    this.modifForm.controls['clien_nom'].setValue(this.prospect.prospc_nom);
    this.modifForm.controls['clien_prenom'].setValue(this.prospect.prospc_prenom);
    this.modifForm.controls['clien_titre'].setValue(this.prospect.prospc_titre);
    this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    this.code_Civilite = this.prospect.prospc_titre;

    this.modifForm.controls['clien_CIN'].setValue(this.prospect.prospc_cin);
    this.modifForm.controls['clien_passeport'].setValue(this.prospect.prospc_passeport);
    this.modifForm.controls['clien_princdirigeant'].setValue(this.prospect.prospc_princdirigeant);
    if (this.prospect.prospc_princdirigeant === null || this.prospect.prospc_princdirigeant === '') {
      this.modifPrincipDirigeant = true;
    } else {
      this.modifPrincipDirigeant = false;
    }

    this.modifForm.controls['clien_ninea'].setValue(this.prospect.prospc_ninea);
    this.modifForm.controls['clien_registrecommerce'].setValue(this.prospect.prospc_registrecommerce);

    this.modifForm.controls['clien_typesociete'].setValue(this.prospect.prospc_typesociete);
    this.code_typeSociete = this.prospect.prospc_typesociete;
    this.listTypeSociete = this.listTypeclient['TYPE_SOCIETE'];
    if (this.code_typeSociete == null) {
      this.value_typeSociete = "";
    } else {
      this.value_typeSociete = (this.listTypeSociete.find(p => p?.id == this.code_typeSociete))?.value;
    }

    this.modifForm.controls['clien_denomination'].setValue(this.prospect.prospc_denomination);
    this.modifForm.controls['clien_sigle'].setValue(this.prospect.prospc_sigle);
    this.modifForm.controls['clien_secteur_activite'].setValue(this.prospect.prospc_classificationmetier);
    this.codeClassif = Number(this.prospect?.prospc_classificationmetier);
    this.modifForm.controls['clien_adressenumero'].setValue(this.prospect.prospc_adressenumero);
    this.modifForm.controls['clien_adresserue'].setValue(this.prospect.prospc_adresserue);
    this.modifForm.controls['clien_adresseville'].setValue(this.prospect.prospc_adresseville);

    this.modifForm.controls['clien_telephone1'].setValue(this.prospect.prospc_telephone1);
    this.modifForm.controls['clien_telephone2'].setValue(this.prospect.prospc_telephone2);
    this.modifForm.controls['clien_portable'].setValue(this.prospect.prospc_portable);
    // this.modifForm.controls['clien_telephone1'].setValue(this.modifForm.controls['clien_telephone1'].value.internationalNumber);
    // this.modifForm.controls['clien_telephone2'].setValue(this.modifForm.controls['clien_telephone2'].value?.internationalNumber);
    // this.modifForm.controls['clien_portable'].setValue(this.modifForm.controls['clien_portable'].value?.internationalNumber);

    this.modifForm.controls['clien_email'].setValue(this.prospect.prospc_email);
    this.modifForm.controls['clien_website'].setValue(this.prospect.prospc_website);
    this.modifForm.controls['clien_facebook'].setValue(this.prospect.prospc_facebook);
    this.modifForm.controls['clien_linkdin'].setValue(this.prospect.prospc_linkdin);

    this.modifForm.controls['clien_effectif'].setValue(0);
    this.modifForm.controls['clien_chiffreaffaireannuel'].setValue(this.prospect.prospc_chiffreaffaireannuel);
    this.modifForm.controls['clien_chiffreaffaireprime'].setValue(0);
    this.modifForm.controls['clien_chargesinistre'].setValue(0);
    // this.capitalsocial = this.formatNumberService.numberWithCommas2(Number(this.prospect.prospc_capitalsocial));
    // console.log(this.prospect.prospc_capitalsocial)
    this.modifForm.controls['clien_capital_social'].setValue(this.prospect.prospc_capitalsocial);
    this.modifForm.controls['clien_codeorigine'].setValue(0);

    // this.modifForm.controls['clien_status'].setValue(this.client.clien_status);

    if (this.typePersonneChoisi == this.personneMorale) {

      // this.problemePersonneMorale = true;
      // this.problemeAfficheTypeSociete = true;
      // this.modifForm.controls['clien_typesociete'].setValue(this.client.clien_typesociete);
      // this.code_typeSociete = this.client.clien_typesociete.toString();

      // this.problemeAfficheCiviliteGerant = false ;
      // this.problemeAfficheCivilite = true ;

      this.showObligatoire = true;
      this.showObligatoireEmail = true
      this.showObligatoireCategSociopro = false;
      this.modifForm.controls['clien_datenaissance'].setValidators(Validators.required);
      this.modifForm.controls['clien_categsocioprof'].clearValidators();
      this.modifForm.controls['clien_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]));
    }
    else if (this.typePersonneChoisi == this.personnePhysique) {

      this.modifForm.controls['clien_datenaissance'].clearValidators();
      this.modifForm.controls['clien_categsocioprof'].setValidators(Validators.required);
      this.showObligatoire = false;
      this.showObligatoireCategSociopro = true;


      if (this.prospect.prospc_activitecommercante == this.NON) {
        this.showObligatoireEmail = false;
        this.modifForm.controls['clien_email'].clearValidators();
        this.modifForm.controls['clien_email'].setValidators(Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/));
      } else {
        this.showObligatoireEmail = true;
        this.modifForm.controls['clien_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]));
      }
    }

    this.modifForm.controls['clien_datenaissance'].updateValueAndValidity();
    this.modifForm.controls['clien_categsocioprof'].updateValueAndValidity();
    this.modifForm.controls['clien_email'].updateValueAndValidity();

    // =================== Listen for search field value changes =======================
    // this.categSocioproFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterCategsociopro();
    //   });

    // this.classifFilterCtrl.valueChanges
    //   .pipe(takeUntil(this._onDestroy))
    //   .subscribe(() => {
    //     this.filterClassifs();
    //   });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /*
  protected filterCategsociopro() {
    if (!this.listeCodeCategorieSociopro) {
      return;
    }
    // get the search keyword
    let search = this.categSocioproFilterCtrl.value;
    if (!search) {
      this.filteredCategSociopro.next(this.listeCodeCategorieSociopro.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCategSociopro.next(
      this.listeCodeCategorieSociopro.filter(categ =>
        categ.categs_liblong.toLowerCase().indexOf(search) > -1 ||
        categ.categs_code.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterClassifs() {
    if (!this.classifications) {
      return;
    }
    // get the search keyword
    let search = this.classifFilterCtrl.value;
    if (!search) {
      this.filteredClassif.next(this.classifications.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredClassif.next(
      this.classifications.filter(classif =>
        classif.libelle.toLowerCase().indexOf(search) > -1 ||
        classif.code.toString().toLowerCase().indexOf(search) > -1)
    );
  }
  */

  // onGetLibelleByTypeClient(type: String) {
  //   //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

  //   return (this.listType.find(p => p.id === type))?.value;
  // }


  onGetAllCategorieSociopro() {
    this.categorieService.getAllCategorieSocioprofessionnelle()
      .subscribe((data: CategorieSocioprofessionnelle[]) => {
        this.listeCodeCategorieSociopro = data as CategorieSocioprofessionnelle[];
        // this.filteredCategSociopro.next(this.listeCodeCategorieSociopro.slice());
      });
  }

  // onGetAllTypeCivilite() {
  //   this.civiliteService.getAllCivilite()
  //     .subscribe((data: Civilite[]) => {
  //       this.civilites = data;
  //       this.listCivilite = data as Civilite[];
  //     });
  // }

  onGetAllCiviliteByNature(nature: number) {
    this.civiliteService.getAllCiviliteByNature(nature)
      .subscribe((data: Civilite[]) => {
        this.listeCodeCivilites = data as Civilite[];
      });
  }

  onGetAllGroupe() {
    this.groupeService.getAllGroupes()
      .subscribe((data: Groupe[]) => {
        this.groupes = data;
        this.listGroupes = data as Groupe[];
      });
  }

  onGetAllClients() {
    this.clientService.getAllClientPhysique()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.listeClients = data as Client[];
      });
  }

  onGetAllClients2() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.listeClients2 = data as Client[];
      });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        if (this.user.util_profil == this.profil) {
          this.nonModifierChamps = false;
        } else {
          this.nonModifierChamps = true;
        }

      });
  }

  onChangeGroupe(event) {
    this.modifForm.controls['clien_coderegroupgestion'].setValue(event);
  }
  onChangeSexe(event) {
    this.modifForm.controls['clien_sexe'].setValue(event);
  }
  onGetLibelleByNaturePersonne(numero: any) {
    if (numero === this.personnePhysique) {
      return 'Personne physique';
    } else if (numero === this.personneMorale) {
      return 'Personne morale';
    }
  }

  onGetLibelleByClassifMetier(numero: any) {
    return numero + " : " + (this.classifications?.find(c => c.code == numero))?.libelle;
  }

  onGetLibelleByCategorieSociopro(numero: any) {
    return numero + " : " + (this.listeCodeCategorieSociopro?.find(c => c.categs_code === numero))?.categs_libcourt;
  }

  /*
  onChangePersonne(event) {
    this.modifForm.controls['clien_nature'].setValue(event);
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.clien_titreCivilite = "".toString();
    this.modifForm.controls['clien_titre'].setValue(this.clien_titreCivilite);

    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique) {
      this.problemePersonnePhysique = true;
      this.problemePersonneMorale = false;
      this.problemeDenomination = false;
      this.problemeSite = false;
      this.problemeTypeSociete = false;
      this.erreur = false;

      if (this.activiteCommercante == this.NON) {
        this.showObligatoireCINetPasseport = true
      } else {
        this.showObligatoireCINetPasseport = false;
      }

    } else if (this.typePersonneChoisi === this.personneMorale) {
      this.obligatoirEmail = true;
      this.problemePersonneMorale = true;
      this.problemePersonnePhysique = false;
      this.problemeNom = false;
      this.problemePrenom = false;
      this.erreur = false;

      this.showObligatoireCINetPasseport = false;
    }
  }
  */

  onChangeModeGouvernance(event) {
    this.modifForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id === event)).id);
  }

  cancel() {
    this.router.navigateByUrl('/home/gestion-commerciale/gestion-portefeuille/prospects');
  }

  submit() {

    this.dateEntreeRelation = this.modifForm.get("clien_date_relation").value;
    this.dateCreation = this.modifForm.get("clien_datenaissance").value;
    this.adresse = this.modifForm.get("clien_adresseville").value;
    this.telephone = this.modifForm.get("clien_telephone1").value;
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.categoriesociopro = this.modifForm.get("clien_categsocioprof").value;
    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;
    this.nom = this.modifForm.get("clien_nom").value;
    this.prenom = this.modifForm.get("clien_prenom").value;

    this.cin = this.modifForm.get("clien_CIN").value;
    this.passeport = this.modifForm.get("clien_passeport").value;

    this.dirigeant = this.modifForm.get("clien_princdirigeant").value;
    this.capitalsocial = this.modifForm.get("clien_capital_social").value;
    this.chiffreAffaireActivite = this.modifForm.get("clien_chiffreaffaireannuel").value;
    this.chargeSinistre = this.modifForm.get("clien_chargesinistre").value;
    this.classificationSecteur = this.modifForm.get("clien_secteur_activite").value;
    this.denomination = this.modifForm.get("clien_denomination").value;
    this.sigle = this.modifForm.get("clien_sigle").value;
    //this.site = this.addForm.get("clien_website").value;
    this.registreCommerce = this.modifForm.get("clien_registrecommerce").value;
    this.codeNinea = this.modifForm.get("clien_ninea").value;
    this.typeSociete = this.modifForm.get("clien_typesociete").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;
    this.email = this.modifForm.get("clien_email").value;
    // this.modifForm.controls['clien_telephone1'].setValue(this.modifForm.controls['clien_telephone1'].value.internationalNumber);
    // this.modifForm.controls['clien_telephone2'].setValue(this.modifForm.controls['clien_telephone2'].value?.internationalNumber);
    // this.modifForm.controls['clien_portable'].setValue(this.modifForm.controls['clien_portable'].value?.internationalNumber);


    // this.client_status = this.addForm.get("clien_status").value;

    /*
    if (this.codeNinea != null && this.codeNinea != '') {
      // On gère la partie NINEA qui est composé de 7 caractères numériques
      this.firstSevenCaract = this.codeNinea.substr(0, 7);

      // Gèrer la partie COFI du code NINEA
      this.lastthreecaract = this.codeNinea.substr(this.codeNinea.length - 3);
      this.first = this.lastthreecaract.charAt(0);
      this.two = this.lastthreecaract.charAt(1);
      this.three = this.lastthreecaract.charAt(2);
    }
    */

    // On gère le prenom et nom pour type de personne = personne physique
    if (this.typePersonneChoisi === this.personnePhysique && (this.categoriesociopro === null || this.categoriesociopro === "")) {
      this.problemeCategoriesociopro = true;
      this.erreur = true;
    }
    else if (this.dateEntreeRelation != null && this.dateEntreeRelation !== "" && this.dateCreation != null && this.dateCreation !== "" && (this.dateCreation > this.dateEntreeRelation)) {
      this.problemeDate = true;
      this.erreur = true;
    }
    else if (this.typePersonneChoisi === this.personnePhysique && (this.nom === null || this.nom === "")) {
      this.problemeNom = true;
      this.erreur = true;
    } else if (this.typePersonneChoisi === this.personnePhysique && (this.prenom === null || this.prenom === "")) {
      this.problemePrenom = true;
      this.erreur = true;
    } else if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
      this.erreur = true;
    } else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.porblemeLongeurCIN = true;
      this.erreur = true;
    }
    else if (this.activiteCommercante == this.OUI && (this.dirigeant == null || this.dirigeant == "")) {
      this.problemeDirigeant = true;
      this.erreur = true;
    }
    else if (this.typePersonneChoisi === this.personneMorale && (this.denomination === null || this.denomination === "")) {
      this.problemeDenomination = true;
      this.erreur = true;
    }
    // else if (this.typePersonneChoisi === this.personneMorale && (this.sigle === null || this.sigle === "")) {
    //   this.problemeSigle = true;
    //   this.erreur = true;
    // }
    // Regle de gestion a changé: on autorise la création d'un client sans RC et Ninea avec status = en attente 
    //else if (this.typePersonneChoisi === this.personneMorale && this.registreCommerce === null) {
    //   this.problemeRC = true;
    //   this.erreur = true;
    // } else if (this.typePersonneChoisi === this.personneMorale && this.codeNinea === null) {
    //   this.problemeCodeNinea = true;
    //   this.erreur = true;
    // } 
    else if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.registreCommerce === null || this.registreCommerce === ""))) {
      // console.log("Activite comm: "+ this.activiteCommercante) ;
      this.problemeRCetNINEA = true;
      this.erreur = true
    }

    else if (this.typePersonneChoisi === this.personneMorale && (this.typeSociete === null || this.typeSociete == "")) {
      this.problemeTypeSociete = true;
      this.erreur = true;
    }

    else if (this.typePersonneChoisi === this.personneMorale && (this.email == null || this.email == '')) {
      // this.obligatoirEmail = true;
      this.problemeEmail1 = true;
      this.erreur = true;
    }
    else if (this.typePersonneChoisi === this.personneMorale && (this.chiffreAffaireActivite === null || this.chiffreAffaireActivite === "")) {
      this.problemeChiffreAffaireActivite = true;
      this.erreur = true
    }
    else if (this.typePersonneChoisi === this.personneMorale && (this.chargeSinistre === null || this.chargeSinistre === "")) {
      this.problemeChargeSinistre = true;
      this.erreur = true
    }
    else if (this.typePersonneChoisi === this.personneMorale && (this.capitalsocial === null || this.capitalsocial === "")) {
      this.problemeCapitalSocial = true;
      this.erreur = true
    }

    /*
    // On gère la partie NINEA qui est composé de 7 caractères numériques
    else if ((this.firstSevenCaract != null) && isNaN(Number(this.firstSevenCaract))) {
      this.problemefirstSevenNINEA = true;
      this.erreur = true;

    }// controle du premier caractere de COFI: qui est soit 0, 1 ou 2
    else if ((this.first != null) && Number(this.first) != 0 && Number(this.first) != 1 && Number(this.first) != 2) {
      this.problemefisrtCOFI = true;
      this.erreur = true;

    }// controle du deuxieme caractere de COFI: qui doit etre une lettre(alphabétique)
    else if ((this.two != null) && (!this.isLetter(this.two))) {
      this.problemetwoCOFI = true;
      this.erreur = true;

    } // controle du troisieme caractere de COFI: qui doit etre un numérique compris entre 0 et 9
    else if ((this.three != null) && (!this.isNumber(this.three))) {
      this.problemethreeCOFI = true;
      this.erreur = true;
    }
    else if ((this.typePersonneChoisi === this.personneMorale)
      && (this.classificationSecteur === null || this.classificationSecteur === "")) {
      this.problemeClassificationSecteur = true;
      this.erreur = true
    }
    */
    else {

      this.obligatoirEmail = false;
      this.erreur = false;
      this.modifForm.controls['clien_telephone1'].setValue(this.modifForm.controls['clien_telephone1'].value.internationalNumber);
      this.modifForm.controls['clien_telephone2'].setValue(this.modifForm.controls['clien_telephone2'].value?.internationalNumber);
      this.modifForm.controls['clien_portable'].setValue(this.modifForm.controls['clien_portable'].value?.internationalNumber);
      // this.modifForm.controls['clien_typeclient'].setValue("souscripteur");
      this.modifForm.controls['clien_typeclient'].setValue((this.listType.find(p => p.id === this.codeSouscripteur)).id)
      this.modifForm.controls['clien_utilisateur'].setValue(parseInt('this.user.util_numero'));
      this.modifForm.controls['clien_datemodification'].setValue(new Date());
      this.modifForm.controls['clien_status'].setValue(this.client_valide);

      this.clientService.addClient(this.modifForm.value)
        .subscribe((data) => {
          // console.log(this.numeroProspect);
          this.toastrService.show(
            data.message,
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 60000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });

          this.prospectService.transformerProspect(this.numeroProspect)
            .subscribe((data) => { });

          this.router.navigateByUrl('/home/gestion-client');
        },
          (error) => {
            this.toastrService.show(
              error.error.message,
              'Notification d\'erreur',
              {
                status: this.statusFail,
                destroyByClick: true,
                duration: 60000,
                hasIcon: true,
                position: this.position,
                preventDuplicates: false,
              });
          },
        );
    }
  }

  // onChangeCategorieSociopro(event) {
  //   this.modifForm.controls['clien_categsocioprof'].setValue(event.value);
  // }

  // onChangeLibeleType(event) {
  //   this.modifForm.controls['clien_typeclient'].setValue((this.listType.find(p => p.id === event)).id);
  // }

  // onChangeTypeSociete(event) {
  //   this.modifForm.controls['clien_typesociete'].setValue((this.listTypeSociete.find(p => p.id === event)).id);
  // }

  // onGetAllSecteurs() {
  //   this.secteurService.getAllClassificationSecteur()
  //     .subscribe((data: ClassificationSecteur[]) => {
  //       this.secteurs = data;
  //       this.listesecteurs = data as ClassificationSecteur[];
  //     });
  // }

  onGetAllClassificationSecteurs() {
    this.secteurService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data as ClassificationSecteur[];
        // this.filteredClassif.next(this.classifications.slice());
      })
  }

  onGetLibelleByCivilite(civilite: any) {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    if (civilite != null && civilite !== "") {
      return civilite + " : " + (this.listeCodeCivilites?.find(p => p.civ_code === civilite))?.civ_libellelong;
    } else {
      return "";
    }

  }

  // onChangeClassification(event) {
  //   this.modifForm.controls['clien_secteur_activite'].setValue(event.value);
  // }

  // onGetLibelleByTypeSociete(type: any) {
  //   //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
  //   return (this.listTypeSociete.find(p => p.id === type))?.value;
  // }

  /*
  onChangeCivilite(event) {
    // this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    // this.modifForm.controls['clien_titre'].setValue(event);
    // this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    // this.civiliteNature = this.modifForm.get("clien_titre").value;
    // this.civile=this.onGetLibelleByCivilite(this.addForm.get("clien_titre").value);
    //   if(this.listCivilite.find(p => p.code_Civilite === this.civiliteNature && p.clien_prenom === this.prenom && p.clien_adresseville === this.adresse && p.clien_telephone1=== this.telephone1)) {

    // if(this.listeClients.find(p => p.clien_nom === this.nom && p.clien_prenom === this.prenom && p.clien_adresseville === this.adresse && p.clien_telephone1=== this.telephone1)) {

    /*
    if (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature === this.gerant) {
      // this.problemePersonnePhysiCivilite = true;
      //this.problemePersonnePhysique = false;
      this.obligatoirEmail = true;
      this.erreur = true;
      this.typeSociete = 8;
      this.listTypeSociete = this.listTypeclient['TYPE_SOCIETE'];
      this.civile = (this.listTypeSociete.find(p => p.id == this.typeSociete))?.value;
      this.modifForm.controls['clien_typesociete'].setValue(this.civile);


    }
    else {
      this.obligatoirEmail = false;
      // this.problemePersonnePhysiCivilite = false;
      this.erreur = false;
    }
    
  }
  */


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

  /*
  onFocusOutEventSecteurActivite() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.classificationSecteur = this.modifForm.get("clien_secteur_activite").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;
    // if ((this.typePersonneChoisi === this.personneMorale
    //   || (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature === this.gerant))
    //   && (this.classificationSecteur === null || this.classificationSecteur === "")) {
    if ((this.typePersonneChoisi === this.personneMorale)
      && (this.classificationSecteur === null || this.classificationSecteur === "")) {
      this.problemeClassificationSecteur = true;
      this.erreur = true
    } else {
      this.problemeClassificationSecteur = false;
      this.erreur = false;
    }
  }
  */

  /*
  onFocusOutEventCategorieSociopro() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.categoriesociopro = this.modifForm.get("clien_categsocioprof").value;
    if (this.typePersonneChoisi === this.personnePhysique && (this.categoriesociopro === null || this.categoriesociopro === "")) {
      this.problemeCategoriesociopro = true;
      this.erreur = true
    } else {
      this.problemeCategoriesociopro = false;
      this.erreur = false;
    }
  }
  */

  onFocusOutEventChiffreAffaireActivite() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.chiffreAffaireActivite = this.modifForm.get("clien_chiffreaffaireannuel").value;
    // this.chiffreAffaireActivite = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.typePersonneChoisi === this.personneMorale && (this.chiffreAffaireActivite === null || this.chiffreAffaireActivite === "")) {
      this.problemeChiffreAffaireActivite = true;
      this.erreur = true
    }
    else {
      this.problemeChiffreAffaireActivite = false;
      this.erreur = false;

      // this.chiffreAffaireActivite = Number(this.formatNumberService.replaceAll(this.chiffreAffaireActivite, ' ', ''));
      // this.modifForm.get("clien_capital_social").setValue(this.capitalsocial);
      // this.capitalsocial = this.formatNumberService.numberWithCommas2(this.capitalsocial);
    }
  }

  onFocusOutEventChargeSinistre() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.chargeSinistre = this.modifForm.get("clien_chargesinistre").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.chargeSinistre === null || this.chargeSinistre === "")) {
      this.problemeChargeSinistre = true;
      this.erreur = true
    }
    else {
      this.problemeChargeSinistre = false;
      this.erreur = false;
    }
  }

  onFocusOutEventCapitalSocial(event) {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    // this.capitalsocial = this.modifForm.get("clien_capital_social").value;
    this.capitalsocial = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.typePersonneChoisi === this.personneMorale && (this.capitalsocial === null || this.capitalsocial === "")) {
      this.problemeCapitalSocial = true;
      this.erreur = true
    }
    else {
      this.problemeCapitalSocial = false;
      this.erreur = false;

      this.capitalsocial = Number(this.formatNumberService.replaceAll(this.capitalsocial, ' ', ''));
      this.modifForm.get("clien_capital_social").setValue(this.capitalsocial);
      this.capitalsocial = this.formatNumberService.numberWithCommas2(this.capitalsocial);
    }
  }

  onFocusOutEventEmail1() {
    this.email = this.modifForm.get("clien_email").value;
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;

    // if (this.typePersonneChoisi == this.personneMorale || (this.typePersonneChoisi == this.personnePhysique && this.civiliteNature == this.gerant)) {
    if (this.typePersonneChoisi == this.personneMorale) {

      // on controle d'abord si le champs est saisi ou non
      if (this.email != "") {
        this.problemeEmail1 = false;
        this.erreur = false;

        // Maintenant on controle la validité de l'email (le format)
        if (this.modifForm.controls['clien_email'].valid == true) {
          // this.problemeEmail1 = false ;
          this.problemeEmail = false;
          this.erreur = false;
        } else {
          this.problemeEmail = true;
          // this.erreur = true;
        }
      }
      else {
        this.problemeEmail1 = true;
        // this.erreur = true
      }
    }
    else {

      // on controle d'abord si le champs est saisi ou non
      if (this.email != "") {
        // this.problemeEmail1 = false ;
        // this.erreur = false ;

        // Maintenant on controle la validité de l'email (le format)
        if (this.modifForm.controls['clien_email'].valid == true) {
          // this.problemeEmail1 = false ;
          this.problemeEmail = false;
          this.erreur = false;
        } else {
          this.problemeEmail = true;
          // this.erreur = true;
        }
      } else {
        this.problemeEmail = false;
        this.problemeEmail1 = false;
        this.erreur = false;
      }
    }

  }

  onFocusOutEventNumRue() {
    this.numRue = this.modifForm.get("clien_adressenumero").value;
    if (this.numRue === null || this.numRue === "") {
      this.problemeRue = true;
      // this.erreur = true
    }

    else {
      this.problemeRue = false;
      this.erreur = false;
    }
  }

  onFocusOutEventVille() {
    this.ville = this.modifForm.get("clien_adresseville").value;
    if (this.ville === null || this.ville === "") {
      this.problemeVille = true;
      // this.erreur = true;
    }

    else {
      this.problemeVille = false;
      this.erreur = false;
    }
  }

  onFocusOutEventTelephone1() {

    // this.telephone1 = this.modifForm.get("comp_telephone1").value; 

    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.telephone1 = this.modifForm.get("clien_telephone1").value;
    if (this.telephone1 === "") {
      this.problemeTelephone11 = true;
      // this.erreur = true
    }
    else if ((this.telephone1 != "" && this.modifForm.controls['clien_telephone1'].valid == true)) {
      this.problemeTelephone1 = false;
      this.problemeTelephone11 = false;
      this.erreur = false
    }

    else {
      this.problemeTelephone1 = true;
      this.problemeTelephone11 = false;
      this.erreur = false;

    }

    if (this.typePersonneChoisi === this.personnePhysique) {
      this.adresse = this.modifForm.get("clien_adresseville").value;
      this.nom = this.modifForm.get("clien_nom").value;
      this.prenom = this.modifForm.get("clien_prenom").value;
      this.clientService.getAllClientPhysique()
        .subscribe((data: Client[]) => {
          this.clients = data;
          this.listeClients = data as Client[];
          if (this.listeClients.find(p => p.clien_nom === this.nom && p.clien_prenom === this.prenom && p.clien_adresseville === this.adresse && p.clien_telephone1 === this.telephone1)) {
            this.problemeAdresseTel = true;
            this.erreur = true;

          }
          else {
            this.problemeAdresseTel = false;
            this.erreur = false;
          }
        });
    }


  }
  onFocusOutEventTelephone2() {

    // this.telephone1 = this.modifForm.get("comp_telephone1").value; 
    if (this.modifForm.controls['clien_telephone2'].valid == true) {
      this.problemeTelephone2 = false;
      this.erreur = false
    } else {
      this.problemeTelephone2 = true;
      this.erreur = true;
    }
  }

  onFocusOutEventPortable() {

    this.portable = this.modifForm.get("clien_portable").value;
    if (this.portable === "") {
      this.problemeportable11 = true;
      // this.erreur = true
    }
    else if (this.portable != "" && this.modifForm.controls['clien_portable'].valid == true) {
      this.problemePortable = false;
      this.problemeportable11 = false;
      this.erreur = false
    } else {
      this.problemePortable = true;
      this.problemeportable11 = false;
      // this.erreur = true;
    }
  }


  onFocusOutEventCIN() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.cin = this.modifForm.get("clien_CIN").value;
    this.passeport = this.modifForm.get("clien_passeport").value;
    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
      // this.erreur = true;
    }
    else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.porblemeLongeurCIN = true;
      // this.erreur = true;
    }
    else {
      this.porblemeLongeurCIN = false;
      this.problemeCINouPasseport = false;
      this.erreur = false;
    }
  }

  onFocusOutEventPasseport() {

    this.cin = this.modifForm.get("clien_CIN").value;
    this.passeport = this.modifForm.get("clien_passeport").value;
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
      // this.erreur = true;
    }
    else {
      this.problemeCINouPasseport = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNom() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.nom = this.modifForm.get("clien_nom").value;
    if (this.typePersonneChoisi === this.personnePhysique && (this.nom === null || this.nom === "")) {
      this.problemeNom = true;
      this.problemePersonnePhysique = false;
      // this.erreur = true
    } else {
      this.problemeNom = false;
      this.problemePersonnePhysique = false;
      this.erreur = false;
    }
    // this.clientService.getAllClientPhysique()
    //   .subscribe((data: Client[]) => {
    //     this.clients = data;
    //     this.listeClients = data as Client[];
    //     if (this.listeClients.find(p => p.clien_nom?.toLowerCase() === this.nom.toLowerCase() && p.clien_prenom?.toLowerCase() === this.prenom?.toLowerCase())?.clien_numero != null) {
    //       this.problemeMemeNomPrenom = true;
    //       this.erreur = true;
    //     }
    //     else {
    //       this.problemeMemeNomPrenom = false;
    //       this.erreur = false;
    //     }
    //   });
  }

  onFocusOutEventPrenom() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.prenom = this.modifForm.get("clien_prenom").value;
    if (this.typePersonneChoisi === this.personnePhysique && (this.prenom === null || this.prenom === "")) {
      this.problemePrenom = true;
      this.problemePersonnePhysique = false;
      // this.erreur = true

    }
    else {
      this.problemePrenom = false;
      this.problemePersonnePhysique = false;
      this.erreur = false;
    }
    // this.clientService.getAllClientPhysique()
    //   .subscribe((data: Client[]) => {
    //     this.clients = data;
    //     this.listeClients = data as Client[];
    //     if (this.listeClients.find(p => p.clien_nom?.toLowerCase() === this.nom?.toLowerCase() && p.clien_prenom?.toLowerCase() === this.prenom?.toLowerCase())?.clien_numero != null) {
    //       this.problemeMemeNomPrenom = true;
    //       this.erreur = true;
    //     }
    //     else {
    //       this.problemeMemeNomPrenom = false;
    //       this.erreur = false;
    //     }
    //   });

  }

  onFocusOutEventNomPrincipDirigeant() {
    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;
    this.dirigeant = this.modifForm.get("clien_princdirigeant").value;

    if (this.activiteCommercante == this.OUI && (this.dirigeant == null || this.dirigeant == "")) {
      this.problemeDirigeant = true;
    } else {
      this.problemeDirigeant = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDenomination() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.denomination = this.modifForm.get("clien_denomination").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.denomination === null || this.denomination === "")) {
      this.problemeDenomination = true;
      this.problemePersonneMorale = false;
      // this.problemeDenominationGerant = false;
      // this.erreur = true
    }
    else {
      // this.problemeDenominationGerant = false;
      this.problemeDenomination = false;
      this.problemePersonneMorale = false;
      this.erreur = false;
    }
  }

  onFocusOutEventSigle() {
    // this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    // this.sigle = this.modifForm.get("clien_sigle").value;
    // this.civiliteNature = this.modifForm.get("clien_titre").value;
  }

  /*
  onFocusOutEventSite() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.site = this.modifForm.get("clien_website").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.site === null || this.site === "")) {
      this.problemeSite = true;
      this.problemePersonneMorale = false;
      // this.problemeSiteGerant = false;
      this.erreur = true
    }    
    else {
      this.problemeSite = false;
      // this.problemeSiteGerant = false;
      this.problemePersonneMorale = false;
      this.erreur = false;
    }
  }
  */

  // Methode permettant de vérifier si un caractere est une chaine ou non
  isLetter(str: string): boolean {
    str = str.toUpperCase();
    if (str.length === 1 && str.match(/[A-Z]/i)) {
      return true;
    }
    return false;
  }

  // Methode permettant de vérifier si un caractere est un nombre compris entre 0 et 9 ou non
  isNumber(str: string): boolean {
    if (str.length === 1 && str.match(/[0-9]/i)) {
      return true;
    }
    return false;
  }

  onFocusOutEventNinea(event) {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.codeNinea = this.modifForm.get("clien_ninea").value;
    this.registreCommerce = this.modifForm.get("clien_registrecommerce").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;
    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;

    /*
    if (this.activiteCommercante == this.NON) {
      // this.problemeCodeNinea = false;
      // this.problemeRC = false;
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    else if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.registreCommerce === null || this.registreCommerce === ""))) {
      // this.problemeCodeNinea = true;
      this.problemeRCetNINEA = true;
      // this.erreur = true;
    }
    else {
      // this.problemeCodeNinea = false;
      // this.problemeCodeNineaGerant = false;
      // this.problemeRC = false;
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    */

    /*
    // =========================== controle sur le NINEA =============================
    if (this.codeNinea != null && this.codeNinea != '') {
      // On gère la partie NINEA qui est composé de 7 caractères numériques
      this.firstSevenCaract = this.codeNinea.substr(0, 7);
      // Gèrer la partie COFI du code NINEA
      // On recupère les trois dernièrs caractères du NINEA
      this.lastthreecaract = this.codeNinea.substr(this.codeNinea.length - 3);

      // controle du premier caractere de COFI: qui est soit 0, 1 ou 2
      this.first = this.lastthreecaract.charAt(0);
      this.two = this.lastthreecaract.charAt(1);
      this.three = this.lastthreecaract.charAt(2);


      if ((this.firstSevenCaract != null) && isNaN(Number(this.firstSevenCaract))) {
        this.problemefirstSevenNINEA = true;
        this.erreur = true;
      } else {
        this.problemefirstSevenNINEA = false;
        // controle du premier caractere de COFI: qui est soit 0, 1 ou 2
        if ((this.first != null) && Number(this.first) != 0 && Number(this.first) != 1 && Number(this.first) != 2) {
          this.problemefisrtCOFI = true;
          this.erreur = true;
        } else {
          this.problemefisrtCOFI = false;
          // controle du deuxieme caractere de COFI: qui doit etre une lettre(alphabétique)
          if ((this.two != null) && !this.isLetter(this.two)) {
            this.problemetwoCOFI = true;
            this.erreur = true;
          } else {
            this.problemetwoCOFI = false;
            // controle du troisieme caractere de COFI: qui doit etre un numérique compris entre 0 et 9
            if ((this.three != null) && !this.isNumber(this.three)) {
              this.problemethreeCOFI = true;
              this.erreur = true;
            } else {
              this.problemethreeCOFI = false;
              this.erreur = false;
            }
          }
        }
      }
    } else {
      this.problemefirstSevenNINEA = false;
      this.problemefisrtCOFI = false;
      this.problemetwoCOFI = false;
      this.problemethreeCOFI = false;
    }
    */
  }

  onFocusOutEventRC(event) {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;;
    this.codeNinea = this.modifForm.get("clien_ninea").value;
    this.registreCommerce = this.modifForm.get("clien_registrecommerce").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;
    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;

    /*
    if (this.activiteCommercante == this.NON) {
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    else if (this.activiteCommercante == this.OUI && ((this.registreCommerce === null || this.registreCommerce === "") || (this.codeNinea === null || this.codeNinea === ""))) {
      this.problemeRCetNINEA = true;
      this.erreur = true;
    }
    else {
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    */
  }

  onFocusOutEventTypeSociete() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.typeSociete = this.modifForm.get("clien_typesociete").value;
  }

  onFocusOutEventDate() {
    this.dateEntreeRelation = this.modifForm.get("clien_date_relation").value;
    this.dateCreation = this.modifForm.get("clien_datenaissance").value;

    if (this.dateEntreeRelation != null && this.dateEntreeRelation !== "" && this.dateCreation != null && this.dateCreation !== "" && (this.dateCreation > this.dateEntreeRelation)) {
      this.problemeDate = true;
      // this.erreur = true;
    }
    else {
      this.problemeDate = false;
      this.erreur = false;
    }
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  getColorCategorieSociopro() {
    if (this.problemeCategoriesociopro) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCapitalSocial() {
    if (this.problemeCapitalSocial) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorSecteurActivite() {
    if (this.problemeClassificationSecteur) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorChiffreAffaireActivite() {
    if (this.problemeChiffreAffaireActivite) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorChargeSinistre() {
    if (this.problemeChargeSinistre) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorEmail() {
    if (this.problemeEmail) {
      return '1px solid red';
    }
    if (this.problemeEmail1) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorTelephone1() {
    if (this.problemeTelephone1) {
      return '1px solid red';
    }
    if (this.problemeTelephone11) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorTelephone2() {
    if (this.problemeTelephone2) {
      return '1px solid red';
    }
    else {
      return '';
    }
  }
  getColorPortable() {
    if (this.problemePortable) {
      return '1px solid red';
    }
    if (this.problemeportable11) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorNumClient() {
    if (this.problemeNumClient) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorCIN() {
    if (this.problemeCINouPasseport || this.porblemeLongeurCIN) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorPasseport() {

    if (this.problemeCINouPasseport) {
      return '1px solid red';
    } else {
      return '';
    }
  }


  getColorNom() {
    if (this.problemeNom) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorPrenom() {
    if (this.problemePrenom) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNomPrincipDirigeant() {
    if (this.problemeDirigeant) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorDenomination() {
    if (this.problemeDenomination) {
      return '1px solid red';
    }
    // if (this.problemeDenominationGerant) {
    //   return '1px solid red';
    // } 
    else {
      return '';
    }
  }

  getColorSigle() {
    /*
    if (this.problemeSigle) {
      return '1px solid red';
    }
    // if (this.problemeSigleGerant) {
    //   return '1px solid red';
    // }
    else {
      return '';
    }
    */
  }

  getColorSite() {
    if (this.problemeSite) {
      return '1px solid red';
    }
    // if (this.problemeSiteGerant) {
    //   return '1px solid red';
    // } 
    else {
      return '';
    }
  }

  getColorRC() {

    if (this.problemeRCetNINEA) {
      return '1px solid red';
    }
    // if (this.problemeRCGerant) {
    //   return '1px solid red';
    // } 
    else {
      return '';
    }

  }

  getColorNinea() {

    if (this.problemeRCetNINEA) {
      return '1px solid red';
    }
    // if (this.problemeCodeNineaGerant) {
    //   return '1px solid red';
    // } 
    else {
      return '';
    }

  }

  getColorTypeSociete() {
    if (this.problemeTypeSociete) {
      return '1px solid red';
    } else {
      return '';
    }

  }

  getColorMemeNomPrenom() {
    if (this.problemeMemeNomPrenom) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumRue() {
    if (this.problemeRue) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorVille() {
    if (this.problemeVille) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorDate() {
    if (this.problemeDate) {
      return '1px solid red';
    } else {
      return '';
    }
  }

}
