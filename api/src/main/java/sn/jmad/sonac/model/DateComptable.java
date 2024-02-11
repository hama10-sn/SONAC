package sn.jmad.sonac.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class DateComptable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long datecompt_codtable;
	private long datecompt_typtable;
	private String datecompt_typcentral;
	private String datecompt_codejournal;//private long datecompt_datecours;
	private String datecompt_libellejourn;//datecompt_datepreced;
	private Date datecompt_datejourn ;//datecompt_exercice;
	private String datecompt_datemens;//datecompt_exerciceclot;
	private long datecompt_dateexercice;//datecompt_exercicecou;
	private String datecompt_cloture;//datecompt_dateprochain;
	//private String datecompt_clotproch;
	//private String datecompt_exerciceouv;
	private Date datecompt_datemodif; 
	private String datecompt_coduser; 
	 
}
