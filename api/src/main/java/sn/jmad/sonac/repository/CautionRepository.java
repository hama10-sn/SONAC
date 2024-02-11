package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Caution;
import sn.jmad.sonac.model.Encaissement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CautionRepository extends JpaRepository<Caution, Long>{

	@Query("from Caution c where c.produit_id = :numprod and c.type = :type")
	Caution getCaution(@Param("numprod") Long numprod,@Param("type") int type);
	
	
}
