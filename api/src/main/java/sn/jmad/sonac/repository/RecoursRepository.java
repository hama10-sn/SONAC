package sn.jmad.sonac.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Recours;

@Repository
public interface RecoursRepository extends JpaRepository<Recours, Long> {
	@Query("select r from Recours r where r.recou_mvt =:recou_mvt")
	Recours getRecoursByMvt(@Param("recou_mvt") Long recou_mvt);
	
	@Query("select r from Recours r where r.recou_numchq =:recou_numchq")
	Recours existingChequeNumber(@Param("recou_numchq") String recou_numchq);
}
