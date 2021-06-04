package test;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.Scanner;

import org.junit.Before;
import org.junit.BeforeClass;

import dao.AuditDAO;
import dao.OrderDAO;
import dao.ProductDAO;
import dao.UserDAO;
import util.DaoFactory;
import util.Utils;

public abstract class JUnitTest {
	PrintStream oldPrintStream;
	ByteArrayOutputStream bos;
	
	static DaoFactory dao;
	static UserDAO userDAO;
	static OrderDAO orderDAO;
	static ProductDAO productDAO;
	static AuditDAO auditDAO;
	
	Scanner scanner = new Scanner(System.in);
	
	@BeforeClass
	public static void setup() throws Exception {
		dao = DaoFactory.getInstance();
		userDAO = dao.create(UserDAO.class);
		orderDAO = dao.create(OrderDAO.class);
		productDAO = dao.create(ProductDAO.class);
		auditDAO = dao.create(AuditDAO.class);
	}
	
	@Before
	public void init() throws Exception {
		Utils.initJsonDb();
	}
	
	void setOutput() throws Exception {
		oldPrintStream = System.out;
		bos = new ByteArrayOutputStream();
		System.setOut(new PrintStream(bos));
	}

	String getOutput() { // throws Exception
		System.setOut(oldPrintStream);
		return bos.toString().replace("\n", "");
	}
}
