import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { User } from '../../../../../model/User';
import { BanqueService } from '../../../../../services/branque.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'ngx-add-banque',
  templateUrl: './add-banque.component.html',
  styleUrls: ['./add-banque.component.scss']
})
export class AddBanqueComponent implements OnInit {

  addForm = this.fb.group({

    banq_codebanque: ['', [Validators.required]],
    banq_codenormalise: [''],
    banq_denomination: ['', [Validators.required]],
    banq_sigle: [''],
    banq_datecreation: [''],
    banq_codeutilisateur: [''],

  });

  autorisation = [];

  // variable pour le controle de validation
  problemeDenomination: boolean = false;
  problemeCodeBanque: boolean = false;

  erreur: boolean;

  denomination: string;
  codeBanque: number;

  login_demandeur: string;
  demandeur: string;
  user: User;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private tansfertData: TransfertDataService,
    private banqueService: BanqueService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  // ============ Controle de validation ===========
  onFocusOutEventCodeBanque() {
    this.codeBanque = this.addForm.get("banq_codebanque").value;
    if (this.codeBanque == null || this.codeBanque == 0) {
      this.problemeCodeBanque = true;
      this.erreur = true;
    } else {
      this.problemeCodeBanque = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDenomination() {
    this.denomination = this.addForm.get("banq_denomination").value;
    if (this.denomination == null || this.denomination == "") {
      this.problemeDenomination = true;
      this.erreur = true;
    } else {
      this.problemeDenomination = false;
      this.erreur = false;
    }
  }

  // ============ Get Color Methode =================
  getColorCodeBanque() {
    if (this.problemeCodeBanque) {
      return '1px solid red';
    } else {
      return '';
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

    this.addForm.get('banq_codeutilisateur').setValue(this.user.util_numero);
    console.log(this.addForm.value);

    this.banqueService.addBanque(this.addForm.value)
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
