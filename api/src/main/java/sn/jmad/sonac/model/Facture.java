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
import sn.jmad.sonac.message.response.PoliceForm;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "facture" )
public class Facture implements Serializable{
	
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	Long fact_id;
	  @Id	  
	//  @GeneratedValue(strategy = GenerationType.IDENTITY)
	 
	  private Long fact_numacte;
	  private Date fact_datefacture;
	  private Long fact_numeropolice;
	  private Long fact_numeroacte; 
	  private Long fact_numeroquittance;
	  private String fact_marche;
	  private Long fact_numerosouscripteurcontrat;
	  private Long fact_numeoracheteur;
	  private Long fact_numeroassure;
	  private Long fact_numerobeneficiaire;
	  private String fact_objetfacture;
	  private Long fact_montantprimenet;
	  private Long fact_montantaccescompagnie;
	  private Long fact_montantaccesapporteur;
	  private Long fact_montanttaxe;
	  private Long fact_montantarrondi;
	  private Long fact_commissionapporteur;
	  private Long fact_montantttc;
	  private Long fact_numerobranche;
	  private Long fact_numerocategorie;
	  private Date fact_dateeffetcontrat;
	  private Date fact_dateecheancecontrat;
	  private Long fact_capitalassure;
	  private Long fact_capitalsmp;
	  private Long fact_capitallci;
	  private Date fact_datecomptabilisation;
	  private String fact_codeutilisateur;
	  
	  private Date fact_datemodification;
	  private String fact_etatfacture;
	  private Long fact_codeannulation;
	  private Date fact_dateannulation;
	  private String fact_anciennumerofacture;
	  private int active;
	public Facture(Long fact_numacte, Date fact_datefacture, Long fact_numeropolice, Long fact_numeroacte,
			Long fact_numeroquittance, String fact_marche, Long fact_numerosouscripteurcontrat,
			Long fact_numeoracheteur, Long fact_numeroassure, Long fact_numerobeneficiaire, String fact_objetfacture,
			Long fact_montantprimenet, Long fact_montantaccescompagnie, Long fact_montantaccesapporteur,
			Long fact_montanttaxe, Long fact_montantarrondi, Long fact_commissionapporteur, Long fact_montantttc,
			Long fact_numerobranche, Long fact_numerocategorie, Date fact_dateeffetcontrat,
			Date fact_dateecheancecontrat, Long fact_capitalassure, Long fact_capitalsmp, Long fact_capitallci,
			Date fact_datecomptabilisation, String fact_codeutilisateur, Date fact_datemodification,
			String fact_etatfacture, Long fact_codeannulation, Date fact_dateannulation,
			String fact_anciennumerofacture, int active) {
		super();
		this.fact_numacte = fact_numacte;
		this.fact_datefacture = fact_datefacture;
		this.fact_numeropolice = fact_numeropolice;
		this.fact_numeroacte = fact_numeroacte;
		this.fact_numeroquittance = fact_numeroquittance;
		this.fact_marche = fact_marche;
		this.fact_numerosouscripteurcontrat = fact_numerosouscripteurcontrat;
		this.fact_numeoracheteur = fact_numeoracheteur;
		this.fact_numeroassure = fact_numeroassure;
		this.fact_numerobeneficiaire = fact_numerobeneficiaire;
		this.fact_objetfacture = fact_objetfacture;
		this.fact_montantprimenet = fact_montantprimenet;
		this.fact_montantaccescompagnie = fact_montantaccescompagnie;
		this.fact_montantaccesapporteur = fact_montantaccesapporteur;
		this.fact_montanttaxe = fact_montanttaxe;
		this.fact_montantarrondi = fact_montantarrondi;
		this.fact_commissionapporteur = fact_commissionapporteur;
		this.fact_montantttc = fact_montantttc;
		this.fact_numerobranche = fact_numerobranche;
		this.fact_numerocategorie = fact_numerocategorie;
		this.fact_dateeffetcontrat = fact_dateeffetcontrat;
		this.fact_dateecheancecontrat = fact_dateecheancecontrat;
		this.fact_capitalassure = fact_capitalassure;
		this.fact_capitalsmp = fact_capitalsmp;
		this.fact_capitallci = fact_capitallci;
		this.fact_datecomptabilisation = fact_datecomptabilisation;
		this.fact_codeutilisateur = fact_codeutilisateur;
		this.fact_datemodification = fact_datemodification;
		this.fact_etatfacture = fact_etatfacture;
		this.fact_codeannulation = fact_codeannulation;
		this.fact_dateannulation = fact_dateannulation;
		this.fact_anciennumerofacture = fact_anciennumerofacture;
		this.active = active;
	}
	public Facture(Facture f) {
		
		
		this.fact_datefacture = f.fact_datefacture;
		this.fact_numeropolice = f.fact_numeropolice;
		this.fact_numeroacte = f.fact_numeroacte;
		this.fact_numeroquittance = f.fact_numeroquittance;
		this.fact_marche = f.fact_marche;
		this.fact_numerosouscripteurcontrat = f.fact_numerosouscripteurcontrat;
		this.fact_numeoracheteur = f.fact_numeoracheteur;
		this.fact_numeroassure = f.fact_numeroassure;
		this.fact_numerobeneficiaire = f.fact_numerobeneficiaire;
		this.fact_objetfacture = f.fact_objetfacture;
		this.fact_montantprimenet = f.fact_montantprimenet;
		this.fact_montantaccescompagnie = f.fact_montantaccescompagnie;
		this.fact_montantaccesapporteur = f.fact_montantaccesapporteur;
		this.fact_montanttaxe = f.fact_montanttaxe;
		this.fact_montantarrondi = f.fact_montantarrondi;
		this.fact_commissionapporteur = f.fact_commissionapporteur;
		this.fact_montantttc = f.fact_montantttc;
		this.fact_numerobranche = f.fact_numerobranche;
		this.fact_numerocategorie = f.fact_numerocategorie;
		this.fact_dateeffetcontrat = f.fact_dateeffetcontrat;
		this.fact_dateecheancecontrat = f.fact_dateecheancecontrat;
		this.fact_capitalassure = f.fact_capitalassure;
		this.fact_capitalsmp = f.fact_capitalsmp;
		this.fact_capitallci = f.fact_capitallci;
		this.fact_datecomptabilisation = f.fact_datecomptabilisation;
		this.fact_codeutilisateur = f.fact_codeutilisateur;
		this.fact_datemodification = f.fact_datemodification;
		this.fact_etatfacture = f.fact_etatfacture;
		this.fact_codeannulation = f.fact_codeannulation;
		this.fact_dateannulation = f.fact_dateannulation;
		this.fact_anciennumerofacture = f.fact_anciennumerofacture;
		this.active = f.active;
	}
	
