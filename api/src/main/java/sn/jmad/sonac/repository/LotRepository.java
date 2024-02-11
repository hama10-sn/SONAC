package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Lot;



public interface LotRepository extends JpaRepository<Lot, Long>{
	
	@Query("from Lot l ORDER BY  l.lot_id ")
	List<Lot> allLots();
	
	@Query("select l from Lot l where l.lot_numero= :code")
	Lot findbyCode(@Param("code") Long code);
	
	@Query("select l from Lot l where l.lot_numeroacte= :code")
	List<Lot> findbyActe(@Param("code") Long code);
	
}