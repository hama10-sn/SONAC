import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Client } from '../../../../model/Client';
import { Contact } from '../../../../model/Contact';
import { ClientService } from '../../../../services/client.service';
import { ContactService } from '../../../../services/contact.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { ModifContactComponent } from './modif-contact/modif-contact.component';

@Component({
  selector: 'ngx-gestion-contact',
  templateUrl: './gestion-contact.component.html',
  styleUrls: ['./gestion-contact.component.scss']
})
export class GestionContactComponent implements OnInit {

  contacts: Array<Contact> = new Array<Contact>();
  listcontacts : any [];
  clients: Array<Client> = new Array<Client>();
  contact: Contact;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  public displayedColumns = ['cont_numero', 'cont_numeroclient', 'cont_nom', 'cont_prenom',
   'cont_leader','cont_client','cont_telephonique1','cont_email','details'/* , 'update', 'delete' */];
   public dataSource = new MatTableDataSource<Contact>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];
  
   constructor(private contactService: ContactService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
     private authService: NbAuthService, private router: Router,private clientService: ClientService) { }

  ngOnInit(): void {

    

    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }
    });
    this.onGetAllContact();
    this.onGetAllClient();
  }

  onGetAllContact(){
    this.contactService.getAllContactes()
      .subscribe((data: Contact[]) => {
          this.contacts = data;
          this.dataSource.data = data as Contact[];
          console.log(this.contacts);
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
    open(dialog: TemplateRef<any>, contact:Contact ) {
     
      this.dialogService.open(
        dialog,
        { context: contact 
            
        });
    }

    
  /*
    *cette methode nous permet d'ouvrir une 
    * inserer un contact 
    */
  openAjout() {
    
    this.router.navigateByUrl('home/gestion-contact/ajout');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un contact     
    */
  openModif(contact: Contact) {
    this.transfertData.setData(contact);
    this.router.navigateByUrl('home/gestion-contact/modif');
  }
  onDeleteContact(id: number) {
    this.contactService.deleteContact(id)
      .subscribe(() => {
        this.toastrService.show(
          'Contact supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });          
          this.onGetAllContact();
      });
  }
  onDeleteContactClient(id: number,cl: number,leader: boolean) { 

    this.contactService.deleteContactClient(id,cl,leader)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Contact Supprimer avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllContact();
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );
      }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }

  onGetAllClient(){
    this.clientService.getAllClients()
    .subscribe((data: Client[]) => {
        this.clients = data;
    });
  }
  onGetLibelleByClient(numero: Number) {
    // console.log(this.clients);
     //console.log(numero + " : " + (this.clients?.find(b => b.clien_numero === numero))?.clien_nature);
     if(((this.clients?.find(b => b.clien_numero === numero))?.clien_nature) == "1"){
       return (this.clients?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom;  
     }else
       return (this.clients?.find(b => b.clien_numero === numero))?.clien_denomination;  
     }
  onChechId(id:number, cl:number,leader: boolean){
    console.log(cl);
    console.log((this.contacts.filter(c => c.cont_numeroclient == cl &&  c.cont_leader == true )).length );
    //this.listcontacts = this.contacts.find(c => c.cont_numeroclient ==cl &&  c.cont_leader == true);
    console.log((this.contacts.filter(c => c.cont_numeroclient == cl &&  c.cont_leader == true )).length <= 1);
    
    if((id==null) && (cl==null)){

      return 3;
    }
    if(leader==false){

    
    if((this.contacts.find(c => c.cont_numeroclient == cl &&  c.cont_leader == false ))){

      console.log((this.contacts.find(c => c.cont_numeroclient == cl &&  c.cont_leader == false )));
      return 1;
    }
  }else{
    if((this.contacts.filter(c => c.cont_numeroclient == cl &&  c.cont_leader == true )).length <= 1){
      console.log("a ne pas supprimer");
        return 2;
    }else {
      return 1;
    }
  }
      
    
      
  }
}
