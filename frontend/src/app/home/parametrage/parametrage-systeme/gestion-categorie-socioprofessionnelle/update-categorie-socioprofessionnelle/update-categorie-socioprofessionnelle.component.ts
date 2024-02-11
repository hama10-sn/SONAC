import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelle } from '../../../../../model/CategorieSocioprofessionnelle';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';

@Component({
  selector: 'ngx-update-categorie-socioprofessionnelle',
  templateUrl: './update-categorie-socioprofessionnelle.component.html',
  styleUrls: ['./update-categorie-socioprofessionnelle.component.scss']
})
export class UpdateCategorieSocioprofessionnelleComponent implements OnInit {


  modifForm = this.fb.group({

    categs_code: [''],
    //categs_scode: ['', [Validators.required]],
    categs_liblong: ['', [Validators.required]],
    categs_libcourt: ['', [Validators.required]],
  });

  categorieSocioPro: CategorieSocioprofessionnelle ;

  autorisation = [] ;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private categorieSocioProService: CategorieSocioprofessionnelleService,
              private fb: FormBuilder,
              private router: Router,
              private toastrService: NbToastrService,
              private authService: NbAuthService,
              private transfertData: TransfertDataService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
      }
    });
      // Remplissage des données du formulaire de modification
      this.categorieSocioPro = this.transfertData.getData() ;

      this.modifForm.controls['categs_code'].setValue(this.categorieSocioPro.categs_code) ;
      //this.modifForm.controls['categs_scode'].setValue(this.categorieSocioPro.categs_scode) ;
      this.modifForm.controls['categs_liblong'].setValue(this.categorieSocioPro.categs_liblong) ;
      this.modifForm.controls['categs_libcourt'].setValue(this.categorieSocioPro.categs_libcourt) ;
  }
  
  onCancel() {
    this.router.navigateByUrl('home/parametrage-systeme/categorie-socioprofessionnelle');
  }

  onSubmit() {
    this.categorieSocioProService.updateCategorieSocioprofessionnelle(this.modifForm.value)
    .subscribe((data) => {
      this.toastrService.show(
        'Catégorie socioprofessionnelle modifiée avec succès !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/parametrage-systeme/categorie-socioprofessionnelle');
    },
    (error) => {
      this.toastrService.show(
        //"Echec de la modification de la catégorie socioprofessionnelle",
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

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;
  }
}
