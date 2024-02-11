import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { TransfertDataService } from '../../../../services/transfertData.service';

@Component({
  selector: 'ngx-choix-type-reglement',
  templateUrl: './choix-type-reglement.component.html',
  styleUrls: ['./choix-type-reglement.component.scss']
})
export class ChoixTypeReglementComponent implements OnInit {

  sinistre: any;

  afficherPrincipal: boolean = false;
  afficherFrais: boolean = false;
  afficherHonoraire: boolean = false;
  afficherPrincipalEtFrais: boolean = false;
  afficherPrincipalEtHonoraire: boolean = false;
  afficherFraisEtHonoraire: boolean = false;
  afficherGlobal: boolean = false;

  choixPrincipal = 1;
  choixFrais = 2;
  choixHonoraires = 3;
  choixPrincipalEtFrais = 4;
  choixPrincipalEtHonoraires = 5;
  choixFraisEtHonoraires = 6;
  choixGlobal = 7;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private transfertData: TransfertDataService,
    private router: Router,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {

    this.sinistre = this.transfertData.getData();
    console.log(this.sinistre);

    if (this.sinistre.mvts_montantfinancierprincipal != 0 && this.sinistre.mvts_montantfinancierfrais == 0 && this.sinistre.mvts_montantfinancierhonoraires == 0) {
      // On a regler uniquement le principal
      this.afficherPrincipal = false;
      this.afficherFrais = true;
      this.afficherHonoraire = true;
      this.afficherPrincipalEtFrais = false;
      this.afficherPrincipalEtHonoraire = false;
      this.afficherFraisEtHonoraire = true;
      this.afficherGlobal = false;

    } else if (this.sinistre.mvts_montantfinancierprincipal == 0 && this.sinistre.mvts_montantfinancierfrais != 0 && this.sinistre.mvts_montantfinancierhonoraires == 0) {
      // On a regler uniquement les frais
      this.afficherPrincipal = true;
      this.afficherFrais = false;
      this.afficherHonoraire = true;
      this.afficherPrincipalEtFrais = false;
      this.afficherPrincipalEtHonoraire = true;
      this.afficherFraisEtHonoraire = false;
      this.afficherGlobal = false;

    } else if (this.sinistre.mvts_montantfinancierprincipal == 0 && this.sinistre.mvts_montantfinancierfrais == 0 && this.sinistre.mvts_montantfinancierhonoraires != 0) {
      // On a regler uniquement les honoraires
      this.afficherPrincipal = true;
      this.afficherFrais = true;
      this.afficherHonoraire = false;
      this.afficherPrincipalEtFrais = true;
      this.afficherPrincipalEtHonoraire = false;
      this.afficherFraisEtHonoraire = false;
      this.afficherGlobal = false;

    } else if (this.sinistre.mvts_montantfinancierprincipal != 0 && this.sinistre.mvts_montantfinancierfrais != 0 && this.sinistre.mvts_montantfinancierhonoraires == 0) {
      // On a regler uniquement le principal et Frais
      this.afficherPrincipal = false;
      this.afficherFrais = false;
      this.afficherHonoraire = true;
      this.afficherPrincipalEtFrais = false;
      this.afficherPrincipalEtHonoraire = false;
      this.afficherFraisEtHonoraire = false;
      this.afficherGlobal = false;

    } else if (this.sinistre.mvts_montantfinancierprincipal != 0 && this.sinistre.mvts_montantfinancierfrais == 0 && this.sinistre.mvts_montantfinancierhonoraires != 0) {
      // On a regler uniquement le principal et Honoraires
      this.afficherPrincipal = false;
      this.afficherFrais = true;
      this.afficherHonoraire = false;
      this.afficherPrincipalEtFrais = false;
      this.afficherPrincipalEtHonoraire = false;
      this.afficherFraisEtHonoraire = false;
      this.afficherGlobal = false;

    } else if (this.sinistre.mvts_montantfinancierprincipal == 0 && this.sinistre.mvts_montantfinancierfrais != 0 && this.sinistre.mvts_montantfinancierhonoraires != 0) {
      // On a regler uniquement les Frais et Honoraires
      this.afficherPrincipal = true;
      this.afficherFrais = false;
      this.afficherHonoraire = false;
      this.afficherPrincipalEtFrais = false;
      this.afficherPrincipalEtHonoraire = false;
      this.afficherFraisEtHonoraire = false;
      this.afficherGlobal = false;

    } else {
      // Aucun règlement n'est fait
      this.afficherPrincipal = true;
      this.afficherFrais = true;
      this.afficherHonoraire = true;
      this.afficherPrincipalEtFrais = true;
      this.afficherPrincipalEtHonoraire = true;
      this.afficherFraisEtHonoraire = true;
      this.afficherGlobal = true;
    }
  }

  onChangeChoixTypeReglement(event) {

    if (event == this.choixPrincipal && this.sinistre.mvts_montantprincipal == 0) {
      this.toastrService.show(
        'Impossible le montant principal est à 0',
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    } else if (event == this.choixFrais && this.sinistre.mvts_montantfrais == 0) {
      this.toastrService.show(
        'Impossible le montant frais est à 0',
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });

    } else if (event == this.choixHonoraires && this.sinistre.mvts_montanthonoraire == 0) {
      this.toastrService.show(
        'Impossible le montant honoraires est à 0',
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });

    } else if (event == this.choixPrincipalEtFrais && this.sinistre.mvts_montantprincipal == 0 && this.sinistre.mvts_montantfrais == 0) {
      this.toastrService.show(
        'Impossible le montant principal et frais sont à 0',
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });

    } else if (event == this.choixPrincipalEtHonoraires && this.sinistre.mvts_montantprincipal == 0 && this.sinistre.mvts_montanthonoraire == 0) {
      this.toastrService.show(
        'Impossible le montant principal et honoraires sont à 0',
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });

    } else if (event == this.choixFraisEtHonoraires && this.sinistre.mvts_montantfrais == 0 && this.sinistre.mvts_montanthonoraire == 0) {
      this.toastrService.show(
        'Impossible le montant frais et honoraires sont à 0',
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });

    } else if (event == this.choixGlobal && this.sinistre.mvts_montantprincipal == 0 && this.sinistre.mvts_montantfrais == 0 && this.sinistre.mvts_montanthonoraire == 0) {
      this.toastrService.show(
        'Impossible le montant principal, frais et honoraires sont à 0',
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });

    } else {
      this.transfertData.setDataWithCode(event, this.sinistre);
      this.router.navigateByUrl('home/gestion-comptable/gestion-reglement-financier/reglement-financier');
    }

  }

}
