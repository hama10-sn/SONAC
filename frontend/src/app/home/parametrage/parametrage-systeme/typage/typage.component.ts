import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';

import { Typage } from '../../../../model/Typage';
import { TypageService } from '../../../../services/typage.service';
import { AjoutTypageComponent } from './ajout-typage/ajout-typage.component';
import { ModifTypageComponent } from './modif-typage/modif-typage.component';

@Component({
  selector: 'ngx-typage',
  templateUrl: './typage.component.html',
  styleUrls: ['./typage.component.scss'],
})
export class TypageComponent implements OnInit {

  typages: Array<Typage> = new Array<Typage>();
  typage: Typage;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  autorisation = [];


  public displayedColumns = ['typ_id', 'typ_libelle_long', 'typ_libelle_court', 'typ_type', 'update', 'delete'];
  public dataSource = new MatTableDataSource<Typage>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // status: NbComponentStatus = 'info';

  constructor(private typageService: TypageService, private authService: NbAuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.onGetAllTypages();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

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

  onGetAllTypages() {
    this.typageService.getAllTypages()
      .subscribe((data: Typage[]) => {
          this.typages = data;
          this.dataSource.data = data as Typage[];
          console.log(this.typages);
      });
  }

  onDeleteTypage(id: number) {
    this.typageService.deleteTypage(id)
      .subscribe(() => {
        this.toastrService.show(
          'Typage supprimer avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

          this.onGetAllTypages();
      });
  }

  open(dialog: TemplateRef<any>, typage: Typage) {
    this.dialogService.open(
      dialog,
      { context: typage });
       console.log(this.typages);
  }
  openAjout() {
    this.dialogService.open(AjoutTypageComponent)
    .onClose.subscribe(data => data && this.typageService.addTypage(data)
    .subscribe(() => {
      this.toastrService.show(
        'Typage Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllTypages();
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllTypages();
    },
    ));
  }

  openModif(typage: Typage, id: Number) {
    this.dialogService.open(ModifTypageComponent, {
        context: {
          typage: typage,
        },
      })
    .onClose.subscribe(data => data && this.typageService.updateTypages(data, id)
    .subscribe(() => {
      this.toastrService.show(
        'Utilisateur modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllTypages();
    },
      (error) => {
        console.log(error);
        this.toastrService.show(
          'une erreur est survenue',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllTypages();
      },
    ));
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

}
