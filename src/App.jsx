import FreeRoomFinder from './components/FreeRoomFinder.jsx';
import { useScheduleData } from './hooks/useScheduleData.js';

export default function App() {
  const { loading, error, index } = useScheduleData();

  return (
    <div>
      {loading && (
        <div
          style={{
            margin: 0,
            background: "linear-gradient(120deg, #000000 0%, #13132c 60%, #060120 100%)",
          }}
        >
          {loading}
        </div>
      )}
      {error && <p style={{ color: "red", padding: "1rem" }}>Error: {error}</p>}
      {index && <FreeRoomFinder index={index} />}
    </div>
    );
  }