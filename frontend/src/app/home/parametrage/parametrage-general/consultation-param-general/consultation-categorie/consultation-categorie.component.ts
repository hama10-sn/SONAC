import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition } from '@nebular/theme';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Produit } from '../../../../../model/Produit';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { ProduitService } from '../../../../../services/produit.service';
import { saveAs } from 'file-saver';
import { UserService } from '../../../../../services/user.service';
import { User } from '../../../../../model/User';


@Component({
  selector: 'ngx-consultation-categorie',
  templateUrl: './consultation-categorie.component.html',
  styleUrls: ['./consultation-categorie.component.scss']
})
export class ConsultationCategorieComponent implements OnInit {

  categories: Array<Categorie> = new Array<Categorie>();
  categorie: Categorie;
  branches: Array<Branche> = new Array<Branche>();
  produits: Array<Produit> = new Array<Produit>();
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;

  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['categ_numero', 'categ_numerobranche', 'categ_libellelong', 'details'];
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
    private authService: NbAuthService,
    private brancheService: BrancheService, 
    private produitService: ProduitService,
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
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  onGetAllProduit() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.produits = data;
      });
  }

  onGetAllBranche() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branches = data;
      });
  }

  onGetBrancheByCode(code: number) {
    return (this.branches.find(b => b.branche_numero === code))?.branche_libelleLong;
  }

  onGetAllCategories() {
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
        this.categories = data;
        this.dataSource.data = data as Categorie[];
        console.log(this.categories);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  open(dialog: TemplateRef<any>, categorie: Categorie) {

    this.dialogService.open(
      dialog,
      {
        context: categorie
      });
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
              saveAs(event.body, 'liste des categories.pdf');
          }
        });
    }

    if (format === 'excel') {
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
              saveAs(event.body, 'liste des categories.xlsx');
          }
        });
    }
  }

}
