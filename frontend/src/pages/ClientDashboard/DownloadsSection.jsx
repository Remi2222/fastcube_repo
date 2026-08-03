import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config/api";

export default function DownloadsSection() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/api/client/files`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(() => setFiles([]));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="font-bold text-xl mb-2">Téléchargements</h2>
      <ul>
        {files.length === 0 && <li className="text-gray-500">Aucun fichier disponible.</li>}
        {files.map(f => (
          <li key={f.id}>
            <a href={f.url} download className="text-secondary underline">{f.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
} 