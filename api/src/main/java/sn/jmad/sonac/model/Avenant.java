package sn.jmad.sonac.model;

import java.io.Serializable;
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
import lombok.NoArgsConstructor;
import sn.jmad.sonac.message.response.PoliceForm;



@Entity
@Table(name = "avenant")
 @NoArgsConstructor
 @Data
public class Avenant implements Serializable{
	 
	  @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long aven_id;
	  private Long aven_numeropolice;
	  @Id
      // @Column(nullable = false)
	 // @GeneratedValue(strategy = GenerationType.IDENTITY)
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
	public Avenant(Long aven_numeropolice, Long aven_codeintermediare, String aven_codecompagnie, Long aven_codemarche,
			Long aven_typavenant, Date aven_dateeffet, Date aven_dateecheance, Long aven_duree, Date aven_daterevision,
			Long aven_typerevision, Long aven_typecontrat, Long aven_typegestion, Long aven_typefraction,
			Long aven_montantprimenet, Long aven_montantprimebrut, Long aven_coefbonus, Long aven_coefremisecie,
			String aven_numeroattestionauto, String aven_numerocertificat, Long aven_numpoliceremplacee,
			String aven_typefacultative, Long aven_numeroplancoassur, Long aven_numeroplanreassur,
			Long aven_numeroderniernavenant, Date aven_datesuspension, Date aven_dateremisevigueur,
			Date aven_dateresiliation, String aven_statut, Long aven_indice, String aven_typeindice,
			Date aven_dateindice, Long aven_valeurindice, String aven_exonerationtaxe, Long aven_codetaxe,
			String aven_exonerationtva, Long aven_codetva, String aven_exonerationtps, Long aven_codetps,
			Date aven_dateexoneration, Long aven_formulegarantie, String aven_utilisateur, Date aven_datemodification) {
		super();
		this.aven_numeropolice = aven_numeropolice;
		this.aven_codeintermediare = aven_codeintermediare;
		this.aven_codecompagnie = aven_codecompagnie;
		this.aven_codemarche = aven_codemarche;
		this.aven_typavenant = aven_typavenant;
		this.aven_dateeffet = aven_dateeffet;
		this.aven_dateecheance = aven_dateecheance;
		this.aven_duree = aven_duree;
		this.aven_daterevision = aven_daterevision;
		this.aven_typerevision = aven_typerevision;
		this.aven_typecontrat = aven_typecontrat;
		this.aven_typegestion = aven_typegestion;
		this.aven_typefraction = aven_typefraction;
		this.aven_montantprimenet = aven_montantprimenet;
		this.aven_montantprimebrut = aven_montantprimebrut;
		this.aven_coefbonus = aven_coefbonus;
		this.aven_coefremisecie = aven_coefremisecie;
		this.aven_numeroattestionauto = aven_numeroattestionauto;
		this.aven_numerocertificat = aven_numerocertificat;
		this.aven_numpoliceremplacee = aven_numpoliceremplacee;
		this.aven_typefacultative = aven_typefacultative;
		this.aven_numeroplancoassur = aven_numeroplancoassur;
		this.aven_numeroplanreassur = aven_numeroplanreassur;
		this.aven_numeroderniernavenant = aven_numeroderniernavenant;
		this.aven_datesuspension = aven_datesuspension;
		this.aven_dateremisevigueur = aven_dateremisevigueur;
		this.aven_dateresiliation = aven_dateresiliation;
		this.aven_statut = aven_statut;
		this.aven_indice = aven_indice;
		this.aven_typeindice = aven_typeindice;
		this.aven_dateindice = aven_dateindice;
		this.aven_valeurindice = aven_valeurindice;
		this.aven_exonerationtaxe = aven_exonerationtaxe;
		this.aven_codetaxe = aven_codetaxe;
		this.aven_exonerationtva = aven_exonerationtva;
		this.aven_codetva = aven_codetva;
		this.aven_exonerationtps = aven_exonerationtps;
		this.aven_codetps = aven_codetps;
		this.aven_dateexoneration = aven_dateexoneration;
		this.aven_formulegarantie = aven_formulegarantie;
		this.aven_utilisateur = aven_utilisateur;
		this.aven_datemodification = aven_datemodification;
	}
	
