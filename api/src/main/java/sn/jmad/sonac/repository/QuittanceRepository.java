package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.message.response.EmissionConsultation;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.ProductionConsultation;
import sn.jmad.sonac.model.Quittance;

public interface QuittanceRepository extends JpaRepository<Quittance, Long>{

	@Query("from Quittance q where q.active = 1 order by q.quit_id DESC")
	List<Quittance> allQuittances();
	@Query("from Quittance q where q.active = 1 and q.quit_typeecriture='emission' and q.quit_mntprimencaisse is not null  order by q.quit_id DESC")
	List<Quittance> allQuittancesClient(@Param("numcli") Long numcli);
	
	@Query("select q from Quittance q where q.active = 1 and q.Quit_numero = :id")
	Quittance findbyIdd(@Param("id") Long id);
	
	@Query("select q from Quittance q where q.active = 1 and q.Quit_Facture = :numfact")
	Quittance findQuittancebyNumFacture(@Param("numfact") Long numfact);
	
	/*
	@Query("from Quittance q where q.active = 1 and q.quit_typeecriture = 'emission' and q.Quit_Facture = :numFactEncaissement order by q.quit_id DESC")
	Quittance findQuittanceByNumFactEncaissement(@Param("numFactEncaissement") Long numFactEncaissement);
	*/
	
	@Query("select q from Quittance q where q.active = 1 and q.Quit_numeropolice = :id")
	Quittance findbyNumpol(@Param("id") Long id);
	
	@Query("select max(q.Quit_numero)"
			+ " from Quittance q"
			+ " where  q.Quit_numeropolice = :numpol "
			)
	Long getMaxNumQuitByPolice(@Param("numpol") Long a);
	
	@Query("select max(q)"
			+ " from Quittance q"
			+ " where  q.Quit_numeropolice = :numpol "
			)
	Quittance getDerniereQuitByPolice(@Param("numpol") Long a);
	
	@Query("select q from Quittance q where q.active = 1 and q.Quit_numeropolice = :id ORDER BY q.quit_id ASC")
	List<Quittance> findQuittancebyPolice(@Param("id") Long id);
	
	@Query("select q from Quittance q where q.active = 1 and q.quit_typeecriture='emission' and q.Quit_Facture = :numfact")
	Quittance findbyPolice(@Param("numfact") Long id);

	@Query("select q from Quittance q where q.active = 1 and q.quit_id = :id")
	Quittance findbyPolice2(@Param("id") Long id);
	
