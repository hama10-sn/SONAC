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
@Table(name = "garantie")
@NoArgsConstructor 
@Data
public class Garantie {
	
	@Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long gara_id;
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long gara_num;
	  private Long gara_risq;
	  private String gara_typg;
	  private Long gara_capassur;
	  private Long gara_smp;
	  private Long gara_lci;
	  private Long gara_primnet;
	  private Long gara_comapp;
	  private Long gara_frgest;
	  private Long gara_accie;
	  private Long gara_accapp;
	  private Long gara_taxte;
	  private Long gara_taxtva;
	  private Long gara_taxtps;
	  private String gara_tfrob;
	  private Long gara_codfr;
	  private Long gara_mtnfr;
	  private Long gara_txfr;
	  private String gara_exo;
	  private Long gara_ctaxe;
	  private Long gara_ctva;
	  private Long gara_ctps;
	  private Date gara_datexo;
	  private Long gara_numq;
	  private String gara_util;
	  private Date gara_datesai;
	  private String gara_status;
	  
	  

}
