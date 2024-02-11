package sn.jmad.sonac.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Accessoire;
import sn.jmad.sonac.model.Commission;
import sn.jmad.sonac.model.Intermediaire;
import sn.jmad.sonac.model.Produit;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {
	
//	@Query("select max(c.comm_code) from Commission c where c.comm_codecategorie=:numcategorie "
//			+ "AND c.comm_codeapporteur=:codeapporteur AND c.comm_codeapporteur=:codegarantie")
//	Long lastCodeCommission(@Param("numcategorie") Long numcategorie, 
//							@Param("codeapporteur") Long codeapporteur, 
//							@Param("codegarantie") Long codegarantie);
	
	@Query("select com from Commission com where com.comm_id =:id")
	Commission findByIdd(@Param("id") Long id);
	
	@Query("select com from Commission com where com.comm_codebranche = :num")
    List<Commission> findbyBranche(@Param("num") long num);
	
	@Query("from Commission commis ORDER BY commis.comm_code")
	List<Commission> findAllCommission();
	
	@Query("select commission from Commission commission where commission.comm_code=:num")
	Commission findbyCode(@Param("num") long num);
	
	@Query("select commission from Commission commission where commission.comm_codeproduit=:numprod and commission.comm_codeapporteur=:inter and commission.comm_datepriseffet < :date and commission.comm_datefineffet > :date")
	Commission findbyProduitEtInter(@Param("numprod") long numprod,@Param("inter") long inter, @Param("date") Date date);
	
	@Query("select commission from Commission commission where commission.comm_codeproduit=:numprod and commission.comm_codeapporteur=:inter ")
	Commission findbyProduitAllEtInter(@Param("numprod") long numprod,@Param("inter") long inter);
	
	
	@Query("select max(com.comm_code) from Commission com where com.comm_codeproduit=:numproduit "
			+ "AND com.comm_codeapporteur=:codeapporteur")
	Long lastNumCommission(@Param("numproduit") Long numproduit, @Param("codeapporteur") Long codeapporteur);
	
}
