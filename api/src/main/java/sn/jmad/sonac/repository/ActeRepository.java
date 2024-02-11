package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Clause;

public interface ActeRepository  extends JpaRepository<Acte, Long>{
	
	@Query("from Acte act ORDER BY  act.act_numeropolice ")
	List<Acte> allActes();
	
	@Query("select act from Acte act where act.act_numero= :code")
	Acte findbyCode(@Param("code") Long code);
	
	@Query("select act from Acte act where act.act_numeropolice= :numpol")
	Acte getActePolice(@Param("numpol") Long numpol);
	
	
	@Query("SELECT c FROM Clause c where exists"
			+ "(select cl from ClauseActe cl where cl.clact_numeroclause=c.cla_numeroclause and cl.clact_numeroacte= :code)")
	List<Clause> allClausebyActe(@Param("code") Long code);
	@Query("SELECT c FROM Clause c where not exists"
			+ "(select cl from ClauseActe cl where cl.clact_numeroclause=c.cla_numeroclause and cl.clact_numeroacte= :code)")
	List<Clause> allClauseNoActe(@Param("code") Long code);
	
	@Query("select max(a.act_numero) from Acte a where a.act_numeropolice=:police")
	Integer lastIdgActe(@Param("police") Long police);

	@Query("select act from Acte act where act.act_numeropolice=:num")
	List<Acte> findActeByNumero(@Param("num") long num);
	
	@Query("select max(a.act_numero) from Acte a where a.act_numeropolice=:police")
	Long lastIdgActeByPolice(@Param("police") Long police);
	
}
 