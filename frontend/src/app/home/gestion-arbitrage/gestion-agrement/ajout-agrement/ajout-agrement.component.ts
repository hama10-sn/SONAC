import { Component, Input, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { MatSelect } from '@angular/material/select';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Client } from '../../../../model/Client';
import { Prospect } from '../../../../model/Prospect';
import { ClassificationSecteur } from '../../../../model/ClassificationSecteur';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Produit } from '../../../../model/Produit';
import { ProduitService } from '../../../../services/produit.service';
import { CiviliteService } from '../../../../services/civilite.service';
import { DemandephysiqueService } from '../../../../services/demandephysique.service';
import { ClassificationSecteurService } from '../../../../services/classification-secteur.service';
import { ClientService } from '../../../../services/client.service';
import { ProspectService } from '../../../../services/prospect.service';
import { CategorieService } from '../../../../services/categorie.service';
import { BrancheService } from '../../../../services/branche.service';
import { Civilite } from '../../../../model/Civilite';
import { User } from '../../../../model/User';
import { UserService } from '../../../../services/user.service';
// import type from '../../../../../data/type.json';

@Component({
  selector: 'ngx-ajout-agrement',
  templateUrl: './ajout-agrement.component.html',
  styleUrls: ['./ajout-agrement.component.scss']
})
export class AjoutAgrementComponent implements OnInit {
  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login:any;
  user: User;

  produit :Produit ;
  produits : Array<Produit> = new Array<Produit>();
  listProduits: any [];
  civ:any =" ";

  civilite :Civilite ;
  civilites : Array<Civilite> = new Array<Civilite>();
  listCivilites: any []; 

  client :Client ;
  //clients : Array<Client> = new Array<Client>();
  
  prospect :Prospect ;
  //prospects : Array<Prospect> = new Array<Prospect>();
 
  
  errorEmail: boolean;
  errorNumero: boolean;
  errorNumero2: boolean;
  
  errorMobile: boolean;

  numCategorie:any;
  numBranch:any;
  numProduit1:any;
  numProduit2:any;
  numProduit3:any;
  numCategChoisi: number;
  
  listeCodeBranche: any[];
  listeNumeroCategorie: any[];
  listeCodeProduit: any[];
  //branches: Array<Branche> = new Array<Branche>();
  //categories: Array<Categorie> = new Array<Categorie>();
  
  displayErrorEmail: boolean = false;
  displayErrorNumero: boolean = false;  
  displayErrorNumero2: boolean = false;  
  displayErrorMobile: boolean = false;
  
  displaytitulaire: boolean = false;

  titulaireClient: boolean= true ;
  numCivilite: String;

  listTypes: any [];
  // @Input() listTypeSocite:any [] = type;
  @Input() listTypeSocite:any;

  autorisation: [];

  //classifications: ClassificationSecteur[];

  addForm = this.fb.group({
    dem_persnum: [''],
    dem_typeclientpers: ['',[Validators.required]],
    dem_typetitulaire: ['',[Validators.required]],
    dem_civilitepers: ['',[Validators.required]],
    dem_nom: ['',[Validators.required]],
    dem_prenom: ['',[Validators.required]],
    dem_adresse1: ['',[Validators.required]],
    dem_adresse2: [''],
    dem_ville: ['',[Validators.required]],
    dem_secteuractivites: ['',[Validators.required]],
    dem_registrecommerce: [''],
    dem_ninea: [''],
    dem_comptebancaire: [''],
    dem_telephoneprincipal: ['', [Validators.required]],
    dem_telephone2: [''],
    dem_telephonemobile: ['', [Validators.required]],
    dem_email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
    dem_objetdemande: ['', [Validators.required]],
    dem_produitdemande1: ['', [Validators.required]],
    dem_produitdemande2: [''],
    dem_produitdemande3: [''],
    dem_soumissionarbitrage: ['', [Validators.required]],
    dem_codeutilisateur: [''],
    dem_datemodification: [''],
    dem_statut: [''],
    dem_categorie: [''],
    dem_branch : [''],
  });

  
 // ================ Déclarations des variables pour la recherche avec filtre ======================
 clientss: Array<Client> = new Array<Client>();
 prospectss: Array<Prospect> = new Array<Prospect>();
 classificationss: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
 branchess: Array<Branche> = new Array<Branche>();
 categoriess: Array<Categorie> = new Array<Categorie>();
 produitss: Array<Produit> = new Array<Produit>();

