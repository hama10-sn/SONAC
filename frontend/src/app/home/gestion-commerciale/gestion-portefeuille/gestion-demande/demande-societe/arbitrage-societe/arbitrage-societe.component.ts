import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Civilite } from '../../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../../model/ClassificationSecteur';
import { Dem_Soc } from '../../../../../../model/Dem_Soc';
import { CiviliteService } from '../../../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../../../services/classification-secteur.service';
import { DemandesocieteService } from '../../../../../../services/demandesociete.service';
import { TransfertDataService } from '../../../../../../services/transfertData.service';
import { ClientService } from '../../../../../../services/client.service';
import { Client } from '../../../../../../model/Client';
//import type from '../../../../data/type.json';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransfertData2Service } from '../../../../../../services/transfert-data2.service';

import type from '../../../../../data/type.json'

import { DatePipe } from '@angular/common';
import { Prospect } from '../../../../../../model/Prospect';
import { ProspectService } from '../../../../../../services/prospect.service';

@Component({
  selector: 'ngx-arbitrage-societe',
  templateUrl: './arbitrage-societe.component.html',
  styleUrls: ['./arbitrage-societe.component.scss'],
  providers: [DatePipe]
})
export class ArbitrageSocieteComponent implements OnInit {

 
  demandeSocietes: Array<Dem_Soc> = new Array<Dem_Soc>();
  demSoctBytitulaireCl : Array<Dem_Soc> = new Array<Dem_Soc>();
  demSoctBytitulairePr : Array<Dem_Soc> = new Array<Dem_Soc>();
  demandeSociete: Dem_Soc;
  classificationSecteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  civilites: Array<Civilite> = new Array<Civilite>();


  @Input() jsonTypeSociete: any[] = type;
  listTypeSociete: any[];

  listTypes: any [];
  //@Input() listTypeSocite:any [] = type;
  analyseDeRisque : boolean = false;
  form1: FormGroup;
  produitdeux : boolean=false;
  produittrois : boolean=false;
  produittroisvrai=0;
  prospect:Prospect

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['dem_socnum', 'dem_denomination', 'dem_typesociete', 'dem_nomprenomsdg',
        'dem_objetdemande','dem_registrecommerce','dem_statut','details'];
   public dataSource = new MatTableDataSource<Dem_Soc>();
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;
   autorisation=[];

   docForm = this.fb.group({
    dem_document1: ['', [Validators.required]],
    dem_document2: ['', [Validators.required]],
    dem_document3: ['', [Validators.required]],
    dem_document4: ['', [Validators.required]],
  });
  modifForm = this.fb.group({
    dem_ca: [],
    dem_cs: [],
    dem_clientId: [''],

  });

  dem_commentaire1;
  dem_commentaire2;

   constructor(private demSocService: DemandesocieteService,private transfertData: TransfertDataService,
    private dialogService: NbDialogService,private toastrService: NbToastrService,
     private authService: NbAuthService, private router: Router,
     private activeService: ClassificationSecteurService,private civiliteService: CiviliteService,
     private fb: FormBuilder,private clientService: ClientService,private transfertData2: TransfertData2Service,private datePipe: DatePipe,
     private prospectService:ProspectService) { 
      this.form1= this.fb.group({
        website: this.fb.array([], [Validators.required])
      })

     }
typecaution
documentmanquant : boolean=false;
rejete : boolean=false;
nineercmanquant : boolean=false;
     ngOnInit(): void {
      this.form = this.fb.group({
        acceptTerms: [false, Validators.requiredTrue],
        acceptTerms1: [false, Validators.requiredTrue]
    });

    

   // this.cmt=true;
    /*if(this.demandeSociete.dem_produitdemande2!==0 || this.demandeSociete.dem_produitdemande3!==0){
      this.cmt=false;
      this.cmts=true;
    }*/
    let data2 =[];
    data2=this.transfertData2.getData();
    if(data2!=null){
      this.produitdeux=data2[0];
      this.produittrois = data2[1];
      this.produittroisvrai= data2[2];
      //this.check=data2[3];
      //this.ngModelValue=data2 [4]
    }

    
     // this.onGetAllDemandePhy();
      this.onGetAllCivilite();
      this.onGetClassification();
      this.onGetAllDemandeSoc();
      this.demandeSociete =  this.transfertData.getData()
      if(this.demandeSociete.dem_produitdemande3===15001001){
        this.typecaution = "soumission";
      }else if(this.demandeSociete.dem_produitdemande3===15001002){
        this.typecaution = "avance de démarrage";
      }else if(this.demandeSociete.dem_produitdemande3===15001003){
        this.typecaution = "bonne execution";
      }else if(this.demandeSociete.dem_produitdemande3===15001005){
        this.typecaution = "définitive";
      }
  console.log(this.demandeSociete);
  this.ongetFiles(this.demandeSociete.dem_socnum);
  if(this.demandeSociete.dem_statut){
    if(this.demandeSociete.dem_statut==="analyse de risque" || this.demandeSociete.dem_statut==="analyse juridique"){
      this.analyseDeRisque=true;
      
      /*if(this.demandeSociete.dem_produitdemande2!==0 || this.demandeSociete.dem_produitdemande3!==0){
      this.cmts=true;
      //this.cmts=true;
      }*/
      console.log('filesname',this.filenames);
      console.log('doc valide',this.demandeSociete.list_document_valide);
      console.log('doc lu',this.demandeSociete.list_document_lu)

    } if(this.demandeSociete.dem_statut==="Rejeté"){
      this.rejete=true;
      this.check=false;
      
      /*if(this.demandeSociete.dem_produitdemande2!==0 || this.demandeSociete.dem_produitdemande3!==0){
      this.cmts=true;
      //this.cmts=true;
      }*/
      console.log('filesname',this.filenames);
      console.log('doc valide',this.demandeSociete.list_document_valide);
      console.log('doc lu',this.demandeSociete.list_document_lu)
      this.ngModelValue="2"

    }if(this.demandeSociete.dem_statut==="En attente dossiers manquants"){
      this.documentmanquant=true;
      this.check=false;
      
      /*if(this.demandeSociete.dem_produitdemande2!==0 || this.demandeSociete.dem_produitdemande3!==0){
      this.cmts=true;
      //this.cmts=true;
      }*/
      console.log('filesname',this.filenames);
      console.log('doc valide',this.demandeSociete.list_document_valide);
      console.log('doc lu',this.demandeSociete.list_document_lu)
      this.ngModelValue="3"

    }if(this.demandeSociete.dem_statut==="En attente RC et/ou NINEA manquants"){
      this.nineercmanquant=true;
      this.check=false;
      
      /*if(this.demandeSociete.dem_produitdemande2!==0 || this.demandeSociete.dem_produitdemande3!==0){
      this.cmts=true;
      //this.cmts=true;
      }*/
      console.log('filesname',this.filenames);
      console.log('doc valide',this.demandeSociete.list_document_valide);
      console.log('doc lu',this.demandeSociete.list_document_lu)
      this.ngModelValue="4"

    }
  }
  console.log('test--',this.demandeSociete.list_document_valide);
    if(this.demandeSociete?.list_document_valide[0]==1){
      this.checked=true
    }else{
      this.checked=false;
    }
    if(this.demandeSociete?.list_document_valide[1]==2){
      this.checkeddeux=true;
    }else{
      this.checkeddeux=false
    }
    if(this.demandeSociete?.list_document_valide[2]==3){
      this.checkedtrois=true;
    }else{
      this.checkedtrois=false
    }/* 
    if(this.demandeSociete?.list_document_valide[3]==4){
      this.checkedquatre=true;
    }else{
      this.checkedquatre=false00000000000
    } */
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
      this.getted=true
    }else{
      this.check=false;
      this.getted=false
    }
    
  if(this.demandeSociete!=null ){
      this.ongetFiles(this.demandeSociete.dem_socnum)
   }

   
      //this.listTypes=this.listTypeSocite['TYPE_SOCIETE'];

      this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
  
