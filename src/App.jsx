import FreeRoomFinder from './components/FreeRoomFinder.jsx';
import { useScheduleData } from './hooks/useScheduleData.js';

export default function App() {
  const { loading, error, index } = useScheduleData();

  return (
    <div>
      {loading}
      {error && <p style={{ color: 'red', padding: '1rem' }}>Error: {error}</p>}
      {index && <FreeRoomFinder index={index} />}
    </div>
  );
}