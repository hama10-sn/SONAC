package sn.jmad.sonac.model;

import java.io.Serializable;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class ComposedKey implements Serializable{
	private long id;
	private String identity;

}
