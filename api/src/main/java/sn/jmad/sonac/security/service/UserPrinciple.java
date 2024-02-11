package sn.jmad.sonac.security.service;

import com.fasterxml.jackson.annotation.JsonIgnore;

import sn.jmad.sonac.model.Utilisateur;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class UserPrinciple implements UserDetails {
	private static final long serialVersionUID = 1L;

	private Long util_id;

	  private String util_num;

	  private String util_nom;

	  private String util_pren;

	  private String util_deno;

	  private String util_sigle;

	  private String util_tutil;

	  private String util_adrp;

	  private String util_telf;

	  private String util_telp;

	  private String util_ema;

	  private String util_numcl;

	  private String util_dir;

	  private String util_dept;

	  private String util_serv;

	  private String util_putil;

	  private String util_stat;
	  @JsonIgnore
	  private String util_pwd;
	  
	  private String util_login;
	  
	  private String util_profil;

  

    private Collection<? extends GrantedAuthority> authorities;

    public UserPrinciple(Long util_id, String util_num, String util_nom, String util_pren, String util_deno,
			String util_sigle, String util_tutil, String util_adrp, String util_telf, String util_telp, String util_ema,
			String util_numcl, String util_dir, String util_dept, String util_serv, String util_putil, String util_stat,
			String util_pwd, String util_login,String util_profil
			    		/*Collection<? extends GrantedAuthority> authorities*/) {
		this.util_id = util_id;
		this.util_num = util_num;
		this.util_nom = util_nom;
		this.util_pren = util_pren;
		this.util_deno = util_deno;
		this.util_sigle = util_sigle;
		this.util_tutil = util_tutil;
		this.util_adrp = util_adrp;
		this.util_telf = util_telf;
		this.util_telp = util_telp;
		this.util_ema = util_ema;
		this.util_numcl = util_numcl;
		this.util_dir = util_dir;
		this.util_dept = util_dept;
		this.util_serv = util_serv;
		this.util_putil = util_putil;
		this.util_stat = util_stat;
		this.util_pwd = util_pwd;
		this.util_login = util_login;
		this.util_profil = util_profil;
       // this.authorities = authorities;
    }

    public static UserPrinciple build(Utilisateur user) {
      /*  List<GrantedAuthority> authorities = user.getRoles().stream().map(role ->
                new SimpleGrantedAuthority(role.getName().name())
        ).collect(Collectors.toList());*/

        return new UserPrinciple(
        		
        		user.getUtil_id(),
        		user.getUtil_numero(),
        		user.getUtil_nom(),
        		user.getUtil_prenom(),
        		user.getUtil_denomination(),
        		user.getUtil_sigle(),
        		user.getUtil_type(),
        		user.getUtil_adresse(),
        		user.getUtil_telephonefixe(),
        		user.getUtil_telephoneportable(),
        		user.getUtil_email(),
        		user.getUtil_numclient(),
        		user.getUtil_direction(),
        		user.getUtil_departement(),
        		user.getUtil_service(),
        		user.getUtil_poste(),
        		user.getUtil_status(),
        		user.getUtil_password(),
        		user.getUtil_login(),
        		user.getUtil_profil()
               // authorities
        );
    }

  

    @Override
    public String getUsername() {
        return util_login;
    }

    @Override
    public String getPassword() {
        return util_pwd;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        UserPrinciple user = (UserPrinciple) o;
        return Objects.equals(util_id, user.util_id);
    }

	public Long getUtil_id() {
		return util_id;
	}

	public void setUtil_id(Long util_id) {
		this.util_id = util_id;
	}

	public String getUtil_num() {
		return util_num;
	}

	public void setUtil_num(String util_num) {
		this.util_num = util_num;
	}

	public String getUtil_nom() {
		return util_nom;
	}

	public void setUtil_nom(String util_nom) {
		this.util_nom = util_nom;
	}

	public String getUtil_pren() {
		return util_pren;
	}

	public void setUtil_pren(String util_pren) {
		this.util_pren = util_pren;
	}

	public String getUtil_deno() {
		return util_deno;
	}

	public void setUtil_deno(String util_deno) {
		this.util_deno = util_deno;
	}

	public String getUtil_sigle() {
		return util_sigle;
	}

	public void setUtil_sigle(String util_sigle) {
		this.util_sigle = util_sigle;
	}

	public String getUtil_tutil() {
		return util_tutil;
	}

	public void setUtil_tutil(String util_tutil) {
		this.util_tutil = util_tutil;
	}

	public String getUtil_adrp() {
		return util_adrp;
	}

	public void setUtil_adrp(String util_adrp) {
		this.util_adrp = util_adrp;
	}

	public String getUtil_telf() {
		return util_telf;
	}

	public void setUtil_telf(String util_telf) {
		this.util_telf = util_telf;
	}

	public String getUtil_telp() {
		return util_telp;
	}

	public void setUtil_telp(String util_telp) {
		this.util_telp = util_telp;
	}

	public String getUtil_ema() {
		return util_ema;
	}

	public void setUtil_ema(String util_ema) {
		this.util_ema = util_ema;
	}

	public String getUtil_numcl() {
		return util_numcl;
	}

	public void setUtil_numcl(String util_numcl) {
		this.util_numcl = util_numcl;
	}

	public String getUtil_dir() {
		return util_dir;
	}

	public void setUtil_dir(String util_dir) {
		this.util_dir = util_dir;
	}

	public String getUtil_dept() {
		return util_dept;
	}

	public void setUtil_dept(String util_dept) {
		this.util_dept = util_dept;
	}

	public String getUtil_serv() {
		return util_serv;
	}

	public void setUtil_serv(String util_serv) {
		this.util_serv = util_serv;
	}

	public String getUtil_putil() {
		return util_putil;
	}

	public void setUtil_putil(String util_putil) {
		this.util_putil = util_putil;
	}

	public String getUtil_stat() {
		return util_stat;
	}

	public void setUtil_stat(String util_stat) {
		this.util_stat = util_stat;
	}

	public String getUtil_pwd() {
		return util_pwd;
	}

	public void setUtil_pwd(String util_pwd) {
		this.util_pwd = util_pwd;
	}

	public String getUtil_login() {
		return util_login;
	}

	public void setUtil_login(String util_login) {
		this.util_login = util_login;
	}

	public String getUtil_profil() {
		return util_profil;
	}

	public void setUtil_profil(String util_profil) {
		this.util_profil = util_profil;
	}

	
}