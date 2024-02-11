package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Marche;

public interface MarcheRepository extends JpaRepository<Marche, Long>{
	
	@Query("from Marche m ORDER BY  m.march_id ")
	List<Marche> allMarches();
	
	@Query("select m from Marche m where m.march_numero= :code")
	Marche findbyCode(@Param("code") Long code);
	
	@Query("select m from Marche m where m.march_numeroacte= :code")
	Marche findbyActe(@Param("code") Long code);
	
	
}
