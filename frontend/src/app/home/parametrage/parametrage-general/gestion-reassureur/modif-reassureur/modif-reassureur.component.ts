import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Reassureur } from '../../../../../model/Reassureur';
import { ModifPaysComponent } from '../../gestion-pays/modif-pays/modif-pays.component';
import dateFormatter from 'date-format-conversion';
import countries from '../../../../data/countries.json';
import { Pays } from '../../../../../model/pays';
import { MatTableDataSource } from '@angular/material/table';
import { PaysService } from '../../../../../services/pays.service';
import { User } from '../../../../../model/User';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserService } from '../../../../../services/user.service';
import { Cimacodificationcompagnie } from '../../../../../model/Cimacodificationcompagnie';
import { CimacompagnieService } from '../../../../../services/cimacompagnie.service';
import { ReassureurService } from '../../../../../services/reassureur.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { Contact } from '../../../../../model/Contact';
import type from '../../../../data/type.json';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'ngx-modif-reassureur',
  templateUrl: './modif-reassureur.component.html',
  styleUrls: ['./modif-reassureur.component.scss']
})
export class ModifReassureurComponent implements OnInit {

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  contact: Contact;
  listPays:any [] =countries;
  listTypes:any [] =type;

  errorDenom: boolean = false;
  errorDenomCourt: boolean = false;
  errorAdresse: boolean = false;

  modifForm = this.fb.group({
    //reass_id: [''],
    reass_code: ['',[Validators.required]],
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
  reassu: boolean;
  id: number;
  reassureur: Reassureur; 
  datetraite: Date; 
  dateMJS: Date; 
  pays: Pays;
  code_pays: String;
  code_cima: String;
  login:any;
  user: User;

  public dataSource = new MatTableDataSource<Pays>();
  listContries: any [];
  payss: Array<Pays> = new Array<Pays>();
  cima:Cimacodificationcompagnie;
  code_nationalite: String;
  listCimaCompagnies:any[];
 cimas: Array<Cimacodificationcompagnie> = new Array<Cimacodificationcompagnie>();
 cimaId : any;
 codePays: any;
 typeReassureur: any;
 listTypeReassureur:any [] = type;
 errorNumero: boolean;
 errorNumero2: boolean;
 errorEmail: boolean;
 displayNumeroError2: boolean = false;
 displayNumeroError: boolean = false;
 displayEmailError: boolean = false;
 autorisation: [];
 groupe : any;


 
// ================ Déclarations des variables pour la recherche avec filtre ======================

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
    private fb: FormBuilder,private payService: PaysService,
    private userService: UserService,private reassureurService: ReassureurService,
    private authService: NbAuthService,private activatedroute: ActivatedRoute,private toastrService: NbToastrService,
    private transfertData: TransfertDataService,private router: Router,
    private cimaCompagnieService: CimacompagnieService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
 
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
 
    });
    this.filteredPays.next(this.listPayss.slice());
    //this.filteredPays=this.listPayss;
    this.reassureur = this.transfertData.getData();
    this.onGetAllPays();
    this.getlogin();    
   this.onGetAllCimaCompagnie();
   this.listTypes=this.listTypeReassureur['TYPE_REASSUREUR'];
        //this.modifForm.controls['reass_id'].setValue(this.reassureur.reass_id);


      
        this.modifForm.controls['reass_code'].setValue(this.reassureur.reass_code);
        console.log(this.reassureur.reass_code);
        this.modifForm.controls['reass_codeidentificateur'].setValue(this.reassureur.reass_codeidentificateur);
        this.cimaId = this.reassureur.reass_codeidentificateur?.toString();
        console.log(this.cimaId);
        this.code_cima=this.reassureur.reass_codeidentificateur?.toString();
        this.modifForm.controls['reass_codepays'].setValue(this.reassureur.reass_codepays);
        this.code_pays=this.onGetLibelleByPays(this.reassureur.reass_codepays?.toString());
        console.log(this.code_pays);

        this.modifForm.controls['reass_type'].setValue(this.reassureur.reass_type);
        this.typeReassureur=this.onGetLibelleByType(this.reassureur.reass_type?.toString());

        this.modifForm.controls['reass_denomination'].setValue(this.reassureur.reass_denomination);
        this.modifForm.controls['reass_denominationcourt'].setValue(this.reassureur.reass_denominationcourt);
        this.modifForm.controls['reass_adresse1'].setValue(this.reassureur.reass_adresse1);
        this.modifForm.controls['reass_adresse2'].setValue(this.reassureur.reass_adresse2);
        this.modifForm.controls['reass_telephone1'].setValue(this.reassureur.reass_telephone1);
        this.modifForm.controls['reass_telephone2'].setValue(this.reassureur.reass_telephone2);
        this.modifForm.controls['reass_email'].setValue(this.reassureur.reass_email);
        this.datetraite = dateFormatter(this.reassureur.reass_datetraite1,  'yyyy-MM-ddThh:mm') ;
        this.modifForm.controls['reass_datetraite1'].setValue(this.datetraite);
        

