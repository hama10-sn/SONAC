package sn.jmad.sonac.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.message.response.AnnulationPeriodique;
import sn.jmad.sonac.message.response.SinistreClient;
import sn.jmad.sonac.message.response.SinistreFacture;
import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.model.Sinistre;

@Repository
public interface SinistreRepository extends JpaRepository<Sinistre, Long> {	
	@Query("select Sinistre from Sinistre Sinistre where Sinistre.sini_num =:num")
	Sinistre findSinistreByNumero(@Param("num") Long num);
	
//	@Query(nativeQuery = true,
//			value="SELECT sini_num, sini_acheteur, sini_beneficiaire, sini_branche, sini_categorie, sini_codecompagnie, sini_codeexpert, sini_coderesponsabilite, sini_datecloture, sini_datedeclaration, sini_datederniermvt, sini_dateexpert, sini_datemodification, sini_datesaisie, sini_datesurvenance, sini_description, sini_donneurdordre, sini_evaluationfrais, sini_evaluationglobale, sini_evaluationhonoraires, sini_evaluationprincipale, sini_id, sini_intermediaire, sini_lieu, sini_motifcloture, sini_numderniermvt, sini_police, sini_produit, sini_rapport, sini_recoursfrais, sini_recoursfraisencaisse, sini_recoursglobal, sini_recoursglobalencaisse, sini_recourshonoraieencaisse, sini_recourshonoraires, sini_recoursprincipal, sini_recoursprincipalencaisse, sini_reglementfrais, sini_reglementglobal, sini_reglementhonoraires, sini_reglementprincipal, sini_risque, sini_sapfrais, sini_sapglobale, sini_saphonoraires, sini_sapprincipale, sini_souscripteur, sini_status, sini_tiersrecours, sini_typesinistre, sini_utilisateur, mvts_num, mvts_beneficiaire, mvts_codeutilisateur, mvts_dateannulation, mvts_datecomptabilisation, mvts_datemodification, mvts_datemvt, mvts_datesaisie, mvts_id, mvts_montantfinancier, mvts_montantfrais, mvts_montanthonoraire, mvts_montantmvt, mvts_montantprincipal, mvts_motifannulation, mvts_numsinistre, mvts_poli, mvts_status, mvts_tiers, mvts_typegestionsinistre, mvts_typemvt "
//					+ "FROM sinistre sini, mvtsinistre mvt "
//					+ "WHERE sini.sini_num = mvt.mvts_numsinistre "
//					+ "AND sini.sini_status >= 2 AND sini.sini_status = mvt.mvts_typemvt "
//					+ "ORDER BY sini.sini_souscripteur, sini.sini_police, sini.sini_acheteur, sini.sini_num")
//	List<SinistreMouvement> getAllSinistresMouvement();
	
	@Query(nativeQuery = true,
			value="SELECT * "
					+ "FROM sinistre sini, mvtsinistre mvt "
					+ "WHERE sini.sini_num = mvt.mvts_numsinistre "
					+ "AND sini.sini_status >= 2 AND sini.sini_status = mvt.mvts_typemvt "
					+ "AND mvt.mvts_num IN (SELECT MAX(mvts_num) FROM mvtsinistre GROUP BY mvts_numsinistre ) "
					+ "ORDER BY sini.sini_souscripteur, sini.sini_police, sini.sini_acheteur, sini.sini_num")
	List<SinistreMouvement> getAllSinistresMouvement();
	
//	@Query(nativeQuery = true,
//			value="SELECT sini_num, sini_acheteur, sini_beneficiaire, sini_branche, sini_categorie, sini_codecompagnie, sini_codeexpert, sini_coderesponsabilite, sini_datecloture, sini_datedeclaration, sini_datederniermvt, sini_dateexpert, sini_datemodification, sini_datesaisie, sini_datesurvenance, sini_description, sini_donneurdordre, sini_evaluationfrais, sini_evaluationglobale, sini_evaluationhonoraires, sini_evaluationprincipale, sini_id, sini_intermediaire, sini_lieu, sini_motifcloture, sini_numderniermvt, sini_police, sini_produit, sini_rapport, sini_recoursfrais, sini_recoursfraisencaisse, sini_recoursglobal, sini_recoursglobalencaisse, sini_recourshonoraieencaisse, sini_recourshonoraires, sini_recoursprincipal, sini_recoursprincipalencaisse, sini_reglementfrais, sini_reglementglobal, sini_reglementhonoraires, sini_reglementprincipal, sini_risque, sini_sapfrais, sini_sapglobale, sini_saphonoraires, sini_sapprincipale, sini_souscripteur, sini_status, sini_tiersrecours, sini_typesinistre, sini_utilisateur, mvts_num, mvts_beneficiaire, mvts_codeutilisateur, mvts_dateannulation, mvts_datecomptabilisation, mvts_datemodification, mvts_datemvt, mvts_datesaisie, mvts_id, mvts_montantfinancier, mvts_montantfrais, mvts_montanthonoraire, mvts_montantmvt, mvts_montantprincipal, mvts_motifannulation, mvts_numsinistre, mvts_poli, mvts_status, mvts_tiers, mvts_typegestionsinistre, mvts_typemvt "
//					+ "FROM sinistre sini, mvtsinistre mvt "
//					+ "WHERE sini.sini_num = mvt.mvts_numsinistre "
//					+ "AND sini.sini_status >= 2 AND sini.sini_status != 15 AND sini.sini_status = mvt.mvts_typemvt "
//					+ "AND mvt.mvts_num IN (SELECT MAX(mvts_num) FROM mvtsinistre GROUP BY mvts_numsinistre ) "
//					+ "ORDER BY sini.sini_souscripteur, sini.sini_police, sini.sini_acheteur, sini.sini_num")
//	List<SinistreMouvement> getAllSinistresMouvement();
		
	@Query(nativeQuery = true,
			value="SELECT * "
					+ "FROM sinistre sini, mvtsinistre mvt "
					+ "WHERE sini.sini_num = mvt.mvts_numsinistre  "
					+ "AND sini.sini_status = 1 and mvt.mvts_status = 1 "
					+ "ORDER BY sini.sini_souscripteur, sini.sini_police, sini.sini_acheteur, sini.sini_num")
	List<SinistreMouvement> getAllMenaceSinistresMouvement();
	
