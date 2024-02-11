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
import sn.jmad.sonac.model.Banque;
import sn.jmad.sonac.repository.BanqueRepository;
import sn.jmad.sonac.service.BanqueService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/banque/*")
public class BanqueController {

	@Autowired
	private BanqueRepository banqueRepository;
	
	@Autowired
	private BanqueService banqueService;

	@GetMapping(value = "/findAllBanque")
	public ResponseEntity<?> findAllBanque() {

		List<Banque> listeBanque = banqueRepository.findAllBanque();

		if (listeBanque.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "La liste des banques est vide", listeBanque), HttpStatus.OK);
		}

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "Voici la liste des banques demandée", listeBanque), HttpStatus.OK);
	}

	@GetMapping(value = "/findBanqueByCode/{code}")
	public ResponseEntity<?> findBanqueByCode(@PathVariable Long code) {

		Banque banque = banqueRepository.findBanqueByCode(code);
		if (banque == null)
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("vide", "Cette banque n'existe pas", banque),
					HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Voici la banque demandée", banque),
				HttpStatus.OK);
	}

	@PostMapping(value = "/addBanque")
	public ResponseEntity<?> addBanque(@RequestBody Banque banque) {

		Banque banqueSaved = banqueService.ajouterBanque(banque);
		if (banqueSaved == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "Echec de l'ajout de la banque: soit le code banque existe déjà ou vérifiez vos informations", null), HttpStatus.OK);

		return new ResponseEntity<>(new ResponseMessage("ok", "La banque ayant pour code banque " + banqueSaved.getBanq_codebanque() + " créée avec succès !", banqueSaved), HttpStatus.OK);
	}

	@PutMapping(value = "/updateBanque")
	public ResponseEntity<?> updateBanque(@RequestBody Banque banque) {

		Banque banqueToUpdate = banqueRepository.findBanqueByCode(banque.getBanq_codebanque());

		if (banqueToUpdate == null)
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Impossible de modifier cette banque: vérifiez vos informations"),
					HttpStatus.OK);

		banque.setBanq_id(banqueToUpdate.getBanq_id());
		banque.setBanq_datecreation(banqueToUpdate.getBanq_datecreation());
		Banque banqueUpdated = banqueRepository.save(banque);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok",
						"Banque code " + banqueUpdated.getBanq_codebanque() + " modifiée avec succès !", banqueUpdated),
				HttpStatus.OK);
	}

}
