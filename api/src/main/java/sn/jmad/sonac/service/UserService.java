package sn.jmad.sonac.service;

import java.time.*;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import sn.jmad.sonac.model.Utilisateur;
import sn.jmad.sonac.repository.UtilisateurRepository;


@Service
public class UserService {

	private static final long EXPIRE_TOKEN_AFTER_MINUTES = 30;

	@Autowired
	private UtilisateurRepository utilisateurRepository;

    @Autowired
	PasswordEncoder encoder;

	public String forgotPassword(String email) {

		Optional<Utilisateur> utilisateurOptional = Optional
				.ofNullable(utilisateurRepository.findByMail(email));

		if (!utilisateurOptional.isPresent()) {
			return "Invalid email id.";
		}

		Utilisateur utilisateur = utilisateurOptional.get();
		utilisateur.setToken(generateToken());
		utilisateur.setTokenCreationDate(LocalDateTime.now());

		utilisateur = utilisateurRepository.save(utilisateur);

		return utilisateur.getToken();
	}

	public String resetPassword(String token, String password) {

		Optional<Utilisateur> utilisateurOptional = Optional
				.ofNullable(utilisateurRepository.findByToken(token));

		if (!utilisateurOptional.isPresent()) {
			return "Invalid token.";
		}

		LocalDateTime tokenCreationDate = utilisateurOptional.get().getTokenCreationDate();

		if (isTokenExpired(tokenCreationDate)) {
			return "Token expired.";

		}

		Utilisateur utilisateur = utilisateurOptional.get();

		utilisateur.setUtil_password(encoder.encode(password));
		utilisateur.setToken(null);
		utilisateur.setTokenCreationDate(null);

		utilisateurRepository.save(utilisateur);

		return "Your password successfully updated.";
	}

	private String generateToken() {
		StringBuilder token = new StringBuilder();

		return token.append(UUID.randomUUID().toString())
				.append(UUID.randomUUID().toString()).toString();
	}

	private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {

		LocalDateTime now = LocalDateTime.now();
		Duration diff = Duration.between(tokenCreationDate, now);

		return diff.toMinutes() >= EXPIRE_TOKEN_AFTER_MINUTES;
	}
}