package sn.jmad.sonac.message.response;

import java.util.Date;

public interface EncaissementClient {
	
	public Long getEncai_id();
	
	public Long getEncai_numeroencaissement();
	
	public Long getEncai_numerofacture();
	
	public Long getEncai_numeroquittance();
	
	public Date getEncai_datepaiement();
	
	public Long getEncai_numerosouscripteur();
	
	public Long getEncai_numeropolice();
	
	public Long getEncai_numerointermediaire();
	
	public Long getEncai_typquittance();
	
	public Long getEncai_mtnquittance();
	
	public Long getEncai_mtnpaye();
	
	public String getEncai_solde();
	
	public String getEncai_typencaissement();
	
	public Long getEncai_codebanque();
	
	public String getEncai_numerocheque();
	
	public Date getEncai_datecomptabilisation();
	
	public String getEncai_codetraitement();
	
	public String getEncai_codeutilisateur();
	
	public Date getEncai_datemiseajour();
	
	public String getEncai_status();
	
	public Long getEncai_codeannulation();
	
	public Date getEncai_dateannulation();
	
//	Pour client
	public Long getClient_id();

	public Long getClien_numero();

	public String getClien_typeclient();

	public Long getClien_numerosolvabilite();

	public String getClien_nature();

	public Long getClien_typesociete();

	public Long getClien_coderegroupgestion();

	public Long getClien_titre();

	public String getClien_nom();

	public String getClien_prenom();

	public String getClien_denomination();

	public String getClien_sigle();

	public String getClien_adressenumero();

	public String getClien_adresserue();

	public String getClien_adresseville();

	public Date getClien_datenaissance();

	public Long getClien_categsocioprof();

	public String getClien_telephone1();

	public String getClien_telephone2();

	public String getClien_portable();

	public String getClien_email();

	public String getClien_website();

	public String getClien_ninea();

	public String getClien_registrecommerce();

	public String getClien_codeorigine();

	public String getClien_sexe();

	public Long getClien_effectif();

	public Long getClien_chiffreaffaireannuel();

	public Long getClien_chiffreaffaireprime();

	public Long getClien_chargesinistre();

	public String getClien_contactprinci();

	public Long getClien_utilisateur();

	public Date getClien_datemodification();

	public Long getClien_anciennumero();

	public String getClien_CIN();

	public Long getClien_capital_social();

	public Date getClien_date_relation();

	public Long getClien_secteur_activite();

	public String getClien_status();

	public String getClien_princdirigeant();

	public String getClien_modegouvernance();

	public String getClien_principalactionnaire();

	public String getClien_facebook();

	public String getClien_linkdin();

	public String getClien_activitecommercante();

	public String getClien_passeport();

	public String getClien_commentaire();

	public Long getClien_numeroprospect();
	
//	public Long getActive();

}
