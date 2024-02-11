package sn.jmad.sonac.controller;


import java.util.List;
import javax.validation.Valid;

import sn.jmad.sonac.model.Role;
import sn.jmad.sonac.repository.RoleRepository;
//import sn.jmad.sonac.security.jwt.JwtProvider;

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




@Controller
@CrossOrigin(origins = {"*"}, maxAge = 3600)
@RequestMapping("/sonac/api/role/*")
public class RoleController {
	 
	    @Autowired
	    private RoleRepository roleRepository;
	    
	/*    @Autowired
		AuthenticationManager authenticationManager;

	/*    @Autowired
		PasswordEncoder encoder;*/

	//	@Autowired
	//	JwtProvider jwtProvider;
	    
	    @GetMapping(value = "/allRoles")
	    public ResponseEntity<?> getAllRoles() {
	        List<Role> roles = roleRepository.findAll();
	        System.out.println("liste des roles : " + roles);
	        if (roles.isEmpty())
	        	return new ResponseEntity<ResponseMessage>(new ResponseMessage("liste vide "), HttpStatus.FOUND);
	        return new ResponseEntity<List<Role>>(roles, HttpStatus.OK);
	    }
	   
	 	      
	    @PostMapping("/addRole")
		public ResponseEntity<?> registerRole( @Valid @RequestBody Role roleRequest) {

			// Creating role
	    	System.out.println("*****"+roleRequest.getId());
			Role role = new Role(roleRequest.getName());

			roleRepository.save(role);

			return new ResponseEntity<ResponseMessage>(new ResponseMessage("Role registered successfully!"), HttpStatus.OK);
		}
	    
	  /*  @PostMapping("/findByNom")
	    public ResponseEntity<?> getPharmaciesByName(@PathVariable(value = "id") String id) {
	        System.out.println("****"+id);
	        Role p = roleService.findByNom(id);
	        if (p==null)
	        	  return new ResponseEntity<ResponseMessage>(new ResponseMessage("Role not exists"), HttpStatus.NOT_FOUND);

	        return new ResponseEntity<>(roleService.findByNom(id), HttpStatus.FOUND);
	    }*/
	    
	    
		
		 @DeleteMapping(value = "/delete/{id}")
		    public ResponseEntity<?> deleteRole(@PathVariable(value = "id") Long id) {
			 roleRepository.deleteById(id);
			 return new ResponseEntity<ResponseMessage>(new ResponseMessage("Role deleted "), HttpStatus.OK);
		     }
		 
		  @PutMapping(value = "/update/{id}")
		    public ResponseEntity<?> updateRole(@PathVariable(value = "id") Long id, @RequestBody Role role) {
		        
		        Role roleToUpdate = roleRepository.findByIdd(id);
		        if (roleToUpdate == null) {
		            System.out.println("L'utilisateur avec l'identifiant " + id + " n'existe pas");
		            return new ResponseEntity<ResponseMessage>(new ResponseMessage("Role not exists"), HttpStatus.NOT_FOUND);
		        } 
		        
		        System.out.println("UPDATE role: "+roleToUpdate.getId());
		        
		        roleToUpdate.setName(role.getName());
	
		        Role roleUpdated = roleRepository.save(roleToUpdate);
		        return new ResponseEntity<ResponseMessage>(new ResponseMessage("Role updated "+roleUpdated), HttpStatus.OK);
		    }

		  

}
