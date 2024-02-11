package sn.jmad.sonac.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sn.jmad.sonac.model.RefEncaissement;
import sn.jmad.sonac.repository.RefEncaissementRepository;

@Service
public class RefEncaissementService {

	@Autowired
	private RefEncaissementRepository refEncaissementRepository;

	public List<RefEncaissement> getAllRefEncaissement() {

		return refEncaissementRepository.findAllRefEncaissement();
	}

	public RefEncaissement getRefEncaissementByNumTitre(String numeroTitre) {
		if (numeroTitre != null && !numeroTitre.equals(""))
			return refEncaissementRepository.findRefEncaissementByNumTitre(numeroTitre);

		return null;
	}

	@Transactional(rollbackFor = Exception.class)
	public RefEncaissement saveRefEncaissement(RefEncaissement refEncaissement) {
		if (refEncaissement.getRefencai_numerotitre() != null
				&& !refEncaissement.getRefencai_numerotitre().equals("")) {
			RefEncaissement refEncaissementByTitre = refEncaissementRepository
					.findRefEncaissementByNumTitre(refEncaissement.getRefencai_numerotitre());

			if (refEncaissementByTitre != null)
				// ce chèque est déjà utilisé (il faut une MAJ et non un nouveau save)
				return null;

			refEncaissement.setRefencai_dateoperation(new Date());
			refEncaissement.setRefencai_status("A");

			return refEncaissementRepository.save(refEncaissement);
		}

		return null;
	}

	public RefEncaissement updateRefEncaissement(RefEncaissement refEncaissement) {

		if (refEncaissement.getRefencai_numerotitre() != null
				&& !refEncaissement.getRefencai_numerotitre().equals("")) {

			RefEncaissement refEncaissementToUpdate = refEncaissementRepository
					.findRefEncaissementByNumTitre(refEncaissement.getRefencai_numerotitre());

			if (refEncaissementToUpdate == null)
				return null;

			refEncaissement.setRefencai_id(refEncaissementToUpdate.getRefencai_id());
			refEncaissement.setRefencai_code(refEncaissementToUpdate.getRefencai_code());
			refEncaissement.setRefencai_montanttitre(refEncaissementToUpdate.getRefencai_montanttitre());
			refEncaissement.setRefencai_status(refEncaissementToUpdate.getRefencai_status());
			refEncaissement.setRefencai_dateoperation(new Date());

			// calculer le montant de l'avoir et le montant utilisé
			refEncaissement.setRefencai_montantavoir(
					refEncaissementToUpdate.getRefencai_montantavoir() - refEncaissement.getRefencai_montantutiliser());
			
			refEncaissement.setRefencai_montantutiliser(refEncaissementToUpdate.getRefencai_montantutiliser()
					+ refEncaissement.getRefencai_montantutiliser());
			
			return refEncaissementRepository.save(refEncaissement);
		}

		return null;
	}
}
