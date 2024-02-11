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

@Data
@Entity
@Table(name = "accessoire")

public class Accessoire implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long acces_id ;
	
	@Id
	private Long acces_code ;
	
	private Long acces_codeapporteur ;

	private Long acces_codebranche ;
	
	private Long acces_codecategorie ;
	
	private Long acces_codeproduit ;
	
	private Long acces_codegarantie ;
	
	private Long acces_interv1 ;
	
	private Long acces_interv2 ;
	
	private Long acces_compagnie1 ;
	
	private Long acces_apporteur1 ;
	
	private Long acces_interv3 ;
	
	private Long acces_interv4 ;
	
	private Long acces_compagnie2 ;
	
	private Long acces_apporteur2 ;
	
	private Long acces_interv5 ;
	
	private Long acces_interv6 ;
	
	private Long acces_compagnie3 ;
	
	private Long acces_apporteur3 ;
	
	private Long acces_interv7 ;
	
	private Long acces_interv8 ;
	
	private Long acces_compagnie4 ;
	
	private Long acces_apporteur4 ;
	
	private Long acces_interv9 ;
	
	private Long acces_interv10 ;
	
	private Long acces_compagnie5 ;
	
	private Long acces_apporteur5 ;
	
	private Long acces_interv11 ;
	
	private Long acces_interv12 ;
	
	private Long acces_compagnie6 ;
	
	private Long acces_apporteur6 ;
	
	private Long acces_interv13 ;
	
	private Long acces_interv14 ;
	
	private Long acces_compagnie7 ;
	
	private Long acces_apporteur7 ;
	
	private Date acces_datepriseffet ;
	
	private Date acces_datefineffet ;
	
	private int active ;
}
