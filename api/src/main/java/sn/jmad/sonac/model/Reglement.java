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
@Table(name = "Reglement")

public class Reglement {
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long regl_id;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long regl_num;
	
	private Long regl_numsinistre;
	
	private Long regl_nummvt;
	
	private Long regl_numpoli;
	
	private Date regl_datereglement;
	
	private String regl_codereglement;
	
	private Date regl_datevaleur;
	
	private Long regl_montantprincipal;
	
	private Long regl_montantfrais;
	
	private Long regl_montanthonoraire;
	
	private Long regl_montanttotal;
	
	private String regl_codebanque;
	
	private String regl_numcheque;
	
	private Long regl_beneficiaire;
	
	private String regl_nantissement;
	
	private String regl_benefnantissement;
	
	private Long regl_montantnantissement;
	
	private Long regl_debiteur;
	
	private Long regl_status;
	
	private String regl_codeutilisateur;
	
	private Date regl_datecomptabilisation;
	
	private Date regl_datemodification;
	
	@Column(columnDefinition = "int default 1")
	private int active;

}
