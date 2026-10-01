import { useState } from "react";
import { AlertCircle, Briefcase, Building, KeyRound, Loader, Mail, Phone, User } from "lucide-react";
import Modal from "../common/Modal";

export const EmployeeModal = ({ isOpen, onClose, onSubmit, employee = null, loading = false, error = "" }) => {
  const isEdit = Boolean(employee);

  const [formData, setFormData] = useState(() => ({
    name: employee?.name || "",
    email: employee?.email || "",
    password: "",
    phone: employee?.phone || "",
    department: employee?.department || "",
    designation: employee?.designation || "",
  }));

  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Valid email address is required.";
    }
    if (!isEdit && (!formData.password || formData.password.length < 8)) {
      errors.password = "Password must be at least 8 characters.";
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      errors.phone = "Phone number must be at least 7 digits.";
    }
    if (!formData.department.trim() || formData.department.trim().length < 2) {
      errors.department = "Department is required.";
    }
    if (!formData.designation.trim() || formData.designation.trim().length < 2) {
      errors.designation = "Designation is required.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      department: formData.department.trim(),
      designation: formData.designation.trim(),
    };

    if (!isEdit) {
      payload.password = formData.password;
    }

    onSubmit(payload);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `Edit Employee: ${employee?.name}` : "Add New Employee"}
      maxWidth="580px"
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert-danger mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-grid">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="emp-name" className="form-label">
              <User size={14} className="form-label-icon" />
              <span>Full Name</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="emp-name"
              type="text"
              className={`form-input ${fieldErrors.name ? "input-error" : ""}`}
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.name && <span className="field-error-text">{fieldErrors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="emp-email" className="form-label">
              <Mail size={14} className="form-label-icon" />
              <span>Email Address</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="emp-email"
              type="email"
              className={`form-input ${fieldErrors.email ? "input-error" : ""}`}
              placeholder="jane@organization.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.email && <span className="field-error-text">{fieldErrors.email}</span>}
          </div>

          {/* Password Field (Create Only) */}
          {!isEdit && (
            <div className="form-group full-width">
              <label htmlFor="emp-password" className="form-label">
                <KeyRound size={14} className="form-label-icon" />
                <span>Initial Password</span>
                <span className="required-star">*</span>
              </label>
              <input
                id="emp-password"
                type="password"
                className={`form-input ${fieldErrors.password ? "input-error" : ""}`}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                disabled={loading}
                required
              />
              {fieldErrors.password && (
                <span className="field-error-text">{fieldErrors.password}</span>
              )}
            </div>
          )}

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="emp-phone" className="form-label">
              <Phone size={14} className="form-label-icon" />
              <span>Phone Number</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="emp-phone"
              type="text"
              className={`form-input ${fieldErrors.phone ? "input-error" : ""}`}
              placeholder="e.g. 555-0192"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.phone && <span className="field-error-text">{fieldErrors.phone}</span>}
          </div>

          {/* Department Field */}
          <div className="form-group">
            <label htmlFor="emp-dept" className="form-label">
              <Building size={14} className="form-label-icon" />
              <span>Department</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="emp-dept"
              type="text"
              className={`form-input ${fieldErrors.department ? "input-error" : ""}`}
              placeholder="e.g. Engineering"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.department && (
              <span className="field-error-text">{fieldErrors.department}</span>
            )}
          </div>

          {/* Designation Field */}
          <div className="form-group full-width">
            <label htmlFor="emp-desg" className="form-label">
              <Briefcase size={14} className="form-label-icon" />
              <span>Designation / Job Title</span>
              <span className="required-star">*</span>
            </label>
            <input
              id="emp-desg"
              type="text"
              className={`form-input ${fieldErrors.designation ? "input-error" : ""}`}
              placeholder="e.g. Senior Software Engineer"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              disabled={loading}
              required
            />
            {fieldErrors.designation && (
              <span className="field-error-text">{fieldErrors.designation}</span>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <Loader size={16} className="spin" />
                <span>Saving...</span>
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Create Employee"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeModal;
