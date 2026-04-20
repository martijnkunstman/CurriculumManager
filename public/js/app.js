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
        dom.yearSelect.style.display = 'none'; // hide because we fetch all years now
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
    try {
        dom.visualizerContainer.innerHTML = '<p style="color:var(--text-secondary)">Loading all school years...</p>';
        
        // Fetch all school years
        const sjRes = await fetch('/api/ka_schooljaren');
        const sjJson = await sjRes.json();
        const schooljaren = sjJson.data || [];

        dom.visualizerContainer.innerHTML = '<div class="all-years-container"></div>';
        const allYearsCont = dom.visualizerContainer.querySelector('.all-years-container');

        for (const sj of schooljaren) {
            const res = await fetch(`/api/year-view/${sj.id}`);
            const json = await res.json();
            let weeks = json.data || [];
            if (weeks.length === 0) continue;

            // Mathematical Shift: Shift any pre-period holiday weeks (like Zomervakantie) to the END of the school year timeline
            const firstPeriodIdx = weeks.findIndex(w => w.periode_naam);
            if (firstPeriodIdx > 0) {
                const preWeeks = weeks.slice(0, firstPeriodIdx);
                const postWeeks = weeks.slice(firstPeriodIdx);
                weeks = [...postWeeks, ...preWeeks];
            }

            const yearRow = document.createElement('div');
            yearRow.className = 'year-row-wrapper';

            const yearTitle = document.createElement('h3');
            yearTitle.className = 'year-row-title';
            yearTitle.textContent = sj.naam;

            const timeline = document.createElement('div');
            timeline.className = 'year-timeline';

            // 1. Map contexts. A holiday receives an explicit period context IF it is natively surrounded by the exact same period!
            const contexts = weeks.map((w, index) => {
                if (w.periode_naam) return w.periode_naam;

                let leftContext = null;
                for (let i = index - 1; i >= 0; i--) {
                    if (weeks[i].periode_naam) { leftContext = weeks[i].periode_naam; break; }
                }
                
                let rightContext = null;
                for (let i = index + 1; i < weeks.length; i++) {
                    if (weeks[i].periode_naam) { rightContext = weeks[i].periode_naam; break; }
                }

                if (leftContext && leftContext === rightContext) {
                    return leftContext; // The holiday is fully encased inside the period!
                }
                // Removing _idx_${index} ensures consecutive identical boundary holidays seamlessly group together!
                return `between_${leftContext}_${rightContext}`; // External boundaries
            });

            let seenPeriods = new Set();
            let lastPeriod = null;
            let currentPeriodWeek = 1;

            weeks.forEach((w, index) => {
                const col = document.createElement('div');
                col.className = 'timeline-col';

                // Sequence boundary logic using our dynamically enveloped Contexts
                const currentCtx = contexts[index];
                const prevCtx = index > 0 ? contexts[index-1] : null;
                const nextCtx = index < weeks.length - 1 ? contexts[index+1] : null;

                // Reset period week counter if crossing a logical boundary context
                if (currentCtx !== prevCtx) {
                    currentPeriodWeek = 1;
                }

                // Label logic: only print the period name on its very first appearance
                const labelDiv = document.createElement('div');
                labelDiv.className = 'timeline-label';
                
                if (w.periode_naam && !seenPeriods.has(w.periode_naam)) {
                    labelDiv.textContent = w.periode_naam;
                    seenPeriods.add(w.periode_naam);
                } else {
                    labelDiv.innerHTML = '&nbsp;'; // visual spacer
                }

                const block = document.createElement('div');
                block.className = 'week-block';
                block.style.flexDirection = 'column'; // Inline enforcement to bypass css cache
                
                const isHoliday = w.week_type && w.week_type.toLowerCase().includes('vakantie');
                let pText = '&nbsp;';

                if (!isHoliday) {
                    pText = currentPeriodWeek;
                    currentPeriodWeek++;
                }

                // Explicitly inject divs on new lines
                block.innerHTML = `
                    <div style="font-size: 0.85rem; font-weight: bold; line-height: 1;">${pText}</div>
                    <div style="font-size: 0.55rem; font-weight: 600; line-height: 1; margin-top: 2px; opacity: 0.85;">w${w.kalenderweek}</div>
                `;
                
                if (w.is_lesweek) {
                    block.classList.add('lesweek');
                } else if (isHoliday) {
                    block.classList.add('holiday');
                } else {
                    block.classList.add('special');
                }

                // End-sequence Boundary logic
                const isStart = index === 0 || prevCtx !== currentCtx;
                const isEnd = index === weeks.length - 1 || nextCtx !== currentCtx;

                if (isStart) block.classList.add('start-block');
                if (isEnd) {
                    block.classList.add('end-block');
                    col.style.marginRight = '1.25rem'; // Explicit geometric gap after sequence finishes
                }

                // Tooltip logic
                const tooltipText = w.periode_naam ? `W${w.kalenderweek}: ${w.startdatum} | ${w.periode_naam}` : `W${w.kalenderweek}: ${w.startdatum} | ${w.week_type}`;
                block.setAttribute('data-tooltip', tooltipText);

                col.appendChild(labelDiv);
                col.appendChild(block);
                timeline.appendChild(col);
                
                if (w.periode_naam) lastPeriod = w.periode_naam;
            });

            yearRow.appendChild(yearTitle);
            yearRow.appendChild(timeline);
            allYearsCont.appendChild(yearRow);
        }

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
