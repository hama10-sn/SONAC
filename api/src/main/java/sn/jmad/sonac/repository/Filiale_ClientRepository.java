package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Filiale_Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface Filiale_ClientRepository extends JpaRepository<Filiale_Client, Long>{

	@Query("select filiale_Client from Filiale_Client filiale_Client where filiale_Client.filcli_numero = :id")
	Filiale_Client findByIdd(@Param("id") Long id);
	
	@Query("select filiale_Client from Filiale_Client filiale_Client where filiale_Client.filcli_codeutilisateur = :id")
    List<Filiale_Client> findByCodeUser(@Param("id") String type);
	
	@Query("select filiale_Client from Filiale_Client filiale_Client where filiale_Client.active = :id order by filiale_Client.filcli_numero desc")
    List<Filiale_Client> allFiliale_Clients(@Param("id") int a);
	
	@Query("select filiale_Client from Filiale_Client filiale_Client where filiale_Client.active = 1 and filiale_Client.fili_codegroupe = :code")
    List<Filiale_Client> findbyClient(@Param("code") Long code);
	
}
