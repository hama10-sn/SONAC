package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Accessoire;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Beneficiaire;

public interface BeneficiaireRepository  extends JpaRepository<Beneficiaire, Long>{
	
	@Query("select b from Beneficiaire b where b.benef_Num = :num ")
	Beneficiaire findByCode(@Param("num") Long num);
	
	@Query("select b from Beneficiaire b ORDER BY b.benef_Num ASC")
	List<Beneficiaire> findAllBeneficiaire();
	
	@Query(nativeQuery = true,
			value="SELECT * "
					+ "FROM beneficiaire b "
					+ "WHERE UPPER(b.benef_denom) =:denomination "
					+ "ORDER BY b.benef_num ASC")
	List<Beneficiaire> findBeneficiaireByDenomination(@Param("denomination") String denomination);
	
	@Query(nativeQuery = true,
			value="SELECT * "
					+ "FROM beneficiaire b "
					+ "WHERE UPPER(b.benef_nom) =:nom AND UPPER(b.benef_prenoms) =:prenom "
					+ "ORDER BY b.benef_num ASC")
	List<Beneficiaire> findBeneficiaireByPrenomAndNom(@Param("nom") String nom, @Param("prenom") String prenom);
	
	@Query(nativeQuery = true,
			value="SELECT benef_num, benef_ccutil, benef_datemo, benef_denom, benef_id, benef_nom, benef_prenoms, benef_status, benef_typbenef "
					+ "FROM acte acte, beneficiaire benef "
					+ "WHERE acte.act_numeropolice =:numpolice "
					+ "AND acte.act_idbeneficiaire = benef.benef_Num")
	Beneficiaire findBeneficiaireWithActeByPolice(@Param("numpolice") Long numpolice);
	
}
 