package sn.jmad.sonac.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Groupe;
import sn.jmad.sonac.model.Produit;
import sn.jmad.sonac.model.Taxe;

public interface TaxeRepository extends JpaRepository<Taxe, Long>{

	@Query("select taxe from Taxe taxe where taxe.taxe_id = :id")
	
	Taxe findByIdd(@Param("id") Long id);
	
	@Query("select max(t.taxe_codetaxe) from Taxe t where t.taxe_catego=:categorie")
	Integer lastIdgCategorie(@Param("categorie") Long categorie);
	
	@Query("select max(t.taxe_codetaxe) from Taxe t where t.taxe_codeproduit=:produit")
	Long lastIdProduit(@Param("produit") Long produit);
	
	@Query("select taxe from Taxe taxe where taxe.taxe_codetaxe= :code")
	Taxe findbyCode(@Param("code") Long code);
	
	@Query("select taxe from Taxe taxe where taxe.taxe_codeproduit= :numprod and taxe.taxe_dateffet < :date and taxe.taxe_datefin > :date and taxe.active = 1 ")
	Taxe findbyProduit(@Param("numprod") Long numprod ,@Param("date")Date date);


	@Query("from Taxe taxe where taxe.active = 1 ORDER BY taxe.taxe_codetaxe")
	List<Taxe> alltaxes();

	
	@Query("select t from Taxe t where t.taxe_branch = :num")
    List<Taxe> findbyBranche(@Param("num") long num);

}
