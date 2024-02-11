package sn.jmad.sonac.message.response;

import java.util.Date;

public interface SureteEngagement {

	Long getClien_numero();

	String getClien_prenom();

	String getClien_nom();

	String getClien_denomination();

	String getClien_sigle();

	Long getSurete_numpoli();

	Long getSurete_numeroavenant();

	Long getSurete_numeroacte();

	Long getSurete_numeroengagement();

	Long getSurete_numero();

	String getSurete_typesurete();

	String getSurete_identificationtitre();

	String getSurete_localisation();

	String getSurete_adressegeolocalisation();

	Long getSurete_retenudeposit();

	Date getSurete_datedeposit();

	String getSurete_cautionsolidaire();

	Long getSurete_depositlibere();

	Date getSurete_dateliberation();

	Date getSurete_datecomptabilisation();

	Date getSurete_datemodification();
	
	int getSurete_statutliberation();

}
