package test;

import static org.junit.Assert.assertEquals;

import java.io.ByteArrayInputStream;
import java.util.Scanner;

import org.junit.Test;

import dto.UserDTO;
import view.PublicView;

public class PublicTest extends JUnitTest {
	
	private void loginTest(String name,String role) throws Exception {
		String cmd = "login "+name+" pwd\nlogout\nexit";
		System.setIn(new ByteArrayInputStream(cmd.getBytes()));
		PublicViewCustom view = new PublicViewCustom(new Scanner(System.in));
		view.showMenu();
		UserDTO user = view.getUser();		
		assertEquals(user.getRole(),role);		
	}
	
	@Test
	//TC_01
	public void login_as_user() throws Exception{
		loginTest("user","user");
	}
	@Test
	//TC_02
	public void login_as_vip() throws Exception{
		loginTest("vip","vip");
	}
	@Test
	//TC_03
	public void login_as_staff() throws Exception{
		loginTest("staff","staff");
	}
	@Test
	//TC_04
	public void login_as_manager() throws Exception{
		loginTest("manager","manager");
	}
	@Test
	//TC_05
	public void login_fail() throws Exception {
		setOutput();
		new PublicView(new Scanner(System.in)).login("login user 111");
		assertEquals("login failed", getOutput());
	}
	
}
//stub
class PublicViewCustom extends PublicView{

	public PublicViewCustom(Scanner sc) throws Exception {
		super(sc); 
	}
	public UserDTO getUser() {
		return this.user;
	}
}
