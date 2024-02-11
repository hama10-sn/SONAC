package sn.jmad.sonac;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import sn.jmad.sonac.model.Civilite;
import sn.jmad.sonac.repository.CiviliteRepository;

@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace=Replace.NONE)
public class CiviliteRepositoryTest {
	
	@Autowired
	private CiviliteRepository civiliteRepository;
	
	@Test
	void ajouterCiviliteTest(){
		Civilite c = new Civilite();
		c.setCiv_libellecourt("Mr");
		c.setCiv_libellelong("Monsieur");
		c.setCiv_nature(1);
		
		Civilite c2 = new Civilite();
		c2.setCiv_libellecourt("Mme");
		c2.setCiv_libellelong("Madame");
		c2.setCiv_nature(1);
		
		Civilite cl1 = civiliteRepository.save(c);
		Civilite cl2 = civiliteRepository.save(c2);
		
		assertThat(civiliteRepository.findById(cl1.getCiv_code()).get().getCiv_code()).isEqualTo(cl1.getCiv_code());
		
		assertThat(civiliteRepository.findById(cl2.getCiv_code()).get().getCiv_code()).isEqualTo(cl2.getCiv_code());
	}
}
