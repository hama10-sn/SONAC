import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbDialogRef, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Branche } from '../../../../../model/Branche';
import { Categorie } from '../../../../../model/Categorie';
import { Intermediaire } from '../../../../../model/Intermediaire';
import { Produit } from '../../../../../model/Produit';
import { BrancheService } from '../../../../../services/branche.service';
import { CategorieService } from '../../../../../services/categorie.service';
import { CommissionService } from '../../../../../services/commission.service';
import { IntermediaireService } from '../../../../../services/intermediaire.service';
import { ProduitService } from '../../../../../services/produit.service';
import dateFormatter from 'date-format-conversion';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { FormatNumberService } from '../../../../../services/formatNumber.service';

@Component({
  selector: 'ngx-add-commission',
  templateUrl: './add-commission.component.html',
  styleUrls: ['./add-commission.component.scss']
})
export class AddCommissionComponent implements OnInit {

  addForm = this.fb.group({

    comm_code: ['', [Validators.required]],
    comm_codeapporteur: ['', [Validators.required]],
    comm_codebranche: ['', [Validators.required]],
    comm_codecategorie: ['', [Validators.required]],
    comm_codeproduit: ['', [Validators.required]],
    comm_codegarantie: [''],
    comm_typecalcul: ['', [Validators.required]],
    comm_interv1: ['', [Validators.required]],
    comm_interv2: ['', [Validators.required]],
    comm_interv3: [''],
    comm_interv4: [''],
    comm_interv5: [''],
    comm_interv6: [''],
    comm_interv7: [''],
    comm_interv8: [''],
    comm_interv9: [''],
    comm_interv10: [''],
    comm_tauxcommission12: [''],
    comm_montantforfait12: [''],
    comm_tauxcommission34: [''],
    comm_montantforfait34: [''],
    comm_tauxcommission56: [''],
    comm_montantforfait56: [''],
    comm_tauxcommission78: [''],
    comm_montantforfait78: [''],
    comm_tauxcommission910: [''],
    comm_montantforfait910: [''],
    comm_datepriseffet: ['', [Validators.required]],
    comm_datefineffet: [''],
  });

  //commission_typeCalcul = "2" ; // Valeur par defaut

  typeCalculChoisi: string;
  typeCalcul1 = '1';
  typeCalcul2 = '2';

  // Variables booléan pour gerer le problème de controle de saisi
  problemeInterv1: boolean = false;
  problemeInterv2: boolean = false;
  problemeInterv3: boolean = false;
  problemeInterv5: boolean = false;
  problemeInterv7: boolean = false;
  problemeInterv9: boolean = false;

  problemeDate: boolean = false;
  problemeTypeCalcul1: boolean = false;
  problemeTypeCalcul2: boolean = false;
  problemeInterv12: boolean = false;
  problemeInterv34: boolean = false;
  problemeInterv56: boolean = false;
  problemeInterv78: boolean = false;
  problemeInterv910: boolean = false;
  problemeTaux12: boolean = false;
  problemeMontant12: boolean = false;
  problemeTaux34: boolean = false;
  problemeMontant34: boolean = false;
  problemeTaux56: boolean = false;
  problemeMontant56: boolean = false;
  problemeTaux78: boolean = false;
  problemeMontant78: boolean = false;
  problemeTaux910: boolean = false;
  problemeMontant910: boolean = false;

  erreur: boolean = false;

  // Les variables à gerer pour type calcul = 2
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
  montantForfait12: number;
  montantForfait34: number;
  montantForfait56: number;
  montantForfait78: number;
  montantForfait910: number;

  // Variable à gerer pour type calcul = 1
  tauxCommission12: number;
  tauxCommission34: number;
  tauxCommission56: number;
  tauxCommission78: number;
  tauxCommission910: number;


  // La gestion des clés étrangères
  listeCodeBranche: any[];
  listeNumeroCategorie: any[];
  listeNumeroIntermediaire: any[];
  listeCodeProduit: any[];

  numCategChoisi: number;
  codeApporteurChoisi: number;
  //codeGarantieChoisi: number ;
  codeProduitChoisi: number;
  numConcat: number;

  // Proposer la date du jour sur le formulaire
  date_comptabilisation: Date;

  // Vider les champs catgorie et produit quand on change Branche:
  comm_categorie: any;
  comm_produit: any;

