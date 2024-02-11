import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Devis } from '../../../../model/Devis';
import { DevisService } from '../../../../services/devis.service';
import { TransfertDataService } from '../../../../services/transfertData.service';

@Component({
  selector: 'ngx-gestion-devis',
  templateUrl: './gestion-devis.component.html',
  styleUrls: ['./gestion-devis.component.scss']
})
export class GestionDevisComponent implements OnInit {

  devis: Array<Devis> = new Array<Devis>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  autorisation = [];
  


  public displayedColumns = ['devis_numero', 'devis_date', 'devis_souscripteur', 'devis_objet', 'devis_montantttc', 'details', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Devis>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private devisService: DevisService, 
    private toastrService: NbToastrService,private authService: NbAuthService,
    private router: Router, private dialogService: NbDialogService,
    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.onGetAllDevis();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
    
  }


  onGetAllDevis () {
      this.devisService.getAllDevis()
      .subscribe((data: Devis[]) => {
        
        this.dataSource.data = data as Devis[];
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }

  openAjout () {
    this.router.navigateByUrl('home/devis/ajout');
  }

  open(dialog: TemplateRef<any>, devis: Devis) {
    this.dialogService.open(
      dialog,
      { context: devis });
  }

  openModif (devis: Devis) {
    this.transfertData.setData(devis);
    this.router.navigateByUrl('home/devis/modif');
  }

  redirectToDelete (numero: number) {
    this.devisService.delDevis(numero).subscribe(() => {
      this.toastrService.show(
        'Devis supprimé avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
      this.onGetAllDevis();
    },
    (error) => {
      this.toastrService.show(
        'Suppression impossible',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 7000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    });
  }

}
