package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Police_P;

@Repository
public interface PoliceRepository_P extends JpaRepository<Police_P, Long> {
	
	@Query("from Police_P poli where poli.poli_status=1 ORDER BY poli.poli_numero")
	List<Police_P> findAllPolice();
	
	@Query("select poli from Police_P poli where poli.poli_numero =:id and poli.poli_status=1")
	Police_P findByPolice(@Param("id") Long id);
	
	/*@Query("from Police poli where poli.poli_status=1 and poli.poli_intermediaire =:num")
	List<Police> findPoliceByIntermediaire(@Param("num") Long num);
	
	@Query("from Police poli where poli.poli_status=1 and poli.poli_client =:num")
	List<Police> findPoliceByClient(@Param("num") Long num);
	
	@Query("from Police poli where poli.poli_status=1 and poli.poli_compagnie =:num")
	List<Police> findPoliceByCompagnie(@Param("num") String num);

	@Query("select poli.poli_numerodernieravenant from Police poli where poli.poli_status=1 and poli.poli_numero =:num")
	Long findNumAvenantByPolice(@Param("num") Long num);*/
}