 /** control for the selected  */
 public clientsCtrl: FormControl = new FormControl();
 public prospectCtrl: FormControl = new FormControl();
 public classifCtrl: FormControl = new FormControl();
 public brancheCtrl: FormControl = new FormControl();
 public categorieCtrl: FormControl = new FormControl();
 public produitCtrl: FormControl = new FormControl();

 /** control for the MatSelect filter keyword */
 public clientsFilterCtrl: FormControl = new FormControl();
 public prospectFilterCtrl: FormControl = new FormControl();
 public classifFilterCtrl: FormControl = new FormControl();
 public brancheFilterCtrl: FormControl = new FormControl();
 public categorieFilterCtrl: FormControl = new FormControl();
 public produitFilterCtrl: FormControl = new FormControl();

 /** list  filtered by search keyword */
 public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
 public filteredProspect: ReplaySubject<Prospect[]> = new ReplaySubject<Prospect[]>();
 public filteredClassif: ReplaySubject<ClassificationSecteur[]> = new ReplaySubject<ClassificationSecteur[]>();
 public filteredBranche: ReplaySubject<Branche[]> = new ReplaySubject<Branche[]>();
 public filteredCategorie: ReplaySubject<Categorie[]> = new ReplaySubject<Categorie[]>();
 public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();

 @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

 /** Subject that emits when the component has been destroyed. */
 protected _onDestroy = new Subject<void>();

 // ========================================== FIN Déclaration ======================================
  constructor(
    private fb: FormBuilder,
    private toastrService: NbToastrService,private router: Router,
    private userService: UserService, private civiliteService: CiviliteService,
    private authService: NbAuthService,private demPService: DemandephysiqueService,
    private produitService: ProduitService,private classifService: ClassificationSecteurService,
    private clientService: ClientService,private prospectService: ProspectService,
    private categorieService: CategorieService,private brancheService: BrancheService){
  }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });
   console.log(this.onGetLibelleByCivilite(1));
    this.getlogin();
    this.onGetAllCivilite();
    //this.onGetAllProduit();
    this.onGetClassification();
    this.listTypes=this.listTypeSocite["TYPE_CLIENT"];
    
    this.onGetAllBranches();
  // =================== Listen for search field value changes =======================
  this.clientsFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterClients();
  });

  this.prospectFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterProspects();
  });
  this.brancheFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBranches();
      });

      this.classifFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClassifs();
      });

      this.categorieFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCategories();
      });
      this.produitFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProduits();
      });
}

