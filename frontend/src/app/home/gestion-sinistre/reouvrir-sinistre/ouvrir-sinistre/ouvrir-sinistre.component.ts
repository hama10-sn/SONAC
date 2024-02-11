import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import dateFormatter from 'date-format-conversion';
import { User } from '../../../../model/User';
import { AcheteurService } from '../../../../services/acheteur.service';
import { BeneficiaireService } from '../../../../services/beneficiaire.service';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { ClientService } from '../../../../services/client.service';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { PoliceService } from '../../../../services/police.service';
import { ProduitService } from '../../../../services/produit.service';
import { sinistreService } from '../../../../services/sinistre.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { Client } from '../../../../model/Client';
import { Beneficiaire } from '../../../../model/Beneficiaire';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Produit } from '../../../../model/Produit';

@Component({
  selector: 'ngx-ouvrir-sinistre',
  templateUrl: './ouvrir-sinistre.component.html',
  styleUrls: ['./ouvrir-sinistre.component.scss']
})
export class OuvrirSinistreComponent implements OnInit {
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
      mvts_montantprincipal: ['', [Validators.required]],
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
  sinistre: any;
  user: User;
  autorisation: [];

  numeroSinistre: any = "";
  clientChoisi: any = "";
  policeChoisie: any = "";
  donneurOrdre: any = "";
  beneficiaireChoisi: any = "";
  codeIntermediaire: any = "";
  brancheChoisie: any = "";
  codeProduit: any = "";
  numeroRisque: any = "";
  typeSinistre: any = "";
  dateSurvenance: any = "";
  dateDeclaration: any = "";
  dateSaisie: any = "";
  lieuSinistre: any = "";
  descriptionSinistre: any = "";
  montantFrais: any = "";
  montantHonoraire: any = "";
  montantPrincipal: any = "";

  listeNumeroCategorie: Categorie[];

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private authService: NbAuthService,
    private toastrService: NbToastrService,
    private router: Router,
    private userService: UserService,
    private clientService: ClientService,
    private policeService: PoliceService,
    private intermediaireService: IntermediaireService,
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private acheteurServie: AcheteurService,
    private sinistreService: sinistreService,
    private formatNumberService: FormatNumberService,
    private beneficiaireService: BeneficiaireService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.sinistre = this.transfertData.getData();
    this.onGetClientByCode();
    this.onGetDonneurOrdreByCode();
    this.onGetBeneficiaireByCode();
    this.onGetBrancheByCode();
    this.onGetIntermediaireByCode();
    this.onGetProduitByCode();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login = token.getPayload().sub;
          this.onGetUser(this.login);
        }
      });
    this.numeroSinistre = this.sinistre.sini_num;
    this.policeChoisie = this.sinistre.sini_police;
    this.numeroRisque = this.sinistre.sini_risque;
    this.typeSinistre = this.sinistre.sini_typesinistre;
    this.dateSurvenance = dateFormatter(this.sinistre.sini_datesurvenance, "dd/MM/yyyy");
    this.dateDeclaration = dateFormatter(this.sinistre.sini_datedeclaration, "dd/MM/yyyy");
    this.dateSaisie = dateFormatter(this.sinistre.sini_datesaisie, "dd/MM/yyyy");
    this.lieuSinistre = this.sinistre.sini_lieu;
    this.descriptionSinistre = this.sinistre.sini_description;
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

  onGetClientByCode() {
    this.clientService.getClient(this.sinistre.sini_souscripteur)
      .subscribe((data: Client) => {
        this.clientChoisi = data?.clien_numero + " : " + (data?.clien_prenom ? data?.clien_prenom : "") + " " + (data?.clien_nom ? data?.clien_nom : "") + " " + (data?.clien_denomination ? data?.clien_denomination : "");
      })
  }

  onGetDonneurOrdreByCode() {
    this.clientService.getClient(this.sinistre.sini_donneurdordre)
      .subscribe((data: Client) => {
        this.donneurOrdre = data?.clien_numero + " : " + (data?.clien_prenom ? data?.clien_prenom : "") + " " + (data?.clien_nom ? data?.clien_nom : "") + " " + (data?.clien_denomination ? data?.clien_denomination : "");
      })
  }

  onGetBeneficiaireByCode() {
    this.beneficiaireService.getBeneficiaire(this.sinistre.sini_beneficiaire)
      .subscribe((data: Beneficiaire) => {
        this.beneficiaireChoisi = data?.benef_Num + " : " + (data?.benef_prenoms ? data?.benef_prenoms : "") + " " + (data?.benef_nom ? data?.benef_nom : "") + " " + (data?.benef_denom ? data?.benef_denom : "");
      })
  }

  onGetIntermediaireByCode() {
    this.intermediaireService.getIntemediaire(this.sinistre.sini_intermediaire)
      .subscribe((data: Intermediaire) => {
        this.codeIntermediaire = data?.inter_numero + " : " + data?.inter_denomination;
      })
  }

  onGetBrancheByCode() {
    this.brancheService.getBranche(this.sinistre.sini_branche)
      .subscribe((data: Branche) => {
        this.brancheChoisie = data?.branche_numero + " : " + data?.branche_libelleLong;
      })
  }

  onGetProduitByCode() {
    this.produitService.getProduit(this.sinistre.sini_produit)
      .subscribe((data: Produit) => {
        this.codeProduit = data?.prod_numero + " : " + data?.prod_denominationlong;
      })
  }

  onChangeFocusMontantPrincipal(event) {
    this.montantPrincipal = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));
    this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
    this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    /*let monMontantMenace = Number(this.formatNumberService.replaceAll(this.montantMenace, ' ', ''));
    let monMontantLoyerImpayer = this.mySinistreForm.get('risque_locatifForm.riskl_mtnloyerimpaye').value;

    if (monMontantMenace != 0 && this.montantPrincipal > monMontantMenace) {
      this.problemeMontantPrincipalCredit = true;
      this.erreur = true;
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    } else if (monMontantLoyerImpayer !== '' && this.montantPrincipal > monMontantLoyerImpayer) {
      this.problemeMontantPrincipalRiskLocatif = true;
      this.erreur = true;
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    } else if (this.montantPrincipalProposeForEngagement != 0 && this.montantPrincipal > this.montantPrincipalProposeForEngagement) {
      this.problemeMontantPrincipalCaution = true;
      this.erreur = true;
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    } else {
      this.problemeMontantPrincipalCredit = false;
      this.problemeMontantPrincipalRiskLocatif = false;
      this.problemeMontantPrincipalCaution = false;
      this.erreur = false;
      this.mySinistreForm.get('mvtsinistreForm.mvts_montantprincipal').setValue(this.montantPrincipal);
      this.montantPrincipal = this.formatNumberService.numberWithCommas2(this.montantPrincipal);
    }*/
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

  onSubmit() {
    this.mySinistreForm.get('mvtsinistreForm.mvts_codeutilisateur').setValue(this.user.util_numero);
    this.sinistreService.reOuvertureSinistre(this.sinistre.sini_num, this.mySinistreForm.value)
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
          this.router.navigateByUrl('home/gestion-sinistre/view-reouvrir-sinistre');

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
