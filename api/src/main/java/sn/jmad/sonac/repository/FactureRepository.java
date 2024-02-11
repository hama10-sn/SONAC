package sn.jmad.sonac.repository;

import sn.jmad.sonac.message.response.IntermediaireCom;
import sn.jmad.sonac.model.Encaissement;
import sn.jmad.sonac.model.Facture;

import java.util.Date;
import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
	
	@Query(
			"select facture"
				+ " from Facture facture"
				+ " where facture.fact_numacte = :id"
		)
	Optional<Facture> findByNum(@Param("id") Long fact_numacte);
	@Query(
			"select facture.fact_numeroacte"
				+ " from Facture facture"
				+ " where facture.fact_numacte = :id"
		)
	Long findByNumFacture(@Param("id") Long fact_numacte);
	@Query("select facture"
			+ " from Facture facture"
			+ " where facture.active = 1 and fact_etatfacture = 'V' ORDER BY facture.fact_numacte DESC"
			)
	List<Facture> allFactures();
	@Query("select facture"
			+ " from Facture facture"
			+ " where facture.active = 1 and facture.fact_numeropolice = :numpol and fact_etatfacture IN('V','S','AC') ORDER BY facture.fact_numacte"
			)
	List<Facture> allFacturesPolice(@Param("numpol") Long a);
	@Query("select facture"
			+ " from Facture facture"
			+ " where facture.active = 1 and facture.fact_numeropolice = :numpol and fact_etatfacture IN('V','AC') ORDER BY facture.fact_numacte"
			)
	List<Facture> allFacturesPoliceaEnc(@Param("numpol") Long a);
	@Query("select facture"
			+ " from Facture facture"
			+ " where facture.active = 1 and facture.fact_numeropolice = :numpol and fact_etatfacture ='A' ORDER BY facture.fact_numacte"
			)
	List<Facture> allFacturesAnnulPolice(@Param("numpol") Long a);
	
	@Query("select facture"
			+ " from Facture facture"
			+ " where facture.active = 1 and fact_etatfacture ='A' ORDER BY facture.fact_numacte"
			)
	List<Facture> allFacturesAnnul();
	
	@Query("select facture"
			+ " from Facture facture"
			+ " where facture.active = 1 and fact_etatfacture IN('S','AC') ORDER BY facture.fact_numacte"
			)
	List<Facture> allFacturesEnProd();
	
	@Query("select facture"
			+ " from Facture facture"
			+ " where facture.active = 1 and facture.fact_numerosouscripteurcontrat = :numcli and  fact_etatfacture IN('V','AC') ORDER BY facture.fact_numacte"
			)
	List<Facture> allFacturesClient(@Param("numcli") Long a);
	@Query("select facture"
			+ " from Facture facture,Quittance quittance "
			+ " where facture.fact_numeroquittance = quittance.Quit_numero and facture.active = 1 and quittance.quit_numerointermedaire = :numInter and  fact_etatfacture IN('V','AC') ORDER BY facture.fact_numacte"
			)
	List<Facture> allFacturesIntermediare(@Param("numInter") Long a);
	
	@Query(nativeQuery = true,
			value="select facture.* "
			+ "from Quittance quittance,Facture facture left join payer_commission pc on facture.fact_numacte = pc.pcom_numfact "
			+ "where facture.fact_numeroquittance = quittance.Quit_numero "
			+ "and facture.active = 1 and quittance.active = 1 and quittance.quit_numerointermedaire = :numInter "
			+ "and  fact_etatfacture = 'S' and pc.pcom_numfact is null "
			+ "and quittance.quit_dateencaissament between :date_debut and :date_fin "
			+ "ORDER BY facture.fact_numacte"
			)
	List<Facture> allFacturesIntermediarePeriode(@Param("numInter") Long a,@Param("date_debut") Date debut,@Param("date_fin") Date fin);
	
	@Query(nativeQuery = true,
			value = "select quittance.quit_numerointermedaire ,inter.inter_denomination,  SUM(facture.fact_commissionapporteur) as somCommission "
					+ "from intermediaire inter,Quittance quittance , Facture facture left join payer_commission pc on facture.fact_numacte = pc.pcom_numfact "
					+ "where facture.fact_numeroquittance = quittance.Quit_numero "
					+ "and quittance.quit_numerointermedaire = inter.inter_numero "
					+ "and facture.active = 1 "
					+ "and quittance.active = 1 "
					+ "and  fact_etatfacture = 'S' and pc.pcom_numfact is null "
					+ "and quittance.quit_dateencaissament between :date_debut and :date_fin "
					+ "group by quittance.quit_numerointermedaire,inter.inter_denomination")
	List<IntermediaireCom> allFacturesAllIntermediarePeriode(@Param("date_debut") Date debut,@Param("date_fin") Date fin);
	
	
	/*
	@Query("from Encaissement en where en.active = 1 and en.encai_numerofacture = :numfact order by en.encai_id DESC")
	List<Encaissement> allEncaissementsFacture(@Param("numfact") Long a);
	*/
	
	@Query("from Encaissement en where en.active = 1 and en.encai_numerofacture = :numfact and en.encai_codeannulation IS NULL order by en.encai_id DESC")
	List<Encaissement> allEncaissementsFacture(@Param("numfact") Long a);
	
	@Query("select max(facture)"
			+ " from Facture facture"
			+ " where  facture.fact_numeropolice = :numpol "
			)
	Facture getMaxNumFactureByPolice(@Param("numpol") Long a);
	
	@Query("select max(facture.fact_numacte)"
			+ " from Facture facture"
			+ " where  facture.fact_numeropolice = :numpol "
			)
	Long getMaxNumFacByPolice(@Param("numpol") Long a);
	
}