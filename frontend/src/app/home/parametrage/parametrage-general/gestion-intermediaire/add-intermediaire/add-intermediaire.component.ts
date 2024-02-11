// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// Import pour la gestion de la recherche avec filtre
import { AfterViewInit, Component, IterableDiffers, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
// ==========================================================

import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Commission } from '../../../../../model/Commission';
import { User } from '../../../../../model/User';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { CommissionService } from '../../../../../services/commission.service';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { UserService } from '../../../../../services/user.service';
import dateFormatter from 'date-format-conversion';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import * as internal from 'assert';
import { FormatNumberService } from '../../../../../services/formatNumber.service';

@Component({
  selector: 'ngx-add-intermediaire',
  templateUrl: './add-intermediaire.component.html',
  styleUrls: ['./add-intermediaire.component.scss']
})
export class AddIntermediaireComponent implements OnInit, OnDestroy {

  addForm = this.fb.group({

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
    inter_codeutilisateur: [''],
    inter_numagrement: ['', [Validators.required]],
    inter_datentrerelation: ['', [Validators.required]],
    inter_anneeexercice: ['',[Validators.required]],
    inter_autorisation: ['',[Validators.required]],
    inter_datedebutcarteagrement :['',[Validators.required]]
  });

  // ================ Déclarations des variables pour la recherche avec filtre ======================
  classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

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

  login: any;
  user: User;

  // Pour gérer la liste déroulante pour les clés étrangères
  listeCodeCommission: any[];

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
  problemeNumAgrement: boolean = false;
  problemeDenomination: boolean = false;
  problemeDenominationCourt: boolean = false;
  problemeRue: boolean = false;
  problemeTelephone1: boolean = false;
  problemeNumeroMobile: boolean = false;
  problemeEmail: boolean = false;
  problemeObjectifCA: boolean = false;
  problemeCAPorteFeuille: boolean = false;
  problemeMontantCommAnnuel: boolean = false;

  problemeEmailExisteDeja:boolean=false;
  problemeTelephone1ExisteDeja:boolean=false;

  problemeDateDebutCarteAgrement: boolean=false;

  problemeAutaurisation:boolean=false;

  problemeNumeroAgrementExisteDeja:boolean=false;

  
  listeIntermediaires : any[];
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();

  showObligatoireNumAgrement: boolean = false;
  courtier = "courtier"
  agent_general = "agent general"
  apporteur_affaire = "apporteur d'affaire";

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
  monantSinistre: any;
  monantArrieres: any;
  numAgrement: any;
  date_entreRelation: Date;
  type_intermediaire: string;

  datedebutcarteagrement:Date;

