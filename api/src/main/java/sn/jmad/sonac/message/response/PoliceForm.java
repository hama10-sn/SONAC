package sn.jmad.sonac.message.response;


import java.util.Date;

import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Data;
import sn.jmad.sonac.model.Police;
@Data
public class PoliceForm {
	//police
	
	private Long poli_num ;
	private Long poli_numero ;
	private Long poli_codeproduit ;
	private Long poli_intermediaire ;
	private String poli_compagnie ;
	private String poli_codepays ;
	private String poli_codegroupe ;
	private String poli_filiale ;
	private Long poli_branche ;
	private Long poli_categorie ;
	
	//(1' souscripteur, '2' assuré, '3' souscripteur & assuré, '4' autres)
	private String poli_souscripteur ; 
	private Long poli_client ;
	private Date poli_dateeffet1 ;
	private Date poli_dateanniversaire ;	
	private Date poli_dateeffetencours ;
	private Date poli_dateecheance ;
	private Long poli_duree ; //(durée en mois)
	private Date poli_daterevision ;
	private Long poli_typecontrat ;
	private Long poli_typerevision ;
	private Long poli_typegestion ;
	private Long poli_codefractionnement ;
	private Long poli_primenetreference ;
	private Long poli_primenettotal ;
	private Long poli_primebruttotal ;
	private Long poli_coefbonus ;
	private Long poli_remisecommerciale ;
	private String poli_numeroattestation ; 
	private String poli_numerocertificat ; 
	private Long poli_policeremplacee ;
	private String poli_typefacultive ;
	private Long poli_numeroplancoassur ;
	private Long poli_numeroplanreassfac ;
	private Long poli_numerodernieravenant ;
	private Date poli_datesuspension ;
	private Date poli_dateremisevigueur ;
	private Date poli_dateresiliation ;
	private int poli_status ; // 1: actif ou 0: non actif
	private String poli_indice ;
	private String poli_typeindice ;
	private Date poli_dateindice ; // (à revoir est-ce numérique ou Date)
	private Long poli_valeurindice ;
	private Long poli_clauseajustement ;	
	private Long poli_clauserevision ;
	private String poli_exonerationtaxeenr ; //(oui ou non)
	private Long poli_codetaxe ;
	private String poli_exonerationtva ; //(oui ou non)
	private Long poli_codetva ;
	private String poli_exonerationtps ; // (oui ou non)
	private Long poli_codetps ;
	private Date poli_datexoneration ;
	private Long poli_formulegarantie ;
	private String poli_participationbenef ; // (Oui/Non)
	private Long poli_tauxparticipationbenef ;
	private String poli_codecutilisateur ;
	private Date poli_datemodification ;
	  
	//avenant
	
	  private Long aven_id;
	  private Long aven_numeropolice;
	  private Long aven_numeroavenant;
	  private Long aven_codeintermediare;
	  private String aven_codecompagnie;
	  private Long aven_codemarche;
	  private Long aven_typavenant;
	  private Date aven_dateeffet;
	  private Date aven_dateecheance;
	  private Long aven_duree;
	  private Date aven_daterevision;
	  private Long aven_typerevision;
	  private Long aven_typecontrat;
	  private Long aven_typegestion;
	  private Long aven_typefraction;
	  private Long aven_montantprimenet;
	  private Long aven_montantprimebrut;
	  private Long aven_coefbonus;
	  private Long aven_coefremisecie;
	  private String aven_numeroattestionauto;
	  private String aven_numerocertificat;
	  private Long aven_numpoliceremplacee;
	  private String aven_typefacultative;
	  private Long aven_numeroplancoassur;
	  private Long aven_numeroplanreassur;
	  private Long aven_numeroderniernavenant;
	  private Date aven_datesuspension;
	  private Date aven_dateremisevigueur;
	  private Date aven_dateresiliation;
	  private String aven_statut;
	  private Long aven_indice;
	  private String aven_typeindice;
	  private Date aven_dateindice;
	  private Long aven_valeurindice;
	  private String aven_exonerationtaxe;
	  private Long aven_codetaxe;
	  private String aven_exonerationtva;
	  private Long aven_codetva;
	  private String aven_exonerationtps;
	  private Long aven_codetps;
	  private Date aven_dateexoneration;
	  private Long aven_formulegarantie;
	  private String aven_utilisateur;
	  private Date aven_datemodification;
	  
	  //acte
	  private Long act_id;
		private Long act_numero;
		private Long act_numeropolice;
		private Long act_typegarantie;
		private String act_typemarche;
		private String act_numeromarchepublic;
		private Long act_codemarche;
		private Date act_datemarche;
		private Long act_idcontractante;
		private Long act_idbeneficiaire;
		private Long act_idcandidat;
		private String act_descriptionmarche;
		private Long act_capitalassure;
		private Long act_capitalsmp;
		private Long act_capitallci;
		private String act_anciennumero;
		private String act_status;
		private Date act_datecomptabilisation;

