package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.message.response.PoliceProduit;
import sn.jmad.sonac.model.Clause;

public interface ClauseRepository extends JpaRepository<Clause, Long> {
	@Query("from Clause c ORDER BY  c.cla_numeroclause ")
	List<Clause> allClauses();
	
	@Query("select c from Clause c where c.cla_numeroclause= :code")
	Clause findbyCode(@Param("code") Long code);
	

	@Query(nativeQuery = true,
			value="select poli.poli_numero, poli.poli_codeproduit, prod.prod_denominationcourt, prod.prod_denominationlong, prod.prod_numerobranche "
					+ "from acte act, police poli, produit prod "
					+ "where act.act_numeropolice=poli.poli_numero "
					+ "AND poli.poli_codeproduit= prod.prod_numero"
					+ "AND act.act_numeropolice =:numPolice ")
	PoliceProduit findProduitByActe(@Param("numPolice") Long numPolice);
/*
 * Long getPoli_numero();
	
	Long getPoli_codeproduit();

	String getProd_denominationcourt();
	
	String getProd_denominationlong();
	
	Long getProd_numerobranche();
	SELECT act.act_numero, act.act_numeropolice,poli.poli_numero,poli.poli_codeproduit,prod.prod_numero, prod.prod_denominationcourt 
	FROM acte act, police poli, produit prod 
	where act.act_numeropolice=poli.poli_numero 
	AND poli.poli_codeproduit= prod.prod_numero 
	AND act.act_numeropolice=2;
	*/
}
