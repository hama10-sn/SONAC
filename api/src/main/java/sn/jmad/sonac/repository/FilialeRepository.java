package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Filiale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface FilialeRepository extends JpaRepository<Filiale, Long>{

	@Query("select filiale from Filiale filiale where filiale.fili_numero = :id")
	Filiale findByIdd(@Param("id") Long id);
	
	@Query("select filiale from Filiale filiale where filiale.fili_codeutilisateur = :id")
    List<Filiale> findByCodeUser(@Param("id") String type);
	
	@Query("select filiale from Filiale filiale where filiale.active = :id order by filiale.fili_numero desc")
    List<Filiale> allFiliales(@Param("id") int a);
	
	@Query("select filiale from Filiale filiale where filiale.active = 1 and filiale.fili_codegroupe = :code")
    List<Filiale> findbyGroupe(@Param("code") Long code);
	
	//join
		@Query("select f,c from Filiale f, Compagnie c where f.fili_codecompagnie= c.comp_numero and"
			+ " f.active = :id and c.active = :id"
			+ " order by f.fili_numero desc")
    List<?> allFilialesCompagnie(@Param("id") int a); 
	
    /* 	@Query("select f.fili_numero, f.active, f.fili_adresse1, f.fili_adresse2, f.fili_codecompagnie, f.fili_codedevise, f.fili_codegroupe, f.fili_codepays, f.fili_codepostal, f.fili_codeutilisateur, f.fili_datemodification, f.fili_denomination, f.fili_id, f.fili_sigle, f.fili_telephone1, f.fili_telephone2, f.fili_telephonemobile,c.comp_denomination "
			+ "from Filiale f, Compagnie c where f.fili_codecompagnie= c.comp_numero and"
			+ " f.active = :id and c.active = :id"
			+ " order by f.fili_numero desc")
    List<?> allFilialesCompagnie(@Param("id") int a);*/

}
