package sn.jmad.sonac.controller;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Dem_Pers;
import sn.jmad.sonac.model.Prospect;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.DemPersRepository;
import sn.jmad.sonac.repository.ProspectRepository;
import sn.jmad.sonac.service.ArbitrageService;
import sn.jmad.sonac.service.Emailer;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/dempers/*")
public class DemPersController {
	@Autowired
	DemPersRepository demPersRepository;
	@Autowired
	ClientRepository clientRepository;
	@Autowired
	ArbitrageService arbritrageService;
	@Autowired
	ProspectRepository prospectRepository;

	public static final String DOSSIER = System.getProperty("user.home") + "/dossiers/";

	@PostMapping("/addDemPers")
	public ResponseEntity<?> savePay(@Valid @RequestBody Dem_Pers demPerso) {
		// demPerso.setDem_statut("en attente");
		demPerso.setActif(1);
		if (demPerso.getDem_typeclientpers().equals("CL")) {
			System.out.println("---Titulaire demande---" + demPerso.getDem_typetitulaire());
			System.out.println("---Titulaire Parse---" + Long.valueOf(demPerso.getDem_typetitulaire()));

			Client cli = clientRepository.findByIdd(Long.valueOf(demPerso.getDem_typetitulaire()));
			System.out.println("---Cli Dénomination---" + cli.getClien_denomination());
			demPerso.setDem_entreprise(cli.getClien_denomination());
			System.out.println("---cli---" + cli.getClien_denomination());
		} else {
			Prospect pro = prospectRepository.findByNumero(Long.valueOf(demPerso.getDem_typetitulaire()));
			demPerso.setDem_entreprise(pro.getProspc_denomination());
			System.out.println("--pro----" + pro.getProspc_denomination());

		}
		Dem_Pers dp = demPersRepository.save(demPerso);
		if (dp == null) {

			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement"),
					HttpStatus.NOT_FOUND);

		} else {
			new Emailer().notification(dp.getDem_email(),
					"Bonjour " + dp.getDem_prenom() + " " + dp.getDem_nom() + "\n Votre demande "
							+ dp.getDem_objetdemande() + " a été prise en compte et validée." + "" + "\n Cordialement.",
					"Prise en charge demande");
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Enregistrement reussi", dp), HttpStatus.OK);

			// return new ResponseEntity<ResponseMessage>(new ResponseMessage(dp),
			// HttpStatus.OK) ;

		}
	}

	@GetMapping(value = "/allDemPers")
	public ResponseEntity<?> getAllDemPers() {
		List<Dem_Pers> DemPers = demPersRepository.findAllDem_Pers(1);
		System.out.println("liste des demandes : " + DemPers);
		if (DemPers.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);

		return new ResponseEntity<List<Dem_Pers>>(DemPers, HttpStatus.OK);
	}

	@GetMapping(value = "/allValideDemPers")
	public ResponseEntity<?> getAllValideDemPers() {
		List<Dem_Pers> DemPers = demPersRepository.finddemValide(1);
		System.out.println("liste des demandes : " + DemPers);
		if (DemPers.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);

		return new ResponseEntity<List<Dem_Pers>>(DemPers, HttpStatus.OK);
	}

	@GetMapping(value = "/allPresEmmisionDemPers")
	public ResponseEntity<?> getAllPresEmmisionDemPers() {
		List<Dem_Pers> DemPers = demPersRepository.findDemPreEmission(1);
		System.out.println("liste des demandes : " + DemPers);
		if (DemPers.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);

		return new ResponseEntity<List<Dem_Pers>>(DemPers, HttpStatus.OK);
	}

	@PutMapping(value = "/update")
	public ResponseEntity<?> updateDemPers(@RequestBody Dem_Pers DemPers) {

		Optional<Dem_Pers> c = demPersRepository.findById(DemPers.getDem_persnum());
		if (c.isPresent()) {
			Dem_Pers currentDemPers = c.get();

			currentDemPers.setDem_typeclientpers(DemPers.getDem_typeclientpers());
			currentDemPers.setDem_civilitepers(DemPers.getDem_civilitepers());
			currentDemPers.setDem_typetitulaire(DemPers.getDem_typetitulaire());
			currentDemPers.setDem_nom(DemPers.getDem_nom());
			currentDemPers.setDem_prenom(DemPers.getDem_prenom());
			currentDemPers.setDem_adresse1(DemPers.getDem_adresse1());
			currentDemPers.setDem_adresse2(DemPers.getDem_adresse2());
			currentDemPers.setDem_ville(DemPers.getDem_ville());
			currentDemPers.setDem_secteuractivites(DemPers.getDem_secteuractivites());
			currentDemPers.setDem_comptebancaire(DemPers.getDem_comptebancaire());
			currentDemPers.setDem_telephoneprincipal(DemPers.getDem_telephoneprincipal());
			currentDemPers.setDem_telephone2(DemPers.getDem_telephone2());
			currentDemPers.setDem_telephonemobile(DemPers.getDem_telephonemobile());
			currentDemPers.setDem_email(DemPers.getDem_email());
			currentDemPers.setDem_objetdemande(DemPers.getDem_objetdemande());
			currentDemPers.setDem_produitdemande1(DemPers.getDem_produitdemande1());
			currentDemPers.setDem_produitdemande2(DemPers.getDem_produitdemande2());
			currentDemPers.setDem_produitdemande3(DemPers.getDem_produitdemande3());
			currentDemPers.setDem_soumissionarbitrage(DemPers.getDem_soumissionarbitrage());
			currentDemPers.setDem_codeutilisateur(DemPers.getDem_codeutilisateur());
			currentDemPers.setDem_datemodification(DemPers.getDem_datemodification());
			currentDemPers.setDem_statut(DemPers.getDem_statut());
			currentDemPers.setDem_categorie(DemPers.getDem_categorie());
			currentDemPers.setDem_branch(DemPers.getDem_branch());
			currentDemPers.setDem_commentaire(DemPers.getDem_commentaire());
			currentDemPers.setDem_commentaire2(DemPers.getDem_commentaire2());
			currentDemPers.setDem_montant(DemPers.getDem_montant());
			currentDemPers.setDem_marche(DemPers.getDem_marche());
			currentDemPers.setList_document_valide(DemPers.getList_document_valide());
			currentDemPers.setList_document_lu(DemPers.getList_document_lu());
			currentDemPers.setDem_montant2(DemPers.getDem_montant2());
			currentDemPers.setDem_montant3(DemPers.getDem_montant3());

			demPersRepository.save(currentDemPers);
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("demande modifier avec succès"),
					HttpStatus.OK);
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"),
					HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping(value = "/delete/{id}")
	public ResponseEntity<?> deleteContact(@PathVariable(value = "id") Long id) {

		Optional<Dem_Pers> c = demPersRepository.findByNum(id);

		Dem_Pers currentDem = c.get();
		currentDem.setActif(0);
		demPersRepository.save(currentDem);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("demande supprimer "), HttpStatus.OK);

	}

	@PostMapping("/upload/{numDemande}")
	public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> multipartFiles,
			@PathVariable("numDemande") String numDemande) throws IOException {
			File dossier = new File(arbritrageService.lireJson()+ "demande/");
			if (!dossier.exists()) {
				if (dossier.mkdir()) {
					System.out.println("Directory  is created!");
	
				} else {
					System.out.println("Failed to create directory!");
				}
			}

		dossier = new File(arbritrageService.lireJson()+ "demande/dmd-" + numDemande + "/");
		if (!dossier.exists()) {
			if (dossier.mkdir()) {
				System.out.println("Directory  is created!");

			} else {
				System.out.println("Failed to create directory!");
			}
		}

		List<String> filesnames = new ArrayList<>();

		for (MultipartFile file : multipartFiles) {

			String filename = StringUtils.cleanPath(file.getOriginalFilename());
			Path fileStorage = Paths.get(arbritrageService.lireJson()+ "demande/dmd-" + numDemande + "/", filename).toAbsolutePath().normalize();
			Files.copy(file.getInputStream(), fileStorage, REPLACE_EXISTING);
			filesnames.add(filename);

		}

		return ResponseEntity.ok().body(filesnames);
	}

	@GetMapping("getFiles/{numDemande}")
	public ResponseEntity<List<String>> getFiles(@PathVariable("numDemande") String numDemande) {
		File dir = new File(arbritrageService.lireJson()+ "demande/dmd-" + numDemande + "/");
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

	@GetMapping("download/{numDemande}/{filename}")
	public ResponseEntity<Resource> downloadFiles(@PathVariable("filename") String filename,
			@PathVariable("numDemande") String numDemande) throws IOException {

		Path filePath = Paths.get(arbritrageService.lireJson()+ "demande/dmd-" + numDemande + "/").toAbsolutePath().normalize().resolve(filename);

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

	@GetMapping("delete/{numDemande}/{filename}")
	public ResponseEntity<String> delFile(@PathVariable("filename") String filename,
			@PathVariable("numDemande") String numDemande) throws IOException {

		File f = new File(arbritrageService.lireJson()+ "demande/dmd-" + numDemande + "/" + filename);
		if (f.delete()) {
			System.out.println(f.getName() + " deleted");
			return ResponseEntity.ok().body(f.getName() + " supprimé");
		} else {
			return ResponseEntity.ok().body("erreur lors de la suppression");
		}

	}

	@GetMapping("report/soumission/{id}")
	public @ResponseBody void generateReportClient(HttpServletResponse response, @PathVariable Long id

	) throws JRException, FileNotFoundException {

		arbritrageService.generateReportSoumission(response, id);
	}

	@GetMapping("report/conditionGenerale/{id}")
	public @ResponseBody void generateReportConditionGenerale(HttpServletResponse response, @PathVariable Long id

	) throws JRException, FileNotFoundException {

		arbritrageService.generateReportConditionGenerale(response, id);
	}

	@GetMapping("report/conditionParticuliere/{id}")
	public @ResponseBody void generateReportConditionParticuliere(HttpServletResponse response, @PathVariable Long id

	) throws JRException, FileNotFoundException {

		arbritrageService.generateReportConditionParticulier(response, id);
	}

	@GetMapping("url/{numDemande}/{filename}")
	public ResponseEntity<Path> view(@PathVariable("filename") String filename,
			@PathVariable("numDemande") String numDemande) throws IOException {

		Path filePath = Paths.get(arbritrageService.lireJson()+ "dmd-" + numDemande + "/").toAbsolutePath().normalize().resolve(filename);

		if (!Files.exists(filePath)) {
			throw new FileNotFoundException(filename + " n'existe pas !");

		}

		Resource resource = new UrlResource(filePath.toUri());
		HttpHeaders httpHeaders = new HttpHeaders();
		httpHeaders.add("File-Name", filename);
		httpHeaders.add("Content-Disposition", "attachment;File-Name=" + resource.getFilename());

		return ResponseEntity.ok().body(filePath);

	}

	@GetMapping("downloadI/{numDemande}/{filename}")
	public ResponseEntity<Resource> downloadFilesDossier(@PathVariable("filename") String filename,
			@PathVariable("numDemande") String numDemande) throws IOException {

		// Path filePath = Paths.get(arbritrageService.lireJson()+
		// "client-"+numclient+"/"+dossier+"/").toAbsolutePath().normalize().resolve(filename);
		Path filePath = Paths.get(arbritrageService.lireJson()+ "demande/dmd-" + numDemande + "/").toAbsolutePath().normalize().resolve(filename);
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

	@GetMapping("report/instruction/{id}/{demandeur}")
	public @ResponseBody void generateReportInstruction(HttpServletResponse response, @PathVariable Long id,
			@PathVariable String demandeur

	) throws JRException, FileNotFoundException {

		// arbritrageService.generateReportInstruction(response, id);
		// arbritrageService.generateReportClient(response,"word");
		arbritrageService.word(response, id, demandeur);
	}

	@PostMapping("report/instruction/{id}")
	public @ResponseBody void generateReportInstruction1(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String demandeur, @RequestParam String raisonsociale, @RequestParam String anneerelation

			, @RequestParam String soumission, @RequestParam String avancedemarrage, @RequestParam String bonneexcution,
			@RequestParam String retenuegarantie, @RequestParam String nomgerant, @RequestParam String definitive,
			@RequestParam String cmttotale, @RequestParam String soumissionencours,
			@RequestParam String avancedemarrageencours, @RequestParam String bonneexecutionencours,
			@RequestParam String retenuegarantieencours, @RequestParam String definitiveencours,
			@RequestParam String cmttotaleencours, @RequestParam String policenumero,
			@RequestParam String denomminationsociale, @RequestParam String objetavenant,
			@RequestParam String datesoucription, @RequestParam String beneficiaire,
			@RequestParam String montantavenant, @RequestParam String produitpourcent,
			@RequestParam String presentationgenerale, @RequestParam String presentationtechnique,
			@RequestParam String[] reference, @RequestParam String interetdossier, @RequestParam String conclusion,
			@RequestParam String primenette, @RequestParam String primettc, @RequestParam String mainlevee,
			@RequestParam String taxeassurance, @RequestParam String fed, @RequestParam String date,
			@RequestParam String c1, @RequestParam String c2, @RequestParam String c3, @RequestParam String c4,
			@RequestParam String ml1, @RequestParam String ml2, @RequestParam String ml3, @RequestParam String ml4,
			@RequestParam String ml5, @RequestParam String montantavenent2, @RequestParam String montantavenent3,
			@RequestParam String produitpourcent2, @RequestParam String produitpourcent3,
			@RequestParam String avisaarbitrage, @RequestParam String aviscommerciale)
			throws JRException, FileNotFoundException {

		// arbritrageService.generateReportInstruction(response, id);
		// arbritrageService.generateReportClient(response,"word");
		arbritrageService.wordsociete1(response, id, demandeur, raisonsociale, anneerelation, soumission,
				avancedemarrage, bonneexcution, retenuegarantie, nomgerant, definitive, cmttotale, soumissionencours,
				avancedemarrageencours, bonneexecutionencours, retenuegarantieencours, definitiveencours,
				cmttotaleencours, policenumero, denomminationsociale, objetavenant, datesoucription, beneficiaire,
				montantavenant, produitpourcent, presentationgenerale, presentationtechnique, reference, interetdossier,
				conclusion, primenette, primettc, mainlevee, taxeassurance, fed, date, c1, c2, c3, c4, ml1, ml2, ml3,
				ml4, ml5, montantavenent2, montantavenent3, produitpourcent2, produitpourcent3, avisaarbitrage,
				aviscommerciale);
	}

	@GetMapping("report/instructionCredit/{id}")
	public @ResponseBody void generateReportInstructioncredit(HttpServletResponse response, @PathVariable Long id)
			throws JRException, FileNotFoundException {

		// arbritrageService.generateReportInstruction(response, id);
		// arbritrageService.generateReportClient(response,"word");
		arbritrageService.wordsocieteCredit(response, id);
	}

	@PostMapping("report/instructionCredit/{id}")
	public @ResponseBody void generateReportInstructionCredit(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String demandeur, @RequestParam String raisonsociale, @RequestParam String anneerelation

			, @RequestParam String soumission, @RequestParam String avancedemarrage, @RequestParam String bonneexcution,
			@RequestParam String retenuegarantie, @RequestParam String nomgerant, @RequestParam String definitive,
			@RequestParam String cmttotale, @RequestParam String soumissionencours,
			@RequestParam String avancedemarrageencours, @RequestParam String bonneexecutionencours,
			@RequestParam String retenuegarantieencours, @RequestParam String definitiveencours,
			@RequestParam String cmttotaleencours, @RequestParam String policenumero,
			@RequestParam String denomminationsociale, @RequestParam String objetavenant,
			@RequestParam String datesoucription, @RequestParam String beneficiaire,
			@RequestParam String montantavenant, @RequestParam String produitpourcent,
			@RequestParam String presentationgenerale, @RequestParam String presentationtechnique,
			@RequestParam String[] reference, @RequestParam String interetdossier, @RequestParam String conclusion,
			@RequestParam String primenette, @RequestParam String primettc, @RequestParam String mainlevee,
			@RequestParam String taxeassurance, @RequestParam String fed, @RequestParam String date,
			@RequestParam String c1, @RequestParam String c2, @RequestParam String c3, @RequestParam String c4,
			@RequestParam String ml1, @RequestParam String ml2, @RequestParam String ml3, @RequestParam String ml4,
			@RequestParam String ml5, @RequestParam String montantavenent2, @RequestParam String montantavenent3,
			@RequestParam String produitpourcent2, @RequestParam String produitpourcent3,
			@RequestParam String avisaarbitrage, @RequestParam String aviscommerciale)
			throws JRException, FileNotFoundException {

		// arbritrageService.generateReportInstruction(response, id);
		// arbritrageService.generateReportClient(response,"word");
		arbritrageService.wordsocieteCredit(response, id, demandeur, raisonsociale, anneerelation, soumission,
				avancedemarrage, bonneexcution, retenuegarantie, nomgerant, definitive, cmttotale, soumissionencours,
				avancedemarrageencours, bonneexecutionencours, retenuegarantieencours, definitiveencours,
				cmttotaleencours, policenumero, denomminationsociale, objetavenant, datesoucription, beneficiaire,
				montantavenant, produitpourcent, presentationgenerale, presentationtechnique, reference, interetdossier,
				conclusion, primenette, primettc, mainlevee, taxeassurance, fed, date, c1, c2, c3, c4, ml1, ml2, ml3,
				ml4, ml5, montantavenent2, montantavenent3, produitpourcent2, produitpourcent3, avisaarbitrage,
				aviscommerciale);
	}

	@PostMapping("report/instructionPerte/{id}")
	public @ResponseBody void generateReportInstructionPerte(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String demandeur, @RequestParam String raisonsociale, @RequestParam String anneerelation

			, @RequestParam String soumission, @RequestParam String avancedemarrage, @RequestParam String bonneexcution,
			@RequestParam String retenuegarantie, @RequestParam String nomgerant, @RequestParam String definitive,
			@RequestParam String cmttotale, @RequestParam String soumissionencours,
			@RequestParam String avancedemarrageencours, @RequestParam String bonneexecutionencours,
			@RequestParam String retenuegarantieencours, @RequestParam String definitiveencours,
			@RequestParam String cmttotaleencours, @RequestParam String policenumero,
			@RequestParam String denomminationsociale, @RequestParam String objetavenant,
			@RequestParam String datesoucription, @RequestParam String beneficiaire,
			@RequestParam String montantavenant, @RequestParam String produitpourcent,
			@RequestParam String presentationgenerale, @RequestParam String presentationtechnique,
			@RequestParam String[] reference, @RequestParam String interetdossier, @RequestParam String conclusion,
			@RequestParam String primenette, @RequestParam String primettc, @RequestParam String mainlevee,
			@RequestParam String taxeassurance, @RequestParam String fed, @RequestParam String date,
			@RequestParam String c1, @RequestParam String c2, @RequestParam String c3, @RequestParam String c4,
			@RequestParam String ml1, @RequestParam String ml2, @RequestParam String ml3, @RequestParam String ml4,
			@RequestParam String ml5, @RequestParam String montantavenent2, @RequestParam String montantavenent3,
			@RequestParam String produitpourcent2, @RequestParam String produitpourcent3,
			@RequestParam String avisaarbitrage, @RequestParam String aviscommerciale)
			throws JRException, FileNotFoundException {

		// arbritrageService.generateReportInstruction(response, id);
		// arbritrageService.generateReportClient(response,"word");
		arbritrageService.wordsocietePerte(response, id, demandeur, raisonsociale, anneerelation, soumission,
				avancedemarrage, bonneexcution, retenuegarantie, nomgerant, definitive, cmttotale, soumissionencours,
				avancedemarrageencours, bonneexecutionencours, retenuegarantieencours, definitiveencours,
				cmttotaleencours, policenumero, denomminationsociale, objetavenant, datesoucription, beneficiaire,
				montantavenant, produitpourcent, presentationgenerale, presentationtechnique, reference, interetdossier,
				conclusion, primenette, primettc, mainlevee, taxeassurance, fed, date, c1, c2, c3, c4, ml1, ml2, ml3,
				ml4, ml5, montantavenent2, montantavenent3, produitpourcent2, produitpourcent3, avisaarbitrage,
				aviscommerciale);
	}

	@PostMapping("report/acteAd/{id}")
	public @ResponseBody void generateReportActeAd(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String titre, @RequestParam String dao, @RequestParam String beneficiaire,
			@RequestParam String date, @RequestParam String client, @RequestParam String adresse_client,
			@RequestParam String numero_marche, @RequestParam String date_info,
			@RequestParam String description_travaux, @RequestParam String montant_demande,
			@RequestParam String montant_lettre, @RequestParam String numero_compte, @RequestParam String banque,
			@RequestParam String numero_agrement, @RequestParam String date_expiration)
			throws JRException, FileNotFoundException {

		arbritrageService.wordActeAd(response, id, titre, dao, beneficiaire, date, client, adresse_client,
				numero_marche, date_info, description_travaux, montant_demande, montant_lettre, numero_compte, banque,
				numero_agrement, date_expiration);
	}

	@PostMapping("report/acteSoumis/{id}")
	public @ResponseBody void generateReportActeSoumission(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String titre, @RequestParam String dao, @RequestParam String beneficiaire,
			@RequestParam String date, @RequestParam String client, @RequestParam String adresse_client,
			@RequestParam String numero_marche, @RequestParam String date_info,
			@RequestParam String description_travaux, @RequestParam String montant_demande,
			@RequestParam String montant_lettre, @RequestParam String numero_compte, @RequestParam String banque,
			@RequestParam String numero_agrement, @RequestParam String date_expiration, @RequestParam String lots)
			throws JRException, FileNotFoundException {

		arbritrageService.wordActeSoumission(response, id, titre, dao, beneficiaire, date, client, adresse_client,
				numero_marche, date_info, description_travaux, montant_demande, montant_lettre, numero_compte, banque,
				numero_agrement, date_expiration, lots);
	}

	@PostMapping("report/acteDefinitive/{id}")
	public @ResponseBody void generateReportActeDefinitive(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String titre, @RequestParam String dao, @RequestParam String beneficiaire,
			@RequestParam String date, @RequestParam String client, @RequestParam String adresse_client,
			@RequestParam String numero_marche, @RequestParam String date_info,
			@RequestParam String description_travaux, @RequestParam String montant_demande,
			@RequestParam String montant_lettre, @RequestParam String numero_compte, @RequestParam String banque,
			@RequestParam String numero_agrement, @RequestParam String date_expiration)
			throws JRException, FileNotFoundException {

		arbritrageService.wordActeDefinitive(response, id, titre, dao, beneficiaire, date, client, adresse_client,
				numero_marche, date_info, description_travaux, montant_demande, montant_lettre, numero_compte, banque,
				numero_agrement, date_expiration);
	}

	@PostMapping("report/acteBnExecution/{id}")
	public @ResponseBody void generateReportActeBonneExecution(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String titre, @RequestParam String dao, @RequestParam String beneficiaire,
			@RequestParam String date, @RequestParam String client, @RequestParam String adresse_client,
			@RequestParam String numero_marche, @RequestParam String date_info,
			@RequestParam String description_travaux, @RequestParam String montant_demande,
			@RequestParam String montant_lettre, @RequestParam String numero_compte, @RequestParam String banque,
			@RequestParam String numero_agrement, @RequestParam String date_expiration, @RequestParam String lots,
			@RequestParam String date_fin_garantie) throws JRException, FileNotFoundException {

		arbritrageService.wordActeBonneExecution(response, id, titre, dao, beneficiaire, date, client, adresse_client,
				numero_marche, date_info, description_travaux, montant_demande, montant_lettre, numero_compte, banque,
				numero_agrement, date_expiration, lots, date_fin_garantie);
	}

	@PostMapping("report/acteRetenueG/{id}")
	public @ResponseBody void generateReportActeRetenueGarantie(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String titre, @RequestParam String dao, @RequestParam String beneficiaire,
			@RequestParam String date, @RequestParam String client, @RequestParam String adresse_client,
			@RequestParam String numero_marche, @RequestParam String date_info,
			@RequestParam String description_travaux, @RequestParam String montant_demande,
			@RequestParam String montant_lettre, @RequestParam String numero_compte, @RequestParam String banque,
			@RequestParam String numero_agrement, @RequestParam String date_expiration)
			throws JRException, FileNotFoundException {

		arbritrageService.wordActeRetenueGarantie(response, id, titre, dao, beneficiaire, date, client, adresse_client,
				numero_marche, date_info, description_travaux, montant_demande, montant_lettre, numero_compte, banque,
				numero_agrement, date_expiration);
	}

	@PostMapping("report/acteCredit/{id}")
	public @ResponseBody void generateReportActeCredit(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String titre, @RequestParam String client, @RequestParam String adresse_client,
			@RequestParam String police, @RequestParam String dossier, @RequestParam String acheteur,
			@RequestParam String date, @RequestParam String objet, @RequestParam String montant_demande,
			@RequestParam String duree_credit, @RequestParam String primettc, @RequestParam String taux_prime,
			@RequestParam String delai_carence, @RequestParam String sanction, @RequestParam String numero_conditionsg,
			@RequestParam String montant_encours) throws JRException, FileNotFoundException {

		arbritrageService.wordActeCredit(response, id, titre, client, adresse_client, police, dossier, acheteur, date,
				objet, montant_demande, duree_credit, primettc, taux_prime, delai_carence, sanction, numero_conditionsg,
				montant_encours);
	}

	@PostMapping("report/acteLocassur/{id}")
	public @ResponseBody void generateReportActeLocassur(HttpServletResponse response, @PathVariable Long id,
			@RequestParam String police, @RequestParam String cp, @RequestParam String client,
			@RequestParam String adresse_client, @RequestParam String denomination_locataire,
			@RequestParam String date_naissance, @RequestParam String lieu_naissance, @RequestParam String profession,
			@RequestParam String situation_bien, @RequestParam String duree_bail, @RequestParam String montant_demande,
			@RequestParam String montant_mensuel, @RequestParam String periode_loyer,
			@RequestParam String mode_regelement, @RequestParam String montant_couvert, @RequestParam String taux_prime,
			@RequestParam String primettc, @RequestParam String prime_paiement, @RequestParam String prise_effet,
			@RequestParam String caducite, @RequestParam String duree_garantie, @RequestParam String surete,
			@RequestParam String disposition) throws JRException, FileNotFoundException {

		arbritrageService.wordActeLocassur(response, id, police, cp, client, adresse_client, denomination_locataire,
				date_naissance, lieu_naissance, profession, situation_bien, duree_bail, montant_demande,
				montant_mensuel, periode_loyer, mode_regelement, montant_couvert, taux_prime, primettc, prime_paiement,
				prise_effet, caducite, duree_garantie, surete, disposition);
	}
}
