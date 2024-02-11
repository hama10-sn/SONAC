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
  selector: 'ngx-annulation-validation-reglement',
  templateUrl: './annulation-validation-reglement.component.html',
  styleUrls: ['./annulation-validation-reglement.component.scss']
})
export class AnnulationValidationReglementComponent implements OnInit {

  myAnnulationReglementValideForm = this.fb.group({

    mvtsinistreForm: this.fb.group({
      mvts_id: [''],
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

    reglementForm: this.fb.group({
      regl_num: [''],
      regl_numsinistre: [''],
      regl_nummvt: [''],
      regl_numpoli: [''],
      regl_datereglement: [''],
      regl_codereglement: [''],
      regl_datevaleur: [''],
      regl_montantprincipal: [''],
      regl_montantfrais: [''],
      regl_montanthonoraire: [''],
      regl_montanttotal: [''],
      regl_codebanque: [''],
      regl_numcheque: [''],
      regl_beneficiaire: [''],
      regl_nantissement: [''], // Oui ou Non
      regl_benefnantissement: [''],
      regl_montantnantissement: [''],
      regl_debiteur: [''],
      regl_status: [''],
      regl_codeutilisateur: [''],
      regl_datecomptabilisation: [''],
      regl_datemodification: [''],
    }),
  });

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  sinistre: any;
  autorisation: [];

  montantReglementPrincipal: any = "";
  montantReglementFrais: any = "";
  montantReglementHonoraire: any = "";
  benificiaire: any = "";
  tiersRecours: any = "";
  montantSAPPrincipal: any = "";
  montantSAPFrais: any = "";
  montantSAPHonoraire: any = "";

  problemeMontantReglementPrincipal: boolean = false;
  problemeMontantReglementFrais: boolean = false;
  problemeMontantReglementHonoraire: boolean = false;

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
    console.log(this.sinistre);
    // this.onGetBeneficiaireByCode();
    // this.onGetTiersRecoursByCode();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });

    // this.myReglementForm.get('mvtsinistreForm.mvts_id').setValue(this.sinistre.mvts_id);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_num').setValue(this.sinistre.mvts_num);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_poli').setValue(this.sinistre.mvts_poli);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_numsinistre').setValue(this.sinistre.mvts_numsinistre);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_datemvt').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_typemvt').setValue(this.sinistre.mvts_typemvt);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(this.sinistre.mvts_typegestionsinistre);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_datesaisie').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    // this.myReglementForm.get('mvtsinistreForm.mvts_montantmvt').setValue(this.sinistre.mvts_montantmvt);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_montantfinancier').setValue(this.sinistre.mvts_montantfinancier);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_status').setValue(this.sinistre.mvts_status);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.sinistre.mvts_montantprincipal);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.sinistre.mvts_montantfrais);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.sinistre.mvts_montanthonoraire);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_montantmvt').setValue(this.sinistre.mvts_montantmvt);

    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(this.sinistre.mvts_beneficiaire);
    this.benificiaire = this.sinistre.mvts_beneficiaire.toString();

    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_tiers').setValue(this.sinistre.mvts_tiers);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_motifannulation').setValue(this.sinistre.mvts_motifannulation);
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_dateannulation').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_datemodification').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_datecomptabilisation').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));

    this.montantReglementPrincipal = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantprincipal);
    this.montantReglementFrais = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantfrais);
    this.montantReglementHonoraire = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montanthonoraire);
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

  /*
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
  */

  onSubmit() {
    this.myAnnulationReglementValideForm.get('mvtsinistreForm.mvts_codeutilisateur').setValue(this.user.util_numero);
    console.log(this.myAnnulationReglementValideForm.value);

    this.reglementService.annulationReglementValideSinistre(this.myAnnulationReglementValideForm.value)
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

          this.router.navigateByUrl('home/gestion-sinistre/liste-sinistre');

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
