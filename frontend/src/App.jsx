import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from './api/employeeApi.js';

const emptyForm = {
  empId: '', empName: '', empAddress: '', email: '', phone: '',
  department: '', designation: '', salary: ''
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setEmployees(await getEmployees());
    } catch (err) {
      setError(`${err.message}. Check that the backend is running and MySQL is configured.`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return employees;
    return employees.filter((employee) =>
      [employee.empId, employee.empName, employee.email, employee.department, employee.designation]
        .some((value) => (value || '').toLowerCase().includes(term))
    );
  }, [employees, search]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    if (!form.empId.trim() || !form.empName.trim()) {
      setError('Employee ID and employee name are required.');
      return;
    }
    const payload = {
      ...form,
      empId: form.empId.trim(),
      empName: form.empName.trim(),
      salary: form.salary === '' ? null : Number(form.salary)
    };
    if (payload.salary !== null && (!Number.isFinite(payload.salary) || payload.salary < 0)) {
      setError('Salary must be a valid non-negative number.');
      return;
    }

    setSaving(true);
    try {
      if (editingId !== null) {
        await updateEmployee(editingId, payload);
        setNotice('Employee updated successfully.');
      } else {
        await createEmployee(payload);
        setNotice('Employee added successfully.');
      }
      resetForm();
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(employee) {
    setEditingId(employee.empId);
    setForm({
      empId: employee.empId || '',
      empName: employee.empName || '',
      empAddress: employee.empAddress || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      designation: employee.designation || '',
      salary: employee.salary ?? ''
    });
    setError('');
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(employee) {
    if (!window.confirm(`Delete employee ${employee.empName} (${employee.empId})?`)) return;
    setError('');
    setNotice('');
    try {
      await deleteEmployee(employee.empId);
      if (editingId === employee.empId) resetForm();
      setNotice('Employee deleted successfully.');
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-mark">EMS</div>
        <div>
          <p className="eyebrow">PEOPLE OPERATIONS</p>
          <h1>Employee Management System</h1>
        </div>
        <div className="topbar-pill"><span className="status-dot" /> MySQL connected via API</div>
      </header>

      <section className="welcome-row">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h2>Manage your team</h2>
          <p className="muted">Create, view, update, and remove employee records in one place.</p>
        </div>
        <div className="stat-card">
          <span className="stat-label">TOTAL EMPLOYEES</span>
          <strong>{employees.length}</strong>
          <span className="stat-foot">Records in your directory</span>
        </div>
      </section>

      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}

      <section className="panel form-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">{editingId !== null ? 'EDIT RECORD' : 'NEW RECORD'}</p>
            <h2>{editingId !== null ? 'Update employee' : 'Add an employee'}</h2>
          </div>
          {editingId !== null && <button className="button button-ghost" type="button" onClick={resetForm}>Cancel edit</button>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Employee ID <span className="required">*</span>
              <input name="empId" value={form.empId} onChange={handleChange}
                placeholder="e.g. EMP001" maxLength="50" required disabled={editingId !== null} />
              <small>{editingId !== null ? 'ID cannot be changed while editing.' : 'Use a unique ID; letters and numbers are allowed.'}</small>
            </label>
            <label>
              Full name <span className="required">*</span>
              <input name="empName" value={form.empName} onChange={handleChange}
                placeholder="Enter employee name" maxLength="100" required />
            </label>
            <label>
              Email address
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="name@company.com" maxLength="150" />
            </label>
            <label>
              Phone
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="Phone number" maxLength="20" />
            </label>
            <label>
              Department
              <input name="department" value={form.department} onChange={handleChange}
                placeholder="e.g. Engineering" maxLength="100" />
            </label>
            <label>
              Designation
              <input name="designation" value={form.designation} onChange={handleChange}
                placeholder="e.g. Software Developer" maxLength="100" />
            </label>
            <label>
              Salary
              <input name="salary" type="number" min="0" step="0.01" value={form.salary}
                onChange={handleChange} placeholder="0.00" />
            </label>
            <label className="span-two">
              Address
              <input name="empAddress" value={form.empAddress} onChange={handleChange}
                placeholder="Enter residential address" maxLength="255" />
            </label>
          </div>
          <div className="form-actions">
            <p className="form-hint"><span className="required">*</span> Required fields</p>
            <button className="button button-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId !== null ? 'Save changes' : 'Add employee'}
            </button>
          </div>
        </form>
      </section>

      <section className="panel directory-panel">
        <div className="section-heading directory-heading">
          <div>
            <p className="eyebrow">DIRECTORY</p>
            <h2>Employee records <span className="count-badge">{filteredEmployees.length}</span></h2>
          </div>
          <div className="search-box">
            <span aria-hidden="true">⌕</span>
            <input aria-label="Search employees" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees…" />
          </div>
        </div>

        {loading ? (
          <div className="empty-state"><div className="loader" /><p>Loading employee records…</p></div>
        ) : filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▤</div>
            <h3>{search ? 'No matching employees' : 'No employees yet'}</h3>
            <p>{search ? 'Try another name, ID, email, or department.' : 'Add your first employee using the form above.'}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>EMPLOYEE</th><th>CONTACT</th><th>DEPARTMENT / ROLE</th><th>SALARY</th><th className="actions-col">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.empId}>
                    <td>
                      <div className="employee-cell">
                        <div className="avatar">{(employee.empName || '?').trim().charAt(0).toUpperCase()}</div>
                        <div><strong>{employee.empName}</strong><span>{employee.empId}</span></div>
                      </div>
                    </td>
                    <td><div className="contact-cell"><span>{employee.email || '—'}</span><span>{employee.phone || '—'}</span></div></td>
                    <td><div className="role-cell"><strong>{employee.department || '—'}</strong><span>{employee.designation || '—'}</span></div></td>
                    <td className="salary-cell">{employee.salary == null ? '—' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(employee.salary)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-button edit-button" type="button" title="Edit employee" aria-label={`Edit ${employee.empName}`} onClick={() => startEdit(employee)}>✎</button>
                        <button className="icon-button delete-button" type="button" title="Delete employee" aria-label={`Delete ${employee.empName}`} onClick={() => handleDelete(employee)}>×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="table-footer">
          <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
          <button className="text-button" type="button" onClick={loadEmployees}>↻ Refresh records</button>
        </div>
      </section>
      <footer>Employee Management System <span>•</span> Built with Spring Boot, React &amp; MySQL</footer>
    </main>
  );
}

export default App;
