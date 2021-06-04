package view;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.Scanner;

import dao.AuditDAO;
import dao.UserDAO;
import dto.AuditDTO;
import dto.UserDTO;
import util.Utils;

public class PublicView extends View {

	private UserDAO userDAO;
	private AuditDAO auditDAO;
	public UserDTO user;
	
	public PublicView(Scanner sc) throws Exception {
		super(sc);
		this.userDAO = dao.create(UserDAO.class);
		this.auditDAO = dao.create(AuditDAO.class);
	}

	@Override
	public void showMenu() throws Exception {
		String cmd = "";
		System.out.println("Welcome to our online shopping system!");
		System.out.println("What do you want to do?");
		showCommand();
		
		boolean terminated = false;
		while(!terminated) {
			System.out.print("Public(guest) > ");
			cmd = sc.nextLine();
			switch(mapCommand(cmd)) {
				case login: login(cmd);	break;
				case cmd: showCommand(); break;
				case exit: terminated = true; break;
				case register: register(cmd);break;
				default: Utils.print("invalid command");;				
			}
		}
		System.out.println("\nThx for using our system.");
	}
	public void register(String cmd) throws Exception {
		String[] cmds = cmd.replace("register ", "").split(" ");
		if(userDAO.nameExist(cmds[0])) {
			Utils.print("name exists");
			return;
		}
		if(!Objects.equals(cmds[1], cmds[2])) {
			Utils.print("confirm password does not match");
			return;
		}
		UserDTO u = new UserDTO(null, cmds[0], cmds[1], "user");
		AuditDTO audit = new AuditDTO(null, "GUEST", "REGISTER_USER", u.getName(), new Date(System.currentTimeMillis()));
		if(userDAO.repo().save(u) != null && auditDAO.repo().save(audit) != null) {
			Utils.print("register success");
		} else {
			Utils.print("unexpected error");
		}
	}

	public void showCommand() throws Exception {
		System.out.format("Available Commands:%n");
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"Command","Description"});
		rows.add(new String[] {"login <account> <password>", "Login the system"});
		rows.add(new String[] {"register <account> <password> <confirm passowrd>", "register account"});
		rows.add(new String[] {"cmd", "Show the command list"});
		rows.add(new String[] {"exit", "Exit the system"});
		Utils.printTable(rows,new int[] {55,40});
	}

	public void login(String cmd) throws Exception {
		String[] cmds = cmd.replace("login", "").trim().split(" ");
		//check
		user = userDAO.login(cmds[0],cmds[1]);
		if(user != null) {
			switch(user.getRole()) {
				case "vip": 
				case "user": new UserView(sc, user).showMenu(); break;
				case "staff": new StaffView(sc, user).showMenu(); break;
				case "manager": new ManagerView(sc, user).showMenu();break;
				default: System.out.println("unimplemented role");
			}
		} else {
			Utils.print("login failed");
		}
	}
}
