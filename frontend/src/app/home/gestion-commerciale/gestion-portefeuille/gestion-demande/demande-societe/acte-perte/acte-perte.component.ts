import { Component,  OnInit } from '@angular/core';
import { FormBuilder,  Validators } from '@angular/forms';
import { Dem_Soc } from '../../../../../../model/Dem_Soc';
import { TransfertDataService } from '../../../../../../services/transfertData.service';
import { saveAs } from 'file-saver';



import { DatePipe } from '@angular/common';
import { DemandesocieteService } from '../../../../../../services/demandesociete.service';
import { HttpEventType } from '@angular/common/http';
import { Client } from '../../../../../../model/Client';
import { Router } from '@angular/router';
import { ClientService } from '../../../../../../services/client.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import dateFormatter from 'date-format-conversion';
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
import { User } from '../../../../../../model/User';

@Component({
  selector: 'ngx-acte-perte',
  templateUrl: './acte-perte.component.html',
  styleUrls: ['./acte-perte.component.scss']
})
export class ActePerteComponent implements OnInit {

  demandeSociete: Dem_Soc;
  client: Client;
  prospect : Prospect;
  autorisation = [];
  numInstruction:number;

  constructor(private fb: FormBuilder,private transfertData: TransfertDataService,private demSocService:DemandesocieteService,
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
      this.demandeSociete = data[0];
      this.montant_demande = this.formatNumer( this.demandeSociete.dem_montant);
      this.addForm.controls['acte_montant_demande'].setValue(this.montant_demande+" FCFA");
      this.addForm.controls['acte_montant_mensuel'].setValue(Math.trunc(this.demandeSociete.dem_montant/12));
      if(this.demandeSociete.dem_typetitulaire=="CL"){
        this.getCientById(this.demandeSociete.dem_clienttitulaire)
        console.log("client",this.demandeSociete.dem_typetitulaire);
        

      }else{
        this.getProspectById(this.demandeSociete.dem_clienttitulaire);
      }
     
      //this.client=data[1];
      console.log('demande',this.demandeSociete);
      //console.log('client',this.client);
      this.title = "Ajout informations Acte"
    }/*else{
      let data=[]
      data = this.transfertData2.getData()
      this.demandeSociete =  data[0];
      this.numInstruction = data[1];
      if(this.demandeSociete.dem_typetitulaire=="CL"){
        
      }else{
        
      }
      
      console.log("instruction,",this.numInstruction)
      
      this.haveInstruction=true;
      
    }*/
    
    
    
