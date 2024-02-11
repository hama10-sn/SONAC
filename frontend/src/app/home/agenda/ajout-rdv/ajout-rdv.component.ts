import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Rdv } from '../../../model/Rdv';
import { User } from '../../../model/User';
import { UserService } from '../../../services/user.service';
import { AjoutRoleComponent } from '../../gestion-utilisateur/gestion_role/role/ajout-role/ajout-role.component';
import '../ckeditor.loader';
import 'ckeditor';
import { Router } from '@angular/router';
import { RdvService } from '../../../services/rdv.service';
@Component({
  selector: 'ngx-ajout-rdv',
  templateUrl: './ajout-rdv.component.html',
  styleUrls: ['./ajout-rdv.component.scss' ]
})
export class AjoutRdvComponent implements OnInit {

  addForm = this.fb.group({

    titre: ['', [Validators.required, Validators.minLength(2)]],
   // autorisation: [''],
    date_deb: ['', [Validators.required]],
    date_fin: ['', [Validators.required]],
    id_agent: [''],
    nbre: [''],
    unite: [''],
    comment_agent: [''],
    type: [''],
  });

  login: any;
  user: User;
  rdv: Rdv;
  selectedItem = 'Jour';
  selectedType = 'RDV';
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  problemeDate: boolean = false;
  erreur: boolean = false;

  constructor(/*protected ref: NbDialogRef<AjoutRoleComponent>,*/ private authService: NbAuthService,
     private fb: FormBuilder, private userService: UserService, private router: Router,
     private toastrService: NbToastrService, private rdvService: RdvService) { }

ngOnInit(): void {
this.getlogin();
this.addForm.controls['unite'].setValue('Jour');
this.addForm.controls['nbre'].setValue('1');
this.addForm.controls['type'].setValue('RDV');

}
cancel() {
//this.ref.close();
this.router.navigateByUrl('home/agenda');
}

submit() {

this.addForm.controls['id_agent'].setValue(this.user.util_numero);
//this.ref.close(this.addForm.value);

this.rdvService.addRdv(this.addForm.value)
     .subscribe(() => {
       this.toastrService.show(
         'RDV enregistré avec succes !',
         'Notification',
         {
           status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
           position: this.position,
           preventDuplicates: false,
         });
         this.router.navigateByUrl('home/agenda');
     },
     (error) => {
       this.toastrService.show(
         'une erreur est survenue',
         'Notification',
         {
           status: this.statusFail,
           destroyByClick: true,
           duration: 300000,
           hasIcon: true,
           position: this.position,
          preventDuplicates: false,
        });

  });
}
/*onChange(event) {
console.log(event);
this.addForm.controls['typ_type'].setValue(event) ;
}*/
getlogin(): any {
  this.authService.getToken()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.login = token.getPayload();
        this.userService.getUser(this.login.sub)
    .subscribe((data: User) => {
      this.user = data;
     // console.log(this.user);
    });
      }
    });
}

onChangeUnite(event) {
  console.log(event);
  this.addForm.controls['unite'].setValue(event);
}
onChangeType(event) {
  console.log(event);
  this.addForm.controls['type'].setValue(event);
}

getColorDate() {
  if (this.problemeDate) {
    return '1px solid red';
  } else {
    return '';
  }
}

onFocusOutEventDate(event: any) {
 // console.log(this.addForm.get('date_fin').value);

  if (this.addForm.get('date_deb').value != null && this.addForm.get('date_fin').value != null) {
    if (this.addForm.get('date_deb').value > this.addForm.get('date_fin').value) {
      this.problemeDate = true;
      this.erreur = true;
    } else {
      this.problemeDate = false;
      this.erreur = false;
    }
  }
}

}
