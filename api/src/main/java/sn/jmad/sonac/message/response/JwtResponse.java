package sn.jmad.sonac.message.response;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;

public class JwtResponse {
	private String token;
	private String type = "Bearer";
//	private Collection<? extends GrantedAuthority> authorities;
	
	  private Long util_id;

	  private String util_num;

	  private String util_nom;

	  private String util_pren;

	  private String util_adrp;

	  private String util_profil;

	  private String util_ema;
	  
	  private String util_login;

	public JwtResponse(String token,/* Collection<? extends GrantedAuthority> authorities,*/ Long util_id, String util_num,
			String util_nom, String util_pren, String util_adrp, String util_profil, String util_ema, String util_login) {
		super();
		this.token = token;
	//	this.authorities = authorities;
		this.util_id = util_id;
		this.util_num = util_num;
		this.util_nom = util_nom;
		this.util_pren = util_pren;
		this.util_adrp = util_adrp;
		this.util_profil = util_profil;
		this.util_ema = util_ema;
		this.util_login = util_login;
	}
	
	public JwtResponse(String token,/* Collection<? extends GrantedAuthority> authorities,*/ Long util_id,
			String util_nom, String util_pren, String util_ema, String util_login) {
		super();
		this.token = token;
	//	this.authorities = authorities;
		this.util_id = util_id;
	//	this.util_num = util_num;
		this.util_nom = util_nom;
		this.util_pren = util_pren;
	//	this.util_adrp = util_adrp;
	//	this.util_telp = util_telp;
		this.util_ema = util_ema;
		this.util_login = util_login;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	/*public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
		this.authorities = authorities;
	}*/

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

	public String getUtil_adrp() {
		return util_adrp;
	}

	public void setUtil_adrp(String util_adrp) {
		this.util_adrp = util_adrp;
	}

	public String getUtil_ema() {
		return util_ema;
	}

	public void setUtil_ema(String util_ema) {
		this.util_ema = util_ema;
	}

	public String getUtil_login() {
		return util_login;
	}

	public void setUtil_login(String util_login) {
		this.util_login = util_login;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUtil_profil() {
		return util_profil;
	}

	public void setUtil_profil(String util_profil) {
		this.util_profil = util_profil;
	}

}