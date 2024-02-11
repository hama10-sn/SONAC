package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.jmad.sonac.model.Pleins;

@Repository
public interface PleinsRepository extends JpaRepository<Pleins, Long> {

	@Query("SELECT pleins FROM Pleins pleins WHERE pleins.pleins_id =:id")
	Pleins findPleinsById(@Param("id") Long id);

	@Query("SELECT pleins FROM Pleins pleins WHERE pleins.pleins_exercice =:exercice AND pleins.pleins_branche =:branche AND pleins.pleins_categorie =:categorie AND pleins.pleins_produit =:produit")
	Pleins findPleinsByClesPrimaires(@Param("exercice") Long exercice, @Param("branche") Long branche, @Param("categorie") Long categorie, @Param("produit") Long produit);

	@Query("FROM Pleins pleins ORDER BY pleins.pleins_exercice, pleins.pleins_branche, pleins.pleins_categorie, pleins.pleins_produit")
	List<Pleins> findAllPleins();

}
