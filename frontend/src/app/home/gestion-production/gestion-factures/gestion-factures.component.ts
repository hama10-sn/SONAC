import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Client } from '../../../model/Client';
import { Facture } from '../../../model/Facture';
import { ClientService } from '../../../services/client.service';
import { FactureService } from '../../../services/facture.service';
import { TransfertDataService } from '../../../services/transfertData.service';

@Component({
  selector: 'ngx-gestion-factures',
  templateUrl: './gestion-factures.component.html',
  styleUrls: ['./gestion-factures.component.scss']
})
export class GestionFacturesComponent implements OnInit {
  factures : Array<Facture> = new Array<Facture>();
  clientss: Array<Client> = new Array<Client>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  facture:any;

  public displayedColumns = ['fact_numacte', 'fact_numeropolice', 'fact_numeroacte',
   'fact_numerosouscripteurcontrat','fact_datefacture','fact_dateeffetcontrat','fact_dateecheancecontrat','fact_montantttc','fact_etatfacture','action'];
   public dataSource = new MatTableDataSource<Facture>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];
  
  constructor(private factService: FactureService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
     private authService: NbAuthService, private router: Router, private clientService:ClientService) { }

  ngOnInit(): void {

    this.onGetAllClients();
    
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        //console.log(this.autorisation);
      }
    });
    this.onGetAllaFacture();
  }
  onGetAllaFacture(){
    this.factService.getAllFactures()
      .subscribe((data: Facture[]) => {
          this.factures = data;
          this.dataSource.data = data as Facture[];
          //console.log(this.factures);
      });  
  }
  
  /*
    cette methode nous permet de faire des paginations
    */
    ngAfterViewInit(): void {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    /*
      cette methode nous permet de faire des filtre au niveau 
      de la recherche dans la liste
      */
    public doFilter = (value: string) => {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    /*
      *cette methode nous permet d'ouvrir une boite dialogue
      */
    open(dialog: TemplateRef<any>, facture:Facture ) {

      //this.facture = facture;
     
      this.dialogService.open(
        dialog,
        { context: facture 
            
        });
    }

    
  /*
    *cette methode nous permet d'ouvrir une 
    * inserer une Facture 
    */
  factureAnnuer() {
    
    this.router.navigateByUrl('home/facture-annuler');
  }
  factureProd() {
    
    this.router.navigateByUrl('home/facture-production');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un contact     
    */
  openModif(fact: Facture) {
    this.transfertData.setData(fact);
    this.router.navigateByUrl('home/gestion-fature/modif-facture');
  }

  onGetAllClients(){
    this.clientService.getAllClients()
    .subscribe((data: Client[]) => {
      this.clientss = data as Client[];      
      
    });
  }


  onGetClientLibelle(numcli){
    
    return  (this.clientss.find(c => c.clien_numero === numcli))?.clien_denomination ;  
  }
  onGetClientLibelle2(numcli){
    if((this.clientss.find(c => c.clien_numero === numcli))?.clien_prenom == null)
    {
      return " ";
    }
    
    return  (this.clientss.find(c => c.clien_numero === numcli))?.clien_prenom+" "+(this.clientss.find(c => c.clien_numero === numcli))?.clien_nom ;  
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
}
