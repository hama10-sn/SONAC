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

@Entity
@Table(name = "penalites")
@Data
public class Penalite implements Serializable {
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long penalit_id;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long penalit_num;
	
	private Long penalit_sini;
	
	private Long penalit_mvt;
	
	private Long penalit_morat;
	
	private Long penalit_enc;
	
	private Long penalit_poli;
	
	private Long penalit_nmarch;
	
	private Date penalit_datepenalit;
	
	private String penalit_codenc;
	
	private Date penalit_dateval;
	
	private Long penalit_taux;
	
	private Long penalit_mtpenalitfac;
	
	private Long penalit_mtpenalitenc;
	
	private Date penalit_datenc;
	
	private String penalit_typenc;
	
	private Long penalit_cbanq;
	
	private String penalit_numchq;
	
	private Date penalit_dateco;
	
	private String penalit_cutil;
	
	private Date penalit_datemo;
}
