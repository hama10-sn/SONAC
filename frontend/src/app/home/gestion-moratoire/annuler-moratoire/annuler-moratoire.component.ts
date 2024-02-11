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
  selector: 'ngx-annuler-moratoire',
  templateUrl: './annuler-moratoire.component.html',
  styleUrls: ['./annuler-moratoire.component.scss']
})
export class AnnulerMoratoireComponent implements OnInit {
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
      morato_mtnencaiss: ['', [Validators.required]],
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
  nbreEcheance: number = 0;
  montantEcheance: any = "";
  montantCumuleImpaye: any = "";
  typeEcheance: any = "";
  nbreEcheanceImpaye: any = "";
  dateEcheance: any = "";
  dateRelance: any = "";

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
    this.montant_principal = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantprincipal);
    this.montant_frais = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantfrais);
    this.montant_honoraire = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montanthonoraire);
    this.montantMoratoire = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantmvt);
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
        this.montantCumuleImpaye = this.formatNumberService.numberWithCommas2(data.data.morato_mtnechimpayee);
        this.dateEcheance = dateFormatter(data.data.morato_datemiseplace, "dd/MM/yyyy");
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

  onSubmit() {
    this.sinistreService.annulerMoratoire(this.sinistre.sini_num, this.myMoratoireForm.value)
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
