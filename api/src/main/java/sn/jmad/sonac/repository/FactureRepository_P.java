package sn.jmad.sonac.repository;

import sn.jmad.sonac.message.response.IntermediaireCom;
import sn.jmad.sonac.model.Encaissement;
import sn.jmad.sonac.model.Facture;
import sn.jmad.sonac.model.Facture_P;

import java.util.Date;
import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface FactureRepository_P extends JpaRepository<Facture_P, Long> {
	
	
	
}