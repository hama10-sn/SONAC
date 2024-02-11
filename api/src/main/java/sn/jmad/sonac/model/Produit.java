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
@Table(name = "produit")
public class Produit implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long prod_id ;
	
	@Id
	private Long prod_numero ;
	
	private Long prod_numerobranche ;
	
	private Long prod_numerocategorie ;
	
	private String prod_denominationlong ;
	
	private String prod_denominationcourt ;
	
	private Long prod_numerogarantieassoc1 ;
	
	private Long prod_numerogarantieassoc2 ;
	
	private Long prod_numerogarantieassoc3 ;
	
	private Long prod_numerogarantieassoc4 ;
	
	private Long prod_numerogarantieassoc5 ;
	
	private Long prod_numerogarantieassoc6 ;
	
	private Long prod_numerogarantieassoc7 ;
	
	private Long prod_numerogarantieassoc8 ;
	
	private Long prod_numerogarantieassoc9 ;
	
	private Long prod_numerogarantieassoc10 ;
	
	private Long prod_numeroextension1 ;
	
	private Long prod_numeroextension2 ;
	
	private Long prod_numeroextension3 ;
	
	private Long prod_codetaxe ;
	
	private Double prod_remisecommerciale ;
	
	private Double prod_remiseexceptionnelle ;
	
	private String prod_codeutilisateur ;
	
	private Date prod_datemodification ;	
}
