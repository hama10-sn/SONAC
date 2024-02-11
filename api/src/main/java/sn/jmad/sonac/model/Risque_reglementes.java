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
@Table(name = "risque_reglementes")
 @NoArgsConstructor
 @Data
public class Risque_reglementes implements Serializable{
	  
	  @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long riskr_id;
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
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
	  private String riskr_agrement;
	  private Date riskr_dateagrement;
	  private String riskr_adresse;
	  private Long riskr_typedeposit;
	  private String riskr_deposit;
	
	  
	  
	public Risque_reglementes(PoliceForm p) {
		//super();
		this.riskr_numero = getRiskr_numero();
		this.riskr_numerorisquegenerique = getRiskr_numerorisquegenerique();
		this.riskr_numeroclient = getRiskr_numeroclient();
		this.riskr_numeropolice = getRiskr_numeropolice();
		this.riskr_type = getRiskr_type();
		this.riskr_description = getRiskr_description();
		this.riskr_mtncaution = getRiskr_mtncaution();
		this.riskr_mtncouverturefinanciere = getRiskr_mtncouverturefinanciere();
		this.riskr_dateexigibilite = getRiskr_dateexigibilite();
		this.riskr_daterenouvellement = getRiskr_daterenouvellement();
		this.riskr_capitauxgaranti = getRiskr_capitauxgaranti();
		this.riskr_beneficiaire = getRiskr_beneficiaire();
		this.riskr_revision = getRiskr_revision();
		this.riskr_daterevision = getRiskr_daterevision();
		this.riskr_codeutilisateur = getRiskr_codeutilisateur();
	}



	public Risque_reglementes(Long riskr_numero, Long riskr_numerorisquegenerique,
			Long riskr_numeroclient, Long riskr_numeropolice, String riskr_type, String riskr_description,
			Long riskr_mtncaution, Long riskr_mtncouverturefinanciere, Date riskr_dateexigibilite,
			Date riskr_daterenouvellement, Long riskr_capitauxgaranti, Long riskr_beneficiaire, String riskr_revision,
			Date riskr_daterevision, String riskr_codeutilisateur, String riskr_agrement, Date riskr_dateagrement,
			String riskr_adresse, Long riskr_typedeposit, String riskr_deposit) {
		super();
		this.riskr_numero = riskr_numero;
		this.riskr_numerorisquegenerique = riskr_numerorisquegenerique;
		this.riskr_numeroclient = riskr_numeroclient;
		this.riskr_numeropolice = riskr_numeropolice;
		this.riskr_type = riskr_type;
		this.riskr_description = riskr_description;
		this.riskr_mtncaution = riskr_mtncaution;
		this.riskr_mtncouverturefinanciere = riskr_mtncouverturefinanciere;
		this.riskr_dateexigibilite = riskr_dateexigibilite;
		this.riskr_daterenouvellement = riskr_daterenouvellement;
		this.riskr_capitauxgaranti = riskr_capitauxgaranti;
		this.riskr_beneficiaire = riskr_beneficiaire;
		this.riskr_revision = riskr_revision;
		this.riskr_daterevision = riskr_daterevision;
		this.riskr_codeutilisateur = riskr_codeutilisateur;
		this.riskr_agrement = riskr_agrement;
		this.riskr_dateagrement = riskr_dateagrement;
		this.riskr_adresse = riskr_adresse;
		this.riskr_typedeposit = riskr_typedeposit;
		this.riskr_deposit = riskr_deposit;
	}  
	
}
