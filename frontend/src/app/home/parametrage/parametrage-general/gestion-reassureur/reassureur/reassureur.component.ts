import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Cimacodificationcompagnie } from '../../../../../model/Cimacodificationcompagnie';
import { CimaCompagnie } from '../../../../../model/CimaCompagnie';
import { Pays } from '../../../../../model/pays';
import { User } from '../../../../../model/User';
import { CimacompagnieService } from '../../../../../services/cimacompagnie.service';
import { PaysService } from '../../../../../services/pays.service';
import { ReassureurService } from '../../../../../services/reassureur.service';
import { UserService } from '../../../../../services/user.service';
import countries from '../../../../data/countries.json';
import type from '../../../../data/type.json';
import dateFormatter from 'date-format-conversion';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'ngx-reassureur',
  templateUrl: './reassureur.component.html',
  styleUrls: ['./reassureur.component.scss']
})
export class ReassureurComponent implements OnInit {


  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  public dataSource = new MatTableDataSource<Pays>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  //public listPays:any [] =countries;
  pays: Pays;
  cima:Cimacodificationcompagnie;
  @Input() listPays:any [] =countries;

  listContries: any [];
  listCimaCompagnies:any[];
 payss: Array<Pays> = new Array<Pays>();
 cimas: Array<Cimacodificationcompagnie> = new Array<Cimacodificationcompagnie>();
 login:any;
  user: User;
  errorNumero: boolean;
  errorNumero2: boolean;
  
  errorDenom: boolean = false;
  errorDenomCourt: boolean = false;
  errorAdresse: boolean = false;
  //errorDenomCourt: boolean = false;

  displayNumeroError2: boolean = false;
  displayNumeroError: boolean = false;
  errorEmail: boolean;
  displayEmailError: boolean = false;
  autorisation: [];
  dateTraite: Date;
  listTypes: any [];
  @Input() listTypeReassureur:any [] = type;
  reassu : boolean;
 
  addForm = this.fb.group({
    reass_code: [''],
    reass_codeidentificateur: ['',[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    reass_codepays: ['',[Validators.required]],
    reass_type: ['',[Validators.required]],
    reass_denomination: ['',[Validators.required]],
    reass_denominationcourt: ['',[Validators.required]],
    reass_adresse1: ['',[Validators.required]],
    reass_adresse2: [''],
    reass_telephone1: ['', [Validators.required]],
    reass_telephone2: [''],
    reass_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    reass_datetraite1: ['',[Validators.required]],
    reass_nbretraite: ['',[Validators.required]],
    reass_ca: ['',[Validators.required]],
    reass_commissionrecu: ['',[Validators.required]],
    reass_horsgroupe: [''],
    reass_codenationalite: [''],
    reass_codeutilisateur: [''],
    reass_datemodification: [''],
  });

// ================ Déclarations des variables pour la recherche avec filtre ======================
//branchess: Array<Branche> = new Array<Branche>();
@Input() listPayss:any [] =countries;

/** control for the selected  */
public paysCtrl: FormControl = new FormControl();

/** control for the MatSelect filter keyword */
public paysFilterCtrl: FormControl = new FormControl();

/** list  filtered by search keyword */
public filteredPays: ReplaySubject<any[]> = new ReplaySubject<any[]>();

@ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

/** Subject that emits when the component has been destroyed. */
protected _onDestroy = new Subject<void>();

// ========================================== FIN Déclaration ======================================


  constructor(
    private fb: FormBuilder,
    private payService: PaysService,private userService: UserService, 
    private authService: NbAuthService,
    private cimaCompagnieService: CimacompagnieService,
    private toastrService: NbToastrService,private router: Router,
    private reassureurService: ReassureurService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
 
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
 
    });
    this.filteredPays.next(this.listPayss.slice());
    
    this.dateTraite = dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm');
    //console.log(this.dateTraite);
    this.addForm.controls['reass_datetraite1'].setValue(this.dateTraite);

   this.onGetAllPays();
   this.onGetAllCimaCompagnie();
   this.getlogin();
   this.listTypes=this.listTypeReassureur['TYPE_REASSUREUR'];
   this.addForm.controls['reass_ca'].setValue(0);
   this.addForm.controls['reass_commissionrecu'].setValue(0);
   this.addForm.controls['reass_nbretraite'].setValue(0);   
  
   // =================== Listen for search field value changes =======================
   this.paysFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterPays();
   });

 
}

ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}

