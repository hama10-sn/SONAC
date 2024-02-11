import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { BanqueService } from '../../../../services/branque.service';
import { Banque } from '../../../../model/Banque';

@Component({
  selector: 'ngx-gestion-banque',
  templateUrl: './gestion-banque.component.html',
  styleUrls: ['./gestion-banque.component.scss']
})
export class GestionBanqueComponent implements OnInit {

  banques: Array<Banque> = new Array<Banque>();
  banque: Banque;

  title = 'La liste des banques';
  

  public displayedColumns = ['banq_codebanque', 'banq_denomination', 'banq_sigle', 'action'];
  public dataSource = new MatTableDataSource<Banque>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [];

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private banqueService: BanqueService,
    private dialogService: NbDialogService,
    private transfertData: TransfertDataService,
    private router: Router,
    private authService: NbAuthService) { }

  ngOnInit(): void {
    this.onGetAllBanques();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          // console.log(this.autorisation);
          
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

  // ============ ON GET METHODE ==============

  

  onGetAllBanques() {
    this.banqueService.getAllBanques()
      .subscribe((data: any) => {
        if (data.code === "ok")
          this.banques = data.data;
        this.dataSource.data = this.banques;
      });
  }

  // ============= On méthode ===============
  onOpen(dialog: TemplateRef<any>, banque: Banque) {

    this.dialogService.open(
      dialog,
      {
        context: banque,
      });
  }

  onAddBanque() {
    this.router.navigateByUrl('home/parametrage/parametrage-comptable/gestion-banque/add-banque');
  }

  onUpdateBanque(banque: Banque) {
    this.transfertData.setData(banque);
    this.router.navigateByUrl('home/parametrage/parametrage-comptable/gestion-banque/update-banque');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
