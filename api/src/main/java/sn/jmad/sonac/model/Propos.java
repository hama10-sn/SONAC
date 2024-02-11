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

@Entity
@Table(name = "propos")
@Data
@AllArgsConstructor

public class Propos implements Serializable{
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long propo_id;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long propo_numero;
	private Date propo_date;
	private Long propo_codeintermediaire;
	private String propo_codecompagnie;
	private Long propo_numerobranche;
	private Long propo_numerocategorie;
	private Long propo_numerosouscripteur;
	private Long propo_numeroprospect;
	private Date propo_dateeffet1er;
	private Date propo_dateannivcontrat;
	private Date propo_dateeffet;
	private Date propo_dateecheance;
	private int propo_dureecontrat;
	private int propo_typecontrat;
	private int propo_typegestion;
	private int propo_codefractionnement;
	private Long propo_mtnprimenetref;
	private Long propo_mtnprimenettot;
	private Long propo_accesoirecompagnie;
	private Long propo_accessoireapporteur;
	private Long propo_taxe;
	private Long propo_commission;
	private Long propo_mtnprimebrut;
	private Long propo_coefbonus;
	private Long propo_coefremisecommerciale;
	private Long propo_codeproduit;
	private Date propo_datesituationproposition;
	private String propo_statusproposition;
	private String propo_exontaxeenr;
	private int propo_codetaxeenr;
	private String propo_exontva;
	private int propo_codetva;
	private String propo_exontps;
	private int propo_codetps;
	private Date propo_dateexon;
	private String propo_codeutil;
	private Date propo_datemaj;
	private Date propo_datetransformationcontrat;
	private int active;
	
	public Propos() {
		super();
	}
	
	
}
