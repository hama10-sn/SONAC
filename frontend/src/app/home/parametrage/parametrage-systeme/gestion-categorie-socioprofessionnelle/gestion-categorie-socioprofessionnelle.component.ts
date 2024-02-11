import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../../model/CategorieSocioprofessionnelle';
import { CategorieSocioprofessionnelleService } from '../../../../services/categorieSocioProfessionnelle.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { AddCategorieSocioprofessionnelleComponent } from './add-categorie-socioprofessionnelle/add-categorie-socioprofessionnelle.component';
import { UpdateCategorieSocioprofessionnelleComponent } from './update-categorie-socioprofessionnelle/update-categorie-socioprofessionnelle.component';

@Component({
  selector: 'ngx-gestion-categorie-socioprofessionnelle',
  templateUrl: './gestion-categorie-socioprofessionnelle.component.html',
  styleUrls: ['./gestion-categorie-socioprofessionnelle.component.scss']
})
export class GestionCategorieSocioprofessionnelleComponent implements OnInit {

  categoriesSociopros: Array<CategorieSocioprofessionnelle> = new Array<CategorieSocioprofessionnelle>() ;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT ;
  status: NbComponentStatus = 'success' ;

  public displayedColumns = ['categorie_code', 'categorie_libelleLong','categorie_libelleCourt', 'details', 'update'];
  public dataSource = new MatTableDataSource<CategorieSocioprofessionnelle>();

  @ViewChild(MatSort) sort: MatSort ;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [] ;

  constructor(private categorieSocioProService: CategorieSocioprofessionnelleService,
              private dialogService: NbDialogService,
              private transfertData: TransfertDataService,
              private authService: NbAuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.onGetAllCategorieSocioprofessionnelle() ;
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
      }
    });
  }

  onGetAllCategorieSocioprofessionnelle() {
    this.categorieSocioProService.getAllCategorieSocioprofessionnelle()
    .subscribe( (data: CategorieSocioprofessionnelle[]) => {
      this.categoriesSociopros = data ;
      this.dataSource.data = data as CategorieSocioprofessionnelle[] ;

    }) ;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onOpen(dialog: TemplateRef<any>, categorie: CategorieSocioprofessionnelle) {

    this.dialogService.open(
      dialog,
      { context: categorie,
       });
  }

  onOpenAjout() {
    this.router.navigateByUrl('home/parametrage-systeme/categorie-socioprofessionnelle/ajout');
  }

    onOpenModif(categorie: CategorieSocioprofessionnelle) {
      this.transfertData.setData(categorie);
      this.router.navigateByUrl('home/parametrage-systeme/categorie-socioprofessionnelle/modif');
  } 

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }

}
