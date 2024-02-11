import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Acheteur } from '../../../model/Acheteur';
import { Client } from '../../../model/Client';
import { User } from '../../../model/User';
import { AcheteurService } from '../../../services/acheteur.service';
import { ClientService } from '../../../services/client.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';
import { saveAs } from 'file-saver';
import { sinistreService } from '../../../services/sinistre.service';
import { Sinistre } from '../../../model/Sinistre';

@Component({
  selector: 'ngx-gestion-acheteurs',
  templateUrl: './gestion-acheteurs.component.html',
  styleUrls: ['./gestion-acheteurs.component.scss']
})
export class GestionAcheteursComponent implements OnInit {

  acheteurs: Array<Acheteur> = new Array<Acheteur>();
  clients: Array<Client> = new Array<Client>();
  acheteur: Acheteur;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  
  
  
  title = 'La liste des Acheteur (par ordre)';
  login_demandeur: string;
  demandeur: string;
  user: User;


  public displayedColumns = ['achet_numero', 'achet_numeroclient', 'achet_numeroaffaire', 
   'achet_type'/*,'reass_telephone1',
   'reass_telephone2','reass_email','reass_datetraite1','reass_nbretraite','reass_ca',
   'reass_commissionrecu',   'reass_horsgroupe','reass_codenationalite','reass_codeutilisateur',
   'reass_datemodification'*/, 'details'/*, 'update', 'delete'*/];
  public dataSource = new MatTableDataSource<Acheteur>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation=[];
  sinistres: Array<Sinistre> = new Array<Sinistre>();

 
  constructor(private acheteurService: AcheteurService, private dialogService: NbDialogService,
    private transfertData: TransfertDataService,private authService: NbAuthService,
    private router: Router,private toastrService: NbToastrService, private clientService : ClientService,
    private activatedroute: ActivatedRoute,private userService: UserService, 
    private sinistreService: sinistreService) { }

  ngOnInit(): void {
    
    this.onGetAllAcheteur();
    this.onGetAllClient();
    //this.listTypes=this. listTypeReassureur['TYPE_REASSUREUR'];
this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
        this.login_demandeur = token.getPayload().sub;
        this.onGetUser(this.login_demandeur);
      }
    });
  }

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        console.log(this.user);
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }
  onGetAllClient(){
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
          this.clients = data;
      });
  }
  onGetLibelleByClient(numero: Number) {
    if(((this.clients?.find(b => b.clien_numero === numero))?.clien_nature) == "1"){
       return (this.clients?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom;  
     }else
       return (this.clients?.find(b => b.clien_numero === numero))?.clien_denomination;  
     }
  onExport(format: String) {
    console.log(this.demandeur);
    let titleNew = this.title.replace(/ /g, "_");
    let demandeurNew = this.demandeur.replace(/ /g, "_");

    const form = new FormData();
    form.append('title', titleNew);
    form.append('demandeur', demandeurNew);

    if (format === 'pdf') {
       this.acheteurService.generateReportAcheteur(format, form)
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
              saveAs(event.body, 'liste des acheteur.pdf');
          }
        });
    }

    if (format === 'excel') {
      this.acheteurService.generateReportAcheteur(format, form)
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
              saveAs(event.body, 'liste des acheteur.xlsx');
          }
        });
    } 
  }

  /* onChechId(id:number){

    if(id==null){

      return 3;
    }
      if( this.produits.find(p => p.prod_numerocategorie === id)){
      return 2;
      }else {
        return 1;
      }     
  } */
  onDeleteAcheteur(id: number) {
     this.acheteurService.deleteAcheteur(id)
      .subscribe(() => {
        this.toastrService.show(
          'Acheteur supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllAcheteur();
      });       
  }
 

  onGetNationaliteByCode(code:number){    
    
  }
  OnGetListe(code:String){    
    
  //  return (this.listPays.find(p => p.callingCodes[0] === code))?.demonym;
  }
  /*
  cette methode nous permet de d'avoir la liste les Reassureur
  */
  onGetAllAcheteur(){
    this.acheteurService.getAllAcheteurs()
      .subscribe((data: Acheteur[]) => {
          this.acheteurs = data;
          this.dataSource.data = data as Acheteur[];
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
  open(dialog: TemplateRef<any>, acheteur:Acheteur ) {
   
    this.dialogService.open(
      dialog,
      { context: acheteur 
          
      });
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour inserer un reassureur reassureur et de lever une exeption s'il a erreur
    */
  openAjout() {
    
    //this.router.navigateByUrl('home/parametrage/parametrage-general/gestion-reassureur/reassureur');
    
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un reassureur     
    */
  openModif(acheteur: Acheteur) {
    this.transfertData.setData(acheteur);
    //this.router.navigateByUrl('home/gestion-acheteurs/modif-acheteurs');   
    this.router.navigateByUrl('home/gestion-acheteurs/update-acheteurs');   
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
  onGetAllSinistres(){
    this.sinistreService.getAllSinistres()
    .subscribe((data: Sinistre[]) => {
      this.sinistres = data as Sinistre[];      
      //this.filteredClients.next(this.clientss.slice());
    });
  }
  
onChechId(id:number){

  if(id==null){

    return 3;
  }
    if( this.acheteurs.find(p => p.achet_numero === id).achet_montantcredit != null){
    return 2;
    }else if( this.sinistres.find(p => p.sini_acheteur === id))
    {
      return 4;
    }
    else {
      return 1;
    }     
}
}
