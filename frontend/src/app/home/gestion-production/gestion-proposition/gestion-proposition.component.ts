import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Client } from '../../../model/Client';
import { PoliceForm } from '../../../model/PoliceForm';
import { Produit } from '../../../model/Produit';
import { Propos } from '../../../model/Propos';
import { ClientService } from '../../../services/client.service';
import { PoliceService } from '../../../services/police.service';
import { ProduitService } from '../../../services/produit.service';
import { ProposService } from '../../../services/propos.service';
import { TransfertDataService } from '../../../services/transfertData.service';

@Component({
  selector: 'ngx-gestion-proposition',
  templateUrl: './gestion-proposition.component.html',
  styleUrls: ['./gestion-proposition.component.scss']
})
export class GestionPropositionComponent implements OnInit {

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['propo_numero', 'propo_client',/*  'propo_numerobranche', 'propo_numerocategorie', */
   'propo_dureecontrat','propo_dateefe','propo_dateessean','propo_brute','details'/* , 'update', 'delete' */];
   public dataSource = new MatTableDataSource<PoliceForm>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];

   propositions: Array<PoliceForm> = new Array<PoliceForm>();

   produits: Array<Produit> = new Array<Produit>();
   clients: Array<Client> = new Array<Client>();
  constructor(private policeService: PoliceService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
     private authService: NbAuthService, private router: Router, 
     private propoService: PoliceService,
     private produitService: ProduitService,
     private clientService: ClientService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
    });
    this.onGetAllProposition();
    this.onGetAllProduit();
    this.onGetAllClient();
  }
  
  onGetAllProposition(){
    this.propoService.getAllProposition()
      .subscribe((data: PoliceForm[]) => {
          this.propositions = data;
          this.dataSource.data = data as PoliceForm[];
      });  
  }
 
  onGetProduitByCode(numero:number){
    //console.log(this.polices);
    //console.log((this.polices.find(c => c.poli_numero === numero))?.poli_souscripteur);
    return  (this.produits.find(c => c.prod_numero === numero))?.prod_denominationcourt ;
  }/* 
  onGetClientByCode(numero:number){
    //console.log(this.polices);
    //console.log((this.polices.find(c => c.poli_numero === numero))?.poli_souscripteur);
    return  (this.clients.find(c => c.clien_numero === numero))?.clien_prenom ": + :"(this.clients.find(c => c.clien_numero === numero))?.clien_nom;
  } */
  onGetLibelleByClient(numero: Number) {
    // console.log(this.clients);
     //console.log(numero + " : " + (this.clients?.find(b => b.clien_numero === numero))?.clien_nature);
     if(((this.clients?.find(b => b.clien_numero === numero))?.clien_nature) == "1"){
       return (this.clients?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom;  
     }else
       return (this.clients?.find(b => b.clien_numero === numero))?.clien_denomination;  
     }
  onGetAllProduit() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.produits = data as Produit[];
        this.produits = data ;
      //  console.log(this.polices);
      });
  }
  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clients = data as Client[];
        this.clients = data ;
      //  console.log(this.polices);
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
    open(dialog: TemplateRef<any>, propos: Propos ) {
     
      this.dialogService.open(
        dialog,
        { context: propos 
            
        });
    }

    
  /*
    *cette methode nous permet d'ouvrir une 
    * inserer un contact 
    */
  openAjout() {
    this.transfertData.setData(2);
    this.router.navigateByUrl('/home/search/proposition');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un contact     
    */
  openModif(propos: number) {
    this.policeService.ajoutPolicePropo(propos)
  .subscribe((data:any)=>{
    
      this.toastrService.show(
        "Police N° " +data.message+" créé",
        'creation de police réussi',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });

        this.transfertData.setData(data.message);
        this.router.navigateByUrl('home/parametrage-production/police/view-police');
    
  });
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
  onChechId(id:number){

    if(id==null){

      return 3;
    }
      if( this.produits.find(p => p.prod_numerocategorie === id)){
      return 2;
      }else {
        return 1;
      }     
  }
  onDeleteproposClient(id: number) {
    this.propoService. delProposition(id)    
    .subscribe(() => {
      this.toastrService.show(
        'Proposition supprimée avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        console.log("liste");
        this.onGetAllProposition();
    },
    (error) => {
      this.toastrService.show(
        'suppréssion impossible ',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 7000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        
    },
    );
  }
  
}
