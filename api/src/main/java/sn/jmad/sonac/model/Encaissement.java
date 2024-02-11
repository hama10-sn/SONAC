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
import lombok.NoArgsConstructor;

@Entity
@Table(name = "encaissement")
@NoArgsConstructor
@Data
public class Encaissement {
	 @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long encai_id;
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long encai_numeroencaissement;
	  private Long encai_numerofacture;
	  private Long encai_numeroquittance;
	  private Date encai_datepaiement;
	  private Long encai_numerosouscripteur;
	  private Long encai_numeropolice;
	  private Long encai_numerointermediaire;
	  private Long encai_typquittance;
	  private Long encai_mtnquittance;
	  private Long encai_mtnpaye;
	  private String encai_solde;
	  private String encai_typencaissement;
	  private Long encai_codebanque;
	  private String encai_numerocheque;
	  private Date encai_datecomptabilisation;
	  private String encai_codetraitement;
	  private String encai_codeutilisateur;
	  private Date encai_datemiseajour;
	  private String encai_status;
	  private Long active;
	  
	  //@Column(nullable = true)
	  private Long encai_codeannulation ;
	  //@Column(nullable = true)
	  private Date encai_dateannulation ;
}
