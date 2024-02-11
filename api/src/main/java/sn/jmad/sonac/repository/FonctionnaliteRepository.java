package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Fonctionnalite;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface FonctionnaliteRepository extends JpaRepository<Fonctionnalite, Long>{

	@Query("select fonctionnalite from Fonctionnalite fonctionnalite where fonctionnalite.id = :id")
	Fonctionnalite findByIdd(@Param("id") Long id);
	
	@Query("select fonctionnalite from Fonctionnalite fonctionnalite where fonctionnalite.entite = :id")
	Fonctionnalite findByNom(@Param("id") String id);
	

	@Query("select fonctionnalite from Fonctionnalite fonctionnalite order by fonctionnalite.entite")
	List<Fonctionnalite> findAllfonct();
	
}
