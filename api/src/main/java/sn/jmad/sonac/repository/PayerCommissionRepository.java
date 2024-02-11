package sn.jmad.sonac.repository;

import java.util.List;
import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sn.jmad.sonac.message.response.DisplayAllCom;
import sn.jmad.sonac.model.PayerCommission;


public interface PayerCommissionRepository extends JpaRepository<PayerCommission, Long>{
	
	@Query("from PayerCommission pc where pc.active = 1 order by pc.pcom_numpaie ASC")
	List<PayerCommission> allPayerCommissions();
	
	@Query("select pc from PayerCommission pc where pc.active = 1 and pc.pcom_numpaie= :code")
	PayerCommission findbyCode(@Param("code") Long code);
	@Query("select pc from PayerCommission pc where pc.active = 1 and pc.pcom_numfact= :code")
	PayerCommission findbynumfact(@Param("code") Long code);
	
	@Query(nativeQuery = true,
			value="select i.inter_numero as numero,i.inter_denomination as denomination,SUM(pc.pcom_mtncomemis) as somtotcom "
					+ "from payer_commission pc, intermediaire i "
					+ "where pc.pcom_intermed=i.inter_numero and pc.pcom_status='N' and pc.active = 1 and"
					+ "pc.pcom_datepaie between :periode1 and :periode2 "
					+ "group by  i.inter_numero , i.inter_denomination;")
	List<DisplayAllCom> findallcominter(@Param("periode1") Date date1,@Param("periode2") Date date2);

}
