package util;

import dao.AuditDAO;
import dao.OrderDAO;
import dao.ProductDAO;
import dao.UserDAO;

public class DaoFactory {
	
	private static DaoFactory instance = null;
	private AuditDAO auditDAO;
	private OrderDAO orderDAO;
	private ProductDAO productDAO;
	private UserDAO userDAO;
	
	private DaoFactory() throws Exception {
		auditDAO = new AuditDAO();
		orderDAO = new OrderDAO();
		productDAO = new ProductDAO();
		userDAO = new UserDAO();
	}
	
	
	public static DaoFactory getInstance() throws Exception {
		if(instance == null) 
			instance = new DaoFactory();
		return instance;
	}
	
	@SuppressWarnings("unchecked")
	public <T>T create(Class<T> type) throws Exception {
		if (type.isInstance(auditDAO)) {
			return (T)auditDAO;
		} else if (type.isInstance(orderDAO)) {
			return (T)orderDAO;
		} else if (type.isInstance(productDAO)) {
			return (T)productDAO;
		} else if (type.isInstance(userDAO)) {
			return (T)userDAO;
		} else {
			return null;
		}
	}
}
