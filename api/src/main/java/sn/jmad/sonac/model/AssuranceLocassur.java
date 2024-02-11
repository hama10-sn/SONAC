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
@Table(name = "assurancelocassur")
 @NoArgsConstructor
 @Data
public class AssuranceLocassur implements Serializable{
	  
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;
	  private String produit;
	  private double tauxprime;
	  private String montantcapitaux;
	  private String fraisetude;
	  private double taxeassurance;
	  private double quotitegarantie;
	  
	  
}
