package sn.jmad.sonac.repository;


import java.util.List;
import java.util.Optional;

//import java.util.Optional;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sn.jmad.sonac.model.Engagement;
import sn.jmad.sonac.model.Engagement_P;


@Repository
public interface EngagementRepository_P extends JpaRepository<Engagement_P, Long> {
	

	
}