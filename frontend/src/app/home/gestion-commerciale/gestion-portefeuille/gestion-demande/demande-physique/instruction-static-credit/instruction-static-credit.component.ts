import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
//import { Dem_Pe } from '../../../../../../model/Dem_Pers';
import { Dem_Pers } from '../../../../../../model/dem_Pers';
import { TransfertDataService } from '../../../../../../services/transfertData.service';
import { saveAs } from 'file-saver';

import type from '../../../../../data/type.json'

import { DatePipe } from '@angular/common';
import { DemandesocieteService } from '../../../../../../services/demandesociete.service';
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
import { DemandephysiqueService } from '../../../../../../services/demandephysique.service';
import { InstructionService } from '../../../../../../services/instruction.service';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { TransfertData2Service } from '../../../../../../services/transfert-data2.service';
import { ProspectService } from '../../../../../../services/prospect.service';
import { Instruction } from '../../../../../../model/Instruction';
import { Prospect } from '../../../../../../model/Prospect';
import { ClassificationSecteur } from '../../../../../../model/ClassificationSecteur';
import { Produit } from '../../../../../../model/Produit';
import { ProduitService } from '../../../../../../services/produit.service';
import { ClassificationSecteurService } from '../../../../../../services/classification-secteur.service';
import { CategorieSocioprofessionnelleService } from '../../../../../../services/categorieSocioProfessionnelle.service';
import { CategorieSocioprofessionnelle } from '../../../../../../model/CategorieSocioprofessionnelle';

@Component({
  selector: 'ngx-instruction-static-credit',
  templateUrl: './instruction-static-credit.component.html',
  styleUrls: ['./instruction-static-credit.component.scss']
})
export class InstructionStaticCreditComponent implements OnInit {

  demPerss: Dem_Pers;
  client: Client;
  autorisation = [];
  numInstruction:number;

  constructor(private fb: FormBuilder,private transfertData: TransfertDataService,private demPhysiqueService:DemandephysiqueService,
    private datePipe: DatePipe,private router: Router,private clientService: ClientService,private authService: NbAuthService,
    private userService: UserService,private policeService:PoliceService,private engagementService:EngagementService,
    private mainLeveService : MainLeveService,private quittanceService : QuittanceService,private formatNumberService: FormatNumberService,
    private instructionService:InstructionService,private toastrService: NbToastrService,private transfertData2: TransfertData2Service,
    private prospectService:ProspectService,private produitService:ProduitService,private secteurService:ClassificationSecteurService,
    private categorieSocioprofessionnelleService:CategorieSocioprofessionnelleService
    ) { }


