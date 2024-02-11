import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import { User } from '../../../model/User';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { FormatNumberService } from '../../../services/formatNumber.service';
import { RecoursService } from '../../../services/recours.service';
import { Beneficiaire } from '../../../model/Beneficiaire';
import { BeneficiaireService } from '../../../services/beneficiaire.service';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../model/Client';
import { AcheteurService } from '../../../services/acheteur.service';
import { Acheteur } from '../../../model/Acheteur';

@Component({
  selector: 'ngx-proposition-recours',
  templateUrl: './proposition-recours.component.html',
  styleUrls: ['./proposition-recours.component.scss']
})
export class PropositionRecoursComponent implements OnInit {
  myRecoursForm = this.fb.group({
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
  });

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

  montantPrincipal: any = "";
  montantFrais: any = "";
  montantHonoraire: any = "";
  montantRecours: any = "";

  problemeMontantPrincipalRecours: boolean = false;
  problemeMontantRecoursFrais: boolean = false;
  problemeMontantRecoursHonoraire: boolean = false;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: NbAuthService,
    private recoursService: RecoursService,
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
    this.myRecoursForm.get('mvtsinistreForm.mvts_typemvt').setValue(9);
    this.montant_principal = this.formatNumberService.numberWithCommas2(this.sinistre.sini_sapprincipale + this.sinistre.sini_reglementprincipal);
    if(this.sinistre.sini_recoursprincipal === 0) {
      this.montant_frais = this.formatNumberService.numberWithCommas2(this.sinistre.sini_sapfrais + this.sinistre.sini_reglementfrais);
      this.montant_honoraire = this.formatNumberService.numberWithCommas2(this.sinistre.sini_saphonoraires + this.sinistre.sini_reglementhonoraires);
    } else {
      this.montant_frais = this.formatNumberService.numberWithCommas2((this.sinistre.sini_sapfrais + this.sinistre.sini_reglementfrais) - this.sinistre.mvts_montantfrais);
      this.montant_honoraire = this.formatNumberService.numberWithCommas2((this.sinistre.sini_saphonoraires + this.sinistre.sini_reglementhonoraires) - this.sinistre.mvts_montanthonoraire);
    }
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

  onChangeFocusMontantRecoursPrincipal(event) {
    this.montantPrincipal = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    let monMontantSAP = 0;

    if(this.sinistre.sini_recoursprincipal === 0) {
      monMontantSAP = this.sinistre.sini_sapprincipale + this.sinistre.sini_reglementprincipal;
    } else {
      monMontantSAP = (this.sinistre.sini_sapprincipale + this.sinistre.sini_reglementprincipal) - - this.sinistre.mvts_montantprincipal;
    }

    if (monMontantSAP != 0 && this.montantPrincipal > monMontantSAP) {
      this.problemeMontantPrincipalRecours = true;
      this.myRecoursForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    } else {
      this.problemeMontantPrincipalRecours = false;
      this.myRecoursForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    }



    // this.montantPrincipal = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    // let monMontantSAP = 0;

    // if (this.sinistre.sini_recoursprincipal === 0 && monMontantSAP != 0 && this.montantPrincipal > monMontantSAP) {
    //   this.problemeMontantPrincipalRecours = true;
    //   this.myRecoursForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
    //   this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    // } else if(this.sinistre.sini_recoursprincipal != 0 && monMontantSAP != 0 && this.montantPrincipal > monMontantSAP) {
    //   this.problemeMontantPrincipalRecours = true;
    //   this.myRecoursForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
    //   this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    // } else {
    //   this.problemeMontantPrincipalRecours = false;
    //   this.myRecoursForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
    //   this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    // }
  }

  onChangeFocusMontantRecoursFrais(event) {
    this.montantFrais = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    let monMontantSAPFrais = 0;
    if(this.sinistre.sini_recoursprincipal === 0) {
      monMontantSAPFrais = this.sinistre.sini_sapfrais + this.sinistre.sini_reglementfrais;
    } else {
      monMontantSAPFrais = (this.sinistre.sini_sapfrais + this.sinistre.sini_reglementfrais) - this.sinistre.mvts_montantfrais;
    }

    if (monMontantSAPFrais != 0 && this.montantFrais > monMontantSAPFrais) {
      this.problemeMontantRecoursFrais = true;
      this.montantFrais = this.formatNumberService.numberWithCommas2(this.montantFrais);
    } else {
      this.problemeMontantRecoursFrais = false;
      this.myRecoursForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.montantFrais);
      this.montantFrais = this.formatNumberService.numberWithCommas2(this.montantFrais);
    }
  }

  onChangeFocusMontantRecoursHonoraire(event) {
    this.montantHonoraire = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    let monMontantSAPHonoraires = 0;
    if(this.sinistre.sini_recoursprincipal === 0) {
      monMontantSAPHonoraires = this.sinistre.sini_saphonoraires + this.sinistre.sini_reglementhonoraires;
    } else {
      monMontantSAPHonoraires = (this.sinistre.sini_saphonoraires + this.sinistre.sini_reglementhonoraires) - this.sinistre.mvts_montanthonoraire;
    }

    if (monMontantSAPHonoraires != 0 && this.montantHonoraire > monMontantSAPHonoraires) {
      this.problemeMontantRecoursHonoraire = true;
      this.montantHonoraire = this.formatNumberService.numberWithCommas2(this.montantHonoraire);
    } else {
      this.problemeMontantRecoursHonoraire = false;
      this.myRecoursForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.montantHonoraire);
      this.montantHonoraire = this.formatNumberService.numberWithCommas2(this.montantHonoraire);
    }
  }

  getColorMontant() {
    if (this.problemeMontantPrincipalRecours) {
      return '1px solid rgb(255, 230, 0)';
    } else {
      return '';
    }
  }

  getColorMontantRecoursFrais() {
    if(this.problemeMontantRecoursFrais) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorMontantRecoursHonoraires() {
    if(this.problemeMontantRecoursHonoraire) {
      return '1px solid red';
    } else {
      return '';
    }
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
    this.myRecoursForm.get('mvtsinistreForm.mvts_codeutilisateur').setValue(this.user.util_numero);
    this.recoursService.ajouterPropositionRecours(this.sinistre.sini_num, this.myRecoursForm.value)
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
          this.router.navigateByUrl('home/gestion-sinistre/view-proposition-recours');

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
    this.router.navigateByUrl("/home/gestion-sinistre/liste-sinistre")
  }
}
