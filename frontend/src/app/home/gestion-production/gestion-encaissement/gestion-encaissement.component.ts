import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Client } from '../../../model/Client';
import { Encaissement } from '../../../model/Encaissement';
import { User } from '../../../model/User';
import { ClientService } from '../../../services/client.service';
import { EncaissementService } from '../../../services/encaissement.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';
import { saveAs } from 'file-saver';
import { QuittanceService } from '../../../services/quittance.service';
import { Quittance } from '../../../model/Quittance';

@Component({
  selector: 'ngx-gestion-encaissement',
  templateUrl: './gestion-encaissement.component.html',
  styleUrls: ['./gestion-encaissement.component.scss']
})
export class GestionEncaissementComponent implements OnInit {
  encaissements: Array<Encaissement> = new Array<Encaissement>();
  clientss: Array<Client> = new Array<Client>();
  listeQuittances: Array<Quittance> = new Array<Quittance>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  autorisation = [];
  user: User;
  demandeur: string;
  login_demandeur: string;

  public displayedColumns = ['encai_numeroencaissement', 'encai_numerofacture', 'encai_numerosouscripteur', 'encai_datepaiement','encai_mtnpaye','encai_mtnquittance','encai_solde', 'action'];
  public dataSource = new MatTableDataSource<Encaissement>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private encaissementService: EncaissementService, private dialogService: NbDialogService,
    private toastrService: NbToastrService,private authService: NbAuthService,
    private router: Router,
    private userService: UserService,
    private transfertData: TransfertDataService, 
    private clientService:ClientService,
    private quittanceService: QuittanceService) { }

  ngOnInit(): void {
    this.onGetAllEncaissements();
    this.onGetAllClients();
    this.onGetAllQuittances();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
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

  onGetAllEncaissements () {
    this.encaissementService.getAllEncaissement()
    .subscribe((data: Encaissement[]) => {
      this.dataSource.data = data as Encaissement[];
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  
  
  onGetAllClients(){
    this.clientService.getAllClients()
    .subscribe((data: Client[]) => {
      this.clientss = data as Client[];        
    });
  }

  onGetAllQuittances(){
    this.quittanceService.getAllQuittance()
    .subscribe((data: Quittance[]) => {
      this.listeQuittances = data as Quittance[];        
    });
  }
  
  onGetClientLibelle(numcli){
    return  (this.clientss.find(c => c.clien_numero === numcli))?.clien_denomination || '';  
  }

  onGetClientLibelle2(numcli){
    const prenom:String  = (this.clientss.find(c => c.clien_numero === numcli))?.clien_prenom || '';
    const nom:String = (this.clientss.find(c => c.clien_numero === numcli))?.clien_nom || '';
    return   prenom+" "+nom; 
  }
  
  openAjout(){
    this.router.navigateByUrl('home/ajout-encaissement');
  }
  encaissementAnnuler() {    
    this.router.navigateByUrl('home/encaissement-annuler');
  }
  open(dialog: TemplateRef<any>, encaissement:Encaissement ) {
       
    this.dialogService.open(
      dialog,
      { context: encaissement 
          
      });
  }
  
  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }
  
  onDownloadRecuFactureSimple(encaissement: Encaissement) {
    let demandeurNew = this.demandeur.replace(/ /g, "_");
    const form = new FormData();
    form.append("demandeur", demandeurNew);

    this.encaissementService.downloadRecuFactureSimple(encaissement.encai_numeroencaissement, form)
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
            saveAs(event.body, 'reçu facture simple.pdf');
        }
      });
  }
  
  onDownloadRecuFactureMultiple(encaissement: Encaissement) {
    let demandeurNew = this.demandeur.replace(/ /g, "_");
    const form = new FormData();
    form.append("demandeur", demandeurNew);

    this.encaissementService.downloadRecuFactureMultiple(encaissement.encai_numeroencaissement, form)
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
            saveAs(event.body, 'reçu facture global.pdf');
        }
      });
  }

  getMontantPrimeEncaisser(numFactEncaissement: any){

    return Number((this.listeQuittances.find(q => q.quit_Facture === numFactEncaissement))?.quit_mntprimencaisse);
    
/*     this.quittanceService.findQuittanceByNumFactEncaissement(numFactEncaissement)
      .subscribe((data: any) => {

        // console.log(data.data)
          if(data.code === "ok"){
            // console.log(Number(data.data.quit_mntprimencaisse))
            let quittance = data.data as Quittance; 
            // console.log(quittance);
            return quittance.quit_mntprimencaisse ;
          } else{
            return '';
          }
      });    */  
  }
}
