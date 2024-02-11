import { Locataire } from "./Locataire";
import { ReferenceTech } from "./ReferenceTech";

export class Instruction{
      instruct_num :number;
	 instruct_type:string ;
	 instruct_demande:number;
	 instruct_type_dem:string ;
	//CMT FIN
	 instruct_objet_avenant:string ;
	 instruct_date_souscript:Date ;
	 instruct_beneficiaire : string;
	//POUR CMT ET CREDIT
	 instruct_taux:number;
	 instruct_taux2:number;
	 instruct_taux3:number;
	 instruct_present_generale:string;
	 instruct_present_technique:string;
	 instruct_interetdossier:string;
	//POUR CMT ET CREDIT
     instruct_conclusion:string;
    //CMT FIN
    
    //POUR CMT ET CREDIT
     reference:String[] ;
    
    //CREDIT DEBUT
    instruct_description:string;
    instruct_present_societe:string;
    instruct_activites_client:string;
    instruct_risques_activite;
    instruct_objet:string;
    instruct_encours_demande:string;
    instruct_duree_credit:number;
    instruct_condition_paiement:string;
    instruct_type_couverture:string;
    instruct_reconduction_couverture:string;
    instruct_delai_carence:string;
    instruct_delai_idem:string;
    instruct_sanction:string;
    instruct_effet:string;
    instruct_caducite:string;
    instruct_disposition:string;
    //CREDIT FIN
    
    //PERTES DEBUT
    instruct_analyse:string;
     locataire:String [];
    //PERTES FINs

    //COMMUN
    instruct_memo:string;
    //COMMUN

    dem_denomination:String;
}