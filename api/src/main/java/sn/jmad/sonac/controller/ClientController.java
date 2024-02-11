package sn.jmad.sonac.controller;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.ClientContact;
import sn.jmad.sonac.message.response.PoliceClient;
import sn.jmad.sonac.message.response.PoliceProduit;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Compagnie;
import sn.jmad.sonac.model.Intermediaire;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Prospect;
import sn.jmad.sonac.model.Utilisateur;
import sn.jmad.sonac.repository.CimaCodificationCompagniRepository;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.PoliceRepository;
import sn.jmad.sonac.service.ArbitrageService;
import sn.jmad.sonac.service.ClientService;
import sn.jmad.sonac.service.constantes.ParamConst;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/client/*")

public class ClientController {

	// public static final String DOSSIER = System.getProperty("user.home") +
	// "/dossiers/"; // birane
	public static final String DOSSIER = "dossiers/"; // birane

	@Autowired
	ClientRepository clientRepository;

	@Autowired
	PoliceRepository policeRepository;

	@Autowired
	ClientService clientService;
	@Autowired
	ArbitrageService arbritrageService;

	@PostMapping("/addClient")

	public ResponseEntity<?> saveclient(@Valid @RequestBody Client client) {
		Long numClient;
		if (client == null) {
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("une erreur est survenue: vérifiez vos informations !"),
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
//		Client clientExist = clientRepository.findByNumClient(client.getClien_numero());
//		if (clientExist != null) {
//			return new ResponseEntity<ResponseMessage>(new ResponseMessage("le numéro de client existe déjà"),
//					HttpStatus.OK);
//		} else {

		if (client.getClien_ninea() != null && !client.getClien_ninea().equals("")) {

			Client clientNinea = clientRepository.findClientByNinea(client.getClien_ninea().trim());

			if (clientNinea != null) {
				return new ResponseEntity<>(new ResponseMessage("Ce numero de ninea existe dejà !"),
						HttpStatus.BAD_REQUEST);
			}
		}

		if (client.getClien_registrecommerce() != null && !client.getClien_registrecommerce().equals("")) {

			Client clientRC = clientRepository.findClientByRC(client.getClien_registrecommerce().trim());

			if (clientRC != null) {
				return new ResponseEntity<>(new ResponseMessage("Ce numero registre de commerce existe dejà !"),
						HttpStatus.BAD_REQUEST);
			}
		}

		client.setActive(1);

		if (client.getClien_nom() != null && !client.getClien_nom().equals("")) {
			client.setClien_nom(client.getClien_nom().toUpperCase());
		}
		if (client.getClien_prenom() != null && !client.getClien_prenom().equals("")) {
			client.setClien_prenom(client.getClien_prenom().toUpperCase());
		}
		if (client.getClien_denomination() != null && !client.getClien_denomination().equals("")) {
			client.setClien_denomination(client.getClien_denomination().toUpperCase());
		}
		if (client.getClien_sigle() != null && !client.getClien_sigle().equals("")) {
			client.setClien_sigle(client.getClien_sigle().toUpperCase());
		}

		clientRepository.save(client);
//		}

		// birane

		numClient = client.getClien_numero();
		System.out.println("Numéro de client : " + numClient);

		File dossier = new File(arbritrageService.lireJson() + "client-" + numClient + "/");
		if (!dossier.exists()) {
			if (dossier.mkdir()) {
				System.out.println("Directory client is created!");

			} else {
				System.out.println("Failed to create directory!");
			}
		}
		File dossierAutre = new File(arbritrageService.lireJson() + "client-" + numClient + "/divers/");
		if (dossierAutre.mkdir()) {
			System.out.println("Directory divers is created!");
		} else {
			System.out.println("Failed to create directory!");
		}
		File dossierDownload = new File(arbritrageService.lireJson() + "client-" + numClient + "/sinistres/");
		if (dossierDownload.mkdir()) {
			System.out.println("Directory sinistres is created!");
		} else {
			System.out.println("Failed to create directory!");
		}
		/*
		 * File dossierClient = new File(arbritrageService.lireJson()+ "client-" +
		 * numClient + "/client/"); if (dossierClient.mkdir()) {
		 * System.out.println("Directory autre client is created!"); } else {
		 * System.out.println("Failed to create directory!"); }
		 */
		File dossierInfoAdmin = new File(arbritrageService.lireJson() + "client-" + numClient + "/administratif/");
		if (dossierInfoAdmin.mkdir()) {
			System.out.println("Directory administratif is created!");
		} else {
			System.out.println("Failed to create directory!");
		}
		/*
		 * File dossierDemandes = new File(arbritrageService.lireJson()+ "client-" +
		 * numClient + "/demandes/"); if (dossierDemandes.mkdir()) {
		 * System.out.println("Directory autre client is created!"); } else {
		 * System.out.println("Failed to create directory!"); }
		 */
		File dossierContrats = new File(arbritrageService.lireJson() + "client-" + numClient + "/contrats/");
		if (dossierContrats.mkdir()) {
			System.out.println("Directory contrats is created!");
		} else {
			System.out.println("Failed to create directory!");
		}
		File dossierFinanciers = new File(arbritrageService.lireJson() + "client-" + numClient + "/financiers/");
		if (dossierFinanciers.mkdir()) {
			System.out.println("Directory financiers is created!");
		} else {
			System.out.println("Failed to create directory!");
		}

