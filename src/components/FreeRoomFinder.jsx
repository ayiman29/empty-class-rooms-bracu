import React, { useState, useMemo } from 'react';
import { ALLOWED_DAYS, FIXED_SLOTS, findFreeRoomsAtSlot } from '../utils/processSchedule.js';
import styles from './FreeRoomFinder.module.css';

export default function FreeRoomFinder({ index }) {
  const [day, setDay] = useState("");
  const [slotKey, setSlotKey] = useState("");

  const [queryDay, setQueryDay] = useState("");
  const [querySlot, setQuerySlot] = useState("");

  const [hasSearched, setHasSearched] = useState(false);

  const canSubmit = day !== "" && slotKey !== "";
  const inputsDirty = hasSearched && (day !== queryDay || slotKey !== querySlot);

  function formatSlotLabel(slot) {
    if (!slot.includes('-')) return slot;
    const [start, end] = slot.split('-');

    const to12 = (hm) => {
      const [H, M] = hm.split(':');
      let h = parseInt(H, 10);
      const suffix = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      return { h, M, suffix };
    };

    const s = to12(start);
    const e = to12(end);

    if (s.suffix === e.suffix) {
      return `${s.h}:${s.M}-${e.h}:${e.M} ${s.suffix}`;
    }
    return `${s.h}:${s.M} ${s.suffix}-${e.h}:${e.M} ${e.suffix}`;
  }

  const freeRooms = useMemo(() => {
    if (!index || !queryDay || !querySlot) return [];
    return findFreeRoomsAtSlot(index, queryDay, querySlot);
  }, [index, queryDay, querySlot]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setQueryDay(day);
    setQuerySlot(slotKey);
    setHasSearched(true);
  }

  return (
    <div className={styles.bg}>
      <div className={styles.centerBox}>
        <div className={styles.logoWrap}>
          <img src="/icon.png" alt="App logo" className={styles.logo} />
        </div>

        <h1 className={styles.heading}>Free Classroom Finder</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Day
            <select
              className={styles.select}
              value={day}
              onChange={e => setDay(e.target.value)}>
              <option value="">Select day</option>
              {ALLOWED_DAYS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Timeslot
            <select
              className={styles.select}
              value={slotKey}
              onChange={e => setSlotKey(e.target.value)}>
              <option value="">Select time slot</option>
              {FIXED_SLOTS.map(s => (
                <option key={s.key} value={s.key}>
                  {formatSlotLabel(s.key)}
                </option>
              ))}
            </select>
          </label>

          <button
            type="submit"
            className={styles.button}
            disabled={!canSubmit}>
            Find Free Rooms
          </button>
        </form>

        {!hasSearched && (
          <div className={styles.guidance}>
            <p>
              <b>Welcome! Select a day and a time slot above to find all free classrooms.</b><br />
            </p>
          </div>
        )}

        {hasSearched && queryDay && querySlot && (
          <div className={styles.resultWrapper}>
            <h2 className={styles.resultHeading}>
              Free rooms on <span style={{ color: '#9392e7' }}>{queryDay}</span>{" "}
              (<span style={{ color: '#9392e7' }}>{formatSlotLabel(querySlot)}</span>)
            </h2>

            {inputsDirty && (
              <p className={styles.dirtyHint}>
                You changed selections. Press "Find Free Rooms" to refresh results.
              </p>
            )}

            {freeRooms.length === 0 ? (
              <p className={styles.resultMeta}>No free rooms found.</p>
            ) : (
              <div>
                <p className={styles.resultMeta}>
                  Total free: <b>{freeRooms.length}</b>
                </p>
                <ul className={styles.roomList}>
                  {freeRooms.map(r => <li key={r}>{r}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}