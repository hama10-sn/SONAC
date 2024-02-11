package sn.jmad.sonac.message.response;

import java.util.Date;

public interface SinistreMouvementReglement {

	Long getSini_id();

	Long getSini_num();

	Long getSini_police();

	Long getSini_risque();

	Long getSini_intermediaire();

	String getSini_codecompagnie();

	Long getSini_branche();

	Long getSini_categorie();

	Long getSini_produit();

	String getSini_typesinistre();

	Date getSini_datesurvenance();

	Date getSini_datedeclaration();

	Date getSini_datesaisie();

	Long getSini_souscripteur();

	Long getSini_beneficiaire();

	Long getSini_acheteur();

	Long getSini_donneurdordre();

	Long getSini_tiersrecours();

	String getSini_lieu();

	String getSini_description();

	Long getSini_coderesponsabilite();

	Long getSini_evaluationglobale();

	Long getSini_evaluationprincipale();

	Long getSini_evaluationfrais();

	Long getSini_evaluationhonoraires();

	Long getSini_sapglobale();

	Long getSini_sapprincipale();

	Long getSini_sapfrais();

	Long getSini_saphonoraires();

	Long getSini_reglementglobal();

	Long getSini_reglementprincipal();

	Long getSini_reglementfrais();

	Long getSini_reglementhonoraires();

	Long getSini_recoursglobal();

	Long getSini_recoursprincipal();

	Long getSini_recoursfrais();

	Long getSini_recourshonoraires();

	Long getSini_recoursglobalencaisse();

	Long getSini_recoursprincipalencaisse();

	Long getSini_recoursfraisencaisse();

	Long getSini_recourshonoraieencaisse();

	Date getSini_datederniermvt();

	Long getSini_numderniermvt();

	String getSini_utilisateur();

	Date getSini_datemodification();

	Long getSini_codeexpert();

	Date getSini_dateexpert();

	String getSini_rapport();

	Long getSini_status();

	Long getSini_motifcloture();

	Date getSini_datecloture();

	/*
	 * Les champs du mouvement sinistre
	 */
	Long getMvts_id();

	Long getMvts_num();

	Long getMvts_poli();

	Long getMvts_numsinistre();

	Date getMvts_datemvt();

	Long getMvts_typemvt();

	String getMvts_typegestionsinistre();

	Date getMvts_datesaisie();

	Long getMvts_montantmvt();

	Long getMvts_montantfinancier();

	String getMvts_status();

	Long getMvts_montantprincipal();

	Long getMvts_montantfrais();

	Long getMvts_montanthonoraire();

	Long getMvts_beneficiaire();

	Long getMvts_tiers();

	String getMvts_autrebeneficiaire();

	String getMvts_adresseautrebeneficiaire();

	Long getMvts_motifannulation();

	Date getMvts_dateannulation();

	String getMvts_codeutilisateur();

	Date getMvts_datemodification();

	Date getMvts_datecomptabilisation();
	
	String getMvts_nantissement();

	String getMvts_benefnantissement();

	Long getMvts_montantnantissement();

	/*
	 * Les champs du reglement
	 */
	Long getRegl_id();

	Long getRegl_num();

	Long getRegl_numsinistre();

	Long getRegl_nummvt();

	Long getRegl_numpoli();

	Date getRegl_datereglement();

	String getRegl_codereglement();

	Date getRegl_datevaleur();

	Long getRegl_montantprincipal();

	Long getRegl_montantfrais();

	Long getRegl_montanthonoraire();

	Long getRegl_montanttotal();

	String getRegl_codebanque();

	String getRegl_numcheque();

	Long getRegl_beneficiaire();

	String getRegl_nantissement();

	String getRegl_benefnantissement();

	Long getRegl_montantnantissement();

	Long getRegl_debiteur();

	Long getRegl_status();

	String getRegl_codeutilisateur();

	Date getRegl_datecomptabilisation();

	Date getRegl_datemodification();

}