  autorisationcourtier

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
    private userService: UserService,
    private formatNumberService: FormatNumberService,
    private toastrService: NbToastrService,
    private router: Router,
    private authService: NbAuthService,) { }
    
  ngOnInit(): void {
    
    this.remplirAnneeExecice();
    this.onGetAllCommissions();
    this.getlogin();
    this.onGetAllClassificationSecteurs();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });

    this.addForm.controls['inter_objectifcaannuel'].setValue(0);
    this.addForm.controls['inter_caportefeuille'].setValue(0);
    this.addForm.controls['inter_montantcommission'].setValue(0);
    this.addForm.controls['inter_montantcommission'].setValue(0);
    this.addForm.controls['inter_anneeexercice'].setValue("2022");

    // this.addForm.controls['inter_montantcommission'].setValue(0);
    // this.addForm.controls['inter_numagrement'].setValue(0);

    this.date_entreRelation = dateFormatter(new Date(), 'yyyy-MM-ddTHH:mm');
    this.addForm.controls['inter_datentrerelation'].setValue(this.date_entreRelation);

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
      this.classifications.filter(classif =>
        classif.libelle.toLowerCase().indexOf(search) > -1 ||
        classif.code.toString().toLowerCase().indexOf(search) > -1)
    );
  }

  // ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================

  onCancel() {
    this.router.navigateByUrl('home/parametrage-general/intermediaires');
  }

  onSubmit() {

    this.numeroIntermediaire = this.addForm.get("inter_numero").value;
    this.addForm.controls['inter_telephone1'].setValue(this.addForm.controls['inter_telephone1'].value.internationalNumber);
    this.addForm.controls['inter_telephone2'].setValue(this.addForm.controls['inter_telephone2'].value?.internationalNumber);
    this.addForm.controls['inter_portable'].setValue(this.addForm.controls['inter_portable'].value?.internationalNumber);

    this.numAgrement = this.addForm.get("inter_numagrement").value;
    this.type_intermediaire = this.addForm.get("inter_type").value;



    if (this.numeroIntermediaire == null || this.numeroIntermediaire == 0) {
      this.problemeNumeroIntermediaire = true;
      this.erreur = true;
    }
    else if (this.type_intermediaire !== '' && this.type_intermediaire !== this.apporteur_affaire && (this.numAgrement == '' || this.numAgrement == 0)) {
      this.problemeNumAgrement = true;
      this.erreur = true;
    }
    else {
      this.addForm.controls['inter_codeutilisateur'].setValue(this.user.util_numero);
      this.interService.addIntermediaire(this.addForm.value)
        .subscribe((data) => {
          this.toastrService.show(
            'Intermédiaire enregistré avec succès !',
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

  onGetAllCommissions() {
    this.commissionService.getAllCommissions()
      .subscribe((data: Commission[]) => {
        this.listeCodeCommission = data as Commission[];
      });
  }

  onGetAllClassificationSecteurs() {
    this.classifService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data;
        this.filteredClassif.next(this.classifications.slice());
      });
  }

  onChangeTypeIntermediaire(event) {
    this.addForm.controls['inter_type'].setValue(event);
    this.type_intermediaire = this.addForm.get("inter_type").value;
    this.numAgrement = this.addForm.get("inter_numagrement").value;
    console.log(event) ;
    if (event == this.apporteur_affaire) {
      // console.log(event) ;
      this.addForm.controls['inter_numagrement'].clearValidators();
      this.showObligatoireNumAgrement = false;
      this.problemeNumAgrement = false;
      this.erreur = false;
      this.problemeNumeroAgrementExisteDeja = false;
    }
     else {
      this.showObligatoireNumAgrement = true;
      this.addForm.controls['inter_numagrement'].setValidators(Validators.required);
      this.problemeNumeroAgrementExisteDeja = false;
      if(this.type_intermediaire===this.courtier){
        this.problemeNumeroAgrementExisteDeja = false;
        this.interService.getAllIntermediaires()
        .subscribe((data: Intermediaire[]) => {
        this.intermediaires = data;
        this.listeIntermediaires = data as Intermediaire[];
        //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
        if (this.listeIntermediaires.find(p => p.inter_numagrement?.toLowerCase()=== this.numAgrement?.toLowerCase()) ?.inter_numagrement != null) {
          if(this.numAgrement===''){
            this.problemeNumeroAgrementExisteDeja= false;
          }else {
            this.problemeNumeroAgrementExisteDeja= true;
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
    this.addForm.controls['inter_numagrement'].updateValueAndValidity();

  }

  onChangeCommission(event) {
    this.addForm.controls['inter_codecommission'].setValue(event);
  }

  onChangeClassification(event) {
    this.addForm.controls['inter_classificationmetier'].setValue(event.value);
  }

  onchangeTelephone1() {
    this.displayNumero1Error = true;
    if (this.addForm.controls['inter_telephone1'].valid == true) {
      this.errorNumero1 = true;
      this.telephone1 = this.addForm.get("inter_telephone1").value;
      //console.log(this.telephone1.internationalNumber)
      this.interService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.intermediaires = data;
        this.listeIntermediaires = data as Intermediaire[];
        //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
        if (this.listeIntermediaires.find(p => p.inter_telephone1=== this.telephone1.internationalNumber)?.inter_telephone1 != null) {
          this.problemeTelephone1ExisteDeja= true;
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

  onchangeTelephone2() {
    this.displayNumero2Error = true;
    if (this.addForm.controls['inter_telephone2'].valid == true) {
      this.errorNumero2 = true;
    } else {
      this.errorNumero2 = false;
    }
  }

  onchangeNumeroPortable() {
    this.displayNumeroPortable = true;
    if (this.addForm.controls['inter_portable'].valid == true) {
      this.errorNumeroPortable = true;
    } else {
      this.errorNumeroPortable = false;
    }
  }

  onchangeMail() {
    this.displayMailError = true;
    if (this.addForm.controls['inter_email'].valid == true) {
      this.errorEmail = true;
    } else {
      this.errorEmail = false;
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

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  // controle de validation
  onFocusOutEventNumIntermediaire() {
    this.numeroIntermediaire = this.addForm.get("inter_numero").value;
    if (this.numeroIntermediaire == null || this.numeroIntermediaire == 0) {
      this.problemeNumeroIntermediaire = true;
      this.erreur = true;
    } else {
      this.problemeNumeroIntermediaire = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDenomination() {
    this.denomination = this.addForm.get("inter_denomination").value;
    if (this.denomination == null || this.denomination == "") {
      this.problemeDenomination = true;
      this.erreur = true;
    } else {
      this.problemeDenomination = false;
      this.erreur = false;
    }
  }
  //
  onFocusOutEventAgrement() {
    this.numAgrement = this.addForm.get("inter_numagrement").value;
    this.type_intermediaire = this.addForm.get("inter_type").value;
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

        if(this.type_intermediaire===this.courtier){
          this.numAgrement = this.addForm.get("inter_numagrement").value;
          this.interService.getAllIntermediaires()
          .subscribe((data: Intermediaire[]) => {
          this.intermediaires = data;
          this.listeIntermediaires = data as Intermediaire[];
          //console.log(this.listeClients.find(p => p.clien_numero === this.numeroClient));
          if (this.listeIntermediaires.find(p => p.inter_numagrement?.toLowerCase()=== this.numAgrement?.toLowerCase())?.inter_numagrement != null) {
            this.problemeNumeroAgrementExisteDeja= true;
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
  onFocusOutEventDenominationCourt() {
    this.denominationCourt = this.addForm.get("inter_denominationcourt").value;
    if (this.denominationCourt == null || this.denominationCourt == "") {
      this.problemeDenominationCourt = true;
      this.erreur = true;
    } else {
      this.problemeDenominationCourt = false;
      this.erreur = false;
    }
  }

  onFocusOutEventRue() {
    this.rue = this.addForm.get("inter_rue").value;
    if (this.rue == null || this.rue == "") {
      this.problemeRue = true;
      this.erreur = true;
    } else {
      this.problemeRue = false;
      this.erreur = false;
    }
  }

  onFocusOutEventTelephone1() {
    this.telephone1 = this.addForm.get("inter_telephone1").value;
    if (this.telephone1 == "") {
      this.problemeTelephone1 = true;
      this.erreur = true
    } else {
      this.problemeTelephone1 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumeroMobile() {
    this.numeroMobile = this.addForm.get("inter_portable").value;
    if (this.numeroMobile == "") {
      this.problemeNumeroMobile = true;
      this.erreur = true
    } else {
      this.problemeNumeroMobile = false;
      this.erreur = false;
    }
  }

  onChangeAutorisation(){
    this.autorisationcourtier = this.addForm.get("inter_autorisation").value;
    if (this.autorisationcourtier == "") {
      this.problemeAutaurisation = true;
      this.erreur = true
    } else {
      this.problemeAutaurisation = false;
      this.erreur = false;
   }
 }

  onFocusOutEventDDCA(event){
    this.datedebutcarteagrement = this.addForm.get("inter_datedebutcarteagrement").value;
    if (event == null || event=="") {
      this.problemeDateDebutCarteAgrement = true;
      this.erreur = true;
      
    } else {
      this.problemeDateDebutCarteAgrement = false;
      this.erreur = false;
    }
  }


  onFocusOutEventEmail() {
    this.email = this.addForm.get("inter_email").value;
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
        if (this.listeIntermediaires.find(p => p.inter_email?.toLowerCase()=== this.email?.toLowerCase())?.inter_email != null) {
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

  onFocusOutEventObjectifCA() {
    this.objectifCA = this.addForm.get("inter_objectifcaannuel").value;
    if (this.objectifCA === null || this.objectifCA === "") {
      this.addForm.controls['inter_objectifcaannuel'].setValue(0);
      this.objectifCA = 0;
      // this.problemeObjectifCA = true;
      // this.erreur = true;
    } else {
      // this.problemeObjectifCA = false;
      // this.erreur = false;

      this.objectifCA = Number(this.formatNumberService.replaceAll(this.objectifCA, ' ', ''));
      this.objectifCA = this.formatNumberService.numberWithCommas2(this.objectifCA);
    }
  }

  onFocusOutEventCAPorteFeuille() {
    this.caPorteFeuille = this.addForm.get("inter_caportefeuille").value;
    if (this.caPorteFeuille === null || this.caPorteFeuille === '') {
      this.problemeCAPorteFeuille = true;
      this.erreur = true;
    } else {
      this.problemeCAPorteFeuille = false;
      this.erreur = false;

      this.caPorteFeuille = Number(this.formatNumberService.replaceAll(this.caPorteFeuille, ' ', ''));
      this.caPorteFeuille = this.formatNumberService.numberWithCommas2(this.caPorteFeuille);
    }
  }

  onFocusOutEventMonantSinistre() {
    this.monantSinistre = this.addForm.get("inter_sinistralite").value;
    
    if (this.monantSinistre !== '') {
      this.monantSinistre = Number(this.formatNumberService.replaceAll(this.monantSinistre, ' ', ''));
      this.monantSinistre = this.formatNumberService.numberWithCommas2(this.monantSinistre);
    }
  }

  onFocusOutEventMonantArrieres() {
    this.monantArrieres = this.addForm.get("inter_arriere").value;
    
    if (this.monantArrieres !== '') {
      this.monantArrieres = Number(this.formatNumberService.replaceAll(this.monantArrieres, ' ', ''));
      this.monantArrieres = this.formatNumberService.numberWithCommas2(this.monantArrieres);
    }
  }

  onFocusOutEventMontantCommission() {
    this.montantCommAnnuel = this.addForm.get("inter_montantcommission").value;
    if (this.montantCommAnnuel === null || this.montantCommAnnuel === '') {
      this.problemeMontantCommAnnuel = true;
      this.erreur = true;
    } else {
      this.problemeMontantCommAnnuel = false;
      this.erreur = false;

      this.montantCommAnnuel = Number(this.formatNumberService.replaceAll(this.montantCommAnnuel, ' ', ''));
      this.montantCommAnnuel = this.formatNumberService.numberWithCommas2(this.montantCommAnnuel);
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

  getColorDenominationCourt() {
    if (this.problemeDenominationCourt) {
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
  problemeDateDebutCarteAgrementBorder(){
    if (this.problemeDateDebutCarteAgrement) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  anneeExercice:any[]=[];
  remplirAnneeExecice(){
    let annne=2000;
    for(let i=0;i<100;i++){
      this.anneeExercice[i]=annne,
      annne++;
    }
  }
 


}
