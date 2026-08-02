import { useEffect, useState } from "react";
import { FaPhone, FaMapMarkerAlt, FaGlobe, FaCalendarAlt } from "react-icons/fa";

export default function ProfileOverview() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <div className="mb-8">Chargement...</div>;
  if (!user) return <div className="mb-8 text-red-600">Impossible de charger le profil.</div>;

  return (
    <div className="bg-secondary/10 rounded-2xl p-6 shadow-lg mb-8">
      {}
      <div className="flex items-center gap-6 mb-6">
        <img 
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email)}&background=3B82F6&color=fff&size=80`} 
          alt="Avatar" 
          className="w-20 h-20 rounded-full border-4 border-white shadow-lg" 
        />
        <div>
          <div className="font-bold text-xl text-primary mb-1">{`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email}</div>
          <div className="text-gray-700 mb-1">{user.email}</div>
          <div className="text-gray-500 text-sm flex items-center gap-1">
            <FaCalendarAlt className="w-3 h-3" />
            Membre depuis {user.created_at?.slice(0,10)}
          </div>
        </div>
      </div>

      {}
      <div className="grid md:grid-cols-2 gap-4">
        {user.phone && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <FaPhone className="text-blue-600 w-4 h-4" />
            <div>
              <div className="text-sm text-gray-500">Téléphone</div>
              <div className="font-medium">{user.phone}</div>
            </div>
          </div>
        )}
        
        {user.address && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <FaMapMarkerAlt className="text-blue-600 w-4 h-4" />
            <div>
              <div className="text-sm text-gray-500">Adresse</div>
              <div className="font-medium">{user.address}</div>
            </div>
          </div>
        )}
        
        {user.city && user.country && (
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
            <FaGlobe className="text-blue-600 w-4 h-4" />
            <div>
              <div className="text-sm text-gray-500">Localisation</div>
              <div className="font-medium">{user.city}, {user.country}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 