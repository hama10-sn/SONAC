import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { Branche } from '../../../../../model/Branche';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Categorie } from '../../../../../model/Categorie';
import { Commission } from '../../../../../model/Commission';
import { Taxe } from '../../../../../model/taxe';
import { User } from '../../../../../model/User';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { CommissionService } from '../../../../../services/commission.service';
import { TaxeService } from '../../../../../services/taxe.service';
import dateFormatter from 'date-format-conversion';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'ngx-ajout-categorie',
  templateUrl: './ajout-categorie.component.html',
  styleUrls: ['./ajout-categorie.component.scss']
})
export class AjoutCategorieComponent implements OnInit {
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;

  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  branche: Branche;
  taxe: Taxe;
  listBranches: any []; 
  listTaxes: any []; 
  branches: Array<Branche> = new Array<Branche>();
  taxes: Array<Taxe> = new Array<Taxe>();
  categorie :Categorie;
  
  listeNumeroCategorie: any[];
  listeCodeTaxe: any[];
  autorisation = [];
  cat_codetaxe: any;

  date_comptabilisation: Date;

  commission :Commission ;
  commissions : Array<Commission> = new Array<Commission>();
  listCommissions: any []; 

  addForm = this.fb.group({
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

  // ================ Déclarations des variables pour la recherche avec filtre ======================
  branchess: Array<Branche> = new Array<Branche>();
  //classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  /** control for the selected classification */
  public branchCtrl: FormControl = new FormControl();
  //public classifCtrl: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public branchFilterCtrl: FormControl = new FormControl();
  //public classifFilterCtrl: FormControl = new FormControl();

  /** list of classifications filtered by search keyword */
  public filteredbranch: ReplaySubject<Branche[]> = new ReplaySubject<Branche[]>();
  //public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  // ========================================== FIN Déclaration ======================================

  constructor(private fb: FormBuilder,
    private brancheService: BrancheService, private authService: NbAuthService,
    private categorieService :CategorieService,private taxeService: TaxeService,
    private commissionService : CommissionService, private toastrService: NbToastrService,
    private router: Router) { }

  
  ngOnInit(): void {

    this.authService.onTokenChange()
   .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }

   });

    this.onGetAllBranche();
    //this.onGetAllTaxe();
    this.onGetAllCommission();
    this.date_comptabilisation = dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm');
    console.log(this.date_comptabilisation);
    this.addForm.controls['categ_datecomptabilisation'].setValue(this.date_comptabilisation);
    //this.date_comptabilisation = dateFormatter(this.categorie.categ_datecomptabilisation,  'yyyy-MM-dd');
    // this.addForm.controls['categ_datecomptabilisation'].setValue(this.date_comptabilisation);

     // =================== Listen for search field value changes =======================
     this.branchFilterCtrl.valueChanges
     .pipe(takeUntil(this._onDestroy))
     .subscribe(() => {
       this.filterbranchs();
     });

   
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected filterbranchs() {
    if (!this.branchess) {
      return;
    }
    // get the search keyword
    let search = this.branchFilterCtrl.value;
    if (!search) {
      this.filteredbranch.next(this.branchess.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredbranch.next(
      this.branchess.filter(bran => bran.branche_libelleLong.toLowerCase().indexOf(search) > -1)
    );
  }

  

  // ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================

  onGetAllCommission(){
    this.commissionService.getAllCommissions()
      .subscribe((data: Commission[]) => {
        this.listCommissions = data as Commission[];
        this.commissions = data;
      });
  }
  /*
  onGetAllBranche(){
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
          this.branches = data;
          this.listBranches = data as Branche[];
      });
  }*/
   onGetAllBranche() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branchess = data as Branche[];
        this.filteredbranch.next(this.branchess.slice());
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
    this.addForm.controls['categ_datemodification'].setValue(new Date());
    this.categorieService.addCategorie(this.addForm.value)
    .subscribe((data) => {
      console.log(data);
        this.toastrService.show(
          'Categorie Enregistré avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 8000,
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
    console.log(event.value); 
    this.onGetAllTaxeByBranche(event.value);
    this.onGetAllCategorieByBranche(event.value);
    
    this.cat_codetaxe = "".toString();
    this.addForm.controls['categ_codetaxe'].setValue(this.cat_codetaxe);
    this.categorieService.lastID(event.value).subscribe((data)=>{
      if(data==0){
        this.addForm.controls['categ_numero'].setValue(event.value.toString()+"001");
      }else{
        this.addForm.controls['categ_numero'].setValue(Number(data)+1);
      }
    })
    this.addForm.controls['categ_numerobranche'].setValue(event.value);
    

  }
  onChangeTaxe(event) {
    //console.log(event);    
    this.addForm.controls['categ_codetaxe'].setValue(event);
  }
  onChangeCommission(event) {
    //console.log(event);    
    this.addForm.controls['categ_codecommission'].setValue(event);
  }
  
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  
  }
}
