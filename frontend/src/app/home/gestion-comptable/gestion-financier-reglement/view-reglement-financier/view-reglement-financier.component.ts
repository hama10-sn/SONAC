import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Client } from '../../../../model/Client';
import { Mvtsinistre } from '../../../../model/Mvtsinistre';
import { Reglement } from '../../../../model/Reglement';
import { Sinistre } from '../../../../model/Sinistre';
import { User } from '../../../../model/User';
import { AcheteurService } from '../../../../services/acheteur.service';
import { ClientService } from '../../../../services/client.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { ProduitService } from '../../../../services/produit.service';
import { ReglementService } from '../../../../services/reglement.service';
import { sinistreService } from '../../../../services/sinistre.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ReglementFinancier } from '../../../../model/ReglementFinancier';

@Component({
  selector: 'ngx-view-reglement-financier',
  templateUrl: './view-reglement-financier.component.html',
  styleUrls: ['./view-reglement-financier.component.scss']
})
export class ViewReglementFinancierComponent implements OnInit {

  autorisation = [];
  titre: String = "REGLEMENT FINANCIER du SINISTRE N°";
  titreButionEdition: String = "EDITER FICHE REGLEMENT FINANCIER";
  reglementFinancierRecuperer: ReglementFinancier;
  sinistreForm: Sinistre;
  mvtsinistreForm: Mvtsinistre;
  reglementForm: Reglement;
  typeReglement: Number;

  client: Client;
  intermediaire: any;
  produit: any;
  acheteur: any;
  login_demandeur: string;
  demandeur: string;
  user: User;
  statutPropositionReglement = 5;
  statutValidationReglement = 6;

  // afficherCredit: boolean = false;
  // afficherRisqueLocatif: boolean = false;
  afficheAcheteur: boolean = false;

  constructor(
    private transferData: TransfertDataService,
    private clientService: ClientService,
    private intermediaireService: IntermediaireService,
    private produitService: ProduitService,
    private acheteurService: AcheteurService,
    private sinistreService: sinistreService,
    private router: Router,
    private authService: NbAuthService,
    private userService: UserService,
    private reglementService: ReglementService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });

    this.reglementFinancierRecuperer = this.transferData.getData();
    console.log(this.reglementFinancierRecuperer);

    this.reglementForm = this.reglementFinancierRecuperer.reglementForm;
    this.mvtsinistreForm = this.reglementFinancierRecuperer.mvtsinistreForm;
    this.sinistreForm = this.reglementFinancierRecuperer.sinistreForm;
    this.typeReglement = this.reglementFinancierRecuperer.typeReglement;

    console.log(this.reglementForm);
    console.log(this.mvtsinistreForm);
    console.log(this.sinistreForm);
    console.log(this.typeReglement);

    console.log("\n============================= ")

    this.clientService.getClientByNumero(this.sinistreForm.sini_souscripteur)
      .subscribe((data1: any) => {
        this.client = data1.data;
        console.log(this.client);

      });

    this.intermediaireService.getIntemediaire(this.sinistreForm.sini_intermediaire)
      .subscribe((data2) => {
        this.intermediaire = data2;
        console.log(this.intermediaire);
      });

    this.produitService.getProduit(this.sinistreForm.sini_produit)
      .subscribe((data3) => {
        this.produit = data3;
        console.log(this.produit);
      });

    if(this.sinistreForm.sini_acheteur == null){
      this.acheteur = null;
      this.afficheAcheteur = false;

    } else {

      this.acheteurService.findAcheteurByNumero(this.sinistreForm.sini_acheteur)
        .subscribe((data4:any) => {
        if(data4.code === "ok"){
          this.acheteur = data4.data;
          this.afficheAcheteur = true;
        }else{
          this.acheteur = data4.data;
          this.afficheAcheteur = false;
        }
        
        console.log(this.acheteur);
      });
    }



  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
    console.log(this.demandeur)
  }

  onGetLibelleByTypeMvt(num: any) {
    if (num == 19) {
      return 'Reglement Financier';
    } else {
      return '';
    }
  }

  onGetLibelleByCodeReglement(code: any) {
    if (code === 'C') {
      return 'Chèque';
    }else if (code === 'T') {
      return 'Traite';
    }else if (code === 'V') {
      return 'Virement';
    }else if (code === 'E') {
      return 'Espèces';
    } else {
      return '';
    }
  }

  onExport(numSinistre: any, numMvts: any) {
  
    let demandeurNew = this.demandeur.replace(/ /g, "_");
    const form = new FormData();
    form.append("demandeur", demandeurNew);

      this.reglementService.generateEditionFicheReglementFinancier(numSinistre, numMvts, form)
        .subscribe(event => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              break;
            case HttpEventType.UploadProgress:
              break;
            case HttpEventType.Response:
              saveAs(event.body, 'reglement financier.pdf');
          }
        });
  }

  onCancel() {

    this.router.navigateByUrl('home/gestion-comptable/gestion-reglement-financier');
  }

}
