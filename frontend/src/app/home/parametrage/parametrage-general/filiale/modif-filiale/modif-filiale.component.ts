import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Filiale } from '../../../../../model/Filiale';
import dateFormatter from 'date-format-conversion';
import { Groupe } from '../../../../../model/Groupe';
import { Pays } from '../../../../../model/pays';
import { User } from '../../../../../model/User';
import { GroupeService } from '../../../../../services/groupe.service';
import { PaysService } from '../../../../../services/pays.service';
import { UserService } from '../../../../../services/user.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { CompagnieService } from '../../../../../services/compagnie.service';
import { Compagnie } from '../../../../../model/Compagnie';
import { Router } from '@angular/router';
import { FilialeService } from '../../../../../services/filiale.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import countries from '../../../../data/countries.json';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'ngx-modif-filiale',
  templateUrl: './modif-filiale.component.html',
  styleUrls: ['./modif-filiale.component.scss']
})
export class ModifFilialeComponent implements OnInit , OnDestroy{

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  
  modifForm = this.fb.group({
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

  autorisation = [];
  filiale: Filiale;
  fili_datemodification: Date ;
 // listPays: Array<Pays> = new Array<Pays>();
 @Input() listPays: any [] = countries;
  listGroupes: Array<Groupe> = new Array<Groupe>();
  listUsers: Array<User> = new Array<User>();
  fili_codepays: String;
  fili_codegroupe: String;
  fili_codecompagnie: String;
  login: any;
  user: User;
  listCompagnies: Array<Compagnie> = new Array<Compagnie>();
  errorNumero: boolean = true;
  errorNumero1: boolean = true;
  errorNumero2: boolean = true;
  errorSigle: boolean = false;
  errorDenom: boolean = false;
  errorAdresse1: boolean = false;
  errorTel1: boolean = false;
  errorMob: boolean = false;

  
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  // ================ Déclarations des variables pour la recherche avec filtre ======================

  /** control for the selected classification */
  public groupeCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public groupeFilterCtrl: FormControl = new FormControl();

  /** list of classifications filtered by search keyword */
  public filteredgroupe: ReplaySubject<Groupe[]> = new ReplaySubject<Groupe[]>();
  //filteredBanks: BehaviorSubject<Bank[]> = new BehaviorSubject<Bank[]>(BANKS);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  // ========================================== FIN Déclaration ======================================


  // tslint:disable-next-line:max-line-length
  constructor(private paysService: PaysService,private authService: NbAuthService, private filialeService: FilialeService, private toastrService: NbToastrService,
              private fb: FormBuilder,private groupeService: GroupeService, private userService: UserService,
              // tslint:disable-next-line:max-line-length
              private compagnieService: CompagnieService, private router: Router, private transfertData: TransfertDataService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });

    this.filiale = this.transfertData.getData();

        this.modifForm.controls['fili_id'].setValue(this.filiale.fili_id);
        this.modifForm.controls['fili_numero'].setValue(this.filiale.fili_numero);
        this.modifForm.controls['fili_codecompagnie'].setValue(this.filiale.fili_codecompagnie);
        this.fili_codecompagnie = this.filiale.fili_codecompagnie.toString();
        this.modifForm.controls['fili_codepays'].setValue(this.filiale.fili_codepays);
        this.fili_codepays = this.filiale.fili_codepays.toString();
        this.modifForm.controls['fili_codegroupe'].setValue(this.filiale.fili_codegroupe);
        if (this.filiale.fili_codegroupe != null){
        this.fili_codegroupe = this.filiale.fili_codegroupe.toString();
        this.groupeCtrl.setValue(this.filiale.fili_codegroupe.toString());
      } else {
        this.fili_codegroupe = this.filiale.fili_codegroupe;
        this.groupeCtrl.setValue(this.filiale.fili_codegroupe);
      }
        this.modifForm.controls['fili_denomination'].setValue(this.filiale.fili_denomination);
        this.modifForm.controls['fili_sigle'].setValue(this.filiale.fili_sigle);
        this.modifForm.controls['fili_codedevise'].setValue(this.filiale.fili_codedevise);
        this.modifForm.controls['fili_adresse1'].setValue(this.filiale.fili_adresse1);
        this.modifForm.controls['fili_adresse2'].setValue(this.filiale.fili_adresse2);
        this.modifForm.controls['fili_telephone1'].setValue(this.filiale.fili_telephone1);
        this.modifForm.controls['fili_telephone2'].setValue(this.filiale.fili_telephone2);
        this.modifForm.controls['fili_telephonemobile'].setValue(this.filiale.fili_telephonemobile);
        this.modifForm.controls['fili_codepostal'].setValue(this.filiale.fili_codepostal);
        this.modifForm.controls['fili_codeutilisateur'].setValue(this.filiale.fili_codeutilisateur);
       // this.fili_codeutilisateur = this.filiale.fili_codeutilisateur.toString();
       // this.modifForm.controls['fili_datemodification'].setValue(this.filiale.fili_datemodification);
       // this.fili_datemodification = dateFormatter(this.filiale.fili_datemodification,  'yyyy-MM-dd');
      //  this.modifForm.controls['fili_datemodification'].setValue(this.fili_datemodification);

      //console.log(this.fili_datemodification);

      this.getlogin();
      this.onGetAllGroupes();
    //  this.onGetAllpays();
      this.onGetAllCompagnies();
  //    console.log(this.modifForm.controls['fili_numero'].value);

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

  cancel() {
   // this.ref.close();
   this.router.navigateByUrl('home/filiale');

  }

  submit() {
    this.modifForm.controls['fili_codeutilisateur'].setValue(this.user.util_numero);
    this.modifForm.controls['fili_datemodification'].setValue(new Date());
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['fili_telephone1'].setValue(this.modifForm.controls['fili_telephone1'].value.internationalNumber);
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['fili_telephone2'].setValue(this.modifForm.controls['fili_telephone2'].value?.internationalNumber);
    // tslint:disable-next-line:max-line-length
    this.modifForm.controls['fili_telephonemobile'].setValue(this.modifForm.controls['fili_telephonemobile'].value.internationalNumber);
   
    //console.log(this.modifForm.controls['fili_numero'].value);
    //this.ref.close(this.modifForm.value);
    this.filialeService.updateFiliale(this.modifForm.value, this.modifForm.controls['fili_numero'].value)
    .subscribe(() => {
      this.toastrService.show(
        'Filiale modifiée avec succes !',
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

  onChangeCodePays(event) {
    console.log(event);
    this.modifForm.controls['fili_codepays'].setValue(event);
  }

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
  this.modifForm.controls['fili_codegroupe'].setValue(event.value);
}
getlogin(): any {
  this.authService.getToken()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.login = token.getPayload();
        this.userService.getUser(this.login.sub)
    .subscribe((data: User) => {
      this.user = data;
      console.log(this.user);
    });
      }
    });
}
onGetAllCompagnies () {
  this.compagnieService.getAllCompagnies()
  .subscribe((data: Compagnie[]) => {
     this.listCompagnies = data;
  });
}
onChangeCompagnie(event) {
console.log(event);
this.modifForm.controls['fili_codecompagnie'].setValue(event);
console.log(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
// tslint:disable-next-line:max-line-length
this.modifForm.controls['fili_codepays'].setValue(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
// tslint:disable-next-line:max-line-length
this.modifForm.controls['fili_codedevise'].setValue((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.currencies[0].code);

}

check_fonct(fonct: String) {

  let el = this.autorisation.findIndex(itm => itm === fonct);
  if (el === -1)
   return false;
  else
   return true;

}
onchangeNumero () {
  if (this.modifForm.controls['fili_telephonemobile'].valid == true ){
    this.errorNumero = true;
  } else {
    this.errorNumero = false;
  }
}

onchangeNumero1 () {
  if (this.modifForm.controls['fili_telephone1'].valid == true ){
    this.errorNumero1 = true;
  } else {
    this.errorNumero1 = false;
  }
}

onchangeNumero2 () {
  if (this.modifForm.controls['fili_telephone2'].valid == true ){
    this.errorNumero2 = true;
  } else {
    this.errorNumero2 = false;
  }
}

onchangeAdresse1 () {
  if (this.modifForm.get('fili_adresse1').value === '' ) {
    this.errorAdresse1 = true;
  } else {
    this.errorAdresse1 = false;
  }
}
onchangeSigle () {
  if (this.modifForm.get('fili_sigle').value === '' ) {
    this.errorSigle = true;
  } else {
    this.errorSigle = false;
  }
}
onchangeDenom () {
  
  if (this.modifForm.get('fili_denomination').value === '' ) {
   // console.log('tototot');
    this.errorDenom = true;
  } else {
    this.errorDenom = false;
  }
}

onFocusOutEventTel1 () {
  
  if (this.modifForm.get('fili_telephone1').value === '' ) {
   // console.log('tototot');
    this.errorTel1 = true;
  } else {
    this.errorTel1 = false;
  }
}

onFocusOutEventMob () {
  
  if (this.modifForm.get('fili_telephonemobile').value === '' ) {
   // console.log('tototot');
    this.errorMob = true;
  } else {
    this.errorMob = false;
  }
}

}
