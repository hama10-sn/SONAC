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
import { Sinistre } from '../../../model/Sinistre';
import { Surete } from '../../../model/Surete';
import { ClientService } from '../../../services/client.service';
import { CommonService } from '../../../services/common.service';
import { EngagementService } from '../../../services/engagement.service';
import { PoliceService } from '../../../services/police.service';
import { ProduitService } from '../../../services/produit.service';
import { sinistreService } from '../../../services/sinistre.service';
import { SureteService } from '../../../services/surete.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import type from '../../data/type.json';

@Component({
  selector: 'ngx-declaration-menace-sinistre',
  templateUrl: './declaration-menace-sinistre.component.html',
  styleUrls: ['./declaration-menace-sinistre.component.scss']
})
export class DeclarationMenaceSinistreComponent implements OnInit {

  sinistre: Array<Sinistre> = new Array<Sinistre>();
  polices: Array<Police> = new Array<Police>();
  clients: Array<Client> = new Array<Client>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['sini_num', 'sini_souscripteur', 'sini_police', 'sini_risque', 'sini_intermediaire', 'sini_produit', /*'sini_typesinistre', 'deposit', 'caution_solidaire',*/ 'action'];
  public dataSource = new MatTableDataSource<Sinistre>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];
  // aff: Boolean = true;

  constructor(private sinistreService: sinistreService,
    private authService: NbAuthService,
    private router: Router,
    private transfertData: TransfertDataService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {

    this.onGetAllSinistre();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');

        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllSinistre() {
    this.sinistreService.getAllSinistreMouvement()
      .subscribe((data: any) => {
        if (data.code === "ok") {
          this.sinistre = data.data;
          this.dataSource.data = data.data;
        } else {
          this.sinistre = data.data;
          this.dataSource.data = data.data;
        }

      });
  }

  open(dialog: TemplateRef<any>, sinistre: Sinistre) {

    this.dialogService.open(
      dialog,
      {
        context: sinistre
      });
  }

  openAjout() {
    this.router.navigateByUrl('home/gestion-sinistre/declaration-menace-sinistre/ajout');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  /*
  openLiberationTF(surete: Surete) {
    this.transfertData.setData(surete);
    this.router.navigateByUrl('/home/engagement/gestion-surete-deposit/liberation-tf');
  }
  */

}
