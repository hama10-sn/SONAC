import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Compagnie } from '../../../../../model/Compagnie';
import { Filiale } from '../../../../../model/Filiale';
import { Groupe } from '../../../../../model/Groupe';
import { Pays } from '../../../../../model/pays';
import { User } from '../../../../../model/User';
import { CompagnieService } from '../../../../../services/compagnie.service';
import { FilialeService } from '../../../../../services/filiale.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { PaysService } from '../../../../../services/pays.service';
import { UserService } from '../../../../../services/user.service';
import countries from '../../../../data/countries.json';

@Component({
  selector: 'ngx-ajout-filiale',
  templateUrl: './ajout-filiale.component.html',
  styleUrls: ['./ajout-filiale.component.scss']
})
export class AjoutFilialeComponent implements OnInit, OnDestroy {
  addForm = this.fb.group({
    fili_id: [''],
    fili_numero: [''],
    fili_codecompagnie: [''],
    fili_codepays: ['', [Validators.required]],
    fili_codegroupe: [''],
    fili_denomination: ['', [Validators.required]],
    fili_sigle: ['', [Validators.required]],
    fili_codedevise: ['', [Validators.required]],
    fili_adresse1: ['', [Validators.required]],
    fili_adresse2: [''],
    fili_telephone1: ['', [Validators.required]],
    fili_telephone2: [''],
    // tslint:disable-next-line:max-line-length
    fili_telephonemobile: ['', [Validators.required]],
    fili_codepostal: [''],
    fili_codeutilisateur: [''],
    fili_datemodification: [''],
     });

  errorNumero: boolean = true;
  errorNumero1: boolean = true;
  errorNumero2: boolean = true;
  errorSigle: boolean = false;
  errorDenom: boolean = false;
  errorAdresse1: boolean = false;
  errorTel1: boolean = false;
  errorMob: boolean = false;

  filiale: Filiale;
  autorisation = [];
  //listPays: Array<Pays> = new Array<Pays>();
  @Input() listPays: any [] = countries;
  listGroupes: Array<Groupe> = new Array<Groupe>();
  //listCompagnies: Array<Compagnie> = new Array<Compagnie>();
  login: any;
  user: User;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  //telephone

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

   // ================ Déclarations des variables pour la recherche avec filtre ======================
   compagnies: Array<Compagnie> = new Array<Compagnie>();

   /** control for the selected classification */
   public compagnieCtrl: FormControl = new FormControl();
   public groupeCtrl: FormControl = new FormControl();
 
   /** control for the MatSelect filter keyword */
   public compagnieFilterCtrl: FormControl = new FormControl();
   public groupeFilterCtrl: FormControl = new FormControl();
 
   /** list of classifications filtered by search keyword */
   public filteredcompagnie: ReplaySubject<Compagnie[]> = new ReplaySubject<Compagnie[]>();
   public filteredgroupe: ReplaySubject<Groupe[]> = new ReplaySubject<Groupe[]>();
   //filteredBanks: BehaviorSubject<Bank[]> = new BehaviorSubject<Bank[]>(BANKS);
 
   @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
 
   /** Subject that emits when the component has been destroyed. */
   protected _onDestroy = new Subject<void>();
 
   // ========================================== FIN Déclaration ======================================

  // tslint:disable-next-line:max-line-length
  constructor(private paysService: PaysService, private authService: NbAuthService, private filialeService: FilialeService, private toastrService: NbToastrService,
              private fb: FormBuilder, private groupeService: GroupeService, private userService: UserService,
               private compagnieService: CompagnieService, private router: Router) { }

  ngOnInit(): void {
   // this.onGetAllpays();
   this.authService.onTokenChange()
   .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }

   });
    this.onGetAllGroupes();
    this.getlogin();
    this.onGetAllCompagnies();

          // =================== Listen for search field value changes =======================
    this.compagnieFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks();
    });
    this.groupeFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterGroupes();
    });

}

ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}

