package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.jmad.sonac.model.Propos;

@Repository
public interface ProposRepository extends JpaRepository<Propos, Long> {
//@Query("select Propo from Propos propo where propo.propo_numero = :numero")
	
	//Propos findByNumero(@Param("numero") Long numero);

	@Query("from Propos propo ORDER BY propo.propo_numero")
	List<Propos> findAllPropos();
	
	@Query("select propo from Propos propo where propo.propo_id = :id")
	Propos findByIdd(@Param("id") Long id);
	
	
}
