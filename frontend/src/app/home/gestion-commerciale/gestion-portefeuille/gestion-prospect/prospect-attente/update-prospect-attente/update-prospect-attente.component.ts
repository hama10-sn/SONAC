import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { CategorieSocioprofessionnelle } from '../../../../../../model/CategorieSocioprofessionnelle';
import { Civilite } from '../../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../../model/ClassificationSecteur';
import { Prospect } from '../../../../../../model/Prospect';
import { CategorieSocioprofessionnelleService } from '../../../../../../services/categorieSocioProfessionnelle.service';
import { CiviliteService } from '../../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../../services/classification-secteur.service';
import { FormatNumberService } from '../../../../../../services/formatNumber.service';
import { ProspectService } from '../../../../../../services/prospect.service';
import { TransfertDataService } from '../../../../../../services/transfertData.service';

import type from '../../../../../data/type.json';
import dateFormatter from 'date-format-conversion';


@Component({
  selector: 'ngx-update-prospect-attente',
  templateUrl: './update-prospect-attente.component.html',
  styleUrls: ['./update-prospect-attente.component.scss']
})
export class UpdateProspectAttenteComponent implements OnInit {

  modifForm = this.fb.group({

    prospc_numero: ['', [Validators.required]],
    prospc_nature: ['', [Validators.required]],
    prospc_titre: [''],
    prospc_nom: [''],             // obligatoire si personne physique
    prospc_prenom: [''],          // obligatoire si personne physique
    prospc_denomination: [''],    // obligatoire si personne morale
    prospc_sigle: [''],           // obligatoire si personne morale
    prospc_adressenumero: ['', [Validators.required]],
    prospc_adresserue: [''],
    prospc_adresseville: ['', [Validators.required]],
    prospc_categosocioprof: [''],
    prospc_telephone1: ['', [Validators.required]],
    prospc_telephone2: [''],
    prospc_portable: ['', [Validators.required]],
    // prospc_fax: [''],
    prospc_email: ['', [Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]], // obligatoire si personne morale
    prospc_website: [''],         // obligatoire si personne morale
    prospc_ninea: ['', [Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/)]],
    prospc_typesociete: [''],     // obligatoire si personne morale
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
  codeCategorieSociopro: any;
  classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  codeClassification: String;

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

  typePersonneChoisi: any;
  personnePhysique = "1";
  personneMorale = "2";

  // Variables booléan pour gerer le problème de controle de saisi
  problemePersonnePhysique: boolean = false;
  problemePersonneMorale: boolean = false;
  problemeNom: boolean = false;
  problemePrenom: boolean = false;
  problemeDenomination: boolean = false;
  problemeEmail: boolean = false;
  //gerer le suffixe du code ninea dénommé: COFI
  problemefirstSevenNINEA: boolean = false;
  problemefisrtCOFI: boolean = false;
  problemetwoCOFI: boolean = false;
  problemethreeCOFI: boolean = false;

  problemeTypeSociete: boolean = false;
  problemeClassificationSecteur: boolean = false;
  problemeCategorieSociopro: boolean = false;
  problemeLongeurCIN: boolean = false;
  longeurCIN = 17;

  titre: any;
  numeroProspect: any;

  problemeAdresseNumero: boolean = false;
  problemeAdresseVille: boolean = false;
  problemeTelephone1: boolean = false;
  problemeNumeroPortable: boolean = false;

  // Variable pour le controle de saisi
  adresseNumero: any;
  numeroPortable: any;

  // Les variables à gerer pour type personne = personne physique
  prenom: string;
  nom: string;
  adresseVille: string;
  telephone1: any;
  civiliteNature: any;
  // gerant = 23;
  categoriesociopro: any;
  cin: any;

  // Les variables à gerer pour type personne = personne morale
  denomination: string;
  sigle: string;
  email: string;
  siteWeb: string;
  codeNinea: string;
  codeRC: string;
  typeSociete: any;
  idTypeSociete: any;
  civile: string;

  // La gestion des clés étrangères
  listeCodeCivilites: any[];
  listTypeSociete: any[];
  code_typeSociete: any;
  listeProspects: Array<Prospect> = new Array<Prospect>();

  // controle de l'adresse et le numero téléphone si prenom et nom identiques
  problemeMemeNomPrenom: boolean = false;
  problemeAdresseTel: boolean = false;

  // controle du RC et du code Ninéa si denomination identiques
  problemeMemeRcNinea: boolean = false;

  // controle du numéro de téléphone et de l'e-mail
  displayNumero1Error: boolean = false;
  errorNumero1: boolean;
  displayNumero2Error: boolean = false;
  errorNumero2: boolean;
  displayNumeroPortable: boolean = false;
  errorNumeroPortable: boolean;
  displayMailError: boolean = false;
  errorEmail: boolean;

  prospect: Prospect;
  prospc_naturePersonne: any;
  prospc_titreCivilite: any;
  naturePersonne: any;

  @Input() listTypeProspect: any[] = type;

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

  capitalSocial: any;

  prospectDatenaissance: Date;
  prospectDateEntreeRelation: Date;
  OUI = "1";
  NON = "2";
  code_activitecommercante: String;
  activiteCommercante: string;
  passeport: string;
  value_typeSociete: any;
  chiffreAffaireActivite: any;
  classificationSecteur: any;

  showObligatoireCategSociopro: boolean = false;
  showObligatoireCINetPasseport: boolean = false;
  showObligatoireRCetNinea: boolean = false;
  showObligatoireEmail: boolean = true;

  problemeCINouPasseport: boolean = false;
  problemeCodeNineaEtRC: boolean = false;
  bloquerPersPhysique: boolean = false;
  bloquerPersMorale: boolean = false;

  prospect_statut: number;
  prospect_statut1 = 1;
  prospect_statut2 = 2;
  prospect_statut3 = 3;
  valueStatut1 = "Information obligatoire manquante";
  valueStatut2 = "Piece justificative manquante";
  valueStatut3 = "Valide pour tranformation en client";

  problemeFormatRC: boolean = false;
  problemeFormatNinea: boolean = false;

  dateEntreeRelation: any;
  dateCreation: any;
  problemeDate: boolean = false;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private router: Router,
    private toastrService: NbToastrService,
    private prospectService: ProspectService,
    private categoriesocioproService: CategorieSocioprofessionnelleService,
    private transfertData: TransfertDataService,
    private authService: NbAuthService,
    private civiliteService: CiviliteService,
    private classifService: ClassificationSecteurService,
    private formatNumberService: FormatNumberService) {

  }

