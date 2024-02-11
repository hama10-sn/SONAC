package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Tarification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface TarificationRepository extends JpaRepository<Tarification, Long>{

	@Query("select t from Tarification t where t.code_produit = :id")
	List<Tarification> findByCodeProduit(@Param("id") Long id);
	
	@Query("select t from Tarification t where t.code_produit = :codeProduit and t.type_traitement ='express'")
	Tarification getCautionExpress(@Param("codeProduit") Long codeProduit);
	@Query("select t from Tarification t where t.code_produit = :codeProduit and t.type_traitement !='express'")
	Tarification getCaution(@Param("codeProduit") Long codeProduit);
	@Query("select t from Tarification t where t.code_produit = :codeProduit ")
	Tarification getTaux(@Param("codeProduit") Long codeProduit);
	
	@Query("select t from Tarification t where t.code_produit = :codeProduit and t.duree1 < :duree and t.duree2 >= :duree ")
	Tarification getTauxCreditDom(@Param("codeProduit") Long codeProduit,@Param("duree") int duree);
	
	@Query("select t from Tarification t where t.code_produit = :codeProduit and t.ca1 <= :capital and t.ca2 >= :capital and t.type_ca= :ca and t.type_acheteur= :acheteur and t.type_risque=:risque")
	Tarification getTauxCreditExportCapital(@Param("codeProduit") Long codeProduit,@Param("capital") Long capital,@Param("ca") String ca,@Param("acheteur") String acheteur,@Param("risque") String risque);

	@Query("select t from Tarification t where t.code_produit = :codeProduit and t.type_ca= :ca and t.type_acheteur= :acheteur and t.type_risque=:risque")
	Tarification getTauxCreditExport(@Param("codeProduit") Long codeProduit,@Param("ca") String ca,@Param("acheteur") String acheteur,@Param("risque") String risque);
}
