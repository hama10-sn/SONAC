import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Taxe } from '../../../../../model/taxe';
import { User } from '../../../../../model/User';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { ProduitService } from '../../../../../services/produit.service';
import { TaxeService } from '../../../../../services/taxe.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'ngx-add-produit',
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.scss']
})
export class AddProduitComponent implements OnInit {

  addForm = this.fb.group({

    prod_numero: ['', [Validators.required]],
    prod_numerobranche: ['', [Validators.required]],
    prod_numerocategorie: ['', [Validators.required]],
    prod_denominationlong: ['', [Validators.required]],
    prod_denominationcourt: ['', [Validators.required]],
    prod_numerogarantieassoc1: ['', [Validators.required]],
    prod_numerogarantieassoc2: ['', [Validators.required]],
    prod_numerogarantieassoc3: ['', [Validators.required]],
    prod_numerogarantieassoc4: ['', [Validators.required]],
    prod_numerogarantieassoc5: ['', [Validators.required]],
    prod_numerogarantieassoc6: ['', [Validators.required]],
    prod_numerogarantieassoc7: ['', [Validators.required]],
    prod_numerogarantieassoc8: ['', [Validators.required]],
    prod_numerogarantieassoc9: ['', [Validators.required]],
    prod_numerogarantieassoc10: ['', [Validators.required]],
    prod_numeroextension1: [''],
    prod_numeroextension2: [''],
    prod_numeroextension3: [''],
    prod_codetaxe: [''],
    prod_remisecommerciale: [''],
    prod_remiseexceptionnelle: [''],
    prod_codeutilisateur: [''],
  });

  // Pour la gestion de la liste déroulante pour les clés étrangères
  listeCodeBranche: any[];
  listeNumeroCategorie: any[];
  listeCodeTaxe: any[];

  login: any;
  user: User;

  remiseCommerciale: number;
  remiseExceptionnelle: number;

  problemeRemiseCommerciale: boolean;
  problemeRemiseExceptionnelle: boolean;
  erreur: boolean;

  // Vider le champs catgorie quand on change Branche:
  prod_categorie: any;
  prod_codetaxe: any;

  autorisation = [];

  // variable pour le controle de validation
  problemeDenominationLong: boolean = false ;
  problemeDenominationCourt: boolean = false ;
  problemeNumGarantie1: boolean = false ;
  problemeNumGarantie2: boolean = false ;
  problemeNumGarantie3: boolean = false ;
  problemeNumGarantie4: boolean = false ;
  problemeNumGarantie5: boolean = false ;
  problemeNumGarantie6: boolean = false ;
  problemeNumGarantie7: boolean = false ;
  problemeNumGarantie8: boolean = false ;
  problemeNumGarantie9: boolean = false ;
  problemeNumGarantie10: boolean = false ;

