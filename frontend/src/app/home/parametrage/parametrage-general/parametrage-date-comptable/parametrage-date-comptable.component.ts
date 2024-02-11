import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Pays } from '../../../../model/pays';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { DateComptable } from '../../../../model/DateComptable';
import { DateComptableService } from '../../../../services/date-comptable.service';

@Component({
  selector: 'ngx-parametrage-date-comptable',
  templateUrl: './parametrage-date-comptable.component.html',
  styleUrls: ['./parametrage-date-comptable.component.scss']
})
export class ParametrageDateComptableComponent implements OnInit {
  comptable: DateComptable;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['datecompt_codtable', 'datecompt_typtable', 'datecompt_typcentral', 'datecompt_datejourn', 'datecompt_datemens', 'datecompt_dateexercice', 'datecompt_cloture', 'action'];
  public dataSource = new MatTableDataSource<DateComptable>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];
  
  constructor(private dateComptableService: DateComptableService,
    private dialogService: NbDialogService,
    private authService: NbAuthService,
    private router: Router,
    private transfertData: TransfertDataService,private toastrService: NbToastrService,) {
  }

  ngOnInit(): void {
    this.onGetAllDateComptables();

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });
  }

  
  onGetAllDateComptables() {
    this.dateComptableService.getAllDateComptable()
      .subscribe((data: any) => {
        this.dataSource.data = data.data;
      });
  }
  public redirectToDelete = (id: number) => {
    
    this.dateComptableService.updateDelete(id)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Date comptable supprimé avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllDateComptables();
    },
    (error) => {
      console.log(error);
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );

  }
  onGetTypeTableByCode(code: any) {
    if (code == 1) {
      return 'Production';
    } else if (code == 2) {
      return 'Sinistre';
    } else if (code == 3) {
      return 'Réassurance';
    } else {
      return '';
    }
  }

  onGetCodeJournal(code: any) {
    if (code == "12") {
      return 'Production';
    } else if (code == "14") {
      return 'Sinistre';
    } else if (code == "17") {
      return 'Réassurance';
    } else {
      return '';
    }
  }
  onGetTypeCentralisationByCode(code: any) {
    if (code == 'J') {
      return 'Journalière'
    } else if (code == "M") {
      return 'Mensuel';
    } else if (code == "T") {
      return 'Trimestriel';
    } else if (code == "A") {
      return 'Annuel';
    } else {
      return '';
    }
  }
 
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
 
  open(dialog: TemplateRef<any>, comptable: DateComptable) {
    this.dialogService.open(
      dialog,
      {
        context: comptable

      });
  }

  openAjout() {
    this.router.navigateByUrl('home/parametrage-comptable/parametrage-date-comptable/add-date-comptable');
  }
 
  openModif(comptable: DateComptable) {
    this.transfertData.setData(comptable);
    this.router.navigateByUrl('home/parametrage-comptable/parametrage-date-comptable/update-date-comptable');
  }
  openDel(dialog: TemplateRef<any>, comptable: DateComptable) {
    this.dialogService.open(
      dialog,
      { context: comptable });
  }


  check_fonct(fonct: String) {
    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }
  

}
