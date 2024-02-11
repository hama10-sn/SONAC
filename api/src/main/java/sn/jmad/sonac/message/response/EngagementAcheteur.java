package sn.jmad.sonac.message.response;

import java.util.Date;

public interface EngagementAcheteur {
	Long getEngag_numeroengagement();

	Long getEngag_numpoli();

	Long getEngag_numeroavenant();

	Long getEngag_numeroacte();

	Long getEngag_kapassure();

	Date getEngag_dateengagement();

	String getEngag_status();
	
	Long getPoli_numero();

	Long getPoli_codeproduit();

	Long getPoli_branche();

	String getPoli_souscripteur();

	Long getPoli_client();
	
	Long getProd_numero();
	
	String getProd_denominationlong();
	
	Long getClien_numero();
	
	String getClien_prenom();
	
	String getClien_nom();
	
	String getClien_denomination();
	
	String getClien_adresserue();
	
	Long getBranche_numero();
	
	String getBranche_libelle_long();
}
