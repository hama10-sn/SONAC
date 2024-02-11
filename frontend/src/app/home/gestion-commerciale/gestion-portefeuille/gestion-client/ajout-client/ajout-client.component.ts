import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../../../model/CategorieSocioprofessionnelle';
import { Civilite } from '../../../../../model/Civilite';
import { Client } from '../../../../../model/Client';
import { User } from '../../../../../model/User';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClientService } from '../../../../../services/client.service';
import { UserService } from '../../../../../services/user.service';
import type from '../../../../data/type.json';
import dateFormatter from 'date-format-conversion';
import { Groupe } from '../../../../../model/Groupe';
import { GroupeService } from '../../../../../services/groupe.service';
import { StringifyOptions } from 'querystring';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { FormatNumberService } from '../../../../../services/formatNumber.service';

@Component({
  selector: 'ngx-ajout-client',
  templateUrl: './ajout-client.component.html',
  styleUrls: ['./ajout-client.component.scss']
})
export class AjoutClientComponent implements OnInit {

  addForm = this.fb.group({
    client_id: [''],
    clien_numero: [''],
    clien_typeclient: [''],
    clien_numerosolvabilite: [''],
    clien_nature: ['', [Validators.required]],
    clien_typesociete: [''],
    clien_coderegroupgestion: [''],
    clien_titre: ['',],
    clien_nom: [''],
    clien_prenom: [''],
    clien_denomination: [''],
    clien_sigle: [''],
    clien_adressenumero: ['', [Validators.required]],
    clien_adresserue: [''],
    clien_adresseville: ['', [Validators.required]],
    clien_datenaissance: ['', [Validators.required]],
    // clien_datesouscription1: ['', [Validators.required]],
    clien_categsocioprof: ['', [Validators.required]],
    clien_telephone1: ['', [Validators.required]],
    clien_telephone2: [''],
    clien_portable: ['', [Validators.required]],
    // clien_fax: [''],
    // clien_email: ['', [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],   // obligatoire si personne morale
    clien_email: ['', [Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)])]],
    clien_website: [''],
    clien_ninea: ['', [Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/)]],
    clien_registrecommerce: ['', [Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]],
    clien_codeorigine: [''],
    clien_sexe: [''],
    //clien_formejuridique: [''],
    clien_effectif: [''],
    clien_chiffreaffaireannuel: ['',],
    clien_chiffreaffaireprime: [''],
    clien_chargesinistre: [''],
    // clien_contactprinci: ['',[Validators.pattern(/^(221|00221|\+221)?(77|78|75|70|76)[0-9]{7}$/)]],
    clien_utilisateur: [''],
    clien_datemodification: [''],
    clien_anciennumero: [''],
    clien_CIN: [''],
    clien_capital_social: [''],
    clien_date_relation: ['', [Validators.required]],
    clien_secteur_activite: [''],
    clien_status: [''],
    clien_princdirigeant: ['', [Validators.required]],
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

  typePersonneChoisi: string;
  civiliteNature: string;
  numeroClient: number;
  contactPrincip: string;
  telephone1: string;
  portable: string;
  personnePhysique = "1";
  personneMorale = "2";
  activiteCommercante: string;
  OUI = "1";
  NON = "2";

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
  problemeTypeSociete: boolean = false;
  problemeNumClient: boolean = false;
  problemeMemeNomPrenom: boolean = false;
  problemeAdresseTel: boolean = false;
  problemeDenominationdouble: boolean = false;
  // problemeMemeRcNinea: boolean = false;
  problemeMemeRc: boolean = false;
  problemeMemeNinea: boolean = false;
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
  problemeFormatRC: boolean = false;
  problemeFormatNinea: boolean = false;

  // problemeDenominationGerant: boolean = false;
  // problemeSigleGerant: boolean = false;
  // problemeSiteGerant: boolean = false;
  // problemeRCGerant: boolean = false;
  // problemeCodeNineaGerant: boolean = false;

  //gerer le suffixe du code ninea dénommé: COFI
  // problemeErreurCOFI: boolean = false;
  problemefirstSevenNINEA: boolean = false;
  problemefisrtCOFI: boolean = false;
  problemetwoCOFI: boolean = false;
  problemethreeCOFI: boolean = false;

  // problemeCIN: boolean = false;
  // problemePasseport: boolean = false;
  problemeCINouPasseport: boolean = false;
  porblemeLongeurCIN: boolean = false;
  obligatoirEmail: boolean = false;
  problemeCategoriesociopro: boolean = false;
  problemeCapitalSocial: boolean = false;
  problemeChiffreAffaireActivite: boolean = false;
  problemeChargeSinistre: boolean = false;
  problemeClassificationSecteur: boolean = false;
  problemeDate: boolean = false;


  showObligatoire: boolean = false;
  showObligatoireEmail: boolean = true;
  showObligatoireCategSociopro: boolean = false;
  showObligatoirePrincipalDirigeant: boolean = false;
  showObligatoireRCetNinea: boolean = false;
  showObligatoireCINetPasseport: boolean = false;
  showObligatoireCivilite: boolean = false;
  bloquerPersPhysique: boolean = true;
  bloquerPersMorale: boolean = true;
  afficheInputModeGouver: boolean = true;
  afficheInputSAModeGouver: boolean = false;
  afficheInputAllModeGouver: boolean = false;
  afficheTypeSocieteONG: boolean = false;
  showObligatoireDenominationPersPhysique: boolean = false;
  // Les variables à gerer pour type personne = personne physique
  prenom: string;
  nom: string;
  gerant = "23";
  categoriesociopro: any;
  dirigeant: string;

  civilite_value: any;
  // Les variables à gerer pour type personne = personne morale
  denomination: string;
  sigle: string;
  site: string;
  codeNinea: string;
  typeSociete: any;
  idTypeSocieteONG: any;
  registreCommerce: string;
  telephone: string;
  adresse: string;
  email: string;
  numRue: any;
  ville: string;
  civile: string;
  cin: String;
  passeport: String;
  capitalsocial: any;
  chiffreAffaireActivite: any;
  chargeSinistre: any;
  classificationSecteur: any;


  categorie: CategorieSocioprofessionnelle;
  civilite: Civilite;
  listCivilite: any[];
  // listCategoriSocio: any[];
  listType: any[];
  listTypeSociete: any[];
  // listTypeSociete2: any[];
  valueTypeSociete: string;
  idTypeSociete: any;
  listeClients: any[];
  listeClients2: any[];
  autorisation = [];
  listGroupes: any[];
  listesecteurs: any[];
  listeModeGouvernance: any[];

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

  code_utilisateur: String;
  datesouscription: Date;
  datenaissance: Date;
  daterelation: Date;
  client: Client;

  dateEntreeRelation: any;
  dateCreation: any;

  client_status: String;
  client_valide = "1";
  client_attente = "2";

  //Controle sur le code Ninéa
  firstSevenCaract: any = null;
  lastthreecaract: any = null;
  first: any = null
  two: any = null;
  three: any = null;

  // Vider les champs titre civilité, catgorie sociopro quand on change nature client:
  clien_categorie_vide: any;
  clien_titreCivilite: any;

  longeurCIN = 17;

  code_typeClient: any;
  value_typeClient: any;

  valueModeGouver: string = "";
  valueSexe: string = "";
  afficheInputClassifMetier: boolean = false;
  valueClassifMetier = 93;
  libelleClassifMetier: any;

  codeSouscripteur = "1";

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  @Input() jsonTypeSociete: any[] = type;
  @Input() listTypeclient: any[] = type;
  @Input() listeModeGouver: any[] = type;

  constructor(private fb: FormBuilder,
    private categorieService: CategorieSocioprofessionnelleService, private clientService: ClientService,
    private userService: UserService,
    private civiliteService: CiviliteService,
    private groupeService: GroupeService,
    private secteurService: ClassificationSecteurService,
    private authService: NbAuthService,
    private formatNumberService: FormatNumberService,
    private router: Router,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {

    // console.log(this.getToday())
    // this.onGetAllCategorieSocio();
    this.onGetAllCategorieSociopro();
    this.onGetAllGroupe();
    this.onGetAllClients();
    this.onGetAllClients2();
    this.onGetAllClassificationSecteurs();
    this.getlogin();

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          // console.log(this.autorisation);
        }

      });

    // this.listType = this.listTypeclient['TYPE_CLIENT'];
    // this.value_typeClient = (this.listType.find(p => p?.id == this.code_typeClient))?.value;

    // this.addForm.controls['clien_typeclient'].setValue(this.type_client);
    // this.code_typeClient = this.client.clien_typeclient;
    // this.listType = this.listTypeclient['TYPE_CLIENT'];

    // this.addForm.controls['clien_typeclient'].setValue("souscripteur");

    this.listType = this.listTypeclient['TYPE_CLIENT'];
    this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
    // this.listTypeSociete2 = this.jsonTypeSociete['TYPE_SOCIETE2'];
    this.listeModeGouvernance = this.listeModeGouver['MODE_GOUVERNANCE'];
    this.addForm.controls['clien_effectif'].setValue(0);
    this.addForm.controls['clien_chiffreaffaireannuel'].setValue(0);
    this.addForm.controls['clien_chiffreaffaireprime'].setValue(0);
    this.addForm.controls['clien_chargesinistre'].setValue(0);
    this.addForm.controls['clien_capital_social'].setValue(0);
    this.addForm.controls['clien_numeroprospect'].setValue(0);
    //this.addForm.controls['clien_datesouscription1'].setValue(new Date());
    // this.datesouscription = dateFormatter(new Date(), 'yyyy-MM-ddTHH:mm');
    // console.log(this.datesouscription);
    // this.addForm.controls['clien_datesouscription1'].setValue(this.datesouscription);
    /*
    this.datenaissance = dateFormatter(new Date(), 'yyyy-MM-ddTHH:mm');
    console.log(this.datenaissance);
    this.addForm.controls['clien_datenaissance'].setValue(this.datenaissance);
    this.daterelation = dateFormatter(new Date(), 'yyyy-MM-ddTHH:mm');
    console.log(this.daterelation);
    this.addForm.controls['clien_date_relation'].setValue(this.daterelation);
    */
    // On met les champs suivants à null pour qu'ils soient de type object et facilté le controle de saisi
    this.addForm.controls['clien_nom'].setValue(null);
    this.addForm.controls['clien_prenom'].setValue(null);
    this.addForm.controls['clien_CIN'].setValue(null);
    this.addForm.controls['clien_denomination'].setValue(null);
    this.addForm.controls['clien_sigle'].setValue(null);
    // this.addForm.controls['clien_email'].setValue(null);
    this.addForm.controls['clien_website'].setValue(null);
    this.addForm.controls['clien_ninea'].setValue(null);
    this.addForm.controls['clien_registrecommerce'].setValue(null);
    this.addForm.controls['clien_typesociete'].setValue(null);
    this.addForm.controls['clien_secteur_activite'].setValue(null);
    this.addForm.controls['clien_adressenumero'].setValue(null);
    this.addForm.controls['clien_adresseville'].setValue(null);
    // this.addForm.controls['clien_datenaissance'].setValue(new Date());
    /// this.addForm.controls['clien_datesouscription1'].setValue(new Date());

    // this.addForm.controls['clien_status'].setValue(this.client_attente);
    // this.client_status = this.client_attente;

    // console.log("status: "+ this.client_status) ;

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

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')

    // return new Date().toISOString().split('T')[0]
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

  onGetAllCategorieSociopro() {
    this.categorieService.getAllCategorieSocioprofessionnelle()
      .subscribe((data: CategorieSocioprofessionnelle[]) => {
        this.listeCodeCategorieSociopro = data as CategorieSocioprofessionnelle[];
        this.filteredCategSociopro.next(this.listeCodeCategorieSociopro.slice());
      });
  }
  // onGetAllTypeCivilite(){
  //   this.civiliteService.getAllCivilite()
  //     .subscribe((data: Civilite[]) => {
  //         this.civilites = data;
  //         this.listCivilite = data as Civilite[];
  //     });
  // }
  onGetAllCiviliteByNature(nature: number) {
    this.civiliteService.getAllCiviliteByNature(nature)
      .subscribe((data: Civilite[]) => {
        this.listCivilite = data as Civilite[];
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

  onGetLibelleByClassification(code: any) {
    if (code === null || code === "") {
      return "";
    } else {
      return code + " : " + (this.classifications.find(c => c.code == code))?.libelle;
    }
  }

  onChangeClassification(event) {
    this.addForm.controls['clien_secteur_activite'].setValue(event.value);
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }

  // onChangeStatus(event) {
  //   //console.log(event);    
  //   this.addForm.controls['clien_status'].setValue(event);
  // }

  onChangeGroupe(event) {
    //console.log(event);    
    this.addForm.controls['clien_coderegroupgestion'].setValue(event);
  }

  // onChangeSexe(event) {
  //   //console.log(event);    
  //   this.addForm.controls['clien_sexe'].setValue(event);
  // }
  onGetLibelleByNaturePersonne(numero: any) {
    if (numero === this.personnePhysique) {
      return 'Personne physique';
    } else if (numero === this.personneMorale) {
      return 'Personne morale';
    }
  }

  onChangePersonne(event) {

    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;
    this.addForm.controls['clien_nature'].setValue(event);
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.clien_titreCivilite = "".toString();
    this.addForm.controls['clien_titre'].setValue(this.clien_titreCivilite);
    this.clien_categorie_vide = "".toString();
    this.categSocioproCtrl.setValue(this.clien_categorie_vide);
    this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    this.problemeFormatRC = false;
    this.problemeFormatNinea = false;
    this.problemeMemeNinea = false;
    this.problemeMemeRc = false;
    this.problemeMemeNomPrenom = false;
    this.problemeDenominationdouble = false;
    this.problemeCINouPasseport = false;
    this.problemeDirigeant = false;
    this.problemeClassificationSecteur = false;
    this.showObligatoireEmail = true;
    this.addForm.controls['clien_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]));
    this.afficheInputClassifMetier = false;

    if (this.typePersonneChoisi === this.personneMorale && this.activiteCommercante === this.OUI) {
      this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE2']
    } else {
      this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE']

      if (this.typePersonneChoisi === this.personneMorale && this.activiteCommercante === this.NON) {

        this.idTypeSocieteONG = "11"; // ONG
        this.idTypeSociete = (this.listTypeSociete.find(p => p.id == this.idTypeSocieteONG))?.id;
        this.valueTypeSociete = (this.listTypeSociete.find(p => p.id == this.idTypeSocieteONG))?.value;
        this.addForm.controls['clien_typesociete'].setValue(this.idTypeSociete);
        this.afficheTypeSocieteONG = true;
        this.afficheInputModeGouver = true;
        this.afficheInputSAModeGouver = false;
        this.afficheInputAllModeGouver = false;

        // Mode Gouverance = presidence ou secretariat général pour les ONG
        this.addForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id == 5)).id) // 5 = Présidence ou Sécrétariat Général
        this.valueModeGouver = (this.listeModeGouvernance.find(p => p.id == 5)).value;

        this.addForm.controls['clien_secteur_activite'].setValue(this.valueClassifMetier);
        this.libelleClassifMetier = this.onGetLibelleByClassification(this.valueClassifMetier);
        this.afficheInputClassifMetier = true;
      }
    }

    if (this.typePersonneChoisi === this.personnePhysique) {
      this.bloquerPersPhysique = false;
      this.bloquerPersMorale = true;
      this.problemePersonnePhysique = true;
      this.problemePersonneMorale = false;
      // this.problemeDenomination = false;
      // this.problemeSigle = false;
      this.problemeSite = false;
      // this.problemeRC = false;
      // this.problemeCodeNinea = false;
      this.problemeTypeSociete = false;
      this.erreur = false;

      this.addForm.controls['clien_datenaissance'].clearValidators();
      this.addForm.controls['clien_categsocioprof'].setValidators(Validators.required);
      this.addForm.controls['clien_titre'].setValidators(Validators.required);
      // this.addForm.controls['clien_email'].clearValidators();
      this.showObligatoire = false;
      this.showObligatoireCategSociopro = true;
      this.showObligatoireCivilite = true;

      if (this.activiteCommercante == this.NON) {
        this.problemeDenomination = false;
        this.showObligatoireCINetPasseport = true;
        this.showObligatoireDenominationPersPhysique = false;
        this.showObligatoireEmail = false;
        this.addForm.controls['clien_email'].clearValidators();
        this.addForm.controls['clien_email'].setValidators(Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/));

      } else {
        this.showObligatoireCINetPasseport = false;
        this.showObligatoireDenominationPersPhysique = true;
        // this.showObligatoireEmail = true;
        // this.addForm.controls['clien_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]));
      }

      // Vider les champs de la pers morale pour s'assurer qu'on enregistre pas ces données quand on change de personne (physique)
      this.addForm.controls['clien_modegouvernance'].setValue("");
      this.addForm.controls['clien_typesociete'].setValue("");
      this.valueModeGouver = "";
      this.valueTypeSociete = "";
      this.afficheTypeSocieteONG = false;

      this.addForm.controls['clien_denomination'].setValue("");
      this.addForm.controls['clien_sigle'].setValue("");
      this.addForm.controls['clien_ninea'].setValue("");
      this.addForm.controls['clien_registrecommerce'].setValue("");
      this.classifCtrl.setValue("");
      this.addForm.controls['clien_secteur_activite'].setValue("");
      this.addForm.controls['clien_princdirigeant'].setValue("");
      this.addForm.controls['clien_principalactionnaire'].setValue("");

    } else if (this.typePersonneChoisi === this.personneMorale) {
      this.bloquerPersPhysique = true;
      this.bloquerPersMorale = false;
      this.obligatoirEmail = true;
      this.problemePersonneMorale = true;
      this.problemePersonnePhysique = false;
      // this.problemePersonnePhysiCivilite = false;
      this.problemeNom = false;
      this.problemePrenom = false;
      this.erreur = false;

      this.showObligatoire = true;
      // this.showObligatoireEmail = true
      this.showObligatoireCategSociopro = false;
      this.showObligatoireCINetPasseport = false;
      this.showObligatoireCivilite = false;
      this.addForm.controls['clien_datenaissance'].setValidators(Validators.required);
      // this.addForm.controls['clien_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]))
      this.addForm.controls['clien_categsocioprof'].clearValidators();
      this.addForm.controls['clien_titre'].clearValidators();

      // Vider les champs de la pers physique pour s'assurer qu'on enregistre pas ces données quand on change de personne (morale)
      this.categSocioproCtrl.setValue("");
      this.addForm.controls['clien_categsocioprof'].setValue("");
      this.addForm.controls['clien_nom'].setValue("");
      this.addForm.controls['clien_prenom'].setValue("");
      this.addForm.controls['clien_CIN'].setValue("");
      this.addForm.controls['clien_passeport'].setValue("");
      this.addForm.controls['clien_princdirigeant'].setValue("");
      this.addForm.controls['clien_ninea'].setValue("");
      this.addForm.controls['clien_registrecommerce'].setValue("");
      // this.valueSexe = "";
      // this.addForm.controls['clien_sexe'].setValue(this.valueSexe);
    }
    this.addForm.controls['clien_datenaissance'].updateValueAndValidity();
    this.addForm.controls['clien_email'].updateValueAndValidity();
    this.addForm.controls['clien_categsocioprof'].updateValueAndValidity();
    this.addForm.controls['clien_titre'].updateValueAndValidity();
  }

  onChangeActiviteCommercante(event) {
    this.addForm.controls['clien_activitecommercante'].setValue(event);
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;

    this.showObligatoireEmail = true;
    this.addForm.controls['clien_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]));
    this.afficheInputClassifMetier = false;

    if (this.activiteCommercante == this.NON) {
      this.problemeDirigeant = false;
      this.erreur = false;

      this.addForm.controls['clien_princdirigeant'].clearValidators();
      this.addForm.controls['clien_ninea'].clearValidators();
      this.addForm.controls['clien_registrecommerce'].clearValidators();
      this.addForm.controls['clien_ninea'].setValidators(Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/));
      this.addForm.controls['clien_registrecommerce'].setValidators(Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/));
      this.showObligatoirePrincipalDirigeant = false;
      this.showObligatoireRCetNinea = false;
      this.problemeRCetNINEA = false;
      this.showObligatoireDenominationPersPhysique = false
      this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];

      if (this.typePersonneChoisi == this.personnePhysique) {
        // this.addForm.controls['clien_CIN'].setValidators(Validators.required);
        // this.addForm.controls['clien_passeport'].setValidators(Validators.required);

        this.problemeDenomination = false;
        this.showObligatoireCINetPasseport = true
        this.afficheTypeSocieteONG = false;
        this.addForm.controls['clien_modegouvernance'].setValue("");
        this.valueModeGouver = "";

        this.showObligatoireEmail = false;
        this.addForm.controls['clien_email'].clearValidators();
        this.addForm.controls['clien_email'].setValidators(Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/));
      } else {
        this.showObligatoireCINetPasseport = false;

        this.idTypeSocieteONG = "11"; // ONG
        // this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
        this.idTypeSociete = (this.listTypeSociete.find(p => p.id == this.idTypeSocieteONG))?.id;
        this.valueTypeSociete = (this.listTypeSociete.find(p => p.id == this.idTypeSocieteONG))?.value;
        this.addForm.controls['clien_typesociete'].setValue(this.idTypeSociete);
        this.afficheTypeSocieteONG = true;

        this.afficheInputModeGouver = true;
        this.afficheInputSAModeGouver = false;
        this.afficheInputAllModeGouver = false;


        // Mode Gouverance = presidence ou secretariat général pour les ONG
        this.addForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id == 5)).id) // 5 = Présidence ou Sécrétariat Général
        this.valueModeGouver = (this.listeModeGouvernance.find(p => p.id == 5)).value;

        this.addForm.controls['clien_secteur_activite'].setValue(this.valueClassifMetier);
        this.libelleClassifMetier = this.onGetLibelleByClassification(this.valueClassifMetier);
        this.afficheInputClassifMetier = true;
      }

    } else {

      this.addForm.controls['clien_princdirigeant'].setValidators(Validators.required);
      // this.addForm.controls['clien_ninea'].setValidators(Validators.required);
      this.addForm.controls['clien_ninea'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/)]));
      this.addForm.controls['clien_registrecommerce'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]));
      this.showObligatoirePrincipalDirigeant = true;
      this.showObligatoireRCetNinea = true;
      this.showObligatoireDenominationPersPhysique = true;

      this.showObligatoireCINetPasseport = false;
      this.problemeCINouPasseport = false;
      this.afficheTypeSocieteONG = false;
      this.addForm.controls['clien_modegouvernance'].setValue("");
      this.valueModeGouver = "";
      this.valueTypeSociete = "";
      this.addForm.controls['clien_typesociete'].setValue("");
      this.erreur = false;

      if (this.typePersonneChoisi === this.personneMorale) {
        this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE2'];
      } else {
        this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
      }

    }

    this.addForm.controls['clien_princdirigeant'].updateValueAndValidity();
    this.addForm.controls['clien_ninea'].updateValueAndValidity();
    this.addForm.controls['clien_registrecommerce'].updateValueAndValidity();
    this.addForm.controls['clien_email'].updateValueAndValidity();
  }

  onChangePaysResidence(event) {

    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;
    if (this.activiteCommercante === this.OUI && event === 'SN') {
      // this.addForm.controls['clien_ninea'].setValidators(Validators.required);
      this.addForm.controls['clien_ninea'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/)]));
      this.addForm.controls['clien_registrecommerce'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]));
      this.showObligatoireRCetNinea = true;

    } else if (this.activiteCommercante === this.OUI && event === 'HORS_SN') {
      this.addForm.controls['clien_ninea'].clearValidators();
      this.addForm.controls['clien_registrecommerce'].clearValidators();
      this.addForm.controls['clien_ninea'].setValidators(Validators.required);
      this.addForm.controls['clien_registrecommerce'].setValidators(Validators.required);
      this.showObligatoireRCetNinea = true;
      this.problemeFormatNinea = false;
      this.problemeFormatRC = false;

    } else {
      this.addForm.controls['clien_ninea'].clearValidators();
      this.addForm.controls['clien_registrecommerce'].clearValidators();
      this.addForm.controls['clien_ninea'].setValidators(Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/));
      this.addForm.controls['clien_registrecommerce'].setValidators(Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/));
      this.showObligatoireRCetNinea = false;
      this.problemeRCetNINEA = false;
    }

    this.addForm.controls['clien_ninea'].updateValueAndValidity();
    this.addForm.controls['clien_registrecommerce'].updateValueAndValidity();
  }

  cancel() {
    this.router.navigateByUrl('/home/gestion-client');
    // this.ref.close();
  }


  submit() {

    this.dateEntreeRelation = this.addForm.get("clien_date_relation").value;
    this.dateCreation = this.addForm.get("clien_datenaissance").value;
    this.adresse = this.addForm.get("clien_adresseville").value;
    this.telephone = this.addForm.get("clien_telephone1").value;
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.categoriesociopro = this.addForm.get("clien_categsocioprof").value;
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;
    this.nom = this.addForm.get("clien_nom").value;
    this.prenom = this.addForm.get("clien_prenom").value;
    this.cin = this.addForm.get("clien_CIN").value;
    this.passeport = this.addForm.get("clien_passeport").value;
    this.dirigeant = this.addForm.get("clien_princdirigeant").value;
    this.capitalsocial = this.addForm.get("clien_capital_social").value;
    this.chiffreAffaireActivite = this.addForm.get("clien_chiffreaffaireannuel").value;
    this.chargeSinistre = this.addForm.get("clien_chargesinistre").value;
    this.classificationSecteur = this.addForm.get("clien_secteur_activite").value;
    this.denomination = this.addForm.get("clien_denomination").value;
    this.sigle = this.addForm.get("clien_sigle").value;
    //this.site = this.addForm.get("clien_website").value;
    this.registreCommerce = this.addForm.get("clien_registrecommerce").value;
    this.codeNinea = this.addForm.get("clien_ninea").value;
    this.typeSociete = this.addForm.get("clien_typesociete").value;
    this.civiliteNature = this.addForm.get("clien_titre").value;
    this.email = this.addForm.get("clien_email").value;
    this.addForm.controls['clien_telephone1'].setValue(this.addForm.controls['clien_telephone1'].value.internationalNumber);
    this.addForm.controls['clien_telephone2'].setValue(this.addForm.controls['clien_telephone2'].value?.internationalNumber);
    this.addForm.controls['clien_portable'].setValue(this.addForm.controls['clien_portable'].value?.internationalNumber);


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
    else if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.denomination === null || this.denomination === "")) {
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
    // else if (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature == this.gerant && (this.email == null || this.email == '')) {
    //   // this.obligatoirEmail = true;
    //   this.problemeEmail1 = true;
    //   this.erreur = true;
    // } 
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
    }
    else if (this.typePersonneChoisi === this.personneMorale && (this.capitalsocial === null || this.capitalsocial === "")) {
      this.problemeCapitalSocial = true;
      this.erreur = true
    }

    // On vérifie qu'il n'y a pas de RC et Ninéa qui existe déjà
    // else if (this.codeNinea != null && this.registreCommerce != null
    //   && this.listeClients2?.find(p => p.clien_registrecommerce?.toLowerCase() === this.registreCommerce?.toLowerCase()
    //     && p.clien_ninea?.toLowerCase() === this.codeNinea?.toLowerCase())) {

    //   this.problemeMemeRcNinea = true;
    //   this.erreur = true;
    // }


    // else if (this.codeNinea != null && this.codeNinea !== ""
    //   && this.listeClients2?.find(p => p.clien_ninea?.toLowerCase() === this.codeNinea?.toLowerCase())) {

    //   this.problemeMemeNinea = true;
    //   this.erreur = true;
    // }
    // else if (this.registreCommerce != null && this.registreCommerce !== ""
    //   && this.listeClients2?.find(p => p.registreCommerce?.toLowerCase() === this.registreCommerce?.toLowerCase())) {

    //   this.problemeMemeRc = true;
    //   this.erreur = true;
    // }


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
    */
    // else if ((this.typePersonneChoisi === this.personneMorale
    //   || (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature === this.gerant))
    //   && (this.classificationSecteur === null || this.classificationSecteur === "")) {
    //   this.problemeClassificationSecteur = true;
    //   this.erreur = true
    // }
    else if ((this.typePersonneChoisi === this.personneMorale)
      && (this.classificationSecteur === null || this.classificationSecteur === "")) {
      this.problemeClassificationSecteur = true;
      this.erreur = true
    }
    else {
      // Par defaut le client est en attente
      // this.addForm.controls['clien_status'].setValue(this.client_attente);
      // this.client_status = this.client_attente;

      this.obligatoirEmail = false;
      this.erreur = false;
      // this.addForm.controls['clien_typeclient'].setValue("souscripteur");
      this.addForm.controls['clien_typeclient'].setValue((this.listType.find(p => p?.id == this.codeSouscripteur))?.id);
      this.addForm.controls['clien_utilisateur'].setValue(parseInt('this.user.util_numero'));
      this.addForm.controls['clien_datemodification'].setValue(new Date());
      this.addForm.controls['clien_status'].setValue(this.client_valide);

      // if (this.codeNinea != null && this.codeNinea != '' && this.registreCommerce != null && this.registreCommerce != '') {
      //   this.addForm.controls['clien_status'].setValue(this.client_valide);
      //   this.client_status = this.client_valide;
      // }

      // if (this.typePersonneChoisi == this.personnePhysique) {
      //   this.addForm.controls['clien_status'].setValue(this.client_valide);
      //   this.client_status = this.client_valide;
      // }

      // console.log(this.addForm.value) ;


      this.clientService.addClient(this.addForm.value)
        .subscribe((data) => {
          // console.log(data);
          // console.log(data.length);
          this.toastrService.show(
            data.message,
            // this.client_status == this.client_attente ? "le client " + data + " est en attente de RC / Ninéa" : "le client " + data + " est enregistré avec succès",
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 60000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });

          this.router.navigateByUrl('/home/gestion-client');

          // Redirection vers la page qui correspond au status du client
          // if (this.client_status == this.client_attente) {
          //   this.router.navigateByUrl('/home/gestion-client/client-attente')
          // }
          // else {
          //   this.router.navigateByUrl('/home/gestion-client');
          // }

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

  onChangeNature(event) {
    //console.log(event);    
    this.addForm.controls['clien_nature'].setValue(event);
  }
  onChangeCategorieSociopro(event) {
    // console.log(event.value);    
    this.addForm.controls['clien_categsocioprof'].setValue(event.value);
  }

  onGetLibelleByCivilite(civilite: number) {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    // console.log(this.listCivilite);
    return (this.listCivilite.find(p => p.civ_code === civilite))?.civ_libellelong;
  }
  onGetLibelleByTypeSociete(type: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listTypeSociete.find(p => p.id === type))?.value;
  }

  onChangeCivilite(event) {
    // console.log(event);
    this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));
    this.addForm.controls['clien_titre'].setValue(event);
  }

  // onChangeLibeleType(event) {
  //   this.addForm.controls['clien_typeclient'].setValue((this.listType.find(p => p.id === event)).id);
  // }

  onChangeTypeSociete(event) {
    this.addForm.controls['clien_typesociete'].setValue((this.listTypeSociete.find(p => p.id === event)).id);
    // this.problemeTypeSociete = false;
    this.erreur = false;

    // type société: SA = 1
    if (event == 1) {
      this.addForm.controls['clien_modegouvernance'].setValue("")
      this.afficheInputSAModeGouver = true;
      this.afficheInputAllModeGouver = false;
      this.afficheInputModeGouver = false;

    }
    // type societe: SARL = 2, SUARL(SURL) = 3, SNC = 4, SCS = 7, SP = 9, SI = 12
    else if (event == 2 || event == 3 || event == 4 || event == 7 || event == 9 || event == 12) {
      this.addForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id == 1)).id) // 1 = Gérance
      this.valueModeGouver = (this.listeModeGouvernance.find(p => p.id == 1)).value;

      this.afficheInputSAModeGouver = false;
      this.afficheInputAllModeGouver = false;
      this.afficheInputModeGouver = true;
    }
    // type societe: SCP= 5, SCA = 6 
    else if (event == 5 || event == 6) {
      this.addForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id == 6)).id) // 6 = Associé
      this.valueModeGouver = (this.listeModeGouvernance.find(p => p.id == 6)).value;

      this.afficheInputSAModeGouver = false;
      this.afficheInputAllModeGouver = false;
      this.afficheInputModeGouver = true;
    }
    // type societe: SAS = 8, GIE = 10
    else if (event == 8 || event == 10) {
      this.addForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id == 4)).id) // 4 = Présidence
      this.valueModeGouver = (this.listeModeGouvernance.find(p => p.id == 4)).value;

      this.afficheInputSAModeGouver = false;
      this.afficheInputAllModeGouver = false;
      this.afficheInputModeGouver = true;
    }
    // type societe: ONG = 11
    else if (event == 11) {
      this.addForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id == 5)).id) // 5 = Présidence ou Sécrétariat Général
      this.valueModeGouver = (this.listeModeGouvernance.find(p => p.id == 5)).value;

      this.afficheInputSAModeGouver = false;
      this.afficheInputAllModeGouver = false;
      this.afficheInputModeGouver = true;
    }
    // type societe: autres 
    else {
      this.addForm.controls['clien_modegouvernance'].setValue("")
      this.afficheInputSAModeGouver = false;
      this.afficheInputAllModeGouver = true;
      this.afficheInputModeGouver = false;
    }

  }

  onChangeModeGouvernance(event) {
    // console.log(event);
    this.addForm.controls['clien_modegouvernance'].setValue((this.listeModeGouvernance.find(p => p.id === event)).id);
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
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.classificationSecteur = this.addForm.get("clien_secteur_activite").value;
    this.civiliteNature = this.addForm.get("clien_titre").value;
    // if ((this.typePersonneChoisi === this.personneMorale
    //   || (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature === this.gerant))
    //   && (this.classificationSecteur === null || this.classificationSecteur === "")) {
    if ((this.typePersonneChoisi === this.personneMorale)
      && (this.classificationSecteur === null || this.classificationSecteur === "")) {
      this.problemeClassificationSecteur = true;
      // this.problemePersonneMorale = false;
      // this.erreur = true
    } else {
      this.problemeClassificationSecteur = false;
      // this.problemePersonneMorale = false;
      this.erreur = false;
    }
  }

  onFocusOutEventCategorieSociopro() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.categoriesociopro = this.addForm.get("clien_categsocioprof").value;
    if (this.typePersonneChoisi === this.personnePhysique && (this.categoriesociopro === null || this.categoriesociopro === "")) {
      this.problemeCategoriesociopro = true;
      // this.erreur = true
    } else {
      this.problemeCategoriesociopro = false;
      this.erreur = false;
    }
  }

  onFocusOutEventEmail1() {
    this.email = this.addForm.get("clien_email").value;
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.civiliteNature = this.addForm.get("clien_titre").value;

    // if (this.typePersonneChoisi == this.personneMorale || (this.typePersonneChoisi == this.personnePhysique && this.civiliteNature == this.gerant)) {
    if (this.typePersonneChoisi == this.personneMorale) {

      // console.log("============= OK =======")
      // on controle d'abord si le champs est saisi ou non
      if (this.email != "") {
        this.problemeEmail1 = false;
        this.erreur = false;

        // console.log("============= Dedans =======")
        // console.log("email2: "+ this.modifForm.controls['clien_email'].value) ;
        // Maintenant on controle la validité de l'email (le format)
        if (this.addForm.controls['clien_email'].valid == true) {
          // console.log("============= VALIDE =======")
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
        // this.erreur = true;
      }
    }
    else {

      // on controle d'abord si le champs est saisi ou non
      if (this.email != "") {
        // this.problemeEmail1 = false ;
        // this.erreur = false ;

        // Maintenant on controle la validité de l'email (le format)
        if (this.addForm.controls['clien_email'].valid == true) {
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
    this.numRue = this.addForm.get("clien_adressenumero").value;
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
    this.ville = this.addForm.get("clien_adresseville").value;
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

    // this.telephone1 = this.addForm.get("comp_telephone1").value; 

    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.telephone1 = this.addForm.get("clien_telephone1").value;
    console.log(typeof (this.telephone1));
    console.log(this.telephone1)
    // console.log(this.telephone1)
    if (this.telephone1 === "") {
      this.problemeTelephone11 = true;
      // this.erreur = true
    }
    else if ((this.telephone1 != "" && this.addForm.controls['clien_telephone1'].valid == true)) {
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
      this.adresse = this.addForm.get("clien_adresseville").value;
      this.nom = this.addForm.get("clien_nom").value;
      this.prenom = this.addForm.get("clien_prenom").value;
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

    // this.telephone1 = this.addForm.get("comp_telephone1").value; 
    // console.log(typeof(this.telephone1 ));   
    if (this.addForm.controls['clien_telephone2'].valid == true) {
      this.problemeTelephone2 = false;
      this.erreur = false
    } else {
      this.problemeTelephone2 = true;
      this.erreur = true;
    }
  }
  onFocusOutEventPortable() {

    // console.log(this.addForm.valid);

    this.portable = this.addForm.get("clien_portable").value;
    // console.log(typeof (this.portable));
    if (this.portable === "") {
      this.problemeportable11 = true;
      // this.erreur = true
    }
    else if (this.portable != "" && this.addForm.controls['clien_portable'].valid == true) {
      this.problemePortable = false;
      this.problemeportable11 = false;
      this.erreur = false
    } else {
      this.problemePortable = true;
      this.problemeportable11 = false;
      // this.erreur = true;
    }

    // console.log(this.addForm.valid);
  }
  /*
  onFocusOutEventContactPrincip() {

    this.contactPrincip = this.addForm.get("clien_contactprinci").value;
    if (this.contactPrincip === "") {
      this.problemeContactPrincip = true;
      this.erreur = true
    }
    else if (this.contactPrincip != "" && this.addForm.controls['clien_contactprinci'].valid == true) {
      this.problemeContactPrincip2 = false;
      this.problemeContactPrincip = false;
      this.erreur = false
    } else {
      this.problemeContactPrincip2 = true;
      this.problemeContactPrincip = false;
      this.erreur = true;
    }

  }
  */
  onFocusOutEventNom() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.nom = this.addForm.get("clien_nom").value;
    this.prenom = this.addForm.get("clien_prenom").value;

    if (this.prenom !== null && this.prenom !== "" && this.nom !== null && this.nom !== "") {
      this.addForm.controls['clien_princdirigeant'].setValue(this.nom + " " + this.prenom);
    }

    if (this.typePersonneChoisi === this.personnePhysique && (this.nom === null || this.nom === "")) {
      this.problemeNom = true;
      this.problemePersonnePhysique = false;
      // this.erreur = true
    } else {
      this.problemeNom = false;
      this.problemePersonnePhysique = false;
      this.erreur = false;
    }
    this.clientService.getAllClientPhysique()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.listeClients = data as Client[];
        //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
        if (this.listeClients.find(p => p.clien_nom?.toLowerCase() === this.nom?.toLowerCase() && p.clien_prenom?.toLowerCase() === this.prenom?.toLowerCase())?.clien_numero != null) {
          this.problemeMemeNomPrenom = true;
          // this.erreur = true;
        }
        else {
          this.problemeMemeNomPrenom = false;
          this.erreur = false;
        }
      });

  }

  onFocusOutEventPrenom() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.prenom = this.addForm.get("clien_prenom").value;
    this.nom = this.addForm.get('clien_nom').value;

    if (this.prenom !== null && this.prenom !== "" && this.nom !== null && this.nom !== "") {
      this.addForm.controls['clien_princdirigeant'].setValue(this.nom + " " + this.prenom);
    }

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
    this.clientService.getAllClientPhysique()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.listeClients = data as Client[];
        //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
        if (this.listeClients.find(p => p.clien_nom?.toLowerCase() === this.nom?.toLowerCase() && p.clien_prenom?.toLowerCase() === this.prenom?.toLowerCase())?.clien_numero != null) {
          this.problemeMemeNomPrenom = true;
          // this.erreur = true;
        }
        else {
          this.problemeMemeNomPrenom = false;
          this.erreur = false;
        }
      });
  }

  onFocusOutEventNomPrincipDirigeant() {
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;
    this.dirigeant = this.addForm.get("clien_princdirigeant").value;

    if (this.activiteCommercante == this.OUI && (this.dirigeant == null || this.dirigeant == "")) {
      this.problemeDirigeant = true;
    } else {
      this.problemeDirigeant = false;
      this.erreur = false;
    }
  }

  onFocusOutEventChiffreAffaireActivite() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.chiffreAffaireActivite = this.addForm.get("clien_chiffreaffaireannuel").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.chiffreAffaireActivite === null || this.chiffreAffaireActivite === "")) {
      this.problemeChiffreAffaireActivite = true;
      // this.erreur = true
    }
    else {
      this.problemeChiffreAffaireActivite = false;
      this.erreur = false;

      this.chiffreAffaireActivite = Number(this.formatNumberService.replaceAll(this.chiffreAffaireActivite, ' ', ''));

      this.chiffreAffaireActivite = this.formatNumberService.numberWithCommas2(Number(this.chiffreAffaireActivite));
    }
  }

  onFocusOutEventChargeSinistre() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.chargeSinistre = this.addForm.get("clien_chargesinistre").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.chargeSinistre === null || this.chargeSinistre === "")) {
      this.problemeChargeSinistre = true;
      // this.erreur = true
    }
    else {
      this.problemeChargeSinistre = false;
      this.erreur = false;
    }
  }

  onFocusOutEventCapitalSocial() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.capitalsocial = this.addForm.get("clien_capital_social").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.capitalsocial === null || this.capitalsocial === "")) {
      this.problemeCapitalSocial = true;
      // this.erreur = true
    }
    else {
      this.problemeCapitalSocial = false;
      this.erreur = false;

      this.capitalsocial = Number(this.formatNumberService.replaceAll(this.capitalsocial, ' ', ''));
      this.capitalsocial = this.formatNumberService.numberWithCommas2(Number(this.capitalsocial));
    }
  }

  onFocusOutEventCIN() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.cin = this.addForm.get("clien_CIN").value;
    this.passeport = this.addForm.get("clien_passeport").value;
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
    }
    else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.porblemeLongeurCIN = true;
    }
    else {
      this.porblemeLongeurCIN = false;
      this.problemeCINouPasseport = false;
      this.erreur = false;
    }
  }

  onFocusOutEventPasseport() {

    this.cin = this.addForm.get("clien_CIN").value;
    this.passeport = this.addForm.get("clien_passeport").value;
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true
    }
    else {
      this.problemeCINouPasseport = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDenomination() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.denomination = this.addForm.get("clien_denomination").value;
    this.civiliteNature = this.addForm.get("clien_titre").value;
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;

    // if (this.typePersonneChoisi === this.personneMorale && (this.denomination === null || this.denomination === "")) {
    //   this.problemeDenomination = true;
    // }
    // else {
    //   this.problemeDenomination = false;
    //   this.erreur = false;
    // }
    if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.denomination === null || this.denomination === "")) {
      this.problemeDenomination = true;
    }
    else {
      this.problemeDenomination = false;
      this.erreur = false;
    }

    this.clientService.getAllClientMorale()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.listeClients = data as Client[];
        //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
        if (this.listeClients.find(p => p.clien_denomination?.toLowerCase() === this.denomination?.toLowerCase())?.clien_numero != null) {
          this.problemeDenominationdouble = true;
          // this.erreur = true;
        }
        else {

          this.problemeDenominationdouble = false;
          this.erreur = false;
        }
      });
  }

  onFocusOutEventSigle() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.sigle = this.addForm.get("clien_sigle").value;
    this.civiliteNature = this.addForm.get("clien_titre").value;

  }

  onFocusOutEventNinea(event) {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.codeNinea = this.addForm.get("clien_ninea").value;
    this.registreCommerce = this.addForm.get("clien_registrecommerce").value;
    this.civiliteNature = this.addForm.get("clien_titre").value;
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;

    /*
    if (this.activiteCommercante == this.NON) {
      // this.problemeCodeNinea = false;
      // this.problemeRC = false;
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    */
    if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.registreCommerce === null || this.registreCommerce === ""))) {

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

    /*
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
        // this.erreur = true;
      } else {
        this.problemefirstSevenNINEA = false;
        // controle du premier caractere de COFI: qui est soit 0, 1 ou 2
        if ((this.first != null) && Number(this.first) != 0 && Number(this.first) != 1 && Number(this.first) != 2) {
          this.problemefisrtCOFI = true;
          // this.erreur = true;
        } else {
          this.problemefisrtCOFI = false;
          // controle du deuxieme caractere de COFI: qui doit etre une lettre(alphabétique)
          if ((this.two != null) && !this.isLetter(this.two)) {
            this.problemetwoCOFI = true;
            // this.erreur = true;
          } else {
            this.problemetwoCOFI = false;
            // controle du troisieme caractere de COFI: qui doit etre un numérique compris entre 0 et 9
            if ((this.three != null) && !this.isNumber(this.three)) {
              this.problemethreeCOFI = true;
              // this.erreur = true;
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

    if (this.addForm.get("clien_ninea").invalid === true) {
      this.problemeFormatNinea = true;
    } else {
      this.problemeFormatNinea = false;
    }
  }

  onFocusOutEventRC(event) {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.codeNinea = this.addForm.get("clien_ninea").value;
    this.registreCommerce = this.addForm.get("clien_registrecommerce").value;
    this.civiliteNature = this.addForm.get("clien_titre").value;
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;

    /*
    if (this.activiteCommercante == this.NON) {
      // this.problemeRC = false;
      // this.problemeCodeNinea = false;
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }
    */
    if (this.activiteCommercante == this.OUI && ((this.registreCommerce === null || this.registreCommerce === "") || (this.codeNinea === null || this.codeNinea === ""))) {
      // this.problemeRC = true;
      this.problemeRCetNINEA = true;
      // this.erreur = true;
    }
    else {
      // this.problemeRC = false;
      // this.problemeRCGerant = false;
      // this.problemeCodeNinea = false;
      this.problemeRCetNINEA = false;
      this.erreur = false;
    }


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

    if (this.addForm.get("clien_registrecommerce").invalid === true) {
      this.problemeFormatRC = true;
    } else {
      this.problemeFormatRC = false;
    }

  }

  onFocusOutEventSite() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.site = this.addForm.get("clien_website").value;
    this.civiliteNature = this.addForm.get("clien_titre").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.site === null || this.site === "")) {
      this.problemeSite = true;
      //this.problemePersonneMorale = false;
      // this.problemeSiteGerant = false;
      // this.erreur = true
    }
    /*
    else if (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature == this.gerant && (this.site === null || this.site === "")) {
      this.problemeSite = false;
      this.problemeSiteGerant = true;
      //this.problemePersonneMorale = false;
      this.erreur = true
    }
    */
    else {
      this.problemeSite = false;
      // this.problemeSiteGerant = false;
      // this.problemePersonneMorale = false;
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

  onFocusOutEventTypeSociete() {
    this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.typeSociete = this.addForm.get("clien_typesociete").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.typeSociete == null || this.typeSociete == "")) {
      this.problemeTypeSociete = true;
      // this.problemePersonneMorale = false;
      // this.erreur = true
    } else {
      this.problemeTypeSociete = false;
      // this.problemePersonneMorale = false;
      this.erreur = false;
    }
  }

  /*
  onFocusOutEventNumClient() {
    this.numeroClient = this.addForm.get("clien_numero").value;
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clients = data;
        this.listeClients = data as Client[];
        //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
        if (this.listeClients.find(p => p.clien_numero === this.numeroClient)?.clien_numero != null) {
          this.problemeNumClient = true;
          this.erreur = true
        }

        else {
          this.problemeNumClient = false;
          this.erreur = false;
        }
      });
  }
  */

  onFocusOutEventDate() {
    // this.typePersonneChoisi = this.addForm.get("clien_nature").value;
    this.dateEntreeRelation = this.addForm.get("clien_date_relation").value;
    this.dateCreation = this.addForm.get("clien_datenaissance").value;

    if (this.dateEntreeRelation != null && this.dateEntreeRelation !== "" && this.dateCreation != null && this.dateCreation !== "" && (this.dateCreation > this.dateEntreeRelation)) {

      this.problemeDate = true;
      // this.erreur = true;
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
