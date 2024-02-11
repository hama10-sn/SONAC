package sn.jmad.sonac.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Moratoire;
import sn.jmad.sonac.model.Recours;

public interface MoratoireRepository extends JpaRepository<Moratoire, Long> {
	@Query("select Max(m) from Moratoire m where m.morato_sini =:morato_sini")
	Moratoire findMoratoireBySinistre(@Param("morato_sini") Long morato_sini);
	
	@Query("select m from Moratoire m where m.morato_mvt =:morato_mvt")
	Moratoire getMoratoireByMvt(@Param("morato_mvt") Long morato_mvt);
	
	@Query("select m from Moratoire m where m.morato_numchq =:morato_numchq")
	Moratoire existingChequeNumber(@Param("morato_numchq") String morato_numchq);
	
	@Modifying
	@Query("update Moratoire m set m.morato_penalit =:morato_penalit, m.morato_datemo =:morato_datemo where m.morato_id =:morato_id")
	void updateMoratoirePenalite(@Param("morato_penalit") Long morato_penalit, @Param("morato_datemo") Date morato_datemo, @Param("morato_id") Long morato_id);
}
