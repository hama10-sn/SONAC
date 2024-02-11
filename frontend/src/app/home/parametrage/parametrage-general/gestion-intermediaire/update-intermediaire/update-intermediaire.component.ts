import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Commission } from '../../../../../model/Commission';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { User } from '../../../../../model/User';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { CommissionService } from '../../../../../services/commission.service';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import dateFormatter from 'date-format-conversion';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { FormatNumberService } from '../../../../../services/formatNumber.service';


@Component({
  selector: 'ngx-update-intermediaire',
  templateUrl: './update-intermediaire.component.html',
  styleUrls: ['./update-intermediaire.component.scss']
})
export class UpdateIntermediaireComponent implements OnInit, OnDestroy {

  modifForm = this.fb.group({

    inter_numero: ['', [Validators.required]],
    inter_type: ['', [Validators.required]],
    inter_denomination: ['', [Validators.required]],
    inter_denominationcourt: ['', [Validators.required]],
    inter_boitepostale: [''],
    inter_rue: ['', [Validators.required]],
    inter_quartierville: [''],
    inter_telephone1: ['', [Validators.required]],
    inter_telephone2: [''],
    inter_portable: ['', [Validators.required]],
    inter_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    inter_classificationmetier: ['', [Validators.required]],
    inter_codecommission: [''],
    inter_objectifcaannuel: ['', [Validators.required]],
    inter_caportefeuille: ['', [Validators.required]],
    inter_sinistralite: [''],
    inter_arriere: [''],
    inter_dureemoyenne: [''],
    inter_montantcommission: ['', [Validators.required]],
    // inter_numagrement: ['', [Validators.required]],
    inter_numagrement: [''],
    inter_datentrerelation: ['', [Validators.required]],
    inter_anneeexercice: ['', [Validators.required]],
    inter_autorisation: ['', [Validators.required]],
    inter_datedebutcarteagrement: ['', [Validators.required]]
  });

  // ================ Déclarations des variables pour la recherche avec filtre ======================
  classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  codeClassification: String;

  /** control for the selected classification */
  public classifCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public classifFilterCtrl: FormControl = new FormControl();

  /** list of classifications filtered by search keyword */
  public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();
  //filteredBanks: BehaviorSubject<Bank[]> = new BehaviorSubject<Bank[]>(BANKS);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  // ========================================== FIN Déclaration ======================================

  intermediaire: Intermediaire;
  type_intermediaire: string;

  // Pour gérer la liste déroulante pour les clés étrangères
  listeCodeCommission: any[];
  codeCommission: String;

  //classifications: ClassificationSecteur[];
  // codeClassification: String;

  // controle du numéro de téléphone et de l'e-mail
  displayNumero1Error: boolean = false;
  errorNumero1: boolean;
  displayNumero2Error: boolean = false;
  errorNumero2: boolean;
  displayNumeroPortable: boolean = false;
  errorNumeroPortable: boolean;
  displayMailError: boolean = false;
  errorEmail: boolean;

  autorisation = [];

  // variable pour le controle de validation
  problemeNumeroIntermediaire: boolean = false;
  problemeDenomination: boolean = false;
  problemeDenominationCourt: boolean = false;
  problemeNumAgrement: boolean = false;
  problemeRue: boolean = false;
  problemeTelephone1: boolean = false;
  problemeNumeroMobile: boolean = false;
  problemeEmail: boolean = false;
  problemeObjectifCA: boolean = false;
  problemeCAPorteFeuille: boolean = false;
  problemeMontantCommAnnuel: boolean = false;

  erreur: boolean = false;

  numeroIntermediaire: number;
  denomination: string;
  denominationCourt: string;
  rue: string;
  telephone1: any;
  numeroMobile: any;
  email: string;
  objectifCA: any;
  caPorteFeuille: any;
  montantCommAnnuel: any;
  montantSinistre: any;
  montantArriere: any;
  numAgrement: any;
  dateEntrerRelation: Date;
  datedebutcarteagrement: Date;
  anneeexercice1: string;


