import { Component, OnInit, ViewChild } from '@angular/core';
import { TransfertDataService } from '../../../services/transfertData.service';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Subject } from 'rxjs';
import dateFormatter from 'date-format-conversion';
import { User } from '../../../model/User';
import { UserService } from '../../../services/user.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { FormatNumberService } from '../../../services/formatNumber.service';
import { Beneficiaire } from '../../../model/Beneficiaire';
import { BeneficiaireService } from '../../../services/beneficiaire.service';
import { sinistreService } from '../../../services/sinistre.service';
import { Client } from '../../../model/Client';
import { ClientService } from '../../../services/client.service';
import { AcheteurService } from '../../../services/acheteur.service';
import { Acheteur } from '../../../model/Acheteur';

@Component({
  selector: 'ngx-modification-evaluation',
  templateUrl: './modification-evaluation.component.html',
  styleUrls: ['./modification-evaluation.component.scss']
})
export class ModificationEvaluationComponent implements OnInit {

  mySinistreForm = this.fb.group({

    // sinistreForm: this.fb.group({

    //   sini_num: [''],
    //   sini_police: [''],
    //   sini_risque: [''],
    //   sini_intermediaire: [''],
    //   sini_codecompagnie: [''],
    //   sini_branche: [''],
    //   sini_categorie: [''],
    //   sini_produit: [''],
    //   sini_typesinistre: [''],
    //   sini_datesurvenance: [''],
    //   sini_datedeclaration: [''],
    //   sini_datesaisie: [''],
    //   sini_souscripteur: [''],
    //   sini_beneficiaire: [''],
    //   sini_acheteur: ['',],
    //   sini_donneurdordre: [''],
    //   sini_tiersrecours: [''],
    //   sini_lieu: [''],
    //   sini_description: [''],
    //   sini_coderesponsabilite: [''],
    //   sini_evaluationglobale: [''],
    //   sini_evaluationprincipale: [''],
    //   sini_evaluationfrais: [''],
    //   sini_evaluationhonoraires: [''],
    //   sini_sapglobale: [''],
    //   sini_sapprincipale: [''],
    //   sini_sapfrais: [''],
    //   sini_saphonoraires: [''],
    //   sini_reglementglobal: [''],
    //   sini_reglementprincipal: [''],
    //   sini_reglementfrais: [''],
    //   sini_reglementhonoraires: [''],
    //   sini_recoursglobal: [''],
    //   sini_recoursprincipal: [''],
    //   sini_recoursfrais: [''],
    //   sini_recourshonoraires: [''],
    //   sini_recoursglobalencaisse: [''],
    //   sini_recoursprincipalencaisse: [''],
    //   sini_recoursfraisencaisse: [''],
    //   sini_recourshonoraieencaisse: [''],
    //   sini_datederniermvt: [''],
    //   sini_numderniermvt: [''],
    //   sini_utilisateur: [''],
    //   sini_datemodification: [''],
    //   sini_codeexpert: [''],
    //   sini_dateexpert: [''],
    //   sini_rapport: [''], // Oui ou Non
    //   sini_status: [''],
    //   sini_motifcloture: [''],
    //   sini_datecloture: [''],
    // }),

    // mvt sinistre
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
  });

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;
  sinistre: any;
  autorisation: [];

  erreur: boolean = false;
  afficherTiersClient: boolean = false;
  afficherTiersAcheteur: boolean = false;

  ancienMontantPrincipal: any = "";
  ancienMontantFrais: any = "";
  ancienMontantHonoraire: any = "";
  // ancienMontantTotal: any;
  nouveauMontantPrincipal: any = "";
  nouveauMontantFrais: any = "";
  nouveauMontantHonoraire: any = "";
  // nouveauMontantTotal: any = "";
  tiersRecours: any = "";
  benificiaire: any = "";
  tiersRecours2: any = "";
  benificiaire2: any = "";
  beneficiaires: Beneficiaire;
  donneur_ordre: any = "";
  modificationEvaluation = 3;
  brancheCredit = 14;
  brancheCaution = 15;
  branchePertePecuniaires = 16;