	@Query(nativeQuery = true,
			value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, s.sini_status, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom from sinistre as s "
					+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
					+ "inner join branche as b on s.sini_branche = b.branche_id "
					+ "inner join produit as p on s.sini_produit = p.prod_numero "
					+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
					+ "order by s.sini_num")
	List<SinistreClient> getAllSinistre();
	
	@Query(nativeQuery = true,
			value="SELECT sini_num, sini_acheteur, sini_beneficiaire, sini_branche, sini_categorie, sini_codecompagnie, sini_codeexpert, sini_coderesponsabilite, sini_datecloture, sini_datedeclaration, sini_datederniermvt, sini_dateexpert, sini_datemodification, sini_datesaisie, sini_datesurvenance, sini_description, sini_donneurdordre, sini_evaluationfrais, sini_evaluationglobale, sini_evaluationhonoraires, sini_evaluationprincipale, sini_id, sini_intermediaire, sini_lieu, sini_motifcloture, sini_numderniermvt, sini_police, sini_produit, sini_rapport, sini_recoursfrais, sini_recoursfraisencaisse, sini_recoursglobal, sini_recoursglobalencaisse, sini_recourshonoraieencaisse, sini_recourshonoraires, sini_recoursprincipal, sini_recoursprincipalencaisse, sini_reglementfrais, sini_reglementglobal, sini_reglementhonoraires, sini_reglementprincipal, sini_risque, sini_sapfrais, sini_sapglobale, sini_saphonoraires, sini_sapprincipale, sini_souscripteur, sini_status, sini_tiersrecours, sini_typesinistre, sini_utilisateur, mvts_num, mvts_beneficiaire, mvts_codeutilisateur, mvts_dateannulation, mvts_datecomptabilisation, mvts_datemodification, mvts_datemvt, mvts_datesaisie, mvts_id, mvts_montantfinancier, mvts_montantfrais, mvts_montanthonoraire, mvts_montantmvt, mvts_montantprincipal, mvts_motifannulation, mvts_numsinistre, mvts_poli, mvts_status, mvts_tiers, mvts_typegestionsinistre, mvts_typemvt "
					+ "FROM sinistre sini, mvtsinistre mvt "
					+ "WHERE sini.sini_num = mvt.mvts_numsinistre "
					+ "AND (sini.sini_status = 10 OR sini.sini_status > 16) AND sini.sini_status = mvt.mvts_typemvt "
					+ "AND mvt.mvts_num IN (SELECT MAX(mvts_num) FROM mvtsinistre GROUP BY mvts_numsinistre ) "
					+ "ORDER BY sini.sini_souscripteur, sini.sini_police, sini.sini_acheteur, sini.sini_num")
	List<SinistreMouvement> getAllSinistresRecours();
	
	@Query(nativeQuery = true,
			value="SELECT * "
					+ "FROM sinistre, mvtsinistre "
					+ "WHERE sini_num = mvts_numsinistre AND sini_status = 1 AND mvts_typemvt = 1 AND sini_acheteur = :acheteur")
	List<Sinistre> findAllMenaceSinistreByAcheteur(@Param("acheteur") Long acheteur);
	
	@Query(nativeQuery = true,
			value="SELECT * "
					+ "FROM sinistre, mvtsinistre "
					+ "WHERE sini_num = mvts_numsinistre AND sini_status >= 2 AND sini_acheteur = :acheteur")
	List<Sinistre> findAllSinistreByAcheteur(@Param("acheteur") Long acheteur);
	
