package dao;

import java.util.List;

import dto.DTO;
import util.Repository;

public interface DAO {
	
	public DAO all() throws Exception;
	public <T extends DTO>List<T> list() throws Exception;
	public <T extends DTO>T get(int index) throws Exception;
	public Repository repo();
	
}
