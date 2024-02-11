package sn.jmad.sonac.repository;


import sn.jmad.sonac.model.Dem_Pers;
import sn.jmad.sonac.model.Dem_Soc;

import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface DemSocRepository extends JpaRepository<Dem_Soc, Long> {
	//@Query("from Dem_Soc dem_Soc ORDER BY dem_Soc.dem_socnum")
	//List<Dem_Soc> findAllDem_Soc();
    
	@Query("select dem_Soc"
			+ " from Dem_Soc dem_Soc"
			+ " where  dem_Soc.actif = :id ORDER BY dem_Soc.dem_socnum"
			)//dem_Soc.dem_statut = 'validé pour arbitrage' and
	List<Dem_Soc> findAllDem_Soc(@Param("id") int a);
	@Query(
			"select dem"
				+ " from Dem_Soc dem"
				+ " where dem.dem_socnum = :id AND dem.dem_statut = 'validé pour arbitrage' "
		)
	Optional<Dem_Soc> findByNum(@Param("id") Long dem_socnum);
	
	@Query("from Dem_Soc demsoc where demsoc.dem_clienttitulaire =:num and actif=1")
	List<Dem_Soc> findDemandeSocByProspect(@Param("num") Integer num);
	

	@Query("from Dem_Soc demsoc where demsoc.dem_clienttitulaire =:num and actif=1")
	List<Dem_Soc> findDemandeSocByClient(@Param("num") Integer num);
	
	@Query(
			"select dem "
				+ " from Dem_Soc dem"
				+ " where dem.dem_statut = 'contrat à émettre' and dem.actif = :id ORDER BY dem.dem_socnum"
		)
	List<Dem_Soc> findDemPreEmission(@Param("id") int a);
    
}