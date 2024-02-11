package sn.jmad.sonac.repository;




import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Classification_secteur;


public interface ClassificationSecteurRepository extends JpaRepository<Classification_secteur, Long>{
	
	@Query("select classif from Classification_secteur classif where classif.code=:code")
	Classification_secteur findLibellebyCode(@Param("code") long code);


}
