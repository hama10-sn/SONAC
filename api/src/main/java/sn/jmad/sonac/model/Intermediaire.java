package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.Data;

@Data
@Entity
@Table(name = "intermediaire")

public class Intermediaire implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long inter_id ;
	
	@Id
	private Long inter_numero ;
	
	// Courtier, apporteur d'affaire ou agent général
	private String inter_type ;
	
	private String inter_denomination ;
	
	private String inter_denominationcourt ;
	
	private String inter_boitepostale ;
	
	private String inter_rue ;
	
	private String inter_quartierville ;
	
	private String inter_telephone1 ;
	
	private String inter_telephone2 ;
	
	private String inter_portable ;
	
	private String inter_email ;
	
	private String inter_classificationmetier ;
	
	private Long inter_codecommission ;
	
	private Long inter_objectifcaannuel ;
	
	private Long inter_caportefeuille ;
	
	private Long inter_sinistralite ;
	
	private Long inter_arriere ;
	
	private Long inter_dureemoyenne ;
	
	private Long inter_montantcommission ;
	
	private String inter_codeutilisateur ;
	
	private Date inter_datemodification ;
	
	private Date inter_datentrerelation ;
	
	private int active ;

	private String inter_numagrement;
	
	private Date inter_datedebutcarteagrement;
	
	private String inter_autorisation;
	
	private Long inter_anneeexercice;
}
