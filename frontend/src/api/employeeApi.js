const API_URL = `${import.meta.env.VITE_API_URL || ''}/api/employees`;

async function handleResponse(response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === 'string'
      ? data
      : data.error || Object.values(data).join(' ');
    throw new Error(message || `Request failed (${response.status})`);
  }
  return data;
}

export async function getEmployees() {
  const data = await handleResponse(await fetch(API_URL));
  if (!Array.isArray(data)) {
    throw new Error('The backend returned an invalid employee list.');
  }
  return data;
}

export async function createEmployee(employee) {
  return handleResponse(await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  }));
}

export async function updateEmployee(empId, employee) {
  return handleResponse(await fetch(`${API_URL}/${encodeURIComponent(empId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(employee)
  }));
}

export async function deleteEmployee(empId) {
  return handleResponse(await fetch(`${API_URL}/${encodeURIComponent(empId)}`, {
    method: 'DELETE'
  }));
}
