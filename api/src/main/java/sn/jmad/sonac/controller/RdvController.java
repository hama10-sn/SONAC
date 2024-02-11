package sn.jmad.sonac.controller;


import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;


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
import org.springframework.web.multipart.MultipartFile;

import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.model.Mail;
import sn.jmad.sonac.model.Rdv;
import sn.jmad.sonac.repository.AlerteRepository;
import sn.jmad.sonac.repository.RdvRepository;
import sn.jmad.sonac.service.Emailer;






@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/rdv/*")
public class RdvController {
	
	   public static final String DOSSIER = System.getProperty("user.home")+ "/dossiers/RDV/";
	 
	    @Autowired
	    private RdvRepository rdvRepository;
	    

	    @Autowired
	    private AlerteRepository alerteRepository;
	         
	    @GetMapping(value = "/allRdvs")
	    public ResponseEntity<?> getAllRdvs() {
	        List<Rdv> rdvs = rdvRepository.allRdvs(1);
	        System.out.println("liste des rdvs : " + rdvs);
	        if (rdvs.isEmpty())
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.NOT_FOUND);
	        return new ResponseEntity<List<Rdv>>(rdvs, HttpStatus.OK);
	    }
	   
	 	      
	    @PostMapping("/addRdv")
		public ResponseEntity<?> registerRdv(@RequestBody Rdv rdvRequest) {

			if (rdvRequest==null)
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("error"), HttpStatus.BAD_REQUEST);
			
			rdvRequest.setActive(1);
			rdvRepository.save(rdvRequest);

			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Rdv registered successfully!"), HttpStatus.OK);
		}
	    
	  @GetMapping("/findByCodeAgent/{id}")
	    public ResponseEntity<?> getRdvByAgent(@PathVariable(value = "id") String id) {
	        //System.out.println("****"+id);
	       List <Rdv> p = rdvRepository.findByCodeAgent(id);
	        if (p.isEmpty())
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Rdv not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(p, HttpStatus.OK);
	    }
	    
	  @GetMapping("/findByCodeClient/{id}")
	    public ResponseEntity<?> getRdvByClient(@PathVariable(value = "id") String id) {
	        //System.out.println("****"+id);
	       List <Rdv> p = rdvRepository.findbyClient(id);
	        if (p.isEmpty())
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Rdv not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(p, HttpStatus.OK);
	    }
	    
		
		 @DeleteMapping(value = "/delete/{id}")
		    public ResponseEntity<?> deleteRdv(@PathVariable(value = "id") Long id) {
			// rdvRepository.deleteById(id);
			 Rdv f = rdvRepository.findByIdd(id);
			 f.setActive(0);
			 rdvRepository.save(f);
			 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Rdv deleted "), HttpStatus.OK);
		     }
		 
		  @PutMapping(value = "/update/{id}")
		    public ResponseEntity<?> updateRdv(@PathVariable(value = "id") Long id, @RequestBody Rdv rdv) {
		        
		        Rdv rdvToUpdate = rdvRepository.findByIdd(id);
		        if (rdvToUpdate == null) {
		            System.out.println("rdv avec l'identifiant " + id + " n'existe pas");
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Rdv not exists"), HttpStatus.NOT_FOUND);
		        } 
		        
		        if((rdv.getDate_deb()!= rdvToUpdate.getDate_deb())&& alerteRepository.findByIdRdv(rdv.getId_rdv())!=null && !(alerteRepository.findByIdRdv(rdv.getId_rdv()).isEmpty())) {
		        	System.out.println("delete");
		        	alerteRepository.deleteByIdRdv(rdv.getId_rdv());
		        }
		      //  System.out.println("UPDATE rdv: "+rdvToUpdate.getFili_id());
		        
		       // rdvToUpdate.setFili_numero(rdv.getFili_numero());
		        rdvToUpdate.setDate_deb(rdv.getDate_deb());
		        rdvToUpdate.setDate_fin(rdv.getDate_fin());
		        rdvToUpdate.setColor(rdv.getColor());
		        rdvToUpdate.setComment_agent(rdv.getComment_agent());
		        rdvToUpdate.setComment_client(rdv.getComment_client());
		        rdvToUpdate.setId_client(rdv.getId_client());
		        rdvToUpdate.setId_agent(rdv.getId_agent());
		        rdvToUpdate.setLieu(rdv.getLieu());
		        rdvToUpdate.setTitre(rdv.getTitre());
		        rdvToUpdate.setNbre(rdv.getNbre());
		        rdvToUpdate.setUnite(rdv.getUnite());
		        rdvToUpdate.setType(rdv.getType());
		      //  System.out.println(rdv.getDate_deb()+" *** "+rdvToUpdate.getDate_deb());
		        
		        Rdv rdvUpdated = rdvRepository.save(rdvToUpdate);
		        return new ResponseEntity<ResponseMessage>(new ResponseMessage("Rdv updated "+rdvUpdated), HttpStatus.OK);
		    }


		  
		  
		//gestion dossier RDV
			
			@PostMapping("/uploadRDV/{numRDV}")
			public ResponseEntity<List<String>> uploadFilesRDV(@RequestParam("files")List<MultipartFile> multipartFiles,@PathVariable("numRDV") String numRDV) throws IOException{
				
				
				File dossier = new File(DOSSIER + "RDV-"+numRDV+"/");
		        if (!dossier.exists()) {
		            if (dossier.mkdir()) {
		                System.out.println("Directory RDV is created!");
		               

		            } else {
		                System.out.println("Failed to create directory!");
		            }
		        }
		        
		        
		        
				
				List<String> filesnames = new ArrayList<>();
				
				for(MultipartFile file : multipartFiles) {
					
					String filename = StringUtils.cleanPath(file.getOriginalFilename());
					Path fileStorage = Paths.get(DOSSIER + "RDV-"+numRDV+"/",filename).toAbsolutePath().normalize();
					Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
					filesnames.add(filename);
					
							
				}
				
				return ResponseEntity.ok().body(filesnames);
				
				
				
			}
			
			@GetMapping("getFilesRDV/{numRDV}")
			public ResponseEntity<List<String>> getFilesRDV(@PathVariable("numRDV") String numRDV){
			      File dir  = new File(DOSSIER + "RDV-"+numRDV+"/");
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
			
			@GetMapping("downloadRDV/{numRDV}/{filename}")
			public ResponseEntity<Resource> downloadFilesRDV(@PathVariable("filename") String filename,@PathVariable("numRDV") String numRDV) throws IOException{
				
				Path filePath = Paths.get(DOSSIER + "RDV-"+numRDV+"/").toAbsolutePath().normalize().resolve(filename);
				
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
			
			@GetMapping("deleteRDV/{numRDV}/{filename}")
			public ResponseEntity<String> delFileRDV(@PathVariable("filename") String filename,@PathVariable("numRDV") String numRDV) throws IOException{
				
				File f  = new File(DOSSIER + "RDV-"+numRDV+"/"+filename);
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

			
			@PostMapping("/mail/{email}/{form}")
			public ResponseEntity<?> sendMail( @PathVariable("email") Mail mailRequest,@PathVariable("form") List<MultipartFile> form) {
				//mailRequest.setFiles(form);
	 			// Creating clientParticulier
	 			 //new Emailer().notification1(mailRequest.getAddress_email(), mailRequest.getObjet(),mailRequest.getBody(),mailRequest.getInfos_user(),mailRequest.getFiles());
	 			
	 			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Email envoyé avec succés"), HttpStatus.OK);
	 		}
			@PostMapping("/files/{mail}/{objet}/{body}/{infos}")
			public ResponseEntity<List<String>> uploadFiles(@RequestParam("files")List<MultipartFile> multipartFiles,@PathVariable("mail") String mail,@PathVariable("objet") String objet,@PathVariable("body") String body,@PathVariable("infos") String infos) throws IOException{
				
				new Emailer().notification3(mail, objet, body,infos, multipartFiles);
				List<String> filesnames = new ArrayList<>();
				
				for(MultipartFile file : multipartFiles) {
					
					String filename = StringUtils.cleanPath(file.getOriginalFilename());
					//Path fileStorage = Paths.get(DOSSIER + "client-"+numclient+"/client/",filename).toAbsolutePath().normalize();
					//Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
					filesnames.add(filename);
					
							
				}
				
				return ResponseEntity.ok().body(filesnames);
				
				
				
			}
			@PostMapping("/mail")
			public ResponseEntity<?> uploadwithoutFiles(@RequestBody Mail mail) throws IOException{
				
				new Emailer().notification1(mail.getAddress_email(), mail.getObjet(),mail.getBody(),mail.getInfos_user());
				
				
				return new ResponseEntity<ResponseMessage>(new ResponseMessage("Email envoyé avec succés"), HttpStatus.OK);
				
				
				
			}
			@PostMapping("/file/mail")
			public ResponseEntity<List<String>> uploadFiles1(@RequestParam("file")List<MultipartFile> multipartFiles,@RequestParam("mail") Mail mail) throws IOException{
				
								List<String> filesnames = new ArrayList<>();
				
				for(MultipartFile file : multipartFiles) {
					
					String filename = StringUtils.cleanPath(file.getOriginalFilename());
					//Path fileStorage = Paths.get(DOSSIER + "client-"+numclient+"/client/",filename).toAbsolutePath().normalize();
					//Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
					filesnames.add(filename);
					
							
				}
				
				return ResponseEntity.ok().body(filesnames);
				
				
				
			}

}			
