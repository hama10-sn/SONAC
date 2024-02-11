package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CreditRepository extends JpaRepository<Credit, Long>{

	@Query("select c from Credit c where c.credit_numero = :id")
	Credit findByIdd(@Param("id") Long id);
	
	@Query("select c from Credit c where c.credit_codeutil = :id")
    List<Credit> findByCodeUser(@Param("id") String type);
	
	@Query("select c from Credit c order by c.credit_numero desc")
    List<Credit> allCredits();
	
	@Query("select c from Credit c where c.credit_type = :type")
    List<Credit> findbyType(@Param("type") String type);
	
	@Query("select c from Credit c where c.credit_numpol = :numpol")
    List<Credit> findByPolice(@Param("numpol") Long numpol);
	
	@Query("select c from Credit c where c.credit_numeroclient =:client and c.credit_numeroachateur =:acheteur")
    List<Credit> findCreditByClientAndAcheteur(@Param("client") Long client, @Param("acheteur") Long acheteur);
	
}
