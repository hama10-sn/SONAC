import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { Produit } from '../../../../../model/Produit';
import { AccessoireService } from '../../../../../services/accessoire.service';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { ProduitService } from '../../../../../services/produit.service';
import dateFormatter from 'date-format-conversion';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { FormatNumberService } from '../../../../../services/formatNumber.service';

@Component({
  selector: 'ngx-add-accessoire',
  templateUrl: './add-accessoire.component.html',
  styleUrls: ['./add-accessoire.component.scss']
})
export class AddAccessoireComponent implements OnInit {

  addForm = this.fb.group({

    acces_code: ['', [Validators.required]],
    acces_codeapporteur: ['', [Validators.required]],
    acces_codebranche: ['', [Validators.required]],
    acces_codecategorie: ['', [Validators.required]],
    acces_codeproduit: ['', [Validators.required]],
    acces_codegarantie: [''],
    acces_interv1: ['', [Validators.required]],
    acces_interv2: ['', [Validators.required]],
    acces_compagnie1: ['', [Validators.required]],
    acces_apporteur1: [''],
    acces_interv3: [''],
    acces_interv4: [''],
    acces_compagnie2: [''],
    acces_apporteur2: [''],
    acces_interv5: [''],
    acces_interv6: [''],
    acces_compagnie3: [''],
    acces_apporteur3: [''],
    acces_interv7: [''],
    acces_interv8: [''],
    acces_compagnie4: [''],
    acces_apporteur4: [''],
    acces_interv9: [''],
    acces_interv10: [''],
    acces_compagnie5: [''],
    acces_apporteur5: [''],
    acces_interv11: [''],
    acces_interv12: [''],
    acces_compagnie6: [''],
    acces_apporteur6: [''],
    acces_interv13: [''],
    acces_interv14: [''],
    acces_compagnie7: [''],
    acces_apporteur7: [''],
    acces_datepriseffet: ['', [Validators.required]],
    acces_datefineffet: [''],
  });

  // Pour gérer les listes déroulante des clés étrangères
  listeCodeBranche: any[];
  listeNumeroCategorie: any[];
  listeCodeProduit: any[];
  listeNumeroIntermediaire: any[];

  codeProduitChoisi: number;
  codeApporteurChoisi: number;
  numConcat: number;

  // Variables booléan pour gerer le problème de controle de saisi
  problemeInterv1: boolean = false;
  problemeInterv2: boolean = false;
  problemeInterv3: boolean = false;
  problemeInterv5: boolean = false;
  problemeInterv7: boolean = false;
  problemeInterv9: boolean = false;
  problemeInterv11: boolean = false;
  problemeInterv13: boolean = false;

  erreur: boolean = false;

  problemeInterv12: boolean = false;
  problemeInterv34: boolean = false;
  problemeInterv56: boolean = false;
  problemeInterv78: boolean = false;
  problemeInterv910: boolean = false;
  problemeInterv1112: boolean = false;
  problemeInterv1314: boolean = false;
  problemeCompagnie1: boolean = false;
  problemeCompagnie2: boolean = false;
  problemeCompagnie3: boolean = false;
  problemeCompagnie4: boolean = false;
  problemeCompagnie5: boolean = false;
  problemeCompagnie6: boolean = false;
  problemeCompagnie7: boolean = false;

  afficheInterv3_14: boolean = false;

  interv1: number;
  interv2: number;
  interv3: number;
  interv4: number;
  interv5: number;
  interv6: number;
  interv7: number;
  interv8: number;
  interv9: number;
  interv10: number;
  interv11: number;
  interv12: number;
  interv13: number;
  interv14: number;
  acces_compagnie1: number;
  acces_apporteur1: number;
  acces_compagnie2: number;
  acces_apporteur2: number;
  acces_compagnie3: number;
  acces_apporteur3: number;
  acces_compagnie4: number;
  acces_apporteur4: number;
  acces_compagnie5: number;
  acces_apporteur5: number;
  acces_compagnie6: number;
  acces_apporteur6: number;
  acces_compagnie7: number;
  acces_apporteur7: number;

  // Proposer la date du jour sur le formulaire
  date_comptabilisation: Date;

  // Vider les champs catgorie et produit quand on change Branche:
  acces_categorie: any;
  acces_produit: any;

  intervMax = 99999999999;

  // Interdire l'accès sur les autres tags s'il y'a un hight value
  nonAfficheInterv34: boolean = false ;
  nonAfficheInterv56: boolean = false ;
  nonAfficheInterv78: boolean = false ;
  nonAfficheInterv910: boolean = false ;
  nonAfficheInterv1112: boolean = false ;
  nonAfficheInterv1314: boolean = false ;

  autorisation = [] ;

  // Affichage du message indiquant que la valeur max est atteinte
  valeurMaxAtteint2: boolean = false ;
  valeurMaxAtteint4: boolean = false ;
  valeurMaxAtteint6: boolean = false ;
  valeurMaxAtteint8: boolean = false ;
  valeurMaxAtteint10: boolean = false ;
  valeurMaxAtteint12: boolean = false ;
  valeurMaxAtteint14: boolean = false ;

  // gestion du hight value:
  acces_datefineffet: Date ;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private accessoireService: AccessoireService,
    private interService: IntermediaireService,
    private formatNumberService: FormatNumberService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.onGetAllBranches();
    this.onGetAllIntermediaires();
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

