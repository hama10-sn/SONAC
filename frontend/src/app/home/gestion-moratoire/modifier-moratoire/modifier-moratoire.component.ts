import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { User } from '../../../model/User';
import { FormatNumberService } from '../../../services/formatNumber.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';
import dateFormatter from 'date-format-conversion';
import { sinistreService } from '../../../services/sinistre.service';

@Component({
  selector: 'ngx-modifier-moratoire',
  templateUrl: './modifier-moratoire.component.html',
  styleUrls: ['./modifier-moratoire.component.scss']
})
export class ModifierMoratoireComponent implements OnInit {
  moratoireForm = this.fb.group({
    morato_num: [''],
    morato_sini: [''],
    morato_datemiseplace: [''],
    morato_mtmoratoire: [''],
    morato_typecheanc: [''],
    morato_nbrecheancacc: [''],
    morato_mtecheanc: [''],
    morato_datech: [''],
    morato_mtnechimpayee: [''],
    morato_nbrecheancimp: [''],
    morato_typencdern: [''],
    morato_mtnencaiss: [''],
    morato_cbanq: [''],
    morato_numchq: [''],
    morato_dateco: [''],
    morato_cutil: [''],
    morato_datemo: [''],
    morato_status: ['']
  })

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  moratoire: any;
  autorisation: [];