       if (token.isValid()) {
         this.autorisation = token.getPayload().fonctionnalite.split(',');
         console.log(this.autorisation);
       }
     });
     //this.ongetFiles(this.demandeSociete.dem_socnum)
     if(this.analyseDeRisque==true){
      this.check=true;
      this.checked=true;
      this.checkeddeux=true;
      this.checkedtrois=true;
      this.checkedquatre=true;
      this.checkedcinq=true;
      this.checkedsixe=true;
      this.checkedsept=true;
      this.checkedhuit=true;
      this.checkedneuf=true;
      this.checkeddix = true;
      this.checkedonze=true;
      this.ngModelValue="1";
      
    }
    if(this.rejete==true){
      this.check=false;
      this.obligatoire=false;
      //this.obligatoire=false
      /*this.checked=false;
      this.checkeddeux=false;
      this.checkedtrois=false;
      this.checkedquatre=false;
      this.checkedcinq=false;
      this.checkedsixe=false;
      this.checkedsept=false;
      this.checkedhuit=false;
      this.checkedneuf=false;
      this.checkeddix = false;
      this.checkedonze=false;*/
      this.ngModelValue="2";
      
    }
    if(this.demandeSociete.dem_statut==="En attente dossiers manquants"){
      this.check=false;
      console.log('look')
      //this.obligatoire=false
      /*this.checked=false;
      this.checkeddeux=false;
      this.checkedtrois=false;
      this.checkedquatre=false;
      this.checkedcinq=false;
      this.checkedsixe=false;
      this.checkedsept=false;
      this.checkedhuit=false;
      this.checkedneuf=false;
      this.checkeddix = false;
      this.checkedonze=false;*/
      this.obligatoire=false;
      this.ngModelValue="3";
      
    }
    if(this.demandeSociete.dem_statut==="En attente RC et/ou NINEA manquants"){
      this.check=false;
      console.log('look')
      this.obligatoire=false;
      //this.obligatoire=false
      /*this.checked=false;
      this.checkeddeux=false;
      this.checkedtrois=false;
      this.checkedquatre=false;
      this.checkedcinq=false;
      this.checkedsixe=false;
      this.checkedsept=false;
      this.checkedhuit=false;
      this.checkedneuf=false;
      this.checkeddix = false;
      this.checkedonze=false;*/
      this.ngModelValue="4";
      
    }
    if(this.demandeSociete.dem_typetitulaire=="CL"){
      this.getCientById(this.demandeSociete.dem_clienttitulaire);
    }else{
      this.getProspectById(this.demandeSociete.dem_clienttitulaire)
    }
    
    this.onGetAllDemandePhyClient(this.demandeSociete.dem_clienttitulaire);
    this.onGetAllDemandePhyProspect(this.demandeSociete.dem_clienttitulaire)
   }
   onGetLibelleByType(numero: any) {
    
    return (this.listTypes?.find(p =>  p.id  === numero))?.value;

  
  }
  addForm = this.fb.group({

    
    dem_commentaire: ['', [Validators.required]]
    
    
    

  });
  dem_commentaire="";
  onFocusOutEventBody() {
    this.dem_commentaire = this.addForm.get("dem_commentaire").value;
    if (this.addForm.controls['dem_commentaire'].valid == false) {
      
      
    } else {
      
      
    }
  }
   onGetAllDemandeSoc(){
    this.demSocService.getAllDemandeSociete()
    .subscribe((data: Dem_Soc[]) => {
        this.demandeSocietes = data;
        this.dataSource.data = data as Dem_Soc[];
        //console.log(this.demandePhysique);
    });  
   }
   onGetSecteurByCode(code:number){
    //console.log((this.classificationSecteurs.find(c => c.code === code))?.libelle );
   return  (this.classificationSecteurs.find(c => c.code === code))?.libelle ;       
 }
 onGetCiviliteByCode(code:number){
   //console.log((this.civilites.find(c => c.civ_code === code))?.civ_libellelong ); 
   return  (this.civilites.find(c => c.civ_code === code))?.civ_libellelong ;  
 }
   onGetAllCivilite(){
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
          this.civilites = data;
      });
  }
  onGetClassification(){
    this.activeService.getAllGroupes()
    .subscribe((data: ClassificationSecteur[]) => {
      this.classificationSecteurs = data;
    });
  }
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
      /*
        *cette methode nous permet d'ouvrir une boite dialogue
        */
      open(dialog: TemplateRef<any>, demandeSoc:Dem_Soc ) {
        this.ongetFiles(demandeSoc);
        this.getCientById(demandeSoc.dem_clienttitulaire);
        setTimeout(() => {
          this.dialogService.open(
            dialog,
            {
              context: demandeSoc,  
            });
        }, 1000);
      }
  
      
    /*
      *cette methode nous permet d'ouvrir une 
      * inserer une demande 
      */
    openAjout() {
      
      this.router.navigateByUrl('/home/demande-societe/ajout-Societe');
    }
    /*
      *cette methode nous permet d'ouvrir une 
      *boite dialogue pour modifier un reassureur     
      */
   /*  openModif(demande: Dem_Soc) {
      this.transfertData.setData(demande);
      this.router.navigateByUrl('/home/demande-societe/modif-Societe');
    } */
    
  /*openModif(demande: Dem_Soc) {
    demande.dem_commentaire1 = this.dem_commentaire1;
    demande.dem_commentaire2 = this.dem_commentaire2;
    if (this.ngModelValue == '1') {
      demande.dem_statut = "validé pour arbitrage";
    } else if (this.ngModelValue == '2') {
      demande.dem_statut = "Rejeté";
    }
    this.checked ;
    if(this.checked){
      this.listedoc[0]=1;
    }else{
      this.listedoc[0]=null;
    }
    if(this.checkeddeux){
      this.listedoc[1]=2;
    }else{
      this.listedoc[1]= null;
    }
    if(this.checkedtrois){
      this.listedoc[2]=3;
    }else{
      this.listedoc[2]=null;
    }
    
    console.log(this.listedoc);
    demande.list_document_valide = this.listedoc;
    //this.transfertData.setData(demande);
    this.demSocService.update(demande).subscribe(data => {
      if (this.ngModelValue == '1') {
        this.message = "Demande validée avec succes !";
      } else if (this.ngModelValue == '2') {
        this.message = "Demande rejetée avec succes !";
      }
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
      this.onGetAllDemandeSoc();
    },
      (error) => {
        this.toastrService.show(
          'Impossible de supprimer la demande !',
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
  }*/
  
 

  openModif(demande: Dem_Soc) {
    /*if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked){
        this.listedoc[0]=1;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=2;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=3;
      }else{
        this.listedoc[2]=null;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked){
        this.listedoc[0]=6;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=5;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=6;
      }else{
        this.listedoc[2]=null;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked){
        this.listedoc[0]=7;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=8;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=9;
      }else{
        this.listedoc[2]=null;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked){
        this.listedoc[0]=10;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=10;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=12;
      }else{
        this.listedoc[2]=null;
      }
      if(this.checkedquatre){
        this.listedoc[3]=13;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[6]=14;
      }else{
        this.listedoc[6]=null;
      }
    }
    else if(this.demandeSociete.dem_produitdemande1==14002001){
      if(this.checked){
        this.listedoc[0]=15;
      }else{
        this.listedoc[0]=null;
      }
      
    }else if(this.demandeSociete.dem_produitdemande1==14003001){
      this.type="FINASSUR";
      if(this.checked ){
        this.listedoc[0]=16;
      }else{
        this.listedoc[0]=null;
      }

    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit){
        this.listedoc[0]=17;
      }else if(this.checkedneuf){
        this.listedoc[0]=18;
        if(this.checked){
          this.listedoc[1]=19;
        }else{
          this.listedoc[1]=null;
        }
        if(this.checkeddeux){
          this.listedoc[2]=20;
        }else{
          this.listedoc[2]= null;
        }
        if(this.checkedtrois){
          this.listedoc[3]=21;
        }else{
          this.listedoc[3]=null;
        }
        if(this.checkedquatre){
          this.listedoc[6]=22;
        }else{
          this.listedoc[6]=null;
        }
        if(this.checkedcinq){
          this.listedoc[5]=23;
        }else{
          this.listedoc[5]=null;
        }
        if(this.checkedsixe){
          this.listedoc[6]=24;
        }else{
          this.listedoc[6]=null;
        }
        if(this.checkedsept){
          this.listedoc[7]=25;
        }else{
          this.listedoc[7]=null;
        }
      }else{
        this.listedoc[0]=null;
      }
      
      
    }if(this.demandeSociete.dem_produitdemande1==16008001){
      this.type="LOCASSUR";
      if(this.checked){
        this.listedoc[0]=26;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=27;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=28;
      }else{
        this.listedoc[2]=null;
      }
      if(this.checkedquatre){
        this.listedoc[3]=29;
      }else{
        this.listedoc[3]=null;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande2==15001003){
    
      this.listedoc[0]=6;
    
      this.listedoc[1]=5;
    
      this.listedoc[2]=6;
    
    if(this.checkedquatre){
      this.listedoc[3]=7;
    }else{
      this.listedoc[3]=null;
    }
    if(this.checkedcinq){
      this.listedoc[6]=8;
    }else{
      this.listedoc[6]= null;
    }
    if(this.checkedsixe){
      this.listedoc[5]=9;
    }else{
      this.listedoc[5]=null;
    }
    this.retenuegarantie=true;
  
}
if(this.demandeSociete.dem_produitdemande3==15001004){

  this.listedoc[0]=6;

  this.listedoc[1]=5;

  this.listedoc[2]=6;


  this.listedoc[3]=7;

  

  this.listedoc[6]=8;

  this.listedoc[5]=9;

  if(this.checkedsept){
    this.listedoc[6]=10;
  }else{
    this.listedoc[6]=null;
  }
  if(this.checkedhuit){
    this.listedoc[7]=10;
  }else{
    this.listedoc[7]= null;
  }
  if(this.checkedneuf){
    this.listedoc[8]=12;
  }else{
    this.listedoc[8]=null;
  }
  if(this.checkeddix){
    this.listedoc[9]=13;
  }else{
    this.listedoc[9]=null;
  }
  if(this.checkedonze){
    this.listedoc[10]=14;
  }else{
    this.listedoc[10]=null;
  }

//this.retenuegarantie=true;

}

    //Retenue de garantie produit 2 ou 3
    /*if(this.demandeSociete.dem_produitdemande2==15001004 || this.demandeSociete.dem_produitdemande3==15001004){
      
      if(this.checkedquatre){
        this.listedoc[3]=13;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[6]=14;
      }else{
        this.listedoc[6]=null;
      }
    }*/
    //retenu de garantie produit 2 ou 3
    //SUBMIT DEBUT
    console.log(this.check,"check");
    console.log(this.obligatoire,"obligatoiotre");
    console.log("plusieurs produit",this.plusieursproduit)
    console.log(this.troisproduits,"troisproduits");
    if(this.analyseDeRisque==true){
      this.check=true;
      this.checked=true;
      this.checkeddeux=true;
      this.checkedtrois=true;
      this.checkedquatre=true;
      this.checkedcinq=true;
      this.checkedsixe=true;
      this.checkedsept=true;
      this.checkedhuit=true;
      this.checkedneuf=true;
      this.checkeddix = true;
      this.checkedonze=true;
      this.ngModelValue='1';
      this.plusieursproduit=true;
      this.check=true;
      this.troisproduits = true;
      this.obligatoire=true;
    }else{
      this.plusieursproduit=false;
      this.check=false;
      this.troisproduits = false;
      this.obligatoire=false;
    }
/*
    if(this.rejete==true){
      this.check=false
      this.checked=true;
      this.checkeddeux=true;
      this.checkedtrois=true;
      this.checkedquatre=true;
      this.checkedcinq=true;
      this.checkedsixe=true;
      this.checkedsept=true;
      this.checkedhuit=true;
      this.checkedneuf=true;
      this.checkeddix = true;
      this.checkedonze=true;
      this.ngModelValue='2';
      this.plusieursproduit=true;
      this.check=true;
      this.troisproduits = true;
      this.obligatoire=true;
    }else{
      this.plusieursproduit=false;
      this.check=false;
      this.troisproduits = false;
      this.obligatoire=false;
    }*/
    

    
    console.log(this.produitdeux,"deuxp");
    console.log(this.produittrois,"trois");
    
   
    console.log(this.ngModelValue,"ngvalu");
    console.log(this.filenames.length,"files");

    //this.check=false;
    //this.obligatoire=false;
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked){
        this.listedoc[0]=1;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=2;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=3;
      }else{
        this.listedoc[2]=null;
      }
      //produit 2 début


      //¨Produit 2 fin
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      
      if(this.checked){
        this.listedoc[0]=4;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=5;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=6;
      }else{
        this.listedoc[2]=null;
      }
//produit 2 début 
      if(this.demandeSociete.dem_produitdemande2==15001003){
        if(this.produitdeux){
          if(this.checkedquatre){
            this.listedoc[3]=7;
          }else{
            this.listedoc[3]=null;
          }
          if(this.checkedcinq){
            this.listedoc[4]=8;
          }else{
            this.listedoc[4]= null;
          }
          if(this.checkedsixe){
            this.listedoc[5]=9;
          }else{
            this.listedoc[5]=null;
          }
        
          this.listedoc[0]=4;
          this.listedoc[1]=5;
          this.listedoc[2]=6;
        }
        
        /*this.listedoc[3]=7;
        this.listedoc[4]=8;
        this.listedoc[5]=9;*/
      }else if(this.demandeSociete.dem_produitdemande2==15001004){
        if(this.produitdeux){
          if(this.checkedquatre){
            this.listedoc[3]=10;
          }else{
            this.listedoc[3]=null;
          }
          if(this.checkedcinq){
            this.listedoc[4]=11;
          }else{
            this.listedoc[4]= null;
          }
          if(this.checkedsixe){
            this.listedoc[5]=12;
          }else{
            this.listedoc[5]=null;
          }
          if(this.checkedsept){
            this.listedoc[6]=13;
          }else{
            this.listedoc[6]=null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=14;
          }else{
            this.listedoc[7]=null;
          }
          
          this.listedoc[0]=4;
          this.listedoc[1]=5;
          this.listedoc[2]=6;
        }
        /*this.listedoc[0]=4;
        this.listedoc[1]=5;
        this.listedoc[2]=6;
        this.listedoc[3]=10;
        this.listedoc[4]=11;
        this.listedoc[5]=12;
        this.listedoc[6]=13;
        this.listedoc[7]=14;*/
      }
