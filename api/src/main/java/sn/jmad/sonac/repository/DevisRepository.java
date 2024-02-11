package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Commission;
import sn.jmad.sonac.model.Devis;


@Repository
public interface DevisRepository extends JpaRepository<Devis, Integer> {
	
	@Query("from Devis dv where dv.active=1")
	List<Devis> allDevis();
	
	@Query("from Devis dv where dv.devis_souscripteur=:numeroClient")
	List<Devis> allDevisByClient(@Param("numeroClient") int num);
	
	@Query("select dv from Devis dv where dv.devis_numero= :numero")
	Devis findbyNumero(@Param("numero") int num);
	
	@Query("select dev from Devis dev where dev.active = 1 and dev.devis_branche = :num")
    List<Devis> findbyBranche(@Param("num") long num);

}
