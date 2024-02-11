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
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "PayerCommission")
public class PayerCommission implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long pcom_id;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long pcom_numpaie;
	private Long pcom_nupolice;
	private Long pcom_Numquit;
	private Long pcom_intermed;
	private Long pcom_numfact;
	private Date pcom_datepaie;
	private Long pcom_souscript;
	private Long pcom_mtncomemis; 
	private Long pcom_mtncompayé;
	private Date pcomi_datepaiecom;
	private String pcom_csolde;
	private String pcom_typpai;
	private Long pcom_cbanq;
	private String pcom_numchq;
	private Date pcom_dateco;
	private String pcom_ccutil;
	private Date pcom_datemo;
	private String pcom_status;
	private Long active;
	

}
