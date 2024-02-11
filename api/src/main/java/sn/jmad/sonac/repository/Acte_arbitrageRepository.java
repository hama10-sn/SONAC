package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.jmad.sonac.model.Acte_arbitrage;

@Repository
public interface Acte_arbitrageRepository extends JpaRepository<Acte_arbitrage,Long>{

	@Query("select acte from Acte_arbitrage acte where acte.acte_dem_num=:actedemnum and acte.acte_type_dem = :actetypedem and acte.acte_type_prod = :actetypeprod")
	List<Acte_arbitrage> findByNumDamandeTypeDemandeTypeProduit(@Param("actedemnum") Long actedemnum,@Param("actetypedem") String actetypedem,@Param("actetypeprod") String actetypeprod);
	
	@Query("select acte from Acte_arbitrage acte where acte.acte_dem_num=:actedemnum and acte.acte_type_dem = :actetypedem")
	List<Acte_arbitrage> findByNumDamandeTypeDemande(@Param("actedemnum") Long actedemnum,@Param("actetypedem") String actetypedem);
}
