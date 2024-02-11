package sn.jmad.sonac.model;

public class ReferenceTech {
	String identification;
	String beneficiaires;
	String montant_marche;
	String observation;
	public String getIdentification() {
		return identification;
	}
	public void setIdentification(String identification) {
		this.identification = identification;
	}
	public String getBeneficiaires() {
		return beneficiaires;
	}
	public void setBeneficiaires(String beneficiaires) {
		this.beneficiaires = beneficiaires;
	}
	public String getMontant_marche() {
		return montant_marche;
	}
	public void setMontant_marche(String montant_marche) {
		this.montant_marche = montant_marche;
	}
	public String getObservation() {
		return observation;
	}
	public void setObservation(String observation) {
		this.observation = observation;
	}
	public ReferenceTech(String identification, String beneficiaires, String montant_marche, String observation) {
		super();
		this.identification = identification;
		this.beneficiaires = beneficiaires;
		this.montant_marche = montant_marche;
		this.observation = observation;
	}
	@Override
	public String toString() {
		return "ReferenceTech [identification=" + identification + ", beneficiaires=" + beneficiaires
				+ ", montant_marche=" + montant_marche + ", observation=" + observation + "]";
	}
	
	
	
	
}
