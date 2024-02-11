package sn.jmad.sonac.message.response;

import lombok.Data;

@Data
public class PayCommission {
	private String typeEncaiss;
	private Long codeBanque;
	private Long numerocheque;
	private Long montant;

}
