package sn.jmad.sonac.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.Data;
import sn.jmad.sonac.message.response.PoliceForm;

@Data
@Entity
@Table(name = "police_P")
public class Police_P {

	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long poli_num ;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
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
	public Police_P( Long poli_numero, Long poli_codeproduit, Long poli_intermediaire,
			String poli_compagnie, String poli_codepays, String poli_codegroupe, String poli_filiale, Long poli_branche,
			Long poli_categorie, String poli_souscripteur, Long poli_client, Date poli_dateeffet1,
			Date poli_dateanniversaire, Date poli_dateeffetencours, Date poli_dateecheance, Long poli_duree,
			Date poli_daterevision, Long poli_typecontrat, Long poli_typerevision, Long poli_typegestion,
			Long poli_codefractionnement, Long poli_primenetreference, Long poli_primenettotal,
			Long poli_primebruttotal, Long poli_coefbonus, Long poli_remisecommerciale, String poli_numeroattestation,
			String poli_numerocertificat, Long poli_policeremplacee, String poli_typefacultive,
			Long poli_numeroplancoassur, Long poli_numeroplanreassfac, Long poli_numerodernieravenant,
			Date poli_datesuspension, Date poli_dateremisevigueur, Date poli_dateresiliation, int poli_status,
			String poli_indice, String poli_typeindice, Date poli_dateindice, Long poli_valeurindice,
			Long poli_clauseajustement, Long poli_clauserevision, String poli_exonerationtaxeenr, Long poli_codetaxe,
			String poli_exonerationtva, Long poli_codetva, String poli_exonerationtps, Long poli_codetps,
			Date poli_datexoneration, Long poli_formulegarantie, String poli_participationbenef,
			Long poli_tauxparticipationbenef, String poli_codecutilisateur, Date poli_datemodification) {
		super();
		//this.poli_num = poli_num;
		this.poli_numero = poli_numero;
		this.poli_codeproduit = poli_codeproduit;
		this.poli_intermediaire = poli_intermediaire;
		this.poli_compagnie = poli_compagnie;
		this.poli_codepays = poli_codepays;
		this.poli_codegroupe = poli_codegroupe;
		this.poli_filiale = poli_filiale;
		this.poli_branche = poli_branche;
		this.poli_categorie = poli_categorie;
		this.poli_souscripteur = poli_souscripteur;
		this.poli_client = poli_client;
		this.poli_dateeffet1 = poli_dateeffet1;
		this.poli_dateanniversaire = poli_dateanniversaire;
		this.poli_dateeffetencours = poli_dateeffetencours;
		this.poli_dateecheance = poli_dateecheance;
		this.poli_duree = poli_duree;
		this.poli_daterevision = poli_daterevision;
		this.poli_typecontrat = poli_typecontrat;
		this.poli_typerevision = poli_typerevision;
		this.poli_typegestion = poli_typegestion;
		this.poli_codefractionnement = poli_codefractionnement;
		this.poli_primenetreference = poli_primenetreference;
		this.poli_primenettotal = poli_primenettotal;
		this.poli_primebruttotal = poli_primebruttotal;
		this.poli_coefbonus = poli_coefbonus;
		this.poli_remisecommerciale = poli_remisecommerciale;
		this.poli_numeroattestation = poli_numeroattestation;
		this.poli_numerocertificat = poli_numerocertificat;
		this.poli_policeremplacee = poli_policeremplacee;
		this.poli_typefacultive = poli_typefacultive;
		this.poli_numeroplancoassur = poli_numeroplancoassur;
		this.poli_numeroplanreassfac = poli_numeroplanreassfac;
		this.poli_numerodernieravenant = poli_numerodernieravenant;
		this.poli_datesuspension = poli_datesuspension;
		this.poli_dateremisevigueur = poli_dateremisevigueur;
		this.poli_dateresiliation = poli_dateresiliation;
		this.poli_status = poli_status;
		this.poli_indice = poli_indice;
		this.poli_typeindice = poli_typeindice;
		this.poli_dateindice = poli_dateindice;
		this.poli_valeurindice = poli_valeurindice;
		this.poli_clauseajustement = poli_clauseajustement;
		this.poli_clauserevision = poli_clauserevision;
		this.poli_exonerationtaxeenr = poli_exonerationtaxeenr;
		this.poli_codetaxe = poli_codetaxe;
		this.poli_exonerationtva = poli_exonerationtva;
		this.poli_codetva = poli_codetva;
		this.poli_exonerationtps = poli_exonerationtps;
		this.poli_codetps = poli_codetps;
		this.poli_datexoneration = poli_datexoneration;
		this.poli_formulegarantie = poli_formulegarantie;
		this.poli_participationbenef = poli_participationbenef;
		this.poli_tauxparticipationbenef = poli_tauxparticipationbenef;
		this.poli_codecutilisateur = poli_codecutilisateur;
		this.poli_datemodification = poli_datemodification;
	}
	
