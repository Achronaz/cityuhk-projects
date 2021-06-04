package test;

import static org.junit.Assert.assertEquals;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

import org.junit.Test;

import dao.ProductDAO;
import dto.ProductDTO;
import view.PublicView;
import view.View;

public class SystemTest extends JUnitTest {
	
	@Test
	//TC_54
	public void public_user_system_test_1() throws Exception {
		String command = "cmd\n";
		command += "invalid_command\n";
		command += "register user pwd pwd\n";
		command += "register newuser pwd pwd1\n";
		command += "register newuser pwd pwd\n";
		command += "login newuser pwd\n";
		command += "logout\nexit\n";
		System.setIn(new ByteArrayInputStream(command.getBytes()));
		Scanner scanner = new Scanner(System.in);
		PublicView publicView = new PublicView(scanner);
		publicView.showMenu();
		assertEquals(true, userDAO.all().nameExist("newuser"));
	}
	
	@Test
	//TC_55
	public void user_system_test_1() throws Exception {
		String command = "login user pwd\n";
		command += "cmd\n";
		command += "invalid_command\n";
		command += "product -s\n";
		command += "cart -a 1 1\n";
		command += "cart -s\n";
		command += "cart -r 1\n";
		command += "cart -a 1 1\n";
		command += "buy\n";
		command += "history\n";
		command += "logout\nexit\n";
		System.setIn(new ByteArrayInputStream(command.getBytes()));
		Scanner scanner = new Scanner(System.in);
		PublicView publicView = new PublicView(scanner);
		publicView.showMenu();
		boolean expected = orderDAO.all().list().stream().filter(o->{
			return 	o.getUser().equals("user") && 
					o.getProduct().equals("product1") &&
					o.getQty() == 1;
		}).collect(Collectors.toList()).size() > 0;
		assertEquals(true, expected);
	}
	
	@Test
	//TC_56
	public void staff_system_test_1() throws Exception {
		String command = "login staff pwd\n";
		command += "cmd\n";
		command += "invalid_command\n";
		command += "product -c pname pdesc ptype 10.0 10\n";
		command += "product -u 6 price invalid_value\n";
		command += "product -d 9\n";
		command += "product -d 6\n";
		command += "product -c pname pdesc ptype 10.0 10\n";
		command += "product -s\n";
		command += "product -u 6 name pname1\n";
		command += "product -u 6 desc pdesc1\n";
		command += "product -u 6 type ptype1\n";
		command += "product -u 6 price 10.1\n";
		command += "product -u 6 inventory 11\n";
		command += "product -u 6 inventory 11.1\n";
		command += "product -u 6 invalid_field value\n";
		command += "order -s user\n";
		command += "order -s all\n";
		command += "order -s invalid_user\n";
		command += "logout\nexit\n";
		System.setIn(new ByteArrayInputStream(command.getBytes()));
		Scanner scanner = new Scanner(System.in);
		PublicView publicView = new PublicView(scanner);
		publicView.showMenu();
		boolean expected = productDAO.all().list().stream().filter(o->{
			return  o.getName().equals("pname1") && 
					o.getDesc().equals("pdesc1") && 
					o.getType().equals("ptype1") && 
					o.getPrice() == 10.1 && 
					o.getInventory() == 11;
		}).collect(Collectors.toList()).size() > 0;
		assertEquals(true, expected);
	}
	
	@Test
	//TC_57
	public void manager_system_test_1() throws Exception {
		String command = "login manager pwd\n";
		command += "cmd\n";
		command += "invalid_command\n";
		command += "user -c user pwd user\n";
		command += "user -c user5 pwd user\n";
		command += "user -s\n";
		command += "user -d 5\n";
		command += "user -c user5 pwd user\n";
		command += "user -u 5 name newuser5\n";
		command += "user -u 5 password newpwd\n";
		command += "user -u 5 role vip\n";
		command += "audit -s\n";
		command += "logout\nexit\n";
		System.setIn(new ByteArrayInputStream(command.getBytes()));
		Scanner scanner = new Scanner(System.in);
		PublicView publicView = new PublicView(scanner);
		publicView.showMenu();
		boolean expected = userDAO.all().list().stream().filter(o->{
			return  o.getName().equals("newuser5") && 
					o.getPassword().equals("newpwd") && 
					o.getRole().equals("vip");
		}).collect(Collectors.toList()).size() > 0;
		assertEquals(true, expected);
	}
	
	
	@Test
	//TC_58
	public void user_system_test_2() throws Exception {
		String command = "login user pwd\n";
		command += "product -s\n";
		command += "cart -a 1 2\n";
		command += "cart -a 1 3\n";
		command += "cart -a 1 4\n";
		command += "cart -a 1 2\n";
		command += "buy\n";
		command += "logout\nexit\n";
		boolean expected = false;
		runCommand(command,false);		
		try {
		int stock= productDAO.all().name("product1").list().get(0).getInventory();
		if(stock == 1) //default stock is 10 for product1
			expected = true;
		}catch(NullPointerException e) {
			expected = false;
		}catch(Exception e) {
			
		}
		assertEquals(true, expected);
	}
	
