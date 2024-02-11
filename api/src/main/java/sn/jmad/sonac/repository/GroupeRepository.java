package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Groupe;

@Repository
public interface GroupeRepository extends JpaRepository<Groupe, Long>{
	
	@Query("from Groupe gr where gr.active = 1 order by gr.group_id ASC")
	List<Groupe> allgroupes();
	
	@Query("select gr from Groupe gr where gr.group_code= :code")
	Groupe findbyCode(@Param("code") Long code);

}
