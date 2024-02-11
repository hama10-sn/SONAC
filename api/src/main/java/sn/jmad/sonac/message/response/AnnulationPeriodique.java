package sn.jmad.sonac.message.response;

import java.util.Date;

public interface AnnulationPeriodique {
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
	
	Long getMvts_num();
	
	Long getMvts_poli();
	
	Long getMvts_numsinistre();
	
	Date getMvts_datemvt();
	
	Long getMvts_typemvt();
	
	String getMvts_typegestionsinistre();
	
	Date getMvts_datesaisie();
	
	Long getMvts_montantfinancier();
	
	String getMvts_status();
	
	Long getMvts_montantprincipal();
	
	Long getMvts_montantfrais();
	
	Long getMvts_montanthonoraire();
	
	Long getMvts_montantmvt();
	
	Long getMvts_beneficiaire();
	
	Long getMvts_tiers();
	
	Long getMvts_motifannulation();
	
	Date getMvts_dateannulation();
	
	String getMvts_codeutilisateur();
	
	Date mvts_datemodification();
	
	Date getMvts_datecomptabilisation();	
		
	String getClien_nom();

	String getClien_denomination();

	String getClien_prenom();
	
	String getBranche_libelle_long();
	
	String getProd_denominationlong();
	
	String getAchet_prenom();
	
	String getAchet_nom();
	
	Long getSini_status();
}
