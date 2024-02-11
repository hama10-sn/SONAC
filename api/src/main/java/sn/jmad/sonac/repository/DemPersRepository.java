package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Civilite;
import sn.jmad.sonac.model.Contact;
import sn.jmad.sonac.model.Dem_Pers;
import sn.jmad.sonac.model.Groupe;
import sn.jmad.sonac.model.Police;

import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface DemPersRepository extends JpaRepository<Dem_Pers, Long> {
	
	
	//@Query("from Dem_Pers dp where dp. = :code")
	//List<Dem_Pers> findAllDemandeByClient(@Param("code") int code);
	//@Query("from Dem_Pers dem_Pers ORDER BY dem_Pers.dem_persnum")
	//List<Dem_Pers> findAllDem_Pers();
	/*@Query(
			"select dem "
				+ " from Dem_Pers dem"
				+ " where dem.dem_statut = 'en attente' AND dem.actif=1"
		)
	Long findDemande(@Param("id") Long cont_client);*/
	
	@Query(
			"select dem"
				+ " from Dem_Pers dem"
				+ " where dem.dem_persnum = :id AND dem.dem_statut = 'en attente' "
		)
	Optional<Dem_Pers> findByNum(@Param("id") Long dem_persnum);
	@Query(
			"select dem"
				+ " from Dem_Pers dem"
				+ " where dem.dem_persnum = :id"
		)
	List<Dem_Pers> findByDemPersnum(@Param("id") Long dem_persnum);
	
	@Query("select dem_Pers"
			+ " from Dem_Pers dem_Pers"
			+ " where dem_Pers.actif = :id ORDER BY dem_Pers.dem_persnum"
			)
	List<Dem_Pers> findAllDem_Pers(@Param("id") int a);
	@Query(
			"select dem_Pers "
				+ " from Dem_Pers dem_Pers"
				+ " where dem_Pers.dem_statut = 'validé pour arbitrage' and dem_Pers.actif = :id ORDER BY dem_Pers.dem_persnum"
		)
	List<Dem_Pers> finddemValide(@Param("id") int a);
	@Query(
			"select dem_Pers "
				+ " from Dem_Pers dem_Pers"
				+ " where dem_Pers.dem_statut = 'contrat à émettre' and dem_Pers.actif = :id ORDER BY dem_Pers.dem_persnum"
		)
	List<Dem_Pers> findDemPreEmission(@Param("id") int a);
	
	@Query("from Dem_Pers dempers where dempers.dem_typetitulaire =:num and dempers.actif=1")
	List<Dem_Pers> findDemandePersByProspect(@Param("num") Integer num);
}