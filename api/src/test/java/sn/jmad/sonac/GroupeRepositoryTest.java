package sn.jmad.sonac;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import sn.jmad.sonac.model.Groupe;
import sn.jmad.sonac.repository.GroupeRepository;



@ActiveProfiles("test")
@DataJpaTest
@AutoConfigureTestDatabase(replace=Replace.NONE)
public class GroupeRepositoryTest {
	
	@Autowired
	private GroupeRepository groupeRepository;
	
	@Test
	void ajoutGroupe() {
		
		Groupe gr = new Groupe();
		gr.setGroup_code(3264L);
		gr.setGroup_classif(1);
		gr.setGroup_libcourt("PJ");
		gr.setGroup_liblong("Pico Jazz");
		gr.setGroup_siege(1);
		gr.setGroup_teleph1("779518958");
		gr.setGroup_adress1("dakar ouakam");
		gr.setGroup_email("picojazz@gmail.com");
		gr.setActive(1);
		
		Groupe grTest = groupeRepository.save(gr);
		
		assertThat(grTest.getGroup_libcourt()).isEqualTo("PJ");
		
	}

}
