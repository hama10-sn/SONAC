import { Component, OnInit, ViewChild } from '@angular/core';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import { User } from '../../../../model/User';
import { UserService } from '../../../../services/user.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { Beneficiaire } from '../../../../model/Beneficiaire';
import { BeneficiaireService } from '../../../../services/beneficiaire.service';
import { ClientService } from '../../../../services/client.service';
import { Client } from '../../../../model/Client';
import { AcheteurService } from '../../../../services/acheteur.service';
import { Acheteur } from '../../../../model/Acheteur';
import dateFormatter from 'date-format-conversion';
import { ReglementService } from '../../../../services/reglement.service';
import { RisqueService } from '../../../../services/risque.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { BanqueService } from '../../../../services/branque.service';
import { Banque } from '../../../../model/Banque';

@Component({
  selector: 'ngx-reglement-financier',
  templateUrl: './reglement-financier.component.html',
  styleUrls: ['./reglement-financier.component.scss']
})
export class ReglementFinancierComponent implements OnInit {

  myReglementFinancierForm = this.fb.group({

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
      sini_rapport: [''],
      sini_status: [''],
      sini_motifcloture: [''],
      sini_datecloture: [''],
    }),

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
      mvts_autrebeneficiaire: ['', [Validators.required]],
      mvts_adresseautrebeneficiaire: [''],
      mvts_motifannulation: [''],
      mvts_dateannulation: [''],
      mvts_codeutilisateur: [''],
      mvts_datemodification: [''],
      mvts_datecomptabilisation: [''],
      mvts_nantissement: [''],
      mvts_benefnantissement: [''],
      mvts_montantnantissement: ['']
    }),

    reglementForm: this.fb.group({
      regl_id: [''],
      regl_num: [''],
      regl_numsinistre: [''],
      regl_nummvt: [''],
      regl_numpoli: [''],
      regl_datereglement: [''],
      regl_codereglement: ['', [Validators.required]],
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

    typeReglement: ['']
  });

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  sinistre: any;
  typeReglement: any;
  autorisation: [];

  montantReglementPrincipal: any = "";
  montantReglementFrais: any = "";
  montantReglementHonoraire: any = "";
  benificiaire: any = "";
  adresseBeneficiaire: any = ""
  tiersRecours: any = "";
  montantSAPPrincipal: any = "";
  montantSAPFrais: any = "";
  montantSAPHonoraire: any = "";
  reglementPrincipal = 1;
  reglementFrais = 2;
  reglementHonoraires = 3;
  reglementPrincipalEtFrais = 4;
  reglementPrincipalEtHonoraires = 5;
  reglementFraisEtHonoraires = 6;
  reglementGlobal = 7;
  messageExistanceCheque: String = "";

  problemeMontantReglementPrincipal: boolean = false;
  problemeMontantReglementFrais: boolean = false;
  problemeMontantReglementHonoraire: boolean = false;
  showObligatoireCodeBanque: boolean = false;
  showObligatoireNumCheque: boolean = false;
  showObligatoireAutreBeneficiaire: boolean = false;
  problemeMemeNumCheque: boolean = false;
  erreur: boolean = false;

  banques: Array<Banque> = new Array<Banque>();

  public banqueCtrl: FormControl = new FormControl();
  public banqueFilterCtrl: FormControl = new FormControl();
  public filteredBanque: ReplaySubject<Banque[]> = new ReplaySubject<Banque[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: NbAuthService,
    private reglementService: ReglementService,
    private beneficiaireService: BeneficiaireService,
    private clientService: ClientService,
    private acheteurService: AcheteurService,
    private risqueService: RisqueService,
    private banqueService: BanqueService,
    private router: Router,
    private toastrService: NbToastrService,
    private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    let donnees = this.transfertData.getDataWithCode();
    this.typeReglement = donnees[0];
    this.sinistre = donnees[1];

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });

    this.onGetBeneficiaireByCode();
    this.onGetTiersRecoursByCode();
    this.onGetRisqueByNumero(this.sinistre.sini_risque);
    this.onGetAllBanques();

    this.banqueFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanques();
      });

    

    this.myReglementFinancierForm.get('sinistreForm.sini_num').setValue(this.sinistre.sini_num);

    // ===================== LES INFOS DU MOUVEMENT ================
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_num').setValue(this.sinistre.mvts_num);
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_poli').setValue(this.sinistre.mvts_poli);
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_numsinistre').setValue(this.sinistre.mvts_numsinistre);
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(this.sinistre.mvts_typegestionsinistre);
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_tiers').setValue(this.sinistre.mvts_tiers);
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_nantissement').setValue(this.sinistre.mvts_nantissement);
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_benefnantissement').setValue(this.sinistre.mvts_benefnantissement);
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantnantissement').setValue(this.sinistre.mvts_montantnantissement);

    // ============= condition selon le type de reglement ==============================
    if (this.typeReglement == this.reglementPrincipal) {
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(this.sinistre.mvts_beneficiaire);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.sinistre.mvts_montantprincipal);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantfrais').setValue(0);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(0);

      // ============ controle de saisie
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_autrebeneficiaire').clearValidators();
      this.showObligatoireAutreBeneficiaire = false;

    } else if (this.typeReglement == this.reglementFrais) {
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_beneficiaire').setValue("");
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(0);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.sinistre.mvts_montantfrais);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(0);

      // ============ controle de saisie
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_autrebeneficiaire').setValidators(Validators.required);
      this.showObligatoireAutreBeneficiaire = true;

    } else if (this.typeReglement == this.reglementHonoraires) {
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_beneficiaire').setValue("");
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(0);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantfrais').setValue(0);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.sinistre.mvts_montanthonoraire);

      // ============ controle de saisie
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_autrebeneficiaire').setValidators(Validators.required);
      this.showObligatoireAutreBeneficiaire = true;

    } else if (this.typeReglement == this.reglementPrincipalEtFrais) {
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(this.sinistre.mvts_beneficiaire);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.sinistre.mvts_montantprincipal);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.sinistre.mvts_montantfrais);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(0);

      // ============ controle de saisie
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_autrebeneficiaire').clearValidators();
      this.showObligatoireAutreBeneficiaire = false;

    } else if (this.typeReglement == this.reglementPrincipalEtHonoraires) {
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(this.sinistre.mvts_beneficiaire);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.sinistre.mvts_montantprincipal);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantfrais').setValue(0);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.sinistre.mvts_montanthonoraire);

      // ============ controle de saisie
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_autrebeneficiaire').clearValidators();
      this.showObligatoireAutreBeneficiaire = false;

    } else if (this.typeReglement == this.reglementFraisEtHonoraires) {
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_beneficiaire').setValue("");
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(0);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.sinistre.mvts_montantfrais);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.sinistre.mvts_montanthonoraire);

      // ============ controle de saisie
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_autrebeneficiaire').setValidators(Validators.required);
      this.showObligatoireAutreBeneficiaire = true;

    } else if (this.typeReglement == this.reglementGlobal) {
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(this.sinistre.mvts_beneficiaire);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.sinistre.mvts_montantprincipal);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.sinistre.mvts_montantfrais);
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.sinistre.mvts_montanthonoraire);

      // ============ controle de saisie
      this.myReglementFinancierForm.get('mvtsinistreForm.mvts_autrebeneficiaire').clearValidators();
      this.showObligatoireAutreBeneficiaire = false;
    }

    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_autrebeneficiaire').updateValueAndValidity();

    this.myReglementFinancierForm.get('typeReglement').setValue(Number(this.typeReglement));

    this.montantReglementPrincipal = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantprincipal);
    this.montantReglementFrais = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantfrais);
    this.montantReglementHonoraire = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montanthonoraire);

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterBanques() {
    if (!this.banques) {
      return;
    }
    // get the search keyword
    let search = this.banqueFilterCtrl.value;
    if (!search) {
      this.filteredBanque.next(this.banques.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanque.next(
      this.banques.filter(bq => bq.banq_codebanque.toString()?.toLowerCase().indexOf(search) > -1 ||
      bq.banq_codenormalise.toString().toLowerCase().indexOf(search) > -1 ||
      bq.banq_denomination.toString().toLowerCase().indexOf(search) > -1 )

    );
  }

  // ======== ON GET METHODE ======

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
      });
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

  onGetRisqueByNumero(numero: Number) {
    this.risqueService.getRisqueByNumero(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.adresseBeneficiaire = data.data?.risq_localisation1;
        } else {
          this.adresseBeneficiaire = "";
        }
      });
  }

  onGetAllBanques() {
    this.banqueService.getAllBanques()
      .subscribe((data: any) => {
        if(data.code === "ok"){
          this.banques = data.data as Banque[];
          this.filteredBanque.next(this.banques.slice());
        }else{
          this.banques = data.data;
        }
      });
  }

  getToday(): string {
    return dateFormatter(new Date(), 'yyyy-MM-dd')
  }

  // ============= ON CHANGE METHODE ==================
  onChangeCodeReglement(event) {
    // console.log(event);
    // console.log(this.myReglementFinancierForm.get('reglementForm.regl_codereglement').value);

    if (event === 'C' || event === 'T') {
      this.myReglementFinancierForm.get('reglementForm.regl_codebanque').setValidators(Validators.required);
      this.myReglementFinancierForm.get('reglementForm.regl_numcheque').setValidators(Validators.required);
      this.showObligatoireCodeBanque = true;
      this.showObligatoireNumCheque = true;
    } else {
      this.myReglementFinancierForm.get('reglementForm.regl_codebanque').clearValidators();
      this.myReglementFinancierForm.get('reglementForm.regl_numcheque').clearValidators();
      this.showObligatoireCodeBanque = false;
      this.showObligatoireNumCheque = false;
    }

    this.myReglementFinancierForm.get('reglementForm.regl_codebanque').updateValueAndValidity();
    this.myReglementFinancierForm.get('reglementForm.regl_numcheque').updateValueAndValidity();
  }

  onChangeBanque(event){
    console.log("========== Banque: "+ event.value);
    this.myReglementFinancierForm.get('reglementForm.regl_codebanque').setValue(event.value);
  }

  onFocusOutEventNumCheque(event) {

    if (event.target.value !== null && event.target.value !== "") {
      this.reglementService.getReglementByNumCheque(event.target.value)
        .subscribe((data: any) => {
          if (data.code === "ok") {
            // Le numéro de cheque est déjà utilisé
            this.problemeMemeNumCheque = true;
            this.messageExistanceCheque = data.message;
            this.erreur = true;
          } else {
            this.problemeMemeNumCheque = false;
            this.erreur = false;
          }
        });
    }
  }

  getColorNumCheque() {
    if (this.problemeMemeNumCheque) {
      return '1px solid red';
    }
    else {
      return '';
    }
  }

  onSubmit() {
    this.myReglementFinancierForm.get('mvtsinistreForm.mvts_codeutilisateur').setValue(this.user.util_numero);
   
    this.reglementService.reglementFinancierSinistre(this.myReglementFinancierForm.value)
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
          this.router.navigateByUrl('home/gestion-comptable/gestion-reglement-financier/view-reglement-financier');

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

  onCancel() {
    this.router.navigateByUrl("home/gestion-comptable/gestion-reglement-financier")
  }

}