ngOnDestroy() {
 this._onDestroy.next();
 this._onDestroy.complete();
}
protected filterProduits() {
  if (!this.categoriess) {
    return;
  }
  // get the search keyword
  let search = this.produitFilterCtrl.value;
  if (!search) {
    this.filteredProduit.next(this.produitss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredProduit.next(
    this.produitss.filter(p => p.prod_denominationlong.toLowerCase().indexOf(search) > -1 ||
    p.prod_numero.toString().indexOf(search) > -1 )
  );
}
protected filterCategories() {
  if (!this.categoriess) {
    return;
  }
  // get the search keyword
  let search = this.categorieFilterCtrl.value;
  if (!search) {
    this.filteredCategorie.next(this.categoriess.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredCategorie.next(
    this.categoriess.filter(cat => cat.categ_libellecourt.toLowerCase().indexOf(search) > -1)
  );
}
protected filterBranches() {
  if (!this.branchess) {
    return;
  }
  // get the search keyword
  let search = this.brancheFilterCtrl.value;
  if (!search) {
    this.filteredBranche.next(this.branchess.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredBranche.next(
    this.branchess.filter(b => b.branche_libelleLong.toLowerCase().indexOf(search) > -1)
  );
}
protected filterClassifs() {
  if (!this.classificationss) {
    return;
  }
  // get the search keyword
  let search = this.classifFilterCtrl.value;
  if (!search) {
    this.filteredClassif.next(this.classificationss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredClassif.next(
    this.classificationss.filter(classif => classif.libelle.toLowerCase().indexOf(search) > -1)
  );
}
protected filterClients() {
 console.log(this.clientss.filter(cl => cl.clien_nom));
 if (!this.clientss) {
   return;
 }
 
 // get the search keyword
 let search = this.clientsFilterCtrl.value;
 if (!search) {
   this.filteredClients.next(this.clientss.slice());
   return;
 } else {
   search = search.toLowerCase();
 }
 this.filteredClients.next(
   this.clientss.filter(cl => cl.clien_prenom?.toLowerCase().indexOf(search) > -1 ||
    cl.clien_nom?.toLowerCase().indexOf(search) > -1 ||
    cl.clien_sigle?.toLowerCase().indexOf(search) > -1 ||
    cl.clien_denomination?.toLowerCase().indexOf(search) > -1|| 
    cl.clien_numero?.toString().indexOf(search) > -1
   )
   
 );
}
protected filterProspects() {
  if (!this.prospectss) {
    return;
  }
  
  // get the search keyword
  let search = this.prospectFilterCtrl.value;
  if (!search) {
    this.filteredProspect.next(this.prospectss.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredProspect.next(
    this.prospectss.filter(
    p => p.prospc_prenom.toLowerCase().indexOf(search)> -1 ||
     p.prospc_denomination.toLowerCase().indexOf(search)> -1 ||
     p.prospc_nom.toLowerCase().indexOf(search)> -1 ||
     p.prospc_sigle.toLowerCase().indexOf(search)> -1 ||
     p.prospc_numero.toString().indexOf(search)> -1
    
    )    
  );
 }
// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================
 /* onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branches = data;
        this.listeCodeBranche = data as Branche[];
        console.log(this.listeCodeBranche);
      });
  }*/
  onGetAllBranches(){
    this.brancheService.getAllBranches()
    .subscribe((data: Branche[]) => {
      this.branchess = data as Branche[];      
      this.filteredBranche.next(this.branchess.slice());
    });
  }
  
  onGetAllCategorieByBranche(branche: number){
    this.categorieService.getAllCategorieBranche(branche)
    .subscribe((data: Categorie[]) => {
      this.categoriess = data as Categorie[];      
      this.filteredCategorie.next(this.categoriess.slice());
    });
  }/*
  onGetAllCategorieByBranche(branche: number) {
    this.categorieService.getAllCategorieBranche(branche)
      .subscribe((data: Categorie[]) => {
        this.categories = data;
        this.listeNumeroCategorie = data as Categorie[];
        console.log(this.listeNumeroCategorie);
      });
  }
  onGetAllProduitByCategorie(categorie: number) {
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.produits = data;
        this.listeCodeProduit = data as Produit[];
        console.log(this.listeCodeProduit);
      });
  }*/
  onGetAllProduitByCategorie(categorie: number){
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
      this.produitss = data as Produit[];      
      this.filteredProduit.next(this.produitss.slice());
    });
  }
  onChangeBranche(event) {
    this.onGetAllCategorieByBranche(event.value);
    this.addForm.controls['dem_branch'].setValue(event.value);

console.log(event.value);
    this.numCategorie = "".toString();
    this.numProduit2 = "".toString();
    this.numProduit3 = "".toString();
    this.numProduit1 = "".toString();
    this.addForm.controls['dem_categorie'].setValue(this.numCategorie);
    this.addForm.controls['dem_produitdemande1'].setValue(this.numProduit1);
    this.addForm.controls['dem_produitdemande2'].setValue(this.numProduit2);
    this.addForm.controls['dem_produitdemande3'].setValue(this.numProduit3);
  }
  onChangeCategorie(event) {
    this.onGetAllProduitByCategorie(event.value);
    console.log(event.value);
    this.numCategChoisi = event.value;
    this.addForm.controls['dem_categorie'].setValue(event.value);

    this.numProduit1 = "".toString();
    this.numProduit2 = "".toString();
    this.numProduit3 = "".toString();
    this.addForm.controls['dem_produitdemande1'].setValue(this.numProduit1);
    this.addForm.controls['dem_produitdemande2'].setValue(this.numProduit2);
    this.addForm.controls['dem_produitdemande3'].setValue(this.numProduit3);
  }

 
  onchangeMail () {
    this.displayErrorEmail = true;
    if(this.addForm.controls['dem_email'].valid == true || this.addForm.controls['dem_email'].value == ""){
      this.errorEmail = true;
    }else{
      this.errorEmail = false;
    }

  }
  onchangeNumero () {
    this.displayErrorNumero = true;
    if(this.addForm.controls['dem_telephoneprincipal'].valid == true ||this.addForm.controls['dem_telephoneprincipal'].value == "" ){
      this.errorNumero = true;
    }else{
      this.errorNumero = false;
    }
  }
  onchangeNumero2 () {
    this.displayErrorNumero2 = true;
    if(this.addForm.controls['dem_telephone2'].valid == true ){
      this.errorNumero2 = true;
    }else{
      this.errorNumero2 = false;
    }
  }
  onchangeMobile () {
    this.displayErrorMobile = true;
    if(this.addForm.controls['dem_telephonemobile'].valid == true ){
      this.errorMobile = true;
    }else{
      this.errorMobile = false;
    }
  }

  onGetClassification(){
    this.classifService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classificationss = data as ClassificationSecteur[];
        this.filteredClassif.next(this.classificationss.slice());
      })
  }
  onGetClent(){
    this.clientService.getAllClientPhysique()
    .subscribe((data: Client[]) => {
      this.clientss = data as Client[];      
      this.filteredClients.next(this.clientss.slice());
    });
    console.log(this.clientss)
  }
  onGetProspect(){
    this.prospectService.getAllProspectPhysique()
    .subscribe((data: Prospect[]) => {
      this.prospectss = data as Prospect[];
      this.filteredProspect.next(this.prospectss.slice());
    });
  }
  onGetAllCivilite(){
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
          this.civilites = data;
          this.listCivilites = data as Civilite[];
      });
  }/*
  onGetAllProduit(){
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
          this.produits = data;
          this.listProduits = data as Produit[];
      });
  }*/
  onGetAllProduit(){
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
      this.produitss = data as Produit[];
      this.filteredProduit.next(this.produitss.slice());
    });
  }
  getlogin(): any {
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
      .subscribe((data: User) => {
        this.user = data;
        console.log(this.user);
      });
        }
      });
  }
  submit() { 
    //this.addForm.controls['dem_telephoneprincipal'].setValue(this.addForm.controls['dem_telephoneprincipal'].value.internationalNumber);
    //this.addForm.controls['dem_telephone2'].setValue(this.addForm.controls['dem_telephone2'].value?.internationalNumber);
    //this.addForm.controls['dem_telephonemobile'].setValue(this.addForm.controls['dem_telephonemobile'].value.internationalNumber);
    this.addForm.controls['dem_datemodification'].setValue(new Date());
    this.addForm.controls['dem_codeutilisateur'].setValue(this.user.util_numero);
    console.log(this.addForm.controls['dem_codeutilisateur'].value +' '+this.addForm.controls['dem_datemodification'].value);
    this.demPService.addDemandePhysiqu(this.addForm.value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Demande Physique Enregistré avec succes !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/demande-Physique');
    },
    (error) => {
      this.toastrService.show(
        error.error,
        'Notification d\'erreur',
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
      cancel() {
        this.router.navigateByUrl('home/gestion_agrement')
      }

      onChangeTitulaire(event){
        this.addForm.controls['dem_typetitulaire'].setValue(event.value);
        console.log(event.value);
        console.log((this.clientss.find(p => p.clien_numero == event.value))?.clien_titre);
        if(this.addForm.controls['dem_typeclientpers'].value=="CL"){
          this.displaytitulaire=true;
          this.addForm.controls['dem_civilitepers'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_titre);
          
          this.civ = this.onGetLibelleByCivilite((this.clientss.find(p => p.clien_numero == event.value))?.clien_titre);

          this.addForm.controls['dem_nom'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_nom);
          this.addForm.controls['dem_prenom'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_prenom);

          this.addForm.controls['dem_registrecommerce'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_registrecommerce);
          this.addForm.controls['dem_ninea'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_ninea);
          console.log((this.clientss.find(p => p.clien_numero == event.value))?.clien_ninea);
          this.addForm.controls['dem_email'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_email);        
          this.addForm.controls['dem_telephoneprincipal'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_telephone1);
          this.addForm.controls['dem_telephone2'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_telephone2);
          this.addForm.controls['dem_ville'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_adresseville);
          this.addForm.controls['dem_telephonemobile'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_portable);
        
          //console.log((this.clients.find(p => p.clien_numero == event.value))?.clien_telephone1);
        }else if(this.addForm.controls['dem_typeclientpers'].value=="PR"){
          this.displaytitulaire=false;
          this.addForm.controls['dem_nom'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_nom);
          this.addForm.controls['dem_prenom'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_prenom);
          this.addForm.controls['dem_registrecommerce'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_registrecommerce);
          this.addForm.controls['dem_ninea'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_ninea);
          this.addForm.controls['dem_email'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_email);
          this.addForm.controls['dem_telephoneprincipal'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_telephone1);
          this.addForm.controls['dem_telephone2'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_telephone2);
          this.addForm.controls['dem_telephonemobile'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_portable);
          this.addForm.controls['dem_civilitepers'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_titre);
          this.civ =this.onGetLibelleByCivilite( (this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_titre);
          this.addForm.controls['dem_ville'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_adresseville);
        
        }
        //this.numCivilite= (this.clients.find(p => p.clien_numero == event))?.clien_titre;dem_comptebancaire
      }
      onChangeTypeClient(event){
        this.addForm.controls['dem_typeclientpers'].setValue(event);

        if(event==="CL"){
          this.titulaireClient=true;
          this.onGetClent();
          
        this.addForm.controls['dem_civilitepers'].setValue(" ");
        this.civ= " ";
        this.addForm.controls['dem_nom'].setValue(" ");        
        this.addForm.controls['dem_prenom'].setValue(" ");        
        this.addForm.controls['dem_registrecommerce'].setValue(" ");        
        this.addForm.controls['dem_ninea'].setValue(" ");        
        this.addForm.controls['dem_email'].setValue(" ");        
        this.addForm.controls['dem_telephoneprincipal'].setValue(" ");        
        this.addForm.controls['dem_telephone2'].setValue(" ");        
        this.addForm.controls['dem_ville'].setValue(" ");        
        this.addForm.controls['dem_telephonemobile'].setValue(" ");
          //console.log((this.clients.find(p => p.clien_numero == event))?.clien_titre);
        
         //console.log("client");
        }else if(event==="PR")
        {
          this.titulaireClient=false;
        this.onGetProspect();
        this.addForm.controls['dem_civilitepers'].setValue(" ");
        this.civ= " ";
        this.addForm.controls['dem_nom'].setValue(" ");        
        this.addForm.controls['dem_prenom'].setValue(" ");        
        this.addForm.controls['dem_registrecommerce'].setValue(" ");        
        this.addForm.controls['dem_ninea'].setValue(" ");        
        this.addForm.controls['dem_email'].setValue(" ");        
        this.addForm.controls['dem_telephoneprincipal'].setValue(" ");        
        this.addForm.controls['dem_telephone2'].setValue(" ");        
        this.addForm.controls['dem_ville'].setValue(" ");        
        this.addForm.controls['dem_telephonemobile'].setValue(" ");
     // console.log("prosper");
        }
      }

      onGetLibelleByCivilite(numero: any) {
          console.log(this.civilites);
          console.log(numero + " : " + (this.civilites?.find(b => b.civ_code === numero))?.civ_libellecourt);
          return numero + " : " + (this.civilites?.find(b => b.civ_code === numero))?.civ_libellelong;
        
        }

      onChangeActivite(event){
        this.addForm.controls['dem_secteuractivites'].setValue(event.value);
        console.log(event.value);
      }
     // onChangeCivilite(event) { 
  // this.addForm.controls['dem_civilitepers'].setValue(event);
 // }
 onChangeArbitrage(event) {
  this.addForm.controls['dem_soumissionarbitrage'].setValue(event);
}
  onChangeProiduit1(event) {
    this.addForm.controls['dem_produitdemande1'].setValue(event.value);
  }
  onChangeProiduit2(event) { 
    this.addForm.controls['dem_produitdemande2'].setValue(event.value);
  }
  onChangeProiduit3(event) { 
    this.addForm.controls['dem_produitdemande3'].setValue(event.value);
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
}
