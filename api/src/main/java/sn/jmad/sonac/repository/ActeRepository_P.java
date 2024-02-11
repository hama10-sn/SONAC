package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Acte_P;

import sn.jmad.sonac.model.Clause;

public interface ActeRepository_P  extends JpaRepository<Acte_P, Long>{
	
	@Query("from Acte_P act ORDER BY  act.act_numeropolice ")
	List<Acte_P> allActe_Ps();
	
	@Query("select act from Acte_P act where act.act_numero= :code")
	Acte_P findbyCode(@Param("code") Long code);
	
	@Query("select act from Acte_P act where act.act_numeropolice= :numpol")
	Acte_P getActe_PPolice(@Param("numpol") Long numpol);
	
	
	

	@Query("select act from Acte_P act where act.act_numeropolice=:num")
	List<Acte_P> findActe_PByNumero(@Param("num") long num);

}
 