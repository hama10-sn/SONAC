export class Police {

    poli_numero: number ;
	poli_codeproduit: number ;
	poli_intermediaire:number ;
	poli_compagnie: String ;
	poli_codepays: String
	poli_codegroupe: String ;
	poli_filiale: String ;
	poli_branche: number ;
	poli_categorie: number ;
	
	//(1' souscripteur, '2' assuré, '3' souscripteur & assuré, '4' autres)
	poli_souscripteur: String ; 
	poli_client: number ;
	poli_dateeffet1: Date ;
	poli_dateanniversaire: Date ;	
	poli_dateeffetencours: Date ;
	poli_dateecheance: Date ;
	poli_duree: number ; //(durée en mois)
	poli_daterevision: Date ;
	poli_typecontrat: number ;
	poli_typerevision: number ;
	poli_typegestion: number ;
	poli_codefractionnement: number ;
	poli_primenetreference: number ;
	poli_primenettotal: number ;
	poli_primebruttotal: number ;
	poli_coefbonus: number ;
	poli_remisecommerciale: number ;
	poli_numeroattestation: String ; 
	poli_numerocertificat: String ; 
	poli_policeremplacee: number ;
	poli_typefacultive: String ;
	poli_numeroplancoassur: number;
	poli_numeroplanreassfac: number ;
	poli_numerodernieravenant: number ;
	poli_datesuspension: Date ;
	poli_dateremisevigueur: Date ;
	poli_dateresiliation: Date ;
	poli_status: String ; // actif ou non actif
	poli_indice: String ;
	poli_typeindice: String ;
	poli_dateindice: Date ; // (à revoir est-ce numérique ou Date)
	poli_valeurindice: number ;
	poli_clauseajustement: number ;	
	poli_clauserevision: number ;
	poli_exonerationtaxeenr: String ; //(oui ou non)
	poli_codetaxe: number ;
	poli_exonerationtva: String ; //(oui ou non)
	poli_codetva: number ;
	poli_exonerationtps: String ; // (oui ou non)
	poli_codetps: number ;
	poli_datexoneration: Date ;
	poli_formulegarantie: number ;
	poli_participationbenef: String ; // (Oui/Non)
	poli_tauxparticipationbenef: number ;
	poli_codecutilisateur: number ;
	poli_datemodification: Date ;
}