import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Client } from '../../../../../model/Client';
import { Contact } from '../../../../../model/Contact';
import { ClientService } from '../../../../../services/client.service';
import { ContactService } from '../../../../../services/contact.service';

@Component({
  selector: 'ngx-ajout-contact',
  templateUrl: './ajout-contact.component.html',
  styleUrls: ['./ajout-contact.component.scss']
})
export class AjoutContactComponent implements OnInit {
  
  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  cont_leader: String;
  //clients: Array<Client> = new Array<Client>();
 // listClients: any []; 
  errorEmail: boolean;
  errorNumero: boolean;
  errorNumero2: boolean;
  errorMobile: boolean;

  autorisation: [];

  displayErrorEmail: boolean = false;
  displayErrorNumero: boolean = false;
  displayErrorNumero2: boolean = false;
  displayErrorMobile: boolean = false;

  
  leader: boolean;
  leaderView: String;

  
  addForm = this.fb.group({
    cont_numero: [''],
    cont_numeroclient: ['',[Validators.required]],
    cont_nom: ['',[Validators.required]],
    cont_prenom: ['',[Validators.required]],
    cont_mandataire: ['',[Validators.required]],
    cont_leader: ['',[Validators.required]],
    cont_telephonique1: ['', [Validators.required]],
    cont_telephonique2: [''],
    cont_email:  ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    cont_mobile: ['', [Validators.required]],    
  });

 // ================ Déclarations des variables pour la recherche avec filtre ======================
 clientss: Array<Client> = new Array<Client>();
 //classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

 /** control for the selected classification */
 public clientsCtrl: FormControl = new FormControl();
 //public classifCtrl: FormControl = new FormControl();

 /** control for the MatSelect filter keyword */
 public clientsFilterCtrl: FormControl = new FormControl();
 //public classifFilterCtrl: FormControl = new FormControl();

 /** list of classifications filtered by search keyword */
 public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
 //public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();

 @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

 /** Subject that emits when the component has been destroyed. */
 protected _onDestroy = new Subject<void>();

 // ========================================== FIN Déclaration ======================================

  constructor(
    private fb: FormBuilder,
    private authService: NbAuthService,private contactService: ContactService,
    private toastrService: NbToastrService,private router: Router,
    private clientService: ClientService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });

    this.onGetAllClient();
   // =================== Listen for search field value changes =======================
   this.clientsFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
     this.filterClients();
   });

 
}

ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}

protected filterClients() {
  console.log(this.clientss.filter(cl => cl.clien_nom));
  if (!this.clientss) {
    return;
  }
  // get the search keyword
  let search = this.clientsFilterCtrl.value;
  if (!search) {
    this.filteredClients.next(this.clientss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredClients.next(
    this.clientss.filter(cl => cl.clien_prenom?.toLowerCase().indexOf(search) > -1 || 
     cl.clien_denomination?.toLowerCase().indexOf(search)  > -1 ||
    
     cl.clien_sigle?.toLowerCase().indexOf(search) > -1 ||
     cl.clien_nom?.toLowerCase().indexOf(search) > -1 || 
     cl.clien_numero.toString().indexOf(search) > -1
    )
    
  );
}

// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================
  /*onGetAllClient(){
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
          this.clients = data;
          this.listClients = data as Client[];
      });
  }*/
  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientss = data as Client[];
        this.filteredClients.next(this.clientss.slice());
      });
  }
  onchangeMail () {
    this.displayErrorEmail = true;
    if(this.addForm.controls['cont_email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }

  }
  onchangeMobile () {
    this.displayErrorMobile = true;
    if(this.addForm.controls['cont_mobile'].valid == true ){
      this.errorMobile = true;
    }else{
      this.errorMobile = false;
    }
  }
  onchangeNumero () {
    this.displayErrorNumero = true;
    if(this.addForm.controls['cont_telephonique1'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }
  onchangeNumero2 () {
    this.displayErrorNumero2 = true;
    if(this.addForm.controls['cont_telephonique2'].valid == true ){
      this.errorNumero2 = true;
    }else{
      this.errorNumero2 = false;
    }
  }
  onChangeClient(event){
    console.log(this.nbLeader(event.value));
    this.addForm.controls['cont_numeroclient'].setValue(event.value);
    this.contactLeader(event.value);
  }
  submit() { 
    this.addForm.controls['cont_telephonique1'].setValue(this.addForm.controls['cont_telephonique1'].value.internationalNumber);
    this.addForm.controls['cont_telephonique2'].setValue(this.addForm.controls['cont_telephonique2'].value?.internationalNumber);
    this.addForm.controls['cont_mobile'].setValue(this.addForm.controls['cont_mobile'].value.internationalNumber);
    this.contactService.addContacte(this.addForm.value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Contact Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion-contact');
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
      cancel() {
        this.router.navigateByUrl('home/gestion-contact')
      }/*
      contactLeader(id: number){
        this.contactService.allContactByClient(id)
        .subscribe((data) => {
          console.log(data);
          if(data.message == "liste vide" ){
            this.leader= 'true';
            this.onChange(true);
            this.addForm.controls['cont_leader'].disable();
          }else{
            this.leader= '';
            this.addForm.controls['cont_leader'].enable();
          }
      });  findNbLeader
      }*/
      nbLeader(id: number){
        this.contactService.getNombreLeader(id)
        .subscribe((data) => {
          console.log(data);
          
          
      });
      }

      contactLeader(id: number){
        this.contactService.allContactByClient(id)
        .subscribe((data) => {
          console.log(data);
          if(data.message == "liste vide" ){
            this.leader= true;
            this.leaderView= 'true';
            this.onChange('true');
            this.addForm.controls['cont_leader'].setValue('true');
            //this.addForm.controls['cont_leader'].disable();
          }else{
            this.leader= false;
            this.leaderView='';
            //this.addForm.controls['cont_leader'].enable();
          }
      });
      }
      onChange(event) {
        this.addForm.controls['cont_leader'].setValue(event);
      }
      onChangeMandataire(event) {

        this.addForm.controls['cont_mandataire'].setValue(event);
      }

      check_fonct(fonct: String) {

        let el = this.autorisation.findIndex(itm => itm === fonct);
        if (el === -1)
         return false;
        else
         return true;
    
      }
}
