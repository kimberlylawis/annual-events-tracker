// Export/import events as JSON files for backup or moving between workstations.
const IO = (() => {
  function exportEvents(events) {
    const payload = {
      exportedAt: new Date().toISOString(),
      source: 'annual-events-tracker',
      version: 1,
      events,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStamp = new Date().toISOString().slice(0, 10);

    const link = document.createElement('a');
    link.href = url;
    link.download = `annual-events-tracker-export-${dateStamp}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function isValidEvent(e) {
    return (
      e && typeof e === 'object' &&
      typeof e.name === 'string' &&
      Number.isInteger(e.month) && e.month >= 1 && e.month <= 12 &&
      Number.isInteger(e.day) && e.day >= 1 && e.day <= 31 &&
      typeof e.category === 'string'
    );
  }

  function parseImportedFile(text) {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error('That file is not valid JSON.');
    }

    const events = Array.isArray(parsed) ? parsed : parsed.events;
    if (!Array.isArray(events)) {
      throw new Error('This file does not contain an events array.');
    }

    const validEvents = events.filter(isValidEvent);
    if (validEvents.length === 0) {
      throw new Error('No valid events were found in this file.');
    }

    return validEvents.map((e) => ({
      name: e.name,
      month: e.month,
      day: e.day,
      originYear: Number.isInteger(e.originYear) ? e.originYear : null,
      category: e.category,
      notes: typeof e.notes === 'string' ? e.notes : '',
    }));
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  return { exportEvents, parseImportedFile, readFileAsText };
})();