  ngOnInit(): void {

    this.onGetAllProspect();
    this.onGetAllCategorieSociopro();
    this.onGetAllClassificationSecteurs();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });

    this.prospect = this.transfertData.getData();

    this.listTypeSociete = this.listTypeProspect['TYPE_SOCIETE'];

    this.modifForm.controls['prospc_numero'].setValue(this.prospect.prospc_numero);
    this.modifForm.controls['prospc_nature'].setValue(this.prospect.prospc_nature);
    this.prospc_naturePersonne = this.prospect.prospc_nature;

    if (this.prospect.prospc_nature == this.personnePhysique) {
      this.naturePersonne = this.prospect.prospc_nature + " : Personne physique";

    } else if (this.prospect.prospc_nature == this.personneMorale) {
      this.naturePersonne = this.prospect.prospc_nature + " : Personne morale";
    }

    this.onGetAllCiviliteByNature(Number(this.prospc_naturePersonne));

    if (this.prospect.prospc_datenaissance != null) {
      this.prospectDatenaissance = dateFormatter(this.prospect.prospc_datenaissance, 'yyyy-MM-dd');
    }
    if (this.prospect.prospc_date_relation != null) {
      this.prospectDateEntreeRelation = dateFormatter(this.prospect.prospc_date_relation, 'yyyy-MM-dd');
    }

    this.modifForm.controls['prospc_datenaissance'].setValue(this.prospectDatenaissance);
    this.modifForm.controls['prospc_date_relation'].setValue(this.prospectDateEntreeRelation);
    this.modifForm.controls['prospc_activitecommercante'].setValue(this.prospect.prospc_activitecommercante);

    if (this.prospect.prospc_activitecommercante == this.OUI) {
      this.code_activitecommercante = "OUI";
    } else if (this.prospect.prospc_activitecommercante == this.NON) {
      this.code_activitecommercante = "NON";
    }

    this.modifForm.controls['prospc_categosocioprof'].setValue(this.prospect.prospc_categosocioprof);
    this.codeCategorieSociopro = this.prospect?.prospc_categosocioprof;
    if (this.prospect.prospc_categosocioprof != null) {
      this.categSocioproCtrl.setValue(this.prospect.prospc_categosocioprof.toString());
    }

    this.modifForm.controls['prospc_titre'].setValue(this.prospect.prospc_titre);
    this.prospc_titreCivilite = this.prospect.prospc_titre;

    this.modifForm.controls['prospc_nom'].setValue(this.prospect.prospc_nom);
    this.modifForm.controls['prospc_prenom'].setValue(this.prospect.prospc_prenom);
    this.modifForm.controls['prospc_denomination'].setValue(this.prospect.prospc_denomination);
    this.modifForm.controls['prospc_sigle'].setValue(this.prospect.prospc_sigle);
    this.modifForm.controls['prospc_adressenumero'].setValue(this.prospect.prospc_adressenumero);
    this.modifForm.controls['prospc_adresserue'].setValue(this.prospect.prospc_adresserue);
    this.modifForm.controls['prospc_adresseville'].setValue(this.prospect.prospc_adresseville);

    this.modifForm.controls['prospc_telephone1'].setValue(this.prospect.prospc_telephone1);
    // console.log(this.modifForm.controls['prospc_telephone1'].value)
    // console.log(this.modifForm.controls['prospc_telephone1'].value.substr(0, 4));
    // console.log(typeof(this.modifForm.controls['prospc_telephone1'].value.substr(0, 4)));
    this.modifForm.controls['prospc_telephone2'].setValue(this.prospect.prospc_telephone2);
    this.modifForm.controls['prospc_portable'].setValue(this.prospect.prospc_portable);
    this.modifForm.controls['prospc_email'].setValue(this.prospect.prospc_email);
    this.modifForm.controls['prospc_website'].setValue(this.prospect.prospc_website);
    this.modifForm.controls['prospc_facebook'].setValue(this.prospect.prospc_facebook);
    this.modifForm.controls['prospc_linkdin'].setValue(this.prospect.prospc_linkdin);
    this.modifForm.controls['prospc_ninea'].setValue(this.prospect.prospc_ninea);
    this.modifForm.controls['prospc_typesociete'].setValue(this.prospect.prospc_typesociete);
    if (this.prospect.prospc_typesociete != null) {
      this.code_typeSociete = this.prospect.prospc_typesociete;
    }

    this.listTypeSociete = this.listTypeProspect['TYPE_SOCIETE'];
    if (this.code_typeSociete != null && this.code_typeSociete !== "") {
      this.value_typeSociete = (this.listTypeSociete.find(p => p?.id == this.code_typeSociete))?.value;

    } else {
      this.value_typeSociete = "";
    }

    this.modifForm.controls['prospc_registrecommerce'].setValue(this.prospect.prospc_registrecommerce);
    this.modifForm.controls['prospc_classificationmetier'].setValue(this.prospect.prospc_classificationmetier);
    this.codeClassification = this.prospect?.prospc_classificationmetier;
    if (this.prospect.prospc_classificationmetier != null) {
      this.classifCtrl.setValue(this.prospect.prospc_classificationmetier.toString());
    }

    this.chiffreAffaireActivite = this.formatNumberService.numberWithCommas2(Number(this.prospect.prospc_chiffreaffaireannuel));
    this.modifForm.controls['prospc_chiffreaffaireannuel'].setValue(this.prospect.prospc_chiffreaffaireannuel);

    this.capitalSocial = this.formatNumberService.numberWithCommas2(Number(this.prospect.prospc_capitalsocial));
    this.modifForm.controls['prospc_capitalsocial'].setValue(this.prospect.prospc_capitalsocial);

    // this.capitalSocial = Number(this.formatNumberService.replaceAll(this.capitalSocial, ' ', ''));
    // this.capitalSocial = this.formatNumberService.numberWithCommas2(this.capitalSocial);

    this.modifForm.controls['prospc_cin'].setValue(this.prospect.prospc_cin);
    this.modifForm.controls['prospc_statut'].setValue(this.prospect.prospc_statut);
    this.prospect_statut = this.prospect.prospc_statut;

    this.typePersonneChoisi = this.prospect.prospc_nature;
    this.civiliteNature = this.prospect.prospc_titre;

    // Les caracteres obligatoires ou non
    if (this.typePersonneChoisi === this.personneMorale) {
      this.showObligatoireCategSociopro = false;
      this.showObligatoireCINetPasseport = false;
      this.showObligatoireEmail = true;
      this.modifForm.controls['prospc_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]));
      this.bloquerPersPhysique = true;
      this.bloquerPersMorale = false;

      // Gerer les champs obligatoires(mettre toutes les informations ou rien)
      this.modifForm.controls['prospc_classificationmetier'].setValidators(Validators.required);

      if (this.prospect.prospc_activitecommercante == this.OUI && this.modifForm.controls['prospc_telephone1'].value.substr(0, 4) !== "+221") {

        this.modifForm.controls['prospc_ninea'].clearValidators();
        this.modifForm.controls['prospc_registrecommerce'].clearValidators();
        this.modifForm.controls['prospc_ninea'].setValidators(Validators.required);
        this.modifForm.controls['prospc_registrecommerce'].setValidators(Validators.required);
        this.showObligatoireRCetNinea = true;
        this.problemeFormatNinea = false;
        this.problemeFormatRC = false;

      } else if (this.prospect.prospc_activitecommercante == this.OUI && this.modifForm.controls['prospc_telephone1'].value.substr(0, 4) === "+221") {
        this.modifForm.controls['prospc_ninea'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/)]));
        this.modifForm.controls['prospc_registrecommerce'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]));
        this.showObligatoireRCetNinea = false;
      }
      else {
        this.modifForm.controls['prospc_ninea'].clearValidators();
        this.modifForm.controls['prospc_registrecommerce'].clearValidators();
        this.modifForm.controls['prospc_ninea'].setValidators(Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/));;
        this.modifForm.controls['prospc_registrecommerce'].setValidators(Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/));
        this.showObligatoireRCetNinea = false;
      }


      // Là on traite les personnes physique
    } else if (this.typePersonneChoisi === this.personnePhysique) {
      this.bloquerPersPhysique = false;
      this.bloquerPersMorale = true;

      // Gerer les champs obligatoires(mettre toutes les informations ou rien)
      this.showObligatoireCategSociopro = true;
      this.modifForm.controls['prospc_categosocioprof'].setValidators(Validators.required);

      if (this.prospect.prospc_activitecommercante == this.NON) {
        this.showObligatoireRCetNinea = false;
        this.showObligatoireEmail = false;
        this.showObligatoireCINetPasseport = true;
        // this.modifForm.controls['prospc_cin'].setValidators(Validators.required);
        // this.modifForm.controls['prospc_passeport'].setValidators(Validators.required);
      } else {
        this.showObligatoireCINetPasseport = false;
        this.showObligatoireRCetNinea = true;
        this.showObligatoireEmail = true;
        this.modifForm.controls['prospc_email'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]));

        // console.log(this.modifForm.controls['prospc_telephone1'].value);
        // this.modifForm.controls['prospc_ninea'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/)]));
        // this.modifForm.controls['prospc_registrecommerce'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]));
        if (this.prospect.prospc_activitecommercante == this.OUI && this.modifForm.controls['prospc_telephone1'].value.substr(0, 4) !== "+221") {

          this.modifForm.controls['prospc_ninea'].clearValidators();
          this.modifForm.controls['prospc_registrecommerce'].clearValidators();
          this.modifForm.controls['prospc_ninea'].setValidators(Validators.required);
          this.modifForm.controls['prospc_registrecommerce'].setValidators(Validators.required);
          this.showObligatoireRCetNinea = true;
          this.problemeFormatNinea = false;
          this.problemeFormatRC = false;

        } else if (this.prospect.prospc_activitecommercante == this.OUI && this.modifForm.controls['prospc_telephone1'].value.substr(0, 4) === "+221") {
          this.modifForm.controls['prospc_ninea'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/)]));
          this.modifForm.controls['prospc_registrecommerce'].setValidators(Validators.compose([Validators.required, Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/)]));
          this.showObligatoireRCetNinea = false;
        }
        else {
          this.modifForm.controls['prospc_ninea'].clearValidators();
          this.modifForm.controls['prospc_registrecommerce'].clearValidators();
          this.modifForm.controls['prospc_ninea'].setValidators(Validators.pattern(/^[0-9]{7}[0-2]{1}[aA-zZ]{1}[0-9]{1}$/));;
          this.modifForm.controls['prospc_registrecommerce'].setValidators(Validators.pattern(/^[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}[0-9]+$/));
          this.showObligatoireRCetNinea = false;
        }
      }
    }

    this.modifForm.controls['prospc_categosocioprof'].updateValueAndValidity();
    this.modifForm.controls['prospc_cin'].updateValueAndValidity;
    this.modifForm.controls['prospc_passeport'].updateValueAndValidity();
    this.modifForm.controls['prospc_ninea'].updateValueAndValidity();
    this.modifForm.controls['prospc_registrecommerce'].updateValueAndValidity();
    this.modifForm.controls['prospc_classificationmetier'].updateValueAndValidity();
    this.modifForm.controls['prospc_email'].updateValueAndValidity();


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

  onGetValueofSociete(codesociete: any) {
    this.listTypeSociete = this.listTypeProspect['TYPE_SOCIETE'];
    return (this.listTypeSociete.find(p => p.id == codesociete))?.value;
  }

  onGetAllProspect() {
    this.prospectService.getAllProspect()
      .subscribe((data: Prospect[]) => {
        this.listeProspects = data as Prospect[];
      });
  }

  onGetAllCiviliteByNature(nature: number) {
    this.civiliteService.getAllCiviliteByNature(nature)
      .subscribe((data: Civilite[]) => {
        this.listeCodeCivilites = data as Civilite[];
      });
  }

  onGetAllCategorieSociopro() {
    this.categoriesocioproService.getAllCategorieSocioprofessionnelle()
      .subscribe((data: CategorieSocioprofessionnelle[]) => {
        this.listeCodeCategorieSociopro = data as CategorieSocioprofessionnelle[];
        this.filteredCategSociopro.next(this.listeCodeCategorieSociopro.slice());
      });
  }

  onGetLibelleByCivilite(numero: any) {
    return numero + " : " + (this.listeCodeCivilites?.find(c => c.civ_code == numero))?.civ_libellelong;
  }

  onGetLibelleByCategorieSociopro(numero: any) {
    return numero + " : " + (this.listeCodeCategorieSociopro?.find(c => c.categs_code == numero))?.categs_libcourt;
  }

  onGetLibelleByClassifMetier(numero: any) {
    if (numero != null && numero !== "") {
      return numero + " : " + (this.classifications?.find(c => c.code == numero))?.libelle;
    } else {
      return "";
    }
  }

  onChangePersonne(event) {
    this.modifForm.controls['prospc_nature'].setValue(event);
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;

    this.prospc_titreCivilite = "".toString();
    this.modifForm.controls['prospc_titre'].setValue(this.prospc_titreCivilite);

    this.onGetAllCiviliteByNature(Number(this.typePersonneChoisi));

    if (this.typePersonneChoisi === this.personnePhysique) {
      this.problemePersonnePhysique = true;
      this.problemePersonneMorale = false;
      this.problemeDenomination = false;
      this.problemeEmail = false;
      this.problemeTypeSociete = false;
      this.erreur = false;

    } else if (this.typePersonneChoisi === this.personneMorale) {
      this.problemePersonneMorale = true;
      this.problemePersonnePhysique = false;
      this.problemeNom = false;
      this.problemePrenom = false;
      this.erreur = false;
    }
  }

  onChangeTypeSociete(event) {
    this.modifForm.controls['prospc_typesociete'].setValue((this.listTypeSociete.find(p => p.id === event)).id);
    if (event != null) {
      this.problemeTypeSociete = false;
      this.erreur = false;
    }
  }

  onGetAllClassificationSecteurs() {
    this.classifService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data as ClassificationSecteur[];
        this.filteredClassif.next(this.classifications.slice());
      })
  }

  onChangeClassification(event) {
    this.modifForm.controls['prospc_classificationmetier'].setValue(event.value);
    if (event.value != null) {
      this.problemeClassificationSecteur = false;
      this.erreur = false;
    }
  }

  onChangeCategorieSociopro(event) {
    this.modifForm.controls['prospc_categosocioprof'].setValue(event.value);
  }

  onchangeTelephone1() {
    this.displayNumero1Error = true;
    if (this.modifForm.controls['prospc_telephone1'].valid == true) {
      this.errorNumero1 = true;
    } else {
      this.errorNumero1 = false;
    }
  }

  onchangeTelephone2() {
    this.displayNumero2Error = true;
    if (this.modifForm.controls['prospc_telephone2'].valid == true) {
      this.errorNumero2 = true;
    } else {
      this.errorNumero2 = false;
    }
  }

  onchangeNumeroPortable() {
    this.displayNumeroPortable = true;
    if (this.modifForm.controls['prospc_portable'].valid == true) {
      this.errorNumeroPortable = true;
    } else {
      this.errorNumeroPortable = false;
    }
  }

  onchangeMail() {
    this.displayMailError = true;
    if (this.modifForm.controls['prospc_email'].valid == true) {
      this.errorEmail = true;
    } else {
      this.errorEmail = false;
    }
  }

  onCancel() {
    this.router.navigateByUrl('home/gestion-prospect/prospect-attente');
  }

  onSubmit() {

    this.numeroProspect = this.modifForm.get("prospc_numero").value;
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.titre = this.modifForm.get("prospc_titre").value;
    this.nom = this.modifForm.get("prospc_nom").value;
    this.prenom = this.modifForm.get("prospc_prenom").value;
    this.adresseNumero = this.modifForm.get("prospc_adressenumero").value;
    this.adresseVille = this.modifForm.get("prospc_adresseville").value;
    this.telephone1 = this.modifForm.get("prospc_telephone1").value;
    this.denomination = this.modifForm.get("prospc_denomination").value;
    this.sigle = this.modifForm.get("prospc_sigle").value;
    this.email = this.modifForm.get("prospc_email").value;
    this.siteWeb = this.modifForm.get("prospc_website").value;
    this.codeNinea = this.modifForm.get("prospc_ninea").value;
    this.typeSociete = this.modifForm.get("prospc_typesociete").value;
    this.codeRC = this.modifForm.get("prospc_registrecommerce").value;
    this.cin = this.modifForm.get("prospc_cin").value;
    this.passeport = this.modifForm.get("prospc_passeport").value;
    this.categoriesociopro = this.modifForm.get("prospc_categosocioprof").value;
    this.activiteCommercante = this.modifForm.get("prospc_activitecommercante").value;
    this.classificationSecteur = this.modifForm.get("prospc_classificationmetier").value;
    this.dateEntreeRelation = this.modifForm.get("prospc_date_relation").value;
    this.dateCreation = this.modifForm.get("prospc_datenaissance").value;

    /*
    // On gère la partie NINEA qui est composé de 7 caractères numériques
    if (this.codeNinea != null && this.codeNinea != '') {
      this.firstSevenCaract = this.codeNinea.substr(0, 7);

      // Gèrer la partie COFI du code NINEA
      this.lastthreecaract = this.codeNinea.substr(this.codeNinea.length - 3);
      this.first = this.lastthreecaract.charAt(0);
      this.two = this.lastthreecaract.charAt(1);
      this.three = this.lastthreecaract.charAt(2);
    }
    */

    // Personne physique et civilité gérant:
    if (this.typeSociete === "SI") {
      this.idTypeSociete = 8;
      this.listTypeSociete = this.listTypeProspect['TYPE_SOCIETE'];
      this.civile = (this.listTypeSociete.find(p => p.id == this.idTypeSociete))?.id;
      this.modifForm.controls['prospc_typesociete'].setValue(this.civile);
    }

    // On controle la validation des champs avant d'enregistrer
    if (this.typePersonneChoisi === this.personnePhysique && this.nom === null) {
      this.problemeNom = true;
      this.erreur = true;

    } else if (this.typePersonneChoisi === this.personnePhysique && this.prenom === null) {
      this.problemePrenom = true;
      this.erreur = true;

    } else if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
      this.erreur = true

    } else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.problemeLongeurCIN = true;
      this.erreur = true;

    } else if (this.typePersonneChoisi === this.personneMorale && (this.denomination === null || this.denomination === "")) {
      this.problemeDenomination = true;
      this.erreur = true;

    } else if (this.nom != null && this.prenom != null && this.adresseVille != null && this.telephone1 != null
      && this.listeProspects.find(p => p.prospc_nom?.toLowerCase() === this.nom?.toLowerCase() && p.prospc_prenom?.toLowerCase() === this.prenom?.toLowerCase()
        && p.prospc_adresseville?.toLowerCase() === this.adresseVille?.toLowerCase() && p.prospc_telephone1 === this.telephone1 && p.prospc_numero != this.numeroProspect)) {

      this.problemeAdresseTel = true;
      this.erreur = true;
    }
    else if (this.dateEntreeRelation != null && this.dateEntreeRelation !== "" && this.dateCreation != null && this.dateCreation !== "" && (this.dateCreation > this.dateEntreeRelation)) {
      this.problemeDate = true;
      this.erreur = true;
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
    */
    else {

      this.modifForm.controls['prospc_telephone1'].setValue(this.modifForm.controls['prospc_telephone1'].value.internationalNumber);
      this.modifForm.controls['prospc_telephone2'].setValue(this.modifForm.controls['prospc_telephone2'].value?.internationalNumber);
      this.modifForm.controls['prospc_portable'].setValue(this.modifForm.controls['prospc_portable'].value?.internationalNumber);


      // Vérification du statut du prospect
      /*
      if (this.adresseNumero === null || this.adresseNumero === "") {
        this.prospect_statut = this.prospect_statut1;
        this.modifForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.email === null || this.email === "")) {
        this.prospect_statut = this.prospect_statut1;
        this.modifForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if ((this.typePersonneChoisi === this.personnePhysique) && ((this.categoriesociopro === null || this.categoriesociopro === ""))) {
        this.prospect_statut = this.prospect_statut1;
        this.modifForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
        this.prospect_statut = this.prospect_statut1;
        this.modifForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if ((this.typePersonneChoisi === this.personneMorale) && (this.classificationSecteur === null || this.classificationSecteur === "")) {
        this.prospect_statut = this.prospect_statut1;
        this.modifForm.controls['prospc_statut'].setValue(this.prospect_statut1);
      }
      else if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.codeRC === null || this.codeRC === ""))) {
        this.prospect_statut = this.prospect_statut2;
        this.modifForm.controls['prospc_statut'].setValue(this.prospect_statut2);
      } else {
        this.prospect_statut = this.prospect_statut3;
        this.modifForm.controls['prospc_statut'].setValue(this.prospect_statut3);
      }
      */

      this.prospect_statut = this.prospect_statut3;
      this.modifForm.controls['prospc_statut'].setValue(this.prospect_statut3);

      this.prospectService.updateProspect(this.modifForm.value)
        .subscribe((data) => {
          this.toastrService.show(
            // this.prospect_statut == this.prospect_statut1 ? "Le prospect est en attente d'informations manquantes" : this.prospect_statut == this.prospect_statut2 ? "le prospect est en attente de piece justificative" : "le prospect est validé avec succès !",
            "le prospect est validé avec succès !",
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
          /*
          if (this.prospect_statut == this.prospect_statut1 || this.prospect_statut == this.prospect_statut2) {
            this.router.navigateByUrl('/home/gestion-prospect/prospect-attente');
          }
          else {
            this.router.navigateByUrl('home/gestion-commerciale/gestion-portefeuille/prospects');
          }
          */

          this.router.navigateByUrl('home/gestion-commerciale/gestion-portefeuille/prospects');

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

  onFocusOutEventSecteurActivite() {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.classificationSecteur = this.modifForm.get("prospc_classificationmetier").value;
    if ((this.typePersonneChoisi === this.personneMorale) && (this.classificationSecteur === null || this.classificationSecteur === "")) {
      this.problemeClassificationSecteur = true;
    } else {
      this.problemeClassificationSecteur = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNom() {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.nom = this.modifForm.get("prospc_nom").value;
    this.prenom = this.modifForm.get("prospc_prenom").value;
    if (this.typePersonneChoisi === this.personnePhysique && (this.nom === null || this.nom == "")) {
      this.problemeNom = true;
      this.problemePersonnePhysique = false;
      this.erreur = true
    } else {
      this.problemeNom = false;
      this.problemePersonnePhysique = false;
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
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.prenom = this.modifForm.get("prospc_prenom").value;
    this.nom = this.modifForm.get("prospc_nom").value;

    if (this.typePersonneChoisi === this.personnePhysique && (this.prenom === null || this.prenom === "")) {
      this.problemePrenom = true;
      this.problemePersonnePhysique = false;
      this.erreur = true
    } else {
      this.problemePrenom = false;
      this.problemePersonnePhysique = false;
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

  onFocusOutEventDenomination() {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.denomination = this.modifForm.get("prospc_denomination").value;

    if (this.typePersonneChoisi === this.personneMorale && (this.denomination === null || this.denomination === "")) {
      this.problemeDenomination = true;
      // this.erreur = true
    } else {
      this.problemeDenomination = false;
      this.erreur = false;
    }
  }

  onFocusOutEventSigle() {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.sigle = this.modifForm.get("prospc_sigle").value;
  }

  onFocusOutEventAdresseNumero() {
    this.adresseNumero = this.modifForm.get("prospc_adressenumero").value;

    // controle de validation du champs ville
    if (this.adresseNumero === null || this.adresseNumero === "") {
      this.problemeAdresseNumero = true;
      this.erreur = true;
    } else {
      this.problemeAdresseNumero = false;
      this.erreur = false;
    }
  }

  onFocusOutEventAdresseVille() {

    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.telephone1 = this.modifForm.get("prospc_telephone1").value;
    this.adresseVille = this.modifForm.get("prospc_adresseville").value;
    this.nom = this.modifForm.get("prospc_nom").value;
    this.prenom = this.modifForm.get("prospc_prenom").value;

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

    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.telephone1 = this.modifForm.get("prospc_telephone1").value;
    this.adresseVille = this.modifForm.get("prospc_adresseville").value;
    this.nom = this.modifForm.get("prospc_nom").value;
    this.prenom = this.modifForm.get("prospc_prenom").value;

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
    this.numeroPortable = this.modifForm.get("prospc_portable").value;
    if (this.numeroPortable == "") {
      this.problemeNumeroPortable = true;
      this.erreur = true
    } else {
      this.problemeNumeroPortable = false;
      this.erreur = false;

    }
  }

  onFocusOutEventEmail() {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.email = this.modifForm.get("prospc_email").value;
    this.activiteCommercante = this.modifForm.get("prospc_activitecommercante").value;

    if ((this.typePersonneChoisi === this.personneMorale || (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.OUI)) && (this.email === null || this.email == "")) {
      this.problemeEmail = true;
    } else {
      this.problemeEmail = false;
      this.erreur = false;
    }
  }

  onFocusOutEventSiteWeb() {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.siteWeb = this.modifForm.get("prospc_website").value;
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

    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.codeNinea = this.modifForm.get("prospc_ninea").value;
    this.codeRC = this.modifForm.get("prospc_registrecommerce").value;
    this.activiteCommercante = this.modifForm.get("prospc_activitecommercante").value;

    if (this.activiteCommercante == this.OUI && ((this.codeNinea === null || this.codeNinea === "") || (this.codeRC === null || this.codeRC === ""))) {
      this.problemeCodeNineaEtRC = true;
    }
    else {
      this.problemeCodeNineaEtRC = false;
      this.erreur = false;
    }

    if (this.modifForm.get("prospc_ninea").invalid === true) {
      this.problemeFormatNinea = true;
    } else {
      this.problemeFormatNinea = false;
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
  }

  onFocusOutEventRC(event) {

    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.codeNinea = this.modifForm.get("prospc_ninea").value;
    this.codeRC = this.modifForm.get("prospc_registrecommerce").value;
    this.activiteCommercante = this.modifForm.get("prospc_activitecommercante").value;

    if (this.activiteCommercante == this.OUI && ((this.codeRC === null || this.codeRC === "") || (this.codeNinea === null || this.codeNinea === ""))) {
      this.problemeCodeNineaEtRC = true;
    }
    else {
      this.problemeCodeNineaEtRC = false;
      this.erreur = false;
    }

    if (this.modifForm.get("prospc_registrecommerce").invalid === true) {
      this.problemeFormatRC = true;
    } else {
      this.problemeFormatRC = false;
    }
  }

  onFocusOutEventTypeSociete() {
    this.typeSociete = this.modifForm.get("prospc_typesociete").value;
  }

  onFocusOutEventCIN() {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.cin = this.modifForm.get("prospc_cin").value;
    this.passeport = this.modifForm.get("prospc_passeport").value;
    this.activiteCommercante = this.modifForm.get("prospc_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
      this.modifForm.controls['prospc_cin'].setValidators(Validators.required);
      this.modifForm.controls['prospc_passeport'].setValidators(Validators.required);
    }
    else if (this.typePersonneChoisi === this.personnePhysique && (this.cin != null && this.cin !== "") && this.cin.length != this.longeurCIN) {
      this.problemeLongeurCIN = true;
      this.erreur = true;
    }
    else {
      this.problemeLongeurCIN = false;
      this.problemeCINouPasseport = false;
      this.erreur = false;

      this.modifForm.controls['prospc_cin'].clearValidators();
      this.modifForm.controls['prospc_passeport'].clearValidators();
    }

    this.modifForm.controls['prospc_cin'].updateValueAndValidity();
    this.modifForm.controls['prospc_passeport'].updateValueAndValidity();
  }

  onFocusOutEventPasseport() {

    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.cin = this.modifForm.get("prospc_cin").value;
    this.passeport = this.modifForm.get("prospc_passeport").value;
    this.activiteCommercante = this.modifForm.get("prospc_activitecommercante").value;

    if (this.typePersonneChoisi === this.personnePhysique && this.activiteCommercante === this.NON && (this.cin === null || this.cin === "") && (this.passeport === null || this.passeport === "")) {
      this.problemeCINouPasseport = true;
      this.modifForm.controls['prospc_cin'].setValidators(Validators.required);
      this.modifForm.controls['prospc_passeport'].setValidators(Validators.required);
    }
    else {
      this.problemeCINouPasseport = false;
      this.erreur = false;

      this.modifForm.controls['prospc_cin'].clearValidators();
      this.modifForm.controls['prospc_passeport'].clearValidators();
    }

    this.modifForm.controls['prospc_cin'].updateValueAndValidity();
    this.modifForm.controls['prospc_passeport'].updateValueAndValidity();
  }

  onFocusOutEventCategorieSociopro() {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    this.categoriesociopro = this.modifForm.get("prospc_categosocioprof").value;
    if (this.typePersonneChoisi === this.personnePhysique && (this.categoriesociopro === null || this.categoriesociopro === "")) {
      this.problemeCategorieSociopro = true;
      this.erreur = true
    } else {
      this.problemeCategorieSociopro = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDate() {
    // this.typePersonneChoisi = this.addForm.get("clien_nature").value;

    this.dateEntreeRelation = this.modifForm.get("prospc_date_relation").value;
    this.dateCreation = this.modifForm.get("prospc_datenaissance").value;

    if (this.dateEntreeRelation != null && this.dateEntreeRelation !== "" && this.dateCreation != null && this.dateCreation !== "" && (this.dateCreation > this.dateEntreeRelation)) {
      this.problemeDate = true;
      this.erreur = true;
    }
    else {
      this.problemeDate = false;
      this.erreur = false;
    }


    // console.log(this.addForm.get("prospc_date_relation").value);
    // console.log(this.addForm.get("prospc_datenaissance").value)
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


  onFocusOutEventChiffreAffaireActivite(event) {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    // this.chiffreAffaireActivite = this.modifForm.get("prospc_chiffreaffaireannuel").value;
    this.chiffreAffaireActivite = this.formatNumberService.replaceAll(event.target.value, ' ', '');

    if (this.chiffreAffaireActivite == null || this.chiffreAffaireActivite === "") {
      this.modifForm.controls['prospc_chiffreaffaireannuel'].setValue(0);
      this.chiffreAffaireActivite = 0;
    }
    else {
      this.chiffreAffaireActivite = Number(this.formatNumberService.replaceAll(this.chiffreAffaireActivite, ' ', ''));
      this.modifForm.get("prospc_chiffreaffaireannuel").setValue(this.chiffreAffaireActivite);
      this.chiffreAffaireActivite = this.formatNumberService.numberWithCommas2(this.chiffreAffaireActivite);
    }
  }

  onFocusOutEventCapitalSocial(event) {
    this.typePersonneChoisi = this.modifForm.get("prospc_nature").value;
    // this.capitalSocial = this.modifForm.get("prospc_capitalsocial").value;
    this.capitalSocial = this.formatNumberService.replaceAll(event.target.value, ' ', '');

    if (this.capitalSocial === null || this.capitalSocial === "") {
      this.modifForm.controls['prospc_capitalsocial'].setValue(0);
      this.capitalSocial = 0;
    }
    else {
      this.capitalSocial = Number(this.formatNumberService.replaceAll(this.capitalSocial, ' ', ''));
      this.modifForm.get("prospc_capitalsocial").setValue(this.capitalSocial);
      this.capitalSocial = this.formatNumberService.numberWithCommas2(this.capitalSocial);
    }

  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')

    // return new Date().toISOString().split('T')[0]
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

  getColorTypeSociete() {
    /*
    if (this.problemeTypeSociete) {
      return '1px solid red';
    } else {
      return '';
    }
    */
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

  getColorCIN() {
    if (this.problemeCINouPasseport || this.problemeLongeurCIN) {
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

  getColorCategorieSociopro() {
    if (this.problemeCategorieSociopro) {
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

  getColorChiffreAffaireActivite() {
    /*
    if (this.problemeChiffreAffaireActivite) {
      return '1px solid red';
    } else {
      return '';
    }
    */
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

}
