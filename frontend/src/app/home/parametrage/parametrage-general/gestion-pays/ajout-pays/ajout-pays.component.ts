import { Route } from '@angular/compiler/src/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Pays } from '../../../../../model/pays';
import { User } from '../../../../../model/User';
import { PaysService } from '../../../../../services/pays.service';
import { UserService } from '../../../../../services/user.service';
import countries from '../../../../data/countries.json';

@Component({
  selector: 'ngx-ajout-pays',
  templateUrl: './ajout-pays.component.html',
  styleUrls: ['./ajout-pays.component.scss']
})
export class AjoutPaysComponent implements OnInit {

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  addForm = this.fb.group({
    pays_code: [''],
    pays_codecima: [''],
    pays_libellelong: ['', [Validators.required]],
    pays_libellecourt: [''],
    pays_devise: [''],
    pays_multidevise: ['', [Validators.required]],
    pays_multillangue: ['', [Validators.required]],
    pays_nationalite:  [''],
    pays_codeutilisateur: [''],
    pays_datemodification: [''],
  });
  pays: Pays;
  pays_multidevise: String;
  pays_multillangue: String;
//@Input() listPays:any [] =countries;
  login:any;
  user: User;
  autorisation: [];
  //listPaysTest:any [] =countries;

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

  constructor(private fb: FormBuilder,
    private userService: UserService, private router: Router,
    private toastrService: NbToastrService,
    private authService: NbAuthService,private payService : PaysService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
 
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
 
    });

    this.getlogin();
    
    this.filteredPays.next(this.listPayss.slice());
   // this.pays_multidevise="false";
   //console.log(this.listPays.find(p => p.name != 'Afghanistan').currencies[0].code);
        //this.pays_multillangue = "false";
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
  cancel() {
    this.router.navigateByUrl('home/gestion_pays');
  }

  submit() {
    this.addForm.controls['pays_datemodification'].setValue(new Date());
    this.addForm.controls['pays_codeutilisateur'].setValue(this.user.util_numero);
    
    this.payService.addPays(this.addForm.value)
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
        this.router.navigateByUrl('home/gestion_pays');
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
  }
  
  onChange(event) {
    //console.log(event);
    this.addForm.controls['pays_multillangue'].setValue(event);
  }
  onChangeDevise(event) {
    //console.log(event);
    this.addForm.controls['pays_multidevise'].setValue(event);
  }
  onChangeLibele(event) {
    //console.log(event);
    this.addForm.controls['pays_code'].setValue(((this.listPayss.find(p => p.name === event.value)).callingCodes[0]).toString());
    this.addForm.controls['pays_codecima'].setValue((this.listPayss.find(p => p.name === event.value)).alpha2Code);
    this.addForm.controls['pays_libellelong'].setValue(event.value);
    this.addForm.controls['pays_libellecourt'].setValue((this.listPayss.find(p => p.name === event.value)).alpha2Code);
    this.addForm.controls['pays_devise'].setValue((this.listPayss.find(p => p.name === event.value)).currencies[0].code);
    this.addForm.controls['pays_nationalite'].setValue(((this.listPayss.find(p => p.name === event.value)).demonym));
    // console.log(this.listPays.find(p => p.name != 'Afghanistan').currencies[0].code);
    // console.log((this.listPays.find(p => p.name === event))) ;
    // console.log((this.listPays.find(p => p.name === event)).alpha2Code) ;
    // console.log((this.listPays.find(p => p.name === event)).currencies[0].code)
  }
  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
      .subscribe((data: User) => {
        this.user = data;
        //console.log(this.user);
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
