import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Branche } from '../../../../model/Branche';
import { Categorie } from '../../../../model/Categorie';
import { Client } from '../../../../model/Client';
import { Produit } from '../../../../model/Produit';
import { Prospect } from '../../../../model/Prospect';
import { User } from '../../../../model/User';
import { Intermediaire } from '../../../../model/Intermediaire';
import { ProposService } from '../../../../services/propos.service';
import { BrancheService } from '../../../../services/branche.service';
import { CategorieService } from '../../../../services/categorie.service';
import { ProduitService } from '../../../../services/produit.service';
import { IntermediaireService } from '../../../../services/intermediaire.service';
import { ClientService } from '../../../../services/client.service';
import { ProspectService } from '../../../../services/prospect.service';
import { Cimacodificationcompagnie } from '../../../../model/Cimacodificationcompagnie';
import { CimacompagnieService } from '../../../../services/cimacompagnie.service';
import dateFormatter from 'date-format-conversion';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'ngx-ajout',
  templateUrl: './ajout.component.html',
  styleUrls: ['./ajout.component.scss']
})
export class AjoutComponent implements OnInit {

  SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  autorisation: [];

  
  user: User;
  login:any;
  
  numProduit:any;
  numCategorie: any;

  addForm = this.fb.group({
    propo_numero: [''],
    propo_date: ['',[Validators.required]],
    propo_codeintermediaire: ['',[Validators.required]],
    propo_denomcompagnie: ['',[Validators.required]],
    propo_codecompagnie: ['',[Validators.required]],
    propo_numerobranche:  ['',[Validators.required]],
    propo_numerocategorie:  ['',[Validators.required]],
    propo_numerosouscripteur: [''],
    propo_numeroprospect: [''],     //s'il n'est pas déjà souscripteur
	propo_dateeffet1er: ['',[Validators.required]],
	propo_dateannivcontrat: [''],
	propo_dateeffet: ['',[Validators.required]],
	propo_dateecheance: ['',[Validators.required]],
	propo_dureecontrat: ['',[Validators.required]],
	propo_typecontrat: [''],
	propo_typegestion: ['',[Validators.required]],
	propo_codefractionnemen:['',[Validators.required]], 
	propo_mtnprimenetref: [''],
	propo_mtnprimenettot: [''],
	propo_accesoirecompagnie: ['',[Validators.required]],
	propo_accessoireapporteur: [''],
	propo_taxe: ['',[Validators.required]],
	propo_commission:['',[Validators.required]], 
	propo_mtnprimebrut: ['',[Validators.required]],
	propo_coefbonus: [''],
	propo_coefremisecommerciale: [''],
	propo_codeproduit: ['',[Validators.required]],
	propo_datesituationproposition: ['',[Validators.required]],
	propo_statusproposition: [''],                              //a initialiser dans le backend
	propo_exontaxeenr: ['',[Validators.required]],
	propo_codetaxeenr: ['',[Validators.required]],
	propo_exontva: ['',[Validators.required]],
	propo_codetva: ['',[Validators.required]],
	propo_exontps: ['',[Validators.required]],
	propo_codetps: ['',[Validators.required]],
	propo_dateexon: ['',[Validators.required]],
	propo_codeutil: [''],
	propo_datemaj: ['',],
	propo_datetransformationcontrat: ['',[Validators.required]],
  });

  // ================ Déclarations des variables pour la recherche avec filtre ======================
 clients: Array<Client> = new Array<Client>();
 prospects: Array<Prospect> = new Array<Prospect>();
 branches: Array<Branche> = new Array<Branche>();
 categories: Array<Categorie> = new Array<Categorie>();
 produits: Array<Produit> = new Array<Produit>();
 intermediaires: Array<Intermediaire> = new Array<Intermediaire>();
 compagnieCIMAs: Array<Cimacodificationcompagnie> = new Array<Cimacodificationcompagnie>();

 /** control for the selected  */
 public clientsCtrl: FormControl = new FormControl();
 public prospectCtrl: FormControl = new FormControl();
 public brancheCtrl: FormControl = new FormControl();
 public categorieCtrl: FormControl = new FormControl();
 public produitCtrl: FormControl = new FormControl();
 public intermediaireCtrl: FormControl = new FormControl();
 public cimaCtrl: FormControl = new FormControl();

 /** control for the MatSelect filter keyword */
 public clientsFilterCtrl: FormControl = new FormControl();
 public prospectFilterCtrl: FormControl = new FormControl();
 public brancheFilterCtrl: FormControl = new FormControl();
 public categorieFilterCtrl: FormControl = new FormControl();
 public produitFilterCtrl: FormControl  = new FormControl();
 public intermediaireFilterCtrl: FormControl  = new FormControl();
 public cimaFilterCtrl: FormControl  = new FormControl();

