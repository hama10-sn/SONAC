package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Mvtsinistre;

@Repository
public interface MvtsinistreRepository extends JpaRepository<Mvtsinistre, Long> {

	@Query("select Mvtsinistre from Mvtsinistre Mvtsinistre where Mvtsinistre.mvts_num = :num")
	Mvtsinistre findMvtsinistreByNumero(@Param("num") Long num);
	
	@Query("select Max(m) from Mvtsinistre m where m.mvts_numsinistre =:mvts_numsinistre AND m.mvts_typemvt =:mvts_typemvt group by m.mvts_num")
	Mvtsinistre findMvtsinistreByTypeMvtsAndSinistre(@Param("mvts_numsinistre") Long mvts_numsinistre, @Param("mvts_typemvt") Long mvts_typemvt);

	@Query("select Mvtsinistre from Mvtsinistre Mvtsinistre where Mvtsinistre.mvts_numsinistre = :numsinistre "
			+ "ORDER BY Mvtsinistre.mvts_num")
	List<Mvtsinistre> findMvtsinistreByNumSinistre(@Param("numsinistre") Long numsinistre);
	
	@Query("select m from Mvtsinistre m where m.mvts_numsinistre =:mvts_numsinistre AND m.mvts_typemvt =:mvts_typemvt ORDER BY m.mvts_num")
	List<Mvtsinistre> getMvtsinistreByTypeMvtsAndSinistre(@Param("mvts_numsinistre") Long mvts_numsinistre, @Param("mvts_typemvt") Long mvts_typemvt);
	
	@Query("select m from Mvtsinistre m where (m.mvts_typemvt = 10 and m.mvts_status = 1) OR (m.mvts_typemvt = 13 and m.mvts_status = 5)")
	List<Mvtsinistre> getMvtsinistreByTypeMvtsAndStatus();
	
	@Query("select m from Mvtsinistre m where ((m.mvts_typemvt = 17 or m.mvts_typemvt = 18) and m.mvts_status = 1) or (m.mvts_typemvt = 17 and m.mvts_status = 5) or (m.mvts_typemvt = 10 and m.mvts_status = 5)")
	List<Mvtsinistre> getMoratoireEncaisse();
		
	@Modifying
	@Query("UPDATE Mvtsinistre m SET m.mvts_status=:mvts_status, m.mvts_datemodification=:mvts_datemodification where m.mvts_num=:mvts_num")
	void updateMvtEncaisseRecours(@Param("mvts_status") int mvts_status,
			@Param("mvts_datemodification") Date mvts_datemodification,
			@Param("mvts_num") Long mvts_num);

	@Modifying
	@Query("UPDATE Mvtsinistre m SET m.mvts_status=:mvts_status, m.mvts_dateannulation=:mvts_dateannulation, m.mvts_datemodification=:mvts_datemodification, m.mvts_datemvt=:mvts_datemvt where m.mvts_num=:mvts_num")
	void updateMvtRecours(@Param("mvts_status") int mvts_status,
			@Param("mvts_dateannulation") Date mvts_dateannulation,
			@Param("mvts_datemodification") Date mvts_datemodification, @Param("mvts_datemvt") Date mvts_datemvt,
			@Param("mvts_num") Long mvts_num);
}
