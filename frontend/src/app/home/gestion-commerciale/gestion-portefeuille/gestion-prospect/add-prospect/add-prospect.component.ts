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
import { Prospect } from '../../../../../model/Prospect';
import { User } from '../../../../../model/User';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { FormatNumberService } from '../../../../../services/formatNumber.service';
import { ProspectService } from '../../../../../services/prospect.service';
import { UserService } from '../../../../../services/user.service';
import type from '../../../../data/type.json';
import dateFormatter from 'date-format-conversion';

@Component({
  selector: 'ngx-add-prospect',
  templateUrl: './add-prospect.component.html',
  styleUrls: ['./add-prospect.component.scss']
})
export class AddProspectComponent implements OnInit {

  addForm = this.fb.group({

    // prospc_numero: ['', [Validators.required]],
    prospc_nature: ['', [Validators.required]],
    prospc_titre: [''],
    prospc_nom: [''],             // obligatoire si personne physique
    prospc_prenom: [''],          // obligatoire si personne physique
    prospc_denomination: [''],    // obligatoire si personne morale
    prospc_sigle: [''],           // obligatoire si personne morale
    prospc_adressenumero: [''],
    prospc_adresserue: [''],
    prospc_adresseville: ['', [Validators.required]],
    prospc_categosocioprof: [''],
    prospc_telephone1: ['', [Validators.required]],
    prospc_telephone2: [''],
    prospc_portable: ['', [Validators.required]],
    // prospc_fax: [''],
    prospc_email: ['', [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],   // obligatoire si personne morale
    prospc_website: [''],       
    prospc_ninea: ['', [Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/)]],   
    prospc_typesociete: [''],
    prospc_registrecommerce: ['', [Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]], // obligatoire si personne morale
    prospc_classificationmetier: [''], // obligatoire si personne morale ou personne physique gérant
    prospc_cin: [''],                 // obligatoire si personne physique
    prospc_capitalsocial: [''],       // obligatoire si personne morale ou personne physique gérant
    prospc_utilisateur: [''],

    prospc_date_relation: [''],
    prospc_datenaissance: [''],
    prospc_chiffreaffaireannuel: [''],
    prospc_princdirigeant: [''],
    prospc_facebook: [''],
    prospc_linkdin: [''],
    prospc_passeport: [''],
    prospc_activitecommercante: ['', [Validators.required]],
    prospc_statut: ['']
  });

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

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  // ========================================== FIN Déclaration ======================================

  erreur: boolean = false;

  typePersonneChoisi: string;
  personnePhysique = "1";
  personneMorale = "2";

  // Vider le champs titre civilité quand on change nature personne:
  prospc_titreCivilite: any;
  // prospc_typeSocietes: any;
  prospc_classifMetier: any;

  // Variables booléan pour gerer le problème de controle de saisi
  // problemePersonnePhysique: boolean = false;
  // problemePersonneMorale: boolean = false;
  // problemePersonnePhysiCivilite: boolean = false;
  // problemeAfficheTypeSociete: boolean = false;
  // problemeAfficheSecteurActivite: boolean = false;
  // problemeAfficheCapitalsocial: boolean = false;
  // problemeAfficheCategorieSociopro: boolean = false;
  // problemeAfficheCIN: boolean = false;
  problemeNom: boolean = false;
  problemePrenom: boolean = false;
  problemeDenomination: boolean = false;
  // problemeSigle: boolean = false;
  problemeEmail: boolean = false;
  problemeSiteWeb: boolean = false;
  // problemeCodeNinea: boolean = false;
  // problemeCodeNineaGerant: boolean = false;
  //gerer le suffixe du code ninea dénommé: COFI
  // problemeErreurCOFI: boolean = false;
  problemefirstSevenNINEA: boolean = false;
  problemefisrtCOFI: boolean = false;
  problemetwoCOFI: boolean = false;
  problemethreeCOFI: boolean = false;

  problemeTypeSociete: boolean = false;
  // problemeRC: boolean = false;
  // problemeRCGerant: boolean = false;
  problemeClassificationSecteur: boolean = false;
  // problemeCapitalSocial: boolean = false;
  problemeCategoriesociopro: boolean = false;
  problemeCIN: boolean = false;
  problemeLongeurCIN: boolean = false;
  longeurCIN = 17;

  problemeAdresseNumero: boolean = false;
  problemeAdresseVille: boolean = false;
  problemeTelephone1: boolean = false;
  problemeNumeroPortable: boolean = false;
  problemeMemeRc: boolean = false;
  problemeMemeNinea: boolean = false;


  // Variable pour le controle de saisi
  adresseNumero: any;
  numeroPortable: any;

  civilite: any;
  // Les variables à gerer pour type personne = personne physique
  prenom: string;
  nom: string;
  adresseVille: string;
  telephone1: any;
  civiliteNature: string;
  // gerant = "23";
  categoriesociopro: any;
  cin: any;

  // Les variables à gerer pour type personne = personne morale
  denomination: string;
  sigle: string;
  email: string;
  siteWeb: string;
  codeNinea: string;
  //formeJuridique: number;
  codeRC: string;
  typeSociete: any;
  idTypeSociete: any;
  civile: string;
  civile2: string;
  classificationSecteur: any;
  capitalSocial: any;
  chiffreAffaireActivite: any


  // controle du numéro de téléphone et de l'e-mail
  displayNumero1Error: boolean = false;
  errorNumero1: boolean;
  displayNumero2Error: boolean = false;
  errorNumero2: boolean;
  displayNumeroPortable: boolean = false;
  errorNumeroPortable: boolean;
  displayMailError: boolean = false;
  errorEmail: boolean;

  // controle de l'adresse et le numero téléphone si prenom et nom identiques
  problemeMemeNomPrenom: boolean = false;
  problemeAdresseTel: boolean = false;

  // controle du RC et du code Ninéa si denomination identiques
  problemeDenominationdouble: boolean = false;
  // problemeMemeRcNinea: boolean = false;

  // La gestion des clés étrangères
  listeCodeCivilites: any[];
  // listeCodeCategorieSociopro: any[];
  listTypeSociete: any[];
  //listeProspects: any [] ;
  listeProspects: Array<Prospect> = new Array<Prospect>();
  // classifications: ClassificationSecteur[];

  login: any;
  user: User;

  @Input() jsonTypeSociete: any[] = type;

  autorisation = [];