	public Facture(PoliceForm p) {
		//super();
		this.fact_numacte = p.getFact_numacte();
		this.fact_datefacture = p.getFact_datefacture();
		this.fact_numeropolice = p.getFact_numeropolice();
		this.fact_numeroacte = p.getFact_numeroacte();
		this.fact_numeroquittance = p.getFact_numeroquittance();
		this.fact_marche = p.getFact_marche();
		this.fact_numerosouscripteurcontrat = p.getFact_numerosouscripteurcontrat();
		this.fact_numeoracheteur = p.getFact_numeoracheteur();
		this.fact_numeroassure = p.getFact_numeroassure();
		this.fact_numerobeneficiaire = p.getFact_numerobeneficiaire();
		this.fact_objetfacture = p.getFact_objetfacture();
		this.fact_montantprimenet = p.getFact_montantprimenet();
		this.fact_montantaccescompagnie = p.getFact_montantaccescompagnie();
		this.fact_montantaccesapporteur = p.getFact_montantaccesapporteur();
		this.fact_montanttaxe = p.getFact_montanttaxe();
		this.fact_montantarrondi = p.getFact_montantarrondi();
		this.fact_commissionapporteur = p.getFact_commissionapporteur();
		this.fact_montantttc = p.getFact_montantttc();
		this.fact_numerobranche = p.getFact_numerobranche();
		this.fact_numerocategorie = p.getFact_numerocategorie();
		this.fact_dateeffetcontrat = p.getFact_dateeffetcontrat();
		this.fact_dateecheancecontrat = p.getFact_dateecheancecontrat();
		this.fact_capitalassure = p.getFact_capitalassure();
		this.fact_capitalsmp = p.getFact_capitalsmp();
		this.fact_capitallci = p.getFact_capitallci();
		this.fact_datecomptabilisation = p.getFact_datecomptabilisation();
		this.fact_codeutilisateur = p.getFact_codeutilisateur();
		this.fact_datemodification = p.getFact_datemodification();
		this.fact_etatfacture = p.getFact_etatfacture();
		this.fact_codeannulation = p.getFact_codeannulation();
		this.fact_dateannulation = p.getFact_dateannulation();
		this.fact_anciennumerofacture = p.getFact_anciennumerofacture();
		//this.active = active();
	}
}
