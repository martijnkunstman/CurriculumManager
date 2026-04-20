const state = {
    currentTable: 'ka_schooljaren',
    data: [],
    editingId: null,
    schooljaren: []
};

const tableTitles = {
    'ka_schooljaren': 'Manage School Years',
    'ka_periodes': 'Manage Periods',
    'ka_week_types': 'Manage Week Types',
    'ka_weken': 'Manage Weeks',
    'year_visualizer': 'Year Visualizer'
};

const dom = {
    navLinks: document.querySelectorAll('.nav-link'),
    pageTitle: document.getElementById('page-title'),
    tableHead: document.getElementById('table-head'),
    tableBody: document.getElementById('table-body'),
    tableContainer: document.getElementById('table-container'),
    visualizerContainer: document.getElementById('visualizer-container'),
    yearSelect: document.getElementById('year-select'),
    btnAdd: document.getElementById('btn-add-new'),
    modal: document.getElementById('edit-modal'),
    btnClose: document.getElementById('btn-close-modal'),
    btnCancel: document.getElementById('btn-cancel'),
    btnSave: document.getElementById('btn-save'),
    form: document.getElementById('record-form'),
    modalTitle: document.getElementById('modal-title')
};

async function fetchData(table) {
    try {
        const res = await fetch(`/api/${table}`);
        const json = await res.json();
        return json.data || [];
    } catch (err) {
        console.error('Error fetching data:', err);
        return [];
    }
}

async function loadSchooljarenDropdown() {
    state.schooljaren = await fetchData('ka_schooljaren');
    dom.yearSelect.innerHTML = '';
    state.schooljaren.forEach(sj => {
        const opt = document.createElement('option');
        opt.value = sj.id;
        opt.textContent = sj.naam;
        dom.yearSelect.appendChild(opt);
    });
}

async function loadTable(tableName) {
    state.currentTable = tableName;
    dom.pageTitle.textContent = tableTitles[tableName] || 'Management';
    
    // Update active nav
    dom.navLinks.forEach(link => {
        if (link.dataset.target === tableName) link.classList.add('active');
        else link.classList.remove('active');
    });

    if (tableName === 'year_visualizer') {
        dom.tableContainer.style.display = 'none';
        dom.visualizerContainer.style.display = 'block';
        dom.btnAdd.style.display = 'none';
        dom.yearSelect.style.display = 'inline-block';
        if (state.schooljaren.length === 0) await loadSchooljarenDropdown();
        await renderYearVisualizer();
        return;
    } else {
        dom.tableContainer.style.display = 'block';
        dom.visualizerContainer.style.display = 'none';
        dom.btnAdd.style.display = 'inline-flex';
        dom.yearSelect.style.display = 'none';
    }

    state.data = await fetchData(tableName);
    renderTable();
}

function renderTable() {
    dom.tableHead.innerHTML = '';
    dom.tableBody.innerHTML = '';

    if (!state.data || state.data.length === 0) {
        dom.tableBody.innerHTML = '<tr><td colspan="10" style="text-align:center;">No records found.</td></tr>';
        return;
    }

    // Render Headers
    const keys = Object.keys(state.data[0]);
    keys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key.replace(/_/g, ' ');
        dom.tableHead.appendChild(th);
    });
    const actionsTh = document.createElement('th');
    actionsTh.textContent = 'Actions';
    actionsTh.style.width = '100px';
    actionsTh.style.textAlign = 'right';
    dom.tableHead.appendChild(actionsTh);

    // Render Rows
    state.data.forEach(row => {
        const tr = document.createElement('tr');
        keys.forEach(key => {
            const td = document.createElement('td');
            td.textContent = row[key];
            tr.appendChild(td);
        });

        // Actions
        const actionsTd = document.createElement('td');
        actionsTd.style.textAlign = 'right';
        actionsTd.innerHTML = `
            <button class="btn-icon edit" onclick="editRecord(${row.id})" title="Edit"><ion-icon name="pencil-outline"></ion-icon></button>
            <button class="btn-icon delete" onclick="deleteRecord(${row.id})" title="Delete"><ion-icon name="trash-outline"></ion-icon></button>
        `;
        tr.appendChild(actionsTd);
        dom.tableBody.appendChild(tr);
    });
}

