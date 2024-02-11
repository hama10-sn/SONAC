package sn.jmad.sonac.model;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;



@Entity
@Table(name = "utilisateur")

public class Utilisateur implements Serializable{
	  @Id
	  @GeneratedValue(strategy = GenerationType.IDENTITY)
	  private Long util_id;

	  private String util_numero;

	  private String util_nom;

	  private String util_prenom;

	  private String util_denomination;

	  private String util_sigle;

	  private String util_type;

	  private String util_adresse;

	  private String util_telephonefixe;

	  private String util_telephoneportable;

	  private String util_email;

	  private String util_numclient;

	  private String util_direction;

	  private String util_departement;

	  private String util_service;

	  private String util_poste;

	  private String util_status;
	  
	  private String util_password;
	  
	  private String util_login;

	
	
	/*@ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_roles", 
    	joinColumns = @JoinColumn(name = "user_id"), 
    	inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();*/
	
	private String util_profil;
	

	private String token;
	@Column(columnDefinition = "TIMESTAMP")
	private LocalDateTime tokenCreationDate;


public Utilisateur() {
		
	}


/*	public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }*/


	public Long getUtil_id() {
		return util_id;
	}


	public void setUtil_id(Long util_id) {
		this.util_id = util_id;
	}


	public String getUtil_numero() {
		return util_numero;
	}


	public void setUtil_numero(String util_numero) {
		this.util_numero = util_numero;
	}


	public String getUtil_nom() {
		return util_nom;
	}


	public void setUtil_nom(String util_nom) {
		this.util_nom = util_nom;
	}


	public String getUtil_prenom() {
		return util_prenom;
	}


	public void setUtil_prenom(String util_prenom) {
		this.util_prenom = util_prenom;
	}


	public String getUtil_denomination() {
		return util_denomination;
	}


	public void setUtil_denomination(String util_denomination) {
		this.util_denomination = util_denomination;
	}


	public String getUtil_sigle() {
		return util_sigle;
	}


	public void setUtil_sigle(String util_sigle) {
		this.util_sigle = util_sigle;
	}


	public String getUtil_type() {
		return util_type;
	}


	public void setUtil_type(String util_type) {
		this.util_type = util_type;
	}


	public String getUtil_adresse() {
		return util_adresse;
	}


	public void setUtil_adresse(String util_adresse) {
		this.util_adresse = util_adresse;
	}


	public String getUtil_telephonefixe() {
		return util_telephonefixe;
	}


	public void setUtil_telephonefixe(String util_telephonefixe) {
		this.util_telephonefixe = util_telephonefixe;
	}


	public String getUtil_telephoneportable() {
		return util_telephoneportable;
	}


	public void setUtil_telephoneportable(String util_telephoneportable) {
		this.util_telephoneportable = util_telephoneportable;
	}


	public String getUtil_email() {
		return util_email;
	}


	public void setUtil_email(String util_email) {
		this.util_email = util_email;
	}


	public String getUtil_numclient() {
		return util_numclient;
	}


	public void setUtil_numclient(String util_numclient) {
		this.util_numclient = util_numclient;
	}


	public String getUtil_direction() {
		return util_direction;
	}


	public void setUtil_direction(String util_direction) {
		this.util_direction = util_direction;
	}


	public String getUtil_departement() {
		return util_departement;
	}


	public void setUtil_departement(String util_departement) {
		this.util_departement = util_departement;
	}


	public String getUtil_service() {
		return util_service;
	}


	public void setUtil_service(String util_service) {
		this.util_service = util_service;
	}


	public String getUtil_poste() {
		return util_poste;
	}


	public void setUtil_poste(String util_poste) {
		this.util_poste = util_poste;
	}


	public String getUtil_status() {
		return util_status;
	}


	public void setUtil_status(String util_status) {
		this.util_status = util_status;
	}


	public String getUtil_password() {
		return util_password;
	}


	public void setUtil_password(String util_password) {
		this.util_password = util_password;
	}


	public String getUtil_login() {
		return util_login;
	}


	public void setUtil_login(String util_login) {
		this.util_login = util_login;
	}


