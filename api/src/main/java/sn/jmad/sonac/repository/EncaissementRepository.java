package sn.jmad.sonac.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.message.response.ClientContact;
import sn.jmad.sonac.message.response.ConsulationEncaissement;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.EncaissementFacture;
import sn.jmad.sonac.model.Encaissement;



public interface EncaissementRepository  extends JpaRepository<Encaissement, Long>{

	@Query("from Encaissement en where en.active = 1 and en.encai_codeannulation IS NULL order by en.encai_id DESC")
	List<Encaissement> allEncaissements();
	
	@Query("from Encaissement en where en.active = 1 and en.encai_numerofacture = :numfact and en.encai_codeannulation IS NULL order by en.encai_id DESC")
	List<Encaissement> getEncaissements(@Param("numfact") Long numfact);
	
	@Query("select en from Encaissement en where en.active = 1 and en.encai_numeroencaissement = :id")
	Encaissement findbyIdd(@Param("id") Long id);
	
	@Query("select en from Encaissement en where en.active = 1 and en.encai_numeroencaissement = :id")
	Optional<Encaissement> findbyNum(@Param("id") Long id);
	
//	@Query("select e from Encaissement e where e.encai_numerocheque =:encai_numerocheque")
//	Encaissement existingChequeNumber(@Param("encai_numerocheque") String encai_numerocheque);
	
	@Query("select e from Encaissement e where e.encai_numerocheque =:encai_numerocheque")
	List<Encaissement> existingChequeNumber(@Param("encai_numerocheque") String encai_numerocheque);
	