//produit 2 fin

//produit 3 début
      if(this.demandeSociete.dem_produitdemande3==15001003){
        if(this.produittrois){
          if(this.checkedneuf){
            this.listedoc[8]=7;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=8;
          }else{
            this.listedoc[9]= null;
          }
          if(this.checkedonze){
            this.listedoc[10]=9;
          }else{
            this.listedoc[10]=null;
          }
        
          this.listedoc[0]=4;
          this.listedoc[1]=5;
          this.listedoc[2]=6;
          this.listedoc[3]=10;
          this.listedoc[4]=11;
          this.listedoc[5]=12;
          this.listedoc[6]=13;
          this.listedoc[7]=14;
        }
        
        /*this.listedoc[8]=7;
        this.listedoc[9]=8;
        this.listedoc[10]=9;*/
      }else if(this.demandeSociete.dem_produitdemande3==15001004){
        if(this.produittrois){
        if(this.checkedsept){
          this.listedoc[6]=10;
        }else{
          this.listedoc[6]=null;
        }
        if(this.checkedhuit){
          this.listedoc[7]=11;
        }else{
          this.listedoc[7]= null;
        }
        if(this.checkedneuf){
          this.listedoc[8]=12;
        }else{
          this.listedoc[8]=null;
        }
        if(this.checkeddix){
          this.listedoc[9]=13;
        }else{
          this.listedoc[9]=null;
        }
        if(this.checkedonze){
          this.listedoc[10]=14;
        }else{
          this.listedoc[10]=null;
        }
        

        
          this.listedoc[0]=4;
          this.listedoc[1]=5;
          this.listedoc[2]=6;
          this.listedoc[3]=7;
          this.listedoc[4]=8;
          this.listedoc[5]=9;
        }
        

        /*this.listedoc[6]=10;
        this.listedoc[7]=11;
        this.listedoc[8]=12;
        this.listedoc[9]=13;
        this.listedoc[10]=14;*/
      }
//produit 3 fin

    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked){
        this.listedoc[0]=7;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=8;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=9;
      }else{
        this.listedoc[2]=null;
      }
      //produit 2 début 
      if(this.demandeSociete.dem_produitdemande2==15001002){
        if(this.produitdeux){
          if(this.checkedquatre){
            this.listedoc[3]=4;
          }else{
            this.listedoc[3]=null;
          }
          if(this.checkedcinq){
            this.listedoc[4]=5;
          }else{
            this.listedoc[4]= null;
          }
          if(this.checkedsixe){
            this.listedoc[5]=6;
          }else{
            this.listedoc[5]=null;
          }
        
          this.listedoc[0]=7;
          this.listedoc[1]=8;
          this.listedoc[2]=9;
          /*this.listedoc[3]=4;
          this.listedoc[4]=5;
          this.listedoc[5]=6;*/
        }
        
      }else if(this.demandeSociete.dem_produitdemande2==15001004){
        if(this.produitdeux){
          if(this.checkedquatre){
            this.listedoc[3]=10;
          }else{
            this.listedoc[3]=null;
          }
          if(this.checkedcinq){
            this.listedoc[6]=11;
          }else{
            this.listedoc[6]= null;
          }
          if(this.checkedsixe){
            this.listedoc[5]=12;
          }else{
            this.listedoc[5]=null;
          }
          if(this.checkedsept){
            this.listedoc[6]=13;
          }else{
            this.listedoc[6]=null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=14;
          }else{
            this.listedoc[7]=null;
          }
        
          this.listedoc[0]=7;
          this.listedoc[1]=8;
          this.listedoc[2]=9;
         }
        /*this.listedoc[3]=10;
        this.listedoc[4]=11;
        this.listedoc[5]=12;
        this.listedoc[6]=13;
        this.listedoc[7]=14;*/
      }
//produit 2 fin

//produit 3 début
      if(this.demandeSociete.dem_produitdemande3==15001002){
        if(this.produittrois){
          if(this.checkedneuf){
            this.listedoc[8]=4;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=5;
          }else{
            this.listedoc[9]= null;
          }
          if(this.checkedonze){
            this.listedoc[10]=6;
          }else{
            this.listedoc[10]=null;
          }
        
          this.listedoc[0]=7;
          this.listedoc[1]=8;
          this.listedoc[2]=9;
          this.listedoc[3]=10;
          this.listedoc[4]=11;
          this.listedoc[5]=12;
          this.listedoc[6]=13;
          this.listedoc[7]=14;
        }
        
        /*this.listedoc[8]=4;
        this.listedoc[9]=5;
        this.listedoc[10]=6;*/
      }else if(this.demandeSociete.dem_produitdemande1==15001005){
        if(this.checked){
          this.listedoc[0]=31;
        }else{
          this.listedoc[0]=null;
        }
        if(this.checkeddeux){
          this.listedoc[1]=32;
        }else{
          this.listedoc[1]= null;
        }
        if(this.checkedtrois){
          this.listedoc[2]=32;
        }else{
          this.listedoc[2]=null;
        }
      }else if(this.demandeSociete.dem_produitdemande3==15001004){
        if(this.produittrois){
          if(this.checkedsept){
            this.listedoc[6]=10;
          }else{
            this.listedoc[6]=null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=11;
          }else{
            this.listedoc[7]= null;
          }
          if(this.checkedneuf){
            this.listedoc[8]=12;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=13;
          }else{
            this.listedoc[9]=null;
          }
          if(this.checkedonze){
            this.listedoc[10]=14;
          }else{
            this.listedoc[10]=null;
          }
          
          this.listedoc[0]=7;
          this.listedoc[1]=8;
          this.listedoc[2]=9;
          this.listedoc[3]=4;
          this.listedoc[4]=5;
          this.listedoc[5]=6;
        }
        
        /*this.listedoc[6]=10;
        this.listedoc[7]=11;
        this.listedoc[8]=12;
        this.listedoc[9]=13;
        this.listedoc[10]=14;*/
      }
