package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Cima;
import sn.jmad.sonac.model.Commission;
import sn.jmad.sonac.model.Pays;

import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CimaRepository extends JpaRepository<Cima, Long> {
	
	@Query(
			"select cima"
				+ " from Cima cima"
				+ " where cima.cim_code = :id"
		)
	Optional<Cima> findBycode(@Param("id") String cim_code);
	@Query("from Cima cima ORDER BY cima.id")
	List<Cima> findAllCima();
}