import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Civilite } from '../../../../model/Civilite';
import { CiviliteService } from '../../../../services/civilite.service';
import { AjoutCiviliteComponent } from './ajout-civilite/ajout-civilite.component';
import { ModifCiviliteComponent } from './modif-civilite/modif-civilite.component';

@Component({
  selector: 'ngx-gestion-civilite',
  templateUrl: './gestion-civilite.component.html',
  styleUrls: ['./gestion-civilite.component.scss']
})
export class GestionCiviliteComponent implements OnInit {

  civilites: Array<Civilite> = new Array<Civilite>();
  civilite: Civilite;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  //status: NbComponentStatus = 'success';
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  public displayedColumns = ['civ_code', 'civ_libellelong', 'civ_libellecourt', 'details'/*, 'update', 'delete'*/];
  public dataSource = new MatTableDataSource<Civilite>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation= [];

  constructor(private civiliteService: CiviliteService, private dialogService: NbDialogService,
    private toastrService: NbToastrService, private authService: NbAuthService) { }

  ngOnInit(): void {
    this.onGetAllCivilite();
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
  }
  /*
  cette methode nous permet de d'avoir la liste des Civilites
  */
  onGetAllCivilite(){
    
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
          this.civilites = data;
          this.dataSource.data = data as Civilite[];
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
    open(dialog: TemplateRef<any>, civilite:Civilite ) {
     
      this.dialogService.open(
        dialog,
        { context: civilite 
            
        });
    }
  
      /*
      *cette methode nous permet d'ouvrir une 
      *boite dialogue pour inserer un civilite et de lever une exeption s'il a erreur
      */
  
    openAjout() {
      this.dialogService.open(AjoutCiviliteComponent)
      .onClose.subscribe(data => data && this.civiliteService.addCivilite(data)
      .subscribe(() => {
        this.toastrService.show(
          'Civilite Enregistré avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
         this.onGetAllCivilite();
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
          
          this.openAjout();
      },
      ));
    }
    /*
      *cette methode nous permet d'ouvrir une 
      *boite dialogue pour modifier un civilite     
      */
    openModif(civilite: Civilite) {
      this.dialogService.open(ModifCiviliteComponent, {
          context: {
            civilite: civilite,
          },
        })
      .onClose.subscribe(data => data && this.civiliteService.update(data)
      .subscribe(() => {
        this.toastrService.show(
          'civilite modifié avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
         this.onGetAllCivilite();
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
      ));
      
    }
    check_fonct(fonct: String) {

      let el = this.autorisation.findIndex(itm => itm === fonct);
      if (el === -1)
       return false;
      else
       return true;
  
    }
}