//		return new ResponseEntity<Long>(numClient, HttpStatus.OK);
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("Le client " + numClient + " est enregistré avec succès"), HttpStatus.OK);
	}

	@GetMapping(value = "/allclients")
	public ResponseEntity<?> getallclients() {
		List<Client> clients = clientRepository.allclients();
		if (clients.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Client>>(clients, HttpStatus.OK);

	}

	@GetMapping(value = "/allclientsattente")
	public ResponseEntity<?> getallclientsattente() {
		List<Client> clients = clientRepository.allclientsAttente();
		if (clients.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des clients en attente vide "),
					HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Client>>(clients, HttpStatus.OK);

	}

	@GetMapping(value = "/allclientPhysique")
	public ResponseEntity<?> allclientphysique() {
		List<Client> client = clientRepository.allclientphysique();
		System.out.println("liste des clients physiques : " + client);
		if (client == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Client>>(client, HttpStatus.OK);

	}

	@GetMapping(value = "/allclientMorale")
	public ResponseEntity<?> allclientmorale() {
		List<Client> client = clientRepository.allclientmorale();
		System.out.println("liste des clients morales : " + client);
		if (client == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Client>>(client, HttpStatus.OK);

	}

	@PutMapping("/editClient")
	public ResponseEntity<?> editClient(@RequestBody Client client) {
//		System.out.println("========id client: "+ client.getClien_numero());
		Long numClient;
		Client clientUpdate = clientRepository.findByNumClient(client.getClien_numero());
		if (clientUpdate == null)
			return new ResponseEntity<>(new ResponseMessage("ce client n'existe pas"), HttpStatus.NOT_FOUND);

		if (client.getClien_ninea() != null && !client.getClien_ninea().equals("")) {

			Client clientNinea = clientRepository.findClientByNinea(client.getClien_ninea().trim());

			if (clientNinea != null
					&& clientNinea.getClien_numero() != Long.parseLong(client.getClien_numero().toString()))
				return new ResponseEntity<>(new ResponseMessage("Ce numero de ninea existe dejà !"),
						HttpStatus.BAD_REQUEST);
		}

		if (client.getClien_registrecommerce() != null && !client.getClien_registrecommerce().equals("")) {

			Client clientRC = clientRepository.findClientByRC(client.getClien_registrecommerce().trim());

			if (clientRC != null && clientRC.getClien_numero() != Long.parseLong(client.getClien_numero().toString()))
				return new ResponseEntity<>(new ResponseMessage("Ce numero registre de commerce existe dejà !"),
						HttpStatus.BAD_REQUEST);
		}

		client.setActive(1);
		client.setClient_id(clientUpdate.getClient_id());

		if (client.getClien_nom() != null && !client.getClien_nom().equals("")) {
			client.setClien_nom(client.getClien_nom().toUpperCase());
		}
		if (client.getClien_prenom() != null && !client.getClien_prenom().equals("")) {
			client.setClien_prenom(client.getClien_prenom().toUpperCase());
		}
		if (client.getClien_denomination() != null && !client.getClien_denomination().equals("")) {
			client.setClien_denomination(client.getClien_denomination().toUpperCase());
		}
		if (client.getClien_sigle() != null && !client.getClien_sigle().equals("")) {
			client.setClien_sigle(client.getClien_sigle().toUpperCase());
		}

		Client clients = clientRepository.save(client);
		numClient = clients.getClien_numero();

//		return new ResponseEntity<ResponseMessage>(new ResponseMessage("client " + numClient + " modifié avec succés"),
//				HttpStatus.OK);
		return new ResponseEntity<Long>(numClient, HttpStatus.OK);

	}

	@PutMapping("/modifClientReprise")
	public ResponseEntity<?> modifClientReprise(@RequestBody Client client) {
//		System.out.println("========id client: "+ client.getClien_numero());
		Long numClient;
		Client clientUpdate = clientRepository.findByNumClient(client.getClien_numero());
		if (clientUpdate == null)
			return new ResponseEntity<>(new ResponseMessage("ce client n'existe pas"), HttpStatus.OK);

		if (client.getClien_ninea() != null && !client.getClien_ninea().equals("")) {

//		Pour la reprise des données et correction du client
			List<Client> listeClientAvecNinea = clientRepository.listFindClientByNinea(client.getClien_ninea().trim());

//			Client clientNinea = clientRepository.findClientByNinea(client.getClien_ninea().trim());

			if (!listeClientAvecNinea.isEmpty() && listeClientAvecNinea.get(0).getClien_numero() != Long
					.parseLong(client.getClien_numero().toString()))
				return new ResponseEntity<>(new ResponseMessage("Ce numero de ninea existe dejà !"),
						HttpStatus.BAD_REQUEST);
		}

		if (client.getClien_registrecommerce() != null && !client.getClien_registrecommerce().equals("")) {

			List<Client> listeClientRC = clientRepository.listFindClientByRC(client.getClien_registrecommerce().trim());

			if (!listeClientRC.isEmpty()
					&& listeClientRC.get(0).getClien_numero() != Long.parseLong(client.getClien_numero().toString()))
				return new ResponseEntity<>(new ResponseMessage("Ce numero registre de commerce existe dejà !"),
						HttpStatus.BAD_REQUEST);
		}

		client.setActive(1);
		client.setClient_id(clientUpdate.getClient_id());

		if (client.getClien_nom() != null && !client.getClien_nom().equals("")) {
			client.setClien_nom(client.getClien_nom().toUpperCase());
		}
		if (client.getClien_prenom() != null && !client.getClien_prenom().equals("")) {
			client.setClien_prenom(client.getClien_prenom().toUpperCase());
		}
		if (client.getClien_denomination() != null && !client.getClien_denomination().equals("")) {
			client.setClien_denomination(client.getClien_denomination().toUpperCase());
		}
		if (client.getClien_sigle() != null && !client.getClien_sigle().equals("")) {
			client.setClien_sigle(client.getClien_sigle().toUpperCase());
		}

		Client clients = clientRepository.save(client);
		numClient = clients.getClien_numero();

//		return new ResponseEntity<ResponseMessage>(new ResponseMessage("client " + numClient + " modifié avec succés"),
//				HttpStatus.OK);
		return new ResponseEntity<Long>(numClient, HttpStatus.OK);

	}

	@GetMapping("/deleteClient/{num}")
	public ResponseEntity<?> deleteClient(@PathVariable("num") long num) {

		Client client = clientRepository.findByNumClient(num);
		if (client != null) {
			client.setActive(0);
			clientRepository.save(client);
			return new ResponseEntity<>(new ResponseMessage("client supprimé"), HttpStatus.OK);
		}

		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible"), HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping("/verifDeleteClient/{num}")
	public ResponseEntity<?> verifdeleteClient(@PathVariable("num") Long num) {

		List<Police> polices = policeRepository.findPoliceByClient(num);
		if (polices.isEmpty()) {

			return new ResponseEntity<>(new ResponseMessage("ok"), HttpStatus.OK);
		}

		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible: ce client est relié à une police"),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping("getClient/{numcli}")
	public ResponseEntity<?> getClient(@PathVariable(value = "numcli") Long numcli) {
		Client cli = clientRepository.findByNumClient(numcli);
		return new ResponseEntity<Client>(cli, HttpStatus.OK);
	}

	@GetMapping("getClientByNumero/{numcli}")
	public ResponseEntity<?> getClientByNumero(@PathVariable(value = "numcli") Long numcli) {
		Client client = clientRepository.findByNumClient(numcli);

		if (client == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao", "Ce client n'existe pas", client),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Voici le client demandé ", client),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findClientByPolice/{numPolice}")
	public ResponseEntity<?> getClientByPolice(@PathVariable Long numPolice) {
		PoliceClient clientbyPolice = clientRepository.findClientByPolice(numPolice);

		return new ResponseEntity<PoliceClient>(clientbyPolice, HttpStatus.OK);
	}

	@PostMapping("report/{format}")
	public @ResponseBody void generateReportClient(HttpServletResponse response, @PathVariable String format,
			@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
			throws JRException, FileNotFoundException {

		clientService.generateReportClient(response, format, title, demandeur);
	}

	@GetMapping(value = "/allclientandcontact")
	public ResponseEntity<?> getallclientandcontact() {
		List<ClientContact> clients = clientRepository.allclientandcontact();
		if (clients.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<ClientContact>>(clients, HttpStatus.OK);
	}

	@GetMapping("/updateClient/{id}/{ca}/{cs}")
	public ResponseEntity<?> updateMyClient(@PathVariable Long id, @PathVariable Long ca, @PathVariable Long cs) {
		Client client = clientRepository.findByNumClient(id);
		client.setClient_id(id);
		client.setClien_capital_social(cs);
		client.setClien_chiffreaffaireannuel(ca);
		System.out.println("----------haha----" + id);
		System.out.println("----------haha----" + cs);
		System.out.println("----------haha----" + ca);

		Client cli = clientRepository.save(client);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("client " + id + " modifié avec succés"),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findbyNinea/{ninea}")
	public ResponseEntity<?> getClientByNinea(@PathVariable(value = "ninea") String ninea) {

		Client clientNinea = clientRepository.findClientByNinea(ninea.trim());

		if (clientNinea != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce numero de ninea existe dejà !"),
					HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(new ResponseMessage("ok"), HttpStatus.OK);
	}

	@GetMapping(value = "/findbyRC/{rc}")
	public ResponseEntity<?> getClientByRC(@PathVariable(value = "rc") String rc) {

		Client clientRC = clientRepository.findClientByRC(rc.trim());

		if (clientRC != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce numero registre de commerce existe dejà !"),
					HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(new ResponseMessage("ok"), HttpStatus.OK);
	}

	@GetMapping(value = "/findclientbyprospect/{numeroprospect}")
	public ResponseEntity<?> findClientByProspect(@PathVariable(value = "numeroprospect") Long numeroprospect) {

		if (numeroprospect != 0 && !numeroprospect.toString().equals("")) {
			Client client = clientRepository.findClientByProspect(numeroprospect);
			if (client != null) {

				return new ResponseEntity<>(new ResponseMessage("ok", client), HttpStatus.OK);
			}

			return new ResponseEntity<>(new ResponseMessage("vide", client), HttpStatus.OK);
		}

		return new ResponseEntity<>(new ResponseMessage("n'existe pas ", null), HttpStatus.OK);

	}

}
