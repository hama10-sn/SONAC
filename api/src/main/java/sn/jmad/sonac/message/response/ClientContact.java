package sn.jmad.sonac.message.response;

import java.util.Date;

public interface ClientContact {
	
	Long getClien_numero() ;
	String getClien_nom() ;
	String getClien_denomination() ;
	String getClien_prenom() ;
	String getClien_sigle() ;
	String getClien_nature() ;
	String getClien_telephone1() ;
	Date getClien_date_relation() ;
	String getCont_nom() ;
	String getCont_prenom() ;
	String getCont_mobile() ;
}