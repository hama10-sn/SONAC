package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Intermediaire;
import sn.jmad.sonac.model.Prospect;
import sn.jmad.sonac.model.Taxe;
import sn.jmad.sonac.model.Utilisateur;

@Repository
public interface ProspectRepository extends JpaRepository<Prospect, Long> {
	@Query("select prosp from Prospect prosp where prosp.prospc_numero = :numero")

	Prospect findByNumero(@Param("numero") Long numero);

//	@Query("from Prospect prosp where prosp.active = 1 ORDER BY prosp.prospc_numero")
//	List<Prospect> findAllProspect();

	@Query("from Prospect prosp where prosp.active = 1 and prospc_statut = 3 ORDER BY prosp.prospc_numero")
	List<Prospect> findAllProspect();
	
	@Query("from Prospect prosp where prosp.active = 1 and (prospc_statut = 1 OR prospc_statut = 2) ORDER BY prosp.prospc_numero")
	List<Prospect> findAllProspectAttente();
	
	@Query("from Prospect prosp where prosp.active = 1 and prospc_statut = 4 ORDER BY prosp.prospc_numero")
	List<Prospect> findAllProspectTransformes();

	@Query("select prosp from Prospect prosp where prosp.prospc_numero = :id")

	Prospect findByProsp(@Param("id") Long id);

	@Query("from Prospect prosp where prosp.prospc_nature = '1' and prosp.active = 1  ORDER BY prosp.prospc_numero")
	List<Prospect> allProspectPhysique();

	@Query("from Prospect prosp where prosp.prospc_nature = '2' and prospc_statut = 3 and prosp.active = 1  ORDER BY prosp.prospc_numero")
	List<Prospect> allProspectMorale();

	@Query("select prosp from Prospect prosp where prosp.active = 1 and prosp.prospc_ninea = :ninea")
	Prospect findProspectByNinea(@Param("ninea") String ninea);

	@Query("select prosp from Prospect prosp where prosp.active = 1 and prosp.prospc_registrecommerce = :coderc")
	Prospect findProspectByRC(@Param("coderc") String coderc);

//	@Query("select prosp from Prospect prosp where prosp.active = 1 and prosp.prospc_ninea = :ninea OR prosp.prospc_registrecommerce = :coderc ")
//	Prospect findByNineaOrRC(@Param("ninea") String ninea, @Param("coderc") String coderc);
	
	@Query(nativeQuery = true,
			value="SELECT prospc_numero, active, list_document_valide, prospc_activitecommercante, prospc_adressenumero, prospc_adresserue, prospc_adresseville, prospc_capitalsocial, prospc_categosocioprof, prospc_chiffreaffaireannuel, prospc_cin, prospc_classificationmetier, prospc_date_relation, prospc_datemodification, prospc_datenaissance, prospc_denomination, prospc_email, prospc_facebook, prospc_id, prospc_linkdin, prospc_nature, prospc_ninea, prospc_nom, prospc_passeport, prospc_portable, prospc_prenom, prospc_princdirigeant, prospc_registrecommerce, prospc_sigle, prospc_statut, prospc_telephone1, prospc_telephone2, prospc_titre, prospc_typesociete, prospc_utilisateur, prospc_website "
					+ "FROM Prospect prospc "
					+ "WHERE prospc.active = 1 and prospc.prospc_statut = 3 "
					+ "AND CAST(prospc.prospc_datemodification AS VARCHAR) >= :date_debut "
					+ "ORDER BY prospc_numero")
	List<Prospect> allProspectNonTransformesApartirDuMois(@Param("date_debut") String date_debut);
	
	@Query(nativeQuery = true,
			value="SELECT prospc_numero, active, list_document_valide, prospc_activitecommercante, prospc_adressenumero, prospc_adresserue, prospc_adresseville, prospc_capitalsocial, prospc_categosocioprof, prospc_chiffreaffaireannuel, prospc_cin, prospc_classificationmetier, prospc_date_relation, prospc_datemodification, prospc_datenaissance, prospc_denomination, prospc_email, prospc_facebook, prospc_id, prospc_linkdin, prospc_nature, prospc_ninea, prospc_nom, prospc_passeport, prospc_portable, prospc_prenom, prospc_princdirigeant, prospc_registrecommerce, prospc_sigle, prospc_statut, prospc_telephone1, prospc_telephone2, prospc_titre, prospc_typesociete, prospc_utilisateur, prospc_website "
					+ "FROM Prospect prospc "
					+ "WHERE prospc.active = 1 and prospc.prospc_statut = 3 "
					+ "AND CAST(prospc_datemodification AS VARCHAR) BETWEEN SYMMETRIC :date_debut AND :date_fin "
					+ "ORDER BY prospc_numero")
	List<Prospect> allProspectNonTransformesParPeriode(@Param("date_debut") String date_debut, @Param("date_fin") String date_fin);
	
	@Query(nativeQuery = true,
			value="SELECT prospc_numero, active, list_document_valide, prospc_activitecommercante, prospc_adressenumero, prospc_adresserue, prospc_adresseville, prospc_capitalsocial, prospc_categosocioprof, prospc_chiffreaffaireannuel, prospc_cin, prospc_classificationmetier, prospc_date_relation, prospc_datemodification, prospc_datenaissance, prospc_denomination, prospc_email, prospc_facebook, prospc_id, prospc_linkdin, prospc_nature, prospc_ninea, prospc_nom, prospc_passeport, prospc_portable, prospc_prenom, prospc_princdirigeant, prospc_registrecommerce, prospc_sigle, prospc_statut, prospc_telephone1, prospc_telephone2, prospc_titre, prospc_typesociete, prospc_utilisateur, prospc_website "
					+ "FROM Prospect prospc "
					+ "WHERE prospc.active = 1 and prospc.prospc_statut = 3 "
					+ "AND CAST(prospc_datemodification AS VARCHAR) >= to_char(CURRENT_DATE - INTERVAL '2 months', 'YYYY-MM-01') "
					+ "ORDER BY prospc_numero")
	List<Prospect> allProspectNonTransformesDepuisXMois(@Param("nbreMois") String nbreMois);
}
