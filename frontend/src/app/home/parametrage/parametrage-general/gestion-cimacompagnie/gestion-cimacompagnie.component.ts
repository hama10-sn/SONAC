import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Cimacodificationcompagnie } from '../../../../model/Cimacodificationcompagnie';
import { CimacompagnieService } from '../../../../services/cimacompagnie.service';
import { AjoutCimacompagnieComponent } from './ajout-cimacompagnie/ajout-cimacompagnie.component';
import { ModifCimacompagnieComponent } from './modif-cimacompagnie/modif-cimacompagnie.component';

@Component({
  selector: 'ngx-gestion-cimacompagnie',
  templateUrl: './gestion-cimacompagnie.component.html',
  styleUrls: ['./gestion-cimacompagnie.component.scss']
})
export class GestionCimacompagnieComponent implements OnInit {

  cimaCompagnies: Array<Cimacodificationcompagnie> = new Array<Cimacodificationcompagnie>();
  cimaCompagnie: Cimacodificationcompagnie;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  //status: NbComponentStatus = 'success';
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';


  public displayedColumns = ['id', 'code_cima_compagnie', 'denomination', 'details'/*, 'update', 'delete'*/];
  public dataSource = new MatTableDataSource<Cimacodificationcompagnie>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation= [];

  constructor(private cimacompagnieService: CimacompagnieService, private dialogService: NbDialogService,
    private toastrService: NbToastrService, private authService: NbAuthService) { }

  ngOnInit(): void {
    this.onGetAllCimaCompagnie();
    this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
  }
  /*
  cette methode nous permet de d'avoir la liste des CimaCompagnies
  */
  onGetAllCimaCompagnie(){
    
    this.cimacompagnieService.getAllCimaCompagnie()
      .subscribe((data: Cimacodificationcompagnie[]) => {
          this.cimaCompagnies = data;
          this.dataSource.data = data as Cimacodificationcompagnie[];
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
    open(dialog: TemplateRef<any>, cimaCompagnie:Cimacodificationcompagnie ) {
     
      this.dialogService.open(
        dialog,
        { context: cimaCompagnie 
            
        });
    }
  
      /*
      *cette methode nous permet d'ouvrir une 
      *boite dialogue pour inserer un CimaCompagnie et de lever une exeption s'il a erreur
      */
  
    openAjout() {
      this.dialogService.open(AjoutCimacompagnieComponent)
      .onClose.subscribe(data => data && this.cimacompagnieService.addCimaCompagnie(data)
      .subscribe(() => {
        this.toastrService.show(
          'cima Enregistré avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
         this.onGetAllCimaCompagnie();
      },
      (error) => {
        console.log(error);
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
      *boite dialogue pour modifier un cima   
      */
    openModif(cimaCompagnie: Cimacodificationcompagnie) {
      this.dialogService.open(ModifCimacompagnieComponent, {
          context: {
            cimaCompagnie: cimaCompagnie,
          },
        })
      .onClose.subscribe(data => data && this.cimacompagnieService.update(data)
      .subscribe(() => {
        this.toastrService.show(
          'cima modifié avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
         this.onGetAllCimaCompagnie();
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
