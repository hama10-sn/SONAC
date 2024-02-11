import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbComponentStatus, NbDialogService, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { Civilite } from '../../../../model/Civilite';
import { ClassificationSecteur } from '../../../../model/ClassificationSecteur';
import { Client } from '../../../../model/Client';
import { CiviliteService } from '../../../../services/civilite.service';
import { ClassificationSecteurService } from '../../../../services/classification-secteur.service';
import { ClientService } from '../../../../services/client.service';
import { TransfertDataService } from '../../../../services/transfertData.service';
import { saveAs } from 'file-saver';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Dem_Soc } from '../../../../model/Dem_Soc';
import { DemandesocieteService } from '../../../../services/demandesociete.service';
@Component({
  selector: 'ngx-cocherdoc-societe',
  templateUrl: './cocherdoc-societe.component.html',
  styleUrls: ['./cocherdoc-societe.component.scss']
})
export class CocherdocSocieteComponent implements OnInit {

  dem_Socs : Dem_Soc;
  analyseDeRisque = false;
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

  demandeSocietes: Array<Dem_Soc> = new Array<Dem_Soc>();
  demandeSociete: Dem_Soc;
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
  public dataSource = new MatTableDataSource<Dem_Soc>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autorisation = [];
  message: any;
  constructor(private demService: DemandesocieteService, private transfertData: TransfertDataService,
    private dialogService: NbDialogService, private civiliteService: CiviliteService,
    private authService: NbAuthService, private router: Router, private fb: FormBuilder, 
    private clientService: ClientService,
    private activiteService: ClassificationSecteurService, private toastrService: NbToastrService) { 

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
  ngOnInit(): void {
    
  
    this.dem_Socs =  this.transfertData.getData()
    console.log('mbengue',this.dem_Socs?.list_document_valide);
    if(this.dem_Socs.dem_statut)
      if(this.dem_Socs.dem_statut==="analyse de risque"){
        this.analyseDeRisque=true;
      }
    
    
    //this.data = [];
    //this.data = this.dem_Socs.list_document_lu;
    console.log('tailledoclu',this.filenames);
    this.filenames = this.dem_Socs.filenames;
    this.ongetFiles(this.dem_Socs?.dem_socnum)
    
    console.log('tailledoclu',this.filenames);
    
    console.log('tailledoclu',this.dem_Socs.list_document_lu)
    console.log('4h',this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames))
    //console.log("test",this.dem_Socs.dem_commentaire);
    this.type="Ouverture compte";
    //this.dem_commentaire = this.dem_Socs?.dem_commentaire;
    //if(this.dem_Socs.list_document_valide!=null){
      /* if(this.dem_Socs.dem_produitdemande1==15001001){
        this.type="caution de soumission";
        this.nb_document=3;
        if(this.dem_Socs?.list_document_valide[0]==1){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Socs?.list_document_valide[1]==2){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Socs?.list_document_valide[2]==3){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Socs.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
       
      } *//* else if(this.dem_Socs.dem_produitdemande1==15001002){
        this.type="caution d'avance de démarrage";
        if(this.dem_Socs?.list_document_valide[0]==4){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Socs?.list_document_valide[1]==5){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Socs?.list_document_valide[2]==6){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois){
          
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Socs.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
 
        
      } *//* else if(this.dem_Socs.dem_produitdemande1==15001003){
        this.type="caution de bonne execution";
        if(this.dem_Socs?.list_document_valide[0]==7){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Socs?.list_document_valide[1]==8){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Socs?.list_document_valide[2]==9){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Socs.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
       
      } *//* else if(this.dem_Socs.dem_produitdemande1==15001004){
        this.type="caution de retenue de garantie";
        if(this.dem_Socs?.list_document_valide[0]==10){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Socs?.list_document_valide[1]==11){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Socs?.list_document_valide[2]==12){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        if(this.dem_Socs?.list_document_valide[3]==13){
          this.checkedquatre=true;
        }else{
          this.checkedquatre=false
        }
        if(this.dem_Socs?.list_document_valide[4]==14){
          this.checkedcinq=true;
        }else{
          this.checkedcinq=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Socs.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
          this.obligatoire=true;
          this.ngModelValue="1";
         }else{
          this.obligatoire = false;
         }
       
      } *//* else if(this.dem_Socs.dem_produitdemande1==14002001){
        this.type="KAP’GARANTI EXPORT";
        if(this.dem_Socs?.list_document_valide[0]==15){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.checked==true){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Socs.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
       
      } */
      /* else if(this.dem_Socs.dem_produitdemande1==14003001){
        this.type="KAP’GARANTI DOMESTIQUE";
        if(this.dem_Socs?.list_document_valide[0]==16){
          this.checked=true
        }else{
          this.checked=false;
        }
        
        if(this.checked){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Socs.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
       
      } */
      /* else if(this.dem_Socs.dem_produitdemande1==14001001){
        
        if(this.dem_Socs?.list_document_valide[0]==17){
          this.checkedhuit = true;
        } else if(this.dem_Socs?.list_document_valide[0]==18){
          this.checkedneuf = true;
          if(this.dem_Socs?.list_document_valide[1]==19){
            this.checked=true
          }else{
            this.checked=false;
          }
          if(this.dem_Socs?.list_document_valide[2]==20){
            this.checkeddeux=true;
          }else{
            this.checkeddeux=false
          }
          if(this.dem_Socs?.list_document_valide[3]==21){
            this.checkedtrois=true;
          }else{
            this.checkedtrois=false
          }
          if(this.dem_Socs?.list_document_valide[4]==22){
            this.checkedquatre=true;
          }else{
            this.checkedquatre=false
          }
          if(this.dem_Socs?.list_document_valide[5]==23){
            this.checkedcinq=true;
          }else{
            this.checkedcinq=false
          }
          if(this.dem_Socs?.list_document_valide[6]==24){
            this.checkedsixe=true;
          }else{
            this.checkedsixe=false
          }
          if(this.dem_Socs?.list_document_valide[7]==25){
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
          }else if(this.dem_Socs.dem_statut=="Rejeté"){
            this.check=false;
            this.ngModelValue="2";
          }else{
            this.check=false;
          this.ngModelValue=null;
          }
        }
        
       
      } *//* if(this.dem_Socs.dem_produitdemande1==16008001){
        if(this.dem_Socs?.list_document_valide[0]==26){
          this.checked=true
        }else{
          this.checked=false;
        }
        if(this.dem_Socs?.list_document_valide[1]==27){
          this.checkeddeux=true;
        }else{
          this.checkeddeux=false
        }
        if(this.dem_Socs?.list_document_valide[2]==28){
          this.checkedtrois=true;
        }else{
          this.checkedtrois=false
        }
        if(this.dem_Socs?.list_document_valide[3]==29){
          this.checkedquatre=true;
        }else{
          this.checkedquatre=false
        }
        
        if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
          this.check=true;
          this.ngModelValue="1";
        }else if(this.dem_Socs.dem_statut=="Rejeté"){
          this.check=false;
          this.ngModelValue="2";
        }else{
          this.check=false;
          this.ngModelValue=null;
        }
        if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
          this.obligatoire=true;
          this.ngModelValue="1";
        }else{
          this.obligatoire=false;
        }
      
     
    } */if(this.dem_Socs.dem_statut==this.type){
      if(this.dem_Socs?.list_document_valide[0]==30){
        this.checked=true
      }else{
        this.checked=false;
      }
      if(this.dem_Socs?.list_document_valide[1]==31){
        this.checkeddeux=true;
      }else{
        this.checkeddeux=false
      }
      if(this.dem_Socs?.list_document_valide[2]==32){
        this.checkedtrois=true;
      }else{
        this.checkedtrois=false
      }
      if(this.dem_Socs?.list_document_valide[3]==33){
        this.checkedquatre=true;
      }else{
        this.checkedquatre=false
      }
      
      /* if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.dem_Pers.dem_statut=="Rejeté"){
        this.check=false;
        this.ngModelValue="2";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
      }
     */
   
  }
    
    
  
     
      
      this.form = this.fb.group({
        acceptTerms: [false, Validators.requiredTrue],
        acceptTerms1: [false, Validators.requiredTrue]
    });
   
   
  //console.log(this.dem_Socs);
  //console.log(this.dem_Socs.dem_persnum);
    this.onGetAllCivilite();
    this.onGetClassification();
    this.onGetAllDemandePhy();
    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.autorisation = token.getPayload().fonctionnalite.split(',');
          console.log(this.autorisation);
        }
      });
      
      
  }
  onGetAllDemandePhy() {
    this.demService.getAllDemandeSociete()
      .subscribe((data: Dem_Soc[]) => {
        this.demandeSocietes = data.reverse();
        this.dataSource.data = data as Dem_Soc[];
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
  open(dialog: TemplateRef<any>, demandePhy: Dem_Soc,filename) {
    //alert(JSON.stringify(demandePhy));
    //console.log(demandePhy.dem_typetitulaire);
    this.ongetFile(filename,demandePhy.dem_socnum);
    this.getCientById(demandePhy.dem_typetitulaire);
    setTimeout(() => {
      this.dialogService.open(
        dialog,
        {
          context: demandePhy,  
        });
    }, 1000);
   
  }

  openDialogParticulier(dialogModifCParticulier: TemplateRef<any>, demandePhy: Dem_Soc) {
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
  openModif(demande: Dem_Soc) {
    /* if(this.dem_Socs.dem_produitdemande1==15001001){
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
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
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
    } */
    /* else if(this.dem_Socs.dem_produitdemande1==15001003){
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
    } else*/ 
      if(this.checked){
        this.listedoc[0]=30;
      }else{
        this.listedoc[0]=null;
      }
      if(this.checkeddeux){
        this.listedoc[1]=31;
      }else{
        this.listedoc[1]= null;
      }
      if(this.checkedtrois){
        this.listedoc[2]=32;
      }else{
        this.listedoc[2]=null;
      }
      if(this.checkedquatre){
        this.listedoc[3]=33;
      }else{
        this.listedoc[3]=null;
      }
      if(this.checkedcinq){
        this.listedoc[4]=34;
      }else{
        this.listedoc[4]=null;
      }if(this.checkedcinq){
        this.listedoc[5]=35;
      }else{
        this.listedoc[5]=null;
      }if(this.checkedcinq){
        this.listedoc[6]=36;
      }else{
        this.listedoc[6]=null;
      }
    /* 
    else if(this.dem_Socs.dem_produitdemande1==14002001){
      if(this.checked){
        this.listedoc[0]=15;
      }else{
        this.listedoc[0]=null;
      }
      
    }else if(this.dem_Socs.dem_produitdemande1==14003001){
      this.type="FINASSUR";
      if(this.checked ){
        this.listedoc[0]=16;
      }else{
        this.listedoc[0]=null;
      }

    } *//* else if(this.dem_Socs.dem_produitdemande1==14001001){
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
          this.listedoc[4]=22;
        }else{
          this.listedoc[4]=null;
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
      
      
    } *//* if(this.dem_Socs.dem_produitdemande1==16008001){
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
    } */
    console.log(this.listedoc);
    demande.list_document_valide = this.listedoc;
    demande.dem_commentaire1 = this.dem_commentaire;
    demande.dem_commentaire2 = this.dem_commentaire2;
    demande.list_document_lu= this.dem_Socs.list_document_lu;
    /* if (this.ngModelValue == '1') {
      demande.dem_statut = "analyse de risque";
    } else if (this.ngModelValue == '2') {
      demande.dem_statut = "Rejeté";
    } */
    //alert(demande.dem_statut);

    //this.transfertData.setData(demande);
    this.demService.update(demande).subscribe(data => {
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
/* 
  onDeleteDemande(id: number) {

    this.demService.deleteDemande(id).subscribe((data) => {
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
  } */
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
    if (this.demandeSocietes.find(p => p.dem_statut === "en attente" && p.dem_socnum === id)) {
      return 1;
    } else {
      return 2;
    }
  }
   filescheck : Array<any>;;
   ya
  ongetFiles(dem_persnum) {
    this.demService.getFilesDoc(dem_persnum)
      .subscribe(data => {
        this.filenames = data as string[]
        
        //this.data = this.dem_Socs?.list_document_lu;
        //this.data.length;
        
        if(this.filenames==null){
          this.dem_Socs.list_document_lu=null;
        }
          if(this.dem_Socs.list_document_lu===null)
            this.dem_Socs.list_document_lu=[]
          
          for(let i =0;i<this.filenames.length;i++){
            if(this.dem_Socs.list_document_lu?.indexOf(this.filenames[i])!==-1){
              this.dem_Socs.list_document_lu[i]=this.filenames[i];
              
            }else{
              this.dem_Socs.list_document_lu[i]="";
            }
            
          }
          if(this.dem_Socs.list_document_lu?.length>this.filenames.length){
            let d= this.dem_Socs.list_document_lu.length;
            let l= this.filenames.length;
            while(d>l){
              this.dem_Socs.list_document_lu.pop();
              d= d-1;
            }
            
          }
          console.log('verification',this.dem_Socs.list_document_lu)
          if(this.dem_Socs.dem_statut!="analyse de risque" && this.dem_Socs.dem_statut!="Rejeté"){
            this.checked=false;
            this.toggle(false);
          }
          
          console.log('2h',this.filenames);
        console.log('2hh',this.filenames);
          //this.ngModelValue=false;

          /*if(this.dem_Socs.list_document_lu==this.filenames){
            this.check=false;
          this.ngModelValue=null;
          }*/
          
      
      });
  }

  ongetFile(filename: string,numDemande:any) {
    this.demService.getFilesuri(filename,numDemande)
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

    this.demService.downloadDoc(filename, idDemande)
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
      this.demService.generateReportSoumission(id)

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
    this.demService.generateReportConditionGenerale(id)

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
  this.demService.generateReportConditionParticuliere(id)

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

  
  toggle(checked: boolean) {/* 
    
    this.checked = checked;
     if(this.dem_Socs.dem_produitdemande1==15001001){
     
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        
          this.check=true;
        this.ngModelValue="1";
        
        
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }

    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }

      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
       }
     
    }else if(this.dem_Socs.dem_produitdemande1==14002001){
      if(this.checked && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14003001){
      if(this.checked && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
    }else if(this.dem_Socs.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.filenames.length>=4 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }

      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
      }
     
    }
     */
    
    this.checked = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }
  }
  
  checkeddeux:boolean=false;
  toggledeux(checked: boolean) {
    this.checkeddeux = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }
   /*  
    if(this.dem_Socs.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
   
    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked  && this.checkeddeux && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
       }else{
        this.obligatoire = false;
       }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
     
    }else if(this.dem_Socs.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }

      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
      }
     
    } */


  }
  checkedtrois:boolean = false
  toggletrois(checked: boolean) {
    this.checkedtrois = checked;
    this.checkedtrois = checked;
    if(this.checked==true && this.checkeddeux==true && this.checkedtrois==true){
      this.check=true;
    }else{
      this.check=false;
    }
    /* if(this.dem_Socs.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois  && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
      
     
    }else if(this.dem_Socs.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
      }
     
    } */

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
    

  } /* 
  checkedquatre :boolean = false
  togglequatre(checked: boolean) {
    this.checkedquatre = checked;
    if(this.dem_Socs.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois&& this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
      
     
    }else if(this.dem_Socs.dem_produitdemande1==16008001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
      if(this.checked==true && this.checkeddeux==true && this.filenames.length>=2  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.obligatoire=true;
        this.ngModelValue="1";
      }else{
        this.obligatoire=false;
      }
    }
  }
  checkedcinq :boolean = false
  togglecinq(checked: boolean) {
    this.checkedcinq = checked;
    if(this.dem_Socs.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
      
     
    }
  }
  checkedsixe:boolean=false;
  togglesixe(checked: boolean) {
    this.checkedsixe = checked;
    if(this.dem_Socs.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois&& this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
    
  }
  checkedsept:boolean=false;
  togglesept(checked: boolean) {
    this.checkedsept = checked;
    if(this.dem_Socs.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
  } 
  checkedhuit : boolean=false;
  togglehuit(checked: boolean){
    this.checkedhuit = checked;
    if(this.dem_Socs.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
  }

  checkedneuf : boolean=false;
  toggleneuf(checked: boolean){
    this.checkedneuf = checked;
    if(this.dem_Socs.dem_produitdemande1==15001001){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 &&this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001002){
      if(this.checked==true && this.checkeddeux==true && this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001003){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.filenames.length>=3 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames )){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==15001004){
      if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq ){
        this.check=true;
        this.ngModelValue="1";
      }else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }else if(this.dem_Socs.dem_produitdemande1==14001001){
      if(this.checkedhuit && this.filenames.length>=1  && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }else if(this.checked==true && this.checkeddeux==true &&this.checkedtrois && this.checkedquatre && this.checkedcinq && this.checkedsixe && this.checkedsept &&  this.checkedneuf && this.filenames.length>=7 && this.arraysIdentical(this.dem_Socs.list_document_lu,this.filenames)){
        this.check=true;
        this.ngModelValue="1";
      }
      else{
        this.check=false;
        this.ngModelValue=null;
      }
     
    }
  }*/
  cas
  
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
    this.displayprogress = true;
    this.files = this.selectedFile;
    const form = new FormData();
    for (const file of this.files) {
      form.append('files', file, file.name);
    }

    this.demService.uploadDoc(form, idDemande)
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
    this.demService.deleteFileDoc(filename, idDemande)
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

  openArcitrage(demande: Dem_Soc) {

    this.transfertData.setData(demande);
    console.log(demande);
    this.router.navigateByUrl('/home/demande-Physique');

  }
  close(){
    this.onGetAllDemandePhy();
    this.router.navigateByUrl('/home/demande-Physique');
  }
  
  listedoc : number []=[];
  submit(demande:Dem_Soc){
    
    console.log("adama",this.data);
    this.ongetFiles(demande.dem_socnum);
    demande.list_document_valide = this.listedoc; 
    demande.list_document_lu= this.dem_Socs.list_document_lu;
    console.log("adama",demande.list_document_lu);
    this.demService.update(demande).subscribe(data => {
    
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
        console.log(demande.list_document_valide);
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
  submit1(demande:Dem_Soc){
    console.log(this.listedoc);
  }
  teste(event){
    console.log(event.target.value);
  }

  openpdf(filename,idDemande) {
    
    let i = this.filenames.indexOf(filename);
    //this.dem_Socs.list_document_lu[i]=filename;
    this.dem_Socs.filenames=this.filenames;
  let test = this.dem_Socs.list_document_lu===this.filenames;
    console.log('list',this.dem_Socs.list_document_lu);
    console.log('file',this.filenames);
    console.log("3h",test);
    this.demService.downloadInDossier(filename,idDemande)
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
            let data=[event.body,this.dem_Socs,filename,i]
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
      
      this.check = false
    } else {
      
      this.check = true;
    }
  }
  onChangebody(event) {
    console.log(event); 
  }
}
