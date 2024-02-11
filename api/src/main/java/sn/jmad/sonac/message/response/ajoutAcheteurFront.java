package sn.jmad.sonac.message.response;

import java.util.List;

import lombok.Data;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Quittance;

@Data
public class ajoutAcheteurFront {
	
	private Quittance quittance;
	private List<Acheteur> acheteurs ;

}
