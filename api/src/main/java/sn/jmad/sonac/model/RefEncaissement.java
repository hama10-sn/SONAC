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
@Table(name = "RefEncaissement")
public class RefEncaissement {

	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long refencai_id;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long refencai_code;
	
	private String refencai_typepaiement;
	
	private Long refencai_codebanque;
	
	private String refencai_numerotitre;
	
	private Double refencai_montanttitre;
	
	private Double refencai_montantutiliser;
	
	private Double refencai_montantavoir;
	
	private Date refencai_dateoperation;
	
	private String refencai_status;
}
