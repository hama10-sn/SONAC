import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import {dateFormatter} from 'date-format-conversion' ;
import { Cimacodificationcompagnie } from '../../../../../model/Cimacodificationcompagnie';
import { CimaCompagnie } from '../../../../../model/CimaCompagnie';
import { Groupe } from '../../../../../model/Groupe';
import { Pays } from '../../../../../model/pays';
import { User } from '../../../../../model/User';
import { CompagnieService } from '../../../../../services/compagnie.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { PaysService } from '../../../../../services/pays.service';
import { UserService } from '../../../../../services/user.service';
import { CompagnieComponent } from '../compagnie.component';
import type  from '../../../../data/type.json';
import { Router } from '@angular/router';
import countries from '../../../../data/countries.json';
import { getLocaleCurrencyCode, NumberFormatStyle, registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { Compagnie } from '../../../../../model/Compagnie';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'ngx-ajout-compagnie',
  templateUrl: './ajout-compagnie.component.html',
  styleUrls: ['./ajout-compagnie.component.scss']
})
export class AjoutCompagnieComponent implements OnInit {
  

    //telephone

    SearchCountryField = SearchCountryField;
    CountryISO = CountryISO;
    PhoneNumberFormat = PhoneNumberFormat;
  pays: Pays;
  groupe: Groupe;
  //codecompagnie: CimaCompagnie;
  listContries: any [];
  listGroupes: any [];
  listTypes: any [];
  listeCompagnie: any[];
  //listecodecimacomp: Cimacodificationcompagnie [];

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
  codecompagnie:string;
  payss: Array<Pays> = new Array<Pays>();
  groupes: Array<Groupe> = new Array<Groupe>();
  codecimacomp: Array<Cimacodificationcompagnie> = new Array<Cimacodificationcompagnie>();
  @Input() listPays:any [] =countries;
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
  problemecodecompagnie: boolean=false;
  problemecodecompagnieDelete: boolean=false;
  
  addForm = this.fb.group({
    comp_id:[''],
    comp_numero: ['', [Validators.required]],
    comp_codepays: ['', [Validators.required]],
    comp_codegroupe: [''],
     comp_type: ['', [Validators.required]],
     comp_rangmarche:[''],
     comp_camarche: [''],
     comp_carelation: [''],
    comp_denomination: ['', [Validators.required]],
     comp_sigle: ['', [Validators.required]],
    comp_adresse1: ['', [Validators.required]],
     comp_adresse2: [''],
    comp_telephone1: ['',  [Validators.required]],
    comp_telephone2: [''],
    comp_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    comp_contact:[''],
    comp_numerocontact:[''],
   comp_codeutilisateur: [''],
    comp_datemodification : [''],
  });
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  @Input() listTypecompagnie:any [] = type;
  cimacodecompagnie: Cimacodificationcompagnie [];
  autorisation = [];
  
  constructor(/*protected ref: NbDialogRef<CompagnieComponent>,*/private fb: FormBuilder,
    private payService: PaysService,private groupeService: GroupeService,private compagniService: CompagnieService,
    private userService: UserService, 
    private authService: NbAuthService,
    private router:Router,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    registerLocaleData( es );
    this.onGetAllPays();
    this.onGetAllGroupe();    
   this.getlogin();
   this.onGetAllCodecimacompagnie(); 
   console.log(this.codecimacomp);
  // this.chiffrAmarche = this.addForm.get("comp_camarche").value;
   this. listTypes=this.listTypecompagnie['TYPE_COMPAGNIE'];
   this.authService.onTokenChange()
   .subscribe((token: NbAuthJWTToken) => {

    if (token.isValid()) {
      this.autorisation = token.getPayload().fonctionnalite.split(',');
      console.log(this.autorisation);
    }

  });
  }
  onGetAllPays(){
    this.payService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.payss = data;
          this.listContries = data as Pays[];
      });
  }
  onGetAllTypeCompagnie(){
    this.payService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.payss = data;
          this.listContries = data as Pays[];
      });
  }
  onGetAllGroupe(){
    this.groupeService.getAllGroupes()
      .subscribe((data: Groupe[]) => {
          this.groupes = data;
          this.listGroupes = data as Groupe[];
      });
  }
  onGetAllCodecimacompagnie(){
    this.compagniService.getAllCodecimacompagnies()
      .subscribe((data: Cimacodificationcompagnie[]) => {
          this.codecimacomp = data as Cimacodificationcompagnie[];
         // this.listecodecimacomp = data as Cimacodificationcompagnie[];
         
      });
      
  }
  numberWithCommas(x) {
   // x = Number(this.replaceAll(x,'.',''));
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
   this.chiffrAmarche = Number(this.replaceAll((this.addForm.get("comp_camarche").value),'.',''));
    console.log(this.chiffrAmarche );
    if ( this.chiffrAmarche !=null || this.chiffrAmarche ==0 ){
      this.numberWithCommas(this.chiffrAmarche);
      console.log( this.numberWithCommas(this.chiffrAmarche));
     this.recupChiffre=this.numberWithCommas(this.chiffrAmarche);
     this.addForm.controls['comp_camarche'].setValue(this.numberWithCommas(this.chiffrAmarche));
     console.log(Number(this.replaceAll((this.addForm.get("comp_camarche").value),'.','')));
    } 
  
   
  }
   replaceAll(str, find, replace) {
     if(str==null)
     return null;
    var escapedFind=find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, 'g'), replace);
}