  montant_principal: any = "";
  montant_frais: any = "";
  montant_honoraire: any = "";
  benificiaire: any = "";
  tiersResponsable: any = "";
  montantMoratoire: any = "";
  nbreEcheance: number = 0;
  montantEcheance: any = "";
  montantCumuleImpaye: any = "";
  dateEcheanche: any = "";
  dateRelance: any = "";
  problemeMontantMoratoire: boolean = false;
  problemeDateRelance: boolean = false;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: NbAuthService,
    private sinistreService: sinistreService,
    private router: Router,
    private toastrService: NbToastrService,
    private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.moratoire = this.transfertData.getData();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });
    this.montantMoratoire = this.formatNumberService.numberWithCommas2(this.moratoire.morato_mtmoratoire);
    this.nbreEcheance = this.moratoire.morato_nbrecheancacc;
    this.montantEcheance = this.formatNumberService.numberWithCommas2(this.moratoire.morato_mtecheanc);
    if(this.moratoire.morato_mtnechimpayee !== null) {
      this.montantCumuleImpaye = this.formatNumberService.numberWithCommas2(this.moratoire.morato_mtnechimpayee);
      this.moratoireForm.get('morato_mtnechimpayee').setValue(Number(this.formatNumberService.replaceAll(this.montantCumuleImpaye, ' ', '')));
    } else {
      this.montantCumuleImpaye = 0;
      this.moratoireForm.get('morato_mtnechimpayee').setValue(this.montantCumuleImpaye);
    }
    this.dateEcheanche = dateFormatter(new Date(this.moratoire.morato_datemiseplace), "yyyy-MM-dd");
    this.dateRelance = dateFormatter(new Date(this.moratoire.morato_datech), "yyyy-MM-dd");
    this.moratoireForm.get('morato_typecheanc').setValue(this.moratoire.morato_typecheanc);
    this.moratoireForm.get('morato_mtmoratoire').setValue(Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', '')));
    this.moratoireForm.get('morato_nbrecheancacc').setValue(this.nbreEcheance);
    this.moratoireForm.get('morato_mtecheanc').setValue(Number(this.formatNumberService.replaceAll(this.montantEcheance, ' ', '')));
    this.moratoireForm.get('morato_datemiseplace').setValue(this.moratoire.morato_datemiseplace);
    this.moratoireForm.get('morato_datech').setValue(this.moratoire.morato_datech);
    this.moratoireForm.get('morato_sini').setValue(this.moratoire.morato_sini);
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
      });
  }

  onChangeFocusMontantMoratoire(event) {
    this.montantMoratoire = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    let monMontantRecours = null;

    if (monMontantRecours != 0 && this.montantMoratoire > monMontantRecours) {
      this.problemeMontantMoratoire = true;
      this.montantMoratoire = this.formatNumberService.numberWithCommas2(this.montantMoratoire);
    } else {
      this.problemeMontantMoratoire = false;
      this.moratoireForm.get('morato_mtmoratoire').setValue(this.montantMoratoire);
      this.montantMoratoire = this.formatNumberService.numberWithCommas2(this.montantMoratoire);
    }
  }

  onChangeTypeEcheance(event) {
    let dateMiseEnPlace = new Date();
    switch (event) {
      case "M":{
        this.nbreEcheance = 12;
        this.montantEcheance = Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', '') / 12);
        this.moratoireForm.get('morato_mtecheanc').setValue(this.montantEcheance);
        this.montantEcheance = this.formatNumberService.numberWithCommas2(this.montantEcheance);
        this.moratoireForm.get('morato_nbrecheancacc').setValue(this.nbreEcheance);
        this.dateEcheanche = dateMiseEnPlace.setMonth(dateMiseEnPlace.getMonth() + 1);
        this.moratoireForm.get('morato_datemiseplace').setValue(dateFormatter(this.dateEcheanche, 'yyyy-MM-dd'));
        break;
      }
      case "B":{
        this.nbreEcheance = 6;
        this.montantEcheance = Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', '') / 6);
        this.moratoireForm.get('morato_mtecheanc').setValue(this.montantEcheance);
        this.montantEcheance = this.formatNumberService.numberWithCommas2(this.montantEcheance);
        this.moratoireForm.get('morato_nbrecheancacc').setValue(this.nbreEcheance);
        this.dateEcheanche = dateMiseEnPlace.setMonth(dateMiseEnPlace.getMonth() + 2);
        this.moratoireForm.get('morato_datemiseplace').setValue(dateFormatter(this.dateEcheanche, 'yyyy-MM-dd'));
        break;
      }
      case "T":{
        this.nbreEcheance = 4;
        this.montantEcheance = Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', '') / 4);
        this.moratoireForm.get('morato_mtecheanc').setValue(this.montantEcheance);
        this.montantEcheance = this.formatNumberService.numberWithCommas2(this.montantEcheance);
        this.moratoireForm.get('morato_nbrecheancacc').setValue(this.nbreEcheance);
        this.dateEcheanche = dateMiseEnPlace.setMonth(dateMiseEnPlace.getMonth() + 3);
        this.moratoireForm.get('morato_datemiseplace').setValue(dateFormatter(this.dateEcheanche, 'yyyy-MM-dd'));
        break;
      }
    }
  }

  onChangeFocusMontantCumuleImpaye(event) {
    this.montantCumuleImpaye = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.moratoireForm.get('morato_mtnechimpayee').setValue(this.montantCumuleImpaye);
    this.montantCumuleImpaye = this.formatNumberService.numberWithCommas2(this.montantCumuleImpaye);
  }

  onChangeDate(event) {
    this.moratoireForm.get('morato_datemiseplace').setValue(event.target.value);
    this.moratoireForm.get('morato_datech').setValue(event.target.value);
  }

  onChangeFocusDateRelance(event) {
    let dateRelance = new Date(dateFormatter(event.target.value, 'yyyy-MM-dd'));
    let dateMiseEnPlace = new Date(this.dateEcheanche);

    if (dateRelance.getTime() < dateMiseEnPlace.getTime()) {
      this.problemeDateRelance = true;
    } else {
      this.problemeDateRelance = false;
      this.moratoireForm.get('morato_datech').setValue(dateRelance);
    }
  }

  getColorMontant() {
    if (this.problemeMontantMoratoire) {
      return '1px solid red';
    } else {
      return '';
    }
  }


  getColorDate() {
    if(this.problemeDateRelance) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')
  }

  onSubmit() {
    this.moratoireForm.get('morato_cutil').setValue(this.user.util_numero);
    this.sinistreService.modifierMoratoire(this.moratoire.morato_num, this.moratoireForm.value)
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
          this.router.navigateByUrl("/home/gestion-moratoire/liste-sinistre-recours");

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

  cancel() {
    this.router.navigateByUrl("/home/gestion-moratoire/liste-sinistre-recours")
  }
}
