import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UpdateBrancheComponent } from '../../../parametrage-general/gestion-branche/update-branche/update-branche.component';
import dateFormatter from 'date-format-conversion';
import { Accessoire } from '../../../../../model/Accessoire';
import { BrancheService } from '../../../../../services/branche.service';
import { Branche } from '../../../../../model/Branche';
import { CategorieService } from '../../../../../services/categorie.service';
import { ProduitService } from '../../../../../services/produit.service';
import { Produit } from '../../../../../model/Produit';
import { Categorie } from '../../../../../model/Categorie';
import { TransfertDataService } from '../../../../../services/transfertData.service';
import { AccessoireService } from '../../../../../services/accessoire.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { FormatNumberService } from '../../../../../services/formatNumber.service';


@Component({
  selector: 'ngx-update-accessoire',
  templateUrl: './update-accessoire.component.html',
  styleUrls: ['./update-accessoire.component.scss']
})
export class UpdateAccessoireComponent implements OnInit {

  modifForm = this.fb.group({

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

  accessoire: Accessoire;
  datePriseEffet: Date;
  dateFinEffet: Date;

  // Pour la gestion du contôle
  datePriseEffetRecupere: Date;
  dateFinEffetRecupere: Date;
  problemeDate: boolean = false;

  // La gestion des clés étrangère
  listeCodeBranche: any[];
  codeBranche: any;
  listeNumeroCategorie: any[];
  codeCategorie: any;
  listeCodeProduit: any[];
  codeProduit: any;
  listeCodeIntermediaire: any[];
  codeIntermediaire: any;

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
  acces_compagnie1: any;
  acces_apporteur1: any;
  acces_compagnie2: any;
  acces_apporteur2: any;
  acces_compagnie3: any;
  acces_apporteur3: any;
  acces_compagnie4: any;
  acces_apporteur4: any;
  acces_compagnie5: any;
  acces_apporteur5: any;
  acces_compagnie6: any;
  acces_apporteur6: any;
  acces_compagnie7: any;
  acces_apporteur7: any;

  intervMax = 99999999999;

  // Interdire l'accès sur les autres tags s'il y'a un hight value
  nonAfficheInterv34: boolean = false;
  nonAfficheInterv56: boolean = false;
  nonAfficheInterv78: boolean = false;
  nonAfficheInterv910: boolean = false;
  nonAfficheInterv1112: boolean = false;
  nonAfficheInterv1314: boolean = false;

  acces_interv2: any;
  acces_interv4: any;
  acces_interv6: any;
  acces_interv8: any;
  acces_interv10: any;
  acces_interv12: any;

  // boolean pour gerer les interv dejà saisis:
  afficheInterv1ReadOnly: boolean = false;
  afficheInterv2ReadOnly: boolean = false;
  afficheInterv3ReadOnly: boolean = false;
  afficheInterv4ReadOnly: boolean = false;
  afficheInterv5ReadOnly: boolean = false;
  afficheInterv6ReadOnly: boolean = false;
  afficheInterv7ReadOnly: boolean = false;
  afficheInterv8ReadOnly: boolean = false;
  afficheInterv9ReadOnly: boolean = false;
  afficheInterv10ReadOnly: boolean = false;
  afficheInterv11ReadOnly: boolean = false;
  afficheInterv12ReadOnly: boolean = false;
  afficheInterv13ReadOnly: boolean = false;
  afficheInterv14ReadOnly: boolean = false;

  afficheInterv1: boolean = false;
  afficheInterv2: boolean = false;
  afficheInterv3: boolean = false;
  afficheInterv4: boolean = false;
  afficheInterv5: boolean = false;
  afficheInterv6: boolean = false;
  afficheInterv7: boolean = false;
  afficheInterv8: boolean = false;
  afficheInterv9: boolean = false;
  afficheInterv10: boolean = false;
  afficheInterv11: boolean = false;
  afficheInterv12: boolean = false;
  afficheInterv13: boolean = false;
  afficheInterv14: boolean = false;

  autorisation = [];

  // Affichage du message indiquant que la valeur max est atteinte
  valeurMaxAtteint2: boolean = false;
  valeurMaxAtteint4: boolean = false;
  valeurMaxAtteint6: boolean = false;
  valeurMaxAtteint8: boolean = false;
  valeurMaxAtteint10: boolean = false;
  valeurMaxAtteint12: boolean = false;
  valeurMaxAtteint14: boolean = false;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private intermediaireService: IntermediaireService,
    private transfertDataService: TransfertDataService,
    private accessoireService: AccessoireService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private router: Router,
    private formatNumberService: FormatNumberService) { }

  ngOnInit(): void {
    this.accessoire = this.transfertDataService.getData();
    this.onGetAllBranches();
    this.onGetAllCategorie();
    this.onGetAllProduits();
    this.onGetAllIntermediaires();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {

        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
        }
      });

    // ========================== Gestion des hight values sur un nouvel enregistrement ==============
    // Initialisation du code accessoire avec une nouvelle valeur
    // this.accessoireService.lastID(this.accessoire.acces_codeproduit, this.accessoire.acces_codeapporteur)
    //   .subscribe((data) => {
    //   this.modifForm.controls['acces_code'].setValue(Number(data) + 1);

    // });


    // Interdire l'accès sur les autres tags s'il y'a un hight value
    this.acces_interv2 = this.accessoire.acces_interv2;
    if (this.acces_interv2 != this.intervMax) {
      this.nonAfficheInterv34 = false;
      this.nonAfficheInterv56 = false;
      this.nonAfficheInterv78 = false;
      this.nonAfficheInterv910 = false;
      this.nonAfficheInterv1112 = false;
      this.nonAfficheInterv1314 = false;
    } else {
      this.nonAfficheInterv34 = true;
      this.nonAfficheInterv56 = true;
      this.nonAfficheInterv78 = true;
      this.nonAfficheInterv910 = true;
      this.nonAfficheInterv1112 = true;
      this.nonAfficheInterv1314 = true;
    }

