package sn.jmad.sonac.message.response;

import java.util.Date;

public interface SinistreFacture {	
	Date getFact_datefacture();
	
	Long getPrimenet();
	
	Long getFact_numeropolice();
	
	Long getAccessoires();
	
	Long getSap();
	
	Long getReglement();
	
	Long getRecours();
	
	Long getSini_souscripteur();
	
	Long getSini_branche();
	
	String getClien_prenom();
	
	String getClien_nom();

	String getClien_denomination();
	
	String getBranche_libelle_long();
	
	Long getSinistralite();
}
