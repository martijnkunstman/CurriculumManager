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
    'year_visualizer': 'Year Visualizer',
    'cohorten': 'Manage Cohorts',
    'leereenheid_types': 'Manage Leereenheid Types',
    'leereenheden': 'Manage Leereenheden',
    'cohort_schooljaren': 'Cohort Years',
    'cohort_planning': 'Cohort Planning'
};

const dom = {
    navLinks: document.querySelectorAll('.nav-link'),
    pageTitle: document.getElementById('page-title'),
    tableHead: document.getElementById('table-head'),
    tableBody: document.getElementById('table-body'),
    tableContainer: document.getElementById('table-container'),
    visualizerContainer: document.getElementById('visualizer-container'),
    cohortYearsContainer: document.getElementById('cohort-years-container'),
    cohortYearSelect: document.getElementById('cohort-year-select'),
    addSchooljaarSelect: document.getElementById('add-schooljaar-select'),
    btnAddCohortYear: document.getElementById('btn-add-cohort-year'),
    cohortYearsList: document.getElementById('cohort-years-list'),
    planningContainer: document.getElementById('cohort-planning-container'),
    planningCohortSelect: document.getElementById('planning-cohort-select'),
    planningCalendar: document.getElementById('planning-calendar'),
    planningPalette: document.getElementById('planning-palette'),
    paletteList: document.getElementById('palette-list'),
    btnExportSql: document.getElementById('btn-export-sql'),
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

function populateSelect(el, items, placeholder = '', labelFn = item => item.naam) {
    el.innerHTML = placeholder ? `<option value="">${placeholder}</option>` : '';
    items.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = labelFn(item);
        el.appendChild(opt);
    });
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

const CONTENT_CONTAINERS = {
    year_visualizer:    'visualizerContainer',
    cohort_schooljaren: 'cohortYearsContainer',
    cohort_planning:    'planningContainer',
};
const ALL_CONTAINERS = ['tableContainer','visualizerContainer','cohortYearsContainer','planningContainer'];

function showView(tableName) {
    ALL_CONTAINERS.forEach(k => { dom[k].style.display = 'none'; });
    const target = CONTENT_CONTAINERS[tableName] || 'tableContainer';
    dom[target].style.display = 'block';
    dom.btnAdd.style.display = (target === 'tableContainer') ? 'inline-flex' : 'none';
    dom.yearSelect.style.display = 'none';
}

async function loadTable(tableName) {
    state.currentTable = tableName;
    dom.pageTitle.textContent = tableTitles[tableName] || 'Management';
    dom.navLinks.forEach(link => link.classList.toggle('active', link.dataset.target === tableName));

    showView(tableName);

    if (tableName === 'year_visualizer')    { await renderYearVisualizer();    return; }
    if (tableName === 'cohort_schooljaren') { await loadCohortYearsView();     return; }
    if (tableName === 'cohort_planning')    { await loadCohortPlanningView();  return; }

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

        const weekResults = await Promise.all(
            schooljaren.map(sj => fetch(`/api/year-view/${sj.id}`).then(r => r.json()))
        );

        dom.visualizerContainer.innerHTML = '<div class="all-years-container"></div>';
        const allYearsCont = dom.visualizerContainer.querySelector('.all-years-container');

        schooljaren.forEach((sj, sjIdx) => {
            let weeks = weekResults[sjIdx].data || [];
            if (weeks.length === 0) return;

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
        });

    } catch (err) {
        console.error('Error rendering visualizer', err);
        dom.visualizerContainer.innerHTML = '<p style="color:red">Error loading visualization.</p>';
    }
}

async function loadCohortYearsView() {
    const [cohorts, schooljaren] = await Promise.all([
        fetchData('cohorten'),
        fetchData('ka_schooljaren')
    ]);
    populateSelect(dom.cohortYearSelect, cohorts, '-- Select a Cohort --');
    populateSelect(dom.addSchooljaarSelect, schooljaren, '-- Select School Year to Add --');
    dom.cohortYearsList.innerHTML = '';
}

