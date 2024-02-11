package sn.jmad.sonac.repository;

import sn.jmad.sonac.model.Contact;
import sn.jmad.sonac.model.Filiale;
import sn.jmad.sonac.model.Pays;

import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
	
	@Query(
			"select contact"
				+ " from Contact contact"
				+ " where contact.cont_numero = :id"
		)
	Optional<Contact> findByNum(@Param("id") Long cont_numero);
	@Query("select contact"
			+ " from Contact contact"
			+ " where contact.active = :id ORDER BY contact.cont_numero"
			)
	List<Contact> allContacts(@Param("id") int a);
	
	@Query(
			"select contact"
				+ " from Contact contact"
				+ " where contact.cont_numeroclient = :id AND contact.active=1 ORDER BY contact.cont_numero"
		)
	List<Contact> AllContactByClient(@Param("id") Long num);
	@Query(
			"select contact"
				+ " from Contact contact"
				+ " where contact.active = :id AND contact.active=1 AND "
				+ "contact.cont_mandataire= true ORDER BY contact.cont_numero"
		)
	List<Contact> AllMandataire(@Param("id") int id);
	@Query(
			"select contact"
				+ " from Contact contact"
				+ " where contact.cont_numeroclient = :id AND contact.active=1 AND contact.cont_mandataire= true ORDER BY contact.cont_numero"
		)
	List<Contact> AllMandataireByClient(@Param("id") Long num);
	
	@Query(
			"select count(*) "
				+ " from Contact contact"
				+ " where contact.cont_leader =:leader AND contact.cont_numeroclient= :id AND contact.active=1"
		)
	Long findByLeaderClient(@Param("id") Long cont_client,@Param("leader") boolean leader);
	@Query(
			"select count(*) "
				+ " from Contact contact"
				+ " where contact.cont_mandataire =:madataire AND contact.cont_numeroclient= :id AND contact.active=1"
		)
	Long findMandataire(@Param("id") Long cont_client,@Param("madataire") boolean madataire);
	@Query(nativeQuery = true,
			value="select *"
				+ " from Contact contact"
				+ " where contact.cont_numeroclient= :numclient and contact.cont_leader = true  AND contact.active=1 ORDER BY contact.cont_numero limit 1"
		)
	Contact findContactPrincipal(@Param("numclient") Long numclient);
	
	@Query(
			"select count(*) "
				+ " from Contact contact"
				+ " where contact.cont_leader = true AND contact.cont_numeroclient= :id AND contact.active=1"
		)
	Integer findNbLeaderByClient(@Param("id") Long cont_client);
	
}