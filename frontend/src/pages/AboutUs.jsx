import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRocket, FaShieldAlt, FaUsers, FaAward, FaLightbulb, FaHandshake, 
  FaChartLine, FaGlobe, FaHeart, FaStar, FaCheckCircle, FaArrowRight,
  FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt
} from 'react-icons/fa';
import SectionHeader from '../components/SectionHeader';
import { useLanguage } from '../contexts/LanguageContext';


const teamMembers = [
  {
    name: "Ahmed Benali",
    roleKey: "about.team.ceo_role",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    bioKey: "about.team.ceo_bio",
    linkedin: "#",
    email: "ahmed.benali@fastcube.ma"
  },
  {
    name: "Fatima Zahra",
    roleKey: "about.team.cto_role",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=300&q=80",
    bioKey: "about.team.cto_bio",
    linkedin: "#",
    email: "fatima.zahra@fastcube.ma"
  },
  {
    name: "Karim El Mansouri",
    roleKey: "about.team.security_director_role",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
    bioKey: "about.team.security_director_bio",
    linkedin: "#",
    email: "karim.elmansouri@fastcube.ma"
  },
  {
    name: "Amina Tazi",
    roleKey: "about.team.innovation_manager_role",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80",
    bioKey: "about.team.innovation_manager_bio",
    linkedin: "#",
    email: "amina.tazi@fastcube.ma"
  }
];


const values = [
  { 
    icon: <FaHandshake className="w-8 h-8" />, 
    titleKey: "about.values.commitment.title", 
    descKey: "about.values.commitment.description",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50"
  },
  { 
    icon: <FaShieldAlt className="w-8 h-8" />, 
    titleKey: "about.values.security.title", 
    descKey: "about.values.security.description",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50"
  },
  { 
    icon: <FaRocket className="w-8 h-8" />, 
    titleKey: "about.values.innovation.title", 
    descKey: "about.values.innovation.description",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50"
  },
  { 
    icon: <FaHeart className="w-8 h-8" />, 
    titleKey: "about.values.excellence.title", 
    descKey: "about.values.excellence.description",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-50"
  }
];


const timeline = [
  {
    year: "2012",
    titleKey: "about.timeline.2012.title",
    descriptionKey: "about.timeline.2012.description",
    icon: <FaRocket className="w-5 h-5" />
  },
  {
    year: "2014",
    titleKey: "about.timeline.2014.title",
    descriptionKey: "about.timeline.2014.description",
    icon: <FaCheckCircle className="w-5 h-5" />
  },
  {
    year: "2016",
    titleKey: "about.timeline.2016.title",
    descriptionKey: "about.timeline.2016.description",
    icon: <FaShieldAlt className="w-5 h-5" />
  },
  {
    year: "2019",
    titleKey: "about.timeline.2019.title",
    descriptionKey: "about.timeline.2019.description",
    icon: <FaGlobe className="w-5 h-5" />
  },
  {
    year: "2022",
    titleKey: "about.timeline.2022.title",
    descriptionKey: "about.timeline.2022.description",
    icon: <FaLightbulb className="w-5 h-5" />
  },
  {
    year: "2024",
    titleKey: "about.timeline.2024.title",
    descriptionKey: "about.timeline.2024.description",
    icon: <FaAward className="w-5 h-5" />
  }
];


const stats = [
  { number: "12+", labelKey: "about.stats.years_experience", icon: <FaAward className="w-6 h-6" /> },
  { number: "50+", labelKey: "about.stats.certified_experts", icon: <FaUsers className="w-6 h-6" /> },
  { number: "200+", labelKey: "about.stats.satisfied_clients", icon: <FaHeart className="w-6 h-6" /> },
  { number: "24/7", labelKey: "about.stats.soc_support", icon: <FaShieldAlt className="w-6 h-6" /> },
  { number: "500+", labelKey: "about.stats.completed_projects", icon: <FaCheckCircle className="w-6 h-6" /> },
  { number: "15+", labelKey: "about.stats.tech_partners", icon: <FaHandshake className="w-6 h-6" /> }
];


