package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Alerte;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;


@Repository
public interface AlerteRepository extends JpaRepository<Alerte, Long> {
	
	
	@Query("select a from Alerte a where a.id_rdv = :id")
    List<Alerte> findByIdRdv(@Param("id") Long rdv);
	
	@Transactional
	@Modifying
	@Query("delete from Alerte a where a.id_rdv = :id")
    void deleteByIdRdv(@Param("id") Long rdv);
	
}