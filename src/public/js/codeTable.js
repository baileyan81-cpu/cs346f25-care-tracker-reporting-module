///JS used by the care config page for the code table and add form.

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('codeTable');
  if (!table) return; // safety
  const headers = table.querySelectorAll('th');
  const filter = document.getElementById('filterType');
  let currentSort = { index: null, asc: true };

  // ---- SORTING ----
  headers.forEach((header, index) => {
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => sortTableByColumn(index));
  });

  function sortTableByColumn(columnIndex) {
    const tbody = table.tBodies[0];
    const rows = Array.from(tbody.querySelectorAll('tr')).filter(
      (r) => r.style.display !== 'none'
    );
    const isAsc = currentSort.index === columnIndex ? !currentSort.asc : true;

    rows.sort((a, b) => {
      const aText = a.cells[columnIndex].innerText.trim().toLowerCase();
      const bText = b.cells[columnIndex].innerText.trim().toLowerCase();
      return isAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    tbody.innerHTML = '';
    rows.forEach((row) => tbody.appendChild(row));

    currentSort = { index: columnIndex, asc: isAsc };
    headers.forEach((h) => h.classList.remove('asc', 'desc'));
    headers[columnIndex].classList.add(isAsc ? 'asc' : 'desc');
  }

  // ---- FILTERING ----
  filter.addEventListener('change', () => {
    const selectedType = filter.value;
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach((row) => {
      const type = row.cells[0].innerText.trim();
      row.style.display =
        selectedType === 'All' || type === selectedType ? '' : 'none';
    });
  });

  const form = document.getElementById('newCodeForm');
  const inputs = form.querySelectorAll('input, textarea, select');

  // ---- Validation ----

  // Create a small alert area above the form
  const alertBox = document.createElement('div');
  alertBox.style.display = 'none';
  alertBox.style.marginBottom = '1rem';
  alertBox.style.padding = '8px 12px';
  alertBox.style.borderRadius = '4px';
  alertBox.style.fontWeight = 'bold';
  form.prepend(alertBox);

  form.addEventListener('submit', (e) => {
    let valid = true;
    let messages = [];

    // Reset styles
    inputs.forEach((el) => (el.style.borderColor = '#ccc'));

    const codeType = form.codeType.value.trim();
    const codeGroup = form.codeGroup.value.trim();
    const code = form.code.value.trim();
    const codeMeaning = form.codeMeaning.value.trim();

    // Validation rules
    if (!codeType) {
      valid = false;
      messages.push('Please select a Code Type.');
      form.codeType.style.borderColor = 'red';
    }

    if (codeType == 'domain' && codeGroup.length < 2) {
      valid = false;
      messages.push('Code Group must be at least 2 characters.');
      form.codeGroup.style.borderColor = 'red';
    }

    if (code.length < 2) {
      valid = false;
      messages.push('Code must be at least 2 characters.');
      form.code.style.borderColor = 'red';
    }

    // Show feedback
    if (!valid) {
      e.preventDefault();
      alertBox.style.display = 'block';
      alertBox.style.background = '#ffe5e5';
      alertBox.style.color = '#a10000';
      alertBox.style.border = '1px solid #a10000';
      alertBox.innerHTML = messages.join('<br>');
    } else {
      alertBox.style.display = 'none';
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const codeType = document.getElementById('codeType');
  const groupWrap = document.getElementById('codeGroupWrap');
  const codeGroup = document.getElementById('codeGroup');

  if (!codeType || !groupWrap || !codeGroup) return; // safety

  function updateCodeGroupVisibility() {
    const show = codeType.value === 'domain';
    groupWrap.classList.toggle('hidden', !show);
    groupWrap.setAttribute('aria-hidden', String(!show));
    // Make it required only when visible
    if (show) codeGroup.setAttribute('required', 'required');
    else codeGroup.removeAttribute('required');
  }

  updateCodeGroupVisibility(); // set initial state on page load
  codeType.addEventListener('change', updateCodeGroupVisibility);
});
