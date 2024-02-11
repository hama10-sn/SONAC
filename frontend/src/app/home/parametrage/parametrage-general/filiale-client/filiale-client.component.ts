import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { NbGlobalPosition, NbGlobalPhysicalPosition, NbComponentStatus, NbDialogService, NbToastrService } from '@nebular/theme';
import { Client } from '../../../../model/Client';
import { Filiale_Client } from '../../../../model/Filiale_Client';
import { Groupe } from '../../../../model/Groupe';
import { Pays } from '../../../../model/pays';
import { ClientService } from '../../../../services/client.service';
import { Filiale_ClientService } from '../../../../services/filiale_Client.service';
import { GroupeService } from '../../../../services/groupe.service';
import { PaysService } from '../../../../services/pays.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import countries from '../../../data/countries.json';

@Component({
  selector: 'ngx-filiale-client',
  templateUrl: './filiale-client.component.html',
  styleUrls: ['./filiale-client.component.scss']
})
export class FilialeClientComponent implements OnInit {

  filiale_Clients: Array<Filiale_Client> = new Array<Filiale_Client>();

  clients: Array<Client> = new Array<Client>();
  filiale_Client: Filiale_Client;
  autorisation = [];
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  payss: Array<Pays> = new Array<Pays>();
  listGroupes: Array<Groupe> = new Array<Groupe>();

  // tslint:disable-next-line:max-line-length
  public displayedColumns = ['filcli_numero', 'filcli_numercli', 'filcli_codepays', 'filcli_codedevise', 'fili_codegroupe','action']// 'details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Filiale_Client>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Input() listPays: any [] = countries;

  // status: NbComponentStatus = 'info';

  // tslint:disable-next-line:max-line-length
  constructor(private filiale_ClientService: Filiale_ClientService, private authService: NbAuthService, private router: Router,
    // tslint:disable-next-line:max-line-length
    private dialogService: NbDialogService, private clientService: ClientService, private paysService: PaysService,
    // tslint:disable-next-line:max-line-length
    private toastrService: NbToastrService, private transfertData: TransfertDataService, private groupeService: GroupeService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
    this.onGetAllFiliale_Clients();
  // this.onGetClientByCode(45);
  this.onGetALlClients();
  this.onGetAllpays();
  this.onGetAllGroupes();

  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllFiliale_Clients() {
    this.filiale_ClientService.getAllFiliale_Clients()
      .subscribe((data: Filiale_Client[]) => {
          this.filiale_Clients = data;
          this.dataSource.data = data as Filiale_Client[];
          console.log(this.filiale_Clients);
      });
  }


  onDeleteFiliale_Client(id: number) {
    this.filiale_ClientService.deleteFiliale_Client(id)
      .subscribe(() => {
        this.toastrService.show(
          'Filiale_Client supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

          this.onGetAllFiliale_Clients();
      });
  }


  open(dialog: TemplateRef<any>, filiale_Client: Filiale_Client) {
    this.dialogService.open(
      dialog,
      { context: filiale_Client });
  }
  openAjout() {

    this.router.navigateByUrl('home/filiale_Client/ajout');
  }

  openModif(filiale_Client: Filiale_Client, id) {

    this.transfertData.setData(filiale_Client);
    this.router.navigateByUrl('home/filiale_Client/update');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }


  public redirectToUpdate = (id: string) => {

  }
  public redirectToDelete = (id: string) => {

  }

    onGetdenom(code: number) {
    //  this.onGetClientByCode(code);
     return (this.clients.find(p => p.clien_numero === code))?.clien_denomination ;
    }
    onGetPays(code: number) {
      //  this.onGetClientByCode(code);
      return (this.listPays.find(p => p.callingCodes[0] === code.toString()))?.name;
       //return (this.payss.find(p => p.pays_code === code))?.pays_libellelong ;
      }


    onGetGroupe(code: number) {
      //  this.onGetClientByCode(code);
       return (this.listGroupes.find(p => p.group_code === code))?.group_liblong;
      }


  onGetALlClients() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
          this.clients = data;

          console.log(this.clients);
      });
  }

  onGetAllpays() {
    this.paysService.getAllPays()
      .subscribe((data: Pays[]) => {
          this.payss = data;
      });
  }

  onGetAllGroupes () {
    this.groupeService.getAllGroupes()
    .subscribe((data: Groupe[]) => {
       this.listGroupes = data;
    });
}

}
