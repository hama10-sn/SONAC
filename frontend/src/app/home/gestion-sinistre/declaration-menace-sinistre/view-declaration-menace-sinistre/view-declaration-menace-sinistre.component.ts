import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Acheteur } from '../../../../model/Acheteur';
import { Client } from '../../../../model/Client';
import { Credit } from '../../../../model/Credit';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Mvtsinistre } from '../../../../model/Mvtsinistre';
import { Produit } from '../../../../model/Produit';
import { RisqueLocatif } from '../../../../model/RisqueLocatif';
import { Sinistre } from '../../../../model/Sinistre';
import { SinistreFront } from '../../../../model/SinistreFront';
import { AcheteurService } from '../../../../services/acheteur.service';
import { ClientService } from '../../../../services/client.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { ProduitService } from '../../../../services/produit.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { saveAs } from 'file-saver';
// import type from '../../../data/type.json';
import { HttpEventType } from '@angular/common/http';
import { sinistreService } from '../../../../services/sinistre.service';
import { User } from '../../../../model/User';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'ngx-view-declaration-menace-sinistre',
  templateUrl: './view-declaration-menace-sinistre.component.html',
  styleUrls: ['./view-declaration-menace-sinistre.component.scss']
})
export class ViewDeclarationMenaceSinistreComponent implements OnInit {

  documentFinale = "";

  sinistreFront: SinistreFront;
  sinistreForm: Sinistre;
  mvtsinistreForm: Mvtsinistre;
  creditForm: Credit;
  risque_locatifForm: RisqueLocatif;

  client: Client;
  intermediaire: any;
  produit: any;
  acheteur: any;

  login_demandeur: string;
  demandeur: string;
  user: User;

  afficherCredit: boolean = false;
  afficherRisqueLocatif: boolean = false;

  constructor(
    private transferData: TransfertDataService,
    private clientService: ClientService,
    private intermediaireService: IntermediaireService,
    private produitService: ProduitService,
    private acheteurService: AcheteurService,
    private sinistreService: sinistreService,
    private router: Router,
    private authService: NbAuthService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          // this.autorisation = token.getPayload().fonctionnalite.split(',');

          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });

    this.sinistreFront = this.transferData.getData();

    this.sinistreForm = this.sinistreFront?.sinistreForm;
    this.mvtsinistreForm = this.sinistreFront?.mvtsinistreForm;
    this.creditForm = this.sinistreFront?.creditForm;
    this.risque_locatifForm = this.sinistreFront?.risque_locatifForm;

    if (this.creditForm == null && this.risque_locatifForm != null) {
      this.afficherCredit = false;
      this.afficherRisqueLocatif = true;
    } else if (this.creditForm != null && this.risque_locatifForm == null) {
      this.afficherCredit = true;
      this.afficherRisqueLocatif = false;
    } else {
      this.afficherCredit = false;
      this.afficherRisqueLocatif = false;
    }

    // console.log(this.sinistreFront);
    // console.log(this.sinistreForm);
    // console.log(this.mvtsinistreForm);
    // console.log(this.creditForm);
    // console.log(this.risque_locatifForm);

    this.clientService.getClient(this.sinistreForm.sini_souscripteur)
      .subscribe((data1) => {
        this.client = data1;
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

    this.acheteurService.getAcheteur(this.sinistreForm.sini_acheteur)
      .subscribe((data4) => {
        this.acheteur = data4;
        console.log(this.acheteur);
      });
  }

  cancel() {
    this.router.navigateByUrl('home/gestion-sinistre/declaration-menace-sinistre/ajout');
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onExport(typeDeclaration: String) {

    // let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");


    this.documentFinale = "doc";
    this.sinistreService.generateEditionFicheMenaceSinistre(typeDeclaration, demandeurNew, this.documentFinale, this.sinistreFront)
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
            saveAs(event.body, 'declaration menace de sinistre.pdf');
        }
      });
    // }
  }

}
