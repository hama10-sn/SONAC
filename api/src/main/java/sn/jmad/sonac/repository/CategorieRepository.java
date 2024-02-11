package sn.jmad.sonac.repository;

import sn.jmad.sonac.message.response.CategorieBranche;
import sn.jmad.sonac.message.response.ProduitCategorie;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Compagnie;
import sn.jmad.sonac.model.Contact;


//import java.util.Optional;

import sn.jmad.sonac.model.Pays;
import sn.jmad.sonac.model.Role;
import sn.jmad.sonac.model.RoleName;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface CategorieRepository extends JpaRepository<Categorie, Long> {
	
	/*
	   * Cette requet nous permet de recuperer le numero d'une categorie
	   *
	   */
	@Query("select categorie"
			+ " from Categorie categorie"
			+ " where categorie.categ_numero = :id")
	Optional<Categorie> findByNumCat(@Param("id") Long categ_numero);
	
	@Query("select max(c.categ_numero) from Categorie c where c.categ_numerobranche=:branch and c.categ_numero !=:high")
	Integer lastIdgCategorie(@Param("branch") Long branch,@Param("high") Long high);
	
	@Query("select c from Categorie c where c.categ_numerobranche=:branch and active = 1 ORDER BY c.categ_numero ASC")
	List<Categorie> branchCategorie(@Param("branch") Long branch);

	@Query("select categorie"
			+ " from Categorie categorie"
			+ " where categorie.active = :id ORDER BY categorie.categ_numero ASC"
			)
	List<Categorie> allCategories(@Param("id") int a);
	@Query("select categorie"
			+ " from Categorie categorie"
			+ " where categorie.categ_numero = :id")
	Categorie findByNumeroCat(@Param("id") Long categ_numero);


	@Query("select c from Categorie c where active = 1 and c.categ_numerobranche =:num")
    List<Categorie> findbyBranche(@Param("num") long num);
	
	@Query(nativeQuery = true,
			value="select cat.categ_numero, br.branche_libelle_long, cat.categ_libellelong, cat.categ_libellecourt, cat.categ_classificationanalytique, cat.categ_codetaxe, cat.categ_codecommission "
					+ "from Categorie cat, Branche br where cat.categ_numerobranche=br.branche_numero and cat.active = 1 ORDER BY cat.categ_numero ASC")
	List<CategorieBranche> allCategorieBranche();
	
	@Query(nativeQuery = true,
			value="select prod.prod_numero, br.branche_libellecourt, cat.categ_libellelong, prod.prod_denominationlong, prod.prod_denominationcourt, prod.prod_codetaxe "
					+ "from Produit prod, Branche br, Categorie cat where prod.prod_numerobranche=br.branche_numero and prod.prod_numerocategorie=cat.categ_numero ")
	List<ProduitCategorie> allProduitBrancheCategorie();
	
	

	}

