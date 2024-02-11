import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Civilite } from '../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../model/ClassificationSecteur';
import { Client } from '../../../../model/Client';
import { Produit } from '../../../../model/Produit';
import { Prospect } from '../../../../model/Prospect';
import { Rdv } from '../../../../model/Rdv';
import { User } from '../../../../model/User';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { CiviliteService } from '../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../services/classification-secteur.service';
import { ClientService } from '../../../../services/client.service';
import { DemandephysiqueService } from '../../../../services/demandephysique.service';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { ProduitService } from '../../../../services/produit.service';
import { ProspectService } from '../../../../services/prospect.service';
import { RdvService } from '../../../../services/rdv.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { UserService } from '../../../../services/user.service';
import { saveAs } from 'file-saver';
import type from '../../../data/type.json';
import { Dem_Pers } from '../../../../model/dem_Pers';

@Component({
  selector: 'ngx-ouverture-compteph',
  templateUrl: './ouverture-compteph.component.html',
  styleUrls: ['./ouverture-compteph.component.scss']
})
export class OuvertureComptephComponent implements OnInit {


  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  idDemande:any;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login: any;
  user: User;

  demandePHy:Dem_Pers;
  checked1 :boolean = false;
  checked2 :boolean= false;
  checked3 :boolean= false;
  checked4 :boolean= false;
  checked :boolean = false;
  getted :boolean = false;

  produit: Produit;
  produits: Array<Produit> = new Array<Produit>();
  listProduits: any[];
  civ: any = " ";
  demandeEnvoye=false;

  civilite: Civilite;
  civilites: Array<Civilite> = new Array<Civilite>();
  listCivilites: any[];

  client: Client;
  //clients : Array<Client> = new Array<Client>();

  prospect: Prospect;
  //prospects : Array<Prospect> = new Array<Prospect>();
  demandeback:Dem_Pers;

  errorEmail: boolean;
  errorNumero: boolean;
  errorNumero2: boolean;

  errorMobile: boolean;

  numCategorie: any;
  numBranch: any;
  numProduit1: any;
  numProduit2: any;
  numProduit3: any;
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

  titulaireClient: boolean = true;
  displaytype: boolean = false;
  numCivilite: String;

  listTypes: any[];
  @Input() listTypeSocite: any[] = type;
  autorisation: [];

  activite: any="";  
 formatMontant: Number;
  //classifications: ClassificationSecteur[];

  addForm = this.fb.group({
    dem_persnum: [''],
    dem_typeclientpers: [''],
    dem_typetitulaire: [''],
    dem_civilitepers: [''],
    dem_nom: [''],
    dem_prenom: [''],
    dem_adresse1: [''],
    dem_adresse2: [''],
    dem_ville: [''],
    dem_secteuractivites: [''],
    dem_registrecommerce: [''],
    dem_ninea: [''],
    dem_comptebancaire: [''],
    dem_telephoneprincipal: [''],
    dem_telephone2: [''],
    dem_telephonemobile: [''],
    dem_email: [''],
    dem_objetdemande: [''],
    dem_produitdemande1: [''],
    dem_produitdemande2: [''],
    dem_produitdemande3: [''],
    dem_soumissionarbitrage: [''],
    dem_codeutilisateur: [''],
    dem_datemodification: [''],
    dem_statut: [''],
    dem_categorie: [''],
    dem_branch: [''],
    dem_montant: [''],
    dem_marche: [''],
  });


  // ================ Déclarations des variables pour la recherche avec filtre ======================
  clientss: Array<Client> = new Array<Client>();
  prospectss: Array<Prospect> = new Array<Prospect>();
  classificationss: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  branchess: Array<Branche> = new Array<Branche>();
  categoriess: Array<Categorie> = new Array<Categorie>();
  produitss: Array<Produit> = new Array<Produit>();
envoi:boolean;
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
  message: any;

