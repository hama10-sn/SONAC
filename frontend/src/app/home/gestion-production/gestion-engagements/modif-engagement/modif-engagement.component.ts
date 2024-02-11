import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { Acte } from '../../../../model/Acte';
import { Avenant } from '../../../../model/Avenant';
import { Police } from '../../../../model/Police';
import { ActeService } from '../../../../services/acte.service';
import { EngagementService } from '../../../../services/engagement.service';
import { PoliceService } from '../../../../services/police.service';
import dateFormatter from 'date-format-conversion';
import { User } from '../../../../model/User';
import { Client } from '../../../../model/Client';
import { UserService } from '../../../../services/user.service';
import { AvenantService } from '../../../../services/avenant.service';
import type  from '../../../data/type.json';
import { ClientService } from '../../../../services/client.service';
import { Marche } from '../../../../model/Marche';
import { MarcheService } from '../../../../services/marche.service';
import { ProduitService } from '../../../../services/produit.service';
import { FormatNumberService } from '../../../../services/formatNumber.service';
import { Engagement } from '../../../../model/Engagement';
import { TransfertDataService } from '../../../../services/transfertData.service';


@Component({
  selector: 'ngx-modif-engagement',
  templateUrl: './modif-engagement.component.html',
  styleUrls: ['./modif-engagement.component.scss']
})
export class ModifEngagementComponent implements OnInit {

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  login:any;
  user: User;
  autorisation: [];
  numAvenant: Number;
  listActes:any[];
  lib:any;
  prod:any;

  modifForm = this.fb.group({
  engag_numeroengagement: [''],
  engag_numpoli: ['',[Validators.required]],
  engag_numeroavenant: [''],
  engag_numeroacte: ['',[Validators.required]],
  engag_codemarche: [''],
  engag_kapassure: ['',[Validators.required]],
  engag_dateengagement: ['',[Validators.required]],
  engag_capitalliberationengage: [''],
  engag_dateliberation: [''],
  engag_typesurete: ['',[Validators.required]],
  engag_identificationtitre: [''],
  engag_retenudeposit: [''],
  engag_datedeposit: [''],
  engag_depositlibere: [''],
  engag_dateliberationdeposit: [''],
  engag_cautionsolidaire: [''],
  engag_datecomptabilisation: [''],
  engag_status: [''],
  engag_codeutilisateur: [''],
  engag_datemodification: [''],

  });
  dateComptabilisation: Date;
  dateEngagement: Date;
  souscripteur: any;
  displaytype: boolean = false;
  displayCaution: boolean = false;
  verifDeposite: boolean = true;
  verifEngag: boolean = true;
  verifLib: boolean = true;
  displaytypedepo: boolean = false;
  displaytypeNature: boolean = false;
  displaytypeNature1: boolean = false;
  displayclient: boolean = false;
  displayPro: boolean = false;
  displayProd: boolean = false;
  produit:any;
  pro:any;
  ClientByPolice:any;
  engagement: Engagement;
 // ================ Déclarations des variables pour la recherche avec filtre ======================
 avenants: Array<Avenant> = new Array<Avenant>();
 polices: Array<Police> = new Array<Police>();
 actes: Array<Acte> = new Array<Acte>();
 clientes: Array<Client> = new Array<Client>();
 marches: Array<Marche> = new Array<Marche>();
 @Input() types:any [] =type;

 /** control for the selected  */
 public actesCtrl: FormControl = new FormControl();
 public policesCtrl: FormControl = new FormControl();
 public avenantsCtrl: FormControl = new FormControl();
 public typesCtrl: FormControl = new FormControl();
 public marchesCtrl: FormControl = new FormControl();

 /** control for the MatSelect filter keyword */
 public actesFilterCtrl: FormControl = new FormControl();
 public policesFilterCtrl: FormControl = new FormControl();
 public avenantsFilterCtrl: FormControl = new FormControl();
 public typesFilterCtrl: FormControl = new FormControl();
 public marchesFilterCtrl: FormControl = new FormControl();

