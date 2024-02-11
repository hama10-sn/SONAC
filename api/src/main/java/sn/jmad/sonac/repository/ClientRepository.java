package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.message.response.ClientContact;
import sn.jmad.sonac.message.response.PoliceClient;

import sn.jmad.sonac.message.response.ClientContact;

import sn.jmad.sonac.model.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long>{
	@Query("select client from Client client where client.client_id = :id")
	Client findByIdd(@Param("id") Long id);
	
	@Query("select client from Client client where client.clien_numero = :clientnum")
	Client findByNumClient(@Param("clientnum") Long clientnum);
		
	@Query("select client from Client client where client.clien_numeroprospect = :numeroprospect")
	Client findClientByProspect(@Param("numeroprospect") Long numeroprospect);
	
	@Query("from Client client where client.active = 1 and client.clien_status = '1' ORDER BY client.client_id")
	List<Client> allclients();
	@Query("from Client client where client.clien_nature = '1' and client.active = 1  and client.clien_status = '1' ORDER BY client.client_id")
	List<Client> allclientphysique();
	@Query("from Client client where client.clien_nature = '2' and client.active = 1  and client.clien_status = '1' ORDER BY client.client_id")
	List<Client> allclientmorale();
	
	 //Gestion des clients en attente
	@Query("from Client client where client.active = 1 and client.clien_status = '2' ORDER BY client.client_id")
	List<Client> allclientsAttente();
	
	@Query("select client from Client client where client.active = 1 and client.clien_status = '1' and client.clien_ninea = :ninea")
	Client findClientByNinea(@Param("ninea") String ninea);
	
	@Query("select client from Client client where client.active = 1 and client.clien_status = '1' and client.clien_ninea = :ninea")
	List<Client> listFindClientByNinea(@Param("ninea") String ninea);
	
	@Query("select client from Client client where client.active = 1 and client.clien_status = '1' and client.clien_registrecommerce = :coderc")
	Client findClientByRC(@Param("coderc") String coderc);
	
	@Query("select client from Client client where client.active = 1 and client.clien_status = '1' and client.clien_registrecommerce = :coderc")
	List<Client> listFindClientByRC(@Param("coderc") String coderc);
	
	@Query(nativeQuery = true,
			value="select cl.clien_numero,cl.clien_nom,cl.clien_denomination,cl.clien_prenom,cl.clien_sigle,cl.clien_nature,cl.clien_telephone1,cl.clien_date_relation,ct.cont_nom,ct.cont_prenom,ct.cont_mobile "
					+ "from Client cl left join Contact ct on ct.cont_numeroclient=cl.clien_numero where cl.active = 1 and cl.clien_status = '1' "
					+ "and (ct.cont_numero=(select ct.cont_numero from Contact ct where ct.cont_numeroclient=cl.clien_numero and ct.cont_leader = true and ct.active=1 Order by ct.cont_numero limit 1 ) or ct.cont_numero is null) Order by cl.clien_numero")
	List<ClientContact> allclientandcontact();
	

	@Query(nativeQuery = true,
			value="select poli_numero, clien_numero, clien_prenom, clien_nom, clien_denomination, clien_sigle,clien_nature "
					+ "from Police poli, Client cl "
					+ "where poli.poli_client = cl.clien_numero "
					+ "and poli.poli_numero =:numPolice")
	PoliceClient findClientByPolice(@Param("numPolice") Long numPolice);

	
}

