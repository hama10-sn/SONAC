import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../../model/Branche';
import { Commission } from '../../../../../model/Commission';
import { Taxe } from '../../../../../model/taxe';
import { BrancheService } from '../../../../../services/branche.service';
import { CommissionService } from '../../../../../services/commission.service';
import { TaxeService } from '../../../../../services/taxe.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';

@Component({
  selector: 'ngx-update-branche',
  templateUrl: './update-branche.component.html',
  styleUrls: ['./update-branche.component.scss']
})
export class UpdateBrancheComponent implements OnInit {

  modifForm = this.fb.group({

    branche_numero: [''],
    branche_libelleLong: ['', [Validators.required]],
    branche_libellecourt: ['', [Validators.required]],
    branche_classeanalytique: [''],
    branche_codetaxe: ['', [Validators.required]],
    branche_codecommission: [''],
    branch_periodicite_compabilisation: [''],
  });

  branche: Branche;
  branch_periodiciteCompta: string ;

  // La gestion des clés étrangère
  listeCodeTaxe: any [] ;
  codeTaxe: String ;
  listeCodeCommission: any[] ;
  codeCommission: String ;

  autorisation = [] ;

  // variable pour le controle de validation
  problemeLibelleLong: boolean = false ;
  problemeLibelleCourt: boolean = false ;

  erreur: boolean ;

  libelleLong: string ;
  libelleCourt: string ;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
              private taxeService: TaxeService,
              private commissionService: CommissionService,
              private brancheService: BrancheService,
              private transfertDataService: TransfertDataService,
              private toastrService: NbToastrService,
              private authService: NbAuthService,
              private router: Router) { }

  ngOnInit(): void {

    this.branche = this.transfertDataService.getData() ;
    this.onGetAllCommissions() ;
    this.onGetAllTaxes() ;
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
      }
    });
    
      // Remplissage des données du formulaire de modification
      this.modifForm.controls['branche_numero'].setValue(this.branche.branche_numero) ;
      this.modifForm.controls['branche_libelleLong'].setValue(this.branche.branche_libelleLong) ;
      this.modifForm.controls['branche_libellecourt'].setValue(this.branche.branche_libellecourt) ;
      this.modifForm.controls['branche_classeanalytique'].setValue(this.branche.branche_classeanalytique) ;

      this.modifForm.controls['branche_codetaxe'].setValue(this.branche.branche_codetaxe) ;
      if(this.branche.branche_codetaxe != null){
        this.codeTaxe = this.branche.branche_codetaxe.toString() ;
      }
      

      this.modifForm.controls['branche_codecommission'].setValue(this.branche.branche_codecommission) ;
      if(this.branche.branche_codecommission != null) {
        this.codeCommission = this.branche.branche_codecommission.toString() ;
      }

      this.modifForm.controls['branch_periodicite_compabilisation'].setValue(this.branche.branch_periodicite_compabilisation) ;
      this.branch_periodiciteCompta = this.branche.branch_periodicite_compabilisation ;
  }
  
  onCancel() {
    this.router.navigateByUrl('home/parametrage-general/branches');
  }

  onSubmit() {
    this.brancheService.updateBranche(this.modifForm.value)
    .subscribe((data) => {
      this.toastrService.show(
        'Branche modifiée avec succès !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/parametrage-general/branches');
    },
    (error) => {
      this.toastrService.show(
        //"Echec de la modification de la branche",
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

  onGetAllTaxes() {
    this.taxeService.getAllTaxes()
      .subscribe((data: Taxe[]) => {
          this.listeCodeTaxe = data as Taxe[] ;
      }) ;
  }

  onGetAllCommissions() {
    this.commissionService.getAllCommissions()
      .subscribe((data: Commission[]) => {
        this.listeCodeCommission = data as Commission[] ;
      });
  }

  onChange(event) {
    this.modifForm.controls['branch_periodicite_compabilisation'].setValue(event) ;
  }

  onChangeTaxe(event) {    
    this.modifForm.controls['branche_codetaxe'].setValue(event);  
  }

  onChangeCommission(event) {
    this.modifForm.controls['branche_codecommission'].setValue(event) ;
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }

  // controle de validation
  onFocusOutEventLibelleLong(){
    this.libelleLong = this.modifForm.get("branche_libelleLong").value;
    if (this.libelleLong == null || this.libelleLong == "") {
      this.problemeLibelleLong = true;
      this.erreur = true ;
    } else {
      this.problemeLibelleLong = false;
      this.erreur = false;
    }
  }

  onFocusOutEventLibelleCourt(){
    this.libelleCourt = this.modifForm.get("branche_libellecourt").value;
    if (this.libelleCourt == null || this.libelleCourt == "") {
      this.problemeLibelleCourt = true;
      this.erreur = true ;
    } else {
      this.problemeLibelleCourt = false;
      this.erreur = false;
    }
  }

  getColorLibelleLong() {
    if (this.problemeLibelleLong) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorLibelleCourt() {
    if (this.problemeLibelleCourt) {
      return '1px solid red';
    } else {
      return '';
    }
  }
}
