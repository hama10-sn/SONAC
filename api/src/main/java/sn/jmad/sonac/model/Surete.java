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

@Entity
@Data
@Table(name = "surete")
public class Surete implements Serializable {

	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	Long surete_id;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long surete_numero;
	private Long surete_numpoli;
	private Long surete_numeroavenant;
	private Long surete_numeroacte;
	private Long surete_numeroengagement;

	private String surete_typesurete;
	private String surete_identificationtitre;
	private String surete_localisation;
	private String surete_adressegeolocalisation;
	private Long surete_retenudeposit;
	private Date surete_datedeposit;
	private Long surete_depositlibere;
	private Date surete_dateliberation;
	private String surete_cautionsolidaire;
	private Date surete_datecomptabilisation;
	private String surete_codeutilisateur;
	private Date surete_datemodification;
	private int surete_active;
	/*
	 * 0:aucune libération, 1:libération partielle(pour déposit) et 
	 * 
	 * 2:libération totale (plus possible de faire une nouvelle libération)
	 */
//	@Column(columnDefinition = "integer default 0")
	private int surete_statutliberation;

}
