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
@Table(name = "risque_locatifs")
 @NoArgsConstructor
 @Data
public class Risque_locatif implements Serializable{
	  
	  @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long riskl_id;
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long riskl_numero;
	  private Long riskl_numerorisquegenerique;
	  private Long riskl_numeroclient;
	  private Long riskl_numeroacheteur;
	  private Long riskl_numeropolice;
	  private String riskl_type;
	  private String riskl_description;
	  private Long riskl_mtnloyer;
	  private Long riskl_nombreloyerimpaye;
	  private Long riskl_mtnloyerimpaye;
	  private Long riskl_mntloyerindemnite;
	  private Long riskl_mntloyerrecouvre;
	  private String riskl_codeutilisateur;
	public Risque_locatif(Long riskl_numero, Long riskl_numerorisquegenerique, Long riskl_numeroclient,
			Long riskl_numeroacheteur, Long riskl_numeropolice, String riskl_type, String riskl_description,
			Long riskl_mtnloyer, Long riskl_nombreloyerimpaye, Long riskl_mtnloyerimpaye, Long riskl_mntloyerindemnite,
			Long riskl_mntloyerrecouvre, String riskl_codeutilisateur) {
		super();
		this.riskl_numero = riskl_numero;
		this.riskl_numerorisquegenerique = riskl_numerorisquegenerique;
		this.riskl_numeroclient = riskl_numeroclient;
		this.riskl_numeroacheteur = riskl_numeroacheteur;
		this.riskl_numeropolice = riskl_numeropolice;
		this.riskl_type = riskl_type;
		this.riskl_description = riskl_description;
		this.riskl_mtnloyer = riskl_mtnloyer;
		this.riskl_nombreloyerimpaye = riskl_nombreloyerimpaye;
		this.riskl_mtnloyerimpaye = riskl_mtnloyerimpaye;
		this.riskl_mntloyerindemnite = riskl_mntloyerindemnite;
		this.riskl_mntloyerrecouvre = riskl_mntloyerrecouvre;
		this.riskl_codeutilisateur = riskl_codeutilisateur;
	}
	  
	public Risque_locatif(PoliceForm p) {
		//super();
		this.riskl_numero = p.getRiskl_numero();
		this.riskl_numerorisquegenerique = p.getRiskl_numerorisquegenerique();
		this.riskl_numeroclient = p.getRiskl_numeroclient();
		this.riskl_numeroacheteur = p.getRiskl_numeroacheteur();
		this.riskl_numeropolice = p.getRiskl_numeropolice();
		this.riskl_type = p.getRiskl_type();
		this.riskl_description = p.getRiskl_description();
		this.riskl_mtnloyer = p.getRiskl_mtnloyer();
		this.riskl_nombreloyerimpaye = p.getRiskl_nombreloyerimpaye();
		this.riskl_mtnloyerimpaye = p.getRiskl_mtnloyerimpaye();
		this.riskl_mntloyerindemnite = p.getRiskl_mntloyerindemnite();
		this.riskl_mntloyerrecouvre = p.getRiskl_mntloyerrecouvre();
		this.riskl_codeutilisateur = p.getRiskl_codeutilisateur();
	} 
}
