package sn.jmad.sonac.message.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Credit;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.model.Lot;
import sn.jmad.sonac.model.Marche;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.model.Risque;
import sn.jmad.sonac.model.Risque_locatif;
import sn.jmad.sonac.model.Risque_reglementes;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class PoliceFront {
	private Police policeForm;
	private Risque risque;
	private Acte acte;
	private Beneficiaire beneficiaire;
	private Marche marche;
	private List<Lot> lots;
	private Quittance quittance;
	private Risque_reglementes risqueR;
	private Credit credit;
	private List<Acheteur> acheteurs;
	private Risque_locatif risqueLocatif;
	private Engagement engagement;

}