  // ========================================== FIN Déclaration ======================================
  constructor(
    private fb: FormBuilder,
    private toastrService: NbToastrService, private router: Router,
    private userService: UserService, private civiliteService: CiviliteService,
    private authService: NbAuthService, private demPService: DemandephysiqueService,
    private produitService: ProduitService, private classifService: ClassificationSecteurService,
    private clientService: ClientService, private prospectService: ProspectService,
    private rdvService: RdvService, private transfertData: TransfertDataService,
    private categorieService: CategorieService, private brancheService: BrancheService,
    private formatNumberService: FormatNumberService,
    private transData: TransfertDataService,) {
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
    this.prospect= this.transfertData.getData();
    if(this.transData.getData()==!null){
      this.demandePHy=this.transData.getData()[0];
      this.envoi=this.transData.getData()[1];
    }
    
    this.addForm.controls['dem_typeclientpers'].setValue("PR");
    this.addForm.controls['dem_typetitulaire'].setValue(this.prospect.prospc_numero);
    this.addForm.controls['dem_civilitepers'].setValue(this.prospect.prospc_titre);
    this.civ = this.onGetLibelleByCivilite(this.prospect?.prospc_titre);
    this.addForm.controls['dem_nom'].setValue(this.prospect.prospc_nom);
    this.addForm.controls['dem_prenom'].setValue(this.prospect.prospc_prenom);
    this.addForm.controls['dem_nom'].setValue(this.prospect.prospc_nom);

    this.addForm.controls['dem_ville'].setValue(this.prospect.prospc_adresseville);
    this.addForm.controls['dem_adresse1'].setValue(this.prospect.prospc_adressenumero);
    this.addForm.controls['dem_adresse2'].setValue(this.prospect?.prospc_adresserue);
    this.addForm.controls['dem_secteuractivites'].setValue(this.prospect?.prospc_classificationmetier);
    this.addForm.controls['dem_objetdemande'].setValue("Ouverture compte");

    this.listTypes = this.listTypeSocite["TYPE_CLIENT"];

    this.onGetAllBranches();

    //doc
    
      
  console.log('test--',this.demandePHy?.list_document_valide);
  if(this.demandePHy?.list_document_valide[31]==32){
    this.checked=true
  }else{
    this.checked=false;
  }
  if(this.demandePHy?.list_document_valide[32]==33){
    this.checkeddeux=true;
  }else{
    this.checkeddeux=false
  }
  if(this.demandePHy?.list_document_valide[33]==34){
    this.checkedtrois=true;
  }else{
    this.checkedtrois=false
  }
  if(this.demandePHy?.list_document_valide[34]==35){
    this.checkedquatre=true;
  }else{
    this.checkedquatre=false
  }
  if(this.demandePHy?.list_document_valide[35]==36){
    this.checkedcinq=true;
  }else{
    this.checkedcinq=false
  }
  
  if(this.demandePHy?.list_document_valide[36]==37){
    this.checkedsix=true;
  }else{
    this.checkedsix=false
  } 
   
  if(this.demandePHy?.list_document_valide[37]==38){
    this.checkedsept=true;
  }else{
    this.checkedsept=false
  } 
  if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
    this.check=true;
    this.getted=true
  }else{
    this.check=false;
    this.getted=false
  }
  
if(this.demandePHy!=null ){
    this.ongetFiles()
 }


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
      this.rdv = this.transfertData.getData();
      this.ongetFiles();
  }
  openAjout () {
    this.displayButtonUpload =true;
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
        p.prod_numero.toString().indexOf(search) > -1)
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
        cl.clien_denomination?.toLowerCase().indexOf(search) > -1 ||
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
        p => p.prospc_prenom.toLowerCase().indexOf(search) > -1 ||
          p.prospc_denomination.toLowerCase().indexOf(search) > -1 ||
          p.prospc_nom.toLowerCase().indexOf(search) > -1 ||
          p.prospc_sigle.toLowerCase().indexOf(search) > -1 ||
          p.prospc_numero.toString().indexOf(search) > -1

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
  onGetAllBranches() {
    this.brancheService.getAllBranches()
      .subscribe((data: Branche[]) => {
        this.branchess = data as Branche[];
        this.filteredBranche.next(this.branchess.slice());
      });
  }

  onGetAllCategorieByBranche(branche: number) {
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
  onGetAllProduitByCategorie(categorie: number) {
    this.produitService.getAllProduitByCategorie(categorie)
      .subscribe((data: Produit[]) => {
        this.produitss = data as Produit[];
        this.filteredProduit.next(this.produitss.slice());
      });
  }
  onChangeBranche(event) {
    this.onGetAllCategorieByBranche(event.value);
    this.addForm.controls['dem_branch'].setValue(event.value);
    this.categorieCtrl.setValue("");
    this.produitCtrl.setValue("");
    if(event.value == '15'){
      this.displaytype= true;
      this.addForm.controls['dem_marche'].setValidators(Validators.required);
      
    } else{
      this.addForm.controls['dem_marche'].clearValidators();
      this.addForm.controls['dem_marche'].setValue("");
      this.displaytype= false;
      
    }
       
    this.addForm.controls['dem_marche'].updateValueAndValidity();
    /* console.log(event.value);
    this.numCategorie = "".toString();
    this.numProduit2 = "".toString();
    this.numProduit3 = "".toString();
    this.numProduit1 = "".toString();
    this.addForm.controls['dem_categorie'].setValue(this.numCategorie);
    this.addForm.controls['dem_produitdemande1'].setValue(this.numProduit1);
    this.addForm.controls['dem_produitdemande2'].setValue(this.numProduit2);
    this.addForm.controls['dem_produitdemande3'].setValue(this.numProduit3); */
  }
  onChangeMarcher(event){
        console.log(event.target.value);
    this.addForm.controls['dem_marche'].setValue(event.target.value);
  }
  onFocusOutEventMontant() {
    
    // tslint:disable-next-line:max-line-length
    this.formatMontant = Number(this.formatNumberService.replaceAll((this.addForm.get("dem_montant").value),' ',''));
    console.log( this.formatMontant);
    if (this.formatMontant !=null){
  
      console.log( this.formatNumberService.numberWithCommas2( this.formatMontant));
  
     // tslint:disable-next-line:max-line-length
     this.addForm.controls['dem_montant'].setValue(this.formatNumberService.numberWithCommas2( this.formatMontant));
    }
    
  }
  onChangeCategorie(event) {
    this.onGetAllProduitByCategorie(event.value);
    console.log(event.value);
    /* this.numCategChoisi = event.value;
    this.addForm.controls['dem_categorie'].setValue(event.value); */
    this.produitCtrl.setValue("");
    /* this.numProduit1 = "".toString();
    this.numProduit2 = "".toString();
    this.numProduit3 = "".toString();
    this.addForm.controls['dem_produitdemande1'].setValue(this.numProduit1);
    this.addForm.controls['dem_produitdemande2'].setValue(this.numProduit2);
    this.addForm.controls['dem_produitdemande3'].setValue(this.numProduit3); */
  }


  onchangeMail() {
    this.displayErrorEmail = true;
    if (this.addForm.controls['dem_email'].valid == true || this.addForm.controls['dem_email'].value == "") {
      this.errorEmail = true;
    } else {
      this.errorEmail = false;
    }

  }
  onchangeNumero() {
    this.displayErrorNumero = true;
    if (this.addForm.controls['dem_telephoneprincipal'].valid == true || this.addForm.controls['dem_telephoneprincipal'].value == "") {
      this.errorNumero = true;
    } else {
      this.errorNumero = false;
    }
  }
  onchangeNumero2() {
    this.displayErrorNumero2 = true;
    if (this.addForm.controls['dem_telephone2'].valid == true) {
      this.errorNumero2 = true;
    } else {
      this.errorNumero2 = false;
    }
  }
  onchangeMobile() {
    this.displayErrorMobile = true;
    if (this.addForm.controls['dem_telephonemobile'].valid == true) {
      this.errorMobile = true;
    } else {
      this.errorMobile = false;
    }
  }

  onGetClassification() {
    this.classifService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classificationss = data as ClassificationSecteur[];
        this.filteredClassif.next(this.classificationss.slice());
      })
  }
  onGetClent() {
    this.clientService.getAllClientPhysique()
      .subscribe((data: Client[]) => {
        this.clientss = data as Client[];
        this.filteredClients.next(this.clientss.slice());
      });
    console.log(this.clientss)
  }
  onGetProspect() {
    this.prospectService.getAllProspectPhysique()
      .subscribe((data: Prospect[]) => {
        this.prospectss = data as Prospect[];
        this.filteredProspect.next(this.prospectss.slice());
      });
  }
  onGetAllCivilite() {
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
  onGetAllProduit() {
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
  
  toggle(checked: boolean) {
    this.checked = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }
  }
  toggle1(checked: boolean) {
    this.checked1 = checked;
  }
  toggle2(checked: boolean) {
    this.checked2 = checked;
  }

  toggle3(checked: boolean) {
    this.checked3 = checked;
  }
  toggle4(checked: boolean) {
    this.checked4 = checked;
  }
 
  check:boolean=false;
  checkeddeux
  toggledeux(checked: boolean) {
    this.checkeddeux = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }

  }
  
  checkedtrois:boolean = false
  toggletrois(checked: boolean) {
    this.checkedtrois = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }

  }
  
  checkedquatre :boolean = false
  togglequatre(checked: boolean) {
    this.checkedquatre = checked;
    

  } 
  
  checkedcinq :boolean = false
  togglecinq(checked: boolean) {
    this.checkedcinq = checked;
    

  } 
  
  checkedsix :boolean = false
  togglesix(checked: boolean) {
    this.checkedsix = checked;
    

  }
  checkedsept :boolean = false
  togglesept(checked: boolean) {
    this.checkedsept = checked;
    

  } 
  submit() {
   
   //this.demandePHy=this.addForm.value
    
    console.log(this.addForm.value.dem_persnum);
    console.log('test--',this.demandePHy?.list_document_valide);
    //this.addForm.controls['dem_telephoneprincipal'].setValue(this.addForm.controls['dem_telephoneprincipal'].value.internationalNumber);
    //this.addForm.controls['dem_telephone2'].setValue(this.addForm.controls['dem_telephone2'].value?.internationalNumber);
    //this.addForm.controls['dem_telephonemobile'].setValue(this.addForm.controls['dem_telephonemobile'].value.internationalNumber);
   // this.addForm.controls['dem_montant'].setValue(this.formatMontant);
    this.addForm.controls['dem_datemodification'].setValue(new Date());
    this.addForm.controls['dem_codeutilisateur'].setValue(this.user.util_numero);
    console.log(this.addForm.controls['dem_codeutilisateur'].value + ' ' + this.addForm.controls['dem_datemodification'].value);
    this.demPService.addDemandePhysiqu(this.addForm.value)
      .subscribe((data:any) => {
        this.idDemande=data.data.dem_persnum;
        this.demandeEnvoye=true;
        this.demandeback=data.data;
        // console.log(data.data.dem_persnum);
        this.toastrService.show(
          'Demande Physique Enregistré avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 30000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.transfertData.setData(this.demandeback);
          this.router.navigateByUrl('home/cocherPhysiqueDoc');
        
        //this.router.navigateByUrl('home/demande-Physique');
      },
        (error) => {
          this.toastrService.show(
            error.error,
            'Notification d\'erreur',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 30000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });
        },
      );
      console.log(this.demandePHy);
  }
  cancel() {
    this.router.navigateByUrl('home/gestion-commerciale/gestion-portefeuille/prospects')
  }

  onChangeTitulaire(event) {
    this.addForm.controls['dem_typetitulaire'].setValue(event.value);
    console.log(event.value);
    console.log((this.clientss.find(p => p.clien_numero == event.value))?.clien_titre);
    if (this.addForm.controls['dem_typeclientpers'].value == "CL") {
      this.displaytitulaire = true;
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
      this.addForm.controls['dem_adresse1'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_adressenumero);
      this.addForm.controls['dem_adresse2'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_adresserue);
      this.addForm.controls['dem_secteuractivites'].setValue((this.clientss.find(p => p.clien_numero == event.value))?.clien_secteur_activite);
      this.activite=this.onGetLibelleBySectActivite((this.clientss.find(p => p.clien_numero == event.value))?.clien_secteur_activite);
      //console.log((this.clients.find(p => p.clien_numero == event.value))?.clien_telephone1);
    } else if (this.addForm.controls['dem_typeclientpers'].value == "PR") {
      this.displaytitulaire = false;
      this.addForm.controls['dem_nom'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_nom);
      this.addForm.controls['dem_prenom'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_prenom);
      this.addForm.controls['dem_registrecommerce'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_registrecommerce);
      this.addForm.controls['dem_ninea'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_ninea);
      this.addForm.controls['dem_email'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_email);
      this.addForm.controls['dem_telephoneprincipal'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_telephone1);
      this.addForm.controls['dem_telephone2'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_telephone2);
      this.addForm.controls['dem_telephonemobile'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_portable);
      this.addForm.controls['dem_civilitepers'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_titre);
      this.civ = this.onGetLibelleByCivilite((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_titre);
      this.addForm.controls['dem_ville'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_adresseville);
      this.addForm.controls['dem_adresse1'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_adressenumero);
      this.addForm.controls['dem_adresse2'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_adresserue);
      this.addForm.controls['dem_secteuractivites'].setValue((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_classificationmetier);
      this.activite=this.onGetLibelleBySectActivite((this.prospectss.find(p => p.prospc_numero == event.value))?.prospc_classificationmetier);
      
    }
    //this.numCivilite= (this.clients.find(p => p.clien_numero == event))?.clien_titre;dem_comptebancaire
  }
  onChangeTypeClient(event) {
    this.addForm.controls['dem_typeclientpers'].setValue(event);

    if (event === "CL") {
      this.titulaireClient = true;
      this.onGetClent();

      this.addForm.controls['dem_civilitepers'].setValue(" ");
      this.civ = " ";
      this.addForm.controls['dem_nom'].setValue(" ");
      this.addForm.controls['dem_prenom'].setValue(" ");
      this.addForm.controls['dem_registrecommerce'].setValue(" ");
      this.addForm.controls['dem_ninea'].setValue(" ");
      this.addForm.controls['dem_email'].setValue(" ");
      this.addForm.controls['dem_telephoneprincipal'].setValue(" ");
      this.addForm.controls['dem_telephone2'].setValue(" ");
      this.addForm.controls['dem_ville'].setValue(" ");
      this.addForm.controls['dem_telephonemobile'].setValue(" ");
      this.addForm.controls['dem_adresse1'].setValue("");
      this.addForm.controls['dem_adresse2'].setValue(" ");
      this.activite=" ";
      //console.log((this.clients.find(p => p.clien_numero == event))?.clien_titre);
      
      //console.log("client");
    } else if (event === "PR") {
      this.titulaireClient = false;
      this.onGetProspect();
      this.addForm.controls['dem_civilitepers'].setValue(" ");
      this.civ = " ";
      this.addForm.controls['dem_nom'].setValue(" ");
      this.addForm.controls['dem_prenom'].setValue(" ");
      this.addForm.controls['dem_registrecommerce'].setValue(" ");
      this.addForm.controls['dem_ninea'].setValue(" ");
      this.addForm.controls['dem_email'].setValue(" ");
      this.addForm.controls['dem_telephoneprincipal'].setValue(" ");
      this.addForm.controls['dem_telephone2'].setValue(" ");
      this.addForm.controls['dem_ville'].setValue(" ");
      this.addForm.controls['dem_telephonemobile'].setValue(" ");
      this.addForm.controls['dem_adresse1'].setValue("");
      this.addForm.controls['dem_adresse2'].setValue(" ");
      this.activite="";
      // console.log("prosper");
    }
  }

  onGetLibelleByCivilite(numero: any) {
    console.log(this.civilites);
    console.log(numero + " : " + (this.civilites?.find(b => b.civ_code === numero))?.civ_libellecourt);
    return numero + " : " + (this.civilites?.find(b => b.civ_code === numero))?.civ_libellelong;

  }
  onGetLibelleBySectActivite(numero: any) {
    console.log(this.classificationss);
    console.log(numero + " : " + (this.classificationss?.find(b => b.code === numero))?.libelle);
    return numero + " : " + (this.classificationss?.find(b => b.code === numero))?.libelle;

  }

  onChangeActivite(event) {
    this.addForm.controls['dem_secteuractivites'].setValue(event.value);
    console.log(event.value);
  }
  // onChangeCivilite(event) { 
  // this.addForm.controls['dem_civilitepers'].setValue(event);
  // }
  onChangeArbitrage(event) {
    this.addForm.controls['dem_soumissionarbitrage'].setValue(event);
    console.log(event);
    if(event=='O'){
      this.addForm.controls['dem_statut'].setValue("validé pour arbitrage");
    }else if(event=='N'){
      this.addForm.controls['dem_statut'].setValue("contrat à émettre");
    }
  }
  onChangeProiduit1(event) {
    this.addForm.controls['dem_objetdemande'].setValue((this.produitss.find(p => p.prod_numero == event.value))?.prod_denominationlong);
    console.log(event.value);
    this.addForm.controls['dem_produitdemande1'].setValue(event.value);
  }
  onChangeProiduit2(event) {
    console.log(event.value);
    this.addForm.controls['dem_produitdemande2'].setValue(event.value);
  }
  onChangeProiduit3(event) {
    console.log(event.value);
    this.addForm.controls['dem_produitdemande3'].setValue(event.value);
  }
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }


  displayButtonUpload: boolean = false;
  displayprogress: boolean = false;
  selectedFile = null;
  files: File[];
  progress: number = 0;
  filenames: string[];
  rdv: Rdv;


  cancel1() {
    this.router.navigateByUrl('/home/agenda');
  }
  onFileSelected(event) {
    this.selectedFile = event.target.files;
    console.log(this.selectedFile);
  }
  ongetFiles() {
    this.demPService.getFilesDoc(this.idDemande)
      .subscribe(data => this.filenames = data as string[]);
  }

  onClickUpload() {
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for (const file of this.files) {
      form.append('files', file, file.name);
    }

    this.demPService.uploadDoc(form, this.idDemande)
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('upload ok', event.status);
            setTimeout(() => {
              this.progress = 0;
              this.displayprogress = false;
            }, 1500);
            if (event.status == 200) {
              this.ongetFiles();
              this.toastrService.show(
                'Upload reussi avec succes !',
                'Notification',
                {
                  status: this.statusSuccess,
                  destroyByClick: true,
                  duration: 0,
                  hasIcon: true,
                  position: this.position,
                  preventDuplicates: false,
                });
            } else {
              this.toastrService.show(
                'une erreur est survenue',
                'Notification',
                {
                  status: this.statusFail,
                  destroyByClick: true,
                  duration: 0,
                  hasIcon: true,
                  position: this.position,
                  preventDuplicates: false,
                });
            }
        }

      });


  }
  onClickDownload(filename: string) {
    this.demPService.downloadDoc(filename, this.idDemande)
      .subscribe(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          /* case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`downloaded! ${this.progress}%`);
            break; */
          case HttpEventType.Response:
            console.log(event.body);
            saveAs(event.body, filename);
        }
      });
  }


  onClickDelete(filename: string) {
    this.demPService.deleteFileDoc(filename, this.idDemande)
      .subscribe(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round(event.loaded / event.total * 100);
            console.log(`downloaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:

            if (event.status == 200) {
              this.ongetFiles();
              this.toastrService.show(
                'Suppression reussi avec succes !',
                'Notification',
                {
                  status: this.statusSuccess,
                  destroyByClick: true,
                  duration: 0,
                  hasIcon: true,
                  position: this.position,
                  preventDuplicates: false,
                });
            } else {
              this.toastrService.show(
                'une erreur est survenue',
                'Notification',
                {
                  status: this.statusFail,
                  destroyByClick: true,
                  duration: 0,
                  hasIcon: true,
                  position: this.position,
                  preventDuplicates: false,
                });
            }
        }
      });
  }

      
  openpdf(filename) {
    
    let i = this.filenames.indexOf(filename);
    //this.dem_Pers.list_document_lu[i]=filename;
    this.demandeback.filenames=this.filenames;
  let test = this.demandeback.list_document_lu===this.filenames;
    console.log('list',this.demandeback.list_document_lu);
    console.log('file',this.filenames);
    console.log("3h",test);
    this.demPService.downloadInDossier(filename,this.demandeback.dem_persnum)
      .subscribe(event => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            
            
            break;
          case HttpEventType.Response:
            this.demandeEnvoye=this.envoi
            let data=[event.body,this.demandeback,filename,i]
            //this.transfertData.setData(event.body);
            this.transData.setData(data);
            this.transfertData.setData(this.prospect);
            this.router.navigateByUrl("/home/voirPhysiquePdf");
            //this.dialogService.open(ViewPdfComponent, { hasScroll:true });
  
            
        }
      });
  }
    
  listedoc : number []=[];
  submitcheck(){
    this.checked ;
    if(this.checked){
      //this.form2.controls['dr'].setValue(1);
      this.listedoc[31]=32;
    }else{
      //this.form2.controls['dr'].setValue(null);
      this.listedoc[31]=null;
    }
    if(this.checkeddeux){
      //this.form2.controls['mc'].setValue(2);
      this.listedoc[32]=33;
    }else{
      //this.form2.controls['mc'].setValue(null);
      this.listedoc[32]= null;
    }
    if(this.checkedtrois){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[33]=34;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[33]=null;
    }/* 
    if(this.checkedquatre){
      //this.form2.controls['caao'].setValue(4);
      this.listedoc[3]=4;
    }else{
      //this.form2.controls['caao'].setValue(null);
      this.listedoc[3]=null;
    } */
    //console.log(this.form2.value);
    console.log(this.listedoc);
    //console.log(this.demandeback.dem_socnum);
    this.demandeback.list_document_valide = this.listedoc;
    this.demPService.update(this.demandeback).subscribe(data => {
      /*if (this.ngModelValue == '1') {
        this.message = "Demande validée avec succes !";
      } else if (this.ngModelValue == '2') {
        this.message = "Demande rejetée avec succes !";
      }*/
      this.message="Documents cochés enregistrés avec success";
      this.toastrService.show(
        this.message,
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 30000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
      //this.onGetAllDemandeSoc();
    },
      (error) => {
        this.toastrService.show(
          'Impossible de cochés la demande !',
          'Notification',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
      })
    
  }

}
