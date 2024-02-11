package sn.jmad.sonac.message.response;

import java.util.Date;

public interface EncaissementFacture {
	Long getEncai_numeroencaissement();
	
	Long getEncai_numerofacture();
	
	Long getEncai_numeroquittance();
	
	Long getEncai_numerosouscripteur();
	
	Long getEncai_numeropolice();
	
	Long getEncai_typquittance();
	
	Long getEncai_mtnquittance();
	
	Long getEncai_mtnpaye();
	
	String getEncai_typencaissement();
	
	Long getEncai_codebanque();
	
	String getEncai_numerocheque();
	
	String getEncai_codetraitement();
	
	Date getEncai_datepaiement();
	
	Long getFact_numacte();
	
	Long getFact_numeroquittance();
	
	Long getFact_numerocategorie();
	
	Long getFact_numerobranche();
}
