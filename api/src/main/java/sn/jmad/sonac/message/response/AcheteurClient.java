package sn.jmad.sonac.message.response;

import java.util.Date;

public interface AcheteurClient {

	Long getAchet_numero() ;
	String getClien_nom() ;
	String getClien_denomination() ;
	String getClien_prenom() ;
	String getClien_sigle() ;
	String getClien_nature() ;
	String getAchet_numeroaffaire() ;
	Date getAchet_type() ;
	String getAchet_chiffreaffaire() ;
	String getAchet_dispersion() ;
	String getAchet_creditencours() ;
}
