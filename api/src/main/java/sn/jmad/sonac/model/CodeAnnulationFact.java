package sn.jmad.sonac.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Data
@Entity
@Table(name = "codeAnnulationFacture")
public class CodeAnnulationFact {
	@Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String libelle;

}