async function renderCohortYearsList() {
    const cohortId = dom.cohortYearSelect.value;
    if (!cohortId) { dom.cohortYearsList.innerHTML = ''; return; }

    try {
        const res = await fetch(`/api/cohort-schooljaren/${cohortId}`);
        const json = await res.json();
        const years = json.data || [];

        dom.cohortYearsList.innerHTML = '';
        years.forEach((y, index) => {
            const li = document.createElement('li');
            li.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:0.75rem; border-bottom:1px solid var(--border-color);';

            const span = document.createElement('span');
            span.innerHTML = `<strong>Year ${index + 1}:</strong> ${y.naam}`;

            const btn = document.createElement('button');
            btn.className = 'btn-icon delete';
            btn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
            btn.title = 'Remove Year';
            btn.onclick = async () => {
                if (!confirm('Remove this year from cohort?')) return;
                await fetch(`/api/cohort-schooljaren/${y.id}`, { method: 'DELETE' });
                renderCohortYearsList();
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
    'leereenheid_types': { id: 0, naam: '' },
    'cohorten': { id: 0, naam: '' },
    'leereenheden': { id: 0, naam: '', type: '' }
};

function generateForm(dataRow = null, selectFields = {}) {
    dom.form.innerHTML = '';

    let template = dataRow || (state.data.length > 0 ? state.data[0] : fallbackSchemas[state.currentTable]);

    if (!template) {
        dom.form.innerHTML = '<p>No schema available to add new.</p>';
        return;
    }

    Object.keys(template).forEach(key => {
        if (key === 'id') return;

        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.textContent = key.replace(/_/g, ' ').toUpperCase();

        let field;
        if (selectFields[key]) {
            field = document.createElement('select');
            field.className = 'form-control';
            field.name = key;
            const blank = document.createElement('option');
            blank.value = '';
            blank.textContent = '-- Select --';
            field.appendChild(blank);
            selectFields[key].forEach(opt => {
                const o = document.createElement('option');
                o.value = opt.value;
                o.textContent = opt.label;
                if (dataRow && dataRow[key] === opt.value) o.selected = true;
                field.appendChild(o);
            });
        } else {
            field = document.createElement('input');
            field.className = 'form-control';
            field.name = key;
            if (dataRow) {
                field.value = dataRow[key] ?? '';
            } else if (key.includes('datum')) {
                field.type = 'date';
            } else if (typeof template[key] === 'number') {
                field.type = 'number';
            } else {
                field.type = 'text';
            }
        }

        group.appendChild(label);
        group.appendChild(field);
        dom.form.appendChild(group);
    });
}

async function getSelectFields() {
    if (state.currentTable === 'leereenheden') {
        const types = await fetchData('leereenheid_types');
        return { type: types.map(t => ({ value: t.naam, label: t.naam })) };
    }
    return {};
}

window.editRecord = async (id) => {
    state.editingId = id;
    const record = state.data.find(d => d.id === id);
    const selectFields = await getSelectFields();
    generateForm(record, selectFields);
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
const LANE_HEIGHT = 34;

let weekOffsetsByYear = {};
let resizeState = null;

function getLeerColor(type, id) {
    if (type) {
        let hash = 0;
        for (let i = 0; i < type.length; i++) hash = (hash * 31 + type.charCodeAt(i)) & 0xffffffff;
        return PLANNING_COLORS[Math.abs(hash) % PLANNING_COLORS.length];
    }
    return PLANNING_COLORS[id % PLANNING_COLORS.length];
}

async function loadCohortPlanningView() {
    const cohorts = await fetchData('cohorten');
    populateSelect(dom.planningCohortSelect, cohorts, '-- Selecteer een cohort --');
    const saved = localStorage.getItem('planning_cohort_id');
    if (saved && cohorts.find(c => String(c.id) === saved)) {
        dom.planningCohortSelect.value = saved;
        await renderCohortPlanning();
    } else {
        dom.planningCalendar.innerHTML = '';
        dom.planningPalette.style.display = 'none';
        dom.btnExportSql.style.display = 'none';
    }
}

async function renderCohortPlanning() {
    const cohortId = dom.planningCohortSelect.value;
    if (!cohortId) {
        dom.planningCalendar.innerHTML = '';
        dom.planningPalette.style.display = 'none';
        dom.btnExportSql.style.display = 'none';
        localStorage.removeItem('planning_cohort_id');
        return;
    }
    localStorage.setItem('planning_cohort_id', cohortId);
    dom.planningCalendar.innerHTML = '<p style="color:var(--text-secondary)">Loading...</p>';

    const [weeksRes, planRes, leerRes] = await Promise.all([
        fetch(`/api/cohort-weeks/${cohortId}`).then(r => r.json()),
        fetch(`/api/cohort-planning/${cohortId}`).then(r => r.json()),
        fetch('/api/leereenheden').then(r => r.json())
    ]);

    const weeks = weeksRes.data || [];
    const planningData = planRes.data || [];
    const leereenheden = leerRes.data || [];

    renderPalette(leereenheden);
    dom.planningPalette.style.display = leereenheden.length ? 'flex' : 'none';
    dom.btnExportSql.style.display = planningData.length ? 'inline-flex' : 'none';
    dom.btnExportSql.dataset.cohortId = cohortId;
    dom.btnExportSql.dataset.planningJson = JSON.stringify(planningData);
    renderPlanningTimeline(weeks, planningData, cohortId);
}

function renderPalette(leereenheden) {
    dom.paletteList.innerHTML = '';
    leereenheden.forEach(l => {
        const chip = document.createElement('div');
        chip.className = 'palette-chip';
        chip.draggable = true;
        chip.textContent = l.naam;
        chip.style.borderLeftColor = getLeerColor(l.type, l.id);
        chip.addEventListener('dragstart', e => {
            e.dataTransfer.setData('leereenheid_id', l.id);
            e.dataTransfer.effectAllowed = 'copy';
        });
        dom.paletteList.appendChild(chip);
    });
}

function renderPlanningTimeline(weeks, planningData, cohortId) {
    dom.planningCalendar.innerHTML = '';
    weekOffsetsByYear = {};

    if (!weeks.length) {
        dom.planningCalendar.innerHTML = '<p style="color:var(--text-secondary)">Geen schooljaren gekoppeld aan dit cohort.</p>';
        return;
    }

    const yearMap = new Map();
    weeks.forEach(w => {
        if (!yearMap.has(w.schooljaar_id)) yearMap.set(w.schooljaar_id, { id: w.schooljaar_id, naam: w.schooljaar_naam, weeks: [] });
        yearMap.get(w.schooljaar_id).weeks.push(w);
    });

    yearMap.forEach(year => {
        const firstPeriodIdx = year.weeks.findIndex(w => w.periode_naam);
        const displayWeeks = firstPeriodIdx > 0
            ? [...year.weeks.slice(firstPeriodIdx), ...year.weeks.slice(0, firstPeriodIdx)]
            : year.weeks;

        const yearPlan = planningData.filter(p => p.schooljaar_id === year.id);

        const section = document.createElement('div');
        section.className = 'planning-year-section';

        const title = document.createElement('h3');
        title.className = 'year-row-title';
        title.textContent = year.naam;
        section.appendChild(title);

        const scrollArea = document.createElement('div');
        scrollArea.className = 'planning-scroll-area';

        const inner = document.createElement('div');
        inner.className = 'planning-inner';

        // ── Week header row (reuses year visualizer logic) ──
        const weeksRow = document.createElement('div');
        weeksRow.className = 'planning-weeks-row';

        const contexts = displayWeeks.map((w, index) => {
            if (w.periode_naam) return w.periode_naam;
            let leftCtx = null, rightCtx = null;
            for (let i = index - 1; i >= 0; i--) { if (displayWeeks[i].periode_naam) { leftCtx = displayWeeks[i].periode_naam; break; } }
            for (let i = index + 1; i < displayWeeks.length; i++) { if (displayWeeks[i].periode_naam) { rightCtx = displayWeeks[i].periode_naam; break; } }
            if (leftCtx && leftCtx === rightCtx) return leftCtx;
            return `between_${leftCtx}_${rightCtx}`;
        });

        let seenPeriods = new Set();
        let currentPeriodWeek = 1;

        displayWeeks.forEach((w, index) => {
            const col = document.createElement('div');
            col.className = 'timeline-col';

            const currentCtx = contexts[index];
            const prevCtx = index > 0 ? contexts[index - 1] : null;
            const nextCtx = index < displayWeeks.length - 1 ? contexts[index + 1] : null;

            if (currentCtx !== prevCtx) currentPeriodWeek = 1;

            const labelDiv = document.createElement('div');
            labelDiv.className = 'timeline-label';
            if (w.periode_naam && !seenPeriods.has(w.periode_naam)) {
                labelDiv.textContent = w.periode_naam;
                seenPeriods.add(w.periode_naam);
            } else {
                labelDiv.innerHTML = '&nbsp;';
            }

            const block = document.createElement('div');
            block.className = 'week-block';
            block.dataset.weekId = w.id;
            block.style.flexDirection = 'column';

            const isHoliday = w.week_type && w.week_type.toLowerCase().includes('vakantie');
            let pText = '&nbsp;';
            if (!isHoliday) { pText = currentPeriodWeek; currentPeriodWeek++; }

            block.innerHTML = `
                <div style="font-size: 0.85rem; font-weight: bold; line-height: 1;">${pText}</div>
                <div style="font-size: 0.55rem; font-weight: 600; line-height: 1; margin-top: 2px; opacity: 0.85;">w${w.kalenderweek}</div>
            `;

            if (w.is_lesweek) block.classList.add('lesweek');
            else if (isHoliday) block.classList.add('holiday');
            else block.classList.add('special');

            const isStart = index === 0 || prevCtx !== currentCtx;
            const isEnd = index === displayWeeks.length - 1 || nextCtx !== currentCtx;
            if (isStart) block.classList.add('start-block');
            if (isEnd) { block.classList.add('end-block'); col.style.marginRight = '1.25rem'; }

            block.setAttribute('data-tooltip', w.periode_naam
                ? `W${w.kalenderweek}: ${w.startdatum} | ${w.periode_naam}`
                : `W${w.kalenderweek}: ${w.startdatum} | ${w.week_type}`
            );

            block.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; block.classList.add('drop-highlight'); });
            block.addEventListener('dragleave', () => block.classList.remove('drop-highlight'));
            block.addEventListener('drop', e => {
                e.preventDefault();
                block.classList.remove('drop-highlight');
                const leerId = e.dataTransfer.getData('leereenheid_id');
                if (leerId) handlePaletteDrop(leerId, w.id, displayWeeks, cohortId);
            });

            col.appendChild(labelDiv);
            col.appendChild(block);
            weeksRow.appendChild(col);
        });

        // ── Bars section ──
        const barsSection = document.createElement('div');
        barsSection.className = 'planning-bars-section';
        const initialLanes = Math.max(1, computeLanes(yearPlan).length);
        barsSection.style.height = `${initialLanes * LANE_HEIGHT + 8}px`;

        inner.appendChild(weeksRow);
        inner.appendChild(barsSection);
        scrollArea.appendChild(inner);
        section.appendChild(scrollArea);
        dom.planningCalendar.appendChild(section);

        requestAnimationFrame(() => {
            const blocks = weeksRow.querySelectorAll('.week-block');
            const baseLeft = barsSection.getBoundingClientRect().left;
            const offsets = displayWeeks.map((w, i) => {
                const rect = blocks[i].getBoundingClientRect();
                return { id: w.id, left: rect.left - baseLeft, right: rect.right - baseLeft };
            });
            weekOffsetsByYear[year.id] = { offsets, barsSection };
            placeBarsForYear(yearPlan, barsSection, offsets);
        });
    });
}

function computeLanes(planEntries) {
    const sorted = [...planEntries].sort((a, b) => a.start_volgnummer - b.start_volgnummer);
    const lanes = [];
    sorted.forEach(entry => {
        let placed = false;
        for (let i = 0; i < lanes.length; i++) {
            if (lanes[i][lanes[i].length - 1].eind_volgnummer < entry.start_volgnummer) {
                lanes[i].push(entry);
                placed = true;
                break;
            }
        }
        if (!placed) lanes.push([entry]);
    });
    return lanes;
}

function placeBarsForYear(planEntries, barsSection, offsets) {
    barsSection.innerHTML = '';
    if (!planEntries.length) return;

    const lanes = computeLanes(planEntries);
    barsSection.style.height = `${lanes.length * LANE_HEIGHT + 8}px`;

    const laneMap = new Map();
    lanes.forEach((lane, laneIdx) => lane.forEach(entry => laneMap.set(entry.id, laneIdx)));

    planEntries.forEach(entry => {
        const startOff = offsets.find(o => o.id === entry.start_week_id);
        const endOff = offsets.find(o => o.id === entry.eind_week_id);
        if (!startOff || !endOff) return;

        const laneIdx = laneMap.get(entry.id) || 0;
        const top = laneIdx * LANE_HEIGHT + 4;
        const left = startOff.left + 2;
        const width = endOff.right - startOff.left - 4;
        const color = getLeerColor(entry.leereenheid_type, entry.leereenheid_id);

        const bar = document.createElement('div');
        bar.className = 'leereenheid-bar';
        bar.dataset.entryId = entry.id;
        bar.style.cssText = `top:${top}px; left:${left}px; width:${Math.max(width, 10)}px; background:${color};`;

        const handleLeft = document.createElement('div');
        handleLeft.className = 'bar-handle left';
        handleLeft.addEventListener('mousedown', e => startResize(e, entry, 'left'));

        const label = document.createElement('span');
        label.className = 'bar-label';
        label.textContent = entry.leereenheid_naam;

        const handleRight = document.createElement('div');
        handleRight.className = 'bar-handle right';
        handleRight.addEventListener('mousedown', e => startResize(e, entry, 'right'));

        const delBtn = document.createElement('button');
        delBtn.className = 'bar-delete-btn';
        delBtn.innerHTML = '<ion-icon name="close-circle-outline"></ion-icon>';
        delBtn.title = 'Verwijder planning';
        delBtn.addEventListener('click', () => deletePlanningEntry(entry.id));

        bar.appendChild(handleLeft);
        bar.appendChild(label);
        bar.appendChild(handleRight);
        bar.appendChild(delBtn);
        barsSection.appendChild(bar);
    });
}

async function handlePaletteDrop(leereenheid_id, drop_week_id, displayWeeks, cohortId) {
    const dropIdx = displayWeeks.findIndex(w => w.id === parseInt(drop_week_id));
    if (dropIdx === -1) return;

    let endId = displayWeeks[dropIdx].id;
    let count = 0;
    for (let i = dropIdx; i < displayWeeks.length && count < 4; i++) {
        if (displayWeeks[i].is_lesweek) { endId = displayWeeks[i].id; count++; }
    }

    await fetch('/api/cohort-planning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cohort_id: cohortId, leereenheid_id, start_week_id: drop_week_id, eind_week_id: endId })
    });
    renderCohortPlanning();
}

async function deletePlanningEntry(id) {
    await fetch(`/api/cohort-planning/${id}`, { method: 'DELETE' });
    renderCohortPlanning();
}

function startResize(e, entry, side) {
    e.preventDefault();
    e.stopPropagation();
    const yearData = Object.values(weekOffsetsByYear).find(d =>
        d.barsSection.querySelector(`[data-entry-id="${entry.id}"]`)
    );
    if (!yearData) return;
    resizeState = {
        entry, side,
        offsets: yearData.offsets,
        barsSection: yearData.barsSection,
        startWeekId: entry.start_week_id,
        endWeekId: entry.eind_week_id
    };
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
}

document.addEventListener('mousemove', e => {
    if (!resizeState) return;
    const { barsSection, offsets } = resizeState;
    const relX = e.clientX - barsSection.getBoundingClientRect().left;

    let best = null, bestDist = Infinity;
    offsets.forEach(o => {
        const dist = Math.abs(relX - (o.left + o.right) / 2);
        if (dist < bestDist) { bestDist = dist; best = o; }
    });
    if (!best) return;

    if (resizeState.side === 'left') resizeState.startWeekId = best.id;
    else resizeState.endWeekId = best.id;

    const startOff = offsets.find(o => o.id === resizeState.startWeekId);
    const endOff = offsets.find(o => o.id === resizeState.endWeekId);
    if (!startOff || !endOff) return;

    const width = endOff.right - startOff.left - 4;
    if (width < 10) return;

    const bar = barsSection.querySelector(`[data-entry-id="${resizeState.entry.id}"]`);
    if (bar) { bar.style.left = `${startOff.left + 2}px`; bar.style.width = `${width}px`; }
});

document.addEventListener('mouseup', async () => {
    if (!resizeState) return;
    const { entry, startWeekId, endWeekId } = resizeState;
    resizeState = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    if (startWeekId !== entry.start_week_id || endWeekId !== entry.eind_week_id) {
        await fetch(`/api/cohort-planning/${entry.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start_week_id: startWeekId, eind_week_id: endWeekId })
        });
        renderCohortPlanning();
    }
});

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

dom.cohortYearSelect.addEventListener('change', () => {
    if (state.currentTable === 'cohort_schooljaren') renderCohortYearsList();
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

dom.btnExportSql.addEventListener('click', async () => {
    try {
        const res = await fetch('/api/export-sql');
        const text = await res.text();
        const blob = new Blob([text], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `database_export_${new Date().toISOString().slice(0,10)}.sql`;
        a.click();
        URL.revokeObjectURL(a.href);
    } catch (err) {
        console.error('Export failed', err);
    }
});

dom.btnAdd.addEventListener('click', async () => {
    state.editingId = null;
    const selectFields = await getSelectFields();
    generateForm(null, selectFields);
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