		//credit
		private Long credit_id;
		  private Long credit_numero;
		  private Long credit_numeroclient;
		  private Long credit_numeroachateur;
		  private String credit_type;	  
		  private Long credit_typemarchandise;
		  private Long credit_mtncredit;
		  private Long credit_nbecheanceaccorde;
		  private Long credit_nbechenaceretard;
		  private Long credit_nbecheanceimpaye;
		  private Long credit_mntindemnite;
		  private Long credit_mtnrecours;
		  private Long credit_mtnrecoursencaisse;
		  private Long credit_chargerecouvrement;
		  private String  credit_codeutil;
		  private Date credit_datemodification;
		  
		  //facture
		  
		  Long fact_id;
		  @Id	  
		  @GeneratedValue(strategy = GenerationType.IDENTITY)
		 
		  private Long fact_numacte;
		  private Date fact_datefacture;
		  private Long fact_numeropolice;
		  private Long fact_numeroacte; 
		  private Long fact_numeroquittance;
		  private String fact_marche;
		  private Long fact_numerosouscripteurcontrat;
		  private Long fact_numeoracheteur;
		  private Long fact_numeroassure;
		  private Long fact_numerobeneficiaire;
		  private String fact_objetfacture;
		  private Long fact_montantprimenet;
		  private Long fact_montantaccescompagnie;
		  private Long fact_montantaccesapporteur;
		  private Long fact_montanttaxe;
		  private Long fact_montantarrondi;
		  private Long fact_commissionapporteur;
		  private Long fact_montantttc;
		  private Long fact_numerobranche;
		  private Long fact_numerocategorie;
		  private Date fact_dateeffetcontrat;
		  private Date fact_dateecheancecontrat;
		  private Long fact_capitalassure;
		  private Long fact_capitalsmp;
		  private Long fact_capitallci;
		  private Date fact_datecomptabilisation;
		  private String fact_codeutilisateur;
		  
		  private Date fact_datemodification;
		  private String fact_etatfacture;
		  private Long fact_codeannulation;
		  private Date fact_dateannulation;
		  private String fact_anciennumerofacture;
		 // private int active;
		
		  //lot
		  private Long lot_id;
			private Long lot_numero;
			private Long lot_numeroacte;
			private String lot_numeromarche;
			private Long lot_codeinternemarche;
			private String lot_description;
			private Long lot_capitalass;
			private Long lot_capitalsmp;
			private Long lot_capitallci;
			private Long lot_dureetravaux;

	  //marche
			private Long march_id;
			private Long march_numero;
			private String march_identification;
			private Long march_idcontractante;
			private Long march_donneurordre;
			private String march_descriptionmarche1;
			private String march_descriptionmarche2;
			private Long march_nombrelots;
			private Long march_dureeenmois;
			private Long march_capitalglobalmarche;
			private Long march_capitalglobalsmpmarche;
			private Long march_capitalglobalslcimarche;
			private int march_status;
			private Date march_datemodification;
			private String march_codeutil;
			
			//quittance
			
			private Long quit_id;
			@Id
			@GeneratedValue(strategy = GenerationType.IDENTITY)
		   private Long Quit_numero;
		   private Long Quit_Facture;
		   private Long Quit_numeropolice;
		   private Long Quit_numavenant;
		   private Long Quit_numerorisque;
		   private String Quit_numerocie;
		   private Long quit_numerointermedaire;
		   private String quit_typequittance;
		   private String quit_typeecriture;
		   private Long quit_typemvt;
		   private Date quit_dateemission;
		   private Date quit_datecomotable;
		   private Date quit_dateeffet;
		   private Date quit_dateecheance;
		   private Long quit_typologieannulation;
		   private Date quit_dateannulation;
		   private String quit_numeroaperitrice;
		   private Long quit_primenette;
		   private Long quit_primeext;
		   private Long quit_commissionsapporteur1;
		   private Long quit_commissionsapporteur2;
		   private Long quit_accessoirecompagnie;
		   private Long quit_accessoireapporteur;
		   private Long quit_tauxte;
		   private Long quit_codetaxete;
		   private Long quit_tauxtva;
		   private Long quit_codetva;
		   private Long quit_tauxtps;
		   private Long quit_codetps;
		   private Long quit_mtntaxete;
		   private Long quit_mtntva;
		   private Long quit_mtntps;
		   private Long quit_mntreductionprime;
		   private Long quit_primettc;
		   private Long quit_mntprimencaisse;
		   private Date quit_dateencaissament;
		   private Long quit_tauxreductioncommer;
		   private Long quit_tauxbonus;
		   private Long quit_tauxreductionautres;
		   private Long quit_mtnreduction;
		   private Long quit_mtnbonus;
		   private Long quit_mtnreductionautres;
		   private String quit_numeroattestationauto;
		   private String quit_numeroressp;
		   private String quit_numerocertif;
		   private String quit_exoneration;
		   private Date quit_dateexoneration;
		   private String Quit_codeutilisateur;
		   private Long quit_numeroquittanceannul;
		   private Date Quit_datemiseajour;
		   private Date quit_datecomptabilisation;
		   private String quit_anciennumerofacture;
		   private String quit_status;
		   //private Long active;
		   //risque locatif
		   