  intervMax = 99999999999;
  
  // Interdire l'accès sur les autres tags s'il y'a un hight value
  nonAfficheInterv34: boolean = false ;
  nonAfficheInterv56: boolean = false ;
  nonAfficheInterv78: boolean = false ;
  nonAfficheInterv910: boolean = false ;

  // Affichage du message indiquant que la valeur max est atteinte
  valeurMaxAtteint2: boolean = false ;
  valeurMaxAtteint4: boolean = false ;
  valeurMaxAtteint6: boolean = false ;
  valeurMaxAtteint8: boolean = false ;
  valeurMaxAtteint10: boolean = false ;

  autorisation = [];

  // Gestion du hight value sur la date:
  comm_datefineffet: Date ;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  constructor(private fb: FormBuilder,
    private brancheService: BrancheService,
    private categorieService: CategorieService,
    private commissionService: CommissionService,
    private interService: IntermediaireService,
    private produitService: ProduitService,
    private formatNumberService: FormatNumberService,
    private toastrService: NbToastrService,
    private authService: NbAuthService,
    private router: Router) {
  }

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
    this.addForm.controls['comm_datepriseffet'].setValue(this.date_comptabilisation);

    // On met les champs suivants à null pour qu'ils soient de type object et facilté le controle de saisi
    this.addForm.controls['comm_interv1'].setValue(1);
    this.addForm.controls['comm_interv2'].setValue(null);
    this.addForm.controls['comm_interv3'].setValue(null);
    this.addForm.controls['comm_interv4'].setValue(null);
    this.addForm.controls['comm_interv5'].setValue(null);
    this.addForm.controls['comm_interv6'].setValue(null);
    this.addForm.controls['comm_interv7'].setValue(null);
    this.addForm.controls['comm_interv8'].setValue(null);
    this.addForm.controls['comm_interv9'].setValue(null);
    this.addForm.controls['comm_interv10'].setValue(null);
    this.addForm.controls['comm_tauxcommission12'].setValue(null);
    this.addForm.controls['comm_montantforfait12'].setValue(null);
    this.addForm.controls['comm_tauxcommission34'].setValue(null);
    this.addForm.controls['comm_montantforfait34'].setValue(null);
    this.addForm.controls['comm_tauxcommission56'].setValue(null);
    this.addForm.controls['comm_montantforfait56'].setValue(null);
    this.addForm.controls['comm_tauxcommission78'].setValue(null);
    this.addForm.controls['comm_montantforfait78'].setValue(null);
    this.addForm.controls['comm_tauxcommission910'].setValue(null);
    this.addForm.controls['comm_montantforfait910'].setValue(null);

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

  onGetAllIntermediaires() {
    this.interService.getAllIntermediaires()
      .subscribe((data: Intermediaire[]) => {
        this.listeNumeroIntermediaire = data as Intermediaire[];
      });
  }

  onChange(event) {
    this.addForm.controls['comm_typecalcul'].setValue(event);
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;

    if (this.typeCalculChoisi === this.typeCalcul2) {
      this.problemeTaux12 = false;
      this.problemeTaux34 = false;
      this.problemeTaux56 = false;
      this.problemeTaux78 = false;
      this.problemeTaux910 = false;
      this.erreur = false;

      // On met les taux à zéro
      this.addForm.controls['comm_tauxcommission12'].setValue(0);
      this.addForm.controls['comm_tauxcommission34'].setValue(0);
      this.addForm.controls['comm_tauxcommission56'].setValue(0);
      this.addForm.controls['comm_tauxcommission78'].setValue(0);
      this.addForm.controls['comm_tauxcommission910'].setValue(0);
    } else if (this.typeCalculChoisi === this.typeCalcul1) {
      this.problemeMontant12 = false;
      this.problemeMontant34 = false;
      this.problemeMontant56 = false;
      this.problemeMontant78 = false;
      this.problemeMontant910 = false;
      this.erreur = false;

      // On met les montants forfait à zéro
      this.addForm.controls['comm_montantforfait12'].setValue(0);
      this.addForm.controls['comm_montantforfait34'].setValue(0);
      this.addForm.controls['comm_montantforfait56'].setValue(0);
      this.addForm.controls['comm_montantforfait78'].setValue(0);
      this.addForm.controls['comm_montantforfait910'].setValue(0);
    }
  }

