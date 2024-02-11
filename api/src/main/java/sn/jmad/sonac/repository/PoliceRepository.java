package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.PoliceConsultation;
import sn.jmad.sonac.model.Police;

@Repository
public interface PoliceRepository extends JpaRepository<Police, Long> {
	
	@Query("from Police poli where poli.poli_status=1 ORDER BY poli.poli_numero")
	List<Police> findAllPolice();
	
	@Query("select poli from Police poli where poli.poli_numero =:id and poli.poli_status=1")
	Police findByPolice(@Param("id") Long id);
	
	@Query("from Police poli where poli.poli_status=1 and poli.poli_intermediaire =:num")
	List<Police> findPoliceByIntermediaire(@Param("num") Long num);
	
	@Query("from Police poli where poli.poli_status=1 and poli.poli_client =:num order by poli.poli_numero")
	List<Police> findPoliceByClient(@Param("num") Long num);
	
	@Query("from Police poli where poli.poli_status=1 and (poli.poli_branche=14 OR poli.poli_branche=16) and poli.poli_client =:num order by poli.poli_numero")
	List<Police> findPoliceByClientAndBranche(@Param("num") Long num);
	
	@Query("from Police poli where poli.poli_status=1 and poli.poli_branche=15 and poli.poli_client =:num order by poli.poli_numero")
	List<Police> findPoliceByClientAndBrancheCaution(@Param("num") Long num);
	
	@Query("from Police poli where poli.poli_status=1 and poli.poli_compagnie =:num")
	List<Police> findPoliceByCompagnie(@Param("num") String num);

	@Query("select poli.poli_numerodernieravenant from Police poli where poli.poli_status=1 and poli.poli_numero =:num")
	Long findNumAvenantByPolice(@Param("num") Long num);
	

	/*
	 * Les méthodes suivantes servent éssenetiellement à faire la consultation et édition de la police
	 * 
	 */
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPorteFeuillePoliceConsultation();
	
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "AND CAST(poli.poli_dateecheance AS DATE) >= CAST(NOW() AS DATE) "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPoliceConsultation();
	
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "AND CAST(poli.poli_dateecheance AS DATE) >= CAST(NOW() AS DATE) and poli.poli_client =:numClient "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPoliceConsultationByClient(@Param("numClient") Long numClient);
	
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "AND CAST(poli.poli_dateecheance AS DATE) >= CAST(NOW() AS DATE) and poli.poli_codeproduit =:numProd "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPoliceConsultationByProduit(@Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "AND CAST(poli.poli_dateecheance AS DATE) >= CAST(NOW() AS DATE) and poli.poli_intermediaire =:numInterm "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPoliceConsultationByIntermediaire(@Param("numInterm") Long numInterm);
	
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "AND CAST(poli.poli_dateecheance AS DATE) >= CAST(NOW() AS DATE) "
					+ "AND poli.poli_client =:numClient and poli.poli_codeproduit =:numProd "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPoliceConsultationByClientAndProduit(@Param("numClient") Long numClient, @Param("numProd") Long numProd);
	
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "AND CAST(poli.poli_dateecheance AS DATE) >= CAST(NOW() AS DATE) "
					+ "AND poli.poli_client =:numClient and poli.poli_intermediaire =:numInterm "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPoliceConsultationByClientAndIntermediaire(@Param("numClient") Long numClient, @Param("numInterm") Long numInterm);
	
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "AND CAST(poli.poli_dateecheance AS DATE) >= CAST(NOW() AS DATE) "
					+ "AND poli.poli_codeproduit =:numProd and poli.poli_intermediaire =:numInterm "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPoliceConsultationByProduitAndIntermediaire(@Param("numProd") Long numProd, @Param("numInterm") Long numInterm);
	
	@Query(nativeQuery = true,
			value="SELECT poli_numero, prod.prod_numero, prod.prod_denominationlong, inter.inter_numero, inter.inter_denomination, cl.clien_numero, cl.clien_nom, cl.clien_prenom, cl.clien_denomination, cl.clien_sigle, poli_primenetreference, poli_primebruttotal, poli_dateeffetencours, poli_dateecheance, poli_datemodification "
					+ "FROM Police poli, Produit prod, Intermediaire inter, Client cl "
					+ "WHERE poli.poli_codeproduit = prod.prod_numero AND poli.poli_intermediaire = inter.inter_numero "
					+ "AND poli.poli_client = cl.clien_numero AND poli.poli_status=1 "
					+ "AND CAST(poli.poli_dateecheance AS DATE) >= CAST(NOW() AS DATE) "
					+ "AND poli.poli_client =:numClient and poli.poli_codeproduit =:numProd and poli.poli_intermediaire =:numInterm "
					+ "ORDER BY poli.poli_numero")
	List<PoliceConsultation> findAllPoliceConsultationByCriteres(@Param("numClient") Long numClient, @Param("numProd") Long numProd, @Param("numInterm") Long numInterm);
		
	@Query("from Police poli where poli.poli_status=1 and poli.poli_codeproduit <= 15001001 and poli.poli_codeproduit >= 15001005 ORDER BY poli.poli_numero")
	List<Police> findAllPoliceCred();
	@Query("from Police poli where poli.poli_status=1 and poli.poli_codeproduit <= 15001001 and poli.poli_codeproduit >= 15001005 and poli.poli_client =:num order by poli.poli_numero")
	List<Police> findPoliceByClientCred(@Param("num") Long num);
	
	@Query("from Police poli where poli.poli_status=1 and (poli.poli_codeproduit >= 15001001 and poli.poli_codeproduit <= 15001005) and poli.poli_client = :num order by poli.poli_numero")
	List<Police> findPoliceByClientCMT(@Param("num") Long num);
	
	@Query("from Police poli where poli.poli_status=1 and (poli.poli_codeproduit < 15001001 or poli.poli_codeproduit > 15001005) and poli.poli_client =:num order by poli.poli_numero")
	List<Police> findPoliceByClientAUTRE(@Param("num") Long num);
	
	
}
