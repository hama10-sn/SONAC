package sn.jmad.sonac.repository;

import java.util.Date;
import java.util.List;

import sn.jmad.sonac.message.response.PoliceProduit;
import sn.jmad.sonac.model.Acheteur;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.MainLeve;

import sn.jmad.sonac.model.Engagement;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface AcheteurRepository extends JpaRepository<Acheteur, Long>{

	@Query("select a from Acheteur a where a.achet_numero = :id")
	Acheteur findByIdd(@Param("id") Long id);
	
	@Query("select a from Acheteur a where a.achet_codeutilisateur = :id")
    List<Acheteur> findByCodeUser(@Param("id") String type);
	
	@Query("select a from Acheteur a where a.achet_type = :type")
    List<Acheteur> findbyType(@Param("type") String type);
	@Query("select acheteur"
			+ " from Acheteur acheteur"
			+ " where acheteur.active = :id ORDER BY acheteur.achet_numero ASC"
			)
	List<Acheteur> allacheteurs(@Param("id") int a);
	@Query(
			"select ach"
				+ " from Acheteur ach"
				+ " where ach.achet_numeroaffaire = :id and ach.active =1 ORDER BY ach.achet_numero"
		)
	List<Acheteur> AllAcheteurByPolice(@Param("id") Long num);
	
	@Query("select a from Acheteur a where a.achet_numeroclient =:numclient and a.achet_numeroaffaire =:numpolice and a.active =1"
			+ "ORDER BY a.achet_numero ")
	List<Acheteur> findAcheteurByClientAndPolice(@Param("numclient") Long numclient, @Param("numpolice") Long numpolice);
	
	/*@Query(nativeQuery = true,
			value="select ach.achet_numero, cl.clien_nom, cl.clien_denomination, cl.clien_prenom,"
					+ "cl.clien_sigle, cl.clien_nature, ach.achet_numeroaffaire, ach.achet_type, ach.achet_chiffreaffaire,"
					+ "ach.achet_dispersion, ach.achet_creditencours  "
					+ "from Acheteur ach, Client cl "
					+ "where ach.poli_codeproduit = prod.prod_numero and prod.prod_numerobranche = b.branche_numero "
					+ "and poli.poli_numero =:numPolice ")
	PoliceProduit findProduitByPolice();*/


}