  onChangeApporteur(event) {
    this.codeApporteurChoisi = event;
    this.addForm.controls['comm_codeapporteur'].setValue(event);

    if (this.codeProduitChoisi != null) {
      this.numConcat = this.codeApporteurChoisi + this.codeProduitChoisi;
      this.addForm.controls['comm_code'].setValue(this.numConcat.toString());
    }
  }

  onChangeBranche(event) {

    this.onGetAllCategorieByBranche(event);
    this.addForm.controls['comm_codebranche'].setValue(event);


    this.comm_categorie = "".toString();
    this.comm_produit = "".toString();
    this.addForm.controls['comm_codecategorie'].setValue(this.comm_categorie);
    this.addForm.controls['comm_codeproduit'].setValue(this.comm_produit);
  }

  onChangeCategorie(event) {
    this.onGetAllProduitByCategorie(event);
    this.numCategChoisi = event;
    this.addForm.controls['comm_codecategorie'].setValue(event);

    this.comm_produit = "".toString();
    this.addForm.controls['comm_codeproduit'].setValue(this.comm_produit);
  }

  onChangeProduit(event) {
    this.codeProduitChoisi = event;
    this.addForm.controls['comm_codeproduit'].setValue(event);

    this.numConcat = this.codeApporteurChoisi + event;

    this.addForm.controls['comm_code'].setValue(this.numConcat.toString());

    // if(event === "9999"){
    //   this.addForm.controls['comm_interv1'].setValue(1);
    //   this.addForm.controls['comm_interv2'].setValue(9999999);
    // }
  }

  // onChangeGarantie(event) {

  //   this.codeGarantieChoisi = event ;
  //   this.addForm.controls['comm_codegarantie'].setValue(event);

  //   this.numConcat = this.codeApporteurChoisi + this.numCategChoisi + event ;

  //   this.addForm.controls['comm_code'].setValue(this.numConcat.toString());

  //   if(event === "9999"){
  //     this.addForm.controls['comm_interv1'].setValue(1);
  //     this.addForm.controls['comm_interv2'].setValue(9999999);
  //   }

  //   //console.log("num concat: "+ this.numConcat) ;

  //   // this.commissionService.lastID(this.numCategChoisi, this.codeApporteurChoisi, this.codeGarantieChoisi)
  //   //   .subscribe((data)=>{
  //   //     if(data==0){
  //   //       this.addForm.controls['comm_code'].setValue(this.numConcat.toString()+"001");
  //   //     }else{
  //   //       this.addForm.controls['comm_code'].setValue(Number(data)+1);
  //   //     }
  //   //   })
  // }

  onCancel() {
    this.router.navigateByUrl('home/parametrage-systeme/commission');
  }