protected filterPays() {
  console.log(this.listPayss);
  if (!this.listPayss) {
    return;
  }
  // get the search keyword
  let search = this.paysFilterCtrl.value;
  if (!search) {
    this.filteredPays.next(this.listPayss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredPays.next(
    this.listPayss.filter(p => p.name.toLowerCase().indexOf(search) > -1)
    //console.log(this.listPayss.filterp => p.name);
  );
  
}



// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================

  onchangeDenom () {
  
    if (this.addForm.get('reass_denomination').value === '' ) {
     
      this.errorDenom = true;
    } else {
      this.errorDenom = false;
    }
  }
  onchangeDenomCourt () {
  
    if (this.addForm.get('reass_denominationcourt').value === '' ) {
     
      this.errorDenomCourt = true;
    } else {
      this.errorDenomCourt = false;
    }
  }
  onchangeAdresse () {
  
    if (this.addForm.get('reass_adresse1').value === '' ) {
     
      this.errorAdresse = true;
    } else {
      this.errorAdresse = false;
    }
  }
  onChangeLibeleType(event) {
    console.log(event);
    this.addForm.controls['reass_type'].setValue((this.listTypes.find(p => p.id === event)).id);
    if(event=="2"){
      this.reassu=true;
      this.onGetAllCimaCompagnie();
      console.log("test true");
      this.addForm.controls['reass_codepays'].setValue(" ");
      this.addForm.controls['reass_codeidentificateur'].setValue(" ");
      
    }else if (event=="1" || event=="3")
    {
      this.reassu=false;
      console.log("test false");
      this.addForm.controls['reass_codepays'].setValue(" ");
      this.addForm.controls['reass_codeidentificateur'].setValue(" ");
      
    }
  }
  onchangeMail () {
    this.displayEmailError = true;
    if(this.addForm.controls['reass_email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }
  }
  cancel() {
    this.router.navigateByUrl('home/gestion_reassureur');
  }
  onchangeNumero () {
    this.displayNumeroError = true;
    if(this.addForm.controls['reass_telephone1'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }
  onchangeNumero2 () {
    this.displayNumeroError2 = true;
    if(this.addForm.controls['reass_telephone2'].valid == true ){
      this.errorNumero2 = true;
    }else{
      this.errorNumero2 = false;
    }
  }

  onGetAllPays(){
    this.payService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.payss = data;
          this.listContries = data as Pays[];
      });
  }
  onGetAllCimaCompagnie(){
    this.cimaCompagnieService.getAllCimaCompagnie()
      .subscribe((data: Cimacodificationcompagnie[]) => {
          this.cimas = data;
          this.listCimaCompagnies = data as Cimacodificationcompagnie[];
          console.log(this.listCimaCompagnies);
      });

  }
  onChangeGroupe(event) {
    //console.log(event);
    this.addForm.controls['reass_horsgroupe'].setValue(event);
  }
  submit() {
    this.addForm.controls['reass_telephone1'].setValue(this.addForm.controls['reass_telephone1'].value.internationalNumber);
    this.addForm.controls['reass_telephone2'].setValue(this.addForm.controls['reass_telephone2'].value?.internationalNumber);
    this.addForm.controls['reass_datemodification'].setValue(new Date());
    this.addForm.controls['reass_codeutilisateur'].setValue(this.user.util_numero);
    //this.ref.close(this.addForm.value);
    this.reassureurService.addReassureur(this.addForm.value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Reassureur Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion_reassureur');
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );
      }/*
  onChangeLibele(event) {
    //console.log(event);
    //this.addForm.controls['reass_codepays'].setValue((this.listPays.find(p => p.callingCodes === event)));
    console.log(event);
    //console.log((this.listPays.find(p => p.callingCodes === event))) ;
    this.addForm.controls['reass_codepays'].setValue(event);
  }*/
  onChange(event) {
    //console.log(event);    
    this.addForm.controls['reass_codepays'].setValue(event);
  }
  // onChangeCima(event) {
  //   //console.log(event);    
  //   this.addForm.controls['reass_codeidentificateur'].setValue(event);
  // }
  onChangeCima(event) {
    console.log(event.substring(0, 2));    
    this.addForm.controls['reass_codeidentificateur'].setValue(event);
    this.addForm.controls['reass_codepays'].setValue(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
      console.log(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
  }
  onChangeNationalite(event) {
  this.addForm.controls['reass_codenationalite'].setValue(event.value);
  }
  
  onChangePays(event) {
    this.addForm.controls['reass_codepays'].setValue(event);
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
  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;  
  }
}