      this.onGetByNumDamandeTypeDemandeTypeProduit(this.demandeSociete.dem_socnum,"societe");
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
                }      
              })
          }
        })

      }
  
  addForm = this.fb.group({
    acte_cp: ['', [Validators.required]], 
    acte_client: [''], 
    acte_adresse_client:[''],
    acte_denomination_locataire: ['', [Validators.required]], 
    acte_date_naissance: ['', [Validators.required]],
    acte_lieu_naissance: ['', [Validators.required]],
    acte_date_lieu_naissance:[''],
    acte_profession: ['', [Validators.required]],
    acte_situation_bien: ['', [Validators.required]], 
    acte_duree_bail: ['', [Validators.required]], 
    acte_montant_mensuel: ['', [Validators.required]],
    acte_montant_demande : [''],
    acte_periode_loyer: ['Par mois', [Validators.required]],
    acte_mode_regelement: ['', [Validators.required]], 
    acte_montant_couvert: ['', [Validators.required]],
    acte_taux_prime: ['', [Validators.required]], 
    acte_primettc: [''], 
    acte_prime_paiement: ['Dès réception de l’avis de couverture', [Validators.required]],
    acte_prise_effet: ['Après paiement de la prime', [Validators.required]],
    acte_caducite: ['Au plus tard trente (30) jours suivant réception de l’avis de couverture ', [Validators.required]],
    acte_duree_garantie: ['', [Validators.required]], 
    acte_surete: ['Gage général', [Validators.required]],
    acte_disposition: ['', [Validators.required]],
    acte_police:[''],
    acte_dem_num:[''],
    acte_type_dem:[''],
    acte_type:[''],
    acte_type_prod:[''],
    acte_arbitrage_num:['']
  });
  
  
  haveInstruction=false;
 
  haveActe=false
 
  title
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  statusSuccess: NbComponentStatus = 'success';
  statusFail: NbComponentStatus = 'danger';

  police=""; 
  cp=""; 
  clients="";				                      
  adresse_client=""; 
  denomination_locataire=""; 
  date_naissance="";
  lieu_naissance="";
  profession=""; 
  situation_bien=""; 
  duree_bail=""; 
  montant_demande="";
	montant_mensuel=0; 
  periode_loyer=""; 
  mode_regelement=""; 
  montant_couvert="";
	taux_prime=""; 
  primettc=0; 
  prime_paiement=""; 
  prise_effet=""; 
  caducite="";
	duree_garantie=""; 
  surete=""; 
  disposition=""

  actes:ActeArbitrage[];
  login:any;
  user:User;
  candidateToModifyacte=false;

  typeproduit;

  polices:Police[];
  quittance:Quittance;
  engagements:Engagement[];
  
  
  
  onExportActePerte(demande:Dem_Soc) {
   	//this.police=this.addForm.get("acte_titre").value;
    
     this.cp=this.addForm.get("acte_cp").value
     //this.clients=this.addForm.get("acte_client").value
     //this.=this.addForm.get("acte_adresse_client:").value
     this.denomination_locataire=this.addForm.get("acte_denomination_locataire").value
     this.date_naissance= this.datePipe.transform(this.addForm.get("acte_date_naissance").value,"dd/MM/yyyy");
     //this.date_naissance=this.addForm.get("acte_date_naissance").value
     this.lieu_naissance=this.addForm.get("acte_lieu_naissance").value.toUpperCase()
     this.profession=this.addForm.get("acte_profession").value
     this.situation_bien=this.addForm.get("acte_situation_bien").value
     this.duree_bail=this.addForm.get("acte_duree_bail").value
     this.montant_mensuel=this.addForm.get("acte_montant_mensuel").value
     //this.=this.addForm.get("acte_montant_demande ").VALUE
     this.periode_loyer=this.addForm.get("acte_periode_loyer").value
     this.mode_regelement=this.addForm.get("acte_mode_regelement").value
     this.montant_couvert=this.addForm.get("acte_montant_couvert").value
     this.taux_prime=this.addForm.get("acte_taux_prime").value
     //this.=this.addForm.get("acte_primettc").value
     this.prime_paiement=this.addForm.get("acte_prime_paiement").value
     this.prise_effet=this.addForm.get("acte_prise_effet").value
     this.caducite=this.addForm.get("acte_caducite").value 
     this.duree_garantie=this.addForm.get("acte_duree_garantie").value
     this.surete=this.addForm.get("acte_surete").value
     this.disposition=this.addForm.get("acte_disposition").value
     this.police=this.addForm.get("acte_police").value
     //this.addForm.controls['acte_date_lieu_naissance'].setValue(this.date_lieu_naissance);
    this.addForm.controls['acte_dem_num'].setValue(this.demandeSociete.dem_socnum);
    this.addForm.controls['acte_type_dem'].setValue("societe");
    this.addForm.controls['acte_type'].setValue("perte");
    this.addForm.controls['acte_type_prod'].setValue(this.demandeSociete.dem_produitdemande1);

    const form = new FormData();

    form.append("police", this.police);
		form.append("cp",this.cp);
		form.append("client",this.clients);
		form.append("adresse_client", this.adresse_client);
		form.append("denomination_locataire",this.denomination_locataire); 
		form.append("date_naissance", this.date_naissance);
    form.append("lieu_naissance", this.lieu_naissance);
		form.append("profession",this.profession);
		form.append("situation_bien",this.situation_bien);
		form.append("duree_bail",this.duree_bail);
		form.append("montant_demande",this.montant_demande+" F CFA");
		form.append("montant_mensuel",this.formatNumer(this.montant_mensuel)+" F CFA");
		form.append("periode_loyer",this.periode_loyer);
		form.append("mode_regelement",this.mode_regelement);
		form.append("montant_couvert",this.montant_couvert);
		form.append("taux_prime",this.taux_prime+"%");
		form.append("primettc",this.formatNumer(this.primettc)+" F CFA");
		form.append("prime_paiement",this.prime_paiement);
		form.append("prise_effet",this.prise_effet);
		form.append("caducite",this.caducite);
		form.append("duree_garantie",this.duree_garantie);
		form.append("surete",this.surete);
		form.append("disposition",this.disposition);

    console.log(form);
    
    this.demSocService.generateReportActeLocassur(demande.dem_socnum,form)
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
              if(!this.haveActe){
                message="et enregisté avec succès !"
                this.acteArbitrageService.addActeArbitrage(this.addForm.value)
                  .subscribe((data:any) => {
                    this.haveActe=true;
                  })
              }else{
                message="et modifié avec succès !"
                this.acteArbitrageService.updateActeArbitrage(this.addForm.value)
                .subscribe((data) => {
                  
                })
                }
                /*demande.dem_statut="analyse juridique"
                this.demSocService.update(demande).subscribe(data => {
                  
                })*/
              //this.router.navigateByUrl('/home/demande-societe');
              this.toastrService.show(
                'Acte généré avec succés ! '+message,
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
            saveAs(event.body, 'acte_locassur.docx');
            //this.router.navigateByUrl('/home/demande-societe');
        }
      });
  }

  onExportActePertebis(demande:Dem_Soc) {
    //this.police=this.addForm.get("acte_titre").value;
   
    this.cp=this.addForm.get("acte_cp").value
    //this.clients=this.addForm.get("acte_client").value
    //this.=this.addForm.get("acte_adresse_client:").value
    this.denomination_locataire=this.addForm.get("acte_denomination_locataire").value
    this.date_naissance= this.datePipe.transform(this.addForm.get("acte_date_naissance").value,"dd/MM/yyyy");
    //this.date_naissance=this.addForm.get("acte_date_naissance").value
    this.lieu_naissance=this.addForm.get("acte_lieu_naissance").value.toUpperCase()
    this.profession=this.addForm.get("acte_profession").value
    this.situation_bien=this.addForm.get("acte_situation_bien").value
    this.duree_bail=this.addForm.get("acte_duree_bail").value
    this.montant_mensuel=this.addForm.get("acte_montant_mensuel").value
    //this.=this.addForm.get("acte_montant_demande ").VALUE
    this.periode_loyer=this.addForm.get("acte_periode_loyer").value
    this.mode_regelement=this.addForm.get("acte_mode_regelement").value
    this.montant_couvert=this.addForm.get("acte_montant_couvert").value
    this.taux_prime=this.addForm.get("acte_taux_prime").value
    //this.=this.addForm.get("acte_primettc").value
    this.prime_paiement=this.addForm.get("acte_prime_paiement").value
    this.prise_effet=this.addForm.get("acte_prise_effet").value
    this.caducite=this.addForm.get("acte_caducite").value 
    this.duree_garantie=this.addForm.get("acte_duree_garantie").value
    this.surete=this.addForm.get("acte_surete").value
    this.disposition=this.addForm.get("acte_disposition").value
    this.police=this.addForm.get("acte_police").value
    //this.addForm.controls['acte_date_lieu_naissance'].setValue(this.date_lieu_naissance);
   this.addForm.controls['acte_dem_num'].setValue(this.demandeSociete.dem_socnum);
   this.addForm.controls['acte_type_dem'].setValue("societe");
   this.addForm.controls['acte_type'].setValue("perte");
   this.addForm.controls['acte_type_prod'].setValue(this.demandeSociete.dem_produitdemande1);

   const form = new FormData();

   form.append("police", this.police);
   form.append("cp",this.cp);
   form.append("client",this.clients);
   form.append("adresse_client", this.adresse_client);
   form.append("denomination_locataire",this.denomination_locataire); 
   form.append("date_naissance", this.date_naissance);
   form.append("lieu_naissance", this.lieu_naissance);
   form.append("profession",this.profession);
   form.append("situation_bien",this.situation_bien);
   form.append("duree_bail",this.duree_bail);
   form.append("montant_demande",this.montant_demande+" F CFA");
   form.append("montant_mensuel",this.formatNumer(this.montant_mensuel)+" F CFA");
   form.append("periode_loyer",this.periode_loyer);
   form.append("mode_regelement",this.mode_regelement);
   form.append("montant_couvert",this.montant_couvert);
   form.append("taux_prime",this.taux_prime+"%");
   form.append("primettc",this.formatNumer(this.primettc)+" F CFA");
   form.append("prime_paiement",this.prime_paiement);
   form.append("prise_effet",this.prise_effet);
   form.append("caducite",this.caducite);
   form.append("duree_garantie",this.duree_garantie);
   form.append("surete",this.surete);
   form.append("disposition",this.disposition);

   console.log(form);
   
   this.demSocService.generateReportActeLocassur(demande.dem_socnum,form)
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
             /*if(!this.haveActe){
               message="et enregisté avec succès !"
               this.acteArbitrageService.addActeArbitrage(this.addForm.value)
                 .subscribe((data:any) => {
                   this.haveActe=true;
                 })
             }else{
               message="et modifié avec succès !"
               this.acteArbitrageService.updateActeArbitrage(this.addForm.value)
               .subscribe((data) => {
                 
               })
               }
               /*demande.dem_statut="analyse juridique"
               this.demSocService.update(demande).subscribe(data => {
                 
               })*/
             //this.router.navigateByUrl('/home/demande-societe');
             this.toastrService.show(
               'Acte généré avec succés !',
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
           saveAs(event.body, 'acte_locassur.docx');
           //this.router.navigateByUrl('/home/demande-societe');
       }
     });
 }
  close(){
    this.router.navigateByUrl('/home/demande-societe');
  }
  getCientById(id) {
    this.clientService.getClient(id)
      .subscribe((data: any) => {
        this.client = data as Client;
        this.getAllpoliceByClient(id);
        console.log(this.client,'client');
        this.clients=this.client.clien_denomination.toString();
        this.addForm.controls['acte_client'].setValue(this.clients);
        this.adresse_client=this.client.clien_adressenumero+" "+this.client.clien_adresserue+"  "+this.client.clien_adresseville;
        this.addForm.controls['acte_adresse_client'].setValue(this.adresse_client);
        //this.addForm.controls['acte_primettc'].setValue(this.primettc);
      });
  }
  formatNumer(num){
    if(num==0)
      return 0;
    else return this.formatNumberService.numberWithCommas2(num);
  }
  
  onGetByNumDamandeTypeDemandeTypeProduit(actedemnum ,actetypedem ) {
    this.acteArbitrageService.getByNumDamandeTypeDemandeTypeProduit(actedemnum ,actetypedem)
      .subscribe((data: any) => {
        this.actes = data as ActeArbitrage[];
        console.log(this.actes,'actes');
        for(let i=0;i<this.actes.length;i++){
          this.haveActe=true;
          let datenaissance=dateFormatter(this.actes[i].acte_date_naissance, 'yyyy-MM-dd');
          
          this.title="Modification information Acte"
         
          
           
            this.addForm.controls["acte_cp"].setValue(this.actes[i].acte_cp);
            this.addForm.controls["acte_denomination_locataire"].setValue(this.actes[i].acte_denomination_locataire);
            this.addForm.controls["acte_date_naissance"].setValue(datenaissance);
            this.addForm.controls["acte_lieu_naissance"].setValue(this.actes[i].acte_lieu_naissance);
            this.addForm.controls["acte_profession"].setValue(this.actes[i].acte_profession);
            this.addForm.controls["acte_situation_bien"].setValue(this.actes[i].acte_situation_bien);
            this.addForm.controls["acte_duree_bail"].setValue(this.actes[i].acte_duree_bail);
            this.addForm.controls["acte_montant_mensuel"].setValue(this.actes[i].acte_montant_mensuel);
            this.addForm.controls["acte_periode_loyer"].setValue(this.actes[i].acte_periode_loyer);
            this.addForm.controls["acte_mode_regelement"].setValue(this.actes[i].acte_mode_regelement);
            this.addForm.controls["acte_montant_couvert"].setValue(this.actes[i].acte_montant_couvert);
            this.addForm.controls["acte_taux_prime"].setValue(this.actes[i].acte_taux_prime);
            this.addForm.controls["acte_prime_paiement"].setValue(this.actes[i].acte_prime_paiement);
            this.addForm.controls["acte_prise_effet"].setValue(this.actes[i].acte_prise_effet);
            this.addForm.controls["acte_caducite"].setValue(this.actes[i].acte_caducite); 
            this.addForm.controls["acte_duree_garantie"].setValue(this.actes[i].acte_duree_garantie);
            this.addForm.controls["acte_surete"].setValue(this.actes[i].acte_surete);
            this.addForm.controls["acte_disposition"].setValue(this.actes[i].acte_disposition);
            this.addForm.controls["acte_police"].setValue(this.actes[i].acte_police);
            
            this.addForm.controls['acte_type_dem'].setValue("societe");
            this.addForm.controls['acte_type'].setValue("perte");
            this.addForm.controls['acte_type_prod'].setValue(this.demandeSociete.dem_produitdemande1);
            this.addForm.controls['acte_dem_num'].setValue(this.demandeSociete.dem_socnum);
            this.addForm.controls['acte_arbitrage_num'].setValue(this.actes[i].acte_arbitrage_num);
            console.log("formulaire database",this.addForm)
      }
      });
  }
  getProspectById(id) {
    this.prospectService.getProspectByNumero(id)
      .subscribe((data: any) => {
        this.prospect = data as Prospect;
        this.clients=this.prospect.prospc_denomination.toString();
        this.addForm.controls['acte_client'].setValue(this.clients);
        this.adresse_client=this.prospect.prospc_adressenumero+" "+this.prospect.prospc_adresserue+"  "+this.prospect.prospc_adresseville;
        this.addForm.controls['acte_adresse_client'].setValue(this.adresse_client);
        this.primettc=0;
      });
  }

  getAllpoliceByClient(id) {
    this.policeService.getAllPoliceByClient(id)
      .subscribe((data: any) => {
        this.polices = data as Police[];
        console.log(this.polices,"polices");
        if(this.polices!=null){
          /*this.polices.forEach(police=>{
            this.getQuittanceBynumPolice(police.poli_numero);
            //this.getAllEngagementByPolice(police.poli_numero,police.poli_codeproduit);
          })*/
          for(let i=0;i<this.polices.length;i++){
            this.getQuittanceBynumPolice(this.polices[i].poli_numero);
          }
          if(this.polices.length==0){
            this.primettc=0;
          }
        }else{
          
          this.primettc=0;
        }
      });
  }
  getQuittanceBynumPolice(id) {
    this.quittanceService.getQuittanceByNuymPolice(id)
      .subscribe((data: any) => {
        this.quittance = data as Quittance;
         console.log(this.quittance);
        
        this.primettc = this.primettc+this.quittance.quit_primettc;
        
      });
      
      console.log("prime",this.primettc);
  }
  getAllEngagementByPolice(id,produitPolice) {
    //this.getQuittanceBynumPolice(id);
    this.engagementService.getAllEngagementsByPolice(id)
      .subscribe((data: any) => {
        this.engagements = data as Engagement[];
        console.log(this.engagements,"engagement");
        this.engagements.forEach(engagement =>{
          
          if(produitPolice==this.demandeSociete.dem_produitdemande1 && engagement.engag_status=="en cours"){
            //this.montant_encours=this.montant_encours+engagement.engag_kapassure;
            
           }
        })
      });
  }

  

}
