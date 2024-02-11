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



@Entity
@Table(name = "filiale")
 @NoArgsConstructor
 @Data
public class Filiale implements Serializable{
	  
	  @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long fili_id;
	  @Id
	 // @Column(nullable = false)
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long fili_numero;
	  @Column(nullable = false)
	  private String fili_codecompagnie;
	  @Column(nullable = false)
	  private Long   fili_codepays; 
	  private Long fili_codegroupe;
	  private String fili_denomination;
	  private String fili_sigle;
	  private String fili_codedevise;
	  private String fili_adresse1;
	  private String fili_adresse2;
	  private String fili_telephone1; 
	  private String fili_telephone2;
	  private String fili_telephonemobile;
	  private String fili_codepostal;
	  private String fili_codeutilisateur;
	  private Date   fili_datemodification;
	  private int active;
	  
	public Filiale(String fili_codecompagnie, Long fili_codepays, Long fili_codegroupe,
			String fili_denomination, String fili_sigle, String fili_codedevise, String fili_adresse1,
			String fili_adresse2, String fili_telephone1, String fili_telephone2, String fili_telephonemobile,
			String fili_codepostal, String fili_codeutilisateur, Date fili_datemodification, int active) {
		super();
	    this.active = active;
		this.fili_codecompagnie = fili_codecompagnie;
		this.fili_codepays = fili_codepays;
		this.fili_codegroupe = fili_codegroupe;
		this.fili_denomination = fili_denomination;
		this.fili_sigle = fili_sigle;
		this.fili_codedevise = fili_codedevise;
		this.fili_adresse1 = fili_adresse1;
		this.fili_adresse2 = fili_adresse2;
		this.fili_telephone1 = fili_telephone1;
		this.fili_telephone2 = fili_telephone2;
		this.fili_telephonemobile = fili_telephonemobile;
		this.fili_codepostal = fili_codepostal;
		this.fili_codeutilisateur = fili_codeutilisateur;
		this.fili_datemodification = fili_datemodification;
	}

	  

	  }
