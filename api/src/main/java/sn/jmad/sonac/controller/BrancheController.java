package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.repository.BrancheRepository;
import sn.jmad.sonac.repository.CategorieRepository;
import sn.jmad.sonac.service.BrancheService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/branche/*")

public class BrancheController {

	@Autowired
	BrancheRepository brancheRepository;
	@Autowired
	CategorieRepository categorieRepository;
	@Autowired
	BrancheService brancheService;

	@PostMapping(value = "/addbranche")
	public ResponseEntity<?> saveBranche(@Valid @RequestBody Branche branche) {

		Long branche_numero = branche.getBranche_numero();
		Branche brancheExistant = brancheRepository.findbyCode(branche_numero);
		if (brancheExistant != null) {
			return new ResponseEntity<>(new ResponseMessage("Le numéro de cette branche existe déjà !"),
					HttpStatus.BAD_REQUEST);
		}

		Date dateModification = new Date();
		branche.setBranche_datemodification(dateModification);
		branche.setActive(1);
		brancheRepository.save(branche);
		return new ResponseEntity<>(new ResponseMessage("Branche enregistrée avec succès !"), HttpStatus.OK);
	}

	@GetMapping(value = "/allbranche")
	public ResponseEntity<?> getAllBranches() {
		List<Branche> branches = brancheRepository.findAllBranche();

		if (branches.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des branches vide"), HttpStatus.OK);
		}

		return new ResponseEntity<List<Branche>>(branches, HttpStatus.OK);
	}

	@GetMapping(value = "/findBrancheByNumero/{numero}")
	public ResponseEntity<?> getBranche(@PathVariable("numero") Long numero) {
		Branche branche = brancheRepository.findBrancheByNumero(numero);
		if (branche != null) {
			return new ResponseEntity<Branche>(branche, HttpStatus.OK);
		}
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette branche n'existe pas"), HttpStatus.OK);
	}

	@PutMapping(value = "/updateBranche")
	public ResponseEntity<?> updateBranche(@RequestBody Branche branche) {

		Optional<Branche> br = brancheRepository.findById(branche.getBranche_numero());
		if (br.isPresent()) {
			Branche currentBranche = br.get();

			currentBranche.setBranche_classeanalytique(branche.getBranche_classeanalytique());
			currentBranche.setBranche_codecommission(branche.getBranche_codecommission());
			currentBranche.setBranche_codetaxe(branche.getBranche_codetaxe());
			currentBranche.setBranche_libellecourt(branche.getBranche_libellecourt());
			currentBranche.setBranche_libelleLong(branche.getBranche_libelleLong());
			currentBranche.setBranch_periodicite_compabilisation(branche.getBranch_periodicite_compabilisation());
			currentBranche.setBranche_datemodification(new Date());

			brancheRepository.save(currentBranche);
			return new ResponseEntity<Branche>(currentBranche, HttpStatus.OK);
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"),
					HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping(value = "/deleteBranche/{num}")
	public ResponseEntity<?> deleteBranche(@PathVariable(value = "num") long num) {

		List<Categorie> categories = categorieRepository.findbyBranche(num);

		if (categories.isEmpty()) {

			Branche branche = brancheRepository.findbyCode(num);
			branche.setActive(0);
			brancheRepository.save(branche);

			return new ResponseEntity<>(new ResponseMessage("Branche supprimé"), HttpStatus.OK);
		}

		return new ResponseEntity<>(
				new ResponseMessage("suppréssion impossible: cette branche est reliée à une catégorie"),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@GetMapping("/verifDeleteBranche/{num}")
	public ResponseEntity<?> verifdeleteBranche(@PathVariable("num") Long num) {

		List<Categorie> categories = categorieRepository.findbyBranche(num);
		if (categories.isEmpty()) {

			return new ResponseEntity<>(new ResponseMessage("ok"), HttpStatus.OK);
		}

		return new ResponseEntity<>(
				new ResponseMessage("suppréssion impossible: cette branche est reliée à une catégorie"),
				HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@PostMapping("report/{format}")
	public @ResponseBody void generateReportCategorie(HttpServletResponse response, @PathVariable String format,
			@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
			throws JRException, FileNotFoundException {

		brancheService.generateReportBranche(response, format, title, demandeur);
	}
	
	@GetMapping(value = "/getBrancheByNumero/{numero}")
	public ResponseEntity<?> getBrancheByNumero(@PathVariable("numero") Long numero) {
		Branche branche = brancheRepository.findBrancheByNumero(numero);
		if (branche == null)
			return new ResponseEntity<>(new ResponseMessage("chao", "Cette branche n'existe pas", branche),
					HttpStatus.OK);

		return new ResponseEntity<>(new ResponseMessage("ok", "Voici la branche demandée", branche), HttpStatus.OK);
	}
}
