import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Commission } from '../../../../model/Commission';
import { Intermediaire } from '../../../../model/Intermediaire';
import { Produit } from '../../../../model/Produit';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { CommissionService } from '../../../../services/commission.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { ProduitService } from '../../../../services/produit.service';
import { TransfertDataService } from '../../../../services/transfertData.service';

import { AddCommissionComponent } from './add-commission/add-commission.component';
import { UpdateCommissionComponent } from './update-commission/update-commission.component';

@Component({
  selector: 'ngx-gestion-commission',
  templateUrl: './gestion-commission.component.html',
  styleUrls: ['./gestion-commission.component.scss']
})
export class GestionCommissionComponent implements OnInit {

  commissions: Array<Commission> = new Array<Commission>() ;
  commission: Commission ;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT ;
  status: NbComponentStatus = 'success' ;

  public displayedColumns = ['comm_code', 'comm_codeapporteur', 'comm_codebranche', 'comm_codecategorie', 'comm_codeproduit', 'action' /*,'details', 'update'*/];
  public dataSource = new MatTableDataSource<Commission>();

  @ViewChild(MatSort) sort: MatSort ;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autorisation = [] ;

   // affichage des libelle à la place des codes
   branches: Array<Branche> = new Array<Branche>();
   categories: Array<Categorie> = new Array<Categorie>() ;
   produits: Array<Produit> = new Array<Produit>() ;
   intermediaires: Array<Intermediaire> = new Array<Intermediaire>() ;

  constructor(private commissionService: CommissionService,
              private dialogService: NbDialogService,
              private authService: NbAuthService,
              private brancheService: BrancheService,
              private categorieService: CategorieService,
              private interService: IntermediaireService,
              private router: Router,
              private transfertData: TransfertDataService,
              private produitService: ProduitService ) { }

  ngOnInit(): void {
    this.onGetAllCommissions() ;
    this.onGetAllBranches();
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

  onGetAllIntermediaires() {
    this.interService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.intermediaires = data as Intermediaire[];
      });
  }

  onGetDenominationByIntermediaire(numero:number){
    return  (this.intermediaires.find(i => i.inter_numero === numero))?.inter_denomination ;       
  }

  onGetCodeAndDenominationByIntermediaire(numero:number){
    return numero + " : " + (this.intermediaires.find(i => i.inter_numero === numero))?.inter_denomination ;       
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

  onGetAllCommissions() {
    this.commissionService.getAllCommissions()
    .subscribe( (data: Commission[]) => {
      this.commissions = data ;
      this.dataSource.data = data as Commission[] ;
    }) ;
  }

  onGetAllProduits() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
          this.produits = data as Produit[] ;
      }) ;
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

  
  onOpen(dialog: TemplateRef<any>, commission: Commission) {
    this.dialogService.open(
      dialog,
      { context: commission,
       });
  }

  onOpenAjout() {
    this.router.navigateByUrl('home/parametrage-systeme/commission/ajout');
  }

  onOpenModif(commission: Commission) {
    this.transfertData.setData(commission);
    this.router.navigateByUrl('home/parametrage-systeme/commission/modif');
  } 

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }
}
