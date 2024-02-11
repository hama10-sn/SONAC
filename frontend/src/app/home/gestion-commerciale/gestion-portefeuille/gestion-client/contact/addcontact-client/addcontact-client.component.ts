import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Client } from '../../../../../../model/Client';
import { ClientService } from '../../../../../../services/client.service';
import { ContactService } from '../../../../../../services/contact.service';
import { TransfertDataService } from '../../../../../../services/transfertData.service';

@Component({
  selector: 'ngx-addcontact-client',
  templateUrl: './addcontact-client.component.html',
  styleUrls: ['./addcontact-client.component.scss']
})
export class AddcontactClientComponent implements OnInit {

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  cont_leader: String;
  clients: Array<Client> = new Array<Client>();
  listClients: any []; 
  errorEmail: boolean;
  
  errorEmailDG: boolean;
  errorNumero: boolean;
  errorNumero2: boolean;  
  errorMobile: boolean;
  displayErrorEmail: boolean = false;
  leader: boolean;
  leaderView: String;
  
  displayErrorEmailDG: boolean = false;
  displayErrorNumero: boolean = false;
  displayErrorNumero2: boolean = false;  
  displayErrorMobile: boolean = false;
  autorisation :[];

  addForm = this.fb.group({
    cont_numero: [''],
    cont_numeroclient: ['',[Validators.required]],
    cont_nom: ['',[Validators.required]],
    cont_prenom: ['',[Validators.required]],
    cont_leader: ['',[Validators.required]],    
    cont_mandataire: ['',[Validators.required]],
    cont_telephonique1: ['', [Validators.required]],
    cont_telephonique2: [''],
    cont_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    cont_mobile:['', [Validators.required]],
  });
  constructor(
    private fb: FormBuilder,private contactService: ContactService,
    private toastrService: NbToastrService,private router: Router,
    private transfertData: TransfertDataService,private clientService: ClientService,
    private activatedroute: ActivatedRoute,private authService: NbAuthService) { }
    numero_client: any;
  ngOnInit(): void {

    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
    });

    this.numero_client= this.transfertData.getData();
    this.contactLeader();
      this.addForm.controls['cont_numeroclient'].setValue(this.numero_client);
    
    console.log(this.numero_client);
  }
  onGetAllClient(){
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
          this.clients = data;
          this.listClients = data as Client[];
      });
  }
  onChangeClient(event){
this.addForm.controls['cont_numeroclient'].setValue(event);

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
        this.transfertData.setData(this.numero_client);
        this.router.navigateByUrl('home/gestion-prospect/ouverturecompte');
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
        this.transfertData.setData(this.numero_client);
        this.router.navigateByUrl('home/contact');
      }
      contactLeader(){
        this.contactService.allContactByClient(this.numero_client)
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
        console.log(event);
        this.addForm.controls['cont_leader'].setValue(event);
      }
      onchangeMail () {
        this.displayErrorEmail = true;
        if(this.addForm.controls['cont_email'].valid == true ){
          this.errorEmail = true;
        }else{
          this.errorEmail = false;
        }
    
      }
      onchangeMailDG () {
        this.displayErrorEmailDG = true;
        if(this.addForm.controls['cont_email'].valid == true ){
          this.errorEmailDG = true;
        }else{
          this.errorEmailDG = false;
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
      onchangeMobile () {
        this.displayErrorMobile = true;
        if(this.addForm.controls['cont_mobile'].valid == true ){
          this.errorMobile= true;
        }else{
          this.errorMobile = false;
        }
      }
      onChangeMandataire(event) {

        this.addForm.controls['cont_mandataire'].setValue(event);
      }
      onchangeNumero2 () {
        this.displayErrorNumero2 = true;
        if(this.addForm.controls['cont_telephonique2'].valid == true ){
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
}