    this.acces_interv4 = this.accessoire.acces_interv4;
    if (this.acces_interv4 != this.intervMax && this.acces_interv2 != this.intervMax) {
      this.nonAfficheInterv56 = false;
      this.nonAfficheInterv78 = false;
      this.nonAfficheInterv910 = false;
      this.nonAfficheInterv1112 = false;
      this.nonAfficheInterv1314 = false;
    } else {
      this.nonAfficheInterv56 = true;
      this.nonAfficheInterv78 = true;
      this.nonAfficheInterv910 = true;
      this.nonAfficheInterv1112 = true;
      this.nonAfficheInterv1314 = true;
    }

    this.acces_interv6 = this.accessoire.acces_interv6;
    if (this.acces_interv6 != this.intervMax && this.acces_interv2 != this.intervMax && this.acces_interv4 != this.intervMax) {
      this.nonAfficheInterv78 = false;
      this.nonAfficheInterv910 = false;
      this.nonAfficheInterv1112 = false;
      this.nonAfficheInterv1314 = false;
    } else {
      this.nonAfficheInterv78 = true;
      this.nonAfficheInterv910 = true;
      this.nonAfficheInterv1112 = true;
      this.nonAfficheInterv1314 = true;
    }

    this.acces_interv8 = this.accessoire.acces_interv8;
    if (this.acces_interv8 != this.intervMax && this.acces_interv2 != this.intervMax && this.acces_interv4 != this.intervMax && this.acces_interv6 != this.intervMax) {
      this.nonAfficheInterv910 = false;
      this.nonAfficheInterv1112 = false;
      this.nonAfficheInterv1314 = false;
    } else {
      this.nonAfficheInterv910 = true;
      this.nonAfficheInterv1112 = true;
      this.nonAfficheInterv1314 = true;
    }

    this.acces_interv10 = this.accessoire.acces_interv10;
    if (this.acces_interv10 != this.intervMax && this.acces_interv2 != this.intervMax && this.acces_interv4 != this.intervMax && this.acces_interv6 != this.intervMax && this.acces_interv8 != this.intervMax) {
      this.nonAfficheInterv1112 = false;
      this.nonAfficheInterv1314 = false;
    } else {
      this.nonAfficheInterv1112 = true;
      this.nonAfficheInterv1314 = true;
    }

    this.acces_interv12 = this.accessoire.acces_interv12;
    if (this.acces_interv12 != this.intervMax && this.acces_interv2 != this.intervMax && this.acces_interv4 != this.intervMax && this.acces_interv6 != this.intervMax && this.acces_interv8 != this.intervMax && this.acces_interv10 != this.intervMax) {
      this.nonAfficheInterv1314 = false;
    } else {
      this.nonAfficheInterv1314 = true;
    }

    this.datePriseEffet = dateFormatter(this.accessoire.acces_datepriseffet, 'yyyy-MM-ddThh:mm');
    this.dateFinEffet = dateFormatter(this.accessoire.acces_datefineffet, 'yyyy-MM-ddThh:mm');

    // this.datePriseEffet = dateFormatter(new Date(), 'yyyy-MM-ddThh:mm');
    // this.dateFinEffet = dateFormatter(new Date(9998, 12, 31), 'yyyy-MM-ddThh:mm');

    // Remplissage des données du formulaire de modification
    //================================================================================
    this.modifForm.controls['acces_code'].setValue(this.accessoire.acces_code);
    // ===============================================================================
    this.modifForm.controls['acces_codeapporteur'].setValue(this.accessoire.acces_codeapporteur);
    this.codeIntermediaire = this.accessoire.acces_codeapporteur;

    this.modifForm.controls['acces_codebranche'].setValue(this.accessoire.acces_codebranche);
    this.codeBranche = this.accessoire.acces_codebranche;

    this.modifForm.controls['acces_codecategorie'].setValue(this.accessoire.acces_codecategorie);
    this.codeCategorie = this.accessoire.acces_codecategorie;

    this.modifForm.controls['acces_codeproduit'].setValue(this.accessoire.acces_codeproduit);
    this.codeProduit = this.accessoire.acces_codeproduit;

    this.modifForm.controls['acces_codegarantie'].setValue(this.accessoire.acces_codegarantie);

    this.modifForm.controls['acces_interv1'].setValue(this.accessoire.acces_interv1);
    if (this.accessoire.acces_interv1 != null && this.accessoire.acces_interv1 != this.intervMax) {
      this.afficheInterv1ReadOnly = true;
      this.afficheInterv1 = false;
    } else {
      this.afficheInterv1ReadOnly = false;
      this.afficheInterv1 = true;
    }
    this.modifForm.controls['acces_interv2'].setValue(this.accessoire.acces_interv2);
    if (this.accessoire.acces_interv2 != null && this.accessoire.acces_interv2 != this.intervMax) {
      this.afficheInterv2ReadOnly = true;
      this.afficheInterv2 = false;
    } else {
      this.afficheInterv2ReadOnly = false;
      this.afficheInterv2 = true;
    }
    this.acces_compagnie1 = this.formatNumberService.numberWithCommas2(Number(this.accessoire.acces_compagnie1));
    this.modifForm.controls['acces_compagnie1'].setValue(this.accessoire.acces_compagnie1);
    this.modifForm.controls['acces_apporteur1'].setValue(this.accessoire.acces_apporteur1);

