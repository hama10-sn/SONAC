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

@Data
@Entity
@Table(name = "Recours")
public class Recours {
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long recou_id;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long recou_num;
	
	private Long recou_sin;
	
	private Long recou_mvt;
	
	private Long recou_rglt;
	
	private Long recou_poli;
	
	private Long recou_nmarch;
	
	private Date recou_daterec;
	
	private String recou_cregl;
	
	private Date recou_dateval;
		
	private Long recou_mtnrec;
	
	private Long recou_mtnenc;
	
	private Long recou_mtnencp;
	
	private Long recou_mtnenfr;
	
	private Long recou_mtnenho;
	
	private Date recou_dateenc;
	
	private String recou_typeenc;
	
	private String recou_cbanq;
	
	private String recou_numchq;
	
	private Long recou_beneficiaire;
	
	private Long recou_achdor;
	
	private Date recou_dateco;
	
	private String recou_typr;
	
	private String recou_utilisateur;
	
	private Date recou_datemo;
}
