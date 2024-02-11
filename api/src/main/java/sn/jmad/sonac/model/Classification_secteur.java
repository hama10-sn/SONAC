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
@Table(name = "classification_secteur")
@NoArgsConstructor
@Data

public class Classification_secteur implements Serializable{
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long code;
	  private String libelle;
	  private String sections;
	  		
}
