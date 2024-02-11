import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Pays } from '../../../../../model/pays';
import { User } from '../../../../../model/User';
import { UserService } from '../../../../../services/user.service';
import countries from '../../../../data/countries.json';
import dateFormatter from 'date-format-conversion';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { Router } from '@angular/router';
import { PaysService } from '../../../../../services/pays.service';

@Component({
  selector: 'ngx-modif-pays',
  templateUrl: './modif-pays.component.html',
  styleUrls: ['./modif-pays.component.scss']
})
export class ModifPaysComponent implements OnInit {

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  modifForm = this.fb.group({
    //pays_id: [''],
    pays_code: ['', [Validators.required]],
    pays_codecima: ['', [Validators.required]],
    pays_libellelong: ['', [Validators.required]],
    pays_libellecourt: [''],
    pays_devise: [''],
    pays_multidevise: ['', [Validators.required]],
    pays_multillangue: ['', [Validators.required]],
    pays_nationalite:  [''],
    pays_codeutilisateur: [''],
    pays_datemodification: [''],
  });
  id: number;
  pays: Pays;  
  multi_devise: any;
  multil_langue: any;
  libelle_long: String;
  libelle_court: any;
  devise: String;
  code:any;
  dateMJS: Date;
  login:any;
  user: User;
  @Input() listPays:any [] =countries;

  autorisation: [];

  constructor(private userService: UserService, private payService: PaysService,
    private authService: NbAuthService,private transfertData: TransfertDataService,private router: Router,
    private fb: FormBuilder,private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
 
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
 
    });

    this.pays = this.transfertData.getData();
    
    this.getlogin(); 
       // this.modifForm.controls['pays_id'].setValue(this.pays.pays_id);
        this.modifForm.controls['pays_code'].setValue(this.pays.pays_code);
        this.code =this.pays.pays_code;

        this.modifForm.controls['pays_codecima'].setValue(this.pays.pays_codecima);

        this.modifForm.controls['pays_libellelong'].setValue(this.pays.pays_libellelong);   
        this.libelle_long =this.pays.pays_libellelong.toString();
        console.log(this.libelle_long);

        this.modifForm.controls['pays_libellecourt'].setValue(this.pays.pays_libellecourt);  
        this.libelle_court=this.pays.pays_libellecourt;
        
        this.modifForm.controls['pays_devise'].setValue(this.pays.pays_devise);
        this.devise=this.pays.pays_devise;
        
        this.modifForm.controls['pays_multidevise'].setValue(this.pays.pays_multidevise);
        this.multi_devise =this.pays.pays_multidevise.toString();

        this.modifForm.controls['pays_multillangue'].setValue(this.pays.pays_multillangue);
        this.multil_langue = this.pays.pays_multillangue.toString();
              
        this.modifForm.controls['pays_nationalite'].setValue(this.pays.pays_nationalite);
        this.modifForm.controls['pays_codeutilisateur'].setValue(this.pays.pays_codeutilisateur);
        
        //this.dateMJS=dateFormatter(this.pays.pays_datemodification,  'yyyy-MM-ddThh:mm');
        //this.modifForm.controls['pays_datemodification'].setValue(this.dateMJS);
        
             // console.log(this.pays);
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

  cancel() {
    this.router.navigateByUrl('home/gestion_pays');
  }

  submit() {
    this.modifForm.controls['pays_datemodification'].setValue(new Date());
    this.modifForm.controls['pays_codeutilisateur'].setValue(this.user.util_numero);
    
    this.payService.update(this.modifForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'Pays modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion_pays');
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
  onChange(event) {
    console.log(event);
    this.modifForm.controls['pays_multillangue'].setValue(event);
  }
  onChangeDevise(event) {
    console.log(event);
    this.modifForm.controls['pays_multidevise'].setValue(event);
  }/*
  onChangeLbL(event) {
    console.log(event);
    this.modifForm.controls['pays_libellelong'].setValue(event);
  }
  onChangeLbC(event) {
    console.log(event);
    this.modifForm.controls['pays_libellecourt'].setValue(event);
  }*/
  onChangeLibele(event)  {
    console.log(event);
    
    this.modifForm.controls['pays_libellelong'].setValue(event);
    this.modifForm.controls['pays_codecima'].setValue((this.listPays.find(p => p.name === event)).alpha2Code);
    this.modifForm.controls['pays_devise'].setValue((this.listPays.find(p => p.name === event)).currencies[0].code);
    this.modifForm.controls['pays_libellecourt'].setValue((this.listPays.find(p => p.name === event)).alpha2Code);
    this.modifForm.controls['pays_nationalite'].setValue((this.listPays.find(p => p.name === event)).demonym);
    this.modifForm.controls['pays_code'].setValue(((this.listPays.find(p => p.name === event)).callingCodes).toString());
    
        //console.log((this.listPays.find(p => p.name === event))) ;
    //console.log((this.listPays.find(p => p.name === event)).alpha2Code) ;
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  
  }
}