	@Query("select q.quit_id from Quittance q where q.active = 1 and q.quit_typeecriture='emission' and q.Quit_Facture = :numfact")
	Long findbyid2(@Param("numfact") Long id);

//	@Query(nativeQuery = true,
//			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
//					+ "from Quittance quit, Intermediaire interm "
//					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
//					+ "and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
//					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
//					+ "order by quit.quit_numero")
//	List<EmissionConsultation> allEmissionConsultation();
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "order by quit.quit_numerointermedaire")
	List<EmissionConsultation> allEmissionConsultation();
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, "
					+ "quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, "
					+ "quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, "
					+ "quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, "
					+ "quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numerointermedaire")
	List<EmissionConsultation> allEmissionConsultationByPeriode(@Param("date_debut") String date_debut, @Param("date_fin") String date_fin);

	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_numeropolice=poli.poli_numero "
					+ "and quit.active = 1 and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and poli.poli_codeproduit =:numProd "
					+ "order by quit.quit_numerointermedaire")
	List<EmissionConsultation> allEmissionConsultationByProduit(@Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and quit.quit_numerointermedaire =:numInterm "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionConsultationByIntermediaire(@Param("numInterm") Long numInterm);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and  quit.quit_numeropolice=poli.poli_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and quit.quit_numerointermedaire =:numInterm and poli.poli_codeproduit =:numProd and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numerointermedaire")
	List<EmissionConsultation> allEmissionConsultationByAllCriteres(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and  quit.quit_numeropolice=poli.poli_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and poli.poli_codeproduit =:numProd and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numerointermedaire")
	List<EmissionConsultation> allEmissionConsultationByPeriodeAndProduit(@Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and quit.quit_numerointermedaire =:numInterm and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numerointermedaire")
	List<EmissionConsultation> allEmissionConsultationByPeriodeAndIntermediaire(@Param("numInterm") Long numInterm, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_numeropolice=poli.poli_numero "
					+ "and quit.active = 1 and quit.quit_dateencaissament IS NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and quit.quit_numerointermedaire =:numInterm and poli.poli_codeproduit =:numProd "
					+ "order by quit.quit_numerointermedaire")
	List<EmissionConsultation> allEmissionConsultationByProduitAndIntermediaire(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd);
	
	
	// Les methodes suivantes servent à lister les emissions annulées
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_typologieannulation, caf.libelle, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, code_annulation_facture caf "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_typologieannulation = caf.id "
					+ "and quit.active = 1 "
					+ "and quit.quit_typeecriture LIKE 'Quittance annulée' "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionsAnnuleesConsultation();
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_typologieannulation, caf.libelle, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, code_annulation_facture caf "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_typologieannulation = caf.id "
					+ "and quit.active = 1 "
					+ "and quit.quit_typeecriture LIKE 'Quittance annulée' "
					+ "and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionsAnnuleesConsultationByPeriode(@Param("date_debut") String date_debut, @Param("date_fin") String date_fin);

	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_typologieannulation, caf.libelle, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli, code_annulation_facture caf "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_numeropolice=poli.poli_numero "
					+ "and quit.quit_typologieannulation = caf.id "
					+ "and quit.active = 1 "
					+ "and quit.quit_typeecriture LIKE 'Quittance annulée' and poli.poli_codeproduit =:numProd "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionsAnnuleesConsultationByProduit(@Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_typologieannulation, caf.libelle, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, code_annulation_facture caf "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_typologieannulation = caf.id "
					+ "and quit.active = 1 "
					+ "and quit.quit_typeecriture LIKE 'Quittance annulée' "
					+ "and quit.quit_numerointermedaire =:numInterm "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionsAnnuleesConsultationByIntermediaire(@Param("numInterm") Long numInterm);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_typologieannulation, caf.libelle, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli, code_annulation_facture caf "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_numeropolice=poli.poli_numero "
					+ "and quit.quit_typologieannulation = caf.id "
					+ "and quit.active = 1 "
					+ "and quit.quit_typeecriture LIKE 'Quittance annulée' "
					+ "and poli.poli_codeproduit =:numProd "
					+ "and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionsAnnuleesConsultationByPeriodeAndProduit(@Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_typologieannulation, caf.libelle, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, code_annulation_facture caf "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_typologieannulation = caf.id "
					+ "and quit.active = 1 "
					+ "and quit.quit_typeecriture LIKE 'Quittance annulée' "
					+ "and quit.quit_numerointermedaire =:numInterm "
					+ "and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionsAnnuleesConsultationByPeriodeAndIntermediaire(@Param("numInterm") Long numInterm, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_typologieannulation, caf.libelle, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli, code_annulation_facture caf "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_numeropolice=poli.poli_numero "
					+ "and quit.quit_typologieannulation = caf.id "
					+ "and quit.active = 1 "
					+ "and quit.quit_typeecriture LIKE 'Quittance annulée' "
					+ "and quit.quit_numerointermedaire =:numInterm and poli.poli_codeproduit =:numProd "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionsAnnuleesConsultationByProduitAndIntermediaire(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd);
	
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_typologieannulation, caf.libelle, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli, code_annulation_facture caf "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_numeropolice=poli.poli_numero "
					+ "and quit.quit_typologieannulation = caf.id "
					+ "and quit.active = 1 "
					+ "and quit.quit_typeecriture LIKE 'Quittance annulée' "
					+ "and quit.quit_numerointermedaire =:numInterm and poli.poli_codeproduit =:numProd "
					+ "and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numero")
	List<EmissionConsultation> allEmissionsAnnuleesConsultationByAllCriteres(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	
	
	// ========================== Les methodes suivantes servent à lister les productions ======================
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NOT NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "order by quit.quit_numero")
	List<ProductionConsultation> allProductionConsultation();
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, "
					+ "quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, "
					+ "quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, "
					+ "quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, "
					+ "quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NOT NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numero")
	List<ProductionConsultation> allProductionConsultationByPeriode(@Param("date_debut") String date_debut, @Param("date_fin") String date_fin);

	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.quit_numeropolice=poli.poli_numero "
					+ "and quit.active = 1 and quit.quit_dateencaissament IS NOT NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and poli.poli_codeproduit =:numProd "
					+ "order by quit.quit_numero")
	List<ProductionConsultation> allProductionConsultationByProduit(@Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NOT NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and quit.quit_numerointermedaire =:numInterm "
					+ "order by quit.quit_numero")
	List<ProductionConsultation> allProductionConsultationByIntermediaire(@Param("numInterm") Long numInterm);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and  quit.quit_numeropolice=poli.poli_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NOT NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and poli.poli_codeproduit =:numProd and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numero")
	List<ProductionConsultation> allProductionConsultationByPeriodeAndProduit(@Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NOT NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and quit.quit_numerointermedaire =:numInterm and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numero")
	List<ProductionConsultation> allProductionConsultationByPeriodeAndIntermediaire(@Param("numInterm") Long numInterm, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and  quit.quit_numeropolice=poli.poli_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NOT NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and quit.quit_numerointermedaire =:numInterm and poli.poli_codeproduit =:numProd "
					+ "order by quit.quit_numero")
	List<ProductionConsultation> allProductionConsultationByProduitAndIntermediaire(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd);
	
	
	@Query(nativeQuery = true,
			value="select quit.quit_numero, quit.quit_facture, quit.quit_numeropolice, interm.inter_denomination, quit.quit_typequittance, quit.quit_typeecriture, quit.quit_dateemission, quit.quit_datecomotable, quit.quit_dateeffet, quit.quit_dateecheance, quit.quit_primenette, quit.quit_commissionsapporteur1, quit.quit_accessoirecompagnie, quit.quit_accessoireapporteur, quit.quit_tauxte, quit.quit_mtntaxete, quit.quit_primettc, quit.quit_mntprimencaisse "
					+ "from Quittance quit, Intermediaire interm, Police poli "
					+ "where quit.quit_numerointermedaire = interm.inter_numero and  quit.quit_numeropolice=poli.poli_numero and quit.active = 1 "
					+ "and quit.quit_dateencaissament IS NOT NULL and quit.quit_numeroquittanceannul IS NULL "
					+ "and (quit.quit_typeecriture LIKE 'emission' OR quit.quit_typeecriture LIKE 'ristourne') "
					+ "and quit.quit_numerointermedaire =:numInterm and poli.poli_codeproduit =:numProd and CAST(quit.quit_dateemission AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "order by quit.quit_numero")
	List<ProductionConsultation> allProductionConsultationByAllCriteres(@Param("numInterm") Long numInterm, @Param("numProd") Long numProd, @Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
}
