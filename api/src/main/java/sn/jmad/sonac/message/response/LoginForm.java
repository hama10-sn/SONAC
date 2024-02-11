package sn.jmad.sonac.message.response;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

public class LoginForm {
    @NotBlank
    @Size(min=3, max = 60)
    private String util_login;

    @NotBlank
    @Size(min = 6, max = 40)
    private String util_password;

	public String getUtil_login() {
		return util_login;
	}

	public void setUtil_login(String util_login) {
		this.util_login = util_login;
	}

	public String getUtil_password() {
		return util_password;
	}

	public void setUtil_password(String util_password) {
		this.util_password = util_password;
	}

   
}