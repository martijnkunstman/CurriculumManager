const state = {
    currentTable: 'ka_schooljaren',
    data: [],
    editingId: null,
    schooljaren: [],
    planningData: [],
    cohortWeeks: []
};

const tableTitles = {
    'ka_schooljaren': 'Manage School Years',
    'ka_periodes': 'Manage Periods',
    'ka_week_types': 'Manage Week Types',
    'ka_weken': 'Manage Weeks',
    'year_visualizer': 'Year Visualizer',
    'cohorten': 'Manage Cohorts',
    'leereenheden': 'Manage Leereenheden',
    'cohort_schooljaren': 'Cohort Years',
    'cohort_connections': 'Connect Leereenheden',
    'cohort_planning': 'Cohort Planning'
};

const dom = {
    navLinks: document.querySelectorAll('.nav-link'),
    pageTitle: document.getElementById('page-title'),
    tableHead: document.getElementById('table-head'),
    tableBody: document.getElementById('table-body'),
    tableContainer: document.getElementById('table-container'),
    visualizerContainer: document.getElementById('visualizer-container'),
    connectionsContainer: document.getElementById('connections-container'),
    cohortSelect: document.getElementById('cohort-select'),
    leereenhedenList: document.getElementById('leereenheden-list'),
    cohortYearsContainer: document.getElementById('cohort-years-container'),
    cohortYearSelect: document.getElementById('cohort-year-select'),
    addSchooljaarSelect: document.getElementById('add-schooljaar-select'),
    btnAddCohortYear: document.getElementById('btn-add-cohort-year'),
    cohortYearsList: document.getElementById('cohort-years-list'),
    planningContainer: document.getElementById('cohort-planning-container'),
    planningCohortSelect: document.getElementById('planning-cohort-select'),
    planningCalendar: document.getElementById('planning-calendar'),
    btnAddPlanning: document.getElementById('btn-add-planning'),
    planningModal: document.getElementById('planning-modal'),
    planningLeereenheadSelect: document.getElementById('planning-leereenheid-select'),
    planningStartWeek: document.getElementById('planning-start-week'),
    planningEindWeek: document.getElementById('planning-eind-week'),
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
        dom.connectionsContainer.style.display = 'none';
        dom.cohortYearsContainer.style.display = 'none';
        dom.planningContainer.style.display = 'none';
        dom.btnAdd.style.display = 'none';
        dom.yearSelect.style.display = 'none';
        await renderYearVisualizer();
        return;
    } else if (tableName === 'cohort_connections') {
        dom.tableContainer.style.display = 'none';
        dom.visualizerContainer.style.display = 'none';
        dom.connectionsContainer.style.display = 'block';
        dom.cohortYearsContainer.style.display = 'none';
        dom.planningContainer.style.display = 'none';
        dom.btnAdd.style.display = 'none';
        dom.yearSelect.style.display = 'none';
        await loadCohortConnectionsView();
        return;
    } else if (tableName === 'cohort_schooljaren') {
        dom.tableContainer.style.display = 'none';
        dom.visualizerContainer.style.display = 'none';
        dom.connectionsContainer.style.display = 'none';
        dom.cohortYearsContainer.style.display = 'block';
        dom.planningContainer.style.display = 'none';
        dom.btnAdd.style.display = 'none';
        dom.yearSelect.style.display = 'none';
        await loadCohortYearsView();
        return;
    } else if (tableName === 'cohort_planning') {
        dom.tableContainer.style.display = 'none';
        dom.visualizerContainer.style.display = 'none';
        dom.connectionsContainer.style.display = 'none';
        dom.cohortYearsContainer.style.display = 'none';
        dom.planningContainer.style.display = 'block';
        dom.btnAdd.style.display = 'none';
        dom.yearSelect.style.display = 'none';
        await loadCohortPlanningView();
        return;
    } else {
        dom.tableContainer.style.display = 'block';
        dom.visualizerContainer.style.display = 'none';
        dom.connectionsContainer.style.display = 'none';
        dom.cohortYearsContainer.style.display = 'none';
        dom.planningContainer.style.display = 'none';
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

async function loadCohortConnectionsView() {
    // Load cohorts into select
    const cohorts = await fetchData('cohorten');
    dom.cohortSelect.innerHTML = '<option value="">-- Select a Cohort --</option>';
    cohorts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.naam;
        dom.cohortSelect.appendChild(opt);
    });
    dom.leereenhedenList.innerHTML = '';
}

