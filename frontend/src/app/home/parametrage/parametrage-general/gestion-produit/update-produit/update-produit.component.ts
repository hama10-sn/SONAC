import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Produit } from '../../../../../model/Produit';
import { Taxe } from '../../../../../model/taxe';
import { User } from '../../../../../model/User';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { ProduitService } from '../../../../../services/produit.service';
import { TaxeService } from '../../../../../services/taxe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'ngx-update-produit',
  templateUrl: './update-produit.component.html',
  styleUrls: ['./update-produit.component.scss']
})
export class UpdateProduitComponent implements OnInit {

  modifForm = this.fb.group({

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

  produit: Produit;



  // La gestion des clés étrangères
  branches: Array<Branche> = new Array<Branche>();
  codeBranche: any;
  //listeCodeCategorie: any [] ;
  categories: Array<Categorie> = new Array<Categorie>();
  numeroCategorie: any;
  listeCodeTaxe: any[];
  codeTaxe: String
  listeCodeUser: any[];
  codeUser: String;

  remiseCommerciale: number;
  remiseExceptionnelle: number;

  problemeRemiseCommerciale: boolean;
  problemeRemiseExceptionnelle: boolean;
  erreur: boolean;

  autorisation = [] ;

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
    private produitService: ProduitService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private router: Router,
    private transfertDataService: TransfertDataService) { }

  ngOnInit(): void {
    this.produit = this.transfertDataService.getData();

    this.onGetAllBranches();
    this.onGetAllCategorie();
    this.onGetAllTaxe();
    this.onGetAllUser();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });

    this.modifForm.controls['prod_numero'].setValue(this.produit.prod_numero);

    this.modifForm.controls['prod_numerobranche'].setValue(this.produit.prod_numerobranche);
    this.codeBranche = this.produit.prod_numerobranche;

    this.modifForm.controls['prod_numerocategorie'].setValue(this.produit.prod_numerocategorie);
    this.numeroCategorie = this.produit.prod_numerocategorie;

    this.modifForm.controls['prod_denominationlong'].setValue(this.produit.prod_denominationlong);
    this.modifForm.controls['prod_denominationcourt'].setValue(this.produit.prod_denominationcourt);
    this.modifForm.controls['prod_numerogarantieassoc1'].setValue(this.produit.prod_numerogarantieassoc1);
    this.modifForm.controls['prod_numerogarantieassoc2'].setValue(this.produit.prod_numerogarantieassoc2);
    this.modifForm.controls['prod_numerogarantieassoc3'].setValue(this.produit.prod_numerogarantieassoc3);
    this.modifForm.controls['prod_numerogarantieassoc4'].setValue(this.produit.prod_numerogarantieassoc4);
    this.modifForm.controls['prod_numerogarantieassoc5'].setValue(this.produit.prod_numerogarantieassoc5);
    this.modifForm.controls['prod_numerogarantieassoc6'].setValue(this.produit.prod_numerogarantieassoc6);
    this.modifForm.controls['prod_numerogarantieassoc7'].setValue(this.produit.prod_numerogarantieassoc7);
    this.modifForm.controls['prod_numerogarantieassoc8'].setValue(this.produit.prod_numerogarantieassoc8);
    this.modifForm.controls['prod_numerogarantieassoc9'].setValue(this.produit.prod_numerogarantieassoc9);
    this.modifForm.controls['prod_numerogarantieassoc10'].setValue(this.produit.prod_numerogarantieassoc10);
    this.modifForm.controls['prod_numeroextension1'].setValue(this.produit.prod_numeroextension1);
    this.modifForm.controls['prod_numeroextension2'].setValue(this.produit.prod_numeroextension2);
    this.modifForm.controls['prod_numeroextension3'].setValue(this.produit.prod_numeroextension3);

    this.modifForm.controls['prod_codetaxe'].setValue(this.produit.prod_codetaxe);
    if (this.produit.prod_codetaxe != null) {
      this.codeTaxe = this.produit.prod_codetaxe.toString();
    }

    this.modifForm.controls['prod_remisecommerciale'].setValue(this.produit.prod_remisecommerciale);
    this.modifForm.controls['prod_remiseexceptionnelle'].setValue(this.produit.prod_remiseexceptionnelle);

