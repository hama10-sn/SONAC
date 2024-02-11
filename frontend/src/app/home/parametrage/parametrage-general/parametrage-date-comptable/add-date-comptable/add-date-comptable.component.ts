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
  selector: 'ngx-add-date-comptable',
  templateUrl: './add-date-comptable.component.html',
  styleUrls: ['./add-date-comptable.component.scss']
})
export class AddDateComptableComponent implements OnInit {
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  addForm = this.fb.group({
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
    datecompt_datemodif:[]
  });

  comptable: DateComptable;
  login: any;
  user: User;
  autorisation: [];

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private transfertData: TransfertDataService,
    private dateComptableService: DateComptableService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }

      });

    this.getlogin();
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
    this.addForm.get('datecompt_coduser').setValue(this.user.util_numero);
    this.addForm.get('datecompt_datemodif').setValue(new Date());
    console.log(this.addForm.value)
    this.dateComptableService.addDateComptable(this.addForm.value)
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
  onfocusDateJournal(){
    let date = this.addForm.get("datecompt_datejourn").value.toString();
    console.log(date)
    let an = date[0]+date[1]+date[2]+date[3];
    let mois=date[5]+date[6]
    this.addForm.controls['datecompt_datemens'].setValue(mois+"/"+an);
    this.addForm.controls['datecompt_dateexercice'].setValue(Number(an));
  }

  cancel() {
    this.router.navigateByUrl('home/parametrage-comptable/parametrage-date-comptable');
  }
}
