package dto;

import java.util.Date;

public class AuditDTO extends DTO {
	
	private String user;
	private String action;
	private String desc;
	private Date actionDate;
	
	public AuditDTO () {}
	public AuditDTO (String id, String user, String action, String desc, Date actionDate) {
		super(id);
		this.user = user;
		this.action = action;
		this.desc = desc;
		this.actionDate = actionDate;
	}
	public String getUser() {
		return user;
	}
	public void setUser(String uid) {
		this.user = uid;
	}
	public String getAction() {
		return action;
	}
	public void setAction(String action) {
		this.action = action;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	public Date getActionDate() {
		return actionDate;
	}
	public void setActionDate(Date actionDate) {
		this.actionDate = actionDate;
	}
	
}
