import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Rdv } from '../../../model/Rdv';
import dateFormatter from 'date-format-conversion';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserService } from '../../../services/user.service';
import { User } from '../../../model/User';
import '../ckeditor.loader';
import 'ckeditor';
import { RdvService } from '../../../services/rdv.service';
import { Router } from '@angular/router';
import { TransfertDataService } from '../../../services/transfertData.service';
@Component({
  selector: 'ngx-modif-rdv',
  templateUrl: './modif-rdv.component.html',
  styleUrls: ['./modif-rdv.component.scss']
})
export class ModifRdvComponent implements OnInit {

  modifForm = this.fb.group({
    id_rdv: [''],
    titre: ['', [Validators.required]],
    date_deb: ['', [Validators.required]],
    date_fin: ['', [Validators.required]],
    comment_agent: [''],
    id_agent: [''],
    nbre: [''],
    unite: [''],
    type: [''],
     });

  date_debut: Date ;
  date_f: Date ;
  rdv: Rdv;
  login: any;
  user: User;
  selectedItem: String;
  selectedType: String;
  
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  problemeDate: boolean = false;
  erreur: boolean = false;
  
  // tslint:disable-next-line:max-line-length
  constructor(private toastrService: NbToastrService, private fb: FormBuilder, private rdvService: RdvService,
    // tslint:disable-next-line:max-line-length
    private authService: NbAuthService, private userService: UserService, private router: Router, private transfertData: TransfertDataService) { }

  ngOnInit(): void {

        this.rdv = this.transfertData.getData();

        this.date_debut = dateFormatter(this.rdv.date_deb, 'yyyy-MM-ddThh:mm') ;
        this.date_f = dateFormatter(this.rdv.date_fin, 'yyyy-MM-ddThh:mm') ;
        this.modifForm.controls['id_rdv'].setValue(this.rdv.id_rdv);
        this.modifForm.controls['titre'].setValue(this.rdv.titre);
        this.modifForm.controls['date_deb'].setValue(this.date_debut);
        this.modifForm.controls['date_fin'].setValue(this.date_f);
        this.modifForm.controls['comment_agent'].setValue(this.rdv.comment_agent);
        this.modifForm.controls['id_agent'].setValue(this.rdv.id_agent);
        this.modifForm.controls['unite'].setValue(this.rdv.unite);
        this.selectedItem = this.rdv.unite;
        this.modifForm.controls['nbre'].setValue(this.rdv.nbre);
        this.selectedType = this.rdv.type;
        this.modifForm.controls['type'].setValue(this.rdv.type);
        this.getlogin();

  }
  cancel() {
    //this.ref.close();
    this.router.navigateByUrl('home/agenda');
  }

  submit() {
    this.modifForm.controls['id_agent'].setValue(this.user.util_numero);
    //this.ref.close(this.modifForm.value);
    this.rdvService.updateRdv(this.modifForm.value, this.modifForm.controls['id_rdv'].value)
     .subscribe(() => {
       this.toastrService.show(
         'RDV modifié avec succes !',
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

  onChangeUnite(event) {
    console.log(event);
    this.modifForm.controls['unite'].setValue(event);
  
  }
  onChangeType(event) {
    console.log(event);
    this.modifForm.controls['type'].setValue(event);
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
  
    if (this.modifForm.get('date_deb').value != null && this.modifForm.get('date_fin').value != null) {
      if (this.modifForm.get('date_deb').value > this.modifForm.get('date_fin').value) {
        this.problemeDate = true;
        this.erreur = true;
      } else {
        this.problemeDate = false;
        this.erreur = false;
      }
    }
  }

}