const accreditations = [
  { 
    name: "ISO 27001", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2a/ISO_Logo.png",
    descriptionKey: "about.accreditations.iso27001"
  },
  { 
    name: "Cisco Partner", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Cisco_logo_blue_2016.svg",
    descriptionKey: "about.accreditations.cisco_partner"
  },
  { 
    name: "Microsoft Partner", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    descriptionKey: "about.accreditations.microsoft_partner"
  },
  { 
    name: "Fortinet", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Fortinet_logo.svg",
    descriptionKey: "about.accreditations.fortinet_partner"
  },
  { 
    name: "AWS Partner", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    descriptionKey: "about.accreditations.aws_partner"
  },
  { 
    name: "Google Cloud", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
    descriptionKey: "about.accreditations.google_cloud_partner"
  }
];

export default function AboutUs() {
  const { lang, getTranslation } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {}
      <section className="relative py-32 lg:py-40 overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-bold shadow-2xl border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm mb-10">
              <FaStar className="w-5 h-5 mr-3 animate-pulse" />
              {getTranslation(lang, 'aboutUs') || 'À propos'}
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              {getTranslation('about.hero.title')} 
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                {' '}{getTranslation('about.hero.digital_transformation')}
              </span>
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12 max-w-4xl mx-auto font-medium">
              {getTranslation('about.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border-0 group">
                {getTranslation('about.hero.contact_us')}
                <FaArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link to="/services" className="inline-flex items-center justify-center px-10 py-5 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl">
                {getTranslation('about.hero.our_services')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-purple-400/8 to-pink-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {}
            <div className="space-y-10">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-teal-900/40 text-green-700 dark:text-green-300 rounded-2xl text-sm font-bold shadow-2xl border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm">
                <FaRocket className="w-5 h-5 mr-3 animate-bounce-gentle" />
                {getTranslation('about.mission.title')}
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                {getTranslation('about.mission.heading')}
              </h2>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {getTranslation('about.mission.description')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-6 bg-white/70 dark:bg-gray-700/70 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FaCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">{getTranslation('about.mission.custom_solutions')}</span>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white/70 dark:bg-gray-700/70 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FaCheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">{getTranslation('about.mission.support_24_7')}</span>
                </div>
              </div>
            </div>

            {}
            <div className="space-y-10">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-rose-900/40 text-purple-700 dark:text-purple-300 rounded-2xl text-sm font-bold shadow-2xl border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm">
                <FaLightbulb className="w-5 h-5 mr-3 animate-pulse" />
                {getTranslation('about.vision.title')}
              </div>
              <h2 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white leading-tight">
                {getTranslation('about.vision.heading')}
              </h2>
              <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {getTranslation('about.vision.description')}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 p-6 bg-white/70 dark:bg-gray-700/70 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FaGlobe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">{getTranslation('about.vision.african_leader')}</span>
                </div>
                <div className="flex items-center space-x-4 p-6 bg-white/70 dark:bg-gray-700/70 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-500 hover:scale-105 group shadow-lg hover:shadow-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <FaChartLine className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">{getTranslation('about.vision.continuous_innovation')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50/40 to-indigo-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-green-400/8 to-emerald-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/8 to-blue-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-red-100 via-pink-100 to-rose-100 dark:from-red-900/40 dark:via-pink-900/40 dark:to-rose-900/40 text-red-700 dark:text-red-300 rounded-2xl text-sm font-bold shadow-2xl border border-red-200/50 dark:border-red-700/50 backdrop-blur-sm mb-10">
              <FaHeart className="w-5 h-5 mr-3 animate-pulse" />
              {getTranslation('about.values.title')}
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              {getTranslation('about.values.heading')}
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              {getTranslation('about.values.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((value, index) => (
              <div key={`value-${index}`} className="group">
                <div className={`${value.bgColor} dark:bg-gray-700/60 rounded-3xl p-10 text-center hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:scale-105 border border-gray-100/50 dark:border-gray-600/50 backdrop-blur-2xl`}>
                  <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-125 transition-transform duration-500 shadow-2xl`}>
                    <div className="text-white group-hover:scale-110 transition-transform duration-500">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 leading-tight">{getTranslation(value.titleKey)}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium">{getTranslation(value.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-100 via-amber-100 to-yellow-100 dark:from-orange-900/40 dark:via-amber-900/40 dark:to-yellow-900/40 text-orange-700 dark:text-orange-300 rounded-2xl text-sm font-bold shadow-2xl border border-orange-200/50 dark:border-orange-700/50 backdrop-blur-sm mb-10">
              <FaChartLine className="w-5 h-5 mr-3 animate-pulse" />
              {getTranslation('about.timeline.title')}
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              {getTranslation('about.timeline.heading')}
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              {getTranslation('about.timeline.description')}
            </p>
          </div>

          <div className="relative">
            {}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
            
            <div className="space-y-16">
              {timeline.map((item, index) => (
                <div key={`timeline-${item.year}`} className={`relative flex items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  {}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white border-4 border-blue-500 rounded-full flex items-center justify-center z-10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <div className="text-blue-500">
                      {item.icon}
                    </div>
                  </div>
                  
                  {}
                  <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-16' : 'lg:pl-16'}`}>
                    <div className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-500 hover:scale-105">
                      <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-2xl text-sm font-bold mb-6 shadow-lg">
                        {item.year}
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{getTranslation(item.titleKey)}</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg font-medium">{getTranslation(item.descriptionKey)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-white/20 opacity-40"></div>
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-10 leading-tight">
              {getTranslation('about.stats.heading')}
            </h2>
            <p className="text-2xl text-blue-100 max-w-4xl mx-auto font-medium leading-relaxed">
              {getTranslation('about.stats.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-12">
            {stats.map((stat, index) => (
              <div key={`stat-${index}`} className="text-center group">
                <div className="w-24 h-24 bg-white/30 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:bg-white/50 group-hover:scale-110 transition-all duration-500 border border-white/30 shadow-2xl hover:shadow-3xl">
                  <div className="text-white group-hover:scale-110 transition-transform duration-500">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-6xl lg:text-7xl font-black text-white mb-6 group-hover:scale-110 transition-transform duration-500">{stat.number}</div>
                <div className="text-blue-100 font-bold text-xl">{getTranslation(stat.labelKey)}</div>
              </div>
          ))}
        </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-green-400/8 to-emerald-400/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/8 to-indigo-400/8 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-teal-900/40 text-green-700 dark:text-green-300 rounded-2xl text-sm font-bold shadow-2xl border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm mb-10">
              <FaUsers className="w-5 h-5 mr-3 animate-pulse" />
              {getTranslation('about.team.title')}
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              {getTranslation('about.team.heading')}
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              {getTranslation('about.team.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {teamMembers.map((member, index) => (
              <div key={`member-${member.name}`} className="group">
                <div className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-100/50 dark:border-gray-600/50 overflow-hidden hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:scale-105">
                  <div className="relative overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  <div className="p-8">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-tight">{member.name}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-4">{getTranslation(member.roleKey)}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6 font-medium">{getTranslation(member.bioKey)}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        <a href={member.linkedin} className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                          <FaLinkedin className="w-5 h-5" />
                        </a>
                        <a href={`mailto:${member.email}`} className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-200 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                          <FaEnvelope className="w-5 h-5" />
                        </a>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{member.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-gradient-to-br from-gray-50 via-blue-50/40 to-indigo-50/40 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-100 via-pink-100 to-rose-100 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-rose-900/40 text-purple-700 dark:text-purple-300 rounded-2xl text-sm font-bold shadow-2xl border border-purple-200/50 dark:border-purple-700/50 backdrop-blur-sm mb-10">
              <FaAward className="w-5 h-5 mr-3 animate-pulse" />
              {getTranslation('about.accreditations.title')}
            </div>
            <h2 className="text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-10 leading-tight">
              {getTranslation('about.accreditations.heading')}
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              {getTranslation('about.accreditations.description')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {accreditations.map((accreditation, index) => (
              <div key={`accreditation-${accreditation.name}`} className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-gray-100/50 dark:border-gray-600/50 hover:shadow-3xl transition-all duration-700 hover:-translate-y-4 hover:scale-105 text-center group">
                <div className="w-24 h-24 mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <img
                    src={accreditation.logo}
                    alt={accreditation.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{accreditation.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-base font-medium">{getTranslation(accreditation.descriptionKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-white/20 opacity-50"></div>
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-white/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h2 className="text-5xl lg:text-6xl font-black mb-10 leading-tight">
              {getTranslation('about.cta.heading')}
            </h2>
            <p className="text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              {getTranslation('about.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link to="/contact" className="inline-flex items-center justify-center px-12 py-6 bg-white text-gray-900 hover:bg-gray-100 group font-black text-xl rounded-3xl shadow-3xl hover:shadow-4xl transition-all duration-500 transform hover:scale-105">
                {getTranslation('about.hero.contact_us')}
                <FaArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
              <Link to="/services" className="inline-flex items-center justify-center px-12 py-6 bg-transparent text-white hover:bg-white/20 group font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105 border-2 border-white/60 hover:border-white backdrop-blur-sm">
                {getTranslation('about.hero.our_services')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 