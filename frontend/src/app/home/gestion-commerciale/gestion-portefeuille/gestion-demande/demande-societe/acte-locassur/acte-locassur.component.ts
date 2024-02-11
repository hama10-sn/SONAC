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
import { NbAuthService } from '@nebular/auth';
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

@Component({
  selector: 'ngx-acte-locassur',
  templateUrl: './acte-locassur.component.html',
  styleUrls: ['./acte-locassur.component.scss']
})
export class ActeLocassurComponent implements OnInit {

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
    }else{
      let data=[]
      data = this.transfertData2.getData()
      this.demandeSociete =  data[0];
      this.numInstruction = data[1];
      if(this.demandeSociete.dem_typetitulaire=="CL"){
        
      }else{
        
      }
      
      console.log("instruction,",this.numInstruction)
      
      this.haveInstruction=true;
      
    }
    
    
    
this.onGetByNumDamandeTypeDemandeTypeProduit(this.demandeSociete.dem_socnum,"societe");

      }
  
  addForm = this.fb.group({

    acte_titre: ['', [Validators.required]],
    acte_dossier:['', [Validators.required]],
    acte_acheteur:['', [Validators.required]],
    acte_date:['', [Validators.required]],
    acte_objet:['', [Validators.required]],
    acte_duree_credit:['', [Validators.required]],
    acte_taux_prime:['', [Validators.required]],
    acte_delai_carence:['', [Validators.required]],
    acte_sanction:['', [Validators.required]],
    acte_numero_conditionsg:[''],
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
  date_lieu_naissance="";
  profession=""; 
  situation_bien=""; 
  duree_bail=""; 
  montant_demande="";
	montant_mensuel=""; 
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

  typeproduit;

  polices:Police[];
  quittance:Quittance;
  engagements:Engagement[];
  
  
  
  onExportActeCredit(demande:Dem_Soc) {
   	this.police=this.addForm.get("acte_titre").value;
    

    this.addForm.controls['acte_dem_num'].setValue(this.demandeSociete.dem_socnum);
    this.addForm.controls['acte_type_dem'].setValue("societe");
    this.addForm.controls['acte_type'].setValue("credit");
    this.addForm.controls['acte_type_prod'].setValue(this.demandeSociete.dem_produitdemande1);

    const form = new FormData();

    form.append("police", this.police);
		form.append("cp",this.cp);
		form.append("client",this.clients);
		form.append("adresse_client", this.adresse_client);
		form.append("denomination_locataire",this.denomination_locataire); 
		form.append("date_lieu_naissance", this.date_lieu_naissance);
		form.append("profession",this.profession);
		form.append("situation_bien",this.situation_bien);
		form.append("duree_bail",this.duree_bail);
		form.append("montant_demande",this.montant_demande);
		form.append("montant_mensuel",this.montant_mensuel);
		form.append("periode_loyer",this.periode_loyer);
		form.append("mode_regelement",this.mode_regelement);
		form.append("montant_couvert",this.montant_couvert);
		form.append("taux_prime",this.taux_prime);
		form.append("primettc",this.formatNumer(this.primettc));
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
          this.haveActe=true;
          this.title="Modification information Acte"
          
            //this.titre=this.addForm.get("acte_titre").value
            this.haveActe=true;
            this.addForm.controls['acte_titre'].setValue(this.actes[i].acte_titre);
            this.addForm.controls['acte_dossier'].setValue(this.actes[i].acte_dossier);
            this.addForm.controls['acte_acheteur'].setValue(this.actes[i].acte_acheteur);
            
            let datedemande=dateFormatter(this.actes[i].acte_date, 'yyyy-MM-dd');
            this.addForm.controls['acte_date'].setValue(datedemande);
            this.addForm.controls['acte_objet'].setValue(this.actes[i].acte_objet);
            this.addForm.controls['acte_duree_credit'].setValue(this.actes[i].acte_duree_credit);
            this.addForm.controls['acte_taux_prime'].setValue(this.actes[i].acte_taux_prime);
            this.addForm.controls['acte_delai_carence'].setValue(this.actes[i].acte_delai_carence);
            this.addForm.controls['acte_sanction'].setValue(this.actes[i].acte_sanction);
            this.addForm.controls['acte_numero_conditionsg'].setValue(this.actes[i].acte_numero_conditionsg);
            this.addForm.controls['acte_police'].setValue(this.actes[i].acte_police);
            
            this.addForm.controls['acte_type_dem'].setValue("societe");
            this.addForm.controls['acte_type'].setValue("credit");
            this.addForm.controls['acte_type_prod'].setValue(this.demandeSociete.dem_produitdemande1);
            this.addForm.controls['acte_dem_num'].setValue(this.demandeSociete.dem_socnum);
            this.addForm.controls['acte_arbitrage_num'].setValue(this.actes[i].acte_arbitrage_num);
            
      }
      });
  }
  getProspectById(id) {
    this.prospectService.getProspectByNumero(id)
      .subscribe((data: any) => {
        this.prospect = data as Prospect;
        this.clients=this.prospect.prospc_denomination.toString();
        this.adresse_client=this.prospect.prospc_adressenumero+" "+this.prospect.prospc_adresserue+"  "+this.prospect.prospc_adresseville;
       
      });
  }

  getAllpoliceByClient(id) {
    this.policeService.getAllPoliceByClient(id)
      .subscribe((data: any) => {
        this.polices = data as Police[];
        console.log(this.polices,"polices");
        if(this.polices!=null){
          this.polices.forEach(police=>{
            this.getQuittanceBynumPolice(police.poli_numero);
            this.getAllEngagementByPolice(police.poli_numero,police.poli_codeproduit);
          })
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
