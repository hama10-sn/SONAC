package sn.jmad.sonac.controller;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;import java.util.stream.Collector;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
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
import org.springframework.web.multipart.MultipartFile;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Dem_Pers;
import sn.jmad.sonac.model.Dem_Soc;
import sn.jmad.sonac.model.Intermediaire;
import sn.jmad.sonac.model.Police;
import sn.jmad.sonac.model.Prospect;
import sn.jmad.sonac.model.Utilisateur;
import sn.jmad.sonac.repository.DemPersRepository;
import sn.jmad.sonac.repository.DemSocRepository;
import sn.jmad.sonac.repository.ProspectRepository;
import sn.jmad.sonac.service.ArbitrageService;
import sn.jmad.sonac.service.ProspectService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/prospect/*")

public class ProspectController {

	@Autowired
	ProspectRepository prospectRepository;
	@Autowired
	DemPersRepository demandePersRepository;
	@Autowired
	DemSocRepository demandeSocRepository;
	@Autowired
	ProspectService prospectService;
	@Autowired
	ArbitrageService arbritrageService;

	public static final String DOSSIER = System.getProperty("user.home") + "/dossiers/";

	int personnePhysique = 1;
	int personneMorale = 2;
	int valueStatut = 4;

	@GetMapping(value = "/allProspects")
	public ResponseEntity<?> getallProspects() {
		List<Prospect> Prospect = prospectRepository.findAllProspect();
		if (Prospect.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Prospect>>(Prospect, HttpStatus.OK);
	}

	@GetMapping(value = "/allProspectsAttente")
	public ResponseEntity<?> getallProspectsAttente() {
		List<Prospect> prospects = prospectRepository.findAllProspectAttente();
		if (prospects.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des prospects en attente vide "),
					HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Prospect>>(prospects, HttpStatus.OK);
	}

	@GetMapping(value = "/allProspectsTransformes")
	public ResponseEntity<?> getallProspectsTransformes() {
		List<Prospect> prospectsTransformes = prospectRepository.findAllProspectTransformes();
		if (prospectsTransformes.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("La liste des prospects transformés en client est vide !"),
					HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Prospect>>(prospectsTransformes, HttpStatus.OK);
	}

	@PostMapping("/addProspect")

	public ResponseEntity<?> saveProspect(@Valid @RequestBody Prospect prospect) {

		if (prospect == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.BAD_REQUEST);

		// On vérifie que ni le Ninéa et le RC n'existe pas d'abord
		if (prospect.getProspc_ninea() != null && !prospect.getProspc_ninea().equals("")) {

			Prospect prospectNinea = prospectRepository.findProspectByNinea(prospect.getProspc_ninea().trim());

			if (prospectNinea != null) {
				return new ResponseEntity<>(new ResponseMessage("Ce numero de ninea existe dejà !"),
						HttpStatus.BAD_REQUEST);
			}
		}

//		System.out.println("RC: "+ prospect.getProspc_registrecommerce());

		if (prospect.getProspc_registrecommerce() != null && !prospect.getProspc_registrecommerce().equals("")) {

			Prospect prospectRC = prospectRepository.findProspectByRC(prospect.getProspc_registrecommerce().trim());

			if (prospectRC != null) {
				return new ResponseEntity<>(new ResponseMessage("Ce numero registre de commerce existe dejà !"),
						HttpStatus.BAD_REQUEST);
			}
		}

		// Mettre en majuscule certains champs
		if (prospect.getProspc_nom() != null && !prospect.getProspc_nom().equals("")) {
			prospect.setProspc_nom(prospect.getProspc_nom().toUpperCase());
		}
		if (prospect.getProspc_prenom() != null && !prospect.getProspc_prenom().equals("")) {
			prospect.setProspc_prenom(prospect.getProspc_prenom().toUpperCase());
		}
		if (prospect.getProspc_denomination() != null && !prospect.getProspc_denomination().equals("")) {
			prospect.setProspc_denomination(prospect.getProspc_denomination().toUpperCase());
		}
		if (prospect.getProspc_sigle() != null && !prospect.getProspc_sigle().equals("")) {
			prospect.setProspc_sigle(prospect.getProspc_sigle().toUpperCase());
		}

		Date dateModification = new Date();
		prospect.setProspc_datemodification(dateModification);
		prospect.setActive(1);
		Prospect savedProspect = prospectRepository.save(prospect);
		if (savedProspect != null) {
			System.out.println("Saved prospect: " + savedProspect);
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Prospect enregistré avec succès !"),
					HttpStatus.OK);
		}
		System.out.println("Echec Saved prospect: " + savedProspect);
		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("Echec: Vérifier que le prospect n'existe pas déjà"), HttpStatus.NOT_FOUND);

	}

	@PutMapping("/editProspect")
	public ResponseEntity<?> editProspect(@RequestBody Prospect prospect) {
		Prospect prospectUpdate = prospectRepository.findByProsp(prospect.getProspc_numero());
		prospect.setActive(1);
		prospect.setProspc_datemodification(prospectUpdate.getProspc_datemodification());
		prospect.setProspc_id(prospectUpdate.getProspc_id());

//					System.out.println("Ninea: " + client.getClien_ninea());
//					System.out.println("RC: " + client.getClien_registrecommerce());

		if (prospect.getProspc_ninea() != null && !prospect.getProspc_ninea().equals("")) {

			Prospect prospectNinea = prospectRepository.findProspectByNinea(prospect.getProspc_ninea().trim());

			if ((prospectNinea != null) && (prospectNinea.getProspc_numero() != prospect.getProspc_numero())) {
				return new ResponseEntity<>(new ResponseMessage("Ce numero de ninea existe dejà !"),
						HttpStatus.BAD_REQUEST);
			}
		}

//		System.out.println("RC: "+ prospect.getProspc_registrecommerce());

		if (prospect.getProspc_registrecommerce() != null && !prospect.getProspc_registrecommerce().equals("")) {

			Prospect prospectRC = prospectRepository.findProspectByRC(prospect.getProspc_registrecommerce().trim());

			if ((prospectRC != null) && (prospectRC.getProspc_numero() != prospect.getProspc_numero())) {
				return new ResponseEntity<>(new ResponseMessage("Ce numero registre de commerce existe dejà !"),
						HttpStatus.BAD_REQUEST);
			}
		}

		// Mettre en majuscule certains champs
		if (prospect.getProspc_nom() != null && !prospect.getProspc_nom().equals("")) {
			prospect.setProspc_nom(prospect.getProspc_nom().toUpperCase());
		}
		if (prospect.getProspc_prenom() != null && !prospect.getProspc_prenom().equals("")) {
			prospect.setProspc_prenom(prospect.getProspc_prenom().toUpperCase());
		}
		if (prospect.getProspc_denomination() != null && !prospect.getProspc_denomination().equals("")) {
			prospect.setProspc_denomination(prospect.getProspc_denomination().toUpperCase());
		}
		if (prospect.getProspc_sigle() != null && !prospect.getProspc_sigle().equals("")) {
			prospect.setProspc_sigle(prospect.getProspc_sigle().toUpperCase());
		}

		Prospect prosp = prospectRepository.save(prospect);
		if (prosp == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(new ResponseMessage("prospect modifiée avec succès !"), HttpStatus.OK);

	}

	@GetMapping(value = "/deleteProspect/{numero}")
	public ResponseEntity<?> deleteProspect(@PathVariable(value = "numero") Long numero) {

		Prospect prosp = prospectRepository.findByNumero(numero);
		if (prosp != null) {
			prosp.setActive(0);
			prospectRepository.save(prosp);

			return new ResponseEntity<>(new ResponseMessage("Prospect supprimé"), HttpStatus.OK);
		}

		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible"), HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/findprospectbynumero/{numero}")
	public ResponseEntity<?> findProspectByNumero(@PathVariable(value = "numero") Long numero) {

		if (numero != 0) {
			Prospect prosp = prospectRepository.findByNumero(numero);
			if (prosp != null) {

				return new ResponseEntity<Prospect>(prosp, HttpStatus.OK); 
			}

			return new ResponseEntity<Prospect>(prosp, HttpStatus.OK);
		}

		return new ResponseEntity<>(new ResponseMessage("n'existe pas ", null), HttpStatus.OK);

	}

	@GetMapping("/verifDeleteProspectPhysique/{num}")
	public ResponseEntity<?> verifdeleteProspectPhysique(@PathVariable("num") Integer num) {

		List<Dem_Pers> demandePersPhys = demandePersRepository.findDemandePersByProspect(num);
		if (demandePersPhys.isEmpty()) {

			return new ResponseEntity<>(new ResponseMessage("ok"), HttpStatus.OK);
		}

		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible: ce prospect est relié à une demande"),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping("/verifDeleteProspectMorale/{num}")
	public ResponseEntity<?> verifdeleteProspectMorale(@PathVariable("num") Integer num) {

		List<Dem_Soc> demandePersMorales = demandeSocRepository.findDemandeSocByProspect(num);
		if (demandePersMorales.isEmpty()) {

			return new ResponseEntity<>(new ResponseMessage("ok"), HttpStatus.OK);
		}

		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible: ce prospect est relié à une demande"),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping(value = "/allProspectPhysique")
	public ResponseEntity<?> allprospectPhysique() {
		List<Prospect> prospect = prospectRepository.allProspectPhysique();
		System.out.println("liste des prospect physiques : " + prospect);
		if (prospect == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Prospect>>(prospect, HttpStatus.OK);

	}

	@GetMapping(value = "/allProspectMorale")
	public ResponseEntity<?> allprospectmorale() {
		List<Prospect> prospect = prospectRepository.allProspectMorale();
		System.out.println("liste des prospects morales : " + prospect);
		if (prospect == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Prospect>>(prospect, HttpStatus.OK);
	}

	@GetMapping(value = "/findbyNinea/{ninea}")
	public ResponseEntity<?> getProspectByNinea(@PathVariable(value = "ninea") String ninea) {

		Prospect prospectNinea = prospectRepository.findProspectByNinea(ninea.trim());

		if (prospectNinea != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce numero de ninea existe dejà !"),
					HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(new ResponseMessage("ok"), HttpStatus.OK);
	}

	@GetMapping(value = "/findbyRC/{coderc}")
	public ResponseEntity<?> getProspectByRC(@PathVariable(value = "coderc") String coderc) {

		Prospect prospectRC = prospectRepository.findProspectByRC(coderc.trim());

		if (prospectRC != null) {
			return new ResponseEntity<>(new ResponseMessage("Ce numero registre de commerce existe dejà !"),
					HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(new ResponseMessage("ok"), HttpStatus.OK);
	}

	@PostMapping("/upload/{numProspect}")
	public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> multipartFiles,
			@PathVariable("numProspect") String numProspect) throws IOException {
		File dossier = new File(arbritrageService.lireJson()+  "prospect/");
		if (!dossier.exists()) {
			if (dossier.mkdir()) {
				System.out.println("Directory is created!");

			} else {
				System.out.println("Failed to create directory!");
			}
		}

		dossier = new File(arbritrageService.lireJson()+  "prospect/prospect-" + numProspect + "/");
		if (!dossier.exists()) {
			if (dossier.mkdir()) {
				System.out.println("Directory is created!");

			} else {
				System.out.println("Failed to create directory!");
			}
		}

		List<String> filesnames = new ArrayList<>();

		for (MultipartFile file : multipartFiles) {

			String filename = StringUtils.cleanPath(file.getOriginalFilename());
			Path fileStorage = Paths.get(arbritrageService.lireJson()+  "prospect/prospect-" + numProspect + "/", filename).toAbsolutePath()
					.normalize();
			Files.copy(file.getInputStream(), fileStorage, REPLACE_EXISTING);
			filesnames.add(filename);

		}

		return ResponseEntity.ok().body(filesnames);

	}

	@GetMapping("getFiles/{numProspect}")
	public ResponseEntity<List<String>> getFilesRDV(@PathVariable("numProspect") String numProspect) {
		File dir = new File(arbritrageService.lireJson()+  "prospect/prospect-" + numProspect + "/");
		File[] liste = dir.listFiles();

		List<String> files = new ArrayList<>();
		if (liste == null)
			return ResponseEntity.ok().body(files);
		for (File item : liste) {
			if (item.isFile()) {
				files.add(item.getName());

			}
		}
		return ResponseEntity.ok().body(files);
	}

	@GetMapping("download/{numProspect}/{filename}")
	public ResponseEntity<Resource> downloadFilesRDV(@PathVariable("filename") String filename,
			@PathVariable("numProspect") String numProspect) throws IOException {

		Path filePath = Paths.get(arbritrageService.lireJson()+  "prospect/prospect-" + numProspect + "/").toAbsolutePath().normalize()
				.resolve(filename);

		if (!Files.exists(filePath)) {
			throw new FileNotFoundException(filename + " n'existe pas !");

		}

		Resource resource = new UrlResource(filePath.toUri());
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("File-Name", filename);
		httpHeaders.add("Content-Disposition", "attachment;File-Name=" + resource.getFilename());

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
				.headers(httpHeaders).body(resource);

	}

	@GetMapping("delete/{numProspect}/{filename}")
	public ResponseEntity<String> delFileRDV(@PathVariable("filename") String filename,
			@PathVariable("numProspect") String numProspect) throws IOException {

		File f = new File(arbritrageService.lireJson()+  "prospect/prospect-" + numProspect + "/" + filename);
		if (f.delete()) {
			System.out.println(f.getName() + " deleted");
			return ResponseEntity.ok().body(f.getName() + " supprimé");
		} else {
			return ResponseEntity.ok().body("erreur lors de la suppression");
		}

	}

	@PutMapping("/transformeProspect/{numprospect}")
	public ResponseEntity<?> transformeProspect(@PathVariable Long numprospect) {

		Prospect prospectTransforme = prospectRepository.findByProsp(numprospect);
		if (prospectTransforme == null) {
			return new ResponseEntity<>(new ResponseMessage("Ce prospect n'existe pas !"), HttpStatus.NOT_FOUND);
		}

		prospectTransforme.setProspc_statut(valueStatut);

		Prospect prospect = prospectRepository.save(prospectTransforme);

		if (prospect == null)
			return new ResponseEntity<>(new ResponseMessage("Mise à jour du prospect transformé non effective !"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(new ResponseMessage("prospect transformé avec succès !"), HttpStatus.OK);

	}

	@GetMapping(value = "/allProspectNonTransformesApartirDuMois/{date_debut}")
	public ResponseEntity<?> getAllProspectNonTransformesApartirDuMois(@PathVariable String date_debut) {

		List<Prospect> allProspects = prospectRepository.allProspectNonTransformesApartirDuMois(date_debut);

		return new ResponseEntity<List<Prospect>>(allProspects, HttpStatus.OK);
	}
	
	@GetMapping(value = "/allProspectNonTransformesParPeriode/{date_debut}/{date_fin}")
	public ResponseEntity<?> getAllProspectNonTransformesParPeriode(@PathVariable String date_debut, 
																	@PathVariable String date_fin) {

		List<Prospect> allProspects = prospectRepository.allProspectNonTransformesParPeriode(date_debut, date_fin);

		return new ResponseEntity<List<Prospect>>(allProspects, HttpStatus.OK);
	}
	
	@GetMapping(value = "/allProspectNonTransformesDepuisXMois/{nbre_mois}")
	public ResponseEntity<?> getAllProspectNonTransformesDepuisXMois(@PathVariable String nbre_mois) throws ParseException {

//		System.out.println("============================ Mois : "+ nbreMois);
//		String param = "to_char(CURRENT_DATE - INTERVAL '5 months', 'YYYY-MM-01')" ;
//		SimpleDateFormat dateformat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
//		Date dateModif = dateformat.parse("2022-07-01 10:20:15.565") ;
//		List<Prospect> allProspects = prospectRepository.findAllProspect();
//		List<Prospect> allProspectsFiltrer = allProspects.stream().filter(prospect->prospect.getProspc_datemodification().getTime() >= dateModif.getTime()).collect(Collectors.toList());

//		Date maDate = new SimpleDateFormat("yyyy-MM-dd").parse("INTERVAL '2 months'");
		List<Prospect> allProspects = prospectRepository.allProspectNonTransformesDepuisXMois(nbre_mois);
		return new ResponseEntity<List<Prospect>>(allProspects, HttpStatus.OK);
	}

	@GetMapping("report/prospectNonTranformes/{format}/{title}/{demandeur}/{dateDebut}/{dateFin}/{periodeNombreMois}")
	public @ResponseBody void generateReportProspect(HttpServletResponse response,
			@PathVariable String format, @PathVariable String title, @PathVariable String demandeur,
			@PathVariable String dateDebut, @PathVariable String dateFin, @PathVariable Long periodeNombreMois) throws JRException, FileNotFoundException {

		prospectService.generateReportProspect(response, format, title, demandeur, dateDebut, dateFin, periodeNombreMois);
	}

}