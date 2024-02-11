import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthModule, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { Role } from '../../../model/Role';
import { User } from '../../../model/User';
import { RoleService } from '../../../services/role.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ngx-modif-utilisateur',
  templateUrl: './modif-utilisateur.component.html',
  styleUrls: ['./modif-utilisateur.component.scss']
})
export class ModifUtilisateurComponent implements OnInit {
 //telephone

 SearchCountryField = SearchCountryField;
 CountryISO = CountryISO;
 PhoneNumberFormat = PhoneNumberFormat;

  modifForm = this.fb.group({
    util_id: [''],
    util_nom: ['', [Validators.required]],
    util_prenom: ['', [Validators.required]],
    util_numero: [''],
    util_denomination: [''],
    util_sigle: [''],
    util_type: ['', [Validators.required]],
    util_adresse: ['', [Validators.required]],
    util_telephonefixe: [''],
    util_telephoneportable: ['', [Validators.required]],
    util_email: ['', [Validators.required,  Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    util_numclient: [''],
    util_direction: [''],
    util_departement: [''],
    util_service: [''],
    util_poste: [''],
    util_status: ['', [Validators.required]],
    util_password: ['', [Validators.required]],
    util_login: ['', [Validators.required]],
    util_profil: ['', [Validators.required]],
  });

  login: string;
  user: User;
  role: String;
  roles: Role[];
  status: String;
  type: String;
  displayAllError: boolean = false;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  errorNumero: boolean;
  errorEmail: boolean;
  displayOrganisation:boolean = true;

  autorisation = [];
  nonModifierChamps:boolean;

  constructor(/*protected ref: NbDialogRef<ModifUtilisateurComponent>,*/
              private userService: UserService ,private fb: FormBuilder,private roleService: RoleService,
              private activatedroute: ActivatedRoute, private toastrService: NbToastrService,private router: Router
              ,private transfertData: TransfertDataService, private authService: NbAuthService) { }

  ngOnInit(): void {
    this.roleService.getAllRoles()
    .subscribe((data: Role[]) => {
      this.roles = data;
      console.log(this.roles);
    });

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          
          this.userService.getUser(token.getPayload().sub)
          .subscribe((data:User) => {
            if(data.util_profil == 'Administrateur Général'){
              this.nonModifierChamps = false ;
            }else{
              this.nonModifierChamps = true ;
            }
          });
        }

      });


    
      
      
        this.user = this.transfertData.getData();
        this.modifForm.controls['util_id'].setValue(this.user.util_id);
        this.modifForm.controls['util_nom'].setValue(this.user.util_nom);
        this.modifForm.controls['util_prenom'].setValue(this.user.util_prenom);
        this.modifForm.controls['util_numero'].setValue(this.user.util_numero);
        this.modifForm.controls['util_denomination'].setValue(this.user.util_denomination);
        this.modifForm.controls['util_sigle'].setValue(this.user.util_sigle);
        this.modifForm.controls['util_type'].setValue(this.user.util_type);
        this.modifForm.controls['util_adresse'].setValue(this.user.util_adresse);
        this.modifForm.controls['util_telephonefixe'].setValue(this.user.util_telephonefixe);
        this.modifForm.controls['util_telephoneportable'].setValue(this.user.util_telephoneportable);
        this.modifForm.controls['util_email'].setValue(this.user.util_email);
        this.modifForm.controls['util_numclient'].setValue(this.user.util_numclient);
        this.modifForm.controls['util_direction'].setValue(this.user.util_direction);
        this.modifForm.controls['util_departement'].setValue(this.user.util_departement);
        this.modifForm.controls['util_service'].setValue(this.user.util_service);
        this.modifForm.controls['util_poste'].setValue(this.user.util_poste);
        this.modifForm.controls['util_status'].setValue(this.user.util_status);
        this.modifForm.controls['util_login'].setValue(this.user.util_login);
        this.modifForm.controls['util_password'].setValue(this.user.util_password);
        this.modifForm.controls['util_profil'].setValue(this.user.util_profil);
        this.role = this.user.util_profil;
        this.status = this.user.util_status;
        this.type = this.user.util_type;
        console.log(this.user);

        //this.modifForm.controls['util_numclient'].disable();
    this.modifForm.controls['util_numero'].disable();
      
  

        if(this.modifForm.controls['util_type'].value == 'client'){
          this.displayOrganisation= false;
          this.roles = null;
          this.roles = [new Role(null,'Client','sfsf',new Date(),new Date())];
          this.modifForm.controls['util_profil'].setValue('Client');
        }
        this.onchangeMail();
        this.onchangeNumero();
      
  }
  cancel() {
    this.router.navigateByUrl('home/gestion_utilisateur');
    //this.ref.close();
  }
  
  onchangeMail () {
    if(this.modifForm.controls['util_email'].valid == true ){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }

  }
  onchangeNumero () {
    if(this.modifForm.controls['util_telephoneportable'].valid == true ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }
  submit() {
    //this.ref.close(this.modifForm.value);
    
    if(!this.modifForm.valid){
      this.displayAllError = true ;
    } else {
      this.modifForm.controls['util_telephoneportable'].setValue(this.modifForm.controls['util_telephoneportable'].value.internationalNumber);
    this.modifForm.controls['util_telephonefixe'].setValue(this.modifForm.controls['util_telephonefixe'].value?.internationalNumber);
      this.modifForm.controls['util_numclient'].setValue(this.user.util_numclient);
    this.userService.modifUser(this.modifForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'Utilisateur modifié avec succes !',
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
        console.log(error);
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
    this.modifForm.controls['util_profil'].setValue(event);
  }
  onChangeStatus(event) {
    console.log(event);
    this.modifForm.controls['util_status'].setValue(event);

  }
  onChangeTypeUser(event) {
    console.log(event);
    this.modifForm.controls['util_type'].setValue(event);
    if (event === 'agent') {
      
      this.modifForm.controls['util_numclient'].clearValidators();
      this.modifForm.controls['util_direction'].setValidators([Validators.required]);
      this.modifForm.controls['util_departement'].setValidators([Validators.required]);
      this.modifForm.controls['util_service'].setValidators([Validators.required]);
      this.modifForm.controls['util_poste'].setValidators([Validators.required]);


    } else {
      this.roles = [new Role(null,'Client','sfsf',new Date(),new Date())];
      this.modifForm.controls['util_profil'].setValue('Client');
      this.modifForm.controls['util_numclient'].enable();
      this.modifForm.controls['util_numclient'].setValidators([Validators.required]);
      this.modifForm.controls['util_direction'].clearValidators();
      this.modifForm.controls['util_departement'].clearValidators();
      this.modifForm.controls['util_service'].clearValidators();
      this.modifForm.controls['util_poste'].clearValidators();

    }

    this.modifForm.controls['util_numclient'].updateValueAndValidity();
      this.modifForm.controls['util_direction'].updateValueAndValidity();
      this.modifForm.controls['util_departement'].updateValueAndValidity();
      this.modifForm.controls['util_service'].updateValueAndValidity();
      this.modifForm.controls['util_poste'].updateValueAndValidity();

  }

}
