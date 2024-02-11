package sn.jmad.sonac.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.Accessoire;
import sn.jmad.sonac.model.Acte;
import sn.jmad.sonac.model.Beneficiaire;
import sn.jmad.sonac.model.Beneficiaire_P;

public interface BeneficiaireRepository_P  extends JpaRepository<Beneficiaire_P, Long>{
	
	@Query("select b from Beneficiaire_P b where b.benef_Num = :num ")
	Beneficiaire_P findByCode(@Param("num") Long num);
	
	
}
 