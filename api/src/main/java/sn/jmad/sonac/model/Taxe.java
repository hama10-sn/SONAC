package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;

import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.Data;

@Entity
@Table(name = "taxe")
@Data
public class Taxe implements Serializable{
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	  private Long taxe_id;
		@Id
	 private Long taxe_codetaxe;
	 private Long taxe_branch;
	 private Long taxe_catego;
	 private Long taxe_codeproduit;
	 private Long taxe_garant;
	 private Long taxe_calcul;
	 private Double taxe_txappliq;
	 private Date taxe_dateffet;
	 private Date taxe_datefin;
	 private int active;
	 
	 public Taxe() {
		 super();
		}

	
}
