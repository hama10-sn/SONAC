import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { Groupe } from '../../../../../model/Groupe';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { GroupeService } from '../../../../../services/groupe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import countries from '../../../../data/countries.json';
@Component({
  selector: 'ngx-modif-groupe',
  templateUrl: './modif-groupe.component.html',
  styleUrls: ['./modif-groupe.component.scss']
})
export class ModifGroupeComponent implements OnInit {
  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  modifForm = this.fb.group({
    group_code: ['', [Validators.required]],
    group_classif: ['', [Validators.required]],
    group_liblong: ['', [Validators.required]],
    group_libcourt: ['', [Validators.required]],
    group_siege: ['', [Validators.required]],
    group_adress1: ['', [Validators.required]],
    group_adress2: [''],
    group_email: ['', [Validators.required,Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    group_web: [''],
    group_teleph1: ['', [Validators.required]],
    group_teleph2: [''],
  });

  groupe: Groupe;
  classif: String;
  classifications: ClassificationSecteur[];
  listPays:any [] = countries;
  pays:string;
  errorEmail: boolean;
  errorNumero: boolean;
  autorisation = [];

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public classifCtrl: FormControl = new FormControl();
  public classifFilterCtrl: FormControl = new FormControl();
  public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();
  public siegeCtrl: FormControl = new FormControl();
  public siegeFilterCtrl: FormControl = new FormControl();
  public filteredsiege: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(/*protected ref: NbDialogRef<ModifGroupeComponent>,*/private fb: FormBuilder,
    private classifService: ClassificationSecteurService,private transfertData: TransfertDataService,
    private router:Router, private groupeService:GroupeService,private authService:NbAuthService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.groupe = this.transfertData.getData();

    this.authService.onTokenChange()
   .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       
     }

   });


    this.classifService.getAllGroupes()
    .subscribe((data: ClassificationSecteur[]) => {
      this.classifications = data;
      this.filteredClassif.next(this.classifications.slice());
      
    });

    this.modifForm.controls['group_code'].setValue(this.groupe.group_code);
    this.classifCtrl.setValue(this.groupe.group_classif.toString());
    //console.log(this.classifCtrl.value);
    this.modifForm.controls['group_classif'].setValue(this.groupe.group_classif);
    this.modifForm.controls['group_liblong'].setValue(this.groupe.group_liblong);
    this.modifForm.controls['group_libcourt'].setValue(this.groupe.group_libcourt);
    this.siegeCtrl.setValue(this.groupe.group_siege.toString());
    this.modifForm.controls['group_siege'].setValue(this.groupe.group_siege);
    this.modifForm.controls['group_adress1'].setValue(this.groupe.group_adress1);
    this.modifForm.controls['group_adress2'].setValue(this.groupe.group_adress2);
    this.modifForm.controls['group_email'].setValue(this.groupe.group_email);
    this.modifForm.controls['group_web'].setValue(this.groupe.group_web);
    this.modifForm.controls['group_teleph1'].setValue(this.groupe.group_teleph1);
    this.modifForm.controls['group_teleph2'].setValue(this.groupe.group_teleph2);
    this.classif = this.groupe.group_classif.toString();
    console.log(this.groupe);
    this.onchangeMail();
    this.onchangeNumero();
    //this.onChangeSiege(this.groupe.group_siege);

    


    this.classifFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBanks();
    });
    this.filteredsiege.next(this.listPays.slice());
      this.siegeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterSiege();
      });
}

// tslint:disable-next-line:use-lifecycle-interface
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
protected filterSiege() {
  if (!this.listPays) {
    return;
  }
  // get the search keyword
  let search = this.siegeFilterCtrl.value;
  if (!search) {
    this.filteredsiege.next(this.listPays.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredsiege.next(
    this.listPays.filter(siege => siege.name.toLowerCase().indexOf(search) > -1)
  );
}

  cancel() {
    //this.ref.close();
    this.router.navigateByUrl('home/groupe');
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
  onChangeSiege (event) {
    this.modifForm.controls['group_siege'].setValue(event.value);
  }
  onchangeMail () {
    if(this.modifForm.controls['group_email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }
  }
  onchangeNumero () {
    if(this.modifForm.controls['group_teleph1'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }

  submit() {
    //this.ref.close(this.modifForm.value);
    this.modifForm.controls['group_teleph1'].setValue(this.modifForm.controls['group_teleph1'].value.internationalNumber);
    this.modifForm.controls['group_teleph2'].setValue(this.modifForm.controls['group_teleph2'].value?.internationalNumber);
    this.groupeService.modifGroupe(this.modifForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'Groupe modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/groupe');
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        
    },
    );

  }
  onChange(event) {
    console.log(event);
    this.modifForm.controls['group_classif'].setValue(event);

  }
  onChangeClassification(event){
    this.modifForm.controls['group_classif'].setValue(event.value);
  }

}
