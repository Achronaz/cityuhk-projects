package dao;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import dto.AuditDTO;
import util.Repository;

public class AuditDAO implements DAO{
	private Stream<AuditDTO> stream;
	private Repository repo;
	
	public AuditDAO() {
		repo = new Repository(AuditDTO.class);
		this.stream = new ArrayList<AuditDTO>().stream();
	}
	
	@SuppressWarnings("unchecked")
	public List<AuditDTO> list() throws Exception { 
		return stream.collect(Collectors.toList()); 
	}
	
	@SuppressWarnings("unchecked")
	public AuditDTO get(int index) throws Exception { 
		AuditDTO audit = null;
		try {
			audit = this.list().get(index);
		}catch(Exception ex) {}
		return audit;
	}
	
	public Repository repo() { return repo; }
	
	public AuditDAO all() throws Exception {
		List<AuditDTO> list = repo.findAll();
		stream = list.stream();
		return this;
	}
	
}
