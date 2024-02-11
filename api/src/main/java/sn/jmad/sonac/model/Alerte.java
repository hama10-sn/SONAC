package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

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
@Table(name = "alerte" )
public class Alerte implements Serializable {
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long id_alerte;
	  private Long id_rdv;
	  private String id_user;
	  private Date date;
	  private String periodicite;
	  public Alerte( Long id_rdv, String id_user, Date date, String periodicite) {
		super();
		this.id_rdv = id_rdv;
		this.id_user = id_user;
		this.date = date;
		this.periodicite = periodicite;
	}

}
