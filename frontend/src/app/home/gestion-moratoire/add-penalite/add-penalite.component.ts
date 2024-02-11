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
  selector: 'ngx-add-penalite',
  templateUrl: './add-penalite.component.html',
  styleUrls: ['./add-penalite.component.scss']
})
export class AddPenaliteComponent implements OnInit {
  myPenaliteForm = this.fb.group({
    penaliteForm: this.fb.group({
      penalit_num: [''],
	    penalit_sini: [''],
	    penalit_morat: [''],
	    penalit_enc: [''],
	    penalit_poli: [''],
	    penalit_nmarch: [''],
	    penalit_datepenalit: ['', [Validators.required]],
	    penalit_codenc: [''],
	    penalit_dateval: [''],
	    penalit_taux: ['', [Validators.required]],
	    penalit_mtpenalitfac: ['', [Validators.required]],
	    penalit_mtpenalitenc: [''],
	    penalit_datenc: [''],
	    penalit_typenc: [''],
	    penalit_cbanq: [''],
	    penalit_numchq: [''],
	    penalit_dateco: [''],
	    penalit_cutil: [''],
	    penalit_datemo: ['']
    }),
    mvtsinistreForm: this.fb.group({
      mvts_num: [''],
      mvts_poli: [''],
      mvts_numsinistre: [''],
      mvts_datemvt: [''],
      mvts_typemvt: [''],
      mvts_typegestionsinistre: [''],
      mvts_datesaisie: [''],
      mvts_montantmvt: [''],
      mvts_montantfinancier: [''],
      mvts_status: [''],
      mvts_montantprincipal: [''],
      mvts_montantfrais: [''],
      mvts_montanthonoraire: [''],
      mvts_beneficiaire: [''],
      mvts_tiers: [''],
      mvts_motifannulation: [''],
      mvts_dateannulation: [''],
      mvts_codeutilisateur: [''],
      mvts_datemodification: [''],
      mvts_datecomptabilisation: ['']
    }),
  })

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  sinistre: any;
  autorisation: [];

  montantMoratoire: any = "";
  nbreEcheance: number = 0;
  montantEcheance: any = "";
  montantCumuleImpaye: any = "";
  montantPenalite: any = "";
  typeEcheance: any = "";
  nbreEcheanceImpaye: any = "";
  dateMisePlaceEcheance: any = "";
  dateRelance: any = "";
  problemeMontantPenalite: boolean = false;

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
    this.sinistre = this.transfertData.getData();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });
      this.sinistreService.getMoratoireBySinistre(this.sinistre.sini_num)
      .subscribe((data: any) => {
        this.montantMoratoire = this.formatNumberService.numberWithCommas2(data.data.morato_mtmoratoire);
        this.typeEcheance = data.data.morato_typecheanc;
        if(this.typeEcheance === 'M') {
          this.typeEcheance = "Mensuel";
        } else if(this.typeEcheance === 'B') {
          this.typeEcheance = 'Bimestriel';
        } else if(this.typeEcheance === 'T') {
          this.typeEcheance = 'Trimestriel';
        } else {
          this.typeEcheance = '';
        }
        this.nbreEcheance = data.data.morato_nbrecheancacc;
        this.montantEcheance = this.formatNumberService.numberWithCommas2(data.data.morato_mtecheanc);
        this.nbreEcheanceImpaye = data.data.morato_nbrecheancimp;
        this.montantCumuleImpaye = data.data.morato_mtnechimpayee ? this.formatNumberService.numberWithCommas2(data.data.morato_mtnechimpayee) : 0;
        this.dateMisePlaceEcheance = dateFormatter(data.data.morato_datemiseplace, "dd/MM/yyyy");
        this.dateRelance = dateFormatter(data.data.morato_datech, "dd/MM/yyyy");
      })
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

  onChangeFocusMontantPenalite(event) {
    this.montantPenalite = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    let moratoireMontant = Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', ''));

    if (moratoireMontant != 0 && this.montantPenalite > moratoireMontant) {
      this.problemeMontantPenalite = true;
      this.montantPenalite = this.formatNumberService.numberWithCommas2(this.montantPenalite);
    } else {
      this.problemeMontantPenalite = false;
      this.myPenaliteForm.get('penaliteForm.penalit_mtpenalitfac').setValue(this.montantPenalite);
      this.montantPenalite = this.formatNumberService.numberWithCommas2(this.montantPenalite);
    }
  }

  getColorMontant() {
    if (this.problemeMontantPenalite) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')
  }

  onSubmit() {
    this.myPenaliteForm.get('penaliteForm.penalit_cutil').setValue(this.user.util_numero);
    this.sinistreService.ajouterPenalite(this.sinistre.sini_num, this.myPenaliteForm.value)
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
