package sn.jmad.sonac;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;
import java.util.List;

import org.assertj.core.error.ShouldHaveSameSizeAs;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import sn.jmad.sonac.controller.ClientController;
import sn.jmad.sonac.model.Client;
import sn.jmad.sonac.repository.ClientRepository;
import sn.jmad.sonac.repository.PoliceRepository;
import sn.jmad.sonac.security.jwt.JwtAuthEntryPoint;
import sn.jmad.sonac.security.jwt.JwtProvider;
import sn.jmad.sonac.security.service.UserDetailsServiceImpl;
import sn.jmad.sonac.service.ClientService;
import static org.hamcrest.Matchers.hasSize;

@WithMockUser
@ActiveProfiles("test")
@AutoConfigureTestDatabase(replace=Replace.NONE)
@WebMvcTest(controllers = ClientController.class)
public class ClientTest {
	
	@Autowired
    private MockMvc mockMvc;
	
	@MockBean
	private ClientRepository clientRepository;
	
	@MockBean
	private PoliceRepository policeRepository;
	
	@MockBean
	private ClientService clientService;
	
	@MockBean 
	private UserDetailsServiceImpl userDetailsServiceImpl;
	
	@MockBean 
	private JwtAuthEntryPoint jwtAuthEntryPoint;
	
	@MockBean
	private JwtProvider jwtProvider;
	
	@Test
    public void testGetClients() throws Exception {
		Client cl = new Client();
		cl.setActive(1);
		cl.setClien_prenom("AMadou");
		cl.setClien_nom("diop");
		List<Client> cls = Arrays.asList(cl);
		when(clientRepository.allclients()).thenReturn(cls);
		mockMvc.perform(get("/sonac/api/client/allclients").contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk()).andExpect(jsonPath("$",hasSize(1)));
    }

}
