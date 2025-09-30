const ROOM_CODE_REGEX = /\b(?:FT\d{2}-\d{2}[A-Z]|\d{2}[A-Z]-\d{2}[A-Z])\b/g;


export const FIXED_SLOTS = [
  { key: '08:00-09:20', start: '08:00:00', end: '09:20:00' },
  { key: '09:30-10:50', start: '09:30:00', end: '10:50:00' },
  { key: '11:00-12:20', start: '11:00:00', end: '12:20:00' },
  { key: '12:30-13:50', start: '12:30:00', end: '13:50:00' },
  { key: '14:00-15:20', start: '14:00:00', end: '15:20:00' },
  { key: '15:30-16:50', start: '15:30:00', end: '16:50:00' },
  { key: '17:00-18:20', start: '17:00:00', end: '18:20:00' }
];

export const ALLOWED_DAYS = [
  'SATURDAY',
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY'
];


const EXCLUDE_ROOM_SUFFIX_L = true;
const EXCLUDE_ROOM_SUFFIX_T = false;

function extractRoomCodes(str) {
  if (!str) return [];
  const matches = str.match(ROOM_CODE_REGEX);
  return matches || [];
}

function toMinutes(timeStr) {
  if (!timeStr) return null;
  const [h, m] = timeStr.split(':');
  return parseInt(h, 10) * 60 + parseInt(m, 10);
}

function intervalsOverlap(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd;
}

function shouldKeepRoom(code) {
  if (EXCLUDE_ROOM_SUFFIX_L && code.endsWith('L')) return false;
  if (EXCLUDE_ROOM_SUFFIX_T && code.endsWith('T')) return false;
  return true;
}

export function buildScheduleIndex(sections) {
  const masterRoomSet = new Set();
  const daySlotOccupied = {};

  for (const d of ALLOWED_DAYS) {
    daySlotOccupied[d] = {};
    FIXED_SLOTS.forEach(slot => {
      daySlotOccupied[d][slot.key] = new Set();
    });
  }

  const slotRanges = FIXED_SLOTS.map(s => ({
    key: s.key,
    startMin: toMinutes(s.start),
    endMin: toMinutes(s.end)
  }));

  function occupyOverlappingSlots(day, roomCodes, schedStart, schedEnd) {
    if (!ALLOWED_DAYS.includes(day)) return;
    const sMin = toMinutes(schedStart);
    const eMin = toMinutes(schedEnd);
    if (sMin == null || eMin == null) return;
    for (const sr of slotRanges) {
      if (intervalsOverlap(sMin, eMin, sr.startMin, sr.endMin)) {
        roomCodes.forEach(rc => daySlotOccupied[day][sr.key].add(rc));
      }
    }
  }

  sections.forEach(section => {
    if (section.sectionType === 'LAB') return;

    const lectureRooms = extractRoomCodes(section.roomName).filter(shouldKeepRoom);
    lectureRooms.forEach(r => masterRoomSet.add(r));

    if (section.sectionSchedule?.classSchedules) {
      section.sectionSchedule.classSchedules.forEach(cs => {
        occupyOverlappingSlots(cs.day, lectureRooms, cs.startTime, cs.endTime);
      });
    }
  });

  const masterRooms = Array.from(masterRoomSet)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

  return { masterRooms, daySlotOccupied };
}

export function findFreeRoomsAtSlot(index, day, slotKey) {
  if (!index) return [];
  if (!ALLOWED_DAYS.includes(day)) return [];
  const { masterRooms, daySlotOccupied } = index;
  const occupied = daySlotOccupied?.[day]?.[slotKey];
  if (!occupied) return masterRooms;
  return masterRooms.filter(r => !occupied.has(r));
}