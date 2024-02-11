package sn.jmad.sonac.message.response;

public interface SureteEngagement1 {
	
	Long getPoli_client();
	Long getClien_numero() ; 
	String getClien_prenom(); 
	String getClien_nom(); 
	String getClien_denomination(); 
	String getClien_sigle(); 
	Long getEngag_numpoli(); 
	Long getPoli_numero(); 
	Long getEngag_numeroengagement(); 
	String getEngag_typesurete(); 
	Long getEngag_retenudeposit(); 
	String getEngag_identificationtitre(); 
	String getEngag_cautionsolidaire();

}
