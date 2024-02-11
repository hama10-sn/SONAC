package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.Data;

@Data
@Entity
@Table(name = "compagnie")
public class Compagnie implements Serializable{
	
@Column(columnDefinition = "serial")
@Generated(GenerationTime.INSERT)
  private Long comp_id;   
	@Id
  private String comp_numero;
  private String comp_codepays;
  private Long comp_codegroupe;
  private Long comp_type;
  private Long comp_rangmarche;
  private Long comp_camarche;
  private Long comp_carelation;
  private String comp_denomination;
  private String comp_sigle;
  private String comp_adresse1;
  private String comp_adresse2;
  private String comp_telephone1;
  private String comp_telephone2;
  private String comp_email;
  private String comp_numerocontact;
  private String comp_contact;
  private Long comp_codeutilisateur;
  @Temporal(TemporalType.TIMESTAMP)
  private Date comp_datemodification;
  private int active;
  
 /* public Compagnie( int comp_numero, String comp_codepays, Long comp_codegroupe, Long comp_type,
		  Long comp_rangmarche, Long comp_camarche, Long comp_carelation, String comp_denomination, String comp_sigle,
		 String comp_adresse1, String comp_adresse2, String comp_telephone1, String comp_telephone2, String comp_email,
		 String comp_numerocontact, Long comp_codeutilisateur, Date comp_datemodification,int active)
  */
  public Compagnie() {
	  super();
	    }

		
}
