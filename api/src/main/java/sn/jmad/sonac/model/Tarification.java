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
@Table(name = "tarification")
 @NoArgsConstructor
 @Data
public class Tarification implements Serializable{
	  
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;
	  private Long code_produit;
	  private String type_risque;
	  private String type_acheteur;
	  private String type_traitement;
	  private String type_ca;
	  private int duree2;
	  private int duree1;
	  private Long ca1;
	  private Long ca2;
	  private double taux_prime;
	  	  
}