  onSubmit() {

    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;

    this.interv1 = this.addForm.get("comm_interv1").value;
    this.interv2 = this.addForm.get("comm_interv2").value;
    this.interv3 = this.addForm.get("comm_interv3").value;
    this.interv4 = this.addForm.get("comm_interv4").value;
    this.interv5 = this.addForm.get("comm_interv5").value;
    this.interv6 = this.addForm.get("comm_interv6").value;
    this.interv7 = this.addForm.get("comm_interv7").value;
    this.interv8 = this.addForm.get("comm_interv8").value;
    this.interv9 = this.addForm.get("comm_interv9").value;
    this.interv10 = this.addForm.get("comm_interv10").value;
    this.montantForfait12 = this.addForm.get("comm_montantforfait12").value;
    this.montantForfait34 = this.addForm.get("comm_montantforfait34").value;
    this.montantForfait56 = this.addForm.get("comm_montantforfait56").value;
    this.montantForfait78 = this.addForm.get("comm_montantforfait78").value;
    this.montantForfait910 = this.addForm.get("comm_montantforfait910").value;

    this.tauxCommission12 = this.addForm.get("comm_tauxcommission12").value;
    this.tauxCommission34 = this.addForm.get("comm_tauxcommission34").value;
    this.tauxCommission56 = this.addForm.get("comm_tauxcommission56").value;
    this.tauxCommission78 = this.addForm.get("comm_tauxcommission78").value;
    this.tauxCommission910 = this.addForm.get("comm_tauxcommission910").value;

    // on gere le taux pour type calcul = 1
    if (this.typeCalculChoisi === this.typeCalcul1 && this.interv1 != null && this.interv2 != null && this.tauxCommission12 === null) {
      this.problemeTaux12 = true;
      this.problemeTaux34 = false;
      this.problemeTaux56 = false;
      this.problemeTaux78 = false;
      this.problemeTaux910 = false;
      this.erreur = true;
    }
    else if (this.typeCalculChoisi === this.typeCalcul1 && this.interv3 != null && this.interv4 != null && this.tauxCommission34 === null) {
      this.problemeTaux34 = true;
      this.problemeTaux12 = false;
      this.problemeTaux56 = false;
      this.problemeTaux78 = false;
      this.problemeTaux910 = false;
      this.erreur = true
    }
    else if (this.typeCalculChoisi === this.typeCalcul1 && this.interv5 != null && this.interv6 != null && this.tauxCommission56 === null) {
      this.problemeTaux56 = true;
      this.problemeTaux12 = false;
      this.problemeTaux34 = false;
      this.problemeTaux78 = false;
      this.problemeTaux910 = false;
      this.erreur = true
    }
    else if (this.typeCalculChoisi === this.typeCalcul1 && this.interv7 != null && this.interv8 != null && this.tauxCommission78 === null) {
      this.problemeTaux78 = true;
      this.problemeTaux12 = false;
      this.problemeTaux34 = false;
      this.problemeTaux56 = false;
      this.problemeTaux910 = false;
      this.erreur = true
    }
    else if (this.typeCalculChoisi === this.typeCalcul1 && this.interv9 != null && this.interv10 != null && this.tauxCommission910 === null) {
      this.problemeTaux910 = true;
      this.problemeTaux12 = false;
      this.problemeTaux34 = false;
      this.problemeTaux56 = false;
      this.problemeTaux78 = false;
      this.erreur = true
    }
    // On gère le montant forfait pour type calcul = 2
    else if (this.typeCalculChoisi === this.typeCalcul2 && this.interv1 != null && this.interv2 != null && this.montantForfait12 === null) {
      this.problemeMontant12 = true;
      this.problemeMontant34 = false;
      this.problemeMontant56 = false;
      this.problemeMontant78 = false;
      this.problemeMontant910 = false;
      this.erreur = true;
    }
    else if (this.typeCalculChoisi === this.typeCalcul2 && this.interv3 != null && this.interv4 != null && this.montantForfait34 === null) {
      this.problemeMontant34 = true;
      this.problemeMontant12 = false;
      this.problemeMontant56 = false;
      this.problemeMontant78 = false;
      this.problemeMontant910 = false;
      this.erreur = true
    }
    else if (this.typeCalculChoisi === this.typeCalcul2 && this.interv5 != null && this.interv6 != null && this.montantForfait56 === null) {
      this.problemeMontant56 = true;
      this.problemeMontant12 = false;
      this.problemeMontant34 = false;
      this.problemeMontant78 = false;
      this.problemeMontant910 = false;
      this.erreur = true
    }
    else if (this.typeCalculChoisi === this.typeCalcul2 && this.interv7 != null && this.interv8 != null && this.montantForfait78 === null) {
      this.problemeMontant78 = true;
      this.problemeMontant12 = false;
      this.problemeMontant34 = false;
      this.problemeMontant56 = false;
      this.problemeMontant910 = false;
      this.erreur = true
    }
    else if (this.typeCalculChoisi === this.typeCalcul2 && this.interv9 != null && this.interv10 != null && this.montantForfait910 === null) {
      this.problemeMontant910 = true;
      this.problemeMontant12 = false;
      this.problemeMontant34 = false;
      this.problemeMontant56 = false;
      this.problemeMontant78 = false;
      this.erreur = true
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
    else {
      this.addForm.controls['comm_codegarantie'].setValue(9999);
      this.comm_datefineffet = dateFormatter(new Date(9998, 12, 31),'yyyy-MM-ddThh:mm');
      this.addForm.controls['comm_datefineffet'].setValue(this.comm_datefineffet);
      this.commissionService.addCommission(this.addForm.value)
        .subscribe((data) => {
          this.toastrService.show(
            'commission enregistrée avec succès !',
            'Notification',
            {
              status: this.statusSuccess,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
          this.router.navigateByUrl('home/parametrage-systeme/commission');
        },
          (error) => {
            this.toastrService.show(
              //"Echec de l'ajout de la commission: Vérifier si le code de la commission n'existe pas déjà",
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

  onFocusOutEventInterv12(event: any) {
    this.interv1 = this.addForm.get("comm_interv1").value;
    this.interv2 = this.addForm.get("comm_interv2").value;

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
          this.addForm.controls['comm_interv3'].setValue(Number(this.interv2) + 1);
          this.nonAfficheInterv34 = false ;
          this.nonAfficheInterv56 = false ;
          this.nonAfficheInterv78 = false ;
          this.nonAfficheInterv910 = false ;
          this.valeurMaxAtteint2 = false ;

          //=====================================================
          this.interv3 = this.addForm.get("comm_interv3").value;
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
          this.nonAfficheInterv34 = true
          this.nonAfficheInterv56 = true ;
          this.nonAfficheInterv78 = true ;
          this.nonAfficheInterv910 = true ;
          this.addForm.controls['comm_interv3'].setValue(null);
          this.addForm.controls['comm_interv4'].setValue(null);
          this.addForm.controls['comm_interv5'].setValue(null);
          this.addForm.controls['comm_interv6'].setValue(null);
          this.addForm.controls['comm_interv7'].setValue(null);
          this.addForm.controls['comm_interv8'].setValue(null);
          this.addForm.controls['comm_interv9'].setValue(null);
          this.addForm.controls['comm_interv10'].setValue(null);
          this.addForm.controls['comm_tauxcommission34'].setValue(null);
          this.addForm.controls['comm_montantforfait34'].setValue(null);
          this.addForm.controls['comm_tauxcommission56'].setValue(null);
          this.addForm.controls['comm_montantforfait56'].setValue(null);
          this.addForm.controls['comm_tauxcommission78'].setValue(null);
          this.addForm.controls['comm_montantforfait78'].setValue(null);
          this.addForm.controls['comm_tauxcommission910'].setValue(null);
          this.addForm.controls['comm_montantforfait910'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['comm_interv3'].setValue(null);
    }
  }

  onFocusOutEventInterv34(event: any) {
    this.interv3 = this.addForm.get("comm_interv3").value;
    this.interv4 = this.addForm.get("comm_interv4").value;

    if (this.interv3 != null && this.interv4 != null) {
      if (this.interv3 >= this.interv4) {
        this.problemeInterv34 = true;
        this.erreur = true;
      } else {
        this.problemeInterv34 = false;
        this.erreur = false;
        if (this.interv4 != this.intervMax) {
          this.addForm.controls['comm_interv5'].setValue(Number(this.interv4) + 1);
          this.nonAfficheInterv56 = false ;
          this.nonAfficheInterv78 = false ;
          this.nonAfficheInterv910 = false ;
          this.valeurMaxAtteint4 = false ;

          //=====================================================
          this.interv5 = this.addForm.get("comm_interv5").value;
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
          this.nonAfficheInterv56 = true ;
          this.nonAfficheInterv78 = true ;
          this.nonAfficheInterv910 = true ;
          this.addForm.controls['comm_interv5'].setValue(null);
          this.addForm.controls['comm_interv6'].setValue(null);
          this.addForm.controls['comm_interv7'].setValue(null);
          this.addForm.controls['comm_interv8'].setValue(null);
          this.addForm.controls['comm_interv9'].setValue(null);
          this.addForm.controls['comm_interv10'].setValue(null);
          this.addForm.controls['comm_tauxcommission56'].setValue(null);
          this.addForm.controls['comm_montantforfait56'].setValue(null);
          this.addForm.controls['comm_tauxcommission78'].setValue(null);
          this.addForm.controls['comm_montantforfait78'].setValue(null);
          this.addForm.controls['comm_tauxcommission910'].setValue(null);
          this.addForm.controls['comm_montantforfait910'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['comm_interv5'].setValue(null);
      this.problemeInterv34 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv56(event: any) {
    this.interv5 = this.addForm.get("comm_interv5").value;
    this.interv6 = this.addForm.get("comm_interv6").value;
    if (this.interv5 != null && this.interv6 != null) {
      if (this.interv5 >= this.interv6) {
        this.problemeInterv56 = true;
        this.erreur = true;
      } else {
        this.problemeInterv56 = false;
        this.erreur = false;
        if (this.interv6 != this.intervMax) {
          this.addForm.controls['comm_interv7'].setValue(Number(this.interv6) + 1);
          this.nonAfficheInterv78 = false ;
          this.nonAfficheInterv910 = false ;
          this.valeurMaxAtteint6 = false ;

          //=====================================================
          this.interv7 = this.addForm.get("comm_interv7").value;
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
          this.nonAfficheInterv78 = true ;
          this.nonAfficheInterv910 = true ;
          this.addForm.controls['comm_interv7'].setValue(null);
          this.addForm.controls['comm_interv8'].setValue(null);
          this.addForm.controls['comm_interv9'].setValue(null);
          this.addForm.controls['comm_interv10'].setValue(null);
          this.addForm.controls['comm_tauxcommission78'].setValue(null);
          this.addForm.controls['comm_montantforfait78'].setValue(null);
          this.addForm.controls['comm_tauxcommission910'].setValue(null);
          this.addForm.controls['comm_montantforfait910'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['comm_interv7'].setValue(null);
      this.problemeInterv56 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv78(event: any) {
    this.interv7 = this.addForm.get("comm_interv7").value;
    this.interv8 = this.addForm.get("comm_interv8").value;
    if (this.interv7 != null && this.interv8 != null) {
      if (this.interv7 >= this.interv8) {
        this.problemeInterv78 = true;
        this.erreur = true;
      } else {
        this.problemeInterv78 = false;
        this.erreur = false;
        if (this.interv8 != this.intervMax) {
          this.addForm.controls['comm_interv9'].setValue(Number(this.interv8) + 1);
          this.nonAfficheInterv910 = false ;
          this.valeurMaxAtteint8 = false ;

          //=====================================================
          this.interv9 = this.addForm.get("comm_interv9").value;
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
          this.nonAfficheInterv910 = true ;
          this.addForm.controls['comm_interv9'].setValue(null);
          this.addForm.controls['comm_interv10'].setValue(null);
          this.addForm.controls['comm_tauxcommission910'].setValue(null);
          this.addForm.controls['comm_montantforfait910'].setValue(null);
        }
      }
    } else {
      this.addForm.controls['comm_interv9'].setValue(null);
      this.problemeInterv78 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv910(event: any) {
    this.interv9 = this.addForm.get("comm_interv9").value;
    this.interv10 = this.addForm.get("comm_interv10").value;
    if (this.interv9 != null && this.interv10 != null) {
      if (this.interv9 >= this.interv10) {
        this.problemeInterv910 = true;
        this.erreur = true;
      } else {
        this.problemeInterv910 = false;
        this.erreur = false;

        // Gestion de la valeur max
        if (this.interv10 != this.intervMax) {
          this.valeurMaxAtteint10 = false ;
        } else {
          this.valeurMaxAtteint10 = true ;
          this.valeurMaxAtteint2 = false ;
          this.valeurMaxAtteint4 = false ;
          this.valeurMaxAtteint6 = false ;
          this.valeurMaxAtteint8 = false ;
        }
      }
    } else {
      this.problemeInterv910 = false;
      this.erreur = false;
    }
  }

  onFocusOutEventInterv3(event: any) {
    this.interv2 = this.addForm.get("comm_interv2").value;
    this.interv3 = this.addForm.get("comm_interv3").value;
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
    this.interv4 = this.addForm.get("comm_interv4").value;
    this.interv5 = this.addForm.get("comm_interv5").value;
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
    this.interv6 = this.addForm.get("comm_interv6").value;
    this.interv7 = this.addForm.get("comm_interv7").value;
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
    this.interv8 = this.addForm.get("comm_interv8").value;
    this.interv9 = this.addForm.get("comm_interv9").value;
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

//   numberWithCommas(x) {
//     var parts = x.toString().split(".");
//     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return parts.join(".");
// }

  onFocusOutEventTaux12(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv1 = this.addForm.get("comm_interv1").value;
    this.interv2 = this.addForm.get("comm_interv2").value;
    this.tauxCommission12 = this.addForm.get("comm_tauxcommission12").value;
    if (this.typeCalculChoisi === this.typeCalcul1 && this.interv1 != null && this.interv2 != null 
        && (this.tauxCommission12 === null || this.tauxCommission12 < 0 || this.tauxCommission12 > 100)) {
      this.problemeTaux12 = true;
      this.erreur = true;
    } else {
      this.problemeTaux12 = false;
      this.erreur = false;
      this.addForm.controls['comm_tauxcommission12'].setValue(this.tauxCommission12.toFixed(3)) ;

      // Placer la virgule après la saisie du taux
      //this.numberWithCommas(this.tauxCommission12);
      //console.log( this.numberWithCommas(this.tauxCommission12));
     //this.recupChiffre=this.numberWithCommas(this.chiffrAmarche);
     //this.addForm.controls['comp_camarche'].setValue(this.numberWithCommas(this.chiffrAmarche));
     //console.log(Number(this.replaceAll((this.addForm.get("comp_camarche").value),'.','')));
    }

  }

  onFocusOutEventMontant12(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv1 = this.addForm.get("comm_interv1").value;
    this.interv2 = this.addForm.get("comm_interv2").value;
    this.montantForfait12 = this.addForm.get("comm_montantforfait12").value;
    if (this.typeCalculChoisi === this.typeCalcul2 && this.interv1 != null && this.interv2 != null && this.montantForfait12 === null) {
      this.problemeMontant12 = true;
      this.erreur = true;
    } else {
      this.problemeMontant12 = false;
      this.erreur = false;

      this.montantForfait12 = Number(this.formatNumberService.replaceAll(this.montantForfait12, ' ', ''));
      this.montantForfait12 = this.formatNumberService.numberWithCommas2(this.montantForfait12);
    }
  }

  onFocusOutEventTaux34(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv3 = this.addForm.get("comm_interv3").value;
    this.interv4 = this.addForm.get("comm_interv4").value;
    this.tauxCommission34 = this.addForm.get("comm_tauxcommission34").value;
    if (this.typeCalculChoisi === this.typeCalcul1 && this.interv3 != null && this.interv4 != null 
        && (this.tauxCommission34 === null || this.tauxCommission34 < 0 || this.tauxCommission34 > 100)) {
      this.problemeTaux34 = true;
      this.erreur = true;
    } else {
      this.problemeTaux34 = false;
      this.erreur = false;

      this.addForm.controls['comm_tauxcommission34'].setValue(this.tauxCommission34.toFixed(3)) ;
    }
  }

  onFocusOutEventMontant34(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv3 = this.addForm.get("comm_interv3").value;
    this.interv4 = this.addForm.get("comm_interv4").value;
    this.montantForfait34 = this.addForm.get("comm_montantforfait34").value;
    if (this.typeCalculChoisi === this.typeCalcul2 && this.interv3 != null && this.interv4 != null && this.montantForfait34 === null) {
      this.problemeMontant34 = true;
      this.erreur = true;
    } else {
      this.problemeMontant34 = false;
      this.erreur = false;

      this.montantForfait34 = Number(this.formatNumberService.replaceAll(this.montantForfait34, ' ', ''));
      this.montantForfait34 = this.formatNumberService.numberWithCommas2(this.montantForfait34);
    }
  }

  onFocusOutEventTaux56(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv5 = this.addForm.get("comm_interv5").value;
    this.interv6 = this.addForm.get("comm_interv6").value;
    this.tauxCommission56 = this.addForm.get("comm_tauxcommission56").value;
    if (this.typeCalculChoisi === this.typeCalcul1 && this.interv5 != null && this.interv6 != null 
        && (this.tauxCommission56 === null || this.tauxCommission56 < 0 || this.tauxCommission56 > 100)) {
      this.problemeTaux56 = true;
      this.erreur = true;
    } else {
      this.problemeTaux56 = false;
      this.erreur = false;

      this.addForm.controls['comm_tauxcommission56'].setValue(this.tauxCommission56.toFixed(3)) ;
    }
  }

  onFocusOutEventMontant56(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv5 = this.addForm.get("comm_interv5").value;
    this.interv6 = this.addForm.get("comm_interv6").value;
    this.montantForfait56 = this.addForm.get("comm_montantforfait56").value;
    if (this.typeCalculChoisi === this.typeCalcul2 && this.interv5 != null && this.interv5 != null && this.montantForfait56 === null) {
      this.problemeMontant56 = true;
      this.erreur = true;
    } else {
      this.problemeMontant56 = false;
      this.erreur = false;

      this.montantForfait56 = Number(this.formatNumberService.replaceAll(this.montantForfait56, ' ', ''));
      this.montantForfait56 = this.formatNumberService.numberWithCommas2(this.montantForfait56);
    }
  }

  onFocusOutEventTaux78(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv7 = this.addForm.get("comm_interv7").value;
    this.interv8 = this.addForm.get("comm_interv8").value;
    this.tauxCommission78 = this.addForm.get("comm_tauxcommission78").value;
    if (this.typeCalculChoisi === this.typeCalcul1 && this.interv7 != null && this.interv8 != null 
        && (this.tauxCommission78 === null || this.tauxCommission78 < 0 || this.tauxCommission78 > 100)) {
      this.problemeTaux78 = true;
      this.erreur = true;
    } else {
      this.problemeTaux78 = false;
      this.erreur = false;

      this.addForm.controls['comm_tauxcommission78'].setValue(this.tauxCommission78.toFixed(3)) ;
    }
  }

  onFocusOutEventMontant78(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv7 = this.addForm.get("comm_interv7").value;
    this.interv8 = this.addForm.get("comm_interv8").value;
    this.montantForfait78 = this.addForm.get("comm_montantforfait78").value;
    if (this.typeCalculChoisi === this.typeCalcul2 && this.interv7 != null && this.interv8 != null && this.montantForfait78 === null) {
      this.problemeMontant78 = true;
      this.erreur = true;
    } else {
      this.problemeMontant78 = false;
      this.erreur = false;

      this.montantForfait78 = Number(this.formatNumberService.replaceAll(this.montantForfait78, ' ', ''));
      this.montantForfait78 = this.formatNumberService.numberWithCommas2(this.montantForfait78);
    }
  }

  onFocusOutEventTaux910(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv9 = this.addForm.get("comm_interv9").value;
    this.interv10 = this.addForm.get("comm_interv10").value;
    this.tauxCommission910 = this.addForm.get("comm_tauxcommission910").value;
    if (this.typeCalculChoisi === this.typeCalcul1 && this.interv9 != null && this.interv10 != null 
        && (this.tauxCommission910 === null || this.tauxCommission910 < 0 || this.tauxCommission910 > 100)) {
      this.problemeTaux910 = true;
      this.erreur = true;
    } else {
      this.problemeTaux910 = false;
      this.erreur = false;

      this.addForm.controls['comm_tauxcommission910'].setValue(this.tauxCommission910.toFixed(3)) ;
    }
  }

  onFocusOutEventMontant910(event: any) {
    this.typeCalculChoisi = this.addForm.get("comm_typecalcul").value;
    this.interv9 = this.addForm.get("comm_interv9").value;
    this.interv10 = this.addForm.get("comm_interv10").value;
    this.montantForfait910 = this.addForm.get("comm_montantforfait910").value;
    if (this.typeCalculChoisi === this.typeCalcul2 && this.interv9 != null && this.interv10 != null && this.montantForfait910 === null) {
      this.problemeMontant910 = true;
      this.erreur = true;
    } else {
      this.problemeMontant910 = false;
      this.erreur = false;

      this.montantForfait910 = Number(this.formatNumberService.replaceAll(this.montantForfait910, ' ', ''));
      this.montantForfait910 = this.formatNumberService.numberWithCommas2(this.montantForfait910);
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

  getColorInterv12() {
    if (this.problemeInterv12) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorInterv34() {
    if (this.problemeInterv34) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorInterv56() {
    if (this.problemeInterv56) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorInterv78() {
    if (this.problemeInterv78) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorInterv910() {
    if (this.problemeInterv910) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorTaux12() {
    if (this.problemeTaux12) {
      return '1px solid red';
    } else {
      return '';
    }
  }
  getColorMontant12() {
    if (this.problemeMontant12) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorTaux34() {
    if (this.problemeTaux34) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorMontant34() {
    if (this.problemeMontant34) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorTaux56() {
    if (this.problemeTaux56) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorMontant56() {
    if (this.problemeMontant56) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorTaux78() {
    if (this.problemeTaux78) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorMontant78() {
    if (this.problemeMontant78) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorTaux910() {
    if (this.problemeTaux910) {
      return '1px solid red';
    } else {
      return '';
    }
  }

  getColorMontant910() {
    if (this.problemeMontant910) {
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
