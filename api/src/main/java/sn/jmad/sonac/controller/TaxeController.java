package sn.jmad.sonac.controller;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

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

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Compagnie;
import sn.jmad.sonac.model.Taxe;
import sn.jmad.sonac.repository.TaxeRepository;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/taxe/*")
public class TaxeController {

	@Autowired
	TaxeRepository taxeRepository;

	@PostMapping("/addTaxe")

	public ResponseEntity<?> saveTaxe(@Valid @RequestBody Taxe taxe) {

		if (taxe == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);

		// Date dateFinEffet=taxe.getTaxe_dateffet();
		// taxe.setTaxe_datefin(dateFinEffet);
		taxe.setActive(1);
		taxeRepository.save(taxe);
		return new ResponseEntity<>(new ResponseMessage("taxe enregistrée"), HttpStatus.OK);

	}

	@GetMapping(value = "/allTaxes")
	public ResponseEntity<?> getallTaxes() {
		List<Taxe> taxe = taxeRepository.alltaxes();
		System.out.println("liste des taxes : " + taxe);
		if (taxe == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);

		return new ResponseEntity<List<Taxe>>(taxe, HttpStatus.OK);

	}

	@GetMapping(value = "/lastID/{categorie}")
	public ResponseEntity<?> lastIdgCategorie(@PathVariable("categorie") Long categorie) {
		Integer lastid = taxeRepository.lastIdgCategorie(categorie);
		if (lastid == null) {
			return new ResponseEntity<Integer>(0, HttpStatus.OK);
		}
		return new ResponseEntity<Integer>(lastid, HttpStatus.OK);

	}

	@GetMapping(value = "/lastIDProduit/{produit}")
	public ResponseEntity<?> lastIdProduit(@PathVariable("produit") Long produit) {
		Long lastid = taxeRepository.lastIdProduit(produit);
		if (lastid == null) {
			return new ResponseEntity<Integer>(0, HttpStatus.OK);
		}
		return new ResponseEntity<Long>(lastid, HttpStatus.OK);

	}

	public static Date soustraireJour(Date date, int nbJour) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.add(Calendar.DAY_OF_MONTH, nbJour);
		return cal.getTime();
	}

	@PutMapping(value = "/updateTaxe/{id}")
	public ResponseEntity<?> updateTaxe(@PathVariable(value = "id") Long id, @RequestBody Taxe taxe) {

		Long codeTaxe ;
		Taxe taxeToUpdate = taxeRepository.findByIdd(id);

		if (taxeToUpdate == null) {
//			System.out.println("La taxe avec l'identifiant " + id + " n'existe pas");
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette taxe n'existe"),
					HttpStatus.NOT_FOUND);
		}

		/*
		 * Date dateEf= taxeToUpdate.getTaxe_dateffet(); Date
		 * dateFi=taxeToUpdate.getTaxe_datefin(); if(dateEf.compareTo(dateFi)>0) {
		 * return new ResponseEntity<ResponseMessage>(new
		 * ResponseMessage("la date de prise d'effet doit être inférieur à la date de fin d'effet"
		 * ), HttpStatus.NOT_FOUND);
		 * 
		 * }
		 */
//		System.out.println("DAte fin taxe: " + soustraireJour(taxe.getTaxe_dateffet(), -1));

		// taxeToUpdate.setTaxe_codetaxe(taxe.getTaxe_codetaxe());
		// taxeToUpdate.setTaxe_branch(taxe.getTaxe_branch());
		// taxeToUpdate.setTaxe_catego(taxe.getTaxe_catego());
		// taxeToUpdate.setTaxe_garant(taxe.getTaxe_garant());
		// taxeToUpdate.setTaxe_calcul(taxe.getTaxe_calcul());
		// taxeToUpdate.setTaxe_txappliq(taxe.getTaxe_txappliq());
		// taxeToUpdate.setTaxe_dateffet(taxe.getTaxe_dateffet());
		
//		taxeToUpdate.setTaxe_datefin(soustraireJour(taxe.getTaxe_dateffet(), -1));
//		Taxe taxeToUpdated = taxeRepository.save(taxeToUpdate);
		
		taxe.setActive(1);
		taxe.setTaxe_id(taxeToUpdate.getTaxe_id());
		Taxe taxeUpdated = taxeRepository.save(taxe);
		codeTaxe = taxeUpdated.getTaxe_codetaxe() ;
		
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("taxe "+ codeTaxe + " modifiée avec succès "), HttpStatus.OK);
//		return new ResponseEntity<ResponseMessage>(new ResponseMessage("Taxe updated " + taxeToUpdated), HttpStatus.OK);
	}

	@PutMapping("/editTaxe/{id}")
	public ResponseEntity<?> editTaxe(@RequestBody Taxe taxe) {
		Taxe taxeUpdate = taxeRepository.findbyCode(taxe.getTaxe_codetaxe());
		if (taxeUpdate == null)
			return new ResponseEntity<>(new ResponseMessage("cette taxe n'existe pas"), HttpStatus.NOT_FOUND);
		taxe.setActive(1);
		taxe.setTaxe_id(taxeUpdate.getTaxe_id());
		// Date dateFinEffet=taxe.getTaxe_dateffet().getDate()-1;
		// System.out.println("Date fin: "+dateFinEffet);
		// taxeUpdate.setTaxe_datefin(taxe.getTaxe_dateffet()-1);
		Taxe taxes = taxeRepository.save(taxe);
		if (taxes == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(new ResponseMessage("taxe modifiée avec succée"), HttpStatus.OK);

	}

	@DeleteMapping(value = "/delete/{id}")
	public ResponseEntity<?> deleteClient(@PathVariable(value = "id") Long id) {
		// filialeRepository.deleteById(id);
		Taxe taxe = taxeRepository.findbyCode(id);
		taxe.setActive(0);
		taxeRepository.save(taxe);
		return new ResponseEntity<ResponseMessage>(new ResponseMessage("Client deleted "), HttpStatus.OK);
	}

	@GetMapping(value = "/taxeByBranche/{branch}")
	public ResponseEntity<?> findTaxeByBranche(@PathVariable("branch") long branch) {
		List<Taxe> listeTaxes = taxeRepository.findbyBranche(branch);
		if (listeTaxes.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
		}
		return new ResponseEntity<List<Taxe>>(listeTaxes, HttpStatus.OK);

	}

}
