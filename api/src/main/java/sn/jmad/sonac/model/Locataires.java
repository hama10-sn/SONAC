package sn.jmad.sonac.model;

public class Locataires {
 String nom;
 String prenom;
public String getNom() {
	return nom;
}
public void setNom(String nom) {
	this.nom = nom;
}
public String getPrenom() {
	return prenom;
}
public void setPrenom(String prenom) {
	this.prenom = prenom;
}
@Override
public String toString() {
	return "Locataires [nom=" + nom + ", prenom=" + prenom + "]";
}
public Locataires(String nom, String prenom) {
	super();
	this.nom = nom;
	this.prenom = prenom;
}
 
}
