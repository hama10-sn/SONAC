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

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "reassureur" )

public class Reassureur implements Serializable{

	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long reass_id;
	  @Id 
	  @GeneratedValue(strategy = GenerationType.IDENTITY)	
	  private Long reass_code;
	  private String reass_codeidentificateur;
	  private Long reass_codepays;
	  private int reass_type;
	  private String reass_denomination;
	  private String reass_denominationcourt;
	  private String reass_adresse1;
	  private String reass_adresse2;
	  private String reass_telephone1;
	  private String reass_telephone2;
	  private String reass_email;
	  private Date reass_datetraite1;
	  private Long reass_nbretraite;
	  private Long reass_ca;
	  private Long reass_commissionrecu;
	  private String reass_horsgroupe;
	  private Long reass_codenationalite;
	  private String reass_codeutilisateur;
	  private Date reass_datemodification;
	  private int active;
	public Reassureur(Long reass_code, String reass_codeidentificateur, Long reass_codepays, int reass_type,
			String reass_denomination, String reass_denominationcourt, String reass_adresse1, String reass_adresse2,
			String reass_telephone1, String reass_telephone2, String reass_email, Date reass_datetraite1,
			Long reass_nbretraite, Long reass_ca, Long reass_commissionrecu, String reass_horsgroupe,
			Long reass_codenationalite, String reass_codeutilisateur, Date reass_datemodification,int active) {
		super();
		this.reass_code = reass_code;
		this.reass_codeidentificateur = reass_codeidentificateur;
		this.reass_codepays = reass_codepays;
		this.reass_type = reass_type;
		this.reass_denomination = reass_denomination;
		this.reass_denominationcourt = reass_denominationcourt;
		this.reass_adresse1 = reass_adresse1;
		this.reass_adresse2 = reass_adresse2;
		this.reass_telephone1 = reass_telephone1;
		this.reass_telephone2 = reass_telephone2;
		this.reass_email = reass_email;
		this.reass_datetraite1 = reass_datetraite1;
		this.reass_nbretraite = reass_nbretraite;
		this.reass_ca = reass_ca;
		this.reass_commissionrecu = reass_commissionrecu;
		this.reass_horsgroupe = reass_horsgroupe;
		this.reass_codenationalite = reass_codenationalite;
		this.reass_codeutilisateur = reass_codeutilisateur;
		this.reass_datemodification = reass_datemodification;
		this.active = active;
	}
	  
	  
	  
	  
	
	  
}
