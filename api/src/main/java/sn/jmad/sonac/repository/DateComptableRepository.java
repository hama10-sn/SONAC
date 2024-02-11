package sn.jmad.sonac.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.model.DateComptable;

public interface DateComptableRepository extends JpaRepository<DateComptable, Long> {
	@Query("select dc from DateComptable dc where dc.datecompt_typtable =:datecompt_typtable and dc.datecompt_typcentral=:datecompt_typcentral")
	DateComptable existingDateComptable(@Param("datecompt_typtable") Long datecompt_typtable,@Param("datecompt_typcentral") String datecompt_typcentral);
}
