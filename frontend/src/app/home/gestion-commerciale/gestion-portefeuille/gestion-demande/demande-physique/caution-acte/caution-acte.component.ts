import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Dem_Pers } from '../../../../../../model/dem_Pers';
import { TransfertDataService } from '../../../../../../services/transfertData.service';
import { saveAs } from 'file-saver';

import type from '../../../../../data/type.json'
import dateFormatter from 'date-format-conversion';
import { DatePipe } from '@angular/common';
import { DemandephysiqueService } from '../../../../../../services/demandephysique.service';
import { HttpEventType } from '@angular/common/http';
import { Client } from '../../../../../../model/Client';
import { Router } from '@angular/router';
import { ClientService } from '../../../../../../services/client.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { ReferenceTech } from '../../../../../../model/ReferenceTech';
import { User } from '../../../../../../model/User';
import { UserService } from '../../../../../../services/user.service';
import { PoliceService } from '../../../../../../services/police.service';
import { Police } from '../../../../../../model/Police';
import { EngagementService } from '../../../../../../services/engagement.service';
import { Engagement } from '../../../../../../model/Engagement';
import { MainLeveService } from '../../../../../../services/main-leve.service';
import { MainLeve } from '../../../../../../model/MainLeve';
import { QuittanceService } from '../../../../../../services/quittance.service';
import { Quittance } from '../../../../../../model/Quittance';
import { isThisWeek } from 'date-fns';
import { FormatNumberService } from '../../../../../../services/formatNumber.service';
import { ProduitService } from '../../../../../../services/produit.service';
import { Produit } from '../../../../../../model/Produit';
import { Locataire } from '../../../../../../model/Locataire';
import { AcheteurService } from '../../../../../../services/acheteur.service';
import { Acheteur } from '../../../../../../model/Acheteur';
import { InstructionService } from '../../../../../../services/instruction.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { TransfertData2Service } from '../../../../../../services/transfert-data2.service';
import { Instruction } from '../../../../../../model/Instruction';
import { ProspectService } from '../../../../../../services/prospect.service';
import { Prospect } from '../../../../../../model/Prospect';
import { ActeArbitrageService } from '../../../../../../services/acte-arbitrage.service';
import { ActeArbitrage } from '../../../../../../model/Acte_arbitrage';

@Component({
  selector: 'ngx-caution-acte',
  templateUrl: './caution-acte.component.html',
  styleUrls: ['./caution-acte.component.scss']
})
export class CautionActeComponent implements OnInit {

 demandePhysique: Dem_Pers;
  client: Client;
  prospect : Prospect;
  autorisation = [];
  numInstruction:number;

  constructor(private fb: FormBuilder,private transfertData: TransfertDataService,private demPhysiqueService:DemandephysiqueService,
    private datePipe: DatePipe,private router: Router,private clientService: ClientService,private authService: NbAuthService,
    private userService: UserService,private policeService:PoliceService,private engagementService:EngagementService,
    private mainLeveService : MainLeveService,private quittanceService : QuittanceService,private formatNumberService: FormatNumberService,
    private produitService : ProduitService, private acheteurService : AcheteurService,
    private instructionService:InstructionService,private toastrService: NbToastrService,private transfertData2: TransfertData2Service,
    private prospectService:ProspectService,private acteArbitrageService :ActeArbitrageService

    ) { }
  
  ngOnInit(): void {

    let data =[]
    data=this.transfertData.getData()
    if(data!=null){
      this.demandePhysique = data[0];
      this.montant_demande = this.formatNumer( this.demandePhysique.dem_montant);
      this.montant1 = this.formatNumer( this.demandePhysique.dem_montant);
      if(this.demandePhysique.dem_produitdemande2!=0){
        this.montant2 = this.formatNumer( this.demandePhysique.dem_montant2);
      }
      if(this.demandePhysique.dem_produitdemande3!=0) {
        this.montant3 = this.formatNumer( this.demandePhysique.dem_montant3);
      }     
      this.montant_lettre = this.demandePhysique.dem_montant
      if(this.demandePhysique.dem_typeclientpers=="CL"){
        this.getCientById(this.demandePhysique.dem_typetitulaire)
        console.log("client",this.demandePhysique.dem_typetitulaire);
        

      }else{
        this.getProspectById(this.demandePhysique.dem_typetitulaire);
      }
     
      //this.client=data[1];
      console.log('demande',this.demandePhysique);
      //console.log('client',this.client);
      this.title = "Ajout informations Acte"
    }else{
      let data=[]
      data = this.transfertData2.getData()
      this.demandePhysique =  data[0];
      this.numInstruction = data[1];
      if(this.demandePhysique.dem_typetitulaire=="CL"){
        
      }else{
        
      }
      
      console.log("instruction,",this.numInstruction)
      
      this.haveInstruction=true;
      this.title="Modification instruction"
    }
    
    if(this.demandePhysique.dem_produitdemande1==15001001){
      this.produit1="SOUMISSION";
      this.controlesForm=!this.addForm2.valid
    }else if(this.demandePhysique.dem_produitdemande1==15001002){
      this.produit1="AVANCE DE DEMARRAGE";
      this.controlesForm=!this.addForm.valid
    }else if(this.demandePhysique.dem_produitdemande1==15001003){
      this.produit1="BONNE EXECUTION";
      this.controlesForm=!this.addForm4.valid
    }else if(this.demandePhysique.dem_produitdemande1==15001004){
      this.produit1="RETENUE DE GARANTIE";
      this.controlesForm=!this.addForm5.valid
    }else if(this.demandePhysique.dem_produitdemande1==15001005){
      this.produit1="DEFINITIVE"
      this.controlesForm=!this.addForm3.valid
    }
    if(this.demandePhysique.dem_produitdemande2!=0){
      this.produit2Existe=true;
      if(this.demandePhysique.dem_produitdemande2==15001001){
        this.produit2="SOUMISSION";
        this.controlesForm=this.controlesForm ||!this.addForm2.valid
      }else if(this.demandePhysique.dem_produitdemande2==15001002){
        this.produit2="AVANCE DE DEMARRAGE";
        this.controlesForm=this.controlesForm ||!this.addForm.valid
      }else if(this.demandePhysique.dem_produitdemande2==15001003){
        this.produit2="BONNE EXECUTION";
        this.controlesForm=this.controlesForm ||!this.addForm4.valid
      }else if(this.demandePhysique.dem_produitdemande2==15001004){
        this.produit2="RETENUE DE GARANTIE";
        this.controlesForm=this.controlesForm ||!this.addForm5.valid
      }else if(this.demandePhysique.dem_produitdemande2==15001005){
        this.produit2="DEFINITIVE"
        this.controlesForm=this.controlesForm ||!this.addForm3.valid
      }
    }
    if(this.demandePhysique.dem_produitdemande3!=0){
      this.produit3Existe=true;
      if(this.demandePhysique.dem_produitdemande3==15001001){
        this.produit3="SOUMISSION";
        this.controlesForm=this.controlesForm ||!this.addForm2.valid
      }else if(this.demandePhysique.dem_produitdemande3==15001002){
        this.produit3="AVANCE DE DEMARRAGE";
        this.controlesForm=this.controlesForm ||!this.addForm.valid
      }else if(this.demandePhysique.dem_produitdemande3==15001003){
        this.produit3="BONNE EXECUTION";
        this.controlesForm=this.controlesForm ||!this.addForm4.valid
      }else if(this.demandePhysique.dem_produitdemande3==15001004){
        this.produit3="RETENUE DE GARANTIE";
        this.controlesForm=this.controlesForm ||!this.addForm5.valid
      }else if(this.demandePhysique.dem_produitdemande3==15001005){
        this.produit3="DEFINITIVE"
        this.controlesForm=this.controlesForm ||!this.addForm3.valid
      }
    }

    
this.onGetByNumDamandeTypeDemandeTypeProduit(this.demandePhysique.dem_persnum,"physique");
let produit =[]
    produit['SOUMISSION']=1;
    produit['AVANCE DE DEMARRAGE']=2;
    produit['BONNE EXECUTION']=3;
    produit['RETENUE DE GARANTIE']=4;
    produit['DEFINITIVE']=5;

    /*let produit1=produit[this.produit1];
    let produit2=produit[this.produit2];
    let produit3=produit[this.produit3];
    console.log("indice",produit1,produit2,produit3);*/
    if(this.demandePhysique.dem_produitdemande3!=0){
      let l=[];
    l[0]=produit[this.produit1],
    l[1]=produit[this.produit2];
    l[2]= produit[this.produit3];
    l=l.sort()
    console.log("tableau",l);
    
    
    console.log('demande',this.demandePhysique);
    console.log('client',this.client);
    for (var item in produit) {
      if(produit[item]==l[0]){
        this.produit1=item
      }
      if(produit[item]==l[1]){
        this.produit2=item
      }
      if(produit[item]==l[2]){
        this.produit3=item
      }
      //console.log("item",item)
   }
   
   
}
if(this.demandePhysique.dem_produitdemande2!=0 && this.demandePhysique.dem_produitdemande3==0){
  let l=[];
  l[0]=produit[this.produit1],
  l[1]=produit[this.produit2];
  //l[2]= produit[this.produit3];
  l=l.sort()
  console.log("tableau",l);
  
  
  console.log('demande',this.demandePhysique);
  //console.log('client',this.client);
  for (var item in produit) {
    if(produit[item]==l[0]){
      this.produit1=item
    }
    if(produit[item]==l[1]){
      this.produit2=item
    }
    console.log("produit1",this.produit1)
    console.log("produit2",this.produit1)
    /*if(produit[item]==l[2]){
      this.produit3=item
    }
    console.log("item",item)*/
 }
 
 }
 this.authService.getToken()
 .subscribe((token: NbAuthJWTToken) => {
   if (token.isValid()) {
     this.login = token.getPayload();
     this.userService.getUser(this.login.sub)
       .subscribe((data: User) => {

         this.user = data;

         //let user = JSON.stringify(this.user);
         //this.nom = this.user.util_nom.toUpperCase();
         //this.prenom = this.user.util_prenom;
         console.log("user",this.user.util_profil);
         if(this.user.util_profil=="Administrateur Général" || this.user.util_profil=="analyste risque" ||  this.user.util_profil=="analyste risque" || this.user.util_profil=="Agent arbitrage")  {
           this.candidateToModifyacte=true;
           console.log(this.candidateToModifyacte,"actepermission")
         }      
       })
   }
 })


      }
  
