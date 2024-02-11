import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Client } from '../../../../model/Client';
import { Mvtsinistre } from '../../../../model/Mvtsinistre';
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
import { PropositionReglementFront } from '../../../../model/PropositionReglementFront';

@Component({
  selector: 'ngx-view-reglement',
  templateUrl: './view-reglement.component.html',
  styleUrls: ['./view-reglement.component.scss']
})
export class ViewReglementComponent implements OnInit {

  autorisation = [];
  titre: String = "";
  titreButionEdition: String ;
  // reglementRecuperer: ValidationReglementFront;
  propositionReglement: PropositionReglementFront;
  // reglementForm: Reglement;
  mvtsinistreForm: Mvtsinistre;
  sinistreForm: Sinistre;

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

    this.propositionReglement = this.transferData.getData();
    console.log(this.propositionReglement);

    // this.reglementForm = this.reglementRecuperer.reglementForm;
    this.mvtsinistreForm = this.propositionReglement.mvtsinistreForm;
    this.sinistreForm = this.propositionReglement.sinistreForm;

    // console.log(this.reglementForm);
    console.log(this.mvtsinistreForm);
    console.log(this.sinistreForm);


    if (this.mvtsinistreForm.mvts_typemvt == this.statutPropositionReglement) {
      this.titre = "PROPOSITION DE REGLEMENT";
      this.titreButionEdition = "EDITER FICHE PROPOSITION REGLEMENT";
    } else if (this.mvtsinistreForm.mvts_typemvt == this.statutValidationReglement) {
      this.titre = "VALIDATION REGLEMENT";
      this.titreButionEdition = "EDITER FICHE VALIDATION REGLEMENT";
    }


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

  onGetLibelleByTypeMvts(num: any) {
    if (num == 5) {
      return 'Proposition règlement';
    } else if (num == 6) {
      return 'Règlement validé';
    }
  }

  onExport() {
    let demandeurNew = this.demandeur.replace(/ /g, "_");
    const form = new FormData();
    form.append("demandeur", demandeurNew);


    if (this.mvtsinistreForm.mvts_typemvt == this.statutPropositionReglement) {

      this.reglementService.generateEditionFichePropositionReglement(this.sinistreForm.sini_num, this.mvtsinistreForm.mvts_num, form)
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
              saveAs(event.body, 'proposition reglement.pdf');
          }
        });

    } else if (this.mvtsinistreForm.mvts_typemvt == this.statutValidationReglement) {

      this.reglementService.generateEditionFicheValidationReglement(this.sinistreForm.sini_num, this.mvtsinistreForm.mvts_num, form)
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
              saveAs(event.body, 'validation reglement.pdf');
          }
        });
    }
  }

  onCancel() {

    this.router.navigateByUrl('home/gestion-sinistre/liste-sinistre');
  }

}
