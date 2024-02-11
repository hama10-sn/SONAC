package sn.jmad.sonac.message.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import sn.jmad.sonac.model.Mvtsinistre;
import sn.jmad.sonac.model.Sinistre;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class RecoursFront {
	private Mvtsinistre mvtsinistreForm;
}
