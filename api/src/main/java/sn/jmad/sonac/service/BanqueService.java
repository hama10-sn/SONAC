package sn.jmad.sonac.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sn.jmad.sonac.model.Banque;
import sn.jmad.sonac.repository.BanqueRepository;

@Service
public class BanqueService {

	@Autowired
	private BanqueRepository banqueRepository;

	public Banque ajouterBanque(Banque banque) {
		
//		Banque banqueRecuperer = null;
		
		if(banque.getBanq_codebanque() != null) {
			Banque banqueRecuperer = banqueRepository.findBanqueByCode(banque.getBanq_codebanque());
			
			if(banqueRecuperer != null) {
				return null;
			} else {
				banque.setBanq_datecreation(new Date());

				Banque banqueSaved = banqueRepository.save(banque);
				return banqueSaved;
			}
		}
		
		return null;
	}

}
