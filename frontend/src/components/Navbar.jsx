// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar(){
  return (
    <nav className="backdrop-blur-md bg-white/5 border-b border-white/5 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 flex items-center justify-center text-black font-bold">SP</div>
          <span className="font-semibold">ShadowPass Guardian</span>
        </Link>
        <div className="text-sm opacity-80">Built for Security Enthusiasts © {new Date().getFullYear()}</div>
      </div>
    </nav>
  );
}
