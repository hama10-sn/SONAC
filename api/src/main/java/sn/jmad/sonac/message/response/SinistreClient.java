package sn.jmad.sonac.message.response;

import java.util.Date;

public interface SinistreClient {
	Long getSini_num();
	
	Long getSini_souscripteur();
	
	Long getSini_police();
	
	Long getSini_branche();
	
	Long getSini_produit();
	
	Date getSini_datedeclaration();
	
	Date getSini_datesaisie();
	
	Date getSini_datesurvenance();
	
	String getSini_lieu();
	
	String getSini_typesinistre();
		
	String getClien_nom();

	String getClien_denomination();

	String getClien_prenom();
	
	String getBranche_libelle_long();
	
	String getProd_denominationlong();
	
	String getAchet_prenom();
	
	String getAchet_nom();
	
	Long getSini_status();
}
