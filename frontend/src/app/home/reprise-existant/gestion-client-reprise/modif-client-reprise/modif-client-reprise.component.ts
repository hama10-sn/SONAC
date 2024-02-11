import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../../model/categorieSocioprofessionnelle';
import { Civilite } from '../../../../model/Civilite';
import { Client } from '../../../../model/Client';
import { User } from '../../../../model/User';
import { CategorieSocioprofessionnelleService } from '../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../services/civilite.service';
import { ClientService } from '../../../../services/client.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import type from '../../../data/type.json';
import dateFormatter from 'date-format-conversion';
import { GroupeService } from '../../../../services/groupe.service';
import { Groupe } from '../../../../model/Groupe';
import { ClassificationSecteurService } from '../../../../services/classification-secteur.service';
import { ClassificationSecteur } from '../../../../model/ClassificationSecteur';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { FormatNumberService } from '../../../../services/formatNumber.service';

@Component({
  selector: 'ngx-modif-client-reprise',
  templateUrl: './modif-client-reprise.component.html',
  styleUrls: ['./modif-client-reprise.component.scss']
})
export class ModifClientRepriseComponent implements OnInit {

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
    clien_ninea: [''],    // obligatoire si personne morale
    clien_registrecommerce: [''],    // obligatoire si personne morale
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
    clien_date_relation: [''],
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
  problemeContactPrincip: boolean = false;
  problemeContactPrincip2: boolean = false;
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
  listCivilite: any[];
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
  civilites: Array<Civilite> = new Array<Civilite>();
  clients: Array<Client> = new Array<Client>();
  groupes: Array<Groupe> = new Array<Groupe>();
  // secteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  // ================ Déclarations des variables pour la recherche avec filtre ======================

  listeCodeCategorieSociopro: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();
  classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  // listCategoriSocio: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>();

  /** control for the selected classification */
  public categSocioproCtrl: FormControl = new FormControl();
  public classifCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public categSocioproFilterCtrl: FormControl = new FormControl();
  public classifFilterCtrl: FormControl = new FormControl();

  /** list of classifications filtered by search keyword */
  public filteredCategSociopro: ReplaySubject<CategorieSocioprofessionnelle[]> = new ReplaySubject<CategorieSocioprofessionnelle[]>();
  public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();

  protected _onDestroy = new Subject<void>();

  type_client: String;
  code_Civilite: any;
  // code_Civilite2: any;
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
  // code_sexe: any;
  value_status: String;
  client_status: String;
  client_valide = "1";
  client_attente = "2";

  client: Client;

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
  showObligatoireDenominationPersPhysique: boolean = false;

