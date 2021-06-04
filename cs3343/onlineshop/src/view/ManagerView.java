package view;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

import dao.AuditDAO;
import dao.UserDAO;
import dto.AuditDTO;
import dto.UserDTO;
import util.Utils;

public class ManagerView extends View {
	
	private UserDTO user;
	private UserDAO userDAO;
	private AuditDAO auditDAO;
	private List<UserDTO> userList;
	private List<AuditDTO> auditList;

	public ManagerView(Scanner sc, UserDTO user) throws Exception {
		super(sc);
		this.user = user;
		this.userDAO = dao.create(UserDAO.class);
		this.auditDAO = dao.create(AuditDAO.class);
		this.userList = new ArrayList<UserDTO>();
		this.auditList = new ArrayList<AuditDTO>();
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
				case createUser: createUser(cmd); break;
				case updateUser: updateUser(cmd); break;
				case deleteUser: deleteUser(cmd); break;
				case showUser: showUser(); break;
				case showAudit: showAudit(); break;
				default: Utils.print("invalid command.");
			}
		}	
	}

	public void createUser(String cmd) throws Exception {
		String[] cmds = cmd.replace("user -c ", "").split(" ");
		UserDTO u = new UserDTO(null, cmds[0], cmds[1], cmds[2]);
		if(userDAO.nameExist(u.getName())) {
			Utils.print("name exists");
			return;
		}
		try {
			AuditDTO audit = new AuditDTO(null, user.getName(), "CREATE_USER", u.getName(), new Date(System.currentTimeMillis()));
			userDAO.repo().save(u);
			auditDAO.repo().save(audit);
			userList = userDAO.all().list();
			Utils.print("created");
		} catch(Exception ex) {
			Utils.print("unexpected error");
		}
	}
	
	public void updateUser(String cmd) throws Exception {
		if (userList.isEmpty()) {
			Utils.print("no available user selected");
			return;
		}
		String[] cmds = cmd.replace("user -u ", "").split(" ");
		int idx = Integer.parseInt(cmds[0]);
		String field = cmds[1];
		String value = cmds[2];
		try {
			UserDTO u = userList.get(idx - 1);
			String username = u.getName();
			switch (field) {
				case "name":u.setName(value);break;
				case "password":u.setPassword(value);break;
				case "role":u.setRole(value);break;
			}
			AuditDTO audit = new AuditDTO(null, user.getName(), "UPDATE_USER", username + ":" + field + ">" + value, new Date(System.currentTimeMillis()));
			userDAO.repo().save(u);
			auditDAO.repo().save(audit);
			userList = userDAO.all().list();
			Utils.print("updated");
		} catch(IndexOutOfBoundsException ex) {
			Utils.print("invalid index");
		} catch (Exception ex) {
			Utils.print("unexpected error");
		}
	}
	
	public void deleteUser(String cmd) throws Exception {
		if(userList.isEmpty()) {
			Utils.print("no available user selected");
			return;
		}
		
		int idx = Integer.parseInt(cmd.replace("user -d ", ""));
		UserDTO deletedUser = null;
		try {
			deletedUser = userDAO.repo().delete(userList.get(idx - 1));
			AuditDTO audit = new AuditDTO(null, user.getName(), "DELETE_USER", deletedUser.getName(), new Date(System.currentTimeMillis()));
			auditDAO.repo().save(audit);
			userList = userDAO.all().list();
			Utils.print("deleted");
		} catch(IndexOutOfBoundsException ex) {
			Utils.print("invalid index");
		} catch(Exception ex) {
			Utils.print("unexpected error");
		}
	}

	public void showUser() throws Exception {
		System.out.format("Users:%n");
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"No","Name","Password","Role"});
		userList = userDAO.all().list();
		for (int i = 0; i < userList.size(); i++) 
			rows.add(new String[] {""+(i+1), userList.get(i).getName(), userList.get(i).getPassword(), userList.get(i).getRole()});
		Utils.printTable(rows,new int[] {5,10,10,10});
	}
	
	public void showAudit() throws Exception {
		System.out.format("Audits:%n");
		auditList = auditDAO.all().list();
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"No","User","Action","Description","Action Date"});
		for (int i = 0; i < auditList.size(); i++) 
			rows.add(new String[] {""+(i+1), auditList.get(i).getUser(), auditList.get(i).getAction(), auditList.get(i).getDesc(), Utils.formatDate(auditList.get(i).getActionDate())});
		Utils.printTable(rows,new int[] {5,20,20,40,20});
	}

	public void showCommand() {
		System.out.format("Available Commands:%n");
		List<String[]> rows = new ArrayList<String[]>();
		rows.add(new String[] {"Command","Description"});
		rows.add(new String[] {"user -c <name> <password> <role>", "create user"});
		rows.add(new String[] {"user -u <index> <name|password|role> <value>", "update user"});
		rows.add(new String[] {"user -d <index>", "delete user"});
		rows.add(new String[] {"user -s", "show users"});
		rows.add(new String[] {"audit -s", "show audits"});
		rows.add(new String[] {"cmd", "show commands"});
		rows.add(new String[] {"logout", "logout"});
		Utils.printTable(rows,new int[] {50,40});
	}

}