	@Test
	//TC_59
	public void user_system_test_3() throws Exception {
		String command = "login user pwd\n";
		command += "product -s\n";
		command += "cart -a 1 2\n";
		command += "cart -a 1 3\n";
		command += "cart -a 1 4\n";
		command += "cart -r 1\n";
		command += "cart -a 1 2\n";
		command += "buy\n";
		command += "logout\nexit\n";
		runCommand(command,false);
		boolean expected = false;
		try {
		int stock= productDAO.all().name("product1").list().get(0).getInventory();
		if(stock == 8) //default stock is 10 for product1 when test case run test 
			expected = true;
		}catch(Exception e) {
			
		}
		assertEquals(true, expected);
	}
	@Test
	//TC_60
	public void user_system_test_4() throws Exception {
		String command = "login user pwd\n";
		command += "product -s\n";
		command += "cart -a 1 2\n";
		command += "cart -a 2 2\n";
		command += "cart -a 3 2\n";
		command += "cart -a 4 2\n";			
		command += "buy\n";
		command += "logout\nexit\n";
		runCommand(command,false);
		boolean expected = false;
		try {
		List<ProductDTO> dtoList= productDAO.all().list();
		if(dtoList.get(0).getInventory()== 8 ) //default stock is 10 for product1 when test case run test
			if(dtoList.get(1).getInventory()== 38 )
				if(dtoList.get(2).getInventory()== 28 )
					if(dtoList.get(3).getInventory()== 48 )
							expected = true;
		}catch(Exception e) {
			expected = false;
		}
		assertEquals(true, expected);
	}
	@Test
	//TC_61
	public void user_system_test_5() throws Exception {
		String command = "login user pwd\n";					
		command += "cart -a 1 2\n";
		command += "cart -a 2 2\n";
		command += "cart -a 3 2\n";
		command += "cart -a 4 2\n";			
		//command += "buy\n";
		//command += "logout\nexit\n";
		boolean expected = false;
		String output = "";
		try {						
			output = runCommand(command,true);
		}catch(Exception e) {
			//for keep the junit not break by errors 
			//or the whole system does not end manully e.g. command += "logout\nexit\n"
			output = getOutput();
		}
		if(output.contains("no available product 1"))
			if(output.contains("no available product 2"))
				if(output.contains("no available product 3"))
					if(output.contains("no available product 4"))
						expected = true;
		assertEquals(true, expected);
	}
	@Test
	//TC_62
	public void user_system_test_6() throws Exception {
		String command = "login user pwd\n";
		command += "product -s\n";
		command += "cart -a 1 2\n";
		command += "cart -a 2 2\n";
		command += "cart -a 3 2\n";
		command += "cart -a 4 2\n";
		command += "cart -r 3\n";
		command += "cart -r 3\n";
		command += "cart -r 3\n";
		//command += "logout\nexit\n";
		boolean expected = false;
		String output = "";
		try {						
			output = runCommand(command,true);
		}catch(Exception e) {
			output = getOutput();
		}
		if(output.substring(output.length()-30).contains("invalid index"))
			expected = true;
		assertEquals(true, expected);
	}

	@Test
	//TC_63
	public void user_system_test_7() throws Exception
	{		
		boolean expected = false;
		String output = "";
		String command = "login staff pwd\n";
		command += "product -s\n";
		command += "product -u 1 inventory 20\n";
		command += "logout\n";
		command += "login user pwd\n";
		command += "product -s\n";
		command += "cart -a 1 15\n";
		try {						
			output = runCommand(command,true);					
		}catch(Exception e) {
			output = getOutput();
		}
		if(output.substring(output.length()-30).contains("added"))
			expected = true;
		assertEquals(true, expected);
	} 

	@Test
	//TC_64
	public void user_system_test_8() throws Exception
	{
		boolean expected = false;String output="";String command ="";
		command += "login staff pwd\n";
		command += "product -s\n";
		command += "product -u 1 price 20.3\n";
		command += "logout\n";
		command += "login user pwd\n";
		command += "product -s\n";
		command += "cart -a 1 10\n";
		command += "buy\n";
		command += "history\n";
		try {						
			output = runCommand(command,true);					
		}catch(Exception e) {
			output = getOutput();
		}
		if(output.contains("20.3 * 10 = 203.0"))
			expected = true;
		assertEquals(true, expected);
	}
	
	@Test
	//TC_65
	public void user_system_test_10() throws Exception
	{
		boolean expected = false;String output="";String command ="";
		command += "login staff pwd\n";
		command += "product -s\n";
		command += "product -u 1 name newproduct1\n";
		command += "logout\n";
		command += "login user pwd\n";
		command += "product -s\n";		
		try {						
			output = runCommand(command,true);					
		}catch(Exception e) {
			output = getOutput();
		}	
		if(output.contains("newproduct1"))
			expected = true;
		assertEquals(true, expected);
	}

	@Test
	//TC_66
	public void user_system_test_11() throws Exception
	{
		boolean expected = false;String output="";String command ="";
		command += "login staff pwd\n";
		command += "product -s\n";
		command += "product -u 1 inventory 5\n";
		command += "logout\n";
		command += "login user pwd\n";
		command += "product -s\n";
		command += "cart -a 1 6\n";
		try {						
			runCommand(command,true);
		}catch(Exception e) {
			output = getOutput();
		}		
		if(output.contains("product 1 out of stock"))
			expected = true;
		assertEquals(true, expected);
	}
	
	
	
	
	//helper function to set up the system test 
	//since all test case in system test should start at PublicView First
	private String runCommand(String cmd,boolean needScreen) throws Exception {
		System.setIn(new ByteArrayInputStream(cmd.getBytes()));
		Scanner scanner = new Scanner(System.in);
		PublicView publicView = new PublicView(scanner);
		if(needScreen)
			setOutput();
		publicView.showMenu();
		if(needScreen)
			return getOutput();
		return "finish";
	}
}

