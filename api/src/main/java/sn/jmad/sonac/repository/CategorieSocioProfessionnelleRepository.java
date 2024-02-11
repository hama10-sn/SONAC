package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.CategorieSocioProfessionnelle;
@Repository
public interface CategorieSocioProfessionnelleRepository extends JpaRepository<CategorieSocioProfessionnelle, Long>{

	@Query("from CategorieSocioProfessionnelle categ ORDER BY categ.categs_code")
	List<CategorieSocioProfessionnelle> allCategoriesociopro();
}
