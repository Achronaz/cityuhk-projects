package dao;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import dto.OrderDTO;
import util.Repository;

public class OrderDAO implements DAO {
	private Stream<OrderDTO> stream;
	private Repository repo;
	
	public OrderDAO() {
		repo = new Repository(OrderDTO.class);
		this.stream = new ArrayList<OrderDTO>().stream();
	}
	
	@SuppressWarnings("unchecked")
	public List<OrderDTO> list() throws Exception { 
		return stream.collect(Collectors.toList()); 
	}
	
	@SuppressWarnings("unchecked")
	public OrderDTO get(int index) throws Exception { 
		OrderDTO order = null;
		try {
			order = this.list().get(index);
		}catch(Exception ex) {}
		return order;
	}
	
	public Repository repo() { return repo; }
	
	public OrderDAO all() throws Exception {
		List<OrderDTO> list = repo.findAll();
		stream = list.stream();
		return this;
	}
	
	public OrderDAO user(String user) {
		stream = stream.filter(o->o.getUser().equals(user));
		return this;
	}
 
}
