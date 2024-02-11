import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ClassificationSecteur } from '../../../../model/ClassificationSecteur';
import { Groupe } from '../../../../model/Groupe';
import { ClassificationSecteurService } from '../../../../services/classification-secteur.service';
import { FilialeService } from '../../../../services/filiale.service';
import countries from '../../../data/countries.json';

import { GroupeService } from '../../../../services/groupe.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { AjoutGroupeComponent } from './ajout-groupe/ajout-groupe.component';
import { ModifGroupeComponent } from './modif-groupe/modif-groupe.component';

@Component({
  selector: 'ngx-groupe',
  templateUrl: './groupe.component.html',
  styleUrls: ['./groupe.component.scss']
})
export class GroupeComponent implements OnInit {
  groupes: Array<Groupe> = new Array<Groupe>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  autorisation = [];
  classifications: ClassificationSecteur[];
  listPays:any [] = countries;


  public displayedColumns = ['group_code', 'group_liblong', 'group_libcourt', 'group_classif','action'];
  public dataSource = new MatTableDataSource<Groupe>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private groupeService: GroupeService, private dialogService: NbDialogService,
    private toastrService: NbToastrService,private authService: NbAuthService,
    private classifService: ClassificationSecteurService,private router: Router,
    private transfertData: TransfertDataService,private filialeService: FilialeService) { }

  ngOnInit(): void {
    this.onGetAllGroupes();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });
    this.classifService.getAllClassificationSecteur()
    .subscribe((data: ClassificationSecteur[]) => {
      this.classifications = data;
      //console.log(this.classifications);
    });
  }


  onGetAllGroupes () {
      this.groupeService.getAllGroupes()
      .subscribe((data: Groupe[]) => {
        // this.groupes = data;
        this.dataSource.data = data as Groupe[];
      });
  }
  onGetLibelleByClassif(code:number){ 
    return (this.classifications?.find(p => p.code === code))?.libelle;  

  }
  onGetLibelleBySiege(code:number){ 
    return (this.listPays?.find(s => s.callingCodes[0] == code))?.name;  

  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    console.log(this.dataSource);
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  open(dialog: TemplateRef<any>, groupe: Groupe) {
    this.dialogService.open(
      dialog,
      { context: groupe });
  }
  openDel(dialog: TemplateRef<any>, groupe: Groupe) {
    this.dialogService.open(
      dialog,
      { context: groupe });
  }

  openAjout() {
    this.router.navigateByUrl('home/groupe/ajout');
   /* this.dialogService.open(AjoutGroupeComponent)
    .onClose.subscribe(data => data && this.groupeService.addGroupe(data)
    .subscribe(() => {
      this.toastrService.show(
        'Groupe Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllGroupes();
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
        this.onGetAllGroupes();
    },
    ));
    */
  }

  openModif(groupe: Groupe) {
    this.transfertData.setData(groupe);
    this.router.navigateByUrl('home/groupe/modif');
    /*
    this.dialogService.open(ModifGroupeComponent, {
      context: {
        groupe: groupe,
      },
    })
    .onClose.subscribe(data => data && this.groupeService.modifGroupe(data)
    .subscribe(() => {
      this.toastrService.show(
        'Groupe modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllGroupes();
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 7000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.openAjout();
    },
    ));*/
  }
  openTestDel(dialogEchec: TemplateRef<any>,dialogC: TemplateRef<any>, groupe: Groupe) {
    
  
    
    this.groupeService.verifDel(groupe.group_code).subscribe((data) => {
      this.dialogService.open(
        dialogC,
        { context: groupe });
      
    },
    (error) => {
      this.dialogService.open(
        dialogEchec);
    });
  }
  redirectToDelete(code: Number) {


    this.groupeService.delGroupe(code).subscribe(() => {
      this.toastrService.show(
        'Groupe supprimé avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
      this.onGetAllGroupes();
    },
    (error) => {
      this.toastrService.show(
        'Suppression impossible',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 0,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
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
