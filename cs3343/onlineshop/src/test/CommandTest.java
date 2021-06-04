package test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Scanner;

import org.junit.Test;

import view.View;
import view.View.Command;

public class CommandTest {
	
	ViewStub viewStub = new ViewStub(new Scanner(System.in));
	public CommandTest() throws Exception {}
	
	@Test
	//TC_33
	public void test_command_01() throws Exception{
		assertEquals(Command.showProduct,viewStub.mapCommand("product -s"));
	}
	@Test
	//TC_34
	public void test_command_02() throws Exception{
		assertEquals(Command.addToCart,viewStub.mapCommand("cart -a 1 1"));
	}
	@Test
	//TC_35
	public void test_command_03() throws Exception{
		assertEquals(Command.removeFromCart,viewStub.mapCommand("cart -r 1"));
	}
	@Test
	//TC_36
	public void test_command_04() throws Exception{
		assertEquals(Command.showCart,viewStub.mapCommand("cart -s"));
	}
	@Test
	//TC_37
	public void test_command_05() throws Exception{
		assertEquals(Command.buyProduct,viewStub.mapCommand("buy"));
	}
	@Test
	//TC_38
	public void test_command_06() throws Exception{
		assertEquals(Command.showPurchaseHistory,viewStub.mapCommand("history"));
	}
	@Test
	//TC_39
	public void test_command_07() throws Exception{
		assertEquals(Command.createProduct,viewStub.mapCommand("product -c p1 d1 t1 1.1 1"));
	}
	@Test
	//TC_40
	public void test_command_08() throws Exception{
		assertEquals(Command.updateProduct,viewStub.mapCommand("product -u 1 name p1"));
	}
	@Test
	//TC_41
	public void test_command_09() throws Exception{
		assertEquals(Command.deleteProduct,viewStub.mapCommand("product -d 1"));
	}
	@Test
	//TC_42
	public void test_command_10() throws Exception{
		assertEquals(Command.searchOrder,viewStub.mapCommand("order -s user"));
	}
	@Test
	//TC_43
	public void test_command_11() throws Exception{
		assertEquals(Command.createUser,viewStub.mapCommand("user -c user5 pwd user"));
	}
	@Test
	//TC_44
	public void test_command_12() throws Exception{
		assertEquals(Command.updateUser,viewStub.mapCommand("user -u 5 name user5"));
	}
	@Test
	//TC_45
	public void test_command_13() throws Exception{
		assertEquals(Command.deleteUser,viewStub.mapCommand("user -d 1"));
	}
	@Test
	//TC_46
	public void test_command_14() throws Exception{
		assertEquals(Command.showUser,viewStub.mapCommand("user -s"));
	}
	@Test
	//TC_47
	public void test_command_15() throws Exception{
		assertEquals(Command.showAudit,viewStub.mapCommand("audit -s"));
	}
	@Test
	//TC_48
	public void test_command_16() throws Exception{
		assertEquals(Command.exit,viewStub.mapCommand("exit"));
	}
	@Test
	//TC_49
	public void test_command_17() throws Exception{
		assertEquals(Command.cmd,viewStub.mapCommand("cmd"));
	}
	@Test
	//TC_50
	public void test_command_18() throws Exception{
		assertEquals(Command.login,viewStub.mapCommand("login user pwd"));
	}
	@Test
	//TC_51
	public void test_command_19() throws Exception{
		assertEquals(Command.logout,viewStub.mapCommand("logout"));
	}
	@Test
	//TC_52
	public void test_command_20() throws Exception{
		assertEquals(Command.register,viewStub.mapCommand("register user5 pwd pwd"));
	}
	@Test
	//TC_53
	public void test_command_21() throws Exception{
		assertEquals(Command.invalid,viewStub.mapCommand("invalid"));
	}

}

class ViewStub extends View {

	public ViewStub(Scanner sc) throws Exception {
		super(sc);
	}

	@Override
	public void showMenu() throws Exception {}

	@Override
	public void showCommand() throws Exception {}
	
}