 /** list  filtered by search keyword */
 public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
 public filteredProspect: ReplaySubject<Prospect[]> = new ReplaySubject<Prospect[]>();
 public filteredBranche: ReplaySubject<Branche[]> = new ReplaySubject<Branche[]>();
 public filteredCategorie: ReplaySubject<Categorie[]> = new ReplaySubject<Categorie[]>();
 public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();
 public filteredIntermediaire: ReplaySubject<Intermediaire[]> = new ReplaySubject<Intermediaire[]>();
 public filteredCIMA: ReplaySubject<Cimacodificationcompagnie[]> = new ReplaySubject<Cimacodificationcompagnie[]>();

 @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

 /** Subject that emits when the component has been destroyed. */
 protected _onDestroy = new Subject<void>();

 // ========================================== FIN Déclaration ======================================

  constructor(private fb: FormBuilder,
    private toastrService: NbToastrService,private router: Router,private authService: NbAuthService,
    private produitService: ProduitService,private clientService: ClientService,
    private prospectService: ProspectService, private intermediaireService: IntermediaireService,
    private categorieService: CategorieService, private brancheService: BrancheService,
    private propoService: ProposService, private cimaService: CimacompagnieService, private userService: UserService
    ) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });
   this.onGetAllProduit();
   this.onGetAllBranches();
   this.onGetAllItermediaire();
   this.onGetAllCIMA();
   this.onGetClient();
   this.getlogin();
   
   var d= new Date();
   d.setDate(d.getDate()+1);
   
   this.addForm.controls['propo_date'].setValue(dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm'));
   /* this.addForm.controls['propo_dateeffet1er'].setValue(dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm'));
   this.addForm.controls['propo_dateannivcontrat'].setValue(dateFormatter(d,  'yyyy-MM-ddTHH:mm'));
   this.addForm.controls['propo_dateeffet'].setValue(dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm'));
   this.addForm.controls['propo_dateecheance'].setValue(dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm')); */
   this.addForm.controls['propo_dureecontrat'].setValue(0);
   this.addForm.controls['propo_codecompagnie'].setValue("SNNVIAS008");
   this.addForm.controls['propo_denomcompagnie'].setValue("Société Nationale d'Assurance du Crédit et du Cautionnement du Sénégal (SONAC)");
   //this.addForm.controls['propo_datesituationproposition'].setValue(dateFormatter(new Date(),  'yyyy-MM-ddTHH:mm'));
   this.addForm.controls['propo_datetransformationcontrat'].setValue(dateFormatter(new Date('december 31, 2999 00:00'),  'yyyy-MM-ddTHH:mm'));

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
      this.intermediaireFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererIntermediaires();
      });
      this.cimaFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtererCIMAs();
      });
}

