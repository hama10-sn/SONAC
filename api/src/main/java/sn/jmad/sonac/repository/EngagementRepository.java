package sn.jmad.sonac.repository;


import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.EngagementAcheteur;
import sn.jmad.sonac.message.response.ClientContact;
import sn.jmad.sonac.message.response.SureteEngagement1;
import sn.jmad.sonac.model.Engagement;


@Repository
public interface EngagementRepository extends JpaRepository<Engagement, Long> {
	
	@Query(
			"select engag"
				+ " from Engagement engag"
				+ " where engag.engag_numeroengagement = :id"
		)
	Optional<Engagement> findByNum(@Param("id") Long engag_numeroengagement);
	@Query("select engag"
			+ " from Engagement engag"
			+ " where engag.active = :id ORDER BY engag.engag_numpoli, engag.engag_numeroengagement"
			)
	List<Engagement> allEngagements(@Param("id") int a);
	
	@Query("select engag from Engagement engag where engag.active =:id and engag.engag_numpoli =:num "
			+ "ORDER BY engag.engag_numeroengagement ")
	List<Engagement> findEngByPolice(@Param("id") int a,@Param("num") Long num);
	
	@Query("select engag from Engagement engag where engag.active =:id and engag.engag_numpoli =:num "
			+ "ORDER BY engag.engag_numeroengagement ")
	Engagement findEngByPolice1(@Param("id") int a,@Param("num") Long num);

	@Query("select max(a.engag_numeroengagement) from Engagement a where a.engag_numeroacte=:acte")
	Long lastIdgengagement(@Param("acte") Long acte);
	
	@Query("select engag from Engagement engag where engag.active =1 and engag.engag_numeroengagement =:num ")
	Engagement findEng(@Param("num") Long num);


	/*@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Engagement eng left join Client cl on enc.encai_numerosouscripteur=cl.clien_numero "
					+ "where enc.active = 1 and enc.encai_codeannulation IS NULL Order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementAndClient();
	@Query(nativeQuery = true,
			value="select enc.encai_numeroencaissement, cl.clien_nom, cl.clien_denomination, cl.clien_prenom, cl.clien_sigle, enc.encai_numeropolice, enc.encai_numerofacture, enc.encai_numeroquittance, enc.encai_datepaiement,enc.encai_typencaissement, enc.encai_mtnquittance, enc.encai_mtnpaye, enc.encai_solde, enc.encai_codebanque, enc.encai_numerocheque, enc.encai_datecomptabilisation "
					+ "from Encaissement enc left join Client cl on enc.encai_numerosouscripteur=cl.clien_numero "
					+ "where enc.active = 1 and enc.encai_codeannulation IS NULL Order by enc.encai_numeroencaissement")
	List<EncaissementClient> allEncaissementAndClient();*/

	
	@Query(nativeQuery = true,
			value="SELECT poli.poli_client, cl.clien_numero, cl.clien_prenom, cl.clien_nom, cl.clien_denomination, cl.clien_sigle, engag_numpoli, poli.poli_numero, engag_numeroengagement, engag_typesurete, engag_retenudeposit, engag_identificationtitre, engag_cautionsolidaire "
					+ "FROM engagement eng, police poli, client cl "
					+ "WHERE eng.engag_numpoli = poli.poli_numero AND poli.poli_client = cl.clien_numero AND eng.active = 1 AND engag_typesurete IS NOT NULL "
					+ "ORDER BY clien_numero, poli.poli_numero, eng.engag_numeroengagement, eng.engag_typesurete")
	List<SureteEngagement1> getAllSureteEgagement();
	
	@Query(
			"SELECT engag FROM Engagement engag WHERE engag.engag_numeroengagement = :id"
		)
	Engagement findEngagementByNumero(@Param("id") Long id);
	

	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche")
	List<EngagementAcheteur> getAllEngagements();
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and eng.engag_numpoli =:engag_numpoli")
	List<EngagementAcheteur> getEngagementsByPolice(@Param("engag_numpoli") Long engag_numpoli);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and branc.branche_numero =:branche_numero")
	List<EngagementAcheteur> getEngagementsByBranche(@Param("branche_numero") Long branche_numero);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and clien.clien_numero =:clien_numero")
	List<EngagementAcheteur> getEngagementsByClient(@Param("clien_numero") Long clien_numero);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and CAST(eng.engag_dateengagement AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin")
	List<EngagementAcheteur> getEngagementsByPeriode(@Param("debut") String debut, @Param("fin") String fin);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and pol.poli_codeproduit =:poli_codeproduit")
	List<EngagementAcheteur> getEngagementsByProduit(@Param("poli_codeproduit") Long poli_codeproduit);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and eng.engag_numpoli =:engag_numpoli and branc.branche_numero =:branche_numero")
	List<EngagementAcheteur> getEngagementsByPoliceAndBranche(@Param("engag_numpoli") Long engag_numpoli, @Param("branche_numero") Long branche_numero);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and eng.engag_numpoli =:engag_numpoli and clien.clien_numero =:clien_numero")
	List<EngagementAcheteur> getEngagementsByPoliceAndClient(@Param("engag_numpoli") Long engag_numpoli, @Param("clien_numero") Long clien_numero);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and eng.engag_numpoli =:engag_numpoli and CAST(eng.engag_dateengagement AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin")
	List<EngagementAcheteur> getEngagementsByPoliceAndPeriode(@Param("engag_numpoli") Long engag_numpoli, @Param("debut") String debut, @Param("fin") String fin);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and eng.engag_numpoli =:engag_numpoli and pol.poli_codeproduit =:poli_codeproduit")
	List<EngagementAcheteur> getEngagementsByPoliceAndProduit(@Param("engag_numpoli") Long engag_numpoli, @Param("poli_codeproduit") Long poli_codeproduit);
	
	@Query(nativeQuery = true, value = "select eng.engag_numeroengagement, eng.engag_dateengagement, "
			+ "eng.engag_kapassure, eng.engag_numeroacte, eng.engag_numeroavenant, eng.engag_numpoli, eng.engag_status, "
			+ "pol.poli_numero, pol.poli_branche, pol.poli_client, pol.poli_codeproduit, pol.poli_souscripteur, "
			+ "prod.prod_numero, prod.prod_denominationlong, "
			+ "clien.clien_numero, clien.clien_prenom, clien.clien_nom, clien.clien_denomination, clien.clien_adresserue, "
			+ "branc.branche_numero, branc.branche_libelle_long "
			+ "from engagement as eng, police as pol, produit as prod, client as clien, branche as branc "
			+ "where eng.engag_numpoli = pol.poli_numero "
			+ "and pol.poli_codeproduit = prod.prod_numero "
			+ "and clien.clien_numero = pol.poli_client "
			+ "and branc.branche_numero = pol.poli_branche "
			+ "and eng.engag_numpoli =:engag_numpoli and branc.branche_numero =:branche_numero and clien.clien_numero =:clien_numero and CAST(eng.engag_dateengagement AS VARCHAR) BETWEEN SYMMETRIC :debut AND :fin and pol.poli_codeproduit =:poli_codeproduit")
	List<EngagementAcheteur> getEngagementsByPoliceAndBrancheAndClientAndPeriodeAndProduit(@Param("engag_numpoli") Long engag_numpoli, @Param("branche_numero") Long branche_numero, @Param("clien_numero") Long clien_numero, @Param("debut") String debut, @Param("fin") String fin, @Param("poli_codeproduit") Long poli_codeproduit);
	
}