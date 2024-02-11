package sn.jmad.sonac.model;
import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import lombok.Data;
import lombok.NoArgsConstructor;

@Table(name = "abou")
@IdClass(ComposedKey.class)
@NoArgsConstructor
@Data
//@Entity
public class MyEntity_test implements Serializable{
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Id
	private String identity; 

	private String otherFields;
	
	

}