  addForm = this.fb.group({

    acte_titre: ['', [Validators.required]],
    acte_dao: ['', [Validators.required]],
    acte_beneficiaire: ['', [Validators.required]],
    acte_date: ['', [Validators.required]],
    acte_numero_marche: ['', [Validators.required]],
    acte_date_info: ['', [Validators.required]],
    acte_description_travaux: ['', [Validators.required]],
    acte_numero_compte : ['', [Validators.required]],
    acte_banque : ['', [Validators.required]],
    acte_numero_agrement : ['', [Validators.required]],
    acte_date_expiration : ['', [Validators.required]],
    acte_lots:[],
    acte_dem_num:[''],
    acte_type_dem:[''],
    acte_type:[''],
    acte_type_prod:[''],
    acte_arbitrage_num:['']
  });
  addForm2 = this.fb.group({

    acte_titre: ['', [Validators.required]],
    acte_dao: [''],
    acte_beneficiaire: ['', [Validators.required]],
    acte_date: ['', [Validators.required]],
    acte_numero_marche: ['', [Validators.required]],
    acte_date_info: ['', [Validators.required]],
    acte_description_travaux: ['', [Validators.required]],
    acte_numero_compte : [''],
    acte_banque : [''],
    acte_numero_agrement : ['', [Validators.required]],
    acte_date_expiration : ['', [Validators.required]],
    acte_lots : ['', [Validators.required]],
    //acte_num:[''],
    acte_dem_num:[''],
    acte_type_dem:[''],
    acte_type:[''],
    acte_type_prod:[''],
    acte_arbitrage_num:['']
  });

  addForm3 = this.fb.group({

    acte_titre: ['', [Validators.required]],
    acte_dao: ['', [Validators.required]],
    acte_beneficiaire: ['', [Validators.required]],
    acte_date: ['', [Validators.required]],
    acte_numero_marche: ['', [Validators.required]],
    acte_date_info: ['', [Validators.required]],
    acte_description_travaux: ['', [Validators.required]],
    acte_numero_compte : [''],
    acte_banque : [''],
    acte_numero_agrement : ['', [Validators.required]],
    acte_date_expiration : ['', [Validators.required]],
    acte_lots:[],
    acte_dem_num:[''],
    acte_type_dem:[''],
    acte_type:[''],
    acte_type_prod:[''],
    acte_arbitrage_num:['']
  });
  
  addForm4 = this.fb.group({

    acte_titre: ['', [Validators.required]],
    acte_dao: ['', [Validators.required]],
    acte_beneficiaire: ['', [Validators.required]],
    acte_date: ['', [Validators.required]],
    acte_numero_marche: ['', [Validators.required]],
    acte_date_info: ['', [Validators.required]],
    acte_description_travaux: ['', [Validators.required]],
    acte_numero_compte : [''],
    acte_banque : [''],
    acte_numero_agrement : ['', [Validators.required]],
    acte_date_expiration : ['', [Validators.required]],
    acte_lots : ['', [Validators.required]],
    acte_date_fin_garantie : ['', [Validators.required]],
    acte_dem_num:[''],
    acte_type_dem:[''],
    acte_type:[''],
    acte_type_prod:[''],
    acte_arbitrage_num:['']
  });

  addForm5 = this.fb.group({

    acte_titre: ['', [Validators.required]],
    acte_dao: [''],
    acte_beneficiaire: ['', [Validators.required]],
    acte_date: ['', [Validators.required]],
    acte_numero_marche: ['', [Validators.required]],
    acte_date_info: ['', [Validators.required]],
    acte_description_travaux: ['', [Validators.required]],
    acte_numero_compte : [''],
    acte_banque : [''],
    acte_numero_agrement : ['', [Validators.required]],
    acte_date_expiration : ['', [Validators.required]],
    acte_lots:[],
    acte_dem_num:[''],
    acte_type_dem:[''],
    acte_type:[''],
    acte_type_prod:[''],
    acte_arbitrage_num:['']
  });

  produit1;
  produit2;
  produit3;
  produit2Existe=false
  produit3Existe=false
  controlesForm
  haveInstruction=false;
  havesoumission=false;
  haveAvanceDemarrage=false
  havebonneExecution = false;
  haveretenueGarantie=false;
  haveDefinitive=false;
  montant1;
  montant2;
  montant3;
  title
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  titre=""
  dao=""
  beneficiaire="";
  date="";
  clients="";
  adresse_client="";
  numero_marche="";
  date_info="";
  description_travaux="";
  montant_demande;
  montant_lettre;
  numero_compte="";
  banque="";
  numero_agrement="";
  date_expiration="";
  lots="";
  date_fin_garantie="";

  actes:ActeArbitrage[];
  login:any;
  user:User;
  candidateToModifyacte=false;

  typeproduit;
  
