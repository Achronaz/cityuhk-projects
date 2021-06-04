package dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import dto.ProductDTO;
import util.Repository;

public class ProductDAO implements DAO{
	private Stream<ProductDTO> stream;
	private Repository repo;
	
	public ProductDAO() throws Exception {
		repo = new Repository(ProductDTO.class);	
		this.stream = new ArrayList<ProductDTO>().stream();
	}
	
	@SuppressWarnings("unchecked")
	public List<ProductDTO> list() throws Exception { 
		return stream.collect(Collectors.toList()); 
	}
	
	@SuppressWarnings("unchecked")
	public ProductDTO get(int index) throws Exception { 
		ProductDTO product = null;
		try {
			product = this.list().get(index);
		}catch(NullPointerException ex) {}
		return product;
	}
	
	public Repository repo() { return repo; }
	
	public ProductDAO all() throws Exception {
		List<ProductDTO> list = repo.findAll();
		stream = list.stream();
		return this;
	}
	
	public ProductDAO name(String name) {
		stream = stream.filter(o->o.getName().equals(name));
		return this;
	}

}
