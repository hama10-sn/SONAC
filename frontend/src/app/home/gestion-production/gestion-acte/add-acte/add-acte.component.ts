import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Beneficiaire } from '../../../../model/Beneficiaire';
import { Clause } from '../../../../model/Clause';
import { Client } from '../../../../model/Client';
import { Lot } from '../../../../model/Lot';
import { Police } from '../../../../model/Police';
import { ActeService } from '../../../../services/acte.service';
import { BeneficiaireService } from '../../../../services/beneficiaire.service';
import { ClauseService } from '../../../../services/clause.service';
import { ClientService } from '../../../../services/client.service';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { LotService } from '../../../../services/lot.service';
import { PoliceService } from '../../../../services/police.service';
import type  from '../../../data/type.json';

@Component({
  selector: 'ngx-add-acte',
  templateUrl: './add-acte.component.html',
  styleUrls: ['./add-acte.component.scss']
})
export class AddActeComponent implements OnInit {

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
 
  public displayedColumns = [ 'clact_numeroclause',
  'clact_type','clact_numlot','choix'];
   public dataSource = new MatTableDataSource<Clause>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;

   clActes : Array<Clause> = new Array<Clause>();

  autorisation: [];

  addForm = this.fb.group({
      
  act_numero: [''],
  act_numeropolice: ['',[Validators.required]],
  act_typegarantie: ['',[Validators.required]],
  act_typemarche: [''],
  act_numeromarchepublic: [''],
  act_codemarche: [''],
  act_datemarche: [''],
  act_idcontractante: ['',[Validators.required]],
  act_idbeneficiaire: ['',[Validators.required]],
  act_idcandidat: ['',[Validators.required]],
  act_descriptionmarche: [''],
  act_capitalassure: ['',[Validators.required]],
  act_capitalsmp: [''],
  act_capitallci: [''],
  act_anciennumero: [''],
  act_status: [''],
  act_datecomptabilisation: [''],
  });
  dateComptabilisation: Date;
  clients: Array<Client> = new Array<Client>();
 // ================ Déclarations des variables pour la recherche avec filtre ======================
 polices: Array<Police> = new Array<Police>();
 lots: Array<Lot> = new Array<Lot>();
beneficiaires: Array<Beneficiaire> = new Array<Beneficiaire>();
@Input() types:any [] =type;
nameCli:any;
 //@Input() types:any [] =type;
 clientss: Array<Client> = new Array<Client>();
 /** control for the selected  */
 public policesCtrl: FormControl = new FormControl();
 public lotsCtrl: FormControl = new FormControl();
 public beneficiairesCtrl: FormControl = new FormControl();
 public actesCtrl: FormControl = new FormControl();
 
 //public typesCtrl: FormControl = new FormControl();
 public clientsCtrl: FormControl = new FormControl();
 public lotsFilterCtrl: FormControl = new FormControl();
 public actesFilterCtrl: FormControl = new FormControl();
 public beneficiairesFilterCtrl: FormControl = new FormControl();

 public policesFilterCtrl: FormControl = new FormControl();
 //public typesFilterCtrl: FormControl = new FormControl();
 public clientsFilterCtrl: FormControl = new FormControl();
 public filteredLots: ReplaySubject<Lot[]> = new ReplaySubject<Lot[]>();
 public filteredBeneficiaires: ReplaySubject<Beneficiaire[]> = new ReplaySubject<Beneficiaire[]>();

 /** list of classifications filtered by search keyword */
 public filteredPolices: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
 //public filteredTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>();
 public filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>();
 public filteredActes: ReplaySubject<any[]> = new ReplaySubject<any[]>();
 
 @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

 /** Subject that emits when the component has been destroyed. */
 protected _onDestroy = new Subject<void>();

 // ========================================== FIN Déclaration ======================================
 listTypes: any [];
 client:any;
 listActes: any[];

 formatcapitalassure: Number;
 formatcapital: Number;
 formatcapitallci: Number;

 ClientByPolice:String;
 displayclient: boolean = false;

