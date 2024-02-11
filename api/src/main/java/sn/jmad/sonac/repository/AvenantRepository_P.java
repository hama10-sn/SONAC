package sn.jmad.sonac.repository;

import java.util.List;

import sn.jmad.sonac.model.Avenant;
import sn.jmad.sonac.model.Avenant_P;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface AvenantRepository_P extends JpaRepository<Avenant_P, Long>{


	
}
