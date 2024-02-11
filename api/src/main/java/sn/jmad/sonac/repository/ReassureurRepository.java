package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Contact;
import sn.jmad.sonac.model.Pays;

//import java.util.Optional;

import sn.jmad.sonac.model.Reassureur;
import sn.jmad.sonac.model.Role;
import sn.jmad.sonac.model.RoleName;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ReassureurRepository extends JpaRepository<Reassureur, Long> {
	@Query(
			"select reassureur"
				+ " from Reassureur reassureur"
				+ " where reassureur.reass_code = :id"
		)
	Optional<Reassureur> findBycode(@Param("id") Long reass_code);
	
	@Query("select reassureur"
			+ " from Reassureur reassureur"
			+ " where reassureur.active = :id ORDER BY reassureur.reass_code"
			)
	List<Reassureur> allReassureurs(@Param("id") int a);

	
}