package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Risque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface RisqueRepository extends JpaRepository<Risque, Long>{

	@Query("select r from Risque r where r.risq_numero = :id")
	Risque findByIdd(@Param("id") Long id);
	
	@Query("select r from Risque r where r.risq_codeutilisateur = :id")
    List<Risque> findByCodeUser(@Param("id") String type);
	
	@Query("select r from Risque r where r.risq_status = :id order by r.risq_numero desc")
    List<Risque> allRisques(@Param("id") String a);
	
	@Query("select r from Risque r where r.risq_status = 'Actif' and r.risq_typerisque = :type")
    List<Risque> findbyType(@Param("type") String type);
	
	@Query("select r from Risque r where r.risq_numeropolice = :numpol")
	Risque getRisquePolice(@Param("numpol") Long numpol);
	
}
