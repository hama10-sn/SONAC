import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Fonctionnalite } from '../../../../../model/Fonctionnalite';
import { Role } from '../../../../../model/Role';
import { RoleService } from '../../../../../services/role.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { AjoutFonctionnaliteComponent } from '../../../../gestion-utilisateur/gestion_role/fonctionnalite/ajout-fonctionnalite/ajout-fonctionnalite.component';

@Component({
  selector: 'ngx-demande-caution',
  templateUrl: './demande-caution.component.html',
  styleUrls: ['./demande-caution.component.scss']
})
export class DemandeCautionComponent implements OnInit {
  public displayedColumns = ['demande', 'doc', 'reference', 'cv', 'cni', 'bilan', 'releve'];

  /* fonctionnalites: Array<Fonctionnalite> = new Array<Fonctionnalite>();
  fonctionnalite: Fonctionnalite; */
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  tableau_fonctionnalite = [];
  tab = [];
  donnee: Role;
  name_role: any;
  autorisations = [];


  displayInfoAdmin: boolean = false;
  display: boolean = false;
  displayDemande: boolean = false;
  displayContrats: boolean = false;
  displayFinanciers: boolean = false;
  displayClient: boolean = false;
  displayAutre: boolean = false;
  displayTeleClient: boolean = false;
  files: File[];
  selectedFile = null;
  progress: number = 0;
  displayprogress: boolean = false;
  displayUpload: boolean = false;
 
  public dataSource = new MatTableDataSource<Fonctionnalite>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // status: NbComponentStatus = 'info';

  constructor( private transfertData: TransfertDataService,
    private dialogService: NbDialogService, private roleService: RoleService, private router: Router,
    private toastrService: NbToastrService, private authService: NbAuthService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisations = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisations);
      }

    });
    
    this.donnee = this.transfertData.getData();
   // this.onGetAllFonctionnalites();
    if (this.donnee.autorisation != null )
     this.tab = this.donnee.autorisation.split(',');
     this.name_role = this.donnee.nom;
    console.log(this.tab);



  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

 /*  onGetAllFonctionnalites() {
    this.fonctionnaliteService.getAllFonctionnalites()
      .subscribe((data: Fonctionnalite[]) => {
          this.fonctionnalites = data;
          this.dataSource.data = data as Fonctionnalite[];
          console.log(this.fonctionnalites);
      });
  } */

 /*  onDeleteFonctionnalite(id: number) {
    this.fonctionnaliteService.deleteFonctionnalite(id)
      .subscribe(() => {
        this.toastrService.show(
          'Fonctionnalite supprimer avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

          this.onGetAllFonctionnalites();
      });
  } */

  
  openAjout() {/* 
    this.dialogService.open(AjoutFonctionnaliteComponent)
    .onClose.subscribe(data => data && this.fonctionnaliteService.addFonctionnalite(data)
    .subscribe(() => {
      this.toastrService.show(
        'Fonctionnalite Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
       this.onGetAllFonctionnalites();
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
        this.onGetAllFonctionnalites();
    },
    )); */
  }

  openModif(fonctionnalite: Fonctionnalite, id: Number) {
   /*  this.dialogService.open(ModifFonctionnaliteComponent, {
        context: {
          fonctionnalite: fonctionnalite,
        },
      })
    .onClose.subscribe(data => data && this.fonctionnaliteService.updateFonctionnalites(data, id)
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
       this.onGetAllFonctionnalites();
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
          this.onGetAllFonctionnalites();
      },
    )); */
  }

  onSelection_fonctionnalite(e, data) {

    if (e.target.checked) {
      this.tab.push(data);
    } else {

       let el = this.tab.findIndex(itm => itm === data);
        this.tab.splice((el), 1);
      // this.tableau_fonctionnalite.pop();
       console.log(el);
    }
    console.log(this.tab);

  }
  onCLickUpload () {
    this.displayInfoAdmin = false;
    this.displayDemande = false;
    this.displayContrats = false;
    this.displayFinanciers = false;
    this.displayClient = false;
    this.displayAutre = false;
    this.displayTeleClient = false;
    this.displayUpload = true;
    }

  onClickUpload () {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for(const file of this.files) {
      form.append('files', file, file.name);
    }
  }
  onAjout(){
/*
    // tslint:disable-next-line:max-line-length
  this.roleService.updateRoles(new Role(this.donnee.id, this.donnee.nom, this.tab.toString(), this.donnee.date_create,new Date()),this.donnee.id)
    .subscribe(() => {
      this.toastrService.show(
        'Fonctionnalite Enregistrée avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigate(['home/role']);
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
        this.onGetAllFonctionnalites();
    },
    );
*/
  }

  onAnnuler() {
         // this.router.navigate(['home/role']);
    }

  check_fonct(fonct: String) {

    let el = this.tab.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }

  check_fonct21(fonct: String) {

    let el = this.autorisations.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
  onFileSelected (event) {
    this.selectedFile = event.target.files;
      console.log(this.selectedFile);
  }

  public redirectToUpdate = (id: string) => {

  }
  public redirectToDelete = (id: string) => {

  }
}