		   private Long riskl_id;
			  private Long riskl_numero;
			  private Long riskl_numerorisquegenerique;
			  private Long riskl_numeroclient;
			  private Long riskl_numeroacheteur;
			  private Long riskl_numeropolice;
			  private String riskl_type;
			  private String riskl_description;
			  private Long riskl_mtnloyer;
			  private Long riskl_nombreloyerimpaye;
			  private Long riskl_mtnloyerimpaye;
			  private Long riskl_mntloyerindemnite;
			  private Long riskl_mntloyerrecouvre;
			  private String riskl_codeutilisateur;
			  
			  //risque reglemente
			  
			  private Long riskr_id;
			  private Long riskr_numero;  
			  private Long riskr_numerorisquegenerique;
			  private Long riskr_numeroclient;
			  private Long riskr_numeropolice;
			  private String riskr_type;
			  private String riskr_description;
			  private Long riskr_mtncaution;
			  private Long riskr_mtncouverturefinanciere;
			  private Date riskr_dateexigibilite;
			  private Date riskr_daterenouvellement;
			  private Long riskr_capitauxgaranti;
			  private Long riskr_beneficiaire;
			  private String riskr_revision;
			  private Date riskr_daterevision;
			  private String riskr_codeutilisateur;
			  
			  //risque
			  
			  private Long risq_id;
			  private Long risq_numeropolice;
			  private Long risq_numero;
			  private Long risq_numeroacte;
			  private String risq_typerisque;
			  private String risq_designation1;
			  private String risq_designation2;
			  private String risq_localisation1;
			  private String risq_localisation2;
			  private String risq_gps;
			  private Long risq_capitalassure;
			  private Long risq_capitalsmp;
			  private Long risq_capitallci;
			  private Long risq_pourcentfacultativeplacement;
			  private Long risq_pourcentfacultativen1;
			  private Long risq_pourcentfacultativen2;
			  private Long risq_formulegarantierisque;
			  private Long risq_codebienassurable;
			  private Long risq_mtnglobalcredit;
			  private Long risq_nbreecheances;
			  private Long risq_nbreecheanceimpayees;
			  private String risq_codeutilisateur;
			  private Date risq_datemodification;
			  private String risq_typedeclarationrevision;
			  private Long risq_vakeurdeclarative;
			  private Long risq_typindemnisationretenue;
			  private Long risq_typefranchise;
			  private Long risq_franchise;
			  private Long risq_typeprotection;
			  private String risq_priseenchargeautorisee;
			  private String risq_visitetechobligatoire;
			  private String risq_visitetechperiodicite;
			  private String risq_visitetechrapport;
			  private Date  risq_visitetechdate;
			  private String risq_status;
			  private String risq_genrerisque;
			
			//acheteur
			  
			  private Long achet_id;
			  private Long achet_numero;
			  private Long achet_numeroclient;
			  private Long achet_numeroaffaire;
			  private String achet_type;
			  private Long achet_chiffreaffaire;
			  private Long achet_incidentpaiement;
			  private Long achet_montantincidentpaiement;
			  private Long achet_montantpaiementrecup;
			  private Long achet_dispersion;
			  private Long achet_qualite;
			  private String achet_typologie;
			  private String achet_creditencours;
			  private Long achet_montantcredit;
			  private Long achet_montantrembours;
			  private Long achet_montantecheance;
			  private Long achet_montantecheancecredit;
			  private Long achet_montantecheanceimpaye;
			  private Long achet_montantimpaye;
			  private Long achet_montantrecouvre;
			  private String achet_codeutilisateur;
			  private Date achet_datemodification;
			  
			  //beneficiaire
			  private Long benef_id;
				private Long benef_Num;
				private String benef_typbenef;
				private String benef_nom;
				private String benef_prenoms;
				private String benef_denom;
				private String benef_status;
				private String benef_ccutil;
				private Date benef_datemo;

//engagement
				Long engag_id;
				  private Long engag_numeroengagement;
				  private Long engag_numpoli;
				  private Long engag_numeroavenant;
				  private Long engag_numeroacte;
				  private Long engag_codemarche;
				  private Long engag_kapassure;
				  private Date engag_dateengagement;
				  private Long engag_capitalliberationengage;
				  private Date engag_dateliberation;
				  private String engag_typesurete;
				  private String engag_identificationtitre;
				  private Long engag_retenudeposit;
				  private Date engag_datedeposit;
				  private Long engag_depositlibere;
				  private Date engag_dateliberationdeposit;
				  private String engag_cautionsolidaire;
				  private Date engag_datecomptabilisation;
				  private String engag_status;
				  private String engag_codeutilisateur;
				  private Date engag_datemodification;
				 // private int active;
				 
				  //variable
				  private Boolean credit;
				  private Boolean riskl;
				  private Boolean riskr;
				  private Boolean lot;
				  private Boolean marche;
				  private Boolean acheteur;
				
}