  onExportCmt(demande:Dem_Pers){
    /*this.onExportActeAvanceDemarrage(demande);
    this.onExportActeSoumission(demande);
    this.onExportActeDefinive(demande);*/
    if(this.demandePhysique.dem_produitdemande1==15001001){
      this.onExportActeSoumission(demande)
    }else if(this.demandePhysique.dem_produitdemande1==15001002){
      this.onExportActeAvanceDemarrage(demande);
    }else if(this.demandePhysique.dem_produitdemande1==15001003){
      this.onExportActeBonneExecution(demande);
    }else if(this.demandePhysique.dem_produitdemande1==15001004){
      this.onExportActeRetenueGarantie(demande)
    }else if(this.demandePhysique.dem_produitdemande1==15001005){
      this.onExportActeDefinive(demande);
    }
    if(this.demandePhysique.dem_produitdemande2!=0){
      if(this.demandePhysique.dem_produitdemande2==15001001){
        this.onExportActeSoumission(demande);
      }else if(this.demandePhysique.dem_produitdemande2==15001002){
        this.onExportActeAvanceDemarrage(demande);
      }else if(this.demandePhysique.dem_produitdemande2==15001003){
        this.onExportActeBonneExecution(demande);
      }else if(this.demandePhysique.dem_produitdemande2==15001004){
        this.onExportActeRetenueGarantie(demande);
      }else if(this.demandePhysique.dem_produitdemande2==15001005){
        this.onExportActeDefinive(demande);
      }
    }
    if(this.demandePhysique.dem_produitdemande3!=0){
      if(this.demandePhysique.dem_produitdemande3==15001001){
        this.onExportActeSoumission(demande);
      }else if(this.demandePhysique.dem_produitdemande3==15001002){
        this.onExportActeAvanceDemarrage(demande);
      }else if(this.demandePhysique.dem_produitdemande3==15001003){
        this.onExportActeBonneExecution(demande);
      }else if(this.demandePhysique.dem_produitdemande3==15001004){
        this.onExportActeRetenueGarantie(demande);
      }else if(this.demandePhysique.dem_produitdemande3==15001005){
        this.onExportActeDefinive(demande);
      }
    }
  }
  
  
  onExportActeAvanceDemarrage(demande:Dem_Pers) {
   	this.titre=this.addForm.get("acte_titre").value
    this.dao=this.addForm.get("acte_dao").value
    this.beneficiaire =this.addForm.get("acte_beneficiaire").value
    this.date = this.datePipe.transform(this.addForm.get("acte_date").value,'dd/MM/yyyy').toString()
    this.numero_marche = this.addForm.get("acte_numero_marche").value
    this.date_info=this.datePipe.transform(this.addForm.get("acte_date_info").value,'dd/MM/yyyy').toString()
    this.description_travaux=this.addForm.get("acte_description_travaux").value
    this.numero_compte = this.addForm.get("acte_numero_compte").value
    this.banque = this.addForm.get("acte_banque").value
    this.numero_agrement = this.addForm.get("acte_numero_agrement").value
    this.date_expiration = this.datePipe.transform(this.addForm.get("acte_date_expiration").value,'dd/MM/yyyy').toString()

    const form = new FormData();

    form.append("titre", this.titre);
		form.append("dao", this.dao);
		form.append("beneficiaire", this.beneficiaire);
		form.append("date", this.date);
		form.append("client", this.clients);
		form.append("adresse_client", this.adresse_client);
		form.append("numero_marche", this.numero_marche);
		form.append("date_info", this.date_info);
		form.append("description_travaux", this.description_travaux);
    if(this.demandePhysique.dem_produitdemande1==15001002){
      form.append("montant_demande", this.montant1);
		  form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
    }else  if(this.demandePhysique.dem_produitdemande2==15001002){
      form.append("montant_demande", this.montant2);
		  form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
    }else  if(this.demandePhysique.dem_produitdemande3==15001002){
      form.append("montant_demande", this.montant3);
		  form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
    }
		//form.append("montant_demande", this.montant1);
		//form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
		form.append("numero_compte", this.numero_compte);
		form.append("banque", this.banque);
		form.append("numero_agrement", this.numero_agrement);
		form.append("date_expiration", this.date_expiration);
    this.addForm.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
    this.addForm.controls['acte_type_dem'].setValue("physique");
    this.addForm.controls['acte_type'].setValue("caution");
    this.addForm.controls['acte_type_prod'].setValue(15001002);


console.log(form);
    //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
    // this.clientService.generateReportClient(format, title, this.demandeur)
    this.demPhysiqueService.generateReportActeAd(demande.dem_persnum,form)
    //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
      .subscribe(event => {
        let message=""
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            if (event.status == 200) {
              console.log(this.addForm.value)
              if(!this.haveAvanceDemarrage){
                message="et enregisté avec succès !"
                this.acteArbitrageService.addActeArbitrage(this.addForm.value)
                  .subscribe((data:any) => {
                    this.haveAvanceDemarrage=true;
                  })
              }else{
                message="et modifié avec succès !"
                this.acteArbitrageService.updateActeArbitrage(this.addForm.value)
                .subscribe((data) => {
                  
                })
                }
                /*demande.dem_statut="analyse juridique"
                this.demPhysiqueService.update(demande).subscribe(data => {
                  
                })*/
              //this.router.navigateByUrl('/home/demande-societe');
              this.toastrService.show(
                'Acte avance de démarrage généré avec succés ! '+message,
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

            break;
          case HttpEventType.UploadProgress:
            break;
          case HttpEventType.Response:
            // console.log(event);
            // var fileURL = URL.createObjectURL(event.body) ;
            // window.open(fileURL) ;
            saveAs(event.body, 'acte_avance_demarrage.docx');
            //this.router.navigateByUrl('/home/demande-societe');
        }
      });
  }
  onExportActeAvanceDemarragebis(demande:Dem_Pers) {
    this.titre=this.addForm.get("acte_titre").value
   this.dao=this.addForm.get("acte_dao").value
   this.beneficiaire =this.addForm.get("acte_beneficiaire").value
   this.date = this.datePipe.transform(this.addForm.get("acte_date").value,'dd/MM/yyyy').toString()
   this.numero_marche = this.addForm.get("acte_numero_marche").value
   this.date_info=this.datePipe.transform(this.addForm.get("acte_date_info").value,'dd/MM/yyyy').toString()
   this.description_travaux=this.addForm.get("acte_description_travaux").value
   this.numero_compte = this.addForm.get("acte_numero_compte").value
   this.banque = this.addForm.get("acte_banque").value
   this.numero_agrement = this.addForm.get("acte_numero_agrement").value
   this.date_expiration = this.datePipe.transform(this.addForm.get("acte_date_expiration").value,'dd/MM/yyyy').toString()

   const form = new FormData();

   form.append("titre", this.titre);
   form.append("dao", this.dao);
   form.append("beneficiaire", this.beneficiaire);
   form.append("date", this.date);
   form.append("client", this.clients);
   form.append("adresse_client", this.adresse_client);
   form.append("numero_marche", this.numero_marche);
   form.append("date_info", this.date_info);
   form.append("description_travaux", this.description_travaux);
   if(this.demandePhysique.dem_produitdemande1==15001002){
     form.append("montant_demande", this.montant1);
     form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
   }else  if(this.demandePhysique.dem_produitdemande2==15001002){
     form.append("montant_demande", this.montant2);
     form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
   }else  if(this.demandePhysique.dem_produitdemande3==15001002){
     form.append("montant_demande", this.montant3);
     form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
   }
   //form.append("montant_demande", this.montant1);
   //form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
   form.append("numero_compte", this.numero_compte);
   form.append("banque", this.banque);
   form.append("numero_agrement", this.numero_agrement);
   form.append("date_expiration", this.date_expiration);
   this.addForm.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
   this.addForm.controls['acte_type_dem'].setValue("physique");
   this.addForm.controls['acte_type'].setValue("caution");
   this.addForm.controls['acte_type_prod'].setValue(15001002);


console.log(form);
   //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
   // this.clientService.generateReportClient(format, title, this.demandeur)
   this.demPhysiqueService.generateReportActeAd(demande.dem_persnum,form)
   //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
     .subscribe(event => {
       let message=""
       switch (event.type) {
         case HttpEventType.Sent:
           console.log('Request has been made!');
           break;
         case HttpEventType.ResponseHeader:
           console.log('Response header has been received!');
           if (event.status == 200) {
             console.log(this.addForm.value)
             /*if(!this.haveAvanceDemarrage){
               message="et enregisté avec succès !"
               this.acteArbitrageService.addActeArbitrage(this.addForm.value)
                 .subscribe((data:any) => {
                   this.haveAvanceDemarrage=true;
                 })
             }else{
               message="et modifié avec succès !"
               this.acteArbitrageService.updateActeArbitrage(this.addForm.value)
               .subscribe((data) => {
                 
               })
               }
               /*demande.dem_statut="analyse juridique"
               this.demPhysiqueService.update(demande).subscribe(data => {
                 
               })*/
             //this.router.navigateByUrl('/home/demande-societe');
             this.toastrService.show(
               'Acte avance de démarrage généré avec succés !',
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

           break;
         case HttpEventType.UploadProgress:
           break;
         case HttpEventType.Response:
           // console.log(event);
           // var fileURL = URL.createObjectURL(event.body) ;
           // window.open(fileURL) ;
           saveAs(event.body, 'acte_avance_demarrage.docx');
           //this.router.navigateByUrl('/home/demande-societe');
       }
     });
 }


  onExportActeSoumission(demande:Dem_Pers) {
   this.titre=this.addForm2.get("acte_titre").value
   this.dao=this.addForm2.get("acte_dao").value
   this.beneficiaire =this.addForm2.get("acte_beneficiaire").value
   this.date = this.datePipe.transform(this.addForm2.get("acte_date").value,'dd/MM/yyyy').toString()
   this.numero_marche = this.addForm2.get("acte_numero_marche").value
   this.date_info=this.datePipe.transform(this.addForm2.get("acte_date_info").value,'dd/MM/yyyy').toString()
   this.description_travaux=this.addForm2.get("acte_description_travaux").value
   this.numero_compte = this.addForm2.get("acte_numero_compte").value
   this.banque = this.addForm2.get("acte_banque").value
   this.numero_agrement = this.addForm2.get("acte_numero_agrement").value
   this.date_expiration = this.datePipe.transform(this.addForm2.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
   this.lots = this.addForm2.get("acte_lots").value
   this.addForm2.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
   this.addForm2.controls['acte_type_dem'].setValue("physique");
   this.addForm2.controls['acte_type'].setValue("caution");
   this.addForm2.controls['acte_type_prod'].setValue(15001001);
   
   const form = new FormData();

   form.append("titre", this.titre);
   form.append("dao", this.dao);
   form.append("beneficiaire", this.beneficiaire);
   form.append("date", this.date);
   form.append("client", this.clients);
   form.append("adresse_client", this.adresse_client);
   form.append("numero_marche", this.numero_marche);
   form.append("date_info", this.date_info);
   form.append("description_travaux", this.description_travaux);
   if(this.demandePhysique.dem_produitdemande1==15001001){
    form.append("montant_demande", this.montant1);
    form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
  }else  if(this.demandePhysique.dem_produitdemande2==15001001){
    form.append("montant_demande", this.montant2);
    form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
  }else  if(this.demandePhysique.dem_produitdemande3==15001001){
    form.append("montant_demande", this.montant3);
    form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
  }
   //form.append("montant_demande", this.montant2);
   //form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
   form.append("numero_compte", this.numero_compte);
   form.append("banque", this.banque);
   form.append("numero_agrement", this.numero_agrement);
   form.append("date_expiration", this.date_expiration);
   form.append("lots", this.lots);


console.log(form);
   //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
   // this.clientService.generateReportClient(format, title, this.demandeur)
   this.demPhysiqueService.generateReportActesoumission(demande.dem_persnum,form)
   //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
     .subscribe(event => {
       let message=""
       switch (event.type) {
         case HttpEventType.Sent:
           console.log('Request has been made!');
           break;
         case HttpEventType.ResponseHeader:
           console.log('Response header has been received!');
           if (event.status == 200) {
             console.log(this.addForm.value)
             if(!this.havesoumission){//
               message="et enregisté avec succès !"
               this.acteArbitrageService.addActeArbitrage(this.addForm2.value)
                 .subscribe((data:any) => {
                  this.havesoumission=true;
                 })
             }else{
               message="et modifié avec succès !"
               this.acteArbitrageService.updateActeArbitrage(this.addForm2.value)
               .subscribe((data) => {
                 
               })
             }
               /*demande.dem_statut="analyse juridique"
               this.demPhysiqueService.update(demande).subscribe(data => {
                 
               })*/
             //this.router.navigateByUrl('/home/demande-societe');
             this.toastrService.show(
               'Acte soumission généré avec succés ! '+message,
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

           break;
         case HttpEventType.UploadProgress:
           break;
         case HttpEventType.Response:
           // console.log(event);
           // var fileURL = URL.createObjectURL(event.body) ;
           // window.open(fileURL) ;
           saveAs(event.body, 'acte_soumission.docx');
           //this.router.navigateByUrl('/home/demande-societe');
       }  
     });
 }

 onExportActeSoumissionbis(demande:Dem_Pers) {
  this.titre=this.addForm2.get("acte_titre").value
  this.dao=this.addForm2.get("acte_dao").value
  this.beneficiaire =this.addForm2.get("acte_beneficiaire").value
  this.date = this.datePipe.transform(this.addForm2.get("acte_date").value,'dd/MM/yyyy').toString()
  this.numero_marche = this.addForm2.get("acte_numero_marche").value
  this.date_info=this.datePipe.transform(this.addForm2.get("acte_date_info").value,'dd/MM/yyyy').toString()
  this.description_travaux=this.addForm2.get("acte_description_travaux").value
  this.numero_compte = this.addForm2.get("acte_numero_compte").value
  this.banque = this.addForm2.get("acte_banque").value
  this.numero_agrement = this.addForm2.get("acte_numero_agrement").value
  this.date_expiration = this.datePipe.transform(this.addForm2.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
  this.lots = this.addForm2.get("acte_lots").value
  this.addForm2.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
  this.addForm2.controls['acte_type_dem'].setValue("physique");
  this.addForm2.controls['acte_type'].setValue("caution");
  this.addForm2.controls['acte_type_prod'].setValue(15001001);
  
  const form = new FormData();

  form.append("titre", this.titre);
  form.append("dao", this.dao);
  form.append("beneficiaire", this.beneficiaire);
  form.append("date", this.date);
  form.append("client", this.clients);
  form.append("adresse_client", this.adresse_client);
  form.append("numero_marche", this.numero_marche);
  form.append("date_info", this.date_info);
  form.append("description_travaux", this.description_travaux);
  if(this.demandePhysique.dem_produitdemande1==15001001){
   form.append("montant_demande", this.montant1);
   form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
 }else  if(this.demandePhysique.dem_produitdemande2==15001001){
   form.append("montant_demande", this.montant2);
   form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
 }else  if(this.demandePhysique.dem_produitdemande3==15001001){
   form.append("montant_demande", this.montant3);
   form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
 }
  //form.append("montant_demande", this.montant2);
  //form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
  form.append("numero_compte", this.numero_compte);
  form.append("banque", this.banque);
  form.append("numero_agrement", this.numero_agrement);
  form.append("date_expiration", this.date_expiration);
  form.append("lots", this.lots);


console.log(form);
  //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
  // this.clientService.generateReportClient(format, title, this.demandeur)
  this.demPhysiqueService.generateReportActesoumission(demande.dem_persnum,form)
  //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
    .subscribe(event => {
      let message=""
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          if (event.status == 200) {
            console.log(this.addForm.value)
            /*if(!this.havesoumission){//
              message="et enregisté avec succès !"
              this.acteArbitrageService.addActeArbitrage(this.addForm2.value)
                .subscribe((data:any) => {
                 this.havesoumission=true;
                })
            }else{
              message="et modifié avec succès !"
              this.acteArbitrageService.updateActeArbitrage(this.addForm2.value)
              .subscribe((data) => {
                
              })
            }
              /*demande.dem_statut="analyse juridique"
              this.demPhysiqueService.update(demande).subscribe(data => {
                
              })*/
            //this.router.navigateByUrl('/home/demande-societe');
            this.toastrService.show(
              'Acte soumission généré avec succés ! ',
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

          break;
        case HttpEventType.UploadProgress:
          break;
        case HttpEventType.Response:
          // console.log(event);
          // var fileURL = URL.createObjectURL(event.body) ;
          // window.open(fileURL) ;
          saveAs(event.body, 'acte_soumission.docx');
          //this.router.navigateByUrl('/home/demande-societe');
      }  
    });
}


 onExportActeDefinive(demande:Dem_Pers) {
 this.titre=this.addForm3.get("acte_titre").value
 this.dao=this.addForm3.get("acte_dao").value
 this.beneficiaire =this.addForm3.get("acte_beneficiaire").value
 this.date = this.datePipe.transform(this.addForm3.get("acte_date").value,'dd/MM/yyyy').toString()
 this.numero_marche = this.addForm3.get("acte_numero_marche").value
 this.date_info=this.datePipe.transform(this.addForm3.get("acte_date_info").value,'dd/MM/yyyy').toString()
 this.description_travaux=this.addForm3.get("acte_description_travaux").value
 this.numero_compte = this.addForm3.get("acte_numero_compte").value
 this.banque = this.addForm3.get("acte_banque").value
 this.numero_agrement = this.addForm3.get("acte_numero_agrement").value
 this.date_expiration = this.datePipe.transform(this.addForm3.get("acte_date_expiration").value,'dd/MM/yyyy').toString()

 this.addForm3.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
 this.addForm3.controls['acte_type_dem'].setValue("physique");
 this.addForm3.controls['acte_type'].setValue("caution");
 this.addForm3.controls['acte_type_prod'].setValue(15001005);

 const form = new FormData();

 form.append("titre", this.titre);
 form.append("dao", this.dao);
 form.append("beneficiaire", this.beneficiaire);
 form.append("date", this.date);
 form.append("client", this.clients);
 form.append("adresse_client", this.adresse_client);
 form.append("numero_marche", this.numero_marche);
 form.append("date_info", this.date_info);
 form.append("description_travaux", this.description_travaux);
 if(this.demandePhysique.dem_produitdemande1==15001005){
  form.append("montant_demande", this.montant1);
  form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
}else  if(this.demandePhysique.dem_produitdemande2==15001005){
  form.append("montant_demande", this.montant2);
  form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
}else  if(this.demandePhysique.dem_produitdemande3==15001005){
  form.append("montant_demande", this.montant3);
  form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
}
 //form.append("montant_demande", this.montant1);
 //form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
 form.append("numero_compte", this.numero_compte);
 form.append("banque", this.banque);
 form.append("numero_agrement", this.numero_agrement);
 form.append("date_expiration", this.date_expiration);


console.log(form);
 //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
 // this.clientService.generateReportClient(format, title, this.demandeur)
 this.demPhysiqueService.generateReportActedefinitive(demande.dem_persnum,form)
 //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
   .subscribe(event => {
     let message=""
     switch (event.type) {
       case HttpEventType.Sent:
         console.log('Request has been made!');
         break;
       case HttpEventType.ResponseHeader:
         console.log('Response header has been received!');
         if (event.status == 200) {
           console.log(this.addForm.value)
           if(!this.haveDefinitive){
             message="et enregisté avec succès !"
             this.acteArbitrageService.addActeArbitrage(this.addForm3.value)
               .subscribe((data:any) => {
                this.haveDefinitive;
               })
           }else{
             message="et modifié avec succès !"
             this.acteArbitrageService.updateActeArbitrage(this.addForm3.value)
             .subscribe((data) => {
               
             })
             }
             /*demande.dem_statut="analyse juridique"
             this.demPhysiqueService.update(demande).subscribe(data => {
               
             })*/
           //this.router.navigateByUrl('/home/demande-societe');
           this.toastrService.show(
             'Acte définitive généré avec succés ! '+message,
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

         break;
       case HttpEventType.UploadProgress:
         break;
       case HttpEventType.Response:
         // console.log(event);
         // var fileURL = URL.createObjectURL(event.body) ;
         // window.open(fileURL) ;
         saveAs(event.body, 'acte_definitive.docx');
         //this.router.navigateByUrl('/home/demande-societe');
     }
   });
}
onExportActeDefinivebis(demande:Dem_Pers) {
  this.titre=this.addForm3.get("acte_titre").value
  this.dao=this.addForm3.get("acte_dao").value
  this.beneficiaire =this.addForm3.get("acte_beneficiaire").value
  this.date = this.datePipe.transform(this.addForm3.get("acte_date").value,'dd/MM/yyyy').toString()
  this.numero_marche = this.addForm3.get("acte_numero_marche").value
  this.date_info=this.datePipe.transform(this.addForm3.get("acte_date_info").value,'dd/MM/yyyy').toString()
  this.description_travaux=this.addForm3.get("acte_description_travaux").value
  this.numero_compte = this.addForm3.get("acte_numero_compte").value
  this.banque = this.addForm3.get("acte_banque").value
  this.numero_agrement = this.addForm3.get("acte_numero_agrement").value
  this.date_expiration = this.datePipe.transform(this.addForm3.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
 
  this.addForm3.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
  this.addForm3.controls['acte_type_dem'].setValue("physique");
  this.addForm3.controls['acte_type'].setValue("caution");
  this.addForm3.controls['acte_type_prod'].setValue(15001005);
 
  const form = new FormData();
 
  form.append("titre", this.titre);
  form.append("dao", this.dao);
  form.append("beneficiaire", this.beneficiaire);
  form.append("date", this.date);
  form.append("client", this.clients);
  form.append("adresse_client", this.adresse_client);
  form.append("numero_marche", this.numero_marche);
  form.append("date_info", this.date_info);
  form.append("description_travaux", this.description_travaux);
  if(this.demandePhysique.dem_produitdemande1==15001005){
   form.append("montant_demande", this.montant1);
   form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
 }else  if(this.demandePhysique.dem_produitdemande2==15001005){
   form.append("montant_demande", this.montant2);
   form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
 }else  if(this.demandePhysique.dem_produitdemande3==15001005){
   form.append("montant_demande", this.montant3);
   form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
 }
  //form.append("montant_demande", this.montant1);
  //form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
  form.append("numero_compte", this.numero_compte);
  form.append("banque", this.banque);
  form.append("numero_agrement", this.numero_agrement);
  form.append("date_expiration", this.date_expiration);
 
 
 console.log(form);
  //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
  // this.clientService.generateReportClient(format, title, this.demandeur)
  this.demPhysiqueService.generateReportActedefinitive(demande.dem_persnum,form)
  //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
    .subscribe(event => {
      let message=""
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          if (event.status == 200) {
            console.log(this.addForm.value)
            /*if(!this.haveDefinitive){
              message="et enregisté avec succès !"
              this.acteArbitrageService.addActeArbitrage(this.addForm3.value)
                .subscribe((data:any) => {
                 this.haveDefinitive;
                })
            }else{
              message="et modifié avec succès !"
              this.acteArbitrageService.updateActeArbitrage(this.addForm3.value)
              .subscribe((data) => {
                
              })
              }
              /*demande.dem_statut="analyse juridique"
              this.demPhysiqueService.update(demande).subscribe(data => {
                
              })*/
            //this.router.navigateByUrl('/home/demande-societe');
            this.toastrService.show(
              'Acte définitive généré avec succés !',
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
 
          break;
        case HttpEventType.UploadProgress:
          break;
        case HttpEventType.Response:
          // console.log(event);
          // var fileURL = URL.createObjectURL(event.body) ;
          // window.open(fileURL) ;
          saveAs(event.body, 'acte_definitive.docx');
          //this.router.navigateByUrl('/home/demande-societe');
      }
    });
 }

onExportActeBonneExecution(demande:Dem_Pers) {
  this.titre=this.addForm4.get("acte_titre").value
  this.dao=this.addForm4.get("acte_dao").value
  this.beneficiaire =this.addForm4.get("acte_beneficiaire").value
  this.date = this.datePipe.transform(this.addForm4.get("acte_date").value,'dd/MM/yyyy').toString()
  this.numero_marche = this.addForm4.get("acte_numero_marche").value
  this.date_info=this.datePipe.transform(this.addForm4.get("acte_date_info").value,'dd/MM/yyyy').toString()
  this.description_travaux=this.addForm4.get("acte_description_travaux").value
  this.numero_compte = this.addForm4.get("acte_numero_compte").value
  this.banque = this.addForm4.get("acte_banque").value
  this.numero_agrement = this.addForm4.get("acte_numero_agrement").value
  this.date_expiration = this.datePipe.transform(this.addForm4.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
  this.lots = this.addForm4.get("acte_lots").value
  this.date_fin_garantie = this.datePipe.transform(this.addForm4.get("acte_date_fin_garantie").value,'dd/MM/yyyy').toString()
  
  this.addForm4.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
  this.addForm4.controls['acte_type_dem'].setValue("physique");
  this.addForm4.controls['acte_type'].setValue("caution");
  this.addForm4.controls['acte_type_prod'].setValue(15001003);
  const form = new FormData();

  form.append("titre", this.titre);
  form.append("dao", this.dao);
  form.append("beneficiaire", this.beneficiaire);
  form.append("date", this.date);
  form.append("client", this.clients);
  form.append("adresse_client", this.adresse_client);
  form.append("numero_marche", this.numero_marche);
  form.append("date_info", this.date_info);
  form.append("description_travaux", this.description_travaux);
  if(this.demandePhysique.dem_produitdemande1==15001003){
    form.append("montant_demande", this.montant1);
    form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
  }else  if(this.demandePhysique.dem_produitdemande2==15001003){
    form.append("montant_demande", this.montant2);
    form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
  }else  if(this.demandePhysique.dem_produitdemande3==15001003){
    form.append("montant_demande", this.montant3);
    form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
  }
  //form.append("montant_demande", this.montant2);
  //form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
  form.append("numero_compte", this.numero_compte);
  form.append("banque", this.banque);
  form.append("numero_agrement", this.numero_agrement);
  form.append("date_expiration", this.date_expiration);
  form.append("lots", this.lots);
  form.append("date_fin_garantie", this.date_fin_garantie);


console.log(form);
  //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
  // this.clientService.generateReportClient(format, title, this.demandeur)
  this.demPhysiqueService.generateReportActeBonneExecution(demande.dem_persnum,form)
  //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
    .subscribe(event => {
      let message=""
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          if (event.status == 200) {
            console.log(this.addForm.value)
            if(!this.havebonneExecution){
              message="et enregisté avec succès !"
              this.acteArbitrageService.addActeArbitrage(this.addForm4.value)
                .subscribe((data:any) => {
                  this.havebonneExecution=true;
                })
            }else{
              message="et modifié avec succès !"
              this.acteArbitrageService.updateActeArbitrage(this.addForm4.value)
              .subscribe((data) => {
                
              })
              }
              /*demande.dem_statut="analyse juridique"
              this.demPhysiqueService.update(demande).subscribe(data => {
                
              })*/
            //this.router.navigateByUrl('/home/demande-societe');
            this.toastrService.show(
              'Acte bonne exécution généré avec succés ! '+message,
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

          break;
        case HttpEventType.UploadProgress:
          break;
        case HttpEventType.Response:
          // console.log(event);
          // var fileURL = URL.createObjectURL(event.body) ;
          // window.open(fileURL) ;
          saveAs(event.body, 'acte_bonnne_execution.docx');
          //this.router.navigateByUrl('/home/demande-societe');
      }
    });
  }
  onExportActeBonneExecutionbis(demande:Dem_Pers) {
    this.titre=this.addForm4.get("acte_titre").value
    this.dao=this.addForm4.get("acte_dao").value
    this.beneficiaire =this.addForm4.get("acte_beneficiaire").value
    this.date = this.datePipe.transform(this.addForm4.get("acte_date").value,'dd/MM/yyyy').toString()
    this.numero_marche = this.addForm4.get("acte_numero_marche").value
    this.date_info=this.datePipe.transform(this.addForm4.get("acte_date_info").value,'dd/MM/yyyy').toString()
    this.description_travaux=this.addForm4.get("acte_description_travaux").value
    this.numero_compte = this.addForm4.get("acte_numero_compte").value
    this.banque = this.addForm4.get("acte_banque").value
    this.numero_agrement = this.addForm4.get("acte_numero_agrement").value
    this.date_expiration = this.datePipe.transform(this.addForm4.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
    this.lots = this.addForm4.get("acte_lots").value
    this.date_fin_garantie = this.datePipe.transform(this.addForm4.get("acte_date_fin_garantie").value,'dd/MM/yyyy').toString()
    
    this.addForm4.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
    this.addForm4.controls['acte_type_dem'].setValue("physique");
    this.addForm4.controls['acte_type'].setValue("caution");
    this.addForm4.controls['acte_type_prod'].setValue(15001003);
    const form = new FormData();
  
    form.append("titre", this.titre);
    form.append("dao", this.dao);
    form.append("beneficiaire", this.beneficiaire);
    form.append("date", this.date);
    form.append("client", this.clients);
    form.append("adresse_client", this.adresse_client);
    form.append("numero_marche", this.numero_marche);
    form.append("date_info", this.date_info);
    form.append("description_travaux", this.description_travaux);
    if(this.demandePhysique.dem_produitdemande1==15001003){
      form.append("montant_demande", this.montant1);
      form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
    }else  if(this.demandePhysique.dem_produitdemande2==15001003){
      form.append("montant_demande", this.montant2);
      form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
    }else  if(this.demandePhysique.dem_produitdemande3==15001003){
      form.append("montant_demande", this.montant3);
      form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
    }
    //form.append("montant_demande", this.montant2);
    //form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
    form.append("numero_compte", this.numero_compte);
    form.append("banque", this.banque);
    form.append("numero_agrement", this.numero_agrement);
    form.append("date_expiration", this.date_expiration);
    form.append("lots", this.lots);
    form.append("date_fin_garantie", this.date_fin_garantie);
  
  
  console.log(form);
    //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
    // this.clientService.generateReportClient(format, title, this.demandeur)
    this.demPhysiqueService.generateReportActeBonneExecution(demande.dem_persnum,form)
    //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
      .subscribe(event => {
        let message=""
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            if (event.status == 200) {
              console.log(this.addForm.value)
              /*if(!this.havebonneExecution){
                message="et enregisté avec succès !"
                this.acteArbitrageService.addActeArbitrage(this.addForm4.value)
                  .subscribe((data:any) => {
                    this.havebonneExecution=true;
                  })
              }else{
                message="et modifié avec succès !"
                this.acteArbitrageService.updateActeArbitrage(this.addForm4.value)
                .subscribe((data) => {
                  
                })
                }
                /*demande.dem_statut="analyse juridique"
                this.demPhysiqueService.update(demande).subscribe(data => {
                  
                })*/
              //this.router.navigateByUrl('/home/demande-societe');
              this.toastrService.show(
                'Acte bonne exécution généré avec succés !',
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
  
            break;
          case HttpEventType.UploadProgress:
            break;
          case HttpEventType.Response:
            // console.log(event);
            // var fileURL = URL.createObjectURL(event.body) ;
            // window.open(fileURL) ;
            saveAs(event.body, 'acte_bonnne_execution.docx');
            //this.router.navigateByUrl('/home/demande-societe');
        }
      });
    }
  

  onExportActeRetenueGarantie(demande:Dem_Pers) {
    this.titre=this.addForm5.get("acte_titre").value
    this.dao=this.addForm5.get("acte_dao").value
    this.beneficiaire =this.addForm5.get("acte_beneficiaire").value
    this.date = this.datePipe.transform(this.addForm5.get("acte_date").value,'dd/MM/yyyy').toString()
    this.numero_marche = this.addForm5.get("acte_numero_marche").value
    this.date_info=this.datePipe.transform(this.addForm5.get("acte_date_info").value,'dd/MM/yyyy').toString()
    this.description_travaux=this.addForm5.get("acte_description_travaux").value
    this.numero_compte = this.addForm5.get("acte_numero_compte").value
    this.banque = this.addForm5.get("acte_banque").value
    this.numero_agrement = this.addForm5.get("acte_numero_agrement").value
    this.date_expiration = this.datePipe.transform(this.addForm5.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
   
    this.addForm5.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
    this.addForm5.controls['acte_type_dem'].setValue("physique");
    this.addForm5.controls['acte_type'].setValue("caution");
    this.addForm5.controls['acte_type_prod'].setValue(15001004);
    const form = new FormData();
   
    form.append("titre", this.titre);
    form.append("dao", this.dao);
    form.append("beneficiaire", this.beneficiaire);
    form.append("date", this.date);
    form.append("client", this.clients);
    form.append("adresse_client", this.adresse_client);
    form.append("numero_marche", this.numero_marche);
    form.append("date_info", this.date_info);
    form.append("description_travaux", this.description_travaux);
    if(this.demandePhysique.dem_produitdemande1==15001004){
      form.append("montant_demande", this.montant1);
		  form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
    }else  if(this.demandePhysique.dem_produitdemande2==15001004){
      form.append("montant_demande", this.montant2);
		  form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
    }else  if(this.demandePhysique.dem_produitdemande3==15001004){
      form.append("montant_demande", this.montant3);
		  form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
    }
    //form.append("montant_demande", this.montant1);
    //form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
    form.append("numero_compte", this.numero_compte);
    form.append("banque", this.banque);
    form.append("numero_agrement", this.numero_agrement);
    form.append("date_expiration", this.date_expiration);
   
   
   console.log(form);
    //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
    // this.clientService.generateReportClient(format, title, this.demandeur)
    this.demPhysiqueService.generateReportActeRetenueGarantie(demande.dem_persnum,form)
    //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
      .subscribe(event => {
        let message=""
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            if (event.status == 200) {
              console.log(this.addForm.value)
              if(!this.haveretenueGarantie){
                message="et enregisté avec succès !"
                this.acteArbitrageService.addActeArbitrage(this.addForm5.value)
                  .subscribe((data:any) => {
                    this.haveretenueGarantie=true;
                  })
              }else{
                message="et modifié avec succès !"
                this.acteArbitrageService.updateActeArbitrage(this.addForm5.value)
                .subscribe((data) => {
                  
                })
                }
                /*demande.dem_statut="analyse juridique"
                this.demPhysiqueService.update(demande).subscribe(data => {
                  
                })*/
              //this.router.navigateByUrl('/home/demande-societe');
              this.toastrService.show(
                'Acte retenue de garantie généré avec succés ! '+message,
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
   
            break;
          case HttpEventType.UploadProgress:
            break;
          case HttpEventType.Response:
            // console.log(event);
            // var fileURL = URL.createObjectURL(event.body) ;
            // window.open(fileURL) ;
            saveAs(event.body, 'acte_retenue_garantie.docx');
            //this.router.navigateByUrl('/home/demande-societe');
        }
      });
   }
   onExportActeRetenueGarantiebis(demande:Dem_Pers) {
    this.titre=this.addForm5.get("acte_titre").value
    this.dao=this.addForm5.get("acte_dao").value
    this.beneficiaire =this.addForm5.get("acte_beneficiaire").value
    this.date = this.datePipe.transform(this.addForm5.get("acte_date").value,'dd/MM/yyyy').toString()
    this.numero_marche = this.addForm5.get("acte_numero_marche").value
    this.date_info=this.datePipe.transform(this.addForm5.get("acte_date_info").value,'dd/MM/yyyy').toString()
    this.description_travaux=this.addForm5.get("acte_description_travaux").value
    this.numero_compte = this.addForm5.get("acte_numero_compte").value
    this.banque = this.addForm5.get("acte_banque").value
    this.numero_agrement = this.addForm5.get("acte_numero_agrement").value
    this.date_expiration = this.datePipe.transform(this.addForm5.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
   
    this.addForm5.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
    this.addForm5.controls['acte_type_dem'].setValue("physique");
    this.addForm5.controls['acte_type'].setValue("caution");
    this.addForm5.controls['acte_type_prod'].setValue(15001004);
    const form = new FormData();
   
    form.append("titre", this.titre);
    form.append("dao", this.dao);
    form.append("beneficiaire", this.beneficiaire);
    form.append("date", this.date);
    form.append("client", this.clients);
    form.append("adresse_client", this.adresse_client);
    form.append("numero_marche", this.numero_marche);
    form.append("date_info", this.date_info);
    form.append("description_travaux", this.description_travaux);
    if(this.demandePhysique.dem_produitdemande1==15001004){
      form.append("montant_demande", this.montant1);
		  form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
    }else  if(this.demandePhysique.dem_produitdemande2==15001004){
      form.append("montant_demande", this.montant2);
		  form.append("montant_lettre", this.demandePhysique.dem_montant2.toString());
    }else  if(this.demandePhysique.dem_produitdemande3==15001004){
      form.append("montant_demande", this.montant3);
		  form.append("montant_lettre", this.demandePhysique.dem_montant3.toString());
    }
    //form.append("montant_demande", this.montant1);
    //form.append("montant_lettre", this.demandePhysique.dem_montant.toString());
    form.append("numero_compte", this.numero_compte);
    form.append("banque", this.banque);
    form.append("numero_agrement", this.numero_agrement);
    form.append("date_expiration", this.date_expiration);
   
   
   console.log(form);
    //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
    // this.clientService.generateReportClient(format, title, this.demandeur)
    this.demPhysiqueService.generateReportActeRetenueGarantie(demande.dem_persnum,form)
    //this.demPhysiqueService.generateReportInstruction(demande.dem_persnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
      .subscribe(event => {
        let message=""
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            if (event.status == 200) {
              console.log(this.addForm.value)
              /*if(!this.haveretenueGarantie){
                message="et enregisté avec succès !"
                this.acteArbitrageService.addActeArbitrage(this.addForm5.value)
                  .subscribe((data:any) => {
                    this.haveretenueGarantie=true;
                  })
              }else{
                message="et modifié avec succès !"
                this.acteArbitrageService.updateActeArbitrage(this.addForm5.value)
                .subscribe((data) => {
                  
                })
                }
                /*demande.dem_statut="analyse juridique"
                this.demPhysiqueService.update(demande).subscribe(data => {
                  
                })*/
              //this.router.navigateByUrl('/home/demande-societe');
              this.toastrService.show(
                'Acte retenue de garantie généré avec succés !',
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
   
            break;
          case HttpEventType.UploadProgress:
            break;
          case HttpEventType.Response:
            // console.log(event);
            // var fileURL = URL.createObjectURL(event.body) ;
            // window.open(fileURL) ;
            saveAs(event.body, 'acte_retenue_garantie.docx');
            //this.router.navigateByUrl('/home/demande-societe');
        }
      });
   }
  
  close(){
    this.router.navigateByUrl('/home/demande-Physique');
  }
  getCientById(id) {
    this.clientService.getClient(id)
      .subscribe((data: any) => {
        this.client = data as Client;
        console.log(this.client,'client');
        this.clients=(this.client.clien_prenom+" "+this.client.clien_nom).toString();
        this.adresse_client=this.client.clien_adressenumero+" "+this.client.clien_adresserue+"  "+this.client.clien_adresseville;
      });
  }
  formatNumer(num){
    return this.formatNumberService.numberWithCommas2(num);
  }
  
  onGetByNumDamandeTypeDemandeTypeProduit(actedemnum ,actetypedem ) {
    this.acteArbitrageService.getByNumDamandeTypeDemandeTypeProduit(actedemnum ,actetypedem)
      .subscribe((data: any) => {
        this.actes = data as ActeArbitrage[];
        console.log(this.actes,'actes');
        for(let i=0;i<this.actes.length;i++){
          if(this.actes[i].acte_type_prod=='15001001'){
            this.havesoumission=true;
            this.addForm2.controls['acte_arbitrage_num'].setValue(this.actes[i].acte_arbitrage_num);
            //this.titre=this.addForm2.get("acte_titre").value
            this.addForm2.controls['acte_titre'].setValue(this.actes[i].acte_titre);
            //this.dao=this.addForm2.get("acte_dao").value
            this.addForm2.controls['acte_dao'].setValue(this.actes[i].acte_dao);
            //this.beneficiaire =this.addForm2.get("acte_beneficiaire").value
            this.addForm2.controls['acte_beneficiaire'].setValue(this.actes[i].acte_beneficiaire);
            //this.date = this.datePipe.transform(this.addForm2.get("acte_date").value,'dd/MM/yyyy').toString()
            this.addForm2.controls['acte_date'].setValue(dateFormatter(this.actes[i].acte_date,"yyyy-MM-dd"));
           // this.numero_marche = this.addForm2.get("acte_numero_marche").value
            this.addForm2.controls['acte_numero_marche'].setValue(this.actes[i].acte_numero_marche);
            //this.date_info=this.datePipe.transform(this.addForm2.get("acte_date_info").value,'dd/MM/yyyy').toString()
            this.addForm2.controls['acte_date_info'].setValue(dateFormatter(this.actes[i].acte_date_info,"yyyy-MM-dd"));
            //this.description_travaux=this.addForm2.get("acte_description_travaux").value
            this.addForm2.controls['acte_description_travaux'].setValue(this.actes[i].acte_description_travaux);
            //this.numero_compte = this.addForm2.get("acte_numero_compte").value
            this.addForm2.controls['acte_numero_compte'].setValue(this.actes[i].acte_numero_compte);
            //this.banque = this.addForm2.get("acte_banque").value
            this.addForm2.controls['acte_banque'].setValue(this.actes[i].acte_banque);
            //this.numero_agrement = this.addForm2.get("acte_numero_agrement").value
            this.addForm2.controls['acte_numero_agrement'].setValue(this.actes[i].acte_numero_agrement);
            //this.date_expiration = this.datePipe.transform(this.addForm2.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
            this.addForm2.controls['acte_date_expiration'].setValue(dateFormatter(this.actes[i].acte_date_expiration,"yyyy-MM-dd"));
            //this.lots = this.addForm2.get("acte_lots").value
            this.addForm2.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm2.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
            this.addForm2.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm2.controls['acte_type_dem'].setValue("physique");
            this.addForm2.controls['acte_type'].setValue("caution");
            this.addForm2.controls['acte_type_prod'].setValue(15001001);
          }
          if(this.actes[i].acte_type_prod=='15001002'){
            //this.titre=this.addForm.get("acte_titre").value
            this.haveAvanceDemarrage=true;
            this.addForm.controls['acte_arbitrage_num'].setValue(this.actes[i].acte_arbitrage_num);
            this.addForm.controls['acte_titre'].setValue(this.actes[i].acte_titre);
            //this.dao=this.addForm.get("acte_dao").value
            this.addForm.controls['acte_dao'].setValue(this.actes[i].acte_dao);
            //this.beneficiaire =this.addForm.get("acte_beneficiaire").value
            this.addForm.controls['acte_beneficiaire'].setValue(this.actes[i].acte_beneficiaire);
            //this.date = this.datePipe.transform(this.addForm.get("acte_date").value,'dd/MM/yyyy').toString()
            this.addForm.controls['acte_date'].setValue(dateFormatter(this.actes[i].acte_date,"yyyy-MM-dd"));
           // this.numero_marche = this.addForm.get("acte_numero_marche").value
            this.addForm.controls['acte_numero_marche'].setValue(this.actes[i].acte_numero_marche);
            //this.date_info=this.datePipe.transform(this.addForm.get("acte_date_info").value,'dd/MM/yyyy').toString()
            this.addForm.controls['acte_date_info'].setValue(dateFormatter(this.actes[i].acte_date_info,"yyyy-MM-dd"));
            //this.description_travaux=this.addForm.get("acte_description_travaux").value
            this.addForm.controls['acte_description_travaux'].setValue(this.actes[i].acte_description_travaux);
            //this.numero_compte = this.addForm.get("acte_numero_compte").value
            this.addForm.controls['acte_numero_compte'].setValue(this.actes[i].acte_numero_compte);
            //this.banque = this.addForm.get("acte_banque").value
            this.addForm.controls['acte_banque'].setValue(this.actes[i].acte_banque);
            //this.numero_agrement = this.addForm.get("acte_numero_agrement").value
            this.addForm.controls['acte_numero_agrement'].setValue(this.actes[i].acte_numero_agrement);
            //this.date_expiration = this.datePipe.transform(this.addForm.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
            this.addForm.controls['acte_date_expiration'].setValue(dateFormatter(this.actes[i].acte_date_expiration,"yyyy-MM-dd"));
            //this.lots = this.addForm.get("acte_lots").value
            //this.addForm.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
            this.addForm.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm.controls['acte_type_dem'].setValue("physique");
            this.addForm.controls['acte_type'].setValue("caution");
            this.addForm.controls['acte_type_prod'].setValue(15001002);
          }
          if(this.actes[i].acte_type_prod=='15001003'){
            this.havebonneExecution=true;
            //this.titre=this.addForm4.get("acte_titre").value
            this.addForm4.controls['acte_arbitrage_num'].setValue(this.actes[i].acte_arbitrage_num);
            this.addForm4.controls['acte_titre'].setValue(this.actes[i].acte_titre);
            //this.dao=this.addForm4.get("acte_dao").value
            this.addForm4.controls['acte_dao'].setValue(this.actes[i].acte_dao);
            //this.beneficiaire =this.addForm4.get("acte_beneficiaire").value
            this.addForm4.controls['acte_beneficiaire'].setValue(this.actes[i].acte_beneficiaire);
            //this.date = this.datePipe.transform(this.addForm4.get("acte_date").value,'dd/MM/yyyy').toString()
            this.addForm4.controls['acte_date'].setValue(dateFormatter(this.actes[i].acte_date,"yyyy-MM-dd"));
           // this.numero_marche = this.addForm4.get("acte_numero_marche").value
            this.addForm4.controls['acte_numero_marche'].setValue(this.actes[i].acte_numero_marche);
            //this.date_info=this.datePipe.transform(this.addForm4.get("acte_date_info").value,'dd/MM/yyyy').toString()
            this.addForm4.controls['acte_date_info'].setValue(dateFormatter(this.actes[i].acte_date_info,"yyyy-MM-dd"));
            //this.description_travaux=this.addForm4.get("acte_description_travaux").value
            this.addForm4.controls['acte_description_travaux'].setValue(this.actes[i].acte_description_travaux);
            //this.numero_compte = this.addForm4.get("acte_numero_compte").value
            this.addForm4.controls['acte_numero_compte'].setValue(this.actes[i].acte_numero_compte);
            //this.banque = this.addForm4.get("acte_banque").value
            this.addForm4.controls['acte_banque'].setValue(this.actes[i].acte_banque);
            //this.numero_agrement = this.addForm4.get("acte_numero_agrement").value
            this.addForm4.controls['acte_numero_agrement'].setValue(this.actes[i].acte_numero_agrement);
            //this.date_expiration = this.datePipe.transform(this.addForm4.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
            this.addForm4.controls['acte_date_expiration'].setValue(dateFormatter(this.actes[i].acte_date_expiration,"yyyy-MM-dd"));
            //this.lots = this.addForm4.get("acte_lots").value
            this.addForm4.controls['acte_date_fin_garantie'].setValue(dateFormatter(this.actes[i].acte_date_fin_garantie,"yyyy-MM-dd"));
            this.addForm4.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm4.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
            this.addForm4.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm4.controls['acte_type_dem'].setValue("physique");
            this.addForm4.controls['acte_type'].setValue("caution");
            this.addForm4.controls['acte_type_prod'].setValue(15001003);

          }
          if(this.actes[i].acte_type_prod=='15001004'){
            this.haveretenueGarantie=true;
            //this.titre=this.addForm5.get("acte_titre").value
            this.addForm5.controls['acte_arbitrage_num'].setValue(this.actes[i].acte_arbitrage_num);
            this.addForm5.controls['acte_titre'].setValue(this.actes[i].acte_titre);
            //this.dao=this.addForm5.get("acte_dao").value
            this.addForm5.controls['acte_dao'].setValue(this.actes[i].acte_dao);
            //this.beneficiaire =this.addForm5.get("acte_beneficiaire").value
            this.addForm5.controls['acte_beneficiaire'].setValue(this.actes[i].acte_beneficiaire);
            //this.date = this.datePipe.transform(this.addForm5.get("acte_date").value,'dd/MM/yyyy').toString()
            this.addForm5.controls['acte_date'].setValue(dateFormatter(this.actes[i].acte_date,"yyyy-MM-dd"));
           // this.numero_marche = this.addForm5.get("acte_numero_marche").value
            this.addForm5.controls['acte_numero_marche'].setValue(this.actes[i].acte_numero_marche);
            //this.date_info=this.datePipe.transform(this.addForm5.get("acte_date_info").value,'dd/MM/yyyy').toString()
            this.addForm5.controls['acte_date_info'].setValue(dateFormatter(this.actes[i].acte_date_info,"yyyy-MM-dd"));
            //this.description_travaux=this.addForm5.get("acte_description_travaux").value
            this.addForm5.controls['acte_description_travaux'].setValue(this.actes[i].acte_description_travaux);
            //this.numero_compte = this.addForm5.get("acte_numero_compte").value
            this.addForm5.controls['acte_numero_compte'].setValue(this.actes[i].acte_numero_compte);
            //this.banque = this.addForm5.get("acte_banque").value
            this.addForm5.controls['acte_banque'].setValue(this.actes[i].acte_banque);
            //this.numero_agrement = this.addForm5.get("acte_numero_agrement").value
            this.addForm5.controls['acte_numero_agrement'].setValue(this.actes[i].acte_numero_agrement);
            //this.date_expiration = this.datePipe.transform(this.addForm5.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
            this.addForm5.controls['acte_date_expiration'].setValue(dateFormatter(this.actes[i].acte_date_expiration,"yyyy-MM-dd"));
            //this.lots = this.addForm5.get("acte_lots").value
            //this.date_fin_garantie = this.datePipe.transform(this.addForm4.get("acte_date_fin_garantie").value,'dd/MM/yyyy').toString()
           
            this.addForm5.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm5.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
            this.addForm5.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm5.controls['acte_type_dem'].setValue("physique");
            this.addForm5.controls['acte_type'].setValue("caution");
            this.addForm5.controls['acte_type_prod'].setValue(15001004);
          }
          if(this.actes[i].acte_type_prod=='15001005'){
            this.haveDefinitive=true;
            //this.titre=this.addForm3.get("acte_titre").value
            this.addForm3.controls['acte_arbitrage_num'].setValue(this.actes[i].acte_arbitrage_num);
            this.addForm3.controls['acte_titre'].setValue(this.actes[i].acte_titre);
            //this.dao=this.addForm3.get("acte_dao").value
            this.addForm3.controls['acte_dao'].setValue(this.actes[i].acte_dao);
            //this.beneficiaire =this.addForm3.get("acte_beneficiaire").value
            this.addForm3.controls['acte_beneficiaire'].setValue(this.actes[i].acte_beneficiaire);
            //this.date = this.datePipe.transform(this.addForm3.get("acte_date").value,'dd/MM/yyyy').toString()
            this.addForm3.controls['acte_date'].setValue(dateFormatter(this.actes[i].acte_date,"yyyy-MM-dd"));
           // this.numero_marche = this.addForm3.get("acte_numero_marche").value
            this.addForm3.controls['acte_numero_marche'].setValue(this.actes[i].acte_numero_marche);
            //this.date_info=this.datePipe.transform(this.addForm3.get("acte_date_info").value,'dd/MM/yyyy').toString()
            this.addForm3.controls['acte_date_info'].setValue(dateFormatter(this.actes[i].acte_date_info,"yyyy-MM-dd"));
            //this.description_travaux=this.addForm3.get("acte_description_travaux").value
            this.addForm3.controls['acte_description_travaux'].setValue(this.actes[i].acte_description_travaux);
            //this.numero_compte = this.addForm3.get("acte_numero_compte").value
            this.addForm3.controls['acte_numero_compte'].setValue(this.actes[i].acte_numero_compte);
            //this.banque = this.addForm3.get("acte_banque").value
            this.addForm3.controls['acte_banque'].setValue(this.actes[i].acte_banque);
            //this.numero_agrement = this.addForm3.get("acte_numero_agrement").value
            this.addForm3.controls['acte_numero_agrement'].setValue(this.actes[i].acte_numero_agrement);
            //this.date_expiration = this.datePipe.transform(this.addForm3.get("acte_date_expiration").value,'dd/MM/yyyy').toString()
            this.addForm3.controls['acte_date_expiration'].setValue(dateFormatter(this.actes[i].acte_date_expiration,"yyyy-MM-dd"));
            //this.lots = this.addForm3.get("acte_lots").value
            this.addForm3.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm3.controls['acte_dem_num'].setValue(this.demandePhysique.dem_persnum);
            this.addForm3.controls['acte_lots'].setValue(this.actes[i].acte_lots);
            this.addForm3.controls['acte_type_dem'].setValue("physique");
            this.addForm3.controls['acte_type'].setValue("caution");
            this.addForm3.controls['acte_type_prod'].setValue(15001005);
          }
      }
      });
  }
  getProspectById(id) {
    this.prospectService.getProspectByNumero(id)
      .subscribe((data: any) => {
        this.prospect = data as Prospect;
        this.clients=(this.prospect.prospc_prenom+" "+this.prospect.prospc_nom).toString();
        this.adresse_client=this.prospect.prospc_adressenumero+" "+this.prospect.prospc_adresserue+"  "+this.prospect.prospc_adresseville;
       
      });
  }

}