async function renderCohortConnections() {
    const cohortId = dom.cohortSelect.value;
    if (!cohortId) {
        dom.leereenhedenList.innerHTML = '';
        return;
    }

    try {
        const res = await fetch(`/api/cohort-connections/${cohortId}`);
        const json = await res.json();
        const leereenheden = json.data || [];

        dom.leereenhedenList.innerHTML = '';
        leereenheden.forEach(l => {
            const card = document.createElement('div');
            card.style.border = '1px solid var(--border-color)';
            card.style.padding = '1rem';
            card.style.borderRadius = 'var(--radius-md)';
            card.style.display = 'flex';
            card.style.alignItems = 'center';
            card.style.gap = '0.5rem';
            card.style.backgroundColor = 'var(--surface-color)';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = l.is_connected === 1;
            checkbox.id = `leereenheid-${l.id}`;
            checkbox.style.width = '1.2rem';
            checkbox.style.height = '1.2rem';
            
            checkbox.addEventListener('change', async (e) => {
                const isChecked = e.target.checked;
                try {
                    await fetch(`/api/cohort-connections/${cohortId}/toggle`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            leereenheid_id: l.id,
                            is_connected: isChecked
                        })
                    });
                } catch (err) {
                    console.error('Error toggling connection', err);
                    e.target.checked = !isChecked; // revert on error
                }
            });

            const label = document.createElement('label');
            label.htmlFor = `leereenheid-${l.id}`;
            label.textContent = l.naam;
            label.style.fontWeight = '500';
            label.style.cursor = 'pointer';

            card.appendChild(checkbox);
            card.appendChild(label);
            dom.leereenhedenList.appendChild(card);
        });

    } catch (err) {
        console.error('Error fetching connections', err);
    }
}

async function loadCohortYearsView() {
    // Load cohorts
    const cohorts = await fetchData('cohorten');
    dom.cohortYearSelect.innerHTML = '<option value="">-- Select a Cohort --</option>';
    cohorts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.naam;
        dom.cohortYearSelect.appendChild(opt);
    });

    // Load schooljaren
    const schooljaren = await fetchData('ka_schooljaren');
    dom.addSchooljaarSelect.innerHTML = '<option value="">-- Select School Year to Add --</option>';
    schooljaren.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.naam;
        dom.addSchooljaarSelect.appendChild(opt);
    });

    dom.cohortYearsList.innerHTML = '';
}

async function renderCohortYearsList() {
    const cohortId = dom.cohortYearSelect.value;
    if (!cohortId) {
        dom.cohortYearsList.innerHTML = '';
        return;
    }

    try {
        const res = await fetch(`/api/cohort-schooljaren/${cohortId}`);
        const json = await res.json();
        const years = json.data || [];

        dom.cohortYearsList.innerHTML = '';
        years.forEach((y, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.padding = '0.75rem';
            li.style.borderBottom = '1px solid var(--border-color)';
            
            const span = document.createElement('span');
            span.innerHTML = `<strong>Year ${index + 1}:</strong> ${y.naam}`;
            
            const btn = document.createElement('button');
            btn.className = 'btn-icon delete';
            btn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
            btn.title = 'Remove Year';
            btn.onclick = async () => {
                if(!confirm('Remove this year from cohort?')) return;
                try {
                    await fetch(`/api/cohort-schooljaren/${y.id}`, { method: 'DELETE' });
                    renderCohortYearsList(); // refresh
                } catch(e) { console.error(e); }
            };

            li.appendChild(span);
            li.appendChild(btn);
            dom.cohortYearsList.appendChild(li);
        });

    } catch (err) {
        console.error('Error fetching cohort years', err);
    }
}

