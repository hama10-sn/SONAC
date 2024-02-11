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
@Table(name = "dem_Pers" )



public class Dem_Pers implements Serializable{
	
	 @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)	
	  private Long dem_persnum;
	 
	  private String dem_typeclientpers;
	  private int dem_typetitulaire;
	  private int dem_civilitepers;
	  private String dem_nom;
	  private String dem_prenom;
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
	  private String dem_email;
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
	  private String dem_commentaire;
	  private String dem_commentaire2;
	  private String dem_entreprise;
	  private Long dem_montant;
	  private String dem_marche;
	  private int list_document_valide[];
	  private String list_document_lu[];
	  private Long dem_montant2;
	  private Long dem_montant3;
	  
	public Dem_Pers(String dem_typeclientpers, int dem_typetitulaire, int dem_civilitepers, String dem_nom,
			String dem_prenom, String dem_adresse1, String dem_adresse2, String dem_ville, int dem_secteuractivites,
			String dem_registrecommerce, String dem_ninea, String dem_comptebancaire, String dem_telephoneprincipal,
			String dem_telephone2, String dem_telephonemobile, String dem_email, String dem_objetdemande,
			int dem_produitdemande1, int dem_produitdemande2, int dem_produitdemande3, String dem_soumissionarbitrage,
			String dem_codeutilisateur, Date dem_datemodification, String dem_statut,int actif,String dem_commentaire,String dem_entreprise,
			Long dem_branch,Long dem_categorie,Long dem_montant,String dem_marche,int list_document_valide[],String list_document_lu[],Long dem_montant2,Long dem_montant3) {
		super();
		this.dem_typeclientpers = dem_typeclientpers;
		this.dem_typetitulaire = dem_typetitulaire;
		this.dem_civilitepers = dem_civilitepers;
		this.dem_nom = dem_nom;
		this.dem_prenom = dem_prenom;
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
		this.dem_email = dem_email;
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
		this.dem_commentaire = dem_commentaire;
		this.dem_entreprise=dem_entreprise;
		this.dem_montant=dem_montant;
		this.dem_marche=dem_marche;
		this.list_document_valide=list_document_valide;
		this.list_document_lu = list_document_lu;
		this.dem_montant2=dem_montant2;
		this.dem_montant3 = dem_montant3;
		

	}
	
	
	  
	


	 
	  
}
