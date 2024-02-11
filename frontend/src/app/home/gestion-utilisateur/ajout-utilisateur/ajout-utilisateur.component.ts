import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Client } from '../../../model/Client';
import { Role } from '../../../model/Role';
import { User } from '../../../model/User';
import { ClientService } from '../../../services/client.service';
import { RoleService } from '../../../services/role.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ngx-ajout-utilisateur',
  templateUrl: './ajout-utilisateur.component.html',
  styleUrls: ['./ajout-utilisateur.component.scss']
})
export class AjoutUtilisateurComponent implements OnInit {

  //telephone

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  addForm = this.fb.group({
    util_nom: ['', [Validators.required]],
    util_prenom: ['', [Validators.required]],
    util_numero: [''],
    util_denomination: [''],
    util_sigle: [''],
    util_type: ['', [Validators.required]],
    util_adresse: ['', [Validators.required]],
    util_telephonefixe: [''],
    util_telephoneportable: ['', [Validators.required]],
    util_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    util_numclient: [''],
    util_direction: [''],
    util_departement: [''],
    util_service: [''],
    util_poste: [''],
    util_status: ['', [Validators.required]],
    util_password: ['', [Validators.required,Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]],
    util_login: ['', [Validators.required]],
    util_profil: ['', [Validators.required]],
  });

  roles: Role[];
  client: Client;

  etatNumCli: Boolean = true;
  errorEmail: boolean;
  errorNumero: boolean;
  errorClient: boolean;
  afficheClient: boolean;
  displayDetailsClient: boolean = false;
  isAgent: boolean = true;
  isIdentique: boolean = false;
  passwordOk: string;
  passwordCOk: string;
  passwordC: string;
  errorLogin: boolean;
  showerrorLogin: boolean;
  nettoyage: string;
  displayAllError: boolean = false;
  displayMailError: boolean = false;
  displayNumeroError: boolean = false;
  displayMDPCError: boolean = false;
  displayOrganisation:boolean = true;
  displayClientError: boolean = false;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(/*protected ref: NbDialogRef<AjoutUtilisateurComponent>,*/private fb: FormBuilder,
    private roleService: RoleService,private userService: UserService,private clientService: ClientService,
    private toastrService: NbToastrService,private router: Router) { }

  ngOnInit(): void {
    this.roleService.getAllRoles()
    .subscribe((data: Role[]) => {
      this.roles = data;
      
    });
    this.addForm.controls['util_numclient'].disable();
    this.addForm.controls['util_numero'].disable();
    this.addForm.controls['util_type'].setValue('agent');
  }

  cancel() {
    this.router.navigateByUrl('home/gestion_utilisateur');
   // this.ref.close();
  }

  onchangeMail () {
    this.displayMailError = true;
    if(this.addForm.controls['util_email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }

  }
  onchangeLogin (event) {
    this.showerrorLogin = true;
    
    this.userService.getUser(event.target.value)
      .subscribe((data)  => {
        this.errorLogin = false;
      },
      (error)  => {
        this.errorLogin = true;
      });
    

  }
  onchangepassword () {
    //this.displayMDPCError = true;
    //this.onchangepasswordC(null);
    if(this.addForm.controls['util_password'].valid == true ){
      this.passwordOk = 'success';
    }else{
      this.passwordOk = 'danger';
    }

  }
  onchangepasswordC (event) {
    this.displayMDPCError = true;
    
    if(event != null){
    this.passwordC = event.target.value;
    }
    if(this.addForm.controls['util_password'].value == this.passwordC) {
      this.isIdentique = true;
      this.passwordCOk = 'success';
    }else{
      this.passwordCOk = 'danger';
      this.isIdentique = false;
    }

  }
  onchangeNumero () {
    this.displayNumeroError = true;
    if(this.addForm.controls['util_telephoneportable'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }
  onchangeClient (event) {
    this.displayClientError = true;
    this.errorClient = false;
    console.log(event.target.value);
    this.clientService.getClient(event.target.value)
      .subscribe((data) => {
        if(data != null){
          this.errorClient = true;
          this.client = data;
          this.displayDetailsClient = true;
        }else{
          this.errorClient = false;
          this.addForm.controls['util_numclient'].reset();
          this.displayDetailsClient = false;
        }
      });
    
  }
  

  submit() {
    //this.ref.close(this.addForm.value);
   

    if(!this.addForm.valid){
      this.displayAllError = true ;
    } else {
      this.addForm.controls['util_telephoneportable'].setValue(this.addForm.controls['util_telephoneportable'].value.internationalNumber);
      this.addForm.controls['util_telephonefixe'].setValue(this.addForm.controls['util_telephonefixe'].value?.internationalNumber);
    this.userService.addUser(this.addForm.value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Utilisateur Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion_utilisateur');
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
  }

  onChange(event) {
    console.log(event);
    this.addForm.controls['util_profil'].setValue(event);

  }
  onChangeStatus(event) {
    console.log(event);
    this.addForm.controls['util_status'].setValue(event);

  }

  onChangeTypeUser(event) {
    
    this.errorClient = false;
    console.log(event);
    this.addForm.controls['util_type'].setValue(event);
    if (event === 'agent') {
      this.roleService.getAllRoles()
    .subscribe((data: Role[]) => {
      this.roles = data;
      
    });
    this.displayOrganisation = true;
    this.nettoyage = '';
      this.isAgent = true;
      this.displayDetailsClient = false;
      this.addForm.controls['util_numclient'].disable();
      this.addForm.controls['util_numclient'].setValue('');
      this.addForm.controls['util_numclient'].clearValidators();
      this.addForm.controls['util_direction'].setValidators([Validators.required]);
      this.addForm.controls['util_departement'].setValidators([Validators.required]);
      this.addForm.controls['util_service'].setValidators([Validators.required]);
      this.addForm.controls['util_poste'].setValidators([Validators.required]);

      this.afficheClient = false;
    } else {
      this.displayOrganisation = false;
      this.nettoyage = '';
      this.roles = [new Role(null,'Client','sfsf',new Date(),new Date())];
      this.addForm.controls['util_profil'].setValue('Client');
      this.isAgent = false;
      this.afficheClient = true;
      this.displayDetailsClient = false;
      this.addForm.controls['util_numclient'].enable();
      this.addForm.controls['util_numclient'].setValidators([Validators.required]);
      this.addForm.controls['util_direction'].clearValidators();
      this.addForm.controls['util_departement'].clearValidators();
      this.addForm.controls['util_service'].clearValidators();
      this.addForm.controls['util_poste'].clearValidators();

    }

    this.addForm.controls['util_numclient'].updateValueAndValidity();
      this.addForm.controls['util_direction'].updateValueAndValidity();
      this.addForm.controls['util_departement'].updateValueAndValidity();
      this.addForm.controls['util_service'].updateValueAndValidity();
      this.addForm.controls['util_poste'].updateValueAndValidity();

  }

}
