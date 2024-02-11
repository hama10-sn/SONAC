package sn.jmad.sonac.message.response;

import lombok.Data;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Police;

@Data
public class PoliceTarif {

	private TarificationDisplay tarif;
	private Police police;
	private Acte acte;
}
