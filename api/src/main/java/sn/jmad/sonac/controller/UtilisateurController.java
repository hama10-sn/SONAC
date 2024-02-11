package sn.jmad.sonac.controller;


import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.validation.Valid;

import sn.jmad.sonac.model.Utilisateur;

import sn.jmad.sonac.model.RoleName;
import sn.jmad.sonac.model.Role;

import sn.jmad.sonac.repository.UtilisateurRepository;
import sn.jmad.sonac.repository.RoleRepository;

import sn.jmad.sonac.security.jwt.JwtProvider;
import sn.jmad.sonac.service.Emailer;
import sn.jmad.sonac.service.UserService;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
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

import sn.jmad.sonac.message.response.JwtResponse;
import sn.jmad.sonac.message.response.LoginForm;
import sn.jmad.sonac.message.response.ResponseMessage;
import sn.jmad.sonac.message.response.SignUpForm;






@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/utilisateur/*")
public class UtilisateurController {
	  
	    
	    @Autowired
		AuthenticationManager authenticationManager;

	    @Autowired
		PasswordEncoder encoder;
	    
	    @Autowired
		RoleRepository roleRepository;
	    
	    @Autowired
		UtilisateurRepository utilisateurRepository;
    
		@Autowired
		JwtProvider jwtProvider;
		
		@Value("${imgDir}")
		 String dirImage;
	    
		 
		 		  
		  @PostMapping("/authsignin")

		  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginForm loginRequest) {


				  Utilisateur user = utilisateurRepository.findByLogin(loginRequest.getUtil_login());

			  if(user.getUtil_status().equals("S") || user.getUtil_status().equals("D")) {
				  return new ResponseEntity<>(new ResponseMessage("Compte bloqué!"),
							HttpStatus.BAD_REQUEST);
			  }

			  
			       Authentication authentication = authenticationManager.authenticate(

						new UsernamePasswordAuthenticationToken(loginRequest.getUtil_login(), loginRequest.getUtil_password()));

				SecurityContextHolder.getContext().setAuthentication(authentication);

				String jwt = jwtProvider.generateJwtToken(authentication);
				UserDetails userDetails = (UserDetails) authentication.getPrincipal();
				//System.out.println("+++"+utilisateurRepository.findByLogin(userDetails.getUsername()));

				return ResponseEntity.ok(new JwtResponse(jwt, /*userDetails.getAuthorities(),*/
						utilisateurRepository.findByLogin(userDetails.getUsername()).getUtil_id(),utilisateurRepository.findByLogin(userDetails.getUsername()).getUtil_numero(),
						utilisateurRepository.findByLogin(userDetails.getUsername()).getUtil_nom(),utilisateurRepository.findByLogin(userDetails.getUsername()).getUtil_prenom(),	
						utilisateurRepository.findByLogin(userDetails.getUsername()).getUtil_adresse(),utilisateurRepository.findByLogin(userDetails.getUsername()).getUtil_profil(),
						utilisateurRepository.findByLogin(userDetails.getUsername()).getUtil_email(),utilisateurRepository.findByLogin(userDetails.getUsername()).getUtil_login()));
				
			
			}
		  
		  @PostMapping("/addUser")
			public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpForm signUpRequest) {
				if (utilisateurRepository.findByLogin(signUpRequest.getUtil_login())!=null) {
					return new ResponseEntity<>(new ResponseMessage("Ce login existe deja !"),
							HttpStatus.BAD_REQUEST);
				}

				if (utilisateurRepository.findByMail(signUpRequest.getUtil_email())!=null) {
					return new ResponseEntity<>(new ResponseMessage("Cet email existe deja !"),
							HttpStatus.BAD_REQUEST);
				}

				// Creating user's account
				
				
				
				Utilisateur utilisateur = new Utilisateur(signUpRequest.getUtil_numero(), signUpRequest.getUtil_nom().toUpperCase(), signUpRequest.getUtil_prenom(), signUpRequest.getUtil_denomination(),
						signUpRequest.getUtil_sigle(), signUpRequest.getUtil_type(), signUpRequest.getUtil_adresse(), signUpRequest.getUtil_telephonefixe(),
						signUpRequest.getUtil_telephoneportable(), signUpRequest.getUtil_email(), signUpRequest.getUtil_numclient(), signUpRequest.getUtil_direction(),
						signUpRequest.getUtil_departement(), signUpRequest.getUtil_service(), signUpRequest.getUtil_poste(), signUpRequest.getUtil_status(), encoder.encode(signUpRequest.getUtil_password()),
						signUpRequest.getUtil_login(),signUpRequest.getUtil_profil());

				/*Set<String> strRoles = signUpRequest.getRole();
				Set<Role> roles = new HashSet<>();

				strRoles.forEach(role -> {
					switch (role) {
					case "admin":
						Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
								.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
						roles.add(adminRole);

						break;
					case "agent":
						Role pmRole = roleRepository.findByName(RoleName.ROLE_AGENT)
								.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
						roles.add(pmRole);

						break;
				
					default:
						Role userRole = roleRepository.findByName(RoleName.ROLE_COMMERCIAL)
								.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
						roles.add(userRole);
					}
				});

				utilisateur.setRoles(roles);*/
				
				Utilisateur userNum = utilisateurRepository.findByNumeroTel(utilisateur.getUtil_telephoneportable());
				if(userNum != null) {
					return new ResponseEntity<>(new ResponseMessage("Ce numero de telephone est deja utilisé !"),
							HttpStatus.BAD_REQUEST);
				}
				
				
				
				Utilisateur user = utilisateurRepository.save(utilisateur);
				if(user == null) {
					return new ResponseEntity<>(new ResponseMessage("error !"), HttpStatus.INTERNAL_SERVER_ERROR);
				}
				System.out.println(user.getUtil_nom()+" "+user.getUtil_id());
				if(user.getUtil_type().equals("agent")) {
					user.setUtil_numero("AG"+user.getUtil_id());
				}else {
					user.setUtil_numero("CL"+user.getUtil_id());
				}
				
				Utilisateur user2 = utilisateurRepository.save(user);
				System.out.println(user2.getUtil_nom()+" "+user2.getUtil_numero());
				return new ResponseEntity<>(new ResponseMessage("User registered successfully!"), HttpStatus.OK);
			}
		  
		  
		   @GetMapping(value = "/allUsers")
		    public ResponseEntity<?> getAllUsers() {
		        List<Utilisateur> users = utilisateurRepository.allUsers();
		        System.out.println("liste des utilisateurs : " + users);
		        if (users==null)
		        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
		        
		        
		        return new ResponseEntity<List<Utilisateur>>(users, HttpStatus.OK);
		    }

		   
		 
		   
		   @DeleteMapping(value = "/deleteuser/{login}")
		    public ResponseEntity<?> deleteUser(@PathVariable(value = "login") String login) {
			   Utilisateur us = utilisateurRepository.findByLogin(login);
			   us.setUtil_status("D");
			   utilisateurRepository.save(us);
			   
			
			   
			 return new ResponseEntity<ResponseMessage>(new ResponseMessage("user deleted "), HttpStatus.OK);
		     }
		 
		   @PostMapping("/updateUser")
			public ResponseEntity<?> changeUser(@Valid @RequestBody SignUpForm signUpRequest) {
			
				
				 Utilisateur userToUpdate = utilisateurRepository.findByIdd(signUpRequest.getUtil_id());
				 
				 if (!(signUpRequest.getUtil_login().equalsIgnoreCase(userToUpdate.getUtil_login())) && utilisateurRepository.findByLogin(signUpRequest.getUtil_login())!=null) {
						return new ResponseEntity<>(new ResponseMessage("Ce login existe deja !"),
								HttpStatus.BAD_REQUEST);
					}
				 
				 if (!(signUpRequest.getUtil_email().equalsIgnoreCase(userToUpdate.getUtil_email())) && utilisateurRepository.findByMail(signUpRequest.getUtil_email())!=null) {
						return new ResponseEntity<>(new ResponseMessage("Cet email existe deja !"),
								HttpStatus.BAD_REQUEST);
					}
				 
				 String pwd = "";
				 System.out.println(signUpRequest.getUtil_password()+" ======= "+userToUpdate.getUtil_password());
				 if (signUpRequest.getUtil_password().equalsIgnoreCase(userToUpdate.getUtil_password())) 
						pwd = userToUpdate.getUtil_password();
				 else
					 pwd = encoder.encode(signUpRequest.getUtil_password());
					
				

					Utilisateur utilisateur = new Utilisateur(signUpRequest.getUtil_id(),signUpRequest.getUtil_numero(), signUpRequest.getUtil_nom(), signUpRequest.getUtil_prenom(), signUpRequest.getUtil_denomination(),
							signUpRequest.getUtil_sigle(), signUpRequest.getUtil_type(), signUpRequest.getUtil_adresse(), signUpRequest.getUtil_telephonefixe(),
							signUpRequest.getUtil_telephoneportable(), signUpRequest.getUtil_email(), signUpRequest.getUtil_numclient(), signUpRequest.getUtil_direction(),
							signUpRequest.getUtil_departement(), signUpRequest.getUtil_service(), signUpRequest.getUtil_poste(), signUpRequest.getUtil_status(), pwd,
							signUpRequest.getUtil_login(),signUpRequest.getUtil_profil());

				/*Set<String> strRoles = signUpRequest.getRole();
				Set<Role> roles = new HashSet<>();

				strRoles.forEach(role -> {
					switch (role) {
					case "admin":
						Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
								.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
						roles.add(adminRole);

						break;
					case "agent":
						Role pmRole = roleRepository.findByName(RoleName.ROLE_AGENT)
								.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
						roles.add(pmRole);
				
					default:
						Role userRole = roleRepository.findByName(RoleName.ROLE_COMMERCIAL)
								.orElseThrow(() -> new RuntimeException("Fail! -> Cause: User Role not find."));
						roles.add(userRole);
					}
				});

				utilisateur.setRoles(roles);*/
					Utilisateur userNum = utilisateurRepository.findByNumeroTel(utilisateur.getUtil_telephoneportable());
					System.out.println(utilisateur.getUtil_login());
					if(userNum != null && !userNum.getUtil_login().equals(utilisateur.getUtil_login())) {
						return new ResponseEntity<>(new ResponseMessage("Ce numero de telephone est deja utilisé !"),
								HttpStatus.BAD_REQUEST);
					}
				
				Utilisateur user = utilisateurRepository.save(utilisateur);
				if(user == null) {
					return new ResponseEntity<>(new ResponseMessage("error !"), HttpStatus.INTERNAL_SERVER_ERROR);
				}
				System.out.println(user.getUtil_nom()+" "+user.getUtil_id());
				if(user.getUtil_type().equals("agent")) {
					user.setUtil_numero("AG"+user.getUtil_id());
				}else {
					user.setUtil_numero("CL"+user.getUtil_id());
				}
				
				Utilisateur user2 = utilisateurRepository.save(user);
				System.out.println(user2.getUtil_nom()+" "+user2.getUtil_numero());

				return new ResponseEntity<>(new ResponseMessage("User updated successfully!"), HttpStatus.OK);
			}
		   
		   // Birane
		   
		   @GetMapping(value = "/findbylogin/{login}")
		    public ResponseEntity<?> getUser(@PathVariable(value = "login")String util_login) {
		        Utilisateur user = utilisateurRepository.findByLogin(util_login);
		        
		        if (user==null)
		        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("l'utilisateur n'existe pas"), HttpStatus.NOT_FOUND);
		        
		        
		        return new ResponseEntity<Utilisateur>(user, HttpStatus.OK);
		    }
		   
		   @GetMapping("/updatePassword/login={login}&passwordOld={passold}&passwordnew={passnew}")
		   public ResponseEntity<?> updatePassword(@PathVariable(value = "login") String login, @PathVariable(value = "passold") String passold, @PathVariable(value = "passnew") String passnew){
			   
			   Utilisateur user = utilisateurRepository.findByLogin(login);
			   
			   if(!encoder.matches(passold,user.getUtil_password()))
				   throw new Error("le mot de passe saisie n'est pas identique au mot de passe d'avant");
				   
			   
			   user.setUtil_password(encoder.encode(passnew));
			   utilisateurRepository.save(user);
			   return new ResponseEntity<>(new ResponseMessage("mot de passe changé"), HttpStatus.OK);
			   
		   }
		   
		   @PostMapping("/updatePhoto")
		   public ResponseEntity<?> updatePhoto(@RequestParam(value = "login") String login, @RequestParam(value = "id") Long id , @RequestParam(name = "image") MultipartFile file) throws IOException{
			   
			   if (file.isEmpty()){
				   return new ResponseEntity<>(new ResponseMessage("image introuvable"), HttpStatus.OK);
		        }else {
		        	//file.transferTo(new File(dirImage+File.separator+"img"+File.separator+login+id));
		        	String filename = StringUtils.cleanPath(file.getOriginalFilename());
		        	String fe = FilenameUtils.getExtension(filename);
					Path fileStorage = Paths.get(dirImage+File.separator+"img"+File.separator+login+id).normalize();
					Files.copy(file.getInputStream(), fileStorage,REPLACE_EXISTING);
		        	return new ResponseEntity<>(new ResponseMessage("image enregistré"), HttpStatus.OK);
		        }
			   
			   
		   }
		   
		   @GetMapping(value = "/getPhoto/login={login}&id={id}",produces = MediaType.ALL_VALUE)
		   @ResponseBody
		    public  ResponseEntity<?> photo(@PathVariable(value = "login") String login, @PathVariable(value = "id") Long id) throws Exception {

		        /*File file = new File(dirImage+File.separator+"img"+File.separator+login+id);
		        if(file.exists()) {
		        	//byte[] recupFile = IOUtils.toByteArray(new FileInputStream(file));
			        return IOUtils.toByteArray(new FileInputStream(file));
		        }*/
			   
			   //Path filePath = Paths.get(dirImage+File.separator+"img"+File.separator+login+id).normalize();
			   File file = new File(dirImage+File.separator+"img"+File.separator+login+id);
				
				if(/*!Files.exists(filePath)*/ !file.exists()) {
					Path filePath2 = Paths.get(dirImage+File.separator+"img"+File.separator+"avatar.jpg").toAbsolutePath().normalize();
					Resource resource2 = new UrlResource(filePath2.toUri());
					return ResponseEntity.ok().contentType(MediaType.parseMediaType(Files.probeContentType(filePath2)))
							.body(resource2);
				}
				
				//Resource resource = new UrlResource(filePath.toUri());
				
				
				return ResponseEntity.ok()
						.body(IOUtils.toByteArray(new FileInputStream(new File(dirImage+File.separator+"img"+File.separator+login+id))));
			   
		   }
		   
		
		   
		   // reinitialisation de mot de passe
		   @Autowired
			private UserService userService;

			@PostMapping("/forgot-password")
			public ResponseEntity<?> forgotPassword(@RequestParam(value = "email") String email) {
               System.out.println("***"+email);
				String response = userService.forgotPassword(email);

				if (!response.startsWith("Invalid")) {
					response = "http://localhost:4200/auth/reset-password?token=" + response;
				}

				if (response.startsWith("Invalid")) {
					return new ResponseEntity<>(new ResponseMessage("Le mail n'existe pas dans le système"), HttpStatus.NOT_FOUND);
				}
				
				String content = "Bonjour,\n"
			            + "Vous avez demandé à réinitialiser votre mot de passe.\n"
			            + "Cliquer sur le lien pour changer ton mot de passe: "+ response + 
			             "\nIgnorez ce message si vous avez retrouvé votre mot de passe, \n"
			            + "ou si vous n'avez pas fait la demande de réinitilisation.";
				System.out.println(content);
				
				new Emailer().notification(email, content,"Le lien pour réinitialiser ton mot de passe ERP SONAC-JMAD");
				
				return new ResponseEntity<>(new ResponseMessage("Mail envoyé"), HttpStatus.OK);
			
					
			}

			@PutMapping("/reset-password")
			public ResponseEntity<?> resetPassword(@RequestParam(value = "token") String token,
					@RequestParam(value = "password") String password) {

				String s= userService.resetPassword(token, password);
				
				if (s.startsWith("Invalid")) {
					return new ResponseEntity<>(new ResponseMessage("La page a expiré"), HttpStatus.NOT_FOUND);
				}
				return new ResponseEntity<>(new ResponseMessage("result "+ s), HttpStatus.OK);
					
			}



			   @GetMapping(value = "/allUsersByDirection/{direction}")
			    public ResponseEntity<?> findAllByDirection(@PathVariable(value = "direction")String util_direction) {
			        List<Utilisateur> users = utilisateurRepository.findAllByDirection(util_direction);
			        System.out.println("liste des utilisateurs : " + users);
			        if (users==null)
			        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
			        
			        
			        return new ResponseEntity<List<Utilisateur>>(users, HttpStatus.OK);
			    }
}
