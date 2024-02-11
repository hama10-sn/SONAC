package sn.jmad.sonac.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Penalite;
import sn.jmad.sonac.model.Recours;

public interface PenaliteRepository extends JpaRepository<Penalite, Long> {
	@Query("select p from Penalite p where p.penalit_morat =:penalit_morat")
	Penalite findPenaliteByMoratoire(@Param("penalit_morat") Long penalit_morat);
	
	@Query("select p from Penalite p where p.penalit_mvt =:penalit_mvt")
	Penalite getPenaliteByMvt(@Param("penalit_mvt") Long penalit_mvt);
	
	@Query("select p from Penalite p where p.penalit_numchq =:penalit_numchq")
	Penalite existingChequeNumber(@Param("penalit_numchq") String penalit_numchq);
}
