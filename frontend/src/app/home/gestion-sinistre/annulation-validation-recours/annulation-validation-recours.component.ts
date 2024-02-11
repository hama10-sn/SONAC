import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
import { RecoursService } from '../../../services/recours.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ngx-annulation-validation-recours',
  templateUrl: './annulation-validation-recours.component.html',
  styleUrls: ['./annulation-validation-recours.component.scss']
})
export class AnnulationValidationRecoursComponent implements OnInit {
  myValidationForm = this.fb.group({
    recoursForm: this.fb.group({
      recou_num: [''],
      recou_sin: [''],
      recou_rglt: [''],
      recou_poli: [''],
      recou_nmarch: [''],
      recou_daterec: [''],
      recou_cregl: [''],
      recou_dateval: [''],
      recou_mtnrec: [''],
      recou_mtnenc: [''],
      recou_mtnencp: [''],
      recou_mtnenfr: [''],
      recou_mtnenho: [''],
      recou_dateenc: [''],
      recou_typeenc: [''],
      recou_cbanq: [''],
      recou_numchq: [''],
      recou_beneficiaire: [''],
      recou_achdor: [''],
      recou_dateco: [''],
      recou_typr: [''],
      recou_utilisateur: [''],
      recou_datemo: ['']
    }),
    sinistreForm: this.fb.group({
      sini_num: [''],
      sini_police: [''],
      sini_risque: [''],
      sini_intermediaire: [''],
      sini_codecompagnie: [''],
      sini_branche: [''],
      sini_categorie: [''],
      sini_produit: [''],
      sini_typesinistre: [''],
      sini_datesurvenance: [''],
      sini_datedeclaration: [''],
      sini_datesaisie: [''],
      sini_souscripteur: [''],
      sini_beneficiaire: [''],
      sini_acheteur: [''],
      sini_donneurdordre: [''],
      sini_tiersrecours: [''],
      sini_lieu: [''],
      sini_description: [''],
      sini_coderesponsabilite: [''],
      sini_evaluationglobale: [''],
      sini_evaluationprincipale: [''],
      sini_evaluationfrais: [''],
      sini_evaluationhonoraires: [''],
      sini_sapglobale: [''],
      sini_sapprincipale: [''],
      sini_sapfrais: [''],
      sini_saphonoraires: [''],
      sini_reglementglobal: [''],
      sini_reglementprincipal: [''],
      sini_reglementfrais: [''],
      sini_reglementhonoraires: [''],
      sini_recoursglobal: [''],
      sini_recoursprincipal: [''],
      sini_recoursfrais: [''],
      sini_recourshonoraires: [''],
      sini_recoursglobalencaisse: [''],
      sini_recoursprincipalencaisse: [''],
      sini_recoursfraisencaisse: [''],
      sini_recourshonoraieencaisse: [''],
      sini_datederniermvt: [''],
      sini_numderniermvt: [''],
      sini_utilisateur: [''],
      sini_datemodification: [''],
      sini_codeexpert: [''],
      sini_dateexpert: [''],
      sini_rapport: [''], // Oui ou Non
      sini_status: [''],
      sini_motifcloture: [''],
      sini_datecloture: [''],
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
  });

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  sinistre: any;
  autorisation: [];

  montant_recours_principal: any = "";
  montant_recours_frais: any = "";
  montant_recours_honoraire: any = "";
  montant_principal: any = "";
  montant_frais: any = "";
  montant_honoraire: any = "";
  benificiaire: any = "";
  tiersResponsable: any = "";

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
    private formatNumberService: FormatNumberService,
    private toastrService: NbToastrService,
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
    this.myValidationForm.get('mvtsinistreForm.mvts_typemvt').setValue(12);
    this.montant_principal = this.sinistre.sini_evaluationprincipale;
    this.montant_frais = this.sinistre.sini_evaluationfrais;
    this.montant_honoraire = this.sinistre.sini_evaluationhonoraires;
    this.montant_recours_principal = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantprincipal);
    this.montant_recours_frais = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantfrais);
    this.montant_recours_honoraire = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montanthonoraire);
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
    if(this.sinistre.sini_souscripteur !== null) {
      this.clientService.getClient(this.sinistre.sini_souscripteur)
        .subscribe((data: Client) => {
          this.tiersResponsable = data?.clien_numero + ":" + (data?.clien_prenom ? data?.clien_prenom : "") + " " + (data?.clien_nom ? data?.clien_nom : "") + " "+ (data?.clien_denomination ? data?.clien_denomination : "");
        });
    } else {
      this.acheteurService.getAcheteur(this.sinistre.sin_acheteur)
        .subscribe((data: Acheteur) => {
          this.tiersResponsable = data?.achet_numero + ":" + (data?.achet_prenom ? data?.achet_prenom : "") + " " + (data?.achet_nom ? data?.achet_nom : "");
        });
    }
  }

  onSubmit() {
    this.myValidationForm.get('mvtsinistreForm.mvts_codeutilisateur').setValue(this.user.util_numero);
    this.recoursService.annulationValidationRecours(this.sinistre.sini_num, this.myValidationForm.value)
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
