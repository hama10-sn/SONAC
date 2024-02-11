package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Rdv;


@Repository
public interface RdvRepository extends JpaRepository<Rdv, Long>{

	@Query("select Rdv from Rdv Rdv where Rdv.id_rdv = :id")
	Rdv findByIdd(@Param("id") Long id);
	
	@Query("select Rdv from Rdv Rdv where Rdv.id_agent = :id and Rdv.active =1 order by date_fin desc")
    List<Rdv> findByCodeAgent(@Param("id") String id);
	
	@Query("select Rdv from Rdv Rdv where Rdv.active = :id order by Rdv.date_fin desc")
    List<Rdv> allRdvs(@Param("id") int a);
	
	@Query("select Rdv from Rdv Rdv where Rdv.id_client = :code order by Rdv.date_fin desc")
    List<Rdv> findbyClient(@Param("code") String code);
	
	

	/*@Query("select Rdv from Rdv Rdv where Rdv.util_direction = :util_direction order by Rdv.date_fin desc")
    List<Rdv> findbyDirection(@Param("util_direction") String util_direction);*/
	
}
