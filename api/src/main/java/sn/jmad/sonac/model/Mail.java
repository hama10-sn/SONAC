package sn.jmad.sonac.model;





public class Mail {
	String address_email;
	String objet;
	String body;
	String infos_user;
	
	public String getAddress_email() {
		return address_email;
	}
	public void setAddress_email(String address_email) {
		this.address_email = address_email;
	}
	public String getObjet() {
		return objet;
	}
	public void setObjet(String objet) {
		this.objet = objet;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	
	
	public String getInfos_user() {
		return infos_user;
	}
	public void setInfos_user(String infos_user) {
		this.infos_user = infos_user;
	}
	@Override
	public String toString() {
		return "Mail [address_email=" + address_email + ", objet=" + objet + ", body=" + body + ", infos_user="
				+ infos_user + "]";
	}
	public Mail() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Mail(String address_email, String objet, String body, String infos_user) {
		super();
		this.address_email = address_email;
		this.objet = objet;
		this.body = body;
		this.infos_user = infos_user;
	}
	
}