	public Police_P(PoliceForm p) {
		
		this.poli_numero = p.getPoli_numero();
		this.poli_codeproduit = p.getPoli_codeproduit();
		this.poli_intermediaire = p.getPoli_intermediaire();
		this.poli_compagnie = p.getPoli_compagnie();
		this.poli_codepays = p.getPoli_codepays();
		this.poli_codegroupe = p.getPoli_codegroupe();
		this.poli_filiale = p.getPoli_filiale();
		this.poli_branche = p.getPoli_branche();
		this.poli_categorie = p.getPoli_categorie();
		this.poli_souscripteur = p.getPoli_souscripteur();
		this.poli_client = p.getPoli_client();
		this.poli_dateeffet1 = p.getPoli_dateeffet1();
		this.poli_dateanniversaire = p.getPoli_dateanniversaire();
		this.poli_dateeffetencours = p.getPoli_dateeffetencours();
		this.poli_dateecheance = p.getPoli_dateecheance();
		this.poli_duree = p.getPoli_duree();
		this.poli_daterevision = p.getPoli_daterevision();
		this.poli_typecontrat = p.getPoli_typecontrat();
		this.poli_typerevision = p.getPoli_typerevision();
		this.poli_typegestion = p.getPoli_typegestion();
		this.poli_codefractionnement = p.getPoli_codefractionnement();
		this.poli_primenetreference = p.getPoli_primenetreference();
		this.poli_primenettotal = p.getPoli_primenettotal();
		this.poli_primebruttotal = p.getPoli_primebruttotal();
		this.poli_coefbonus = p.getPoli_coefbonus();
		this.poli_remisecommerciale = p.getPoli_remisecommerciale();
		this.poli_numeroattestation = p.getPoli_numeroattestation();
		this.poli_numerocertificat = p.getPoli_numerocertificat();
		this.poli_policeremplacee = p.getPoli_policeremplacee();
		this.poli_typefacultive = p.getPoli_typefacultive();
		this.poli_numeroplancoassur = p.getPoli_numeroplancoassur();
		this.poli_numeroplanreassfac = p.getPoli_numeroplanreassfac();
		this.poli_numerodernieravenant = p.getPoli_numerodernieravenant();
		this.poli_datesuspension = p.getPoli_datesuspension();
		this.poli_dateremisevigueur = p.getPoli_dateremisevigueur();
		this.poli_dateresiliation = p.getPoli_dateresiliation();
		this.poli_status = p.getPoli_status();
		this.poli_indice = p.getPoli_indice();
		this.poli_typeindice = p.getPoli_typeindice();
		this.poli_dateindice = p.getPoli_dateindice();
		this.poli_valeurindice = p.getPoli_valeurindice();
		this.poli_clauseajustement = p.getPoli_clauseajustement();
		this.poli_clauserevision = p.getPoli_clauserevision();
		this.poli_exonerationtaxeenr = p.getPoli_exonerationtaxeenr();
		this.poli_codetaxe = p.getPoli_codetaxe();
		this.poli_exonerationtva = p.getPoli_exonerationtva();
		this.poli_codetva = p.getPoli_codetva();
		this.poli_exonerationtps = p.getPoli_exonerationtps();
		this.poli_codetps = p.getPoli_codetps();
		this.poli_datexoneration = p.getPoli_datexoneration();
		this.poli_formulegarantie = p.getPoli_formulegarantie();
		this.poli_participationbenef = p.getPoli_participationbenef();
		this.poli_tauxparticipationbenef = p.getPoli_tauxparticipationbenef();
		this.poli_codecutilisateur = p.getPoli_codecutilisateur();
		this.poli_datemodification = p.getPoli_datemodification();
	}
	public Police_P() {}
}
