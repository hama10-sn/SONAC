import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbDialogService } from '@nebular/theme';
import { Acheteur } from '../../../../../model/Acheteur';
import { Client } from '../../../../../model/Client';
import { Produit } from '../../../../../model/Produit';
import { User } from '../../../../../model/User';
import { AcheteurService } from '../../../../../services/acheteur.service';
import { ClientService } from '../../../../../services/client.service';
import { ProduitService } from '../../../../../services/produit.service';
import { sinistreService } from '../../../../../services/sinistre.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';
import { ReglementService } from '../../../../../services/reglement.service';

@Component({
  selector: 'ngx-details-liste-reglement-financier',
  templateUrl: './details-liste-reglement-financier.component.html',
  styleUrls: ['./details-liste-reglement-financier.component.scss']
})
export class DetailsListeReglementFinancierComponent implements OnInit {

  sinistre: any;
  autorisation = [];
  login_demandeur: string;
  demandeur: string;
  user: User;

  clients: Array<Client> = new Array<Client>();
  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  produits: Array<Produit> = new Array<Produit>();

  constructor(private router: Router,
    private authService: NbAuthService,
    private userService: UserService,
    private clientService: ClientService,
    private acheteurService: AcheteurService,
    private transfertData: TransfertDataService,
    private produitService: ProduitService) { }

  ngOnInit(): void {

    this.sinistre = this.transfertData.getData();
    this.onGetAllClient();
    this.onGetAllAcheteur();
    this.onGetAllProduits();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });
  }

  // ========== ON GET METHODE ============

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clients = data as Client[];
      });
  }

  onGetAllAcheteur() {
    this.acheteurService.getAllAcheteurs()
      .subscribe((data: Acheteur[]) => {
        this.acheteurs = data as Acheteur[];
      });
  }

  onGetAllProduits() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.produits = data as Produit[];
      })
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

  onGetProduitByNumero(numero: any) {
    return (this.produits.find(p => p.prod_numero == numero))?.prod_denominationcourt;
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
    } else if (num == 15) {
      return 'Sinistre clôturé';
    } else if (num == 16) {
      return 'Réouverture sinistre'
    } else if (num == 17) {
      return 'Moratoire à encaisser';
    } else if (num == 18) {
      return 'Pénalité à encaisser';
    } else if (num == 19) {
      return 'Règlement financier';
    } else if (num == 20) {
      return 'Encaissement financier recours';
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

  onGetLibelleByCodeBanque(num: any) {
    if (num !== null || num !== "") {
      return num;
    } else {
      return '';
    }
  }

  onGetLibelleByNumCheque(num: any) {
    if (num !== null || num !== "") {
      return num;
    } else {
      return '';
    }
  }

  onCancel(){
    this.router.navigateByUrl('home/gestion-comptable/gestion-reglement-financier/liste-reglement-financier');
  }
  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
