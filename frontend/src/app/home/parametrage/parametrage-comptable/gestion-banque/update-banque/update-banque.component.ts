import { Component, OnInit } from '@angular/core';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { User } from '../../../../../model/User';
import { BanqueService } from '../../../../../services/branque.service';
import { UserService } from '../../../../../services/user.service';
import { Banque } from '../../../../../model/Banque';

@Component({
  selector: 'ngx-update-banque',
  templateUrl: './update-banque.component.html',
  styleUrls: ['./update-banque.component.scss']
})
export class UpdateBanqueComponent implements OnInit {

  modifForm = this.fb.group({

    banq_codebanque: ['', [Validators.required]],
    banq_codenormalise: [''],
    banq_denomination: ['', [Validators.required]],
    banq_sigle: [''],
    banq_datecreation: [''],
    banq_codeutilisateur: [''],

  });

  user: User;
  banque: Banque;

  autorisation = [];
  problemeDenomination: boolean = false;
  // problemeCodeBanque: boolean = false;
  erreur: boolean;

  denomination: string;
  codeBanque: number;
  login_demandeur: string;
  demandeur: string;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private transfertData: TransfertDataService,
    private banqueService: BanqueService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {

    // console.log(this.transfertData.getData());
    this.banque = this.transfertData.getData();

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });

      this.modifForm.get("banq_codebanque").setValue(this.banque.banq_codebanque);
      this.modifForm.get("banq_codenormalise").setValue(this.banque.banq_codenormalise);
      this.modifForm.get("banq_denomination").setValue(this.banque.banq_denomination);
      this.modifForm.get("banq_sigle").setValue(this.banque.banq_sigle);
      
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onFocusOutEventDenomination() {
    this.denomination = this.modifForm.get("banq_denomination").value;
    if (this.denomination == null || this.denomination == "") {
      this.problemeDenomination = true;
      this.erreur = true;
    } else {
      this.problemeDenomination = false;
      this.erreur = false;
    }
  }

  getColorDenomination() {
    if (this.problemeDenomination) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  onSubmit() {

    this.modifForm.get('banq_codeutilisateur').setValue(this.user.util_numero);
    console.log(this.modifForm.value);
    
    this.banqueService.updateBanque(this.modifForm.value)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.toastrService.show(
            data.message,
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });

          this.router.navigateByUrl('home/parametrage/parametrage-comptable/gestion-banque');
        } else {
          this.toastrService.show(
            data.message,
            'Notification d\'erreur',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        }
      });

  }

  onCancel() {
    this.router.navigateByUrl('home/parametrage/parametrage-comptable/gestion-banque');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
