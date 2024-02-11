import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Client } from '../../../model/Client';
import { Engagement } from '../../../model/Engagement';
import { MainLeve } from '../../../model/MainLeve';
import { Police } from '../../../model/Police';
import { Produit } from '../../../model/Produit';
import { ClientService } from '../../../services/client.service';
import { EngagementService } from '../../../services/engagement.service';
import { MainLeveService } from '../../../services/main-leve.service';
import { PoliceService } from '../../../services/police.service';
import { ProduitService } from '../../../services/produit.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import type from '../../data/type.json';


@Component({
  selector: 'ngx-gestion-mainleve',
  templateUrl: './gestion-mainleve.component.html',
  styleUrls: ['./gestion-mainleve.component.scss']
})
export class GestionMainleveComponent implements OnInit {
  engagements : Array<Engagement> = new Array<Engagement>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  @Input() id_police: Number;
  
 polices: Array<Police> = new Array<Police>();
 clients: Array<Client> = new Array<Client>();
 @Input() listTypeSouscripteur:any [] =type;
 listTypes:any;

  public displayedColumns = ['engag_numpoli', 'engag_numeroacte', 'engag_numeroengagement', 'engag_numeroavenant',
   'engag_codemarche','engag_kapassure','details'/*, 'mainLeve' , 'update', 'delete' */];
   public dataSource = new MatTableDataSource<Engagement>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];
   aff: Boolean = true;
  
  constructor(private engagService: EngagementService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
    private produitService: ProduitService,private authService: NbAuthService, private router: Router,
    private clientService: ClientService,private policeService: PoliceService) { }

  ngOnInit(): void {
    
    this.listTypes=this. listTypeSouscripteur['TYPE_CLIENT'];
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
    });
    if(this.id_police == null)
    this.onGetAllEngagement();
    else {
    this.onGetAllEngagementByPolice(this.id_police);
    this.aff = false;
   }
   this.onGetAllClient();
   this.onGetAllPolice();
    
  }
  openCheck(engage: Engagement) {
    this.transfertData.setData(engage);    
    this.router.navigateByUrl('home/gestion-mainleve/add-mainleve');
    
  }
  onGetAllEngagement(){
    this.engagService.getAllEngagements()
      .subscribe((data: Engagement[]) => {
          this.engagements = data;
          this.dataSource.data = data as Engagement[];
          console.log(this.engagements);
      });  
  }
  
  onGetAllEngagementByPolice(id: Number){
    this.engagService.getAllEngagementsByPolice(id)
      .subscribe((data: Engagement[]) => {
          this.engagements = data;
          this.dataSource.data = data as Engagement[];
          console.log(this.engagements);
      });  
  }
  onGetAllClient(){
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
          this.clients = data;
      });
  }
  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        this.polices = data ;
      //  console.log(this.polices);
      });
  }
  onGetPoliceBySouscripeur(numero:number){
    //console.log(this.polices);
    //console.log((this.polices.find(c => c.poli_numero === numero))?.poli_souscripteur);
    return  (this.polices.find(c => c.poli_numero === numero))?.poli_client ;
  }
  onGetLibelleByClient(numero: Number) {
   // console.log(this.clients);
    //console.log(numero + " : " + (this.clients?.find(b => b.clien_numero === numero))?.clien_nature);
    if(((this.clients?.find(b => b.clien_numero === numero))?.clien_nature) == "1"){
      return (this.clients?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom;  
    }else
      return (this.clients?.find(b => b.clien_numero === numero))?.clien_denomination;  
    }
    onGetLibelleByTypeSouscripteur(type:Number){​​​​​​​​
      //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
         
       return  (this.listTypes.find(p=>p.id === type))?.value;       
         }​​​​​​​​
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
    open(dialog: TemplateRef<any>, engagement:any ) {
     
      this.produitService.getProduitByPolice(engagement.engag_numpoli)
      .subscribe((data: any) => {
        engagement.p=data;
      });

      this.clientService.getClientByPolice(engagement.engag_numpoli)
      .subscribe((data: any) => {
        engagement.cl=data;
      });
      this.dialogService.open(
        dialog,
        { context: engagement 
            
        });
    }

    openListeMainLeve(engagement: any) {
      this.transfertData.setData(engagement.engag_numeroengagement);
      this.router.navigateByUrl('/home/gestion-mainleve/list-mainleve');
  
    }
    
  /*
    *cette methode nous permet d'ouvrir une 
    * inserer un contact 
    */
  openAjout() {
    
    this.router.navigateByUrl('home/gestion-engagement/add-engagement');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un contact     
    */
  openModif(engag: Engagement) {
    this.transfertData.setData(engag);
    this.router.navigateByUrl('home/gestion-engagement/modif-engagement');
  }
  onDeleteContact(id: number) {
    this.engagService.deleteEngagement(id)
      .subscribe(() => {
        this.toastrService.show(
          'Engagement annulée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });          
          this.onGetAllEngagement();
      });
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
}
