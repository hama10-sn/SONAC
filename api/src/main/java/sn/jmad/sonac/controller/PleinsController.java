package sn.jmad.sonac.controller;

import java.util.List;

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

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Pleins;
import sn.jmad.sonac.repository.PleinsRepository;
import sn.jmad.sonac.service.PleinsService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/pleins/*")
public class PleinsController {

	@Autowired
	PleinsRepository pleinsRepository;
	
	@Autowired
	PleinsService pleinsService ;

	@GetMapping(value = "/findAllPleins")
	public ResponseEntity<?> findAllPleins() {

		List<Pleins> listePleins = pleinsRepository.findAllPleins();

		if (listePleins.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "La liste des pleins est vide", listePleins), HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Voici la liste des pleins demandée", listePleins), HttpStatus.OK);
	}
	
	@GetMapping(value = "/findPleinsByClesPrimaires/{exercice}/{branche}/{categorie}/{produit}")
	public ResponseEntity<?> findPleinsByClesPrimaires(@PathVariable Long exercice, @PathVariable Long branche, @PathVariable Long categorie, @PathVariable Long produit) {

		Pleins pleins = pleinsRepository.findPleinsByClesPrimaires(exercice, branche, categorie, produit);

		if (pleins == null) {
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Ce plein n'existe pas", pleins), HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Ce plein existe déjà", pleins), HttpStatus.OK);
	}

	@PostMapping(value = "/addPleins")
	public ResponseEntity<?> addPleins(@RequestBody Pleins pleins) {

//		pleins.setPleins_datecreation(new Date());
		Pleins pleinsSaved = pleinsService.ajouterPleins(pleins);

		if (pleinsSaved == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Echec ajout du plein: Ce plein existe déjà ou vérifiez vos informations", pleinsSaved),
					HttpStatus.OK);

		return new ResponseEntity<>(new ResponseMessage("ok", "Plein ajouté avec succès !", pleinsSaved),
				HttpStatus.OK);
	}

	@PutMapping(value = "/updatePleins")
	public ResponseEntity<?> updatePleins(@RequestBody Pleins pleins) {

		Pleins pleinsToUpdate = pleinsRepository.findPleinsById(pleins.getPleins_id());

		if (pleinsToUpdate == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Impossible de modifier ce pleins: vérifiez vos informations"),
					HttpStatus.OK);

		pleins.setPleins_datecreation(pleinsToUpdate.getPleins_datecreation());
		Pleins pleinsUpdated = pleinsRepository.save(pleins);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Plein modifié avec succès !", pleinsUpdated), HttpStatus.OK);
	}

}
