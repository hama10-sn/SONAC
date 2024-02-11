import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { types } from 'util';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { TaxeComponent } from '../taxe.component';
import type  from '../../../../data/type.json';
import { TaxeService } from '../../../../../services/taxe.service';
import { Router } from '@angular/router';
import { ProduitService } from '../../../../../services/produit.service';
import { Produit } from '../../../../../model/Produit';
import dateFormatter from 'date-format-conversion';
import { Taxe } from '../../../../../model/taxe';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
@Component({
  selector: 'ngx-ajout-taxe',
  templateUrl: './ajout-taxe.component.html',
  styleUrls: ['./ajout-taxe.component.scss']
})
export class AjoutTaxeComponent implements OnInit {

  listTypesAssiet: any [];
  listCategorieBranche: any [];
  listProduitCategorie: any [];
  datepriseEffet: Date;
  codeproduit: number;
  taxe_datefinn:Date;
  taxes: Array<Taxe> = new Array<Taxe>();
  listeTaxes: any [];
  taxe_categorie:any;
  taxe_produit:any;
  erreur: boolean = false;
  problemeCodeTaxe: boolean=false;
  addForm = this.fb.group({
    taxe_codetaxe: ['', [Validators.required]],
    taxe_branch: ['', [Validators.required]],
    taxe_catego: ['', [Validators.required]],
    taxe_codeproduit: ['', [Validators.required]],
    taxe_garant: [''],
    taxe_calcul: ['',[Validators.required]],
    taxe_txappliq:['',[Validators.required]],
    taxe_dateffet: ['', [Validators.required]],
    taxe_datefin: ['']
  
  });
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  autorisation = [];
  @Input() listAssiette:any [] = type;
  listBranche: Array<Branche> = new Array<Branche>();
  listCategorie: Array<Categorie> = new Array<Categorie>();
  listProduit: Array<Produit> = new Array<Produit>();
  constructor(/*protected ref: NbDialogRef<TaxeComponent>*/private brancheService: BrancheService,
     private categoriService: CategorieService, private router:Router, private produitService: ProduitService,
     private toastrService: NbToastrService, private taxeService: TaxeService,private authService: NbAuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.onGetAllbranche();
    //this.onGetAllcategorieBranche();
    this.listTypesAssiet=this.listAssiette['ASSIETTE_CALCUL'];
    this.datepriseEffet = dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm');
    console.log(this.datepriseEffet);
    this.addForm.controls['taxe_dateffet'].setValue(this.datepriseEffet);
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }

   });

  }

  
  onChangeCodeBranche(event) {
    this.onGetAllcategorieBranche(event);
    this.addForm.controls['taxe_branch'].setValue(event);
    this.taxe_categorie = "".toString();
    this.addForm.controls['taxe_catego'].setValue(this.taxe_categorie);
  }

  onChangeCodeCategorie(event) {
    this.onGetAllCategorieProduit(event);
    // this.taxeService.lastID(event).subscribe((data)=>{
    //   if(data==0){
    //     this.addForm.controls['taxe_codetaxe'].setValue(event.toString()+"001");
    //   }else{
    //     this.addForm.controls['taxe_codetaxe'].setValue(Number(data)+1);
    //   }
    // })
    this.taxe_produit = "".toString();
    this.addForm.controls['taxe_codeproduit'].setValue(this.taxe_produit);
    this.addForm.controls['taxe_catego'].setValue(event);
    this.problemeCodeTaxe = false;
    

  }
  onChangeCodeProduit(event) {
    this.taxeService.lastIDProduit(event).subscribe((data)=>{
      if(data==0){
        this.addForm.controls['taxe_codetaxe'].setValue(event.toString()+"001");
       
      }else{
        this.addForm.controls['taxe_codetaxe'].setValue(Number(data)+1);
      }
    });
    this.addForm.controls['taxe_codeproduit'].setValue(event);
    this.codeproduit = this.addForm.get("taxe_codeproduit").value;
    console.log(this.codeproduit);
        this.taxeService.getAllTaxes()
        .subscribe((data: Taxe[]) => {
            this.taxes = data;
            this.listeTaxes = data as Taxe[];
            console.log(this.listeTaxes);
    //console.log(this.listeTaxes.find(p => p.taxe_codeproduit == this.codeproduit)?.taxe_codeproduit);    
              if(this.listeTaxes.find(p => p.taxe_codeproduit == this.codeproduit)) {
                  this.problemeCodeTaxe = true;
                 this.erreur = true
                 this.addForm.controls['taxe_codetaxe'].setValue("");
                } 
                else{
               //  console.log(this.listeTaxes.find(p => p.taxe_codeproduit === this.codeproduit)?.taxe_codetaxe!=0);    
                this.problemeCodeTaxe = false;
                 this.erreur = false;
                 
                }
              });

              
  
  }
  // onChangeCodeGarantie(event) {
  //   console.log(event);
  //    this.addForm.controls['taxe_garant'].setValue(event);

  // //   this.taxeService.lastID(event).subscribe((data)=>{
  // //     if(data==0){
  // //       this.addForm.controls['taxe_catego'].setValue(event.toString()+"001");
  // //     }else{
  // //       this.addForm.controls['taxe_catego'].setValue(Number(data)+1);
  // //     }
  // //   })
  // //   this.addForm.controls['categ_numerobranche'].setValue(event);
    

  //  }
  onChangeLibeleAssiet(event) {
    console.log(event);

    this.addForm.controls['taxe_calcul'].setValue((this.listTypesAssiet.find(p => p.id === event)).id);
  }
  onGetAllbranche(){
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
          this.listBranche = data;
          console.log(data);
      });
     // console.log(this.listPays);
  }
  
  onGetAllCategorieProduit(categorie:number){
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.listProduit = data as Produit[];
        console.log(data);
      });
     // console.log(this.listPays);
  }

  onGetAllcategorieBranche(branche:number){
    this.categoriService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
          this.listCategorie = data as Categorie[];
          //console.log(data);
      });
     // console.log(this.listPays);
  }

  cancel() {
    //this.ref.close();
    this.router.navigateByUrl('/home/parametrage-general/taxe');

  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }

  submit() {
   // this.ref.close(this.addForm.value);
   this.addForm.controls['taxe_garant'].setValue(9999);
   this.taxe_datefinn = dateFormatter(new Date(9998, 12, 31),'yyyy-MM-ddThh:mm');
   this.addForm.controls['taxe_datefin'].setValue(this.taxe_datefinn);
   this.taxeService.addTaxe(this.addForm.value)
   .subscribe((data) => {
     console.log(data);
     this.toastrService.show(
      data.message,
      'Notification',
       {
         status: this.statusSuccess,
         destroyByClick: true,
         duration: 300000,
         hasIcon: true,
         position: this.position,
         preventDuplicates: false,
       });
       this.router.navigateByUrl('/home/parametrage-general/taxe');
   },
   (error) => {
     this.toastrService.show(
      error.error.message,
      'Notification d\'erreur',
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

 
}
