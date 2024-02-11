package sn.jmad.sonac.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.Data;

@Entity
@Table(name = "client")
@Data
public class Client implements Serializable{
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
	private Long client_id;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long clien_numero;
	private String clien_typeclient;
	private Long clien_numerosolvabilite;
	private String clien_nature;
	private Long clien_typesociete;
	private Long clien_coderegroupgestion;
	private Long clien_titre;
	private String clien_nom;
	private String clien_prenom;
	private String clien_denomination;
	private String clien_sigle;
	private String clien_adressenumero;
	private String clien_adresserue;
	private String clien_adresseville;
	private Date clien_datenaissance;
//	private Date clien_datesouscription1;
	private Long clien_categsocioprof;
	private String clien_telephone1;
	private String clien_telephone2;
	private String clien_portable;
//	private String clien_fax;
	private String clien_email;
	private String clien_website;
	private String clien_ninea;
	private String clien_registrecommerce;
	private String clien_codeorigine;
	private String clien_sexe;
	//private Long clien_formejuridique;
	private Long clien_effectif;
	private Long clien_chiffreaffaireannuel;
	private Long clien_chiffreaffaireprime;
	private Long clien_chargesinistre;
	private String clien_contactprinci;
	private Long clien_utilisateur;
	private Date clien_datemodification;
	private Long clien_anciennumero;
	private int active;
	private String clien_CIN;
	private Long clien_capital_social;
	private Date clien_date_relation;
	private Long clien_secteur_activite;
	//@Column(nullable = true)
	private String clien_status ;
//	@Column(nullable = true)
	private String clien_princdirigeant ;
//	@Column(nullable = true)
	private String clien_modegouvernance ;
//	@Column(nullable = true)
	private String clien_principalactionnaire ;
//	@Column(nullable = true)
	private String clien_facebook ;
//	@Column(nullable = true)
	private String clien_linkdin ;
//	@Column(nullable = true)
	private String clien_activitecommercante ;
//	@Column(nullable = true)
	private String clien_passeport ;
	@Column(nullable = true, columnDefinition = "TEXT")
	private String clien_commentaire ;
	
//	@Column(columnDefinition = "bigint default 0")
	private Long clien_numeroprospect ;
	
	public Client() {
		super();
	}
}
