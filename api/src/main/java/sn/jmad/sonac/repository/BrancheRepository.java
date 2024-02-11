package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.CategorieSocioProfessionnelle;

@Repository
public interface BrancheRepository extends JpaRepository<Branche, Long> {
	
	@Query("from Branche br where br.active = 1 ORDER BY br.branche_numero")
	List<Branche> findAllBranche();
	
	@Query("select br from Branche br where br.branche_numero=:num")
	Branche findbyCode(@Param("num") long num);
	
	@Query("select br from Branche br where br.branche_numero=:num")
	Branche findBrancheByNumero(@Param("num") long num);

}
