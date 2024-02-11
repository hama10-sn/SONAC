import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { BanqueService } from '../../../../services/branque.service';
import { Banque } from '../../../../model/Banque';
import { Pleins } from '../../../../model/Pleins';
import { PleinsService } from '../../../../services/pleins.service';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Produit } from '../../../../model/Produit';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { ProduitService } from '../../../../services/produit.service';

@Component({
  selector: 'ngx-gestion-pleins',
  templateUrl: './gestion-pleins.component.html',
  styleUrls: ['./gestion-pleins.component.scss']
})
export class GestionPleinsComponent implements OnInit {

  pleins: Array<Pleins> = new Array<Pleins>();
  banque: Pleins;
  listeCodeBranche: Array<Branche> = new Array<Branche>();
  listeNumeroCategorie: Array<Categorie> = new Array<Categorie>();
  listeNumeroProduit: Array<Produit> = new Array<Produit>();

  title = 'La liste des pleins';


  public displayedColumns = ['pleins_exercice', 'pleins_branche', 'pleins_categorie', 'pleins_produit', 'pleins_capacite', 'action'];
  public dataSource = new MatTableDataSource<Pleins>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [];

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private pleinsService: PleinsService,
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private dialogService: NbDialogService,
    private transfertData: TransfertDataService,
    private router: Router,
    private authService: NbAuthService) { }

  ngOnInit(): void {
    this.onGetAllPleins();
    this.onGetAllBranches();
    this.onGetAllCategorie();
    this.onGetAllProduit();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          // console.log(this.autorisation);
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  onGetAllPleins() {
    this.pleinsService.getAllPleins()
      .subscribe((data: any) => {
        if (data.code === "ok")
          this.pleins = data.data;
        this.dataSource.data = this.pleins;
      });
  }

  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.listeCodeBranche = data as Branche[];
      });
  }

  onGetAllCategorie() {
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[];
      });
  }

  onGetAllProduit() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.listeNumeroProduit = data as Produit[];
      });
  }

  onGetLibelleByBranche(numero: number) {
    return (numero + " : " + (this.listeCodeBranche.find(b => b.branche_numero === numero))?.branche_libelleLong);
  }

  onGetLibelleByCategorie(numero: number) {
    return numero + " : " + (this.listeNumeroCategorie.find(c => c.categ_numero === numero))?.categ_libellelong;
  }

  onGetLibelleByProduit(numero: number) {
    return numero + " : " + (this.listeNumeroProduit.find(p => p.prod_numero === numero))?.prod_denominationlong;
  }

  onOpen(dialog: TemplateRef<any>, pleins: Pleins) {

    this.dialogService.open(
      dialog,
      {
        context: pleins,
      });
  }

  onAddPleins() {
    this.router.navigateByUrl('home/parametrage/parametrage-comptable/gestion-pleins/add-pleins');
  }

  onUpdatePleins(pleins: Pleins) {
    this.transfertData.setData(pleins);
    this.router.navigateByUrl('home/parametrage/parametrage-comptable/gestion-pleins/update-pleins');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
