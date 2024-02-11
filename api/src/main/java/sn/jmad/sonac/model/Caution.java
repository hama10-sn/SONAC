package sn.jmad.sonac.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.lang.Nullable;

import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name = "caution")
 @NoArgsConstructor
 @Data
public class Caution implements Serializable{
	  
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;
	  private int type;
	  private String produit;
	  private double tauxprime;
	  private String montantcapitaux;
	  private String fraisetudedossier;
	  private double taxeassurance;
	  private String deposite;
	  private Long produit_id;
	  
	  
}
