import { useEffect, useState } from "react";

export default function CandidatureList() {
  const [candidatures, setCandidatures] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/candidatures/mine", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setCandidatures);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="font-bold text-xl mb-2">Mes Candidatures</h2>
      <ul>
        {candidatures.length === 0 && <li className="text-gray-500">Aucune candidature.</li>}
        {candidatures.map(c => (
          <li key={c.id} className="mb-2">
            <span className="font-semibold">{c.offreTitle}</span> — 
            <span className="ml-2 text-sm">Statut: <span className="font-bold">{c.status}</span></span>
          </li>
        ))}
      </ul>
    </div>
  );
} 