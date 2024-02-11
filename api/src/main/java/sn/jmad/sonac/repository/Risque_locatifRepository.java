package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Risque_locatif;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface Risque_locatifRepository extends JpaRepository<Risque_locatif, Long>{

	@Query("select r from Risque_locatif r where r.riskl_numero = :id")
	Risque_locatif findByIdd(@Param("id") Long id);
	
	@Query("select r from Risque_locatif r where r.riskl_numeropolice = :numpol")
	List<Risque_locatif> findByPolice(@Param("numpol") Long numpol);
	
	
	@Query("select r from Risque_locatif r where r.riskl_codeutilisateur = :id")
    List<Risque_locatif> findByCodeUser(@Param("id") String type);
	
	@Query("select r from Risque_locatif r  order by r.riskl_numero desc")
    List<Risque_locatif> allRisque_locatifs();
	
	@Query("select r from Risque_locatif r where r.riskl_type = :type")
    List<Risque_locatif> findbyType(@Param("type") String type);
    
    @Query("select r from Risque_locatif r where r.riskl_numeroclient =:client and r.riskl_numeroacheteur =:acheteur")
    List<Risque_locatif> findRisqueLocatifByClientAndAcheteur(@Param("client") Long client, @Param("acheteur") Long acheteur);
    
    @Query("select r from Risque_locatif r where r.riskl_numeroclient =:client and r.riskl_numeropolice =:police and r.riskl_numeroacheteur =:acheteur")
    List<Risque_locatif> findRisqueLocatifByClientAndPoliceAndAcheteur(@Param("client") Long client, @Param("police") Long police, @Param("acheteur") Long acheteur);
	
}