  adminGeneral = "Administrateur Général";
  // modifPrincipalActionnaire: boolean = false;
  @Input() listTypeclient: any[] = type;
  @Input() listeModeGouver: any[] = type;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  constructor(private fb: FormBuilder,
    private categorieService: CategorieSocioprofessionnelleService, private clientService: ClientService,
    private userService: UserService,
    private civiliteService: CiviliteService,
    private groupeService: GroupeService,
    private secteurService: ClassificationSecteurService,
    private authService: NbAuthService,
    private formatNumberService: FormatNumberService,
    private router: Router,
    private toastrService: NbToastrService, private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.client = this.transfertData.getData();
    this.onGetAllClients2();
    // this.onGetAllCategorieSocio();
    this.onGetAllCategorieSociopro();
    // this.onGetAllSecteurs();
    this.onGetAllClassificationSecteurs();
    this.onGetAllGroupe();
    this.onGetAllTypeCivilite();
    this.onGetAllCivilite();

    this.getlogin();

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          // console.log(this.autorisation);

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

    // this.problemeAfficheCiviliteGerant = false ;
    // this.problemeAfficheCivilite = true;

    this.listType = this.listTypeclient['TYPE_CLIENT'];

    if (this.client.clien_datenaissance != null) {
      this.cliendatenaissance = dateFormatter(this.client?.clien_datenaissance, 'yyyy-MM-dd');
    }
    this.cliendateEntreeRelation = dateFormatter(this.client.clien_date_relation, 'yyyy-MM-dd');
    // this.cliensouscription = dateFormatter(this.client.clien_datesouscription1, 'yyyy-MM-ddThh:mm');
    //this.modifForm.controls['client_id'].setValue(this.client.client_id);
    this.modifForm.controls['clien_numero'].setValue(this.client.clien_numero);
    this.modifForm.controls['clien_numeroprospect'].setValue(this.client.clien_numeroprospect);

    // this.type_client = this.client.clien_typeclient + " : " + this.onGetLibelleByTypeClient(this.client.clien_typeclient);
    this.modifForm.controls['clien_typeclient'].setValue(this.client.clien_typeclient);
    // this.code_typeClient = this.client.clien_typeclient;
    // this.listType = this.listTypeclient['TYPE_CLIENT'];
    // if (this.code_typeClient == null) {
    //   this.value_typeClient = "";
    // } else {
    //   this.value_typeClient = (this.listType.find(p => p?.id == this.code_typeClient))?.value;
    // }

    this.modifForm.controls['clien_numerosolvabilite'].setValue(this.client.clien_numerosolvabilite);

    this.modifForm.controls['clien_nature'].setValue(this.client.clien_nature);
    this.typePersonneChoisi = this.client.clien_nature;
    this.code_natureClient = this.client.clien_nature;

    /*
    if (this.client.clien_nature == this.personnePhysique) {
      this.code_natureClient = this.client.clien_nature + " : Personne physique";
      this.bloquerPersPhysique = false;
      this.bloquerPersMorale = true;

    } else if (this.client.clien_nature == this.personneMorale) {
      this.code_natureClient = this.client.clien_nature + " : Personne morale";
      this.bloquerPersPhysique = true;
      this.bloquerPersMorale = false;
    }
    */

    // this.modifForm.controls['prospc_nature'].setValue(this.prospect.prospc_nature);

    // this.code_natureClient =this.onGetLibelleByNaturePersonne(this.client.clien_nature);
    this.typePersonneChoisi = this.client.clien_nature;
    this.civiliteNature = this.client.clien_titre;
    // console.log(this.client.clien_nature);
    this.modifForm.controls['clien_coderegroupgestion'].setValue(this.client.clien_coderegroupgestion);
    this.code_groupe = this.client?.clien_coderegroupgestion?.toString();

    // this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    this.modifForm.controls['clien_titre'].setValue(this.client.clien_titre);
    if (this.client.clien_titre != null) {
      this.code_Civilite = this.client.clien_titre.toString();
      console.log(this.code_Civilite)

    }
    // this.code_Civilite2 = this.client.clien_titre.toString();

    // console.log(this.code_Civilite);
    this.modifForm.controls['clien_nom'].setValue(this.client.clien_nom);
    this.modifForm.controls['clien_prenom'].setValue(this.client.clien_prenom);
    this.modifForm.controls['clien_princdirigeant'].setValue(this.client.clien_princdirigeant);
    this.modifForm.controls['clien_contactprinci'].setValue(this.client.clien_contactprinci);
    this.modifForm.controls['clien_typesociete'].setValue(this.client.clien_typesociete);
    // if (this.code_typeSociete != null) {
    // this.code_typeSociete = this.client?.clien_typesociete?.toString();
    // }
    this.code_typeSociete = this.client.clien_typesociete.toString();
    this.listTypeSociete = this.listTypeclient['TYPE_SOCIETE'];
    /* if (this.code_typeSociete == null) {
      this.value_typeSociete = "";
    } else {
      this.value_typeSociete = (this.listTypeSociete.find(p => p?.id == this.code_typeSociete))?.value;
    } */

    this.modifForm.controls['clien_denomination'].setValue(this.client.clien_denomination);
    this.modifForm.controls['clien_sigle'].setValue(this.client.clien_sigle);
    this.modifForm.controls['clien_adressenumero'].setValue(this.client.clien_adressenumero);
    this.modifForm.controls['clien_adresserue'].setValue(this.client.clien_adresserue);
    this.modifForm.controls['clien_adresseville'].setValue(this.client.clien_adresseville);
    this.modifForm.controls['clien_datenaissance'].setValue(this.cliendatenaissance);
    //this.modifForm.controls['clien_datesouscription1'].setValue(this.cliensouscription);
    this.modifForm.controls['clien_categsocioprof'].setValue(this.client.clien_categsocioprof);
    if (this.client.clien_categsocioprof != null) {
      this.categSocioproCtrl.setValue(this.client.clien_categsocioprof.toString());
    }

    // this.code_categorie = this.client?.clien_categsocioprof?.toString();
    // this.code_categorie = this.client?.clien_categsocioprof;
    this.modifForm.controls['clien_telephone1'].setValue(this.client.clien_telephone1);
    this.modifForm.controls['clien_telephone2'].setValue(this.client.clien_telephone2);
    this.modifForm.controls['clien_portable'].setValue(this.client.clien_portable);

    // this.modifForm.controls['clien_telephone1'].setValue(this.modifForm.controls['clien_telephone1'].value.internationalNumber);
    // this.modifForm.controls['clien_telephone2'].setValue(this.modifForm.controls['clien_telephone2'].value?.internationalNumber);
    // this.modifForm.controls['clien_portable'].setValue(this.modifForm.controls['clien_portable'].value?.internationalNumber);

    // this.modifForm.controls['clien_fax'].setValue(this.client.clien_fax);
    this.modifForm.controls['clien_website'].setValue(this.client.clien_website);
    this.modifForm.controls['clien_email'].setValue(this.client.clien_email);
    this.modifForm.controls['clien_ninea'].setValue(this.client.clien_ninea);
    this.modifForm.controls['clien_registrecommerce'].setValue(this.client.clien_registrecommerce);
    this.modifForm.controls['clien_status'].setValue(this.client.clien_status);

    this.modifForm.controls['clien_activitecommercante'].setValue(this.client.clien_activitecommercante);
    this.code_activitecommercante = this.client.clien_activitecommercante;
    // console.log("activité commerçante: " + this.client.clien_activitecommercante);

    if (this.client.clien_activitecommercante == this.OUI) {
      // this.code_activitecommercante = "OUI";
      this.modifForm.controls['clien_princdirigeant'].setValidators(Validators.required);
      // this.modifForm.controls['clien_ninea'].setValidators(Validators.required);
      // this.modifForm.controls['clien_registrecommerce'].setValidators(Validators.required);
      this.showObligatoirePrincipalDirigeant = true;
      this.showObligatoireRCetNinea = true;
      this.showObligatoireCINetPasseport = false;
      this.showObligatoireDenominationPersPhysique = true;

    } else if (this.client.clien_activitecommercante == this.NON) {
      // this.code_activitecommercante = "NON";
      this.modifForm.controls['clien_princdirigeant'].clearValidators();
      // this.modifForm.controls['clien_ninea'].clearValidators();
      // this.modifForm.controls['clien_registrecommerce'].clearValidators();
      this.showObligatoirePrincipalDirigeant = false;
      this.showObligatoireRCetNinea = false;
      this.showObligatoireDenominationPersPhysique = false

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

    this.modifForm.controls['clien_modegouvernance'].setValue(this.client.clien_modegouvernance);

    this.code_modegouvernance = this.client.clien_modegouvernance.toString();
    this.listeModeGouvernance = this.listeModeGouver['MODE_GOUVERNANCE'];
    // this.value_modegouvernance = (this.listeModeGouvernance.find(p => p?.id == this.code_modegouvernance))?.value;

    // if (this.client.clien_modegouvernance == "" || this.client.clien_modegouvernance == null) {
    //   this.modifModeGouvernance = true;
    // } else {
    //   this.modifModeGouvernance = false;
    // }

    this.modifForm.controls['clien_principalactionnaire'].setValue(this.client.clien_principalactionnaire);
    /*if (this.client.clien_principalactionnaire == "" || this.client.clien_principalactionnaire == null) {
      this.modifPrincipalActionnaire = true;
    } else {
      this.modifPrincipalActionnaire = false;
    }
    */

    this.modifForm.controls['clien_facebook'].setValue(this.client.clien_facebook);
    this.modifForm.controls['clien_linkdin'].setValue(this.client.clien_linkdin);

    this.modifForm.controls['clien_codeorigine'].setValue(this.client.clien_codeorigine);
    // this.modifForm.controls['clien_sexe'].setValue(this.client.clien_sexe);
    // this.code_sexe = this.client.clien_sexe.toString();
    //  this.modifForm.controls['clien_formejuridique'].setValue(this.client.clien_fax);
    this.modifForm.controls['clien_effectif'].setValue(this.client.clien_effectif);
    this.chiffreAffaireActivite = this.formatNumberService.numberWithCommas2(Number(this.client.clien_chiffreaffaireannuel));
    this.modifForm.controls['clien_chiffreaffaireannuel'].setValue(this.client.clien_chiffreaffaireannuel);
    this.modifForm.controls['clien_chiffreaffaireprime'].setValue(this.client.clien_chiffreaffaireprime);
    this.modifForm.controls['clien_chargesinistre'].setValue(this.client.clien_chargesinistre);
    //this.modifForm.controls['clien_contactprinci'].setValue(this.client.clien_contactprinci);
    this.modifForm.controls['clien_anciennumero'].setValue(this.client.clien_anciennumero);
    // console.log(this.client.clien_CIN);
    this.modifForm.controls['clien_CIN'].setValue(this.client.clien_CIN);
    this.modifForm.controls['clien_passeport'].setValue(this.client.clien_passeport);
    this.modifForm.controls['clien_commentaire'].setValue(this.client.clien_commentaire);
    this.modifForm.controls['clien_date_relation'].setValue(this.cliendateEntreeRelation);

    this.capitalsocial = this.formatNumberService.numberWithCommas2(Number(this.client.clien_capital_social));
    this.modifForm.controls['clien_capital_social'].setValue(this.client.clien_capital_social);
    // this.capitalsocial = Number(this.formatNumberService.replaceAll(this.client.clien_capital_social, ' ', ''));
    // this.capitalsocial = this.formatNumberService.numberWithCommas2(this.client.clien_capital_social);

    this.modifForm.controls['clien_secteur_activite'].setValue(this.client?.clien_secteur_activite);
    this.codeClassif = this.client?.clien_secteur_activite;

    if (this.client?.clien_secteur_activite != null) {
      this.classifCtrl.setValue(this.client?.clien_secteur_activite.toString());
    }
    // this.code_secteur = this.client?.clien_secteur_activite?.toString();


    // console.log(this.typePersonneChoisi);
    // if (this.typePersonneChoisi == this.personnePhysique) {
    //   this.modifForm.controls['clien_typesociete'].setValue(this.client.clien_typesociete);
    //   // this.code_typeSociete="this.client.clien_typesociete.toString()";
    // } else 
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
      this.modifForm.controls['clien_email'].setValidators(Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/));
      this.modifForm.controls['clien_categsocioprof'].clearValidators();

    }
    else if (this.typePersonneChoisi == this.personnePhysique) {

      this.modifForm.controls['clien_datenaissance'].clearValidators();
      this.modifForm.controls['clien_email'].clearValidators();
      this.modifForm.controls['clien_categsocioprof'].setValidators(Validators.required);
      this.showObligatoire = false;
      this.showObligatoireEmail = false;
      this.showObligatoireCategSociopro = true;
    }

