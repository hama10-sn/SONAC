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
@Table(name = "creditexport")
 @NoArgsConstructor
 @Data
public class CreditExport implements Serializable{
	  
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;
	  private String produit;
	  private String typerisque;
	  private double tauxca;
	  private int typeca;
	  private double quotitegarantie;
	  
	  
	  
}