protected filterBanks() {
  if (!this.compagnies) {
    return;
  }
  // get the search keyword
  let search = this.compagnieFilterCtrl.value;
  if (!search) {
    this.filteredcompagnie.next(this.compagnies.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredcompagnie.next(
    this.compagnies.filter(c => c.comp_denomination.toLowerCase().indexOf(search) > -1 ||
    c.comp_numero.toLowerCase().indexOf(search) > -1),
  );
}

protected filterGroupes() {
  if (!this.listGroupes) {
    return;
  }
  // get the search keyword
  let search = this.groupeFilterCtrl.value;
  if (!search) {
    this.filteredgroupe.next(this.listGroupes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredgroupe.next(
    this.listGroupes.filter(g => g.group_liblong.toLowerCase().indexOf(search) > -1 ||
    g.group_code.toString().indexOf(search) > -1),
  );
}

// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================

  cancel() {
   // this.ref.close();
   this.router.navigateByUrl('home/filiale');
  }

  submit() {
    this.addForm.controls['fili_codeutilisateur'].setValue(this.user.util_numero);
    this.addForm.controls['fili_datemodification'].setValue(new Date());
    // tslint:disable-next-line:max-line-length
    this.addForm.controls['fili_telephone1'].setValue(this.addForm.controls['fili_telephone1'].value.internationalNumber);
    // tslint:disable-next-line:max-line-length
    this.addForm.controls['fili_telephone2'].setValue(this.addForm.controls['fili_telephone2'].value?.internationalNumber);
    // tslint:disable-next-line:max-line-length
    this.addForm.controls['fili_telephonemobile'].setValue(this.addForm.controls['fili_telephonemobile'].value.internationalNumber);
    //  this.ref.close(this.addForm.value);

  this.filialeService.addFiliale(this.addForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'Filiale Enregistrée avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/filiale');
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
        'Notification d\'erreur',
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

  /*onChangeCodePays(event) {
    console.log(event);
    this.addForm.controls['fili_codepays'].setValue(event);
  }*/

  /*onGetAllpays(){
    this.paysService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.listPays = data;
          //console.log(data);
      });
     // console.log(this.listPays);
  }*/

  onGetAllGroupes () {
    this.groupeService.getAllGroupes()
    .subscribe((data: Groupe[]) => {
       this.listGroupes = data;
       this.filteredgroupe.next(this.listGroupes.slice());
    });
}
onChangeGroupe(event) {
  console.log(event.value);
  this.addForm.controls['fili_codegroupe'].setValue(event.value);
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

onGetAllCompagnies () {
  this.compagnieService.getAllCompagnies()
  .subscribe((data: Compagnie[]) => {
     this.compagnies = data;
     this.filteredcompagnie.next(this.compagnies.slice());
  });
}
onChangeCompagnie(event) {
console.log(event.value);
this.addForm.controls['fili_codecompagnie'].setValue(event.value);
// tslint:disable-next-line:semicolon
console.log(((this.listPays.find(p => p.alpha2Code === event.value.substring(0, 2)))?.callingCodes[0]));
// tslint:disable-next-line:max-line-length
this.addForm.controls['fili_codepays'].setValue(((this.listPays.find(p => p.alpha2Code === event.value.substring(0, 2)))?.callingCodes[0]));
// tslint:disable-next-line:max-line-length
this.addForm.controls['fili_codedevise'].setValue((this.listPays.find(p => p.alpha2Code === event.value.substring(0, 2))).currencies[0].code);
}

check_fonct(fonct: String) {

  let el = this.autorisation.findIndex(itm => itm === fonct);
  if (el === -1)
   return false;
  else
   return true;

}
onchangeNumero () {
  this.errorNumero = true;
  if (this.addForm.controls['fili_telephonemobile'].valid == true ){
    this.errorNumero = true;
  } else {
    this.errorNumero = false;
  }
}

onchangeNumero1 () {
  this.errorNumero1 = true;
  if (this.addForm.controls['fili_telephone1'].valid == true ){
    this.errorNumero1 = true;
  } else {
    this.errorNumero1 = false;
  }
}

onchangeNumero2 () {
  if (this.addForm.controls['fili_telephone2'].valid == true ){
    this.errorNumero2 = true;
  } else {
    this.errorNumero2 = false;
  }
}

onchangeAdresse1 () {
  if (this.addForm.get('fili_adresse1').value === '' ) {
    this.errorAdresse1 = true;
  } else {
    this.errorAdresse1 = false;
  }
}
onchangeSigle () {
  if (this.addForm.get('fili_sigle').value === '' ) {
    this.errorSigle = true;
  } else {
    this.errorSigle = false;
  }
}
onchangeDenom () {
  
  if (this.addForm.get('fili_denomination').value === '' ) {
   // console.log('tototot');
    this.errorDenom = true;
  } else {
    this.errorDenom = false;
  }
}

onFocusOutEventTel1 () {

  if (this.addForm.get('fili_telephone1').value === '' ) {
   // console.log('tototot');
    this.errorTel1 = true;
  } else {
    this.errorTel1 = false;
  }
}

onFocusOutEventMob () {
  
  if (this.addForm.get('fili_telephonemobile').value === '' ) {
   // console.log('tototot');
    this.errorMob = true;
  } else {
    this.errorMob = false;
  }
}



}
