package view;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import dao.OrderDAO;
import dao.ProductDAO;
import dto.OrderDTO;
import dto.ProductDTO;
import dto.UserDTO;
import dto.role.Role;
import dto.role.User;
import dto.role.Vip;
import util.Utils;

public class UserView extends View {
	
	private UserDTO user;
	private List<OrderDTO> cart;
	private List<ProductDTO> list;
	private ProductDAO productDAO;
	private OrderDAO orderDAO;
	private Role role;
	private double discount;

	public UserView(Scanner sc, UserDTO user) throws Exception {
		super(sc);
		this.user = user;
		this.cart = new ArrayList<OrderDTO>();
		this.list = new ArrayList<ProductDTO>();
		this.productDAO = dao.create(ProductDAO.class);
		this.orderDAO = new OrderDAO();
		switch(user.getRole()) {
			case "user": this.role = new User(); break;
			case "vip": this.role = new Vip(); break;
		}
		if(this.role != null) {
			this.discount = role.getDiscount();
		}
	}

	public void showMenu() throws Exception {
		String cmd = "";
		System.out.println("Welcome " + user.getName() + " to our online shopping store");
		showCommand();
		while (!cmd.equals("logout")) {
			if (cmd == "invalid")
				System.out.println("Please Use cmd to check the available commands:");
			System.out.print(user.getName()+"("+user.getRole()+")>");
			cmd = sc.nextLine();
			switch (mapCommand(cmd)) {
				case showProduct: showProduct(); break;
				case addToCart: addToCart(cmd); break;
				case removeFromCart: removeFromCart(cmd); break;
				case showCart: showCart(); break;
				case buyProduct: buyProduct(); break;
				case showPurchaseHistory: showHistory(); break;
				case cmd: showCommand(); break;
				case logout: System.out.println("Logging out the account: " + user.getName()); break;
				default: System.out.println("Invalid Command.");
			}
		}	
	}
	
	public void showHistory() throws Exception {
		List<OrderDTO> list = orderDAO.all().user(user.getName()).list();
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"Name","Type","Quantity","Total($)","Date"});
		for(OrderDTO order: list) {
			ProductDTO product = productDAO.all().name(order.getProduct()).list().get(0);
			rows.add(new String[] {product.getName(), product.getType(), ""+order.getQty(), (order.getAmounts() / order.getQty()) + " * " + order.getQty() +" = "+  order.getAmounts(), Utils.formatDate(order.getDate())});
		}
		Utils.printTable(rows,new int[] {20,10,10,20,20});
	}
	
	public void showProduct() throws Exception {		
		list = productDAO.all().list();
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"#","Name","Type","Price($)","Stock","Description"});
		for (int i = 0; i < list.size(); i++) 
			rows.add(new String[] {""+(i+1), list.get(i).getName(), list.get(i).getType(), ""+list.get(i).getPrice() * discount, ""+list.get(i).getInventory(), list.get(i).getDesc()});
		Utils.printTable(rows,new int[] {3,20,10,8,5,20});
	}

	public void addToCart(String cmd) throws Exception {
		String[] cmds = cmd.replace("cart -a ", "").trim().split(";");
		
		outerloop:
		for(String c: cmds) {
			int idx = Integer.parseInt(c.split(" ")[0]);
			int qty = Integer.parseInt(c.split(" ")[1]);
			ProductDTO product = null;
			boolean updated = false;
			try {
				
				product = list.get(idx - 1);
				if(product.getInventory() < qty) {
					Utils.print("product "+idx+" out of stock");
					continue;
				}
				
				if(qty == 0){
					Utils.print("quantity cannot be 0");
					continue;
				}
					
				for (int i = 0; i < cart.size(); i++) {
					if(cart.get(i).getProduct().equals(product.getName())) {
						int newQty = cart.get(i).getQty() + qty;
						if(product.getInventory() < newQty) {
							Utils.print("product "+idx+" out of stock");
							updated = false;
							continue outerloop;
						} else {
							cart.set(i, new OrderDTO(null, product.getName(), user.getName(), newQty, product.getPrice() * discount * newQty));
							updated = true;
						}
					}
				}
					
				if(!updated) {
					cart.add(new OrderDTO(null, product.getName(), user.getName(), qty, product.getPrice() * discount * qty));
					updated = true;
				}
				
				if(updated)
					Utils.print("added");
				
			} catch (IndexOutOfBoundsException ex) {
				Utils.print("no available product "+idx);
				continue;
			}
			
		}
		//showCart();
	}
	public void removeFromCart(String cmd) {
		try {
			cart.remove(Integer.parseInt(cmd.replace("cart -r ","")) - 1);
			Utils.print("removed");
		}catch(IndexOutOfBoundsException ex){
			Utils.print("invalid index");
		}		
	}
	
	public void buyProduct() throws Exception {
		if(cart.isEmpty()) {
			Utils.print("cart is empty");
			return;
		}
		for(OrderDTO odr: cart) {
			ProductDTO product = productDAO.all().name(odr.getProduct()).list().get(0);
			product.setInventory(product.getInventory() - odr.getQty());
			if(productDAO.repo().save(product) != null && orderDAO.repo().save(odr) != null) {
				Utils.print("buy success");
			}
		}
		cart.clear();
	}
	
	public void showCart() throws Exception {
		System.out.format("Shopping Cart:%n");
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"No","Name","Type","Quantity","Total($)"});
		for(int i=0; i<cart.size(); i++) {
			ProductDTO product = productDAO.all().name(cart.get(i).getProduct()).list().get(0);
			rows.add(new String[] {""+(i+1), product.getName(), product.getType(), ""+cart.get(i).getQty(), product.getPrice() * discount + " * " + cart.get(i).getQty() +" = "+  cart.get(i).getAmounts()});
		}
		Utils.printTable(rows,new int[] {5,20,10,10,20});
	}

	public void showCommand() {
		System.out.format("Available Commands:%n");
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"Command","Description"});
		rows.add(new String[] {"product -s", "show product"});
		rows.add(new String[] {"buy", "buy product"});
		rows.add(new String[] {"cart -s", "show shopping cart"});
		rows.add(new String[] {"cart -a <index> <quantity>", "add product to shoping cart"});
		rows.add(new String[] {"cart -r <index>", "remove product from shoping cart"});
		rows.add(new String[] {"history", "show purchase history"});
		rows.add(new String[] {"cmd", "show commands"});
		rows.add(new String[] {"logout", "logout"});
		Utils.printTable(rows,new int[] {30,40});
	}
	
	public List<OrderDTO> getCart() {return cart;}
	public List<ProductDTO> getList() {return list;}
	public double getDiscount() {return discount;}

}
