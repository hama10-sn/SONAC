import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Compagnie } from '../../../../../model/Compagnie';
import { Groupe } from '../../../../../model/Groupe';
import { Pays } from '../../../../../model/pays';
import { CompagnieService } from '../../../../../services/compagnie.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { PaysService } from '../../../../../services/pays.service';
import dateFormatter from 'date-format-conversion';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { User } from '../../../../../model/User';
import { UserService } from '../../../../../services/user.service';
import { Cimacodificationcompagnie } from '../../../../../model/Cimacodificationcompagnie';
import type  from '../../../../data/type.json';
import { Router } from '@angular/router';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import countries from '../../../../data/countries.json';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'ngx-modif-compagnie',
  templateUrl: './modif-compagnie.component.html',
  styleUrls: ['./modif-compagnie.component.scss']
})
export class ModifCompagnieComponent implements OnInit {
   //telephone

   SearchCountryField = SearchCountryField;
   CountryISO = CountryISO;
   PhoneNumberFormat = PhoneNumberFormat;

  modifForm = this.fb.group({
comp_id: [''],
comp_numero: [''],
comp_codepays: [''],
comp_codegroupe: [''],
comp_type: [''],
comp_rangmarche:[''],
comp_camarche: [''],
comp_carelation: [''],
comp_denomination: ['', Validators.required],
comp_sigle: ['', Validators.required],
comp_adresse1: ['', Validators.required],
comp_adresse2: [''],
comp_telephone1: ['', [Validators.required]],
comp_telephone2: [''],
comp_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
comp_contact:[''],
comp_numerocontact:[''],
comp_codeutilisateur: [''],
comp_datemodification : [''],
  });
  cimacodecompagnie: Cimacodificationcompagnie [];
  @Input() listTypecompagnie:any [] = type;
  public dataSource = new MatTableDataSource<Pays>();
  pays: Pays;
  code_pays: String;
  code_Groupe: String;
  code_cimacompagnie: String;
  code_typecompagnie: String;
  @Input() listPays:any [] =countries;
  listContries: any [];
  //listGroupes: any;
  listTypes: any [];
  login:any;
  user: User;

  denomination: string;
  cimaCompagnie: string;
  sigle: string;
  libelpays: string;
  adresse1: string;
  telephone1: number;
  chiffrAmarche:number;
  recupChiffre:number;
  chiffrArelation:number;
  chiffrAffaire:number;
  chiffreRelation:number;


  payss: Array<Pays> = new Array<Pays>();
  listGroupes: Array<Groupe> = new Array<Groupe>();
  codecimacomp: Array<Cimacodificationcompagnie> = new Array<Cimacodificationcompagnie>();
  problemeDenomination : boolean = false;
  problemecimaCompagnie : boolean = false;
  problemePays : boolean = false;
  problemeSigle : boolean = false;
  problemeAdresse1: boolean = false;
  problemeTelephone1: boolean = false;
  problemeTelephone2: boolean = false;
  problemeNumContact: boolean = false;
  problemeEmail: boolean = false;
  erreur : boolean = false;
  compagnie: Compagnie;  
  date_modification: Date;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  autorisation = [];

