import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CategorieSocioprofessionnelleService } from '../../../../../services/categorieSocioProfessionnelle.service';

@Component({
  selector: 'ngx-add-categorie-socioprofessionnelle',
  templateUrl: './add-categorie-socioprofessionnelle.component.html',
  styleUrls: ['./add-categorie-socioprofessionnelle.component.scss']
})
export class AddCategorieSocioprofessionnelleComponent implements OnInit {

  addForm = this.fb.group({
    
    categs_code: ['', [Validators.required]],
    //categs_scode: ['', [Validators.required]],
    categs_liblong: ['', [Validators.required]],
    categs_libcourt: ['', [Validators.required]],
  });

  autorisation = [] ;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder, private router: Router,
              private categoriesocioproService: CategorieSocioprofessionnelleService,
              private authService: NbAuthService,
              private toastrService: NbToastrService) { }

  ngOnInit(): void {

    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
      }
    });

  }

  onCancel() {
      this.router.navigateByUrl('home/parametrage-systeme/categorie-socioprofessionnelle');
  }

  onSubmit() {
    this.categoriesocioproService.addCategorieSocioProfessionnelle(this.addForm.value)
    .subscribe((data) => {
      this.toastrService.show(
        'Catégorie socioprofessionnelle enregistrée avec succès !',
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
        //"Echec de l'ajout d'une catégorie socioprofessionnelle",
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
