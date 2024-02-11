package sn.jmad.sonac.message.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Penalite;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PenaliteFront {
	private Penalite penaliteForm;
	private Mvtsinistre mvtsinistreForm;
}
