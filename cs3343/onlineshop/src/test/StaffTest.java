package test;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.Test;

import dto.UserDTO;
import view.StaffView;

public class StaffTest extends JUnitTest {

	UserDTO staff = new UserDTO("861db99a-e0e9-4878-bd68-55aa642d13e0", "staff", "pwd", "staff");

	public StaffTest() throws Exception {}

	@Test
	//TC_15
	public void staff_create_product_1() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		setOutput();
		staffView.createProduct("product -c product6 desc6 type6 66.6 66");
		assertEquals("created", getOutput());
	}

	@Test
	//TC_16
	public void staff_update_product_1() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		staffView.createProduct("product -c product6 desc6 type6 66.6 66");
		staffView.showProduct();
		setOutput();
		staffView.updateProduct("product -u 6 name product66");
		boolean nameUpdated = "updated".equals(getOutput());
		setOutput();
		staffView.updateProduct("product -u 6 desc desc66");
		boolean descUpdated = "updated".equals(getOutput());
		setOutput();
		staffView.updateProduct("product -u 6 type type66");
		boolean typeUpdated = "updated".equals(getOutput());
		setOutput();
		staffView.updateProduct("product -u 6 price 66.66");
		boolean priceUpdated = "updated".equals(getOutput());
		setOutput();
		staffView.updateProduct("product -u 6 inventory 666");
		boolean inventoryUpdated = "updated".equals(getOutput());
		boolean expected = nameUpdated && descUpdated && typeUpdated && priceUpdated && inventoryUpdated;
		assertEquals(true, expected);
	}

	@Test
	//TC_17
	public void staff_update_product_2() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		setOutput();
		staffView.updateProduct("product -u 7 name value");
		assertEquals("invalid index", getOutput());
	}

	@Test
	//TC_18
	public void staff_update_product_3() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		staffView.createProduct("product -c product6 desc6 type6 66.6 66");
		staffView.showProduct();
		setOutput();
		staffView.updateProduct("product -u 6 price invalid_value");
		assertEquals("invalid value", getOutput());
	}

	@Test
	//TC_19
	public void staff_delete_product_1() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		staffView.createProduct("product -c product6 desc6 type6 66.6 66");
		staffView.showProduct();
		setOutput();
		staffView.deleteProduct("product -d 6");
		assertEquals("deleted", getOutput());
	}

	@Test
	//TC_20
	public void staff_delete_product_2() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		setOutput();
		staffView.deleteProduct("product -d 6");
		assertEquals("invalid index", getOutput());
	}

	@Test
	//TC_21
	public void staff_delete_product_3() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		staffView.showProduct();
		setOutput();
		staffView.deleteProduct("product -d 9");
		assertEquals("invalid index", getOutput());
	}

	@Test
	//TC_22
	public void staff_search_order_1() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		assertEquals("success", staffView.searchOrder("order -s user"));
	}

	@Test
	//TC_23
	public void staff_search_order_2() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		assertEquals("user not found", staffView.searchOrder("order -s user111"));
	}

	@Test
	//TC_24
	public void staff_search_order_3() throws Exception {
		StaffView staffView = new StaffView(scanner, staff);
		assertEquals("success", staffView.searchOrder("order -s all"));
	}

}
