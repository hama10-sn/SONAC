
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Civilite } from '../../../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../../../model/ClassificationSecteur';
import { Dem_Pers } from '../../../../../../model/dem_Pers'; 
import { CiviliteService } from '../../../../../../services/civilite.service'; 
import { ClassificationSecteurService } from '../../../../../../services/classification-secteur.service'; 
import { DemandephysiqueService } from '../../../../../../services/demandephysique.service'; 
import { TransfertDataService } from '../../../../../../services/transfertData.service'; 
import { saveAs } from 'file-saver';
import { ClientService } from '../../../../../../services/client.service'; 
import { Client } from '../../../../../../model/Client'; 

import { TransfertData2Service } from '../../../../../../services/transfert-data2.service';

import { Produit } from '../../../../../../model/Produit';
import { ProduitService } from '../../../../../../services/produit.service';
import { iif, ReplaySubject } from 'rxjs';
import { Prospect } from '../../../../../../model/Prospect';
import { ProspectService } from '../../../../../../services/prospect.service';

@Component({
  selector: 'ngx-arbitrage-physique',
  templateUrl: './arbitrage-physique.component.html',
  styleUrls: ['./arbitrage-physique.component.scss']
})
export class ArbitragePhysiqueComponent implements OnInit {

  

  /*ngOnInit(): void {
    this.dem_Pers =  this.transfertData.getData()
    console.log(this.dem_Pers);
  }*/

  dem_Pers : Dem_Pers;
  analyseDeRisque : boolean = false;
  type;
  
  tous_les_files_sont_vus=false;
  ngModelValue;
  dem_commentaire="";
  dem_commentaire2;
  formControl = new FormControl('1');
  client: Client;
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

  demandePhysiques: Array<Dem_Pers> = new Array<Dem_Pers>();
  demandePhysique: Dem_Pers;
  checked1 = false;
  checked2 = false;
  checked3 = false;
  checked4 = false;

  filenames: string[];

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
  verifierCheck() {
    if (this.checked1 && this.checked2 && this.checked3 && this.checked4) {
      return true
    } else
      return false;
  }

  classificationSecteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  civilites: Array<Civilite> = new Array<Civilite>();

  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  public displayedColumns = ['dem_persnum', 'dem_typeclientpers', 'dem_nom', 'dem_prenom',
    'dem_adresse1', 'dem_objetdemande', 'dem_statut', 'action'];
  // public displayedColumns = ['dem_persnum', 'dem_typeclientpers', 'dem_nom', 'dem_prenom',
  // 'dem_adresse1','dem_objetdemande','dem_statut','details', 'delete','action'];
  public dataSource = new MatTableDataSource<Dem_Pers>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];
  message: any;
  constructor(private produitService : ProduitService ,private demPService: DemandephysiqueService, private transfertData: TransfertDataService,private transfertData2: TransfertData2Service,
    private dialogService: NbDialogService, private civiliteService: CiviliteService,
    private authService: NbAuthService, private router: Router, private fb: FormBuilder, 
    private clientService: ClientService,
    private activiteService: ClassificationSecteurService, private toastrService: NbToastrService,
    private prospectService : ProspectService) { 

      this.form1= this.fb.group({
        website: this.fb.array([], [Validators.required])
      })
      
    }

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
    data : String[]=[];  
  cmts: boolean=false;
  rejete : boolean=false;
  documentmanquant : boolean=false;
  nineercmanquant : boolean=false;
  typecaution;
  produit :Produit
  produitss: Array<Produit> = new Array<Produit>();
  public filteredProduit: ReplaySubject<Produit[]> = new ReplaySubject<Produit[]>();
 
  ngOnInit(): void {
    
  
    this.dem_Pers =  this.transfertData.getData();
    
    if(this.dem_Pers.dem_produitdemande1===15001006){
      this.typecaution = "COURTIERS ASSURANCE"
    }if(this.dem_Pers.dem_produitdemande1===15001007){
      this.typecaution = "COMMISSIONNAIRES EN DOUANE"
    }
    if(this.dem_Pers.dem_produitdemande1===15001008){
      this.typecaution = "CABINETS IMMOBILIERS"
    }if(this.dem_Pers.dem_produitdemande1===15001009){
      this.typecaution = "AGENCES DE VOYAGES"
    }if(this.dem_Pers.dem_produitdemande1===15001010){
      this.typecaution = "SOCIETE D'INTERIM"
    }if(this.dem_Pers.dem_produitdemande1===15001011){
      this.typecaution = "CONSEILLERS JURIDIQUES & FISCAUX"
    }


    if(this.dem_Pers.dem_produitdemande3===15001001){
      this.typecaution = "soumission";
    }else if(this.dem_Pers.dem_produitdemande3===15001002){
      this.typecaution = "avance de démarrage";
    }else if(this.dem_Pers.dem_produitdemande3===15001003){
      this.typecaution = "bonne execution";
    }else if(this.dem_Pers.dem_produitdemande3===15001005){
      this.typecaution = "définitive";
    }

   // this.cmt=true;
    /*if(this.dem_Pers.dem_produitdemande2!==0 || this.dem_Pers.dem_produitdemande3!==0){
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
    this.ongetFiles(this.dem_Pers?.dem_persnum)
    if(this.dem_Pers.dem_statut){
      if(this.dem_Pers.dem_statut==="analyse de risque" || this.dem_Pers.dem_statut==="analyse juridique" ){
        this.analyseDeRisque=true;
        
        /*if(this.dem_Pers.dem_produitdemande2!==0 || this.dem_Pers.dem_produitdemande3!==0){
        this.cmts=true;
        //this.cmts=true;
        }*/
        console.log('filesname',this.filenames);
        console.log('doc valide',this.dem_Pers.list_document_valide);
        console.log('doc lu',this.dem_Pers.list_document_lu)

      } if(this.dem_Pers.dem_statut==="Rejeté"){
        this.rejete=true;
        this.check=false;
        
        /*if(this.dem_Pers.dem_produitdemande2!==0 || this.dem_Pers.dem_produitdemande3!==0){
        this.cmts=true;
        //this.cmts=true;
        }*/
        console.log('filesname',this.filenames);
        console.log('doc valide',this.dem_Pers.list_document_valide);
        console.log('doc lu',this.dem_Pers.list_document_lu)
        this.ngModelValue="2"

      }if(this.dem_Pers.dem_statut==="En attente dossiers manquants"){
        this.documentmanquant=true;
        this.check=false;
        
        /*if(this.dem_Pers.dem_produitdemande2!==0 || this.dem_Pers.dem_produitdemande3!==0){
        this.cmts=true;
        //this.cmts=true;
        }*/
        console.log('filesname',this.filenames);
        console.log('doc valide',this.dem_Pers.list_document_valide);
        console.log('doc lu',this.dem_Pers.list_document_lu)
        this.ngModelValue="3"

      }if(this.dem_Pers.dem_statut==="En attente RC et/ou NINEA manquants"){
        this.nineercmanquant=true;
        this.check=false;
        
        /*if(this.dem_Pers.dem_produitdemande2!==0 || this.dem_Pers.dem_produitdemande3!==0){
        this.cmts=true;
        //this.cmts=true;
        }*/
        console.log('filesname',this.filenames);
        console.log('doc valide',this.dem_Pers.list_document_valide);
        console.log('doc lu',this.dem_Pers.list_document_lu)
        this.ngModelValue="4"

      }
    }
    /*if(this.dem_Pers.dem_statut==="En attente dossiers manquants"){
      this.documentmanquant=true;
      this.check=false;
      this.ngModelValue='3'
      /*if(this.dem_Pers.dem_produitdemande2!==0 || this.dem_Pers.dem_produitdemande3!==0){
      this.cmts=true;
      //this.cmts=true;
      }*
      console.log('like',this.ngModelValue);
      console.log('doc valide',this.dem_Pers.list_document_valide);
      console.log('doc lu',this.dem_Pers.list_document_lu)
      

    }*/
    /*if(this.dem_Pers.dem_statut){
      if(this.dem_Pers.dem_statut=="Rejeté"){
        this.rejete=true;
        this.check=true;
        
        /*if(this.dem_Pers.dem_produitdemande2!==0 || this.dem_Pers.dem_produitdemande3!==0){
        this.cmts=true;
        //this.cmts=true;
        }*
        console.log('filesname',this.filenames);
        console.log('doc valide',this.dem_Pers.list_document_valide);
        console.log('doc lu',this.dem_Pers.list_document_lu)
        this.ngModelValue="2"

      }
    }*/
    
    
  console.log(this.produitdeux,"deuxp");
  console.log(this.produittrois,"trois");
    console.log('meissa',this.dem_Pers?.list_document_valide);
      
     


     /* if(this.dem_Pers.dem_produitdemande2!==0 || this.dem_Pers.dem_produitdemande3!==0){
        this.cmt=false;
        //this.cmts=true;
      }*/
    
    
    //this.data = [];
    //this.data = this.dem_Pers.list_document_lu;
    console.log('tailledoclu',this.filenames);
    this.filenames = this.dem_Pers.filenames;
    
    
    console.log('tailledoclu',this.filenames);
    
    console.log('tailledoclu',this.dem_Pers.list_document_lu)
    console.log('4h',this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames))
    //console.log("test",this.dem_Pers.dem_commentaire);
    
    //this.dem_commentaire = this.dem_Pers?.dem_commentaire;
    //if(this.dem_Pers.list_document_valide!=null){
      
      if(this.dem_Pers.dem_produitdemande1==15001001){
        this.type="caution de soumission";
        this.nb_document=3;
        if(this.dem_Pers?.list_document_valide[0]==1){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Pers?.list_document_valide[1]==2){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Pers?.list_document_valide[2]==3){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Pers.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
       
      }else if(this.dem_Pers.dem_produitdemande1==15001002){
        this.type="caution d'avance de démarrage";
        if(this.dem_Pers?.list_document_valide[0]==6){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Pers?.list_document_valide[1]==5){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Pers?.list_document_valide[2]==6){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }

        
      }else if(this.dem_Pers.dem_produitdemande1==15001003){
        this.type="caution de bonne execution";
        if(this.dem_Pers?.list_document_valide[0]==7){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Pers?.list_document_valide[1]==8){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Pers?.list_document_valide[2]==9){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Pers.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }


      }else if(this.dem_Pers.dem_produitdemande1==15001005){
        this.type="caution de bonne execution";
        if(this.dem_Pers?.list_document_valide[0]==31){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Pers?.list_document_valide[1]==32){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Pers?.list_document_valide[2]==33){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Pers.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }


      }else if(this.dem_Pers.dem_produitdemande1==15001004){
        this.type="caution de retenue de garantie";
        if(this.dem_Pers?.list_document_valide[0]==10){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Pers?.list_document_valide[1]==10){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Pers?.list_document_valide[2]==12){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        if(this.dem_Pers?.list_document_valide[3]==13){
          this.checkedquatre=true;
        }else{
          this.checkedquatre=false
        }
        if(this.dem_Pers?.list_document_valide[6]==14){
          this.checkedcinq=true;
        }else{
          this.checkedcinq=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Pers.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
          this.obligatoire=true;
          this.ngModelValue="1";
          //this.check=true
         }else{
          this.obligatoire = false;
          this.ngModelValue=null;
         }
       
      }else if(this.dem_Pers.dem_produitdemande1==14002001){
        this.type="KAP’GARANTI EXPORT";
        if(this.dem_Pers?.list_document_valide[0]==15){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.checked==true){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Pers.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
       
      }
      else if(this.dem_Pers.dem_produitdemande1==14003001){
        this.type="KAP’GARANTI DOMESTIQUE";
        if(this.dem_Pers?.list_document_valide[0]==16){
          this.checked=true
        }else{
          this.checked=false;
        }
        
        if(this.checked){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Pers.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
       
      }else if(this.dem_Pers.dem_produitdemande1==14001001){
        
        if(this.dem_Pers?.list_document_valide[0]==17){
          this.checkedhuit = true;
        } else if(this.dem_Pers?.list_document_valide[0]==18){
          this.checkedneuf = true;
          if(this.dem_Pers?.list_document_valide[1]==19){
            this.checked=true
          }else{
            this.checked=false;
          }
          if(this.dem_Pers?.list_document_valide[2]==20){
            this.checkeddeux=true;
          }else{
            this.checkeddeux=false
          }
          if(this.dem_Pers?.list_document_valide[3]==21){
            this.checkedtrois=true;
          }else{
            this.checkedtrois=false
          }
          if(this.dem_Pers?.list_document_valide[6]==22){
            this.checkedquatre=true;
          }else{
            this.checkedquatre=false
          }
          if(this.dem_Pers?.list_document_valide[5]==23){
            this.checkedcinq=true;
          }else{
            this.checkedcinq=false
          }
          if(this.dem_Pers?.list_document_valide[6]==24){
            this.checkedsixe=true;
          }else{
            this.checkedsixe=false
          }
          if(this.dem_Pers?.list_document_valide[7]==25){
            this.checkedsept=true;
          }else{
            this.checkedsept=false
          }
        }else{
          this.checkedhuit=null;
          this.checkedneuf=null;
        }
        console.log(this.cas);
        
        if(this.checkedhuit){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.checkedneuf) {
          if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept && this.cas ==28 || this.cas == 29 ){
            this.check=true;
            this.ngModelValue="1";
          }else if(this.dem_Pers.dem_statut=="Rejeté"){
            this.check=false;
            this.ngModelValue="2";
          }else{
            this.check=false;
          this.ngModelValue=null;
          }
        }
        
        /*if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
          this.obligatoire=true;
        }else{
          this.obligatoire=false;
        }*/
       
      }if(this.dem_Pers.dem_produitdemande1==16008001){
        if(this.dem_Pers?.list_document_valide[0]==26){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Pers?.list_document_valide[1]==27){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Pers?.list_document_valide[2]==28){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        if(this.dem_Pers?.list_document_valide[3]==29){
          this.checkedquatre=true;
        }else{
          this.checkedquatre=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Pers.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
          this.obligatoire=true;
          this.ngModelValue="1";
        }else{
          this.obligatoire=false;
          this.ngModelValue=null;
        }
      
     
    }
    
    this.onGetAllCivilite();
    this.onGetClassification();
    this.onGetAllDemandePhy();
    console.log('filesname',this.filenames);
      console.log('doc valide',this.dem_Pers.list_document_valide);
      console.log('doc lu',this.dem_Pers.list_document_lu)
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);
        }
      });
      
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
      if(this.dem_Pers.dem_statut==="En attente dossiers manquants"){
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
      if(this.dem_Pers.dem_statut==="En attente RC et/ou NINEA manquants"){
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
      if(this.dem_Pers.dem_typeclientpers=="CL"){
        this.getCientById(this.dem_Pers.dem_typetitulaire);
      }else{
        this.getProspectById((this.dem_Pers.dem_typetitulaire));
      }
      
      
  }
  onGetAllDemandePhy() {
    this.demPService.getAllValideDemandePhysique()
      .subscribe((data: Dem_Pers[]) => {
        this.demandePhysiques = data.reverse();
        this.dataSource.data = data as Dem_Pers[];
        //console.log(this.demandePhysique);
      });
  }

  openPresEmmission() {

    this.router.navigateByUrl('/home/demande-Physique/liste-demande-valide');
  }
  getCientById(id) {
    this.clientService.getClient(id)
      .subscribe((data: any) => {
        this.client = data;
        //alert(JSON.stringify(this.client))
        //this.dataSource.data = data as Client[];
        //console.log(this.demandePhysique);
      });
  }
  prospect:Prospect
  getProspectById(id) {
    this.prospectService.getProspectByNumero(id)
      .subscribe((data: any) => {
        this.prospect = data as Prospect;
        /*if(this.prospect!=null){
          this.capital=this.prospect?.prospc_capitalsocial;
          this.affaire=this.prospect?.prospc_chiffreaffaireannuel
        }*/
        //alert(JSON.stringify(this.client))
        //this.dataSource.data = data as Client[];
        //console.log(this.demandePhysique);
      });
  }
  onGetAllCivilite() {
    this.civiliteService.getAllCivilite()
      .subscribe((data: Civilite[]) => {
        this.civilites = data;
      });
  }
  onGetClassification() {
    this.activiteService.getAllGroupes()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classificationSecteurs = data;
      });
  }

  onGetSecteurByCode(code: Number) {
    //console.log((this.classificationSecteurs.find(c => c.code === code))?.libelle );
    return (this.classificationSecteurs.find(c => c.code === code))?.libelle;
  }
  onGetCiviliteByCode(code: Number) {
    //console.log((this.civilites.find(c => c.civ_code === code))?.civ_libellelong ); 
    return (this.civilites.find(c => c.civ_code === code))?.civ_libellelong;
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
  open(dialog: TemplateRef<any>, demandePhy: Dem_Pers,filename) {
    //alert(JSON.stringify(demandePhy));
    //console.log(demandePhy.dem_typetitulaire);
    this.ongetFile(filename,demandePhy.dem_persnum);
    this.getCientById(demandePhy.dem_typetitulaire);
    setTimeout(() => {
      this.dialogService.open(
        dialog,
        {
          context: demandePhy,  
        });
    }, 1000);
   
  }

  openDialogParticulier(dialogModifCParticulier: TemplateRef<any>, demandePhy: Dem_Pers) {
    //alert(JSON.stringify(demandePhy));
    //console.log(demandePhy.dem_typetitulaire);
    //this.ongetFiles(demandePhy);
   // this.getCientById(demandePhy.dem_typetitulaire);
    setTimeout(() => {
      this.dialogService.open(
        dialogModifCParticulier,
        {
          context: demandePhy,  
        });
    }, 1000);
   
  }
  // dem_typetitulaire
  openClient(dialog360: TemplateRef<any>, clientId: any) {
    this.getCientById(clientId);
    setTimeout(() => {
      this.dialogService.open(
        dialog360,
        {
          context: this.client,
        });
    }, 2000);


  }


  /*
    *cette methode nous permet d'ouvrir une 
    * inserer un reassureur 
    */
  openAjout() {

    this.router.navigateByUrl('home/demande-Physique/ajout-Physique');
  }
  /*
    *cette methode nous permet d'ouvrir une 
    *boite dialogue pour modifier un reassureur     
    */
  cmt: boolean=true;
  plusieursproduit : boolean = false;
  troisproduits : boolean = false;
  openModif(demande: Dem_Pers) {
    /*if(this.dem_Pers.dem_produitdemande1==15001001){
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
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
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
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
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
    }else if(this.dem_Pers.dem_produitdemande1==15001004){
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
    else if(this.dem_Pers.dem_produitdemande1==14002001){
      if(this.checked){
        this.listedoc[0]=15;
      }else{
        this.listedoc[0]=null;
      }
      
    }else if(this.dem_Pers.dem_produitdemande1==14003001){
      this.type="FINASSUR";
      if(this.checked ){
        this.listedoc[0]=16;
      }else{
        this.listedoc[0]=null;
      }

    }else if(this.dem_Pers.dem_produitdemande1==14001001){
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
      
      
    }if(this.dem_Pers.dem_produitdemande1==16008001){
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
    if(this.dem_Pers.dem_produitdemande2==15001003){
    
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
if(this.dem_Pers.dem_produitdemande3==15001004){

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
    /*if(this.dem_Pers.dem_produitdemande2==15001004 || this.dem_Pers.dem_produitdemande3==15001004){
      
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
    if(this.dem_Pers.dem_produitdemande1==15001001){
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
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      
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
      if(this.dem_Pers.dem_produitdemande2==15001003){
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
      }else if(this.dem_Pers.dem_produitdemande2==15001004){
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
      if(this.dem_Pers.dem_produitdemande3==15001003){
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
      }else if(this.dem_Pers.dem_produitdemande3==15001004){
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

    }else if(this.dem_Pers.dem_produitdemande1==15001003){
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
      if(this.dem_Pers.dem_produitdemande2==15001002){
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
        
      }else if(this.dem_Pers.dem_produitdemande2==15001004){
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
      if(this.dem_Pers.dem_produitdemande3==15001002){
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
      }else if(this.dem_Pers.dem_produitdemande1==15001005){
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
      }else if(this.dem_Pers.dem_produitdemande3==15001004){
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

    }else if(this.dem_Pers.dem_produitdemande1==15001005){
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
    }else if(this.dem_Pers.dem_produitdemande1==15001004){
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
      if(this.dem_Pers.dem_produitdemande2==15001002){
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
      }else if(this.dem_Pers.dem_produitdemande2==15001003){
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
      if(this.dem_Pers.dem_produitdemande3==15001002){
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
      }else if(this.dem_Pers.dem_produitdemande3==15001003){
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
    else if(this.dem_Pers.dem_produitdemande1==14002001){
      if(this.checked){
        this.listedoc[0]=15;
      }else{
        this.listedoc[0]=null;
      }
      
    }else if(this.dem_Pers.dem_produitdemande1==14003001){
      this.type="FINASSUR";
      if(this.checked ){
        this.listedoc[0]=16;
      }else{
        this.listedoc[0]=null;
      }

    }else if(this.dem_Pers.dem_produitdemande1==14001001){
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
      
      
    }if(this.dem_Pers.dem_produitdemande1==16008001){
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
    /*if(this.dem_Pers.dem_produitdemande2==15001003){
    
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
    /*if(this.dem_Pers.dem_produitdemande2==15001004 || this.dem_Pers.dem_produitdemande3==15001004){
      
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
    if(this.dem_Pers.dem_produitdemande2!=0){
      this.produitdeux=true;
      this.produittroisvrai++;
      //this.obligatoire=false;
      //this.check = false;
      /*if(this.dem_Pers.dem_produitdemande3==0){
        this.plusieursproduit=false;
      }else {
        this.plusieursproduit=true;
      }*/

      //this.troisproduits=this.plusieursproduit;
      if(this.dem_Pers.dem_produitdemande3!=0 && this.produittroisvrai==2){
        this.produittrois=true;
        //this.obligatoire=false;
        //this.check = false;
        //this.plusieursproduit=false;
      }
    }
    //SUBMIT
    demande.list_document_valide = this.listedoc;
    demande.dem_commentaire = this.addForm.get("dem_commentaire").value;;
    demande.dem_commentaire2 = this.dem_commentaire2;
    demande.list_document_lu= this.dem_Pers.list_document_lu;
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
    this.demPService.update(demande).subscribe(data => {
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

  onDeleteDemande(id: number) {

    this.demPService.deleteDemande(id).subscribe((data) => {
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
      this.onGetAllDemandePhy();
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
  check_fonct(fonct: String) {

    let el = this.autorisation.findIndex(itm => itm === fonct);
    if (el === -1)
      return false;
    else
      return true;

  }
  onChechId(id: number) {

    if (id == null) {

      return 3;
    }
    if (this.demandePhysiques.find(p => p.dem_statut === "en attente" && p.dem_persnum === id)) {
      return 1;
    } else {
      return 2;
    }
  }
   filescheck : Array<any>;;
   ya
  ongetFiles(dem_persnum) {
    this.demPService.getFilesDoc(dem_persnum)
      .subscribe(data => {
        this.filenames = data as string[]
        
        //this.data = this.dem_Pers?.list_document_lu;
        //this.data.length;
        
          if(this.filenames==null){
            this.dem_Pers.list_document_lu=null;
          }
          if(this.dem_Pers.list_document_lu===null){
            this.dem_Pers.list_document_lu=[]
          }
            
          
          for(let i =0 ; i<this.filenames.length;i++){
            if(this.dem_Pers.list_document_lu.indexOf(this.filenames[i])!==-1){
              let temp = this.dem_Pers.list_document_lu.indexOf(this.filenames[i])
              let val = this.dem_Pers.list_document_lu[i];
              this.dem_Pers.list_document_lu[i]=this.filenames[i];
              this.dem_Pers.list_document_lu[temp]=val;
            }
          }
          
          for(let i =0 ; i<this.dem_Pers.list_document_lu.length;i++){
              if(this.dem_Pers.list_document_lu[i]==undefined){
                this.dem_Pers.list_document_lu[i]=''
              }
          }
          if(this.dem_Pers.list_document_lu?.length>this.filenames.length){
            let d= this.dem_Pers.list_document_lu.length;
            let l= this.filenames.length;
            while(d>l){
              this.dem_Pers.list_document_lu.pop();
              d= d-1;
            }
            
            
            console.log("this.filenames",this.filenames);
            console.log("this.dem_Pers.list_document_lu",this.dem_Pers.list_document_lu);
            //this.dem_Pers.list_document_lu =templiste;
          }
          console.log('verification',this.dem_Pers.list_document_lu)
          if(this.dem_Pers.dem_statut!="analyse de risque" && this.dem_Pers.dem_statut!="Rejeté" &&this.dem_Pers.dem_statut!="En attente dossiers manquants" && this.dem_Pers.dem_statut!="En attente RC et/ou NINEA manquants" && this.dem_Pers.dem_statut!="analyse juridique"){
            this.checked=false;
            this.toggle(false);
          }
          
            
          for(let i =0 ; i<this.filenames.length;i++){
            if(this.dem_Pers.list_document_lu?.indexOf(this.filenames[i])!==-1 && this.filenames.indexOf(this.filenames[i])!==-1){
              let temp = this.dem_Pers.list_document_lu.indexOf(this.filenames[i])
              let val = this.dem_Pers.list_document_lu[i];
              this.dem_Pers.list_document_lu[i]=this.filenames[i];
              this.dem_Pers.list_document_lu[temp]=val;
            }
                      
          }
        console.log('2h',this.filenames);
        console.log('2hh',this.dem_Pers.list_document_lu);
          //this.ngModelValue=false;

          /*if(this.dem_Pers.list_document_lu==this.filenames){
            this.check=false;
          this.ngModelValue=null;
          }*/
          if(this.analyseDeRisque){
            if(this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
              this.changeAnalyse = true;
              this.openModif1(this.dem_Pers);
            }else{
              this.changeAnalyse=false;
            }
          }  
      
      });
      
      
      //this.formater()
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
  openModif1(demande: Dem_Pers) {
    //demande.dem_commentaire = this.dem_commentaire;
    /*if (this.ngModelValue == '1') {
      demande.dem_statut = "validé pour arbitrage";
    } else if (this.ngModelValue == '2') {
      demande.dem_statut = "Rejeté";
    }*/
    //alert(demande.dem_statut);

    //this.transfertData.setData(demande);
    this.demPService.update(demande).subscribe(data => {
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
  

  ongetFile(filename: string,numDemande:any) {
    this.demPService.getFilesuri(filename,numDemande)
      .subscribe((data: string) => {
        //this.demandePhysiques = data.reverse();
        this.src = data;
        //this.dataSource.data = data as Dem_Pers[];
        //console.log(this.demandePhysique);
      });
  }
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  onClickDownload(filename: string, idDemande) {
    console.log(idDemande);

    this.demPService.downloadDoc(filename, idDemande)
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


  onExportGarantie(id) {

      // this.clientService.generateReportClient(format, title, this.demandeur)
      this.demPService.generateReportSoumission(id)

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

  onExportConditionGenerale(id:any) {

    // this.clientService.generateReportClient(format, title, this.demandeur)
    this.demPService.generateReportConditionGenerale(id)

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
onExportConditionParticuliere(id) {

  // this.clientService.generateReportClient(format, title, this.demandeur)
  this.demPService.generateReportConditionParticuliere(id)

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
onExportConditionInstruction(id) {
  this.demandeur=this.dem_Pers.dem_prenom+" "+this.dem_Pers.dem_nom;
  // this.clientService.generateReportClient(format, title, this.demandeur)
  this.demPService.generateReportInstruction(id,this.demandeur)

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

// GENRATION INSTRUCTION DEBUT
demandeur
onExportInstruction(id) {
this.demandeur=this.dem_Pers.dem_prenom+" "+this.dem_Pers.dem_nom;
  // this.clientService.generateReportClient(format, title, this.demandeur)
  this.demPService.generateReportInstruction(id,this.demandeur)

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
/// GENERATION INSTRUCTION FIN
typeinstruction
onStataicInstruction(){
  /*let data =[]
  data = [this.dem_Pers,this.client]
  this.transfertData.setData(data);
  this.router.navigateByUrl('/home/demande-Physique/instruction-static');
  //this.router.navigateByUrl('/home/demande-societe/ajout-Societe');*/
  let data=[];
      if(this.dem_Pers.dem_typeclientpers=="CL"){
        data=[this.dem_Pers,this.client]
      }else{
        data=[this.dem_Pers,this.prospect]
      }
      
      this.transfertData.setData(data);
      this.typeinstruction = this.dem_Pers.dem_produitdemande1.toString()[0]+this.dem_Pers.dem_produitdemande1.toString()[1];
      console.log("typeinstruction",this.typeinstruction);
      if(this.typeinstruction=="15"){
        this.router.navigateByUrl('/home/demande-Physique/instruction-static');
      }else if(this.typeinstruction=="14"){
        this.router.navigateByUrl('/home/demande-Physique/instruction-static-credit');
      }else if(this.typeinstruction=="16"){
        this.router.navigateByUrl('/home/demande-Physique/instruction-static-perte');
      }
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
refresh(){
  setTimeout(() => {
    this.onGetAllDemandePhy();

  }, 2000);
}
form: FormGroup;
submitted = false;
// convenience getter for easy access to form fields
get f() { return this.form.controls; }

obligatoire : boolean=false;
check:boolean=false;
checked :boolean = false;

  
  toggle(checked: boolean) {
    
    this.checked = checked;
    
    //this.plusieursproduit=true;
    //this.ongetFiles(this.dem_Pers.dem_persnum);
    if(this.dem_Pers.dem_produitdemande1==15001001){
      //this.dem_commentaire = this.dem_commentaire;
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
          this.check=true;
        this.ngModelValue="1";
        
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        // this.ngModelValue="1";
         this.plusieursproduit=true;
       }else{
        
         this.ngModelValue=null;
         this.plusieursproduit=false;
       }
    
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
       // this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }

    }if(this.dem_Pers.dem_produitdemande1==15001003){
      
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames ) ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true  && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }

      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
     
    }else if(this.dem_Pers.dem_produitdemande1==14002001){
      if(this.checked && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==14003001){
      if(this.checked && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    }else if(this.dem_Pers.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }

      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
     
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001002){
      
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }

    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkeddeux==true && this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005){
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.plusieursproduit=true;
        //this.ngModelValue="1";
      }else{
        this.plusieursproduit=false;
        this.ngModelValue=null;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }

    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }

    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
   (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
   (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
   (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                         
             
             
   (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
   (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
   (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
   
   
   (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
   (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
   
   (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
   (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  
  checkeddeux:boolean=false;
  toggledeux(checked: boolean) {
    this.checkeddeux = checked;
    
    //this.ongetFiles(this.dem_Pers.dem_persnum);
    if(this.dem_Pers.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        // this.ngModelValue="1";
         this.plusieursproduit=true;
       }else{
        
         this.ngModelValue=null;
         this.plusieursproduit=false;
       }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
   
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames ) ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
     
    }else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
     
    }else if(this.dem_Pers.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }

      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
     
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001002 ){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
      if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
          this.check=true;
          this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.check=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
          this.troisproduits=true;
          //this.ngModelValue="1";
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
      
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq  && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005){
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.plusieursproduit=true;
        //this.ngModelValue="1";
      }else{
        this.plusieursproduit=false;
        this.ngModelValue=null;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.troisproduits=true;
          this.ngModelValue=null;
          this.check=false;
          //this.plusieursproduit=true;
        }else{
          this.troisproduits=false;
          this.ngModelValue=null;
          //this.plusieursproduit=false;
        }
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        
      }

      if(
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkedtrois:boolean = false
  toggletrois(checked: boolean) {
    this.checkedtrois = checked;
    
    //this.ongetFiles(this.dem_Pers.dem_persnum);
    if(this.dem_Pers.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois  && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        // this.ngModelValue="1";
         this.plusieursproduit=true;
       }else{
        
         this.ngModelValue=null;
         this.plusieursproduit=false;
       }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false
      }
      
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true  && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
    }else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
     
    }else if(this.dem_Pers.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
     
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005){
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked && this.checkeddeux && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.plusieursproduit=true;
        //this.ngModelValue="1";
      }else{
        this.plusieursproduit=false;
        this.ngModelValue=null;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkedquatre :boolean = false
  togglequatre(checked: boolean) {
    this.checkedquatre = checked;
    
    if(this.dem_Pers.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        //this.check=false;
        //this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois&& this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames ) ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true  && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
     
    }else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
     
    }else if(this.dem_Pers.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
        this.ngModelValue=null;
      }
    }
    
    if(this.dem_Pers.dem_produitdemande1==15001003 ){
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
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq  && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkedcinq :boolean = false
  togglecinq(checked: boolean) {
    this.checkedcinq = checked;
    
    if(this.dem_Pers.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001004){
     if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames ) ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
      /*if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }*/
     
    }else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if((this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
      (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
      (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                            
                
                
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
      (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
      (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
      (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                            
                
                
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
      
      
      (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
      (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
      
      (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
      (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkedsixe:boolean=false;
  togglesixe(checked: boolean) {
    this.checkedsixe = checked;
    
    if(this.dem_Pers.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois&& this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois==true && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }/*else if(this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }
     
    }*/else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001003){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001003 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
      (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
      (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
      (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                            
                
                
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
      (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
      
      
      (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
      (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
      
      (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
      (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkedsept:boolean=false;
  togglesept(checked: boolean) {
    this.checkedsept = checked;
    
    
    if(this.dem_Pers.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
     
    }/*else if(this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }
    }*/else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    /*if(this.dem_Pers.dem_produitdemande3==15001004){
      if(this.checkedsept==true && this.checkedhuit==true  && this.filenames.length>=8  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
    }*/
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
((this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
(this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
(this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                      
          
          
(this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
(this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
(this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||


(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||

(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkedhuit : boolean=false;
  togglehuit(checked: boolean){
    this.checkedhuit = checked;
    
    
    if(this.dem_Pers.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
     
    }/*else if(this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }
     
    }*/else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    /*if(this.checkedsept==true && this.checkedhuit==true  && this.filenames.length>=8  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
      this.check=true;
      this.ngModelValue="1";
    }else{
      this.check=false;
      this.ngModelValue=null;
    }*/
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001002){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001001){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001005 && this.dem_Pers.dem_produitdemande2==15001004){
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande1==15001004 && this.dem_Pers.dem_produitdemande2==15001005){
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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

  checkedneuf : boolean=false;
  toggleneuf(checked: boolean){
    this.checkedneuf = checked;
    
    if(this.dem_Pers.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        this.ngModelValue="1";
        this.plusieursproduit=true;
      }else{
       
        this.ngModelValue=null;
        this.plusieursproduit=false;
      }
    }else if(this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.check=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
     
    }/*else if(this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
        this.ngModelValue=null;
       }
     
    }else if(this.dem_Pers.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    /*if(this.checkedsept==true && this.checkedhuit==true  && this.filenames.length>=8  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
      this.check=true;
      this.ngModelValue="1";
    }else{
      this.check=false;
      this.ngModelValue=null;
    }*/
    
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        
        //this.ngModelValue="1";
        this.troisproduits=true;
      }else{
       
        this.ngModelValue=null;
        this.troisproduits=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
       // this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005) || 
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) ||
        
        
        
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002))
      {

        if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkeddix : boolean=false;
  toggledix(checked: boolean){
    this.checkeddix = checked;
    
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
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
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkedonze : boolean=false;
  toggleonze(checked: boolean){
    this.checkedonze = checked;
    
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedsixe && this.checkedsept && this.checkedhuit && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001002){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001003){
      if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames )){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande3==15001003){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.troisproduits=true;
        //this.ngModelValue="1";
        //this.plusieursproduit=true;
      }else{
        this.troisproduits=false;
        this.ngModelValue=null;
        //this.plusieursproduit=false;
      }
    }
    if(this.dem_Pers.dem_produitdemande1==15001002 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande3==15001005){
      if(this.checkedsept && this.checkedhuit && this.checkedneuf && this.filenames.length>=9 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checkedquatre && this.checkedcinq && this.checkedsixe  && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004)     || 
                          
              
              
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004)|| 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001004) || 
    (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004) ||
    
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001004) ||
    (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001004))
      {

        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedsixe && this.checkedsept && this.checkedhuit  && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) || 
        (this.dem_Pers.dem_produitdemande3==15001001 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005)         || 
                            
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001005 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001003) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001002 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005) ||
                              
                              
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001003 && this.dem_Pers.dem_produitdemande2==15001004 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedneuf && this.checkeddix && this.checkedonze && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checkedquatre && this.checkedcinq && this.filenames.length>=5  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001003) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001001 && this.dem_Pers.dem_produitdemande1==15001005)      || 


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001001) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001002) || 
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001005 && this.dem_Pers.dem_produitdemande1==15001003) ||
        
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001002 && this.dem_Pers.dem_produitdemande1==15001005) ||


        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001001) ||
        (this.dem_Pers.dem_produitdemande3==15001004 && this.dem_Pers.dem_produitdemande2==15001003 && this.dem_Pers.dem_produitdemande1==15001005))
      {
        if(this.checkedsept && this.checkedhuit && this.filenames.length>=8 && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
          this.check=true;
          this.ngModelValue="1";
        }else{
          this.check=false;
          this.ngModelValue=null; 
        }
        if(this.checkedquatre && this.checkedcinq && this.checkedsixe && this.filenames.length>=6  && this.arraysIdentical(this.dem_Pers.list_document_lu,this.filenames)){
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
  checkedtreize : boolean=false;
  toggletreize(checked: boolean){
    this.checkedtreize = checked;
  }
  displayButtonUpload:boolean=false;
  openAjoutUpLoad() {
    this.displayButtonUpload =true;
  }
  selectedFile = null;
  taille:boolean=false;
  onFileSelected(event) {
    this.selectedFile = event.target.files;
    if(this.nb_document<this.selectedFile.length+this.filenames.length)
      this.taille=false;
    else 
    this.taille=true;
    console.log(this.selectedFile);
  }
  
  files: File[]
  onClickUpload(idDemande) {
    this.changeAnalyse=false;
    //this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for (const file of this.files) {
      form.append('files', file, file.name);
    }

    this.demPService.uploadDoc(form, idDemande)
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
  progress: number = 0;
  displayprogress: boolean = false;
  onClickDelete(filename: string,idDemande) {
    this.demPService.deleteFileDoc(filename, idDemande)
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
              //console.log('avant',this.data);
              this.ongetFiles(idDemande);
              
              //console.log('apres',this.data);
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

  openArcitrage(demande: Dem_Pers) {

    this.transfertData.setData(demande);
    console.log(demande);
    this.router.navigateByUrl('/home/demande-Physique');

  }
  close(){
    this.onGetAllDemandePhy();
    this.router.navigateByUrl('/home/demande-Physique');
  }
  
  listedoc : number []=[];
  
  bonneexecution :boolean = false;
  produitdeux : boolean=false;
  produittrois : boolean=false;
  produittroisvrai=0;
  submit(demande:Dem_Pers){
    
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
    if(this.dem_Pers.dem_produitdemande1==15001001){
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
    }else if(this.dem_Pers.dem_produitdemande1==15001002){
      
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
      if(this.dem_Pers.dem_produitdemande2==15001003){
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
      }else if(this.dem_Pers.dem_produitdemande2==15001004){
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
      if(this.dem_Pers.dem_produitdemande3==15001003){
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
      }else if(this.dem_Pers.dem_produitdemande3==15001004){
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

    }else if(this.dem_Pers.dem_produitdemande1==15001003){
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
      if(this.dem_Pers.dem_produitdemande2==15001002){
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
        
      }else if(this.dem_Pers.dem_produitdemande2==15001004){
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
      if(this.dem_Pers.dem_produitdemande3==15001002){
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
      }else if(this.dem_Pers.dem_produitdemande3==15001004){
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

    }else if(this.dem_Pers.dem_produitdemande1==15001004){
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
      if(this.dem_Pers.dem_produitdemande2==15001002){
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
      }else if(this.dem_Pers.dem_produitdemande2==15001003){
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
      if(this.dem_Pers.dem_produitdemande3==15001002){
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
      }else if(this.dem_Pers.dem_produitdemande3==15001003){
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
    else if(this.dem_Pers.dem_produitdemande1==14002001){
      if(this.checked){
        this.listedoc[0]=15;
      }else{
        this.listedoc[0]=null;
      }
      
    }else if(this.dem_Pers.dem_produitdemande1==14003001){
      this.type="FINASSUR";
      if(this.checked ){
        this.listedoc[0]=16;
      }else{
        this.listedoc[0]=null;
      }

    }else if(this.dem_Pers.dem_produitdemande1==14001001){
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
      
      
    }if(this.dem_Pers.dem_produitdemande1==16008001){
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
    /*if(this.dem_Pers.dem_produitdemande2==15001003){
    
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
    /*if(this.dem_Pers.dem_produitdemande2==15001004 || this.dem_Pers.dem_produitdemande3==15001004){
      
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
    if(this.dem_Pers.dem_produitdemande2!=0){
      this.produitdeux=true;
      this.produittroisvrai++;
      //this.obligatoire=false;
      //this.check = false;
      /*if(this.dem_Pers.dem_produitdemande3==0){
        this.plusieursproduit=false;
      }else {
        this.plusieursproduit=true;
      }*/

      //this.troisproduits=this.plusieursproduit;
      if(this.dem_Pers.dem_produitdemande3!=0 && this.produittroisvrai==2){
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
    console.log("adama",this.data);
    //this.ongetFiles(demande.dem_persnum);
    demande.list_document_valide = this.listedoc; 
    console.log("liste docs valides",this.listedoc);
    demande.list_document_lu= this.dem_Pers.list_document_lu;
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
  retenuegarantie:boolean=false
  retenue:boolean=false;
  bonneExecution(demande:Dem_Pers){
   
    if(this.dem_Pers.dem_produitdemande2==15001003){
    
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
    //this.check=false;
    //this.obligatoire=false;
    
    this.retenuegarantie=true;
    this.retenue = this.retenuegarantie;
    //this.check=false;
    console.log('check',this.check);
      console.log('obligatoire',this.obligatoire);
      this.ngModelValue=null;
  
}
  //Retenue de garantie produit 2 ou 3
  /*if(this.dem_Pers.dem_produitdemande2==15001004 || this.dem_Pers.dem_produitdemande3==15001004){
    
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
  console.log("adama",this.data);
  //this.ongetFiles(demande.dem_persnum);
  demande.list_document_valide = this.listedoc; 
  console.log("liste docs valides",this.listedoc);
  demande.list_document_lu= this.dem_Pers.list_document_lu;
  console.log("liste docs lus",demande.list_document_lu);
  this.demPService.update(demande).subscribe(data => {
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
  retenueGarantie(demande:Dem_Pers){
    if(this.dem_Pers.dem_produitdemande3==15001004){
    
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
  /*if(this.dem_Pers.dem_produitdemande2==15001004 || this.dem_Pers.dem_produitdemande3==15001004){
    
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
  console.log("adama",this.data);
  //this.ongetFiles(demande.dem_persnum);
  demande.list_document_valide = this.listedoc; 
  console.log("liste docs valides",this.listedoc);
  demande.list_document_lu= this.dem_Pers.list_document_lu;
  console.log("liste docs lus",demande.list_document_lu);
  this.demPService.update(demande).subscribe(data => {
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
  
  avanceDemarrage(demande:Dem_Pers){
    
  }
  submit1(demande:Dem_Pers){
    console.log(this.listedoc);
  }
  teste(event){
    console.log(event.target.value);
  }

  openpdf(filename,idDemande) {
    
    let i = this.filenames.indexOf(filename);
    //this.dem_Pers.list_document_lu[i]=filename;
    this.dem_Pers.filenames=this.filenames;
  let test = this.dem_Pers.list_document_lu===this.filenames;
    console.log('list',this.dem_Pers.list_document_lu);
    console.log('file',this.filenames);
    console.log("3h",test);
    this.demPService.downloadInDossier(filename,idDemande)
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
            let data=[event.body,this.dem_Pers,filename,i]
            let data2 =[this.produitdeux,this.produittrois,this.produittroisvrai,this.check,this.ngModelValue]
            this.transfertData2.setData(data2);
            //this.transfertData.setData(event.body);
            this.transfertData.setData(data);
            this.router.navigateByUrl("/home/voirpdf");
            //this.dialogService.open(ViewPdfComponent, { hasScroll:true });
  
            
        }
      });
    
  
  
  }
  website: FormArray;
  form1: FormGroup;
  
  
  nb_document : number;
  onCheckboxChange(e) {
    this.website  = this.form1.get('website') as FormArray;
  
    if (e.target.checked) {
      this.website.push(new FormControl(e.target.value));
    } else {
       const index = this.website.controls.findIndex(x => x.value === e.target.value);
       this.website.removeAt(index);
    }
    //this.data=this.website.value;
    
  }
  submit2() {
    
    console.log(this.form1.value);
    console.log(this.website.value);
  }
  
  griser_upload(filenames){
    if(this.nb_document<filenames.length)
      return false;
    else 
      return true;
  }
  thecontents=""
  value=false;
  textar=null
  dosomething(value) {
    this.dem_commentaire = value
      console.log(this.dem_commentaire);
    
    //console.log(value);
  }
  addForm = this.fb.group({

    
    dem_commentaire: ['', [Validators.required]]
    
    
    

  });
  body
  erreur
  onFocusOutEventBody() {
    this.dem_commentaire = this.addForm.get("dem_commentaire").value;
    if (this.addForm.controls['dem_commentaire'].valid == false) {
      
      
    } else {
      
      
    }
  }
  onChangebody(event) {
    console.log(event); 
    //this.dem_commentaire = event;
  }

  onActe(){
    let data=[];
    if(this.dem_Pers.dem_typetitulaire=="CL"){
      data=[this.dem_Pers,this.client]
    }else{
      data=[this.dem_Pers,this.prospect]
    }
    
    this.transfertData.setData(data);
    this.typeinstruction = this.dem_Pers.dem_produitdemande1.toString()[0]+this.dem_Pers.dem_produitdemande1.toString()[1];
    console.log("typeinstruction",this.typeinstruction);
    if(this.typeinstruction=="15"){
      this.router.navigateByUrl('/home/demande-Physique/caution-acte');
    }else if(this.typeinstruction=="14"){
      if(this.dem_Pers.dem_produitdemande1==14003001)
        this.router.navigateByUrl('/home/demande-Physique/credit-acte');
    }else if(this.typeinstruction=="16"){
      this.router.navigateByUrl('/home/demande-Physique/perte-acte');
    }
    
    //this.router.navigateByUrl('/home/demande-societe/ajout-Societe');
  }


}

