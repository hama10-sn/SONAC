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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.EncaissementClient;
import sn.jmad.sonac.message.response.PoliceProduit;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Produit;
import sn.jmad.sonac.repository.ProduitRepository;
import sn.jmad.sonac.service.ProduitService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/produit/*")

public class ProduitController {

	@Autowired
	ProduitRepository produitRepository;

	@Autowired
	ProduitService produitService;

	@PostMapping(value = "/addproduit")
	public ResponseEntity<?> saveProduit(@Valid @RequestBody Produit produit) {

		Date dateModification = new Date();
		produit.setProd_datemodification(dateModification);
		produitRepository.save(produit);
		return new ResponseEntity<>(new ResponseMessage("Produit enregistré avec succès !"), HttpStatus.OK);
	}

	@GetMapping(value = "/allproduit")
	public ResponseEntity<?> getAllProduits() {
		List<Produit> produits = produitRepository.findAllProduit();

		if (produits.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des produits vide"), HttpStatus.OK);
		}

		return new ResponseEntity<List<Produit>>(produits, HttpStatus.OK);
	}

	@GetMapping(value = "/findByCode/{num}")
	public ResponseEntity<?> getProduit(@PathVariable("num") Long num) {
		Optional<Produit> produit = produitRepository.findById(num);
		if (produit.isPresent()) {
			Produit myProduit = produit.get();
			return new ResponseEntity<Produit>(myProduit, HttpStatus.OK);
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("ce produit n'existe pas"), HttpStatus.OK);
		}
	}

	@GetMapping(value = "/lastID/{numcategorie}")
	public ResponseEntity<?> lastIdgCategorie(@PathVariable("numcategorie") Long numcategorie) {
		Long lastNumProduit = produitRepository.lastNumProduit(numcategorie);
		if (lastNumProduit == null) {
			return new ResponseEntity<Long>((long) 0, HttpStatus.OK);
		}
		return new ResponseEntity<Long>(lastNumProduit, HttpStatus.OK);

	}

	@GetMapping(value = "/findByCodeCategorie/{num}")
	public ResponseEntity<?> getNumProduit(@PathVariable("num") Long num) {
		List<Produit> listeProduit = produitRepository.numeroProduitByCategorie(num);
		if (listeProduit == null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);

		}
		return new ResponseEntity<>(listeProduit, HttpStatus.OK);
	}

	@PutMapping(value = "/updateProduit")
	public ResponseEntity<?> updateProduit(@RequestBody Produit produit) {

		Optional<Produit> prod = produitRepository.findById(produit.getProd_numero());
		if (prod.isPresent()) {
			Produit currentProduit = prod.get();

			currentProduit.setProd_codetaxe(produit.getProd_codetaxe());
			currentProduit.setProd_codeutilisateur(produit.getProd_codeutilisateur());
			currentProduit.setProd_datemodification(new Date());
			currentProduit.setProd_denominationcourt(produit.getProd_denominationcourt());
			currentProduit.setProd_denominationlong(produit.getProd_denominationlong());
			currentProduit.setProd_numerobranche(produit.getProd_numerobranche());
			currentProduit.setProd_numerocategorie(produit.getProd_numerocategorie());
			currentProduit.setProd_numeroextension1(produit.getProd_numeroextension1());
			currentProduit.setProd_numeroextension2(produit.getProd_numeroextension2());
			currentProduit.setProd_numeroextension3(produit.getProd_numeroextension3());
			currentProduit.setProd_numerogarantieassoc1(produit.getProd_numerogarantieassoc1());
			currentProduit.setProd_numerogarantieassoc2(produit.getProd_numerogarantieassoc2());
			currentProduit.setProd_numerogarantieassoc3(produit.getProd_numerogarantieassoc3());
			currentProduit.setProd_numerogarantieassoc4(produit.getProd_numerogarantieassoc4());
			currentProduit.setProd_numerogarantieassoc5(produit.getProd_numerogarantieassoc5());
			currentProduit.setProd_numerogarantieassoc6(produit.getProd_numerogarantieassoc6());
			currentProduit.setProd_numerogarantieassoc7(produit.getProd_numerogarantieassoc7());
			currentProduit.setProd_numerogarantieassoc8(produit.getProd_numerogarantieassoc8());
			currentProduit.setProd_numerogarantieassoc9(produit.getProd_numerogarantieassoc9());
			currentProduit.setProd_numerogarantieassoc10(produit.getProd_numerogarantieassoc10());
			currentProduit.setProd_remisecommerciale(produit.getProd_remisecommerciale());
			currentProduit.setProd_remiseexceptionnelle(produit.getProd_remiseexceptionnelle());

			produitRepository.save(currentProduit);

			return new ResponseEntity<Produit>(currentProduit, HttpStatus.OK);
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"),
					HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping(value = "/findProduitByPolice/{numPolice}")
	public ResponseEntity<?> getProduitByPolice(@PathVariable Long numPolice) {
		PoliceProduit produitbyPolice = produitRepository.findProduitByPolice(numPolice);

		return new ResponseEntity<PoliceProduit>(produitbyPolice, HttpStatus.OK);
	}

	@PostMapping("report/{format}")
	public @ResponseBody void generateReportProduit(HttpServletResponse response, @PathVariable String format,
			@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
			throws JRException, FileNotFoundException {

		produitService.generateReportProduit(response, format, title, demandeur);
	}

	@GetMapping(value = "/getProduitByNumero/{numero}")
	public ResponseEntity<?> getProduitByNumero(@PathVariable("numero") Long numero) {
		Produit produit = produitRepository.getProduitByNumero(numero);
		if (produit == null)
			return new ResponseEntity<>(new ResponseMessage("chao", "Ce produit n'existe pas", produit), HttpStatus.OK);

		return new ResponseEntity<>(new ResponseMessage("ok", "Voici le produit demandé", produit), HttpStatus.OK);
	}

}
