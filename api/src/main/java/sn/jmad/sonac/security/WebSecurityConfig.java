package sn.jmad.sonac.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import sn.jmad.sonac.security.jwt.JwtAuthEntryPoint;
import sn.jmad.sonac.security.jwt.JwtAuthTokenFilter;
import sn.jmad.sonac.security.service.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
@EnableWebMvc
@EnableGlobalMethodSecurity(
		prePostEnabled = true
)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
/*	 @Override
	    protected void configure(HttpSecurity http) throws Exception {
	        http.cors().and().csrf().disable().
	                authorizeRequests()
	                .antMatchers("/prothermo/api/**").permitAll();
	                
	    }*/
	 

	 
	    @Autowired
	    UserDetailsServiceImpl userDetailsService;

	    @Autowired
	    private JwtAuthEntryPoint unauthorizedHandler;

	    @Bean
	    public JwtAuthTokenFilter authenticationJwtTokenFilter() {
	        return new JwtAuthTokenFilter();
	    }

	    @Override
	    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
	        authenticationManagerBuilder
	                .userDetailsService(userDetailsService)
	                .passwordEncoder(passwordEncoder());
	    }

	    @Bean
	    @Override
	    public AuthenticationManager authenticationManagerBean() throws Exception {
	        return super.authenticationManagerBean();
	    }

	    @Bean
	    public PasswordEncoder passwordEncoder() {
	        return new BCryptPasswordEncoder();
	    }
	    
	   
	    
	  /*  @Bean
	    public DBFile_ProductStorageService DBFile_ProductStorageService() {
	        return new DBFile_ProductStorageService();
	    }*/
	    
	 /*   @Bean
	    public DBFileStorageService DBFileStorageService() {
	        return new DBFileStorageService();
	    }*/
	    
	    @Override
	    protected void configure(HttpSecurity http) throws Exception {
	        http.cors().and().csrf().disable().
	                authorizeRequests()
	                .antMatchers("/sonac/api/utilisateur/authsignin").permitAll()
	                .antMatchers("/sonac/api/utilisateur/forgot-password").permitAll()
	                .antMatchers("/sonac/api/utilisateur/reset-password").permitAll()
//	                .antMatchers("/sonac/api/client/report/pdf").permitAll()
//	                .antMatchers("/sonac/api/client/report/excel").permitAll()
	                //.antMatchers("/sonac/api/utilisateur/addUser").permitAll()
	              //  .antMatchers("/sonac/api/utilisateur/allUsers").permitAll()
	                .anyRequest().authenticated()
	                .and()
	                .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
	                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
	        
	        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
	    }
	    
	    public void addCorsMappings(CorsRegistry registry) {
			registry.addMapping("/**")
					.allowedOrigins("*")
					.allowedMethods("GET", "POST", "PUT", "DELETE")
					.allowedHeaders("Authorization", "Content-Type")
					.exposedHeaders("Authorization")
					.allowCredentials(true)
					.maxAge(3600);
		}

}
