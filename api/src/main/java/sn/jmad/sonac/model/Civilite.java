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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "civilite" )
public class Civilite implements Serializable {
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long civ_code;
	  private String civ_libellelong;
	  private String civ_libellecourt;
	  private int civ_nature;
	  public Civilite( String civ_libellelong, String civ_libellecourt, int civ_nature) {
		super();
		this.civ_libellelong = civ_libellelong;
		this.civ_libellecourt = civ_libellecourt;
		this.civ_nature = civ_nature;
	}

}