  denominationLong: string ;
  denominationCourt: string ;
  numGarantie1: number ;
  numGarantie2: number ;
  numGarantie3: number ;
  numGarantie4: number ;
  numGarantie5: number ;
  numGarantie6: number ;
  numGarantie7: number ;
  numGarantie8: number ;
  numGarantie9: number ;
  numGarantie10: number ;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private taxeService: TaxeService,
    private userService: UserService,
    private authService: NbAuthService,
    private produitService: ProduitService,
    private toastrService: NbToastrService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.onGetAllBranches();
    this.getlogin();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });

    // Initialisé tous les numéros garanties associés
    this.addForm.controls['prod_numerogarantieassoc1'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc2'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc3'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc4'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc5'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc6'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc7'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc8'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc9'].setValue(9999);
    this.addForm.controls['prod_numerogarantieassoc10'].setValue(9999);

    // gestion des controles sur les remises
    this.addForm.controls['prod_remisecommerciale'].setValue(null);
    this.addForm.controls['prod_remiseexceptionnelle'].setValue(null);
  }

  onCancel() {
    this.router.navigateByUrl('home/parametrage-general/produits');
  }

  onSubmit() {

    this.remiseCommerciale = this.addForm.get("prod_remisecommerciale").value;
    this.remiseExceptionnelle = this.addForm.get("prod_remiseexceptionnelle").value;

    if (this.remiseCommerciale !== null && this.remiseCommerciale > 100) {
      this.problemeRemiseCommerciale = true;
      this.erreur = true;
    } else if (this.remiseExceptionnelle !== null && this.remiseExceptionnelle > 100) {
      this.problemeRemiseExceptionnelle = true;
      this.erreur = true;
    } else {
      this.addForm.controls['prod_codeutilisateur'].setValue(this.user.util_numero);
      this.produitService.addProduit(this.addForm.value)
        .subscribe((data) => {
          this.toastrService.show(
            'produit enregistré avec succès !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          this.router.navigateByUrl('home/parametrage-general/produits');
        },
          (error) => {
            this.toastrService.show(
              //"Echec de l'ajout du produit",
              error.error.message,
              'Erreur de Notification',
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

  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.listeCodeBranche = data as Branche[];
      });
  }

  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[];
      });
  }

  // Filtrer les taxes selon la branche choisie
  onGetAllTaxeByBranche(branche: number) {
    this.taxeService.getAllTaxeByBranche(branche)
      .subscribe((data: Taxe[]) => {
        this.listeCodeTaxe = data as Taxe[];
      });
  }

  onChangeBranche(event) {
    this.onGetAllCategorieByBranche(event);
    this.onGetAllTaxeByBranche(event);
    this.addForm.controls['prod_numerobranche'].setValue(event);

    this.prod_categorie = "".toString();
    this.addForm.controls['prod_numerocategorie'].setValue(this.prod_categorie);
    this.prod_codetaxe = "".toString();
    this.addForm.controls['prod_codetaxe'].setValue(this.prod_codetaxe);
  }

  onChangeCategorie(event) {
    this.produitService.lastID(event).subscribe((data) => {
      if (data == 0) {
        this.addForm.controls['prod_numero'].setValue(event.toString() + "001");
      } else {
        this.addForm.controls['prod_numero'].setValue(Number(data) + 1);
      }
    })
    this.addForm.controls['prod_numerocategorie'].setValue(event);
  }

  onChangeTaxe(event) {
    this.addForm.controls['prod_codetaxe'].setValue(event);
  }

  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {
              this.user = data;
            });
        }
      });
  }

  onFocusOutEventRemiseCommerciale(event: any) {
    this.remiseCommerciale = this.addForm.get("prod_remisecommerciale").value;
    if (this.remiseCommerciale !== null && (this.remiseCommerciale < 0 || this.remiseCommerciale > 100)) {
      this.problemeRemiseCommerciale = true;
      this.erreur = true;
    } else {
      this.problemeRemiseCommerciale = false;
      this.erreur = false;
    }
  }

  onFocusOutEventRemiseExceptionnelle(event: any) {
    this.remiseExceptionnelle = this.addForm.get("prod_remiseexceptionnelle").value;
    if (this.remiseExceptionnelle !== null && (this.remiseExceptionnelle < 0 || this.remiseExceptionnelle > 100)) {
      this.problemeRemiseExceptionnelle = true;
      this.erreur = true;
    } else {
      this.problemeRemiseExceptionnelle = false;
      this.erreur = false;
    }
  }

  // controle de validation
  onFocusOutEventDenominationLong(){
    this.denominationLong = this.addForm.get("prod_denominationlong").value;
    if (this.denominationLong == null || this.denominationLong == "") {
      this.problemeDenominationLong = true;
      this.erreur = true ;
    } else {
      this.problemeDenominationLong = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDenominationCourt(){
    this.denominationCourt = this.addForm.get("prod_denominationcourt").value;
    if (this.denominationCourt == null || this.denominationCourt == "") {
      this.problemeDenominationCourt = true;
      this.erreur = true ;
    } else {
      this.problemeDenominationCourt = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie1(){
    this.numGarantie1 = this.addForm.get("prod_numerogarantieassoc1").value;
    if (this.numGarantie1 == null || this.numGarantie1 == 0) {
      this.problemeNumGarantie1 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie1 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie2(){
    this.numGarantie2 = this.addForm.get("prod_numerogarantieassoc2").value;
    if (this.numGarantie2 == null || this.numGarantie2 == 0) {
      this.problemeNumGarantie2 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie2 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie3(){
    this.numGarantie3 = this.addForm.get("prod_numerogarantieassoc3").value;
    if (this.numGarantie3 == null || this.numGarantie3 == 0) {
      this.problemeNumGarantie3 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie3 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie4(){
    this.numGarantie4 = this.addForm.get("prod_numerogarantieassoc4").value;
    if (this.numGarantie4 == null || this.numGarantie4 == 0) {
      this.problemeNumGarantie4 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie4 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie5(){
    this.numGarantie5 = this.addForm.get("prod_numerogarantieassoc5").value;
    if (this.numGarantie5 == null || this.numGarantie5 == 0) {
      this.problemeNumGarantie5 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie5 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie6(){
    this.numGarantie6 = this.addForm.get("prod_numerogarantieassoc6").value;
    if (this.numGarantie6 == null || this.numGarantie6 == 0) {
      this.problemeNumGarantie6 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie6 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie7(){
    this.numGarantie7 = this.addForm.get("prod_numerogarantieassoc7").value;
    if (this.numGarantie7 == null || this.numGarantie7 == 0) {
      this.problemeNumGarantie7 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie7 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie8(){
    this.numGarantie8 = this.addForm.get("prod_numerogarantieassoc8").value;
    if (this.numGarantie8 == null || this.numGarantie8 == 0) {
      this.problemeNumGarantie8 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie8 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie9(){
    this.numGarantie9 = this.addForm.get("prod_numerogarantieassoc9").value;
    if (this.numGarantie9 == null || this.numGarantie9 == 0) {
      this.problemeNumGarantie9 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie9 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie10(){
    this.numGarantie10 = this.addForm.get("prod_numerogarantieassoc10").value;
    if (this.numGarantie10 == null || this.numGarantie10 == 0) {
      this.problemeNumGarantie10 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie10 = false;
      this.erreur = false;
    }
  }

  getColorRemiseCommerciale() {
    if (this.problemeRemiseCommerciale) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorRemiseExceptionnelle() {
    if (this.problemeRemiseExceptionnelle) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorDenominationLong() {
    if (this.problemeDenominationLong) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorDenominationCourt() {
    if (this.problemeDenominationCourt) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie1() {
    if (this.problemeNumGarantie1) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie2() {
    if (this.problemeNumGarantie2) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie3() {
    if (this.problemeNumGarantie3) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie4() {
    if (this.problemeNumGarantie4) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie5() {
    if (this.problemeNumGarantie5) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie6() {
    if (this.problemeNumGarantie6) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie7() {
    if (this.problemeNumGarantie7) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie8() {
    if (this.problemeNumGarantie8) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie9() {
    if (this.problemeNumGarantie9) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorNumGarantie10() {
    if (this.problemeNumGarantie10) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }
}
