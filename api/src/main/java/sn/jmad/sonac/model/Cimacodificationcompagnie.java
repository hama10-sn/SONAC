package sn.jmad.sonac.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Table(name = "cimacodificationcompagnie")
@NoArgsConstructor
@AllArgsConstructor
@Data

public class Cimacodificationcompagnie implements Serializable{
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id;
	  private String code_cima_compagnie;
	  private String denomination;
	public Cimacodificationcompagnie(String code_cima_compagnie, String denomination) {
		super();
		this.code_cima_compagnie = code_cima_compagnie;
		this.denomination = denomination;
	}

	  }