	/*
	 * Les méthodes suivantes servent éssenetiellement à faire la consultation des encaissements
	 */
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc left join Client cl on enc.encai_numerosouscripteur=cl.clien_numero "
					+ "where enc.active = 1 and enc.encai_codeannulation IS NULL Order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementAndClient();
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc left join Client cl on enc.encai_numerosouscripteur=cl.clien_numero "
					+ "where enc.active = 1 and cl.clien_numero = :numclient order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementByClient(@Param("numclient") Long numclient);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.active = 1 and enc.encai_codeannulation IS NULL "
					+ "and CAST(enc.encai_datepaiement AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementByPeriode(@Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl, Police poli "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.encai_numeropolice=poli.poli_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NULL and poli.poli_codeproduit =:numProd "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementByProduit(@Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc left join Client cl on enc.encai_numerosouscripteur=cl.clien_numero "
					+ "where enc.active = 1 and enc.encai_codeannulation IS NULL "
					+ "and enc.encai_numerointermediaire = :numInterm "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementByIntermediaire(@Param("numInterm") Long numInterm);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl, Police poli "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.encai_numeropolice=poli.poli_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NULL "
					+ "and poli.poli_codeproduit =:numProd and CAST(enc.encai_datepaiement AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementByPeriodeAndProduit(@Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NULL "
					+ "and enc.encai_numerointermediaire = :numInterm and CAST(enc.encai_datepaiement AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementByPeriodeAndIntermediaire(@Param("numInterm") Long numInterm, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl, Police poli "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.encai_numeropolice=poli.poli_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NULL and enc.encai_numerointermediaire =:numInterm "
					+ "and poli.poli_codeproduit =:numProd "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementByProduitAndIntermediaire(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl, Police poli "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.encai_numeropolice=poli.poli_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NULL and enc.encai_numerointermediaire =:numInterm "
					+ "and poli.poli_codeproduit =:numProd and CAST(enc.encai_datepaiement AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementByCriteres(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	
	@Query(nativeQuery = true, value="select encai_numeroencaissement, encai_numerofacture, encai_numeroquittance, "
			+ "encai_numerosouscripteur, encai_numeropolice, encai_typquittance, encai_mtnquittance, "
			+ "encai_mtnpaye, encai_typencaissement, encai_codebanque, encai_numerocheque, "
			+ "encai_codetraitement, encai_datecomptabilisation, fact_numacte, fact_numeroquittance, fact_numerocategorie, "
			+ "fact_numerobranche from encaissement, facture "
			+ "where encai_numeroquittance =  fact_numeroquittance and encai_numeroencaissement =:encai_numeroencaissement")
	EncaissementFacture getEncaissementFactureById(@Param("encai_numeroencaissement") Long encai_numeroencaissement);
	
	/*
	 * Les méthodes suivantes servent éssenetiellement à faire la consultation 
	 * des encaissements annulées (productions annulées)
	 */
	@Query(nativeQuery = true,
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation, clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "from Encaissement enc left join Client cl on enc.encai_numerosouscripteur=cl.clien_numero "
					+ "where enc.active = 1 and enc.encai_codeannulation IS NOT NULL "
					+ "Order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementsAnnulees();
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.active = 1 "
					+ "and enc.encai_codeannulation IS NOT NULL "
					+ "and CAST(enc.encai_datepaiement AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementsAnnuleesByPeriode(@Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl, Police poli "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.encai_numeropolice=poli.poli_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NOT NULL and poli.poli_codeproduit =:numProd "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementsAnnuleesByProduit(@Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc left join Client cl on enc.encai_numerosouscripteur=cl.clien_numero "
					+ "where enc.active = 1 and enc.encai_codeannulation IS NOT NULL "
					+ "and enc.encai_numerointermediaire = :numInterm "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementsAnnuleesByIntermediaire(@Param("numInterm") Long numInterm);

	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl, Police poli "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.encai_numeropolice=poli.poli_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NOT NULL "
					+ "and poli.poli_codeproduit =:numProd and CAST(enc.encai_datepaiement AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementsAnnuleesByPeriodeAndProduit(@Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NOT NULL "
					+ "and enc.encai_numerointermediaire =:numInterm and CAST(enc.encai_datepaiement AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementsAnnuleesByPeriodeAndIntermediaire(@Param("numInterm") Long numInterm, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl, Police poli "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.encai_numeropolice=poli.poli_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NOT NULL "
					+ "and enc.encai_numerointermediaire =:numInterm and poli.poli_codeproduit =:numProd "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementsAnnuleesByProduitAndIntermediaire(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc, Client cl, Police poli "
					+ "where enc.encai_numerosouscripteur=cl.clien_numero and enc.encai_numeropolice=poli.poli_numero "
					+ "and enc.active = 1 and enc.encai_codeannulation IS NOT NULL and enc.encai_numerointermediaire =:numInterm "
					+ "and poli.poli_codeproduit =:numProd and CAST(enc.encai_datepaiement AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementsAnnuleesByCriteres(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
					+ "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b, produit as prod where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement AS DATE) AS VARCHAR) = CAST(DATE(NOW()) AS VARCHAR)")
	List<ConsulationEncaissement> listeEncaissementJournalier();
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
					+ "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement AS DATE) AS VARCHAR) =:jour")
	List<ConsulationEncaissement> listeEncaissementParJour(@Param("jour") String jour);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numeropolice =:encai_numeropolice")
	List<ConsulationEncaissement> listeEncaissementJournalierByPolice(@Param("jour") String jour, @Param("encai_numeropolice") Long encai_numeropolice);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numerosouscripteur =:encai_numerosouscripteur")
	List<ConsulationEncaissement> listeEncaissementJournalierByClient(@Param("jour") String jour, @Param("encai_numerosouscripteur") Long encai_numerosouscripteur);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and b.branche_numero =:branche_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByBranche(@Param("jour") String jour, @Param("branche_numero") Long branche_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and prod.prod_numero =:prod_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByProduit(@Param("jour") String jour, @Param("prod_numero") Long prod_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numerointermediaire =:encai_numerointermediaire")
	List<ConsulationEncaissement> listeEncaissementJournalierByIntermediaire(@Param("jour") String jour, @Param("encai_numerointermediaire") Long encai_numerointermediaire);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numeropolice =:encai_numeropolice "
					+ "and e.encai_numerosouscripteur =:encai_numerosouscripteur")
	List<ConsulationEncaissement> listeEncaissementJournalierByPoliceAndClient(@Param("jour") String jour, @Param("encai_numeropolice") Long encai_numeropolice, @Param("encai_numerosouscripteur") Long encai_numerosouscripteur);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numeropolice =:encai_numeropolice "
					+ "and b.branche_numero =:branche_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByPoliceAndBranche(@Param("jour") String jour, @Param("encai_numeropolice") Long encai_numeropolice, @Param("branche_numero") Long branche_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numeropolice =:encai_numeropolice "
					+ "and prod.prod_numero =:prod_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByPoliceAndProduit(@Param("jour") String jour, @Param("encai_numeropolice") Long encai_numeropolice, @Param("prod_numero") Long prod_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numeropolice =:encai_numeropolice "
					+ "and e.encai_numerointermediaire =:encai_numerointermediaire")
	List<ConsulationEncaissement> listeEncaissementJournalierByPoliceAndIntermediaire(@Param("jour") String jour, @Param("encai_numeropolice") Long encai_numeropolice, @Param("encai_numerointermediaire") Long encai_numerointermediaire);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numerosouscripteur =:encai_numerosouscripteur "
					+ "and b.branche_numero =:branche_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByClientAndBranche(@Param("jour") String jour, @Param("encai_numerosouscripteur") Long encai_numerosouscripteur, @Param("branche_numero") Long branche_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numerosouscripteur =:encai_numerosouscripteur "
					+ "and prod.prod_numero =:prod_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByClientAndProduit(@Param("jour") String jour, @Param("encai_numerosouscripteur") Long encai_numerosouscripteur, @Param("prod_numero") Long prod_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numerosouscripteur =:encai_numerosouscripteur "
					+ "and e.encai_numerointermediaire =:encai_numerointermediaire")
	List<ConsulationEncaissement> listeEncaissementJournalierByClientAndIntermediaire(@Param("jour") String jour, @Param("encai_numerosouscripteur") Long encai_numerosouscripteur, @Param("encai_numerointermediaire") Long encai_numerointermediaire);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and b.branche_numero =:branche_numero "
					+ "and prod.prod_numero =:prod_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByBrancheAndProduit(@Param("jour") String jour, @Param("branche_numero") Long branche_numero, @Param("prod_numero") Long prod_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and b.branche_numero =:branche_numero "
					+ "and e.encai_numerointermediaire =:encai_numerointermediaire")
	List<ConsulationEncaissement> listeEncaissementJournalierByBrancheAndIntermediaire(@Param("jour") String jour, @Param("branche_numero") Long branche_numero, @Param("encai_numerointermediaire") Long encai_numerointermediaire);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and prod.prod_numero =:prod_numero "
					+ "and e.encai_numerointermediaire =:encai_numerointermediaire")
	List<ConsulationEncaissement> listeEncaissementJournalierByProduitAndIntermediaire(@Param("jour") String jour, @Param("prod_numero") Long prod_numero, @Param("encai_numerointermediaire") Long encai_numerointermediaire);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "					
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numeropolice =:encai_numeropolice "
					+ "and e.encai_numerosouscripteur =:encai_numerosouscripteur "
					+ "and b.branche_numero =:branche_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByPoliceAndClientAndBranche(@Param("jour") String jour, @Param("encai_numeropolice") Long encai_numeropolice, @Param("encai_numerosouscripteur") Long encai_numerosouscripteur, @Param("branche_numero") Long branche_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "					
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numeropolice =:encai_numeropolice "
					+ "and e.encai_numerosouscripteur =:encai_numerosouscripteur "
					+ "and b.branche_numero =:branche_numero"
					+ "and prod.prod_numero =:prod_numero")
	List<ConsulationEncaissement> listeEncaissementJournalierByPoliceAndClientAndBrancheAndProduit(@Param("jour") String jour, @Param("encai_numeropolice") Long encai_numeropolice, @Param("encai_numerosouscripteur") Long encai_numerosouscripteur, @Param("branche_numero") Long branche_numero, @Param("prod_numero") Long prod_numero);
	
	@Query(nativeQuery = true, 
			value="select encai_numeroencaissement, encai_codebanque, encai_codetraitement, encai_codeutilisateur, encai_datecomptabilisation, encai_datemiseajour, encai_datepaiement, encai_id, encai_mtnpaye, encai_mtnquittance, encai_numerocheque, encai_numerofacture, encai_numerointermediaire, encai_numeropolice, encai_numeroquittance, encai_numerosouscripteur, encai_solde, encai_status, encai_typencaissement, encai_typquittance, encai_codeannulation, encai_dateannulation "
				    + "fact_numacte, fact_anciennumerofacture, fact_capitalassure, fact_capitallci, fact_capitalsmp, fact_codeannulation, fact_codeutilisateur, fact_commissionapporteur, fact_dateannulation, fact_datecomptabilisation, fact_dateecheancecontrat, fact_dateeffetcontrat, fact_datefacture, fact_datemodification, fact_etatfacture, fact_id, fact_marche, fact_montantaccesapporteur, fact_montantaccescompagnie, fact_montantarrondi, fact_montantprimenet, fact_montanttaxe, fact_montantttc, fact_numeoracheteur, fact_numeroacte, fact_numeroassure, fact_numerobeneficiaire, fact_numerobranche, fact_numerocategorie, fact_numeropolice, fact_numeroquittance, fact_numerosouscripteurcontrat, fact_objetfacture "
					+ "poli_numero, poli_branche, poli_categorie, poli_clauseajustement, poli_clauserevision, poli_client, poli_codecutilisateur, poli_codefractionnement, poli_codegroupe, poli_codepays, poli_codeproduit, poli_codetaxe, poli_codetps, poli_codetva, poli_coefbonus, poli_compagnie, poli_dateanniversaire, poli_dateecheance, poli_dateeffet1, poli_dateeffetencours, poli_dateindice, poli_datemodification, poli_dateremisevigueur, poli_dateresiliation, poli_daterevision, poli_datesuspension, poli_datexoneration, poli_duree, poli_exonerationtaxeenr, poli_exonerationtps, poli_exonerationtva, poli_filiale, poli_formulegarantie, poli_indice, poli_intermediaire, poli_num, poli_numeroattestation, poli_numerocertificat, poli_numerodernieravenant, poli_numeroplancoassur, poli_numeroplanreassfac, poli_participationbenef, poli_policeremplacee, poli_primebruttotal, poli_primenetreference, poli_primenettotal, poli_remisecommerciale, poli_souscripteur, poli_status, poli_tauxparticipationbenef, poli_typecontrat, poli_typefacultive, poli_typegestion, poli_typeindice, poli_typerevision, poli_valeurindice "
					+ "clien_numero, clien_cin, clien_activitecommercante, clien_adressenumero, clien_adresserue, clien_adresseville, clien_anciennumero, clien_capital_social, clien_categsocioprof, clien_chargesinistre, clien_chiffreaffaireannuel, clien_chiffreaffaireprime, clien_codeorigine, clien_coderegroupgestion, clien_commentaire, clien_contactprinci, clien_date_relation, clien_datemodification, clien_datenaissance, clien_denomination, clien_effectif, clien_email, clien_facebook, clien_linkdin, clien_modegouvernance, clien_nature, clien_ninea, clien_nom, clien_numerosolvabilite, clien_passeport, clien_portable, clien_prenom, clien_princdirigeant, clien_principalactionnaire, clien_registrecommerce, clien_secteur_activite, clien_sexe, clien_sigle, clien_status, clien_telephone1, clien_telephone2, clien_titre, clien_typeclient, clien_typesociete, clien_utilisateur, clien_website, client_id, clien_numeroprospect "
					+ "branche_numero, branch_periodicite_compabilisation, branche_classeanalytique, branche_codecommission, branche_codetaxe, branche_datemodification, branche_id, branche_libelle_long, branche_libellecourt "
					+ "prod_numero, prod_numerobranche, prod_denominationlong, prod_denominationcourt "
					+ "from encaissement as e, facture as f, police as pol, "
					+ "client as cl, branche as b where e.encai_numerofacture = f.fact_numacte "
					+ "and e.encai_numeropolice = pol.poli_numero "
					+ "and e.encai_numerosouscripteur = cl.clien_numero "
					+ "and b.branche_numero = prod.prod_numerobranche "					
					+ "and pol.poli_branche = b.branche_numero and CAST(CAST(e.encai_datepaiement as DATE) AS VARCHAR) =:jour "
					+ "and e.encai_numeropolice =:encai_numeropolice "
					+ "and e.encai_numerosouscripteur =:encai_numerosouscripteur "
					+ "and b.branche_numero =:branche_numero"
					+ "and prod.prod_numero =:prod_numero"
					+ "and e.encai_numerointermediaire =:encai_numerointermediaire")
	List<ConsulationEncaissement> listeEncaissementJournalierByPoliceAndClientAndBrancheAndProduitAndIntermediaire(@Param("jour") String jour, @Param("encai_numeropolice") Long encai_numeropolice, @Param("encai_numerosouscripteur") Long encai_numerosouscripteur, @Param("branche_numero") Long branche_numero, @Param("prod_numero") Long prod_numero, @Param("encai_numerointermediaire") Long encai_numerointermediaire);
}
