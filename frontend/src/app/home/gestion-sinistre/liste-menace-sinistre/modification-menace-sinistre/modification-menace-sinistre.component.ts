import { Component, OnInit, ViewChild } from '@angular/core';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import dateFormatter from 'date-format-conversion';
import { User } from '../../../../model/User';
import { UserService } from '../../../../services/user.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { Beneficiaire } from '../../../../model/Beneficiaire';
import { BeneficiaireService } from '../../../../services/beneficiaire.service';
import { sinistreService } from '../../../../services/sinistre.service';
import { CreditService } from '../../../../services/credit.service';
import { RisqueLocatifService } from '../../../../services/risquelocatif.service';

@Component({
  selector: 'ngx-modification-menace-sinistre',
  templateUrl: './modification-menace-sinistre.component.html',
  styleUrls: ['./modification-menace-sinistre.component.scss']
})
export class ModificationMenaceSinistreComponent implements OnInit {

  mySinistreForm = this.fb.group({

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

    // mvt sinistre
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
      //A', actif/ 'C' comptabilisé/ 'N' annuler/etc.
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

    // crédit
    creditForm: this.fb.group({

      credit_numero: [''],
      credit_numeroclient: [''],
      credit_numeroachateur: [''],
      credit_type: [''],
      credit_typemarchandise: [''],
      credit_mtncredit: [''],
      credit_nbecheanceaccorde: [''],
      credit_nbechenaceretard: [''],
      credit_nbecheanceimpaye: [''],
      credit_mntindemnite: [''],
      credit_mtnrecours: [''],
      credit_mtnrecoursencaisse: [''],
      credit_chargerecouvrement: [''],
      credit_codeutil: [''],
      credit_datemodification: [''],
    }),

    risque_locatifForm: this.fb.group({

      riskl_numero: [''],
      riskl_numerorisquegenerique: [''],
      riskl_numeroclient: [''],
      riskl_numeroacheteur: [''],
      riskl_numeropolice: [''],
      riskl_type: [''],
      riskl_description: [''],
      riskl_mtnloyer: [''],
      riskl_nombreloyerimpaye: [''],
      riskl_mtnloyerimpaye: [''],
      riskl_mntloyerindemnite: [''],
      riskl_mntloyerrecouvre: [''],
      riskl_codeutilisateur: [''],
    }),

    // acheteurs : this.fb.array([]),

  });

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  sinistre: any;
  erreur: boolean = false;
  autorisation: [];

  montantPrincipal: any = "";
  montantFrais: any = "";
  montantHonoraire: any = "";
  montantCredit: any = "";
  montantMenace: any = "";
  montantLoyer: any = "";
  montantLoyerImpaye: any = "";


  afficherCredit: boolean = false;
  afficherRiskLocatif: boolean = false;
  erreurNbreLoyerImpaye: boolean = false;
  erreurNbreEcheanceRetard: boolean = false;

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private authService: NbAuthService,
    private creditService: CreditService,
    private risqueLocatifService: RisqueLocatifService,
    private sinistreService: sinistreService,
    private beneficiaireService: BeneficiaireService,
    private router: Router,
    private toastrService: NbToastrService,
    private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.sinistre = this.transfertData.getData();
    console.log(this.sinistre)
    // this.onGetAllBeneficiaires();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });

    // ============== Les données du sinistre =================
    this.mySinistreForm.get('sinistreForm.sini_num').setValue(this.sinistre.sini_num);