//produit 3 fin

    }else if(this.demandeSociete.dem_produitdemande1==15001005){
      if(this.checked){
        this.listedoc[0]=31;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=32;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=33;
      }else{
        this.listedoc[2]=null;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked){
        this.listedoc[0]=10;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=11;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=12;
      }else{
        this.listedoc[2]=null;
      }
      if(this.checkedquatre){
        this.listedoc[3]=13;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[4]=14;
      }else{
        this.listedoc[4]=null;
      }
      //produit 2 debut
      if(this.demandeSociete.dem_produitdemande2==15001002){
        if(this.produitdeux){
          if(this.checkedsixe){
            this.listedoc[5]=4;
          }else{
            this.listedoc[5]=null;
          }
          if(this.checkedsept){
            this.listedoc[6]=5;
          }else{
            this.listedoc[6]= null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=6;
          }else{
            this.listedoc[7]=null;
          }
        
          this.listedoc[0]=10;
          this.listedoc[1]=11;
          this.listedoc[2]=12;
          this.listedoc[3]=13;
          this.listedoc[4]=14;
        }
       
        /*this.listedoc[5]=4;
        this.listedoc[6]=5;
        this.listedoc[7]=6;*/
      }else if(this.demandeSociete.dem_produitdemande2==15001003){
        if(this.produitdeux){
          if(this.checkedsixe){
            this.listedoc[5]=7;
          }else{
            this.listedoc[5]=null;
          }
          if(this.checkedsept){
            this.listedoc[6]=8;
          }else{
            this.listedoc[6]= null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=9;
          }else{
            this.listedoc[7]=null;
          }

        
          this.listedoc[0]=10;
          this.listedoc[1]=11;
          this.listedoc[2]=12;
          this.listedoc[3]=13;
          this.listedoc[4]=14;
        }
        /*this.listedoc[0]=10;
        this.listedoc[1]=11;
        this.listedoc[2]=12;
        this.listedoc[3]=13;
        this.listedoc[4]=14;
        this.listedoc[5]=7;
        this.listedoc[6]=8;
        this.listedoc[7]=9;*/
      }
      //produit 2 fin
      //produit 3 debut
      if(this.demandeSociete.dem_produitdemande3==15001002){
        if(this.produittrois){
          if(this.checkedneuf){
            this.listedoc[8]=4;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=5;
          }else{
            this.listedoc[9]= null;
          }
          if(this.checkedonze){
            this.listedoc[10]=6;
          }else{
            this.listedoc[10]=null;
          }
          
          this.listedoc[0]=10;
          this.listedoc[1]=11;
          this.listedoc[2]=12;
          this.listedoc[3]=13;
          this.listedoc[4]=14;
          this.listedoc[5]=7;
          this.listedoc[6]=8;
          this.listedoc[7]=9;
        }
       
        /*this.listedoc[8]=4;
        this.listedoc[9]=5;
        this.listedoc[10]=6;*/
      }else if(this.demandeSociete.dem_produitdemande3==15001003){
        if(this.produittrois){
          if(this.checkedneuf){
            this.listedoc[8]=7;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=8;
          }else{
            this.listedoc[9]= null;
          }
          if(this.checkedonze){
            this.listedoc[10]=9;
          }else{
            this.listedoc[10]=null;
          }

          
          this.listedoc[0]=10;
          this.listedoc[1]=11;
          this.listedoc[2]=12;
          this.listedoc[3]=13;
          this.listedoc[4]=14;
          this.listedoc[5]=4;
          this.listedoc[6]=5;
          this.listedoc[7]=6;
        }
        
        /*this.listedoc[8]=7;
        this.listedoc[9]=8;
        this.listedoc[10]=9;*/
      }
      // produit 3 fin
    }
    else if(this.demandeSociete.dem_produitdemande1==14002001){
      if(this.checked){
        this.listedoc[0]=15;
      }else{
        this.listedoc[0]=null;
      }
      
    }else if(this.demandeSociete.dem_produitdemande1==14003001){
      this.type="FINASSUR";
      if(this.checked ){
        this.listedoc[0]=16;
      }else{
        this.listedoc[0]=null;
      }

    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit){
        this.listedoc[0]=17;
      }else if(this.checkedneuf){
        this.listedoc[0]=18;
        if(this.checked){
          this.listedoc[1]=19;
        }else{
          this.listedoc[1]=null;
        }
        if(this.checkeddeux){
          this.listedoc[2]=20;
        }else{
          this.listedoc[2]= null;
        }
        if(this.checkedtrois){
          this.listedoc[3]=21;
        }else{
          this.listedoc[3]=null;
        }
        if(this.checkedquatre){
          this.listedoc[6]=22;
        }else{
          this.listedoc[6]=null;
        }
        if(this.checkedcinq){
          this.listedoc[5]=23;
        }else{
          this.listedoc[5]=null;
        }
        if(this.checkedsixe){
          this.listedoc[6]=24;
        }else{
          this.listedoc[6]=null;
        }
        if(this.checkedsept){
          this.listedoc[7]=25;
        }else{
          this.listedoc[7]=null;
        }
      }else{
        this.listedoc[0]=null;
      }
      
      
    }if(this.demandeSociete.dem_produitdemande1==16008001){
      this.type="LOCASSUR";
      if(this.checked){
        this.listedoc[0]=26;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=27;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=28;
      }else{
        this.listedoc[2]=null;
      }
      if(this.checkedquatre){
        this.listedoc[3]=29;
      }else{
        this.listedoc[3]=null;
      }
    }
    /*if(this.demandeSociete.dem_produitdemande2==15001003){
    
        this.listedoc[0]=6;
      
        this.listedoc[1]=5;
      
        this.listedoc[2]=6;
      
      if(this.checkedquatre){
        this.listedoc[3]=7;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[6]=8;
      }else{
        this.listedoc[6]= null;
      }
      if(this.checkedsixe){
        this.listedoc[5]=9;
      }else{
        this.listedoc[5]=null;
      }
    
  }
    //Retenue de garantie produit 2 ou 3
    /*if(this.demandeSociete.dem_produitdemande2==15001004 || this.demandeSociete.dem_produitdemande3==15001004){
      
      if(this.checkedquatre){
        this.listedoc[3]=13;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[6]=14;
      }else{
        this.listedoc[6]=null;
      }
    }*/
    if(this.demandeSociete.dem_produitdemande2!=0){
      this.produitdeux=true;
      this.produittroisvrai++;
      //this.obligatoire=false;
      //this.check = false;
      /*if(this.demandeSociete.dem_produitdemande3==0){
        this.plusieursproduit=false;
      }else {
        this.plusieursproduit=true;
      }*/

      //this.troisproduits=this.plusieursproduit;
      if(this.demandeSociete.dem_produitdemande3!=0 && this.produittroisvrai==2){
        this.produittrois=true;
        //this.obligatoire=false;
        //this.check = false;
        //this.plusieursproduit=false;
      }
    }
    //SUBMIT
    demande.list_document_valide = this.listedoc;
    demande.dem_commentaire1 = this.addForm.get("dem_commentaire").value;;
    console.log("commmentaire1",demande.dem_commentaire1 )
    demande.dem_commentaire2 = this.dem_commentaire2;
    demande.list_document_lu= this.demandeSociete.list_document_lu;
    if (this.ngModelValue == '1') {
      demande.dem_statut = "analyse de risque";
    } else if (this.ngModelValue == '2') {
      demande.dem_statut = "Rejeté";
    } else if (this.ngModelValue == '3') {
      demande.dem_statut = "En attente dossiers manquants";
    } else if (this.ngModelValue == '4') {
      demande.dem_statut = "En attente RC et/ou NINEA manquants";
    }
    //alert(demande.dem_statut);

    //this.transfertData.setData(demande);
    this.demSocService.update(demande).subscribe(data => {
      if (this.ngModelValue == '1') {
        this.message = "Demande validée avec succes !";
      } else if (this.ngModelValue == '2') {
        this.message = "Demande rejetée avec succes !";
      } else if (this.ngModelValue == '3') {
        this.message = "Demande mise en attente dossiers manquants";
      } else if (this.ngModelValue == '4') {
        this.message = "Demande mise en attente RC et/ou NINEA manquants";
      }
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
      this.onGetAllDemandePhy();
    },
      (error) => {
        this.toastrService.show(
          'Impossible de supprimer la demande !',
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

  
  onChangebody(event) {
    console.log(event); 
    //this.dem_commentaire = event;
  }
  
openModifInfo(client){
  //alert(JSON.stringify(client));
  this.clientService.modifClientById(client.dem_typetitulaire,this.modifForm.value.dem_ca,this.modifForm.value.dem_cs).subscribe((data:any)=>{
   // alert(JSON.stringify(data));
    this.toastrService.show(
      data.message,
      {
        status: this.statusSuccess,
        destroyByClick: true,
        duration: 30000,
        hasIcon: true,
        position: this.position,
        preventDuplicates: false,
      });
  
  })
  this.onGetAllDemandePhy();
  
  }
    check_fonct(fonct: String) {
  
      let el = this.autorisation.findIndex(itm => itm === fonct);
      if (el === -1)
       return false;
      else
       return true;
  
    }
    onDeleteDemande(id: number) { 

      this.demSocService.deleteDemandeSociete(id)
      .subscribe((data) => {
        console.log(data);
        this.toastrService.show(
          'Demande Supprimer avec succes !',
          'Notification',
          {
            status: this.statusSuccess,
            destroyByClick: true,
            duration: 300000,
            hasIcon: true,
            position: this.position,
            preventDuplicates: false,
          });
          this.onGetAllDemandeSoc();
      },
      (error) => {
        this.toastrService.show(
          'Impossible de supprimer demande rattachée à un affaire !',
          'Notification',
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
        onChechId(id: number) {

          if (id == null) {
      
            return 3;
          }
          if (this.demandeSocietes.find(p => p.dem_statut === "en attente" && p.dem_socnum=== id)) {
            return 1;
          } else {
            return 2;
          }
        }

    filenames: string[];
    /*ongetFiles(dem_socnum) {
      this.demSocService.getFilesDoc(dem_socnum)
          .subscribe(data => this.filenames = data as string[]);
    }*/
    ongetFiles(demandeSocietenum) {
      this.demSocService.getFilesDoc(demandeSocietenum)
        .subscribe(data => {
          this.filenames = data as string[]
          
          //this.data = this.demandeSociete?.list_document_lu;
          //this.data.length;
          
            if(this.filenames==null){
              this.demandeSociete.list_document_lu=null;
            }
            if(this.demandeSociete.list_document_lu===null){
              this.demandeSociete.list_document_lu=[]
            }
              
            
            for(let i =0 ; i<this.filenames.length;i++){
              if(this.demandeSociete.list_document_lu.indexOf(this.filenames[i])!==-1){
                let temp = this.demandeSociete.list_document_lu.indexOf(this.filenames[i])
                let val = this.demandeSociete.list_document_lu[i];
                this.demandeSociete.list_document_lu[i]=this.filenames[i];
                this.demandeSociete.list_document_lu[temp]=val;
              }
            }
            
            for(let i =0 ; i<this.demandeSociete.list_document_lu.length;i++){
                if(this.demandeSociete.list_document_lu[i]==undefined){
                  this.demandeSociete.list_document_lu[i]=''
                }
            }
            if(this.demandeSociete.list_document_lu?.length>this.filenames.length){
              let d= this.demandeSociete.list_document_lu.length;
              let l= this.filenames.length;
              while(d>l){
                this.demandeSociete.list_document_lu.pop();
                d= d-1;
              }
              
              
              console.log("this.filenames",this.filenames);
              console.log("this.demandeSociete.list_document_lu",this.demandeSociete.list_document_lu);
              //this.demandeSociete.list_document_lu =templiste;
            }
            console.log('verification',this.demandeSociete.list_document_lu)
            if(this.demandeSociete.dem_statut!="analyse de risque" && this.demandeSociete.dem_statut!="Rejeté" &&this.demandeSociete.dem_statut!="En attente dossiers manquants" && this.demandeSociete.dem_statut!="En attente RC et/ou NINEA manquants" && this.demandeSociete.dem_statut!="analyse juridique"){
              this.checked=false;
              this.toggle(false);
            }
            
              
            for(let i =0 ; i<this.filenames.length;i++){
              if(this.demandeSociete.list_document_lu?.indexOf(this.filenames[i])!==-1 && this.filenames.indexOf(this.filenames[i])!==-1){
                let temp = this.demandeSociete.list_document_lu.indexOf(this.filenames[i])
                let val = this.demandeSociete.list_document_lu[i];
                this.demandeSociete.list_document_lu[i]=this.filenames[i];
                this.demandeSociete.list_document_lu[temp]=val;
              }
                        
            }
          console.log('2h',this.filenames);
          console.log('2hh',this.demandeSociete.list_document_lu);
            //this.ngModelValue=false;
  
            /*if(this.demandeSociete.list_document_lu==this.filenames){
              this.check=false;
            this.ngModelValue=null;
            }*/
            if(this.analyseDeRisque){
              if(this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
                this.changeAnalyse = true;
                this.openModif1(this.demandeSociete);
              }else{
                this.changeAnalyse=false;
              }
            }  
        
        });
        //this.formater()
    }
    
 /*  ongetFiles(demandeSocietenum) {
    this.demPService.getFilesDoc(demandeSocietenum)
      .subscribe(data => this.filenames = data as string[]);
  } */
    client: Client;
    emetteur :Emetteur
    capital
    affaire
    clientornot=false;
    getCientById(id) {
      this.clientService.getClient(id)
        .subscribe((data: any) => {
          this.client = data as Client;
          if(this.client!=null){
            this.capital=this.client?.clien_capital_social;
            this.affaire=this.client?.clien_chiffreaffaireannuel
            this.clientornot=true;
          }
          //alert(JSON.stringify(this.client))
          //this.dataSource.data = data as Client[];
          //console.log(this.demandePhysique);
        });
    }

    getProspectById(id) {
      this.prospectService.getProspectByNumero(id)
        .subscribe((data: any) => {
          this.prospect = data as Prospect;
          if(this.prospect!=null){
            this.capital=this.prospect?.prospc_capitalsocial;
            this.affaire=this.prospect?.prospc_chiffreaffaireannuel
          }
          //alert(JSON.stringify(this.client))
          //this.dataSource.data = data as Client[];
          //console.log(this.demandePhysique);
        });
    }
   
    onGetAllDemandePhy() {
      this.demSocService.getAllDemandeSociete()
        .subscribe((data: Dem_Soc[]) => {
          this.demandeSocietes = data.reverse();
          this.dataSource.data = data as Dem_Soc[];
          //console.log(this.demandePhysique);
        });
    }
    onGetAllDemandePhyClient(id) {
      this.demSocService.getAllDemandeSocieteByClient(id)
        .subscribe((data: Dem_Soc[]) => {
          this.demSoctBytitulaireCl= data.reverse();
          //this.dataSource.data = data as Dem_Soc[];
          //console.log(this.demandePhysique);
        });
    }
    onGetAllDemandePhyProspect(id) {
      this.demSocService.getAllDemandeSocieteByProspect(id)
        .subscribe((data: Dem_Soc[]) => {
          this.demSoctBytitulairePr= data.reverse();
          //this.dataSource.data = data as Dem_Soc[];
          //console.log(this.demandePhysique);
        });
    }
    ngModelValue;
    message: any;
    openModif1(demande: Dem_Soc) {
      //demande.dem_commentaire = this.dem_commentaire;
      /*if (this.ngModelValue == '1') {
        demande.dem_statut = "validé pour arbitrage";
      } else if (this.ngModelValue == '2') {
        demande.dem_statut = "Rejeté";
      }*/
      //alert(demande.dem_statut);
  
      //this.transfertData.setData(demande);
      this.demSocService.update(demande).subscribe(data => {
        /*if (this.ngModelValue == '1') {
          this.message = "Demande validée avec succes !";
        } else if (this.ngModelValue == '2') {
          this.message = "Demande rejetée avec succes !";
        }
        this.message=""
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
          });*/
        this.onGetAllDemandePhy();
      },
        (error) => {
          /*this.toastrService.show(
            'Impossible de supprimer la demande !',
            'Notification',
            {
              status: this.statusFail,
              destroyByClick: true,
              duration: 300000,
              hasIcon: true,
              position: this.position,
              preventDuplicates: false,
            });*/
        })
    }
    // deb
    displayButtonUpload:boolean=false;
    openAjoutUpLoad() {
      this.displayButtonUpload =true;
    }
  selectedFile = null;
  onFileSelected(event) {
    this.selectedFile = event.target.files;
    console.log(this.selectedFile);
  }
  checked1 :boolean = false;
  checked2 :boolean= false;
  checked3 :boolean= false;
  checked4 :boolean= false;
  checked :boolean = false;
  getted :boolean = false;


  arraysIdentical(a, b) {
    if(a!=null && b!=null){
    var i = a.length;
    if (i != b.length) return false;
      while (i--) {
          if (a[i] !== b[i]) return false;
      }
    return true;
    }
    };

  plusieursproduit : boolean = false;
  troisproduits : boolean = false;
  obligatoire : boolean=false;

//checkeds
checkedquatre:boolean=false;
checkedcinq:boolean=false;
checkedsixe:boolean=false;
checkedsept:boolean=false;
checkedhuit:boolean=false;
checkedneuf:boolean=false;
checkeddix:boolean=false;
checkedonze:boolean=false;
//checked


  toggle(checked: boolean) {
    
    this.checked = checked;
    
    //this.plusieursproduit=true;
    //this.ongetFiles(this.demandeSociete.demandeSocietenum);
    if(this.demandeSociete.dem_produitdemande1==15001001){
      //this.dem_commentaire = this.dem_commentaire;
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
          this.check=true;
        this.ngModelValue="1";
        
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        // this.ngModelValue="1";
         this.plusieursproduit=true;
       }else{
        
         this.ngModelValue=null;
         this.plusieursproduit=false;
       }
    
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
       // this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }

    }if(this.demandeSociete.dem_produitdemande1==15001003){
      
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames ) ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true  && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }

      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
     
    }else if(this.demandeSociete.dem_produitdemande1==14002001){
      if(this.checked && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==14003001){
      if(this.checked && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
    }else if(this.demandeSociete.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }

      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
     
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001002){
      
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }

    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkeddeux==true && this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    /*if(this.produitdeux){
      this.plusieursproduit=false;
    }*/
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005){
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.plusieursproduit=true;
        //this.ngModelValue="1";
      }else{
        this.plusieursproduit=false;
        this.ngModelValue=null;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }

    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }

    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
   if(
   (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
   (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
   (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                         
             
             
   (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
   (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
   (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
   
   
   (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
   (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
   
   (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
   (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

    
  }

  toggledeux(checked: boolean) {
    this.checkeddeux = checked;
    
    //this.ongetFiles(this.demandeSociete.demandeSocietenum);
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        // this.ngModelValue="1";
         this.plusieursproduit=true;
       }else{
        
         this.ngModelValue=null;
         this.plusieursproduit=false;
       }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
   
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames ) ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
     
    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
      /*if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.obligatoire=true;
      }else{
        this.obligatoire=false;
      }*/
     
    }else if(this.demandeSociete.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }

      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
     
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001002 ){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
      if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
          this.check=true;
          this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.check=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq  && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005){
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.plusieursproduit=true;
        //this.ngModelValue="1";
      }else{
        this.plusieursproduit=false;
        this.ngModelValue=null;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }

    if(
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          this.ngModelValue=null;
          this.check=false;
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        
      }

      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

   
  }

  toggletrois(checked: boolean) {
    this.checkedtrois = checked;
    
    //this.ongetFiles(this.demandeSociete.demandeSocietenum);
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois  && this.filenames.length>=3 &&this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        // this.ngModelValue="1";
         this.plusieursproduit=true;
       }else{
        
         this.ngModelValue=null;
         this.plusieursproduit=false;
       }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false
      }
      
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true  && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
      /*if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.obligatoire=true;
      }else{
        this.obligatoire=false;
      }*/
     
    }else if(this.demandeSociete.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
     
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005){
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.plusieursproduit=true;
        //this.ngModelValue="1";
      }else{
        this.plusieursproduit=false;
        this.ngModelValue=null;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

   
  }
  
  togglequatre(checked: boolean) {
    this.checkedquatre = checked;
    
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        //this.check=false;
        //this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois&& this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames ) ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true  && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
     
    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
      /*if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.obligatoire=true;
      }else{
        this.obligatoire=false;
      }*/
     
    }else if(this.demandeSociete.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
    }
    
    if(this.demandeSociete.dem_produitdemande1==15001003 ){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq  && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

  }
 
  togglecinq(checked: boolean) {
    this.checkedcinq = checked;
    
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001004){
     if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames ) ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
     
    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
      /*if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.obligatoire=true;
      }else{
        this.obligatoire=false;
      }*/
     
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if((this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
      (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
      (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                            
                
                
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
      (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
      (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
      (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                            
                
                
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
      
      
      (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
      (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
      
      (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
      (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

   
  }
  
  togglesixe(checked: boolean) {
    this.checkedsixe = checked;
    
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois&& this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }/*else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }
     
    }*/else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001003 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }

    if(
      (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
      (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
      (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                            
                
                
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
      (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
      
      
      (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
      (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
      
      (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
      (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

  }
  
  togglesept(checked: boolean) {
    this.checkedsept = checked;
    
    
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
     
    }/*else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }
    }*/else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    /*if(this.demandeSociete.dem_produitdemande3==15001004){
      if(this.checkedsept==true && this.checkedhuit==true  && this.filenames.length>=8  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
    }*/
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if
((this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
(this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
(this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                      
          
          
(this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
(this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
(this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||


(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||

(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

   
  }
 
  togglehuit(checked: boolean){
    this.checkedhuit = checked;
    
    
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
     
    }/*else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }
     
    }*/else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    /*if(this.checkedsept==true && this.checkedhuit==true  && this.filenames.length>=8  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
      this.check=true;
      this.ngModelValue="1";
    }else{
      this.check=false;
      this.ngModelValue=null;
    }*/
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001005 && this.demandeSociete.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande1==15001004 && this.demandeSociete.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

  }

 
  toggleneuf(checked: boolean){
    this.checkedneuf = checked;
    
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
     
    }/*else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }
     
    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    /*if(this.checkedsept==true && this.checkedhuit==true  && this.filenames.length>=8  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
      this.check=true;
      this.ngModelValue="1";
    }else{
      this.check=false;
      this.ngModelValue=null;
    }*/
    
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
       // this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
   
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }

      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005) || 
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) ||
        
        
        
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }

      }

  }
  cas
  
  toggledix(checked: boolean){
    this.checkeddix = checked;
    
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.produitdeux){
      this.plusieursproduit=false;
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
  }
  
  toggleonze(checked: boolean){
    this.checkedonze = checked;
    
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.demandeSociete.dem_produitdemande1==15001002 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004)|| 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001004) || 
    (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004) ||
    
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001004) ||
    (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
   
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) || 
        (this.demandeSociete.dem_produitdemande3==15001001 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001005 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001003) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001002 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005) ||
                              
                              
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001003 && this.demandeSociete.dem_produitdemande2==15001004 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
      if(
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001003) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001001 && this.demandeSociete.dem_produitdemande1==15001005)      || 


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001001) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001002) || 
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001005 && this.demandeSociete.dem_produitdemande1==15001003) ||
        
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001002 && this.demandeSociete.dem_produitdemande1==15001005) ||


        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001001) ||
        (this.demandeSociete.dem_produitdemande3==15001004 && this.demandeSociete.dem_produitdemande2==15001003 && this.demandeSociete.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      }
   
  }
  checkeddouze : boolean=false;
  toggledouze(checked: boolean){
    this.checkeddouze = checked;
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
  
  
  checkedtrois:boolean = false
  
  
  listedoc : number []=[];
  submit(demande:Dem_Soc){
    this.checked ;
    if(this.checked){
      //this.form2.controls['dr'].setValue(1);
      this.listedoc[0]=1;
    }else{
      //this.form2.controls['dr'].setValue(null);
      this.listedoc[0]=null;
    }
    if(this.checkeddeux){
      //this.form2.controls['mc'].setValue(2);
      this.listedoc[1]=2;
    }else{
      //this.form2.controls['mc'].setValue(null);
      this.listedoc[1]= null;
    }
    if(this.checkedtrois){
      //this.form2.controls['dadg'].setValue(3);
      this.listedoc[2]=3;
    }else{
      //this.form2.controls['dadg'].setValue(null);
      this.listedoc[2]=null;
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
    demande.list_document_valide = this.listedoc;
    this.demSocService.update(demande).subscribe(data => {
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
      this.onGetAllDemandeSoc();
    },
      (error) => {
        this.toastrService.show(
          'Impossible de supprimer la demande !',
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
  type
  submit1(demande:Dem_Soc){
    
    if(this.analyseDeRisque==true){
      this.check=true;
      this.checked=true;
      this.checkeddeux=true;
      this.checkedtrois=true;
      this.checkedquatre=true;
      this.checkedcinq=true;
      this.checkedsixe=true;
      this.checkedsept=true;
      this.checkedhuit=true;
      this.checkedneuf=true;
      this.checkeddix = true;
      this.checkedonze=true;
      this.ngModelValue='1';
      this.plusieursproduit=true;
      this.check=true;
      this.troisproduits = true;
      this.obligatoire=true;
    }else{
      this.plusieursproduit=false;
      this.check=false;
      this.troisproduits = false;
      this.obligatoire=false;
    }
/*
    if(this.rejete==true){
      this.check=false
      this.checked=true;
      this.checkeddeux=true;
      this.checkedtrois=true;
      this.checkedquatre=true;
      this.checkedcinq=true;
      this.checkedsixe=true;
      this.checkedsept=true;
      this.checkedhuit=true;
      this.checkedneuf=true;
      this.checkeddix = true;
      this.checkedonze=true;
      this.ngModelValue='2';
      this.plusieursproduit=true;
      this.check=true;
      this.troisproduits = true;
      this.obligatoire=true;
    }else{
      this.plusieursproduit=false;
      this.check=false;
      this.troisproduits = false;
      this.obligatoire=false;
    }*/
    

    
    console.log(this.produitdeux,"deuxp");
    console.log(this.produittrois,"trois");
    
   
    console.log(this.ngModelValue,"ngvalu");
    console.log(this.filenames.length,"files");

    //this.check=false;
    //this.obligatoire=false;
    if(this.demandeSociete.dem_produitdemande1==15001001){
      if(this.checked){
        this.listedoc[0]=1;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=2;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=3;
      }else{
        this.listedoc[2]=null;
      }
    }else if(this.demandeSociete.dem_produitdemande1==15001002){
      
      if(this.checked){
        this.listedoc[0]=4;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=5;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=6;
      }else{
        this.listedoc[2]=null;
      }
//produit 2 début 
      if(this.demandeSociete.dem_produitdemande2==15001003){
        if(this.produitdeux){
          if(this.checkedquatre){
            this.listedoc[3]=7;
          }else{
            this.listedoc[3]=null;
          }
          if(this.checkedcinq){
            this.listedoc[4]=8;
          }else{
            this.listedoc[4]= null;
          }
          if(this.checkedsixe){
            this.listedoc[5]=9;
          }else{
            this.listedoc[5]=null;
          }
        
          this.listedoc[0]=4;
          this.listedoc[1]=5;
          this.listedoc[2]=6;
        }
        
        /*this.listedoc[3]=7;
        this.listedoc[4]=8;
        this.listedoc[5]=9;*/
      }else if(this.demandeSociete.dem_produitdemande2==15001004){
        if(this.produitdeux){
          if(this.checkedquatre){
            this.listedoc[3]=10;
          }else{
            this.listedoc[3]=null;
          }
          if(this.checkedcinq){
            this.listedoc[4]=11;
          }else{
            this.listedoc[4]= null;
          }
          if(this.checkedsixe){
            this.listedoc[5]=12;
          }else{
            this.listedoc[5]=null;
          }
          if(this.checkedsept){
            this.listedoc[6]=13;
          }else{
            this.listedoc[6]=null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=14;
          }else{
            this.listedoc[7]=null;
          }
          
          this.listedoc[0]=4;
          this.listedoc[1]=5;
          this.listedoc[2]=6;
        }
        /*this.listedoc[0]=4;
        this.listedoc[1]=5;
        this.listedoc[2]=6;
        this.listedoc[3]=10;
        this.listedoc[4]=11;
        this.listedoc[5]=12;
        this.listedoc[6]=13;
        this.listedoc[7]=14;*/
      }
//produit 2 fin

//produit 3 début
      if(this.demandeSociete.dem_produitdemande3==15001003){
        if(this.produittrois){
          if(this.checkedneuf){
            this.listedoc[8]=7;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=8;
          }else{
            this.listedoc[9]= null;
          }
          if(this.checkedonze){
            this.listedoc[10]=9;
          }else{
            this.listedoc[10]=null;
          }
        
          this.listedoc[0]=4;
          this.listedoc[1]=5;
          this.listedoc[2]=6;
          this.listedoc[3]=10;
          this.listedoc[4]=11;
          this.listedoc[5]=12;
          this.listedoc[6]=13;
          this.listedoc[7]=14;
        }
        
        /*this.listedoc[8]=7;
        this.listedoc[9]=8;
        this.listedoc[10]=9;*/
      }else if(this.demandeSociete.dem_produitdemande3==15001004){
        if(this.produittrois){
        if(this.checkedsept){
          this.listedoc[6]=10;
        }else{
          this.listedoc[6]=null;
        }
        if(this.checkedhuit){
          this.listedoc[7]=11;
        }else{
          this.listedoc[7]= null;
        }
        if(this.checkedneuf){
          this.listedoc[8]=12;
        }else{
          this.listedoc[8]=null;
        }
        if(this.checkeddix){
          this.listedoc[9]=13;
        }else{
          this.listedoc[9]=null;
        }
        if(this.checkedonze){
          this.listedoc[10]=14;
        }else{
          this.listedoc[10]=null;
        }
        

        
          this.listedoc[0]=4;
          this.listedoc[1]=5;
          this.listedoc[2]=6;
          this.listedoc[3]=7;
          this.listedoc[4]=8;
          this.listedoc[5]=9;
        }
        

        /*this.listedoc[6]=10;
        this.listedoc[7]=11;
        this.listedoc[8]=12;
        this.listedoc[9]=13;
        this.listedoc[10]=14;*/
      }
//produit 3 fin

    }else if(this.demandeSociete.dem_produitdemande1==15001003){
      if(this.checked){
        this.listedoc[0]=7;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=8;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=9;
      }else{
        this.listedoc[2]=null;
      }
      //produit 2 début 
      if(this.demandeSociete.dem_produitdemande2==15001002){
        if(this.produitdeux){
          if(this.checkedquatre){
            this.listedoc[3]=4;
          }else{
            this.listedoc[3]=null;
          }
          if(this.checkedcinq){
            this.listedoc[4]=5;
          }else{
            this.listedoc[4]= null;
          }
          if(this.checkedsixe){
            this.listedoc[5]=6;
          }else{
            this.listedoc[5]=null;
          }
        
          this.listedoc[0]=7;
          this.listedoc[1]=8;
          this.listedoc[2]=9;
          /*this.listedoc[3]=4;
          this.listedoc[4]=5;
          this.listedoc[5]=6;*/
        }
        
      }else if(this.demandeSociete.dem_produitdemande2==15001004){
        if(this.produitdeux){
          if(this.checkedquatre){
            this.listedoc[3]=10;
          }else{
            this.listedoc[3]=null;
          }
          if(this.checkedcinq){
            this.listedoc[6]=11;
          }else{
            this.listedoc[6]= null;
          }
          if(this.checkedsixe){
            this.listedoc[5]=12;
          }else{
            this.listedoc[5]=null;
          }
          if(this.checkedsept){
            this.listedoc[6]=13;
          }else{
            this.listedoc[6]=null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=14;
          }else{
            this.listedoc[7]=null;
          }
        
          this.listedoc[0]=7;
          this.listedoc[1]=8;
          this.listedoc[2]=9;
         }
        /*this.listedoc[3]=10;
        this.listedoc[4]=11;
        this.listedoc[5]=12;
        this.listedoc[6]=13;
        this.listedoc[7]=14;*/
      }
//produit 2 fin

//produit 3 début
      if(this.demandeSociete.dem_produitdemande3==15001002){
        if(this.produittrois){
          if(this.checkedneuf){
            this.listedoc[8]=4;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=5;
          }else{
            this.listedoc[9]= null;
          }
          if(this.checkedonze){
            this.listedoc[10]=6;
          }else{
            this.listedoc[10]=null;
          }
        
          this.listedoc[0]=7;
          this.listedoc[1]=8;
          this.listedoc[2]=9;
          this.listedoc[3]=10;
          this.listedoc[4]=11;
          this.listedoc[5]=12;
          this.listedoc[6]=13;
          this.listedoc[7]=14;
        }
        
        /*this.listedoc[8]=4;
        this.listedoc[9]=5;
        this.listedoc[10]=6;*/
      }else if(this.demandeSociete.dem_produitdemande3==15001004){
        if(this.produittrois){
          if(this.checkedsept){
            this.listedoc[6]=10;
          }else{
            this.listedoc[6]=null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=11;
          }else{
            this.listedoc[7]= null;
          }
          if(this.checkedneuf){
            this.listedoc[8]=12;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=13;
          }else{
            this.listedoc[9]=null;
          }
          if(this.checkedonze){
            this.listedoc[10]=14;
          }else{
            this.listedoc[10]=null;
          }
          
          this.listedoc[0]=7;
          this.listedoc[1]=8;
          this.listedoc[2]=9;
          this.listedoc[3]=4;
          this.listedoc[4]=5;
          this.listedoc[5]=6;
        }
        
        /*this.listedoc[6]=10;
        this.listedoc[7]=11;
        this.listedoc[8]=12;
        this.listedoc[9]=13;
        this.listedoc[10]=14;*/
      }
//produit 3 fin

    }else if(this.demandeSociete.dem_produitdemande1==15001004){
      if(this.checked){
        this.listedoc[0]=10;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=11;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=12;
      }else{
        this.listedoc[2]=null;
      }
      if(this.checkedquatre){
        this.listedoc[3]=13;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[4]=14;
      }else{
        this.listedoc[4]=null;
      }
      //produit 2 debut
      if(this.demandeSociete.dem_produitdemande2==15001002){
        if(this.produitdeux){
          if(this.checkedsixe){
            this.listedoc[5]=4;
          }else{
            this.listedoc[5]=null;
          }
          if(this.checkedsept){
            this.listedoc[6]=5;
          }else{
            this.listedoc[6]= null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=6;
          }else{
            this.listedoc[7]=null;
          }
        
          this.listedoc[0]=10;
          this.listedoc[1]=11;
          this.listedoc[2]=12;
          this.listedoc[3]=13;
          this.listedoc[4]=14;
        }
       
        /*this.listedoc[5]=4;
        this.listedoc[6]=5;
        this.listedoc[7]=6;*/
      }else if(this.demandeSociete.dem_produitdemande2==15001003){
        if(this.produitdeux){
          if(this.checkedsixe){
            this.listedoc[5]=7;
          }else{
            this.listedoc[5]=null;
          }
          if(this.checkedsept){
            this.listedoc[6]=8;
          }else{
            this.listedoc[6]= null;
          }
          if(this.checkedhuit){
            this.listedoc[7]=9;
          }else{
            this.listedoc[7]=null;
          }

        
          this.listedoc[0]=10;
          this.listedoc[1]=11;
          this.listedoc[2]=12;
          this.listedoc[3]=13;
          this.listedoc[4]=14;
        }
        /*this.listedoc[0]=10;
        this.listedoc[1]=11;
        this.listedoc[2]=12;
        this.listedoc[3]=13;
        this.listedoc[4]=14;
        this.listedoc[5]=7;
        this.listedoc[6]=8;
        this.listedoc[7]=9;*/
      }
      //produit 2 fin
      //produit 3 debut
      if(this.demandeSociete.dem_produitdemande3==15001002){
        if(this.produittrois){
          if(this.checkedneuf){
            this.listedoc[8]=4;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=5;
          }else{
            this.listedoc[9]= null;
          }
          if(this.checkedonze){
            this.listedoc[10]=6;
          }else{
            this.listedoc[10]=null;
          }
          
          this.listedoc[0]=10;
          this.listedoc[1]=11;
          this.listedoc[2]=12;
          this.listedoc[3]=13;
          this.listedoc[4]=14;
          this.listedoc[5]=7;
          this.listedoc[6]=8;
          this.listedoc[7]=9;
        }
       
        /*this.listedoc[8]=4;
        this.listedoc[9]=5;
        this.listedoc[10]=6;*/
      }else if(this.demandeSociete.dem_produitdemande3==15001003){
        if(this.produittrois){
          if(this.checkedneuf){
            this.listedoc[8]=7;
          }else{
            this.listedoc[8]=null;
          }
          if(this.checkeddix){
            this.listedoc[9]=8;
          }else{
            this.listedoc[9]= null;
          }
          if(this.checkedonze){
            this.listedoc[10]=9;
          }else{
            this.listedoc[10]=null;
          }

          
          this.listedoc[0]=10;
          this.listedoc[1]=11;
          this.listedoc[2]=12;
          this.listedoc[3]=13;
          this.listedoc[4]=14;
          this.listedoc[5]=4;
          this.listedoc[6]=5;
          this.listedoc[7]=6;
        }
        
        /*this.listedoc[8]=7;
        this.listedoc[9]=8;
        this.listedoc[10]=9;*/
      }
      // produit 3 fin
    }
    else if(this.demandeSociete.dem_produitdemande1==14002001){
      if(this.checked){
        this.listedoc[0]=15;
      }else{
        this.listedoc[0]=null;
      }
      
    }else if(this.demandeSociete.dem_produitdemande1==14003001){
      this.type="FINASSUR";
      if(this.checked ){
        this.listedoc[0]=16;
      }else{
        this.listedoc[0]=null;
      }

    }else if(this.demandeSociete.dem_produitdemande1==14001001){
      if(this.checkedhuit){
        this.listedoc[0]=17;
      }else if(this.checkedneuf){
        this.listedoc[0]=18;
        if(this.checked){
          this.listedoc[1]=19;
        }else{
          this.listedoc[1]=null;
        }
        if(this.checkeddeux){
          this.listedoc[2]=20;
        }else{
          this.listedoc[2]= null;
        }
        if(this.checkedtrois){
          this.listedoc[3]=21;
        }else{
          this.listedoc[3]=null;
        }
        if(this.checkedquatre){
          this.listedoc[6]=22;
        }else{
          this.listedoc[6]=null;
        }
        if(this.checkedcinq){
          this.listedoc[5]=23;
        }else{
          this.listedoc[5]=null;
        }
        if(this.checkedsixe){
          this.listedoc[6]=24;
        }else{
          this.listedoc[6]=null;
        }
        if(this.checkedsept){
          this.listedoc[7]=25;
        }else{
          this.listedoc[7]=null;
        }
      }else{
        this.listedoc[0]=null;
      }
      
      
    }if(this.demandeSociete.dem_produitdemande1==16008001){
      this.type="LOCASSUR";
      if(this.checked){
        this.listedoc[0]=26;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=27;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=28;
      }else{
        this.listedoc[2]=null;
      }
      if(this.checkedquatre){
        this.listedoc[3]=29;
      }else{
        this.listedoc[3]=null;
      }
    }
    /*if(this.demandeSociete.dem_produitdemande2==15001003){
    
        this.listedoc[0]=6;
      
        this.listedoc[1]=5;
      
        this.listedoc[2]=6;
      
      if(this.checkedquatre){
        this.listedoc[3]=7;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[6]=8;
      }else{
        this.listedoc[6]= null;
      }
      if(this.checkedsixe){
        this.listedoc[5]=9;
      }else{
        this.listedoc[5]=null;
      }
    
  }
    //Retenue de garantie produit 2 ou 3
    /*if(this.demandeSociete.dem_produitdemande2==15001004 || this.demandeSociete.dem_produitdemande3==15001004){
      
      if(this.checkedquatre){
        this.listedoc[3]=13;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[6]=14;
      }else{
        this.listedoc[6]=null;
      }
    }*/
    if(this.demandeSociete.dem_produitdemande2!=0){
      this.produitdeux=true;
      this.produittroisvrai++;
      //this.obligatoire=false;
      //this.check = false;
      /*if(this.demandeSociete.dem_produitdemande3==0){
        this.plusieursproduit=false;
      }else {
        this.plusieursproduit=true;
      }*/

      //this.troisproduits=this.plusieursproduit;
      if(this.demandeSociete.dem_produitdemande3!=0 && this.produittroisvrai==2){
        this.produittrois=true;
        //this.obligatoire=false;
        //this.check = false;
        //this.plusieursproduit=false;
      }
    }
    console.log(this.check,"check");
    console.log(this.obligatoire,"obligatoiotre");
    console.log("plusieurs produit",this.plusieursproduit)
    console.log(this.troisproduits,"troisproduits");
    //this.ngModelValue=null;
    //console.log("adama",this.data);
    //this.ongetFiles(demande.demandeSocietenum);
    demande.list_document_valide = this.listedoc; 
    console.log("liste docs valides",this.listedoc);
    demande.list_document_lu= this.demandeSociete.list_document_lu;
    console.log("liste docs lus",demande.list_document_lu.length);
    /*this.demPService.update(demande).subscribe(data => {
      /*if (this.ngModelValue == '1') {
        this.message = "Demande validée avec succes !";
      } else if (this.ngModelValue == '2') {
        this.message = "Demande rejetée avec succes !";
      }
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
      this.onGetAllDemandePhy();
    },
      (error) => {
        this.toastrService.show(
          'Impossible de supprimer la demande !',
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
      this.bonneexecution=true; 
      if(demande.dem_produitdemande3==0){
        
        this.retenue=false;
        this.retenuegarantie=true
      }else{
        this.retenue=this.retenuegarantie;
      }
      console.log('check',this.check);
      console.log('obligatoire',this.obligatoire);
      */
  };
  files: File[]
  onClickUpload(idDemande) {
    this.changeAnalyse=false;
    //this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for (const file of this.files) {
      form.append('files', file, file.name);
    }
  this.demSocService.uploadDoc(form, idDemande)
  .subscribe((event: HttpEvent<any>) => {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        break;
      case HttpEventType.UploadProgress:
        //this.progress = Math.round(event.loaded / event.total * 100);
        //console.log(`Uploaded! ${this.progress}%`);
        break;
      case HttpEventType.Response:
        console.log('upload ok', event.status);
        setTimeout(() => {
          //this.progress = 0;
          //this.displayprogress = false;
        }, 1500);
        if (event.status == 200) {
          this.ongetFiles(idDemande);
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
//fin
  
    onClickDownload(filename: string, idDemande) {
      console.log(idDemande);
  
      this.demSocService.downloadDoc(filename, idDemande)
        .subscribe(event => {
          switch (event.type) {
            case HttpEventType.Sent:
              console.log('Request has been made!');
              break;
            case HttpEventType.ResponseHeader:
              console.log('Response header has been received!');
              break;
            // case HttpEventType.UploadProgress:
            //   this.progress = Math.round(event.loaded / event.total * 100);
            //   console.log(`downloaded! ${this.progress}%`);
            //   break;
            case HttpEventType.Response:
              console.log(event.body);
              saveAs(event.body, filename);
          }
        });
    }
  

    onExportConditionGenerale(id:any) {

      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demSocService.generateReportConditionGenerale(id)
  
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
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'Condition Générale.pdf');
          }
        });
    }

    progress: number = 0;
  displayprogress: boolean = false;
  onClickDelete(filename: string,idDemande) {
    this.demSocService.deleteFileDoc(filename, idDemande)
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
              this.ongetFiles(idDemande);
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

    onExportConditionParticuliere(id) {

      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demSocService.generateReportConditionParticuliere(id)
    
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
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'Condition Particulière.pdf');
          }
        });
    }
    typeinstruction
    onStataicInstruction(){
      let data=[];
      if(this.demandeSociete.dem_typetitulaire=="CL"){
        data=[this.demandeSociete,this.client]
      }else{
        data=[this.demandeSociete,this.prospect]
      }
      
      this.transfertData.setData(data);
      this.typeinstruction = this.demandeSociete.dem_produitdemande1.toString()[0]+this.demandeSociete.dem_produitdemande1.toString()[1];
      console.log("typeinstruction",this.typeinstruction);
      if(this.typeinstruction=="15"){
        this.router.navigateByUrl('/home/demande-societe/static-instruction');
      }else if(this.typeinstruction=="14"){
        this.router.navigateByUrl('/home/demande-societe/static-instruction-credit');
      }else if(this.typeinstruction=="16"){
        this.router.navigateByUrl('/home/demande-societe/static-instruction-perte');
      }
      
      //this.router.navigateByUrl('/home/demande-societe/ajout-Societe');
    }
    demandeur
    raisonsociale
    anneerelation;
    soumission
    avancedemarrage
    bonneexcution
    retenuegarantie
    definitive
    cmttotale
    nomgerant
    soumissionencours : number = 0;
    avancedemarrageencours: number = 0;
    bonneexecutionencours : number=0;
    retenuegarantieencours : number = 0;
    definitiveencours : number=0;
    cmttotaleencours : number =0;
    policenumero ;
    denomminationsociale ;
    objetavenant ;
    datesoucription ;
    beneficiaire 
    onExportConditionInstruction(demande:Dem_Soc) {
      this.demandeur=this.demandeSociete.dem_denomination;
      this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
      console.log("typesociete",this.listTypeSociete)
      this.raisonsociale =  this.listTypeSociete.find(p=>p.id==this.demandeSociete.dem_typesociete).value; ;
      this.objetavenant ='meissa';
    this.datesoucription = 'meissa' ;
    this.beneficiaire ="meissa";
      console.log(this.demSoctBytitulaireCl);
     
      if(this.demandeSociete.dem_typetitulaire=="CL"){
          
        this.demSoctBytitulaireCl.forEach(element => {
          //TOTAL ENGAGEMENTS EN COURS DEBUT
          if(this.demandeSociete.dem_socnum!=element.dem_socnum){
            if(element.dem_produitdemande1==15001001){
              this.soumissionencours=this.soumissionencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001001){
              this.soumissionencours=this.soumissionencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001001){
              this.soumissionencours=this.soumissionencours+ element.dem_montant3 
            }else{
              this.soumissionencours=this.soumissionencours+0
            }
            //avance de démarrage
            if(element.dem_produitdemande1==15001002){
              this.avancedemarrageencours=this.avancedemarrageencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001002){
              this.avancedemarrageencours=this.avancedemarrageencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001002){
              this.avancedemarrageencours=this.avancedemarrageencours+ element.dem_montant3 
            }else{
              this.avancedemarrageencours=this.avancedemarrageencours+0
            }
      
            // bonne execution
      
            if(element.dem_produitdemande1==15001003){
              this.bonneexecutionencours=this.bonneexecutionencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001003){
              this.bonneexecutionencours=this.bonneexecutionencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001003){
              this.bonneexecutionencours=this.bonneexecutionencours+ element.dem_montant3 
            }else{
              this.bonneexecutionencours=this.bonneexecutionencours+0
            }
      
            //retenue de garantie
      
            if(element.dem_produitdemande1==15001004){
              this.retenuegarantieencours=this.retenuegarantieencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001004){
              this.retenuegarantieencours=this.retenuegarantieencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001004){
              this.retenuegarantieencours=this.retenuegarantieencours+ element.dem_montant3 
            }else{
              this.retenuegarantieencours=this.retenuegarantieencours+0
            }
      
      
            //définitive
      
            if(element.dem_produitdemande1==15001005){
              this.definitiveencours=this.definitiveencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001005){
              this.definitiveencours=this.definitiveencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001005){
              this.definitiveencours=this.definitiveencours+ element.dem_montant3 
            }else{
              this.definitiveencours=this.definitiveencours+0;
            }
      
          }
            //TOTAL ENGAGEMENTS EN COURS FIN
        });
      }else{
        this.demSoctBytitulairePr.forEach(element => {
          //TOTAL ENGAGEMENTS EN COURS DEBUT
          if(this.demandeSociete.dem_socnum!=element.dem_socnum){
            if(element.dem_produitdemande1==15001001){
              this.soumissionencours=this.soumissionencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001001){
              this.soumissionencours=this.soumissionencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001001){
              this.soumissionencours=this.soumissionencours+ element.dem_montant3 
            }else{
              this.soumissionencours=this.soumissionencours+0
            }
            //avance de démarrage
            if(element.dem_produitdemande1==15001002){
              this.avancedemarrageencours=this.avancedemarrageencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001002){
              this.avancedemarrageencours=this.avancedemarrageencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001002){
              this.avancedemarrageencours=this.avancedemarrageencours+ element.dem_montant3 
            }else{
              this.avancedemarrageencours=this.avancedemarrageencours+0
            }
      
            // bonne execution
      
            if(element.dem_produitdemande1==15001003){
              this.bonneexecutionencours=this.bonneexecutionencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001003){
              this.bonneexecutionencours=this.bonneexecutionencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001003){
              this.bonneexecutionencours=this.bonneexecutionencours+ element.dem_montant3 
            }else{
              this.bonneexecutionencours=this.bonneexecutionencours+0
            }
      
            //retenue de garantie
      
            if(element.dem_produitdemande1==15001004){
              this.retenuegarantieencours=this.retenuegarantieencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001004){
              this.retenuegarantieencours=this.retenuegarantieencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001004){
              this.retenuegarantieencours=this.retenuegarantieencours+ element.dem_montant3 
            }else{
              this.retenuegarantieencours=this.retenuegarantieencours+0
            }
      
      
            //définitive
      
            if(element.dem_produitdemande1==15001005){
              this.definitiveencours=this.definitiveencours+ element.dem_montant 
            }else if(element.dem_produitdemande2==15001005){
              this.definitiveencours=this.definitiveencours+ element.dem_montant2 
            }else if(element.dem_produitdemande3==15001005){
              this.definitiveencours=this.definitiveencours+ element.dem_montant3 
            }else{
              this.definitiveencours=this.definitiveencours+0;
            }
      
          }
            //TOTAL ENGAGEMENTS EN COURS FIN
        });
      }
      if(this.demandeSociete.dem_produitdemande1==15001001){
        this.soumission= this.demandeSociete.dem_montant 
      }else if(this.demandeSociete.dem_produitdemande2==15001001){
        this.soumission= this.demandeSociete.dem_montant2 
      }else if(this.demandeSociete.dem_produitdemande3==15001001){
        this.soumission= this.demandeSociete.dem_montant3 
      }else{
        this.soumission=0
      }
      //avance de démarrage
      if(this.demandeSociete.dem_produitdemande1==15001002){
        this.avancedemarrage= this.demandeSociete.dem_montant 
      }else if(this.demandeSociete.dem_produitdemande2==15001002){
        this.avancedemarrage= this.demandeSociete.dem_montant2 
      }else if(this.demandeSociete.dem_produitdemande3==15001002){
        this.avancedemarrage= this.demandeSociete.dem_montant3 
      }else{
        this.avancedemarrage=0
      }

      // bonne execution

      if(this.demandeSociete.dem_produitdemande1==15001003){
        this.bonneexcution= this.demandeSociete.dem_montant 
      }else if(this.demandeSociete.dem_produitdemande2==15001003){
        this.bonneexcution= this.demandeSociete.dem_montant2 
      }else if(this.demandeSociete.dem_produitdemande3==15001003){
        this.bonneexcution= this.demandeSociete.dem_montant3 
      }else{
        this.bonneexcution=0
      }

      //retenue de garantie

      if(this.demandeSociete.dem_produitdemande1==15001004){
        this.retenuegarantie= this.demandeSociete.dem_montant 
      }else if(this.demandeSociete.dem_produitdemande2==15001004){
        this.retenuegarantie= this.demandeSociete.dem_montant2 
      }else if(this.demandeSociete.dem_produitdemande3==15001004){
        this.retenuegarantie= this.demandeSociete.dem_montant3 
      }else{
        this.retenuegarantie=0
      }


      //définitive

      if(this.demandeSociete.dem_produitdemande1==15001005){
        this.definitive= this.demandeSociete.dem_montant 
      }else if(this.demandeSociete.dem_produitdemande2==15001005){
        this.definitive= this.demandeSociete.dem_montant2 
      }else if(this.demandeSociete.dem_produitdemande3==15001005){
        this.definitive= this.demandeSociete.dem_montant3 
      }else{
        this.definitive=0;
      }
      this.cmttotale=this.soumission+ this.avancedemarrage + this.bonneexcution + this.retenuegarantie + this.definitive
      this.nomgerant=this.client.clien_princdirigeant;
      this.cmttotaleencours=this.soumissionencours+this.avancedemarrageencours+this.bonneexecutionencours+this.retenuegarantieencours+this.definitiveencours;
      
      console.log(" numero client",demande.dem_clienttitulaire);
      this.denomminationsociale=this.client.clien_denomination;
      
      this.anneerelation = this.datePipe.transform(this.client.clien_date_relation,'yyyy');
      this.policenumero=this.demandeSociete.dem_socnum;
      console.log("teste",this.policenumero , this.denomminationsociale ,this.objetavenant ,this.datesoucription ,this.beneficiaire)
      console.log('client',this.client)
      
      //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demSocService.generateReportInstruction(demande.dem_socnum,this.demandeur,this.raisonsociale,this.anneerelation,this.soumission,this.avancedemarrage,this.bonneexcution,this.retenuegarantie,this.nomgerant,this.definitive,this.cmttotale,
        this.soumissionencours ,this.avancedemarrageencours, this.bonneexecutionencours,this.retenuegarantieencours,this.definitiveencours,this.cmttotaleencours,
        this.policenumero , this.denomminationsociale ,this.objetavenant ,this.datesoucription ,this.beneficiaire)
      //this.demSocService.generateReportInstruction(demande.dem_socnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
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
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'instruction.docx');
          }
        });
    }
    
    onExportInstruction(id){
      this.demSocService.generateReportInstructionCredit(id)
      //this.demSocService.generateReportInstruction(demande.dem_socnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
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
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'instruction.docx');
          }
        });
    }
    onActe(){
      let data=[];
      if(this.demandeSociete.dem_typetitulaire=="CL"){
        data=[this.demandeSociete,this.client]
      }else{
        data=[this.demandeSociete,this.prospect]
      }
      
      this.transfertData.setData(data);
      this.typeinstruction = this.demandeSociete.dem_produitdemande1.toString()[0]+this.demandeSociete.dem_produitdemande1.toString()[1];
      console.log("typeinstruction",this.typeinstruction);
      if(this.typeinstruction=="15"){
        this.router.navigateByUrl('/home/demande-societe/acte-caution');
      }else if(this.typeinstruction=="14"){
        if(this.demandeSociete.dem_produitdemande1==14003001)
          this.router.navigateByUrl('/home/demande-societe/acte-credit');
      }else if(this.typeinstruction=="16"){
        this.router.navigateByUrl('/home/demande-societe/acte-perte');
      }
      
      //this.router.navigateByUrl('/home/demande-societe/ajout-Societe');
    }
    onExportGarantie(id) {

      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demSocService.generateReportSoumission(id)

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
              // console.log(event);
              // var fileURL = URL.createObjectURL(event.body) ;
              // window.open(fileURL) ;
              saveAs(event.body, 'Garantie de soumission.pdf');
          }
        });
    

  
  }


  openDialogParticulier(dialogModifCParticulier: TemplateRef<any>, demandeSoc: Dem_Soc) {
    //alert(JSON.stringify(demandePhy));
    //console.log(demandePhy.dem_typetitulaire);
    //this.ongetFiles(demandePhy);
   // this.getCientById(demandePhy.dem_typetitulaire);
    setTimeout(() => {
      this.dialogService.open(
        dialogModifCParticulier,
        {
          context: demandeSoc,  
        });
    }, 1000);
   
  }


  refresh(){
    setTimeout(() => {
      this.onGetAllDemandePhy();
  
    }, 2000);
  }

  form: FormGroup;
submitted = false;
// convenience getter for easy access to form fields
get f() { return this.form.controls; }

  openArcitrage(demande: Dem_Soc) {

    this.transfertData.setData(demande);
    console.log(demande);
    this.router.navigateByUrl('/home/demande-societe');

  }
  close(){
    this.router.navigateByUrl('/home/demande-societe');
  }
  openpdf(filename,idDemande) {
    
    let i = this.filenames.indexOf(filename);
    //this.demandeSociete.list_document_lu[i]=filename;
    this.demandeSociete.filenames=this.filenames;
  let test = this.demandeSociete.list_document_lu===this.filenames;
    console.log('list',this.demandeSociete.list_document_lu);
    console.log('file',this.filenames);
    console.log("3h",test);
    this.demSocService.downloadInDossier(filename,idDemande)
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
            let data=[event.body,this.demandeSociete,filename,i]
            let data2 =[this.produitdeux,this.produittrois,this.produittroisvrai,this.check,this.ngModelValue]
            this.transfertData2.setData(data2);
            //this.transfertData.setData(event.body);
            this.transfertData.setData(data);
            this.router.navigateByUrl("/home/voirpdf");
            //this.dialogService.open(ViewPdfComponent, { hasScroll:true });
  
            
        }
      });
    
  
  
  }
  changeAnalyse=true;
  Onfileschange(event){
  /*  this.changeAnalyse = event;
    this.ongetFiles(this.demandeSociete.dem_socnum);
    if(this.analyseDeRisque){
      if(this.arraysIdentical(this.demandeSociete.list_document_lu,this.filenames)){
        this.changeAnalyse = true;
      }else{
        this.changeAnalyse=false;
      }
    }*/
  }
}

export class Emetteur{
  chiffre_affaire:Number;
  capital_social:Number
}