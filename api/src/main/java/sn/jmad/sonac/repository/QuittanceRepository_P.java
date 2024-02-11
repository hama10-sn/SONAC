package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.message.response.EmissionConsultation;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.ProductionConsultation;
import sn.jmad.sonac.model.Quittance;
import sn.jmad.sonac.model.Quittance_P;

public interface QuittanceRepository_P extends JpaRepository<Quittance_P, Long>{

	@Query("select q from Quittance_P q where q.active = 1 and q.Quit_numero = :id")
	Quittance_P findbyIdd(@Param("id") Long id);
	
	@Query("select q from Quittance_P q where q.active = 1 and q.Quit_numeropolice = :id")
	Quittance_P findbyNumpol(@Param("id") Long id);
}
