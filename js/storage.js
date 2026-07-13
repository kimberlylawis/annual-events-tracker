// Persistence layer: reads/writes the events array to localStorage.
const Storage = (() => {
  const STORAGE_KEY = 'annualEventsTracker.events';

  function getEvents() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }

  function generateId() {
    return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function addEvent(event) {
    const events = getEvents();
    const newEvent = { ...event, id: generateId(), createdAt: new Date().toISOString() };
    events.push(newEvent);
    saveEvents(events);
    return newEvent;
  }

  function updateEvent(id, updates) {
    const events = getEvents();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;
    events[index] = { ...events[index], ...updates };
    saveEvents(events);
    return events[index];
  }

  function deleteEvent(id) {
    const events = getEvents().filter((e) => e.id !== id);
    saveEvents(events);
  }

  function mergeEvents(importedEvents) {
    const events = getEvents();
    const withNewIds = importedEvents.map((e) => ({
      ...e,
      id: generateId(),
      createdAt: e.createdAt || new Date().toISOString(),
    }));
    saveEvents([...events, ...withNewIds]);
    return withNewIds;
  }

  return { getEvents, saveEvents, addEvent, updateEvent, deleteEvent, mergeEvents };
})();
