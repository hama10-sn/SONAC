package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.Data;

@Data
@Entity
@Table(name = "commission")

public class Commission implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long comm_id ;
	
	@Id
	private Long comm_code ;
	
	private Long comm_codeapporteur ;
	
	private Long comm_codebranche ;
	
	private Long comm_codecategorie ;
	
	private Long comm_codeproduit ;
	
	private Long comm_codegarantie ;
	
	// Deux valeurs: '1': par taux, '2': par intervale et forfait
	private String comm_typecalcul ;
	
	private Long comm_interv1 ;
	
	private Long comm_interv2 ;
	
	private Long comm_interv3 ;
	
	private Long comm_interv4 ;
	
	private Long comm_interv5 ;
	
	private Long comm_interv6 ;
	
	private Long comm_interv7 ;
	
	private Long comm_interv8 ;
	
	private Long comm_interv9 ;
	
	private Long comm_interv10 ;
	
	private Double comm_tauxcommission12 ;
	
	private Long comm_montantforfait12 ;
	
	private Double comm_tauxcommission34 ;
	
	private Long comm_montantforfait34 ;
	
	private Double comm_tauxcommission56 ;
	
	private Long comm_montantforfait56 ;
	
	private Double comm_tauxcommission78 ;
	
	private Long comm_montantforfait78 ;
	
	private Double comm_tauxcommission910 ;
	
	private Long comm_montantforfait910 ;
	
	private Date comm_datepriseffet ;
	
	private Date comm_datefineffet ;

}
