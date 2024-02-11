package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.DonneurOrdre;

public interface DonneurOrdreRepository extends JpaRepository<DonneurOrdre, Long>{
	
	@Query("from DonneurOrdre dondr ORDER BY  dondr.dordr_id ")
	List<DonneurOrdre> allDonneurOrdres();
	
	@Query("select dondr from DonneurOrdre dondr where dondr.dordr_numerodordr= :code")
	DonneurOrdre findbyCode(@Param("code") Long code);
}
