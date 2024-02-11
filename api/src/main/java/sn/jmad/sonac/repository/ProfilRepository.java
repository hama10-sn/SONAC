package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Profil;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long>{

	@Query("select profil from Profil profil where profil.id = :id")
	Profil findByIdd(@Param("id") Long id);
	
	@Query("select profil from Profil profil order by profil.nom")
	List<Profil> findAllByOrder();
	
	@Query("select profil from Profil profil where UPPER(profil.nom) = :id")
	Profil findByNom(@Param("id") String id);
	
	@Query("select profil.autorisation from Profil profil where profil.nom = :id")
	String findauth(@Param("id") String id);

	@Query("select profil from Profil profil where profil.autorisation like %:id%")
	Profil findByAutorisation(@Param("id") String id);
	
	@Query("select profil from Profil profil, Utilisateur u where UPPER(profil.nom) = :id and UPPER(u.util_profil) = UPPER(profil.nom)")
	List<Profil> checkByNom(@Param("id") String id);
	
}