 /** list of classifications filtered by search keyword */
 public filteredActes: ReplaySubject<Acte[]> = new ReplaySubject<Acte[]>();
 public filteredPolices: ReplaySubject<Police[]> = new ReplaySubject<Police[]>();
 public filteredAvenants: ReplaySubject<Avenant[]> = new ReplaySubject<Avenant[]>();
 public filteredTypes: ReplaySubject<any[]> = new ReplaySubject<any[]>();
 public filteredMarches: ReplaySubject<Marche[]> = new ReplaySubject<Marche[]>();

 @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

 /** Subject that emits when the component has been destroyed. */
 protected _onDestroy = new Subject<void>();

 // ========================================== FIN Déclaration ======================================
 client:any;
 listTypes: any [];
 listTypeCausions: any [];
 listTypeCausions1: any [];
 echeance: Date;
 effet: Date;
 dateEcheance: Date;
 deposite: Date;
 dateEng: Date;
 dateLib: Date;
 formatcapitalassure: Number;
 datetraite: Date;
 dateliberation: Date;
  constructor(
    private fb: FormBuilder,
    private authService: NbAuthService,private engagementService: EngagementService,
    private toastrService: NbToastrService,private router: Router,
    private acteService: ActeService, private policeService: PoliceService,
    private userService: UserService, private avenantService: AvenantService,
    private clientService: ClientService, private marcheService: MarcheService,
    private produitService: ProduitService, private formatNumberService: FormatNumberService,
    private transfertData: TransfertDataService
    ) { }

  ngOnInit(): void {
    this.authService.onTokenChange()
    .subscribe((token: NbAuthJWTToken) => {

     if (token.isValid()) {
       this.autorisation = token.getPayload().fonctionnalite.split(',');
       console.log(this.autorisation);
     }
   });
   this.engagement = this.transfertData.getData();
   console.log(this.engagement);
   this.modifForm.controls['engag_numeroengagement'].setValue(this.engagement.engag_numeroengagement);
   console.log(this.engagement.engag_numeroengagement);
        this.modifForm.controls['engag_numpoli'].setValue(this.engagement.engag_numpoli);
        //this.clientnum = this.engagement.cont_numeroclient;
        //this.numero_client = this.engagement.cont_numeroclient.toString();
        this.modifForm.controls['engag_numeroacte'].setValue(this.engagement.engag_numeroacte);
        this.modifForm.controls['engag_kapassure'].setValue(this.engagement.engag_kapassure);
        this.modifForm.controls['engag_codemarche'].setValue(this.engagement.engag_codemarche);
        //this.leader =this.engagement.cont_leader.toString();
        this.datetraite = dateFormatter(this.engagement.engag_dateengagement,  'yyyy-MM-ddThh:mm') ;
        this.modifForm.controls['engag_dateengagement'].setValue(this.datetraite);
       // this.mandataire =this.engagement.cont_mandataire.toString();
        this.modifForm.controls['engag_capitalliberationengage'].setValue(this.engagement.engag_capitalliberationengage);
        this.dateliberation = dateFormatter(this.engagement.engag_dateliberation,  'yyyy-MM-ddThh:mm') ;
        this.modifForm.controls['engag_dateliberation'].setValue(this.engagement.engag_dateliberation);
       // this.modifForm.controls['engag_datemodification'].setValue(this.engagement.engag_datemodification);
         
   this.getlogin();
   this.listTypes=this.types['TYPE_SURETE'];
   this.listTypeCausions=this.types['TYPE_CAUTION_SOLIDAIRE'];
        console.log(this.listTypes);
   
    this.onGetAllClient();
    //this.onGetAllActe();
    this.onGetAllPolice();
    this.onGetAllAvenant();
    this.onGetAllMarcher();


    this.filteredTypes.next(this.listTypes.slice());
    
   // =================== Listen for search field value changes =======================
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

   this.avenantsFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterAvenants();
   });
   this.typesFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterTypes();
   });
   this.marchesFilterCtrl.valueChanges
   .pipe(takeUntil(this._onDestroy))
   .subscribe(() => {
    this.filterMarches();
   });
}

