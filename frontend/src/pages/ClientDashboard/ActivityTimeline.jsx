import { useEffect, useState } from "react";

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/client/activity", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(() => setActivities([]));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
      <h2 className="font-bold text-xl mb-2">Historique</h2>
      <ul>
        {activities.length === 0 && <li className="text-gray-500">Aucune activité récente.</li>}
        {activities.map((a, i) => (
          <li key={i} className="text-gray-700 mb-1">
            <span className="font-semibold">{a.date} :</span> {a.action}
          </li>
        ))}
      </ul>
    </div>
  );
} 