    this.modifForm.controls['acces_interv3'].setValue(this.accessoire.acces_interv3);
    if (this.accessoire.acces_interv3 != null && this.accessoire.acces_interv3 != this.intervMax) {
      this.afficheInterv3ReadOnly = true;
      this.afficheInterv3 = false;
    } else {
      this.afficheInterv3ReadOnly = false;
      this.afficheInterv3 = true;
    }
    this.modifForm.controls['acces_interv4'].setValue(this.accessoire.acces_interv4);
    if (this.accessoire.acces_interv4 != null && this.accessoire.acces_interv4 != this.intervMax) {
      this.afficheInterv4ReadOnly = true;
      this.afficheInterv4 = false;
    } else {
      this.afficheInterv4ReadOnly = false;
      this.afficheInterv4 = true;
    }
    this.acces_compagnie2 = this.formatNumberService.numberWithCommas2(Number(this.accessoire.acces_compagnie2));
    this.modifForm.controls['acces_compagnie2'].setValue(this.accessoire.acces_compagnie2);
    this.modifForm.controls['acces_apporteur2'].setValue(this.accessoire.acces_apporteur2);

    this.modifForm.controls['acces_interv5'].setValue(this.accessoire.acces_interv5);
    if (this.accessoire.acces_interv5 != null && this.accessoire.acces_interv5 != this.intervMax) {
      this.afficheInterv5ReadOnly = true;
      this.afficheInterv5 = false;
    } else {
      this.afficheInterv5ReadOnly = false;
      this.afficheInterv5 = true;
    }
    this.modifForm.controls['acces_interv6'].setValue(this.accessoire.acces_interv6);
    if (this.accessoire.acces_interv6 != null && this.accessoire.acces_interv6 != this.intervMax) {
      this.afficheInterv6ReadOnly = true;
      this.afficheInterv6 = false;
    } else {
      this.afficheInterv6ReadOnly = false;
      this.afficheInterv6 = true;
    }
    this.acces_compagnie3 = this.formatNumberService.numberWithCommas2(Number(this.accessoire.acces_compagnie3));
    this.modifForm.controls['acces_compagnie3'].setValue(this.accessoire.acces_compagnie3);
    this.modifForm.controls['acces_apporteur3'].setValue(this.accessoire.acces_apporteur3);

    this.modifForm.controls['acces_interv7'].setValue(this.accessoire.acces_interv7);
    if (this.accessoire.acces_interv7 != null && this.accessoire.acces_interv7 != this.intervMax) {
      this.afficheInterv7ReadOnly = true;
      this.afficheInterv7 = false;
    } else {
      this.afficheInterv7ReadOnly = false;
      this.afficheInterv7 = true;
    }
    this.modifForm.controls['acces_interv8'].setValue(this.accessoire.acces_interv8);
    if (this.accessoire.acces_interv8 != null && this.accessoire.acces_interv8 != this.intervMax) {
      this.afficheInterv8ReadOnly = true;
      this.afficheInterv8 = false;
    } else {
      this.afficheInterv8ReadOnly = false;
      this.afficheInterv8 = true;
    }
    this.acces_compagnie4 = this.formatNumberService.numberWithCommas2(Number(this.accessoire.acces_compagnie4));
    this.modifForm.controls['acces_compagnie4'].setValue(this.accessoire.acces_compagnie4);
    this.modifForm.controls['acces_apporteur4'].setValue(this.accessoire.acces_apporteur4);

    this.modifForm.controls['acces_interv9'].setValue(this.accessoire.acces_interv9);
    if (this.accessoire.acces_interv9 != null && this.accessoire.acces_interv9 != this.intervMax) {
      this.afficheInterv9ReadOnly = true;
      this.afficheInterv9 = false;
    } else {
      this.afficheInterv9ReadOnly = false;
      this.afficheInterv9 = true;
    }
    this.modifForm.controls['acces_interv10'].setValue(this.accessoire.acces_interv10);
    if (this.accessoire.acces_interv10 != null && this.accessoire.acces_interv10 != this.intervMax) {
      this.afficheInterv10ReadOnly = true;
      this.afficheInterv10 = false;
    } else {
      this.afficheInterv10ReadOnly = false;
      this.afficheInterv10 = true;
    }
    this.acces_compagnie5 = this.formatNumberService.numberWithCommas2(Number(this.accessoire.acces_compagnie5));
    this.modifForm.controls['acces_compagnie5'].setValue(this.accessoire.acces_compagnie5);
    this.modifForm.controls['acces_apporteur5'].setValue(this.accessoire.acces_apporteur5);

    this.modifForm.controls['acces_interv11'].setValue(this.accessoire.acces_interv11);
    if (this.accessoire.acces_interv11 != null && this.accessoire.acces_interv11 != this.intervMax) {
      this.afficheInterv11ReadOnly = true;
      this.afficheInterv11 = false;
    } else {
      this.afficheInterv11ReadOnly = false;
      this.afficheInterv11 = true;
    }
    this.modifForm.controls['acces_interv12'].setValue(this.accessoire.acces_interv12);
    if (this.accessoire.acces_interv12 != null && this.accessoire.acces_interv12 != this.intervMax) {
      this.afficheInterv12ReadOnly = true;
      this.afficheInterv12 = false;
    } else {
      this.afficheInterv12ReadOnly = false;
      this.afficheInterv12 = true;
    }
    this.acces_compagnie6 = this.formatNumberService.numberWithCommas2(Number(this.accessoire.acces_compagnie6));
    this.modifForm.controls['acces_compagnie6'].setValue(this.accessoire.acces_compagnie6);
    this.modifForm.controls['acces_apporteur6'].setValue(this.accessoire.acces_apporteur6);

    this.modifForm.controls['acces_interv13'].setValue(this.accessoire.acces_interv13);
    if (this.accessoire.acces_interv13 != null && this.accessoire.acces_interv13 != this.intervMax) {
      this.afficheInterv13ReadOnly = true;
      this.afficheInterv13 = false;
    } else {
      this.afficheInterv13ReadOnly = false;
      this.afficheInterv13 = true;
    }
    this.modifForm.controls['acces_interv14'].setValue(this.accessoire.acces_interv14);
    if (this.accessoire.acces_interv14 != null && this.accessoire.acces_interv14 != this.intervMax) {
      this.afficheInterv14ReadOnly = true;
      this.afficheInterv14 = false;
    } else {
      this.afficheInterv14ReadOnly = false;
      this.afficheInterv14 = true;
    }
    this.acces_compagnie7 = this.formatNumberService.numberWithCommas2(Number(this.accessoire.acces_compagnie7));
    this.modifForm.controls['acces_compagnie7'].setValue(this.accessoire.acces_compagnie7);
    this.modifForm.controls['acces_apporteur7'].setValue(this.accessoire.acces_apporteur7);

