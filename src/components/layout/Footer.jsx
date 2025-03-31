import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sección de Información */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-blue-600 pb-2">
              Sobre Nosotros
            </h3>
            <p className="text-gray-300 mb-6">
              Somos el equipo de trabajo de Neurociencias de la Universidad de
              Ciencias Médicas "Carlos J. Finlay" y el Hospital Provincial
              Manuel Ascunce Domenech de conjunto con la Facultad de Informática
              y Ciencias Exactas de la Universidad de Camagüey "Ignacio
              Agramonte y Loynaz".
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-blue-600 pb-2">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink size={16} className="mr-2" /> Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/Revision_casos"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink size={16} className="mr-2" /> Revisión de Casos
                </Link>
              </li>
              <li>
                <Link
                  to="/recursos"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink size={16} className="mr-2" /> Recursos Médicos
                </Link>
              </li>
              <li>
                <Link
                  to="/equipo"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink size={16} className="mr-2" /> Nuestro Equipo
                </Link>
              </li>
              <li>
                <Link
                  to="/contacto"
                  className="text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <ExternalLink size={16} className="mr-2" /> Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección de Contacto */}
          <div>
            <h3 className="text-xl font-bold mb-4 border-b border-blue-600 pb-2">
              Información de Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 mt-1 text-blue-500" />
                <span className="text-gray-300">
                  Carretera Central, Camagüey, Cuba
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-blue-500" />
                <span className="text-gray-300">+53 55555555</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-blue-500" />
                <span className="text-gray-300">ejemplo@minsap.cu</span>
              </li>
              <li className="flex items-center">
                <Clock size={20} className="mr-2 text-blue-500" />
                <span className="text-gray-300">
                  Lunes a Viernes: 8:00 AM - 5:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Universidad de Ciencias Médicas
            "Carlos J. Finlay" & Universidad de Camagüey. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