  //Gestion des numéros de téléphones avec l'API:
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  //Controle sur le code Ninéa
  firstSevenCaract: any = null;
  lastthreecaract: any = null;
  first: any = null
  two: any = null;
  three: any = null;

  dateEntreeRelation: any;
  dateCreation: any;
  passeport: string;

  problemeDate: boolean = false;
  problemeCINouPasseport: boolean = false;
  // porblemeLongeurCIN: boolean = false;
  // problemeCodeNineaOuRC: boolean = false;
  problemeCodeNineaEtRC: boolean = false;
  bloquerPersPhysique: boolean = true;
  bloquerPersMorale: boolean = true;

  showObligatoireCategSociopro: boolean = false;
  showObligatoireCINetPasseport: boolean = false;
  // showObligatoireRCouNinea: boolean = false;
  showObligatoireRCetNinea: boolean = false;
  showObligatoireEmail: boolean = true;

  activiteCommercante: string;
  OUI = "1";
  NON = "2";
  idTypeSocieteONG: any;
  valueTypeSociete: any;
  // afficheTypeSocieteONG: boolean = false;
  prospect_statut: number;
  prospect_statut1 = 1;
  prospect_statut2 = 2;
  prospect_statut3 = 3;
  valueStatut1 = "Information obligatoire manquante";
  valueStatut2 = "Piece justificative manquante";
  valueStatut3 = "Valide pour tranformation en client";

