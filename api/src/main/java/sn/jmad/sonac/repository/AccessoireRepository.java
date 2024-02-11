package sn.jmad.sonac.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Accessoire;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Groupe;
import sn.jmad.sonac.model.Taxe;

@Repository
public interface AccessoireRepository extends JpaRepository<Accessoire, Long> {
	
	@Query("select a from Accessoire a where a.acces_id =:id")
	Accessoire findByIdd(@Param("id") Long id);
	
	@Query("select a from Accessoire a where a.acces_codeproduit =:numprod and acces_codeapporteur = :inter and a.acces_datepriseffet < :date and acces_datefineffet > :date")
	Accessoire findByProduitEtInter(@Param("numprod") Long numprod,@Param("date") Date date,@Param("inter") long inter);
	
	@Query("select a from Accessoire a where a.acces_codeproduit =:numprod and acces_codeapporteur = :inter ")
	Accessoire findByProduitAllEtInter(@Param("numprod") Long numprod,@Param("inter") long inter);

	@Query("from Accessoire acces where acces.active = 1 ORDER BY acces.acces_code")
	List<Accessoire> findAllAccessoire();
	
	@Query("select max(a.acces_code) from Accessoire a where a.acces_codeproduit=:numproduit "
			+ "AND a.acces_codeapporteur=:codeapporteur")
	Long lastNumAccessoire(@Param("numproduit") Long numproduit, @Param("codeapporteur") Long codeapporteur);
	
	@Query("select a from Accessoire a where a.acces_codebranche =:num")
    List<Accessoire> findbyBranche(@Param("num") long num);
	
	@Query("select acces from Accessoire acces where acces.acces_code =:code")
	Accessoire findbyCode(@Param("code") long code);
		
}
