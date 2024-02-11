package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.message.response.ClientContact;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.PoliceProduit;
import sn.jmad.sonac.message.response.ProduitCategorie;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Devis;
import sn.jmad.sonac.model.Produit;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, Long> {
	
	@Query("select max(p.prod_numero) from Produit p where p.prod_numerocategorie=:numcategorie")
	Long lastNumProduit(@Param("numcategorie") Long numcategorie);
	
	@Query("select p from Produit p where p.prod_numerocategorie=:categ ORDER BY p.prod_numero")
	List<Produit> numeroProduitByCategorie(@Param("categ") Long categ);
	
	@Query("select prod from Produit prod where prod.prod_numerobranche = :num")
    List<Produit> findbyBranche(@Param("num") long num);
	
	@Query("from Produit prod ORDER BY prod.prod_numero")
	List<Produit> findAllProduit();
	
	@Query(nativeQuery = true,
			value="select poli_numero, poli_codeproduit, prod_denominationcourt, prod_denominationlong, prod_numerobranche , b.branche_libelle_long "
					+ "from Police poli, Produit prod, branche b "
					+ "where poli.poli_codeproduit = prod.prod_numero and prod.prod_numerobranche = b.branche_numero "
					+ "and poli.poli_numero =:numPolice ")
	PoliceProduit findProduitByPolice(@Param("numPolice") Long numPolice);

	@Query(nativeQuery = true,
			value="select cl.clien_numero,cl.clien_nom,cl.clien_denomination,cl.clien_prenom,cl.clien_sigle,cl.clien_nature,cl.clien_telephone1,cl.clien_date_relation,ct.cont_nom,ct.cont_prenom,ct.cont_mobile "
					+ "from Client cl left join Contact ct on ct.cont_numeroclient=cl.clien_numero where cl.active = 1 and cl.clien_status = '1' "
					+ "and (ct.cont_numero=(select ct.cont_numero from Contact ct where ct.cont_numeroclient=cl.clien_numero and ct.cont_leader = true and ct.active=1 Order by ct.cont_numero limit 1 ) or ct.cont_numero is null) Order by cl.clien_numero")
	List<ClientContact> allclientandcontact();
	

	@Query(nativeQuery = true,
			value="select prod.prod_numero, br.branche_libellecourt, br.branche_libelle_long, cat.categ_libellelong, prod.prod_denominationlong, prod.prod_denominationcourt, prod.prod_codetaxe "
					+ "from Produit prod, Branche br, Categorie cat "
					+ "where prod.prod_numerobranche=br.branche_numero and prod.prod_numerocategorie=cat.categ_numero "
					+ "ORDER BY prod.prod_numero")
	List<ProduitCategorie> allProduitBrancheCategorie();
		
	@Query("select produit from Produit produit where produit.prod_numero = :numero")
	Produit getProduitByNumero(@Param("numero") Long numero);

	

}
