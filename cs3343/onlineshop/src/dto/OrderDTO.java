package dto;

import java.util.Date;

public class OrderDTO extends DTO {
	
	private String product;
	private String user;
	private int qty;
	private double amounts;
	private Date date;
	
	public OrderDTO () {}
	public OrderDTO (String id, String product, String user, int qty, double amounts) {
		super(id);
		this.product = product;
		this.user = user;
		this.qty = qty;
		this.amounts = amounts;
		this.date = new Date();
	}

	public String getProduct() {
		return product;
	}
	public void setProduct(String product) {
		this.product = product;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String user) {
		this.user = user;
	}
	public int getQty() {
		return qty;
	}
	public void setQty(int qty) {
		this.qty = qty;
	}
	public double getAmounts() {
		return amounts;
	}
	public void setAmounts(double amounts) {
		this.amounts = amounts;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	
}
