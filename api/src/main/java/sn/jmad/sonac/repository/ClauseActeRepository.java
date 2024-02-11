package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.ClauseActe;

public interface ClauseActeRepository extends JpaRepository<ClauseActe, Long>{
	@Query("from ClauseActe c ORDER BY  c.clact_id ")
	List<ClauseActe> allClauseActes();
	
	@Query("select c from ClauseActe c where c.clact_id= :code")
	ClauseActe findbyCode(@Param("code") Long code);
	
	@Query("select clA from ClauseActe clA where clA.clact_numeroacte= :numacte")
	ClauseActe getClauseActeByActe(@Param("numacte") Long numacte);
}