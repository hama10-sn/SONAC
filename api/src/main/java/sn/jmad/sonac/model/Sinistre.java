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
import org.hibernate.annotations.Where;

import lombok.Data;

@Data
@Entity
@Table(name = "Sinistre")
//@Where(clause = "active = 1")

public class Sinistre implements Serializable {

	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long sini_id;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long sini_num;

	private Long sini_police;

	private Long sini_risque;

	private Long sini_intermediaire;

	private String sini_codecompagnie;

	private Long sini_branche;

	private Long sini_categorie;

	private Long sini_produit;

	private String sini_typesinistre;

	private Date sini_datesurvenance;

	private Date sini_datedeclaration;

	private Date sini_datesaisie;

	private Long sini_souscripteur;

	private Long sini_beneficiaire;

	private Long sini_acheteur;

	private Long sini_donneurdordre;

	private Long sini_tiersrecours;

	private String sini_lieu;

	@Column(nullable = true, columnDefinition = "TEXT")
	private String sini_description;

	private Long sini_coderesponsabilite;

	private Long sini_evaluationprincipale;

	private Long sini_evaluationfrais;
	
	private Long sini_evaluationhonoraires;
	
	private Long sini_evaluationglobale;
	
	private Long sini_sapprincipale;
	
	private Long sini_sapfrais;
	
	private Long sini_saphonoraires;
	
	private Long sini_sapglobale;
	
	private Long sini_reglementprincipal;
	
	private Long sini_reglementfrais;
	
	private Long sini_reglementhonoraires;
	
	private Long sini_reglementglobal;
	
	private Long sini_recoursprincipal;
	
	private Long sini_recoursfrais;
	
	private Long sini_recourshonoraires;
	
	private Long sini_recoursglobal;
	
	private Long sini_recoursprincipalencaisse;
	
	private Long sini_recoursfraisencaisse;
	
	private Long sini_recourshonoraieencaisse;
	
	private Long sini_recoursglobalencaisse;
	
	private Date sini_datederniermvt;
	
	private Long sini_numderniermvt;
	
	private String sini_utilisateur;
	
	private Date sini_datemodification;
	
	private Long sini_codeexpert;
	
	private Date sini_dateexpert;
	
	private String sini_rapport; // Oui ou Non
	
//	private String sini_status;
	private Long sini_status;
	
	private Long sini_motifcloture;
	
	private Date sini_datecloture;

//	private int active;

}
