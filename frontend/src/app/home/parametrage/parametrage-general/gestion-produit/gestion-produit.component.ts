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
import { User } from '../../../../model/User';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { ProduitService } from '../../../../services/produit.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'ngx-gestion-produit',
  templateUrl: './gestion-produit.component.html',
  styleUrls: ['./gestion-produit.component.scss']
})
export class GestionProduitComponent implements OnInit {

  produits: Array<Produit> = new Array<Produit>() ;
  produit: Produit ;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT ;
  status: NbComponentStatus = 'success' ;
  statusFail: NbComponentStatus = 'danger' ;

  // affichage des libelles à la place des codes
  branches: Array<Branche> = new Array<Branche>();
  categories: Array<Categorie> = new Array<Categorie>() ;
  users: Array<User> = new Array<User>() ;

  title = 'La liste des produits';
  login_demandeur: string;
  demandeur: string;
  user: User;

  public displayedColumns = ['prod_numero', 'prod_numerobranche', 'prod_numerocategorie', 'prod_denominationlong', 'action' /*,'details', 'update'*/];
  public dataSource = new MatTableDataSource<Produit>();

  @ViewChild(MatSort) sort: MatSort ;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [] ;
  constructor(private produitService: ProduitService,
              private dialogService: NbDialogService,
              private authService: NbAuthService,
              private brancheService: BrancheService,
              private categorieService: CategorieService,
              private userService: UserService,
              private transfertData: TransfertDataService,
              private router: Router ) { }

  ngOnInit(): void {
    this.onGetAllProduits() ;
    this.onGetAllBranches() ;
    this.onGetAllCategories() ;
    this.onGetAllUsers() ;
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
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

  onGetAllBranches(){
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
          this.branches = data;
      });
  }

  onGetLibelleByBranche(numero:number){
    return  (this.branches.find(b => b.branche_numero === numero))?.branche_libelleLong ;       
  }

  onGetCodeAndLibelleByBranche(numero:number){
    return numero + " : "+  (this.branches.find(b => b.branche_numero === numero))?.branche_libelleLong ;       
  }

  onGetAllCategories(){
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
          this.categories = data;
      });
  }

  onGetLibelleByCategorie(numero:number){
    return  (this.categories.find(c => c.categ_numero === numero))?.categ_libellelong ;       
  }

  onGetCodeAndLibelleByCategorie(numero:number){
    return  numero + " : "+ (this.categories.find(c => c.categ_numero === numero))?.categ_libellelong ;       
  }

  onGetAllUsers(){
    this.userService.getAllUsers()
      .subscribe((data: User[]) => {
          this.users = data;
      });
  }

  onGetNomByUser(numero:String){
    return  (this.users.find(u => u.util_numero === numero))?.util_nom ;       
  }

  onGetAllProduits() {
    this.produitService.getAllProduits()
    .subscribe( (data: Produit[]) => {
      this.produits = data ;
      this.dataSource.data = data as Produit[] ;
    }) ;
  }

  ngAfterViewInit(): void { 
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  
    onOpen(dialog: TemplateRef<any>, produit: Produit) {
    this.dialogService.open(
      dialog,
      { context: produit,
       });
  }
  
  onOpenAjout() {
    this.router.navigateByUrl('home/parametrage-general/produits/ajout');
  }

  onOpenModif(produit: Produit) {
    this.transfertData.setData(produit);
    this.router.navigateByUrl('home/parametrage-general/produits/modif');
  } 

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
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
      this.produitService.generateReportProduit(format, form)
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
              saveAs(event.body, 'liste des produits.pdf');
          }
        });
    }

    if (format === 'excel') {
      // this.clientService.generateReportClient(format, this.title, this.demandeur)
      this.produitService.generateReportProduit(format, form)
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
              saveAs(event.body, 'liste des produits.xlsx');
          }
        });
    }
  }
}
