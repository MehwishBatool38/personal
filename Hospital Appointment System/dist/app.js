const content = document.getElementById('content');
const statusMessage = document.getElementById('statusMessage');
const patientsBtn = document.getElementById('patientsBtn');
const doctorsBtn = document.getElementById('doctorsBtn');
const appointmentsBtn = document.getElementById('appointmentsBtn');

const viewMap = {
  patients: {
    title: 'Patients',
    load: loadPatients,
  },
  doctors: {
    title: 'Doctors',
    load: loadDoctors,
  },
  appointments: {
    title: 'Appointments',
    load: loadAppointments,
  },
};

let activeView = 'patients';

function setStatus(message, error = false) {
  statusMessage.textContent = message;
  statusMessage.style.background = error ? 'rgba(248, 196, 196, 0.18)' : 'rgba(220, 241, 255, 0.8)';
  statusMessage.style.borderColor = error ? 'rgba(220, 38, 38, 0.24)' : 'rgba(3, 102, 214, 0.15)';
}

function setActiveButton(button) {
  [patientsBtn, doctorsBtn, appointmentsBtn].forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

patientsBtn.addEventListener('click', () => switchView('patients', patientsBtn));
doctorsBtn.addEventListener('click', () => switchView('doctors', doctorsBtn));
appointmentsBtn.addEventListener('click', () => switchView('appointments', appointmentsBtn));

function switchView(view, button) {
  activeView = view;
  setActiveButton(button);
  viewMap[view].load();
}

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Server error');
  }
  return response.json();
}

async function loadPatients() {
  content.innerHTML = '<div class="card"><h2>Loading patients…</h2></div>';
  try {
    const patients = await fetchJson('/api/patients');
    renderPatients(patients);
    setStatus('Loaded patient list successfully.');
  } catch (error) {
    content.innerHTML = '<div class="card"><h2>Could not load patients.</h2></div>';
    setStatus(error.message, true);
  }
}

function renderPatients(patients) {
  content.innerHTML = `
    <div class="card">
      <h2>Patients</h2>
      <div class="grid">
        <div>
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Age</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${patients.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.email}</td>
                  <td>${p.phone}</td>
                  <td>${p.age}</td>
                  <td>
                    <button class="action-button edit" onclick="startPatientEdit(${p.id})">Edit</button>
                    <button class="action-button delete" onclick="deletePatient(${p.id})">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Add New Patient</h3>
          <form id="patientForm">
            <div class="form-row">
              <label>Name <input name="name" required /></label>
              <label>Email <input type="email" name="email" required /></label>
            </div>
            <div class="form-row">
              <label>Phone <input name="phone" required /></label>
              <label>Age <input type="number" name="age" min="0" required /></label>
            </div>
            <button type="submit">Register Patient</button>
          </form>
          <p class="small-note">Use the edit button to update patient records.</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('patientForm').addEventListener('submit', createPatient);
}

async function createPatient(event) {
  event.preventDefault();
  const form = event.target;
  const data = Object.fromEntries(new FormData(form).entries());
  try {
    await fetchJson('/api/patients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: Number(data.age),
      }),
    });
    setStatus('Patient registered successfully.');
    form.reset();
    loadPatients();
  } catch (error) {
    setStatus(error.message, true);
  }
}

window.startPatientEdit = async function (id) {
  try {
    const patient = await fetchJson(`/api/patients/${id}`);
    content.querySelector('.card').innerHTML = `
      <h2>Edit Patient</h2>
      <form id="editPatientForm">
        <div class="form-row">
          <label>Name <input name="name" value="${patient.name}" required /></label>
          <label>Email <input type="email" name="email" value="${patient.email}" required /></label>
        </div>
        <div class="form-row">
          <label>Phone <input name="phone" value="${patient.phone}" required /></label>
          <label>Age <input type="number" name="age" value="${patient.age}" min="0" required /></label>
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" id="cancelEdit">Cancel</button>
      </form>
    `;
    document.getElementById('editPatientForm').addEventListener('submit', event => submitPatientUpdate(event, id));
    document.getElementById('cancelEdit').addEventListener('click', loadPatients);
  } catch (error) {
    setStatus(error.message, true);
  }
};

async function submitPatientUpdate(event, id) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  try {
    await fetchJson(`/api/patients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: Number(data.age),
      }),
    });
    setStatus('Patient updated successfully.');
    loadPatients();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function deletePatient(id) {
  if (!confirm('Delete this patient?')) return;
  try {
    await fetchJson(`/api/patients/${id}`, { method: 'DELETE' });
    setStatus('Patient deleted.');
    loadPatients();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadDoctors() {
  content.innerHTML = '<div class="card"><h2>Loading doctors…</h2></div>';
  try {
    const doctors = await fetchJson('/api/doctors');
    renderDoctors(doctors);
    setStatus('Loaded doctor list successfully.');
  } catch (error) {
    content.innerHTML = '<div class="card"><h2>Could not load doctors.</h2></div>';
    setStatus(error.message, true);
  }
}

function renderDoctors(doctors) {
  content.innerHTML = `
    <div class="card">
      <h2>Doctors</h2>
      <div class="grid">
        <div>
          <table>
            <thead>
              <tr><th>Name</th><th>Specialization</th><th>Available</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${doctors.map(d => `
                <tr>
                  <td>${d.name}</td>
                  <td>${d.specialization}</td>
                  <td>${d.available ? 'Yes' : 'No'}</td>
                  <td>
                    <button class="action-button edit" onclick="startDoctorEdit(${d.id})">Edit</button>
                    <button class="action-button delete" onclick="deleteDoctor(${d.id})">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Add New Doctor</h3>
          <form id="doctorForm">
            <div class="form-row">
              <label>Name <input name="name" required /></label>
              <label>Specialization <input name="specialization" required /></label>
            </div>
            <div class="form-row">
              <label>Available
                <select name="available">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </label>
            </div>
            <button type="submit">Add Doctor</button>
          </form>
          <p class="small-note">Use the edit button to update doctor availability.</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('doctorForm').addEventListener('submit', createDoctor);
}

async function createDoctor(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  try {
    await fetchJson('/api/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        specialization: data.specialization,
        available: data.available === 'true',
      }),
    });
    setStatus('Doctor added successfully.');
    event.target.reset();
    loadDoctors();
  } catch (error) {
    setStatus(error.message, true);
  }
}

