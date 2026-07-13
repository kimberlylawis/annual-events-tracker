// DOM wiring: form handling, list rendering, import/export buttons, toasts.
(() => {
  const form = document.getElementById('event-form');
  const formTitle = document.getElementById('form-title');
  const idField = document.getElementById('event-id');
  const nameField = document.getElementById('event-name');
  const monthField = document.getElementById('event-month');
  const dayField = document.getElementById('event-day');
  const originYearField = document.getElementById('event-origin-year');
  const categoryField = document.getElementById('event-category');
  const notesField = document.getElementById('event-notes');
  const submitBtn = document.getElementById('submit-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');

  const eventList = document.getElementById('event-list');
  const eventCount = document.getElementById('event-count');
  const emptyState = document.getElementById('empty-state');

  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFileInput = document.getElementById('import-file-input');

  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle('toast-error', isError);
    toast.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3500);
  }

  function daysInMonth(month) {
    return { 1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31 }[month];
  }

  function populateMonthOptions() {
    monthField.innerHTML = Events.MONTH_NAMES
      .map((name, idx) => `<option value="${idx + 1}">${name}</option>`)
      .join('');
  }

  function populateDayOptions(selectedDay) {
    const month = Number(monthField.value) || 1;
    const max = daysInMonth(month);
    const current = selectedDay || Number(dayField.value) || 1;
    const clamped = Math.min(current, max);
    dayField.innerHTML = Array.from({ length: max }, (_, i) => i + 1)
      .map((d) => `<option value="${d}">${d}</option>`)
      .join('');
    dayField.value = String(clamped);
  }

  monthField.addEventListener('change', () => populateDayOptions());

  function resetForm() {
    form.reset();
    idField.value = '';
    formTitle.textContent = 'Add Event';
    submitBtn.textContent = 'Add Event';
    cancelEditBtn.classList.add('hidden');
    populateMonthOptions();
    populateDayOptions(1);
  }

  function enterEditMode(evt) {
    idField.value = evt.id;
    nameField.value = evt.name;
    populateMonthOptions();
    monthField.value = String(evt.month);
    populateDayOptions(evt.day);
    originYearField.value = evt.originYear || '';
    categoryField.value = evt.category;
    notesField.value = evt.notes || '';
    formTitle.textContent = 'Edit Event';
    submitBtn.textContent = 'Save Changes';
    cancelEditBtn.classList.remove('hidden');
    nameField.focus();
  }

  function renderEvents() {
    const events = Storage.getEvents();

    const enriched = events.map((evt) => {
      const { days, occursOnYear } = Events.daysUntilNext(evt.month, evt.day);
      return { ...evt, daysUntil: days, occursOnYear };
    });
    enriched.sort((a, b) => a.daysUntil - b.daysUntil);

    eventCount.textContent = String(enriched.length);
    emptyState.classList.toggle('hidden', enriched.length > 0);
    eventList.innerHTML = '';

    for (const evt of enriched) {
      const li = document.createElement('li');
      li.className = 'event-item';

      const swatch = document.createElement('span');
      swatch.className = 'category-swatch';
      swatch.style.backgroundColor = Events.colorForCategory(evt.category);

      const info = document.createElement('div');
      info.className = 'event-info';

      const anniversary = Events.anniversaryLabel(evt.originYear, evt.occursOnYear);
      const dateLabel = Events.formatDate(evt.month, evt.day);

      info.innerHTML = `
        <div class="event-name-row">
          <strong>${escapeHtml(evt.name)}</strong>
          <span class="category-pill" style="background:${Events.colorForCategory(evt.category)}">${escapeHtml(evt.category)}</span>
        </div>
        <div class="event-meta">
          ${dateLabel}${anniversary ? ` &middot; ${anniversary}` : ''}
          ${evt.notes ? `<div class="event-notes">${escapeHtml(evt.notes)}</div>` : ''}
        </div>
      `;

      const countdown = document.createElement('div');
      countdown.className = 'countdown';
      countdown.innerHTML = evt.daysUntil === 0
        ? `<span class="days-badge today">Today!</span>`
        : `<span class="days-badge">${evt.daysUntil}</span><span class="days-label">day${evt.daysUntil === 1 ? '' : 's'}</span>`;

      const actions = document.createElement('div');
      actions.className = 'event-actions';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'icon-btn';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => enterEditMode(evt));

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'icon-btn danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => {
        if (confirm(`Delete "${evt.name}"?`)) {
          Storage.deleteEvent(evt.id);
          renderEvents();
          showToast('Event deleted.');
        }
      });

      actions.append(editBtn, deleteBtn);
      li.append(swatch, info, countdown, actions);
      eventList.appendChild(li);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const payload = {
      name: nameField.value.trim(),
      month: Number(monthField.value),
      day: Number(dayField.value),
      originYear: originYearField.value ? Number(originYearField.value) : null,
      category: categoryField.value.trim(),
      notes: notesField.value.trim(),
    };

    if (!payload.name || !payload.category) return;

    const id = idField.value;
    if (id) {
      Storage.updateEvent(id, payload);
      showToast('Event updated.');
    } else {
      Storage.addEvent(payload);
      showToast('Event added.');
    }

    resetForm();
    renderEvents();
  });

  cancelEditBtn.addEventListener('click', resetForm);

  exportBtn.addEventListener('click', () => {
    const events = Storage.getEvents();
    if (events.length === 0) {
      showToast('No events to export yet.', true);
      return;
    }
    IO.exportEvents(events);
    showToast('Export downloaded.');
  });

  importBtn.addEventListener('click', () => importFileInput.click());

  importFileInput.addEventListener('change', async () => {
    const file = importFileInput.files[0];
    importFileInput.value = '';
    if (!file) return;

    try {
      const text = await IO.readFileAsText(file);
      const importedEvents = IO.parseImportedFile(text);
      const proceed = confirm(`Import ${importedEvents.length} event(s) and add them to your current list?`);
      if (!proceed) return;

      Storage.mergeEvents(importedEvents);
      renderEvents();
      showToast(`Imported ${importedEvents.length} event(s).`);
    } catch (err) {
      showToast(err.message || 'Import failed.', true);
    }
  });

  resetForm();
  renderEvents();
})();
