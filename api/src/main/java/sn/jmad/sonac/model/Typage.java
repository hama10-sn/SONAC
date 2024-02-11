package sn.jmad.sonac.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name = "typage")
 @NoArgsConstructor
 @Data
public class Typage implements Serializable{
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long typ_id;
	  
	  @Column(nullable = false)
	  private String typ_libelle_long;
	  @Column(nullable = false)
	  private String typ_libelle_court;
	  @Column(nullable = false)
	  private String typ_type;

	public Typage(String typ_libelle_long, String typ_libelle_court, String typ_type) {
		super();
		this.typ_libelle_long = typ_libelle_long;
		this.typ_libelle_court = typ_libelle_court;
		this.typ_type = typ_type;
	}
	  
	  
	  

	  }
