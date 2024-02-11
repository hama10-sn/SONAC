package sn.jmad.sonac.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.CodeAnnulationFact;

@Repository
public interface CodeAnnulationRepository extends JpaRepository<CodeAnnulationFact, Long>{
	
	@Query("from CodeAnnulationFact codeannul ORDER BY codeannul.id")
	List<CodeAnnulationFact> findAllCodeAnnulation();
	@Query(
			"select codeAnnulationFact"
				+ " from CodeAnnulationFact codeAnnulationFact"
				+ " where codeAnnulationFact.id = :id"
		)
	Optional<CodeAnnulationFact> findByNum(@Param("id") Long num);

}
