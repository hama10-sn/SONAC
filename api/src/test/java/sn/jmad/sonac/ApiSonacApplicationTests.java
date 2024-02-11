package sn.jmad.sonac;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

//@SpringBootTest
class ApiSonacApplicationTests {
	
	Calculator c = new Calculator();

	@Test
	void additionTest() {
		int num1 = 20;
		int num2 = 30;
		int s = c.add(num1, num2);
		assertThat(s).isEqualTo(50);
	}
	
	class Calculator {
		
		int add(int a, int b){
			return a+b;
		}
		
	}

}
