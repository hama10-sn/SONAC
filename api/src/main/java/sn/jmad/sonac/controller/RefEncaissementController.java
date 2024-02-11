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
import sn.jmad.sonac.model.RefEncaissement;
import sn.jmad.sonac.service.RefEncaissementService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/refEncaissement/*")
public class RefEncaissementController {

	@Autowired
	private RefEncaissementService refEncaissementService;

	@GetMapping(value = "/findall")
	public ResponseEntity<?> getAllRefEncaissement() {

		List<RefEncaissement> listeRefEncaissement = refEncaissementService.getAllRefEncaissement();

		if (listeRefEncaissement.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Il n'existe aucune référence d'encaissement", listeRefEncaissement),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("vide", "la liste des références d'encaissement", listeRefEncaissement),
				HttpStatus.OK);
	}

	@GetMapping(value = "/findRefEncaissementByNumeroTitre/{numeroTitre}")
	public ResponseEntity<?> getRefEncaissementByNumTitre(@PathVariable String numeroTitre) {

		RefEncaissement refEncaissement = refEncaissementService.getRefEncaissementByNumTitre(numeroTitre);
		if (refEncaissement == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Cette reférence d'encaissement n'existe pas", refEncaissement),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Voici la reférence de l'encaissement demandée", refEncaissement),
				HttpStatus.OK);
	}

	@PostMapping("/addRefEncaissement")
	public ResponseEntity<?> saveRefEncaissement(@RequestBody RefEncaissement refEncaissement) {

		RefEncaissement refEncaissementSaved = refEncaissementService.saveRefEncaissement(refEncaissement);
		if (refEncaissementSaved == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide",
					"Echec de l'ajout de la référence de l'encaissement: vérifiez que le numéro du titre n'est pas déjà utilisé ou vérifiez vos informations", refEncaissement),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Les références de l'encaissement sont ajoutées avec succès", refEncaissement),
				HttpStatus.OK);
	}

	@PutMapping(value = "/updateRefEncaissement")
	public ResponseEntity<?> updateRefEncaissement(@RequestBody RefEncaissement refEncaissement) {

		RefEncaissement refEncaissementUpdated = refEncaissementService.updateRefEncaissement(refEncaissement);

		if (refEncaissementUpdated == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("chao",
					"Impossible de modifier cette référence d'encaissement: vérifiez vos informations",
					refEncaissementUpdated), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok",
				"La référence de l'encaissement est modifiée avec succès", refEncaissementUpdated), HttpStatus.OK);
	}

}
