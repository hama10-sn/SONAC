package sn.jmad.sonac.message.response;

import java.util.Date;

public interface EncaissementClientOld {

	Long getEncai_numeroencaissement();

//	Long getEncai_numerosouscripteur() ;

	String getClien_nom();

	String getClien_denomination();

	String getClien_prenom();

	String getClien_sigle();

	Long getEncai_numeropolice();

	Long getEncai_numerofacture();

//	Long getEncai_numeroquittance();

	Date getEncai_datepaiement();

//	String getEncai_typencaissement();

	Long getEncai_mtnquittance();

	Long getEncai_mtnpaye();

	String getEncai_solde();

	Long getEncai_codebanque();

	Long getEncai_numerocheque();

	Date getEncai_datecomptabilisation();

//	Long getEncai_numerointermediaire() ;
}
