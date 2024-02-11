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
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "categorie" )



public class Categorie implements Serializable{
	
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
	//  @GeneratedValue(strategy = GenerationType.IDENTITY, generator="native")
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	  Long Categ_id;
	  @Id
	  @Column(name="categ_numero", unique=true,nullable = false)
	  private Long categ_numero;
	  private Long categ_numerobranche;
	  private String categ_libellelong;
	  private String categ_libellecourt;  
	  private Long categ_classificationanalytique;
	  private Long categ_codetaxe;
	  private Long categ_codecommission;
	  private Date categ_datemodification;
	  private Date categ_datecomptabilisation;
	  private int active;
	  
}
