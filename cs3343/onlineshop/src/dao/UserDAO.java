package dao;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import dto.UserDTO;
import util.Repository;

public class UserDAO  implements DAO{
	
	private Stream<UserDTO> UserDTOs;
	private Repository repo;
	
	public UserDAO() {
		repo = new Repository(UserDTO.class);
		this.UserDTOs = new ArrayList<UserDTO>().stream();
	}
	
	@SuppressWarnings("unchecked")
	public List<UserDTO> list() throws Exception{ 
		return UserDTOs.collect(Collectors.toList());
	}
	
	@SuppressWarnings("unchecked")
	public UserDTO get(int index) throws Exception { 
		UserDTO UserDTO = null;
		try {
			UserDTO = this.list().get(index);
		} catch(Exception ex) {}
		return UserDTO;
	}
	
	public Repository repo() { return repo; }
	
	public UserDAO all() throws Exception {
		List<UserDTO> list = repo.findAll();
		UserDTOs = list.stream();
		return this;
	}
	
	public UserDAO name(String name) {
		UserDTOs = UserDTOs.filter(o->o.getName().equals(name));
		return this;
	}
	
	public UserDAO password(String password) {
		UserDTOs = UserDTOs.filter(o->o.getPassword().equals(password));
		return this;
	}

	public UserDTO login(String ac, String pwd) throws Exception {
		return all()
				.name(ac)
				.password(pwd)
				.get(0);
	}
	
	public boolean nameExist(String name) throws Exception {
		for(UserDTO u: this.all().list()) {
			if(u.getName().equals(name))
				return true;
		}
		return false;
	}

}