async function renderYearVisualizer() {
    const sjId = dom.yearSelect.value;
    if (!sjId) return;

    try {
        const res = await fetch(`/api/year-view/${sjId}`);
        const json = await res.json();
        const weeks = json.data || [];

        dom.visualizerContainer.innerHTML = '<div class="year-timeline"></div>';
        const timeline = dom.visualizerContainer.querySelector('.year-timeline');

        // Group into contiguous blocks based on periode
        let groups = [];
        let currentGroup = null;

        weeks.forEach(w => {
            const groupName = w.periode_naam || 'holiday';
            if (!currentGroup || currentGroup.name !== groupName) {
                currentGroup = {
                    name: groupName,
                    isHoliday: !w.periode_naam,
                    weeks: []
                };
                groups.push(currentGroup);
            }
            currentGroup.weeks.push(w);
        });

        groups.forEach(g => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'contiguous-group';

            const labelDiv = document.createElement('div');
            labelDiv.className = 'group-label';
            labelDiv.textContent = g.isHoliday ? '' : g.name;

            const weeksRow = document.createElement('div');
            weeksRow.className = 'group-weeks';

            g.weeks.forEach(w => {
                const block = document.createElement('div');
                block.className = 'week-block';
                block.textContent = w.kalenderweek;
                
                if (w.is_lesweek) {
                    block.classList.add('lesweek');
                } else if (w.week_type && w.week_type.toLowerCase().includes('vakantie')) {
                    block.classList.add('holiday');
                } else {
                    block.classList.add('special');
                }

                // Tooltip displays the type, answering the 'mouseover on holiday' request intuitively
                const tooltipText = w.periode_naam ? `W${w.kalenderweek}: ${w.startdatum} | ${w.periode_naam}` : `W${w.kalenderweek}: ${w.startdatum} | ${w.week_type}`;
                block.setAttribute('data-tooltip', tooltipText);
                
                weeksRow.appendChild(block);
            });

            groupDiv.appendChild(labelDiv);
            groupDiv.appendChild(weeksRow);
            timeline.appendChild(groupDiv);
        });

    } catch (err) {
        console.error('Error rendering visualizer', err);
        dom.visualizerContainer.innerHTML = '<p style="color:red">Error loading visualization.</p>';
    }
}

function openModal(isEdit = false) {
    dom.modalTitle.textContent = isEdit ? 'Edit Record' : 'Add New Record';
    dom.modal.classList.add('active');
}

function closeModal() {
    dom.modal.classList.remove('active');
}

function generateForm(dataRow = null) {
    dom.form.innerHTML = '';
    
    let template = dataRow || (state.data.length > 0 ? state.data[0] : null);
    
    if (!template) {
       dom.form.innerHTML = '<p>No schema available to add new.</p>';
       return;
    }

    Object.keys(template).forEach(key => {
        if (key === 'id') return; // Don't edit ID
        
        const group = document.createElement('div');
        group.className = 'form-group';
        
        const label = document.createElement('label');
        label.textContent = key.replace(/_/g, ' ').toUpperCase();
        
        const input = document.createElement('input');
        input.className = 'form-control';
        input.name = key;
        
        if (dataRow) {
            input.value = dataRow[key];
        } else if (key.includes('datum')) {
            input.type = 'date';
        } else if (typeof template[key] === 'number') {
            input.type = 'number';
        } else {
            input.type = 'text';
        }

        group.appendChild(label);
        group.appendChild(input);
        dom.form.appendChild(group);
    });
}

window.editRecord = (id) => {
    state.editingId = id;
    const record = state.data.find(d => d.id === id);
    generateForm(record);
    openModal(true);
};

window.deleteRecord = async (id) => {
    if(!confirm('Are you sure you want to delete this record?')) return;

    try {
        await fetch(`/api/${state.currentTable}/${id}`, { method: 'DELETE' });
        await loadTable(state.currentTable);
    } catch(err) {
        console.error('Delete error', err);
    }
}

// Event Listeners
dom.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        loadTable(e.target.closest('a').dataset.target);
    });
});

dom.yearSelect.addEventListener('change', () => {
    if (state.currentTable === 'year_visualizer') {
        renderYearVisualizer();
    }
});

dom.btnAdd.addEventListener('click', () => {
    state.editingId = null;
    generateForm();
    openModal();
});

dom.btnClose.addEventListener('click', closeModal);
dom.btnCancel.addEventListener('click', closeModal);

dom.btnSave.addEventListener('click', async () => {
    const formData = new FormData(dom.form);
    const payload = Object.fromEntries(formData.entries());

    const url = state.editingId 
        ? `/api/${state.currentTable}/${state.editingId}` 
        : `/api/${state.currentTable}`;
    
    const method = state.editingId ? 'PUT' : 'POST';

    try {
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        closeModal();
        await loadTable(state.currentTable);
    } catch (err) {
        console.error('Save error', err);
    }
});

// Init
loadTable(state.currentTable);
