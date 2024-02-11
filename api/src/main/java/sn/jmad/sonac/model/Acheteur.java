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

import lombok.Data;
import lombok.NoArgsConstructor;
import sn.jmad.sonac.message.response.PoliceForm;



@Entity
@Table(name = "acheteur")
 @NoArgsConstructor
 @Data
public class Acheteur implements Serializable{
	  
	  @Column(columnDefinition = "serial")
	  @Generated(GenerationTime.INSERT)
	  private Long achet_id;
	  @Id 
	 // @Column(nullable = false)
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long achet_numero;
	  private Long achet_numeroclient;
	  private Long achet_numeroaffaire;
	  private String achet_type;
	  private Long achet_chiffreaffaire;
	  private Long achet_incidentpaiement;
	  private Long achet_montantincidentpaiement;
	  private Long achet_montantpaiementrecup;
	  private Long achet_dispersion;
	  private Long achet_qualite;
	  private String achet_typologie;
	  private String achet_creditencours;
	  private Long achet_montantcredit;
	  private Long achet_montantrembours;
	  private Long achet_montantecheance;
	  private Long achet_montantecheancecredit;
	  private Long achet_montantecheanceimpaye;
	  private Long achet_montantimpaye;
	  private Long achet_montantrecouvre;
	  private String achet_codeutilisateur;
	  private Date achet_datemodification;
	  private String achet_nom;
	  private String achet_prenom;
	  private Long achet_comptebancaire;
	  private String achet_numclien_institu;
	  private Long achet_duree;
	  private String achet_avis;
	  private Date achet_date_avis;
	  private String achet_bon_commande;
	  private Date achet_date_facture;
	  private Long achet_numero_facture;
	  private Long achet_chiffreaffaire_confie;
	  private String achet_typecouverture;
	  private String achet_bail;
	  private Long achet_duree_bail;
	  private Long achet_montant_loyer;
	  private Date achet_date_debut_credit;
	  //@Column(columnDefinition = "integer default 1")
	  private int active;
	  
	
	  
	public Acheteur(PoliceForm p) {
		super();
		this.achet_numero = p.getAchet_numero();
		this.achet_numeroclient = p.getAchet_numeroclient();
		this.achet_numeroaffaire = p.getAchet_numeroaffaire();
		this.achet_type = p.getAchet_type();
		this.achet_chiffreaffaire = p.getAchet_chiffreaffaire();
		this.achet_incidentpaiement = p.getAchet_incidentpaiement();
		this.achet_montantincidentpaiement = p.getAchet_montantincidentpaiement();
		this.achet_montantpaiementrecup = p.getAchet_montantpaiementrecup();
		this.achet_dispersion = p.getAchet_dispersion();
		this.achet_qualite = p.getAchet_qualite();
		this.achet_typologie = p.getAchet_typologie();
		this.achet_creditencours = p.getAchet_creditencours();
		this.achet_montantcredit = p.getAchet_montantcredit();
		this.achet_montantrembours = p.getAchet_montantrembours();
		this.achet_montantecheance = p.getAchet_montantecheance();
		this.achet_montantecheancecredit = p.getAchet_montantecheancecredit();
		this.achet_montantecheanceimpaye = p.getAchet_montantecheanceimpaye();
		this.achet_montantimpaye = p.getAchet_montantimpaye();
		this.achet_montantrecouvre = p.getAchet_montantrecouvre();
		this.achet_codeutilisateur = p.getAchet_codeutilisateur();
		this.achet_datemodification = p.getAchet_datemodification();
	}



	public Acheteur(Long achet_numeroclient, Long achet_numeroaffaire, String achet_type, Long achet_chiffreaffaire,
			Long achet_incidentpaiement, Long achet_montantincidentpaiement, Long achet_montantpaiementrecup,
			Long achet_dispersion, Long achet_qualite, String achet_typologie, String achet_creditencours,
			Long achet_montantcredit, Long achet_montantrembours, Long achet_montantecheance,
			Long achet_montantecheancecredit, Long achet_montantecheanceimpaye, Long achet_montantimpaye,
			Long achet_montantrecouvre, String achet_codeutilisateur, Date achet_datemodification, String achet_nom,
			String achet_prenom, Long achet_comptebancaire, String achet_numclien_institu, Long achet_duree,
			String achet_avis, Date achet_date_avis, String achet_bon_commande, Date achet_date_facture,
			Long achet_numero_facture, Long achet_chiffreaffaire_confie, String achet_typecouverture, String achet_bail,
			Long achet_duree_bail, Long achet_montant_loyer, Date achet_date_debut_credit, int active) {
		super();
		this.achet_numeroclient = achet_numeroclient;
		this.achet_numeroaffaire = achet_numeroaffaire;
		this.achet_type = achet_type;
		this.achet_chiffreaffaire = achet_chiffreaffaire;
		this.achet_incidentpaiement = achet_incidentpaiement;
		this.achet_montantincidentpaiement = achet_montantincidentpaiement;
		this.achet_montantpaiementrecup = achet_montantpaiementrecup;
		this.achet_dispersion = achet_dispersion;
		this.achet_qualite = achet_qualite;
		this.achet_typologie = achet_typologie;
		this.achet_creditencours = achet_creditencours;
		this.achet_montantcredit = achet_montantcredit;
		this.achet_montantrembours = achet_montantrembours;
		this.achet_montantecheance = achet_montantecheance;
		this.achet_montantecheancecredit = achet_montantecheancecredit;
		this.achet_montantecheanceimpaye = achet_montantecheanceimpaye;
		this.achet_montantimpaye = achet_montantimpaye;
		this.achet_montantrecouvre = achet_montantrecouvre;
		this.achet_codeutilisateur = achet_codeutilisateur;
		this.achet_datemodification = achet_datemodification;
		this.achet_nom = achet_nom;
		this.achet_prenom = achet_prenom;
		this.achet_comptebancaire = achet_comptebancaire;
		this.achet_numclien_institu = achet_numclien_institu;
		this.achet_duree = achet_duree;
		this.achet_avis = achet_avis;
		this.achet_date_avis = achet_date_avis;
		this.achet_bon_commande = achet_bon_commande;
		this.achet_date_facture = achet_date_facture;
		this.achet_numero_facture = achet_numero_facture;
		this.achet_chiffreaffaire_confie = achet_chiffreaffaire_confie;
		this.achet_typecouverture = achet_typecouverture;
		this.achet_bail = achet_bail;
		this.achet_duree_bail = achet_duree_bail;
		this.achet_montant_loyer = achet_montant_loyer;
		this.achet_date_debut_credit = achet_date_debut_credit;
		this.active = active;
	}



	



	
	  
	
}
