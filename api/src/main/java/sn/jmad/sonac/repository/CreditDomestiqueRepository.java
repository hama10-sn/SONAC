package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.CreditDomestique;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CreditDomestiqueRepository extends JpaRepository<CreditDomestique, Long>{

	
	
}