        this.modifForm.controls['reass_nbretraite'].setValue(this.reassureur.reass_nbretraite);
        this.modifForm.controls['reass_ca'].setValue(this.reassureur.reass_ca);
        this.modifForm.controls['reass_commissionrecu'].setValue(this.reassureur.reass_commissionrecu);
        this.modifForm.controls['reass_horsgroupe'].setValue(this.reassureur.reass_horsgroupe);
        this.groupe = this.reassureur.reass_horsgroupe;
        this.modifForm.controls['reass_codenationalite'].setValue(this.reassureur.reass_codenationalite);  
       // this.code_nationalite =this.reassureur.reass_codenationalite?.toString();
        if(this.reassureur.reass_codenationalite!=null){

          this.paysCtrl.setValue(this.reassureur.reass_codenationalite.toString());
        }

        console.log(this.reassureur.reass_codenationalite);

        console.log(typeof(this.reassureur.reass_codenationalite));
        this.modifForm.controls['reass_codeutilisateur'].setValue(this.reassureur.reass_codeutilisateur);
        //this.dateMJS= dateFormatter(this.reassureur.reass_datemodification,  'yyyy-MM-ddThh:mm') ;
        //this.modifForm.controls['reass_datemodification'].setValue(this.dateMJS);
        //console.log(this.reassureur);
        this.onchangeMail();
        this.onchangeNumero();
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
  
    if (this.modifForm.get('reass_denomination').value === '' ) {
     
      this.errorDenom = true;
    } else {
      this.errorDenom = false;
    }
  }
  onchangeDenomCourt () {
  
    if (this.modifForm.get('reass_denominationcourt').value === '' ) {
     
      this.errorDenomCourt = true;
    } else {
      this.errorDenomCourt = false;
    }
  }
  onchangeAdresse () {
  
    if (this.modifForm.get('reass_adresse1').value === '' ) {
     
      this.errorAdresse = true;
    } else {
      this.errorAdresse = false;
    }
  }
  onGetLibelleByType(numero: any) {
    

    return numero + " : " + (this.listTypes?.find(b => b.id === numero))?.value;
  
    }
    onGetLibelleByPays(numero: any) {
    
        return numero + " : " + (this.listPays?.find(b => b.callingCodes[0] === numero))?.name;
    
      }
  onGetAllPays(){
    this.payService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.payss = data;
          this.listContries = data as Pays[];
      });
  }
  onchangeNumero () {
    this.displayNumeroError = true;
    if(this.modifForm.controls['reass_telephone1'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }
  onchangeNumero2 () {
    this.displayNumeroError2 = true;
    if(this.modifForm.controls['reass_telephone2'].valid == true ){
      this.errorNumero2 = true;
    }else{
      this.errorNumero2 = false;
    }
  }
  onchangeMail () {
    this.displayEmailError = true;
    if(this.modifForm.controls['reass_email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }
  }

  onChangeGroupe(event) {
    //console.log(event);
    this.modifForm.controls['reass_horsgroupe'].setValue(event);
  }
  onGetAllCimaCompagnie(){
    this.cimaCompagnieService.getAllCimaCompagnie()
      .subscribe((data: Cimacodificationcompagnie[]) => {
          this.cimas = data;
          this.listCimaCompagnies = data as Cimacodificationcompagnie[];
      });
  }
  cancel() {
    this.router.navigateByUrl('home/gestion_reassureur');
  }
  submit() {
  this.modifForm.controls['reass_telephone1'].setValue(this.modifForm.controls['reass_telephone1'].value.internationalNumber);
  this.modifForm.controls['reass_telephone2'].setValue(this.modifForm.controls['reass_telephone2'].value?.internationalNumber);
      
    //this.ref.close(this.modifForm.value);
    this.modifForm.controls['reass_codeutilisateur'].setValue(this.user.util_numero);
    this.modifForm.controls['reass_datemodification'].setValue(new Date());
      //this.ref.close(this.modifForm.value);
      this.reassureurService.update(this.modifForm.value)
      .subscribe(() => {
        this.toastrService.show(
          'Réassureur modifié avec succes !',
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
          console.log(error);
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
  }
  onChangeLibeleType(event) {
    console.log(event);
    this.modifForm.controls['reass_type'].setValue((this.listTypes.find(p => p.id === event)).id);
    if(event=="2"){
      this.reassu=true;
      this.onGetAllCimaCompagnie();
      console.log("test true");
      this.modifForm.controls['reass_codepays'].setValue(" ");
      this.modifForm.controls['reass_codeidentificateur'].setValue(" ");
      
    }else if (event=="1" || event=="3")
    {
      this.reassu=false;
      console.log("test false");
      this.modifForm.controls['reass_codepays'].setValue(" ");
      this.modifForm.controls['reass_codeidentificateur'].setValue(" ");
      
    }
  }
  onChangePays(event) {
    this.modifForm.controls['reass_codepays'].setValue(event);
    }
 /* onChangeLibeleType(event) {
    console.log(event);
    this.modifForm.controls['reass_type'].setValue((this.listTypes.find(p => p.id === event)).id);
  }*/
  
  onChange(event) {    
    this.modifForm.controls['reass_codepays'].setValue(event);
  }
  // onChangeCima(event) {
  //   //console.log(event);    
  //   this.addForm.controls['reass_codeidentificateur'].setValue(event);
  // }
  onChangeCima(event) {
    console.log(event.substring(0, 2));    
    this.modifForm.controls['reass_codeidentificateur'].setValue(event);
    this.modifForm.controls['reass_codepays'].setValue(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
      console.log(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
  }
  onChangeNationalite(event) {
    this.modifForm.controls['reass_codenationalite'].setValue(event.value);
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
