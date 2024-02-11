import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { User } from '../../../../../model/User';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { ProduitService } from '../../../../../services/produit.service';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Produit } from '../../../../../model/Produit';
import { FormatNumberService } from '../../../../../services/formatNumber.service';
import { PleinsService } from '../../../../../services/pleins.service';
import { Pleins } from '../../../../../model/Pleins';

@Component({
  selector: 'ngx-update-pleins',
  templateUrl: './update-pleins.component.html',
  styleUrls: ['./update-pleins.component.scss']
})
export class UpdatePleinsComponent implements OnInit {

  updateForm = this.fb.group({

    pleins_id: ['', [Validators.required]],
    pleins_exercice: ['', [Validators.required]],
    pleins_branche: ['', [Validators.required]],
    pleins_categorie: ['', [Validators.required]],
    pleins_produit: ['', [Validators.required]],
    pleins_capacite: [''],
    pleins_opcover1: [''],
    pleins_opcover2: [''],
    pleins_datecreation: [''],
    pleins_codeutilisateur: [''],

  });

  pleins: Pleins;

  autorisation = [];

  problemeExercice: boolean = false;
  erreur: boolean;

  login_demandeur: string;
  demandeur: string;
  user: User;
  montantCapacite: any = "";

  /*
  branches: Array<Branche> = new Array<Branche>();
  categories: Array<Categorie> = new Array<Categorie>();
  produits: Array<Produit> = new Array<Produit>();

  public brancheCtrl: FormControl = new FormControl();
  public categorieCtrl: FormControl = new FormControl();
  public produitCtrl: FormControl = new FormControl();

  public brancheFilterCtrl: FormControl = new FormControl();
  public categorieFilterCtrl: FormControl = new FormControl();
  public produitFilterCtrl: FormControl = new FormControl();

  public filteredBranches: ReplaySubject<Branche[]> = new ReplaySubject<Branche[]>();
  public filteredCategories: ReplaySubject<Categorie[]> = new ReplaySubject<Categorie[]>();
  public filteredProduits: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();
  */

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  protected _onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
    private pleinsService: PleinsService,
    private transfertData: TransfertDataService,
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private router: Router,
    private userService: UserService,
    private formatNumberService: FormatNumberService) { }

  ngOnInit(): void {
    this.pleins = this.transfertData.getData();
    console.log(this.pleins);
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          this.login_demandeur = token.getPayload().sub;
          this.onGetUser(this.login_demandeur);
        }
      });

    this.updateForm.get('pleins_id').setValue(this.pleins.pleins_id);
    this.updateForm.get('pleins_exercice').setValue(this.pleins.pleins_exercice);
    this.updateForm.get('pleins_branche').setValue(this.pleins.pleins_branche);
    this.updateForm.get('pleins_categorie').setValue(this.pleins.pleins_categorie);
    this.updateForm.get('pleins_produit').setValue(this.pleins.pleins_produit);
    this.updateForm.get('pleins_capacite').setValue(this.pleins.pleins_capacite);
    this.montantCapacite = this.formatNumberService.numberWithCommas2(this.pleins.pleins_capacite);

    this.updateForm.get('pleins_opcover1').setValue(this.pleins.pleins_opcover1);
    this.updateForm.get('pleins_opcover2').setValue(this.pleins.pleins_opcover2);

    /*
  this.onGetAllBranches();
  // this.onGetAllCategorie();
  // this.onGetAllProduit();

  this.brancheFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterBranches();
    });

  this.categorieFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCategories();
    });

  this.produitFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterProduits();
    });
    */
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // ============ ON FILTER METHODE ============

  /*
  protected filterBranches() {
    if (!this.branches) {
      return;
    }
    // get the search keyword
    let search = this.brancheFilterCtrl.value;
    if (!search) {
      this.filteredBranches.next(this.branches.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBranches.next(
      this.branches.filter(br =>
        br.branche_libelleLong?.toLowerCase().indexOf(search) > -1 ||
        br.branche_numero.toString()?.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterCategories() {
    if (!this.categories) {
      return;
    }
    // get the search keyword
    let search = this.categorieFilterCtrl.value;
    if (!search) {
      this.filteredCategories.next(this.categories.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredCategories.next(
      this.categories.filter(categ =>
        categ.categ_libellelong?.toLowerCase().indexOf(search) > -1 ||
        categ.categ_numero.toString()?.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filterProduits() {
    if (!this.produits) {
      return;
    }
    // get the search keyword
    let search = this.produitFilterCtrl.value;
    if (!search) {
      this.filteredProduits.next(this.produits.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredProduits.next(
      this.produits.filter(prod =>
        prod.prod_denominationlong?.toLowerCase().indexOf(search) > -1 ||
        prod.prod_numero.toString()?.toLowerCase().indexOf(search) > -1)
    );
  }
  */

  // ===== ON GET METHODE ==========

  onGetUser(login: string) {
    this.userService.getUser(login)
      .subscribe((data: User) => {
        this.user = data;
        this.demandeur = this.user.util_prenom + " " + this.user.util_nom;
      });
  }

  /*
  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branches = data as Branche[];
        this.filteredBranches.next(this.branches.slice());
      });
  }

  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.categories = data as Categorie[];
        this.filteredCategories.next(this.categories.slice());
      });
  }

  onGetAllProduitByCategorie(categorie: number) {
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.produits = data as Produit[];
        this.filteredProduits.next(this.produits.slice());
      });
  }

  onChangeBranche(event) {

    this.onGetAllCategorieByBranche(Number(event.value));
    this.addForm.controls['pleins_branche'].setValue(Number(event.value));

    this.categorieCtrl.setValue("");
    this.produitCtrl.setValue("");
    this.addForm.controls['pleins_categorie'].setValue("");
    this.addForm.controls['pleins_produit'].setValue("");
  }

  onChangeCategorie(event) {

    this.onGetAllProduitByCategorie(Number(event.value));
    this.addForm.controls['pleins_categorie'].setValue(Number(event.value));

    this.produitCtrl.setValue("");
    this.addForm.controls['pleins_produit'].setValue("");
  }

  onChangeProduit(event) {

    this.addForm.controls['pleins_produit'].setValue(Number(event.value));
  }
  */

  onChangeFocusOutMontantCapacite(event) {
    this.montantCapacite = Number(this.formatNumberService.replaceAll(event.target.value, ' ', ''));

    this.updateForm.get('pleins_capacite').setValue(this.montantCapacite);
    this.montantCapacite = this.formatNumberService.numberWithCommas2(this.montantCapacite);

  }

  // ============ Controle de validation ===========

  /*
  onFocusOutEventExercice() {
    let exercice = this.addForm.get("pleins_exercice").value;
    if (exercice == null || exercice == 0) {
      this.problemeExercice = true;
      this.erreur = true;
    } else {
      this.problemeExercice = false;
      this.erreur = false;
    }
  }

  // ============ Get Color Methode =================
  getColorExercice() {
    if (this.problemeExercice) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  */

  onSubmit() {

    this.updateForm.get('pleins_codeutilisateur').setValue(this.user.util_numero);
    console.log(this.updateForm.value);

    this.pleinsService.updatePleins(this.updateForm.value)
      .subscribe((data: any) => {
        if (data.code === "ok") {
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

          this.router.navigateByUrl('home/parametrage/parametrage-comptable/gestion-pleins');
        } else {
          this.toastrService.show(
            data.message,
            'Notification d\'erreur',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        }
      });

  }

  onCancel() {
    this.router.navigateByUrl('home/parametrage/parametrage-comptable/gestion-pleins');
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

}
