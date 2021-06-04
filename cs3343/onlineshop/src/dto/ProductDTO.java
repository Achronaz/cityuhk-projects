package dto;

public class ProductDTO extends DTO {
	private String name;
	private String desc;
	private String type; 
	private double price;
	private int inventory;
	public ProductDTO() {}
	public ProductDTO(String id, String name, String desc, String type, double price, int inventory) {
		super(id);
		this.name = name;
		this.desc = desc;
		this.type = type;
		this.price = price;
		this.inventory = inventory;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public int getInventory() {
		return inventory;
	}
	public void setInventory(int inventory) {
		this.inventory = inventory;
	};
}