    // ============= Les données du mouvement sinistre ================
    this.mySinistreForm.get('mvtsinistreForm.mvts_num').setValue(this.sinistre.mvts_num);

    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.sinistre?.mvts_montantprincipal);
    this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.sinistre?.mvts_montantprincipal);

    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.sinistre.mvts_montantfrais);
    this.montantFrais = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantfrais);

    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.sinistre.mvts_montanthonoraire);
    this.montantHonoraire = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montanthonoraire);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_poli').setValue(this.sinistre.mvts_poli);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_numsinistre').setValue(this.sinistre.mvts_numsinistre);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_datemvt').setValue(dateFormatter(this.sinistre.mvts_datemvt, 'yyyy-MM-dd'));
    // this.mySinistreForm.get('mvtsinistreForm.mvts_typemvt').setValue(this.sinistre.mvts_typemvt);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(this.sinistre.mvts_typegestionsinistre);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_datesaisie').setValue(dateFormatter(this.sinistre.mvts_datesaisie, 'yyyy-MM-dd'));
    // this.mySinistreForm.get('mvtsinistreForm.mvts_montantmvt').setValue(this.sinistre.mvts_montantmvt);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_montantfinancier').setValue(this.sinistre.mvts_montantfinancier);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_status').setValue(this.sinistre.mvts_status);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(this.sinistre.mvts_beneficiaire);
    // this.benificiaire = this.sinistre.mvts_beneficiaire.toString();

    // this.mySinistreForm.get('mvtsinistreForm.mvts_tiers').setValue(this.sinistre.mvts_tiers);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_motifannulation').setValue(this.sinistre.mvts_motifannulation);
    // if (this.sinistre.mvts_dateannulation !== null && this.sinistre.mvts_dateannulation !== '') {
    //   this.mySinistreForm.get('mvtsinistreForm.mvts_dateannulation').setValue(dateFormatter(this.sinistre.mvts_dateannulation, 'yyyy-MM-dd'));
    // } else {
    //   this.mySinistreForm.get('mvtsinistreForm.mvts_dateannulation').setValue(this.sinistre.mvts_dateannulation);
    // }
    // this.mySinistreForm.get('mvtsinistreForm.mvts_datemodification').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    // this.mySinistreForm.get('mvtsinistreForm.mvts_datecomptabilisation').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));

    //  Pour afficher l'ecran d'identification du risque en fonction de la branche
    if (this.sinistre.sini_branche == 14) {
      this.afficherCredit = true;
      this.afficherRiskLocatif = false;
      this.mySinistreForm.get('creditForm.credit_numero').setValidators(Validators.required);
      this.mySinistreForm.get('risque_locatifForm.riskl_numero').clearValidators();
      this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValue(0);
    } else if (this.sinistre.sini_branche == 16) {
      this.afficherCredit = false;
      this.afficherRiskLocatif = true;
      this.mySinistreForm.get('creditForm.credit_numero').clearValidators();
      this.mySinistreForm.get('creditForm.credit_numero').setValue(0);
      this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValidators(Validators.required);
    }

    this.mySinistreForm.get('creditForm.credit_numero').updateValueAndValidity()
    this.mySinistreForm.get('risque_locatifForm.riskl_numero').updateValueAndValidity();

    this.onGetAllCreditByClientAndAcheteur(this.sinistre.sini_souscripteur, this.sinistre.sini_acheteur);
    this.onGetAllRisqueLocatifByClientAndPoliceAndAcheteur(this.sinistre.sini_souscripteur, this.sinistre.sini_police, this.sinistre.sini_acheteur);
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

  onGetAllCreditByClientAndAcheteur(numclient: Number, numAcheteur: Number) {
    this.creditService.getCreditByClientAndAcheteur(numclient, numAcheteur)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          // this.credits = data.data as Credit[];
          let credit = data.data[0];
          // console.log(credit);

          this.mySinistreForm.get('creditForm.credit_numero').setValue(credit.credit_numero);
          this.montantCredit = this.formatNumberService.numberWithCommas2(Number(credit.credit_mtncredit));
          this.mySinistreForm.get('creditForm.credit_mtncredit').setValue(credit.credit_mtncredit);
          this.mySinistreForm.get('creditForm.credit_nbecheanceaccorde').setValue(credit.credit_nbecheanceaccorde);
          this.mySinistreForm.get('creditForm.credit_nbechenaceretard').setValue(credit.credit_nbechenaceretard);
          this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue(credit.credit_nbecheanceimpaye);

          // Calcul du montant menacé
          let echeanceRetard = this.mySinistreForm.get('creditForm.credit_nbechenaceretard').value;
          this.montantMenace = Number((credit.credit_mtncredit / credit.credit_nbecheanceaccorde) * echeanceRetard);

          // Formatage pour affichage
          this.montantMenace = this.formatNumberService.numberWithCommas2(this.montantMenace);
        }
      });
  }

  onGetAllRisqueLocatifByClientAndPoliceAndAcheteur(numclient: Number, police: Number, numAcheteur: Number) {
    this.risqueLocatifService.getRisque_locatifsByClientAndPoliceAndAcheteur(numclient, police, numAcheteur)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          let risqueLocatif = data.data[0];

          this.mySinistreForm.get('risque_locatifForm.riskl_numero').setValue(risqueLocatif.riskl_numero);

          this.montantLoyer = this.formatNumberService.numberWithCommas2(Number(risqueLocatif.riskl_mtnloyer));
          this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').setValue(risqueLocatif.riskl_mtnloyer);

          this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').setValue(risqueLocatif.riskl_nombreloyerimpaye);
          let nbreLoyerImpaye = this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').value;

          this.montantLoyerImpaye = Number((risqueLocatif.riskl_mtnloyer * nbreLoyerImpaye));

          this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue(this.montantLoyerImpaye);

          // Formatage pour l'affichage
          this.montantLoyerImpaye = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);
        }
      });
  }

  // onGetAllBeneficiaires() {
  //   this.beneficiaireService.findAllBeneficiaires()
  //     .subscribe((data: any) => {
  //       if (data.code === "ok") {
  //         this.beneficiaires = data.data;
  //       } else {
  //         this.beneficiaires = data.data; //null
  //       }
  //     });
  // }

  // onChangeBeneficiaire(event: any) {
  //   console.log(event);
  //   this.mySinistreForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(Number(event));
  // }

  // onChangeFocusTiersRecours(event) {
  //   console.log(event.target.value);
  //   this.mySinistreForm.get('mvtsinistreForm.mvts_tiers').setValue(Number(event.target.value));
  // }

  onChangeFocusMontantPrincipal(event) {
    this.montantPrincipal = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
    this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
  }

  onChangeFocusMontantFrais(event) {

    this.montantFrais = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.montantFrais);
    this.montantFrais = this.formatNumberService.numberWithCommas2(this.montantFrais);
  }

  onChangeFocusMontantHonoraire(event) {

    this.montantHonoraire = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.montantHonoraire);
    this.montantHonoraire = this.formatNumberService.numberWithCommas2(this.montantHonoraire);
  }

  onChangeFocusNombreEcheanceRetard(event) {

    let montantCredit = this.mySinistreForm.get('creditForm.credit_mtncredit').value;
    let nbrEcheanceAccorde = this.mySinistreForm.get('creditForm.credit_nbecheanceaccorde').value;

    let nbreEcheanceEnRetard = this.mySinistreForm.get('creditForm.credit_nbechenaceretard').value;
    this.mySinistreForm.get('creditForm.credit_nbecheanceimpaye').setValue(nbreEcheanceEnRetard);

    // Calcul du montant menacé
    this.montantMenace = Number((montantCredit / nbrEcheanceAccorde) * nbreEcheanceEnRetard);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantMenace);

    // Formatage pour affichage
    // this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantMenace);
    this.montantMenace = this.formatNumberService.numberWithCommas2(this.montantMenace);

    // On se limite à 4 échéances
    if (nbreEcheanceEnRetard > nbrEcheanceAccorde) {
      this.erreur = true;
      this.erreurNbreEcheanceRetard = true;
    } else {
      this.erreur = false;
      this.erreurNbreEcheanceRetard = false;
    }

  }

  onChangeFocusNombreLoyersImpayes(event) {

    let montantLoyer = this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyer').value;
    let nbreLoyerImpaye = this.mySinistreForm.get('risque_locatifForm.riskl_nombreloyerimpaye').value;

    this.montantLoyerImpaye = Number((montantLoyer * nbreLoyerImpaye));

    this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').setValue(this.montantLoyerImpaye);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantLoyerImpaye);

    // this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);
    this.montantLoyerImpaye = this.formatNumberService.numberWithCommas2(this.montantLoyerImpaye);

    if (nbreLoyerImpaye > 4) {
      this.erreur = true;
      this.erreurNbreLoyerImpaye = true;
    } else {
      this.erreur = false;
      this.erreurNbreLoyerImpaye = false;
    }

  }

  getColorMontantPrincipal() {

    // if (this.problemeMontantPrincipalCredit || this.problemeMontantPrincipalRiskLocatif) {
    //   return '1px solid red';
    // } else {
    //   return '';
    // }
  }

  getColorNbreEcheanceRetard() {

    // if (this.erreurNbreEcheanceRetard) {
    //   return '1px solid red';
    // } else {
    //   return '';
    // }
  }

  getColorNbreLoyerImpayees() {

    if (this.erreurNbreLoyerImpaye) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  onSubmit() {
    // this.mySinistreForm.get('mvtsinistreForm.mvts_codeutilisateur').setValue(this.user.util_numero);
    console.log(this.mySinistreForm.value);


    this.sinistreService.modificationMenaceSinistre(this.mySinistreForm.value)
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

          // this.transfertData.setData(data.data);
          this.router.navigateByUrl('home/gestion-sinistre/liste-menace-sinistre');

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
    this.router.navigateByUrl("/home/gestion-sinistre/liste-menace-sinistre")
  }

}
