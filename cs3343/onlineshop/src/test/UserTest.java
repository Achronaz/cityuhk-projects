package test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Scanner;

import org.junit.Test;

import dto.UserDTO;
import view.UserView;
public class UserTest extends JUnitTest {
	
	UserDTO user = new UserDTO("96ed8587-5e27-4a0b-ba70-99b206082c6b", "user", "pwd", "user");
	UserDTO vip = new UserDTO("2b3ab30d-7faf-4b6a-9012-fce455afe599", "vip", "pwd", "vip");
	Scanner scanner = new Scanner(System.in);
	UserView userView = new UserView(scanner, user);
	UserView vipView = new UserView(scanner, vip);
	
	public UserTest() throws Exception {}
	
	
	@Test
	//TC_06
	public void user_buy_product_1() throws Exception {
		userView.showProduct();
		userView.addToCart("cart -a 1 1");
		setOutput();
		userView.buyProduct();
		assertEquals("buy success",getOutput());
	}
	
	@Test
	//TC_07
	public void user_buy_product_2() throws Exception {
		setOutput();
		userView.buyProduct();
		assertEquals("cart is empty",getOutput());
	}
	
	@Test
	//TC_08
	public void user_add_to_cart_1() throws Exception {
		userView.showProduct();
		setOutput();
		userView.addToCart("cart -a 1 1");
		assertEquals("added",getOutput());
	}
	@Test
	//TC_09
	public void user_add_to_cart_2() throws Exception {
		userView.showProduct();
		setOutput();
		userView.addToCart("cart -a 1 1;1 2;");
		assertEquals("addedadded",getOutput());
	}
	@Test
	//TC_10
	public void user_add_to_cart_3() throws Exception {
		userView.showProduct();
		setOutput();
		userView.addToCart("cart -a 1 11");
		assertEquals("product 1 out of stock",getOutput());
	}
	@Test
	//TC_11
	public void user_add_to_cart_4() throws Exception {
		userView.showProduct();
		setOutput();
		userView.addToCart("cart -a 11 1");
		assertEquals("no available product 11",getOutput());
	}
	@Test
	//TC_12
	public void user_add_to_cart_5() throws Exception {
		userView.showProduct();
		setOutput();
		userView.addToCart("cart -a 1 0");
		assertEquals("quantity cannot be 0",getOutput());
	}
	@Test
	//TC_13
	public void user_remove_from_cart_1() throws Exception {
		userView.showProduct();
		userView.addToCart("cart -a 1 1");
		setOutput();
		userView.removeFromCart("cart -r 1");
		assertEquals("removed",getOutput());
	}
	@Test
	//TC_14
	public void user_remove_from_cart_2() throws Exception {
		userView.showProduct();
		userView.addToCart("cart -a 1 1");
		setOutput();
		userView.removeFromCart("cart -r 2");
		assertEquals("invalid index",getOutput());
	}
	
}
