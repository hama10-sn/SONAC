package sn.jmad.sonac.message.response;

import lombok.Data;

@Data
public class TarificationDisplay {
	
	private Double tauxProduit;
	private Double primeNette;
	private Double tauxTaxe;
	private Double montantTaxe;
	private Double accessoireCompagnie;
	private Double accessoireapporteur;
	private Double tauxCommission;
	private Double montantCommission;
	private Double primeTTC;

}
