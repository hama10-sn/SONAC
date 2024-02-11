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

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import sn.jmad.sonac.message.response.PoliceForm;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "engagement" )
public class Engagement implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	Long engag_id;
	  @Id
	//  @GeneratedValue(strategy = GenerationType.IDENTITY)
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
	  private int active;
	public Engagement(Long engag_numeroengagement, Long engag_numpoli, Long engag_numeroavenant, Long engag_numeroacte,
			Long engag_codemarche, Long engag_kapassure, Date engag_dateengagement, Long engag_capitalliberationengage,
			Date engag_dateliberation, String engag_typesurete, String engag_identificationtitre, Long engag_retenudeposit,
			Date engag_datedeposit, Long engag_depositlibere, Date engag_dateliberationdeposit,
			String engag_cautionsolidaire, Date engag_datecomptabilisation, String engag_status,
			String engag_codeutilisateur, Date engag_datemodification) {
		super();
		this.engag_numeroengagement = engag_numeroengagement;
		this.engag_numpoli = engag_numpoli;
		this.engag_numeroavenant = engag_numeroavenant;
		this.engag_numeroacte = engag_numeroacte;
		this.engag_codemarche = engag_codemarche;
		this.engag_kapassure = engag_kapassure;
		this.engag_dateengagement = engag_dateengagement;
		this.engag_capitalliberationengage = engag_capitalliberationengage;
		this.engag_dateliberation = engag_dateliberation;
		this.engag_typesurete = engag_typesurete;
		this.engag_identificationtitre = engag_identificationtitre;
		this.engag_retenudeposit = engag_retenudeposit;
		this.engag_datedeposit = engag_datedeposit;
		this.engag_depositlibere = engag_depositlibere;
		this.engag_dateliberationdeposit = engag_dateliberationdeposit;
		this.engag_cautionsolidaire = engag_cautionsolidaire;
		this.engag_datecomptabilisation = engag_datecomptabilisation;
		this.engag_status = engag_status;
		this.engag_codeutilisateur = engag_codeutilisateur;
		this.engag_datemodification = engag_datemodification;
	}
	  
	  
	public Engagement(Engagement_P p) {
		//super()();
		//this.engag_numeroengagement = p.getEngag_numeroengagement();
		this.engag_numpoli = p.getEngag_numpoli();
		this.engag_numeroavenant = p.getEngag_numeroavenant();
		this.engag_numeroacte = p.getEngag_numeroacte();
		this.engag_codemarche = p.getEngag_codemarche();
		this.engag_kapassure = p.getEngag_kapassure();
		this.engag_dateengagement = p.getEngag_dateengagement();
		this.engag_capitalliberationengage = p.getEngag_capitalliberationengage();
		this.engag_dateliberation = p.getEngag_dateliberation();
		this.engag_typesurete = p.getEngag_typesurete();
		this.engag_identificationtitre = p.getEngag_identificationtitre();
		this.engag_retenudeposit = p.getEngag_retenudeposit();
		this.engag_datedeposit = p.getEngag_datedeposit();
		this.engag_depositlibere = p.getEngag_depositlibere();
		this.engag_dateliberationdeposit = p.getEngag_dateliberationdeposit();
		this.engag_cautionsolidaire = p.getEngag_cautionsolidaire();
		this.engag_datecomptabilisation = p.getEngag_datecomptabilisation();
		this.engag_status = p.getEngag_status();
		this.engag_codeutilisateur = p.getEngag_codeutilisateur();
		this.engag_datemodification = p.getEngag_datemodification();
	}		  
}
