import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { ClassificationSecteur } from '../../../../../model/ClassificationSecteur';
import { ClassificationSecteurService } from '../../../../../services/classification-secteur.service';
import { GroupeService } from '../../../../../services/groupe.service';
import countries from '../../../../data/countries.json';

@Component({
  selector: 'ngx-ajout-groupe',
  templateUrl: './ajout-groupe.component.html',
  styleUrls: ['./ajout-groupe.component.scss']
})
export class AjoutGroupeComponent implements OnInit {

  //telephone

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
	//preferredCountries: CountryISO[] = [CountryISO.Senegal];


  addForm = this.fb.group({
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
  classifications: ClassificationSecteur[];
  listPays:any [] = countries;
  errorEmail: boolean;
  errorNumero: boolean;
  errorNumero2: boolean;
  autorisation = [];
  displayMailError: boolean  = false;
  displayNumeroError: boolean = false;
  displayNumeroError2: boolean = false;

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

  constructor(/*protected ref: NbDialogRef<AjoutGroupeComponent>,*/private fb: FormBuilder,
    private classifService: ClassificationSecteurService,private groupeService: GroupeService,
    private toastrService: NbToastrService,private router: Router , private authService: NbAuthService) { }

  ngOnInit(): void {

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

    this.classifFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClassif();
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

  protected filterClassif() {
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



  onchangeMail () {
    this.displayMailError = true;
    if(this.addForm.controls['group_email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }
  }
  onchangeNumero () {
    this.displayNumeroError = true;
    if(this.addForm.controls['group_teleph1'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
    
  }
  onchangeNumero2 () {
    this.displayNumeroError2 = true;
    if(this.addForm.controls['group_teleph2'].valid == true ){
      this.errorNumero2 = true;
    }else{
      this.errorNumero2 = false;
    }

  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
  cancel() {
    //this.ref.close();
    this.router.navigateByUrl('home/groupe');
    

  }

  onChangeSiege (event) {
    this.addForm.controls['group_siege'].setValue(event.value);
  }

  

  submit() {
   // this.ref.close(this.addForm.value);
   this.addForm.controls['group_teleph1'].setValue(this.addForm.controls['group_teleph1'].value.internationalNumber);
   this.addForm.controls['group_teleph2'].setValue(this.addForm.controls['group_teleph2'].value?.internationalNumber);
   console.log(this.addForm.value);
   this.groupeService.addGroupe(this.addForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'Groupe Enregistré avec succes !',
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
        error.error.message,
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
    this.addForm.controls['group_classif'].setValue(event);

  }
  onChangeClassification(event){
    this.addForm.controls['group_classif'].setValue(event.value);
  }

}
