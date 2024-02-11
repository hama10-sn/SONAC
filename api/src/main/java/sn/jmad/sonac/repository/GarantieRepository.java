package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Garantie;





public interface GarantieRepository extends JpaRepository<Garantie, Long>{
	
	@Query("select g from Garantie g where g.gara_status = :id order by g.gara_num desc")
    List<Garantie> allGaranties();
	
	@Query("select g from Garantie g where g.gara_num = :id")
	Garantie findByIdd(@Param("id") Long id);

}
