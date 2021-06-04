package util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import dto.AuditDTO;
import dto.OrderDTO;
import dto.ProductDTO;
import dto.UserDTO;

public class Utils {
	
	public static String generateId() {
		return UUID.randomUUID().toString();
	}
	
	public static String formatDate(Date date) {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");  
		return dateFormat.format(date);  
	}
	
	public static void print(String msg) {
		System.out.print(msg+"\n");
	}
	
	public static void initJsonDb() throws Exception {
		Repository db;

		db = new Repository(UserDTO.class);
		db.reset();
		db.save(new UserDTO(null, "user","pwd", "user"));
		db.save(new UserDTO(null, "staff","pwd", "staff"));
		db.save(new UserDTO(null, "manager","pwd", "manager"));
		db.save(new UserDTO(null, "vip","pwd", "vip"));

		db = new Repository(ProductDTO.class);
		db.reset();
		db.save(new ProductDTO(null, "product1","desc1", "type1", 10.0, 10));
		db.save(new ProductDTO(null, "product4","desc4", "type4", 40.0, 40));
		db.save(new ProductDTO(null, "product3","desc3", "type3", 30.0, 30));
		db.save(new ProductDTO(null, "product5","desc5", "type5", 50.0, 50));
		db.save(new ProductDTO(null, "product2","desc2", "type2", 20.0, 20));
		
		db = new Repository(OrderDTO.class);
		db.reset();
		db.save(new OrderDTO(null, "product1", "user", 1, 10.0));
		db.save(new OrderDTO(null, "product1", "vip", 1, 8.0));
		db = new Repository(AuditDTO.class);
		db.reset();
		
	}
	
	public static void printTable(List<String[]> rows, int[] widths) {
		int clength = rows.get(0).length;
		int rlength = rows.size();
		
		String format = "│";
		for(int i=0; i<clength; i++) format += " %-"+widths[i]+"s │";
		format +="%n";
		
		System.out.format("┌─");
		for(int i=0; i<clength - 1; i++) 
			System.out.format(strRepeat("─",widths[i])+"─┬─");
		System.out.format(strRepeat("─",widths[clength - 1])+"─┐%n");
		
		System.out.format(format, rows.get(0));
		
		System.out.format("├─");
		for(int i=0; i<clength - 1; i++) 
			System.out.format(strRepeat("─",widths[i])+"─┼─");
		System.out.format(strRepeat("─",widths[clength - 1])+"─┤%n");
		
		for(int i=1; i<rlength; i++) 
			System.out.format(format, rows.get(i));
		
		System.out.format("└─");
		for(int i=0; i<clength - 1; i++) 
			System.out.format(strRepeat("─",widths[i])+"─┴─");
		System.out.format(strRepeat("─",widths[clength - 1])+"─┘%n");
	}
	
	public static String strRepeat(String str, int time) {
		String temp = "";
		for (int i = 0; i < time; i++)
			temp += str;
		return temp;
	}
}
