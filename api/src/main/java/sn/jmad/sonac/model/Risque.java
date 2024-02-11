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
@Table(name = "risque")
 @NoArgsConstructor
 @Data
public class Risque implements Serializable{
	  
	  @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long risq_id;
	  private Long risq_numeropolice;
	  @Id
	//  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long risq_numero;
	  private Long risq_numeroacte;
	  private String risq_typerisque;
	  @Column(nullable = true)
	  private String risq_genrerisque;
	  @Column(nullable = true)
	  private String risq_modegestion;
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
	public Risque(Long risq_numeropolice, Long risq_numero, Long risq_numeroacte, String risq_typerisque,
			String risq_designation1, String risq_designation2, String risq_localisation1, String risq_localisation2,
			String risq_gps, Long risq_capitalassure, Long risq_capitalsmp, Long risq_capitallci,
			Long risq_pourcentfacultativeplacement, Long risq_pourcentfacultativen1, Long risq_pourcentfacultativen2,
			Long risq_formulegarantierisque, Long risq_codebienassurable, Long risq_mtnglobalcredit,
			Long risq_nbreecheances, Long risq_nbreecheanceimpayees, String risq_codeutilisateur,
			Date risq_datemodification, String risq_typedeclarationrevision, Long risq_vakeurdeclarative,
			Long risq_typindemnisationretenue, Long risq_typefranchise, Long risq_franchise, Long risq_typeprotection,
			String risq_priseenchargeautorisee, String risq_visitetechobligatoire, String risq_visitetechperiodicite,
			String risq_visitetechrapport, Date risq_visitetechdate, String risq_status,String genrerisque) {
		super();
		this.risq_numeropolice = risq_numeropolice;
		this.risq_numero = risq_numero;
		this.risq_numeroacte = risq_numeroacte;
		this.risq_typerisque = risq_typerisque;
		this.risq_designation1 = risq_designation1;
		this.risq_designation2 = risq_designation2;
		this.risq_localisation1 = risq_localisation1;
		this.risq_localisation2 = risq_localisation2;
		this.risq_gps = risq_gps;
		this.risq_capitalassure = risq_capitalassure;
		this.risq_capitalsmp = risq_capitalsmp;
		this.risq_capitallci = risq_capitallci;
		this.risq_pourcentfacultativeplacement = risq_pourcentfacultativeplacement;
		this.risq_pourcentfacultativen1 = risq_pourcentfacultativen1;
		this.risq_pourcentfacultativen2 = risq_pourcentfacultativen2;
		this.risq_formulegarantierisque = risq_formulegarantierisque;
		this.risq_codebienassurable = risq_codebienassurable;
		this.risq_mtnglobalcredit = risq_mtnglobalcredit;
		this.risq_nbreecheances = risq_nbreecheances;
		this.risq_nbreecheanceimpayees = risq_nbreecheanceimpayees;
		this.risq_codeutilisateur = risq_codeutilisateur;
		this.risq_datemodification = risq_datemodification;
		this.risq_typedeclarationrevision = risq_typedeclarationrevision;
		this.risq_vakeurdeclarative = risq_vakeurdeclarative;
		this.risq_typindemnisationretenue = risq_typindemnisationretenue;
		this.risq_typefranchise = risq_typefranchise;
		this.risq_franchise = risq_franchise;
		this.risq_typeprotection = risq_typeprotection;
		this.risq_priseenchargeautorisee = risq_priseenchargeautorisee;
		this.risq_visitetechobligatoire = risq_visitetechobligatoire;
		this.risq_visitetechperiodicite = risq_visitetechperiodicite;
		this.risq_visitetechrapport = risq_visitetechrapport;
		this.risq_visitetechdate = risq_visitetechdate;
		this.risq_status = risq_status;
		this.risq_genrerisque = genrerisque;
	}
	  
	public Risque(Risque_P p) {
		//super();
		this.risq_numeropolice = p.getRisq_numeropolice();
		//this.risq_numero = p.getRisq_numero();
		this.risq_numeroacte = p.getRisq_numeroacte();
		this.risq_typerisque = p.getRisq_typerisque();
		this.risq_designation1 = p.getRisq_designation1();
		this.risq_designation2 = p.getRisq_designation2();
		this.risq_localisation1 = p.getRisq_localisation1();
		this.risq_localisation2 = p.getRisq_localisation2();
		this.risq_gps = p.getRisq_gps();
		this.risq_capitalassure = p.getRisq_capitalassure();
		this.risq_capitalsmp = p.getRisq_capitalsmp();
		this.risq_capitallci = p.getRisq_capitallci();
		this.risq_pourcentfacultativeplacement = p.getRisq_pourcentfacultativeplacement();
		this.risq_pourcentfacultativen1 = p.getRisq_pourcentfacultativen1();
		this.risq_pourcentfacultativen2 = p.getRisq_pourcentfacultativen2();
		this.risq_formulegarantierisque = p.getRisq_formulegarantierisque();
		this.risq_codebienassurable = p.getRisq_codebienassurable();
		this.risq_mtnglobalcredit = p.getRisq_mtnglobalcredit();
		this.risq_nbreecheances = p.getRisq_nbreecheances();
		this.risq_nbreecheanceimpayees = p.getRisq_nbreecheanceimpayees();
		this.risq_codeutilisateur = p.getRisq_codeutilisateur();
		this.risq_datemodification = p.getRisq_datemodification();
		this.risq_typedeclarationrevision = p.getRisq_typedeclarationrevision();
		this.risq_vakeurdeclarative = p.getRisq_vakeurdeclarative();
		this.risq_typindemnisationretenue = p.getRisq_typindemnisationretenue();
		this.risq_typefranchise = p.getRisq_typefranchise();
		this.risq_franchise = p.getRisq_franchise();
		this.risq_typeprotection = p.getRisq_typeprotection();
		this.risq_priseenchargeautorisee = p.getRisq_priseenchargeautorisee();
		this.risq_visitetechobligatoire = p.getRisq_visitetechobligatoire();
		this.risq_visitetechperiodicite = p.getRisq_visitetechperiodicite();
		this.risq_visitetechrapport = p.getRisq_visitetechrapport();
		this.risq_visitetechdate = p.getRisq_visitetechdate();
		this.risq_status = p.getRisq_status();
		this.risq_genrerisque = p.getRisq_genrerisque();
	}
	  
	 
}
