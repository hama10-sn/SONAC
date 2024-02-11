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
@Table(name = "credit")
 @NoArgsConstructor
 @Data
public class Credit implements Serializable{
	  
	  @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long credit_id;
	  @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long credit_numero;
	  private Long credit_numeroclient;
	  private Long credit_numeroachateur;
	  private String credit_type;	  
	  private Long credit_typemarchandise;
	  private Long credit_mtncredit;
	  private Long credit_nbecheanceaccorde;
	  private Long credit_nbechenaceretard;
	  private Long credit_nbecheanceimpaye;
	  private Long credit_mntindemnite;
	  private Long credit_mtnrecours;
	  private Long credit_mtnrecoursencaisse;
	  private Long credit_chargerecouvrement;
	  private String  credit_codeutil;
	  private Date credit_datemodification;
	  private Long credit_numpol;
	
	  
	
	
	public Credit(PoliceForm p) {
		//super();
		this.credit_numero = p.getCredit_numero();
		this.credit_numeroclient = p.getCredit_numeroclient();
		this.credit_numeroachateur = p.getCredit_numeroachateur();
		this.credit_type = p.getCredit_type();
		this.credit_typemarchandise = p.getCredit_typemarchandise();
		this.credit_mtncredit = p.getCredit_mtncredit();
		this.credit_nbecheanceaccorde = p.getCredit_nbecheanceaccorde();
		this.credit_nbechenaceretard = p.getCredit_nbechenaceretard();
		this.credit_nbecheanceimpaye = p.getCredit_nbecheanceimpaye();
		this.credit_mntindemnite = p.getCredit_mntindemnite();
		this.credit_mtnrecours = p.getCredit_mtnrecours();
		this.credit_mtnrecoursencaisse = p.getCredit_mtnrecoursencaisse();
		this.credit_chargerecouvrement = p.getCredit_chargerecouvrement();
		this.credit_codeutil = p.getCredit_codeutil();
		this.credit_datemodification = p.getCredit_datemodification();
	}




	public Credit(Long credit_numero, Long credit_numeroclient, Long credit_numeroachateur, String credit_type,
			Long credit_typemarchandise, Long credit_mtncredit, Long credit_nbecheanceaccorde,
			Long credit_nbechenaceretard, Long credit_nbecheanceimpaye, Long credit_mntindemnite,
			Long credit_mtnrecours, Long credit_mtnrecoursencaisse, Long credit_chargerecouvrement,
			String credit_codeutil, Date credit_datemodification, Long credit_numpol) {
		super();
		this.credit_numero = credit_numero;
		this.credit_numeroclient = credit_numeroclient;
		this.credit_numeroachateur = credit_numeroachateur;
		this.credit_type = credit_type;
		this.credit_typemarchandise = credit_typemarchandise;
		this.credit_mtncredit = credit_mtncredit;
		this.credit_nbecheanceaccorde = credit_nbecheanceaccorde;
		this.credit_nbechenaceretard = credit_nbechenaceretard;
		this.credit_nbecheanceimpaye = credit_nbecheanceimpaye;
		this.credit_mntindemnite = credit_mntindemnite;
		this.credit_mtnrecours = credit_mtnrecours;
		this.credit_mtnrecoursencaisse = credit_mtnrecoursencaisse;
		this.credit_chargerecouvrement = credit_chargerecouvrement;
		this.credit_codeutil = credit_codeutil;
		this.credit_datemodification = credit_datemodification;
		this.credit_numpol = credit_numpol;
	}
	  
}
