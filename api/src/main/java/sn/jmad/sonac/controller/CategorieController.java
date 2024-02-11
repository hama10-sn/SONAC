package sn.jmad.sonac.controller;

import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Compagnie;
import sn.jmad.sonac.model.Filiale;
import sn.jmad.sonac.model.Groupe;
import sn.jmad.sonac.model.Pays;
import sn.jmad.sonac.model.Produit;
import sn.jmad.sonac.repository.CategorieRepository;
import sn.jmad.sonac.repository.ProduitRepository;
import sn.jmad.sonac.service.CategorieService;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.hibernate.query.criteria.internal.predicate.IsEmptyPredicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/categorie/*")
public class CategorieController {

	@Autowired
	CategorieRepository categorieRepository;

	@Autowired
	ProduitRepository produitRepository;

	@Autowired
	CategorieService categorieService;

	/*
	 * cette methode nous permet d'ajouter une categorie
	 *
	 */

	@PostMapping("/addCategorie")

	public ResponseEntity<?> saveCategorie(@Valid @RequestBody Categorie categorie /* , BindingResult br */) {

		Optional<Categorie> c = categorieRepository.findByNumCat(categorie.getCateg_numero());
		if (!c.isPresent()) {
			categorie.setActive(1);
			categorieRepository.save(categorie);
			return new ResponseEntity<>(new ResponseMessage("Categorie enregistré"), HttpStatus.OK);
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement"),
					HttpStatus.NOT_FOUND);
		}
	}

	/*
	 * cette methode nous permet de lister les categories
	 *
	 */
	@GetMapping(value = "/allCategorie")
	public ResponseEntity<?> getAllCategorie() {
		List<Categorie> categories = categorieRepository.allCategories(1);
		System.out.println("liste des Categorie : " + categories);
		if (categories.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);

		return new ResponseEntity<List<Categorie>>(categories, HttpStatus.OK);
	}

	/*
	 * cette methode nous permet de modifier une categories
	 *
	 */
	@GetMapping(value = "/lastID/{branch}")
	public ResponseEntity<?> lastIdgCategorie(@PathVariable("branch") Long branch) {
		Long high = Long.parseLong(branch.toString() + "999");

		Integer lastid = categorieRepository.lastIdgCategorie(branch, high);
		if (lastid == null) {
			return new ResponseEntity<Integer>(0, HttpStatus.OK);
		}
		return new ResponseEntity<Integer>(lastid, HttpStatus.OK);

	}

	@GetMapping(value = "/branchCategorie/{branch}")
	public ResponseEntity<?> branchCategorie(@PathVariable("branch") Long branch) {
		List<Categorie> categories = categorieRepository.branchCategorie(branch);
		if (categories.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
		}
		return new ResponseEntity<List<Categorie>>(categories, HttpStatus.OK);

	}

	@PutMapping(value = "/update")
	public ResponseEntity<?> updateCategorie(@RequestBody Categorie categorie) {

		Optional<Categorie> devi = categorieRepository.findByNumCat(categorie.getCateg_numero());
		// System.out.println("Categorie : " + devi);
		if (devi.isPresent()) {
			Categorie currentCategorie = devi.get();

			currentCategorie.setCateg_libellelong(categorie.getCateg_libellelong());
			currentCategorie.setCateg_libellecourt(categorie.getCateg_libellecourt());
			currentCategorie.setCateg_numero(categorie.getCateg_numero());
			currentCategorie.setCateg_codecommission(categorie.getCateg_codecommission());
			currentCategorie.setCateg_codetaxe(categorie.getCateg_codetaxe());
			currentCategorie.setCateg_datecomptabilisation(categorie.getCateg_datecomptabilisation());
			currentCategorie.setCateg_numerobranche(categorie.getCateg_numerobranche());
			currentCategorie.setCateg_datecomptabilisation(categorie.getCateg_datecomptabilisation());

			categorieRepository.save(currentCategorie);

			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Categorie modifiée avec succès"),
					HttpStatus.OK);
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"),
					HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/checkID/{code}")
	public ResponseEntity<?> checkID(@PathVariable("code") Long code) {

		if (code == null) {
			return new ResponseEntity<>(new ResponseMessage("error"), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		List<Produit> produit = produitRepository.numeroProduitByCategorie(code);
		if (produit.isEmpty()) {

			return new ResponseEntity<>(new ResponseMessage("true"), HttpStatus.OK);

		}
		return new ResponseEntity<>(new ResponseMessage("false"), HttpStatus.OK);

	}

	@GetMapping("/delete/{code}")
	public ResponseEntity<?> delCategorie(@PathVariable("code") Long code) {

		List<Produit> produit = produitRepository.numeroProduitByCategorie(code);
		if (produit.isEmpty()) {
			Categorie cat = categorieRepository.findByNumeroCat(code);
			cat.setActive(0);
			categorieRepository.save(cat);

			return new ResponseEntity<>(new ResponseMessage("Categorie supprimé"), HttpStatus.OK);

		}
		return new ResponseEntity<>(new ResponseMessage("suppréssion impossible il est rataché a un produit"),
				HttpStatus.INTERNAL_SERVER_ERROR);

	}

	@PostMapping("report/{format}")
	public @ResponseBody void generateReportCategorie(HttpServletResponse response, @PathVariable String format,
			@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
			throws JRException, FileNotFoundException {

		categorieService.generateReportCategorie(response, format, title, demandeur);
	}

	@GetMapping(value = "/getCategorieByNumero/{numero}")
	public ResponseEntity<?> getCategorieByNumero(@PathVariable("numero") Long numero) {
		Categorie categorie = categorieRepository.findByNumeroCat(numero);
		if (categorie == null)
			return new ResponseEntity<>(new ResponseMessage("chao", "Cette catégorie n'existe pas", categorie),
					HttpStatus.OK);

		return new ResponseEntity<>(new ResponseMessage("ok", "Voici la catégorie demandée", categorie), HttpStatus.OK);
	}
}