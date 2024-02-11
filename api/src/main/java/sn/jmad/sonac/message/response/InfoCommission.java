package sn.jmad.sonac.message.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor @NoArgsConstructor @Data
public class InfoCommission {
	private Date date_debut;
	private Date date_fin;
	private Long mode_paiement;
	private Long intermediaire;

}
