package sn.jmad.sonac.message.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import sn.jmad.sonac.model.Moratoire;
import sn.jmad.sonac.model.Mvtsinistre;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MoratoireFront {
	private Moratoire moratoireForm;
	private Mvtsinistre mvtsinistreForm;
}
