package sn.jmad.sonac.message.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Reglement;
import sn.jmad.sonac.model.Sinistre;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ReglementFinancier {

	private Sinistre sinistreForm;

	private Mvtsinistre mvtsinistreForm;
	
	private Reglement reglementForm;
	
	private Long typeReglement;

}
