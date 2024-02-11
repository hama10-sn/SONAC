import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Mvtsinistre } from '../../../../model/Mvtsinistre';
import { RecoursFront } from '../../../../model/RecoursFront';
import { User } from '../../../../model/User';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { saveAs } from 'file-saver';
import { sinistreService } from '../../../../services/sinistre.service';
import { Sinistre } from '../../../../model/Sinistre';
import { Client } from '../../../../model/Client';
import { Acheteur } from '../../../../model/Acheteur';
import { Produit } from '../../../../model/Produit';
import { Intermediaire } from '../../../../model/Intermediaire';

@Component({
  selector: 'ngx-view-cloture-sinistre',
  templateUrl: './view-cloture-sinistre.component.html',
  styleUrls: ['./view-cloture-sinistre.component.scss']
})
export class ViewClotureSinistreComponent implements OnInit {
  recoursFront: RecoursFront;
  mvtsinistreForm: Mvtsinistre;
  sinistreForm: Sinistre;
  login_demandeur: string;
  demandeur: string;
  user: User;

  clients: Array<Client> = new Array<Client>();
  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  produits: Array<Produit> = new Array<Produit>();
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();

  constructor(private transferData: TransfertDataService,
    private sinistreService: sinistreService,
    private router: Router,
    private authService: NbAuthService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.recoursFront = this.transferData.getData();
    this.mvtsinistreForm = this.recoursFront.mvtsinistreForm;
    this.sinistreService.getSinistreByNumero(this.mvtsinistreForm.mvts_numsinistre)
      .subscribe((data: any) => {
        this.sinistreForm = data.data;
      })
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.login_demandeur = token.getPayload().sub;
        this.onGetUser(this.login_demandeur);
      }
    });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onGetLibelleByStatus(num: any) {
    if (num == 1) {
      return 'Menace sinistre';
    } else if (num == 2) {
      return 'Déclaration sinistre';
    } else if (num == 3) {
      return 'Modification évaluation';
    } else if (num == 4) {
      return 'Modification SAP';
    } else if (num == 5) {
      return 'Proposition règlement';
    } else if (num == 6) {
      return 'Règlement validé';
    } else if (num == 7) {
      return 'Annulation proposition règlement';
    } else if (num == 8) {
      return 'Annulation règlement validé';
    } else if (num == 9) {
      return 'Proposition recours';
    } else if (num == 10) {
      return 'Recours à encaisser validé';
    } else if (num == 11) {
      return 'Annulation proposition recours';
    } else if (num == 12) {
      return 'Annulation recours validé';
    } else if (num == 13) {
      return 'Recours encaissé';
    } else if (num == 14) {
      return 'Annulation recours encaissé';
    } else if(num == 15){
      return 'Sinistre clôturé';
    } else if(num == 16) {
      return 'Réouverture sinistre'
    } else if(num == 17) {
      return 'Moratoire à encaisser';
    } else if(num == 18) {
      return 'Pénalité à encaisser';
    } else {
      return '';
    }
  }

  onGetProduitByNumero(numero: any) {
    return (this.produits.find(p => p.prod_numero == numero))?.prod_denominationcourt;
  }

  onGetClientByCode(numero: any) {
    return numero + " : " + ((this.clients.find(c => c.client_id == numero))?.clien_prenom ? (this.clients.find(c => c.client_id == numero))?.clien_prenom : "") + " " + ((this.clients.find(c => c.client_id == numero))?.clien_nom ? (this.clients.find(c => c.client_id == numero))?.clien_nom : "") + " " + ((this.clients.find(c => c.client_id == numero))?.clien_denomination ? (this.clients.find(c => c.client_id == numero))?.clien_denomination : "");
  }

  onGetAcheteurByCode(numero: any) {
    if (numero !== null && numero !== '') {
      return numero + " : " + (this.acheteurs.find(a => a.achet_id == numero))?.achet_prenom + " " + (this.acheteurs.find(a => a.achet_id == numero))?.achet_nom;
    } else {
      return '';
    }
  }

  onGetIntermediaireByCode(numero: any) {
    return (this.intermediaires.find(i => i.inter_numero == numero))?.inter_denomination;
  }

  onExport() {
    let demandeurNew = this.demandeur.replace(/ /g, "_");
    this.sinistreService.generateFicheClotureSinistre(demandeurNew, this.recoursFront)
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
            saveAs(event.body, 'clôture sinistre.pdf');
        }
    });
  }

  cancel() {
    this.router.navigateByUrl('home/gestion-sinistre/cloture-sinistre');
  }
}
