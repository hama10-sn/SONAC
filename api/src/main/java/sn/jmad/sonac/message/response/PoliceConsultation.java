package sn.jmad.sonac.message.response;

import java.util.Date;

public interface PoliceConsultation {

	Long getPoli_numero();

	Long getProd_numero();

	String getProd_denominationlong();

	Long getInter_numero();

	String getInter_denomination();

	Long getClien_numero();

	String getClien_nom();

	String getClien_prenom();

	String getClien_denomination();

	String getClien_sigle();

	Long getPoli_primenetreference();

	Long getPoli_primebruttotal();

	Date getPoli_dateeffetencours();

	Date getPoli_dateecheance();

	Date getPoli_datemodification();

}