window.startDoctorEdit = async function (id) {
  try {
    const doctor = await fetchJson(`/api/doctors/${id}`);
    content.querySelector('.card').innerHTML = `
      <h2>Edit Doctor</h2>
      <form id="editDoctorForm">
        <div class="form-row">
          <label>Name <input name="name" value="${doctor.name}" required /></label>
          <label>Specialization <input name="specialization" value="${doctor.specialization}" required /></label>
        </div>
        <div class="form-row">
          <label>Available
            <select name="available">
              <option value="true" ${doctor.available ? 'selected' : ''}>Yes</option>
              <option value="false" ${!doctor.available ? 'selected' : ''}>No</option>
            </select>
          </label>
        </div>
        <button type="submit">Save Changes</button>
        <button type="button" id="cancelEdit">Cancel</button>
      </form>
    `;
    document.getElementById('editDoctorForm').addEventListener('submit', event => submitDoctorUpdate(event, id));
    document.getElementById('cancelEdit').addEventListener('click', loadDoctors);
  } catch (error) {
    setStatus(error.message, true);
  }
};

async function submitDoctorUpdate(event, id) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  try {
    await fetchJson(`/api/doctors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        specialization: data.specialization,
        available: data.available === 'true',
      }),
    });
    setStatus('Doctor updated successfully.');
    loadDoctors();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function deleteDoctor(id) {
  if (!confirm('Delete this doctor?')) return;
  try {
    await fetchJson(`/api/doctors/${id}`, { method: 'DELETE' });
    setStatus('Doctor deleted.');
    loadDoctors();
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function loadAppointments() {
  content.innerHTML = '<div class="card"><h2>Loading appointments…</h2></div>';
  try {
    const [appointments, patients, doctors] = await Promise.all([
      fetchJson('/api/appointments'),
      fetchJson('/api/patients'),
      fetchJson('/api/doctors'),
    ]);
    renderAppointments(appointments, patients, doctors);
    setStatus('Loaded appointment data successfully.');
  } catch (error) {
    content.innerHTML = '<div class="card"><h2>Could not load appointments.</h2></div>';
    setStatus(error.message, true);
  }
}

function renderAppointments(appointments, patients, doctors) {
  const patientOptions = patients.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  const doctorOptions = doctors.map(d => `<option value="${d.id}">${d.name}</option>`).join('');

  content.innerHTML = `
    <div class="card">
      <h2>Appointments</h2>
      <div class="grid">
        <div>
          <table>
            <thead>
              <tr><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              ${appointments.map(a => {
                const patient = patients.find(p => p.id === a.patientId);
                const doctor = doctors.find(d => d.id === a.doctorId);
                return `
                  <tr>
                    <td>${patient ? patient.name : 'Unknown'}</td>
                    <td>${doctor ? doctor.name : 'Unknown'}</td>
                    <td>${a.date}</td>
                    <td>${a.time}</td>
                    <td>${a.status}</td>
                    <td>
                      <button class="action-button status" onclick="updateAppointmentStatus(${a.id}, '${a.status === 'Scheduled' ? 'Completed' : 'Completed'}')">Mark Completed</button>
                      <button class="action-button delete" onclick="deleteAppointment(${a.id})">Cancel</button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Book Appointment</h3>
          <form id="appointmentForm">
            <div class="form-row">
              <label>Patient <select name="patientId" required>${patientOptions}</select></label>
              <label>Doctor <select name="doctorId" required>${doctorOptions}</select></label>
            </div>
            <div class="form-row">
              <label>Date <input type="date" name="date" required /></label>
              <label>Time <input type="time" name="time" required /></label>
            </div>
            <button type="submit">Book Appointment</button>
          </form>
          <p class="small-note">Scheduled appointments can be completed or cancelled.</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('appointmentForm').addEventListener('submit', createAppointment);
}

async function createAppointment(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target).entries());
  try {
    await fetchJson('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: Number(data.patientId),
        doctorId: Number(data.doctorId),
        date: data.date,
        time: data.time,
      }),
    });
    setStatus('Appointment booked successfully.');
    event.target.reset();
    loadAppointments();
  } catch (error) {
    setStatus(error.message, true);
  }
}

window.updateAppointmentStatus = async function (id, nextStatus) {
  try {
    await fetchJson(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus }),
    });
    setStatus('Appointment status updated.');
    loadAppointments();
  } catch (error) {
    setStatus(error.message, true);
  }
};

async function deleteAppointment(id) {
  if (!confirm('Cancel this appointment?')) return;
  try {
    await fetchJson(`/api/appointments/${id}`, { method: 'DELETE' });
    setStatus('Appointment cancelled.');
    loadAppointments();
  } catch (error) {
    setStatus(error.message, true);
  }
}

(function init() {
  switchView(activeView, patientsBtn);
})();
