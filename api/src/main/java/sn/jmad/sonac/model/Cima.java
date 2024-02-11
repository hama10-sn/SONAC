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
@Table(name = "cima" )



public class Cima implements Serializable{
	
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)	
	  Long cim_id;
	  
	  private String cim_code;
	  public Cima(String cim_code) {
		super();
		this.cim_code = cim_code;
	}	 
	  
	

	
	  
}
