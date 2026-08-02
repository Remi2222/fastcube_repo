import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaExternalLinkAlt } from 'react-icons/fa';

export default function ServicesCard({ title, desc, icon, color = "from-primary-500 to-secondary-500", features = [] }) {
  return (
    <div className="group relative">
      <div className="card h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="card-body">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${color} rounded-2xl mb-6 text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {desc}
          </p>

          {/* Features List */}
          {features.length > 0 && (
            <ul className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <li key={`service-${index}-${feature.slice(0, 10)}`} className="flex items-center text-sm text-gray-600">
                  <div className="w-2 h-2 bg-primary-500 rounded-full mr-3 flex-shrink-0"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          {/* CTA Button */}
          <div className="mt-auto">
            <Link 
              to="/services" 
              className="inline-flex items-center px-3 py-2 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-medium rounded-lg transition-all duration-200 text-sm group"
            >
              En savoir plus
              <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>

      {/* Decorative Element */}
      <div className={`absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br ${color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100`}></div>
    </div>
  );
} 