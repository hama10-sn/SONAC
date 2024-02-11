package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.message.response.SinistreMouvement;
import sn.jmad.sonac.message.response.SinistreMouvementReglement;
import sn.jmad.sonac.model.Moratoire;
import sn.jmad.sonac.model.Recours;
import sn.jmad.sonac.model.Reglement;

@Repository
public interface ReglementRepository extends JpaRepository<Reglement, Long> {

	@Query("select regl from Reglement regl where regl.regl_num =:num")
	Reglement findReglementByNumero(@Param("num") Long num);
	
	@Query("select regl from Reglement regl where regl.regl_numsinistre =:numsinistre and regl.regl_nummvt =:nummvt")
	Reglement findReglementByNumeroSinistreAndMvt(@Param("numsinistre") Long numsinistre, @Param("nummvt") Long nummvt);

	@Query("select regl from Reglement regl where regl.regl_numsinistre =:numsinistre order by regl.regl_num")
	List<Reglement> findReglementByNumeroSinistre(@Param("numsinistre") Long numsinistre);
	
	@Query("select regl from Reglement regl where regl.regl_nummvt =:regl_nummvt")
	Reglement getReglementByMvt(@Param("regl_nummvt") Long regl_nummvt);

	/*
	@Query(nativeQuery = true, 
			value = "SELECT * "
					+ "FROM sinistre sin, mvtsinistre mvt, reglement regl "
					+ "WHERE sin.sini_num = mvt.mvts_numsinistre AND sin.sini_num = regl.regl_numsinistre "
					+ "AND mvt.mvts_num = regl.regl_nummvt "
					+ "AND mvt.mvts_typemvt = 6 AND regl.regl_status = 6 AND mvt.mvts_status = 1"
					+ "ORDER BY sin.sini_souscripteur, sin.sini_police, sin.sini_num, regl.regl_num")
	List<SinistreMouvementReglement> getAllReglementValides();
	*/
	
	@Query(nativeQuery = true, 
			value = "SELECT * "
					+ "FROM sinistre sin, mvtsinistre mvt "
					+ "WHERE sin.sini_num = mvt.mvts_numsinistre "
					+ "AND mvt.mvts_typemvt = 6 AND (mvt.mvts_status = 1 OR mvt.mvts_status = 4 OR mvt.mvts_status = 5) "
					+ "ORDER BY sin.sini_souscripteur, sin.sini_police, sin.sini_num, mvt.mvts_num")
	List<SinistreMouvement> getAllMvtsReglementValides();
	
	
	@Query(nativeQuery = true, 
			value = "SELECT * "
					+"FROM sinistre sin, mvtsinistre mvt, Reglement regl "
					+"WHERE sin.sini_num = mvt.mvts_numsinistre "
					+"AND sin.sini_num = regl.regl_numsinistre "  
					+"AND mvt.mvts_num = regl.regl_nummvt " 
					+"AND mvt.mvts_typemvt = 19 AND mvt.mvts_status = 1 "
					+"ORDER BY sin.sini_souscripteur, sin.sini_police, sin.sini_num, mvt.mvts_num, regl.regl_num")
	List<SinistreMouvementReglement> getAllReglementFinancier();
	
	@Query("SELECT regl FROM Reglement regl WHERE regl.regl_numcheque =:numCheque")
	Reglement findReglementByNumCheque(@Param("numCheque") String numCheque);

}
