package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Banque;

@Repository
public interface BanqueRepository extends JpaRepository<Banque, Long>{

	@Query("select banque from Banque banque where banque.banq_id =:id")
	Banque findBanqueById(@Param("id") Long id);
	
	@Query("select banque from Banque banque where banque.banq_codebanque =:code")
	Banque findBanqueByCode(@Param("code") Long code);
	
	@Query("from Banque banque ORDER BY banque.banq_codebanque")
	List<Banque> findAllBanque();
}
