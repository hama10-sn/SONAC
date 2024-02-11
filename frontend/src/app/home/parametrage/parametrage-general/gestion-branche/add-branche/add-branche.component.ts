import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Commission } from '../../../../../model/Commission';
import { Taxe } from '../../../../../model/taxe';
import { BrancheService } from '../../../../../services/branche.service';
import { CommissionService } from '../../../../../services/commission.service';
import { TaxeService } from '../../../../../services/taxe.service';

@Component({
  selector: 'ngx-add-branche',
  templateUrl: './add-branche.component.html',
  styleUrls: ['./add-branche.component.scss']
})
export class AddBrancheComponent implements OnInit {

  addForm = this.fb.group({

    branche_numero: ['', [Validators.required]],
    branche_libelleLong: ['', [Validators.required]],
    branche_libellecourt: ['', [Validators.required]],
    branche_classeanalytique: [''],
    branche_codetaxe: ['', [Validators.required]],
    branche_codecommission: [''],
    branch_periodicite_compabilisation: [''],
  });

  // Pour gérer la liste déroulante pour les clés étrangères
  listeCodeTaxe: any[];
  listeCodeCommission: any[];

  autorisation = [];

  // variable pour le controle de validation
  problemeLibelleLong: boolean = false;
  problemeLibelleCourt: boolean = false;
  problemeNumeroBranche: boolean = false;

  erreur: boolean;

  libelleLong: string;
  libelleCourt: string;
  numeroBranche: number ;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private taxeService: TaxeService,
    private commissionService: CommissionService,
    private brancheService: BrancheService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.onGetAllTaxes();
    this.onGetAllCommissions();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });
  }

  onCancel() {
    this.router.navigateByUrl('home/parametrage-general/branches');
  }

  onSubmit() {
    this.brancheService.addBranche(this.addForm.value)
      .subscribe((data) => {
        this.toastrService.show(
          'branche enregistrée avec succès !',
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
            //"Echec de l'ajout d'une branche",
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
        this.listeCodeTaxe = data as Taxe[];
      });
  }

  onGetAllCommissions() {
    this.commissionService.getAllCommissions()
      .subscribe((data: Commission[]) => {
        this.listeCodeCommission = data as Commission[];
      });
  }

  onChange(event) {
    this.addForm.controls['branch_periodicite_compabilisation'].setValue(event);
  }

  onChangeTaxe(event) {
    this.addForm.controls['branche_codetaxe'].setValue(event);
  }

  onChangeCommission(event) {
    this.addForm.controls['branche_codecommission'].setValue(event);
  }

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;
  }

  // controle de validation
  onFocusOutEventNumBranche() {
    this.numeroBranche = this.addForm.get("branche_numero").value;
    if (this.numeroBranche == null || this.numeroBranche == 0) {
      this.problemeNumeroBranche = true;
      this.erreur = true;
    } else {
      this.problemeNumeroBranche = false;
      this.erreur = false;
    }
  }

  onFocusOutEventLibelleLong() {
    this.libelleLong = this.addForm.get("branche_libelleLong").value;
    if (this.libelleLong == null || this.libelleLong == "") {
      this.problemeLibelleLong = true;
      this.erreur = true;
    } else {
      this.problemeLibelleLong = false;
      this.erreur = false;
    }
  }

  onFocusOutEventLibelleCourt() {
    this.libelleCourt = this.addForm.get("branche_libellecourt").value;
    if (this.libelleCourt == null || this.libelleCourt == "") {
      this.problemeLibelleCourt = true;
      this.erreur = true;
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

  getColorNumeroBranche() {
    if (this.problemeNumeroBranche) {
      return '1px solid red';
    } else {
      return '';
    }
  }
}
