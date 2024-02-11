package sn.jmad.sonac.controller;


import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import sn.jmad.sonac.message.response.ResponseMessage;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;




@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/files/*")
public class UploadController {
	
	public static final String DOSSIER = System.getProperty("user.home")+ "/dossiers/";
	
	
	@PostMapping("/upload/{numclient}")
	public ResponseEntity<List<String>> uploadFiles(@RequestParam("files")List<MultipartFile> multipartFiles,@PathVariable("numclient") String numclient) throws IOException{
		
		
		File dossier = new File(DOSSIER + "client-"+numclient+"/");
        if (!dossier.exists()) {
            if (dossier.mkdir()) {
                System.out.println("Directory client is created!");
               

            } else {
                System.out.println("Failed to create directory!");
            }
        }
        File dossierAutre = new File(DOSSIER + "client-"+numclient+"/autres/");
        if (dossierAutre.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierDownload = new File(DOSSIER + "client-"+numclient+"/download/");
        if (dossierDownload.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierClient = new File(DOSSIER + "client-"+numclient+"/client/");
        if (dossierClient.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierInfoAdmin = new File(DOSSIER + "client-"+numclient+"/InfoAdmin/");
        if (dossierInfoAdmin.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierDemandes = new File(DOSSIER + "client-"+numclient+"/demandes/");
        if (dossierDemandes.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierContrats = new File(DOSSIER + "client-"+numclient+"/contrats/");
        if (dossierContrats.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierFinanciers = new File(DOSSIER + "client-"+numclient+"/financiers/");
        if (dossierFinanciers.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        
        
        
		
		List<String> filesnames = new ArrayList<>();
		
		for(MultipartFile file : multipartFiles) {
			
			String filename = StringUtils.cleanPath(file.getOriginalFilename());
			Path fileStorage = Paths.get(DOSSIER + "client-"+numclient+"/client/",filename).toAbsolutePath().normalize();
			Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
			filesnames.add(filename);
			
					
		}
		
		return ResponseEntity.ok().body(filesnames);
		
		
		
	}
	
	
	@PostMapping("/upload/{numprospect}")
	public ResponseEntity<List<String>> uploadFiles(@RequestParam("files")List<MultipartFile> multipartFiles,@PathVariable("numprospect") Long numprospect) throws IOException{
		
		
		File dossier = new File(DOSSIER + "openCompte-"+numprospect+"/");
        if (!dossier.exists()) {
            if (dossier.mkdir()) {
                System.out.println("Directory ouverture is created!");
               

            } else {
                System.out.println("Failed to create directory!");
            }
        }/*
        File dossierAutre = new File(DOSSIER + "client-"+numprospect+"/autres/");
        if (dossierAutre.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierDownload = new File(DOSSIER + "client-"+numclient+"/download/");
        if (dossierDownload.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierClient = new File(DOSSIER + "client-"+numclient+"/client/");
        if (dossierClient.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierInfoAdmin = new File(DOSSIER + "client-"+numclient+"/InfoAdmin/");
        if (dossierInfoAdmin.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierDemandes = new File(DOSSIER + "client-"+numclient+"/demandes/");
        if (dossierDemandes.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierContrats = new File(DOSSIER + "client-"+numclient+"/contrats/");
        if (dossierContrats.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierFinanciers = new File(DOSSIER + "client-"+numclient+"/financiers/");
        if (dossierFinanciers.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }*/
        
        
        
		
		List<String> filesnames = new ArrayList<>();
		
		for(MultipartFile file : multipartFiles) {
			
			String filename = StringUtils.cleanPath(file.getOriginalFilename());
			Path fileStorage = Paths.get(DOSSIER + "openCompte-"+numprospect+"/",filename).toAbsolutePath().normalize();
			Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
			filesnames.add(filename);
		}
		
		return ResponseEntity.ok().body(filesnames);
		
		
		
	}
	
	
	@PostMapping("/uploadInDossier/{numclient}/{dossier}")
	public ResponseEntity<List<String>> uploadInDossier(@RequestParam("files")List<MultipartFile> multipartFiles,@PathVariable("numclient") String numclient,@PathVariable("dossier") String dossier) throws IOException{
		
		File dossierC = new File(DOSSIER + "client-"+numclient+"/");
        if (!dossierC.exists()) {
            if (dossierC.mkdir()) {
                System.out.println("Directory client is created!");
               

            } else {
                System.out.println("Failed to create directory!");
            }
        }
        File dossierAutre = new File(DOSSIER + "client-"+numclient+"/autres/");
        if (dossierAutre.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierDownload = new File(DOSSIER + "client-"+numclient+"/download/");
        if (dossierDownload.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierClient = new File(DOSSIER + "client-"+numclient+"/client/");
        if (dossierClient.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierInfoAdmin = new File(DOSSIER + "client-"+numclient+"/InfoAdmin/");
        if (dossierInfoAdmin.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierDemandes = new File(DOSSIER + "client-"+numclient+"/demandes/");
        if (dossierDemandes.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierContrats = new File(DOSSIER + "client-"+numclient+"/contrats/");
        if (dossierContrats.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
        File dossierFinanciers = new File(DOSSIER + "client-"+numclient+"/financiers/");
        if (dossierFinanciers.mkdir()) {
            System.out.println("Directory autre client is created!");
        } else {
            System.out.println("Failed to create directory!");
        }
		
		
		
		List<String> filesnames = new ArrayList<>();
		
		for(MultipartFile file : multipartFiles) {
			
			String filename = StringUtils.cleanPath(file.getOriginalFilename());
			Path fileStorage = Paths.get(DOSSIER + "client-"+numclient+"/"+dossier+"/",filename).toAbsolutePath().normalize();
			Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
			filesnames.add(filename);
			
					
		}
		
		return ResponseEntity.ok().body(filesnames);
		
		
		
	}
	
	
	
	
	
	@GetMapping("download/{numclient}/{filename}")
	public ResponseEntity<Resource> downloadFiles(@PathVariable("filename") String filename,@PathVariable("numclient") String numclient) throws IOException{
		
		Path filePath = Paths.get(DOSSIER + "client-"+numclient+"/").toAbsolutePath().normalize().resolve(filename);
		
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
	@GetMapping("downloadInDossier/{numclient}/{dossier}/{filename}")
	public ResponseEntity<Resource> downloadFilesDossier(@PathVariable("filename") String filename,@PathVariable("numclient") String numclient,@PathVariable("dossier") String dossier) throws IOException{
		
		Path filePath = Paths.get(DOSSIER + "client-"+numclient+"/"+dossier+"/").toAbsolutePath().normalize().resolve(filename);
		
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
	
	@GetMapping("getFiles/{numclient}")
	public ResponseEntity<List<String>> getFiles(@PathVariable("numclient") String numclient){
	      File dir  = new File(DOSSIER + "client-"+numclient+"/");
	      File[] liste = dir.listFiles();
	      List<String> files = new ArrayList<>();
	      for(File item : liste){
	          if(item.isFile())
	          { 
	        	  files.add(item.getName());
	             
	          } 
	      }
	      return ResponseEntity.ok().body(files);
	}
	

	@GetMapping("getFiles/{numprospect}")
	public ResponseEntity<List<String>> getFiles(@PathVariable("numprospect") Long numprospect){
	      File dir  = new File(DOSSIER + "client-"+numprospect+"/");
	      File[] liste = dir.listFiles();
	      List<String> files = new ArrayList<>();
	      for(File item : liste){
	          if(item.isFile())
	          { 
	        	  files.add(item.getName());
	             
	          } 
	      }
	      return ResponseEntity.ok().body(files);
	}
	
	@GetMapping("getFilesDossier/{numclient}/{dossier}")
	public ResponseEntity<List<String>> getFilesDossier(@PathVariable("numclient") String numclient,@PathVariable("dossier") String dossier){
	      File dir  = new File(DOSSIER + "client-"+numclient+"/"+dossier+"/");
	      File[] liste = dir.listFiles();
	      List<String> files = new ArrayList<>();
	      for(File item : liste){
	          if(item.isFile())
	          { 
	        	  files.add(item.getName());
	             
	          } 
	      }
	      return ResponseEntity.ok().body(files);
	}

	@GetMapping("getFilesAutres/{numclient}")
	public ResponseEntity<List<String>> getFilesAutres(@PathVariable("numclient") String numclient){
	      File dir  = new File(DOSSIER + "client-"+numclient+"/autres/");
	      File[] liste = dir.listFiles();
	      List<String> files = new ArrayList<>();
	      for(File item : liste){
	          if(item.isFile())
	          { 
	        	  files.add(item.getName());
	             
	          } 
	      }
	      return ResponseEntity.ok().body(files);
	}

	
	@GetMapping("delete/{numclient}/{filename}")
	public ResponseEntity<String> delFile(@PathVariable("filename") String filename,@PathVariable("numclient") String numclient) throws IOException{
		
		File f  = new File(DOSSIER + "client-"+numclient+"/"+filename);
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
	@GetMapping("deleteInDossier/{numclient}/{dossier}/{filename}")
	public ResponseEntity<String> delFileInDossier(@PathVariable("filename") String filename,@PathVariable("numclient") String numclient,@PathVariable("dossier") String dossier) throws IOException{
		
		File f  = new File(DOSSIER + "client-"+numclient+"/"+dossier+"/"+filename);
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
	
	
	@GetMapping("moveFile/{numclient}/{dossier}/{filename}/{dossier2}")
	public ResponseEntity<?> movefile(@PathVariable("filename") String filename,@PathVariable("numclient") String numclient,@PathVariable("dossier") String dossier,@PathVariable("dossier2") String dossier2) throws IOException{
		
		File file = new File(DOSSIER + "client-"+numclient+"/"+dossier+"/"+filename);
		File fileDesc = new File(DOSSIER + "client-"+numclient+"/"+dossier2+"/"+filename);
		
		if(file.renameTo(fileDesc)) {
			file.delete();
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("le fichier a été deplacé avec success"),
				    HttpStatus.OK);
		}else {
			
			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Impossible de deplacer le fichier"),
				    HttpStatus.OK);
		}
		
	}
	
	
	//intermediaire
	
	@PostMapping("/uploadInter/{numIntermediare}")
	public ResponseEntity<List<String>> uploadFilesInter(@RequestParam("files")List<MultipartFile> multipartFiles,@PathVariable("numIntermediare") String numInter) throws IOException{
		
		
		File dossier = new File(DOSSIER + "intermediaire-"+numInter+"/");
        if (!dossier.exists()) {
            if (dossier.mkdir()) {
                System.out.println("Directory intermediaire is created!");
               

            } else {
                System.out.println("Failed to create directory!");
            }
        }
        
        
        
		
		List<String> filesnames = new ArrayList<>();
		
		for(MultipartFile file : multipartFiles) {
			
			String filename = StringUtils.cleanPath(file.getOriginalFilename());
			Path fileStorage = Paths.get(DOSSIER + "intermediaire-"+numInter+"/",filename).toAbsolutePath().normalize();
			Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
			filesnames.add(filename);
			
					
		}
		
		return ResponseEntity.ok().body(filesnames);
		
		
		
	}
	
	@GetMapping("getFilesIntermediaire/{numInter}")
	public ResponseEntity<List<String>> getFilesInter(@PathVariable("numInter") String numInter){
	      File dir  = new File(DOSSIER + "intermediaire-"+numInter+"/");
	      File[] liste = dir.listFiles();
	      List<String> files = new ArrayList<>();
	      if(liste == null) {
	    	  return ResponseEntity.ok().body(files);
	      }
	      for(File item : liste){
	          if(item.isFile())
	          { 
	        	  files.add(item.getName());
	             
	          } 
	      }
	      return ResponseEntity.ok().body(files);
	}
	
	@GetMapping("downloadIntermediaire/{numInter}/{filename}")
	public ResponseEntity<Resource> downloadFilesInter(@PathVariable("filename") String filename,@PathVariable("numInter") String numInter) throws IOException{
		
		Path filePath = Paths.get(DOSSIER + "intermediaire-"+numInter+"/").toAbsolutePath().normalize().resolve(filename);
		
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
	
	@GetMapping("deleteIntermediaire/{numInter}/{filename}")
	public ResponseEntity<String> delFileInter(@PathVariable("filename") String filename,@PathVariable("numInter") String numInter) throws IOException{
		
		File f  = new File(DOSSIER + "intermediaire-"+numInter+"/"+filename);
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
	
	
}
