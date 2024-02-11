package sn.jmad.sonac.controller;


import java.util.List;
import java.util.Optional;

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

import sn.jmad.sonac.model.Instruction;
import sn.jmad.sonac.repository.InstructionRepository;

@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/instruction/*")
public class InstructionController {
	
	@Autowired
	private InstructionRepository instructionRepository;
	
	@PostMapping("/addInstruct")
	public ResponseEntity<?> saveInstruction(@Valid @RequestBody Instruction instruction) {
		Instruction instruct =instructionRepository.save(instruction);
		if(instruction==null) {
			  
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement",instruct), HttpStatus.NOT_FOUND) ;					  
	       
		} else {
      	 
          return new ResponseEntity<ResponseMessage>(new ResponseMessage("demende  enregistre",instruct), HttpStatus.OK) ;
		       
		}
      	       
	}
	
	@GetMapping("/allInstruct")
	private ResponseEntity<?> getAllInstruction(){
		List<Instruction> instructions=instructionRepository.findAll();
		System.out.println("liste de toutes les instruction "+instructions);
		if(instructions ==null){
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Liste vide",instructions),HttpStatus.NOT_FOUND);
		} else {
			return new ResponseEntity<List<Instruction>>(instructions,HttpStatus.OK);
		}
	}
	
	@PutMapping("/update")
	private ResponseEntity<?> updateInstruct(@RequestBody Instruction instruction){
		Optional<Instruction> i = instructionRepository.findById(instruction.getInstruct_num());
		if(i.isPresent()) {
			Instruction currentInstruct = i.get();
			
			currentInstruct.setInstruct_type(instruction.getInstruct_type());
			currentInstruct.setInstruct_demande(instruction.getInstruct_demande());
			currentInstruct.setInstruct_type_dem(instruction.getInstruct_type_dem());
			currentInstruct.setInstruct_objet_avenant(instruction.getInstruct_objet_avenant());
			currentInstruct.setInstruct_date_souscript(instruction.getInstruct_date_souscript());
			currentInstruct.setInstruct_beneficiaire(instruction.getInstruct_beneficiaire());
			currentInstruct.setInstruct_taux(instruction.getInstruct_taux());
			currentInstruct.setInstruct_taux2(instruction.getInstruct_taux2());
			currentInstruct.setInstruct_taux3(instruction.getInstruct_taux3());
			currentInstruct.setInstruct_present_generale(instruction.getInstruct_present_generale());
			currentInstruct.setInstruct_present_technique(instruction.getInstruct_present_technique());
			currentInstruct.setInstruct_interetdossier(instruction.getInstruct_interetdossier());
			//POUR CMT ET CREDIT
			currentInstruct.setInstruct_conclusion(instruction.getInstruct_conclusion());
		    //CMT FIN
		    
		    //POUR CMT ET CREDIT
			currentInstruct.setReference(instruction.getReference());
		    
		    
		    //CREDIT DEBUT
			currentInstruct.setInstruct_description(instruction.getInstruct_description());
			currentInstruct.setInstruct_present_societe(instruction.getInstruct_present_societe());
			currentInstruct.setInstruct_activites_client(instruction.getInstruct_activites_client());
			currentInstruct.setInstruct_risques_activite(instruction.getInstruct_risques_activite());
			currentInstruct.setInstruct_objet(instruction.getInstruct_objet());
			currentInstruct.setInstruct_encours_demande(instruction.getInstruct_encours_demande());
			currentInstruct.setInstruct_duree_credit(instruction.getInstruct_duree_credit());
			currentInstruct.setInstruct_condition_paiement(instruction.getInstruct_condition_paiement());
			currentInstruct.setInstruct_type_couverture(instruction.getInstruct_type_couverture());
			currentInstruct.setInstruct_reconduction_couverture(instruction.getInstruct_reconduction_couverture());
			currentInstruct.setInstruct_delai_carence(instruction.getInstruct_delai_carence());
			currentInstruct.setInstruct_delai_idem(instruction.getInstruct_delai_idem());
			currentInstruct.setInstruct_sanction(instruction.getInstruct_sanction());
			currentInstruct.setInstruct_effet(instruction.getInstruct_effet());
			currentInstruct.setInstruct_caducite(instruction.getInstruct_caducite());
			currentInstruct.setInstruct_disposition(instruction.getInstruct_disposition());
		    //CREDIT FIN
		    
		    //PERTES DEBUT
			currentInstruct.setInstruct_analyse(instruction.getInstruct_analyse());
			currentInstruct.setLocataire(instruction.getLocataire());
			//COMMUN
			currentInstruct.setInstruct_memo(instruction.getInstruct_memo());
			instructionRepository.save(currentInstruct);
			
			
			
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("instruction modifiée avec succés",currentInstruct),HttpStatus.OK);
		}else {
			return new ResponseEntity<ResponseMessage>( new ResponseMessage("echec modification"),HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping(value = "/delete/{id}")
	public ResponseEntity<?> deleteInstruction(@PathVariable(value = "id") Long id) {
		
		Optional<Instruction> i = instructionRepository.findById(id);
		if(i.isPresent()) {
			Instruction currentInstruct = i.get() ;
			instructionRepository.deleteById(id);
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Instruction supprimée",currentInstruct),HttpStatus.OK);
		}else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Echec de suppression"),HttpStatus.NOT_FOUND);
		}
	}
	  
	@GetMapping(value="/instruct/{id}") 
	public ResponseEntity<?> getInstructionById(@PathVariable(value = "id") Long id){
		Optional<Instruction> i = instructionRepository.findById(id);
		if(i.isPresent()) {
			Instruction currentInstruct = i.get() ;
			return new ResponseEntity<Instruction>(currentInstruct,HttpStatus.OK);
		}else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cet id d'instrction n'existe pas"),HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping(value="/instructAll/{typeinstruct}/{demande}/{typedmande}") 
	public ResponseEntity<?> getInstructionAllByDemande(@PathVariable(value = "typeinstruct") String typeinstruct,@PathVariable(value = "demande") Long demande,@PathVariable(value = "typedmande") String typedmande){
		List<Instruction> instructions = instructionRepository.findByDamandeTypeInstructTypeDemande(typeinstruct, demande, typedmande);
		if(instructions!=null) {
			
			return new ResponseEntity<List<Instruction>>(instructions,HttpStatus.OK);
		}else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette demande n'a pas d'instructions"),HttpStatus.NOT_FOUND);
		}
	}
	@GetMapping(value="/instructAllByD/{demande}/{typedmande}") 
	public ResponseEntity<?> getInstructionAllByDemandeTypeDemande(@PathVariable(value = "demande") Long demande,@PathVariable(value = "typedmande") String typedmande){
		List<Instruction> instructions = instructionRepository.findByDamandeTypeDemande(demande, typedmande);
		if(instructions!=null) {
			
			return new ResponseEntity<List<Instruction>>(instructions,HttpStatus.OK);
		}else {
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("cette demande n'a pas d'instructions"),HttpStatus.NOT_FOUND);
		}
	}
}
	

