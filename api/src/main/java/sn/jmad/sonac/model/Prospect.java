package sn.jmad.sonac.model;



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

@Entity
@Table(name = "prospect")
@Data
//@Where(clause = "active = 1")
public class Prospect {
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	  private Long prospc_id;
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Id
	private Long prospc_numero;
	// Deux valeurs: '1': Personne physique, '2': Personne morale
	private String prospc_nature;
	// cf table civilité
	private Long prospc_titre;
	private String prospc_nom;
	private String prospc_prenom;
	private String prospc_denomination;
	private String prospc_sigle;
	private String prospc_adressenumero;
	private String prospc_adresserue;
	private String prospc_adresseville;
	//cf table categorie socioprofessionnelle
	private Long prospc_categosocioprof;
	private String prospc_telephone1;
	private String prospc_telephone2;
	private String prospc_portable;
//	@Column(nullable = true)
//	private String prospc_fax;
	private String prospc_email;
	private String prospc_website;
	private String prospc_ninea;
	private String prospc_typesociete; 
	private String prospc_registrecommerce;
	
//	@Column(nullable = true)
	private String prospc_classificationmetier ;
//	@Column(nullable = true)
	private String prospc_cin ;
//	@Column(nullable = true)
	private Long prospc_capitalsocial ;
	
	private String prospc_utilisateur;
	private Date prospc_datemodification;
	private int active ;
	
//	@Column(nullable = true)
	private Date prospc_date_relation;
//	@Column(nullable = true)
	private Date prospc_datenaissance;
//	@Column(nullable = true)
	private Long prospc_chiffreaffaireannuel;
//	@Column(nullable = true)
	private String prospc_princdirigeant ;
//	@Column(nullable = true)
	private String prospc_facebook ;
//	@Column(nullable = true)
	private String prospc_linkdin ;
//	@Column(nullable = true)
	private String prospc_passeport ;
//	@Column(nullable = true)
	private String prospc_activitecommercante ;
	
	/*
	 * Les valeurs du statut en attente
	 * 
	 * 1: Information obligatoire manquante
	 * 2: Piece justificative manquante 
	 * 3: Valide pour tranformation en client
	 *  
	 */
//	@Column(columnDefinition = "integer default 3")
	private Integer prospc_statut ;

	  private int list_document_valide[];
	
	
	
	 public Prospect() {
		 super();
		}


}
