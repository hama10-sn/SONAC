package sn.jmad.sonac.message.response;

import java.util.Date;

public interface EmissionConsultation {

	public Long getQuit_numero();

	public Long getQuit_Facture();

	public Long getQuit_numeropolice();
	
	public Long getQuit_typologieannulation();
	
	public String getLibelle() ;

//	public Long getQuit_numerointermedaire();
	public String getInter_denomination();

	public String getQuit_typequittance();

	public String getQuit_typeecriture();

	public Date getQuit_dateemission();

	public Date getQuit_datecomotable();

	public Date getQuit_dateeffet();

	public Date getQuit_dateecheance();

	public Long getQuit_primenette();

	public Long getQuit_commissionsapporteur1();

	public Long getQuit_accessoirecompagnie();

	public Long getQuit_accessoireapporteur();

	public Long getQuit_tauxte();

	public Long getQuit_mtntaxete();

	public Long getQuit_primettc();

	public Long getQuit_mntprimencaisse();

//	public Date getQuit_dateencaissament() ;

}
