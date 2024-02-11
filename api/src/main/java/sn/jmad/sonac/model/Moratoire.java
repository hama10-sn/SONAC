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
@Table(name = "moratoires")
@Data
public class Moratoire implements Serializable {
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long morato_id;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long morato_num;
	
	private Long morato_sini;
	
	private Long morato_mvt;
	
	private Long morato_penalit;
	
	private Date morato_datemiseplace;
	
	private Long morato_mtmoratoire;
	
	private String morato_typecheanc;
	
	private Long morato_nbrecheancacc;
	
	private Long morato_mtecheanc;
	
	private Date morato_datech;
	
	private Long morato_mtnechimpayee;
	
	private Long morato_nbrecheancimp;
	
	private String morato_typencdern;
	
	private Long morato_mtnencaiss;
	
	private Long morato_cbanq;
	
	private String morato_numchq;
	
	private Date morato_dateco;
	
	private String morato_cutil;
	
	private Date morato_datemo;
	
	private String morato_status;
}
