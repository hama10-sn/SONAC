package sn.jmad.sonac.message.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Acte_P;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Beneficiaire_P;
import sn.jmad.sonac.model.Credit;
import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.model.Engagement_P;
import sn.jmad.sonac.model.Lot;
import sn.jmad.sonac.model.Lot_P;
import sn.jmad.sonac.model.Marche;
import sn.jmad.sonac.model.Marche_P;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Police_P;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.model.Quittance_P;
import sn.jmad.sonac.model.Risque;
import sn.jmad.sonac.model.Risque_P;
import sn.jmad.sonac.model.Risque_locatif;
import sn.jmad.sonac.model.Risque_reglementes;

@Data @NoArgsConstructor @AllArgsConstructor @ToString
public class PoliceFront_P {
	private Police_P policeForm;
	private Risque_P risque;
	private Acte_P acte;
	private Beneficiaire_P beneficiaire;
	private Marche_P marche;
	private List<Lot_P> lots;
	private Quittance_P quittance;
	private Risque_reglementes risqueR;
	private Credit credit;
	private List<Acheteur> acheteurs;
	private Risque_locatif risqueLocatif;
	private Engagement_P engagement;

}
