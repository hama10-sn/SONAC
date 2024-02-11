package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Lot;
import sn.jmad.sonac.model.Lot_P;



public interface LotRepository_P extends JpaRepository<Lot_P, Long>{
	
	
	
	@Query("select l from Lot_P l where l.lot_numero= :code")
	Lot_P findbyCode(@Param("code") Long code);
	
	@Query("select l from Lot_P l where l.lot_numeroacte= :code")
	List<Lot_P> findbyActe(@Param("code") Long code);
	
}