import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Client } from '../../../../../../model/Client';
import { Contact } from '../../../../../../model/Contact';
import { ClientService } from '../../../../../../services/client.service';
import { ContactService } from '../../../../../../services/contact.service';
import { TransfertDataService } from '../../../../../../services/transfertData.service';

@Component({
  selector: 'ngx-updatecontact-client',
  templateUrl: './updatecontact-client.component.html',
  styleUrls: ['./updatecontact-client.component.scss']
})
export class UpdatecontactClientComponent implements OnInit {

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  contact: Contact;
  leader: boolean;
  mandataire: any;
  errorEmail: boolean;
  errorNumero: boolean;
  errorNumero2: boolean;
  errorMobile: boolean;
  displayErrorEmail: boolean = false;
  displayErrorNumero: boolean = false;  
  displayErrorNumero2: boolean = false;  
  displayErrorMobile: boolean = false;
  autorisation: [];
  leaderView: String;
  constructor(private fb: FormBuilder,private contactService: ContactService,
    private activatedroute: ActivatedRoute,private toastrService: NbToastrService,
    private transfertData: TransfertDataService,private router: Router,
    private clientService: ClientService,private authService: NbAuthService) { }

    numero_client: any;
    clients: Array<Client> = new Array<Client>();
    listClients: any []; 
    modifForm = this.fb.group({
      cont_numero: ['',[Validators.required]],
      cont_numeroclient: ['',[Validators.required]],
      cont_nom: ['',[Validators.required]],
      cont_prenom: ['',[Validators.required]],
      cont_leader: ['',[Validators.required]],
      cont_mandataire: ['',[Validators.required]],
      cont_telephonique1: ['', [Validators.required]],
      cont_telephonique2: [''],
      cont_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
      cont_mobile: ['', [Validators.required]],

    });
client: any;
  ngOnInit(): void {     
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
    });

        this.contact=this.transfertData.getData();
      
        this.onGetAllClient();
        this.modifForm.controls['cont_numero'].setValue(this.contact.cont_numero);
        this.modifForm.controls['cont_numeroclient'].setValue(this.contact.cont_numeroclient);
        this.numero_client = this.contact.cont_numeroclient;
        
        this.modifForm.controls['cont_nom'].setValue(this.contact.cont_nom);
        this.modifForm.controls['cont_prenom'].setValue(this.contact.cont_prenom);
        this.modifForm.controls['cont_leader'].setValue(this.contact.cont_leader);
        console.log(this.contact.cont_leader);
        /* if(this.contact.cont_leader != null){
        this.leader =this.contact.cont_leader.toString();
      } */
        this.modifForm.controls['cont_mandataire'].setValue(this.contact.cont_mandataire);
        this.mandataire =this.contact.cont_mandataire.toString();
        this.modifForm.controls['cont_telephonique1'].setValue(this.contact.cont_telephonique1);
        this.modifForm.controls['cont_telephonique2'].setValue(this.contact.cont_telephonique2);
        this.modifForm.controls['cont_email'].setValue(this.contact.cont_email);
        this.modifForm.controls['cont_mobile'].setValue(this.contact.cont_mobile);    


        this.onchangeMail ();
        this.onchangeNumero();
        this.contactLeader(this.numero_client)
      }
      contactLeader(id: number){
        this.contactService.getNombreLeader(id)
        .subscribe((data) => {
          console.log(data);
          if(data.message == "pas de modification" && this.contact.cont_leader== true ){
            this.leader= true;
            this.leaderView= 'true';
            this.onChange('true');
            this.modifForm.controls['cont_leader'].setValue('true');
            //this.addForm.controls['cont_leader'].disable();
          }else{
            this.leader= false;
            this.modifForm.controls['cont_leader'].setValue(this.contact.cont_leader);
            this.leaderView=(this.contact.cont_leader).toString();
            //this.addForm.controls['cont_leader'].enable();
          }
      });
      }

  onchangeMail () {
    this.displayErrorEmail = true;
    if(this.modifForm.controls['cont_email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }

  }
  onchangeNumero () {
    this.displayErrorNumero = true;
    if(this.modifForm.controls['cont_telephonique1'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }
  onchangeNumero2 () {
    this.displayErrorNumero2 = true;
    if(this.modifForm.controls['cont_telephonique2'].valid == true ){
      this.errorNumero2 = true;
    }else{
      this.errorNumero2 = false;
    }
  }
  onchangeMobile () {
    this.displayErrorMobile = true;
    if(this.modifForm.controls['cont_mobile'].valid == true ){
      this.errorMobile = true;
    }else{
      this.errorMobile = false;
    }
  }
  onChangeClient(event){
    this.modifForm.controls['cont_numeroclient'].setValue(event);
      }
  onGetAllClient(){
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
          this.clients = data;
          this.listClients = data as Client[];
      });
  }

  cancel() {
    this.transfertData.setData(this.contact.cont_numeroclient);
    this.router.navigateByUrl('home/contact');
  }
  onGetLibelleByClient(numero: any) {
    if(((this.clients?.find(b => b.clien_numero === numero))?.clien_nature) ==="1"){
      return numero + " : " + (this.clients?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom;
  
    }else
    return numero + " : " + (this.clients?.find(b => b.clien_numero === numero))?.clien_denomination;
  
    }
  submit() {
    //this.ref.close(this.modifForm.value);
    this.modifForm.controls['cont_telephonique1'].setValue(this.modifForm.controls['cont_telephonique1'].value.internationalNumber);
    this.modifForm.controls['cont_telephonique2'].setValue(this.modifForm.controls['cont_telephonique2'].value?.internationalNumber);
    this.modifForm.controls['cont_mobile'].setValue(this.modifForm.controls['cont_mobile'].value.internationalNumber);
    
    this.contactService.update(this.modifForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'Contact modifié avec succes !',
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
        this.router.navigateByUrl('home/contact');
    },
      (error) => {
        console.log(error);
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
  onChangeMandataire(event) {

    this.modifForm.controls['cont_mandataire'].setValue(event);
  }
  onChange(event) {
    console.log(event);
    this.modifForm.controls['cont_leader'].setValue(event);
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
}