    this.modifForm.controls['prod_codeutilisateur'].setValue(this.produit.prod_codeutilisateur);
    if (this.produit.prod_codeutilisateur != null) {
      this.codeUser = this.produit.prod_codeutilisateur.toString();
    }

  }

  onCancel() {
    this.router.navigateByUrl('home/parametrage-general/produits');
  }

  onSubmit() {

    this.remiseCommerciale = this.modifForm.get("prod_remisecommerciale").value;
    this.remiseExceptionnelle = this.modifForm.get("prod_remiseexceptionnelle").value;

    if (this.remiseCommerciale !== null && this.remiseCommerciale > 100) {
      this.problemeRemiseCommerciale = true;
      this.erreur = true;
    } else if (this.remiseExceptionnelle !== null && this.remiseExceptionnelle > 100) {
      this.problemeRemiseExceptionnelle = true;
      this.erreur = true;
    } else {
      this.produitService.updateProduit(this.modifForm.value)
        .subscribe((data) => {
          this.toastrService.show(
            'produit modifié avec succès !',
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
              //"Echec de la modification du produit",
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
        this.branches = data as Branche[];
      });
  }

  onGetAllCategorie() {
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
        this.categories = data as Categorie[];
      });
  }

  onGetAllTaxe() {
    this.taxeService.getAllTaxes()
      .subscribe((data: Taxe[]) => {
        this.listeCodeTaxe = data as Taxe[];
      });
  }

  onGetAllUser() {
    this.userService.getAllUsers()
      .subscribe((data: User[]) => {
        this.listeCodeUser = data as User[];
      });
  }

  onGetLibelleByBranche(numero: any) {
    console.log("==Liste code branche: "+ this.branches) ;
    return numero + " : " + (this.branches?.find(b => b.branche_numero === numero))?.branche_libelleLong;
  }

  onGetLibelleByCategorie(numero: any) {
    return numero + " : " + (this.categories?.find(c => c.categ_numero === numero))?.categ_libellelong;
  }

  onChangeBranche(event) {
    this.modifForm.controls['prod_numerobranche'].setValue(event);
  }

  onChangeCategorie(event) {
    this.modifForm.controls['prod_numerocategorie'].setValue(event);
  }

  onChangeTaxe(event) {
    this.modifForm.controls['prod_codetaxe'].setValue(event);
  }

  onChangeUser(event) {
    this.modifForm.controls['prod_codeutilisateur'].setValue(event);
  }

  onFocusOutEventRemiseCommerciale(event: any) {
    this.remiseCommerciale = this.modifForm.get("prod_remisecommerciale").value;
    if (this.remiseCommerciale !== null && (this.remiseCommerciale < 0 || this.remiseCommerciale > 100)) {
      this.problemeRemiseCommerciale = true;
      this.erreur = true;
    } else {
      this.problemeRemiseCommerciale = false;
      this.erreur = false;
    }
  }

  onFocusOutEventRemiseExceptionnelle(event: any) {
    this.remiseExceptionnelle = this.modifForm.get("prod_remiseexceptionnelle").value;
    if (this.remiseExceptionnelle !== null && (this.remiseExceptionnelle < 0 || this.remiseExceptionnelle > 100)) {
      this.problemeRemiseExceptionnelle = true;
      this.erreur = true;
    } else {
      this.problemeRemiseExceptionnelle = false;
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

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }

  // controle de validation
  onFocusOutEventDenominationLong(){
    this.denominationLong = this.modifForm.get("prod_denominationlong").value;
    if (this.denominationLong == null || this.denominationLong == "") {
      this.problemeDenominationLong = true;
      this.erreur = true ;
    } else {
      this.problemeDenominationLong = false;
      this.erreur = false;
    }
  }

  onFocusOutEventDenominationCourt(){
    this.denominationCourt = this.modifForm.get("prod_denominationcourt").value;
    if (this.denominationCourt == null || this.denominationCourt == "") {
      this.problemeDenominationCourt = true;
      this.erreur = true ;
    } else {
      this.problemeDenominationCourt = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie1(){
    this.numGarantie1 = this.modifForm.get("prod_numerogarantieassoc1").value;
    if (this.numGarantie1 == null || this.numGarantie1 == 0) {
      this.problemeNumGarantie1 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie1 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie2(){
    this.numGarantie2 = this.modifForm.get("prod_numerogarantieassoc2").value;
    if (this.numGarantie2 == null || this.numGarantie2 == 0) {
      this.problemeNumGarantie2 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie2 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie3(){
    this.numGarantie3 = this.modifForm.get("prod_numerogarantieassoc3").value;
    if (this.numGarantie3 == null || this.numGarantie3 == 0) {
      this.problemeNumGarantie3 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie3 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie4(){
    this.numGarantie4 = this.modifForm.get("prod_numerogarantieassoc4").value;
    if (this.numGarantie4 == null || this.numGarantie4 == 0) {
      this.problemeNumGarantie4 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie4 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie5(){
    this.numGarantie5 = this.modifForm.get("prod_numerogarantieassoc5").value;
    if (this.numGarantie5 == null || this.numGarantie5 == 0) {
      this.problemeNumGarantie5 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie5 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie6(){
    this.numGarantie6 = this.modifForm.get("prod_numerogarantieassoc6").value;
    if (this.numGarantie6 == null || this.numGarantie6 == 0) {
      this.problemeNumGarantie6 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie6 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie7(){
    this.numGarantie7 = this.modifForm.get("prod_numerogarantieassoc7").value;
    if (this.numGarantie7 == null || this.numGarantie7 == 0) {
      this.problemeNumGarantie7 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie7 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie8(){
    this.numGarantie8 = this.modifForm.get("prod_numerogarantieassoc8").value;
    if (this.numGarantie8 == null || this.numGarantie8 == 0) {
      this.problemeNumGarantie8 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie8 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie9(){
    this.numGarantie9 = this.modifForm.get("prod_numerogarantieassoc9").value;
    if (this.numGarantie9 == null || this.numGarantie9 == 0) {
      this.problemeNumGarantie9 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie9 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventNumGarantie10(){
    this.numGarantie10 = this.modifForm.get("prod_numerogarantieassoc10").value;
    if (this.numGarantie10 == null || this.numGarantie10 == 0) {
      this.problemeNumGarantie10 = true;
      this.erreur = true ;
    } else {
      this.problemeNumGarantie10 = false;
      this.erreur = false;
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
}
