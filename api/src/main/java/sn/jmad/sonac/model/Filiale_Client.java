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
@Table(name = "filiale_client")
 @NoArgsConstructor
 @Data
public class Filiale_Client implements Serializable{
	  
	  @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long filcli_id;
	  @Id
	 // @Column(nullable = false)
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long filcli_numero;
	  @Column(nullable = false)
	  private Long filcli_numercli;
	  @Column(nullable = false)
	  private Long   filcli_codepays; 
	  private Long fili_codegroupe;
	  private String filcli_codedevise;
	  private String filcli_codeutilisateur;
	  private Date   filcli_datemodification;
	  private int active;
	
	  public Filiale_Client(Long filcli_numero, Long filcli_numercli, Long filcli_codepays, Long fili_codegroupe,
			String filcli_codedevise, String filcli_codeutilisateur, Date filcli_datemodification, int active) {
		super();
		this.filcli_numero = filcli_numero;
		this.filcli_numercli = filcli_numercli;
		this.filcli_codepays = filcli_codepays;
		this.fili_codegroupe = fili_codegroupe;
		this.filcli_codedevise = filcli_codedevise;
		this.filcli_codeutilisateur = filcli_codeutilisateur;
		this.filcli_datemodification = filcli_datemodification;
		this.active = active;
	}
	  
	  
	  

	  }
