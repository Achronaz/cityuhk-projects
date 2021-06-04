package util;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import dto.DTO;

/**
 * @author Ken Tsang
 * @since 26-10-2019
 * Generic class for JSON File CRUD
 */
public class Repository {
	private ObjectMapper mapper;
	private JavaType type;
	private File file;
	private boolean updated;

	public <T> Repository(Class<T> clazz) {
		mapper = new ObjectMapper();
		type = mapper.getTypeFactory().constructParametricType(List.class, clazz);
		file = new File(System.getProperty("user.dir") + "\\data\\" + clazz.getSimpleName() + ".json");
		updated = false;
	}

	public <T extends DTO> List<T> findAll() throws Exception {
		List<T> list = new ArrayList<T>();
		try {
			list = mapper.readValue(file, type);
		} catch (Exception e) {
			//System.out.println("new ArrayList<T>()");
		}
		return list;
	}

	@SuppressWarnings("unchecked")
	public <T extends DTO> T find(String id) throws Exception {
		return (T) findAll().stream().filter(item -> item.getId().equals(id)).findFirst().orElse(null);
	}

	public <T extends DTO> T save(T obj) throws Exception {
		List<T> list = findAll();
		String uuid = Utils.generateId();
		if (!exist(obj.getId())) {
			obj.setId(uuid);
			list.add(obj);
		} else {
			list = list.stream().map(o -> {
				if (o.getId().equals(obj.getId())) 
					o = obj;
				return o;
			}).collect(Collectors.toList());
		}
		mapper.writeValue(file, list);
		return obj;
	}

	public <T extends DTO> T delete(String id) throws Exception {
		List<T> list = findAll();
		T deleted = null;
		updated = false;
		for (int i = 0; i < list.size(); i++) {
			if (list.get(i).getId().equals(id)) {
				deleted = list.remove(i);
				updated = true;
				break;
			}
		}
		if (updated)
			mapper.writeValue(file, list);
		return deleted;
	}

	public <T extends DTO> T delete(DTO obj) throws Exception {
		return delete(obj.getId());
	}

	public boolean exist(String id) throws Exception {
		return (id == null) ? false : !(find(id) == null);
	}

	public void reset() throws Exception {
		mapper.writeValue(file, new ArrayList<>());
	}

}
