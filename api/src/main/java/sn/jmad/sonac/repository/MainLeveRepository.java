package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.MainLeve;



public interface MainLeveRepository extends JpaRepository<MainLeve, Long>{
	
	@Query("from MainLeve main ORDER BY  main.mainl_id ")
	List<MainLeve> allMainLeves();
	
	@Query("select main from MainLeve main where main.mainl_nummainlevee= :code")
	MainLeve findbyCode(@Param("code") Long code);

	@Query(
			"select mainLeve"
				+ " from MainLeve mainLeve"
				+ " where mainLeve.mainl_numeroengagement = :id ORDER BY mainLeve.mainl_id"
		)
	List<MainLeve> AllMainLeveByEngagement(@Param("id") Long num);
}
