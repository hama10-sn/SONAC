package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.RefEncaissement;

@Repository
public interface RefEncaissementRepository extends JpaRepository<RefEncaissement, Long> {
	
	@Query("select refencai from RefEncaissement refencai order by refencai.refencai_code")
	List<RefEncaissement> findAllRefEncaissement();
	
	@Query("select refencai from RefEncaissement refencai where refencai.refencai_code =:code")
	RefEncaissement findRefEncaissementByCode(@Param("code") Long code);
	
	@Query("select refencai from RefEncaissement refencai where refencai.refencai_status = 'A' and refencai.refencai_numerotitre =:numtitre")
	RefEncaissement findRefEncaissementByNumTitre(@Param("numtitre") String numtitre);

}