ngOnDestroy() {
 this._onDestroy.next();
 this._onDestroy.complete();
}
protected filtererCIMAs() {
  if (!this.compagnieCIMAs) {
    return;
  }
  // get the search keyword
  let search = this.cimaFilterCtrl.value;
  if (!search) {
    this.filteredCIMA.next(this.compagnieCIMAs.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredCIMA.next(
    this.compagnieCIMAs.filter(c => c.code_cima_compagnie.toLowerCase().indexOf(search) > -1 ) 
  );
}
protected filtererIntermediaires() {
  if (!this.intermediaires) {
    return;
  }
  // get the search keyword
  let search = this.intermediaireFilterCtrl.value;
  if (!search) {
    this.filteredIntermediaire.next(this.intermediaires.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredIntermediaire.next(
    this.intermediaires.filter(c => c.inter_denomination.toLowerCase().indexOf(search) > -1 ||
     c.inter_numero.toString().toLowerCase().indexOf(search) > -1 ) 
  );
}
protected filterProduits() {
  if (!this.produits) {
    return;
  }
  // get the search keyword
  let search = this.produitFilterCtrl.value;
  if (!search) {
    this.filteredProduit.next(this.produits.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredProduit.next(
    this.produits.filter(p => p.prod_denominationlong.toLowerCase().indexOf(search) > -1 ||
    p.prod_numero.toString().indexOf(search) > -1 )
  );
}
protected filterCategories() {
  if (!this.categories) {
    return;
  }
  // get the search keyword
  let search = this.categorieFilterCtrl.value;
  if (!search) {
    this.filteredCategorie.next(this.categories.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredCategorie.next(
    this.categories.filter(cat => cat.categ_libellecourt.toLowerCase().indexOf(search) > -1)
  );
}
protected filterBranches() {
  if (!this.branches) {
    return;
  }
  // get the search keyword
  let search = this.brancheFilterCtrl.value;
  if (!search) {
    this.filteredBranche.next(this.branches.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredBranche.next(
    this.branches.filter(b => b.branche_libelleLong.toLowerCase().indexOf(search) > -1)
  );
}

protected filterClients() {
 console.log(this.clients.filter(cl => cl.clien_nom));
 if (!this.clients) {
   return;
 }
 
 // get the search keyword
 let search = this.clientsFilterCtrl.value;
 if (!search) {
   this.filteredClients.next(this.clients.slice());
   return;
 } else {
   search = search.toLowerCase();
 }
 this.filteredClients.next(
   this.clients.filter(cl => cl?.clien_prenom.toLowerCase().indexOf(search) > -1 ||
    cl.clien_nom?.toLowerCase().indexOf(search) > -1 ||
    cl.clien_sigle?.toLowerCase().indexOf(search) > -1 ||
    cl.clien_denomination?.toLowerCase().indexOf(search) > -1|| 
    cl.clien_numero?.toString().indexOf(search) > -1
   )
   
 );
}
protected filterProspects() {
  if (!this.prospects) {
    return;
  }
  
  // get the search keyword
  let search = this.prospectFilterCtrl.value;
  if (!search) {
    this.filteredProspect.next(this.prospects.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredProspect.next(
    this.prospects.filter(
    p => p.prospc_prenom.toLowerCase().indexOf(search)> -1 ||
     p.prospc_denomination.toLowerCase().indexOf(search)> -1 ||
     p.prospc_nom.toLowerCase().indexOf(search)> -1 ||
     p.prospc_sigle.toLowerCase().indexOf(search)> -1 ||
     p.prospc_numero.toString().indexOf(search)> -1
    
    )    
  );
 }
// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================

  
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
    
    this.addForm.controls['propo_datemaj'].setValue(new Date());
    console.log(new Date());
      this.addForm.controls['propo_codeutil'].setValue(this.user.util_numero);
      this.propoService.addProposition(this.addForm.value)
      .subscribe((data) => {
        console.log(data);
        this.toastrService.show(
          'Proposition Enregistré avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 10000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.router.navigateByUrl('home/gestion-proposition');
      },
      (error) => {
        this.toastrService.show(
          error.error.message,
          'Notification d\'erreur',
          {
            status: this.statusFail,
            destroyByClick: true,
            duration: 0,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
      },
      );
        }
        cancel() {
          this.router.navigateByUrl('home/gestion-proposition')
        }
        onGetAllCIMA(){
          this.cimaService.getAllCimaCompagnie()
          .subscribe((data: Cimacodificationcompagnie[]) => {
            this.compagnieCIMAs = data as Cimacodificationcompagnie[];      
            this.filteredCIMA.next(this.compagnieCIMAs.slice());
          });
        }
        onGetAllBranches(){
          this.brancheService.getAllBranches()
          .subscribe((data: Branche[]) => {
            this.branches = data as Branche[];      
            this.filteredBranche.next(this.branches.slice());
          });
        }
        onGetAllItermediaire(){
          this.intermediaireService.getAllIntermediaires()
          .subscribe((data: Intermediaire[]) => {
            this.intermediaires = data as Intermediaire[];      
            this.filteredIntermediaire.next(this.intermediaires.slice());
          });
        }
        onGetAllProduit(){
          this.produitService.getAllProduits()
            .subscribe((data: Produit[]) => {
            this.produits = data as Produit[];
            this.filteredProduit.next(this.produits.slice());
          });
        }
        onGetAllCategorieByBranche(branche: number){
          this.categorieService.getAllCategorieBranche(branche)
          .subscribe((data: Categorie[]) => {
            this.categories = data as Categorie[];      
            this.filteredCategorie.next(this.categories.slice());
          });
        }
        onGetAllProduitByCategorie(categorie: number){
          this.produitService.getAllProduitByCategorie(categorie)
            .subscribe((data: Produit[]) => {
            this.produits = data as Produit[];      
            this.filteredProduit.next(this.produits.slice());
          });
        }
        onGetClient(){
          this.clientService.getAllClients()
          .subscribe((data: Client[]) => {
            this.clients = data as Client[];      
            this.filteredClients.next(this.clients.slice());
          });
        }
          onChangeBranche(event) {
            this.onGetAllCategorieByBranche(event.value);
            this.addForm.controls['propo_numerobranche'].setValue(event.value);
        
        console.log(event.value);
            this.numCategorie = "".toString();
            this.numProduit = "".toString();
            this.addForm.controls['propo_numerocategorie'].setValue(this.numCategorie);
            this.addForm.controls['propo_codeproduit'].setValue(this.numProduit);
          }
          onChangeCategorie(event) {
            this.onGetAllProduitByCategorie(event.value);
            console.log(event.value);
            //this.numCategChoisi = event.value;
            this.addForm.controls['propo_numerocategorie'].setValue(event.value);
        
            this.numProduit = "".toString();
            this.addForm.controls['propo_codeproduit'].setValue(this.numProduit);
          }
          onChangeProduit(event) {
            this.addForm.controls['propo_codeproduit'].setValue(event.value);
          }
          
          onChangeItermediaire(event) {
            this.addForm.controls['propo_codeintermediaire'].setValue(event.value);
          }
          onChangeCompagnie(event) {
            this.addForm.controls['propo_codecompagnie'].setValue(event.value);
          }
          onChangeClient(event) {
            this.addForm.controls['propo_numerosouscripteur'].setValue(event.value);
          }
        

  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
     return false;
    else
     return true;

  }
}
