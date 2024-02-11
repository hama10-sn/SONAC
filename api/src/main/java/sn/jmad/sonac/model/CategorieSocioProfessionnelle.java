package sn.jmad.sonac.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.Data;

@Data
@Entity
public class CategorieSocioProfessionnelle {
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long categs_id ;
	
	@Id
	private Long categs_code ;
	
	private Long categs_scode ;
	
	private String categs_liblong ;
	private String categs_libcourt ;

}
