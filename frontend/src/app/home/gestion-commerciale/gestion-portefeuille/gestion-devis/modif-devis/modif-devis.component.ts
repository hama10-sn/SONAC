import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Devis } from '../../../../../model/Devis';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { DevisService } from '../../../../../services/devis.service';
import { TransfertDataService } from '../../../../../services/transfertData.service';

@Component({
  selector: 'ngx-modif-devis',
  templateUrl: './modif-devis.component.html',
  styleUrls: ['./modif-devis.component.scss']
})
export class ModifDevisComponent implements OnInit {

  modifForm = this.fb.group({
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
    devis: Devis;
    categorieSelected: string;
    brancheSelected: string;
    statusSelected: string;

  
    position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
    statusSuccess: NbComponentStatus = 'success';
    statusFail: NbComponentStatus = 'danger';
  
    constructor(private fb: FormBuilder,private devisService: DevisService,
      private toastrService: NbToastrService,private router: Router,private brancheService: BrancheService,
      private categorieService: CategorieService,private transfertData: TransfertDataService) { }
  
    ngOnInit(): void {
      this.onGetAllBranches() ;
      this.devis = this.transfertData.getData();
      

    this.modifForm.controls['devis_numero'].setValue(this.devis.devis_numero);
    this.modifForm.controls['devis_date'].setValue(this.devis.devis_date);
    this.modifForm.controls['devis_numeroproposition'].setValue(this.devis.devis_numeroproposition);
    this.modifForm.controls['devis_objet'].setValue(this.devis.devis_objet);
    this.modifForm.controls['devis_montantnet'].setValue(this.devis.devis_montantnet);
    this.modifForm.controls['devis_accessoirecompagnie'].setValue(this.devis.devis_accessoirecompagnie);
    this.modifForm.controls['devis_accessoireapporteur'].setValue(this.devis.devis_accessoireapporteur);
    this.modifForm.controls['devis_montantfrais'].setValue(this.devis.devis_montantfrais);
    this.modifForm.controls['devis_montanttaxe'].setValue(this.devis.devis_montanttaxe);
    this.modifForm.controls['devis_montantttc'].setValue(this.devis.devis_montantttc);
    this.modifForm.controls['devis_status'].setValue(this.devis.devis_status);
    this.modifForm.controls['devis_souscripteur'].setValue(this.devis.devis_souscripteur);
    this.modifForm.controls['devis_branche'].setValue(this.devis.devis_branche);
    this.modifForm.controls['devis_categorie'].setValue(this.devis.devis_categorie);
    
    this.brancheSelected = this.devis.devis_branche.toString();
    this.onGetAllCategorieByBranche(Number(this.brancheSelected));
    this.categorieSelected = this.devis.devis_categorie.toString();
    this.statusSelected = this.devis.devis_status.toString();
    console.log(this.brancheSelected);

    }
  
    onChangeBranche(event) {
      this.onGetAllCategorieByBranche(event) ;
      this.modifForm.controls['devis_branche'].setValue(event);
      this.nettoyageC = ' ';
    }
  
    onChangeCategorie(event) {
      this.modifForm.controls['devis_categorie'].setValue(event) ;
    }
  
    onChangeStatus(event) {
      this.modifForm.controls['devis_status'].setValue(event) ;
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
      this.modifForm.controls['devis_datemodification'].setValue(new Date()) ;
  
      this.devisService.modifDevis(this.modifForm.value)
      .subscribe(() => {
        this.toastrService.show(
          'Devis modifié avec succes !',
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
