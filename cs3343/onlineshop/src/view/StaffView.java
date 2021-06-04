package view;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

import dao.AuditDAO;
import dao.OrderDAO;
import dao.ProductDAO;
import dao.UserDAO;
import dto.AuditDTO;
import dto.OrderDTO;
import dto.ProductDTO;
import dto.UserDTO;
import util.Utils;

public class StaffView extends View {
	
	private UserDTO user;
	private List<ProductDTO> productList;
	private List<OrderDTO> orderList;
	private ProductDAO productDAO;
	private AuditDAO auditDAO;
	private OrderDAO orderDAO;
	private UserDAO userDAO;
	
	public StaffView(Scanner sc, UserDTO user) throws Exception {
		super(sc); 
		this.user = user;
		this.productList = new ArrayList<ProductDTO>();
		this.productDAO = dao.create(ProductDAO.class);
		this.auditDAO = dao.create(AuditDAO.class);
		this.orderDAO = dao.create(OrderDAO.class);
		this.userDAO = dao.create(UserDAO.class);
	}

	public void showMenu() throws Exception {
		String cmd = "";
		System.out.println("Welcome " + user.getName() + " to our online shopping store");
		showCommand();
		while (!cmd.equals("logout")) {
			System.out.print(user.getName()+"("+user.getRole()+")>");
			cmd = sc.nextLine();
			switch (mapCommand(cmd)) {
				case cmd: showCommand(); break;
				case logout: System.out.println("Logging out the account: " + user.getName()); break;
				case createProduct: createProduct(cmd); break;
				case deleteProduct: deleteProduct(cmd); break;
				case updateProduct: updateProduct(cmd); break;
				case showProduct: showProduct(); break;
				case searchOrder: searchOrder(cmd); break;
				default: System.out.println("Invalid Command.");
			}
		}	
	}
	
	public String searchOrder(String cmd) throws Exception {
		
		String key = cmd.replace("order -s ","");
		orderList = new ArrayList<OrderDTO>();
		if("all".equals(key)) {
			orderList = orderDAO.all().list();
		} else {
			try {
				UserDTO u = userDAO.all().name(key).list().get(0);
				orderList = orderDAO.all().user(u.getName()).list();
			}catch(IndexOutOfBoundsException ex) {
				return "user not found";
			}
			
		}
		
		System.out.format("Purchase History:%n");
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"User","Name","Type","Quantity","Total($)","Date"});
		for(OrderDTO order: orderList) {
			ProductDTO product = productDAO.all().name((order.getProduct())).list().get(0);
			UserDTO u = userDAO.all().name(order.getUser()).list().get(0);
			rows.add(new String[] {u.getName(), product.getName(), product.getType(), ""+order.getQty(), product.getPrice() + " * " + order.getQty() +" = "+  order.getAmounts(), Utils.formatDate(order.getDate())});
		}
		Utils.printTable(rows,new int[] {10,20,10,10,20,20});
		
		return "success";
	}

	public void createProduct(String cmd) throws Exception {
		try {
			String[] cmds = cmd.replace("product -c ", "").split(" ");
			String name = cmds[0];
			String desc = cmds[1];
			String type = cmds[2];
			double price = Double.parseDouble(cmds[3]);
			int inventory = Integer.parseInt(cmds[4]);
			ProductDTO savedProduct = (ProductDTO) productDAO.repo().save(new ProductDTO(null, name, desc, type, price, inventory));
			AuditDTO audit = new AuditDTO(null, user.getName(), "CREATE_PRODUCT", savedProduct.getName(), new Date(System.currentTimeMillis()));
			auditDAO.repo().save(audit);
			Utils.print("created");
		}catch(Exception ex) {
			//all invalid command filtered by View.java using Regular Expression
			Utils.print("unexpected error");
		}
	}
	
	public void deleteProduct(String cmd) throws Exception {
		int idx = Integer.parseInt(cmd.replace("product -d ", ""));
		try {
			ProductDTO deletedProduct = productDAO.repo().delete(productList.get(idx - 1));
			AuditDTO audit = new AuditDTO(null, user.getName(), "DELETE_PRODUCT", deletedProduct.getName(), new Date(System.currentTimeMillis()));
			auditDAO.repo().save(audit);
			Utils.print("deleted");
		} catch (IndexOutOfBoundsException ex) {
			Utils.print("invalid index");
		} catch (Exception ex) {
			//all invalid command filtered by View.java using Regular Expression
			Utils.print("unexpected error");
		}
	}
	
	public void updateProduct(String cmd) throws Exception {
		String[] cmds = cmd.replace("product -u ", "").split(" ");
		int idx = Integer.parseInt(cmds[0]) - 1;
		String field = cmds[1];
		String value = cmds[2];
		String old="";
		try {
			ProductDTO product = productList.get(idx);
			old = product.getInventory()+"";
			switch(field) {
				case "name": product.setName(value); break;
				case "desc": product.setDesc(value); break;
				case "type": product.setType(value); break;
				case "price": product.setPrice(Double.parseDouble(value)); break;
				case "inventory": product.setInventory(Integer.parseInt(value)); break;
				default: Utils.print("invalid field"); return;
			}
			AuditDTO audit = new AuditDTO(null, user.getName(), "UPDATE_PRODUCT", product.getName()+"("+field+")"+old+">"+value, new Date(System.currentTimeMillis()));
			productDAO.repo().save(product);
			auditDAO.repo().save(audit);
			productList.set(idx, product);
			Utils.print("updated");
		} catch (IndexOutOfBoundsException ex) {
			Utils.print("invalid index");
		} catch(NumberFormatException ex) {
			Utils.print("invalid value");
		} catch (Exception ex) {
			//all invalid command filtered by View.java using Regular Expression
			Utils.print("unexpected error");
		}
	}

	public void showProduct() throws Exception {
		productList = productDAO.all().list();
		System.out.format("Avaliable Products:%n");	
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"#","Name","Type","Description", "Price($)","Stock"});
		for (int i = 0; i < productList.size(); i++) 
			rows.add(new String[] {""+(i+1), productList.get(i).getName(), productList.get(i).getType(), productList.get(i).getDesc(), ""+productList.get(i).getPrice(), ""+productList.get(i).getInventory()});
		Utils.printTable(rows,new int[] {3,20,10,20,8,5});
	}

	public void showCommand() {
		System.out.format("Avaliable Commands:%n");	
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"Command","Description"});
		rows.add(new String[] {"product -c <name> <desc> <type> <price> <inventory>", "create product"});
		rows.add(new String[] {"product -u <index> <name|desc|type|price|inventory> <value>", "update product"});
		rows.add(new String[] {"product -d <index>", "delete product"});
		rows.add(new String[] {"product -s", "show products"});
		rows.add(new String[] {"order -s <all|name>", "search order"});
		rows.add(new String[] {"cmd", "show commands"});
		rows.add(new String[] {"logout", "logout"});
		Utils.printTable(rows,new int[] {60,40});
	}
	
	public List<OrderDTO> getOrderList() { return orderList; }

}
