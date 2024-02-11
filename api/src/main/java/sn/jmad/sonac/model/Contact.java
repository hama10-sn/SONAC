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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "contact" )



public class Contact implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	Long cont_id;
	  @Id	  
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long cont_numero;
	  private Long cont_numeroclient;
	  private String cont_nom;
	  private String cont_prenom;
	  private Boolean cont_leader;
	  private Boolean cont_mandataire;
	  private String cont_telephonique1;
	  private String cont_telephonique2;
	  private String cont_email;
	  private String cont_mobile;
	  private int active;
	  
	  
	  public Contact(Long cont_numeroclient, Long cont_numero, String cont_nom, String cont_prenom,
				Boolean cont_leader,Boolean cont_mandataire, String cont_telephonique1, String cont_telephonique2, String cont_email,
				String cont_mobile,int active) {
			super();
			this.cont_numeroclient = cont_numeroclient;
			this.cont_numero = cont_numero;
			this.cont_nom = cont_nom;
			this.cont_prenom = cont_prenom;
			this.cont_leader = cont_leader;
			this.cont_telephonique1 = cont_telephonique1;
			this.cont_telephonique2 = cont_telephonique2;
			this.cont_email = cont_email;
			this.cont_mobile = cont_mobile;
			this.active = active;
			this.cont_mandataire = cont_mandataire;
	} 
		  
}
