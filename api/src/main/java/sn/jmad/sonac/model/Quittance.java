package sn.jmad.sonac.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.Generated;
import org.hibernate.annotations.GenerationTime;

import lombok.Data;
import lombok.NoArgsConstructor;
import sn.jmad.sonac.message.response.PoliceForm;

@Entity
@Table(name = "quittance")
@NoArgsConstructor
@Data
public class Quittance {
	@Column(columnDefinition = "serial")
	@Generated(GenerationTime.INSERT)
   private Long quit_id;
	@Id
	//@GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long Quit_numero;
   private Long Quit_Facture;
   private Long Quit_numeropolice;
   private Long Quit_numavenant;
   private Long Quit_numerorisque;
   private String Quit_numerocie;
   private Long quit_numerointermedaire;
   private String quit_typequittance;
   private String quit_typeecriture;
   private Long quit_typemvt;
   private Date quit_dateemission;
   private Date quit_datecomotable;
   private Date quit_dateeffet;
   private Date quit_dateecheance;
   private Long quit_typologieannulation;
   private Date quit_dateannulation;
   private String quit_numeroaperitrice;
   private Long quit_primenette;
   private Long quit_primeext;
   private Long quit_commissionsapporteur1;
   private Long quit_commissionsapporteur2;
   private Long quit_accessoirecompagnie;
   private Long quit_accessoireapporteur;
   private Long quit_tauxte;
   private Long quit_codetaxete;
   private Long quit_tauxtva;
   private Long quit_codetva;
   private Long quit_tauxtps;
   private Long quit_codetps;
   private Long quit_mtntaxete;
   private Long quit_mtntva;
   private Long quit_mtntps;
   private Long quit_mntreductionprime;
   private Long quit_primettc;
   private Long quit_mntprimencaisse;
   private Date quit_dateencaissament;
   private Long quit_tauxreductioncommer;
   private Long quit_tauxbonus;
   private Long quit_tauxreductionautres;
   private Long quit_mtnreduction;
   private Long quit_mtnbonus;
   private Long quit_mtnreductionautres;
   private String quit_numeroattestationauto;
   private String quit_numeroressp;
   private String quit_numerocertif;
   private String quit_exoneration;
   private Date quit_dateexoneration;
   private String Quit_codeutilisateur;
   private Long quit_numeroquittanceannul;
   private Date Quit_datemiseajour;
   private Date quit_datecomptabilisation;
   private String quit_anciennumerofacture;
   private String quit_status;
   private Long active;
   
public Quittance(Quittance q) {
	super();
	Quit_Facture = q.Quit_Facture;
	Quit_numeropolice = q.Quit_numeropolice;
	Quit_numavenant = q.Quit_numavenant;
	Quit_numerorisque = q.Quit_numerorisque;
	Quit_numerocie = q.Quit_numerocie;
	this.quit_numerointermedaire = q.quit_numerointermedaire;
	this.quit_typequittance = q.quit_typequittance;
	this.quit_typeecriture = q.quit_typeecriture;
	this.quit_typemvt = q.quit_typemvt;
	this.quit_dateemission = q.quit_dateemission;
	this.quit_datecomotable = q.quit_datecomotable;
	this.quit_dateeffet = q.quit_dateeffet;
	this.quit_dateecheance = q.quit_dateecheance;
	//this.quit_typologieannulation = q.quit_typologieannulation;
	//this.quit_dateannulation = q.quit_dateannulation;
	this.quit_numeroaperitrice = q.quit_numeroaperitrice;
	this.quit_primenette = q.quit_primenette;
	this.quit_primeext = q.quit_primeext;
	this.quit_commissionsapporteur1 = q.quit_commissionsapporteur1;
	this.quit_commissionsapporteur2 = q.quit_commissionsapporteur2;
	this.quit_accessoirecompagnie = q.quit_accessoirecompagnie;
	this.quit_accessoireapporteur = q.quit_accessoireapporteur;
	this.quit_tauxte = q.quit_tauxte;
	this.quit_codetaxete = q.quit_codetaxete;
	this.quit_tauxtva = q.quit_tauxtva;
	this.quit_codetva = q.quit_codetva;
	this.quit_tauxtps = q.quit_tauxtps;
	this.quit_codetps = q.quit_codetps;
	this.quit_mtntaxete = q.quit_mtntaxete;
	this.quit_mtntva = q.quit_mtntva;
	this.quit_mtntps = q.quit_mtntps;
	this.quit_mntreductionprime = q.quit_mntreductionprime;
	this.quit_primettc = q.quit_primettc;
	this.quit_mntprimencaisse = q.quit_mntprimencaisse;
	this.quit_dateencaissament = q.quit_dateencaissament;
	this.quit_tauxreductioncommer = q.quit_tauxreductioncommer;
	this.quit_tauxbonus = q.quit_tauxbonus;
	this.quit_tauxreductionautres = q.quit_tauxreductionautres;
	this.quit_mtnreduction = q.quit_mtnreduction;
	this.quit_mtnbonus = q.quit_mtnbonus;
	this.quit_mtnreductionautres = q.quit_mtnreductionautres;
	this.quit_numeroattestationauto = q.quit_numeroattestationauto;
	this.quit_numeroressp = q.quit_numeroressp;
	this.quit_numerocertif = q.quit_numerocertif;
	this.quit_exoneration = q.quit_exoneration;
	this.quit_dateexoneration = q.quit_dateexoneration;
	this.Quit_codeutilisateur = q.Quit_codeutilisateur;
	this.quit_numeroquittanceannul = q.quit_numeroquittanceannul;
	this.Quit_datemiseajour = q.Quit_datemiseajour;
	this.quit_datecomptabilisation = q.quit_datecomptabilisation;
	//this.quit_anciennumerofacture = q.quit_anciennumerofacture;
	this.quit_status = q.quit_status;
	this.active = q.active;
}

public Quittance(Quittance_P p) {
	//super()();
	//this.Quit_numero = p.getQuit_numero();
	this.Quit_Facture = p.getQuit_Facture();
	this.Quit_numeropolice = p.getQuit_numeropolice();
	this.Quit_numavenant = p.getQuit_numavenant();
	this.Quit_numerorisque = p.getQuit_numerorisque();
	this.Quit_numerocie = p.getQuit_numerocie();
	this.quit_numerointermedaire = p.getQuit_numerointermedaire();
	this.quit_typequittance = p.getQuit_typequittance();
	this.quit_typeecriture = p.getQuit_typeecriture();
	this.quit_typemvt = p.getQuit_typemvt();
	this.quit_dateemission = p.getQuit_dateemission();
	this.quit_datecomotable = p.getQuit_datecomotable();
	this.quit_dateeffet = p.getQuit_dateeffet();
	this.quit_dateecheance = p.getQuit_dateecheance();
	this.quit_typologieannulation = p.getQuit_typologieannulation();
	this.quit_dateannulation = p.getQuit_dateannulation();
	this.quit_numeroaperitrice = p.getQuit_numeroaperitrice();
	this.quit_primenette = p.getQuit_primenette();
	this.quit_primeext = p.getQuit_primeext();
	this.quit_commissionsapporteur1 = p.getQuit_commissionsapporteur1();
	this.quit_commissionsapporteur2 = p.getQuit_commissionsapporteur2();
	this.quit_accessoirecompagnie = p.getQuit_accessoirecompagnie();
	this.quit_accessoireapporteur = p.getQuit_accessoireapporteur();
	this.quit_tauxte = p.getQuit_tauxte();
	this.quit_codetaxete = p.getQuit_codetaxete();
	this.quit_tauxtva = p.getQuit_tauxtva();
	this.quit_codetva = p.getQuit_codetva();
	this.quit_tauxtps = p.getQuit_tauxtps();
	this.quit_codetps = p.getQuit_codetps();
	this.quit_mtntaxete = p.getQuit_mtntaxete();
	this.quit_mtntva = p.getQuit_mtntva();
	this.quit_mtntps = p.getQuit_mtntps();
	this.quit_mntreductionprime = p.getQuit_mntreductionprime();
	this.quit_primettc = p.getQuit_primettc();
	this.quit_mntprimencaisse = p.getQuit_mntprimencaisse();
	this.quit_dateencaissament = p.getQuit_dateencaissament();
	this.quit_tauxreductioncommer = p.getQuit_tauxreductioncommer();
	this.quit_tauxbonus = p.getQuit_tauxbonus();
	this.quit_tauxreductionautres = p.getQuit_tauxreductionautres();
	this.quit_mtnreduction = p.getQuit_mtnreduction();
	this.quit_mtnbonus = p.getQuit_mtnbonus();
	this.quit_mtnreductionautres = p.getQuit_mtnreductionautres();
	this.quit_numeroattestationauto = p.getQuit_numeroattestationauto();
	this.quit_numeroressp = p.getQuit_numeroressp();
	this.quit_numerocertif = p.getQuit_numerocertif();
	this.quit_exoneration = p.getQuit_exoneration();
	this.quit_dateexoneration = p.getQuit_dateexoneration();
	this.Quit_codeutilisateur = p.getQuit_codeutilisateur();
	this.quit_numeroquittanceannul = p.getQuit_numeroquittanceannul();
	this.Quit_datemiseajour = p.getQuit_datemiseajour();
	this.quit_datecomptabilisation = p.getQuit_datecomptabilisation();
	this.quit_anciennumerofacture = p.getQuit_anciennumerofacture();
	this.quit_status = p.getQuit_status();
	//this.active = active();
}
   
   

}