  // Les tableaux
  clientes: Array<Client> = new Array<Client>();
  acheteurs: Array<Acheteur> = new Array<Acheteur>();

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
    console.log(this.sinistre)
    this.onGetAllBeneficiaires();
    this.onGetAllClient();
    this.onGetAllAcheteurs();
    this.onGetTiersRecoursByCode();
    this.onGetBeneficiaireByCode();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });

    this.mySinistreForm.get('mvtsinistreForm.mvts_poli').setValue(this.sinistre.mvts_poli);
    this.mySinistreForm.get('mvtsinistreForm.mvts_numsinistre').setValue(this.sinistre.mvts_numsinistre);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_datemvt').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    // this.mySinistreForm.get('mvtsinistreForm.mvts_typemvt').setValue(this.sinistre.mvts_typemvt);
    this.mySinistreForm.get('mvtsinistreForm.mvts_typegestionsinistre').setValue(this.sinistre.mvts_typegestionsinistre);
    // this.mySinistreForm.get('mvtsinistreForm.mvts_datesaisie').setValue(dateFormatter(this.sinistre.mvts_datesaisie, 'yyyy-MM-dd'));
    // this.mySinistreForm.get('mvtsinistreForm.mvts_montantmvt').setValue(this.sinistre.mvts_montantmvt);
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfinancier').setValue(this.sinistre.mvts_montantfinancier);
    this.mySinistreForm.get('mvtsinistreForm.mvts_status').setValue(this.sinistre.mvts_status);

    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.sinistre.sini_evaluationprincipale);
    this.ancienMontantPrincipal = this.formatNumberService.numberWithCommas2(this.sinistre.sini_evaluationprincipale);

    this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.sinistre.sini_evaluationfrais);
    this.ancienMontantFrais = this.formatNumberService.numberWithCommas2(this.sinistre.sini_evaluationfrais);

    this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.sinistre.sini_evaluationhonoraires);
    this.ancienMontantHonoraire = this.formatNumberService.numberWithCommas2(this.sinistre.sini_evaluationhonoraires);

    // this.ancienMontantTotal = this.formatNumberService.numberWithCommas2(this.sinistre.mvts_montantprincipal + this.sinistre.mvts_montantfrais + this.sinistre.mvts_montanthonoraire);

    this.mySinistreForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(this.sinistre.mvts_beneficiaire);
    this.benificiaire = this.sinistre.mvts_beneficiaire.toString();

    this.mySinistreForm.get('mvtsinistreForm.mvts_tiers').setValue(this.sinistre.mvts_tiers);
    this.tiersRecours = this.sinistre.mvts_tiers.toString();

    this.mySinistreForm.get('mvtsinistreForm.mvts_motifannulation').setValue(this.sinistre.mvts_motifannulation);
    if (this.sinistre.mvts_dateannulation !== null && this.sinistre.mvts_dateannulation !== '') {
      this.mySinistreForm.get('mvtsinistreForm.mvts_dateannulation').setValue(dateFormatter(this.sinistre.mvts_dateannulation, 'yyyy-MM-dd'));
    } else {
      this.mySinistreForm.get('mvtsinistreForm.mvts_dateannulation').setValue(this.sinistre.mvts_dateannulation);
    }
    // this.mySinistreForm.get('mvtsinistreForm.mvts_datemodification').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));
    // this.mySinistreForm.get('mvtsinistreForm.mvts_datecomptabilisation').setValue(dateFormatter(new Date(), 'yyyy-MM-dd'));

    if (this.sinistre.sini_branche == this.brancheCaution) {
      console.log("========== ON EST EN CAUTION ============");
      // this.tiersRecours = this.sinistre.sini_souscripteur.toString();
      this.afficherTiersClient = true;
      this.afficherTiersAcheteur = false;
    } else {
      console.log("========== ON EST EN CREDIT OU PERTE PECU...");
      // this.tiersRecours = this.sinistre.sini_acheteur.toString();
      this.afficherTiersClient = false;
      this.afficherTiersAcheteur = true;
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // =========== onGetMethode ======================

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
      });
  }

  // onGetBeneficiaireByCode(numBenef: any) {
  //   this.beneficiaireService.getBeneficiaire(numBenef)
  //     .subscribe((data: Beneficiaire) => {
  //       console.log(data)
  //       if (data.benef_prenoms !== null && data.benef_prenoms !== '' && data.benef_nom !== null && data.benef_nom !== '') {
  //         this.benificiaire = (data.benef_Num + " : " + data?.benef_prenoms + " " + data?.benef_nom).toString();
  //       console.log("=========== 1")
  //       } else if (data.benef_denom !== null && data.benef_denom !== '') {
  //         this.benificiaire = (data.benef_Num + " : " + data?.benef_denom).toString();
  //         console.log("=========== 2")
  //       } else {
  //         this.benificiaire = (data.benef_Num + " : " + data?.benef_prenoms + " " + data?.benef_nom + " " + data?.benef_denom).toString();
  //         console.log("=========== 3")
  //       }
  //       // this.benificiaire = data.benef_Num + " : " + data?.benef_prenoms + " " + data?.benef_nom + " " + data?.benef_denom;
  //       console.log(this.benificiaire);
  //     });
  // }

  onGetAllBeneficiaires() {
    this.beneficiaireService.findAllBeneficiaires()
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.beneficiaires = data.data;
        } else {
          this.beneficiaires = data.data; //null
        }
      });
  }

  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientes = data as Client[];
        // this.filteredClients.next(this.clientes.slice());
      });
  }

  onGetAllAcheteurs() {
    this.acheteurService.findAllAcheteurs()
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.acheteurs = data.data;
          // this.filteredPolices.next(this.polices.slice());
        } else {
          this.acheteurs = data.data;
        }
      });
  }

  onGetBeneficiaireByCode() {
    this.beneficiaireService.getBeneficiaire(this.sinistre.sini_beneficiaire)
      .subscribe((data: Beneficiaire) => {
        this.benificiaire2 = data?.benef_Num + " : " + (data?.benef_prenoms ? data?.benef_prenoms : "") + " " + (data?.benef_nom ? data?.benef_nom : "") + " " + (data?.benef_denom ? data?.benef_denom : "");
      });
  }

  onGetTiersRecoursByCode() {
    if (this.sinistre.sini_acheteur !== null && this.sinistre.sini_acheteur !== "") {
      this.acheteurService.getAcheteur(this.sinistre.sini_acheteur)
        .subscribe((data: Acheteur) => {
          this.tiersRecours2 = data?.achet_numero + " : " + (data?.achet_prenom ? data?.achet_prenom : "") + " " + (data?.achet_nom ? data?.achet_nom : "");
        });
    } else {
      this.clientService.getClient(this.sinistre.sini_souscripteur)
        .subscribe((data: Client) => {
          this.tiersRecours2 = data?.clien_numero + " : " + (data?.clien_prenom ? data?.clien_prenom : "") + " " + (data?.clien_nom ? data?.clien_nom : "") + " " + (data?.clien_denomination ? data?.clien_denomination : "");
        });
    }
  }

  // =========== onChangeMethode ===================

  onChangeBeneficiaire(event: any) {
    console.log(event);
    this.mySinistreForm.get('mvtsinistreForm.mvts_beneficiaire').setValue(Number(event));
  }

  onChangeTiersRecours(event) {
    console.log(event);
    this.mySinistreForm.get('mvtsinistreForm.mvts_tiers').setValue(Number(event));
  }

  onChangeFocusMontantPrincipal(event) {

    this.nouveauMontantPrincipal = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    if (this.nouveauMontantPrincipal != 0) {
      this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.nouveauMontantPrincipal);
    }

    // // Calculer le nouveau montant total
    // if (this.nouveauMontantFrais !== '') {
    //   this.nouveauMontantFrais = Number(this.formatNumberService.replaceAll(this.nouveauMontantFrais, ' ', ''));
    // }
    // if (this.nouveauMontantHonoraire !== '') {
    //   this.nouveauMontantHonoraire = Number(this.formatNumberService.replaceAll(this.nouveauMontantHonoraire, ' ', ''));
    // }
    // this.nouveauMontantTotal = Number(this.nouveauMontantPrincipal) + Number(this.nouveauMontantFrais) + Number(this.nouveauMontantHonoraire);

    // // Formatage pour affichage
    // this.nouveauMontantTotal = this.formatNumberService.numberWithCommas2(Number(this.nouveauMontantTotal));

    this.nouveauMontantPrincipal = this.formatNumberService.numberWithCommas2(Number(this.nouveauMontantPrincipal));
    // this.nouveauMontantFrais = this.formatNumberService.numberWithCommas2(Number(this.nouveauMontantFrais));
    // this.nouveauMontantHonoraire = this.formatNumberService.numberWithCommas2(Number(this.nouveauMontantHonoraire));
  }

  onChangeFocusMontantFrais(event) {

    this.nouveauMontantFrais = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    if (this.nouveauMontantFrais != 0) {
      this.mySinistreForm.get('mvtsinistreForm.mvts_montantfrais').setValue(this.nouveauMontantFrais);
    }

    this.nouveauMontantFrais = this.formatNumberService.numberWithCommas2(Number(this.nouveauMontantFrais));
  }

  onChangeFocusMontantHonoraire(event) {

    this.nouveauMontantHonoraire = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    if (this.nouveauMontantHonoraire != 0) {
      this.mySinistreForm.get('mvtsinistreForm.mvts_montanthonoraire').setValue(this.nouveauMontantHonoraire);
    }

    this.nouveauMontantHonoraire = this.formatNumberService.numberWithCommas2(Number(this.nouveauMontantHonoraire));
  }

  getColorMontantPrincipal() {

    // if (this.problemeMontantPrincipalCredit || this.problemeMontantPrincipalRiskLocatif) {
    //   return '1px solid red';
    // } else {
    //   return '';
    // }
  }

  onSubmit() {
    this.mySinistreForm.get('mvtsinistreForm.mvts_codeutilisateur').setValue(this.user.util_numero);
    console.log(this.mySinistreForm.value);


    this.sinistreService.modificationEvaluationSinistre(this.mySinistreForm.value)
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
          this.router.navigateByUrl('home/gestion-sinistre/modification-evaluation/view');

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
    this.router.navigateByUrl("/home/gestion-sinistre/liste-sinistre")
  }

}
