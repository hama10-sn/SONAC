import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Cimacodificationcompagnie } from '../../../../model/Cimacodificationcompagnie';
import { Client } from '../../../../model/Client';
import { Compagnie } from '../../../../model/Compagnie';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Police } from '../../../../model/Police';
import { Produit } from '../../../../model/Produit';
import { User } from '../../../../model/User';
import { ClientService } from '../../../../services/client.service';
import { CompagnieService } from '../../../../services/compagnie.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { PoliceService } from '../../../../services/police.service';
import { ProduitService } from '../../../../services/produit.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-gestion-police',
  templateUrl: './gestion-police.component.html',
  styleUrls: ['./gestion-police.component.scss']
})
export class GestionPoliceComponent implements OnInit {

  listePolices: Array<Police> = new Array<Police>();
  //prospect: Prospect ;

  public displayedColumns = ['poli_numero', 'poli_intermediaire', 'poli_compagnie', 'poli_codeproduit', 'details', 'engagement'];
  public dataSource = new MatTableDataSource<Police>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() name: Number;
  autorisation = [];
  codecimacomp: Array<Cimacodificationcompagnie> = new Array<Cimacodificationcompagnie>();
  aff: Boolean = true;
  listeNumeroIntermediaire: Array<Intermediaire> = new Array<Intermediaire>();
  produits: Array<Produit> = new Array<Produit>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  client: Number;
  listeClients: Array<Client> = new Array<Client>();
  trclient: Client;

  title = 'La liste des polices (par ordre de numéro)';
  login_demandeur: string;
  demandeur: string;
  user: User;

  constructor(private policeService: PoliceService,
    private dialogService: NbDialogService, private interService: IntermediaireService,
    private authService: NbAuthService, private clientService: ClientService,
    private router: Router, private compagnieService: CompagnieService,
    private transfertData: TransfertDataService,
    private produitService: ProduitService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');

          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });
    //console.log(this.name);
    this.client = this.transfertData.getData();
    if (this.name == null) {
      if (this.client == null) {
        this.onGetAllPolices();
        this.aff = false;
      }
      else {
        this.onGetAllPolicesByClient(this.client);
      }
    }
    else {
      this.onGetAllPolicesByClient(this.name);
      this.aff = false;
    }
    // this.onGetAllPolices();
    this.onGetAllProduits();
    this.onGetAllCodecimacompagnie();
    this.onGetAllIntermediaires();
    this.onGetAllClients();

  }

  onGetAllPolicesByClient(id: Number) {
    this.policeService.getAllPoliceByClient(id)
      .subscribe((data: Police[]) => {
        this.listePolices = data;
        this.dataSource.data = data as Police[];
      });
  }

  onGetAllPolices() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.listePolices = data;
        this.dataSource.data = data as Police[];
      });
  }

  // onGetLibelleByClassification(code: number) {
  //   return code + " : " + (this.classifications.find(c => c.code == code))?.libelle;
  // }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onOpen(dialog: TemplateRef<any>, police: Police) {
    this.dialogService.open(
      dialog,
      {
        context: police,
      });
  }

  onOpenEng(dialog: TemplateRef<any>, police: Police) {
    this.dialogService.open(
      dialog,
      {
        context: police,
      });
  }

  onOpenAjout() {
    this.trclient = this.listeClients.find(p => p.clien_numero == this.client);
    this.transfertData.setData(this.trclient);
    this.router.navigateByUrl('home/parametrage-production/police/ajout');
  }

  onOpenModif(police: Police) {
    this.transfertData.setData(police);
    this.router.navigateByUrl('home/parametrage-production/police/modif');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  onGetAllProduits() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.produits = data;
      });
  }

  onGetLibelleByProduit(numero: number) {
    return (this.produits.find(c => c.prod_numero === numero))?.prod_denominationlong;
  }
  onGetClient(numero: number) {
    // tslint:disable-next-line:max-line-length
    if ((this.listeClients.find(c => c.clien_numero === numero))?.clien_prenom == null || (this.listeClients.find(c => c.clien_numero === numero))?.clien_prenom === '')
      return (this.listeClients.find(c => c.clien_numero === numero))?.clien_denomination;
    else
      return (this.listeClients.find(c => c.clien_numero === numero))?.clien_prenom + ' ' +
        (this.listeClients.find(c => c.clien_numero === numero))?.clien_nom;
  }

  onGetdenom(code: String) {
    //  this.onGetCompagnieByCode(code);
    return (this.codecimacomp.find(p => p.code_cima_compagnie === code))?.denomination;
  }
  onGetinter(code: Number) {
    //  this.onGetCompagnieByCode(code);
    return (this.listeNumeroIntermediaire.find(p => p.inter_numero === code))?.inter_denomination;
  }
  onGetAllCodecimacompagnie() {
    this.compagnieService.getAllCodecimacompagnies()
      .subscribe((data: Cimacodificationcompagnie[]) => {
        this.codecimacomp = data as Cimacodificationcompagnie[];
        // this.listecodecimacomp = data as Cimacodificationcompagnie[];
      });
  }
  onGetAllIntermediaires() {
    this.interService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.listeNumeroIntermediaire = data as Intermediaire[];
      });
  }
  onGetAllClients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.listeClients = data as Client[];
        // console.log(this.listeClients);
      });

  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        // this.demandeur = this.user.util_prenom + " "+ "lamine" + " " + this.user.util_nom;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
        // this.demandeur = this.demandeur.replace(/ /g, "_") ;
      });
  }

  onExport(format: String) {

    let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    const form = new FormData();
    form.append('title', titleNew);
    form.append('demandeur', demandeurNew);

    if (format === 'pdf') {
      // this.clientService.generateReportClient(format, titleNew, demandeurNew)
      this.policeService.generateReportPolice(format, form)
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
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'liste des polices.pdf');
          }
        });
    }

    if (format === 'excel') {
      // this.clientService.generateReportClient(format, this.title, this.demandeur)
      this.policeService.generateReportPolice(format, form)
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
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'liste des polices.xlsx');
          }
        });
    }
  }
}