	public Utilisateur(Long util_id, String util_numero, String util_nom, String util_prenom, String util_denomination,
			String util_sigle, String util_type, String util_adresse, String util_telephonefixe,
			String util_telephoneportable, String util_email, String util_numclient, String util_direction,
			String util_departement, String util_service, String util_poste, String util_status, String util_password,
			String util_login, String util_profil) {
		super();
		this.util_id = util_id;
		this.util_numero = util_numero;
		this.util_nom = util_nom;
		this.util_prenom = util_prenom;
		this.util_denomination = util_denomination;
		this.util_sigle = util_sigle;
		this.util_type = util_type;
		this.util_adresse = util_adresse;
		this.util_telephonefixe = util_telephonefixe;
		this.util_telephoneportable = util_telephoneportable;
		this.util_email = util_email;
		this.util_numclient = util_numclient;
		this.util_direction = util_direction;
		this.util_departement = util_departement;
		this.util_service = util_service;
		this.util_poste = util_poste;
		this.util_status = util_status;
		this.util_password = util_password;
		this.util_login = util_login;
		this.util_profil = util_profil;
		
	}


	public Utilisateur(String util_numero, String util_nom, String util_prenom, String util_denomination,
			String util_sigle, String util_type, String util_adresse, String util_telephonefixe,
			String util_telephoneportable, String util_email, String util_numclient, String util_direction,
			String util_departement, String util_service, String util_poste, String util_status, String util_password,
			String util_login, String util_profil) {
		super();
		this.util_numero = util_numero;
		this.util_nom = util_nom;
		this.util_prenom = util_prenom;
		this.util_denomination = util_denomination;
		this.util_sigle = util_sigle;
		this.util_type = util_type;
		this.util_adresse = util_adresse;
		this.util_telephonefixe = util_telephonefixe;
		this.util_telephoneportable = util_telephoneportable;
		this.util_email = util_email;
		this.util_numclient = util_numclient;
		this.util_direction = util_direction;
		this.util_departement = util_departement;
		this.util_service = util_service;
		this.util_poste = util_poste;
		this.util_status = util_status;
		this.util_password = util_password;
		this.util_login = util_login;
		this.util_profil = util_profil;
		
	}


	public String getUtil_profil() {
		return util_profil;
	}


	public void setUtil_profil(String util_profil) {
		this.util_profil = util_profil;
	}


	public String getToken() {
		return token;
	}


	public void setToken(String token) {
		this.token = token;
	}


	public LocalDateTime getTokenCreationDate() {
		return tokenCreationDate;
	}


	public void setTokenCreationDate(LocalDateTime tokenCreationDate) {
		this.tokenCreationDate = tokenCreationDate;
	}


	public Utilisateur(String util_numero, String util_nom, String util_prenom, String util_denomination,
			String util_sigle, String util_type, String util_adresse, String util_telephonefixe,
			String util_telephoneportable, String util_email, String util_numclient, String util_direction,
			String util_departement, String util_service, String util_poste, String util_status, String util_password,
			String util_login, String util_profil, String token, LocalDateTime tokenCreationDate) {
		super();
		this.util_numero = util_numero;
		this.util_nom = util_nom;
		this.util_prenom = util_prenom;
		this.util_denomination = util_denomination;
		this.util_sigle = util_sigle;
		this.util_type = util_type;
		this.util_adresse = util_adresse;
		this.util_telephonefixe = util_telephonefixe;
		this.util_telephoneportable = util_telephoneportable;
		this.util_email = util_email;
		this.util_numclient = util_numclient;
		this.util_direction = util_direction;
		this.util_departement = util_departement;
		this.util_service = util_service;
		this.util_poste = util_poste;
		this.util_status = util_status;
		this.util_password = util_password;
		this.util_login = util_login;
		this.util_profil = util_profil;
		this.token = token;
		this.tokenCreationDate = tokenCreationDate;
	}


	public Utilisateur(Long util_id, String util_numero, String util_nom, String util_prenom, String util_denomination,
			String util_sigle, String util_type, String util_adresse, String util_telephonefixe,
			String util_telephoneportable, String util_email, String util_numclient, String util_direction,
			String util_departement, String util_service, String util_poste, String util_status, String util_password,
			String util_login, String util_profil, String token, LocalDateTime tokenCreationDate) {
		super();
		this.util_id = util_id;
		this.util_numero = util_numero;
		this.util_nom = util_nom;
		this.util_prenom = util_prenom;
		this.util_denomination = util_denomination;
		this.util_sigle = util_sigle;
		this.util_type = util_type;
		this.util_adresse = util_adresse;
		this.util_telephonefixe = util_telephonefixe;
		this.util_telephoneportable = util_telephoneportable;
		this.util_email = util_email;
		this.util_numclient = util_numclient;
		this.util_direction = util_direction;
		this.util_departement = util_departement;
		this.util_service = util_service;
		this.util_poste = util_poste;
		this.util_status = util_status;
		this.util_password = util_password;
		this.util_login = util_login;
		this.util_profil = util_profil;
		this.token = token;
		this.tokenCreationDate = tokenCreationDate;
	}


	
}