function openModal(isEdit = false) {
    dom.modalTitle.textContent = isEdit ? 'Edit Record' : 'Add New Record';
    dom.modal.classList.add('active');
}

function closeModal() {
    dom.modal.classList.remove('active');
}

const fallbackSchemas = {
    'ka_schooljaren': { id: 0, naam: '', startdatum: '', einddatum: '' },
    'ka_periodes': { id: 0, schooljaar_id: 0, volgnummer: 0, naam: '' },
    'ka_week_types': { id: 0, is_lesweek: 0, omschrijving: '' },
    'ka_weken': { id: 0, schooljaar_id: 0, periode_id: 0, volgnummer_schooljaar: 0, kalenderweek: 0, startdatum: '', einddatum: '', type_id: 0 },
    'cohorten': { id: 0, naam: '' },
    'leereenheden': { id: 0, naam: '' }
};

function generateForm(dataRow = null) {
    dom.form.innerHTML = '';
    
    let template = dataRow || (state.data.length > 0 ? state.data[0] : fallbackSchemas[state.currentTable]);
    
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

// ── Cohort Planning ──────────────────────────────────────────────────────────

const PLANNING_COLORS = [
    '#4f86f7','#f7734f','#4fc77a','#c74fbd','#f7c94f',
    '#4fc7c7','#f74f6e','#8b4ff7','#a3c74f','#f7a04f'
];

async function loadCohortPlanningView() {
    const cohorts = await fetchData('cohorten');
    dom.planningCohortSelect.innerHTML = '<option value="">-- Selecteer een cohort --</option>';
    cohorts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.naam;
        dom.planningCohortSelect.appendChild(opt);
    });
    dom.planningCalendar.innerHTML = '';
    dom.btnAddPlanning.style.display = 'none';
}

async function renderCohortPlanning() {
    const cohortId = dom.planningCohortSelect.value;
    if (!cohortId) {
        dom.planningCalendar.innerHTML = '';
        dom.btnAddPlanning.style.display = 'none';
        return;
    }

    dom.planningCalendar.innerHTML = '<p style="color:var(--text-secondary)">Loading...</p>';

    const [weeksRes, planRes] = await Promise.all([
        fetch(`/api/cohort-weeks/${cohortId}`).then(r => r.json()),
        fetch(`/api/cohort-planning/${cohortId}`).then(r => r.json())
    ]);

    state.cohortWeeks = weeksRes.data || [];
    state.planningData = planRes.data || [];

    dom.btnAddPlanning.style.display = state.cohortWeeks.length ? 'inline-flex' : 'none';
    renderPlanningCalendar(state.cohortWeeks, state.planningData);
}