onFocusOutChiffreRelation() {
  //  this.chiffrArelation = this.addForm.get("comp_carelation").value;
  this.chiffrArelation = Number(this.replaceAll((this.addForm.get("comp_carelation").value),'.',''));
    if ( this.chiffrArelation !=null || this.chiffrArelation ==0 ){
      this.numberWithCommas(this.chiffrArelation);
      console.log(this.numberWithCommas(this.chiffrArelation));
   //this.recupChiffre=this.numberWithCommas(this.chiffrAmarche);
     this.addForm.controls['comp_carelation'].setValue(this.numberWithCommas(this.chiffrArelation));
    } 
}
  cancel() {
    this.router.navigateByUrl('/home/parametrage-general/compagnie');
   // this.ref.close();
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }

  submit() {
    this.addForm.controls['comp_telephone1'].setValue(this.addForm.controls['comp_telephone1'].value.internationalNumber);
    this.addForm.controls['comp_telephone2'].setValue(this.addForm.controls['comp_telephone2'].value?.internationalNumber);
    this.addForm.controls['comp_numerocontact'].setValue(this.addForm.controls['comp_numerocontact'].value?.internationalNumber);

    this.addForm.controls['comp_codeutilisateur'].setValue(parseInt('this.user.util_numero'));
    this.addForm.controls['comp_datemodification'].setValue(new Date());
   // console.log((this.addForm.get("comp_camarche").value).replace(".",""));
    this.addForm.controls['comp_camarche'].setValue(Number(this.replaceAll((this.addForm.get("comp_camarche").value),'.','')));
    this.addForm.controls['comp_carelation'].setValue(Number(this.replaceAll((this.addForm.get("comp_carelation").value),'.','')));
    //this.ref.close(this.addForm.value);
    this.compagniService.getAllCompagniesDelete()
    .subscribe((data: Compagnie[]) => {
        //this.taxes = data;
        this.listeCompagnie = data as Compagnie[];
        console.log(this.listeCompagnie);
//console.log(this.listeTaxes.find(p => p.taxe_codeproduit == this.codeproduit)?.taxe_codeproduit);    
          if(this.listeCompagnie.find(p => p.comp_numero == this.codecompagnie)) {
              this.problemecodecompagnieDelete = true;
             this.erreur = true
            // this.addForm.controls['taxe_codetaxe'].setValue("");
            } 
            else{
           //  console.log(this.listeTaxes.find(p => p.taxe_codeproduit === this.codeproduit)?.taxe_codetaxe!=0);    
            this.problemecodecompagnieDelete = false;
             this.erreur = false;
             
            }
          });

    this.compagniService.addCompagnie(this.addForm.value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        data.message,
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
        'Notification',
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
  onChange(event) {
    //console.log(event);    
    this.addForm.controls['comp_codepays'].setValue(event);
  }
  onChangeGroupe(event) {
    //console.log(event);    
    this.addForm.controls['comp_codegroupe'].setValue(event);
  }

  onChangeCodeCimaCompagnie(event) {
    console.log(event);
    this.codecompagnie = this.addForm.get("comp_numero").value;
    console.log(this.codecompagnie);
        this.compagniService.getAllCompagnies()
        .subscribe((data: Compagnie[]) => {
            //this.taxes = data;
            this.listeCompagnie = data as Compagnie[];
            console.log(this.listeCompagnie);
    //console.log(this.listeTaxes.find(p => p.taxe_codeproduit == this.codeproduit)?.taxe_codeproduit);    
              if(this.listeCompagnie.find(p => p.comp_numero == this.codecompagnie)) {
                  this.problemecodecompagnie = true;
                 this.erreur = true
                // this.addForm.controls['taxe_codetaxe'].setValue("");
                } 
                else{
               //  console.log(this.listeTaxes.find(p => p.taxe_codeproduit === this.codeproduit)?.taxe_codetaxe!=0);    
                this.problemecodecompagnie = false;
                 this.erreur = false;
                 
                }
              });

    this.addForm.controls['comp_numero'].setValue(event);
    this.addForm.controls['comp_codepays'].setValue(((this.listPays.find(p => p.alpha2Code === event.substring(0, 2)))?.callingCodes[0]));
    
  }
  onChangeLibeleType(event) {
    console.log(event);
    this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id);
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
    
    // this.telephone1 = this.addForm.get("comp_telephone1").value; 
    // console.log(typeof(this.telephone1 ));   
     if (this.addForm.controls['comp_email'].valid == true ) {
       this.problemeEmail = false;
       this.erreur = false
     } else {
       this.problemeEmail  = true;
       this.erreur = true;
     }
   }
  onFocusOutEventTelephone() {
    
   // this.telephone1 = this.addForm.get("comp_telephone1").value; 
   // console.log(typeof(this.telephone1 ));   
    if (this.addForm.controls['comp_telephone1'].valid == true ) {
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
     if (this.addForm.controls['comp_telephone2'].valid == true ) {
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
     if (this.addForm.controls['comp_numerocontact'].valid == true ) {
       this.problemeNumContact = false;
       this.erreur = false
     } else {
       this.problemeNumContact  = true;
       this.erreur = true;
     }
   }

  onFocusOutEventadresse() {
    
    this.adresse1 = this.addForm.get("comp_adresse1").value; 
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
    
    this.sigle = this.addForm.get("comp_sigle").value; 
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
    
    this.cimaCompagnie = this.addForm.get("comp_numero").value; 
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
    
    this.denomination = this.addForm.get("comp_denomination").value; 
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