	public Avenant(Police p,Long type,String user) {
		super();
		this.aven_numeropolice = p.getPoli_numero();
		this.aven_codeintermediare = p.getPoli_intermediaire();
		this.aven_codecompagnie = p.getPoli_compagnie();
		//this.aven_codemarche = ;
		this.aven_typavenant = type;
		this.aven_dateeffet = p.getPoli_dateeffetencours();
		this.aven_dateecheance = p.getPoli_dateecheance();
		this.aven_duree = p.getPoli_duree();
		this.aven_daterevision = p.getPoli_daterevision();
		this.aven_typerevision = p.getPoli_typerevision();
		this.aven_typecontrat = p.getPoli_typecontrat();
		this.aven_typegestion = p.getPoli_typegestion();
		this.aven_typefraction = p.getPoli_codefractionnement();
		this.aven_montantprimenet = p.getPoli_primenettotal();
		this.aven_montantprimebrut = p.getPoli_primebruttotal();
		this.aven_coefbonus = p.getPoli_coefbonus();
		this.aven_coefremisecie = p.getPoli_remisecommerciale();
		this.aven_numeroattestionauto = p.getPoli_numeroattestation();
		this.aven_numerocertificat = p.getPoli_numerocertificat();
		this.aven_numpoliceremplacee = p.getPoli_policeremplacee();
		this.aven_typefacultative = p.getPoli_typefacultive();
		this.aven_numeroplancoassur = p.getPoli_numeroplancoassur();
		this.aven_numeroplanreassur = p.getPoli_numeroplanreassfac();
		this.aven_numeroderniernavenant = p.getPoli_numerodernieravenant();
		this.aven_datesuspension = p.getPoli_datesuspension();
		this.aven_dateremisevigueur = p.getPoli_dateremisevigueur();
		this.aven_dateresiliation = p.getPoli_dateresiliation();
		this.aven_statut = "actif";
		//this.aven_indice = p.getPoli_indice(); police indice string
		this.aven_typeindice = p.getPoli_typeindice();
		this.aven_dateindice = p.getPoli_dateindice();
		this.aven_valeurindice = p.getPoli_valeurindice();
		this.aven_exonerationtaxe = p.getPoli_exonerationtaxeenr();
		this.aven_codetaxe = p.getPoli_codetaxe();
		this.aven_exonerationtva = p.getPoli_exonerationtva();
		this.aven_codetva = p.getPoli_codetva();
		this.aven_exonerationtps = p.getPoli_exonerationtps();
		this.aven_codetps = p.getPoli_codetps();
		this.aven_dateexoneration = p.getPoli_datexoneration();
		this.aven_formulegarantie = p.getPoli_formulegarantie();
		this.aven_utilisateur = user;
		this.aven_datemodification = p.getPoli_datemodification();
	}
	  
	public Avenant(PoliceForm p) {
		//super();
		this.aven_numeropolice = p.getAven_numeropolice();
		this.aven_codeintermediare = p.getAven_codeintermediare();
		this.aven_codecompagnie = p.getAven_codecompagnie();
		this.aven_codemarche = p.getAven_codemarche();
		this.aven_typavenant = p.getAven_typavenant();
		this.aven_dateeffet = p.getAven_dateeffet();
		this.aven_dateecheance = p.getAven_dateecheance();
		this.aven_duree = p.getAven_duree();
		this.aven_daterevision = p.getAven_daterevision();
		this.aven_typerevision = p.getAven_typerevision();
		this.aven_typecontrat = p.getAven_typecontrat();
		this.aven_typegestion = p.getAven_typegestion();
		this.aven_typefraction = p.getAven_typefraction();
		this.aven_montantprimenet = p.getAven_montantprimenet();
		this.aven_montantprimebrut = p.getAven_montantprimebrut();
		this.aven_coefbonus = p.getAven_coefbonus();
		this.aven_coefremisecie = p.getAven_coefremisecie();
		this.aven_numeroattestionauto = p.getAven_numeroattestionauto();
		this.aven_numerocertificat = p.getAven_numerocertificat();
		this.aven_numpoliceremplacee = p.getAven_numpoliceremplacee();
		this.aven_typefacultative = p.getAven_typefacultative();
		this.aven_numeroplancoassur = p.getAven_numeroplancoassur();
		this.aven_numeroplanreassur = p.getAven_numeroplanreassur();
		this.aven_numeroderniernavenant = p.getAven_numeroderniernavenant();
		this.aven_datesuspension = p.getAven_datesuspension();
		this.aven_dateremisevigueur = p.getAven_dateremisevigueur();
		this.aven_dateresiliation = p.getAven_dateresiliation();
		this.aven_statut = p.getAven_statut();
		this.aven_indice = p.getAven_indice();
		this.aven_typeindice = p.getAven_typeindice();
		this.aven_dateindice = p.getAven_dateindice();
		this.aven_valeurindice = p.getAven_valeurindice();
		this.aven_exonerationtaxe = p.getAven_exonerationtaxe();
		this.aven_codetaxe = p.getAven_codetaxe();
		this.aven_exonerationtva = p.getAven_exonerationtva();
		this.aven_codetva = p.getAven_codetva();
		this.aven_exonerationtps = p.getAven_exonerationtps();
		this.aven_codetps = p.getAven_codetps();
		this.aven_dateexoneration = p.getAven_dateexoneration();
		this.aven_formulegarantie = p.getAven_formulegarantie();
		this.aven_utilisateur = p.getAven_utilisateur();
		this.aven_datemodification = p.getAven_datemodification();
	} 
}
