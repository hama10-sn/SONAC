package sn.jmad.sonac.security.service;

import sn.jmad.sonac.model.Utilisateur;
import sn.jmad.sonac.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	public UtilisateurRepository utilisateurRepository;
    
	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Utilisateur user = utilisateurRepository.findByLogin(username);
				
		if(user==null)		
		new UsernameNotFoundException("User Not Found with -> username or email : " + username);

		return UserPrinciple.build(user);
	}
}