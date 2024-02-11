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
import { Surete } from '../../../model/Surete';
import { ClientService } from '../../../services/client.service';
import { CommonService } from '../../../services/common.service';
import { EngagementService } from '../../../services/engagement.service';
import { PoliceService } from '../../../services/police.service';
import { ProduitService } from '../../../services/produit.service';
import { SureteService } from '../../../services/surete.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import type from '../../data/type.json';

@Component({
  selector: 'ngx-gestion-surete-deposit',
  templateUrl: './gestion-surete-deposit.component.html',
  styleUrls: ['./gestion-surete-deposit.component.scss']
})
export class GestionSureteDepositComponent implements OnInit {

  // engagements: Array<Engagement> = new Array<Engagement>();
  sureteDeposit: Array<any> = new Array<any>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  @Input() id_police: Number;

  polices: Array<Police> = new Array<Police>();
  clients: Array<Client> = new Array<Client>();
  @Input() listTypeSouscripteur: any[] = type;
  @Input() typeSureteInput: any[] = type;
  @Input() cautionSolidaireInput: any[] = type;
  listTypeSurete: any;
  listCautionSolidaire;
  listTypes: any;
  client: Client;

  public displayedColumns = ['client', 'police', 'engagement', 'numero_surete', 'type_surete', /*'idTF', 'deposit', 'caution_solidaire',*/ 'action'];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];
  // aff: Boolean = true;

  constructor(private sureteService: SureteService,
    private authService: NbAuthService,
    private router: Router,
    private transfertData: TransfertDataService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    //console.log( this.onFormat(520000021,2));
    // this.listTypes = this.listTypeSouscripteur['TYPE_CLIENT'];
    this.onGetAllSureteEngagement();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          // console.log(this.autorisation);
        }
      });

    this.listTypeSurete = this.typeSureteInput['TYPE_SURETE'];
    this.listCautionSolidaire = this.cautionSolidaireInput['TYPE_CAUTION_SOLIDAIRE'];

    // if (this.id_police == null)
    //   this.onGetAllEngagement();
    // else {
    //   this.onGetAllEngagementByPolice(this.id_police);
    //   this.aff = false;
    // }
    // this.onGetAllClient();
    // this.onGetAllPolice();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllSureteEngagement() {
    this.sureteService.getAllSurete()
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.sureteDeposit = data.data;
          this.dataSource.data = data.data;
        } else {
          this.sureteDeposit = data.data;
          this.dataSource.data = data.data;
        }

      });
  }

  /*
  onGetAllEngagementByPolice(id: Number) {
    this.engagService.getAllEngagementsByPolice(id)
      .subscribe((data: Engagement[]) => {
        this.engagements = data;
        this.dataSource.data = data as Engagement[];
        console.log(this.engagements);
      });
  }

  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clients = data;
      });
  }

  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        this.polices = data;
        //  console.log(this.polices);
      });
  }

  onGetPoliceBySouscripeur(numero: number) {
    //console.log(this.polices);
    //console.log((this.polices.find(c => c.poli_numero === numero))?.poli_souscripteur);
    return (this.polices.find(c => c.poli_numero === numero))?.poli_client;
  }
  */

  // onGetLibelleByClient(numero: Number) {
  //   // console.log(this.clients);
  //   //console.log(numero + " : " + (this.clients?.find(b => b.clien_numero === numero))?.clien_nature);
  //   if (((this.clients?.find(b => b.clien_numero === numero))?.clien_nature) == "1") {
  //     return (this.clients?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom;
  //   } else
  //     return (this.clients?.find(b => b.clien_numero === numero))?.clien_denomination;
  // }

  // onGetLibelleByTypeSouscripteur(type: Number) {
  //   //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

  //   return (this.listTypes.find(p => p.id === type))?.value;
  // }

  // onGetLibelle(mun: any) {
  //   this.clientService.getClientByPolice(mun)
  //     .subscribe((data: any) => {
  //       this.client = data;

  //       //this.clients = data ;
  //       if (this.client.clien_nature = "1") {
  //         return this.client?.clien_prenom + " " + this.client?.clien_nom;
  //       } else {
  //         return this.client?.clien_denomination;
  //       }
  //     });
  // }

  open(dialog: TemplateRef<any>, surete: any) {

    // console.log(surete.surete_localisation);
    // console.log(surete.surete_numero)
    this.dialogService.open(
      dialog,
      {
        context: surete

      });
  }

  openAjout() {
    this.router.navigateByUrl('home/engagement/gestion-surete-deposit/add-surete');
  }

  openAjout2() {
    this.router.navigateByUrl('home/engagement/gestion-surete-deposit/add-surete2');
  }

  openLiberationTF(surete: Surete) {
    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/liberation-tf');
  }

  openRealisationTF(surete: Surete) {
    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/realisation-tf');
  }

  openLiberationDeposit(surete: Surete) {
    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/liberation-deposit');
  }

  openRealisationDeposit(surete: Surete) {
    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/realisation-deposit');
  }

  openLiberationCautionSolidaire(surete: Surete) {
    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/liberation-caution-solidaire');
  }

  openRealisationCautionSolidaire(surete: Surete) {
    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/realisation-caution-solidaire');
  }

  openLiberationAutresSuretes(surete: Surete) {
    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/liberation-autres-suretes');
  }



  onGetLibelleByTypeSurete(id: any) {
    if (id === '') {
      return '';
    } else {
      // return id + " : " + (this.listTypeSurete.find(p => p.id === id))?.value;
      return (this.listTypeSurete.find(p => p.id === id))?.value;
    }
  }

  onGetLibelleByCautionSolidaire(id: any) {
    if (id === '') {
      return ''
    } else {
      // return id + " : " + (this.listCautionSolidaire.find(p => p.id === id))?.value;
      return (this.listCautionSolidaire.find(p => p.id === id))?.value;
    }
  }

  onGetLibelleByStatutLiberation(id: any) {

    if (id == 0) {
      return id + " : " + "aucune libération";
    } else if (id == 1) {
      return id + " : " + "libération partielle";
    } else if (id == 2) {
      return id + " : " + "libération totale";
    } else {
      return '';
    }
  }

  openModif(surete: Surete) {

    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/update-surete');
  }

  openDel(dialogDel: TemplateRef<any>, surete: Surete) {

    this.dialogService.open(
      dialogDel,
      { context: surete });
  }

  redirectToDelete(numero: Number) {

    this.sureteService.deleteSurete(numero)
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.toastrService.show(
            data.message,
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });

          this.onGetAllSureteEngagement();

        } else {
          this.toastrService.show(
            data.message,
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        }
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
