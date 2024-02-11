import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { DevisService } from '../../../../../services/devis.service';

@Component({
  selector: 'ngx-ajout-devis',
  templateUrl: './ajout-devis.component.html',
  styleUrls: ['./ajout-devis.component.scss']
})
export class AjoutDevisComponent implements OnInit {

  addForm = this.fb.group({
  devis_numero:['',Validators.required],
	devis_date: [''],
	devis_numeroproposition:[''],
	devis_souscripteur:['',Validators.required],
	devis_objet: [''],
	devis_montantnet:['',Validators.required],
	devis_accessoirecompagnie:['',Validators.required],
	devis_accessoireapporteur:['',Validators.required],
	devis_montantfrais:[''],
	devis_montanttaxe:['',Validators.required],
	devis_montantttc:['',Validators.required],
	devis_branche:['',Validators.required],
	devis_categorie:['',Validators.required],
	devis_codeutilisateur:[''],
	devis_datemodification: [''],
	devis_status:['',Validators.required],
   
  });

  listeCodeBranche: any [] ;
  listeNumeroCategorie: any [] ;

  nettoyageC: string ='';

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,private devisService: DevisService,
    private toastrService: NbToastrService,private router: Router,private brancheService: BrancheService,
    private categorieService: CategorieService) { }

  ngOnInit(): void {
    this.onGetAllBranches() ;
  }

  onChangeBranche(event) {
    this.onGetAllCategorieByBranche(event) ;
    this.addForm.controls['devis_branche'].setValue(event);
    this.nettoyageC = ' ';
  }

  onChangeCategorie(event) {
    this.addForm.controls['devis_categorie'].setValue(event) ;
  }

  onChangeStatus(event) {
    this.addForm.controls['devis_status'].setValue(event) ;
  }

  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
          this.listeCodeBranche = data as Branche[] ;
      }) ;
  }

 

  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[] ;
      }) ;
  }

  cancel () {
    this.router.navigateByUrl('home/devis');
  }

  submit () {
    this.addForm.controls['devis_date'].setValue(new Date()) ;

    this.devisService.addDevis(this.addForm.value)
    .subscribe(() => {
      this.toastrService.show(
        'Devis Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/devis');
    },
    (error) => {
      this.toastrService.show(
        'une erreur est survenue',
        'Notification',
        {
          status: this.statusFail,
          destroyByClick: true,
          duration: 2000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        
    },
    );

  


  }

}
