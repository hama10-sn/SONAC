import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Branche } from '../../../model/Branche';
import { Categorie } from '../../../model/Categorie';
import { Civilite } from '../../../model/Civilite';
import { ClassificationSecteur } from '../../../model/ClassificationSecteur';
import { Client } from '../../../model/Client';
import { Dem_Pers } from '../../../model/dem_Pers';
import { Produit } from '../../../model/Produit';
import { Prospect } from '../../../model/Prospect';
import { User } from '../../../model/User';
import { BrancheService } from '../../../services/branche.service';
import { CategorieService } from '../../../services/categorie.service';
import { CiviliteService } from '../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../services/classification-secteur.service';
import { ClientService } from '../../../services/client.service';
import { DemandephysiqueService } from '../../../services/demandephysique.service';
import { ProduitService } from '../../../services/produit.service';
import { ProspectService } from '../../../services/prospect.service';
import { TransfertDataService } from '../../../services/transfertData.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'ngx-gestion-credit-export',
  templateUrl: './gestion-credit-export.component.html',
  styleUrls: ['./gestion-credit-export.component.scss']
})
export class GestionCreditExportComponent implements OnInit {
 
  demandePhysiques: Array<Dem_Pers> = new Array<Dem_Pers>();
  demandePhysique: Dem_Pers;

  
  classificationSecteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  civilites: Array<Civilite> = new Array<Civilite>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['dem_persnum', 'dem_nom', 'dem_prenom',
'dem_adresse1','dem_objetdemande','dem_statut','action'];
   public dataSource = new MatTableDataSource<Dem_Pers>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];
   
   constructor(private demPService: DemandephysiqueService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService, private civiliteService: CiviliteService,
     private authService: NbAuthService, private router: Router,
     private activiteService:ClassificationSecteurService,private toastrService: NbToastrService) { }

  ngOnInit(): void {
    
    this.onGetAllCivilite();
   this.onGetClassification();
    this.onGetAllDemandePhy();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });
 }
 onGetAllDemandePhy(){
  this.demPService.getAllDemandePhysique()
  .subscribe((data: Dem_Pers[]) => {
      this.demandePhysiques = data;
      this.dataSource.data = data as Dem_Pers[];
      //console.log(this.demandePhysique);
  });  
 }

 onGetAllCivilite(){
  this.civiliteService.getAllCivilite()
    .subscribe((data: Civilite[]) => {
        this.civilites = data;
    });
}
onGetClassification(){
  this.activiteService.getAllGroupes()
  .subscribe((data: ClassificationSecteur[]) => {
    this.classificationSecteurs = data;
  });
}
 
 onGetSecteurByCode(code:number){
   //console.log((this.classificationSecteurs.find(c => c.code === code))?.libelle );
  return  (this.classificationSecteurs.find(c => c.code === code))?.libelle ;       
}
onGetCiviliteByCode(code:number){
  //console.log((this.civilites.find(c => c.civ_code === code))?.civ_libellelong ); 
  return  (this.civilites.find(c => c.civ_code === code))?.civ_libellelong ;  
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
    open(dialog: TemplateRef<any>, demandePhy:Dem_Pers ) {
     
      this.dialogService.open(
        dialog,
        { context: demandePhy 
            
        });
    }

    
  /*
    *cette methode nous permet d'ouvrir une 
    * inserer un reassureur 
    */
  openAjout() {
    
    this.router.navigateByUrl('home/ajout_agrement');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un reassureur     
    */
  openModif(demande: Dem_Pers) {
    this.transfertData.setData(demande);
    this.router.navigateByUrl('home/demande-Physique/modif-Physique');
  }
  
  onDeleteDemande(id: number) { 

    this.demPService.deleteDemande(id)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Demande Supprimer avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.onGetAllDemandePhy();
    },
    (error) => {
      this.toastrService.show(
        'Impossible de supprimer demande rattachée à un affaire !',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
    },
    );
      }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
  onChechId(id:number){

    if(id==null){

      return 3;
    }
      if( this.demandePhysiques.find(p => p.dem_statut === "en attente" &&  p.dem_persnum === id)){
      return 1;
      }else {
        return 2;
      }     
  }

}