  ngOnInit(): void {
    
    let data =[]
    data=this.transfertData.getData()
    if(data!=null){
      this.demPerss = data[0];
      if(this.demPerss.dem_typeclientpers=="CL"){
        this.getCientById(this.demPerss.dem_typetitulaire);
        console.log("client",this.demPerss.dem_typetitulaire);
      }else{
        this.prospect=data[1];
        console.log(this.prospect,"prospect")
        console.log("prospect",this.demPerss.dem_typetitulaire);

        this.anneerelation = this.datePipe.transform(this.prospect.prospc_date_relation,'yyyy');
        this.nomgerant=this.prospect.prospc_prenom+" "+this.prospect.prospc_nom;;
        this.denomminationsociale=this.prospect.prospc_prenom+" "+this.prospect.prospc_nom;;
        this.policenumero=this.demPerss.dem_persnum;
        this.avancedemarrage=this.prospect.prospc_adressenumero+" "+this.prospect.prospc_adresserue+"  "+this.prospect.prospc_adresseville;
        this.bonneexcution=this.prospect.prospc_adressenumero+" "+this.prospect.prospc_adresserue+"  "+this.prospect.prospc_adresseville;
        this.retenuegarantie="";
        if(this.prospect.prospc_portable!=null){
          this.retenuegarantie=this.retenuegarantie+this.prospect.prospc_portable+"/";
        }
        if(this.prospect.prospc_telephone1!=null){
          this.retenuegarantie=this.retenuegarantie+this.prospect.prospc_telephone1+"/"
        }
        if(this.prospect.prospc_telephone2!=null){
          this.retenuegarantie=this.retenuegarantie+this.prospect.prospc_telephone2
        }
        this.temp1=this.temp2=this.temp3=this.temp4=this.temp5=0;
        this.tempmainLeve=this.ml1=this.ml2=this.ml3=this.ml4=this.ml5=0;
        this.primenette=this.primettc=this.fed=this.taxeAssurance=0;
        this.definitive=this.getCategorieSocioProfessionnelle(this.prospect.prospc_categosocioprof)
      }
      //this.client=data[1];
      console.log('demande',this.demPerss);
      //console.log('client',this.client);
      this.titre = "Ajout informations instruction"
    }/*else{
      let data=[]
      data = this.transfertData2.getData()
      this.demPerss =  data[0];
      this.numInstruction = data[1];
      if(this.demPerss.dem_typeclientpers=="CL"){
        this.getCientById(this.demPerss.dem_typetitulaire);
      }else{
        this.getProspectById(this.demPerss.dem_typetitulaire);
      }



      
      console.log("instruction,",this.numInstruction)
      this.getInstructionbyNum(this.numInstruction)
      this.haveInstruction=true;
      this.titre="Modification instruction"
    }*/
    
    this.onGetAllProduit();
    //this.onGetAllClassificationSecteurs();
    //this.definitive=this.onGetAllClassificationSecteursP();
    //this.definitive= this.getCategorieSocioProfessionnelle(this.demPerss.dem_categorie)
    this.c1=this.demPerss.dem_produitdemande1;
    
    console.log('demande',this.demPerss);
    console.log('client',this.client);
   
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.login = token.getPayload();
          this.userService.getUser(this.login.sub)
            .subscribe((data: User) => {

              this.user = data;

              let user = JSON.stringify(this.user);
              this.nom = this.user.util_nom.toUpperCase();
              this.prenom = this.user.util_prenom;
              if(this.user.util_profil=="Administrateur Général" || this.user.util_profil=="analyste risque" ||  this.user.util_profil=="analyste risque" || this.user.util_profil=="Agent arbitrage")  {
                this.candidateToModifyInstruct=true;
              } 
                        
            })
        }
      })

    
    this.demandeur=this.demPerss.dem_prenom+"  "+this.demPerss.dem_nom+"  ";
    
    this.listTypeSociete = this.jsonTypeSociete['TYPE_SOCIETE'];
    console.log("typesociete",this.listTypeSociete)
    this.raisonsociale =  "Client physique" ;
    
    //this.mainLeve=this.ml1+this.ml2+this.ml3+this.ml4+this.ml5;
    if(this.demPerss.dem_typetitulaire=="CL"){
      console.log("entree");
      //this.onGetAllDemandePhyClient(this.demPerss.dem_clienttitulaire);
    }else{
      //this.onGetAllDemandePhyProspect(this.demPerss.dem_clienttitulaire);
    }
    this.addForm.controls['instruct_encours_demande'].setValue(this.demPerss.dem_montant);
    this.soumission=this.demPerss.dem_montant;
    ;
    /*if(this.demPerss.dem_produitdemande1==15001001){
      this.soumission= this.demPerss.dem_montant 
    }else if(this.demPerss.dem_produitdemande2==15001001){
      this.soumission= this.demPerss.dem_montant2 
    }else if(this.demPerss.dem_produitdemande3==15001001){
      this.soumission= this.demPerss.dem_montant3 
    }else{
      this.soumission=0
    }
    //avance de démarrage
    if(this.demPerss.dem_produitdemande1==15001002){
      this.avancedemarrage= this.demPerss.dem_montant 
    }else if(this.demPerss.dem_produitdemande2==15001002){
      this.avancedemarrage= this.demPerss.dem_montant2 
    }else if(this.demPerss.dem_produitdemande3==15001002){
      this.avancedemarrage= this.demPerss.dem_montant3 
    }else{
      this.avancedemarrage=0
    }

    // bonne execution

    if(this.demPerss.dem_produitdemande1==15001003){
      this.bonneexcution= this.demPerss.dem_montant 
    }else if(this.demPerss.dem_produitdemande2==15001003){
      this.bonneexcution= this.demPerss.dem_montant2 
    }else if(this.demPerss.dem_produitdemande3==15001003){
      this.bonneexcution= this.demPerss.dem_montant3 
    }else{
      this.bonneexcution=0
    }

    //retenue de garantie

    if(this.demPerss.dem_produitdemande1==15001004){
      this.retenuegarantie= this.demPerss.dem_montant 
    }else if(this.demPerss.dem_produitdemande2==15001004){
      this.retenuegarantie= this.demPerss.dem_montant2 
    }else if(this.demPerss.dem_produitdemande3==15001004){
      this.retenuegarantie= this.demPerss.dem_montant3 
    }else{
      this.retenuegarantie=0
    }


    //définitive

    if(this.demPerss.dem_produitdemande1==15001005){
      this.definitive= this.demPerss.dem_montant 
    }else if(this.demPerss.dem_produitdemande2==15001005){
      this.definitive= this.demPerss.dem_montant2 
    }else if(this.demPerss.dem_produitdemande3==15001005){
      this.definitive= this.demPerss.dem_montant3 
    }else{
      this.definitive=0;
    }*/
    
    //this.cmttotale=this.soumission+ this.avancedemarrage + this.bonneexcution + this.retenuegarantie + this.definitive
    this.typeinstruction = this.demPerss.dem_produitdemande1.toString()[0]+this.demPerss.dem_produitdemande1.toString()[1];
    console.log(this.typeinstruction);
    console.log(this.tempmainLeve,'totalmainleve')
    //this.temp6=this.temp1+this.temp2+this.temp3+this.temp4+this.temp5-this.tempmainLeve;
    //this.c2= (this.produitss.find(p => p.prod_numero == this.demPerss.dem_produitdemande1))?.prod_denominationlong
    this.onGetAllInstructionByDemandeTypeDemande(this.demPerss.dem_persnum,"physique");
  }
  
  addForm = this.fb.group({

    //presentation description début
    instruct_description: ['', [Validators.required]],
    //présentation description fin
    //presentation societé début
    instruct_present_societe: ['', [Validators.required]],
    //présentation société fin
    //activités client début
    instruct_activites_client: ['', [Validators.required]],
    //activités client fin
    //activités client début
    //risques liés à l'activité début
    instruct_risques_activite: ['', [Validators.required]],
    //risques liés à l'activité fin: ['', [Validators.required]],
    //activités client fin
    
    //Interet dossier debut
    //instruct_interetdossier:['', [Validators.required]],
    //interet dossoer fin
    //conclusion début
    instruct_conclusion:['', [Validators.required]],
    //conclusion fin
    //Caractéristique de l'opération assurée début
    instruct_objet:['', [Validators.required]],
    instruct_encours_demande:['', [Validators.required]],
    instruct_duree_credit:['90', [Validators.required]],
    instruct_condition_paiement:['', [Validators.required]],
    //Caractéristique de l'opération assurée fin
    //taux acompte début
    instruct_taux:['', [Validators.required]],
    //taux acompte fin
    //type de couverture début
    instruct_type_couverture:['Revolving', [Validators.required]],
    //type de converture fin
    //reconduction couverture début
    instruct_reconduction_couverture:['', [Validators.required]],
    //reconduction couverture fin
    //Délai de carence début
    instruct_delai_carence:['', [Validators.required]],
    //Délai de carence fin
    instruct_delai_idem:['', [Validators.required]],
    instruct_sanction:['', [Validators.required]],
    instruct_effet:['', [Validators.required]],
    instruct_caducite:['', [Validators.required]],
    instruct_disposition:['', [Validators.required]],
    instruct_demande: [''],
    instruct_type: [''],
    instruct_type_dem: [''],
    reference:[],
    instruct_num:[],
    instruct_memo:['', [Validators.required]]
    
  });

  refForm = this.fb.group({

    //Références techniques début
    identification: ['', [Validators.required]],
    beneficiaires: ['', [Validators.required]],
    montant_marche: ['', [Validators.required]],
    observation: ['', [Validators.required]],
    //Références techniques fin
    

  })
  
 
  typeinstruction
  demandeur
  raisonsociale
  anneerelation;
  soumission;
  avancedemarrage
  bonneexcution
  retenuegarantie
  definitive
  cmttotale
  nomgerant
  soumissionencours  ;
  temp1=0;
  
  avancedemarrageencours ;
  temp2=0;
  bonneexecutionencours;
  temp3=0
  retenuegarantieencours ;
  temp4=0
  definitiveencours;
  temp5=0
  cmttotaleencours ;
  temp6=0
  policenumero ;
  denomminationsociale ;
  objetavenant ;
  datesoucription ;
  beneficiaire;  
  montantavenant;
  produitpourcent;
  produitpourcent2=0;
  produitpourcent3=0;
  presentationgenerale;
  presentationtechnique;
  referenceTech : ReferenceTech[]=[];
  reference;
  interetdossier
  conclusion
  polices:Police[];
  engagements:Engagement[];
  produitPolice;
  mainLeves:MainLeve[];
  tempmainLeve=0;
  mainLeve;
  quittance:Quittance;
  primenette=0;
  primettc=0;
  taxeAssurance=0;
  fed=0;
  date;
  c1;
  c2;
  c3;
  c4;
  formatMontant: Number;
  ml1;
  ml2;
  ml3;
  ml4;
  ml5;
  references :String[]=[];
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';
  instruction:Instruction
  haveInstruction=false;
  titre=""
  classificationSecteurs: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();
  prospect:Prospect
  aviscommerciale
  avisaarbitrage
  categorieSocioprofessionnelle:CategorieSocioprofessionnelle;
  
  instructionByDemandeTypeDemande:Instruction[]
  candidateToModifyInstruct=false;


  login: any;
  user: User;
  prenom;
  nom;

  produitss: Array<Produit> = new Array<Produit>();
  classifications: Array<ClassificationSecteur> = new Array<ClassificationSecteur>();

  listTypeSociete: any[];
  @Input() jsonTypeSociete: any[] = type;
  

  
  onExportConditionInstruction(demande:Dem_Pers) {
    
    //this.produitPolice=this.polices.find(police=>police.poli_numero==this.addForm.get("instruct_police").value).poli_codeproduit
    //console.log("code produit police",this.produitPolice)
    //this.getAllEngagementByPolice(this.addForm.get("instruct_police").value);
    //this.getQuittanceBynumPolice(this.addForm.get("instruct_police").value);
    this.date=this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    //this.fed = this.addForm.get("instruct_fed").value   
    //this.temp6=this.temp1+this.temp2+this.temp3+this.temp4+this.temp5-this.tempmainLeve;
   
    this.objetavenant =this.addForm.get("instruct_objet").value;
    /*this.datesoucription = this.addForm.get("instruct_date_souscript").value ;
    this.beneficiaire =this.addForm.get("instruct_beneficiaire").value;*/
    this.datesoucription = "" ;
    this.beneficiaire ="";
    /*if(this.produitPolice==15001001){
      this.montantavenant = this.soumission
    }else if(this.produitPolice==15001002){
      this.montantavenant = this.avancedemarrage
    }else if(this.produitPolice==15001003){
      this.montantavenant = this.bonneexcution;
    }
    else if(this.produitPolice==15001004){
      this.montantavenant = this.retenuegarantie
    }
    else if(this.produitPolice==15001005){
      this.montantavenant = this.definitive
    }*/
    this.montantavenant=this.demPerss.dem_montant;
    
  
    
    //this.montantavenant = this.addForm.get("instruct_montant_avenant").value;
    
    this.produitpourcent2 =0;
    this.produitpourcent3 =0;
    console.log("verifier montant  avenan",this.produitpourcent);
   
    
    this.interetdossier = "";
    this.conclusion = this.addForm.get("instruct_conclusion").value;
    //this.policenumero = this.addForm.get("instruct_police").value+"/"+ this.demPerss.dem_socnum;
    //console.log(this.demSoctBytitulaireCl);
    let prenomnom = this.prenom+"  "+this.nom;
   
    
    
    //this.temp6=this.temp1+this.temp2+this.temp3+this.temp4+this.temp5-this.tempmainLeve;
    
    //console.log(" numero client",demande.dem_typeclientpers);
    
    
    
    
    console.log("teste",this.policenumero , this.denomminationsociale ,this.objetavenant ,this.datesoucription ,this.beneficiaire)
    console.log('client',this.client)


    //formdata

    //let titleNew = this.title.replace(/ /g, "_");
    //let demandeurNew = this.demandeur.replace(/ /g, "_");
    this.soumissionencours=this.demPerss.dem_montant,
    this.avancedemarrageencours=this.addForm.get("instruct_description").value;
    this.bonneexecutionencours=this.addForm.get("instruct_present_societe").value ;
    this.retenuegarantieencours = this.addForm.get("instruct_activites_client").value ;
    this.definitiveencours= this.addForm.get("instruct_risques_activite").value ;
    console.log("temp",this.temp1,this.temp2,this.temp3,this.temp4,this.temp5);
    //this.cmttotaleencours = this.soumissionencours+this.avancedemarrageencours+this.bonneexecutionencours+this.retenuegarantieencours+this.definitiveencours;
    let c11 = this.primenette;
    this.c1=this.demPerss.dem_produitdemande1;
    //this.c2= (this.produitss.find(p => p.prod_numero == this.demPerss.dem_produitdemande1))?.prod_denominationlong
    let c33 = (c11+Number(this.fed))*0.1;
    
    let c44 =c11+Number(this.fed)+c33;
    this.c4=c44;
    
    console.log( this.ml2);
    //console.log( this.ml3);
    console.log( this.ml4);
    console.log( this.ml5);
    this.ml1=this.addForm.get("instruct_taux").value*this.demPerss.dem_montant/100 ;
    this.c3=this.demPerss.dem_montant- this.addForm.get("instruct_taux").value*this.demPerss.dem_montant/100 ;;
    let ml11 = this.addForm.get("instruct_taux").value;
    this.ml2 = this.addForm.get("instruct_type_couverture").value
    this.ml3=this.addForm.get("instruct_reconduction_couverture").value ;
    console.log("ml3 verification",this.ml3)
    this.demPerss.dem_montant2=this.addForm.get("instruct_duree_credit").value;
    this.demPerss.dem_montant3=this.addForm.get("instruct_condition_paiement").value;
    if(this.addForm.get("instruct_duree_credit").value<=30){
      this.ml5="0,6%";
    }else if(this.addForm.get("instruct_duree_credit").value<=60){
      this.ml5="1%";
    } else if(this.addForm.get("instruct_duree_credit").value<=90){
      this.ml5="1,5%";
    }else if(this.addForm.get("instruct_duree_credit").value>90 && this.addForm.get("instruct_duree_credit").value<180){
      this.ml5="2%";
    }else if(this.addForm.get("instruct_duree_credit").value==210){
      this.ml5="2,5%";
    }else if(this.addForm.get("instruct_duree_credit").value==240){
      this.ml5="3%";
    }else if(this.addForm.get("instruct_duree_credit").value==270){
      this.ml5="3,5%"
    }else if(this.addForm.get("instruct_duree_credit").value==300){
      this.ml5="4%";
    }else if(this.addForm.get("instruct_duree_credit").value==330){
      this.ml5="4,5%";
    }else if(this.addForm.get("instruct_duree_credit").value==365){
      this.ml5="5%";
    }else{
      this.ml5="nombre de jours erroné"
    }
    this.anneerelation = this.addForm.get("instruct_delai_carence").value;
    this.cmttotale = this.addForm.get("instruct_delai_idem").value;
    this.cmttotaleencours = this.addForm.get("instruct_sanction").value;
    this.presentationgenerale = this.addForm.get("instruct_effet").value;
    this.presentationtechnique = this.addForm.get("instruct_caducite").value;
    this.produitpourcent = this.addForm.get("instruct_disposition").value;
    let ml44=this.ml4;
    let ml55=this.ml5;
    this.mainLeve = this.ml1+this.ml2+this.ml3+this.ml4+this.ml5;
    
    //
    //this.referenceTech=[{ref},{ref}]:
    //this.referenceTech.push(ref);
    this.reference=this.referenceTech;
    //console.log("ref",ref);
    console.log("reference",this.reference);
    console.log("referencetech",this.referenceTech);
    
    this.addForm.controls['instruct_demande'].setValue(this.demPerss.dem_persnum)
    this.addForm.controls['instruct_type'].setValue('credit')
    this.addForm.controls['instruct_type_dem'].setValue('physique')
  
    //reference.add(new ReferenceTech("Acquisition2","Beneficiaire1"));
    //reference.add(new ReferenceTech("Acquisition2","Acquisition"));
    this.formatMontant =  this.formatNumberService.numberWithCommas2(this.temp1)
    this.avisaarbitrage=this.addForm.get("instruct_memo").value;
    this.aviscommerciale=this.demPerss.dem_commentaire;
    const form = new FormData();
    /*form.append('title', titleNew);
    form.append('demandeur', demandeurNew);*/
    form.append("demandeur", prenomnom);
		form.append("raisonsociale", this.raisonsociale);
		form.append("anneerelation", this.anneerelation);
		form.append("soumission",this.formatNumberService.numberWithCommas2(this.soumission)+" FCFA") ;
		form.append("avancedemarrage",this.formatNumberService.numberWithCommas2(this.avancedemarrage));
		form.append("bonneexcution",this.formatNumberService.numberWithCommas2(this.bonneexcution));
		form.append("retenuegarantie",this.formatNumberService.numberWithCommas2(this.retenuegarantie));
		form.append("nomgerant",this.nomgerant);
		form.append("definitive",this.formatNumberService.numberWithCommas2(this.definitive));
		form.append("cmttotale",this.formatNumberService.numberWithCommas2(this.cmttotale));
		form.append("soumissionencours",this.formatMontant+"");
		form.append("avancedemarrageencours",this.formatNumberService.numberWithCommas2(this.avancedemarrageencours));
		form.append("bonneexecutionencours",this.formatNumberService.numberWithCommas2(this.bonneexecutionencours));
		form.append("retenuegarantieencours",this.formatNumberService.numberWithCommas2(this.retenuegarantieencours));
		form.append("definitiveencours",this.formatNumberService.numberWithCommas2(this.definitiveencours));
		form.append("cmttotaleencours",this.formatNumberService.numberWithCommas2(this.cmttotaleencours));
		form.append("policenumero",this.policenumero);
		form.append("denomminationsociale",this.denomminationsociale);
		form.append("objetavenant",this.objetavenant);
		form.append("datesoucription",this.datesoucription);
		form.append("beneficiaire",this.beneficiaire);
    form.append("montantavenant", this.formatNumberService.numberWithCommas2(this.montantavenant));
    form.append("produitpourcent",this.formatNumberService.numberWithCommas2(this.produitpourcent));
    form.append("presentationgenerale",this.presentationgenerale);
    form.append("presentationtechnique",this.presentationtechnique);
   
    let i=0;
    this.referenceTech.forEach(item => {
      //form.append(`reference`, this.referenceTech);
      form.append(`reference`, item.identification);
      form.append(`reference`, item.beneficiaires);
      form.append(`reference`, item.montant_marche);
      form.append(`reference`, item.observation);
      this.references[i]=item.identification;
      this.references[i+1]=item.beneficiaires
      this.references[i+2]=item.montant_marche;
      this.references[i+3]=item.observation;
      i=i+4;
    });
    
    console.log("alll",form.getAll('reference'));
    this.addForm.controls['reference'].setValue(this.references)
    //formdata
    form.append("interetdossier", this.interetdossier);
    form.append("conclusion", this.conclusion);
    form.append("primenette", this.formatNumberService.numberWithCommas2(this.primenette));
		form.append("primettc", this.formatNumberService.numberWithCommas2(this.primettc)+" FCFA");
    form.append("mainlevee", this.formatNumberService.numberWithCommas2(this.tempmainLeve));
		form.append("taxeassurance", this.formatNumberService.numberWithCommas2(this.mainLeve));
		form.append("fed", this.formatNumberService.numberWithCommas2(this.fed));
		form.append("date", this.date+"");  
    form.append("c1", this.c1);
		form.append("c2", this.c2);
		form.append("c3", this.formatNumberService.numberWithCommas2(this.c3)+" FCFA");
		form.append("c4", this.formatNumberService.numberWithCommas2(this.c4));    
    
    form.append("ml1", "("+ml11+"%) "+ this.formatNumberService.numberWithCommas2(this.ml1)+ " FCFA");
		form.append("ml2", this.formatNumberService.numberWithCommas2(this.ml2));
		form.append("ml3", this.ml3);
		form.append("ml4", ml44);
		form.append("ml5", this.ml5);


    form.append("montantavenent2", this.formatNumberService.numberWithCommas2(this.demPerss.dem_montant2));
		form.append("montantavenent3", this.formatNumberService.numberWithCommas2(this.demPerss.dem_montant3));
		form.append("produitpourcent2", this.formatNumberService.numberWithCommas2(this.produitpourcent2));
		form.append("produitpourcent3", this.formatNumberService.numberWithCommas2(this.produitpourcent3));

    form.append("avisaarbitrage", this.avisaarbitrage);
		form.append("aviscommerciale",this.aviscommerciale);

console.log(form);
    //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
    // this.clientService.generateReportClient(format, title, this.demandeur)
    let message=""
    this.demPhysiqueService.generateReportInstructionCredit1(demande.dem_persnum,form)
    //this.demPhysiqueService.generateReportInstruction(demande.dem_socnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
    .subscribe(event => {
      switch (event.type) {
        case HttpEventType.Sent:
          console.log('Request has been made!');
          break;
        case HttpEventType.ResponseHeader:
          console.log('Response header has been received!');
          if (event.status == 200) {
            console.log(this.addForm.value)
            if(!this.haveInstruction){
              message="et enregistée avec succès !"
              this.instructionService.addInstruction(this.addForm.value)
                .subscribe((data:any) => {

                })
            }else{
              message="et modifiée avec succès !"
              this.instructionService.updateInstruction(this.addForm.value)
              .subscribe((data) => {
                
              })
              }
              demande.dem_statut="analyse juridique";
              demande.dem_montant2=0;
              demande.dem_montant3=0;
              this.demPhysiqueService.update(demande).subscribe(data => {
                
                
                })
            //this.router.navigateByUrl('home/demande-physique');;
            this.toastrService.show(
              'Instruction générée avec succés ! '+message+"le statut de la demande passe à analyse juridique!",
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
          saveAs(event.body, 'instruction.docx');
          this.router.navigateByUrl('home/demande-Physique');
          
      }
    });

}
onExportInstruction(demande:Dem_Pers) {
    
  //this.produitPolice=this.polices.find(police=>police.poli_numero==this.addForm.get("instruct_police").value).poli_codeproduit
  //console.log("code produit police",this.produitPolice)
  //this.getAllEngagementByPolice(this.addForm.get("instruct_police").value);
  //this.getQuittanceBynumPolice(this.addForm.get("instruct_police").value);
  this.date=this.datePipe.transform(new Date(), 'dd/MM/yyyy');
  //this.fed = this.addForm.get("instruct_fed").value   
  //this.temp6=this.temp1+this.temp2+this.temp3+this.temp4+this.temp5-this.tempmainLeve;
 
  this.objetavenant =this.addForm.get("instruct_objet").value;
  /*this.datesoucription = this.addForm.get("instruct_date_souscript").value ;
  this.beneficiaire =this.addForm.get("instruct_beneficiaire").value;*/
  this.datesoucription = "" ;
  this.beneficiaire ="";
  /*if(this.produitPolice==15001001){
    this.montantavenant = this.soumission
  }else if(this.produitPolice==15001002){
    this.montantavenant = this.avancedemarrage
  }else if(this.produitPolice==15001003){
    this.montantavenant = this.bonneexcution;
  }
  else if(this.produitPolice==15001004){
    this.montantavenant = this.retenuegarantie
  }
  else if(this.produitPolice==15001005){
    this.montantavenant = this.definitive
  }*/
  this.montantavenant=this.demPerss.dem_montant;
  

  
  //this.montantavenant = this.addForm.get("instruct_montant_avenant").value;
  
  this.produitpourcent2 =0;
  this.produitpourcent3 =0;
  console.log("verifier montant  avenan",this.produitpourcent);
 
  
  this.interetdossier = "";
  this.conclusion = this.addForm.get("instruct_conclusion").value;
  //this.policenumero = this.addForm.get("instruct_police").value+"/"+ this.demPerss.dem_socnum;
  //console.log(this.demSoctBytitulaireCl);
  let prenomnom = this.prenom+"  "+this.nom;
 
  
  
  //this.temp6=this.temp1+this.temp2+this.temp3+this.temp4+this.temp5-this.tempmainLeve;
  
  //console.log(" numero client",demande.dem_typeclientpers);
  
  
  
  
  console.log("teste",this.policenumero , this.denomminationsociale ,this.objetavenant ,this.datesoucription ,this.beneficiaire)
  console.log('client',this.client)


  //formdata

  //let titleNew = this.title.replace(/ /g, "_");
  //let demandeurNew = this.demandeur.replace(/ /g, "_");
  this.soumissionencours=this.demPerss.dem_montant,
  this.avancedemarrageencours=this.addForm.get("instruct_description").value;
  this.bonneexecutionencours=this.addForm.get("instruct_present_societe").value ;
  this.retenuegarantieencours = this.addForm.get("instruct_activites_client").value ;
  this.definitiveencours= this.addForm.get("instruct_risques_activite").value ;
  console.log("temp",this.temp1,this.temp2,this.temp3,this.temp4,this.temp5);
  //this.cmttotaleencours = this.soumissionencours+this.avancedemarrageencours+this.bonneexecutionencours+this.retenuegarantieencours+this.definitiveencours;
  let c11 = this.primenette;
  this.c1=this.demPerss.dem_produitdemande1;
  //this.c2= (this.produitss.find(p => p.prod_numero == this.demPerss.dem_produitdemande1))?.prod_denominationlong
  let c33 = (c11+Number(this.fed))*0.1;
  
  let c44 =c11+Number(this.fed)+c33;
  this.c4=c44;
  
  console.log( this.ml2);
  //console.log( this.ml3);
  console.log( this.ml4);
  console.log( this.ml5);
  this.ml1=this.addForm.get("instruct_taux").value*this.demPerss.dem_montant/100 ;
  this.c3=this.demPerss.dem_montant- this.addForm.get("instruct_taux").value*this.demPerss.dem_montant/100 ;;
  let ml11 = this.addForm.get("instruct_taux").value;
  this.ml2 = this.addForm.get("instruct_type_couverture").value
  this.ml3=this.addForm.get("instruct_reconduction_couverture").value ;
  console.log("ml3 verification",this.ml3)
  this.demPerss.dem_montant2=this.addForm.get("instruct_duree_credit").value;
  this.demPerss.dem_montant3=this.addForm.get("instruct_condition_paiement").value;
  if(this.addForm.get("instruct_duree_credit").value<=30){
    this.ml5="0,6%";
  }else if(this.addForm.get("instruct_duree_credit").value<=60){
    this.ml5="1%";
  } else if(this.addForm.get("instruct_duree_credit").value<=90){
    this.ml5="1,5%";
  }else if(this.addForm.get("instruct_duree_credit").value>90 && this.addForm.get("instruct_duree_credit").value<180){
    this.ml5="2%";
  }else if(this.addForm.get("instruct_duree_credit").value==210){
    this.ml5="2,5%";
  }else if(this.addForm.get("instruct_duree_credit").value==240){
    this.ml5="3%";
  }else if(this.addForm.get("instruct_duree_credit").value==270){
    this.ml5="3,5%"
  }else if(this.addForm.get("instruct_duree_credit").value==300){
    this.ml5="4%";
  }else if(this.addForm.get("instruct_duree_credit").value==330){
    this.ml5="4,5%";
  }else if(this.addForm.get("instruct_duree_credit").value==365){
    this.ml5="5%";
  }else{
    this.ml5="nombre de jours erroné"
  }
  this.anneerelation = this.addForm.get("instruct_delai_carence").value;
  this.cmttotale = this.addForm.get("instruct_delai_idem").value;
  this.cmttotaleencours = this.addForm.get("instruct_sanction").value;
  this.presentationgenerale = this.addForm.get("instruct_effet").value;
  this.presentationtechnique = this.addForm.get("instruct_caducite").value;
  this.produitpourcent = this.addForm.get("instruct_disposition").value;
  let ml44=this.ml4;
  let ml55=this.ml5;
  this.mainLeve = this.ml1+this.ml2+this.ml3+this.ml4+this.ml5;
  
  //
  //this.referenceTech=[{ref},{ref}]:
  //this.referenceTech.push(ref);
  this.reference=this.referenceTech;
  //console.log("ref",ref);
  console.log("reference",this.reference);
  console.log("referencetech",this.referenceTech);
  
  this.addForm.controls['instruct_demande'].setValue(this.demPerss.dem_persnum)
  this.addForm.controls['instruct_type'].setValue('credit')
  this.addForm.controls['instruct_type_dem'].setValue('physique')

  //reference.add(new ReferenceTech("Acquisition2","Beneficiaire1"));
  //reference.add(new ReferenceTech("Acquisition2","Acquisition"));
  this.formatMontant =  this.formatNumberService.numberWithCommas2(this.temp1)
  this.avisaarbitrage=this.addForm.get("instruct_memo").value;
  this.aviscommerciale=this.demPerss.dem_commentaire;
  const form = new FormData();
  /*form.append('title', titleNew);
  form.append('demandeur', demandeurNew);*/
  form.append("demandeur", prenomnom);
  form.append("raisonsociale", this.raisonsociale);
  form.append("anneerelation", this.anneerelation);
  form.append("soumission",this.formatNumberService.numberWithCommas2(this.soumission)+" FCFA") ;
  form.append("avancedemarrage",this.formatNumberService.numberWithCommas2(this.avancedemarrage));
  form.append("bonneexcution",this.formatNumberService.numberWithCommas2(this.bonneexcution));
  form.append("retenuegarantie",this.formatNumberService.numberWithCommas2(this.retenuegarantie));
  form.append("nomgerant",this.nomgerant);
  form.append("definitive",this.formatNumberService.numberWithCommas2(this.definitive));
  form.append("cmttotale",this.formatNumberService.numberWithCommas2(this.cmttotale));
  form.append("soumissionencours",this.formatMontant+"");
  form.append("avancedemarrageencours",this.formatNumberService.numberWithCommas2(this.avancedemarrageencours));
  form.append("bonneexecutionencours",this.formatNumberService.numberWithCommas2(this.bonneexecutionencours));
  form.append("retenuegarantieencours",this.formatNumberService.numberWithCommas2(this.retenuegarantieencours));
  form.append("definitiveencours",this.formatNumberService.numberWithCommas2(this.definitiveencours));
  form.append("cmttotaleencours",this.formatNumberService.numberWithCommas2(this.cmttotaleencours));
  form.append("policenumero",this.policenumero);
  form.append("denomminationsociale",this.denomminationsociale);
  form.append("objetavenant",this.objetavenant);
  form.append("datesoucription",this.datesoucription);
  form.append("beneficiaire",this.beneficiaire);
  form.append("montantavenant", this.formatNumberService.numberWithCommas2(this.montantavenant));
  form.append("produitpourcent",this.formatNumberService.numberWithCommas2(this.produitpourcent));
  form.append("presentationgenerale",this.presentationgenerale);
  form.append("presentationtechnique",this.presentationtechnique);
 
  let i=0;
  this.referenceTech.forEach(item => {
    //form.append(`reference`, this.referenceTech);
    form.append(`reference`, item.identification);
    form.append(`reference`, item.beneficiaires);
    form.append(`reference`, item.montant_marche);
    form.append(`reference`, item.observation);
    this.references[i]=item.identification;
    this.references[i+1]=item.beneficiaires
    this.references[i+2]=item.montant_marche;
    this.references[i+3]=item.observation;
    i=i+4;
  });
  
  console.log("alll",form.getAll('reference'));
  this.addForm.controls['reference'].setValue(this.references)
  //formdata
  form.append("interetdossier", this.interetdossier);
  form.append("conclusion", this.conclusion);
  form.append("primenette", this.formatNumberService.numberWithCommas2(this.primenette));
  form.append("primettc", this.formatNumberService.numberWithCommas2(this.primettc)+" FCFA");
  form.append("mainlevee", this.formatNumberService.numberWithCommas2(this.tempmainLeve));
  form.append("taxeassurance", this.formatNumberService.numberWithCommas2(this.mainLeve));
  form.append("fed", this.formatNumberService.numberWithCommas2(this.fed));
  form.append("date", this.date+"");  
  form.append("c1", this.c1);
  form.append("c2", this.c2);
  form.append("c3", this.formatNumberService.numberWithCommas2(this.c3)+" FCFA");
  form.append("c4", this.formatNumberService.numberWithCommas2(this.c4));    
  
  form.append("ml1", "("+ml11+"%) "+ this.formatNumberService.numberWithCommas2(this.ml1)+ " FCFA");
  form.append("ml2", this.formatNumberService.numberWithCommas2(this.ml2));
  form.append("ml3", this.ml3);
  form.append("ml4", ml44);
  form.append("ml5", this.ml5);


  form.append("montantavenent2", this.formatNumberService.numberWithCommas2(this.demPerss.dem_montant2));
  form.append("montantavenent3", this.formatNumberService.numberWithCommas2(this.demPerss.dem_montant3));
  form.append("produitpourcent2", this.formatNumberService.numberWithCommas2(this.produitpourcent2));
  form.append("produitpourcent3", this.formatNumberService.numberWithCommas2(this.produitpourcent3));

  form.append("avisaarbitrage", this.avisaarbitrage);
  form.append("aviscommerciale",this.aviscommerciale);

console.log(form);
  //let typesociete = this.listTypeSociete.find(p=>p.id==this.raisonsociale).value;
  // this.clientService.generateReportClient(format, title, this.demandeur)
  let message=""
  this.demPhysiqueService.generateReportInstructionCredit1(demande.dem_persnum,form)
  //this.demPhysiqueService.generateReportInstruction(demande.dem_socnum,this.demandeur,this.raisonsociale,this.anneerelation,15000,15001,15002,15003,"mareme")
  .subscribe(event => {
    switch (event.type) {
      case HttpEventType.Sent:
        console.log('Request has been made!');
        break;
      case HttpEventType.ResponseHeader:
        console.log('Response header has been received!');
        if (event.status == 200) {
          console.log(this.addForm.value)
          /*if(!this.haveInstruction){
            message="et enregistée avec succès !"
            this.instructionService.addInstruction(this.addForm.value)
              .subscribe((data:any) => {

              })
          }else{
            message="et modifiée avec succès !"
            this.instructionService.updateInstruction(this.addForm.value)
            .subscribe((data) => {
              
            })
            }
            demande.dem_statut="analyse juridique";
            demande.dem_montant2=0;
            demande.dem_montant3=0;
            this.demPhysiqueService.update(demande).subscribe(data => {
              
              
              })*/
          //this.router.navigateByUrl('home/demande-physique');;
          this.toastrService.show(
            'Instruction générée avec succés !',
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
        saveAs(event.body, 'instruction.docx');
        this.router.navigateByUrl('home/demande-Physique');
        
    }
  });

}
  
  close(){
    this.router.navigateByUrl('home/demande-Physique');
  }
  tailleRef : boolean=false;
  ajoutReference(){
    let ref: ReferenceTech={
      identification: this.refForm.get("identification").value,
      beneficiaires : this.refForm.get("beneficiaires").value,
      montant_marche : this.refForm.get("montant_marche").value,
      observation:this.refForm.get("observation").value
     
    };
    /*ref.identification="Acquisition1";
    ref.beneficiaire='beneficiaire1'
    this.referenceTech.push(ref);*/
    
    this.referenceTech=[ ...this.referenceTech,...[ref]]
    if(this.referenceTech.length>0){
      this.tailleRef=true;
    }
    this.refForm.controls['identification'].setValue(null);
    this.refForm.controls['beneficiaires'].setValue(null);
    this.refForm.controls['montant_marche'].setValue(null);
    this.refForm.controls['observation'].setValue(null);
  }
  onDeleteRef(ref) {
    const index: number = this.referenceTech.indexOf(ref);
    if (index !== -1) {
      this.referenceTech.splice(index, 1);
      
    }
    if(this.referenceTech.length>0){
      this.tailleRef=true;
    }else{
      this.tailleRef=false;
    }
  }
  onChangeBeneciaire(event){

  }


  onFocusOutEventBeneficiaire(){

  }
  getCientById(id) {
    this.clientService.getClient(id)
      .subscribe((data: any) => {
        this.client = data as Client;
        console.log(this.client,'client');
        //this.anneerelation = this.datePipe.transform(this.client.clien_date_relation,'yyyy');
        this.nomgerant=this.client.clien_princdirigeant;
        console.log("nom gereant",this.nomgerant)
        this.denomminationsociale=this.client.clien_prenom+" "+this.client.clien_nom;;;
        this.getAllpoliceByClient(this.client.clien_numero);
        this.avancedemarrage=this.client.clien_adressenumero+" "+this.client.clien_adresserue+"  "+this.client.clien_adresseville;
        this.bonneexcution=this.client.clien_adressenumero+" "+this.client.clien_adresserue+"  "+this.client.clien_adresseville;
        this.retenuegarantie="";
        if(this.client.clien_portable!=null){
          this.retenuegarantie=this.retenuegarantie+this.client.clien_portable+"/";
        }
        if(this.client.clien_telephone1!=null){
          this.retenuegarantie=this.retenuegarantie+this.client.clien_telephone1+"/"
        }
        if(this.client.clien_telephone2!=null){
          this.retenuegarantie=this.retenuegarantie+this.client.clien_telephone2
        }
        //this.retenuegarantie = this.client.clien_portable+"/"+this.client.clien_telephone1+"/"+this.client.clien_telephone2;
        //this.definitive=this.client.clien_secteur_activite
        this.getCategorieSocioProfessionnelle(this.client.clien_categsocioprof);
        
      });
  }
  verif=0
  getAllpoliceByClient(id) {
    this.policeService.getAllPoliceByClient(id)
      .subscribe((data: any) => {
        this.polices = data as Police[];
        console.log(this.polices,"polices");
        this.policenumero=this.demPerss.dem_persnum
        if(this.polices!=null){
          this.polices.forEach(police=>{
            this.verif++;
            console.log('verifif',this.verif++);
            this.getAllEngagementByPolice(police.poli_numero,police.poli_codeproduit);
            console.log(this.policenumero=police.poli_numero+"/"+ this.policenumero);
            this.getQuittanceBynumPolice(police.poli_numero)
          })
        }else{
          this.temp1=this.temp2=this.temp3=this.temp4=this.temp5=0;
          this.tempmainLeve=this.ml1=this.ml2=this.ml3=this.ml4=this.ml5=0;
          this.primenette=this.primettc=this.fed=this.taxeAssurance=0;
        }
        
        
      });
  }

  getAllEngagementByPolice(id,produitPolice) {
    //this.getQuittanceBynumPolice(id);
    this.engagementService.getAllEngagementsByPolice(id)
      .subscribe((data: any) => {
        this.engagements = data as Engagement[];
        console.log(this.engagements,"engagement");
        this.engagements.forEach(engagement =>{
          
          if(produitPolice==15001001 && engagement.engag_status=="en cours"){
            this.temp1=this.temp1+engagement.engag_kapassure;
            
           }else if(produitPolice==15001002 && engagement.engag_status=="en cours"){
            this.temp2=this.temp2+engagement.engag_kapassure;
            
          }else if(produitPolice==15001003 && engagement.engag_status=="en cours"){
            this.temp3=this.temp3+engagement.engag_kapassure;
            
          }else if(produitPolice==15001004 && engagement.engag_status=="en cours"){
            this.temp4=this.temp4+engagement.engag_kapassure;
            
          }else if(produitPolice==15001005 && engagement.engag_status=="en cours"){
            this.temp5=this.temp5+engagement.engag_kapassure;
            
          }
          
          console.log(engagement.engag_numeroengagement,"numero engement");
          this.getAllMainLeveByengagement(engagement.engag_numeroengagement,produitPolice);
        })
      });
  }

  getAllMainLeveByengagement(id,produitPolice) {
    
    this.mainLeveService.allMainLeveByEngagement(id)
      .subscribe((data: any) => {
        this.mainLeves = data as MainLeve[];
        console.log(this.mainLeves,"mainleves");
          
            for(let i=0;i<this.mainLeves.length;i++){
              this.tempmainLeve=this.tempmainLeve+this.mainLeves[i].mainl_mtnmainlevee;
              if(produitPolice==15001001 ){
               
                this.ml1=this.ml1+this.mainLeves[i].mainl_mtnmainlevee;
               }else if(produitPolice==15001002){
                
                this.ml2=this.ml2+this.mainLeves[i].mainl_mtnmainlevee;
              }else if(produitPolice==15001003){
                
                //this.ml3=this.ml3+this.mainLeves[i].mainl_mtnmainlevee;
              }else if(produitPolice==15001004 ){
                
                this.ml4=this.ml4+this.mainLeves[i].mainl_mtnmainlevee;
              }else if(produitPolice==15001005 ){
                
                this.ml5=this.ml5+this.mainLeves[i].mainl_mtnmainlevee;
              }
            }
          
          console.log('mainleveeengage',this.tempmainLeve,this.ml1,this.ml2,this.ml3,this.ml4,this.ml5)
          console.log(this.tempmainLeve,'totalmainleve')
      });
  }
  getQuittanceBynumPolice(id) {
    this.quittanceService.getQuittanceByNuymPolice(id)
      .subscribe((data: any) => {
        this.quittance = data as Quittance;
         console.log(this.quittance);
        this.primenette = this.primenette+this.quittance.quit_primenette;
        this.primettc = this.primettc+this.quittance.quit_primettc;
        this.taxeAssurance =this.taxeAssurance+ this.quittance.quit_mtntaxete;
        this.fed = this.fed+this.quittance.quit_accessoirecompagnie+this.quittance.quit_accessoireapporteur;
      });
  }
  formatNumer(num){
    return this.formatNumberService.numberWithCommas2(num);
  }
  onGetAllProduit(){
    this.produitService.getAllProduits()
      .subscribe((data: Produit[]) => {
      this.produitss = data as Produit[];
      this.c2= (this.produitss.find(p => p.prod_numero == this.demPerss.dem_produitdemande1))?.prod_denominationlong
    });
  }

  onGetAllClassificationSecteurs(client) {
    this.secteurService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data as ClassificationSecteur[];
        this.definitive = this.classifications.find(p=>p.code==client.clien_categsocioprof).libelle;
        console.log("definitivelibele",this.definitive)
        
      })
  }
  onGetAllClassificationSecteursProspect(prospect) {
    this.secteurService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data as ClassificationSecteur[];
        this.definitive = this.classifications.find(p=>p.code==this.prospect.prospc_categosocioprof).libelle;
        console.log("definitivelibele",this.definitive)
        
      })
  }
  onGetAllClassificationSecteursP() {
    this.secteurService.getAllClassificationSecteur()
      .subscribe((data: ClassificationSecteur[]) => {
        this.classifications = data as ClassificationSecteur[];
        this.definitive = this.classifications.find(p=>p.code==this.demPerss.dem_secteuractivites).libelle;
        console.log("definitivelibele",this.definitive)
        
      })
  }

  getInstructionbyNum(num){
    this.instructionService.getInstructionById(num)
    .subscribe((data: Instruction) => {
        this.instruction= data as Instruction;
        
        console.log("instruction",this.instruction);
        this.addForm.controls['instruct_description'].setValue(this.instruction.instruct_description);
        this.addForm.controls['instruct_present_societe'].setValue(this.instruction.instruct_present_societe);
        this.addForm.controls['instruct_activites_client'].setValue(this.instruction.instruct_activites_client);
        this.addForm.controls['instruct_risques_activite'].setValue(this.instruction.instruct_risques_activite);
        this.addForm.controls['instruct_conclusion'].setValue(this.instruction.instruct_conclusion);
        this.addForm.controls['instruct_objet'].setValue(this.instruction.instruct_objet);
        this.addForm.controls['instruct_encours_demande'].setValue(this.instruction.instruct_encours_demande);
        this.addForm.controls['instruct_duree_credit'].setValue(this.instruction.instruct_duree_credit);
        this.addForm.controls['instruct_condition_paiement'].setValue(this.instruction.instruct_condition_paiement);
        this.addForm.controls['instruct_taux'].setValue(this.instruction.instruct_taux);
        this.addForm.controls['instruct_type_couverture'].setValue(this.instruction.instruct_type_couverture);
        this.addForm.controls['instruct_reconduction_couverture'].setValue(this.instruction.instruct_reconduction_couverture);
        this.addForm.controls['instruct_delai_carence'].setValue(this.instruction.instruct_delai_carence);
        this.addForm.controls['instruct_delai_idem'].setValue(this.instruction.instruct_delai_idem);
        this.addForm.controls['instruct_sanction'].setValue(this.instruction.instruct_sanction);
        this.addForm.controls['instruct_effet'].setValue(this.instruction.instruct_effet);
        this.addForm.controls['instruct_caducite'].setValue(this.instruction.instruct_caducite);
        this.addForm.controls['instruct_disposition'].setValue(this.instruction.instruct_disposition);
        this.addForm.controls['instruct_demande'].setValue(this.instruction.instruct_demande);
        this.addForm.controls['instruct_type'].setValue(this.instruction.instruct_type);
        this.addForm.controls['instruct_type_dem'].setValue(this.instruction.instruct_type_dem);
        this.addForm.controls['instruct_num'].setValue(this.instruction.instruct_num);
        this.addForm.controls['instruct_memo'].setValue(this.instruction.instruct_memo);
        let i=0;
        this.tailleRef=true;
        while(i<this.instruction.reference.length){
          let ref: ReferenceTech={
            identification: this.instruction.reference[i].toString(),
            beneficiaires : this.instruction.reference[i+1].toString(),
            montant_marche : this.instruction.reference[i+2].toString(),
            observation:this.instruction.reference[i+3].toString()
            
          };
          i=i+4;
          /*ref.identification="Acquisition1";
          ref.beneficiaire='beneficiaire1'
          this.referenceTech.push(ref);*/
          
          this.referenceTech=[ ...this.referenceTech,...[ref]]
        }
    }); 
   }

   onGetSecteurByCode(code:number){
    //console.log((this.classificationSecteurs.find(c => c.code === code))?.libelle );
   return  (this.classificationSecteurs.find(c => c.code === code))?.libelle ;       
 }

 getProspectById(id) {
  this.prospectService.getProspectByNumero(id)
    .subscribe((data: any) => {
      this.prospect = data as Prospect;
      this.anneerelation = this.datePipe.transform(this.prospect.prospc_date_relation,'yyyy');
      this.nomgerant=this.prospect.prospc_prenom+" "+this.prospect.prospc_nom;;
      this.denomminationsociale=this.prospect.prospc_prenom+" "+this.prospect.prospc_nom;;
      this.policenumero=this.demPerss.dem_persnum;
      this.avancedemarrage=this.prospect.prospc_adressenumero+" "+this.prospect.prospc_adresserue+"  "+this.prospect.prospc_adresseville;
      this.bonneexcution=this.prospect.prospc_adressenumero+" "+this.prospect.prospc_adresserue+"  "+this.prospect.prospc_adresseville;
      this.retenuegarantie="";
      if(this.prospect.prospc_portable!=null){
        this.retenuegarantie=this.retenuegarantie+this.prospect.prospc_portable+"/";
      }
      if(this.prospect.prospc_telephone1!=null){
        this.retenuegarantie=this.retenuegarantie+this.prospect.prospc_telephone1+"/"
      }
      if(this.prospect.prospc_telephone2!=null){
        this.retenuegarantie=this.retenuegarantie+this.prospect.prospc_telephone2
      }
      this.temp1=this.temp2=this.temp3=this.temp4=this.temp5=0;
      this.tempmainLeve=this.ml1=this.ml2=this.ml3=this.ml4=this.ml5=0;
      this.primenette=this.primettc=this.fed=this.taxeAssurance=0;
      this.definitive=this.getCategorieSocioProfessionnelle(this.prospect.prospc_categosocioprof);
    });
}
getCategorieSocioProfessionnelle(id) {
  this.categorieSocioprofessionnelleService.getCategorieSocioprofessionnelleByCode(id)
    .subscribe((data: any) => {
      this.categorieSocioprofessionnelle = data as CategorieSocioprofessionnelle;
      this.definitive=this.categorieSocioprofessionnelle.categs_liblong;
      console.log(this.categorieSocioprofessionnelle,"categoriesocio");


    })
  
  
  }
  onGetAllInstructionByDemandeTypeDemande(demande,typedmande){
    this.instructionService.getAllInstructionByDemandeTypeDemande(demande,typedmande)
    .subscribe((data: Instruction[]) => {
        this.instructionByDemandeTypeDemande= data;
        this.instructionByDemandeTypeDemande.forEach(instruction=>{
        this.haveInstruction=true;
        this.titre="Modification instruction"
        this.addForm.controls['instruct_description'].setValue(instruction.instruct_description);
          this.addForm.controls['instruct_present_societe'].setValue(instruction.instruct_present_societe);
          this.addForm.controls['instruct_activites_client'].setValue(instruction.instruct_activites_client);
          this.addForm.controls['instruct_risques_activite'].setValue(instruction.instruct_risques_activite);
          this.addForm.controls['instruct_conclusion'].setValue(instruction.instruct_conclusion);
          this.addForm.controls['instruct_objet'].setValue(instruction.instruct_objet);
          this.addForm.controls['instruct_encours_demande'].setValue(instruction.instruct_encours_demande);
          this.addForm.controls['instruct_duree_credit'].setValue(instruction.instruct_duree_credit);
          this.addForm.controls['instruct_condition_paiement'].setValue(instruction.instruct_condition_paiement);
          this.addForm.controls['instruct_taux'].setValue(instruction.instruct_taux);
          this.addForm.controls['instruct_type_couverture'].setValue(instruction.instruct_type_couverture);
          this.addForm.controls['instruct_reconduction_couverture'].setValue(instruction.instruct_reconduction_couverture);
          this.addForm.controls['instruct_delai_carence'].setValue(instruction.instruct_delai_carence);
          this.addForm.controls['instruct_delai_idem'].setValue(instruction.instruct_delai_idem);
          this.addForm.controls['instruct_sanction'].setValue(instruction.instruct_sanction);
          this.addForm.controls['instruct_effet'].setValue(instruction.instruct_effet);
          this.addForm.controls['instruct_caducite'].setValue(instruction.instruct_caducite);
          this.addForm.controls['instruct_disposition'].setValue(instruction.instruct_disposition);
          this.addForm.controls['instruct_demande'].setValue(instruction.instruct_demande);
          this.addForm.controls['instruct_type'].setValue(instruction.instruct_type);
          this.addForm.controls['instruct_type_dem'].setValue(instruction.instruct_type_dem);
          this.addForm.controls['instruct_num'].setValue(instruction.instruct_num);
          this.addForm.controls['instruct_memo'].setValue(instruction.instruct_memo);
          let i=0;
          this.tailleRef=true;
          while(i<instruction.reference.length){
            let ref: ReferenceTech={
              identification: instruction.reference[i].toString(),
              beneficiaires : instruction.reference[i+1].toString(),
              montant_marche : instruction.reference[i+2].toString(),
              observation:instruction.reference[i+3].toString()
              
            };
            i=i+4;
            /*ref.identification="Acquisition1";
            ref.beneficiaire='beneficiaire1'
            this.referenceTech.push(ref);*/
            
            this.referenceTech=[ ...this.referenceTech,...[ref]]
          }
  
        })
        
    });  
   }
  

}
