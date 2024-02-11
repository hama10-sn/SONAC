package sn.jmad.sonac.model;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name = "creditdomestique")
 @NoArgsConstructor
 @Data
public class CreditDomestique implements Serializable{
	  
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;
	  private String produit;
	  private String dureecredit;
	  private double tauxprime;
	  private String montantcapitauxdossier;
	  private String fraisetudeassurance;
	  private double taxe;
	  private double deposite;
	  private Long id_produit;
	  
	  
}
