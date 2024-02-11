package sn.jmad.sonac.controller;




import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
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
import org.springframework.web.multipart.MultipartFile;

import net.sf.jasperreports.engine.JRException;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Dem_Pers;
import sn.jmad.sonac.model.Dem_Soc;
import sn.jmad.sonac.model.ReferenceTech;
import sn.jmad.sonac.repository.DemSocRepository;
import sn.jmad.sonac.service.ArbitrageService;


@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/DemSoc/*")
public class DemSocController {
	  
	    
	//public static final String DOSSIER = System.getProperty("user.home")+ "/dossiers/demandesoc/";
	public static final String DOSSIER = System.getProperty("user.home")+ "/dossiers/";
	
	
	  @Autowired
	  DemSocRepository demSocRepository;
	  @Autowired
		ArbitrageService arbritrageService ;
		    
	  /*
	   * cette methode nous permet d'ajouter un DemSoc
	   *
	   */
	  /*public static  String  lireJson()  {
			JSONParser jsonP = new JSONParser();
			JSONObject jsonO;
			String chemin="";
			try {
				jsonO = (JSONObject) jsonP.parse(new FileReader("json/chemin.json"));
			 chemin = (String) jsonO.get("chemin");
				System.out.println("chemin"+chemin);
			} catch (IOException | ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return chemin;
			

	}*/

			  @PostMapping("/addDemSoc")

			  public ResponseEntity<?> savePay(@Valid @RequestBody Dem_Soc demSoco) {
				  
				  //demSoco.setDem_statut("en attente");
				  demSoco.setActif(1);
				  Dem_Soc dp =demSocRepository.save(demSoco);
				  if(dp==null) {
					  
					  return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de l'enregistrement",dp), HttpStatus.NOT_FOUND) ;					  
			       
		        } else {
		        	 
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("demende  enregistre",dp), HttpStatus.OK) ;
				       
		        }
		        	       
			  }
			  
			  /*
			   * cette methode nous permet de lister les DemSoc
			   *
			    */
			  
			  @GetMapping(value = "/allDemSoc")
			    public ResponseEntity<?> getAllDemSoc() {
			        List<Dem_Soc> Dem_Soc = demSocRepository.findAllDem_Soc(1);
			        System.out.println("liste des demandes : " + Dem_Soc);
			        if (Dem_Soc==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         			        
			        return new ResponseEntity<List<Dem_Soc>>(Dem_Soc, HttpStatus.OK);
			    }
			  
			  
			  /*
			   * cette methode nous permet de lister les Dem_Soc par clients
			   *
			   */
			  @GetMapping(value = "/allDemSocCl/{id}")
			    public ResponseEntity<?> getAllDemSocByClient(@PathVariable(value = "id") int id) {
			        List<Dem_Soc> Dem_Soc = demSocRepository.findDemandeSocByClient(id);
			        System.out.println("liste des demandes : " + Dem_Soc);
			        if (Dem_Soc==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         			        
			        return new ResponseEntity<List<Dem_Soc>>(Dem_Soc, HttpStatus.OK);
			    }
			  
			  /*
			   * cette methode nous permet de lister les Dem_Soc par prospect
			   *
			   */
			  @GetMapping(value = "/allDemSocPr/{id}")
			    public ResponseEntity<?> getAllDemSocByProspect(@PathVariable(value = "id") int id) {
			        List<Dem_Soc> Dem_Soc = demSocRepository.findDemandeSocByProspect(id);
			        System.out.println("liste des demandes : " + Dem_Soc);
			        if (Dem_Soc==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			         			        
			        return new ResponseEntity<List<Dem_Soc>>(Dem_Soc, HttpStatus.OK);
			    }
			  
			  
			  /*
			   * cette methode nous permet de modifier un Dem_Soc
			   *
			   */
			  
			  @PutMapping(value = "/update")
			    public ResponseEntity<?> updateDemSoc( @RequestBody Dem_Soc Dem_Soc) {
			       
			        Optional<Dem_Soc> c = demSocRepository.findById(Dem_Soc.getDem_socnum());
			        if(c.isPresent() ) {
			        	Dem_Soc currentDem_Soc = c.get() ;
			        	
			        	currentDem_Soc.setDem_denomination(Dem_Soc.getDem_denomination());
			        	currentDem_Soc.setDem_denomination(Dem_Soc.getDem_denomination());
			        	currentDem_Soc.setDem_typetitulaire(Dem_Soc.getDem_typetitulaire());
			        	currentDem_Soc.setDem_clienttitulaire(Dem_Soc.getDem_clienttitulaire());
			        	currentDem_Soc.setDem_typesociete(Dem_Soc.getDem_typesociete());
			        	currentDem_Soc.setDem_capitalsocial(Dem_Soc.getDem_capitalsocial());
			        	currentDem_Soc.setDem_nomprenomsdg(Dem_Soc.getDem_nomprenomsdg());
			        	currentDem_Soc.setDem_adresse1(Dem_Soc.getDem_adresse1());
			        	currentDem_Soc.setDem_adresse2(Dem_Soc.getDem_adresse2());
			        	currentDem_Soc.setDem_ville(Dem_Soc.getDem_ville());
			        	currentDem_Soc.setDem_secteuractivites(Dem_Soc.getDem_secteuractivites());
			        	currentDem_Soc.setDem_registrecommerce(Dem_Soc.getDem_registrecommerce());
			        	currentDem_Soc.setDem_ninea(Dem_Soc.getDem_ninea());
			        	currentDem_Soc.setDem_comptebancaire(Dem_Soc.getDem_comptebancaire());
			        	currentDem_Soc.setDem_telephoneprincipal(Dem_Soc.getDem_telephoneprincipal());
			        	currentDem_Soc.setDem_telephone2(Dem_Soc.getDem_telephone2());
			        	currentDem_Soc.setDem_telephonemobile(Dem_Soc.getDem_telephonemobile());
			        	currentDem_Soc.setDem_siteinternet(Dem_Soc.getDem_siteinternet());
			        	currentDem_Soc.setDem_emailsociete(Dem_Soc.getDem_emailsociete());
			        	currentDem_Soc.setDem_emaildirigeant(Dem_Soc.getDem_emaildirigeant());
			        	currentDem_Soc.setDem_contactsociete(Dem_Soc.getDem_contactsociete());
			        	currentDem_Soc.setDem_objetdemande(Dem_Soc.getDem_objetdemande());
			        	currentDem_Soc.setDem_produitdemande1(Dem_Soc.getDem_produitdemande1());
			        	currentDem_Soc.setDem_produitdemande2(Dem_Soc.getDem_produitdemande2());
			        	currentDem_Soc.setDem_produitdemande3(Dem_Soc.getDem_produitdemande3());
			        	currentDem_Soc.setDem_soumissionarbitrage(Dem_Soc.getDem_soumissionarbitrage());
			        	currentDem_Soc.setDem_statut(Dem_Soc.getDem_statut());
			        	currentDem_Soc.setDem_codeutilisateur(Dem_Soc.getDem_codeutilisateur());
			        	currentDem_Soc.setDem_datemodification(Dem_Soc.getDem_datemodification());
			        	currentDem_Soc.setDem_montant(Dem_Soc.getDem_montant());
			        	currentDem_Soc.setDem_marche(Dem_Soc.getDem_marche());
			        	currentDem_Soc.setDem_commentaire1(Dem_Soc.getDem_commentaire1());
			        	currentDem_Soc.setDem_commentaire2(Dem_Soc.getDem_commentaire2());
			        	currentDem_Soc.setList_document_valide(Dem_Soc.getList_document_valide());
			        	currentDem_Soc.setList_document_lu(Dem_Soc.getList_document_lu());
			        	currentDem_Soc.setDem_montant2(Dem_Soc.getDem_montant2());
			        	currentDem_Soc.setDem_montant3(Dem_Soc.getDem_montant3());
			        	
			        	demSocRepository.save(currentDem_Soc) ;
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Demande Societé modifiee avec succès"), HttpStatus.OK) ;
			        } else {
			            return new ResponseEntity<ResponseMessage>(new ResponseMessage("echec de la modification"), HttpStatus.NOT_FOUND) ;
			        }
			    }
			  
			  @DeleteMapping(value = "/delete/{id}")
			    public ResponseEntity<?> deleteContact(@PathVariable(value = "id") Long id) {
				
				  Optional<Dem_Soc> c = demSocRepository.findByNum(id);
					 
				  Dem_Soc currentSoc = c.get() ;
					  currentSoc.setActif(0);
					  demSocRepository.save(currentSoc);
						 return new ResponseEntity<ResponseMessage>(new ResponseMessage("demande supprimer "), HttpStatus.OK);
					       
				  }
			  
			  @GetMapping(value = "/allPresEmmisionDemSocs")
			    public ResponseEntity<?> getAllPresEmmisionDemSocs() {
			        List<Dem_Soc> DemSocs = demSocRepository.findDemPreEmission(1);
			        System.out.println("liste des demandes : " + DemSocs);
			        if (DemSocs.isEmpty())
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.OK);
			        
			        	return new ResponseEntity<List<Dem_Soc>>(DemSocs, HttpStatus.OK);
			    }
	
			  
			  @PostMapping("/upload/{numDemande}")
				public ResponseEntity<List<String>> uploadFiles(@RequestParam("files")List<MultipartFile> multipartFiles,@PathVariable("numDemande") String numDemande) throws IOException{
					
				  File dossier = new File(arbritrageService.lireJson()+"demandesoc/");
				  if (!dossier.exists()) {
			            if (dossier.mkdir()) {
			                System.out.println("Directory  is created!");
			               

			            } else {
			                System.out.println("Failed to create directory!");
			            }
				  }
					File dossier1 = new File(arbritrageService.lireJson()+ "demandesoc/dmd-"+numDemande+"/");
			        if (!dossier1.exists()) {
			            if (dossier1.mkdir()) {
			                System.out.println("Directory  is created!");
			               

			            } else {
			                System.out.println("Failed to create directory!");
			            }
			        }
			        
			        
			        
					
					List<String> filesnames = new ArrayList<>();
					
					for(MultipartFile file : multipartFiles) {
						
						String filename = StringUtils.cleanPath(file.getOriginalFilename());
						Path fileStorage = Paths.get(arbritrageService.lireJson()+ "demandesoc/dmd-"+numDemande+"/",filename).toAbsolutePath().normalize();
						Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
						filesnames.add(filename);
						
								
					}
					
					return ResponseEntity.ok().body(filesnames);
					
					
					
				}
			  
			  @GetMapping("getFiles/{numDemande}")
				public ResponseEntity<List<String>> getFiles(@PathVariable("numDemande") String numDemande){
				      File dir  = new File(arbritrageService.lireJson()+ "demandesoc/dmd-"+numDemande+"/");
				      File[] liste = dir.listFiles();
				        
				      List<String> files = new ArrayList<>();
				      if(liste==null)
				    	  return ResponseEntity.ok().body(files);
				      for(File item : liste){
				          if(item.isFile())
				          { 
				        	  files.add(item.getName());
				             
				          } 
				      }
				      return ResponseEntity.ok().body(files);
				}
					  

			  @GetMapping("download/{numDemande}/{filename}")
				public ResponseEntity<Resource> downloadFiles(@PathVariable("filename") String filename,@PathVariable("numDemande") String numDemande) throws IOException{
					
					Path filePath = Paths.get(arbritrageService.lireJson()+ "demandesoc/dmd-"+numDemande+"/").toAbsolutePath().normalize().resolve(filename);
					
					if(!Files.exists(filePath)) {
						throw new FileNotFoundException(filename + " n'existe pas !");
						
					}
					
					Resource resource = new UrlResource(filePath.toUri());
					HttpHeaders httpHeaders = new HttpHeaders();
					httpHeaders.add("File-Name", filename);
					httpHeaders.add("Content-Disposition", "attachment;File-Name="+ resource.getFilename());
					
					return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
							.headers(httpHeaders).body(resource);
					
				}
				
				@GetMapping("delete/{numDemande}/{filename}")
				public ResponseEntity<String> delFile(@PathVariable("filename") String filename,@PathVariable("numDemande") String numDemande) throws IOException{
					
					File f  = new File(arbritrageService.lireJson()+ "demandesoc/dmd-"+numDemande+"/"+filename);
					if(f.delete())                       
					{  
					System.out.println(f.getName() + " deleted");
					return ResponseEntity.ok().body(f.getName()+" supprimé");
					}  
					else  
					{  
						return ResponseEntity.ok().body("erreur lors de la suppression"); 
					}  

				}
				
				@GetMapping("report/conditionGenerale/{id}")
				public @ResponseBody void generateReportConditionGenerale(HttpServletResponse response, 
																 @PathVariable Long id
																
																) throws JRException, FileNotFoundException {
					
					arbritrageService.generateReportConditionGenerale(response, id);
				}
				
				@GetMapping("report/conditionParticuliere/{id}")
				public @ResponseBody void generateReportConditionParticuliere(HttpServletResponse response ,
						                                                   @PathVariable Long id 
																
																) throws JRException, FileNotFoundException {

					arbritrageService.generateReportConditionParticulier(response, id);
				}
				
				@GetMapping("report/soumission/{id}")
				public @ResponseBody void generateReportClient(HttpServletResponse response ,
																@PathVariable Long id
																
																) throws JRException, FileNotFoundException {
					
					arbritrageService.generateReportSoumission(response, id);
				}

				@GetMapping("url/{numDemande}/{filename}")
				public ResponseEntity<Path> view(@PathVariable("filename") String filename,@PathVariable("numDemande") String numDemande) throws IOException{
					
					Path filePath = Paths.get(arbritrageService.lireJson()+ "demandesoc/dmd-"+numDemande+"/").toAbsolutePath().normalize().resolve(filename);
					
					if(!Files.exists(filePath)) {
						throw new FileNotFoundException(filename + " n'existe pas !");
						
					}
					
					Resource resource = new UrlResource(filePath.toUri());
					HttpHeaders httpHeaders = new HttpHeaders();
					httpHeaders.add("File-Name", filename);
					httpHeaders.add("Content-Disposition", "attachment;File-Name="+ resource.getFilename());
					
					return ResponseEntity.ok().body(filePath);
					
				}
				
				@GetMapping("downloadI/{numDemande}/{filename}")
					public ResponseEntity<Resource> downloadFilesDossier(@PathVariable("filename") String filename,@PathVariable("numDemande") String numDemande) throws IOException{
					
					//Path filePath = Paths.get(arbritrageService.lireJson()+ "client-"+numclient+"/"+dossier+"/").toAbsolutePath().normalize().resolve(filename);
					Path filePath = Paths.get(arbritrageService.lireJson()+ "demandesoc/dmd-"+numDemande+"/").toAbsolutePath().normalize().resolve(filename);
					if(!Files.exists(filePath)) {
						throw new FileNotFoundException(filename + " n'existe pas !");
						
					}
					
					Resource resource = new UrlResource(filePath.toUri());
					HttpHeaders httpHeaders = new HttpHeaders();
					httpHeaders.add("File-Name", filename);
					httpHeaders.add("Content-Disposition", "attachment;File-Name="+ resource.getFilename());
					
					return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath)))
							.headers(httpHeaders).body(resource);
					
				}

				@GetMapping("report/instruction/{id}/{demandeur}/{raisonsociale}/{anneerelation}/{soumission}/{avancedemarrage}/{bonneexcution}/{retenuegarantie}/{nomgerant}/{definitive}/{cmttotale}/{soumissionencours}/{avancedemarrageencours}/{bonneexecutionencours}/{retenuegarantieencours}/{definitiveencours}/{cmttotaleencours}/{policenumero}/{denomminationsociale}/{objetavenant}/{datesoucription}/{beneficiaire}")
				public @ResponseBody void generateReportInstruction(HttpServletResponse  response, 
																 @PathVariable Long id,@PathVariable String demandeur,@PathVariable String raisonsociale,@PathVariable  String anneerelation
																
																 ,@PathVariable Long soumission,@PathVariable Long avancedemarrage,@PathVariable Long bonneexcution,
																 @PathVariable Long retenuegarantie, @PathVariable String nomgerant,@PathVariable Long definitive,@PathVariable Long cmttotale,
																 @PathVariable Long soumissionencours,@PathVariable Long avancedemarrageencours, @PathVariable Long bonneexecutionencours,@PathVariable 
																 Long retenuegarantieencours, @PathVariable Long definitiveencours,@PathVariable Long cmttotaleencours,
																@PathVariable Long policenumero,@PathVariable String denomminationsociale,@PathVariable String objetavenant,@PathVariable String datesoucription, @PathVariable String beneficiaire) throws JRException, FileNotFoundException {
					
					//arbritrageService.generateReportInstruction(response, id);
					//arbritrageService.generateReportClient(response,"word");
					arbritrageService.wordsociete(response,id,demandeur,raisonsociale,anneerelation,soumission,avancedemarrage,bonneexcution,retenuegarantie,nomgerant,definitive,cmttotale,
							soumissionencours,avancedemarrageencours, bonneexecutionencours,retenuegarantieencours,
							definitiveencours,cmttotaleencours,policenumero,
							denomminationsociale,objetavenant,datesoucription, beneficiaire);
				}
				
				@PostMapping("report/instruction/{id}")
				public @ResponseBody void generateReportInstruction1(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String demandeur,@RequestParam String raisonsociale,@RequestParam  String anneerelation
							
						 ,@RequestParam String soumission ,@RequestParam String avancedemarrage,@RequestParam String bonneexcution,
						 @RequestParam String retenuegarantie, @RequestParam String nomgerant,@RequestParam String definitive,@RequestParam String cmttotale,
						 @RequestParam String soumissionencours,@RequestParam String avancedemarrageencours, @RequestParam String bonneexecutionencours,
						 @RequestParam 	String retenuegarantieencours, @RequestParam String definitiveencours,@RequestParam String cmttotaleencours,
						 @RequestParam String policenumero,@RequestParam String denomminationsociale,@RequestParam String objetavenant,
						 @RequestParam String datesoucription, @RequestParam String beneficiaire,@RequestParam String montantavenant,@RequestParam String produitpourcent,
						 @RequestParam String presentationgenerale,@RequestParam String presentationtechnique,@RequestParam String[] reference,
						 @RequestParam String interetdossier,@RequestParam String conclusion,@RequestParam String primenette,@RequestParam String primettc,@RequestParam String mainlevee,
						 @RequestParam String taxeassurance,@RequestParam String fed,@RequestParam String date,@RequestParam String c1,@RequestParam String c2,@RequestParam String c3,@RequestParam String c4,
						 @RequestParam String ml1,@RequestParam String ml2,@RequestParam String ml3,@RequestParam String ml4,@RequestParam String ml5,
						 @RequestParam String montantavenent2,@RequestParam String montantavenent3,@RequestParam String produitpourcent2,@RequestParam String produitpourcent3,
						 @RequestParam String avisaarbitrage,@RequestParam String aviscommerciale)throws JRException, FileNotFoundException{
					
					//arbritrageService.generateReportInstruction(response, id);
					//arbritrageService.generateReportClient(response,"word");
					arbritrageService.wordsociete1(response,id,demandeur,raisonsociale,anneerelation,soumission,avancedemarrage,bonneexcution,retenuegarantie,nomgerant,
							definitive,cmttotale,soumissionencours,avancedemarrageencours, bonneexecutionencours,retenuegarantieencours,	definitiveencours,cmttotaleencours,
							policenumero,denomminationsociale,objetavenant,datesoucription, beneficiaire,montantavenant,produitpourcent,presentationgenerale,presentationtechnique,reference,interetdossier,conclusion,
							primenette,primettc,mainlevee,taxeassurance,fed,date,c1,c2,c3,c4,ml1,ml2,ml3,ml4,ml5,montantavenent2,montantavenent3,produitpourcent2,produitpourcent3,
							avisaarbitrage,aviscommerciale);
				}
				
				@GetMapping("report/instructionCredit/{id}")
				public @ResponseBody void generateReportInstructioncredit(HttpServletResponse  response, 
																 @PathVariable Long id) throws JRException, FileNotFoundException {
					
					//arbritrageService.generateReportInstruction(response, id);
					//arbritrageService.generateReportClient(response,"word");
					arbritrageService.wordsocieteCredit(response,id);
				}
				@PostMapping("report/instructionCredit/{id}")
				public @ResponseBody void generateReportInstructionCredit(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String demandeur,@RequestParam String raisonsociale,@RequestParam  String anneerelation
							
						 ,@RequestParam String soumission ,@RequestParam String avancedemarrage,@RequestParam String bonneexcution,
						 @RequestParam String retenuegarantie, @RequestParam String nomgerant,@RequestParam String definitive,@RequestParam String cmttotale,
						 @RequestParam String soumissionencours,@RequestParam String avancedemarrageencours, @RequestParam String bonneexecutionencours,
						 @RequestParam 	String retenuegarantieencours, @RequestParam String definitiveencours,@RequestParam String cmttotaleencours,
						 @RequestParam String policenumero,@RequestParam String denomminationsociale,@RequestParam String objetavenant,
						 @RequestParam String datesoucription, @RequestParam String beneficiaire,@RequestParam String montantavenant,@RequestParam String produitpourcent,
						 @RequestParam String presentationgenerale,@RequestParam String presentationtechnique,@RequestParam String[] reference,
						 @RequestParam String interetdossier,@RequestParam String conclusion,@RequestParam String primenette,@RequestParam String primettc,@RequestParam String mainlevee,
						 @RequestParam String taxeassurance,@RequestParam String fed,@RequestParam String date,@RequestParam String c1,@RequestParam String c2,@RequestParam String c3,@RequestParam String c4,
						 @RequestParam String ml1,@RequestParam String ml2,@RequestParam String ml3,@RequestParam String ml4,@RequestParam String ml5,
						 @RequestParam String montantavenent2,@RequestParam String montantavenent3,@RequestParam String produitpourcent2,@RequestParam String produitpourcent3,
						 @RequestParam String avisaarbitrage,@RequestParam String aviscommerciale)throws JRException, FileNotFoundException{
					
					//arbritrageService.generateReportInstruction(response, id);
					//arbritrageService.generateReportClient(response,"word");
					arbritrageService.wordsocieteCredit(response,id,demandeur,raisonsociale,anneerelation,soumission,avancedemarrage,bonneexcution,retenuegarantie,nomgerant,
							definitive,cmttotale,soumissionencours,avancedemarrageencours, bonneexecutionencours,retenuegarantieencours,	definitiveencours,cmttotaleencours,
							policenumero,denomminationsociale,objetavenant,datesoucription, beneficiaire,montantavenant,produitpourcent,presentationgenerale,presentationtechnique,reference,interetdossier,conclusion,
							primenette,primettc,mainlevee,taxeassurance,fed,date,c1,c2,c3,c4,ml1,ml2,ml3,ml4,ml5,montantavenent2,montantavenent3,produitpourcent2,produitpourcent3,
							avisaarbitrage,aviscommerciale);
				}
				@PostMapping("report/instructionPerte/{id}")
				public @ResponseBody void generateReportInstructionPerte(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String demandeur,@RequestParam String raisonsociale,@RequestParam  String anneerelation
							
						 ,@RequestParam String soumission ,@RequestParam String avancedemarrage,@RequestParam String bonneexcution,
						 @RequestParam String retenuegarantie, @RequestParam String nomgerant,@RequestParam String definitive,@RequestParam String cmttotale,
						 @RequestParam String soumissionencours,@RequestParam String avancedemarrageencours, @RequestParam String bonneexecutionencours,
						 @RequestParam 	String retenuegarantieencours, @RequestParam String definitiveencours,@RequestParam String cmttotaleencours,
						 @RequestParam String policenumero,@RequestParam String denomminationsociale,@RequestParam String objetavenant,
						 @RequestParam String datesoucription, @RequestParam String beneficiaire,@RequestParam String montantavenant,@RequestParam String produitpourcent,
						 @RequestParam String presentationgenerale,@RequestParam String presentationtechnique,@RequestParam String[] reference,
						 @RequestParam String interetdossier,@RequestParam String conclusion,@RequestParam String primenette,@RequestParam String primettc,@RequestParam String mainlevee,
						 @RequestParam String taxeassurance,@RequestParam String fed,@RequestParam String date,@RequestParam String c1,@RequestParam String c2,@RequestParam String c3,@RequestParam String c4,
						 @RequestParam String ml1,@RequestParam String ml2,@RequestParam String ml3,@RequestParam String ml4,@RequestParam String ml5,
						 @RequestParam String montantavenent2,@RequestParam String montantavenent3,@RequestParam String produitpourcent2,@RequestParam String produitpourcent3,
						 @RequestParam String avisaarbitrage,@RequestParam String aviscommerciale)throws JRException, FileNotFoundException{
					
					//arbritrageService.generateReportInstruction(response, id);
					//arbritrageService.generateReportClient(response,"word");
					arbritrageService.wordsocietePerte(response,id,demandeur,raisonsociale,anneerelation,soumission,avancedemarrage,bonneexcution,retenuegarantie,nomgerant,
							definitive,cmttotale,soumissionencours,avancedemarrageencours, bonneexecutionencours,retenuegarantieencours,	definitiveencours,cmttotaleencours,
							policenumero,denomminationsociale,objetavenant,datesoucription, beneficiaire,montantavenant,produitpourcent,presentationgenerale,presentationtechnique,reference,interetdossier,conclusion,
							primenette,primettc,mainlevee,taxeassurance,fed,date,c1,c2,c3,c4,ml1,ml2,ml3,ml4,ml5,montantavenent2,montantavenent3,produitpourcent2,produitpourcent3,
							avisaarbitrage,aviscommerciale);
				}
				@PostMapping("report/acteAd/{id}")
				public @ResponseBody void generateReportActeAd(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String titre,@RequestParam String dao,@RequestParam String beneficiaire,@RequestParam String date,@RequestParam String client,
						 @RequestParam String adresse_client,@RequestParam String numero_marche,@RequestParam String date_info,@RequestParam String description_travaux,@RequestParam String montant_demande,
						 @RequestParam String montant_lettre, @RequestParam String numero_compte,@RequestParam String banque,@RequestParam String numero_agrement,@RequestParam String date_expiration )throws JRException, FileNotFoundException{
					
					arbritrageService.wordActeAd(response,id,titre,dao,beneficiaire,date,client,
							adresse_client,numero_marche,date_info,description_travaux,montant_demande, montant_lettre,
							numero_compte,banque,numero_agrement,date_expiration);
				}
				
				@PostMapping("report/acteSoumis/{id}")
				public @ResponseBody void generateReportActeSoumission(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String titre,@RequestParam String dao,@RequestParam String beneficiaire,@RequestParam String date,@RequestParam String client,
						 @RequestParam String adresse_client,@RequestParam String numero_marche,@RequestParam String date_info,@RequestParam String description_travaux,@RequestParam String montant_demande,
						 @RequestParam String montant_lettre, @RequestParam String numero_compte,@RequestParam String banque,@RequestParam String numero_agrement,@RequestParam String date_expiration,@RequestParam String lots )throws JRException, FileNotFoundException{
					
					arbritrageService.wordActeSoumission(response,id,titre,dao,beneficiaire,date,client,
							adresse_client,numero_marche,date_info,description_travaux,montant_demande, montant_lettre,
							numero_compte,banque,numero_agrement,date_expiration,lots);
				}

				@PostMapping("report/acteDefinitive/{id}")
				public @ResponseBody void generateReportActeDefinitive(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String titre,@RequestParam String dao,@RequestParam String beneficiaire,@RequestParam String date,@RequestParam String client,
						 @RequestParam String adresse_client,@RequestParam String numero_marche,@RequestParam String date_info,@RequestParam String description_travaux,@RequestParam String montant_demande,
						 @RequestParam String montant_lettre, @RequestParam String numero_compte,@RequestParam String banque,@RequestParam String numero_agrement,@RequestParam String date_expiration )throws JRException, FileNotFoundException{
					
					arbritrageService.wordActeDefinitive(response,id,titre,dao,beneficiaire,date,client,
							adresse_client,numero_marche,date_info,description_travaux,montant_demande, montant_lettre,
							numero_compte,banque,numero_agrement,date_expiration);
				}
				@PostMapping("report/acteBnExecution/{id}")
				public @ResponseBody void generateReportActeBonneExecution(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String titre,@RequestParam String dao,@RequestParam String beneficiaire,@RequestParam String date,@RequestParam String client,
						 @RequestParam String adresse_client,@RequestParam String numero_marche,@RequestParam String date_info,@RequestParam String description_travaux,@RequestParam String montant_demande,
						 @RequestParam String montant_lettre, @RequestParam String numero_compte,@RequestParam String banque,@RequestParam String numero_agrement,@RequestParam String date_expiration,
						 @RequestParam String lots,@RequestParam String date_fin_garantie)throws JRException, FileNotFoundException{
					
					arbritrageService.wordActeBonneExecution(response,id,titre,dao,beneficiaire,date,client,
							adresse_client,numero_marche,date_info,description_travaux,montant_demande, montant_lettre,
							numero_compte,banque,numero_agrement,date_expiration,lots,date_fin_garantie);
				}
				@PostMapping("report/acteRetenueG/{id}")
				public @ResponseBody void generateReportActeRetenueGarantie(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String titre,@RequestParam String dao,@RequestParam String beneficiaire,@RequestParam String date,@RequestParam String client,
						 @RequestParam String adresse_client,@RequestParam String numero_marche,@RequestParam String date_info,@RequestParam String description_travaux,@RequestParam String montant_demande,
						 @RequestParam String montant_lettre, @RequestParam String numero_compte,@RequestParam String banque,@RequestParam String numero_agrement,@RequestParam String date_expiration )throws JRException, FileNotFoundException{
					
					arbritrageService.wordActeRetenueGarantie(response,id,titre,dao,beneficiaire,date,client,
							adresse_client,numero_marche,date_info,description_travaux,montant_demande, montant_lettre,
							numero_compte,banque,numero_agrement,date_expiration);
				}
				@PostMapping("report/acteCredit/{id}")
				public @ResponseBody void generateReportActeCredit(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String titre, @RequestParam String client,@RequestParam String adresse_client,@RequestParam String police,@RequestParam String dossier,@RequestParam String acheteur,@RequestParam String date,@RequestParam String objet,
						 @RequestParam String montant_demande,@RequestParam String duree_credit,@RequestParam String primettc,@RequestParam String taux_prime,@RequestParam String delai_carence,@RequestParam String sanction,@RequestParam String numero_conditionsg,@RequestParam String montant_encours )throws JRException, FileNotFoundException{
					
					arbritrageService.wordActeCredit(response,id,titre,client,adresse_client,police,dossier,acheteur,date,objet,
							montant_demande,duree_credit,primettc,taux_prime,delai_carence,sanction,numero_conditionsg,montant_encours);
				}
				@PostMapping("report/acteLocassur/{id}")
				public @ResponseBody void generateReportActeLocassur(HttpServletResponse  response, 
						 @PathVariable Long id,@RequestParam String police,@RequestParam String cp,@RequestParam String client,
						 @RequestParam String adresse_client,@RequestParam String denomination_locataire,@RequestParam String date_naissance,@RequestParam String lieu_naissance,
						 @RequestParam String profession,@RequestParam String situation_bien,@RequestParam String duree_bail,@RequestParam String montant_demande,
						 @RequestParam String montant_mensuel,@RequestParam String periode_loyer,@RequestParam String mode_regelement,@RequestParam String montant_couvert,
						 @RequestParam String taux_prime,@RequestParam String primettc,@RequestParam String prime_paiement,@RequestParam String prise_effet,@RequestParam String caducite,
						 @RequestParam String duree_garantie,@RequestParam String surete,@RequestParam String disposition)throws JRException, FileNotFoundException{
					
					arbritrageService.wordActeLocassur(response,id, police, cp, client,
		                      adresse_client, denomination_locataire, date_naissance,lieu_naissance,
		                      profession, situation_bien, duree_bail, montant_demande,
		                      montant_mensuel, periode_loyer, mode_regelement, montant_couvert,
		                      taux_prime, primettc, prime_paiement, prise_effet, caducite,
		                      duree_garantie, surete, disposition);
				}
				 
}