package sn.jmad.sonac.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.model.Instruction;



@Repository
public interface InstructionRepository extends JpaRepository<Instruction, Long>{

	@Query("select instruct from Instruction instruct where instruct.instruct_type=:typeinstruct and instruct.instruct_demande = :demande and instruct.instruct_type_dem = :typedmande")
	List<Instruction> findByDamandeTypeInstructTypeDemande(@Param("typeinstruct") String typeinstruct,@Param("demande") Long demande,@Param("typedmande") String typedmande);
	
	@Query("select instruct from Instruction instruct where instruct.instruct_demande = :demande and instruct.instruct_type_dem = :typedmande")
	List<Instruction> findByDamandeTypeDemande(@Param("demande") Long demande,@Param("typedmande") String typedmande);

	@Query("select instruct from Instruction instruct where instruct.instruct_num = :id")
	Instruction findByIdd(@Param("id") Long id);
}

