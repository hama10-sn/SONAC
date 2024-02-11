package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.CreditExport;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CreditExportRepository extends JpaRepository<CreditExport, Long>{

	@Query("select ce from CreditExport ce where ce.typeca = :typeca and ce.typerisque = :typeRisque")
	CreditExport getCreditExport(@Param("typeca") int typeca,@Param("typeRisque") String typeRisque);
	
}
