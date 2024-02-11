package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Marche;
import sn.jmad.sonac.model.Marche_P;

public interface MarcheRepository_P extends JpaRepository<Marche_P, Long>{
	
	
	@Query("from Marche_P m ORDER BY  m.march_id ")
	List<Marche_P> allMarche_Ps();
	
	@Query("select m from Marche_P m where m.march_numero= :code")
	Marche_P findbyCode(@Param("code") Long code);
	
	@Query("select m from Marche_P m where m.march_numeroacte= :code")
	Marche_P findbyActe(@Param("code") Long code);
	
}
