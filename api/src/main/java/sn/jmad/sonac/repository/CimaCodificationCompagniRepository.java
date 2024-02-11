package sn.jmad.sonac.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Cimacodificationcompagnie;
import sn.jmad.sonac.model.Civilite;


public interface CimaCodificationCompagniRepository extends JpaRepository<Cimacodificationcompagnie, Long> {

	@Query("from Cimacodificationcompagnie cima ORDER BY cima.id")
	List<Cimacodificationcompagnie> findAllCima();
	
	@Query("select cima.code_cima_compagnie"
			+ " from Cimacodificationcompagnie cima"
			+ " where cima.id = :code")
	String findByCode(@Param("code") Long code);
	
	@Query(
			"select cima"
				+ " from Cimacodificationcompagnie cima"
				+ " where cima.code_cima_compagnie = :id"
		)
	Cimacodificationcompagnie findByLibelle(@Param("id") String code_cima_compagnie);
}

