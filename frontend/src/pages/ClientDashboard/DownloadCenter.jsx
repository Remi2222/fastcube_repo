import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";

export default function DownloadCenter() {
  const [docs, setDocs] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/documents/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setDocs);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="font-bold text-xl mb-2">Centre de Téléchargement</h2>
      <ul>
        {docs.length === 0 && <li className="text-gray-500">Aucun document.</li>}
        {docs.map(d => (
          <li key={d.id}>
            <a href={d.url} download className="text-secondary underline">{d.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
} 