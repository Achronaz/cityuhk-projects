package view;

import java.util.Scanner;
import java.util.regex.Pattern;

import util.DaoFactory;

public abstract class View{

	protected Scanner sc;
	protected DaoFactory dao;

	public View(Scanner sc) throws Exception {
		this.sc = sc;
		dao = DaoFactory.getInstance();
	}

	public static enum Command {
		
		// user, vip
		showProduct("^product -s$"), 
		addToCart("^cart -a \\d+ \\d+(;\\d+ \\d+)*$"),
		removeFromCart("^cart -r \\d+$"),
		showCart("^cart -s$"),
		buyProduct("^buy$"),
		showPurchaseHistory("^history$"),

		// staff
		createProduct("^product -c \\w+ \\w+ \\w+ (\\d*.)?\\d+ \\d+$"),
		updateProduct("^product -u \\d+ (name|desc|type|price|inventory) [.\\w]+$"),
		deleteProduct("^product -d \\d+"),
		searchOrder("^order -s (all|\\w+)$"),
		
		// manager
		createUser("^user -c \\w+ \\w+ \\w+$"),
		updateUser("^user -u \\d+ (name|password|role) \\w+$"),
		deleteUser("^user -d \\d+$"),
		showUser("^user -s$"),
		showAudit("^audit -s$"),

		// Public
		exit("^exit$"), 
		cmd("^cmd$"),
		login("^login \\w+ \\w+$"),
		logout("^logout$"),
		register("^register \\w+ \\w+ \\w+$"),
		invalid("");

		private final String regex;

		Command(String regex) {
			this.regex = regex;
		}

		String regex() {
			return this.regex;
		}
	}

	public Command mapCommand(String cmd) {
		for (Command command : Command.values())
			if (Pattern.matches(command.regex(), cmd))
				return command;
		return Command.invalid;
	}

	public static String r(String str, int time) {
		String temp = "";
		for (int i = 0; i < time; i++)
			temp += str;
		return temp;
	}
	
	public abstract void showMenu() throws Exception;

	public abstract void showCommand() throws Exception;
}