function renderPlanningCalendar(weeks, planningData) {
    dom.planningCalendar.innerHTML = '';

    if (!weeks.length) {
        dom.planningCalendar.innerHTML = '<p style="color:var(--text-secondary)">Geen schooljaren gekoppeld aan dit cohort.</p>';
        return;
    }

    // Group weeks by school year
    const byYear = {};
    weeks.forEach(w => {
        if (!byYear[w.schooljaar_id]) byYear[w.schooljaar_id] = { naam: w.schooljaar_naam, weeks: [] };
        byYear[w.schooljaar_id].weeks.push(w);
    });

    // Assign stable colors to leereenheden
    const leerIds = [...new Set(planningData.map(p => p.leereenheid_id))];
    const colorMap = {};
    leerIds.forEach((id, i) => colorMap[id] = PLANNING_COLORS[i % PLANNING_COLORS.length]);

    Object.values(byYear).forEach(year => {
        const yearWeeks = year.weeks;

        // Planning entries that start in this school year
        const yearPlanning = planningData.filter(p => p.schooljaar_id === yearWeeks[0].schooljaar_id);

        const block = document.createElement('div');
        block.className = 'planning-year-block';

        const title = document.createElement('h3');
        title.className = 'planning-year-title';
        title.textContent = year.naam;
        block.appendChild(title);

        const table = document.createElement('table');
        table.className = 'planning-table';

        // ── Header rows ──────────────────────────────────────────────────────
        const thead = document.createElement('thead');

        // Period label row
        const periodRow = document.createElement('tr');
        const periodLabelTh = document.createElement('th');
        periodLabelTh.className = 'label-cell';
        periodLabelTh.textContent = '';
        periodRow.appendChild(periodLabelTh);

        // Track period spans for merging
        let currentPeriod = null;
        let currentTh = null;
        let periodSpan = 0;
        const periodHeaders = [];

        yearWeeks.forEach((w, i) => {
            const pName = w.periode_naam || '';
            const isLast = i === yearWeeks.length - 1;

            if (pName !== currentPeriod) {
                if (currentTh) {
                    currentTh.colSpan = periodSpan;
                    periodHeaders.push(currentTh);
                }
                currentTh = document.createElement('th');
                currentTh.textContent = pName || (w.is_lesweek ? '' : w.week_type);
                currentTh.style.borderLeft = '2px solid var(--border-color)';
                currentPeriod = pName;
                periodSpan = 1;
            } else {
                periodSpan++;
            }

            if (isLast && currentTh) {
                currentTh.colSpan = periodSpan;
                periodHeaders.push(currentTh);
            }
        });
        periodHeaders.forEach(th => periodRow.appendChild(th));

        // Delete action header
        const deleteTh = document.createElement('th');
        deleteTh.textContent = '';
        periodRow.appendChild(deleteTh);
        thead.appendChild(periodRow);

        // Week number row
        const weekRow = document.createElement('tr');
        const weekLabelTh = document.createElement('th');
        weekLabelTh.className = 'label-cell';
        weekLabelTh.textContent = 'Leereenheid';
        weekRow.appendChild(weekLabelTh);

        yearWeeks.forEach((w, i) => {
            const th = document.createElement('th');
            th.textContent = `w${w.kalenderweek}`;
            th.title = `${w.startdatum} – ${w.einddatum}`;
            const isHoliday = w.week_type && w.week_type.toLowerCase().includes('vakantie');
            if (isHoliday) th.classList.add('holiday-header');
            const prevPeriod = i > 0 ? yearWeeks[i-1].periode_naam : null;
            if (w.periode_naam !== prevPeriod) th.style.borderLeft = '2px solid var(--border-color)';
            weekRow.appendChild(th);
        });

        const actionTh = document.createElement('th');
        weekRow.appendChild(actionTh);
        thead.appendChild(weekRow);
        table.appendChild(thead);

        // ── Body rows (one per planning entry) ───────────────────────────────
        const tbody = document.createElement('tbody');

        if (yearPlanning.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = yearWeeks.length + 2;
            td.style.textAlign = 'center';
            td.style.padding = '1rem';
            td.style.color = 'var(--text-secondary)';
            td.textContent = 'Geen leereenheden gepland. Klik "Add Leereenheid" om te starten.';
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            yearPlanning.forEach(entry => {
                const tr = document.createElement('tr');

                const labelTd = document.createElement('td');
                labelTd.className = 'label-cell';
                labelTd.textContent = entry.leereenheid_naam;
                tr.appendChild(labelTd);

                const color = colorMap[entry.leereenheid_id] || '#4f86f7';

                yearWeeks.forEach((w, wi) => {
                    const td = document.createElement('td');
                    td.className = 'week-cell';
                    const isHoliday = w.week_type && w.week_type.toLowerCase().includes('vakantie');
                    if (isHoliday) {
                        td.classList.add('holiday');
                    } else if (w.volgnummer_schooljaar >= entry.start_volgnummer &&
                               w.volgnummer_schooljaar <= entry.eind_volgnummer) {
                        td.classList.add('active');
                        td.style.backgroundColor = color;
                    }
                    const prevPeriod = wi > 0 ? yearWeeks[wi - 1].periode_naam : null;
                    if (w.periode_naam !== prevPeriod) td.style.borderLeft = '2px solid var(--border-color)';
                    tr.appendChild(td);
                });

                const deleteTd = document.createElement('td');
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'planning-row-delete';
                deleteBtn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
                deleteBtn.title = 'Verwijder planning';
                deleteBtn.onclick = () => deletePlanningEntry(entry.id);
                deleteTd.appendChild(deleteBtn);
                tr.appendChild(deleteTd);

                tbody.appendChild(tr);
            });
        }

        table.appendChild(tbody);
        block.appendChild(table);
        dom.planningCalendar.appendChild(block);
    });
}

