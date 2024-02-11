import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { Acheteur } from '../../../model/Acheteur';
import { Beneficiaire } from '../../../model/Beneficiaire';
import { Client } from '../../../model/Client';
import { User } from '../../../model/User';
import { AcheteurService } from '../../../services/acheteur.service';
import { BeneficiaireService } from '../../../services/beneficiaire.service';
import { ClientService } from '../../../services/client.service';
import { FormatNumberService } from '../../../services/formatNumber.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';
import dateFormatter from 'date-format-conversion';
import { sinistreService } from '../../../services/sinistre.service';

@Component({
  selector: 'ngx-add-moratoire',
  templateUrl: './add-moratoire.component.html',
  styleUrls: ['./add-moratoire.component.scss']
})
export class AddMoratoireComponent implements OnInit {
  myMoratoireForm = this.fb.group({
    moratoireForm: this.fb.group({
      morato_num: [''],
      morato_sini: [''],
      morato_datemiseplace: ['', [Validators.required]],
      morato_mtmoratoire: ['', [Validators.required]],
      morato_typecheanc: ['', [Validators.required]],
      morato_nbrecheancacc: ['', [Validators.required]],
      morato_mtecheanc: ['', [Validators.required]],
      morato_datech: ['', [Validators.required]],
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

  montant_principal: any = "";
  montant_frais: any = "";
  montant_honoraire: any = "";
  benificiaire: any = "";
  tiersResponsable: any = "";
  montantMoratoire: any = "";
  nbreEcheance: any = 0;
  dateEcheance: any;
  montantEcheance: any = "";
  montantCumuleImpaye: any = 0;

  problemeMontantMoratoire: boolean = false;
  problemeDateRelance: boolean = false;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: NbAuthService,
    private sinistreService: sinistreService,
    private beneficiaireService: BeneficiaireService,
    private clientService: ClientService,
    private acheteurService: AcheteurService,
    private router: Router,
    private toastrService: NbToastrService,
    private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.sinistre = this.transfertData.getData();
    this.onGetBeneficiaireByCode();
    this.onGetTiersResponsableByCode();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });
    this.montant_principal = this.formatNumberService.numberWithCommas2(this.sinistre.sini_recoursprincipal);
    this.montant_frais = this.formatNumberService.numberWithCommas2(this.sinistre.sini_recoursfrais);
    this.montant_honoraire = this.formatNumberService.numberWithCommas2(this.sinistre.sini_recourshonoraires);
    this.montantMoratoire = this.formatNumberService.numberWithCommas2(this.sinistre.sini_recoursglobal);
    this.myMoratoireForm.get('moratoireForm.morato_mtmoratoire').setValue( Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', '')));
    this.myMoratoireForm.get('moratoireForm.morato_sini').setValue(this.sinistre.sini_num);
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

  onGetBeneficiaireByCode() {
    this.beneficiaireService.getBeneficiaire(this.sinistre.sini_beneficiaire)
      .subscribe((data: Beneficiaire) => {
        this.benificiaire = data?.benef_Num + ":" + (data?.benef_prenoms ? data?.benef_prenoms : "") + " " + (data?.benef_nom ? data?.benef_nom : "") + " "+ (data?.benef_denom ? data?.benef_denom : "");
      });
  }

  onGetTiersResponsableByCode() {
    if (this.sinistre.sini_acheteur !== null && this.sinistre.sini_acheteur !== "") {
      this.acheteurService.getAcheteur(this.sinistre.sini_acheteur)
        .subscribe((data: Acheteur) => {
          this.tiersResponsable = data?.achet_numero + " : " + (data?.achet_prenom ? data?.achet_prenom : "") + " " + (data?.achet_nom ? data?.achet_nom : "");
        });
    } else {
      this.clientService.getClient(this.sinistre.sini_souscripteur)
        .subscribe((data: Client) => {
          this.tiersResponsable = data?.clien_numero + " : " + (data?.clien_prenom ? data?.clien_prenom : "") + " " + (data?.clien_nom ? data?.clien_nom : "") + " " + (data?.clien_denomination ? data?.clien_denomination : "");
        });
    }
  }

  onChangeFocusMontantMoratoire(event) {
    this.montantMoratoire = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    let monMontantRecours = this.sinistre.sini_recoursglobal;

    if (monMontantRecours != 0 && this.montantMoratoire > monMontantRecours) {
      this.problemeMontantMoratoire = true;
      this.montantMoratoire = this.formatNumberService.numberWithCommas2(this.montantMoratoire);
    } else {
      this.problemeMontantMoratoire = false;
      this.myMoratoireForm.get('moratoireForm.morato_mtmoratoire').setValue(this.montantMoratoire);
      this.montantMoratoire = this.formatNumberService.numberWithCommas2(this.montantMoratoire);
    }
  }

  onChangeTypeEcheance(event) {
    let dateMiseEnPlace = new Date();
    switch (event) {
      case "M":{
        this.nbreEcheance = 12;
        this.montantEcheance = Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', '') / 12);
        this.myMoratoireForm.get('moratoireForm.morato_mtecheanc').setValue(this.montantEcheance);
        this.montantEcheance = this.formatNumberService.numberWithCommas2(this.montantEcheance);
        this.myMoratoireForm.get('moratoireForm.morato_nbrecheancacc').setValue(this.nbreEcheance);
        this.dateEcheance = dateMiseEnPlace.setMonth(dateMiseEnPlace.getMonth() + 1);
        this.myMoratoireForm.get('moratoireForm.morato_datemiseplace').setValue(dateFormatter(this.dateEcheance, 'yyyy-MM-dd'));
        break;
      }
      case "B":{
        this.nbreEcheance = 6;
        this.montantEcheance = Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', '') / 6);
        this.myMoratoireForm.get('moratoireForm.morato_mtecheanc').setValue(this.montantEcheance);
        this.montantEcheance = this.formatNumberService.numberWithCommas2(this.montantEcheance);
        this.myMoratoireForm.get('moratoireForm.morato_nbrecheancacc').setValue(this.nbreEcheance);
        this.dateEcheance = dateMiseEnPlace.setMonth(dateMiseEnPlace.getMonth() + 2);
        this.myMoratoireForm.get('moratoireForm.morato_datemiseplace').setValue(dateFormatter(this.dateEcheance, 'yyyy-MM-dd'));
        break;
      }
      case "T":{
        this.nbreEcheance = 4;
        this.montantEcheance = Number(this.formatNumberService.replaceAll(this.montantMoratoire, ' ', '') / 4);
        this.myMoratoireForm.get('moratoireForm.morato_mtecheanc').setValue(this.montantEcheance);
        this.montantEcheance = this.formatNumberService.numberWithCommas2(this.montantEcheance);
        this.myMoratoireForm.get('moratoireForm.morato_nbrecheancacc').setValue(this.nbreEcheance);
        this.dateEcheance = dateMiseEnPlace.setMonth(dateMiseEnPlace.getMonth() + 3);
        this.myMoratoireForm.get('moratoireForm.morato_datemiseplace').setValue(dateFormatter(this.dateEcheance, 'yyyy-MM-dd'));
        break;
      }
    }
  }

  onChangeFocusDateRelance(event) {
    let dateRelance = new Date(dateFormatter(event.target.value, 'yyyy-MM-dd'));
    let dateMiseEnPlace = new Date(this.dateEcheance);

    if (dateRelance.getTime() < dateMiseEnPlace.getTime()) {
      this.problemeDateRelance = true;
    } else {
      this.problemeDateRelance = false;
      this.myMoratoireForm.get('moratoireForm.morato_datech').setValue(dateFormatter(dateRelance, 'yyyy-MM-dd'));
    }
  }

  getColorMontant() {
    if(this.problemeMontantMoratoire) {
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
    this.myMoratoireForm.get('moratoireForm.morato_cutil').setValue(this.user.util_numero);
    this.sinistreService.ajouterMoratoire(this.sinistre.sini_num, this.myMoratoireForm.value)
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
