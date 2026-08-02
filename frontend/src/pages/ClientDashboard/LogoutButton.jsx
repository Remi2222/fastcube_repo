import { useNavigate } from "react-router-dom";
export default function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <button
      className="bg-red-600 text-white px-4 py-2 rounded-2xl shadow-lg hover:bg-red-700 transition font-semibold mt-6"
      onClick={handleLogout}
    >
      Se déconnecter
    </button>
  );
} 