async function deletePlanningEntry(id) {
    if (!confirm('Planning verwijderen?')) return;
    await fetch(`/api/cohort-planning/${id}`, { method: 'DELETE' });
    renderCohortPlanning();
}

function openPlanningModal() {
    const weeks = state.cohortWeeks;

    // Populate leereenheden
    fetchData('leereenheden').then(leers => {
        dom.planningLeereenheadSelect.innerHTML = '';
        leers.forEach(l => {
            const opt = document.createElement('option');
            opt.value = l.id;
            opt.textContent = l.naam;
            dom.planningLeereenheadSelect.appendChild(opt);
        });
    });

    // Populate week dropdowns (only lesson weeks make sense as start/end)
    const lesWeeks = weeks.filter(w => w.is_lesweek);
    [dom.planningStartWeek, dom.planningEindWeek].forEach(sel => {
        sel.innerHTML = '';
        lesWeeks.forEach(w => {
            const opt = document.createElement('option');
            opt.value = w.id;
            opt.textContent = `${w.schooljaar_naam} – w${w.kalenderweek} (${w.startdatum})`;
            sel.appendChild(opt);
        });
    });

    dom.planningModal.classList.add('active');
}

function closePlanningModal() {
    dom.planningModal.classList.remove('active');
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

dom.cohortSelect.addEventListener('change', () => {
    if (state.currentTable === 'cohort_connections') {
        renderCohortConnections();
    }
});

dom.cohortYearSelect.addEventListener('change', () => {
    if (state.currentTable === 'cohort_schooljaren') {
        renderCohortYearsList();
    }
});

dom.btnAddCohortYear.addEventListener('click', async () => {
    const cohortId = dom.cohortYearSelect.value;
    const schooljaarId = dom.addSchooljaarSelect.value;
    if (!cohortId || !schooljaarId) return;

    try {
        await fetch(`/api/cohort-schooljaren/${cohortId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ schooljaar_id: schooljaarId })
        });
        dom.addSchooljaarSelect.value = '';
        renderCohortYearsList();
    } catch (err) {
        console.error('Error adding year to cohort', err);
    }
});

dom.planningCohortSelect.addEventListener('change', () => {
    if (state.currentTable === 'cohort_planning') renderCohortPlanning();
});

dom.btnAddPlanning.addEventListener('click', openPlanningModal);
document.getElementById('btn-close-planning-modal').addEventListener('click', closePlanningModal);
document.getElementById('btn-cancel-planning').addEventListener('click', closePlanningModal);

document.getElementById('btn-save-planning').addEventListener('click', async () => {
    const cohortId = dom.planningCohortSelect.value;
    const leereenheid_id = dom.planningLeereenheadSelect.value;
    const start_week_id = dom.planningStartWeek.value;
    const eind_week_id = dom.planningEindWeek.value;

    if (!cohortId || !leereenheid_id || !start_week_id || !eind_week_id) return;

    await fetch('/api/cohort-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohort_id: cohortId, leereenheid_id, start_week_id, eind_week_id })
    });

    closePlanningModal();
    renderCohortPlanning();
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
