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

  const inputsDirty = hasSearched &&
    (day !== queryDay || slotKey !== querySlot);

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
                  <option key={s.key} value={s.key}>{s.key}</option>
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
              <b>Welcome!</b> Select a day and a time slot above to find all free classrooms.<br />
              <span style={{ fontSize: "0.95rem" }}>
                Now you can easily plan group study, meetings or quick classes!
              </span>
            </p>
          </div>
        )}

        {hasSearched && queryDay && querySlot && (
          <div className={styles.resultWrapper}>
            <h2 className={styles.resultHeading}>
              Free rooms on <span style={{ color: '#51e2c2' }}>{queryDay}</span>
              {" "}(<span style={{ color: '#4097ff' }}>{querySlot}</span>)
            </h2>

            {inputsDirty}

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