  constructor(
    private fb: FormBuilder, private authService: NbAuthService,
    private toastrService: NbToastrService,private router: Router,
    private acteService: ActeService, private policeService: PoliceService,
    private clActeService: ClauseService, private dialogService: NbDialogService,
    private lotService: LotService,private beneficiaireService: BeneficiaireService,
    private clientService: ClientService,private formatNumberService: FormatNumberService
    ) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });
   this.listActes=this.types['TYPE_ACTE'];
   this.filteredActes.next(this.listActes.slice());
    this.onGetAllPolice();
    this.onGetAllClause();
    this.onGetAllClient();
    this.onGetAllLot();
    this.onGetAllBeneficiaire();
   //this.listTypes=this.types['TYPE_CLAUSE'];
   //this.filteredTypes.next(this.listTypes.slice());
   // =================== Listen for search field value changes =======================
   this.clientsFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filterClients();
  });
  this.actesFilterCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
   this.filterActes();
  });
   this.policesFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterPolices();
   });
   this.lotsFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterLots();
   });
   this.beneficiairesFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterBeneficiaires();
   });

}
onGetAllClient(){
  this.clientService.getAllClients()
  .subscribe((data: Client[]) => {
    this.clientss = data as Client[];      
    this.filteredClients.next(this.clientss.slice());
  });
  console.log(this.clientss)
}
onGetAllLot() {
  this.lotService.getAllLots()
    .subscribe((data: Lot[]) => {
      this.lots = data as Lot[];
      this.filteredLots.next(this.lots.slice());
    });
} 
onGetAllBeneficiaire() {
  this.beneficiaireService.getAllBeneficiaires()
    .subscribe((data: Beneficiaire[]) => {
      this.beneficiaires = data as Beneficiaire[];
      this.filteredBeneficiaires.next(this.beneficiaires.slice());
    });
} 
onGetAllClause(){
  this.clActeService.getAllClauses()
    .subscribe((data: Clause[]) => {
        this.clActes = data;
        this.dataSource.data = data;
        console.log(this.clActes);
    });  
}
ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}
protected filterActes() {
  if (!this.listActes) {
    return;
  }
  // get the search keyword
  let search = this.actesFilterCtrl.value;
  if (!search) {
    this.filteredActes.next(this.listActes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredActes.next(
    this.listActes.filter(typ => typ.id.toLowerCase().indexOf(search) > -1 || 
    typ.value.toLowerCase().indexOf(search) > -1)
    
  );
}
protected filterLots() {
  
  if (!this.lots) {
    return;
  }
  // get the search keyword
  let search = this.lotsFilterCtrl.value;
  if (!search) {
    this.filteredLots.next(this.lots.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredLots.next(
    this.lots.filter(l => l.lot_numero.toString()?.toLowerCase().indexOf(search) > -1 )
    
  );
}

protected filterBeneficiaires() {
  if (!this.listTypes) {
    return;
  }
  // get the search keyword
  let search = this.beneficiairesFilterCtrl.value;
  if (!search) {
    this.filteredBeneficiaires.next(this.beneficiaires.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredBeneficiaires.next(
    this.beneficiaires.filter(typ => typ.benef_Num.toString().toLowerCase().indexOf(search) > -1 || 
    typ.benef_nom.toLowerCase().indexOf(search) > -1 || typ.benef_prenoms.toLowerCase().indexOf(search) > -1
    || typ.benef_denom.toLowerCase().indexOf(search) > -1)
    
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

protected filterPolices() {
  if (!this.polices) {
    return;
  }
  // get the search keyword
  let search = this.policesFilterCtrl.value;
  if (!search) {
    this.filteredPolices.next(this.polices.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredPolices.next(
    this.polices.filter(cl => cl.poli_numero.toString().toLowerCase().indexOf(search) > -1  )
    
  );
}

// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================


  /*
    cette methode nous permet de faire des paginations
    */
    ngAfterViewInit(): void {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    /*
      cette methode nous permet de faire des filtre au niveau 
      de la recherche dans la liste
      */
    public doFilter = (value: string) => {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }


  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data ;
        this.filteredPolices.next(this.polices.slice());
      });
  }
  
  submit() { 
    this.addForm.controls['act_capitalassure'].setValue(this.formatcapitalassure);
    this.addForm.controls['act_capitalsmp'].setValue(this.formatcapital);
    this.addForm.controls['act_capitallci'].setValue(this.formatcapitallci);
    this.acteService.addActe(this.addForm.value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
        'Acte numéro ' + data.act_numero + ' enregistré avec succés !',
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion-acte');
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
        this.router.navigateByUrl('home/gestion-acte')
      }

      onFocusOutEventCapitalAssure() {
    
        // tslint:disable-next-line:max-line-length
        this.formatcapitalassure = Number(this.formatNumberService.replaceAll((this.addForm.get("act_capitalassure").value),' ',''));
        console.log( this.formatcapitalassure);
        if (this.formatcapitalassure !=null){
      
          console.log( this.formatNumberService.numberWithCommas2( this.formatcapitalassure));
    
         // tslint:disable-next-line:max-line-length
         this.addForm.controls['act_capitalassure'].setValue(this.formatNumberService.numberWithCommas2( this.formatcapitalassure));
        }
      }
      onFocusCapital() {
    
        // tslint:disable-next-line:max-line-length
        this.formatcapital = Number(this.formatNumberService.replaceAll((this.addForm.get("act_capitalsmp").value),' ',''));
        console.log( this.formatcapital);
        if (this.formatcapital !=null){
      
          console.log( this.formatNumberService.numberWithCommas2( this.formatcapital));
    
         // tslint:disable-next-line:max-line-length
         this.addForm.controls['act_capitalsmp'].setValue(this.formatNumberService.numberWithCommas2( this.formatcapital));
        }
      }
      onFocusCapitallci() {
    
        // tslint:disable-next-line:max-line-length
        this.formatcapitallci = Number(this.formatNumberService.replaceAll((this.addForm.get("act_capitallci").value),' ',''));
        console.log( this.formatcapital);
        if (this.formatcapitallci !=null){
      
          console.log( this.formatNumberService.numberWithCommas2( this.formatcapital));
    
         // tslint:disable-next-line:max-line-length
         this.addForm.controls['act_capitallci'].setValue(this.formatNumberService.numberWithCommas2( this.formatcapitallci));
        }
      }
      onChangeCandidat(event) {
        this.addForm.controls['act_idcandidat'].setValue(event.value);
      }
      onChange(event) {
        this.addForm.controls['act_status'].setValue(event);
      }
      onChangeBeneficiaire(event) {
        this.addForm.controls['act_idbeneficiaire'].setValue(event);
      }
      
      onChangeActe(event) {
        this.addForm.controls['act_typegarantie'].setValue(event.value);
      }
      onChangePolice(event) {

        this.acteService.lastID(event.value).subscribe((data)=>{
          if(data==0){
            this.addForm.controls['act_numero'].setValue(event.value.toString()+"0000001");
          }else{
            this.addForm.controls['act_numero'].setValue(Number(data)+1);
          }
        })
        //(this.polices.find(p => p.poli_numero == event.value))?.poli_dateeffetencours
        this.addForm.controls['act_idcontractante'].setValue((this.polices.find(p => p.poli_numero == event.value))?.poli_souscripteur);
        this.addForm.controls['act_idbeneficiaire'].setValue((this.polices.find(p => p.poli_numero == event.value))?.poli_souscripteur);
        this.addForm.controls['act_numeropolice'].setValue(event.value);
        
        //this.nameCli=this.onGetLibelleByClient((this.polices.find(p => p.poli_numero == event.value))?.poli_souscripteur);
        this.onGetLibelle(event.value);
      
      }
      onGetLibelle(mun:any){
        this.clientService.getClientByPolice(mun)
        .subscribe((data: any) => {
          this.client=data;
          console.log(this.client);
          this.displayclient = true;
          //console.log(this.client);
          if(this.client.clien_prenom=="" || this.client.clien_prenom==null){
            console.log(this.client?.clien_prenom +" "+ this.client?.clien_nom);
            this.ClientByPolice=this.client?.clien_numero+": "+this.client?.clien_denomination;
          }else{
            console.log(this.client?.clien_denomination);
            this.ClientByPolice=this.client?.clien_numero+": "+this.client?.clien_prenom +" "+ this.client?.clien_nom;
          }
        });
      }
      onGetLibelleByClient(numero: any) {
        console.log(this.clientss)
        if(((this.clientss?.find(b => b.clien_numero === numero))?.clien_nature) ==="1"){
          console.log(numero + " : " + (this.clientss?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom);
          return numero + " : " + (this.clientss?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clients?.find(b => b.clien_numero === numero))?.clien_prenom;
      
        }else{
          console.log(numero + " : " + (this.clientss?.find(b => b.clien_numero === numero))?.clien_denomination);
          return numero + " : " + (this.clientss?.find(b => b.clien_numero === numero))?.clien_denomination;
      }
    }
      
 /*  onChangeBranche(event) {
    console.log(event.value); 
    this.onGetAllTaxeByBranche(event.value);
    this.onGetAllCategorieByBranche(event.value);
    
    this.cat_codetaxe = "".toString();
    this.addForm.controls['categ_codetaxe'].setValue(this.cat_codetaxe);
    this.categorieService.lastID(event.value).subscribe((data)=>{
      if(data==0){
        this.addForm.controls['categ_numero'].setValue(event.value.toString()+"001");
      }else{
        this.addForm.controls['categ_numero'].setValue(Number(data)+1);
      }
    })
    this.addForm.controls['categ_numerobranche'].setValue(event.value);
    

  } */
      
      onChangeid(event) {
        this.addForm.controls['act_idbeneficiaire'].setValue(event.target.value);
      }

      check_fonct(fonct: String) {

        let el = this.autorisation.findIndex(itm => itm === fonct);
        if (el === -1)
         return false;
        else
         return true;
    
      }
}
