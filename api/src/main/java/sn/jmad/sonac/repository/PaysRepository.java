package sn.jmad.sonac.repository;


import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Dem_Soc;
import sn.jmad.sonac.model.Pays;
import sn.jmad.sonac.model.Utilisateur;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface PaysRepository extends JpaRepository<Pays, Long> {
	@Query(
			"select pays"
				+ " from Pays pays"
				+ " where pays.pays_libellelong = :id"
		)
	Optional<Pays> findByLibelle(@Param("id") String pays_libellelong);
	/*
	@Query("select categorie"
			+ " from Categorie categorie"
			+ " where categorie.categ_numero = :id")
	Optional<Categorie> findByNumCat(@Param("id") int categ_numero);
    
	
	@Query("select pays"
			+ " from Pays pays"
			+ " where pays.pays_code = :id")
	Pays findByCodePays(@Param("id") int pays_code);*/

	@Query("select pays.pays_libellelong"
			+ " from Pays pays"
			+ " where pays.pays_code = :id")
	String findByCode(@Param("id") Long pays_code);

	@Query("from Pays pays ORDER BY pays.pays_id")
	List<Pays> findAllPays();
    
}