  constructor(/*protected ref: NbDialogRef<ModifCompagnieComponent>*/
              private fb: FormBuilder,
              private payService: PaysService,
              private groupeService: GroupeService,
              private userService: UserService, 
              private authService: NbAuthService,
              private router:Router,
              private compagniService: CompagnieService,
              private toastrService: NbToastrService,private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.compagnie = this.transfertData.getData();
 
       this. listTypes=this.listTypecompagnie['TYPE_COMPAGNIE'];
        this.onGetAllPays();
        this.onGetAllGroupe();   
        this.getlogin();
        this.onFocusOutChiffreAffaire();
        this.onFocusOutChiffreRelation();
        this.authService.onTokenChange()
        .subscribe((token: NbAuthJWTToken) => {
   
         if (token.isValid()) {
           this.autorisation = token.getPayload().fonctionnalite.split(',');
           console.log(this.autorisation);
         }
   
       });
        this.modifForm.controls['comp_id'].setValue(this.compagnie.comp_id);
        this.modifForm.controls['comp_numero'].setValue(this.compagnie.comp_numero);
        //this.code_cimacompagnie=this.compagnie.comp_numero.toString();
        this.modifForm.controls['comp_codepays'].setValue(this.compagnie.comp_codepays);
        //this.code_pays=this.compagnie.comp_codepays.toString();
        //console.log(this.code_pays);
        this.modifForm.controls['comp_codegroupe'].setValue(this.compagnie.comp_codegroupe);
        this.code_Groupe=this.compagnie.comp_codegroupe.toString();
        //console.log(this.code_Groupe);
        this.modifForm.controls['comp_type'].setValue(this.compagnie.comp_type);
        this.code_typecompagnie=this.compagnie.comp_type.toString();
        this.modifForm.controls['comp_rangmarche'].setValue(this.compagnie.comp_rangmarche);
        this.modifForm.controls['comp_camarche'].setValue(this.numberWithCommas(this.compagnie.comp_camarche));
       // this.chiffrAffaire=this.numberWithCommas(this.compagnie.comp_camarche.toString());
        this.modifForm.controls['comp_carelation'].setValue(this.numberWithCommas(this.compagnie.comp_carelation));
       // this.chiffreRelation=this.numberWithCommas(this.compagnie.comp_codegroupe.toString());
        this.modifForm.controls['comp_denomination'].setValue(this.compagnie.comp_denomination);
        this.modifForm.controls['comp_sigle'].setValue(this.compagnie.comp_sigle);
        this.modifForm.controls['comp_adresse1'].setValue(this.compagnie.comp_adresse1);
        this.modifForm.controls['comp_adresse2'].setValue(this.compagnie.comp_adresse2);
        this.modifForm.controls['comp_telephone1'].setValue(this.compagnie.comp_telephone1);
        this.modifForm.controls['comp_telephone2'].setValue(this.compagnie.comp_telephone2);
        this.modifForm.controls['comp_email'].setValue(this.compagnie.comp_email);
        this.modifForm.controls['comp_contact'].setValue(this.compagnie.comp_contact);
        this.modifForm.controls['comp_numerocontact'].setValue(this.compagnie.comp_numerocontact);
        //this.modifForm.controls['comp_codeutilisateur'].setValue(this.compagnie.comp_codeutilisateur);
       // this.date_modification = dateFormatter(this.compagnie.comp_datemodification,  'yyyy-MM-ddThh:mm') ;
       // this.modifForm.controls['comp_datemodification'].setValue(this.date_modification);


        
        

      console.log(this.compagnie);
  }
  onGetAllPays(){
    this.payService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.payss = data;
          this.listContries = data as Pays[];
      });
  }

  onGetAllGroupe () {
    this.groupeService.getAllGroupes()
    .subscribe((data: Groupe[]) => {
       this.listGroupes = data;
    });
  }
  // onGetAllGroupe(){
  //   this.groupeService.getAllGroupes()
  //     .subscribe((data: Groupe[]) => {
  //         this.groupes = data;
  //         this.listGroupes = data as Groupe[];
  //     });
  // }
  onGetAllCodecimacompagnie(){
    this.compagniService.getAllCodecimacompagnies()
      .subscribe((data: Cimacodificationcompagnie[]) => {
          this.codecimacomp = data as Cimacodificationcompagnie[];
         // this.listecodecimacomp = data as Cimacodificationcompagnie[];
         
      });
      console.log(this.codecimacomp);
  }
  cancel() {
    //this.ref.close();
    this.router.navigateByUrl('/home/parametrage-general/compagnie');
  }
  numberWithCommas(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return parts.join(".");
}
// numberWithCommas2(x) {
//   var parts = x.toString().split(",");
//   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
//   return parts.join(".");
// }
onFocusOutChiffreAffaire() {
    this.chiffrAmarche = this.modifForm.get("comp_camarche").value;
    if ( this.chiffrAmarche !=null || this.chiffrAmarche ==0 ){
      this.numberWithCommas(this.chiffrAmarche);
      console.log( this.numberWithCommas(this.chiffrAmarche));
     this.recupChiffre=this.numberWithCommas(this.chiffrAmarche);
     this.modifForm.controls['comp_camarche'].setValue(this.numberWithCommas(this.chiffrAmarche));
     console.log(Number(this.replaceAll((this.modifForm.get("comp_camarche").value),'.','')));
    } 
  
   
  }
   replaceAll(str, find, replace) {
     if(str==null)
     return null;
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

  onFocusOutChiffreRelation() {
    this.chiffrArelation = this.modifForm.get("comp_carelation").value;
    if ( this.chiffrArelation !=null || this.chiffrArelation ==0 ){
      this.numberWithCommas(this.chiffrArelation);
      console.log(this.numberWithCommas(this.chiffrArelation));
   //this.recupChiffre=this.numberWithCommas(this.chiffrAmarche);
     this.modifForm.controls['comp_carelation'].setValue(this.numberWithCommas(this.chiffrArelation));
    } 
}
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
  submit() {
    this.modifForm.controls['comp_telephone1'].setValue(this.modifForm.controls['comp_telephone1'].value.internationalNumber);
    this.modifForm.controls['comp_telephone2'].setValue(this.modifForm.controls['comp_telephone2'].value?.internationalNumber);
    this.modifForm.controls['comp_numerocontact'].setValue(this.modifForm.controls['comp_numerocontact'].value?.internationalNumber);
    this.modifForm.controls['comp_codeutilisateur'].setValue(parseInt('this.user.util_numero'));
    this.modifForm.controls['comp_datemodification'].setValue(new Date());
    this.modifForm.controls['comp_camarche'].setValue(Number(this.replaceAll((this.modifForm.get("comp_camarche").value),'.','')));
    this.modifForm.controls['comp_carelation'].setValue(Number(this.replaceAll((this.modifForm.get("comp_carelation").value),'.','')));
   // this.ref.close(this.modifForm.value);
   this.compagniService.modifCompagnie(this.modifForm.value)
   .subscribe(() => {
     this.toastrService.show(
       'Compagnie modifiée avec succes !',
       'Notification',
       {
         status: this.statusSuccess,
         destroyByClick: true,
         duration: 300000,
         hasIcon: true,
         position: this.position,
         preventDuplicates: false,
       });
       this.router.navigateByUrl('/home/parametrage-general/compagnie');
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

onChange(event){    
  this.modifForm.controls['comp_codepays'].setValue(event);
}
onChangeGroupe(event){    
  this.modifForm.controls['comp_codegroupe'].setValue(event);
}
onChangeCodeCimaCompagnie(event) {
  console.log(event);
  this.modifForm.controls['comp_numero'].setValue(event);
  this.modifForm.controls['comp_codepays'].setValue(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
  
}
onChangeLibeleType(event) {
  console.log(event);
  this.modifForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id);
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

onFocusOutEventEmail() {
    
  // this.telephone1 = this.modifForm.get("comp_telephone1").value; 
  // console.log(typeof(this.telephone1 ));   
   if (this.modifForm.controls['comp_email'].valid == true ) {
     this.problemeEmail = false;
     this.erreur = false
   } else {
     this.problemeEmail  = true;
     this.erreur = true;
   }
 }
onFocusOutEventTelephone() {
  
 // this.telephone1 = this.modifForm.get("comp_telephone1").value; 
 // console.log(typeof(this.telephone1 ));   
  if (this.modifForm.controls['comp_telephone1'].valid == true ) {
    this.problemeTelephone1 = false;
    this.erreur = false
  } else {
    this.problemeTelephone1  = true;
    this.erreur = true;
  }
}
onFocusOutEventTelephone2() {
  
  // this.telephone1 = this.modifForm.get("comp_telephone1").value; 
  // console.log(typeof(this.telephone1 ));   
   if (this.modifForm.controls['comp_telephone2'].valid == true ) {
     this.problemeTelephone2 = false;
     this.erreur = false
   } else {
     this.problemeTelephone2  = true;
     this.erreur = true;
   }
 }
 onFocusOutEventNumContact() {
  
  // this.telephone1 = this.modifForm.get("comp_telephone1").value; 
  // console.log(typeof(this.telephone1 ));   
   if (this.modifForm.controls['comp_numerocontact'].valid == true ) {
     this.problemeNumContact = false;
     this.erreur = false
   } else {
     this.problemeNumContact  = true;
     this.erreur = true;
   }
 }

onFocusOutEventadresse() {
  
  this.adresse1 = this.modifForm.get("comp_adresse1").value; 
  console.log(typeof(this.sigle));   
  if (this.adresse1 === "") {
    this.problemeAdresse1 = true;
    this.erreur = true
  } else {
    this.problemeAdresse1  = false;
    this.erreur = false;
  }
}
onFocusOutEventSigle() {
  
  this.sigle = this.modifForm.get("comp_sigle").value; 
  console.log(typeof(this.sigle));   
  if (this.sigle === "") {
    this.problemeSigle = true;
    this.erreur = true
  } else {
    this.problemeSigle  = false;
    this.erreur = false;
  }

}
onFocusOutEventCimacomp() {
  
  this.cimaCompagnie = this.modifForm.get("comp_numero").value; 
  console.log(typeof(this.cimaCompagnie));   
  if (this.cimaCompagnie === "") {
    this.problemecimaCompagnie = true;
    this.erreur = true
  } else {
    this.problemecimaCompagnie  = false;
    this.erreur = false;
  }

}
onFocusOutEventDenomination() {
  
  this.denomination = this.modifForm.get("comp_denomination").value; 
  console.log(this.denomination);   
  if (this.denomination === "") {
    this.problemeDenomination = true;
    this.erreur = true
  } else {
    this.problemeDenomination  = false;
    this.erreur = false;
  }

}
getColorSigle() {
if (this.problemeSigle ) {
  return '1px solid red';
} else {
  return '';
}
}
getColorAdresse() {
if (this.problemeAdresse1 ) {
  return '1px solid red';
} else {
  return '';
}
}
getColorEmail() {
if (this.problemeEmail ) {
  return '1px solid red';
} else {
  return '';
}
}
getColorTelephone() {
if (this.problemeTelephone1 ) {
  return '1px solid red';
} else {
  return '';
}
}
getColorTelephone2() {
  if (this.problemeTelephone2 ) {
    return '1px solid red';
  } else {
    return '';
  }
  }
  getColorNumContact() {
    if (this.problemeNumContact ) {
      return '1px solid red';
    } else {
      return '';
    }
    }
getColorDenomination() {
if (this.problemeDenomination ) {
  return '1px solid red';
} else {
  return '';
}
}
getColorCimaCompagnie() {
if (this.problemecimaCompagnie ) {
  return '1px solid red';
} else {
  return '';
}

}
}
