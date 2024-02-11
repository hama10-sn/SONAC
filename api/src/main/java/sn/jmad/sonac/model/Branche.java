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
@Table(name = "branche")
public class Branche implements Serializable{
	
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long branche_id ;
	
	@Id
	private Long branche_numero ;
	
	private String branche_libelleLong ;
	private String branche_libellecourt ;
	private Long branche_classeanalytique ;
	private Long branche_codetaxe ;
	private Long branche_codecommission ;
	private Date branche_datemodification ;
	
	private String branch_periodicite_compabilisation ;
	
	private int active ;

	public Branche() {
		super();
	}
}
