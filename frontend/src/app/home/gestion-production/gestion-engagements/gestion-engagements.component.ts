import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Client } from '../../../model/Client';
import { Engagement } from '../../../model/Engagement';
import { Police } from '../../../model/Police';
import { ClientService } from '../../../services/client.service';
import { CommonService } from '../../../services/common.service';
import { EngagementService } from '../../../services/engagement.service';
import { PoliceService } from '../../../services/police.service';
import { ProduitService } from '../../../services/produit.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import type from '../../data/type.json';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-gestion-engagements',
  templateUrl: './gestion-engagements.component.html',
  styleUrls: ['./gestion-engagements.component.scss']
})
export class GestionEngagementsComponent implements OnInit {
engagements : Array<Engagement> = new Array<Engagement>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  @Input() id_police: Number;

  title = 'La liste des Engagement (par ordre)';
  login_demandeur: string;
  demandeur: string;
  
 polices: Array<Police> = new Array<Police>();
 clients: Array<Client> = new Array<Client>();
 @Input() listTypeSouscripteur:any [] =type;
 listTypes:any;
 listTypesR:any;
 client: Client;
 engagement: Engagement;
  public displayedColumns = ['engag_numpoli', 'engag_numeroacte', 'engag_numeroengagement', 'engag_numeroavenant',
   'engag_codemarche','engag_kapassure','details'/* , 'update', 'delete' */];
   public dataSource = new MatTableDataSource<Engagement>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];
   aff: Boolean = true;
  
  constructor(private engagService: EngagementService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
    private authService: NbAuthService, private router: Router,
    private clientService: ClientService,private policeService: PoliceService,
    private produitService: ProduitService,private commonService: CommonService) { }

    


  ngOnInit(): void {
    //console.log( this.onFormat(520000021,2));
    this.listTypes=this. listTypeSouscripteur['TYPE_CLIENT'];
    this.listTypesR=this. listTypeSouscripteur['TYPE_SURETE'];
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
         }
         onGetLibelleByType(type:Number){​​​​​​​​
          //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
             
           return  (this.listTypesR.find(p=>p.id === type))?.value;       
             }​​​​​​​​
  /*
    cette methode nous permet de faire des paginations
    */
    ngAfterViewInit(): void {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    onGetLibelle(mun:any){
      this.clientService.getClientByPolice(mun)
      .subscribe((data: any) => {
        this.client=data;

        //this.clients = data ;
        if(this.client.clien_nature="1"){
          return this.client?.clien_prenom +" "+ this.client?.clien_nom;
        }else{
          return this.client?.clien_denomination;
        }
      });
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
      /* this.clientService.getClientByPolice(engagement.engag_numpoli)
      .subscribe((data: any) => {
        // this.police = data ;
        engagement.p=data;
        console.log(data);
      }); */
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

    onFormat(chaine,debut){
      return this.commonService.format(chaine,debut);
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
  
  onExport(format: String) {
    console.log(this.demandeur);
    let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    const form = new FormData();
    form.append('title', titleNew);
    form.append('demandeur', demandeurNew);

    if (format === 'pdf') {
      // this.clientService.generateReportClient(format, titleNew, demandeurNew)
      this.engagService.generateReportEngagement(format, form)
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
              saveAs(event.body, 'liste des Engagements.pdf');
          }
        });
    }

    if (format === 'excel') {
      // this.clientService.generateReportClient(format, this.title, this.demandeur)
      this.engagService.generateReportEngagement(format, form)
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
              saveAs(event.body, 'liste des Engagements.xlsx');
          }
        });
    }
  }
}
