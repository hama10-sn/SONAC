package sn.jmad.sonac.controller;

import java.io.FileNotFoundException;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

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
import sn.jmad.sonac.model.Acheteur;

import sn.jmad.sonac.model.Categorie;
import sn.jmad.sonac.model.MainLeve;
import sn.jmad.sonac.model.Produit;

import sn.jmad.sonac.model.Engagement;

import sn.jmad.sonac.repository.AcheteurRepository;
import sn.jmad.sonac.service.AcheteurService;

@Controller
@CrossOrigin(origins = { "*" }, maxAge = 3600)
@RequestMapping("/sonac/api/acheteur/*")
public class AcheteurController {

	@Autowired
	private AcheteurRepository acheteurRepository;
	@Autowired
	private AcheteurService acheteurService;

	@GetMapping(value = "/allAcheteurs")
	public ResponseEntity<?> getAllAcheteurs() {
		List<Acheteur> acheteurs = acheteurRepository.allacheteurs(1);
		System.out.println("liste des acheteurs : " + acheteurs);
		if (acheteurs.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);

		return new ResponseEntity<List<Acheteur>>(acheteurs, HttpStatus.OK);
	}

	@GetMapping(value = "/findAllAcheteurs")
	public ResponseEntity<?> findAllAcheteurs() {
		List<Acheteur> listeAcheteur = acheteurRepository.allacheteurs(1);
		if (listeAcheteur.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("vide", "liste des acheteurs est vide", listeAcheteur), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(
				new ResponseMessage("ok", "La liste des acheteurs demandées", listeAcheteur), HttpStatus.OK);
	}

	@GetMapping(value = "/getAcheteur/{numAchet}")
	public ResponseEntity<?> getAcheteurs(@PathVariable(name = "numAchet") Long numAchet) {
		Optional<Acheteur> acheteur = acheteurRepository.findById(numAchet);
		if (!acheteur.isPresent())
			return new ResponseEntity<Acheteur>(new Acheteur(), HttpStatus.OK);

		return new ResponseEntity<Acheteur>(acheteur.get(), HttpStatus.OK);
	}

	@GetMapping(value = "/getAcheteurByNum/{numAchet}")
	public ResponseEntity<?> getAcheteurByNum(@PathVariable(name = "numAchet") Long numAchet) {
		Acheteur acheteur = acheteurRepository.findByIdd(numAchet);
		if (acheteur == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"), HttpStatus.OK);

		return new ResponseEntity<Acheteur>(acheteur, HttpStatus.OK);
	}

	@GetMapping(value = "/findAcheteurByNumero/{numAchet}")
	public ResponseEntity<?> findAchteurByNumero(@PathVariable(name = "numAchet") Long numAchet) {
		Acheteur acheteur = acheteurRepository.findByIdd(numAchet);
		if (acheteur == null)
			return new ResponseEntity<>(new ResponseMessage("chao", "Cet acheteur n'existe pas", acheteur),
					HttpStatus.OK);

		return new ResponseEntity<>(new ResponseMessage("ok", "Voici l'acheteur demandé", acheteur), HttpStatus.OK);
	}

	@PostMapping("/addAcheteur")
	public ResponseEntity<?> addAcheteur(@RequestBody Acheteur acheteur) {

		acheteur.setActive(1);
		Acheteur gr = acheteurRepository.save(acheteur);
		if (gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(acheteur, HttpStatus.OK);

	}

	@PostMapping("/addAcheteurExis")
	public ResponseEntity<?> addAcheteurExisit(@RequestBody Acheteur acheteur) {

		if (acheteur.getAchet_numero() == null) {
			acheteur.setActive(1);
			Acheteur gr = acheteurRepository.save(acheteur);
			if (gr == null)
				return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
						HttpStatus.INTERNAL_SERVER_ERROR);

			return new ResponseEntity<>(acheteur, HttpStatus.OK);
		} else {
			Acheteur acheteurUpdate = acheteurRepository.findByIdd(acheteur.getAchet_numero());
			acheteur.setAchet_id(acheteurUpdate.getAchet_id());
			acheteur.setActive(1);
			Acheteur gr = acheteurRepository.save(acheteur);
			if (gr == null)
				return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
						HttpStatus.INTERNAL_SERVER_ERROR);

			return new ResponseEntity<>(new ResponseMessage("acheteur modifié"), HttpStatus.OK);
		}

	}

	@PutMapping("/editAcheteur")
	public ResponseEntity<?> editAcheteur(@RequestBody Acheteur acheteur) {
		Acheteur acheteurUpdate = acheteurRepository.findByIdd(acheteur.getAchet_numero());
		System.out.println(acheteurUpdate);
		System.out.println(acheteur);
		acheteur.setAchet_id(acheteurUpdate.getAchet_id());
		acheteur.setActive(1);
		Acheteur gr = acheteurRepository.save(acheteur);
		if (gr == null)
			return new ResponseEntity<>(new ResponseMessage("une erreur est survenue"),
					HttpStatus.INTERNAL_SERVER_ERROR);

		return new ResponseEntity<>(new ResponseMessage("acheteur modifié"), HttpStatus.OK);

	}

	@DeleteMapping("/delete/{code}")
	public ResponseEntity<?> delAcheteur(@PathVariable("code") Long code) {

		Acheteur ach = acheteurRepository.findByIdd(code);
		ach.setActive(0);
		acheteurRepository.save(ach);
		return new ResponseEntity<>(new ResponseMessage("acheteur supprimé"), HttpStatus.OK);

	}/*
		 * @GetMapping("/delet/{code}") public ResponseEntity<?>
		 * deleteAcheteur(@PathVariable("code") Long code){
		 * 
		 * 
		 * List<Produit> produit = produitRepository.numeroProduitByCategorie(code);
		 * if(produit.isEmpty() ) { Categorie cat =
		 * categorieRepository.findByNumeroCat(code); cat.setActive(0);
		 * categorieRepository.save(cat);
		 * 
		 * return new ResponseEntity<>(new ResponseMessage("Categorie supprimé"),
		 * HttpStatus.OK);
		 * 
		 * } return new ResponseEntity<>(new
		 * ResponseMessage("suppréssion impossible il est rataché a un produit"),
		 * HttpStatus.INTERNAL_SERVER_ERROR);
		 * 
		 * }
		 */

	@PostMapping("report/{format}")
	public @ResponseBody void generateReportAcheteur(HttpServletResponse response, @PathVariable String format,
			@RequestParam("title") String title, @RequestParam("demandeur") String demandeur)
			throws JRException, FileNotFoundException {

		acheteurService.generateReportAcheteur(response, format, title, demandeur);
	}

	@GetMapping(value = "/allAcheteurByPolice/{id}")
	public ResponseEntity<?> allAcheteurByPolice(@PathVariable(value = "id") Long id) {
		List<Acheteur> acheteurs = acheteurRepository.AllAcheteurByPolice(id);
		// int produitbyPolice = contactRepository.findNbLeaderByClient(id);
		System.out.println("liste des main leve : " + acheteurs);
		if (acheteurs.isEmpty())
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide"), HttpStatus.OK);

		return new ResponseEntity<List<Acheteur>>(acheteurs, HttpStatus.OK);
	}

	@GetMapping(value = "/acheteurbyclientandpolice/{numclient}/{numpolice}")
	public ResponseEntity<?> getAcheteurByNumeroClientAndPolice(@PathVariable("numclient") Long numclient,
			@PathVariable("numpolice") Long numpolice) {
		List<Acheteur> acheteurs = acheteurRepository.findAcheteurByClientAndPolice(numclient, numpolice);

		if (acheteurs.isEmpty())
			return new ResponseEntity<ResponseMessage>(
					new ResponseMessage("chao", "Liste des acheteurs vide !", acheteurs), HttpStatus.OK);

		return new ResponseEntity<ResponseMessage>(new ResponseMessage("ok", "Liste des acheteurs !", acheteurs),
				HttpStatus.OK);
	}


	@GetMapping(value = "/acheteurbyclientandpoliceP/{numclient}/{numpolice}")
    public ResponseEntity<?> getAllAcheteursByClientPolice(@PathVariable("numclient") Long numclient, @PathVariable("numpolice") Long numpolice) {
		List<Acheteur> acheteurs = acheteurRepository.findAcheteurByClientAndPolice(numclient, numpolice);
        System.out.println("liste des acheteurs : " + acheteurs);
        if (acheteurs==null)
        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
        
        
        return new ResponseEntity<List<Acheteur>>(acheteurs, HttpStatus.OK);
    }
}
