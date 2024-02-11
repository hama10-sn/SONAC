package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.message.response.SureteEngagement;
import sn.jmad.sonac.model.Surete;

@Repository
public interface SureteRepository extends JpaRepository<Surete, Long> {
	
	@Query("select surete from Surete surete where surete.surete_active = 1 ORDER BY surete.surete_numero")
	List<Surete> findAllSurete();
	
	@Query("select surete from Surete surete where surete.surete_active = 1 and surete.surete_numero = :suretenum")
	Surete findByNumSurete(@Param("suretenum") Long suretenum);
	
	@Query(nativeQuery = true,
			value="SELECT cl.clien_numero, cl.clien_prenom, cl.clien_nom, cl.clien_denomination, cl.clien_sigle, surete_numpoli, surete_numeroavenant, surete_numeroacte, surete_numeroengagement, surete_numero, surete_typesurete, surete_identificationtitre, sure.surete_localisation, sure.surete_adressegeolocalisation, surete_retenudeposit, surete_datedeposit, surete_cautionsolidaire,  surete_depositlibere, surete_dateliberation, surete_datecomptabilisation, surete_datemodification, surete_statutliberation "
					+ "FROM surete sure, engagement eng, police poli, client cl "
					+ "WHERE sure.surete_numeroengagement = eng.engag_numeroengagement AND eng.engag_numpoli = poli.poli_numero AND poli.poli_client = cl.clien_numero AND sure.surete_active = 1 "
					+ "ORDER BY cl.clien_numero, poli.poli_numero, eng.engag_numeroengagement, sure.surete_numero")
	List<SureteEngagement> getAllSureteEgagement();

}