  //Gestion des numéros de téléphones avec l'API:
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private commissionService: CommissionService,
    private interService: IntermediaireService,
    private classifService: ClassificationSecteurService,
    private toastrService: NbToastrService,
    private router: Router,
    private authService: NbAuthService,
    private transfertData: TransfertDataService,
    private formatNumberService: FormatNumberService) { }


  ngOnInit(): void {

    this.intermediaire = this.transfertData.getData();
    this.onGetAllCommissions();
    this.onGetAllClassificationSecteurs();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });
    this.remplirAnneeExecice();

    this.modifForm.controls['inter_numero'].setValue(this.intermediaire.inter_numero);
    this.modifForm.controls['inter_type'].setValue(this.intermediaire.inter_type);
    this.type_intermediaire = this.intermediaire.inter_type.toString();
    this.datedebutcarteagrement = dateFormatter(this.intermediaire.inter_datedebutcarteagrement, 'yyyy-MM-ddThh:mm');
    console.log(this.datedebutcarteagrement);
    this.modifForm.controls['inter_datedebutcarteagrement'].setValue(this.datedebutcarteagrement);
    this.modifForm.controls['inter_autorisation'].setValue(this.intermediaire.inter_autorisation);

    this.modifForm.controls['inter_anneeexercice'].setValue(this.intermediaire?.inter_anneeexercice.toString());
    
    this.anneeexercice1 = this.intermediaire?.inter_anneeexercice.toString();
    

    console.log(this.intermediaire.inter_anneeexercice);


    this.modifForm.controls['inter_denomination'].setValue(this.intermediaire.inter_denomination);
    this.modifForm.controls['inter_denominationcourt'].setValue(this.intermediaire.inter_denominationcourt);
    this.modifForm.controls['inter_boitepostale'].setValue(this.intermediaire.inter_boitepostale);
    this.modifForm.controls['inter_rue'].setValue(this.intermediaire.inter_rue);
    this.modifForm.controls['inter_quartierville'].setValue(this.intermediaire.inter_quartierville);
    this.modifForm.controls['inter_telephone1'].setValue(this.intermediaire.inter_telephone1);
    this.modifForm.controls['inter_telephone2'].setValue(this.intermediaire.inter_telephone2);
    this.modifForm.controls['inter_portable'].setValue(this.intermediaire.inter_portable);
    this.modifForm.controls['inter_email'].setValue(this.intermediaire.inter_email);

    this.modifForm.controls['inter_classificationmetier'].setValue(this.intermediaire.inter_classificationmetier);
    this.codeClassification = this.intermediaire.inter_classificationmetier.toString();
    this.classifCtrl.setValue(this.intermediaire.inter_classificationmetier);

    this.modifForm.controls['inter_codecommission'].setValue(this.intermediaire.inter_codecommission);
    if (this.intermediaire.inter_codecommission != null) {
      this.codeCommission = this.intermediaire.inter_codecommission.toString();
    }

    this.objectifCA = this.formatNumberService.numberWithCommas2(Number(this.intermediaire.inter_objectifcaannuel));
    this.modifForm.controls['inter_objectifcaannuel'].setValue(this.intermediaire.inter_objectifcaannuel);

    this.caPorteFeuille = this.formatNumberService.numberWithCommas2(Number(this.intermediaire.inter_caportefeuille));
    this.modifForm.controls['inter_caportefeuille'].setValue(this.intermediaire.inter_caportefeuille);

    this.montantSinistre = this.formatNumberService.numberWithCommas2(Number(this.intermediaire.inter_sinistralite));
    this.modifForm.controls['inter_sinistralite'].setValue(this.intermediaire.inter_sinistralite);

    this.montantArriere = this.formatNumberService.numberWithCommas2(Number(this.intermediaire.inter_arriere));
    this.modifForm.controls['inter_arriere'].setValue(this.intermediaire.inter_arriere);

    this.modifForm.controls['inter_dureemoyenne'].setValue(this.intermediaire.inter_dureemoyenne);

    this.montantCommAnnuel = this.formatNumberService.numberWithCommas2(Number(this.intermediaire.inter_montantcommission));
    this.modifForm.controls['inter_montantcommission'].setValue(this.intermediaire.inter_montantcommission);

    this.modifForm.controls['inter_numagrement'].setValue(this.intermediaire.inter_numagrement);

    this.dateEntrerRelation = dateFormatter(this.intermediaire.inter_datentrerelation, 'yyyy-MM-ddThh:mm');
    this.modifForm.controls['inter_datentrerelation'].setValue(this.dateEntrerRelation);

    // =================== Listen for search field value changes =======================
    this.classifFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanks();
      });
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanks() {
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

  onCancel() {
    this.router.navigateByUrl('home/parametrage-general/intermediaires');
  }

  onSubmit() {
    this.modifForm.controls['inter_telephone1'].setValue(this.modifForm.controls['inter_telephone1'].value.internationalNumber);
    this.modifForm.controls['inter_telephone2'].setValue(this.modifForm.controls['inter_telephone2'].value?.internationalNumber);
    this.modifForm.controls['inter_portable'].setValue(this.modifForm.controls['inter_portable'].value?.internationalNumber);

    this.interService.updateIntermediaire(this.modifForm.value)
      .subscribe((data) => {
        this.toastrService.show(
          'Intermédiaire modifié avec succès !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
        this.router.navigateByUrl('home/parametrage-general/intermediaires');
      },
        (error) => {
          this.toastrService.show(
            //"Echec de la modification de l'intermédiaire",
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

  onGetAllCommissions() {
    this.commissionService.getAllCommissions()
      .subscribe((data: Commission[]) => {
        this.listeCodeCommission = data as Commission[];
      });
  }

  // onGetAllClassificationSecteurs() {
  //   this.classifService.getAllClassificationSecteur()
  //     .subscribe((data: ClassificationSecteur[]) => {
  //       this.classifications = data as ClassificationSecteur[];
  //     })
  // }

  onGetAllClassificationSecteurs() {
    this.classifService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data;
        this.filteredClassif.next(this.classifications.slice());
      });
  }
  showObligatoireNumAgrement: boolean = false;
  onChangeTypeIntermediaire(event) {
    this.modifForm.controls['inter_type'].setValue(event);
    this.type_intermediaire = this.modifForm.get("inter_type").value;
    this.numAgrement = this.modifForm.get("inter_numagrement").value;
    this.problemeNumeroAgrementExisteDeja = false;
    console.log(event);
    if (event == "agent general") {
      // console.log(event) ;
      this.modifForm.controls['inter_numagrement'].clearValidators();
      this.showObligatoireNumAgrement = false;
      this.problemeNumAgrement = false;
      this.erreur = false;
      this.problemeNumeroAgrementExisteDeja = false;
      console.log(event);
    }
    if (event == this.apporteur_affaire) {
      // console.log(event) ;
      this.modifForm.controls['inter_numagrement'].clearValidators();
      this.showObligatoireNumAgrement = false;
      this.problemeNumAgrement = false;
      this.erreur = false;
      this.problemeNumeroAgrementExisteDeja = false;
    }
    else {
      this.showObligatoireNumAgrement = true;
      this.modifForm.controls['inter_numagrement'].setValidators(Validators.required);
      this.problemeNumeroAgrementExisteDeja = false;
      if (this.type_intermediaire === this.courtier) {
        this.problemeNumeroAgrementExisteDeja = false;
        this.interService.getAllIntermediaires()
          .subscribe((data: Intermediaire[]) => {
            this.intermediaires = data;
            this.listeIntermediaires = data as Intermediaire[];
            //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
            if (this.listeIntermediaires.find(p => p.inter_numagrement?.toLowerCase() === this.numAgrement?.toLowerCase())?.inter_numagrement != null) {
              if (this.numAgrement === '') {
                this.problemeNumeroAgrementExisteDeja = false;
              } else {
                this.problemeNumeroAgrementExisteDeja = true;
              }
              this.erreur = true

            }

            else {
              this.problemeNumeroAgrementExisteDeja = false;
              this.erreur = false;

            }
          });
      }

    }

    // console.log("sortie")
    this.modifForm.controls['inter_numagrement'].updateValueAndValidity();

  }

  /*onChangeTypeIntermediaire(event) {
    this.modifForm.controls['inter_type'].setValue(event);
  }

  onChangeCommission(event) {
    this.modifForm.controls['inter_codecommission'].setValue(event);
  }

  // onChangeClassification(event) {
  //   this.modifForm.controls['inter_classificationmetier'].setValue(event);
  // }

  onChangeClassification(event) {
    this.modifForm.controls['inter_classificationmetier'].setValue(event.value);
  }*/
  problemeTelephone1ExisteDeja: boolean = false;

  onchangeTelephone1() {
    this.displayNumero1Error = true;
    if (this.modifForm.controls['inter_telephone1'].valid == true) {
      this.errorNumero1 = true;
      this.telephone1 = this.modifForm.get("inter_telephone1").value;
      this.numeroIntermediaire = this.modifForm.get("inter_numero").value;
      //console.log(this.telephone1.internationalNumber)
      this.interService.getAllIntermediaires()
        .subscribe((data: Intermediaire[]) => {
          this.intermediaires = data;
          this.listeIntermediaires = data as Intermediaire[];
          //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
          if (this.listeIntermediaires.find(p => p.inter_telephone1 === this.telephone1.internationalNumber && p.inter_numero != this.numeroIntermediaire)?.inter_telephone1 != null) {
            this.problemeTelephone1ExisteDeja = true;
            console.log(this.telephone1);
            this.erreur = true
          }

          else {
            this.problemeTelephone1ExisteDeja = false;
            this.erreur = false;

          }
        });
    } else {
      this.errorNumero1 = false;
    }
  }


  /*onchangeTelephone2() {
    this.displayNumero2Error = true;
    if (this.modifForm.controls['inter_telephone2'].valid == true) {
      this.errorNumero2 = true;
    } else {
      this.errorNumero2 = false;
    }
  }

  onchangeNumeroPortable() {
    this.displayNumeroPortable = true;
    if (this.modifForm.controls['inter_portable'].valid == true) {
      this.errorNumeroPortable = true;
    } else {
      this.errorNumeroPortable = false;
    }
  }*/

  onchangeMail() {
    this.displayMailError = true;
    if (this.modifForm.controls['inter_email'].valid == true) {
      this.errorEmail = true;
    } else {
      this.errorEmail = false;
    }
  }

  /*// controle de validation
  onFocusOutEventNumIntermediaire() {
    this.numeroIntermediaire = this.modifForm.get("inter_numero").value;
    if (this.numeroIntermediaire == null || this.numeroIntermediaire == 0) {
      this.problemeNumeroIntermediaire = true;
      this.erreur = true;
    } else {
      this.problemeNumeroIntermediaire = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDenomination() {
    this.denomination = this.modifForm.get("inter_denomination").value;
    if (this.denomination == null || this.denomination == "") {
      this.problemeDenomination = true;
      this.erreur = true;
    } else {
      this.problemeDenomination = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDenominationCourt() {
    this.denominationCourt = this.modifForm.get("inter_denominationcourt").value;
    if (this.denominationCourt == null || this.denominationCourt == "") {
      this.problemeDenominationCourt = true;
      this.erreur = true;
    } else {
      this.problemeDenominationCourt = false;
      this.erreur = false;
    }
  }
  /*onFocusOutEventAgrement() {
    this.numAgrement = this.modifForm.get("inter_numagrement").value;
    if (this.numAgrement == null || this.numAgrement == 0) {
      this.problemeNumAgrement = true;
      this.erreur = true;
    } else {
      this.problemeNumAgrement = false;
      this.erreur = false;
    }
  }*/

  problemeNumeroAgrementExisteDeja = false
  apporteur_affaire = "apporteur d'affaire";
  courtier = "courtier"
  listeIntermediaires: any[];
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();


  onFocusOutEventAgrement() {
    this.numAgrement = this.modifForm.get("inter_numagrement").value;
    this.type_intermediaire = this.modifForm.get("inter_type").value;
    // console.log("type inter: "+ this.type_intermediaire) ;
    // console.log("num Agre: "+ this.numAgrement);
    this.problemeNumeroAgrementExisteDeja = false;

    if (this.type_intermediaire !== '' && this.type_intermediaire !== this.apporteur_affaire) {

      if (this.numAgrement == '' || this.numAgrement == 0) {
        this.problemeNumAgrement = true;
        this.erreur = true;
      } else {
        this.problemeNumAgrement = false;
        this.erreur = false;

        this.problemeNumeroAgrementExisteDeja = false;

        if (this.type_intermediaire === this.courtier) {
          this.numAgrement = this.modifForm.get("inter_numagrement").value;
          this.interService.getAllIntermediaires()
            .subscribe((data: Intermediaire[]) => {
              this.intermediaires = data;
              this.listeIntermediaires = data as Intermediaire[];
              //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
              if (this.listeIntermediaires.find(p => p.inter_numagrement?.toLowerCase() === this.numAgrement?.toLowerCase())?.inter_numagrement != null) {
                this.problemeNumeroAgrementExisteDeja = true;
                this.erreur = true
              }

              else {
                this.problemeNumeroAgrementExisteDeja = false;
                this.erreur = false;

              }
            });
        }

      }
    } else {
      this.problemeNumAgrement = false;
      this.erreur = false;
    }

  }

  onFocusOutEventRue() {
    this.rue = this.modifForm.get("inter_rue").value;
    if (this.rue == null || this.rue == "") {
      this.problemeRue = true;
      this.erreur = true;
    } else {
      this.problemeRue = false;
      this.erreur = false;
    }
  }

  onFocusOutEventTelephone1() {
    this.telephone1 = this.modifForm.get("inter_telephone1").value;
    if (this.telephone1 == "") {
      this.problemeTelephone1 = true;
      this.erreur = true
    } else {
      this.problemeTelephone1 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumeroMobile() {
    this.numeroMobile = this.modifForm.get("inter_portable").value;
    if (this.numeroMobile == "") {
      this.problemeNumeroMobile = true;
      this.erreur = true
    } else {
      this.problemeNumeroMobile = false;
      this.erreur = false;
    }
  }
  problemeEmailExisteDeja: boolean = false;
  onFocusOutEventEmail() {
    this.email = this.modifForm.get("inter_email").value;
    this.numeroIntermediaire = this.modifForm.get("inter_numero").value;
    if (this.email == null || this.email == "") {
      this.problemeEmail = true;
      this.erreur = true
    } else {
      this.problemeEmail = false;
      this.erreur = false;
      this.interService.getAllIntermediaires()
        .subscribe((data: Intermediaire[]) => {
          this.intermediaires = data;
          this.listeIntermediaires = data as Intermediaire[];
          //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
          if (this.listeIntermediaires.find(p => p.inter_email?.toLowerCase() === this.email?.toLowerCase() && p.inter_numero != this.numeroIntermediaire)?.inter_email != null) {
            this.problemeEmailExisteDeja = true;
            this.erreur = true
          }

          else {
            this.problemeEmailExisteDeja = false;
            this.erreur = false;

          }
        });

    }
  }

  /*
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
  */


  onFocusOutEventObjectifCA(event) {
    // this.objectifCA = this.modifForm.get("inter_objectifcaannuel").value;
    this.objectifCA = this.formatNumberService.replaceAll(event.target.value, ' ', '');

    if (this.objectifCA === null || this.objectifCA === '') {
      this.modifForm.controls['inter_objectifcaannuel'].setValue(0);
      this.objectifCA = 0;
      // this.problemeObjectifCA = true;
      // this.erreur = true;
    } else {
      this.objectifCA = Number(this.formatNumberService.replaceAll(this.objectifCA, ' ', ''));
      this.modifForm.get("inter_objectifcaannuel").setValue(this.objectifCA);
      this.objectifCA = this.formatNumberService.numberWithCommas2(this.objectifCA);
      // this.problemeObjectifCA = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventCAPorteFeuille(event) {
    // this.caPorteFeuille = this.modifForm.get("inter_caportefeuille").value;
    this.caPorteFeuille = this.formatNumberService.replaceAll(event.target.value, ' ', '');

    if (this.caPorteFeuille === null || this.caPorteFeuille === '') {
      this.modifForm.controls['inter_caportefeuille'].setValue(0);
      this.caPorteFeuille = 0;
      // this.problemeCAPorteFeuille = true;
      // this.erreur = true;
    } else {
      this.caPorteFeuille = Number(this.formatNumberService.replaceAll(this.caPorteFeuille, ' ', ''));
      this.modifForm.get("inter_caportefeuille").setValue(this.caPorteFeuille);
      this.caPorteFeuille = this.formatNumberService.numberWithCommas2(this.caPorteFeuille);
      // this.problemeCAPorteFeuille = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventMontantCommission(event) {
    // this.montantCommAnnuel = this.modifForm.get("inter_montantcommission").value;
    this.montantCommAnnuel = this.formatNumberService.replaceAll(event.target.value, ' ', '');

    if (this.montantCommAnnuel === null || this.montantCommAnnuel === '') {
      this.modifForm.controls['inter_montantcommission'].setValue(0);
      this.montantCommAnnuel = 0;
      // this.problemeMontantCommAnnuel = true;
      // this.erreur = true;
    } else {
      this.montantCommAnnuel = Number(this.formatNumberService.replaceAll(this.montantCommAnnuel, ' ', ''));
      this.modifForm.get("inter_montantcommission").setValue(this.montantCommAnnuel);
      this.montantCommAnnuel = this.formatNumberService.numberWithCommas2(this.montantCommAnnuel);
      // this.problemeMontantCommAnnuel = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventMontantSinistre(event) {
    this.montantSinistre = this.formatNumberService.replaceAll(event.target.value, ' ', '');

    if (this.montantSinistre === null || this.montantSinistre === '') {
      this.modifForm.controls['inter_sinistralite'].setValue(0);
      this.montantSinistre = 0;

    } else {
      this.montantSinistre = Number(this.formatNumberService.replaceAll(this.montantSinistre, ' ', ''));
      this.modifForm.get("inter_sinistralite").setValue(this.montantSinistre);
      this.montantSinistre = this.formatNumberService.numberWithCommas2(this.montantSinistre);
    }
  }

  onFocusOutEventMontantArriere(event) {
    this.montantArriere = this.formatNumberService.replaceAll(event.target.value, ' ', '');

    if (this.montantArriere === null || this.montantArriere === '') {
      this.modifForm.controls['inter_arriere'].setValue(0);
      this.montantArriere = 0;

    } else {
      this.montantArriere = Number(this.formatNumberService.replaceAll(this.montantArriere, ' ', ''));
      this.modifForm.get("inter_arriere").setValue(this.montantArriere);
      this.montantArriere = this.formatNumberService.numberWithCommas2(this.montantArriere);
    }
  }

  getColorNumeroIntermediaire() {
    if (this.problemeNumeroIntermediaire) {
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

  getColorAgrement() {
    if (this.problemeNumAgrement) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorDenominationCourt() {
    if (this.problemeDenominationCourt) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorRue() {
    if (this.problemeRue) {
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

  getColorNumeroMobile() {
    if (this.problemeNumeroMobile) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorEmail() {
    if (this.problemeEmail) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorObjectifCA() {
    if (this.problemeObjectifCA) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCAPorteFeuille() {
    if (this.problemeCAPorteFeuille) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorMontantCommAnnuel() {
    if (this.problemeMontantCommAnnuel) {
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

  anneeExercice: any[] = [];
  remplirAnneeExecice() {
    let annne = 2000;
    for (let i = 0; i < 100; i++) {
      this.anneeExercice[i] = annne,
        annne++;
    }
  }

  problemeDateDebutCarteAgrement: boolean = true;
  onFocusOutEventDDCA(event) {
    this.datedebutcarteagrement = this.modifForm.get("inter_datedebutcarteagrement").value;
    if (event == null || event == "") {
      this.problemeDateDebutCarteAgrement = true;
      this.erreur = true;

    } else {
      this.problemeDateDebutCarteAgrement = false;
      this.erreur = false;
    }
  }
}
