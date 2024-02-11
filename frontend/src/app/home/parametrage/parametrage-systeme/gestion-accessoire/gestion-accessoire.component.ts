import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Accessoire } from '../../../../model/Accessoire';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Produit } from '../../../../model/Produit';
import { AccessoireService } from '../../../../services/accessoire.service';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { ProduitService } from '../../../../services/produit.service';
import { TransfertDataService } from '../../../../services/transfertData.service';

@Component({
  selector: 'ngx-gestion-accessoire',
  templateUrl: './gestion-accessoire.component.html',
  styleUrls: ['./gestion-accessoire.component.scss']
})
export class GestionAccessoireComponent implements OnInit {

  accessoires: Array<Accessoire> = new Array<Accessoire>() ;
  accessoire: Accessoire ;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['acces_code', 'acces_codeapporteur', 'acces_codebranche', 'acces_codecategorie', 'acces_codeproduit', 'action' /*,'details', 'update'*/];
  public dataSource = new MatTableDataSource<Accessoire>();

  @ViewChild(MatSort) sort: MatSort ;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [] ;

  // affichage des libelle à la place des codes
  branches: Array<Branche> = new Array<Branche>();
  categories: Array<Categorie> = new Array<Categorie>() ;
  produits: Array<Produit> = new Array<Produit>();
  intermediaires: Array<Intermediaire> = new Array<Intermediaire>();

  constructor(private accessoireService: AccessoireService,
              private dialogService: NbDialogService,
              private transfertData: TransfertDataService,
              private router: Router,
              private authService: NbAuthService,
              private brancheService: BrancheService,
              private categorieService: CategorieService,
              private produitService: ProduitService,
              private interService: IntermediaireService,
              private toastrService: NbToastrService ) { }

  ngOnInit(): void {
    this.onGetAllAccessoires() ;
    this.onGetAllBranches() ;
    this.onGetAllCategories() ;
    this.onGetAllProduits() ;
    this.onGetAllIntermediaires() ;
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
      }
    });
  }

  onGetAllAccessoires() {
    this.accessoireService.getAllAccessoires()
    .subscribe( (data: Accessoire[]) => {
      this.accessoires = data ;
      this.dataSource.data = data as Accessoire[] ;
    }) ;
  }

  onGetAllIntermediaires() {
    this.interService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.intermediaires = data as Intermediaire[];
      });
  }

  onGetAllBranches(){
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
          this.branches = data;
      });
  }

  onGetAllCategories(){
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
          this.categories = data;
      });
  }

  onGetAllProduits(){
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
          this.produits = data;
      });
  }

  onGetDenominationByIntermediaire(numero:number){
    return  (this.intermediaires.find(i => i.inter_numero === numero))?.inter_denomination ;       
  }

  onGetCodeAndDenominationByIntermediaire(numero:number){
    return numero + " : " + (this.intermediaires.find(i => i.inter_numero === numero))?.inter_denomination ;       
  }

  onGetLibelleByBranche(numero:number){
    return  (this.branches.find(b => b.branche_numero === numero))?.branche_libelleLong ;       
  }

  onGetCodeAndLibelleByBranche(numero:number){
    return numero + " : "+  (this.branches.find(b => b.branche_numero === numero))?.branche_libelleLong ;       
  }

  onGetLibelleByCategorie(numero:number){
    return  (this.categories.find(c => c.categ_numero === numero))?.categ_libellelong ;       
  }

  onGetCodeAndLibelleByCategorie(numero:number){
    return  numero + " : "+ (this.categories.find(c => c.categ_numero === numero))?.categ_libellelong ;       
  }

  onGetDenominationByProduit(numero:number){
    return  (this.produits.find(p => p.prod_numero === numero))?.prod_denominationlong ;       
  }

  onGetCodeAndDenominationByProduit(numero:number){
    return numero + " : " +  (this.produits.find(p => p.prod_numero === numero))?.prod_denominationlong ;       
  }

  ngAfterViewInit(): void { 
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  
    onOpen(dialog: TemplateRef<any>, accessoire: Accessoire) {
    this.dialogService.open(
      dialog,
      { context: accessoire,
       });
  }

  onOpenAjout() {
    this.router.navigateByUrl('home/parametrage-systeme/accessoire/ajout');
  }

  onOpenModif(accessoire: Accessoire) {
    this.transfertData.setData(accessoire);
    this.router.navigateByUrl('home/parametrage-systeme/accessoire/modif');
  } 

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }

  redirectToDelete(num: number) {
    this.accessoireService.deleteAccessoire(num)
      .subscribe(() => {
        this.toastrService.show(
          'Accessoire supprimé avec succès !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllAccessoires() ;
      },
      (error) => {
        this.toastrService.show(
          error.error.message(),
          'Notification d\'erreur',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 5000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
      });
  }
}
