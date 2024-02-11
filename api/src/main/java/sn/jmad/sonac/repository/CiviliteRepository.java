package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Civilite;

import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CiviliteRepository extends JpaRepository<Civilite, Long> {
	
	@Query(
			"select civilite"
				+ " from Civilite civilite"
				+ " where civilite.civ_libellelong = :id"
		)
	Optional<Civilite> findByLibelle(@Param("id") String pays_libellelong);
    
	@Query("from Civilite civilite ORDER BY civilite.civ_code")
	List<Civilite> findAllCivilite();
	
	@Query("select civilite from Civilite civilite where civilite.civ_nature =:num order by civ_code")
	List<Civilite> findAllCiviliteByNature(@Param("num") int a);
}