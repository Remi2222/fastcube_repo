import React from 'react';
import SolutionsDisplay from '../components/SolutionsDisplay';

const SolutionsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
      {}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 text-emerald-700 dark:text-emerald-300 rounded-2xl text-sm font-bold shadow-2xl border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm mb-10">
              🚀 Solutions Technologiques
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              Nos Solutions Innovantes
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto font-medium">
              Découvrez notre gamme complète de solutions technologiques conçues pour transformer votre entreprise
            </p>
          </div>
        </div>
      </section>

      {}
      <section className="py-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/8 to-teal-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/8 to-blue-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <SolutionsDisplay />
        </div>
      </section>
    </div>
  );
};

export default SolutionsPage;
