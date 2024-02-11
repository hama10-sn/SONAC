package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
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
@Table(name = "pays" )//uniqueConstraints={@UniqueConstraint(columnNames = {"pays_numero" , "pays_codecima"})})

public class Pays implements Serializable{
	  

	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	
	 // @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long pays_id;
	  @Id
	  //@Column(name="pays_code", unique=true,nullable = false)
	   
	  private Long pays_code;
	  
	//@Column(name="pays_codecima", unique=true,nullable = false)
	  private String pays_codecima;
	//@Column(nullable = true)
	  private String pays_libellelong;
	//@Column(nullable = true)
	  private String pays_libellecourt;
	  private String pays_devise;
	  private boolean pays_multidevise;
	  private boolean pays_multillangue; 
	  private String pays_nationalite;
	  private String pays_codeutilisateur;
	  private String pays_datemodification;

	public Pays(Long pays_code, String pays_codecima, String pays_libellelong, String pays_libellecourt,
			String pays_devise, boolean pays_multidevise, boolean pays_multillangue, String pays_nationalite,
			String pays_codeutilisateur, String pays_datemodification) {
		super();
		this.pays_code = pays_code;
		this.pays_codecima = pays_codecima;
		this.pays_libellelong = pays_libellelong;
		this.pays_libellecourt = pays_libellecourt;
		this.pays_devise = pays_devise;
		this.pays_multidevise = pays_multidevise;
		this.pays_multillangue = pays_multillangue;
		this.pays_nationalite = pays_nationalite;
		this.pays_codeutilisateur = pays_codeutilisateur;
		this.pays_datemodification = pays_datemodification; 
	}   

	
}
