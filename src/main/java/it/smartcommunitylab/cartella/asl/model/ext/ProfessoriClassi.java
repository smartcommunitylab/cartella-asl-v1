package it.smartcommunitylab.cartella.asl.model.ext;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;

@Entity
@Table(name = "professori_classi",
	indexes = {
			@Index(name = "extId_idx", columnList = "extId", unique = false)
	}
)
public class ProfessoriClassi {

	@Id
	private String id;
	private String extId;
	private String origin;
	private String classroom;
	private String courseExtId;
	private Date dateFrom;
	private Date dateTo;
	private String schoolYear;
	private String teacherExtId;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getExtId() {
		return extId;
	}

	public void setExtId(String extId) {
		this.extId = extId;
	}

	public String getOrigin() {
		return origin;
	}

	public void setOrigin(String origin) {
		this.origin = origin;
	}

	public String getClassroom() {
		return classroom;
	}

	public void setClassroom(String classroom) {
		this.classroom = classroom;
	}

	public String getCourseExtId() {
		return courseExtId;
	}

	public void setCourseExtId(String courseExtId) {
		this.courseExtId = courseExtId;
	}

	public Date getDateFrom() {
		return dateFrom;
	}

	public void setDateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
	}

	public Date getDateTo() {
		return dateTo;
	}

	public void setDateTo(Date dateTo) {
		this.dateTo = dateTo;
	}

	public String getSchoolYear() {
		return schoolYear;
	}

	public void setSchoolYear(String schoolYear) {
		this.schoolYear = schoolYear;
	}

	public String getTeacherExtId() {
		return teacherExtId;
	}

	public void setTeacherExtId(String teacherExtId) {
		this.teacherExtId = teacherExtId;
	}

}