    this.modifForm.controls['clien_datenaissance'].updateValueAndValidity();
    this.modifForm.controls['clien_email'].updateValueAndValidity();
    this.modifForm.controls['clien_categsocioprof'].updateValueAndValidity();

    // =================== Listen for search field value changes =======================
    this.categSocioproFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategsociopro();
      });

    this.classifFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClassifs();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

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

  onGetLibelleByTypeClient(type: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listType.find(p => p.id === type))?.value;
  }
  // onGetAllCategorieSocio() {
  //   this.categorieService.getAllCategorieSocioprofessionnelle()
  //     .subscribe((data: CategorieSocioprofessionnelle[]) => {
  //       this.categories = data;
  //       this.listCategoriSocio = data as CategorieSocioprofessionnelle[];
  //     });
  // }

  onGetAllCategorieSociopro() {
    this.categorieService.getAllCategorieSocioprofessionnelle()
      .subscribe((data: CategorieSocioprofessionnelle[]) => {
        this.listeCodeCategorieSociopro = data as CategorieSocioprofessionnelle[];
        this.filteredCategSociopro.next(this.listeCodeCategorieSociopro.slice());
      });
  }

  onGetAllTypeCivilite() {
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
        this.civilites = data;
        this.listCivilite = data as Civilite[];
      });
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }

  // onGetAllCiviliteByNature(nature: number) {
  //   this.civiliteService.getAllCiviliteByNature(nature)
  //     .subscribe((data: Civilite[]) => {
  //       this.listeCodeCivilites = data as Civilite[];
  //     });
  // }

  onGetAllCivilite() {
    this.civiliteService.getAllCivilite()
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
        console.log(this.user);

        if (this.user.util_profil == this.profil) {
          this.nonModifierChamps = false;
        } else {
          this.nonModifierChamps = true;
        }

      });
  }

  // onChangeStatus(event) {
  //   //console.log(event);    
  //   this.modifForm.controls['clien_status'].setValue(event);
  // }

  onChangeGroupe(event) {
    //console.log(event);    
    this.modifForm.controls['clien_coderegroupgestion'].setValue(event);
    console.log(this.modifForm.get('clien_coderegroupgestion').value);
  }

  // onChangeSexe(event) {
  //   this.modifForm.controls['clien_sexe'].setValue(event);
  // }

  onGetLibelleByNaturePersonne(numero: any) {
    if (numero === this.personnePhysique) {
      return 'Personne physique';
    } else if (numero === this.personneMorale) {
      return 'Personne morale';
    }
  }

  onGetLibelleByClassifMetier(numero: any) {
    // console.log("==Liste code branche: "+ this.branches) ;
    return numero + " : " + (this.classifications?.find(c => c.code === numero))?.libelle;
  }

  onGetLibelleByCategorieSociopro(numero: any) {
    return numero + " : " + (this.listeCodeCategorieSociopro?.find(c => c.categs_code === numero))?.categs_libcourt;
  }

  onChangePersonne(event) {
    this.modifForm.controls['clien_nature'].setValue(event);
    console.log(this.modifForm.get('clien_nature').value);
    /*
    // console.log(this.modifForm.get("clien_nature").value);
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.clien_titreCivilite = "".toString();
    this.modifForm.controls['clien_titre'].setValue(this.clien_titreCivilite);

    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;

    // this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));

    if (this.typePersonneChoisi === this.personnePhysique) {
      this.problemePersonnePhysique = true;
      this.problemePersonneMorale = false;
      this.problemeDenomination = false;
      // this.problemeSigle = false;
      this.problemeSite = false;
      // this.problemeRC = false;
      // this.problemeCodeNinea = false;
      this.problemeTypeSociete = false;
      this.erreur = false;

      if (this.activiteCommercante == this.NON) {
        this.showObligatoireCINetPasseport = true
      } else {
        this.showObligatoireCINetPasseport = false;
      }

      // this.modifForm.controls['clien_datenaissance'].clearValidators();
      // this.showObligatoire = false;
    } else if (this.typePersonneChoisi === this.personneMorale) {
      this.obligatoirEmail = true;
      this.problemePersonneMorale = true;
      this.problemePersonnePhysique = false;
      this.problemeNom = false;
      this.problemePrenom = false;
      this.erreur = false;

      this.showObligatoireCINetPasseport = false;

      // this.showObligatoire = true;
      // this.modifForm.controls['clien_datenaissance'].setValidators(Validators.required);
    }

    // this.modifForm.controls['clien_datenaissance'].updateValueAndValidity();
    */
  }

  onChangeActiviteCommercante(event) {
    this.modifForm.controls['clien_activitecommercante'].setValue(event);
    console.log(this.modifForm.get('clien_activitecommercante').value);
  }

  onChangeModeGouvernance(event) {
    // console.log(event);
    this.modifForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id === event)).id);
    console.log(this.modifForm.get('clien_modegouvernance').value);
  }

  cancel() {

    this.router.navigateByUrl('/home/reprise/gestion-client-reprise');

    // this.ref.close();
  }

  submit() {

    // this.dateEntreeRelation = this.modifForm.get("clien_date_relation").value;
    // this.dateCreation = this.modifForm.get("clien_datenaissance").value;

    // this.typePersonneChoisi = this.client.clien_nature;
    this.modifForm.controls['clien_telephone1'].setValue(this.modifForm.controls['clien_telephone1'].value.internationalNumber);
    this.modifForm.controls['clien_telephone2'].setValue(this.modifForm.controls['clien_telephone2'].value?.internationalNumber);
    this.modifForm.controls['clien_portable'].setValue(this.modifForm.controls['clien_portable'].value?.internationalNumber);

    /* this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;

    this.cin = this.modifForm.get("clien_CIN").value;
    this.passeport = this.modifForm.get("clien_passeport").value;

    this.registreCommerce = this.modifForm.get("clien_registrecommerce").value;
    this.codeNinea = this.modifForm.get("clien_ninea").value;

    this.categoriesociopro = this.modifForm.get("clien_categsocioprof").value;
    this.dirigeant = this.modifForm.get("clien_princdirigeant").value;
    this.capitalsocial = this.modifForm.get("clien_capital_social").value;
    this.chiffreAffaireActivite = this.modifForm.get("clien_chiffreaffaireannuel").value;
    this.chargeSinistre = this.modifForm.get("clien_chargesinistre").value;

    // this.nom = this.modifForm.get("clien_nom").value;
    // this.prenom = this.modifForm.get("clien_prenom").value;

    this.denomination = this.modifForm.get("clien_denomination").value;
    this.sigle = this.modifForm.get("clien_sigle").value;
    // this.email = this.modifForm.get("clien_email").value;
    this.typeSociete = this.modifForm.get("clien_typesociete").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;
    this.email = this.modifForm.get("clien_email").value; */

    // } // On gère la partie NINEA qui est composé de 7 caractères numériques
    /* if (this.typePersonneChoisi === this.personnePhysique && (this.categoriesociopro === null || this.categoriesociopro === "")) {
      this.problemeCategoriesociopro = true;
      this.erreur = true;
    }
    else if (this.dateEntreeRelation != null && this.dateEntreeRelation !== "" && this.dateCreation != null && this.dateCreation !== "" && (this.dateCreation > this.dateEntreeRelation)) {
      // if (this.dateCreation >= this.dateEntreeRelation) {
      this.problemeDate = true;
      this.erreur = true;
    }
    else if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
      this.erreur = true;
    }
    else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.porblemeLongeurCIN = true;
      this.erreur = true;
    }
    else if (this.activiteCommercante == this.OUI && (this.dirigeant == null || this.dirigeant == "")) {
      this.problemeDirigeant = true;
      this.erreur = true;
    }
    else if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.denomination === null || this.denomination === "")) {
      this.problemeDenomination = true;
      this.erreur = true;
    }
    else if (this.typePersonneChoisi === this.personneMorale && (this.email == null || this.email == '')) {
      // this.obligatoirEmail = true;
      this.problemeEmail1 = true;
      this.erreur = true;
    } else if (this.typePersonneChoisi === this.personneMorale && (this.chiffreAffaireActivite === null || this.chiffreAffaireActivite === "")) {
      this.problemeChiffreAffaireActivite = true;
      this.erreur = true
    } else if (this.typePersonneChoisi === this.personneMorale && (this.chargeSinistre === null || this.chargeSinistre === "")) {
      this.problemeChargeSinistre = true;
      this.erreur = true
    } else if (this.typePersonneChoisi === this.personneMorale && (this.capitalsocial === null || this.capitalsocial === "")) {
      this.problemeCapitalSocial = true;
      this.erreur = true
    } */

    console.log("============================= MODIFICATION ========================");
    // this.obligatoirEmail = false;
    // this.erreur = false;
    this.modifForm.controls['clien_utilisateur'].setValue(parseInt('this.user.util_numero'));
    this.modifForm.controls['clien_datemodification'].setValue(new Date());
    // this.modifForm.controls['clien_nature'].setValue(this.client.clien_nature);
    // this.modifForm.controls['clien_typeclient'].setValue(this.client.clien_typeclient);
    // this.modifForm.controls['clien_status'].setValue(this.client_valide);

    this.clientService.modifClientReprise(this.modifForm.value)
      .subscribe((data) => {
        // console.log(data);
        this.toastrService.show(
          'Client ' + data + ' modifié avec succès !',
          // this.client_status == this.client_attente ? "le client " + data + " modifé mais toujours en attente de RC / Ninéa" : "le client " + data + " est modifié avec succès",
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 60000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

        this.router.navigateByUrl('/home/reprise/gestion-client-reprise');

      },
        (error) => {
          this.toastrService.show(
            error.error.message,
            'Notification',
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


  // onChangeCategorie(event) {
  //   //console.log(event);    
  //   this.modifForm.controls['clien_categsocioprof'].setValue(event);
  // }

  onChangeCategorieSociopro(event) {
    // console.log(event.value);    
    this.modifForm.controls['clien_categsocioprof'].setValue(event.value);
    console.log(this.modifForm.get('clien_categsocioprof').value);
  }

  onChangeLibeleType(event) {
    this.modifForm.controls['clien_typeclient'].setValue((this.listType.find(p => p.id === event)).id);
  }
  onChangeTypeSociete(event) {
    console.log(event);
    this.modifForm.controls['clien_typesociete'].setValue((this.listTypeSociete.find(p => p.id === event)).id);
    console.log(this.modifForm.get('clien_typesociete').value);
  }
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
        this.filteredClassif.next(this.classifications.slice());
      })
  }

  onGetLibelleByCivilite(civilite: any) {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    // this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    // console.log(this.listCivilite);
    // return (this.listCivilite.find(p => p.civ_code === civilite))?.civ_libellelong;
    // return civilite + " : " + (this.listCivilite?.find(p => p.civ_code === civilite))?.civ_libellelong;
    if (civilite != null && civilite !== "") {
      return civilite + " : " + (this.listeCodeCivilites?.find(p => p.civ_code === civilite))?.civ_libellelong;
    } else {
      return "";
    }

  }

  onChangeClassification(event) {
    this.modifForm.controls['clien_secteur_activite'].setValue(event.value);
    console.log(this.modifForm.get('clien_secteur_activite').value);
  }

  onGetLibelleByTypeSociete(type: any) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
    return (this.listTypeSociete.find(p => p.id === type))?.value;
  }

  onChangeCivilite(event) {
    this.modifForm.controls['clien_titre'].setValue(event);
    console.log(this.modifForm.get('clien_titre').value);
    // this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    // this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    // this.civiliteNature = this.modifForm.get("clien_titre").value;
    // this.civile=this.onGetLibelleByCivilite(this.addForm.get("clien_titre").value);
    // console.log(this.civiliteNature);
    // console.log(this.onGetLibelleByCivilite(this.addForm.get("clien_titre").value));
    // console.log(this.typePersonneChoisi===this.personnePhysique && (this.listCivilite.find(p=>p.civ_code ===this.civiliteNature))?.civ_libellelong=="Gérant");
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
      // console.log(this.listTypeSociete);
      this.civile = (this.listTypeSociete.find(p => p.id == this.typeSociete))?.value;
      // console.log(this.civile);
      this.modifForm.controls['clien_typesociete'].setValue(this.civile);


    }
    else {
      this.obligatoirEmail = false;
      // this.problemePersonnePhysiCivilite = false;
      this.erreur = false;
    }
    */

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

  onFocusOutEventChiffreAffaireActivite(event) {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    // this.chiffreAffaireActivite = this.modifForm.get("clien_chiffreaffaireannuel").value;
    this.chiffreAffaireActivite = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.typePersonneChoisi === this.personneMorale && (this.chiffreAffaireActivite === null || this.chiffreAffaireActivite === "")) {
      this.problemeChiffreAffaireActivite = true;
      this.erreur = true
    }
    else {
      this.problemeChiffreAffaireActivite = false;
      this.erreur = false;

      this.chiffreAffaireActivite = Number(this.formatNumberService.replaceAll(this.chiffreAffaireActivite, ' ', ''));
      this.modifForm.get("clien_chiffreaffaireannuel").setValue(this.chiffreAffaireActivite);
      this.chiffreAffaireActivite = this.formatNumberService.numberWithCommas2(this.chiffreAffaireActivite);
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

    console.log(this.modifForm.value);
  }

  onFocusOutEventEmail1() {
    this.email = this.modifForm.get("clien_email").value;
    console.log("email: " + this.email);
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
          this.erreur = true;
        }
      }
      else {
        this.problemeEmail1 = true;
        this.erreur = true
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
          this.erreur = true;
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
      this.erreur = true
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
      this.erreur = true;
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
    // console.log(typeof (this.telephone1));
    if (this.telephone1 === "") {
      this.problemeTelephone11 = true;
      this.erreur = true
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
      // console.log(this.prenom);
      this.clientService.getAllClientPhysique()
        .subscribe((data: Client[]) => {
          this.clients = data;
          this.listeClients = data as Client[];
          //console.log(this.listeClients );
          // console.log(this.listeClients.find(p =>p.clien_prenom === this.prenom &&  p.clien_nom === this.nom && p.clien_adresseville === this.adresse && p.clien_telephone1=== this.telephone1));
          if (this.listeClients.find(p => p.clien_nom === this.nom && p.clien_prenom === this.prenom && p.clien_adresseville === this.adresse && p.clien_telephone1 === this.telephone1)) {
            // console.log("TESSSSS1111111");
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
    // console.log(typeof(this.telephone1 ));   
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
    // console.log(typeof (this.portable));
    if (this.portable === "") {
      this.problemeportable11 = true;
      this.erreur = true
    }
    else if (this.portable != "" && this.modifForm.controls['clien_portable'].valid == true) {
      this.problemePortable = false;
      this.problemeportable11 = false;
      this.erreur = false
    } else {
      this.problemePortable = true;
      this.problemeportable11 = false;
      this.erreur = true;
    }
  }
  onFocusOutEventContactPrincip() {

    this.contactPrincip = this.modifForm.get("clien_contactprinci").value;
    if (this.contactPrincip === "") {
      this.problemeContactPrincip = true;
      this.erreur = true
    }
    else if (this.contactPrincip != "" && this.modifForm.controls['clien_contactprinci'].valid == true) {
      this.problemeContactPrincip2 = false;
      this.problemeContactPrincip = false;
      this.erreur = false
    } else {
      this.problemeContactPrincip2 = true;
      this.problemeContactPrincip = false;
      this.erreur = true;
    }

  }

  onFocusOutEventCIN() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.cin = this.modifForm.get("clien_CIN").value;
    this.passeport = this.modifForm.get("clien_passeport").value;
    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;
    // console.log("Taille CIN: " + this.cin.length) ;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      // this.problemeCIN = true;
      this.problemeCINouPasseport = true;
      // this.erreur = true;
    }
    else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.porblemeLongeurCIN = true;
      // this.erreur = true;
    }
    else {
      // this.problemeCIN = false;
      this.porblemeLongeurCIN = false;
      // this.problemePasseport = false;
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
      // this.problemePasseport = true;
      this.problemeCINouPasseport = true;
      // this.erreur = true;
    }
    else {
      // this.problemePasseport = false;
      // this.problemeCIN = false;
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
      this.erreur = true
    } else {
      this.problemeNom = false;
      this.problemePersonnePhysique = false;
      this.erreur = false;
    }
    // this.clientService.getAllClientPhysique()
    //   .subscribe((data: Client[]) => {
    //     this.clients = data;
    //     this.listeClients = data as Client[];
    //     //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
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
      this.erreur = true

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
    //     //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
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
    this.activiteCommercante = this.modifForm.get("clien_activitecommercante").value;

    if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.denomination === null || this.denomination === "")) {
      this.problemeDenomination = true;
      this.problemePersonneMorale = false;
      this.erreur = true
    }
    else {
      this.problemeDenomination = false;
      this.problemePersonneMorale = false;
      this.erreur = false;
    }
  }

  onFocusOutEventSigle() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.sigle = this.modifForm.get("clien_sigle").value;
    this.civiliteNature = this.modifForm.get("clien_titre").value;
    /*
    if (this.typePersonneChoisi === this.personneMorale && (this.sigle === null || this.sigle === "")) {
      this.problemeSigle = true;
      // this.problemeSigleGerant = false;
      // this.problemePersonneMorale = false;
      this.erreur = true
    }
    /*
    // else if (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature == this.gerant && (this.sigle === null || this.sigle === "")) {
    //   this.problemeSigle = false;
    //   this.problemeSigleGerant = true;
    //   // this.problemePersonneMorale = false;
    //   this.erreur = true
    // }
    
    else {
      this.problemeSigle = false;
      // this.problemeSigleGerant = false;
      // this.problemePersonneMorale = false;
      this.erreur = false;
    }
    */
  }

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
    /*
    else if (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature == this.gerant && (this.site === null || this.site === "")) {
      this.problemeSite = false;
      this.problemeSiteGerant = true;
      this.problemePersonneMorale = false;
      this.erreur = true
    }
    */
    else {
      this.problemeSite = false;
      // this.problemeSiteGerant = false;
      this.problemePersonneMorale = false;
      this.erreur = false;
    }
  }

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
      // console.log("Activite comm: " + this.activiteCommercante);
      // this.problemeCodeNinea = false;
      // this.problemeRC = false;
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    else if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.registreCommerce === null || this.registreCommerce === ""))) {
      // console.log("Activite comm: "+ this.activiteCommercante) ;
      // this.problemeCodeNinea = true;
      this.problemeRCetNINEA = true;
      this.erreur = true;
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
    if (event.target.value !== null && event.target.value !== "") {
      this.clientService.getClientByNinea(event.target.value)
        .subscribe((data) => {
          this.problemeMemeNinea = false;
        },
          (error) => {
            this.problemeMemeNinea = true;
          });
    } else {
      this.problemeMemeNinea = false;
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
        // console.log("les 7 caracteres ne sont pas des nombres") ;
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
      // this.problemeRC = false;
      // this.problemeCodeNinea = false;
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    else if (this.activiteCommercante == this.OUI && ((this.registreCommerce === null || this.registreCommerce === "") || (this.codeNinea === null || this.codeNinea === ""))) {
      // this.problemeRC = true;
      this.problemeRCetNINEA = true;
      this.erreur = true;
    }
    else {
      // this.problemeRC = false;
      // this.problemeRCGerant = false;
      // this.problemeCodeNinea = false;
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    */

    /*
    if (event.target.value !== null && event.target.value !== "") {
      // console.log("ninea different de vide");
      this.clientService.getClientByRC(event.target.value)
        .subscribe((data) => {
          this.problemeMemeRc = false;
        },
          (error) => {
            this.problemeMemeRc = true;
          });
    } else {
      this.problemeMemeRc = false;
    }
    */
  }

  onFocusOutEventTypeSociete() {
    this.typePersonneChoisi = this.modifForm.get("clien_nature").value;
    this.typeSociete = this.modifForm.get("clien_typesociete").value;
    /*
    if (this.typePersonneChoisi === this.personneMorale && (this.typeSociete === null || this.typeSociete == "")) {
      this.problemeTypeSociete = true;
      this.problemePersonneMorale = false;
      this.erreur = true
    } else {
      this.problemeTypeSociete = false;
      this.problemePersonneMorale = false;
      this.erreur = false;
    }
    */
  }

  // onFocusOutEventNumClient() {
  //   this.numeroClient = this.modifForm.get("clien_numero").value;
  //   this.clientService.getAllClients()
  //     .subscribe((data: Client[]) => {
  //       this.clients = data;
  //       this.listeClients = data as Client[];
  //       //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
  //       if (this.listeClients.find(p => p.clien_numero === this.numeroClient)?.clien_numero != null) {
  //         this.problemeNumClient = true;
  //         this.erreur = true
  //       }

  //       else {
  //         this.problemeNumClient = false;
  //         this.erreur = false;
  //       }
  //     });

  // }

  onFocusOutEventDate() {
    // this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.dateEntreeRelation = this.modifForm.get("clien_date_relation").value;
    this.dateCreation = this.modifForm.get("clien_datenaissance").value;

    // if (this.typePersonneChoisi === this.personneMorale) {
    //   this.addForm.controls['clien_datenaissance'].setValue(this.dateEntreeRelation);
    // }

    if (this.dateEntreeRelation != null && this.dateEntreeRelation !== "" && this.dateCreation != null && this.dateCreation !== "" && (this.dateCreation > this.dateEntreeRelation)) {
      this.problemeDate = true;
      this.erreur = true;
    }
    else {
      this.problemeDate = false;
      this.erreur = false;
    }
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
  getColorContactPrincip() {
    if (this.problemeContactPrincip) {
      return '1px solid red';
    } else {
      return '';
    }
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
