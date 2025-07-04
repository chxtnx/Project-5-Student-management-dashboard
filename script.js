let students = JSON.parse(localStorage.getItem("students")) || [];

function renderTable(data = students) {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";

  if (data.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="8" style="text-align: center;">No matching students found</td>`;
    tbody.appendChild(row);
    return;
  }

  data.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.regNo}</td>
      <td>${student.dept}</td>
      <td>${student.year}</td>
      <td>${student.percentage}%</td>
      <td>${student.email}</td>
      <td>${student.phone}</td>
      <td>
        <button onclick="editStudent(${index})">Edit</button>
        <button onclick="deleteStudent(${index})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function toggleForm() {
  const modal = document.getElementById("studentFormModal");
  modal.style.display = modal.style.display === "block" ? "none" : "block";

  if (modal.style.display === "block") {
    document.getElementById("studentForm").reset();
    document.getElementById("editIndex").value = "";
    document.getElementById("formTitle").textContent = "Add Student";
  }
}

function submitForm(event) {
  event.preventDefault();

  const student = {
    name: document.getElementById("name").value,
    regNo: document.getElementById("regNo").value,
    dept: document.getElementById("dept").value,
    year: document.getElementById("year").value,
    percentage: document.getElementById("percentage").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value
  };

  const index = document.getElementById("editIndex").value;

  if (index === "") {
    students.push(student);
  } else {
    students[parseInt(index)] = student;
  }

  localStorage.setItem("students", JSON.stringify(students));
  renderTable();
  toggleForm();
}

function editStudent(index) {
  const student = students[index];
  if (!student) return;

  toggleForm();

  document.getElementById("name").value = student.name;
  document.getElementById("regNo").value = student.regNo;
  document.getElementById("dept").value = student.dept;
  document.getElementById("year").value = student.year;
  document.getElementById("percentage").value = student.percentage;
  document.getElementById("email").value = student.email;
  document.getElementById("phone").value = student.phone;
  document.getElementById("editIndex").value = index;
  document.getElementById("formTitle").textContent = "Edit Student";
}

function deleteStudent(index) {
  if (confirm("Are you sure to delete this student?")) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    renderTable();
  }
}

function filterStudents() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = students.filter(s => s.name.toLowerCase().includes(query));
  renderTable(filtered);
}

function applySort() {
  const field = document.getElementById("sortField").value;
  if (!field) return;
  students.sort((a, b) => (a[field] > b[field] ? 1 : -1));
  renderTable();
  localStorage.setItem("students", JSON.stringify(students));
}

function importCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const rows = e.target.result.split("\\n").map(row => row.split(","));
    rows.forEach(cols => {
      if (cols.length >= 7) {
        students.push({
          name: cols[0],
          regNo: cols[1],
          dept: cols[2],
          year: cols[3],
          percentage: cols[4],
          email: cols[5],
          phone: cols[6]
        });
      }
    });
    localStorage.setItem("students", JSON.stringify(students));
    renderTable();
  };
  reader.readAsText(file);
}

function exportCSV() {
  let csv = "Name,RegNo,Dept,Year,Percentage,Email,Phone\\n";
  students.forEach(s => {
    csv += `${s.name},${s.regNo},${s.dept},${s.year},${s.percentage},${s.email},${s.phone}\\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
  URL.revokeObjectURL(url);
}

renderTable();
