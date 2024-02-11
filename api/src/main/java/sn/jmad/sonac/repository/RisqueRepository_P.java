package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Risque;
import sn.jmad.sonac.model.Risque_P;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface RisqueRepository_P extends JpaRepository<Risque_P, Long>{

	@Query("select r from Risque_P r where r.risq_numero = :id")
	Risque_P findByIdd(@Param("id") Long id);
	
	@Query("select r from Risque_P r where r.risq_codeutilisateur = :id")
    List<Risque_P> findByCodeUser(@Param("id") String type);
	
	@Query("select r from Risque_P r where r.risq_status = :id order by r.risq_numero desc")
    List<Risque_P> allRisque_Ps(@Param("id") String a);
	
	@Query("select r from Risque_P r where r.risq_status = 'Actif' and r.risq_typerisque = :type")
    List<Risque_P> findbyType(@Param("type") String type);
	
	@Query("select r from Risque_P r where r.risq_numeropolice = :numpol")
	Risque_P getRisque_PPolice(@Param("numpol") Long numpol);
	
}