ngOnDestroy() {
  this._onDestroy.next();
  this._onDestroy.complete();
}
getlogin(): any {
  this.authService.getToken()
    .subscribe((token: NbAuthJWTToken) => {
      if (token.isValid()) {
        this.login = token.getPayload();
        this.userService.getUser(this.login.sub)
    .subscribe((data: User) => {
      this.user = data;
      //console.log(this.user);
    });
      }
    });
}

protected filterTypes() {
  if (!this.listTypes) {
    return;
  }
  // get the search keyword
  let search = this.typesFilterCtrl.value;
  if (!search) {
    this.filteredTypes.next(this.listTypes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredTypes.next(
    this.listTypes.filter(typ => typ.id.toLowerCase().indexOf(search) > -1 || 
    typ.value.toString().indexOf(search) > -1)
    
  );
}
protected filterMarches() {
  if (!this.marches) {
    return;
  }
  // get the search keyword
  let search = this.marchesFilterCtrl.value;
  if (!search) {
    this.filteredMarches.next(this.marches.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredMarches.next(
    this.marches.filter(typ => typ.march_numero.toString().toLowerCase().indexOf(search) > -1)
    
  );
}
protected filterActes() {
  console.log(this.actes.filter(cl => cl.act_numero));
  if (!this.actes) {
    return;
  }
  // get the search keyword
  let search = this.actesFilterCtrl.value;
  if (!search) {
    this.filteredActes.next(this.actes.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredActes.next(
    this.actes.filter(cl => cl.act_numero.toString()?.toLowerCase().indexOf(search) > -1  )
    
  );
}
protected filterAvenants() {
  
  if (!this.avenants) {
    return;
  }
  // get the search keyword
  let search = this.avenantsFilterCtrl.value;
  if (!search) {
    this.filteredAvenants.next(this.avenants.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  this.filteredAvenants.next(
    this.avenants.filter(l => l.aven_numeroavenant.toString()?.toLowerCase().indexOf(search) > -1 )
    
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
    this.polices.filter(cl => cl.poli_numero.toString()?.toLowerCase().indexOf(search) > -1  )
    
  );
}

// ================== FIN IMPLEMENTATION POUR LA RECHERCHE AVEC FILTRE =============================
onFocusOutEventCapitalAssure() {
    
  // tslint:disable-next-line:max-line-length
  this.formatcapitalassure = Number(this.formatNumberService.replaceAll((this.modifForm.get("engag_kapassure").value),' ',''));
  console.log( this.formatcapitalassure);
  if (this.formatcapitalassure !=null){

    console.log( this.formatNumberService.numberWithCommas2( this.formatcapitalassure));

   // tslint:disable-next-line:max-line-length
   this.modifForm.controls['engag_kapassure'].setValue(this.formatNumberService.numberWithCommas2( this.formatcapitalassure));
  }
}
onGetAllMarcher() {
  this.marcheService.getAllMarches()
    .subscribe((data: Marche[]) => {
      this.marches = data as Marche[];
      this.filteredMarches.next(this.marches.slice());
    });
}

  onGetAllActe(act:Number) {
    this.acteService.getAllActeByPolice(act)
      .subscribe((data: Acte[]) => {
        this.actes = data as Acte[];
        this.filteredActes.next(this.actes.slice());
        console.log(this.listActes);
      });
  }
  onGetAllClient() {
    this.clientService.getAllClients()
      .subscribe((data: Client[]) => {
        this.clientes = data as Client[];
        //this.filteredActes.next(this.actes.slice());
      });
  }
  onGetAllPolice() {
    this.policeService.getAllPolice()
      .subscribe((data: Police[]) => {
        this.polices = data as Police[];
        this.filteredPolices.next(this.polices.slice());
      });
  }
  
  onGetAllAvenant() {
    this.avenantService.getAllAvenants()
      .subscribe((data: Avenant[]) => {
        this.avenants = data as Avenant[];
        this.filteredAvenants.next(this.avenants.slice());
        console.log(this.avenants);
      });
  } 
  
  onGetPoliceBySouscripeur(numero:number){
    console.log(this.polices);
    //console.log((this.polices.find(c => c.poli_numero === numero))?.poli_souscripteur);
    return  (this.polices.find(c => c.poli_numero === numero))?.poli_client ;
  }
  onGetLibelleByClient(numero: Number) {
    // console.log(this.clients);
     //console.log(numero + " : " + (this.clients?.find(b => b.clien_numero === numero))?.clien_nature);
     if(((this.clientes?.find(b => b.clien_numero === numero))?.clien_nature) == "1"){
       return (this.clientes?.find(b => b.clien_numero === numero))?.clien_nom + " " + (this.clientes?.find(b => b.clien_numero === numero))?.clien_prenom;  
     }else
       return (this.clientes?.find(b => b.clien_numero === numero))?.clien_denomination;  
     }
/* onGetProduitByPolice(engagement: any){
  this.produitService.getProduitByPolice(engagement)
      .subscribe((data: any) => {
       // engagement.p=data;
        return data.prod_denominationcourt
      });
} */
  submit() { 
    this.modifForm.controls['engag_datemodification'].setValue(new Date());
    //this.modifForm.controls['engag_cautionsolidaire'].setValue();
    this.modifForm.controls['engag_kapassure'].setValue(this.formatcapitalassure);
    console.log(this.modifForm.controls['engag_kapassure'].value);
    this.modifForm.controls['engag_codeutilisateur'].setValue(this.user.util_numero);
    this.engagementService.update(this.modifForm.value)
    .subscribe((data) => {
      console.log(data);
      this.toastrService.show(
           " numero engagement"+ data.engag_numeroengagement+": enregistrer avec succé.",
        'Notification',
        {
          status: this.statusSuccess,
          destroyByClick: true,
          duration: 300000,
          hasIcon: true,
          position: this.position,
          preventDuplicates: false,
        });
        this.router.navigateByUrl('home/gestion-engagement');
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
        this.router.navigateByUrl('home/gestion-engagement')
      }
      onGetTypeByClient(code:number){
        console.log((this.clientes.find(b => b.clien_numero === code))?.clien_nature);
        return  (this.clientes.find(b => b.clien_numero === code))?.clien_nature ;       
      }

      onGetLibelle(mun:any){
        this.clientService.getClientByPolice(mun)
        .subscribe((data: any) => {
          this.client=data;
          this.displayclient = true
          //console.log(this.client);
          if(this.client.clien_prenom=="" || this.client.clien_prenom==null){
            console.log(this.client?.clien_prenom +" "+ this.client?.clien_nom);
            this.ClientByPolice=this.client?.clien_denomination;
          }else{
            console.log(this.client?.clien_denomination);
            this.ClientByPolice=this.client?.clien_prenom +" "+ this.client?.clien_nom;
          }
        });
      }

      onGetProduitByPolice(num:any){
        this.produitService.getProduitByPolice(num)
        .subscribe((data: any) => {
          this.produit=data;
          this.displayPro = true;
           if(this.produit.prod_numerobranche == "15"){            
          this.displayProd = true;
          }else{
            this.displayProd = false;
          }
          this.pro=this.produit?.prod_denominationlong;
        });
      }

      onChangePolice(event) {
        this.modifForm.controls['engag_numpoli'].setValue(event.value);
        this.onGetAllActe(event.value);
        this.souscripteur=((this.polices.find(p => p.poli_numero == event.value))?.poli_client);
       // console.log(this.onGetProduitByPolice(event.value));
        this.onGetProduitByPolice(event.value);
       
        //this.onGetLibelle(event.value);
        //console.log(this.getClientByPolice(event.value));
        console.log(this.onGetLibelle(event.value));
        
      this.onGetLibelle(event.value);
        
//1 physique  2. caution solidaire personne dirigeante
//2 morale    1. caution solidaire maison mere

/* this.policeService.getLastAvenantByPolice(event.value).subscribe((data)=>{
 
    this.modifForm.controls['engag_numeroavenant'].setValue(event.value +1);
 
}) */
//console.log(this.onGetLibelleByClient(this.onGetPoliceBySouscripeur(event.value)));

if(((this.polices.find(p => p.poli_numero == event.value))?.poli_branche) === 15){

  this.displayProd = true
}

        this.dateEngagement = dateFormatter(((this.polices.find(p => p.poli_numero == event.value))?.poli_dateeffetencours), 'yyyy-MM-ddTHH:mm');
        this.modifForm.controls['engag_dateengagement'].setValue(this.dateEngagement);
        //console.log(this.dateEngagement);
        this.echeance=dateFormatter(((this.polices.find(p => p.poli_numero == event.value))?.poli_dateecheance),  'yyyy-MM-ddTHH:mm');
        //console.log(this.echeance);
        this.modifForm.controls['engag_dateliberation'].setValue(this.echeance); 
        this.dateEcheance= ((this.polices.find(p => p.poli_numero == event.value))?.poli_dateecheance) as Date;
        //console.log(this.dateEcheance);
        this.effet=((this.polices.find(p => p.poli_numero == event.value))?.poli_dateeffetencours) as Date;

        //console.log(this.types['TYPE_CAUTION_SOLIDAIRE']);
        //this.listTypeCausions1=this.types['TYPE_CAUTION_SOLIDAIRE']
        //this.listTypeCausions=this.listTypeCausions1.find(p => p.id == '1');
        //console.log(this.listTypeCausions);

         if(this.onGetTypeByClient(this.souscripteur) == '1'){
          this.displaytypeNature = true;
          this.displaytypeNature1 = false;
          console.log(this.onGetTypeByClient(this.souscripteur));
        this.listTypeCausions1=this.types['TYPE_CAUTION_SOLIDAIRE'];
        //console.log(this.listTypeCausions1);
        this.listTypeCausions=this.listTypeCausions1.filter(p => p.id == '1')
        //this.modifForm.controls['engag_cautionsolidaire'].setValue((this.listTypeCausions1.filter(p => p.id == '1')));
       // console.log(this.listTypeCausions);
        }else if(this.onGetTypeByClient(this.souscripteur) == '2'){
          
        this.listTypeCausions1=this.types['TYPE_CAUTION_SOLIDAIRE'];
        this.listTypeCausions=this.listTypeCausions1.filter(p => p.id == '2')
        //this.modifForm.controls['engag_cautionsolidaire'].setValue((this.listTypeCausions1.filter(p => p.id == '2')));
          this.displaytypeNature1 = true;
          this.displaytypeNature = false;
        // console.log(this.listTypeCausions1);
        //console.log(this.listTypeCausions);

        }  

      }
      onChangeFocus(event: any){
        console.log(this.dateEcheance);
        this.deposite=this.modifForm.controls['engag_datedeposit'].value;
        //this.verifDeposite= true;
        if( dateFormatter(this.deposite, 'yyyy-MM-dd') >= dateFormatter(this.effet, 'yyyy-MM-dd') && dateFormatter(this.dateEcheance, 'yyyy-MM-dd') >= dateFormatter(this.deposite, 'yyyy-MM-dd') ){
          
          
          //console.log("yagui ci");
          this.verifDeposite= true;
        }else{
          //console.log("dou bou baxbi");
          this.verifDeposite= false;
          this.modifForm.controls['engag_datedeposit'].setValue("");
        }
      }
      
      onChangeFocusEngagementEffet(event: any){
        console.log(this.dateEcheance);
        this.dateEng=this.modifForm.controls['engag_dateengagement'].value;
        //this.verifDeposite= true;
        if( dateFormatter(this.dateEng, 'yyyy-MM-dd') >= dateFormatter(this.effet, 'yyyy-MM-dd') && dateFormatter(this.dateEcheance, 'yyyy-MM-dd') >= dateFormatter(this.dateEng, 'yyyy-MM-dd') ){
          //console.log("yagui ci");
          this.verifEngag= true;
        }else{
          //console.log("dou bou baxbi");
          this.modifForm.controls['engag_dateengagement'].setValue("");
          this.verifEngag= false;
        }
      }
      
      onChangeFocusLibere(event: any){
        this.dateEng=this.modifForm.controls['engag_dateengagement'].value;
        this.dateLib=this.modifForm.controls['engag_dateliberation'].value;
        //this.verifDeposite= true;
        if( dateFormatter(this.dateLib, 'yyyy-MM-dd') > dateFormatter(this.dateEng, 'yyyy-MM-dd') ){
          
          this.verifLib= true;
        }else{
          
          this.modifForm.controls['engag_dateliberation'].setValue("");
          this.verifLib= false;
        }
      }
      onChangeType(event) {
        //console.log(event.value);
        this.modifForm.controls['engag_typesurete'].setValue(event.value);

         if(event.value == '1'){
           this.displaytype=true;
           this.displaytypedepo=false;
           this.displayCaution=false;
          this.modifForm.controls['engag_identificationtitre'].setValidators(Validators.required);
          this.modifForm.controls['engag_retenudeposit'].clearValidators();
          this.modifForm.controls['engag_datedeposit'].clearValidators();
          this.modifForm.controls['engag_cautionsolidaire'].clearValidators();
        }else if(event.value == '2'){
          this.displaytypedepo=true;
          this.displaytype=false;
          this.displayCaution=false;
          this.modifForm.controls['engag_identificationtitre'].clearValidators();
          this.modifForm.controls['engag_retenudeposit'].setValidators(Validators.required);
          this.modifForm.controls['engag_datedeposit'].setValidators(Validators.required);
          this.modifForm.controls['engag_cautionsolidaire'].clearValidators();
          //console.log("yoooooooooooo");
        } else if(event.value == '3'){
          console.log("yoooooooooooo");
          this.displayCaution=true;
          this.displaytype=false;
          this.displaytypedepo=false;
         this.modifForm.controls['engag_cautionsolidaire'].setValidators(Validators.required);
         this.modifForm.controls['engag_retenudeposit'].clearValidators();
         this.modifForm.controls['engag_datedeposit'].clearValidators();
         this.modifForm.controls['engag_identificationtitre'].clearValidators();

        }else{          
          this.displaytype=false;
          this.displaytypedepo=false;
          this.displayCaution=false;
          this.modifForm.controls['engag_identificationtitre'].clearValidators();
          this.modifForm.controls['engag_retenudeposit'].clearValidators();
          this.modifForm.controls['engag_datedeposit'].clearValidators();
          this.modifForm.controls['engag_cautionsolidaire'].clearValidators();
        }
        //console.log(this.modifForm.controls['engag_identificationtitre'].value);
        this.modifForm.controls['engag_identificationtitre'].updateValueAndValidity();
        this.modifForm.controls['engag_retenudeposit'].updateValueAndValidity();
        this.modifForm.controls['engag_datedeposit'].updateValueAndValidity();
        this.modifForm.controls['engag_cautionsolidaire'].updateValueAndValidity();
      }
      onChangeActe(event) {

        this.modifForm.controls['engag_numeroacte'].setValue(event.value);
        this.engagementService.lastID(event.value).subscribe((data)=>{
          if(data==0){
            this.modifForm.controls['engag_numeroengagement'].setValue(event.value.toString()+"000001");
          }else{
            this.modifForm.controls['engag_numeroengagement'].setValue(Number(data)+1);
          }
        })
      }
      onChangeMarche(event) {

        this.modifForm.controls['engag_codemarche'].setValue(event.value);
      }
      onChangeCaution(event) {
        this.modifForm.controls['engag_cautionsolidaire'].setValue(event);
        console.log(event);
      }
      onChangeAvenant(event) {
        this.modifForm.controls['engag_numeroavenant'].setValue(event.value);
      }

      onChange(event) {
        this.modifForm.controls['engag_status'].setValue(event);
      }

      onGetLibelleByActe(numero:number){
        return  (this.actes.find(c => c.act_numero === numero))?.act_typegarantie ;
      }

      check_fonct(fonct: String) {

        let el = this.autorisation.findIndex(itm => itm === fonct);
        if (el === -1)
         return false;
        else
         return true;
    
      }
}
