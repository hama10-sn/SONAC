package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Risque_reglementes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface Risque_reglementesRepository extends JpaRepository<Risque_reglementes, Long>{

	@Query("select r from Risque_reglementes r where r.riskr_numero = :id")
	Risque_reglementes findByIdd(@Param("id") Long id);
	
	 
	@Query("select r from Risque_reglementes r where r.riskr_numeropolice = :numpol")
	Risque_reglementes findByPolice(@Param("numpol") Long numpol);
	
	@Query("select r from Risque_reglementes r where r.riskr_codeutilisateur = :id")
    List<Risque_reglementes> findByCodeUser(@Param("id") String type);
	
	@Query("select r from Risque_reglementes r order by r.riskr_numero desc")
    List<Risque_reglementes> allRisque_reglementes();
	
	@Query("select r from Risque_reglementes r where r.riskr_type = :type")
    List<Risque_reglementes> findbyType(@Param("type") String type);
	
}
