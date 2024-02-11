package sn.jmad.sonac.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@Entity
@Table(name = "acte_arbitrage" )
public class Acte_arbitrage {
	@Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long acte_arbitrage_num;
	private Long acte_num;
	private Long acte_dem_num;
	private String acte_type_dem;
	private String acte_type; 
	private String acte_type_prod;
	private String acte_titre;
	private String acte_dao;
	@Column(columnDefinition="TEXT")
	private String acte_beneficiaire;
	private Date acte_date;
	private String acte_numero_marche;
	private Date acte_date_info;
	@Column(columnDefinition="TEXT")
	private String acte_description_travaux;
	private String acte_numero_compte;
	private String acte_banque;
	private String acte_numero_agrement ;
	private Date acte_debut_agrement;
	private Date acte_date_expiration;
	@Column(columnDefinition="TEXT")
	private String acte_lots ;
	private Date acte_date_fin_garantie ;
	
	//ACTE CREDIT
	private String acte_dossier;
	private String acte_acheteur;
	private String acte_objet;
	private String acte_duree_credit;
	private String acte_taux_prime;
	private String acte_delai_carence;
	private String acte_sanction;
	private String acte_numero_conditionsg;
	private String acte_police;
	//PERTE
	private String acte_cp; 
	@Column(columnDefinition="TEXT")
	private String acte_denomination_locataire; 
	private Date acte_date_naissance;
	private String acte_lieu_naissance;
	private String acte_profession;
	@Column(columnDefinition="TEXT")
	private String acte_situation_bien; 
	@Column(columnDefinition="TEXT")
	private String acte_duree_bail; 
	private String acte_montant_mensuel;
	private String acte_periode_loyer;
	private String acte_mode_regelement; 
	@Column(columnDefinition="TEXT")
	private String acte_montant_couvert;
	private String acte_prime_paiement;
	private String acte_prise_effet;
	@Column(columnDefinition="TEXT")
	private String acte_caducite;
	private String acte_duree_garantie; 
	private String acte_surete;
	@Column(columnDefinition="TEXT")
	private String acte_disposition;
	public Acte_arbitrage(Long acte_arbitrage_num, Long acte_num, Long acte_dem_num, String acte_type_dem,
			String acte_type, String acte_type_prod, String acte_titre, String acte_dao, String acte_beneficiaire,
			Date acte_date, String acte_numero_marche, Date acte_date_info, String acte_description_travaux,
			String acte_numero_compte, String acte_banque, String acte_numero_agrement, Date acte_debut_agrement,
			Date acte_date_expiration, String acte_lots, Date acte_date_fin_garantie, String acte_dossier,
			String acte_acheteur, String acte_objet, String acte_duree_credit, String acte_taux_prime,
			String acte_delai_carence, String acte_sanction, String acte_numero_conditionsg, String acte_police,
			String acte_cp, String acte_denomination_locataire, Date acte_date_naissance, String acte_lieu_naissance,
			String acte_profession, String acte_situation_bien, String acte_duree_bail, String acte_montant_mensuel,
			String acte_periode_loyer, String acte_mode_regelement, String acte_montant_couvert,
			String acte_prime_paiement, String acte_prise_effet, String acte_caducite, String acte_duree_garantie,
			String acte_surete, String acte_disposition) {
		super();
		this.acte_arbitrage_num = acte_arbitrage_num;
		this.acte_num = acte_num;
		this.acte_dem_num = acte_dem_num;
		this.acte_type_dem = acte_type_dem;
		this.acte_type = acte_type;
		this.acte_type_prod = acte_type_prod;
		this.acte_titre = acte_titre;
		this.acte_dao = acte_dao;
		this.acte_beneficiaire = acte_beneficiaire;
		this.acte_date = acte_date;
		this.acte_numero_marche = acte_numero_marche;
		this.acte_date_info = acte_date_info;
		this.acte_description_travaux = acte_description_travaux;
		this.acte_numero_compte = acte_numero_compte;
		this.acte_banque = acte_banque;
		this.acte_numero_agrement = acte_numero_agrement;
		this.acte_debut_agrement = acte_debut_agrement;
		this.acte_date_expiration = acte_date_expiration;
		this.acte_lots = acte_lots;
		this.acte_date_fin_garantie = acte_date_fin_garantie;
		this.acte_dossier = acte_dossier;
		this.acte_acheteur = acte_acheteur;
		this.acte_objet = acte_objet;
		this.acte_duree_credit = acte_duree_credit;
		this.acte_taux_prime = acte_taux_prime;
		this.acte_delai_carence = acte_delai_carence;
		this.acte_sanction = acte_sanction;
		this.acte_numero_conditionsg = acte_numero_conditionsg;
		this.acte_police = acte_police;
		this.acte_cp = acte_cp;
		this.acte_denomination_locataire = acte_denomination_locataire;
		this.acte_date_naissance = acte_date_naissance;
		this.acte_lieu_naissance = acte_lieu_naissance;
		this.acte_profession = acte_profession;
		this.acte_situation_bien = acte_situation_bien;
		this.acte_duree_bail = acte_duree_bail;
		this.acte_montant_mensuel = acte_montant_mensuel;
		this.acte_periode_loyer = acte_periode_loyer;
		this.acte_mode_regelement = acte_mode_regelement;
		this.acte_montant_couvert = acte_montant_couvert;
		this.acte_prime_paiement = acte_prime_paiement;
		this.acte_prise_effet = acte_prise_effet;
		this.acte_caducite = acte_caducite;
		this.acte_duree_garantie = acte_duree_garantie;
		this.acte_surete = acte_surete;
		this.acte_disposition = acte_disposition;
	}
	
		
}
