package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Typage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface TypageRepository extends JpaRepository<Typage, Long>{

	@Query("select typage from Typage typage where typage.typ_id = :id")
	Typage findByIdd(@Param("id") Long id);
	
	@Query("select typage from Typage typage where typage.typ_type = :id")
	
    List<Typage> findByType(@Param("id") String type);
	
}
