package sn.jmad.sonac.controller;

import java.util.Date;
import java.util.List;
import java.util.Optional;

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

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Branche;
import sn.jmad.sonac.model.CategorieSocioProfessionnelle;
import sn.jmad.sonac.repository.CategorieSocioProfessionnelleRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/categoriesocioprofessionnelle/*")

public class CategorieSocioProfessionnelleController {
	
	@Autowired
	private CategorieSocioProfessionnelleRepository categorieSocioProRepository ;
	
	@PostMapping(value = "/addcategoriesociopro")
	public ResponseEntity<?> saveCategorieSocioPro(@Valid @RequestBody CategorieSocioProfessionnelle categorie) {
	
		categorieSocioProRepository.save(categorie) ;
		return new ResponseEntity<>(new ResponseMessage("Branche enregistrée avec succès !"), HttpStatus.OK) ;
	}
	
	@GetMapping(value = "/allcategoriesociopro")
	public ResponseEntity<?>  getAllCategorieSocioPro() {
		
		List<CategorieSocioProfessionnelle> categories = categorieSocioProRepository.allCategoriesociopro() ;
		if(categories.isEmpty()) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste des catégories socioprofessionnelle vide"), HttpStatus.OK) ;
		}
		
		return new ResponseEntity<List<CategorieSocioProfessionnelle>>(categories, HttpStatus.OK) ;
	}
	
	@GetMapping(value = "/findbycode/{code}")
	public ResponseEntity<?> getCategorieSocioPro(@PathVariable("code") Long code) {
		Optional<CategorieSocioProfessionnelle> categorie = categorieSocioProRepository.findById(code) ;
		if(categorie.isPresent()) {
			CategorieSocioProfessionnelle myCategorie = categorie.get() ;
			return new ResponseEntity<CategorieSocioProfessionnelle>(myCategorie, HttpStatus.OK) ;
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette catégorie socioprofessionnelle n'existe pas"), HttpStatus.OK) ;
		}
	}
	
	@PutMapping(value = "/updatecategoriesocioprofessionnelle")
	public ResponseEntity<?> updateCategorieSocioPro( @RequestBody CategorieSocioProfessionnelle categorie) {
		
		Optional<CategorieSocioProfessionnelle> cat = categorieSocioProRepository.findById(categorie.getCategs_code()) ;
		if(cat.isPresent()) { 
			CategorieSocioProfessionnelle currentCategorie = cat.get() ;
			
			currentCategorie.setCategs_libcourt(categorie.getCategs_libcourt());
			currentCategorie.setCategs_liblong(categorie.getCategs_liblong());
			currentCategorie.setCategs_scode(categorie.getCategs_scode());
			
			categorieSocioProRepository.save(currentCategorie) ;
			//return new ResponseEntity<ResponseMessage>(new ResponseMessage("Categorie modifiée avec succès"), HttpStatus.OK) ;
			return new ResponseEntity<CategorieSocioProfessionnelle>(currentCategorie, HttpStatus.OK) ;
		} else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND) ;
		}
	}
}
