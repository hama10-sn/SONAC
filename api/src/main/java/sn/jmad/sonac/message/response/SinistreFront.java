package sn.jmad.sonac.message.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import sn.jmad.sonac.model.Credit;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Risque_locatif;
import sn.jmad.sonac.model.Sinistre;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SinistreFront {

	private Sinistre sinistreForm;

	private Mvtsinistre mvtsinistreForm;

	private Credit creditForm;

	private Risque_locatif risque_locatifForm;

}
