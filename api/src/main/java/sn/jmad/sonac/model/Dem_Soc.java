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

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Dem_Soc" )


 
public class Dem_Soc implements Serializable{
	
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)	
	  private Long dem_socnum;
	  
	  private String dem_denomination;
	  private String dem_typetitulaire;
	  private int dem_clienttitulaire;
	  private int dem_typesociete;
	  private int dem_capitalsocial;
	  private String dem_nomprenomsdg;
	  private String dem_adresse1;
	  private String dem_adresse2;
	  private String dem_ville;
	  private int dem_secteuractivites;
	  private String dem_registrecommerce;
	  private String dem_ninea;
	  private String dem_comptebancaire;
	  private String dem_telephoneprincipal;
	  private String dem_telephone2;
	  private String dem_telephonemobile;
	  private String dem_siteinternet;
	  private String dem_emailsociete;
	  private String dem_emaildirigeant;
	  private int dem_contactsociete;
	  private String dem_objetdemande;
	  private int dem_produitdemande1;
	  private int dem_produitdemande2;
	  private int dem_produitdemande3;
	  private String dem_soumissionarbitrage;
	  private String dem_codeutilisateur;
	  private Date dem_datemodification;
	  private String dem_statut;
	  private int actif;
	  private Long dem_categorie;
	  private Long dem_branch;
	  private Long dem_montant;
	  private String dem_marche;
	  private String dem_commentaire1;
	  private int list_document_valide[];
	  private String list_document_lu[];
	  private Long dem_montant2;
	  private Long dem_montant3;
	  private String dem_commentaire2;
	public Dem_Soc(String dem_denomination, String dem_typetitulaire, int dem_clienttitulaire, int dem_typesociete,
			int dem_capitalsocial, String dem_nomprenomsdg, String dem_adresse1, String dem_adresse2, String dem_ville,
			int dem_secteuractivites, String dem_registrecommerce, String dem_ninea, String dem_comptebancaire,
			String dem_telephoneprincipal, String dem_telephone2, String dem_telephonemobile, String dem_siteinternet,
			String dem_emailsociete, String dem_emaildirigeant, int dem_contactsociete, String dem_objetdemande,
			int dem_produitdemande1, int dem_produitdemande2, int dem_produitdemande3, String dem_soumissionarbitrage,
			String dem_codeutilisateur, Date dem_datemodification, String dem_statut,int actif, 
			Long dem_categorie, Long dem_branch,Long dem_montant,String dem_marche,String dem_commentaire1,String dem_commentaire2,
			int list_document_valide[], String list_document_lu[],Long dem_montant2,Long dem_montant3) {
		super();
		this.dem_denomination = dem_denomination;
		this.dem_typetitulaire = dem_typetitulaire;
		this.dem_clienttitulaire = dem_clienttitulaire;
		this.dem_typesociete = dem_typesociete;
		this.dem_capitalsocial = dem_capitalsocial;
		this.dem_nomprenomsdg = dem_nomprenomsdg;
		this.dem_adresse1 = dem_adresse1;
		this.dem_adresse2 = dem_adresse2;
		this.dem_ville = dem_ville;
		this.dem_secteuractivites = dem_secteuractivites;
		this.dem_registrecommerce = dem_registrecommerce;
		this.dem_ninea = dem_ninea;
		this.dem_comptebancaire = dem_comptebancaire;
		this.dem_telephoneprincipal = dem_telephoneprincipal;
		this.dem_telephone2 = dem_telephone2;
		this.dem_telephonemobile = dem_telephonemobile;
		this.dem_siteinternet = dem_siteinternet;
		this.dem_emailsociete = dem_emailsociete;
		this.dem_emaildirigeant = dem_emaildirigeant;
		this.dem_contactsociete = dem_contactsociete;
		this.dem_objetdemande = dem_objetdemande;
		this.dem_produitdemande1 = dem_produitdemande1;
		this.dem_produitdemande2 = dem_produitdemande2;
		this.dem_produitdemande3 = dem_produitdemande3;
		this.dem_soumissionarbitrage = dem_soumissionarbitrage;
		this.dem_codeutilisateur = dem_codeutilisateur;
		this.dem_datemodification = dem_datemodification;
		this.dem_statut = dem_statut;
		this.actif = actif;
		this.dem_categorie = dem_categorie;
		this.dem_branch = dem_branch ;
		this.dem_montant=dem_montant;
		this.dem_marche=dem_marche;
		this.dem_commentaire2= dem_commentaire2;
		this.dem_commentaire1= dem_commentaire1;
		this.list_document_valide = list_document_valide;
		this.list_document_lu = this.list_document_lu;
		this.dem_montant2 = dem_montant2;
		this.dem_montant3 = dem_montant3;
				}
	

	  
}
