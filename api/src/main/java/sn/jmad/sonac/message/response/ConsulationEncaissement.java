package sn.jmad.sonac.message.response;

import java.util.Date;

public interface ConsulationEncaissement {
	public Long getEncai_id();
	
	public Long getEncai_numeroencaissement();
	
	public Long getEncai_numerofacture();
	
	public Long getEncai_numeroquittance();
	
	public Date getEncai_datepaiement();
	
	public Long getEncai_numerosouscripteur();
	
	public Long getEncai_numeropolice();
	
	public Long getEncai_numerointermediaire();
	
	public Long getEncai_typquittance();
	
	public Long getEncai_mtnquittance();
	
	public Long getEncai_mtnpaye();
	
	public String getEncai_solde();
	
	public String getEncai_typencaissement();
	
	public Long getEncai_codebanque();
	
	public String getEncai_numerocheque();
	
	public Date getEncai_datecomptabilisation();
	
	public String getEncai_codetraitement();
	
	public String getEncai_codeutilisateur();
	
	public Date getEncai_datemiseajour();
	
	public String getEncai_status();
	
	public Long getEncai_codeannulation();
	
	public Date getEncai_dateannulation();
	
	public Long getFact_id();
	
	public Long getFact_numacte();
	
	public Date getFact_datefacture();
	
	public Long getFact_numeropolice();
	
	public Long getFact_numeroacte();
	
	public Long getFact_numeroquittance();
	
	public String getFact_marche();
	
	public Long getFact_numerosouscripteurcontrat();
	
	public Long getFact_numeoracheteur();
	
	public Long getFact_numeroassure();
	
	public Long getFact_numerobeneficiaire();
	
	public String getFact_objetfacture();
	
	public Long getFact_montantprimenet();
		
	public Long getFact_montantaccescompagnie();
	
	public Long getFact_montantaccesapporteur();
	
	public Long getFact_montanttaxe();
	
	public Long getFact_montantarrondi();
	
	public Long getFact_commissionapporteur();
	
	public Long getFact_montantttc();
	
	public Long getFact_numerobranche();
	
	public Long getFact_numerocategorie();
	
	public Date getFact_dateeffetcontrat();
	
	public Date getFact_dateecheancecontrat();
	
	public Long getFact_capitalassure();
	
	public Long getFact_capitalsmp();
	
	public Long getFact_capitallci();
	
	public Date getFact_datecomptabilisation();
	
	public String getFact_codeutilisateur();
	
	public Date getFact_datemodification();
	
	public String getFact_etatfacture();
	
	public Long getFact_codeannulation();
	
	public Date getFact_dateannulation();
	
	public String getFact_anciennumerofacture();
	
	public Long getPoli_num();

    public Long getPoli_numero();

    public Long getPoli_codeproduit();

    public Long getPoli_intermediaire();

    public String getPoli_compagnie();

    public String getPoli_codepays();

    public String getPoli_codegroupe();

    public String getPoli_filiale();

    public Long getPoli_branche();

    public Long getPoli_categorie();

    public String getPoli_souscripteur();

    public Long getPoli_client();

    public Date getPoli_dateeffet1();

    public Date getPoli_dateanniversaire();

    public Date getPoli_dateeffetencours();

    public Date getPoli_dateecheance();

    public Long getPoli_duree();

    public Date getPoli_daterevision();

    public Long getPoli_typecontrat();

    public Long getPoli_typerevision();

    public Long getPoli_typegestion();

    public Long getPoli_codefractionnement();

    public Long getPoli_primenetreference();

    public Long getPoli_primenettotal();

    public Long getPoli_primebruttotal();

    public Long getPoli_coefbonus();

    public Long getPoli_remisecommerciale();

    public String getPoli_numeroattestation();

    public String getPoli_numerocertificat();

    public Long getPoli_policeremplacee();

    public String getPoli_typefacultive();

    public Long getPoli_numeroplancoassur();

    public Long getPoli_numeroplanreassfac();

    public Long getPoli_numerodernieravenant();

    public Date getPoli_datesuspension();

    public Date getPoli_dateremisevigueur();

    public Date getPoli_dateresiliation();

    public int getPoli_status();

    public String getPoli_indice();

    public String getPoli_typeindice();

    public Date getPoli_dateindice();

    public Long getPoli_valeurindice();

    public Long getPoli_clauseajustement();

    public Long getPoli_clauserevision();

    public String getPoli_exonerationtaxeenr();

    public Long getPoli_codetaxe();

    public String getPoli_exonerationtva();

    public Long getPoli_codetva();

    public String getPoli_exonerationtps();

    public Long getPoli_codetps();

    public Date getPoli_datexoneration();

    public Long getPoli_formulegarantie();

    public String getPoli_participationbenef();

    public Long getPoli_tauxparticipationbenef();

    public String getPoli_codecutilisateur();

    public Date getPoli_datemodification();
    
    public Long getClient_id();

	public Long getClien_numero();

	public String getClien_typeclient();

	public Long getClien_numerosolvabilite();

	public String getClien_nature();

	public Long getClien_typesociete();

	public Long getClien_coderegroupgestion();

	public Long getClien_titre();

	public String getClien_nom();

	public String getClien_prenom();

	public String getClien_denomination();

	public String getClien_sigle();

	public String getClien_adressenumero();

	public String getClien_adresserue();

	public String getClien_adresseville();

	public Date getClien_datenaissance();

	public Long getClien_categsocioprof();

	public String getClien_telephone1();

	public String getClien_telephone2();

	public String getClien_portable();

	public String getClien_email();

	public String getClien_website();

	public String getClien_ninea();

	public String getClien_registrecommerce();

	public String getClien_codeorigine();

	public String getClien_sexe();

	public Long getClien_effectif();

	public Long getClien_chiffreaffaireannuel();

	public Long getClien_chiffreaffaireprime();

	public Long getClien_chargesinistre();

	public String getClien_contactprinci();

	public Long getClien_utilisateur();

	public Date getClien_datemodification();

	public Long getClien_anciennumero();

	public String getClien_CIN();

	public Long getClien_capital_social();

	public Date getClien_date_relation();

	public Long getClien_secteur_activite();

	public String getClien_status();

	public String getClien_princdirigeant();

	public String getClien_modegouvernance();

	public String getClien_principalactionnaire();

	public String getClien_facebook();

	public String getClien_linkdin();

	public String getClien_activitecommercante();

	public String getClien_passeport();

	public String getClien_commentaire();

	public Long getClien_numeroprospect();
	
	public Long getBranche_id();

	public Long getBranche_numero();

	public String getBranche_libelleLong();

	public String getBranche_libellecourt();

	public Long getBranche_classeanalytique();

	public Long getBranche_codetaxe();

	public Long getBranche_codecommission();

	public Date getBranche_datemodification();

	public String getBranch_periodicite_compabilisation();
	
	public Long getProd_numero();
	
	public Long getProd_numerobranche();

	public String getProd_denominationlong();

	public String getProd_denominationcourt();
}