  problemeFormatRC: boolean = false;
  problemeFormatNinea: boolean = false;
  afficheInputClassifMetier: boolean = false;
  valueClassifMetier = 93;
  libelleClassifMetier: any;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: NbAuthService,
    private userService: UserService,
    private toastrService: NbToastrService,
    private civiliteService: CiviliteService,
    private categorieSocioproService: CategorieSocioprofessionnelleService,
    private classifService: ClassificationSecteurService,
    private prospectService: ProspectService,
    private formatNumberService: FormatNumberService) {

  }

  ngOnInit(): void {

    this.onGetAllProspect();
    this.onGetAllCategorieSociopro();
    this.onGetAllClassificationSecteurs();
    this.getlogin();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });

    this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];

    // On met les champs suivants à null pour qu'ils soient de type object et facilté le controle de saisi
    this.addForm.controls['prospc_nom'].setValue(null);
    this.addForm.controls['prospc_prenom'].setValue(null);
    this.addForm.controls['prospc_denomination'].setValue(null);
    this.addForm.controls['prospc_sigle'].setValue(null);
    this.addForm.controls['prospc_email'].setValue(null);
    this.addForm.controls['prospc_website'].setValue(null);
    this.addForm.controls['prospc_ninea'].setValue(null);
    this.addForm.controls['prospc_registrecommerce'].setValue(null);
    this.addForm.controls['prospc_typesociete'].setValue(null);
    this.addForm.controls['prospc_classificationmetier'].setValue(null);
    this.addForm.controls['prospc_categosocioprof'].setValue(null);
    this.addForm.controls['prospc_cin'].setValue(null);
    this.addForm.controls['prospc_chiffreaffaireannuel'].setValue(0);
    this.addForm.controls['prospc_capitalsocial'].setValue(0);
    // this.capitalSocial = 0 ;

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
      this.listeCodeCategorieSociopro.filter(categ => categ.categs_liblong.toLowerCase().indexOf(search) > -1)
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
      this.classifications.filter(classif => classif.libelle.toLowerCase().indexOf(search) > -1)
    );
  }

  // ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================

  // onGetAllCivilites() {
  //   this.civiliteService.getAllCivilite()
  //     .subscribe((data: Civilite[]) => {
  //       this.listeCodeCivilites = data as Civilite[];
  //     });
  // }

  onGetAllProspect() {
    this.prospectService.getAllProspect()
      .subscribe((data: Prospect[]) => {
        this.listeProspects = data as Prospect[];
      });
  }

  onGetAllCategorieSociopro() {
    this.categorieSocioproService.getAllCategorieSocioprofessionnelle()
      .subscribe((data: CategorieSocioprofessionnelle[]) => {
        this.listeCodeCategorieSociopro = data as CategorieSocioprofessionnelle[];
        this.filteredCategSociopro.next(this.listeCodeCategorieSociopro.slice());
      });
  }

  onGetAllCiviliteByNature(nature: number) {
    this.civiliteService.getAllCiviliteByNature(nature)
      .subscribe((data: Civilite[]) => {
        this.listeCodeCivilites = data as Civilite[];
      });
  }

  onGetAllClassificationSecteurs() {
    this.classifService.getAllClassificationSecteur()
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
    // console.log(typeof(event.value))
    this.addForm.controls['prospc_classificationmetier'].setValue(event.value);
    if (event != null) {
      this.problemeClassificationSecteur = false;
      this.erreur = false;
    }
  }

  onChangePersonne(event) {
    this.addForm.controls['prospc_nature'].setValue(event);
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;
    this.prospc_titreCivilite = "".toString();
    this.addForm.controls['prospc_titre'].setValue(this.prospc_titreCivilite);
    this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));

    // Gestion des types de société
    this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
    this.problemeFormatRC = false;
    this.problemeFormatNinea = false;
    this.problemeMemeNinea = false;
    this.problemeMemeRc = false;
    this.problemeMemeNomPrenom = false;
    this.problemeDenominationdouble = false;
    this.afficheInputClassifMetier = false ;

    if (this.typePersonneChoisi === this.personneMorale && this.activiteCommercante === this.OUI) {
      this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE2'];

    } else if (this.typePersonneChoisi === this.personneMorale && this.activiteCommercante === this.NON) {
      this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE3'];

      this.addForm.controls['prospc_classificationmetier'].setValue(this.valueClassifMetier);
      this.libelleClassifMetier = this.onGetLibelleByClassification(this.valueClassifMetier);
      this.afficheInputClassifMetier = true;

      /*
        this.idTypeSocieteONG = "11"; // ONG
        this.idTypeSociete = (this.listTypeSociete.find(p => p.id == this.idTypeSocieteONG))?.id;
        this.valueTypeSociete = (this.listTypeSociete.find(p => p.id == this.idTypeSocieteONG))?.value;
        this.addForm.controls['prospc_typesociete'].setValue(this.idTypeSociete);
        */
      // this.afficheTypeSocieteONG = true;
    }

    this.showObligatoireEmail = true;
    if (this.typePersonneChoisi === this.personnePhysique) {
      this.bloquerPersPhysique = false;
      this.bloquerPersMorale = true;
      // this.problemePersonnePhysique = true;
      // this.problemeAfficheCategorieSociopro = true;
      // this.problemeAfficheCIN = true;
      // this.problemePersonnePhysiCivilite = false;
      // this.problemePersonneMorale = false;
      // this.problemeAfficheTypeSociete = false;
      // this.problemeAfficheSecteurActivite = false;
      // this.problemeAfficheCapitalsocial = false;
      this.problemeDenomination = false;
      // this.problemeSigle = false;
      // this.problemeSiteWeb = false;
      // this.problemeCodeNinea = false;
      this.problemeTypeSociete = false;
      this.problemeCodeNineaEtRC = false;
      this.erreur = false;

      // this.addForm.controls['prospc_categosocioprof'].setValidators(Validators.required);
      this.addForm.controls['prospc_titre'].setValidators(Validators.required);
      this.showObligatoireCategSociopro = true;
      // this.showObligatoireRCetNinea = false ;

      if (this.activiteCommercante == this.NON) {
        this.showObligatoireCINetPasseport = true
        // this.showObligatoireRCouNinea = false;
        this.showObligatoireEmail = false;
        this.problemeEmail = false;
        // this.addForm.controls['prospc_email'].clearValidators();
      } else {
        this.showObligatoireCINetPasseport = false;
        this.problemeCINouPasseport = false;
        // this.showObligatoireRCouNinea = true;
        // this.addForm.controls['prospc_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]))
      }

      // Vider les champs de la pers Morale
      this.valueTypeSociete = "".toString();
      this.addForm.controls['prospc_typesociete'].setValue(this.valueTypeSociete);
      this.addForm.controls['prospc_denomination'].setValue("");
      this.addForm.controls['prospc_sigle'].setValue("");
      this.addForm.controls['prospc_ninea'].setValue("");
      this.addForm.controls['prospc_registrecommerce'].setValue("");
      this.classifCtrl.setValue("");
      this.addForm.controls['prospc_classificationmetier'].setValue("");
      this.addForm.controls['prospc_princdirigeant'].setValue("");

      // this.afficheTypeSocieteONG = false;

    } else if (this.typePersonneChoisi === this.personneMorale) {
      this.bloquerPersPhysique = true;
      this.bloquerPersMorale = false;
      this.problemeCodeNineaEtRC = false;
      // this.problemePersonneMorale = true;
      // this.problemeAfficheCategorieSociopro = false;
      // this.problemeAfficheCIN = false;
      // this.problemeAfficheTypeSociete = true;
      // this.problemePersonnePhysiCivilite = false;
      // this.problemeAfficheSecteurActivite = true;
      // this.problemeAfficheCapitalsocial = true;
      // this.problemePersonnePhysique = false;
      this.problemeNom = false;
      this.problemePrenom = false;
      this.problemeCategoriesociopro = false;
      this.problemeCINouPasseport = false;
      // this.problemeCodeNineaOuRC = false;
      this.erreur = false;

      // this.addForm.controls['prospc_categosocioprof'].clearValidators();
      this.addForm.controls['prospc_titre'].clearValidators();
      // this.addForm.controls['prospc_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]))
      this.showObligatoireCategSociopro = false;
      this.showObligatoireCINetPasseport = false;
      // this.showObligatoireRCouNinea = false;

      // Vider les champs de la pers physique
      this.addForm.controls['prospc_nom'].setValue("");
      this.addForm.controls['prospc_prenom'].setValue("");
      this.addForm.controls['prospc_cin'].setValue("");
      this.addForm.controls['prospc_passeport'].setValue("");
      this.addForm.controls['prospc_princdirigeant'].setValue("");
      this.addForm.controls['prospc_ninea'].setValue("");
      this.addForm.controls['prospc_registrecommerce'].setValue("");
      this.categSocioproCtrl.setValue("");
      this.addForm.controls['prospc_categosocioprof'].setValue("");

      // if (this.activiteCommercante == this.OUI) {
      //   this.showObligatoireRCetNinea = true ;
      // } else {
      //   this.showObligatoireRCetNinea = false ;
      // }
    }

    // this.addForm.controls['prospc_categosocioprof'].updateValueAndValidity();
    this.addForm.controls['prospc_titre'].updateValueAndValidity();
    // this.addForm.controls['prospc_email'].updateValueAndValidity();
  }

  onChangeActiviteCommercante(event) {
    this.addForm.controls['prospc_activitecommercante'].setValue(event);
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;

    this.showObligatoireEmail = true;
    this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
    this.afficheInputClassifMetier = false;

    if (this.activiteCommercante == this.NON) {

      this.valueTypeSociete = "".toString();
      this.addForm.controls['prospc_typesociete'].setValue(this.valueTypeSociete);
      this.showObligatoireRCetNinea = false;
      this.problemeCodeNineaEtRC = false;

      if (this.typePersonneChoisi == this.personnePhysique) {

        this.showObligatoireCINetPasseport = true;
        this.showObligatoireEmail = false;
        this.problemeEmail = false;
      } else {
        this.showObligatoireCINetPasseport = false;
        this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE3'];
        this.addForm.controls['prospc_classificationmetier'].setValue(this.valueClassifMetier);
        this.libelleClassifMetier = this.onGetLibelleByClassification(this.valueClassifMetier);
        this.afficheInputClassifMetier = true;

        /*
        this.idTypeSocieteONG = "11"; // ONG
        this.idTypeSociete = (this.listTypeSociete.find(p => p.id == this.idTypeSocieteONG))?.id;
        this.valueTypeSociete = (this.listTypeSociete.find(p => p.id == this.idTypeSocieteONG))?.value;
        this.addForm.controls['prospc_typesociete'].setValue(this.idTypeSociete);
        */
        // this.afficheTypeSocieteONG = true;
      }

    } else if (this.activiteCommercante == this.OUI) {

      this.valueTypeSociete = "".toString();
      this.addForm.controls['prospc_typesociete'].setValue(this.valueTypeSociete);
      this.showObligatoireRCetNinea = true;
      this.showObligatoireCINetPasseport = false;
      this.problemeCINouPasseport = false;

      if (this.typePersonneChoisi === this.personneMorale) {
        this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE2'];
      }
    }
  }

  onChangePaysResidence(event) {

    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;
    // console.log(event);
    // console.log(this.activiteCommercante);
    
    if (this.activiteCommercante === this.OUI && event === 'SN') {
      // this.addForm.controls['clien_ninea'].setValidators(Validators.required);
      this.addForm.controls['prospc_ninea'].setValidators(Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/));
      this.addForm.controls['prospc_registrecommerce'].setValidators(Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/));
      this.showObligatoireRCetNinea = true;

    } else if (this.activiteCommercante === this.OUI && event === 'HORS_SN') {
      this.addForm.controls['prospc_ninea'].clearValidators();
      this.addForm.controls['prospc_registrecommerce'].clearValidators();
      this.showObligatoireRCetNinea = true;
      this.problemeFormatNinea = false;
      this.problemeFormatRC = false ;

    } else {
      this.addForm.controls['prospc_ninea'].clearValidators();
      this.addForm.controls['prospc_registrecommerce'].clearValidators();
      this.addForm.controls['prospc_ninea'].setValidators(Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/));
      this.addForm.controls['prospc_registrecommerce'].setValidators(Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/));
      this.showObligatoireRCetNinea = false;
      // this.problemeRCetNINEA = false;
    }

    this.addForm.controls['prospc_ninea'].updateValueAndValidity();
    this.addForm.controls['prospc_registrecommerce'].updateValueAndValidity();
    
  }

  onChangeCivilite(event) {
    this.addForm.controls['prospc_titre'].setValue(event);
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.civiliteNature = this.addForm.get("prospc_titre").value;
    /*
    if (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature === this.gerant) {
      // this.problemePersonnePhysiCivilite = true;
      // this.problemeAfficheSecteurActivite = true;
      // this.problemeAfficheCapitalsocial = true;
      this.idTypeSociete = 8;
      this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
      this.civile = (this.listTypeSociete.find(p => p.id == this.idTypeSociete))?.value;
      this.addForm.controls['prospc_typesociete'].setValue(this.civile);
    }
    else {
      // this.problemePersonnePhysiCivilite = false;
    }
    */
  }

  onChangeCategorieSociopro(event) {
    this.addForm.controls['prospc_categosocioprof'].setValue(event.value);
  }

  onchangeTelephone1() {
    this.displayNumero1Error = true;
    if (this.addForm.controls['prospc_telephone1'].valid == true) {
      this.errorNumero1 = true;
    } else {
      this.errorNumero1 = false;
    }
  }

  onchangeTelephone2() {
    this.displayNumero2Error = true;
    if (this.addForm.controls['prospc_telephone2'].valid == true) {
      this.errorNumero2 = true;
    } else {
      this.errorNumero2 = false;
    }
  }

  onchangeNumeroPortable() {
    this.displayNumeroPortable = true;
    if (this.addForm.controls['prospc_portable'].valid == true) {
      this.errorNumeroPortable = true;
    } else {
      this.errorNumeroPortable = false;
    }
  }

  onchangeMail() {
    this.displayMailError = true;
    if (this.addForm.controls['prospc_email'].valid == true) {
      this.errorEmail = true;
    } else {
      this.errorEmail = false;
    }
  }

  onChangeTypeSociete(event) {
    this.addForm.controls['prospc_typesociete'].setValue((this.listTypeSociete.find(p => p.id === event)).id);
    if (event != null) {
      this.problemeTypeSociete = false;
      this.erreur = false;
    }
  }

  onCancel() {
    this.router.navigateByUrl('home/gestion-commerciale/gestion-portefeuille/prospects');
  }

  onSubmit() {

    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.civilite = this.addForm.get("prospc_titre").value;

    this.nom = this.addForm.get("prospc_nom").value;
    this.prenom = this.addForm.get("prospc_prenom").value;
    this.adresseNumero = this.addForm.get("prospc_adressenumero").value;
    this.adresseVille = this.addForm.get("prospc_adresseville").value;
    this.telephone1 = this.addForm.get("prospc_telephone1").value;

    this.denomination = this.addForm.get("prospc_denomination").value;
    this.sigle = this.addForm.get("prospc_sigle").value;
    this.email = this.addForm.get("prospc_email").value;
    this.siteWeb = this.addForm.get("prospc_website").value;
    this.codeNinea = this.addForm.get("prospc_ninea").value;
    this.typeSociete = this.addForm.get("prospc_typesociete").value;
    this.codeRC = this.addForm.get("prospc_registrecommerce").value;
    this.classificationSecteur = this.addForm.get("prospc_classificationmetier").value;
    this.capitalSocial = this.addForm.get("prospc_capitalsocial").value;
    this.cin = this.addForm.get("prospc_cin").value;
    this.passeport = this.addForm.get("prospc_passeport").value;
    this.categoriesociopro = this.addForm.get("prospc_categosocioprof").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    this.dateEntreeRelation = this.addForm.get("prospc_date_relation").value;
    this.dateCreation = this.addForm.get("prospc_datenaissance").value;

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

    // Personne physique et civilité gérant:
    /*
    if (this.typeSociete === "SI") {
      this.idTypeSociete = 8;
      this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
      this.civile = (this.listTypeSociete.find(p => p.id == this.idTypeSociete))?.id;
      this.addForm.controls['prospc_typesociete'].setValue(this.civile);
    }
    */

    // On gère le prenom et nom pour type de personne = personne physique
    if (this.typePersonneChoisi === this.personnePhysique && this.nom === null) {
      this.problemeNom = true;
      this.erreur = true;
    } else if (this.typePersonneChoisi === this.personnePhysique && this.prenom === null) {
      this.problemePrenom = true;
      this.erreur = true;
    } else if (this.typePersonneChoisi === this.personneMorale && this.denomination === null) {
      this.problemeDenomination = true;
      this.erreur = true;
    }
    // else if (this.typePersonneChoisi === this.personneMorale && this.sigle === null) {
    //   this.problemeSigle = true;
    //   this.erreur = true;
    // } 
    // else if (this.typePersonneChoisi === this.personnePhysique && (this.categoriesociopro === null || this.categoriesociopro === "")) {
    //   this.problemeCategoriesociopro = true;
    //   this.erreur = true;
    // } 
    else if (this.dateEntreeRelation != null && this.dateEntreeRelation !== "" && this.dateCreation != null && this.dateCreation !== "" && (this.dateCreation > this.dateEntreeRelation)) {
      this.problemeDate = true;
      this.erreur = true;
    }
    // else if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
    //   this.problemeCINouPasseport = true;
    //   this.erreur = true;
    // } 
    else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.problemeLongeurCIN = true;
      this.erreur = true;
    }
    // else if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI && (this.codeNinea === null || this.codeNinea === "") && (this.codeRC === null || this.codeRC === "")) {
    //   this.problemeCodeNineaOuRC = true
    //   this.erreur = true;
    // } 
    // else if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.codeRC === null || this.codeRC === ""))) {
    //   this.problemeCodeNineaEtRC = true
    //   this.erreur = true;
    // }
    // else if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.email === null || this.email == "")) {
    //   this.problemeEmail = true;
    //   this.erreur = true;
    // }
    // else if (this.typePersonneChoisi === this.personneMorale && this.siteWeb === null) {
    //   this.problemeSiteWeb = true;
    //   this.erreur = true;
    // } 
    // else if (this.typePersonneChoisi === this.personneMorale && (this.codeNinea === null || this.codeNinea === "")) {
    //   this.problemeCodeNinea = true;
    //   this.erreur = true;
    // }
    // else if (this.typePersonneChoisi === this.personneMorale && (this.codeRC === null || this.codeRC === "")) {
    //   this.problemeRC = true;
    //   this.erreur = true;
    // }
    else if (this.typePersonneChoisi === this.personneMorale && (this.typeSociete === null || this.typeSociete === "")) {
      this.problemeTypeSociete = true;
      this.erreur = true;
    }
    // else if ((this.typePersonneChoisi === this.personneMorale) && (this.classificationSecteur === null || this.classificationSecteur === "")) {
    //   this.problemeClassificationSecteur = true;
    //   this.erreur = true;
    // }
    // else if ((this.typePersonneChoisi === this.personneMorale) && (this.capitalSocial === null || this.capitalSocial === "")) {
    //   this.problemeCapitalSocial = true;
    //   this.erreur = true;
    // } 

    // else if (this.typePersonneChoisi === this.personnePhysique && this.civiliteNature == this.gerant && (this.codeRC === null || this.codeRC === "")) {
    //   this.problemeRCGerant = true;
    //   this.erreur = true
    // }
    // On vérifie s'il n'y a pas une personne physique qui existe déjà 
    else if (this.nom != null && this.prenom != null && this.adresseVille != null && this.telephone1 != null
      && this.listeProspects.find(p => p.prospc_nom?.toLowerCase() === this.nom?.toLowerCase() && p.prospc_prenom?.toLowerCase() === this.prenom?.toLowerCase()
        && p.prospc_adresseville?.toLowerCase() === this.adresseVille?.toLowerCase() && p.prospc_telephone1 === this.telephone1)) {

      this.problemeAdresseTel = true;
      this.erreur = true;
    }
    // On vérifie qu'il n'y a pas de RC et Ninéa qui existe déjà
    // else if (this.codeNinea != null && this.codeRC != null
    //   && this.listeProspects.find(p => p.prospc_ninea?.toLowerCase() === this.codeNinea?.toLowerCase() && p.prospc_registrecommerce?.toLowerCase() === this.codeRC?.toLowerCase())) {
    //   this.problemeMemeRcNinea = true;
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
    else {
      this.addForm.controls['prospc_utilisateur'].setValue(this.user.util_numero);
      this.addForm.controls['prospc_telephone1'].setValue(this.addForm.controls['prospc_telephone1'].value.internationalNumber);
      this.addForm.controls['prospc_telephone2'].setValue(this.addForm.controls['prospc_telephone2'].value?.internationalNumber);
      this.addForm.controls['prospc_portable'].setValue(this.addForm.controls['prospc_portable'].value?.internationalNumber);

      // Vérification du statut du prospect
      if (this.adresseNumero === null || this.adresseNumero === "") {
        this.prospect_statut = this.prospect_statut1;
        this.addForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.email === null || this.email == "")) {
        this.prospect_statut = this.prospect_statut1;
        this.addForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if ((this.typePersonneChoisi === this.personnePhysique) && ((this.categoriesociopro === null || this.categoriesociopro === ""))) {
        this.prospect_statut = this.prospect_statut1;
        this.addForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
        this.prospect_statut = this.prospect_statut1;
        this.addForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if ((this.typePersonneChoisi === this.personneMorale) && (this.classificationSecteur === null || this.classificationSecteur === "")) {
        this.prospect_statut = this.prospect_statut1;
        this.addForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.codeRC === null || this.codeRC === ""))) {
        this.prospect_statut = this.prospect_statut2;
        this.addForm.controls['prospc_statut'].setValue(this.prospect_statut2);
      } else {
        this.prospect_statut = this.prospect_statut3;
        this.addForm.controls['prospc_statut'].setValue(this.prospect_statut3);
      }

      this.prospectService.addProspect(this.addForm.value)
        .subscribe((data) => {
          this.toastrService.show(
            // 'Prospect enregistré avec succès !',
            // data.message,
            // this.prospect_statut == this.prospect_statut2 ? "le prospect est en attente de piece justificative" : "le prospect est enregistré avec succès !",
            this.prospect_statut == this.prospect_statut1 ? "Le prospect est en attente d'informations manquantes" : this.prospect_statut == this.prospect_statut2 ? "le prospect est en attente de piece justificative" : "le prospect est enregistré avec succès !",
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });

          // Redirection vers la page qui correspond au statut du prospect
          if (this.prospect_statut == this.prospect_statut1 || this.prospect_statut == this.prospect_statut2) {
            this.router.navigateByUrl('/home/gestion-prospect/prospect-attente');
          }
          else {
            this.router.navigateByUrl('home/gestion-commerciale/gestion-portefeuille/prospects');
          }
        },
          (error) => {
            this.toastrService.show(
              error.error.message,
              'Erreur de Notification',
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
  }

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

  onFocusOutEventNom() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.nom = this.addForm.get("prospc_nom").value;
    this.prenom = this.addForm.get("prospc_prenom").value;
    if (this.typePersonneChoisi === this.personnePhysique && (this.nom === null || this.nom == "")) {
      this.problemeNom = true;
      // this.problemePersonnePhysique = false;
      this.erreur = true
    } else {
      this.problemeNom = false;
      // this.problemePersonnePhysique = false;
      this.erreur = false;
    }

    // On compare le prénom et nom pour voir s'il y'a une correspondance
    if (this.nom !== null && this.prenom !== null) {
      if (this.listeProspects.find(p => p.prospc_nom?.toLowerCase() === this.nom?.toLowerCase() && p.prospc_prenom?.toLowerCase() === this.prenom?.toLowerCase())?.prospc_numero != null) {
        this.problemeMemeNomPrenom = true;
      } else {
        this.problemeMemeNomPrenom = false;
      }
    }
  }

  onFocusOutEventPrenom() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.prenom = this.addForm.get("prospc_prenom").value;
    this.nom = this.addForm.get("prospc_nom").value;

    if (this.typePersonneChoisi === this.personnePhysique && (this.prenom === null || this.prenom === "")) {
      this.problemePrenom = true;
      // this.problemePersonnePhysique = false;
      this.erreur = true
    } else {
      this.problemePrenom = false;
      // this.problemePersonnePhysique = false;
      this.erreur = false;
    }

    // On compare le prénom et nom pour voir s'il y'a une correspondance
    if (this.nom !== null && this.prenom !== null) {
      if (this.listeProspects.find(p => p.prospc_nom?.toLowerCase() === this.nom?.toLowerCase() && p.prospc_prenom?.toLowerCase() === this.prenom?.toLowerCase())?.prospc_numero != null) {
        this.problemeMemeNomPrenom = true;
      } else {
        this.problemeMemeNomPrenom = false;
      }
    }
  }

  onFocusOutEventAdresseNumero() {
    this.adresseNumero = this.addForm.get("prospc_adressenumero").value;

    // controle de validation du champs ville
    if (this.adresseNumero === null || this.adresseNumero === "") {
      this.problemeAdresseNumero = true;
      // this.erreur = true;
    } else {
      this.problemeAdresseNumero = false;
      this.erreur = false;
    }
  }

  onFocusOutEventAdresseVille() {

    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.telephone1 = this.addForm.get("prospc_telephone1").value;
    this.adresseVille = this.addForm.get("prospc_adresseville").value;
    this.nom = this.addForm.get("prospc_nom").value;
    this.prenom = this.addForm.get("prospc_prenom").value;

    // controle de validation du champs ville
    if (this.adresseVille === null || this.adresseVille === "") {
      this.problemeAdresseVille = true;
      this.erreur = true;
    } else {
      this.problemeAdresseVille = false;
      this.erreur = false;
    }

    if (this.typePersonneChoisi === this.personnePhysique && this.adresseVille != null && this.telephone1 != null) {
      if (this.listeProspects.find(p => p.prospc_nom?.toLowerCase() === this.nom?.toLowerCase() && p.prospc_prenom?.toLowerCase() === this.prenom?.toLowerCase() && p.prospc_adresseville?.toLowerCase() === this.adresseVille?.toLowerCase() && p.prospc_telephone1 === this.telephone1)) {
        this.problemeAdresseTel = true;
        this.erreur = true;
      }
      else {
        this.problemeAdresseTel = false;
        this.erreur = false;
      }
    }
  }

  onFocusOutEventTelephone1() {

    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.telephone1 = this.addForm.get("prospc_telephone1").value;
    this.adresseVille = this.addForm.get("prospc_adresseville").value;
    this.nom = this.addForm.get("prospc_nom").value;
    this.prenom = this.addForm.get("prospc_prenom").value;

    if (this.telephone1 == "") {
      this.problemeTelephone1 = true;
      this.erreur = true
    } else {
      this.problemeTelephone1 = false;
      this.erreur = false;
    }

    if (this.typePersonneChoisi === this.personnePhysique && this.adresseVille != null && this.telephone1 != null) {
      if (this.listeProspects.find(p => p.prospc_nom?.toLowerCase() === this.nom?.toLowerCase() && p.prospc_prenom?.toLowerCase() === this.prenom?.toLowerCase() && p.prospc_adresseville?.toLowerCase() === this.adresseVille?.toLowerCase() && p.prospc_telephone1 === this.telephone1)) {
        this.problemeAdresseTel = true;
        this.erreur = true;
      }
      else {
        this.problemeAdresseTel = false;
        this.erreur = false;
      }
    }
  }

  onFocusOutEventNumeroPortable() {
    this.numeroPortable = this.addForm.get("prospc_portable").value;
    if (this.numeroPortable == "") {
      this.problemeNumeroPortable = true;
      this.erreur = true
    } else {
      this.problemeNumeroPortable = false;
      this.erreur = false;

    }
  }


  onFocusOutEventDenomination() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.denomination = this.addForm.get("prospc_denomination").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.denomination === null || this.denomination === "")) {
      this.problemeDenomination = true;
      // this.problemePersonneMorale = false;
      this.erreur = true
    } else {
      this.problemeDenomination = false;
      // this.problemePersonneMorale = false;
      this.erreur = false;
    }

    // On compare la denomination pour voir s'il y'a une correspondance
    if (this.denomination !== null) {
      if (this.listeProspects.find(p => p.prospc_denomination?.toLowerCase() === this.denomination?.toLowerCase())?.prospc_numero != null) {
        this.problemeDenominationdouble = true;
      } else {
        this.problemeDenominationdouble = false;
      }
    }
  }

  onFocusOutEventSigle() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.sigle = this.addForm.get("prospc_sigle").value;

    /*
    if (this.typePersonneChoisi === this.personneMorale && (this.sigle === null || this.sigle == "")) {
      this.problemeSigle = true;
      this.erreur = true
    } else {
      this.problemeSigle = false;
      this.erreur = false;
    }
    */
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

  /*
  onFocusOutEventNineaPersPhysique(event) {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.codeRC = this.addForm.get("prospc_registrecommerce").value;
    this.codeNinea = this.addForm.get("prospc_ninea").value;
    this.nom = this.addForm.get("prospc_nom").value;
    this.prenom = this.addForm.get("prospc_prenom").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI && (this.codeNinea === null || this.codeNinea === "") && (this.codeRC === null || this.codeRC === "")) {
      // this.problemeCodeNineaOuRC = true
    }
    else {
      // this.problemeCodeNineaOuRC = false;
      this.erreur = false;
    }

    if (event.target.value !== null && event.target.value !== "") {
      this.prospectService.getProspectByNinea(event.target.value)
        .subscribe((data) => {
          this.problemeMemeNinea = false;
        },
          (error) => {
            this.problemeMemeNinea = true;
          });
    } else {
      this.problemeMemeNinea = false;
    }


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
  }

  onFocusOutEventRCPersPhysique(event) {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.denomination = this.addForm.get("prospc_denomination").value;
    this.codeRC = this.addForm.get("prospc_registrecommerce").value;
    this.codeNinea = this.addForm.get("prospc_ninea").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI && (this.codeNinea === null || this.codeNinea === "") && (this.codeRC === null || this.codeRC === "")) {
      // this.problemeCodeNineaOuRC = true
    }
    else {
      // this.problemeCodeNineaOuRC = false;
      this.erreur = false;
    }

    if (event.target.value !== null && event.target.value !== "") {
      this.prospectService.getProspectByRC(event.target.value)
        .subscribe((data) => {
          this.problemeMemeRc = false;
        },
          (error) => {
            this.problemeMemeRc = true;
          });
    } else {
      this.problemeMemeRc = false;
    }

  }

  onFocusOutEventNineaPersMorale(event) {
    // this.problemeErreurCOFI = true ;
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.denomination = this.addForm.get("prospc_denomination").value;
    this.codeRC = this.addForm.get("prospc_registrecommerce").value;
    this.codeNinea = this.addForm.get("prospc_ninea").value;
    this.nom = this.addForm.get("prospc_nom").value;
    this.prenom = this.addForm.get("prospc_prenom").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    if (this.typePersonneChoisi === this.personneMorale && this.activiteCommercante === this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.codeRC === null || this.codeRC === ""))) {
      this.problemeCodeNineaEtRC = true
    }
    else {
      this.problemeCodeNineaEtRC = false;
      this.erreur = false;
    }

    if (event.target.value !== null && event.target.value !== "") {
      this.prospectService.getProspectByNinea(event.target.value)
        .subscribe((data) => {
          this.problemeMemeNinea = false;
        },
          (error) => {
            this.problemeMemeNinea = true;
          });
    } else {
      this.problemeMemeNinea = false;
    }


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
  }

  onFocusOutEventRCPersMorale(event) {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.denomination = this.addForm.get("prospc_denomination").value;
    this.codeRC = this.addForm.get("prospc_registrecommerce").value;
    this.codeNinea = this.addForm.get("prospc_ninea").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    if (this.typePersonneChoisi === this.personneMorale && this.activiteCommercante === this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.codeRC === null || this.codeRC === ""))) {
      this.problemeCodeNineaEtRC = true
    }
    else {
      this.problemeCodeNineaEtRC = false;
      this.erreur = false;
    }

    if (event.target.value !== null && event.target.value !== "") {
      this.prospectService.getProspectByRC(event.target.value)
        .subscribe((data) => {
          this.problemeMemeRc = false;
        },
          (error) => {
            this.problemeMemeRc = true;
          });
    } else {
      this.problemeMemeRc = false;
    }
  }
  */

  onFocusOutEventNinea(event) {

    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.codeNinea = this.addForm.get("prospc_ninea").value;
    this.codeRC = this.addForm.get("prospc_registrecommerce").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    // if (this.activiteCommercante == this.NON) {
    //   this.problemeCodeNineaEtRC = false;
    //   this.erreur = false;
    // }
    if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.codeRC === null || this.codeRC === ""))) {
      this.problemeCodeNineaEtRC = true;
      // this.erreur = true;
    }
    else {
      this.problemeCodeNineaEtRC = false;
      this.erreur = false;
    }

    if (event.target.value !== null && event.target.value !== "") {
      this.prospectService.getProspectByNinea(event.target.value)
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

    if (this.addForm.get("prospc_ninea").invalid === true) {
      this.problemeFormatNinea = true;
    } else {
      this.problemeFormatNinea = false;
    }
  }

  onFocusOutEventRC(event) {

    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.codeNinea = this.addForm.get("prospc_ninea").value;
    this.codeRC = this.addForm.get("prospc_registrecommerce").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    // if (this.activiteCommercante == this.NON) {
    //   this.problemeCodeNineaEtRC = false;
    //   this.erreur = false;
    // }
    if (this.activiteCommercante == this.OUI && ((this.codeRC === null || this.codeRC === "") || (this.codeNinea === null || this.codeNinea === ""))) {
      this.problemeCodeNineaEtRC = true;
      // this.erreur = true;
    }
    else {
      this.problemeCodeNineaEtRC = false;
      this.erreur = false;
    }

    if (this.addForm.get("prospc_registrecommerce").invalid === true) {
      this.problemeFormatRC = true;
    } else {
      this.problemeFormatRC = false;
    }

    if (event.target.value !== null && event.target.value !== "") {
      this.prospectService.getProspectByRC(event.target.value)
        .subscribe((data) => {
          this.problemeMemeRc = false;
        },
          (error) => {
            this.problemeMemeRc = true;
          });
    } else {
      this.problemeMemeRc = false;
    }
  }

  onFocusOutEventEmail() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.email = this.addForm.get("prospc_email").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.email === null || this.email == "")) {
      this.problemeEmail = true;
      // this.problemePersonneMorale = false;
      // this.erreur = true
    } else {
      this.problemeEmail = false;
      // this.problemePersonneMorale = false;
      this.erreur = false;
    }
  }

  onFocusOutEventSiteWeb() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.siteWeb = this.addForm.get("prospc_website").value;

    /*
    if (this.typePersonneChoisi === this.personneMorale && (this.siteWeb === null || this.siteWeb == "")) {
      this.problemeSiteWeb = true;
      this.erreur = true
    } else {
      this.problemeSiteWeb = false;
      this.erreur = false;
    }
    */
  }

  onFocusOutEventTypeSociete() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.typeSociete = this.addForm.get("prospc_typesociete").value;
    if (this.typePersonneChoisi === this.personneMorale && (this.typeSociete === null || this.typeSociete === "")) {
      this.problemeTypeSociete = true;
      // this.problemePersonneMorale = false;
      this.erreur = true
    } else {
      this.problemeTypeSociete = false;
      // this.problemePersonneMorale = false;
      this.erreur = false;
    }
  }

  onFocusOutEventCapitalSocial() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.capitalSocial = this.addForm.get("prospc_capitalsocial").value;
    this.civilite = this.addForm.get("prospc_titre").value;

    if (this.capitalSocial === null || this.capitalSocial === "") {
      this.addForm.controls['prospc_capitalsocial'].setValue(0);
      this.capitalSocial = 0;
    } else {
      this.capitalSocial = Number(this.formatNumberService.replaceAll(this.capitalSocial, ' ', ''));
      this.capitalSocial = this.formatNumberService.numberWithCommas2(this.capitalSocial);
    }

    /*
    if ((this.typePersonneChoisi === this.personneMorale) && (this.capitalSocial === null || this.capitalSocial === "")) {
      this.problemeCapitalSocial = true;
      this.problemePersonneMorale = false;
      this.erreur = true
    } else {
      this.problemeCapitalSocial = false;
      this.problemePersonneMorale = false;
      this.erreur = false;

      this.capitalSocial = Number(this.formatNumberService.replaceAll(this.capitalSocial, ' ', ''));
      this.capitalSocial = this.formatNumberService.numberWithCommas2(this.capitalSocial);
    }
    */
  }

  onFocusOutEventSecteurActivite() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.classificationSecteur = this.addForm.get("prospc_classificationmetier").value;
    this.civilite = this.addForm.get("prospc_titre").value;
    if ((this.typePersonneChoisi === this.personneMorale) && (this.classificationSecteur === null || this.classificationSecteur === "")) {
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
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.categoriesociopro = this.addForm.get("prospc_categosocioprof").value;
    if (this.typePersonneChoisi === this.personnePhysique && (this.categoriesociopro === null || this.categoriesociopro === "")) {
      this.problemeCategoriesociopro = true;
      // this.erreur = true
    } else {
      this.problemeCategoriesociopro = false;
      this.erreur = false;
    }
  }

  onFocusOutEventCIN() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.cin = this.addForm.get("prospc_cin").value;
    this.passeport = this.addForm.get("prospc_passeport").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
    }
    else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.problemeLongeurCIN = true;
    }
    else {
      this.problemeLongeurCIN = false;
      this.problemeCINouPasseport = false;
      this.erreur = false;
    }
  }

  onFocusOutEventPasseport() {

    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.cin = this.addForm.get("prospc_cin").value;
    this.passeport = this.addForm.get("prospc_passeport").value;
    this.activiteCommercante = this.addForm.get("prospc_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true
    }
    else {
      this.problemeCINouPasseport = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDate() {
    // this.typePersonneChoisi = this.addForm.get("clien_nature").value;

    this.dateEntreeRelation = this.addForm.get("prospc_date_relation").value;
    this.dateCreation = this.addForm.get("prospc_datenaissance").value;

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

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')

    // return new Date().toISOString().split('T')[0]
  }

  onFocusOutEventNomPrincipDirigeant() {
    /*
    this.activiteCommercante = this.addForm.get("clien_activitecommercante").value;
    this.dirigeant = this.addForm.get("clien_princdirigeant").value;

    if (this.activiteCommercante == this.OUI && (this.dirigeant == null || this.dirigeant == "")) {
      this.problemeDirigeant = true;
    } else {
      this.problemeDirigeant = false;
      this.erreur = false;
    }
    */
  }

  onFocusOutEventChiffreAffaireActivite() {
    this.typePersonneChoisi = this.addForm.get("prospc_nature").value;
    this.chiffreAffaireActivite = this.addForm.get("prospc_chiffreaffaireannuel").value;

    if (this.chiffreAffaireActivite === null || this.chiffreAffaireActivite === "") {
      this.addForm.controls['prospc_chiffreaffaireannuel'].setValue(0);
      this.chiffreAffaireActivite = 0;
    } else {
      this.chiffreAffaireActivite = Number(this.formatNumberService.replaceAll(this.chiffreAffaireActivite, ' ', ''));
      this.chiffreAffaireActivite = this.formatNumberService.numberWithCommas2(this.chiffreAffaireActivite);
    }

    /*
   if (this.typePersonneChoisi === this.personneMorale && (this.chiffreAffaireActivite === null || this.chiffreAffaireActivite === "")) {
     this.problemeChiffreAffaireActivite = true;
     this.erreur = true
   }
   else {
     this.problemeChiffreAffaireActivite = false;
     this.erreur = false;

     this.chiffreAffaireActivite = Number(this.formatNumberService.replaceAll(this.chiffreAffaireActivite, ' ', ''));

     this.chiffreAffaireActivite = this.formatNumberService.numberWithCommas2(Number(this.chiffreAffaireActivite));
   }
   */
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

  getColorDenomination() {
    if (this.problemeDenomination) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorSigle() {
    /*
    if (this.problemeSigle) {
      return '1px solid red';
    } else {
      return '';
    }
    */
  }

  getColorEmail() {
    if (this.problemeEmail) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorSiteWeb() {
    /*
    if (this.problemeSiteWeb) {
      return '1px solid red';
    } else {
      return '';
    }
    */
  }

  getColorRC() {
    if (this.problemeCodeNineaEtRC) {
      return '1px solid red';
    }
    else {
      return '';
    }
  }

  getColorNinea() {
    if (this.problemeCodeNineaEtRC) {
      return '1px solid red';
    }
    else {
      return '';
    }
  }

  getColorRCPersPhysique() {
    // if (this.problemeCodeNineaOuRC) {
    //   return '1px solid red';
    // }
    // else {
    //   return '';
    // }
  }

  getColorNineaPersPhysique() {
    // if (this.problemeCodeNineaOuRC) {
    //   return '1px solid red';
    // }
    // else {
    //   return '';
    // }
  }

  getColorTypeSociete() {
    if (this.problemeTypeSociete) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorAdresseNumero() {
    if (this.problemeAdresseNumero) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorAdresseVille() {
    if (this.problemeAdresseVille) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorTelephone1() {
    if (this.problemeTelephone1) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumeroPortable() {
    if (this.problemeNumeroPortable) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCapitalSocial() {
    /*
    if (this.problemeCapitalSocial) {
      return '1px solid red';
    } else {
      return '';
    }
    */
  }

  getColorSecteurActivite() {
    if (this.problemeClassificationSecteur) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCategorieSociopro() {
    if (this.problemeCategoriesociopro) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCIN() {
    if (this.problemeCINouPasseport || this.problemeLongeurCIN) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  getColorDate() {
    if (this.problemeDate) {
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

  getColorNomPrincipDirigeant() {
    /*
    if (this.problemeDirigeant) {
      return '1px solid red';
    } else {
      return '';
    }
    */
  }

  getColorChiffreAffaireActivite() {
    /*
    if (this.problemeChiffreAffaireActivite) {
      return '1px solid red';
    } else {
      return '';
    }
    */
  }
}
