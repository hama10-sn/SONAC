import { Component, OnInit, ViewChild } from '@angular/core';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import { User } from '../../../../model/User';
import { UserService } from '../../../../services/user.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { RecoursService } from '../../../../services/recours.service';
import { Beneficiaire } from '../../../../model/Beneficiaire';
import { BeneficiaireService } from '../../../../services/beneficiaire.service';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../model/Client';
import { AcheteurService } from '../../../../services/acheteur.service';
import { Acheteur } from '../../../../model/Acheteur';
import dateFormatter from 'date-format-conversion';
import { ReglementService } from '../../../../services/reglement.service';

@Component({
  selector: 'ngx-proposition-reglement',
  templateUrl: './proposition-reglement.component.html',
  styleUrls: ['./proposition-reglement.component.scss']
})
export class PropositionReglementComponent implements OnInit {

  myReglementForm = this.fb.group({

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
      mvts_datecomptabilisation: [''],
      mvts_nantissement: [''],
      mvts_benefnantissement: [''],
      mvts_montantnantissement: ['']
    }),

    // reglementForm: this.fb.group({
    //   regl_num: [''],
    //   regl_numsinistre: [''],
    //   regl_nummvt: [''],
    //   regl_numpoli: [''],
    //   regl_datereglement: [''],
    //   regl_codereglement: [''],
    //   regl_datevaleur: [''],
    //   regl_montantprincipal: [''],
    //   regl_montantfrais: [''],
    //   regl_montanthonoraire: [''],
    //   regl_montanttotal: [''],
    //   regl_codebanque: [''],
    //   regl_numcheque: [''],
    //   regl_beneficiaire: [''],
    //   regl_nantissement: [''], // Oui ou Non
    //   regl_benefnantissement: [''], // Obligatoire si nantissement
    //   regl_montantnantissement: [''], // Obligatoire si nantissement
    //   regl_debiteur: [''],
    //   regl_status: [''],
    //   regl_codeutilisateur: [''],
    //   regl_datecomptabilisation: [''],
    //   regl_datemodification: [''],
    // }),
  });

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  sinistre: any;
  autorisation: [];

  montantNantissement: any = "";
  montantReglementPrincipal: any = "";
  montantReglementFrais: any = "";
  montantReglementHonoraire: any = "";
  benificiaire: any = "";
  tiersRecours: any = "";
  montantSAPPrincipal: any = "";
  montantSAPFrais: any = "";
  montantSAPHonoraire: any = "";
  montantTotalReglement: any = "0";
  typeNantissement: any;
  OUI = "O";
  NON = "N";

  problemeMontantNantissement: boolean = false;
  problemeMontantReglementPrincipal: boolean = false;
  problemeMontantReglementFrais: boolean = false;
  problemeMontantReglementHonoraire: boolean = false;
  nantissementObligatoire: boolean = false;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: NbAuthService,
    private reglementService: ReglementService,
    private beneficiaireService: BeneficiaireService,
    private clientService: ClientService,
    private acheteurService: AcheteurService,
    private router: Router,
    private toastrService: NbToastrService,
    private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.sinistre = this.transfertData.getData();
    // console.log(this.sinistre);
    this.onGetBeneficiaireByCode();
    this.onGetTiersRecoursByCode();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });

    this.myReglementForm.get('mvtsinistreForm.mvts_poli').setValue(this.sinistre.mvts_poli);
    this.myReglementForm.get('mvtsinistreForm.mvts_numsinistre').setValue(this.sinistre.mvts_numsinistre);
    this.myReglementForm.get('mvtsinistreForm.mvts_typemvt').setValue(this.sinistre.mvts_typemvt);
    this.myReglementForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(this.sinistre.mvts_typegestionsinistre);
    this.myReglementForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(0);
    this.myReglementForm.get('mvtsinistreForm.mvts_montantfrais').setValue(0);
    this.myReglementForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(0);
    this.myReglementForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(this.sinistre.sini_beneficiaire);
    this.myReglementForm.get('mvtsinistreForm.mvts_tiers').setValue(this.sinistre.sini_tiersrecours);

    this.montantSAPPrincipal = this.formatNumberService.numberWithCommas2(this.sinistre.sini_sapprincipale);
    this.montantSAPFrais = this.formatNumberService.numberWithCommas2(this.sinistre.sini_sapfrais);
    this.montantSAPHonoraire = this.formatNumberService.numberWithCommas2(this.sinistre.sini_saphonoraires);

    this.myReglementForm.get('mvtsinistreForm.mvts_nantissement').setValue('N');
    this.typeNantissement = 'N';
    // permet de stocker la valeur de 0 au lieu de null
    this.myReglementForm.get('mvtsinistreForm.mvts_montantnantissement').setValue(0);
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

  onchangeNantissement(event) {

    this.myReglementForm.get('mvtsinistreForm.mvts_nantissement').setValue(event);

    if (event === this.OUI) {
      this.myReglementForm.get('mvtsinistreForm.mvts_benefnantissement').setValidators(Validators.required);
      this.myReglementForm.get('mvtsinistreForm.mvts_montantnantissement').setValidators(Validators.required);
      this.myReglementForm.get('mvtsinistreForm.mvts_montantnantissement').setValue('');
      this.nantissementObligatoire = true;
    } else {
      this.myReglementForm.get('mvtsinistreForm.mvts_benefnantissement').clearValidators()
      this.myReglementForm.get('mvtsinistreForm.mvts_montantnantissement').clearValidators();
      // permet de stocker la valeur de 0 au lieu de null
      this.myReglementForm.get('mvtsinistreForm.mvts_montantnantissement').setValue(0);
      this.nantissementObligatoire = false;
    }

    this.myReglementForm.get('mvtsinistreForm.mvts_benefnantissement').updateValueAndValidity();
    this.myReglementForm.get('mvtsinistreForm.mvts_montantnantissement').updateValueAndValidity();
  }

  onChangeFocusMontantNantissement(event) {
    this.montantNantissement = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));

    console.log(this.montantNantissement);

    if (this.montantNantissement <= 0) {
      this.problemeMontantNantissement = true;
      this.montantNantissement = this.formatNumberService.numberWithCommas2(this.montantNantissement);
    } else {
      this.problemeMontantNantissement = false;
      this.myReglementForm.get('mvtsinistreForm.mvts_montantnantissement').setValue(this.montantNantissement);
      this.montantNantissement = this.formatNumberService.numberWithCommas2(this.montantNantissement);
    }

  }

  onChangeFocusMontantReglementPrincipal(event) {
    this.montantReglementPrincipal = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));

    console.log(this.montantReglementPrincipal);
    // ============ Calcul du montant total reglement ==================
    let montantReglementFrais = Number(this.myReglementForm.get('mvtsinistreForm.mvts_montantfrais').value);
    let montantReglementHonoraire = Number(this.myReglementForm.get('mvtsinistreForm.mvts_montanthonoraire').value);

    this.montantTotalReglement = this.montantReglementPrincipal + montantReglementFrais + montantReglementHonoraire;
    this.montantTotalReglement = this.formatNumberService.numberWithCommas2(Number(this.montantTotalReglement));

    // =========== Pour les controle et formatage ============================
    let monMontantSAPPrincipal = this.sinistre.sini_sapprincipale;

    if (this.montantReglementPrincipal != 0 && this.montantReglementPrincipal > monMontantSAPPrincipal) {
      this.problemeMontantReglementPrincipal = true;
      this.montantReglementPrincipal = this.formatNumberService.numberWithCommas2(this.montantReglementPrincipal);
    } else {
      this.problemeMontantReglementPrincipal = false;
      this.myReglementForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantReglementPrincipal);
      this.montantReglementPrincipal = this.formatNumberService.numberWithCommas2(this.montantReglementPrincipal);
    }

  }

  onChangeFocusMontantReglementFrais(event) {
    this.montantReglementFrais = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    console.log(this.montantReglementFrais);

    // ============ Calcul du montant total reglement ==================
    let montantReglementPrincipal = Number(this.myReglementForm.get('mvtsinistreForm.mvts_montantprincipal').value);
    let montantReglementHonoraire = Number(this.myReglementForm.get('mvtsinistreForm.mvts_montanthonoraire').value);

    this.montantTotalReglement = montantReglementPrincipal + this.montantReglementFrais + montantReglementHonoraire;
    this.montantTotalReglement = this.formatNumberService.numberWithCommas2(Number(this.montantTotalReglement));

    // =========== Pour les controle et formatage ============================
    let monMontantSAPFrais = this.sinistre.sini_sapfrais;

    if (this.montantReglementFrais != 0 && this.montantReglementFrais > monMontantSAPFrais) {
      this.problemeMontantReglementFrais = true;
      this.montantReglementFrais = this.formatNumberService.numberWithCommas2(this.montantReglementFrais);
    } else {
      this.problemeMontantReglementFrais = false;
      this.myReglementForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.montantReglementFrais);
      this.montantReglementFrais = this.formatNumberService.numberWithCommas2(this.montantReglementFrais);
    }
  }

  onChangeFocusMontantReglementHonoraire(event) {
    this.montantReglementHonoraire = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    console.log(this.montantReglementHonoraire);

    // ============ Calcul du montant total reglement ==================
    let montantReglementPrincipal = Number(this.myReglementForm.get('mvtsinistreForm.mvts_montantprincipal').value);
    let montantReglementFrais = Number(this.myReglementForm.get('mvtsinistreForm.mvts_montantfrais').value);

    this.montantTotalReglement = montantReglementPrincipal + montantReglementFrais + this.montantReglementHonoraire;
    this.montantTotalReglement = this.formatNumberService.numberWithCommas2(Number(this.montantTotalReglement));

    // =========== Pour les controle et formatage ============================
    let monMontantSAPHonoraires = this.sinistre.sini_saphonoraires;

    if (this.montantReglementHonoraire != 0 && this.montantReglementHonoraire > monMontantSAPHonoraires) {
      this.problemeMontantReglementHonoraire = true;
      this.montantReglementHonoraire = this.formatNumberService.numberWithCommas2(this.montantReglementHonoraire);
    } else {
      this.problemeMontantReglementHonoraire = false;
      this.myReglementForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.montantReglementHonoraire);
      this.montantReglementHonoraire = this.formatNumberService.numberWithCommas2(this.montantReglementHonoraire);
    }
  }

  getColorMontantNantissement() {
    if (this.problemeMontantNantissement) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorMontantReglementPrincipal() {
    if (this.problemeMontantReglementPrincipal) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorMontantReglementFrais() {
    if (this.problemeMontantReglementFrais) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorMontantReglementHonoraires() {
    if (this.problemeMontantReglementHonoraire) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  onGetBeneficiaireByCode() {
    this.beneficiaireService.getBeneficiaire(this.sinistre.sini_beneficiaire)
      .subscribe((data: Beneficiaire) => {
        this.benificiaire = data?.benef_Num + " : " + (data?.benef_prenoms ? data?.benef_prenoms : "") + " " + (data?.benef_nom ? data?.benef_nom : "") + " " + (data?.benef_denom ? data?.benef_denom : "");
      });
  }

  onGetTiersRecoursByCode() {
    if (this.sinistre.sini_acheteur !== null && this.sinistre.sini_acheteur !== "") {
      this.acheteurService.getAcheteur(this.sinistre.sini_acheteur)
        .subscribe((data: Acheteur) => {
          this.tiersRecours = data?.achet_numero + " : " + (data?.achet_prenom ? data?.achet_prenom : "") + " " + (data?.achet_nom ? data?.achet_nom : "");
        });
    } else {
      this.clientService.getClient(this.sinistre.sini_souscripteur)
        .subscribe((data: Client) => {
          this.tiersRecours = data?.clien_numero + " : " + (data?.clien_prenom ? data?.clien_prenom : "") + " " + (data?.clien_nom ? data?.clien_nom : "") + " " + (data?.clien_denomination ? data?.clien_denomination : "");
        });
    }
  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')
  }

  onSubmit() {
    this.myReglementForm.get('mvtsinistreForm.mvts_codeutilisateur').setValue(this.user.util_numero);
    console.log(this.myReglementForm.value);

    let montantTotalRegler = Number(this.formatNumberService.replaceAll(this.montantTotalReglement, ' ', ''));
    if (montantTotalRegler <= 0) {
      this.toastrService.show(
        'impossible: il faut saisir au moins un montant règlement correcte',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });

    } else {
      
      this.reglementService.propositionReglementSinistre(this.myReglementForm.value)
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
            this.router.navigateByUrl('home/gestion-sinistre/gestion-reglement/view-reglement');

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

  }

  cancel() {
    this.router.navigateByUrl("/home/gestion-sinistre/liste-sinistre")
  }

}
