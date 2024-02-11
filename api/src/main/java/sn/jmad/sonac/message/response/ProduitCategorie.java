package sn.jmad.sonac.message.response;

import java.util.Date;

public interface ProduitCategorie {

	Long getProd_numero();

	String getBranche_libellecourt();

	String getBranche_libelle_long();

	String getCateg_libellelong();

	String getProd_denominationlong();

	String getProd_denominationcourt();

	Long getProd_codetaxe();

}