    this.modifForm.controls['acces_datepriseffet'].setValue(this.datePriseEffet);
    this.modifForm.controls['acces_datefineffet'].setValue(this.dateFinEffet);
  }

  onCancel() {
    this.router.navigateByUrl('home/parametrage-systeme/accessoire');
  }

  onSubmit() {

    this.datePriseEffetRecupere = this.modifForm.get("acces_datepriseffet").value;
    this.dateFinEffetRecupere = this.modifForm.get("acces_datefineffet").value;

    this.interv1 = this.modifForm.get("acces_interv1").value;
    this.interv2 = this.modifForm.get("acces_interv2").value;
    this.interv3 = this.modifForm.get("acces_interv3").value;
    this.interv4 = this.modifForm.get("acces_interv4").value;
    this.interv5 = this.modifForm.get("acces_interv5").value;
    this.interv6 = this.modifForm.get("acces_interv6").value;
    this.interv7 = this.modifForm.get("acces_interv7").value;
    this.interv8 = this.modifForm.get("acces_interv8").value;
    this.interv9 = this.modifForm.get("acces_interv9").value;
    this.interv10 = this.modifForm.get("acces_interv10").value;
    this.interv11 = this.modifForm.get("acces_interv11").value;
    this.interv12 = this.modifForm.get("acces_interv12").value;
    this.interv13 = this.modifForm.get("acces_interv13").value;
    this.interv14 = this.modifForm.get("acces_interv14").value;
    this.acces_compagnie1 = this.modifForm.get("acces_compagnie1").value;
    this.acces_apporteur1 = this.modifForm.get("acces_apporteur1").value;
    this.acces_compagnie2 = this.modifForm.get("acces_compagnie2").value;
    this.acces_apporteur2 = this.modifForm.get("acces_apporteur2").value;
    this.acces_compagnie3 = this.modifForm.get("acces_compagnie3").value;
    this.acces_apporteur3 = this.modifForm.get("acces_apporteur3").value;
    this.acces_compagnie4 = this.modifForm.get("acces_compagnie4").value;
    this.acces_apporteur4 = this.modifForm.get("acces_apporteur4").value;
    this.acces_compagnie5 = this.modifForm.get("acces_compagnie5").value;
    this.acces_apporteur5 = this.modifForm.get("acces_apporteur5").value;
    this.acces_compagnie6 = this.modifForm.get("acces_compagnie6").value;
    this.acces_apporteur6 = this.modifForm.get("acces_apporteur6").value;
    this.acces_compagnie7 = this.modifForm.get("acces_compagnie7").value;
    this.acces_apporteur7 = this.modifForm.get("acces_apporteur7").value;

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
    else if (this.datePriseEffetRecupere > this.dateFinEffetRecupere) {
      this.problemeDate = true;
    }
    else {
      this.accessoireService.updateAccessoire(this.accessoire.acces_id, this.modifForm.value)
        .subscribe((data) => {
          this.toastrService.show(
            'Accessoire modifié avec succès !',
            // data.message,
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
              // "Echec de la modification de l'accessoire",
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

  onGetAllCategorie() {
    this.categorieService.getAllCategorie()
      .subscribe((data: Categorie[]) => {
        this.listeNumeroCategorie = data as Categorie[];
      });
  }

  onGetAllProduits() {
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
        this.listeCodeProduit = data as Produit[];
      });
  }

  onGetAllIntermediaires() {
    this.intermediaireService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.listeCodeIntermediaire = data as Intermediaire[];
      });
  }

  onGetLibelleByBranche(numero: any) {
    //this.onGetBranche(numero) ;
    //return this.branche?.branche_numero + " : "+ this.branche?.branche_libelleLong ;
    return numero + " : " + (this.listeCodeBranche?.find(b => b.branche_numero == numero))?.branche_libelleLong;
  }

  onGetLibelleByCategorie(numero: any) {
    return numero + " : " + (this.listeNumeroCategorie?.find(c => c.categ_numero == numero))?.categ_libellelong;
  }

  onGetLibelleByProduit(numero: any) {
    return numero + " : " + (this.listeCodeProduit?.find(p => p.prod_numero == numero))?.prod_denominationlong;
  }

  onGetDenominationByIntermediaire(numero: any) {
    return numero + " : " + (this.listeCodeIntermediaire?.find(i => i.inter_numero == numero))?.inter_denomination;
  }

  onChangeBranche(event) {
    this.modifForm.controls['acces_codebranche'].setValue(event);
  }
  onChangeCategorie(event) {
    this.modifForm.controls['acces_codecategorie'].setValue(event);
  }
  onChangeProduit(event) {
    this.modifForm.controls['acces_codeproduit'].setValue(event);
  }

  onFocusOutEventInterv12(event: any) {
    this.interv1 = this.modifForm.get("acces_interv1").value;
    this.interv2 = this.modifForm.get("acces_interv2").value;

    // Gestion du controle de saisi
    if (this.interv1 == null || this.interv1 == 0) {
      this.problemeInterv1 = true;
      this.erreur = true;
    } else {
      this.problemeInterv1 = false;
      this.erreur = false;
    }

    // Pour intervalle 2
    if (this.interv2 == null || this.interv2 == 0) {
      this.problemeInterv2 = true;
      this.erreur = true;
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
          this.modifForm.controls['acces_interv3'].setValue(Number(this.interv2) + 1);
          this.nonAfficheInterv34 = false;
          this.nonAfficheInterv56 = false;
          this.nonAfficheInterv78 = false;
          this.nonAfficheInterv910 = false;
          this.nonAfficheInterv1112 = false;
          this.nonAfficheInterv1314 = false;
          this.valeurMaxAtteint2 = false;

          //=====================================================
          this.interv3 = this.modifForm.get("acces_interv3").value;
          if (this.interv2 < this.interv3) {
            this.problemeInterv3 = false;
            this.erreur = false;
          }
        } else {
          this.valeurMaxAtteint2 = true;
          this.valeurMaxAtteint4 = false;
          this.valeurMaxAtteint6 = false;
          this.valeurMaxAtteint8 = false;
          this.valeurMaxAtteint10 = false;
          this.valeurMaxAtteint12 = false;
          this.valeurMaxAtteint14 = false;
          this.nonAfficheInterv34 = true
          this.nonAfficheInterv56 = true;
          this.nonAfficheInterv78 = true;
          this.nonAfficheInterv910 = true;
          this.nonAfficheInterv1112 = true;
          this.nonAfficheInterv1314 = true;
          this.modifForm.controls['acces_interv3'].setValue(null);
          this.modifForm.controls['acces_interv4'].setValue(null);
          this.modifForm.controls['acces_interv5'].setValue(null);
          this.modifForm.controls['acces_interv6'].setValue(null);
          this.modifForm.controls['acces_interv7'].setValue(null);
          this.modifForm.controls['acces_interv8'].setValue(null);
          this.modifForm.controls['acces_interv9'].setValue(null);
          this.modifForm.controls['acces_interv10'].setValue(null);
          this.modifForm.controls['acces_interv11'].setValue(null);
          this.modifForm.controls['acces_interv12'].setValue(null);
          this.modifForm.controls['acces_interv13'].setValue(null);
          this.modifForm.controls['acces_interv14'].setValue(null);
          this.modifForm.controls['acces_compagnie2'].setValue(null);
          this.modifForm.controls['acces_apporteur2'].setValue(null);
          this.modifForm.controls['acces_compagnie3'].setValue(null);
          this.modifForm.controls['acces_apporteur3'].setValue(null);
          this.modifForm.controls['acces_compagnie4'].setValue(null);
          this.modifForm.controls['acces_apporteur4'].setValue(null);
          this.modifForm.controls['acces_compagnie5'].setValue(null);
          this.modifForm.controls['acces_apporteur5'].setValue(null);
          this.modifForm.controls['acces_compagnie6'].setValue(null);
          this.modifForm.controls['acces_apporteur6'].setValue(null);
          this.modifForm.controls['acces_compagnie7'].setValue(null);
          this.modifForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.modifForm.controls['acces_interv3'].setValue(null);
    }
  }

  onFocusOutEventInterv34(event: any) {
    this.interv3 = this.modifForm.get("acces_interv3").value;
    this.interv4 = this.modifForm.get("acces_interv4").value;

    if (this.interv3 != null && this.interv4 != null) {
      if (this.interv3 >= this.interv4) {
        this.problemeInterv34 = true;
        this.erreur = true;
      } else {
        this.problemeInterv34 = false;
        this.erreur = false;
        if (this.interv4 != this.intervMax) {
          this.modifForm.controls['acces_interv5'].setValue(Number(this.interv4) + 1);
          this.nonAfficheInterv56 = false;
          this.nonAfficheInterv78 = false;
          this.nonAfficheInterv910 = false;
          this.nonAfficheInterv1112 = false;
          this.nonAfficheInterv1314 = false;
          this.valeurMaxAtteint4 = false;

          //=====================================================
          this.interv5 = this.modifForm.get("acces_interv5").value;
          if (this.interv4 < this.interv5) {
            this.problemeInterv5 = false;
            this.erreur = false;
          }
        } else {
          this.valeurMaxAtteint4 = true;
          this.valeurMaxAtteint2 = false;
          this.valeurMaxAtteint6 = false;
          this.valeurMaxAtteint8 = false;
          this.valeurMaxAtteint10 = false;
          this.valeurMaxAtteint12 = false;
          this.valeurMaxAtteint14 = false;
          this.nonAfficheInterv56 = true;
          this.nonAfficheInterv78 = true;
          this.nonAfficheInterv910 = true;
          this.nonAfficheInterv1112 = true;
          this.nonAfficheInterv1314 = true;
          this.modifForm.controls['acces_interv5'].setValue(null);
          this.modifForm.controls['acces_interv6'].setValue(null);
          this.modifForm.controls['acces_interv7'].setValue(null);
          this.modifForm.controls['acces_interv8'].setValue(null);
          this.modifForm.controls['acces_interv9'].setValue(null);
          this.modifForm.controls['acces_interv10'].setValue(null);
          this.modifForm.controls['acces_interv11'].setValue(null);
          this.modifForm.controls['acces_interv12'].setValue(null);
          this.modifForm.controls['acces_interv13'].setValue(null);
          this.modifForm.controls['acces_interv14'].setValue(null);
          this.modifForm.controls['acces_compagnie3'].setValue(null);
          this.modifForm.controls['acces_apporteur3'].setValue(null);
          this.modifForm.controls['acces_compagnie4'].setValue(null);
          this.modifForm.controls['acces_apporteur4'].setValue(null);
          this.modifForm.controls['acces_compagnie5'].setValue(null);
          this.modifForm.controls['acces_apporteur5'].setValue(null);
          this.modifForm.controls['acces_compagnie6'].setValue(null);
          this.modifForm.controls['acces_apporteur6'].setValue(null);
          this.modifForm.controls['acces_compagnie7'].setValue(null);
          this.modifForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.modifForm.controls['acces_interv5'].setValue(null);
      this.problemeInterv34 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv56(event: any) {
    this.interv5 = this.modifForm.get("acces_interv5").value;
    this.interv6 = this.modifForm.get("acces_interv6").value;
    if (this.interv5 != null && this.interv6 != null) {
      if (this.interv5 >= this.interv6) {
        this.problemeInterv56 = true;
        this.erreur = true;
      } else {
        this.problemeInterv56 = false;
        this.erreur = false;
        if (this.interv6 != this.intervMax) {
          this.modifForm.controls['acces_interv7'].setValue(Number(this.interv6) + 1);
          this.nonAfficheInterv78 = false;
          this.nonAfficheInterv910 = false;
          this.nonAfficheInterv1112 = false;
          this.nonAfficheInterv1314 = false;
          this.valeurMaxAtteint6 = false;

          //=====================================================
          this.interv7 = this.modifForm.get("acces_interv7").value;
          if (this.interv6 < this.interv7) {
            this.problemeInterv7 = false;
            this.erreur = false;
          }
        } else {
          this.valeurMaxAtteint6 = true;
          this.valeurMaxAtteint2 = false;
          this.valeurMaxAtteint4 = false;
          this.valeurMaxAtteint8 = false;
          this.valeurMaxAtteint10 = false;
          this.valeurMaxAtteint12 = false;
          this.valeurMaxAtteint14 = false;
          this.nonAfficheInterv78 = true;
          this.nonAfficheInterv910 = true;
          this.nonAfficheInterv1112 = true;
          this.nonAfficheInterv1314 = true;
          this.modifForm.controls['acces_interv7'].setValue(null);
          this.modifForm.controls['acces_interv8'].setValue(null);
          this.modifForm.controls['acces_interv9'].setValue(null);
          this.modifForm.controls['acces_interv10'].setValue(null);
          this.modifForm.controls['acces_interv11'].setValue(null);
          this.modifForm.controls['acces_interv12'].setValue(null);
          this.modifForm.controls['acces_interv13'].setValue(null);
          this.modifForm.controls['acces_interv14'].setValue(null);
          this.modifForm.controls['acces_compagnie4'].setValue(null);
          this.modifForm.controls['acces_apporteur4'].setValue(null);
          this.modifForm.controls['acces_compagnie5'].setValue(null);
          this.modifForm.controls['acces_apporteur5'].setValue(null);
          this.modifForm.controls['acces_compagnie6'].setValue(null);
          this.modifForm.controls['acces_apporteur6'].setValue(null);
          this.modifForm.controls['acces_compagnie7'].setValue(null);
          this.modifForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.modifForm.controls['acces_interv7'].setValue(null);
      this.problemeInterv56 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv78(event: any) {
    this.interv7 = this.modifForm.get("acces_interv7").value;
    this.interv8 = this.modifForm.get("acces_interv8").value;
    if (this.interv7 != null && this.interv8 != null) {
      if (this.interv7 >= this.interv8) {
        this.problemeInterv78 = true;
        this.erreur = true;
      } else {
        this.problemeInterv78 = false;
        this.erreur = false;
        if (this.interv8 != this.intervMax) {
          this.modifForm.controls['acces_interv9'].setValue(Number(this.interv8) + 1);
          this.nonAfficheInterv910 = false;
          this.nonAfficheInterv1112 = false;
          this.nonAfficheInterv1314 = false;
          this.valeurMaxAtteint8 = false;

          //=====================================================
          this.interv9 = this.modifForm.get("acces_interv9").value;
          if (this.interv8 < this.interv9) {
            this.problemeInterv9 = false;
            this.erreur = false;
          }
        } else {
          this.valeurMaxAtteint8 = true;
          this.valeurMaxAtteint2 = false;
          this.valeurMaxAtteint4 = false;
          this.valeurMaxAtteint6 = false;
          this.valeurMaxAtteint10 = false;
          this.valeurMaxAtteint12 = false;
          this.valeurMaxAtteint14 = false;
          this.nonAfficheInterv910 = true;
          this.nonAfficheInterv1112 = true;
          this.nonAfficheInterv1314 = true;
          this.modifForm.controls['acces_interv9'].setValue(null);
          this.modifForm.controls['acces_interv10'].setValue(null);
          this.modifForm.controls['acces_interv11'].setValue(null);
          this.modifForm.controls['acces_interv12'].setValue(null);
          this.modifForm.controls['acces_interv13'].setValue(null);
          this.modifForm.controls['acces_interv14'].setValue(null);
          this.modifForm.controls['acces_compagnie5'].setValue(null);
          this.modifForm.controls['acces_apporteur5'].setValue(null);
          this.modifForm.controls['acces_compagnie6'].setValue(null);
          this.modifForm.controls['acces_apporteur6'].setValue(null);
          this.modifForm.controls['acces_compagnie7'].setValue(null);
          this.modifForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.modifForm.controls['acces_interv9'].setValue(null);
      this.problemeInterv78 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv910(event: any) {
    this.interv9 = this.modifForm.get("acces_interv9").value;
    this.interv10 = this.modifForm.get("acces_interv10").value;
    if (this.interv9 != null && this.interv10 != null) {
      if (this.interv9 >= this.interv10) {
        this.problemeInterv910 = true;
        this.erreur = true;
      } else {
        this.problemeInterv910 = false;
        this.erreur = false;
        if (this.interv10 != this.intervMax) {
          this.modifForm.controls['acces_interv11'].setValue(Number(this.interv10) + 1);
          this.nonAfficheInterv1112 = false;
          this.nonAfficheInterv1314 = false;
          this.valeurMaxAtteint10 = false;

          //=====================================================
          this.interv11 = this.modifForm.get("acces_interv11").value;
          if (this.interv10 < this.interv11) {
            this.problemeInterv11 = false;
            this.erreur = false;
          }
        } else {
          this.valeurMaxAtteint10 = true;
          this.valeurMaxAtteint2 = false;
          this.valeurMaxAtteint4 = false;
          this.valeurMaxAtteint6 = false;
          this.valeurMaxAtteint8 = false;
          this.valeurMaxAtteint12 = false;
          this.valeurMaxAtteint14 = false;
          this.nonAfficheInterv1112 = true;
          this.nonAfficheInterv1314 = true;
          this.modifForm.controls['acces_interv11'].setValue(null);
          this.modifForm.controls['acces_interv12'].setValue(null);
          this.modifForm.controls['acces_interv13'].setValue(null);
          this.modifForm.controls['acces_interv14'].setValue(null);
          this.modifForm.controls['acces_compagnie6'].setValue(null);
          this.modifForm.controls['acces_apporteur6'].setValue(null);
          this.modifForm.controls['acces_compagnie7'].setValue(null);
          this.modifForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.modifForm.controls['acces_interv11'].setValue(null);
      this.problemeInterv910 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv1112(event: any) {
    this.interv11 = this.modifForm.get("acces_interv11").value;
    this.interv12 = this.modifForm.get("acces_interv12").value;
    if (this.interv11 != null && this.interv12 != null) {
      if (this.interv11 >= this.interv12) {
        this.problemeInterv1112 = true;
        this.erreur = true;
      } else {
        this.problemeInterv1112 = false;
        this.erreur = false;
        if (this.interv12 != this.intervMax) {
          this.modifForm.controls['acces_interv13'].setValue(Number(this.interv12) + 1);
          this.nonAfficheInterv1314 = false;
          this.valeurMaxAtteint12 = false;

          //=====================================================
          this.interv13 = this.modifForm.get("acces_interv13").value;
          if (this.interv12 < this.interv13) {
            this.problemeInterv13 = false;
            this.erreur = false;
          }
        } else {
          this.valeurMaxAtteint12 = true;
          this.valeurMaxAtteint2 = false;
          this.valeurMaxAtteint4 = false;
          this.valeurMaxAtteint6 = false;
          this.valeurMaxAtteint8 = false;
          this.valeurMaxAtteint10 = false;
          this.valeurMaxAtteint14 = false;
          this.nonAfficheInterv1314 = true;
          this.modifForm.controls['acces_interv13'].setValue(null);
          this.modifForm.controls['acces_interv14'].setValue(null);
          this.modifForm.controls['acces_compagnie7'].setValue(null);
          this.modifForm.controls['acces_apporteur7'].setValue(null);
        }
      }
    } else {
      this.modifForm.controls['acces_interv13'].setValue(null);
      this.problemeInterv1112 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv1314(event: any) {
    this.interv13 = this.modifForm.get("acces_interv13").value;
    this.interv14 = this.modifForm.get("acces_interv14").value;
    if (this.interv13 != null && this.interv14 != null) {
      if (this.interv13 >= this.interv14) {
        this.problemeInterv1314 = true;
        this.erreur = true;
      } else {
        this.problemeInterv1314 = false;
        this.erreur = false;

        // Gestion de la valeur max
        if (this.interv14 != this.intervMax) {
          this.valeurMaxAtteint14 = false;
        } else {
          this.valeurMaxAtteint14 = true;
          this.valeurMaxAtteint2 = false;
          this.valeurMaxAtteint4 = false;
          this.valeurMaxAtteint6 = false;
          this.valeurMaxAtteint8 = false;
          this.valeurMaxAtteint10 = false;
          this.valeurMaxAtteint12 = false;
        }
      }
    } else {
      this.problemeInterv1314 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv3(event: any) {
    this.interv2 = this.modifForm.get("acces_interv2").value;
    this.interv3 = this.modifForm.get("acces_interv3").value;
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
    this.interv4 = this.modifForm.get("acces_interv4").value;
    this.interv5 = this.modifForm.get("acces_interv5").value;
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
    this.interv6 = this.modifForm.get("acces_interv6").value;
    this.interv7 = this.modifForm.get("acces_interv7").value;
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
    this.interv8 = this.modifForm.get("acces_interv8").value;
    this.interv9 = this.modifForm.get("acces_interv9").value;
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
    this.interv10 = this.modifForm.get("acces_interv10").value;
    this.interv11 = this.modifForm.get("acces_interv11").value;
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
    this.interv12 = this.modifForm.get("acces_interv12").value;
    this.interv13 = this.modifForm.get("acces_interv13").value;
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
    this.interv1 = this.modifForm.get("acces_interv1").value;
    this.interv2 = this.modifForm.get("acces_interv2").value;
    // this.acces_compagnie1 = this.modifForm.get("acces_compagnie1").value;
    this.acces_compagnie1 = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.interv1 != null && this.interv2 != null && (this.acces_compagnie1 === null || this.acces_compagnie1 === "")) {
      this.modifForm.controls['acces_compagnie1'].setValue(0);
      this.acces_compagnie1 = 0;
      // this.problemeCompagnie1 = true;
      // this.erreur = true;
    } else {
      this.acces_compagnie1 = Number(this.formatNumberService.replaceAll(this.acces_compagnie1, ' ', ''));
      this.modifForm.get("acces_compagnie1").setValue(this.acces_compagnie1);
      this.acces_compagnie1 = this.formatNumberService.numberWithCommas2(this.acces_compagnie1);
      // this.problemeCompagnie1 = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventCompagnie2(event: any) {
    this.interv3 = this.modifForm.get("acces_interv3").value;
    this.interv4 = this.modifForm.get("acces_interv4").value;
    // this.acces_compagnie2 = this.modifForm.get("acces_compagnie2").value;
    this.acces_compagnie2 = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.interv3 != null && this.interv4 != null && (this.acces_compagnie2 === null || this.acces_compagnie2 === "")) {
      this.modifForm.controls['acces_compagnie2'].setValue(0);
      this.acces_compagnie2 = 0;
      // this.problemeCompagnie2 = true;
      // this.erreur = true;
    } else {
      this.acces_compagnie2 = Number(this.formatNumberService.replaceAll(this.acces_compagnie2, ' ', ''));
      this.modifForm.get("acces_compagnie2").setValue(this.acces_compagnie2);
      this.acces_compagnie2 = this.formatNumberService.numberWithCommas2(this.acces_compagnie2);
      // this.problemeCompagnie2 = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventCompagnie3(event: any) {
    this.interv5 = this.modifForm.get("acces_interv5").value;
    this.interv6 = this.modifForm.get("acces_interv6").value;
    // this.acces_compagnie3 = this.modifForm.get("acces_compagnie3").value;
    this.acces_compagnie3 = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.interv5 != null && this.interv6 != null && (this.acces_compagnie3 === null || this.acces_compagnie3 === "")) {
      this.modifForm.controls['acces_compagnie3'].setValue(0);
      this.acces_compagnie3 = 0;
      // this.problemeCompagnie3 = true;
      // this.erreur = true;
    } else {
      this.acces_compagnie3 = Number(this.formatNumberService.replaceAll(this.acces_compagnie3, ' ', ''));
      this.modifForm.get("acces_compagnie3").setValue(this.acces_compagnie3);
      this.acces_compagnie3 = this.formatNumberService.numberWithCommas2(this.acces_compagnie3);
      // this.problemeCompagnie3 = false;
      // this.erreur = false;
    }
  }
  onFocusOutEventCompagnie4(event: any) {
    this.interv7 = this.modifForm.get("acces_interv7").value;
    this.interv8 = this.modifForm.get("acces_interv8").value;
    // this.acces_compagnie4 = this.modifForm.get("acces_compagnie4").value;
    this.acces_compagnie4 = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.interv7 != null && this.interv8 != null && (this.acces_compagnie4 === null || this.acces_compagnie4 === "")) {
      this.modifForm.controls['acces_compagnie4'].setValue(0);
      this.acces_compagnie4 = 0;
      // this.problemeCompagnie4 = true;
      // this.erreur = true;
    } else {
      this.acces_compagnie4 = Number(this.formatNumberService.replaceAll(this.acces_compagnie4, ' ', ''));
      this.modifForm.get("acces_compagnie4").setValue(this.acces_compagnie4);
      this.acces_compagnie4 = this.formatNumberService.numberWithCommas2(this.acces_compagnie4);
      // this.problemeCompagnie4 = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventCompagnie5(event: any) {
    this.interv9 = this.modifForm.get("acces_interv9").value;
    this.interv10 = this.modifForm.get("acces_interv10").value;
    // this.acces_compagnie5 = this.modifForm.get("acces_compagnie5").value;
    this.acces_compagnie5 = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.interv9 != null && this.interv10 != null && (this.acces_compagnie5 === null || this.acces_compagnie5 === "")) {
      this.modifForm.controls['acces_compagnie5'].setValue(0);
      this.acces_compagnie5 = 0;
      // this.problemeCompagnie5 = true;
      // this.erreur = true;
    } else {
      this.acces_compagnie5 = Number(this.formatNumberService.replaceAll(this.acces_compagnie5, ' ', ''));
      this.modifForm.get("acces_compagnie5").setValue(this.acces_compagnie5);
      this.acces_compagnie5 = this.formatNumberService.numberWithCommas2(this.acces_compagnie5);
      // this.problemeCompagnie5 = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventCompagnie6(event: any) {
    this.interv11 = this.modifForm.get("acces_interv11").value;
    this.interv12 = this.modifForm.get("acces_interv12").value;
    // this.acces_compagnie6 = this.modifForm.get("acces_compagnie6").value;
    this.acces_compagnie6 = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.interv11 != null && this.interv12 != null && (this.acces_compagnie6 === null || this.acces_compagnie6 === "")) {
      this.modifForm.controls['acces_compagnie6'].setValue(0);
      this.acces_compagnie6 = 0;
      // this.problemeCompagnie6 = true;
      // this.erreur = true;
    } else {
      this.acces_compagnie6 = Number(this.formatNumberService.replaceAll(this.acces_compagnie6, ' ', ''));
      this.modifForm.get("acces_compagnie6").setValue(this.acces_compagnie6);
      this.acces_compagnie6 = this.formatNumberService.numberWithCommas2(this.acces_compagnie6);
      // this.problemeCompagnie6 = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventCompagnie7(event: any) {
    this.interv13 = this.modifForm.get("acces_interv13").value;
    this.interv14 = this.modifForm.get("acces_interv14").value;
    // this.acces_compagnie7 = this.modifForm.get("acces_compagnie7").value;
    this.acces_compagnie7 = this.formatNumberService.replaceAll(event.target.value, ' ', '');
    if (this.interv13 != null && this.interv14 != null && (this.acces_compagnie7 === null || this.acces_compagnie7 === "")) {
      this.modifForm.controls['acces_compagnie7'].setValue(0);
      this.acces_compagnie7 = 0;
      // this.problemeCompagnie7 = true;
      // this.erreur = true;
    } else {
      this.acces_compagnie7 = Number(this.formatNumberService.replaceAll(this.acces_compagnie7, ' ', ''));
      this.modifForm.get("acces_compagnie7").setValue(this.acces_compagnie7);
      this.acces_compagnie7 = this.formatNumberService.numberWithCommas2(this.acces_compagnie7);
      // this.problemeCompagnie7 = false;
      // this.erreur = false;
    }
  }

  onFocusOutEventDate(event: any) {
    this.datePriseEffetRecupere = this.modifForm.get("acces_datepriseffet").value;
    this.dateFinEffetRecupere = this.modifForm.get("acces_datefineffet").value;
    if (this.datePriseEffetRecupere != null && this.dateFinEffetRecupere != null) {
      if (this.datePriseEffetRecupere > this.dateFinEffetRecupere) {
        this.problemeDate = true;
        this.erreur = true;
      } else {
        this.problemeDate = false;
        this.erreur = false;
      }
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

  getColorDate() {
    if (this.problemeDate) {
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
