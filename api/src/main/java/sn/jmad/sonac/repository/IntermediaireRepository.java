package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Branche;

import sn.jmad.sonac.model.Civilite;

import sn.jmad.sonac.model.Intermediaire;
import sn.jmad.sonac.model.Utilisateur;

@Repository
public interface IntermediaireRepository extends JpaRepository<Intermediaire, Long>{
	
	@Query("from Intermediaire inter where inter.active = 1 ORDER BY inter.inter_numero")
	List<Intermediaire> findAllIntermediaire();
	
	@Query("select inter from Intermediaire inter where inter.inter_numero=:num")
	Intermediaire findbyCode(@Param("num") long num);
	
	@Query("select inter  from Intermediaire inter where  UPPER(inter.inter_denomination) LIKE CONCAT('%',UPPER(:inter_denomination),'%')")
	List<Intermediaire> findIntermediaireByDenomination(@Param("inter_denomination") String inter_denomination);

	
	
	@Query("SELECT inter FROM Intermediaire inter WHERE inter.inter_email  LIKE :inter_email ESCAPE '\\@'")
	List<Intermediaire> findByMail2(@Param("inter_email") String inter_email);
	

	@Query("select inter from Intermediaire inter where LOWER(inter.inter_email)  LIKE CONCAT('%',LOWER(:inter_email),'%')")
	List<Intermediaire> findByMail(@Param("inter_email") String inter_email);
	
	@Query("select inter from Intermediaire inter where inter.active=1 and inter.inter_type = 'courtier' and inter.inter_numagrement=:inter_numagrement")
	Intermediaire findByNumeroAgrementAvectypeCourtier(@Param("inter_numagrement") String inter_numagrement);
	
	@Query("select inter from Intermediaire inter where inter.active=1 and inter.inter_telephone1 = :inter_telephone1")
	Intermediaire findByTelephone1(@Param("inter_telephone1") String inter_telephone1);
}
