package test;

import static org.junit.Assert.assertEquals;

import java.util.Scanner;

import org.junit.Test;

import dto.UserDTO;
import view.ManagerView;

public class ManagerTest extends JUnitTest {
	
	UserDTO manager = new UserDTO("07722c1e-1a90-4c03-9638-d0f8fde2f852","manager","pwd","manager");
	Scanner scanner = new Scanner(System.in);
	ManagerView managerView = new ManagerView(scanner, manager);
	
	public ManagerTest() throws Exception {}
	
	@Test
	//TC_25
	public void manager_create_user_1() throws Exception {
		setOutput();
		managerView.createUser("user -c user3 pwd user");
		assertEquals("created",getOutput());
	}
	
	@Test
	//TC_26
	public void manager_create_user_2() throws Exception {
		setOutput();
		managerView.createUser("user -c user pwd user");
		assertEquals("name exists",getOutput());
	}
	
	@Test
	//TC_27
	public void manager_update_user_1() throws Exception {
		
		managerView.showUser();
		setOutput();
		managerView.updateUser("user -u 1 name newuser");
		boolean nameUpdated = "updated".equals(getOutput());
		setOutput();
		managerView.updateUser("user -u 1 password newpwd");
		boolean passwordUpdated = "updated".equals(getOutput());
		setOutput();
		managerView.updateUser("user -u 1 role vip");
		boolean roleUpdated = "updated".equals(getOutput());
		boolean expected = nameUpdated && passwordUpdated && roleUpdated;
		assertEquals(true, expected);
	}
	@Test
	//TC_28
	public void manager_update_user_2() throws Exception {
		managerView.showUser();
		setOutput();
		managerView.updateUser("user -u 11 name newname");
		assertEquals("invalid index",getOutput());
	}
	@Test
	//TC_29
	public void manager_update_user_3() throws Exception {
		setOutput();
		managerView.updateUser("user -u 1 name newname");
		assertEquals("no available user selected",getOutput());
	}
	
	
	@Test
	//TC_30
	public void manager_delete_user_1() throws Exception {
		managerView.showUser();
		setOutput();
		managerView.deleteUser("user -d 1");
		assertEquals("deleted",getOutput());
	}
	
	@Test
	//TC_31
	public void manager_delete_user_2() throws Exception {
		managerView.showUser();
		setOutput();
		managerView.deleteUser("user -d 11");
		assertEquals("invalid index",getOutput());
	}
	
	@Test
	//TC_32
	public void manager_delete_user_3() throws Exception {
		setOutput();
		managerView.deleteUser("user -d 1");
		assertEquals("no available user selected",getOutput());
	}

}
