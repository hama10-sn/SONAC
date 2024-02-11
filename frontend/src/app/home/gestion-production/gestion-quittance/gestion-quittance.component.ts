import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Quittance } from '../../../model/Quittance';
import { QuittanceService } from '../../../services/quittance.service';
import { TransfertDataService } from '../../../services/transfertData.service';

@Component({
  selector: 'ngx-gestion-quittance',
  templateUrl: './gestion-quittance.component.html',
  styleUrls: ['./gestion-quittance.component.scss']
})
export class GestionQuittanceComponent implements OnInit {
  quittances: Array<Quittance> = new Array<Quittance>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  autorisation = [];

  public displayedColumns = ['quit_numero', 'quit_Facture', 'quit_numeropolice', 'quit_typeecriture','quit_primettc', 'details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Quittance>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private quittanceService: QuittanceService, private dialogService: NbDialogService,
    private toastrService: NbToastrService,private authService: NbAuthService,
    private router: Router,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.onGetAllQuittance();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
  }

  onGetAllQuittance () {
    this.quittanceService.getAllQuittance()
    .subscribe((data: Quittance[]) => {
      // this.groupes = data;
      this.dataSource.data = data as Quittance[];
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