	@Query(nativeQuery = true,
			value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
					+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
					+ "inner join branche as b on s.sini_branche = b.branche_id "
					+ "inner join produit as p on s.sini_produit = p.prod_numero "
					+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
					+ "where s.sini_branche =:sini_branche "
					+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParBranche(@Param("sini_branche") Long sini_branche);
	
	@Query(nativeQuery = true,
	value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "where s.sini_produit =:sini_produit "
			+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParProduit(@Param("sini_produit") Long sini_produit);
		
	@Query(nativeQuery = true,
	value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "where CAST(s.sini_datedeclaration AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin"
			+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParPeriode(@Param("debut") String debut, @Param("fin") String fin);
	
	@Query(nativeQuery = true,
	value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "where s.sini_souscripteur =:sini_souscripteur "
			+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParClient(@Param("sini_souscripteur") Long sini_souscripteur);
	
	@Query(nativeQuery = true,
	value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "where s.sini_police =:sini_police "
			+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParPolice(@Param("sini_police") Long sini_police);
	
	@Query(nativeQuery = true,
	value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "where s.sini_branche =:sini_branche AND s.sini_produit =:sini_produit "
			+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParBrancheAndProduit(@Param("sini_branche") Long sini_branche, @Param("sini_produit") Long sini_produit);
	
	@Query(nativeQuery = true,
	value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "where s.sini_branche =:sini_branche AND s.sini_produit =:sini_produit AND CAST(s.sini_datedeclaration AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin "
			+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParBrancheAndProduitAndPeriode(@Param("sini_branche") Long sini_branche, @Param("sini_produit") Long sini_produit, @Param("debut") String debut, @Param("fin") String fin);
	
	@Query(nativeQuery = true,
	value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "where s.sini_branche =:sini_branche AND s.sini_produit =:sini_produit AND CAST(s.sini_datedeclaration AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin AND s.sini_souscripteur =:sini_souscripteur "
			+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParBrancheAndProduitAndPeriodeAndClient(@Param("sini_branche") Long sini_branche, @Param("sini_produit") Long sini_produit, @Param("debut") String debut, @Param("fin") String fin, @Param("sini_souscripteur") Long sini_souscripteur);
	
	@Query(nativeQuery = true,
	value="select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, s.sini_status from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "where s.sini_branche =:sini_branche AND s.sini_produit =:sini_produit AND CAST(s.sini_datedeclaration AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin AND s.sini_souscripteur =:sini_souscripteur AND s.sini_police =:sini_police "
			+ "order by s.sini_num")
	List<SinistreClient> listeSinistreParBrancheAndProduitAndPeriodeAndClientAndPolice(@Param("sini_branche") Long sini_branche, @Param("sini_produit") Long sini_produit, @Param("debut") String debut, @Param("fin") String fin, @Param("sini_souscripteur") Long sini_souscripteur, @Param("sini_police") Long sini_police);
	
	@Query(nativeQuery = true,
	/*value="SELECT sini_num, sini_acheteur, sini_beneficiaire, sini_branche, sini_categorie, sini_codecompagnie, sini_codeexpert, sini_coderesponsabilite, sini_datecloture, sini_datedeclaration, sini_datederniermvt, sini_dateexpert, sini_datemodification, sini_datesaisie, sini_datesurvenance, sini_description, sini_donneurdordre, sini_evaluationfrais, sini_evaluationglobale, sini_evaluationhonoraires, sini_evaluationprincipale, sini_id, sini_intermediaire, sini_lieu, sini_motifcloture, sini_numderniermvt, sini_police, sini_produit, sini_rapport, sini_recoursfrais, sini_recoursfraisencaisse, sini_recoursglobal, sini_recoursglobalencaisse, sini_recourshonoraieencaisse, sini_recourshonoraires, sini_recoursprincipal, sini_recoursprincipalencaisse, sini_reglementfrais, sini_reglementglobal, sini_reglementhonoraires, sini_reglementprincipal, sini_risque, sini_sapfrais, sini_sapglobale, sini_saphonoraires, sini_sapprincipale, sini_souscripteur, sini_status, sini_tiersrecours, sini_typesinistre, sini_utilisateur, mvts_num, mvts_beneficiaire, mvts_codeutilisateur, mvts_dateannulation, mvts_datecomptabilisation, mvts_datemodification, mvts_datemvt, mvts_datesaisie, mvts_id, mvts_montantfinancier, mvts_montantfrais, mvts_montanthonoraire, mvts_montantmvt, mvts_montantprincipal, mvts_motifannulation, mvts_numsinistre, mvts_poli, mvts_status, mvts_tiers, mvts_typegestionsinistre, mvts_typemvt "
			+ "FROM sinistre sini, mvtsinistre mvt "
			+ "WHERE sini.sini_num = mvt.mvts_numsinistre "
			+ "AND sini.sini_status >= 2 AND sini.sini_status = mvt.mvts_typemvt "
			+ "AND sini.sini_id =:sini_id"*/
	value = "SELECT sini_num, sini_acheteur, sini_beneficiaire, sini_branche, sini_categorie, sini_codecompagnie, sini_codeexpert, sini_coderesponsabilite, sini_datecloture, sini_datedeclaration, sini_datederniermvt, sini_dateexpert, sini_datemodification, sini_datesaisie, sini_datesurvenance, sini_description, sini_donneurdordre, sini_evaluationfrais, sini_evaluationglobale, sini_evaluationhonoraires, sini_evaluationprincipale, sini_id, sini_intermediaire, sini_lieu, sini_motifcloture, sini_numderniermvt, sini_police, sini_produit, sini_rapport, sini_recoursfrais, sini_recoursfraisencaisse, sini_recoursglobal, sini_recoursglobalencaisse, sini_recourshonoraieencaisse, sini_recourshonoraires, sini_recoursprincipal, sini_recoursprincipalencaisse, sini_reglementfrais, sini_reglementglobal, sini_reglementhonoraires, sini_reglementprincipal, sini_risque, sini_sapfrais, sini_sapglobale, sini_saphonoraires, sini_sapprincipale, sini_souscripteur, sini_status, sini_tiersrecours, sini_typesinistre, sini_utilisateur, mvts_num, mvts_beneficiaire, mvts_codeutilisateur, mvts_dateannulation, mvts_datecomptabilisation, mvts_datemodification, mvts_datemvt, mvts_datesaisie, mvts_id, mvts_montantfinancier, mvts_montantfrais, mvts_montanthonoraire, mvts_montantmvt, mvts_montantprincipal, mvts_motifannulation, mvts_numsinistre, mvts_poli, mvts_status, mvts_tiers, mvts_typegestionsinistre, mvts_typemvt "
			+ "FROM sinistre sini, mvtsinistre mvt "
			+ "WHERE sini.sini_num = mvt.mvts_numsinistre "
			+ "AND sini.sini_status >= 2 AND sini.sini_status = mvt.mvts_typemvt "
			+ "AND mvt.mvts_num IN (SELECT MAX(mvts_num) FROM mvtsinistre GROUP BY mvts_numsinistre ) "
			+ "AND sini.sini_id =:sini_id"
			)	
	SinistreMouvement getSinistreById(@Param("sini_id") Long sini_id);
	
	@Query(nativeQuery = true,
	value="select DISTINCT sinistre.sini_branche, "
			+ "sinistre.sini_souscripteur, "
			+ "facture.fact_numeropolice, facture.fact_datefacture, "
			+ "client.clien_prenom, client.clien_nom, "
			+ "client.clien_denomination, client.clien_numero, "
			+ "branche.branche_libelle_long, "
			+ "SUM(facture.fact_montantprimenet) as primenet, "
			+ "SUM(facture.fact_montantaccescompagnie) as accessoires, "
			+ "SUM(sinistre.sini_sapglobale) as sap, "
			+ "SUM(sinistre.sini_reglementglobal) as reglement, "
			+ "SUM(sinistre.sini_recoursglobal) as recours, "
			+ "((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
			+ "from sinistre as sinistre, facture as facture, "
			+ "client as client, branche as branche "
			+ "where client.clien_numero = sinistre.sini_souscripteur "
			+ "and branche.branche_id = sinistre.sini_branche "
			+ "and sinistre.sini_police = facture.fact_numeropolice "
			+ "group by sinistre.sini_branche, "
			+ "sinistre.sini_souscripteur, client.clien_prenom, "
			+ "client.clien_nom, client.clien_denomination, client.clien_numero, "
			+ "branche.branche_libelle_long, facture.fact_numeropolice, facture.fact_datefacture")
	List<SinistreFacture> getAllSinistralite();
	
	@Query(nativeQuery = true,
			value="select DISTINCT sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, "
					+ "facture.fact_numeropolice, facture.fact_datefacture, "
					+ "client.clien_prenom, client.clien_nom, "
					+ "client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, "
					+ "SUM(facture.fact_montantprimenet) as primenet, "
					+ "SUM(facture.fact_montantaccescompagnie) as accessoires, "
					+ "SUM(sinistre.sini_sapglobale) as sap, "
					+ "SUM(sinistre.sini_reglementglobal) as reglement, "
					+ "SUM(sinistre.sini_recoursglobal) as recours, "
					+ "((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
					+ "from sinistre as sinistre, facture as facture, "
					+ "client as client, branche as branche "
					+ "where client.clien_numero = sinistre.sini_souscripteur "
					+ "and branche.branche_id = sinistre.sini_branche "
					+ "and sinistre.sini_police = facture.fact_numeropolice "
					+ "and sinistre.sini_branche =:sini_branche "
					+ "group by sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, client.clien_prenom, "
					+ "client.clien_nom, client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, facture.fact_numeropolice, facture.fact_datefacture")
	List<SinistreFacture> getSinistraliteByBranche(@Param("sini_branche") Long sini_branche);
	
	@Query(nativeQuery = true,
			value="select DISTINCT sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, "
					+ "facture.fact_numeropolice, facture.fact_datefacture, "
					+ "client.clien_prenom, client.clien_nom, "
					+ "client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, "
					+ "SUM(facture.fact_montantprimenet) as primenet, "
					+ "SUM(facture.fact_montantaccescompagnie) as accessoires, "
					+ "SUM(sinistre.sini_sapglobale) as sap, "
					+ "SUM(sinistre.sini_reglementglobal) as reglement, "
					+ "SUM(sinistre.sini_recoursglobal) as recours, "
					+ "((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
					+ "from sinistre as sinistre, facture as facture, "
					+ "client as client, branche as branche "
					+ "where client.clien_numero = sinistre.sini_souscripteur "
					+ "and branche.branche_id = sinistre.sini_branche "
					+ "and sinistre.sini_police = facture.fact_numeropolice "
					+ "and CAST(facture.fact_datefacture AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin "
					+ "group by sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, client.clien_prenom, "
					+ "client.clien_nom, client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, facture.fact_numeropolice, facture.fact_datefacture")
	List<SinistreFacture> getSinistraliteByPeriode(@Param("debut") String debut, @Param("fin") String fin);
	
	@Query(nativeQuery = true,
			value="select DISTINCT sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, "
					+ "facture.fact_numeropolice, facture.fact_datefacture, "
					+ "client.clien_prenom, client.clien_nom, "
					+ "client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, "
					+ "SUM(facture.fact_montantprimenet) as primenet, "
					+ "SUM(facture.fact_montantaccescompagnie) as accessoires, "
					+ "SUM(sinistre.sini_sapglobale) as sap, "
					+ "SUM(sinistre.sini_reglementglobal) as reglement, "
					+ "SUM(sinistre.sini_recoursglobal) as recours, "
					+ "((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
					+ "from sinistre as sinistre, facture as facture, "
					+ "client as client, branche as branche "
					+ "where client.clien_numero = sinistre.sini_souscripteur "
					+ "and branche.branche_id = sinistre.sini_branche "
					+ "and sinistre.sini_police = facture.fact_numeropolice "
					+ "and sinistre.sini_souscripteur =:sini_souscripteur "
					+ "group by sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, client.clien_prenom, "
					+ "client.clien_nom, client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, facture.fact_numeropolice, facture.fact_datefacture")
	List<SinistreFacture> getSinistraliteByClient(@Param("sini_souscripteur") Long sini_souscripteur);
	
	@Query(nativeQuery = true,
			value="select DISTINCT sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, "
					+ "facture.fact_numeropolice, facture.fact_datefacture, "
					+ "client.clien_prenom, client.clien_nom, "
					+ "client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, "
					+ "SUM(facture.fact_montantprimenet) as primenet, "
					+ "SUM(facture.fact_montantaccescompagnie) as accessoires, "
					+ "SUM(sinistre.sini_sapglobale) as sap, "
					+ "SUM(sinistre.sini_reglementglobal) as reglement, "
					+ "SUM(sinistre.sini_recoursglobal) as recours, "
					+ "((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
					+ "from sinistre as sinistre, facture as facture, "
					+ "client as client, branche as branche "
					+ "where client.clien_numero = sinistre.sini_souscripteur "
					+ "and branche.branche_id = sinistre.sini_branche "
					+ "and sinistre.sini_police = facture.fact_numeropolice "
					+ "and facture.fact_numeropolice =:fact_numeropolice "
					+ "group by sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, client.clien_prenom, "
					+ "client.clien_nom, client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, facture.fact_numeropolice, facture.fact_datefacture")
	List<SinistreFacture> getSinistraliteByPolice(@Param("fact_numeropolice") Long fact_numeropolice);
	
	@Query(nativeQuery = true,
			value="select DISTINCT sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, "
					+ "facture.fact_numeropolice, facture.fact_datefacture, "
					+ "client.clien_prenom, client.clien_nom, "
					+ "client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, "
					+ "SUM(facture.fact_montantprimenet) as primenet, "
					+ "SUM(facture.fact_montantaccescompagnie) as accessoires, "
					+ "SUM(sinistre.sini_sapglobale) as sap, "
					+ "SUM(sinistre.sini_reglementglobal) as reglement, "
					+ "SUM(sinistre.sini_recoursglobal) as recours, "
					+ "((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
					+ "from sinistre as sinistre, facture as facture, "
					+ "client as client, branche as branche "
					+ "where client.clien_numero = sinistre.sini_souscripteur "
					+ "and branche.branche_id = sinistre.sini_branche "
					+ "and sinistre.sini_police = facture.fact_numeropolice "
					+ "and sinistre.sini_branche =:sini_branche and CAST(facture.fact_datefacture AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin"
					+ "group by sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, client.clien_prenom, "
					+ "client.clien_nom, client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, facture.fact_numeropolice, facture.fact_datefacture")
	List<SinistreFacture> getSinistraliteByBrancheAndPeriode(@Param("sini_branche") Long sini_branche, @Param("debut") String debut, @Param("fin") String fin);
	
	@Query(nativeQuery = true,
			value="select DISTINCT sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, "
					+ "facture.fact_numeropolice, facture.fact_datefacture, "
					+ "client.clien_prenom, client.clien_nom, "
					+ "client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, "
					+ "SUM(facture.fact_montantprimenet) as primenet, "
					+ "SUM(facture.fact_montantaccescompagnie) as accessoires, "
					+ "SUM(sinistre.sini_sapglobale) as sap, "
					+ "SUM(sinistre.sini_reglementglobal) as reglement, "
					+ "SUM(sinistre.sini_recoursglobal) as recours, "
					+ "((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
					+ "from sinistre as sinistre, facture as facture, "
					+ "client as client, branche as branche "
					+ "where client.clien_numero = sinistre.sini_souscripteur "
					+ "and branche.branche_id = sinistre.sini_branche "
					+ "and sinistre.sini_police = facture.fact_numeropolice "
					+ "and sinistre.sini_branche =:sini_branche and CAST(facture.fact_datefacture AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin and sinistre.sini_souscripteur =:sini_souscripteur"
					+ "group by sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, client.clien_prenom, "
					+ "client.clien_nom, client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, facture.fact_numeropolice, facture.fact_datefacture")
	List<SinistreFacture> getSinistraliteByBrancheAndPeriodeAndClient(@Param("sini_branche") Long sini_branche, @Param("debut") String debut, @Param("fin") String fin, @Param("sini_souscripteur") Long sini_souscripteur);
	
	@Query(nativeQuery = true,
			value="select DISTINCT sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, "
					+ "facture.fact_numeropolice, facture.fact_datefacture, "
					+ "client.clien_prenom, client.clien_nom, "
					+ "client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, "
					+ "SUM(facture.fact_montantprimenet) as primenet, "
					+ "SUM(facture.fact_montantaccescompagnie) as accessoires, "
					+ "SUM(sinistre.sini_sapglobale) as sap, "
					+ "SUM(sinistre.sini_reglementglobal) as reglement, "
					+ "SUM(sinistre.sini_recoursglobal) as recours, "
					+ "((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
					+ "from sinistre as sinistre, facture as facture, "
					+ "client as client, branche as branche "
					+ "where client.clien_numero = sinistre.sini_souscripteur "
					+ "and branche.branche_id = sinistre.sini_branche "
					+ "and sinistre.sini_police = facture.fact_numeropolice "
					+ "and sinistre.sini_branche =:sini_branche and CAST(facture.fact_datefacture AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin and sinistre.sini_souscripteur =:sini_souscripteur, and facture.fact_numeropolice =:fact_numeropolice"
					+ "group by sinistre.sini_branche, "
					+ "sinistre.sini_souscripteur, client.clien_prenom, "
					+ "client.clien_nom, client.clien_denomination, client.clien_numero, "
					+ "branche.branche_libelle_long, facture.fact_numeropolice, facture.fact_datefacture")
	List<SinistreFacture> getSinistraliteByBrancheAndPeriodeAndClientAndPolice(@Param("sini_branche") Long sini_branche, @Param("debut") String debut, @Param("fin") String fin, @Param("sini_souscripteur") Long sini_souscripteur, @Param("fact_numeropolice") Long fact_numeropolice);
	
	@Query(nativeQuery = true,
			value = "select facture.fact_numerobranche, "
					+ "facture.fact_numeropolice, facture.fact_datefacture, sinistre.sini_souscripteur, "
					+ "facture.fact_montantprimenet as primenet, "
					+ "facture.fact_montantaccescompagnie as accessoires, sinistre.sini_branche, "
					+ "sinistre.sini_sapglobale as sap, "
					+ "sinistre.sini_reglementglobal as reglement, "
					+ "sinistre.sini_recoursglobal as recours, "
					+ "((sinistre.sini_sapglobale + sinistre.sini_reglementglobal - sinistre.sini_recoursglobal) / (facture.fact_montantprimenet + facture.fact_montantaccescompagnie)) *100 / ((SUM(sinistre.sini_sapglobale) + SUM(sinistre.sini_reglementglobal) - SUM(sinistre.sini_recoursglobal)) / (SUM(facture.fact_montantprimenet) + SUM(facture.fact_montantaccescompagnie))) as sinistralite "
					+ "from sinistre as sinistre, facture as facture "
					+ "where facture.fact_numerobranche = sinistre.sini_branche "
					+ "and facture.fact_numerobranche =:fact_numerobranche "
					+ "group by facture.fact_numeropolice, "
					+ "facture.fact_numerobranche, "
					+ "facture.fact_datefacture, sinistre.sini_souscripteur, "
					+ "facture.fact_montantprimenet, facture.fact_montantaccescompagnie, "
					+ "sinistre.sini_sapglobale, sinistre.sini_reglementglobal, "
					+ "sinistre.sini_recoursglobal, sinistre.sini_branche")
	List<SinistreFacture> getDetailSinistraliteByBranche(@Param("fact_numerobranche") Long fact_numerobranche);
	
	@Modifying
	@Query("UPDATE Sinistre s SET s.sini_status=:sini_status, s.sini_datemodification =:sini_datemodification, s.sini_recoursprincipal=:sini_recoursprincipal, s.sini_recoursfrais=:sini_recoursfrais, s.sini_recourshonoraires=:sini_recourshonoraires, s.sini_recoursglobal=:sini_recoursglobal where s.sini_id=:sini_id")
	void updateSinistreRecours(@Param("sini_status") Long sini_status, @Param("sini_datemodification") Date sini_datemodification, @Param("sini_recoursprincipal") Long sini_recoursprincipal, @Param("sini_recoursfrais") Long sini_recoursfrais, @Param("sini_recourshonoraires") Long sini_recourshonoraires, @Param("sini_recoursglobal") Long sini_recoursglobal, @Param("sini_id") Long sini_id);
	
	@Modifying
	@Query("UPDATE Sinistre s SET s.sini_status=:sini_status, s.sini_datemodification =:sini_datemodification, s.sini_recoursprincipalencaisse=:sini_recoursprincipalencaisse, s.sini_recoursfraisencaisse=:sini_recoursfraisencaisse, s.sini_recourshonoraieencaisse=:sini_recourshonoraieencaisse, s.sini_recoursglobalencaisse=:sini_recoursglobalencaisse where s.sini_id=:sini_id")
	void updateSinistreRecoursEncaisse(@Param("sini_status") Long sini_status, @Param("sini_datemodification") Date sini_datemodification, @Param("sini_recoursprincipalencaisse") Long sini_recoursprincipalencaisse, @Param("sini_recoursfraisencaisse") Long sini_recoursfraisencaisse, @Param("sini_recourshonoraieencaisse") Long sini_recourshonoraieencaisse, @Param("sini_recoursglobalencaisse") Long sini_recoursglobalencaisse, @Param("sini_id") Long sini_id);
	
	@Modifying
	@Query("UPDATE Sinistre s SET s.sini_status=:sini_status, s.sini_datemodification =:sini_datemodification where s.sini_id=:sini_id")
	void updateSinistreStatus(@Param("sini_status") Long sini_status, @Param("sini_datemodification") Date sini_datemodification, @Param("sini_id") Long sini_id);
	
	@Modifying
	@Query("UPDATE Sinistre s SET s.sini_status=:sini_status, s.sini_datemodification =:sini_datemodification, s.sini_datecloture =:sini_datecloture where s.sini_id=:sini_id")
	void updateSinistreStatusCloture(@Param("sini_status") Long sini_status, @Param("sini_datemodification") Date sini_datemodification, @Param("sini_datecloture") Date sini_datecloture, @Param("sini_id") Long sini_id);
	
	@Modifying
	@Query("UPDATE Sinistre s SET s.sini_status=:sini_status, s.sini_datemodification =:sini_datemodification, s.sini_evaluationprincipale =:sini_evaluationprincipale, s.sini_evaluationfrais =:sini_evaluationfrais, s.sini_evaluationhonoraires =:sini_evaluationhonoraires, s.sini_evaluationglobale =:sini_evaluationglobale, s.sini_sapprincipale =:sini_sapprincipale, s.sini_sapfrais =:sini_sapfrais, s.sini_saphonoraires =:sini_saphonoraires, s.sini_sapglobale =:sini_sapglobale where s.sini_id=:sini_id")
	void updateSinistreEvaluationAndSAP(@Param("sini_status") Long sini_status, @Param("sini_datemodification") Date sini_datemodification, @Param("sini_evaluationprincipale") Long sini_evaluationprincipale, @Param("sini_evaluationfrais") Long sini_evaluationfrais, @Param("sini_evaluationhonoraires") Long sini_evaluationhonoraires, @Param("sini_evaluationglobale") Long sini_evaluationglobale, @Param("sini_sapprincipale") Long sini_sapprincipale, @Param("sini_sapfrais") Long sini_sapfrais, @Param("sini_saphonoraires") Long sini_saphonoraires, @Param("sini_sapglobale") Long sini_sapglobale, @Param("sini_id") Long sini_id);
	
	@Query(nativeQuery = true,
			value = "SELECT sini_num, sini_acheteur, sini_beneficiaire, "
					+ "sini_branche, sini_categorie, sini_codecompagnie, "
					+ "sini_codeexpert, sini_coderesponsabilite, sini_datecloture, "
					+ "sini_datedeclaration, sini_datederniermvt, sini_dateexpert, "
					+ "sini_datemodification, sini_datesaisie, sini_datesurvenance, "
					+ "sini_description, sini_donneurdordre, sini_evaluationfrais, "
					+ "sini_evaluationglobale, sini_evaluationhonoraires, sini_evaluationprincipale, "
					+ "sini_id, sini_intermediaire, sini_lieu, sini_motifcloture, sini_numderniermvt, "
					+ "sini_police, sini_produit, sini_rapport, sini_recoursfrais, sini_recoursfraisencaisse, "
					+ "sini_recoursglobal, sini_recoursglobalencaisse, sini_recourshonoraieencaisse, sini_recourshonoraires, "
					+ "sini_recoursprincipal, sini_recoursprincipalencaisse, sini_reglementfrais, sini_reglementglobal, "
					+ "sini_reglementhonoraires, sini_reglementprincipal, sini_risque, sini_sapfrais, sini_sapglobale, "
					+ "sini_saphonoraires, sini_sapprincipale, sini_souscripteur, sini_status, sini_tiersrecours, "
					+ "sini_typesinistre, sini_utilisateur, mvts_num, mvts_beneficiaire, mvts_codeutilisateur, "
					+ "mvts_dateannulation, mvts_datecomptabilisation, mvts_datemodification, mvts_datemvt, "
					+ "mvts_datesaisie, mvts_id, mvts_montantfinancier, mvts_montantfrais, mvts_montanthonoraire, "
					+ "mvts_montantmvt, mvts_montantprincipal, mvts_motifannulation, mvts_numsinistre, mvts_poli, "
					+ "mvts_status, mvts_tiers, mvts_typegestionsinistre, mvts_typemvt "
					+ "FROM sinistre sini, mvtsinistre mvt "
					+ "WHERE sini.sini_num = mvt.mvts_numsinistre "
					+ "AND sini.sini_status >= 2 "
					+ "AND sini.sini_status = mvt.mvts_typemvt "
					+ "AND sini.sini_sapglobale = 0 "
					+ "AND (CURRENT_DATE - cast(mvt.mvts_datemvt as date)) > 360 "
					+ "AND mvt.mvts_num IN "
					+ "(SELECT MAX(mvts_num) FROM mvtsinistre GROUP BY mvts_numsinistre ) "
					+ "ORDER BY sini.sini_souscripteur, sini.sini_police, sini.sini_acheteur, sini.sini_num")
	List<SinistreMouvement> listeSinistreACloturer();
	
	@Query(nativeQuery = true,
			value="SELECT sini_num, sini_acheteur, sini_beneficiaire, sini_branche, sini_categorie, sini_codecompagnie, sini_codeexpert, sini_coderesponsabilite, sini_datecloture, sini_datedeclaration, sini_datederniermvt, sini_dateexpert, sini_datemodification, sini_datesaisie, sini_datesurvenance, sini_description, sini_donneurdordre, sini_evaluationfrais, sini_evaluationglobale, sini_evaluationhonoraires, sini_evaluationprincipale, sini_id, sini_intermediaire, sini_lieu, sini_motifcloture, sini_numderniermvt, sini_police, sini_produit, sini_rapport, sini_recoursfrais, sini_recoursfraisencaisse, sini_recoursglobal, sini_recoursglobalencaisse, sini_recourshonoraieencaisse, sini_recourshonoraires, sini_recoursprincipal, sini_recoursprincipalencaisse, sini_reglementfrais, sini_reglementglobal, sini_reglementhonoraires, sini_reglementprincipal, sini_risque, sini_sapfrais, sini_sapglobale, sini_saphonoraires, sini_sapprincipale, sini_souscripteur, sini_status, sini_tiersrecours, sini_typesinistre, sini_utilisateur, mvts_num, mvts_beneficiaire, mvts_codeutilisateur, mvts_dateannulation, mvts_datecomptabilisation, mvts_datemodification, mvts_datemvt, mvts_datesaisie, mvts_id, mvts_montantfinancier, mvts_montantfrais, mvts_montanthonoraire, mvts_montantmvt, mvts_montantprincipal, mvts_motifannulation, mvts_numsinistre, mvts_poli, mvts_status, mvts_tiers, mvts_typegestionsinistre, mvts_typemvt "
					+ "FROM sinistre sini, mvtsinistre mvt "
					+ "WHERE sini.sini_num = mvt.mvts_numsinistre "
					+ "AND sini.sini_status = 15 AND sini.sini_status = mvt.mvts_typemvt "
					+ "AND mvt.mvts_num IN (SELECT MAX(mvts_num) FROM mvtsinistre GROUP BY mvts_numsinistre ) "
					+ "ORDER BY sini.sini_souscripteur, sini.sini_police, sini.sini_acheteur, sini.sini_num")
	List<SinistreMouvement> listeSinistreClotures();
	
	@Query(nativeQuery = true,
			value="select s.sini_num, s.sini_souscripteur, s.sini_status, "
					+ "s.sini_branche, s.sini_produit, s.sini_police, "
					+ "s.sini_datedeclaration, s.sini_datesurvenance, "
					+ "s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, "
					+ "m.mvts_num, m.mvts_beneficiaire,m.mvts_dateannulation, "
					+ "m.mvts_datemodification, m.mvts_datemvt, "
					+ "m.mvts_datesaisie, m.mvts_montantfrais, m.mvts_montanthonoraire, "
					+ "m.mvts_montantmvt, m.mvts_montantprincipal, "
					+ "m.mvts_motifannulation, m.mvts_numsinistre, "
					+ "m.mvts_poli, m.mvts_status, m.mvts_typemvt, "
					+ "cl.clien_nom, cl.clien_denomination, cl.clien_prenom, "
					+ "b.branche_libelle_long, p.prod_denominationlong, "
					+ "a.achet_prenom, a.achet_nom "
					+ "from sinistre as s "
					+ "inner join mvtsinistre as m on s.sini_num = m.mvts_numsinistre "
					+ "inner join client as cl on s.sini_souscripteur = cl.clien_numero "
					+ "inner join branche as b on s.sini_branche = b.branche_numero "
					+ "inner join produit as p on s.sini_produit = p.prod_numero "
					+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
					+ "where mvts_typemvt = 7 or mvts_typemvt = 8 "
					+ "or mvts_typemvt = 11 or mvts_typemvt = 12 "
					+ "or mvts_typemvt = 14 "
					+ "order by s.sini_num")
	List<AnnulationPeriodique> findAllAnnulation();
	
	@Query(nativeQuery = true,
			value="select s.sini_num, s.sini_souscripteur, s.sini_status, "
					+ "s.sini_branche, s.sini_produit, s.sini_police, "
					+ "s.sini_datedeclaration, s.sini_datesurvenance, "
					+ "s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, "
					+ "m.mvts_num, m.mvts_beneficiaire,m.mvts_dateannulation, "
					+ "m.mvts_datemodification, m.mvts_datemvt, "
					+ "m.mvts_datesaisie, m.mvts_montantfrais, m.mvts_montanthonoraire, "
					+ "m.mvts_montantmvt, m.mvts_montantprincipal, "
					+ "m.mvts_motifannulation, m.mvts_numsinistre, "
					+ "m.mvts_poli, m.mvts_status, m.mvts_typemvt, "
					+ "cl.clien_nom, cl.clien_denomination, cl.clien_prenom, "
					+ "b.branche_libelle_long, p.prod_denominationlong, "
					+ "a.achet_prenom, a.achet_nom "
					+ "from sinistre as s "
					+ "inner join mvtsinistre as m on s.sini_num = m.mvts_numsinistre "
					+ "inner join client as cl on s.sini_souscripteur = cl.clien_numero "
					+ "inner join branche as b on s.sini_branche = b.branche_numero "
					+ "inner join produit as p on s.sini_produit = p.prod_numero "
					+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
					+ "where mvts_typemvt = 7 or mvts_typemvt = 8 "
					+ "or mvts_typemvt = 11 or mvts_typemvt = 12 "
					+ "or mvts_typemvt = 14 "
					+ "and CAST(m.mvts_datemvt AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin "
					+ "order by s.sini_num")
	List<AnnulationPeriodique> consultationAnnulation(@Param("debut") String debut, @Param("fin") String fin);
	
	@Query(nativeQuery = true,
			value="select s.sini_num, s.sini_souscripteur, s.sini_status, "
					+ "s.sini_branche, s.sini_produit, s.sini_police, "
					+ "s.sini_datedeclaration, s.sini_datesurvenance, "
					+ "s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, "
					+ "m.mvts_num, m.mvts_beneficiaire,m.mvts_dateannulation, "
					+ "m.mvts_datemodification, m.mvts_datemvt, "
					+ "m.mvts_datesaisie, m.mvts_montantfrais, m.mvts_montanthonoraire, "
					+ "m.mvts_montantmvt, m.mvts_montantprincipal, "
					+ "m.mvts_motifannulation, m.mvts_numsinistre, "
					+ "m.mvts_poli, m.mvts_status, m.mvts_typemvt, "
					+ "cl.clien_nom, cl.clien_denomination, cl.clien_prenom, "
					+ "b.branche_libelle_long, p.prod_denominationlong, "
					+ "a.achet_prenom, a.achet_nom "
					+ "from sinistre as s "
					+ "inner join mvtsinistre as m on s.sini_num = m.mvts_numsinistre "
					+ "inner join client as cl on s.sini_souscripteur = cl.clien_numero "
					+ "inner join branche as b on s.sini_branche = b.branche_numero "
					+ "inner join produit as p on s.sini_produit = p.prod_numero "
					+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
					+ "where mvts_typemvt = 7 or mvts_typemvt = 8 "
					+ "or mvts_typemvt = 11 or mvts_typemvt = 12 "
					+ "or mvts_typemvt = 14 "
					+ "and s.sini_produit =:sini_produit "
					+ "order by s.sini_num")
	List<AnnulationPeriodique> consultationAnnulationParProduit(@Param("sini_produit") Long sini_produit);
	
	@Query(nativeQuery = true,
			value="select s.sini_num, s.sini_souscripteur, s.sini_status, "
					+ "s.sini_branche, s.sini_produit, s.sini_police, "
					+ "s.sini_datedeclaration, s.sini_datesurvenance, "
					+ "s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, "
					+ "m.mvts_num, m.mvts_beneficiaire,m.mvts_dateannulation, "
					+ "m.mvts_datemodification, m.mvts_datemvt, "
					+ "m.mvts_datesaisie, m.mvts_montantfrais, m.mvts_montanthonoraire, "
					+ "m.mvts_montantmvt, m.mvts_montantprincipal, "
					+ "m.mvts_motifannulation, m.mvts_numsinistre, "
					+ "m.mvts_poli, m.mvts_status, m.mvts_typemvt, "
					+ "cl.clien_nom, cl.clien_denomination, cl.clien_prenom, "
					+ "b.branche_libelle_long, p.prod_denominationlong, "
					+ "a.achet_prenom, a.achet_nom "
					+ "from sinistre as s "
					+ "inner join mvtsinistre as m on s.sini_num = m.mvts_numsinistre "
					+ "inner join client as cl on s.sini_souscripteur = cl.clien_numero "
					+ "inner join branche as b on s.sini_branche = b.branche_numero "
					+ "inner join produit as p on s.sini_produit = p.prod_numero "
					+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
					+ "where mvts_typemvt = 7 or mvts_typemvt = 8 "
					+ "or mvts_typemvt = 11 or mvts_typemvt = 12 "
					+ "or mvts_typemvt = 14 "
					+ "and s.sini_branche =:sini_branche "
					+ "order by s.sini_num")
	List<AnnulationPeriodique> consultationAnnulationParBranche(@Param("sini_branche") Long sini_branche);
	
	@Query(nativeQuery = true,
			value="select s.sini_num, s.sini_souscripteur, s.sini_status, "
					+ "s.sini_branche, s.sini_produit, s.sini_police, "
					+ "s.sini_datedeclaration, s.sini_datesurvenance, "
					+ "s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, "
					+ "m.mvts_num, m.mvts_beneficiaire,m.mvts_dateannulation, "
					+ "m.mvts_datemodification, m.mvts_datemvt, "
					+ "m.mvts_datesaisie, m.mvts_montantfrais, m.mvts_montanthonoraire, "
					+ "m.mvts_montantmvt, m.mvts_montantprincipal, "
					+ "m.mvts_motifannulation, m.mvts_numsinistre, "
					+ "m.mvts_poli, m.mvts_status, m.mvts_typemvt, "
					+ "cl.clien_nom, cl.clien_denomination, cl.clien_prenom, "
					+ "b.branche_libelle_long, p.prod_denominationlong, "
					+ "a.achet_prenom, a.achet_nom "
					+ "from sinistre as s "
					+ "inner join mvtsinistre as m on s.sini_num = m.mvts_numsinistre "
					+ "inner join client as cl on s.sini_souscripteur = cl.clien_numero "
					+ "inner join branche as b on s.sini_branche = b.branche_numero "
					+ "inner join produit as p on s.sini_produit = p.prod_numero "
					+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
					+ "where mvts_typemvt = 7 or mvts_typemvt = 8 "
					+ "or mvts_typemvt = 11 or mvts_typemvt = 12 "
					+ "or mvts_typemvt = 14 "
					+ "and CAST(m.mvts_datemvt AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin "
					+ "and s.sini_produit =:sini_produit "
					+ "order by s.sini_num")
	List<AnnulationPeriodique> consultationAnnulationParPeriodeAndProduit(@Param("debut") String debut, @Param("fin") String fin, @Param("sini_produit") Long sini_produit);
	
	@Query(nativeQuery = true,
			value="select s.sini_num, s.sini_souscripteur, s.sini_status, "
					+ "s.sini_branche, s.sini_produit, s.sini_police, "
					+ "s.sini_datedeclaration, s.sini_datesurvenance, "
					+ "s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, "
					+ "m.mvts_num, m.mvts_beneficiaire,m.mvts_dateannulation, "
					+ "m.mvts_datemodification, m.mvts_datemvt, "
					+ "m.mvts_datesaisie, m.mvts_montantfrais, m.mvts_montanthonoraire, "
					+ "m.mvts_montantmvt, m.mvts_montantprincipal, "
					+ "m.mvts_motifannulation, m.mvts_numsinistre, "
					+ "m.mvts_poli, m.mvts_status, m.mvts_typemvt, "
					+ "cl.clien_nom, cl.clien_denomination, cl.clien_prenom, "
					+ "b.branche_libelle_long, p.prod_denominationlong, "
					+ "a.achet_prenom, a.achet_nom "
					+ "from sinistre as s "
					+ "inner join mvtsinistre as m on s.sini_num = m.mvts_numsinistre "
					+ "inner join client as cl on s.sini_souscripteur = cl.clien_numero "
					+ "inner join branche as b on s.sini_branche = b.branche_numero "
					+ "inner join produit as p on s.sini_produit = p.prod_numero "
					+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
					+ "where mvts_typemvt = 7 or mvts_typemvt = 8 "
					+ "or mvts_typemvt = 11 or mvts_typemvt = 12 "
					+ "or mvts_typemvt = 14 "
					+ "and CAST(m.mvts_datemvt AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin "
					+ "and s.sini_produit =:sini_produit "
					+ "and s.sini_branche =:sini_branche "
					+ "order by s.sini_num")
	List<AnnulationPeriodique> consultationAnnulationParPeriodeAndProduitAndBranche(@Param("debut") String debut, @Param("fin") String fin, @Param("sini_produit") Long sini_produit, @Param("sini_branche") Long sini_branche);
	/*********************************Test de la méthode de Docteur**********************************/
	String requete = "select s.sini_num, s.sini_souscripteur, s.sini_branche, s.sini_produit, s.sini_datedeclaration, s.sini_datesurvenance, s.sini_datesaisie, s.sini_lieu, s.sini_typesinistre, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, s.sini_police, b.branche_libelle_long, p.prod_denominationlong, a.achet_prenom, a.achet_nom, m.mvts_typemvt from sinistre as s "
			+ "inner join client as cl on s.sini_souscripteur=cl.clien_numero "
			+ "inner join branche as b on s.sini_branche = b.branche_id "
			+ "inner join produit as p on s.sini_produit = p.prod_numero "
			+ "inner join acheteur as a on s.sini_acheteur = a.achet_numero "
			+ "inner join mvtsinistre as m on m.mvts_numsinistre = s.sini_num "
			+ ":condition";
	@Query(nativeQuery = true, value = requete)
	List<SinistreClient> rechercheParCritere(@Param("condition") String condition);
}
