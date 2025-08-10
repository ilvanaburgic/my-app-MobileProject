export const todayISO = () => new Date().toISOString().slice(0, 10);
export const HOURS = Array.from({ length: 15 }, (_, i) => `${String(9 + i).padStart(2, '0')}:00`);