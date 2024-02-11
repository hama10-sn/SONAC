import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Taxe } from '../../../../model/taxe';
import { TaxeService } from '../../../../services/taxe.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { AjoutTaxeComponent } from './ajout-taxe/ajout-taxe.component';
import { ModifTaxeComponent } from './modif-taxe/modif-taxe.component';
import type from '../../../data/type.json';
import { CategorieSocioprofessionnelle } from '../../../../model/CategorieSocioprofessionnelle';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { CategorieService } from '../../../../services/categorie.service';
import { BrancheService } from '../../../../services/branche.service';
import { Produit } from '../../../../model/Produit';
import { ProduitService } from '../../../../services/produit.service';


@Component({
  selector: 'ngx-taxe',
  templateUrl: './taxe.component.html',
  styleUrls: ['./taxe.component.scss']
})
export class TaxeComponent implements OnInit {
  listTypesAssiet: any[];
  taxes: Array<Taxe> = new Array<Taxe>();
  taxe: Taxe;
  @Input() listAssiette: any[] = type;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';



  public displayedColumns = ['taxe_codetaxe', 'taxe_branch', 'taxe_catego', 'taxe_codeproduit',/* 'taxe_garant','taxe_calcul'*/  'taxe_txappliq', 'taxe_dateffet', /*'taxe_datefin',*/ 'action' /*, 'details', 'update', 'delete'*/];
  public dataSource = new MatTableDataSource<Taxe>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];
  listCategories: any[];
  listBranches: any[];
  listeProduits: any[]




  categories: Array<Categorie> = new Array<Categorie>();
  branches: Array<Branche> = new Array<Branche>();
  produits: Array<Produit> = new Array<Produit>();


  // status: NbComponentStatus = 'info';

  constructor(private taxeService: TaxeService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,

    private categorieService: CategorieService,
    private brancheService: BrancheService,
    private produitService: ProduitService,
    private authService: NbAuthService, private router: Router,

    private transfertData: TransfertDataService) { }

  ngOnInit(): void {
    this.onGetALlTaxes();
    this.onGetAllBranche();
    this.onGetAllCategorie();
    this.onGetAllProduit();

    this.listTypesAssiet = this.listAssiette['ASSIETTE_CALCUL'];


    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);
        }

      });
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  onGetLibelleByTypeAssiette(type: String) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)

    return (this.listTypesAssiet.find(p => p.id === type))?.value;
  }
  onGetALlTaxes() {
    this.taxeService.getAllTaxes()
      .subscribe((data: Taxe[]) => {
        this.taxes = data;
        this.dataSource.data = data as Taxe[];
        console.log(this.taxes);
      });

  }
  onGetAllCategorie() {
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
        this.categories = data;
        this.listCategories = data;
      });
  }

  onGetAllBranche() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branches = data;
        this.listBranches = data;
      });
  }
  onGetAllProduit() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.produits = data;
        this.listeProduits = data;
      });
  }


  open(dialog: TemplateRef<any>, taxe: Taxe) {
    this.dialogService.open(
      dialog,
      { context: taxe });
  }
  openAjout() {
    this.router.navigateByUrl('/home/taxe/ajout');

    // this.dialogService.open(AjoutTaxeComponent)
    // .onClose.subscribe(data => data && this.taxeService.addTaxe(data)
    // .subscribe(() => {
    //   this.toastrService.show(
    //     'taxe Enregistrée avec succes !',
    //     'Notification',
    //     {
    //       status: this.statusSuccess,
    //       destroyByClick: true,
    //       duration: 2000,
    //       hasIcon: true,
    //       position: this.position,
    //       preventDuplicates: false,
    //     });
    //    this.onGetALlTaxes();
    // },
    // (error) => {
    //   this.toastrService.show(
    //     'une erreur est survenue',
    //     'Notification',
    //     {
    //       status: this.statusFail,
    //       destroyByClick: true,
    //       duration: 2000,
    //       hasIcon: true,
    //       position: this.position,
    //       preventDuplicates: false,
    //     });
    //     this.onGetALlTaxes();
    // },
    // ));
  }


  openModif(taxe: Taxe) {

    this.transfertData.setData(taxe);
    this.router.navigateByUrl('/home/taxe/modif');
  }
  // openModif(taxe: Taxe,id:number) {
  //   this.dialogService.open(ModifTaxeComponent, {
  //       context: {
  //         taxe: taxe,
  //       },
  //     })
  //   .onClose.subscribe(data => data && this.taxeService.modifTaxe(data,id)
  //   .subscribe(() => {
  //     this.toastrService.show(
  //       'taxe modifiée avec succes !',
  //       'Notification',
  //       {
  //         status: this.statusSuccess,
  //         destroyByClick: true,
  //         duration: 2000,
  //         hasIcon: true,
  //         position: this.position,
  //         preventDuplicates: false,
  //       });
  //      this.onGetALlTaxes();
  //   },
  //     (error) => {
  //       console.log(error);
  //       this.toastrService.show(
  //         'une erreur est survenue',
  //         'Notification',
  //         {
  //           status: this.statusFail,
  //           destroyByClick: true,
  //           duration: 2000,
  //           hasIcon: true,
  //           position: this.position,
  //           preventDuplicates: false,
  //         });
  //         this.onGetALlTaxes();
  //     },
  //   ));
  // }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }
  onDeleteTaxe(id: number) {
    this.taxeService.deleteTaxe(id)
      .subscribe(() => {
        this.toastrService.show(
          'Taxe supprimée avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 2000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });

        this.onGetALlTaxes();
      });
  }


  onGetLibelleByCategorie(categorie: any) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
    // console.log((this.listCategories.find(p=>p.categ_numero === categorie))?.categ_libellecourt);
    return (this.listCategories?.find(p => p.categ_numero == categorie))?.categ_libellecourt;
  }

  onGetLibelleByBranche(branche: any) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
    // console.log((this.listBranches.find(p=>p.branche_numero=== branche))?.branche_libellecourt);     
    return (this.listBranches?.find(p => p.branche_numero == branche))?.branche_libellecourt;

  }

  onGetLibelleByProduit(produit: any) {
    //this.addForm.controls['comp_type'].setValue((this.listTypes.find(p => p.id === event)).id)
    // console.log((this.listeProduits.find(p=>p.prod_numero === produit))?.prod_denominationcourt);         
    return (this.listeProduits?.find(p => p.prod_numero == produit))?.prod_denominationcourt;

  }

  public redirectToUpdate = (id: string) => {

  }
  public redirectToDelete = (id: string) => {

  }

}