      if (token.isValid()) {
        this.autorisation = token.getPayload().fonctionnalite.split(',');
      }
    });

    this.date_comptabilisation = dateFormatter(new Date(), 'yyyy-MM-ddTHH:mm');
    this.addForm.controls['acces_datepriseffet'].setValue(this.date_comptabilisation);

    // On met les champs suivants à null pour qu'ils soient de type object et facilté le controle de saisi
    this.addForm.controls['acces_interv1'].setValue(1);
    this.addForm.controls['acces_interv2'].setValue(null);
    this.addForm.controls['acces_interv3'].setValue(null);
    this.addForm.controls['acces_interv4'].setValue(null);
    this.addForm.controls['acces_interv5'].setValue(null);
    this.addForm.controls['acces_interv6'].setValue(null);
    this.addForm.controls['acces_interv7'].setValue(null);
    this.addForm.controls['acces_interv8'].setValue(null);
    this.addForm.controls['acces_interv9'].setValue(null);
    this.addForm.controls['acces_interv10'].setValue(null);
    this.addForm.controls['acces_interv11'].setValue(null);
    this.addForm.controls['acces_interv12'].setValue(null);
    this.addForm.controls['acces_interv13'].setValue(null);
    this.addForm.controls['acces_interv14'].setValue(null);
    this.addForm.controls['acces_compagnie1'].setValue(null);
    this.addForm.controls['acces_apporteur1'].setValue(null);
    this.addForm.controls['acces_compagnie2'].setValue(null);
    this.addForm.controls['acces_apporteur2'].setValue(null);
    this.addForm.controls['acces_compagnie3'].setValue(null);
    this.addForm.controls['acces_apporteur3'].setValue(null);
    this.addForm.controls['acces_compagnie4'].setValue(null);
    this.addForm.controls['acces_apporteur4'].setValue(null);
    this.addForm.controls['acces_compagnie5'].setValue(null);
    this.addForm.controls['acces_apporteur5'].setValue(null);
    this.addForm.controls['acces_compagnie6'].setValue(null);
    this.addForm.controls['acces_apporteur6'].setValue(null);
    this.addForm.controls['acces_compagnie7'].setValue(null);
    this.addForm.controls['acces_apporteur7'].setValue(null);
  }

  onCancel() {
    this.router.navigateByUrl('home/parametrage-systeme/accessoire');
  }

  onSubmit() {

    this.interv1 = this.addForm.get("acces_interv1").value;
    this.interv2 = this.addForm.get("acces_interv2").value;
    this.interv3 = this.addForm.get("acces_interv3").value;
    this.interv4 = this.addForm.get("acces_interv4").value;
    this.interv5 = this.addForm.get("acces_interv5").value;
    this.interv6 = this.addForm.get("acces_interv6").value;
    this.interv7 = this.addForm.get("acces_interv7").value;
    this.interv8 = this.addForm.get("acces_interv8").value;
    this.interv9 = this.addForm.get("acces_interv9").value;
    this.interv10 = this.addForm.get("acces_interv10").value;
    this.interv11 = this.addForm.get("acces_interv11").value;
    this.interv12 = this.addForm.get("acces_interv12").value;
    this.interv13 = this.addForm.get("acces_interv13").value;
    this.interv14 = this.addForm.get("acces_interv14").value;
    this.acces_compagnie1 = this.addForm.get("acces_compagnie1").value;
    this.acces_apporteur1 = this.addForm.get("acces_apporteur1").value;
    this.acces_compagnie2 = this.addForm.get("acces_compagnie2").value;
    this.acces_apporteur2 = this.addForm.get("acces_apporteur2").value;
    this.acces_compagnie3 = this.addForm.get("acces_compagnie3").value;
    this.acces_apporteur3 = this.addForm.get("acces_apporteur3").value;
    this.acces_compagnie4 = this.addForm.get("acces_compagnie4").value;
    this.acces_apporteur4 = this.addForm.get("acces_apporteur4").value;
    this.acces_compagnie5 = this.addForm.get("acces_compagnie5").value;
    this.acces_apporteur5 = this.addForm.get("acces_apporteur5").value;
    this.acces_compagnie6 = this.addForm.get("acces_compagnie6").value;
    this.acces_apporteur6 = this.addForm.get("acces_apporteur6").value;
    this.acces_compagnie7 = this.addForm.get("acces_compagnie7").value;
    this.acces_apporteur7 = this.addForm.get("acces_apporteur7").value;

    if (this.interv1 != null && this.interv2 != null && this.acces_compagnie1 === null) {
      this.problemeCompagnie1 = true;
      this.erreur = true;
    }
    else if (this.interv3 != null && this.interv4 != null && this.acces_compagnie2 === null) {
      this.problemeCompagnie2 = true;
      this.erreur = true;
    }
    else if (this.interv5 != null && this.interv6 != null && this.acces_compagnie3 === null) {
      this.problemeCompagnie3 = true;
      this.erreur = true;
    }
    else if (this.interv7 != null && this.interv8 != null && this.acces_compagnie4 === null) {
      this.problemeCompagnie4 = true;
      this.erreur = true;
    }
    else if (this.interv9 != null && this.interv10 != null && this.acces_compagnie5 === null) {
      this.problemeCompagnie5 = true;
      this.erreur = true;
    }
    else if (this.interv11 != null && this.interv12 != null && this.acces_compagnie6 === null) {
      this.problemeCompagnie6 = true;
      this.erreur = true;
    }
    else if (this.interv13 != null && this.interv14 != null && this.acces_compagnie7 === null) {
      this.problemeCompagnie7 = true;
      this.erreur = true;
    }
    // On contrôle les valeurs entre deux intervalles
    else if (this.interv1 != null && this.interv2 != null && (this.interv1 >= this.interv2)) {
      this.problemeInterv12 = true;
      this.erreur = true;
    }
    else if (this.interv2 != null && this.interv3 != null && (this.interv2 >= this.interv3)) {
      this.problemeInterv3 = true;
      this.erreur = true;
    }
    else if (this.interv3 != null && this.interv4 != null && (this.interv3 >= this.interv4)) {
      this.problemeInterv34 = true;
      this.erreur = true;
    }
    else if (this.interv4 != null && this.interv5 != null && (this.interv4 >= this.interv5)) {
      this.problemeInterv5 = true;
      this.erreur = true;
    }
    else if (this.interv5 != null && this.interv6 != null && (this.interv5 >= this.interv6)) {
      this.problemeInterv56 = true;
      this.erreur = true;
    }
    else if (this.interv6 != null && this.interv7 != null && (this.interv6 >= this.interv7)) {
      this.problemeInterv7 = true;
      this.erreur = true;
    }
    else if (this.interv7 != null && this.interv8 != null && (this.interv7 >= this.interv8)) {
      this.problemeInterv78 = true;
      this.erreur = true;
    }
    else if (this.interv8 != null && this.interv9 != null && (this.interv8 >= this.interv9)) {
      this.problemeInterv9 = true;
      this.erreur = true;
    }
    else if (this.interv9 != null && this.interv10 != null && (this.interv9 >= this.interv10)) {
      this.problemeInterv910 = true;
      this.erreur = true;
    }
    else if (this.interv10 != null && this.interv11 != null && (this.interv10 >= this.interv11)) {
      this.problemeInterv11 = true;
      this.erreur = true;
    }
    else if (this.interv11 != null && this.interv12 != null && (this.interv11 >= this.interv12)) {
      this.problemeInterv1112 = true;
      this.erreur = true;
    }
    else if (this.interv12 != null && this.interv13 != null && (this.interv12 >= this.interv13)) {
      this.problemeInterv13 = true;
      this.erreur = true;
    }
    else if (this.interv13 != null && this.interv14 != null && (this.interv13 >= this.interv14)) {
      this.problemeInterv1314 = true;
      this.erreur = true;
    }
    
    // On gere les intervalles si l'un des champs est renseigné et l'autre omit
    else if ((this.interv1 != null && this.interv2 === null) || (this.interv1 === null && this.interv2 != null)) {
      this.problemeInterv12 = true
      this.erreur = true;
    }
    else if ((this.interv3 != null && this.interv4 === null) || (this.interv3 === null && this.interv4 != null)) {
      this.problemeInterv34 = true
      this.erreur = true;
    }
    else if ((this.interv5 != null && this.interv6 === null) || (this.interv5 === null && this.interv6 != null)) {
      this.problemeInterv56 = true
      this.erreur = true;
    }
    else if ((this.interv7 != null && this.interv8 === null) || (this.interv7 === null && this.interv8 != null)) {
      this.problemeInterv78 = true
      this.erreur = true;
    }
    else if ((this.interv9 != null && this.interv10 === null) || (this.interv9 === null && this.interv10 != null)) {
      this.problemeInterv910 = true
      this.erreur = true;
    }
    else if ((this.interv11 != null && this.interv12 === null) || (this.interv11 === null && this.interv12 != null)) {
      this.problemeInterv1112 = true
      this.erreur = true;
    }
    else if ((this.interv13 != null && this.interv14 === null) || (this.interv13 === null && this.interv14 != null)) {
      this.problemeInterv1314 = true
      this.erreur = true;
    }
    else {
      this.addForm.controls["acces_codegarantie"].setValue(9999);
      this.acces_datefineffet = dateFormatter(new Date(9998, 12, 31),'yyyy-MM-ddThh:mm');
      this.addForm.controls['acces_datefineffet'].setValue(this.acces_datefineffet);
      this.accessoireService.addAccesoire(this.addForm.value)
        .subscribe((data) => {
          this.toastrService.show(
            'accessoire enregistré avec succès !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          this.router.navigateByUrl('home/parametrage-systeme/accessoire');
        },
          (error) => {
            this.toastrService.show(
              error.error.message,
              // "Echec de l'ajout de l'accessoire",
              'Erreur de notification',
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

  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[];
      });
  }

  onGetAllProduitByCategorie(categorie: number) {
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.listeCodeProduit = data as Produit[];
      });
  }

  onChangeApporteur(event) {
    this.codeApporteurChoisi = event;
    this.addForm.controls['acces_codeapporteur'].setValue(event);

    if (this.codeProduitChoisi != null) {
      this.numConcat = this.codeApporteurChoisi + this.codeProduitChoisi;
      this.accessoireService.lastID(this.codeProduitChoisi, this.codeApporteurChoisi).subscribe((data) => {
        if (data == 0) {
          this.addForm.controls['acces_code'].setValue(this.numConcat.toString() + "001");
        } else {
          this.addForm.controls['acces_code'].setValue(Number(data) + 1);
        }
      })
    }
  }

  onChangeBranche(event) {
    this.onGetAllCategorieByBranche(event);
    this.addForm.controls['acces_codebranche'].setValue(event);

    this.acces_categorie = "".toString();
    this.acces_produit = "".toString();
    this.addForm.controls['acces_codecategorie'].setValue(this.acces_categorie);
    this.addForm.controls['acces_codeproduit'].setValue(this.acces_produit);
  }

  onChangeCategorie(event) {
    this.onGetAllProduitByCategorie(event);
    this.addForm.controls['acces_codecategorie'].setValue(event);

    this.acces_produit = "".toString();
    this.addForm.controls['acces_codeproduit'].setValue(this.acces_produit);
  }

  onChangeProduit(event) {
    this.codeProduitChoisi = event;
    this.addForm.controls['acces_codeproduit'].setValue(event);

    this.numConcat = this.codeApporteurChoisi + event;
    this.accessoireService.lastID(this.codeProduitChoisi, this.codeApporteurChoisi).subscribe((data) => {
      if (data == 0) {
        this.addForm.controls['acces_code'].setValue(this.numConcat.toString() + "001");
      } else {
        this.addForm.controls['acces_code'].setValue(Number(data) + 1);
      }
    })
  }

  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.listeCodeBranche = data as Branche[];
      });
  }

  // onGetAllCategorie() {
  //   this.categorieService.getAllCategorie()
  //     .subscribe((data: Categorie[]) => {
  //       this.listeNumeroCategorie = data as Categorie[];
  //     });
  // }

  // onGetAllProduits() {
  //   this.produitService.getAllProduits()
  //     .subscribe((data: Produit[]) => {
  //       this.listeCodeProduit = data as Produit[];
  //     });
  // }

  onGetAllIntermediaires() {
    this.interService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.listeNumeroIntermediaire = data as Intermediaire[];
      });
  }

  onFocusOutEventInterv12(event: any) {
    this.interv1 = this.addForm.get("acces_interv1").value;
    this.interv2 = this.addForm.get("acces_interv2").value;

    // Gestion du controle de saisi
    if (this.interv1 == null || this.interv1 == 0) {
      this.problemeInterv1 = true;
      this.erreur = true ;
    } else {
      this.problemeInterv1 = false;
      this.erreur = false;
    }

    // Pour intervalle 2
    if (this.interv2 == null || this.interv2 == 0) {
      this.problemeInterv2 = true;
      this.erreur = true ;
    } else {
      this.problemeInterv2 = false;
      this.erreur = false;
    }

    if (this.interv1 !== null && this.interv2 !== null) {
      if (this.interv1 >= this.interv2) {
        this.problemeInterv12 = true;
        this.erreur = true;
      } else {
        this.problemeInterv12 = false;
        this.erreur = false;
        // initialisé interv3 = interv2 + 1
        if (this.interv2 != this.intervMax) {
          this.addForm.controls['acces_interv3'].setValue(Number(this.interv2) + 1);
          this.nonAfficheInterv34 = false ;
          this.nonAfficheInterv56 = false ;
          this.nonAfficheInterv78 = false ;
          this.nonAfficheInterv910 = false ;
          this.nonAfficheInterv1112 = false ;
          this.nonAfficheInterv1314 = false ;
          this.valeurMaxAtteint2 = false ;

          //=====================================================
          this.interv3 = this.addForm.get("acces_interv3").value;
          if(this.interv2 < this.interv3){
            this.problemeInterv3 = false ;
            this.erreur = false ;
          }

        } else {
          this.valeurMaxAtteint2 = true ;
          this.valeurMaxAtteint4 = false ;
          this.valeurMaxAtteint6 = false ;
          this.valeurMaxAtteint8 = false ;
          this.valeurMaxAtteint10 = false ;
          this.valeurMaxAtteint12 = false ;
          this.valeurMaxAtteint14 = false ;
          this.nonAfficheInterv34 = true
          this.nonAfficheInterv56 = true ;
          this.nonAfficheInterv78 = true ;
          this.nonAfficheInterv910 = true ;
          this.nonAfficheInterv1112 = true ;
          this.nonAfficheInterv1314 = true ;
          this.addForm.controls['acces_interv3'].setValue(null);
          this.addForm.controls['acces_interv4'].setValue(null);
          this.addForm.controls['acces_interv5'].setValue(null);
          this.addForm.controls['acces_interv6'].setValue(null);
          this.addForm.controls['acces_interv7'].setValue(null);
          this.addForm.controls['acces_interv8'].setValue(null);
          this.addForm.controls['acces_interv9'].setValue(null);
          this.addForm.controls['acces_interv10'].setValue(null);
          this.addForm.controls['acces_interv11'].setValue(null);
          this.addForm.controls['acces_interv12'].setValue(null);
          this.addForm.controls['acces_interv13'].setValue(null);
          this.addForm.controls['acces_interv14'].setValue(null);
          this.addForm.controls['acces_compagnie2'].setValue(null);
          this.addForm.controls['acces_apporteur2'].setValue(null);
          this.addForm.controls['acces_compagnie3'].setValue(null);
          this.addForm.controls['acces_apporteur3'].setValue(null);
          this.addForm.controls['acces_compagnie4'].setValue(null);
          this.addForm.controls['acces_apporteur4'].setValue(null);
          this.addForm.controls['acces_compagnie5'].setValue(null);
          this.addForm.controls['acces_apporteur5'].setValue(null);
          this.addForm.controls['acces_compagnie6'].setValue(null);
          this.addForm.controls['acces_apporteur6'].setValue(null);
          this.addForm.controls['acces_compagnie7'].setValue(null);
          this.addForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['acces_interv3'].setValue(null);
    }
  }

  onFocusOutEventInterv34(event: any) {
    this.interv3 = this.addForm.get("acces_interv3").value;
    this.interv4 = this.addForm.get("acces_interv4").value;

    if (this.interv3 != null && this.interv4 != null) {
      if (this.interv3 >= this.interv4) {
        this.problemeInterv34 = true;
        this.erreur = true;
      } else {
        this.problemeInterv34 = false;
        this.erreur = false;
        if (this.interv4 != this.intervMax) {
          this.addForm.controls['acces_interv5'].setValue(Number(this.interv4) + 1);
          this.nonAfficheInterv56 = false ;
          this.nonAfficheInterv78 = false ;
          this.nonAfficheInterv910 = false ;
          this.nonAfficheInterv1112 = false ;
          this.nonAfficheInterv1314 = false ;
          this.valeurMaxAtteint4 = false ;
          
          //=====================================================
          this.interv5 = this.addForm.get("acces_interv5").value;
          if(this.interv4 < this.interv5){
            this.problemeInterv5 = false ;
            this.erreur = false ;
          }
        } else {
          this.valeurMaxAtteint4 = true ;
          this.valeurMaxAtteint2 = false ;
          this.valeurMaxAtteint6 = false ;
          this.valeurMaxAtteint8 = false ;
          this.valeurMaxAtteint10 = false ;
          this.valeurMaxAtteint12 = false ;
          this.valeurMaxAtteint14 = false ;
          this.nonAfficheInterv56 = true ;
          this.nonAfficheInterv78 = true ;
          this.nonAfficheInterv910 = true ;
          this.nonAfficheInterv1112 = true ;
          this.nonAfficheInterv1314 = true ;
          this.addForm.controls['acces_interv5'].setValue(null);
          this.addForm.controls['acces_interv6'].setValue(null);
          this.addForm.controls['acces_interv7'].setValue(null);
          this.addForm.controls['acces_interv8'].setValue(null);
          this.addForm.controls['acces_interv9'].setValue(null);
          this.addForm.controls['acces_interv10'].setValue(null);
          this.addForm.controls['acces_interv11'].setValue(null);
          this.addForm.controls['acces_interv12'].setValue(null);
          this.addForm.controls['acces_interv13'].setValue(null);
          this.addForm.controls['acces_interv14'].setValue(null);
          this.addForm.controls['acces_compagnie3'].setValue(null);
          this.addForm.controls['acces_apporteur3'].setValue(null);
          this.addForm.controls['acces_compagnie4'].setValue(null);
          this.addForm.controls['acces_apporteur4'].setValue(null);
          this.addForm.controls['acces_compagnie5'].setValue(null);
          this.addForm.controls['acces_apporteur5'].setValue(null);
          this.addForm.controls['acces_compagnie6'].setValue(null);
          this.addForm.controls['acces_apporteur6'].setValue(null);
          this.addForm.controls['acces_compagnie7'].setValue(null);
          this.addForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['acces_interv5'].setValue(null);
      this.problemeInterv34 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv56(event: any) {
    this.interv5 = this.addForm.get("acces_interv5").value;
    this.interv6 = this.addForm.get("acces_interv6").value;
    if (this.interv5 != null && this.interv6 != null) {
      if (this.interv5 >= this.interv6) {
        this.problemeInterv56 = true;
        this.erreur = true;
      } else {
        this.problemeInterv56 = false;
        this.erreur = false;
        if (this.interv6 != this.intervMax) {
          this.addForm.controls['acces_interv7'].setValue(Number(this.interv6) + 1);
          this.nonAfficheInterv78 = false ;
          this.nonAfficheInterv910 = false ;
          this.nonAfficheInterv1112 = false ;
          this.nonAfficheInterv1314 = false ;
          this.valeurMaxAtteint6 = false ;

          //=====================================================
          this.interv7 = this.addForm.get("acces_interv7").value;
          if(this.interv6 < this.interv7){
            this.problemeInterv7 = false ;
            this.erreur = false ;
          }
        } else {
          this.valeurMaxAtteint6 = true ;
          this.valeurMaxAtteint2 = false ;
          this.valeurMaxAtteint4 = false ;
          this.valeurMaxAtteint8 = false ;
          this.valeurMaxAtteint10 = false ;
          this.valeurMaxAtteint12 = false ;
          this.valeurMaxAtteint14 = false ;
          this.nonAfficheInterv78 = true ;
          this.nonAfficheInterv910 = true ;
          this.nonAfficheInterv1112 = true ;
          this.nonAfficheInterv1314 = true ;
          this.addForm.controls['acces_interv7'].setValue(null);
          this.addForm.controls['acces_interv8'].setValue(null);
          this.addForm.controls['acces_interv9'].setValue(null);
          this.addForm.controls['acces_interv10'].setValue(null);
          this.addForm.controls['acces_interv11'].setValue(null);
          this.addForm.controls['acces_interv12'].setValue(null);
          this.addForm.controls['acces_interv13'].setValue(null);
          this.addForm.controls['acces_interv14'].setValue(null);
          this.addForm.controls['acces_compagnie4'].setValue(null);
          this.addForm.controls['acces_apporteur4'].setValue(null);
          this.addForm.controls['acces_compagnie5'].setValue(null);
          this.addForm.controls['acces_apporteur5'].setValue(null);
          this.addForm.controls['acces_compagnie6'].setValue(null);
          this.addForm.controls['acces_apporteur6'].setValue(null);
          this.addForm.controls['acces_compagnie7'].setValue(null);
          this.addForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['acces_interv7'].setValue(null);
      this.problemeInterv56 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv78(event: any) {
    this.interv7 = this.addForm.get("acces_interv7").value;
    this.interv8 = this.addForm.get("acces_interv8").value;
    if (this.interv7 != null && this.interv8 != null) {
      if (this.interv7 >= this.interv8) {
        this.problemeInterv78 = true;
        this.erreur = true;
      } else {
        this.problemeInterv78 = false;
        this.erreur = false;
        if (this.interv8 != this.intervMax) {
          this.addForm.controls['acces_interv9'].setValue(Number(this.interv8) + 1);
          this.nonAfficheInterv910 = false ;
          this.nonAfficheInterv1112 = false ;
          this.nonAfficheInterv1314 = false ;
          this.valeurMaxAtteint8 = false ;

           //=====================================================
           this.interv9 = this.addForm.get("acces_interv9").value;
           if(this.interv8 < this.interv9){
             this.problemeInterv9 = false ;
             this.erreur = false ;
           }
        } else {
          this.valeurMaxAtteint8 = true ;
          this.valeurMaxAtteint2 = false ;
          this.valeurMaxAtteint4 = false ;
          this.valeurMaxAtteint6 = false ;
          this.valeurMaxAtteint10 = false ;
          this.valeurMaxAtteint12 = false ;
          this.valeurMaxAtteint14 = false ;
          this.nonAfficheInterv910 = true ;
          this.nonAfficheInterv1112 = true ;
          this.nonAfficheInterv1314 = true ;
          this.addForm.controls['acces_interv9'].setValue(null);
          this.addForm.controls['acces_interv10'].setValue(null);
          this.addForm.controls['acces_interv11'].setValue(null);
          this.addForm.controls['acces_interv12'].setValue(null);
          this.addForm.controls['acces_interv13'].setValue(null);
          this.addForm.controls['acces_interv14'].setValue(null);
          this.addForm.controls['acces_compagnie5'].setValue(null);
          this.addForm.controls['acces_apporteur5'].setValue(null);
          this.addForm.controls['acces_compagnie6'].setValue(null);
          this.addForm.controls['acces_apporteur6'].setValue(null);
          this.addForm.controls['acces_compagnie7'].setValue(null);
          this.addForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['acces_interv9'].setValue(null);
      this.problemeInterv78 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv910(event: any) {
    this.interv9 = this.addForm.get("acces_interv9").value;
    this.interv10 = this.addForm.get("acces_interv10").value;
    if (this.interv9 != null && this.interv10 != null) {
      if (this.interv9 >= this.interv10) {
        this.problemeInterv910 = true;
        this.erreur = true;
      } else {
        this.problemeInterv910 = false;
        this.erreur = false;
        if (this.interv10 != this.intervMax) {
          this.addForm.controls['acces_interv11'].setValue(Number(this.interv10) + 1);
          this.nonAfficheInterv1112 = false ;
          this.nonAfficheInterv1314 = false ;
          this.valeurMaxAtteint10 = false ;

          //=====================================================
          this.interv11 = this.addForm.get("acces_interv11").value;
          if(this.interv10 < this.interv11){
            this.problemeInterv11 = false ;
            this.erreur = false ;
          }
        } else {
          this.valeurMaxAtteint10 = true ;
          this.valeurMaxAtteint2 = false ;
          this.valeurMaxAtteint4 = false ;
          this.valeurMaxAtteint6 = false ;
          this.valeurMaxAtteint8 = false ;
          this.valeurMaxAtteint12 = false ;
          this.valeurMaxAtteint14 = false ;
          this.nonAfficheInterv1112 = true ;
          this.nonAfficheInterv1314 = true ;
          this.addForm.controls['acces_interv11'].setValue(null);
          this.addForm.controls['acces_interv12'].setValue(null);
          this.addForm.controls['acces_interv13'].setValue(null);
          this.addForm.controls['acces_interv14'].setValue(null);
          this.addForm.controls['acces_compagnie6'].setValue(null);
          this.addForm.controls['acces_apporteur6'].setValue(null);
          this.addForm.controls['acces_compagnie7'].setValue(null);
          this.addForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['acces_interv11'].setValue(null);
      this.problemeInterv910 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv1112(event: any) {
    this.interv11 = this.addForm.get("acces_interv11").value;
    this.interv12 = this.addForm.get("acces_interv12").value;
    if (this.interv11 != null && this.interv12 != null) {
      if (this.interv11 >= this.interv12) {
        this.problemeInterv1112 = true;
        this.erreur = true;
      } else {
        this.problemeInterv1112 = false;
        this.erreur = false;
        if (this.interv12 != this.intervMax) {
          this.addForm.controls['acces_interv13'].setValue(Number(this.interv12) + 1);
          this.nonAfficheInterv1314 = false ;
          this.valeurMaxAtteint12 = false ;

          //=====================================================
          this.interv13 = this.addForm.get("acces_interv13").value;
          if(this.interv12 < this.interv13){
            this.problemeInterv13 = false ;
            this.erreur = false ;
          }
        } else {
          this.valeurMaxAtteint12 = true ;
          this.valeurMaxAtteint2 = false ;
          this.valeurMaxAtteint4 = false ;
          this.valeurMaxAtteint6 = false ;
          this.valeurMaxAtteint8 = false ;
          this.valeurMaxAtteint10 = false ;
          this.valeurMaxAtteint14 = false ;
          this.nonAfficheInterv1314 = true ;
          this.addForm.controls['acces_interv13'].setValue(null);
          this.addForm.controls['acces_interv14'].setValue(null);
          this.addForm.controls['acces_compagnie7'].setValue(null);
          this.addForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['acces_interv13'].setValue(null);
      this.problemeInterv1112 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv1314(event: any) {
    this.interv13 = this.addForm.get("acces_interv13").value;
    this.interv14 = this.addForm.get("acces_interv14").value;
    if (this.interv13 != null && this.interv14 != null) {
      if (this.interv13 >= this.interv14) {
        this.problemeInterv1314 = true;
        this.erreur = true;
      } else {
        this.problemeInterv1314 = false;
        this.erreur = false;

        // Gestion de la valeur max
        if (this.interv14 != this.intervMax) {
          this.valeurMaxAtteint14 = false ;
        } else {
          this.valeurMaxAtteint14 = true ;
          this.valeurMaxAtteint2 = false ;
          this.valeurMaxAtteint4 = false ;
          this.valeurMaxAtteint6 = false ;
          this.valeurMaxAtteint8 = false ;
          this.valeurMaxAtteint10 = false ;
          this.valeurMaxAtteint12 = false ;
        }
      }
    } else {
      this.problemeInterv1314 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv3(event: any) {
    this.interv2 = this.addForm.get("acces_interv2").value;
    this.interv3 = this.addForm.get("acces_interv3").value;
    if (this.interv2 != null && this.interv3 != null) {
      if (this.interv2 >= this.interv3) {
        this.problemeInterv3 = true;
        this.erreur = true;
      }
      else {
        this.problemeInterv3 = false;
        this.erreur = false;
      }
    } else {
      this.problemeInterv34 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv5(event: any) {
    this.interv4 = this.addForm.get("acces_interv4").value;
    this.interv5 = this.addForm.get("acces_interv5").value;
    if (this.interv4 != null && this.interv5 != null) {
      if (this.interv4 >= this.interv5) {
        this.problemeInterv5 = true;
        this.erreur = true;
      }
      else {
        this.problemeInterv5 = false;
        this.erreur = false;
      }
    } else {
      this.problemeInterv56 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv7(event: any) {
    this.interv6 = this.addForm.get("acces_interv6").value;
    this.interv7 = this.addForm.get("acces_interv7").value;
    if (this.interv6 != null && this.interv7 != null) {
      if (this.interv6 >= this.interv7) {
        this.problemeInterv7 = true;
        this.erreur = true;
      }
      else {
        this.problemeInterv7 = false;
        this.erreur = false;
      }
    } else {
      this.problemeInterv78 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv9(event: any) {
    this.interv8 = this.addForm.get("acces_interv8").value;
    this.interv9 = this.addForm.get("acces_interv9").value;
    if (this.interv8 != null && this.interv9 != null) {
      if (this.interv8 >= this.interv9) {
        this.problemeInterv9 = true;
        this.erreur = true;
      }
      else {
        this.problemeInterv9 = false;
        this.erreur = false;
      }
    } else {
      this.problemeInterv910 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv11(event: any) {
    this.interv10 = this.addForm.get("acces_interv10").value;
    this.interv11 = this.addForm.get("acces_interv11").value;
    if (this.interv10 != null && this.interv11 != null) {
      if (this.interv10 >= this.interv11) {
        this.problemeInterv11 = true;
        this.erreur = true;
      }
      else {
        this.problemeInterv11 = false;
        this.erreur = false;
      }
    } else {
      this.problemeInterv1112 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv13(event: any) {
    this.interv12 = this.addForm.get("acces_interv12").value;
    this.interv13 = this.addForm.get("acces_interv13").value;
    if (this.interv12 != null && this.interv13 != null) {
      if (this.interv12 >= this.interv13) {
        this.problemeInterv13 = true;
        this.erreur = true;
      }
      else {
        this.problemeInterv13 = false;
        this.erreur = false;
      }
    } else {
      this.problemeInterv1314 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventCompagnie1(event: any) {
    this.interv1 = this.addForm.get("acces_interv1").value;
    this.interv2 = this.addForm.get("acces_interv2").value;
    this.acces_compagnie1 = this.addForm.get("acces_compagnie1").value;
    if (this.interv1 != null && this.interv2 != null && this.acces_compagnie1 === null) {
      this.problemeCompagnie1 = true;
      this.erreur = true;
    } else {
      this.problemeCompagnie1 = false;
      this.erreur = false;

      this.acces_compagnie1 = Number(this.formatNumberService.replaceAll(this.acces_compagnie1, ' ', ''));
      this.acces_compagnie1 = this.formatNumberService.numberWithCommas2(this.acces_compagnie1);
    }
  }

  onFocusOutEventCompagnie2(event: any) {
    this.interv3 = this.addForm.get("acces_interv3").value;
    this.interv4 = this.addForm.get("acces_interv4").value;
    this.acces_compagnie2 = this.addForm.get("acces_compagnie2").value;
    if (this.interv3 != null && this.interv4 != null && this.acces_compagnie2 === null) {
      this.problemeCompagnie2 = true;
      this.erreur = true;
    } else {
      this.problemeCompagnie2 = false;
      this.erreur = false;

      this.acces_compagnie2 = Number(this.formatNumberService.replaceAll(this.acces_compagnie2, ' ', ''));
      this.acces_compagnie2 = this.formatNumberService.numberWithCommas2(this.acces_compagnie2);
    }
  }

  onFocusOutEventCompagnie3(event: any) {
    this.interv5 = this.addForm.get("acces_interv5").value;
    this.interv6 = this.addForm.get("acces_interv6").value;
    this.acces_compagnie3 = this.addForm.get("acces_compagnie3").value;
    if (this.interv5 != null && this.interv6 != null && this.acces_compagnie3 === null) {
      this.problemeCompagnie3 = true;
      this.erreur = true;
    } else {
      this.problemeCompagnie3 = false;
      this.erreur = false;

      this.acces_compagnie3 = Number(this.formatNumberService.replaceAll(this.acces_compagnie3, ' ', ''));
      this.acces_compagnie3 = this.formatNumberService.numberWithCommas2(this.acces_compagnie3);
    }
  }
  onFocusOutEventCompagnie4(event: any) {
    this.interv7 = this.addForm.get("acces_interv7").value;
    this.interv8 = this.addForm.get("acces_interv8").value;
    this.acces_compagnie4 = this.addForm.get("acces_compagnie4").value;
    if (this.interv7 != null && this.interv8 != null && this.acces_compagnie4 === null) {
      this.problemeCompagnie4 = true;
      this.erreur = true;
    } else {
      this.problemeCompagnie4 = false;
      this.erreur = false;

      this.acces_compagnie4 = Number(this.formatNumberService.replaceAll(this.acces_compagnie4, ' ', ''));
      this.acces_compagnie4 = this.formatNumberService.numberWithCommas2(this.acces_compagnie4);
    }
  }

  onFocusOutEventCompagnie5(event: any) {
    this.interv9 = this.addForm.get("acces_interv9").value;
    this.interv10 = this.addForm.get("acces_interv10").value;
    this.acces_compagnie5 = this.addForm.get("acces_compagnie5").value;
    if (this.interv9 != null && this.interv10 != null && this.acces_compagnie5 === null) {
      this.problemeCompagnie5 = true;
      this.erreur = true;
    } else {
      this.problemeCompagnie5 = false;
      this.erreur = false;

      this.acces_compagnie5 = Number(this.formatNumberService.replaceAll(this.acces_compagnie5, ' ', ''));
      this.acces_compagnie5 = this.formatNumberService.numberWithCommas2(this.acces_compagnie5);
    }
  }

  onFocusOutEventCompagnie6(event: any) {
    this.interv11 = this.addForm.get("acces_interv11").value;
    this.interv12 = this.addForm.get("acces_interv12").value;
    this.acces_compagnie6 = this.addForm.get("acces_compagnie6").value;
    if (this.interv11 != null && this.interv12 != null && this.acces_compagnie6 === null) {
      this.problemeCompagnie6 = true;
      this.erreur = true;
    } else {
      this.problemeCompagnie6 = false;
      this.erreur = false;

      this.acces_compagnie6 = Number(this.formatNumberService.replaceAll(this.acces_compagnie6, ' ', ''));
      this.acces_compagnie6 = this.formatNumberService.numberWithCommas2(this.acces_compagnie6);
    }
  }

  onFocusOutEventCompagnie7(event: any) {
    this.interv13 = this.addForm.get("acces_interv13").value;
    this.interv14 = this.addForm.get("acces_interv14").value;
    this.acces_compagnie7 = this.addForm.get("acces_compagnie7").value;
    if (this.interv13 != null && this.interv14 != null && this.acces_compagnie7 === null) {
      this.problemeCompagnie7 = true;
      this.erreur = true;
    } else {
      this.problemeCompagnie7 = false;
      this.erreur = false;

      this.acces_compagnie7 = Number(this.formatNumberService.replaceAll(this.acces_compagnie7, ' ', ''));
      this.acces_compagnie7 = this.formatNumberService.numberWithCommas2(this.acces_compagnie7);
    }
  }

  onFocusOutEventApporteur1() {

    this.acces_apporteur1 = this.addForm.get("acces_apporteur1").value;

    if (this.acces_apporteur1 !== null) {
      this.acces_apporteur1 = Number(this.formatNumberService.replaceAll(this.acces_apporteur1, ' ', ''));
      this.acces_apporteur1 = this.formatNumberService.numberWithCommas2(this.acces_apporteur1);
    }
  }

  onFocusOutEventApporteur2() {

    this.acces_apporteur2 = this.addForm.get("acces_apporteur2").value;

    if (this.acces_apporteur2 !== null) {
      this.acces_apporteur2 = Number(this.formatNumberService.replaceAll(this.acces_apporteur2, ' ', ''));
      this.acces_apporteur2 = this.formatNumberService.numberWithCommas2(this.acces_apporteur2);
    }
  }

  onFocusOutEventApporteur3() {

    this.acces_apporteur3 = this.addForm.get("acces_apporteur3").value;

    if (this.acces_apporteur3 !== null) {
      this.acces_apporteur3 = Number(this.formatNumberService.replaceAll(this.acces_apporteur3, ' ', ''));
      this.acces_apporteur3 = this.formatNumberService.numberWithCommas2(this.acces_apporteur3);
    }
  }

  onFocusOutEventApporteur4() {

    this.acces_apporteur4 = this.addForm.get("acces_apporteur4").value;

    if (this.acces_apporteur4 !== null) {
      this.acces_apporteur4 = Number(this.formatNumberService.replaceAll(this.acces_apporteur4, ' ', ''));
      this.acces_apporteur4 = this.formatNumberService.numberWithCommas2(this.acces_apporteur4);
    }
  }

  onFocusOutEventApporteur5() {

    this.acces_apporteur5 = this.addForm.get("acces_apporteur5").value;

    if (this.acces_apporteur5 !== null) {
      this.acces_apporteur5 = Number(this.formatNumberService.replaceAll(this.acces_apporteur5, ' ', ''));
      this.acces_apporteur5 = this.formatNumberService.numberWithCommas2(this.acces_apporteur5);
    }
  }

  onFocusOutEventApporteur6() {

    this.acces_apporteur6 = this.addForm.get("acces_apporteur6").value;

    if (this.acces_apporteur6 !== null) {
      this.acces_apporteur6 = Number(this.formatNumberService.replaceAll(this.acces_apporteur6, ' ', ''));
      this.acces_apporteur6 = this.formatNumberService.numberWithCommas2(this.acces_apporteur6);
    }
  }

  onFocusOutEventApporteur7() {

    this.acces_apporteur7 = this.addForm.get("acces_apporteur7").value;

    if (this.acces_apporteur7 !== null) {
      this.acces_apporteur7 = Number(this.formatNumberService.replaceAll(this.acces_apporteur7, ' ', ''));
      this.acces_apporteur7 = this.formatNumberService.numberWithCommas2(this.acces_apporteur7);
    }
  }

  // getcolor intervalle par intervalle
  getColorInterv3() {
    if (this.problemeInterv3) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorInterv5() {
    if (this.problemeInterv5) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorInterv7() {
    if (this.problemeInterv7) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorInterv9() {
    if (this.problemeInterv9) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorInterv11() {
    if (this.problemeInterv11) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorInterv13() {
    if (this.problemeInterv13) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColor12() {
    if (this.problemeInterv12) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColor34() {
    if (this.problemeInterv34) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColor56() {
    if (this.problemeInterv56) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColor78() {
    if (this.problemeInterv78) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColor910() {
    if (this.problemeInterv910) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColor1112() {
    if (this.problemeInterv1112) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColor1314() {
    if (this.problemeInterv1314) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCompagnie1() {
    if (this.problemeCompagnie1) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCompagnie2() {
    if (this.problemeCompagnie2) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCompagnie3() {
    if (this.problemeCompagnie3) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCompagnie4() {
    if (this.problemeCompagnie4) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCompagnie5() {
    if (this.problemeCompagnie5) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCompagnie6() {
    if (this.problemeCompagnie6) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorCompagnie7() {
    if (this.problemeCompagnie7) {
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
