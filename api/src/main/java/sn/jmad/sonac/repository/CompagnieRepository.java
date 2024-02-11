package sn.jmad.sonac.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.message.response.CompagnieGroupe;
import sn.jmad.sonac.message.response.ProduitCategorie;
import sn.jmad.sonac.model.Compagnie;
import sn.jmad.sonac.model.Groupe;

@Repository
public interface CompagnieRepository extends JpaRepository<Compagnie, Long>{
	 	@Query("select compagnie from Compagnie compagnie where compagnie.comp_id = :id")
		Compagnie findByIdd(@Param("id") Long id);
	 	
	 	@Query("select compagnie from Compagnie compagnie where compagnie.active=1 and compagnie.comp_numero = :numcomp")
		Compagnie findByNumComp(@Param("numcomp") String numcomp);
	 	
	 	
	 	@Query("select c from Compagnie c where c.comp_codegroupe=:code")
	 	List<Compagnie> findbyGroupe(@Param("code") Long code);

	 	
	 	@Query("from Compagnie comp where comp.active = 1 ORDER BY comp.comp_id")
		List<Compagnie> allcompagnies();
	 	
	 	@Query("from Compagnie comp where comp.active = 0 ORDER BY comp.comp_id")
		List<Compagnie> allcompagniesDelete();


		
		@Query(nativeQuery = true,
				value="select comp.comp_numero, gr.group_liblong, comp.comp_type, comp.comp_denomination, "
						+ "comp.comp_sigle, comp.comp_adresse1, comp.comp_telephone1 "
						+ "from Compagnie comp, Groupe gr where comp.active = 1 and comp.comp_codegroupe=gr.group_code ")
		List<CompagnieGroupe> allCompagnieGroupe();
	
}
