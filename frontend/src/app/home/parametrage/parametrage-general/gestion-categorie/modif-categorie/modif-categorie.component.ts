import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import dateFormatter from 'date-format-conversion';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Commission } from '../../../../../model/Commission';
import { Taxe } from '../../../../../model/taxe';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { CommissionService } from '../../../../../services/commission.service';
import { TaxeService } from '../../../../../services/taxe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';

@Component({
  selector: 'ngx-modif-categorie',
  templateUrl: './modif-categorie.component.html',
  styleUrls: ['./modif-categorie.component.scss']
})
export class ModifCategorieComponent implements OnInit {
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  modifForm = this.fb.group({
    //Categ_id: [''],
    categ_numero: ['',[Validators.required]],
    categ_numerobranche: ['',[Validators.required]],
    categ_libellelong: ['',[Validators.required]],
    categ_libellecourt: ['',[Validators.required]],
    categ_classificationanalytique: [''],
    categ_codetaxe: ['',[Validators.required]],
    categ_codecommission: [''],
    categ_datemodification: [''],
    categ_datecomptabilisation: ['',[Validators.required]],
  });
  
  branche: Branche;
  taxe: Taxe;
  commission :Commission ;

  listBranches: any []; 
  listTaxes: any []; 
  listCommissions: any []; 

  branches: Array<Branche> = new Array<Branche>();
  taxes: Array<Taxe> = new Array<Taxe>();
  commissions : Array<Commission> = new Array<Commission>();

  branche_numero: any;
  taxe_codetaxe: String;
  comm_code: String;

  categorie: Categorie;
  datemodification: Date;
  datecomptabilisation: Date;
  autorisation: [];

  listeNumeroCategorie: any[];
  listeCodeTaxe: any[];
  cat_codetaxe: any;
  codeBranche: any;

  constructor(
    private categorieService :CategorieService, private authService: NbAuthService,
    private fb: FormBuilder,private brancheService: BrancheService,
    private taxeService: TaxeService, private commissionService : CommissionService,
    private transfertData: TransfertDataService,private router: Router,
    private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
        console.log(this.autorisation);
      }

    });

    this.categorie = this.transfertData.getData();
    this.onGetAllBranche();
    this.onGetAllTaxe();
    this.onGetAllCommission();
    //this.modifForm.controls['Categ_id'].setValue(this.categorie.Categ_id);
        this.modifForm.controls['categ_numero'].setValue(this.categorie.categ_numero);
        this.modifForm.controls['categ_numerobranche'].setValue(this.categorie.categ_numerobranche);
        this.codeBranche = this.categorie.categ_numerobranche;
        console.log(this.branche_numero);
        this.modifForm.controls['categ_libellelong'].setValue(this.categorie.categ_libellelong);
        this.modifForm.controls['categ_libellecourt'].setValue(this.categorie.categ_libellecourt);
        this.modifForm.controls['categ_classificationanalytique'].setValue(this.categorie.categ_classificationanalytique);
        this.modifForm.controls['categ_codetaxe'].setValue(this.categorie.categ_codetaxe);
        this.taxe_codetaxe=this.categorie.categ_codetaxe?.toString();
        console.log(this.taxe_codetaxe);
        this.modifForm.controls['categ_codecommission'].setValue(this.categorie.categ_codecommission);
        this.comm_code=this.categorie.categ_codecommission?.toString();
        this.datemodification = dateFormatter(this.categorie.categ_datemodification, 'yyyy-MM-ddThh:mm');
        this.modifForm.controls['categ_datemodification'].setValue(this.datemodification);
        this.datecomptabilisation = dateFormatter(this.categorie.categ_datecomptabilisation, 'yyyy-MM-ddThh:mm');
        this.modifForm.controls['categ_datecomptabilisation'].setValue(this.datecomptabilisation);
        
  }
  onGetLibelleByBranche(numero: any) {
    return numero + " : " + (this.branches?.find(b => b.branche_numero === numero))?.branche_libelleLong;
  }
  onGetAllCommission(){
    this.commissionService.getAllCommissions()
      .subscribe((data: Commission[]) => {
          this.commissions = data;
          this.listCommissions = data as Commission[];
      });
  }
  onGetAllBranche(){
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
          this.branches = data;
          this.listBranches = data as Branche[];
      });
  }
  onGetAllTaxe(){
    this.taxeService.getAllTaxes()
      .subscribe((data: Taxe[]) => {
          this.taxes = data;
          this.listTaxes = data as Taxe[];
      });
  }

  cancel() {
    this.router.navigateByUrl('home/gestion_categorie');
  }

  submit() {
   
    this.modifForm.controls['categ_datemodification'].setValue(new Date());
    this.categorieService.update(this.modifForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'categorie modifié avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 7000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion_categorie');
    },
    (error) => {
      this.toastrService.show(
        error.error.message,
        'Notification d\'erreur',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 20000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        
    },
    );
  }
  onGetAllTaxeByBranche(branche: number) {
    this.taxeService.getAllTaxeByBranche(branche)
      .subscribe((data: Taxe[]) => {
        this.listeCodeTaxe = data as Taxe[];
      });
  }
  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[];
      });
  }
  onChangeBranche(event) {    
    
    this.onGetAllTaxeByBranche(event);
    this.onGetAllCategorieByBranche(event);
    
    this.cat_codetaxe = "".toString();
    this.modifForm.controls['categ_codetaxe'].setValue(this.cat_codetaxe);
    this.categorieService.lastID(event).subscribe((data)=>{
      if(data==0){
        this.modifForm.controls['categ_numero'].setValue(event.toString()+"001");
      }else{
        this.modifForm.controls['categ_numero'].setValue(Number(data)+1);
      }
    })
    this.modifForm.controls['categ_numerobranche'].setValue(event);
  }

  onChangeTaxe(event) {    
    this.modifForm.controls['categ_codetaxe'].setValue(event);
  }
  onChangeCommission(event) {
    this.modifForm.controls['categ_codecommission'].setValue(event);
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  
  }
}
