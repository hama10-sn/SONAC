export class PoliceForm {

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
	poli_prospect: number ;
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

	//acte
	act_numero: Number;
    act_numeropolice: Number;
    act_typegarantie: Number;
    act_typemarche: String;
    act_numeromarchepublic: String;
    act_codemarche: Number;
    act_datemarche: Date;
    act_idcontractante: Number;
    act_idbeneficiaire: Number;
    act_idcandidat: Number;
    act_descriptionmarche;
    act_capitalassure: Number;
    act_capitalsmp: Number;
    act_capitallci: Number;
    act_anciennumero;
    act_status: String;
    act_datecomptabilisation: Date;
	//acheteur
	achet_id: Number;
	achet_numero: Number;
	achet_numeroclient: Number;
	achet_numeroaffaire: Number;
	achet_type: String;
	achet_chiffreaffaire: Number;
	achet_incidentpaiement: Number;
	achet_montantincidentpaiement: Number;
	achet_montantpaiementrecup: Number;
	achet_dispersion: Number;
	achet_qualite: Number;
	achet_typologie: String;
	achet_creditencours: String;
	achet_montantcredit: Number;
	achet_montantrembours: Number;
	achet_montantecheance: Number;
	achet_montantecheancecredit: Number;
	achet_montantecheanceimpaye: Number;
	achet_montantimpaye: Number;
	achet_montantrecouvre: Number;
	achet_codeutilisateur: String;
	achet_datemodification: Date;
	//avenant
	aven_id: Number;
    aven_numeropolice: Number;
    aven_numeroavenant: Number;
    aven_codeintermediare: Number;
    aven_codecompagnie: String;
    aven_codemarche: Number;
    aven_typavenant: Number;
    aven_dateeffet: Date;
    aven_dateecheance: Date;
    aven_duree: Number;
    aven_daterevision: Date;
    aven_typerevision: Number;
    aven_typecontrat: Number;
    aven_typegestion: Number;
    aven_typefraction: Number;
    aven_montantprimenet: Number;
    aven_montantprimebrut: Number;
    aven_coefbonus: Number;
    aven_coefremisecie: Number;
    aven_numeroattestionauto: String;
    aven_numerocertificat: String;
    aven_numpoliceremplacee: Number;
    aven_typefacultative: String;
    aven_numeroplancoassur: Number;
    aven_numeroplanreassur: Number;
    aven_numeroderniernavenant: Number;
    aven_datesuspension: Date;
    aven_dateremisevigueur: Date;
    aven_dateresiliation: Date;
    aven_statut: String;
    aven_indice: Number;
    aven_typeindice: String;
    aven_dateindice: Date;
    aven_valeurindice: Number;
    aven_exonerationtaxe: String;
    aven_codetaxe: Number;
    aven_exonerationtva
    aven_codetva: Number;
    aven_exonerationtps: String;
    aven_codetps: Number;
    aven_dateexoneration: Date;
    aven_formulegarantie: Number;
    aven_utilisateur: Number;
    aven_datemodification: Date;
	//beneficiaire
	benef_id: Number;
    benef_Num: Number;
    benef_typbenef: String;
    benef_nom: String;
    benef_prenoms: String;
    benef_denom: String;
    benef_status: String;
    benef_ccutil: String;
    benef_datemo: Date;
	//credit
	credit_id: Number;
	credit_numero: Number;
	credit_numeroclient: Number;
	credit_numeroachateur: Number;
	credit_type: String; 
	credit_typemarchandise: Number;
	credit_mtncredit: Number;
	credit_nbecheanceaccorde: Number;
	credit_nbechenaceretard: Number;
	credit_nbecheanceimpaye: Number;
	credit_mntindemnite: Number;
	credit_mtnrecours: Number;
	credit_mtnrecoursencaisse: Number;
	credit_chargerecouvrement: Number;
	credit_codeutil: String;
	credit_datemodification: Date;
	//lot
	lot_numero: Number;
	lot_numeroacte: Number;
	lot_numeromarche: String;
	lot_codeinternemarche: Number;
	lot_description: String;
	lot_capitalass: Number;
	lot_capitalsmp: Number;
	lot_capitallci: Number;
	lot_dureetravaux: Number;
	//marche
	march_numero: Number;
	march_identification: String;
	march_idcontractante: Number;
	march_donneurordre: Number;
	march_descriptionmarche1: String;
	march_descriptionmarche2: String;
	march_nombrelots: Number;
	march_dureeenmois: Number;
	march_capitalglobalmarche: Number;
	march_capitalglobalsmpmarche: Number;
	march_capitalglobalslcimarche: Number;
	march_status: Number;
	march_datemodification: Date;
	march_codeutil: String;
	//quittancte
	quit_id: number;
	quit_numero: number;
	quit_Facture: number;
	quit_numeropolice: number;
	quit_numavenant: number;
	quit_numerorisque: number;
	quit_numerocie: String;
	quit_numerointermedaire: number;
	quit_typequittance: String;
	quit_typeecriture: number;
	quit_typemvt: number;
	quit_dateemission: Date;
	quit_datecomotable: Date;
	quit_dateeffet: Date;
	quit_dateecheance: Date;
	quit_typologieannulation: number;
	quit_dateannulation: Date;
	quit_numeroaperitrice: String;
	quit_primenette: number;
	quit_primeext: number;
	quit_commissionsapporteur1: number;
	quit_commissionsapporteur2: number;
	quit_accessoirecompagnie: number;
	quit_accessoireapporteur: number;
	quit_tauxte: number;
	quit_codetaxete: number;
	quit_tauxtva: number;
	quit_codetva: number;
	quit_tauxtps: number;
	quit_codetps: number;
	quit_mtntaxete: number;
	quit_mtntva: number;
	quit_mtntps: number;
	quit_mntreductionprime: number;
	quit_primettc: number;
	quit_mntprimencaisse: number;
	quit_dateencaissament: Date;
	quit_tauxreductioncommer: number;
	quit_tauxbonus: number;
	quit_tauxreductionautres: number;
	quit_mtnreduction: number;
	quit_mtnbonus: number;
	quit_mtnreductionautres: number;
	quit_numeroattestationauto: String;
	quit_numeroressp: String;
	quit_numerocertif: String;
	quit_exoneration: String;
	quit_dateexoneration: Date;
	quit_codeutilisateur: String;
	quit_numeroquittanceannul: number;
	quit_datemiseajour: Date;
	quit_datecomptabilisation: Date;
	quit_anciennumerofacture: String;
	quit_status: String;
	active: number;
	//facture
	fact_numacte: Number;
fact_datefacture;
fact_numeropolice: Number;
fact_numeroacte: Number; 
fact_numeroquittance: Number;
fact_marche: String;
fact_numerosouscripteurcontrat: Number;
fact_numeoracheteur: Number;
fact_numeroassure: Number;
fact_numerobeneficiaire: Number;
fact_objetfacture: String;
fact_montantprimenet: Number;
fact_montantaccescompagnie: Number;
fact_montantaccesapporteur: Number;
fact_montanttaxe: Number;
fact_montantarrondi: Number;
fact_commissionapporteur: Number;
fact_montantttc: Number;
fact_numerobranche: Number;
fact_numerocategorie: Number;
fact_dateeffetcontrat: Date;
fact_dateecheancecontrat: Date;
fact_capitalassure: Number;
fact_capitalsmp: Number;
fact_capitallci: Number;
fact_datecomptabilisation: Date;
fact_codeutilisateur: String;
fact_datemodification: Date;
fact_etatfacture: String;
fact_codeannulation: String;
fact_dateannulation: Date;
fact_anciennumerofacture: String;
//engagement
engag_numeroengagement: Number;
  engag_numpoli: Number;
  engag_numeroavenant: Number;
  engag_numeroacte: Number;
  engag_codemarche: Number;
  engag_kapassure: Number;
  engag_dateengagement: Date;
  engag_capitalliberationengage: Number;
  engag_dateliberation: Date;
  engag_typesurete: String;
  engag_identificationtitre: String;
  engag_retenudeposit: Number;
  engag_datedeposit: Date;
  engag_depositlibere: Number;
  engag_dateliberationdeposit: Date;
  engag_cautionsolidaire: String;
  engag_datecomptabilisation: Date;
  engag_status: String;
  engag_codeutilisateur: String;
  engag_datemodification: Date;
  //risque
  risq_id: Number;
    risq_numeropolice: Number;
	risq_numero: Number;
	risq_numeroacte: Number;
	risq_typerisque: String;
	risq_designation1: String;
	risq_designation2: String;
	risq_localisation1: String;
	risq_localisation2: String;
	risq_gps: String;
	risq_capitalassure: Number;
	risq_capitalsmp: Number;
	risq_capitallci: Number;
	risq_pourcentfacultativeplacement: Number;
	risq_pourcentfacultativen1: Number;
	risq_pourcentfacultativen2: Number;
	risq_formulegarantierisque: Number;
	risq_codebienassurable: Number;
	risq_mtnglobalcredit: Number;
	risq_nbreecheances: Number;
	risq_nbreecheanceimpayees: Number;
	risq_codeutilisateur: String;
	risq_datemodification: Date;
	risq_typedeclarationrevision: String;
	risq_vakeurdeclarative: Number;
	risq_typindemnisationretenue: Number;
	risq_typefranchise: Number;
	risq_franchise: Number;
	risq_typeprotection: Number;
	risq_priseenchargeautorisee: String;
	risq_visitetechobligatoire: String;
	risq_visitetechperiodicite: String;
	risq_visitetechrapport: String;
	risq_visitetechdate: Date;
	risq_status: String;
//locatif
riskl_id: Number;
    riskl_numero: Number;
	riskl_numerorisquegenerique: Number;
	riskl_numeroclient: Number;
	riskl_numeroacheteur: Number;
	riskl_numeropolice: Number;
	riskl_type: String;
	riskl_description: String;
	riskl_mtnloyer: Number;
	riskl_nombreloyerimpaye: Number;
	riskl_mtnloyerimpaye: Number;
	riskl_mntloyerindemnite: Number;
	riskl_mntloyerrecouvre: Number;
	riskl_codeutilisateur: String;
	//reglementé
	riskr_id: Number;
	riskr_numero: Number;  
	riskr_numerorisquegenerique: Number;
	riskr_numeroclient: Number;
	riskr_numeropolice: Number;
	riskr_type: String;
	riskr_description: String;
	riskr_mtncaution: Number;
	riskr_mtncouverturefinanciere: Number;
	riskr_dateexigibilite: Date;
	riskr_daterenouvellement: Date;
	riskr_capitauxgaranti: Number;
	riskr_beneficiaire: Number;
	riskr_revision: String;
	riskr_daterevision: Date;
	riskr_codeutilisateur: String;
}