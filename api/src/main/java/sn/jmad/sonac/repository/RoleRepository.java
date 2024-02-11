package sn.jmad.sonac.repository;

import java.util.Optional;

import sn.jmad.sonac.model.Role;
import sn.jmad.sonac.model.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface RoleRepository extends JpaRepository<Role, Long>{

	@Query("select role from Role role where role.id = :id")
	Role findByIdd(@Param("id") Long id);
	
/*	@Query("select role from Role role where role.nom = :id")
	Role findByNom(@Param("id") String id);*/
	
    Optional<Role> findByName(RoleName roleName);
	
}
