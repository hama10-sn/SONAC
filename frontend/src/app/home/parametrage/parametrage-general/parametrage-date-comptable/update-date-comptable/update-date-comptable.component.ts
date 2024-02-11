import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import dateFormatter from 'date-format-conversion';
import { Subject } from 'rxjs';
import { DateComptable } from '../../../../../model/DateComptable';
import { User } from '../../../../../model/User';
import { DateComptableService } from '../../../../../services/date-comptable.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'ngx-update-date-comptable',
  templateUrl: './update-date-comptable.component.html',
  styleUrls: ['./update-date-comptable.component.scss']
})
export class UpdateDateComptableComponent implements OnInit {
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  modifForm = this.fb.group({
    datecompt_typtable: ['', Validators.required],
    datecompt_typcentral: ['', Validators.required],
    datecompt_codejournal: ['', Validators.required],
    datecompt_libellejourn: ['', Validators.required],
    datecompt_datejourn: ['', Validators.required],
    datecompt_datemens: ['', Validators.required],
    datecompt_dateexercice: ['', Validators.required],
    datecompt_cloture: ['', Validators.required],
    //datecompt_clotproch: ['', Validators.required],
    //datecompt_exerciceouv: ['', Validators.required],
    datecompt_coduser: [''],
    datecompt_datemodif:[''],
    datecompt_codtable:['']
  });

  comptable: DateComptable;
  login: any;
  user: User;
  autorisation: [];

  datecompt_type: string;
  datecompt_centralisation: string;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private transfertData: TransfertDataService,
    private dateComptableService: DateComptableService) { }

  ngOnInit(): void {
    this.comptable = this.transfertData.getData();
    console.log(this.comptable)
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }

      });

    this.getlogin();
    this.modifForm.controls['datecompt_codtable'].setValue(this.comptable.datecompt_codtable);
    this.modifForm.controls['datecompt_typtable'].setValue(this.comptable.datecompt_typtable);
    this.modifForm.controls['datecompt_typcentral'].setValue(this.comptable.datecompt_typcentral);
    this.modifForm.controls['datecompt_codejournal'].setValue(this.comptable.datecompt_codejournal);
    this.modifForm.controls['datecompt_libellejourn'].setValue(this.comptable.datecompt_libellejourn);
    this.modifForm.controls['datecompt_datejourn'].setValue(dateFormatter(this.comptable.datecompt_datejourn,"yyyy-MM-dd"));
    this.modifForm.controls['datecompt_datemens'].setValue(this.comptable.datecompt_datemens);
    this.modifForm.controls['datecompt_dateexercice'].setValue(this.comptable.datecompt_dateexercice);
    this.modifForm.controls['datecompt_cloture'].setValue(this.comptable.datecompt_cloture);
    //this.modifForm.controls['datecompt_clotproch'].setValue(this.comptable.datecompt_clotproch);
    //this.modifForm.controls['datecompt_exerciceouv'].setValue(this.comptable.datecompt_exerciceouv);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {
              this.user = data;
            });
        }
      });
  }

  onSubmit() {
    this.modifForm.get('datecompt_coduser').setValue(this.user.util_numero);
    this.modifForm.get('datecompt_datemodif').setValue(new Date());
    this.dateComptableService.updateDateComptable(this.modifForm.value)
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

          this.transfertData.setData(data.data);
          this.router.navigateByUrl('home/parametrage-comptable/parametrage-date-comptable');
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

  onChangeType(event) {
    this.modifForm.controls['datecompt_typtable'].setValue(event);
  }

  onChangeCentre(event) {
    this.modifForm.controls['datecompt_typcentral'].setValue(event);
  }

  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')
  }

  cancel() {
    this.router.navigateByUrl('home/parametrage-comptable/parametrage-date-comptable');
  }

  onGetTypeTableByCode(code: any) {
    if (code == 1) {
      return 'Comptable';
    } else if (code == 2) {
      return 'Production';
    } else if (code == 3) {
      return 'Sinistre';
    } else if (code == 4) {
      return 'Traitement mensuel';
    } else if (code == 5) {
      return 'Traitement annuel';
    } else {
      return '';
    }
  }

  onGetTypeCentralisationByCode(code: any) {
    if (code == 'J') {
      return 'Journalière'
    } else if (code == "M") {
      return 'Mensuel';
    } else if (code == "T") {
      return 'Trimestriel';
    } else if (code == "A") {
      return 'Annuel';
    } else {
      return '';
    }
  }
  onfocusDateJournal(){
    let date = this.modifForm.get("datecompt_datejourn").value.toString();
    console.log(date)
    let an = date[0]+date[1]+date[2]+date[3];
    let mois=date[5]+date[6]
    this.modifForm.controls['datecompt_datemens'].setValue(mois+"/"+an);
    this.modifForm.controls['datecompt_dateexercice'].setValue(Number(an));
  }
}
