package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Avenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface AvenantRepository extends JpaRepository<Avenant, Long>{

	@Query("select r from Avenant r where r.aven_numeroavenant = :id")
	Avenant findByIdd(@Param("id") Long id);
	
	@Query("select r from Avenant r where r.aven_utilisateur = :id")
    List<Avenant> findByCodeUser(@Param("id") String type);
	
	@Query("select r from Avenant r where r.aven_statut = :id order by r.aven_numeroavenant desc")
    List<Avenant> allAvenants(@Param("id") String a);
	
	@Query("select r from Avenant r where r.aven_statut = 'A' and r.aven_typecontrat = :type")
    List<Avenant> findbyTypeContrat(@Param("type") String type);
	
	@Query("select max(p.aven_numeroavenant) from Avenant p where p.aven_numeropolice=:numpolice")
	Long lastNumAvenant(@Param("numpolice") Long numpolice);
	
}
