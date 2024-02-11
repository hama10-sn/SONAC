package sn.jmad.sonac.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import sn.jmad.sonac.model.Pleins;
import sn.jmad.sonac.repository.PleinsRepository;

@Service
public class PleinsService {

	@Autowired
	PleinsRepository pleinsRepository;

	public Pleins ajouterPleins(Pleins pleins) {

		Pleins pleinsSaved = null;
		
		if (pleins.getPleins_exercice() != null && pleins.getPleins_branche() != null
				&& pleins.getPleins_categorie() != null && pleins.getPleins_produit() != null) {
			
			Pleins pleinsRecuperer = pleinsRepository.findPleinsByClesPrimaires(pleins.getPleins_exercice(),
					pleins.getPleins_branche(), pleins.getPleins_categorie(), pleins.getPleins_produit());
			
			if(pleinsRecuperer == null) {
				pleins.setPleins_datecreation(new Date());
				pleinsSaved = pleinsRepository.save(pleins);
			} 
		}

		return pleinsSaved;
	}

}
