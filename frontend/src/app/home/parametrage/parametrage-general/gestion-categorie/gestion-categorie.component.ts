import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Produit } from '../../../../model/Produit';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { ProduitService } from '../../../../services/produit.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { saveAs } from 'file-saver';
import { UserService } from '../../../../services/user.service';
import { User } from '../../../../model/User';

@Component({
  selector: 'ngx-gestion-categorie',
  templateUrl: './gestion-categorie.component.html',
  styleUrls: ['./gestion-categorie.component.scss']
})
export class GestionCategorieComponent implements OnInit {

  categories: Array<Categorie> = new Array<Categorie>();
  categorie: Categorie;
  branches: Array<Branche> = new Array<Branche>();
  produits: Array<Produit> = new Array<Produit>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;

  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  
  public displayedColumns = ['categ_numero', 'categ_numerobranche', 'categ_libellelong'/*
  , 'categ_libellecourt', 'categ_classificationanalytique', 'categ_codetaxe'/*,'categ_codecommission'
  /*,'categ_datemodification','categ_datecomptabilisation'*/, 'details'/* , 'update', 'delete' */];
  public dataSource = new MatTableDataSource<Categorie>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];

  title = 'La liste des catégories';
  login_demandeur: string;
  demandeur: string;
  user: User;

  constructor(private categorieService: CategorieService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService, private authService: NbAuthService,
    private brancheService: BrancheService,private router: Router,
    private transfertData: TransfertDataService,private produitService: ProduitService,
    private userService: UserService) { }

    ngOnInit(): void {
      this.onGetAllCategories();
      this.onGetAllBranche();
      this.onGetAllProduit();
      this.authService.onTokenChange()
     .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
        this.login_demandeur = token.getPayload().sub;
        this.onGetUser(this.login_demandeur);
      }

    });
    }
    onGetUser(login: string) {
      this.userService.getUser(login)
        .subscribe((data: User) => {
          this.user = data;
          console.log(this.user);
          // this.demandeur = this.user.util_prenom + " "+ "lamine" + " " + this.user.util_nom;
          this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
          // this.demandeur = this.demandeur.replace(/ /g, "_") ;
        });
    }
    onGetAllProduit(){
      this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
          this.produits = data;
      });
    }
    onGetAllBranche(){
      this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
          this.branches = data;
      });
    }
    onGetBrancheByCode(code:number){
      return  (this.branches.find(b => b.branche_numero === code))?.branche_libelleLong ;       
    }
    onChechId(id:number){

      if(id==null){

        return 3;
      }
        if( this.produits.find(p => p.prod_numerocategorie === id)){
        return 2;
        }else {
          return 1;
        }     
    }
    onDeleteCategorie(id: number) {
      this.categorieService.deleteCategorie(id)
      
      .subscribe(() => {
        this.toastrService.show(
          'Categorie supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllCategories();
      },
      (error) => {
        this.toastrService.show(
          'suppréssion impossible il est rataché a un produit',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 7000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          
      },
      );
    }
    /*
  onDeleteContact1(id: number) {
    this.categorieService.deleteCategorie(id)
      .subscribe(() => {
        this.toastrService.show(
          'Categorie supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });          
      });
      this.onGetAllCategories();
  }*/
    /*
    cette methode nous permet de d'avoir la liste des categories
    */
    onGetAllCategories(){
      this.categorieService.getAllCategorie()
        .subscribe((data: Categorie[]) => {
            this.categories = data;
            this.dataSource.data = data as Categorie[];
            console.log(this.categories);
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

    open(dialog: TemplateRef<any>, categorie: Categorie) {
      
      this.dialogService.open(
        dialog,
        { context: categorie
         });
    }
    /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour inserer un categorie categories et de lever une exeption s'il a erreur
    */
    openAjout() {
      this.router.navigateByUrl('home/gestion_categorie/ajout');
      /*
      this.dialogService.open(AjoutCategorieComponent)
      .onClose.subscribe(data => data && this.categorieService.addCategorie(data)
      .subscribe(() => {
        this.toastrService.show(
          'Categorie Enregistré avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
         this.onGetAllCategories();
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
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un categorie categories et de lever une exeption s'il a erreur
    */
    openModif(categorie: Categorie) {
      this.transfertData.setData(categorie);      
    this.router.navigateByUrl('home/gestion_categorie/modif');

    /*
      this.dialogService.open(ModifCategorieComponent, {
          context: {
            categorie: categorie,
          },
        })
        .onClose.subscribe(data => data && this.categorieService.update(data)
        .subscribe(() => {
          this.toastrService.show(
            'categorie modifié avec succes !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 2000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
           this.onGetAllCategories();
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
            
        },
        ));*/
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
        onExport(format: String) {
          console.log(this.demandeur);
          let titleNew = this.title.replace(/ /g, "_");
          let demandeurNew = this.demandeur.replace(/ /g, "_");
      
          const form = new FormData();
          form.append('title', titleNew);
          form.append('demandeur', demandeurNew);
      
          if (format === 'pdf') {
            // this.clientService.generateReportClient(format, titleNew, demandeurNew)
            this.categorieService.generateReportCategorie(format, form)
              .subscribe(event => {
                switch (event.type) {
                  case HttpEventType.Sent:
                    console.log('Request has been made!');
                    break;
                  case HttpEventType.ResponseHeader:
                    console.log('Response header has been received!');
                    break;
                  case HttpEventType.UploadProgress:
                    break;
                  case HttpEventType.Response:
                    // console.log(event);
                    // var fileURL = URL.createObjectURL(event.body) ;
                    // window.open(fileURL) ;
                    saveAs(event.body, 'liste des categories.pdf');
                }
              });
          }
      
          if (format === 'excel') {
            // this.clientService.generateReportClient(format, this.title, this.demandeur)
            this.categorieService.generateReportCategorie(format, form)
              .subscribe(event => {
                switch (event.type) {
                  case HttpEventType.Sent:
                    console.log('Request has been made!');
                    break;
                  case HttpEventType.ResponseHeader:
                    console.log('Response header has been received!');
                    break;
                  case HttpEventType.UploadProgress:
                    break;
                  case HttpEventType.Response:
                    // console.log(event);
                    // var fileURL = URL.createObjectURL(event.body) ;
                    // window.open(fileURL) ;
                    saveAs(event.body, 'liste des categories.xlsx');
                }
              });
          }
        }

}
