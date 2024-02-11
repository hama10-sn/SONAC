import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Taxe } from '../../../../../model/taxe';
import { TaxeService } from '../../../../../services/taxe.service';
//import dateFormatter from 'date-format-conversion';
import dateFormatter from 'date-format-conversion';
import type from '../../../../data/type.json';
import { Router } from '@angular/router';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { ProduitService } from '../../../../../services/produit.service';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Produit } from '../../../../../model/Produit';

@Component({
  selector: 'ngx-modif-taxe',
  templateUrl: './modif-taxe.component.html',
  styleUrls: ['./modif-taxe.component.scss']
})
export class ModifTaxeComponent implements OnInit {

  taxeAssiet: String;
  listTypesAssiet: any[];
  modifForm = this.fb.group({
    taxe_codetaxe: [''],
    taxe_branch: [''],
    taxe_catego: [''],
    taxe_codeproduit: [''],
    taxe_garant: [''],
    taxe_calcul: ['', Validators.required],
    taxe_txappliq: ['', Validators.required],
    taxe_dateffet: ['', Validators.required],
    taxe_datefin: [''],
  });


  problemeDate: boolean;
  taxe_dateffett: Date;
  taxe_datefinn: Date;
  taxe_dateffetrecupere: Date;
  taxe_datefinrecuper: Date;
  taxe: Taxe;

  // La gestion des clés étrangère
  listeCodeBranche: any[];
  codeBranche: any;
  listeNumeroCategorie: any[];
  codeCategorie: any;
  listeCodeProduit: any[];
  codeProduit: any;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  autorisation = [];
  @Input() listAssiette: any[] = type;

  constructor(/*protected ref: NbDialogRef<ModifTaxeComponent>,*/
    private taxeService: TaxeService, 
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private router: Router,
    private toastrService: NbToastrService, 
    private authService: NbAuthService, 
    private transfertData: TransfertDataService, 
    private fb: FormBuilder) { }

  ngOnInit(): void {

    // this.InitialiseCodeTaxe();'
    this.onGetAllBranches() ;
    this.onGetAllCategorie() ;
    this.onGetAllProduits() ;

    this.listTypesAssiet = this.listAssiette['ASSIETTE_CALCUL'];
    this.taxe = this.transfertData.getData();

    // this.taxeService.lastIDProduit(this.taxe.taxe_codeproduit).subscribe((data) => {
    //   this.modifForm.controls['taxe_codetaxe'].setValue(Number(data) + 1);

    // });

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);
        }

      });

    // this.taxe_dateffett = dateFormatter(new Date(), 'yyyy-MM-ddThh:mm');
    // this.taxe_datefinn = dateFormatter(new Date(9998, 12, 31), 'yyyy-MM-ddThh:mm');
    // console.log(dateFormatter("2021-07-27",'yyyy-MM-dd'));

    this.taxe_dateffett = dateFormatter(this.taxe.taxe_dateffet, 'yyyy-MM-ddThh:mm');
    this.taxe_datefinn = dateFormatter(this.taxe.taxe_datefin, 'yyyy-MM-ddThh:mm');

    this.modifForm.controls['taxe_codetaxe'].setValue(this.taxe.taxe_codetaxe);
    this.modifForm.controls['taxe_branch'].setValue(this.taxe.taxe_branch);
    this.codeBranche = this.taxe.taxe_branch ;

    this.modifForm.controls['taxe_catego'].setValue(this.taxe.taxe_catego);
    this.codeCategorie = this.taxe.taxe_catego ;

    this.modifForm.controls['taxe_codeproduit'].setValue(this.taxe.taxe_codeproduit);
    this.codeProduit = this.taxe.taxe_codeproduit ;
    
    this.modifForm.controls['taxe_calcul'].setValue(this.taxe.taxe_calcul);
    this.taxeAssiet = this.taxe.taxe_calcul.toString();
    this.modifForm.controls['taxe_txappliq'].setValue(this.taxe.taxe_txappliq);
    this.modifForm.controls['taxe_dateffet'].setValue(this.taxe_dateffett);
    this.modifForm.controls['taxe_datefin'].setValue(this.taxe_datefinn);


    console.log(this.taxe);
  }

  InitialiseCodeTaxe() {
    console.log(this.taxe.taxe_codetaxe);
    //this.modifForm.get("taxe_codetaxe").value ;
    this.taxeService.lastIDProduit(this.taxe.taxe_codetaxe).subscribe((data) => {


      this.modifForm.controls['taxe_codetaxe'].setValue(Number(data) + 1);

    });
    //  this.modifForm.controls['taxe_codeproduit'].setValue(event);
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
    this.modifForm.controls['taxe_garant'].setValue(9999);
    this.taxe_dateffetrecupere = this.modifForm.get("taxe_dateffet").value;
    this.taxe_datefinrecuper = this.modifForm.get("taxe_datefin").value;
    //  this.modifForm.controls['taxe_datefin'].setValue(new Date(MAX_VALUE));

    if (this.taxe_dateffetrecupere > this.taxe_datefinrecuper) {

      this.problemeDate = true;
      // Le traitement se fait côté template

    }
    else {
      //this.ref.close(this.modifForm.value);
      // var d = new Date();
      //d.setDate(d.getDate()-5);
      ///this.modifForm.controls['taxe_datefin'].setValue(new Date(),'yyyy-MM-ddThh:mm');
      // this.taxeService.modifTaxe(this.modifForm.value);
      this.taxeService.modifTaxe(this.taxe.taxe_id, this.modifForm.value)
        .subscribe(() => {
          this.toastrService.show(
            'taxe modifiée avec succés !',
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

  onChangeLibeleAssiet(event) {
    console.log(event);

    this.modifForm.controls['taxe_calcul'].setValue((this.listTypesAssiet.find(p => p.id === event)).id);
  }
  /* onChange(event) {
     console.log(event);
     this.modifForm.controls['role'].value[0] = event;
   }
 */

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

  onGetAllProduits() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.listeCodeProduit = data as Produit[];
      });
  }

  onGetLibelleByBranche(numero: any) {
    //this.onGetBranche(numero) ;
    //return this.branche?.branche_numero + " : "+ this.branche?.branche_libelleLong ;
    return numero + " : " + (this.listeCodeBranche?.find(b => b.branche_numero == numero))?.branche_libelleLong;
  }

  onGetLibelleByCategorie(numero: any) {
    return numero + " : " + (this.listeNumeroCategorie?.find(c => c.categ_numero == numero))?.categ_libellelong;
  }

  onGetLibelleByProduit(numero: any) {
    return numero + " : " + (this.listeCodeProduit?.find(p => p.prod_numero == numero))?.prod_denominationlong;
  }

}