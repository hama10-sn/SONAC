package sn.jmad.sonac.repository;

//import java.util.Optional;

import sn.jmad.sonac.model.Utilisateur;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
  //  Optional<Utilisateur> findByUtil_login(String util_login);
	@Query("select utilisateur from Utilisateur utilisateur where utilisateur.util_status != 'D' and utilisateur.util_email = :id")
	Utilisateur findByMail(@Param("id") String util_email);
    //Boolean existsByEmail(String email);
    @Query("select utilisateur from Utilisateur utilisateur where utilisateur.util_id = :id")
	Utilisateur findByIdd(@Param("id") Long id);
    @Query("select utilisateur from Utilisateur utilisateur where utilisateur.util_login = :id")
	Utilisateur findByLogin(@Param("id") String util_login);
    @Query("from Utilisateur utilisateur where utilisateur.util_status != 'D' order by utilisateur.util_nom ASC")
   	List<Utilisateur> allUsers();
    
    @Query("select utilisateur from Utilisateur utilisateur where utilisateur.util_numero = :id")
	Utilisateur findByNumero(@Param("id") String id);
    
    @Query("select utilisateur from Utilisateur utilisateur where utilisateur.util_telephoneportable = :num and  utilisateur.util_status != 'D'")
	Utilisateur findByNumeroTel(@Param("num") String numTel);
    
    Utilisateur findByToken(String token);
    
    
    
    @Query("select utilisateur from Utilisateur utilisateur where utilisateur.util_direction = :direction")
    List<Utilisateur> findAllByDirection(@Param("direction") String direction);
    
    
    
}