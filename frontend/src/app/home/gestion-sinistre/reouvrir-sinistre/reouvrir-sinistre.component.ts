import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Acheteur } from '../../../model/Acheteur';
import { Client } from '../../../model/Client';
import { Produit } from '../../../model/Produit';
import { Sinistre } from '../../../model/Sinistre';
import { User } from '../../../model/User';
import { AcheteurService } from '../../../services/acheteur.service';
import { ClientService } from '../../../services/client.service';
import { ProduitService } from '../../../services/produit.service';
import { sinistreService } from '../../../services/sinistre.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ngx-reouvrir-sinistre',
  templateUrl: './reouvrir-sinistre.component.html',
  styleUrls: ['./reouvrir-sinistre.component.scss']
})
export class ReouvrirSinistreComponent implements OnInit {
  title = 'La liste des sinistres clôturés';
  autorisation = [];
  login_demandeur: string;
  demandeur: string;
  user: User;
  sini: any;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  clients: Array<Client> = new Array<Client>();
  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  produits: Array<Produit> = new Array<Produit>();

  public displayedColumns = ['sin_client', 'sin_police', 'sin_acheteur', 'sin_num', 'sin_produits', 'statut', 'action'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router,
    private fb: FormBuilder,
    private authService: NbAuthService,
    private sinistreService: sinistreService,
    private userService: UserService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private clientService: ClientService,
    private acheteurService: AcheteurService,
    private transfertData: TransfertDataService,
    private produitService: ProduitService) { }

  ngOnInit(): void {
    this.onGetAllClient();
    this.onGetAllAcheteur();
    this.onGetAllProduits();
    this.onGetAllSinistreClotures();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onGetAllSinistreClotures() {
    this.sinistreService.getAllSinistreClotures()
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      })
  }

  onReouvrirSinistre(sinistre: Sinistre) {
    this.transfertData.setData(sinistre);
    this.router.navigateByUrl("/home/gestion-sinistre/ouvrir-sinistre");
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

  onGetAllProduits() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.produits = data as Produit[];
      })
  }

  onGetProduitByNumero(numero: any) {
    return (this.produits.find(p => p.prod_numero == numero))?.prod_denominationcourt;
  }

  onOpen(dialog: TemplateRef<any>, sinistre: Sinistre) {
    this.dialogService.open(
      dialog,
      {
        context: sinistre,
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
    } else {
      return '';
    }
  }

  onSubmit() {

  }

  cancel() {
    this.router.navigateByUrl("/home/gestion-sinistre/liste-sinistre");
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }
}
