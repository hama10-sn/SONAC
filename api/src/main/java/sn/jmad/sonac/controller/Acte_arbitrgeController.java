package sn.jmad.sonac.controller;

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
import sn.jmad.sonac.model.Acte_arbitrage;
import sn.jmad.sonac.repository.Acte_arbitrageRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/acteArbitrage/*")
public class Acte_arbitrgeController {
	
	@Autowired
	private Acte_arbitrageRepository acte_arbitrageRepository;
	
	@PostMapping("/addActe")
	public ResponseEntity<?> addActeArbitrage(@Valid @RequestBody Acte_arbitrage acte_arbitrage){
		Acte_arbitrage acte = acte_arbitrageRepository.save(acte_arbitrage);
		if(acte ==null) {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Echec enregistrement",acte),HttpStatus.NOT_FOUND);
		}else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Acte enregistré, avce succes",acte),HttpStatus.OK);
		}
	}
	@PutMapping("/update")
	public ResponseEntity<?> updateActeArbitrage(@Valid @RequestBody Acte_arbitrage acte){
		Optional<Acte_arbitrage> a = acte_arbitrageRepository.findById(acte.getActe_arbitrage_num());
		if(a.isPresent()) {
			Acte_arbitrage acteCurrent = a.get();
			acteCurrent.setActe_banque(acte.getActe_banque());
			acteCurrent.setActe_beneficiaire(acte.getActe_beneficiaire());
			acteCurrent.setActe_dao(acte.getActe_dao());
			acteCurrent.setActe_date(acte.getActe_date());
			acteCurrent.setActe_date_expiration(acte.getActe_date_expiration());
			acteCurrent.setActe_date_fin_garantie(acte.getActe_date_fin_garantie());
			acteCurrent.setActe_date_info(acte.getActe_date_info());
			acteCurrent.setActe_debut_agrement(acte.getActe_debut_agrement());
			acteCurrent.setActe_dem_num(acte.getActe_dem_num());
			acteCurrent.setActe_description_travaux(acte.getActe_description_travaux());
			acteCurrent.setActe_lots(acte.getActe_lots());
			acteCurrent.setActe_num(acte.getActe_num());
			acteCurrent.setActe_numero_agrement(acte.getActe_numero_agrement());
			acteCurrent.setActe_numero_compte(acte.getActe_numero_compte());
			acteCurrent.setActe_numero_marche(acte.getActe_numero_marche());
			acteCurrent.setActe_titre(acte.getActe_titre());
			acteCurrent.setActe_type(acte.getActe_type());
			acteCurrent.setActe_type_dem(acte.getActe_type_dem());
			acteCurrent.setActe_type_prod(acte.getActe_type_prod());
			
			//ACTE CREDIT
			acteCurrent.setActe_dossier(acte.getActe_dossier());
			acteCurrent.setActe_acheteur(acte.getActe_acheteur());
			acteCurrent.setActe_objet(acte.getActe_objet());
			acteCurrent.setActe_duree_credit(acte.getActe_duree_credit());
			acteCurrent.setActe_taux_prime(acte.getActe_taux_prime());
			acteCurrent.setActe_delai_carence(acte.getActe_delai_carence());
			acteCurrent.setActe_sanction(acte.getActe_sanction());
			acteCurrent.setActe_numero_conditionsg(acte.getActe_numero_conditionsg());
			acteCurrent.setActe_police(acte.getActe_police());
			
			
			//PERTE
			
			acteCurrent.setActe_cp(acte.getActe_cp()); 
			acteCurrent.setActe_denomination_locataire(acte.getActe_denomination_locataire()); 
			acteCurrent.setActe_date_naissance(acte.getActe_date_naissance());
			acteCurrent.setActe_lieu_naissance(acte.getActe_lieu_naissance());
			acteCurrent.setActe_profession(acte.getActe_profession());
			acteCurrent.setActe_situation_bien(acte.getActe_situation_bien()); 
			acteCurrent.setActe_duree_bail(acte.getActe_duree_bail()); 
			acteCurrent.setActe_montant_mensuel(acte.getActe_montant_mensuel());
			acteCurrent.setActe_periode_loyer(acte.getActe_periode_loyer());
			acteCurrent.setActe_mode_regelement(acte.getActe_mode_regelement()); 
			acteCurrent.setActe_montant_couvert(acte.getActe_montant_couvert());
			acteCurrent.setActe_prime_paiement(acte.getActe_prime_paiement());
			acteCurrent.setActe_prise_effet(acte.getActe_prise_effet());
			acteCurrent.setActe_caducite(acte.getActe_caducite());
			acteCurrent.setActe_duree_garantie(acte.getActe_duree_garantie()); 
			acteCurrent.setActe_surete(acte.getActe_surete());
			acteCurrent.setActe_disposition(acte.getActe_disposition());
			acte_arbitrageRepository.save(acteCurrent);
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("acte modifié avec succés",acteCurrent),HttpStatus.OK);
		}else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec modification acte"),HttpStatus.NOT_FOUND);
		}
	}
	@GetMapping("acteArbitrage/{actedemnum}/{actetypedem}") 
	ResponseEntity<?> findByNumDamandeTypeDemandeTypeProduit(@PathVariable(value="actedemnum")Long acte_dem_num,@PathVariable(value="actetypedem")String acte_type_dem){
		List<Acte_arbitrage> actes = acte_arbitrageRepository.findByNumDamandeTypeDemande(acte_dem_num, acte_type_dem);
		if(actes==null) { 
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Pas d'acte erbitrage avec ces paramètres"),HttpStatus.NOT_FOUND);
		}else {
			return new ResponseEntity<List<Acte_arbitrage>>(actes,HttpStatus.OK);
		}
	}
}
