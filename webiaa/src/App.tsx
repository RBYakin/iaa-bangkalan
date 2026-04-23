/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation
} from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Newspaper, 
  Award, 
  ChevronRight, 
  ChevronDown,
  Menu, 
  X,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  UserCircle,
  Database,
  Save,
  Github,
  Instagram,
  Mail,
  MessageCircle,
  Globe,
  ClipboardCheck,
  Share2,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  LogOut,
  LogIn,
  Loader2
} from "lucide-react";
import { 
  AuthProvider, 
  useAuth, 
  loginWithGoogle, 
  loginWithEmail,
  logout, 
  useFirestoreCollection, 
  db, 
  handleFirestoreError 
} from "./lib/firebase";
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc, getDocs } from "firebase/firestore";

// --- Utilities ---
const getImageUrl = (url: string) => {
  if (!url || typeof url !== 'string') return "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&h=600&fit=crop";
  
  // Deteksi Google Drive Link
  // Pola regex yang lebih luas untuk menangkap ID dari berbagai format URL Google Drive
  const driveMatch = url.match(/(?:\/d\/|id=|\/file\/d\/)([\w-]{25,})/);
  
  if (driveMatch && driveMatch[1]) {
    const id = driveMatch[1];
    // Gunakan thumbnail API Google Drive. sz=w1000 meminta lebar 1000px.
    // Tambahkan referrerPolicy="no-referrer" pada tag <img> saat memanggil ini.
    return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
  }
  
  return url;
};

// Helper to scroll to top or hash on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  }, [pathname, hash]);
  return null;
};

const SantriSlideshow = () => {
  const images = [
    "https://drive.google.com/file/d/1iEmM87ersNezzb9QOr-MBkCCEjdeOG79/view?usp=drive_link",
    "hhttps://drive.google.com/file/d/1SvEcTWupGuagb9mMQ-YZ3SV0o8pthXj5/view?usp=drive_link",
    "https://drive.google.com/file/d/1v5Wla9gNZkYD7fRPuFsaS8cJyAUXAjoV/view?usp=sharing",
    "https://drive.google.com/file/d/1vBaCqnBkUECayVv13l3SewAB_QRVdLc9/view?usp=drive_link"
  ];
  
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full rounded-[50px] overflow-hidden bg-slate-100">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={getImageUrl(images[index])}
          alt="Santri Berprestasi"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="w-full h-full object-cover aspect-[4/5]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&h=600&fit=crop";
          }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent pointer-events-none" />
    </div>
  );
};

const Modal = ({ isOpen, onClose, image, caption }: { isOpen: boolean, onClose: () => void, image: string, caption?: string }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-5xl w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors bg-white/10 p-2 rounded-full backdrop-blur-md"
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={getImageUrl(image)} 
            alt="Preview" 
            className="w-full h-auto max-h-[80vh] object-contain rounded-3xl"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&h=600&fit=crop";
            }}
          />
          {caption && (
            <div className="mt-6 text-center">
              <p className="text-white text-xl font-bold font-display">{caption}</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const DocumentationCard = ({ image, caption, onClick }: any) => (
  <motion.div 
    whileHover={{ y: -8 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-slate-100 group cursor-pointer p-3"
  >
    <div className="relative aspect-video rounded-[24px] overflow-hidden">
      <img 
        src={getImageUrl(image)} 
        alt={caption} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&h=600&fit=crop";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
        <p className="text-white font-bold text-lg leading-tight group-hover:text-emerald-300 transition-colors font-display">
          {caption}
        </p>
      </div>
    </div>
  </motion.div>
);

const EventItem = ({ title, date, location, time }: { title: string, date: string, location: string, time: string }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100 group">
    <div className="flex-shrink-0 w-16 h-16 bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center shadow-sm">
      <span className="text-emerald-600 font-black text-xl leading-none">
        {date.split(' ')[0]}
      </span>
      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
        {date.split(' ')[1]}
      </span>
    </div>
    <div className="flex-1 space-y-1">
      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{title}</h4>
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {location}</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {time}</span>
      </div>
    </div>
    <button className="self-center p-2 rounded-full border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200">
      <ExternalLink className="w-4 h-4" />
    </button>
  </div>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Tutup menu saat navigasi terjadi
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 sm:gap-3 active:scale-95 transition-transform">
          <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden">
            <img 
              src="/image/logo_iaa.png" 
              alt="Logo IAA Bangkalan" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="max-w-[150px] sm:max-w-none">
            <h1 className="font-black text-sm sm:text-xl tracking-tight text-slate-900 leading-none font-display">IAA Cabang Bangkalan</h1>
            <p className="hidden sm:block text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-1">Ikatan Alumni Annuqayah Cabang Bangkalan</p>
            <p className="sm:hidden text-[8px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-1">Bangkalan</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
          <Link to="/program-kerja" className="hover:text-emerald-600 transition-colors">Program Kerja</Link>
          <Link to="/struktur-pengurus" className="hover:text-emerald-600 transition-colors">Struktur Pengurus</Link>
          <Link to="/karya" className="hover:text-emerald-600 transition-colors">Karya</Link>
          <Link to="/tentang" className="hover:text-emerald-600 transition-colors">Tentang</Link>
          {user && isAdmin && (
            <Link to="/admin" className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl font-bold hover:bg-emerald-100 transition-colors flex items-center gap-2">
              <Award className="w-4 h-4" /> Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://www.instagram.com/iaa_bangkalan?igsh=MWliYjZ6cHNxYmFlcw==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95"
          >
            Hubungi Kami
          </a>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-100 rounded-full md:hidden transition-colors"
          >
            {isOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-6 font-bold text-lg text-slate-700">
              <Link to="/" className="hover:text-emerald-600 transition-colors flex items-center justify-between group">
                Beranda <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <Link to="/program-kerja" className="hover:text-emerald-600 transition-colors flex items-center justify-between group">
                Program Kerja <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <Link to="/struktur-pengurus" className="hover:text-emerald-600 transition-colors flex items-center justify-between group">
                Struktur Pengurus <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <Link to="/karya" className="hover:text-emerald-600 transition-colors flex items-center justify-between group">
                Karya <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              <Link to="/tentang" className="hover:text-emerald-600 transition-colors flex items-center justify-between group">
                Tentang <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
              {user && isAdmin && (
                <Link to="/admin" className="text-emerald-600 font-black border-2 border-emerald-100 p-6 rounded-3xl flex items-center justify-between group bg-emerald-50/50">
                  Dashboard Admin <Award className="w-6 h-6" />
                </Link>
              )}
              <a 
                href="https://www.instagram.com/iaa_bangkalan?igsh=MWliYjZ6cHNxYmFlcw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-emerald-700 text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
              >
                Hubungi Kami
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-20">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
            <img 
              src="/image/logo_iaa.png" 
              alt="Logo IAA Bangkalan" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="font-black text-xl tracking-tight text-white leading-none font-display">IAA Bangkalan</h1>
        </div>
        <p className="text-sm leading-relaxed">
          Ikatan Alumni Annuqayah Cabang Bangkalan berkomitmen untuk mendampingi masa depan santri melalui pendidikan, dakwah, dan pengabdian masyarakat.
        </p>
      </div>

      <div className="space-y-6">
        <h4 className="text-white font-bold">Navigasi</h4>
        <ul className="space-y-3 text-sm">
          <li><Link to="/" className="hover:text-emerald-500 transition-colors">Beranda</Link></li>
          <li><Link to="/program-kerja" className="hover:text-emerald-500 transition-colors">Program Kerja</Link></li>
          <li><Link to="/struktur-pengurus" className="hover:text-emerald-500 transition-colors">Struktur Pengurus</Link></li>
          <li><Link to="/karya" className="hover:text-emerald-500 transition-colors">Karya Anggota</Link></li>
          <li><Link to="/tentang" className="hover:text-emerald-500 transition-colors">Tentang IAA</Link></li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="text-white font-bold">Layanan & Info</h4>
        <ul className="space-y-3 text-sm">
          <li><Link to="/prestasi" className="hover:text-emerald-500 transition-colors">IAA Berprestasi</Link></li>
          <li><Link to="/dokumentasi" className="hover:text-emerald-500 transition-colors">Dokumentasi</Link></li>
          <li><Link to="/faq" className="hover:text-emerald-500 transition-colors">FAQ Registrasi</Link></li>
          <li><Link to="/developer" className="hover:text-emerald-500 transition-colors">Info Developer</Link></li>
          <li className="pt-4 border-t border-slate-800 mt-4">
            <Link to="/login" className="flex items-center gap-2 hover:text-emerald-500 transition-colors group">
              <LogIn className="w-4 h-4" /> 
              <span>Login Admin</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="space-y-6">
        <h4 className="text-white font-bold">Media Sosial</h4>
        <div className="flex gap-4">
          <a href="https://www.instagram.com/iaa_bangkalan?igsh=MWliYjZ6cHNxYmFlcw==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer group">
            <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          </a>
          <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer group relative">
            <Globe className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Coming Soon</span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase font-bold tracking-widest">Sekretariat Cabang</p>
          <p className="text-sm">Jl. Raya Telang, Kamal, Kabupaten Bangkalan, Madura, Jawa Timur.</p>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-6 mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest">
      <p>© {new Date().getFullYear()} RBDev.</p>
      <p>Hak Cipta Dilindungi</p>
    </div>
  </footer>
);

const documentationData = [
  {
    caption: "Pelantikan Pengurus Baru IAA Cabang Bangkalan Periode 2026/2027",
    image: "https://drive.google.com/file/d/1vBaCqnBkUECayVv13l3SewAB_QRVdLc9/view?usp=drive_link"
  },
  {
    caption: "Rapat Kerja : Menyusun langkah pengabdian terhadap Organisasi",
    image: "https://drive.google.com/file/d/1v5Wla9gNZkYD7fRPuFsaS8cJyAUXAjoV/view?usp=sharing"
  },
  {
    caption: "Musyawarah Cabang Akhir kepengurusan periode 2025/2026",
    image: "https://drive.google.com/file/d/1uwkFcFyd8UKMgU3-HtkPUG8IIWMQgaOW/view?usp=drivesdk"
  }
];

const Home = () => {
  const { data: dbDocs } = useFirestoreCollection('documentation');
  const displayDocs = dbDocs.length > 0 ? dbDocs : documentationData;

  const eventsData = [
    { title: "Kajian Rutin Kitab Kuning", date: "24 MEI", location: "Masjid Raya", time: "19:30 WIB" },
    { title: "Diklat Kepemimpinan Santri", date: "02 JUN", location: "Aula Pusat", time: "08:00 WIB" },
    { title: "Gebyar Seni Santri Nasional", date: "15 JUN", location: "Gedung Serbaguna", time: "13:00 WIB" }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -z-10 rounded-l-[100px]" />
        
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Ikatan Alumni Annuqayah Cabang Bangkalan
              </span>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] font-display">
                <span className="text-emerald-600 underline decoration-slate-200 underline-offset-8">IAA</span> <br className="hidden lg:block"/> Cabang Bangkalan.
              </h2>
              <p className="text-lg text-slate-500 mt-6 leading-relaxed max-w-lg">
                Merupakan organisasi ekstra kampus yang beranggotakan alumni 
                Pondok Pesantren Annuqayah yang berdomisili di daerah Kabupaten Bangkalan. Ikatan Alumni Annuqayah (IAA) Cabang Bangakalan 
                berdiri sejak tahun 2011 dan merupakan bagian dari organisasi nasional Ikatan Alumni Annuqayah (IAA).
                Ikatan Alumni Annuqayah (IAA) diharapkan dapat menjadi pengingat untuk terus melestarikan budaya kesantrian dan menjunjung tinggi akhlaqul karimah bagi setiap alumninya. 
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/tentang" className="bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-2xl hover:shadow-emerald-200 transition-all group active:scale-95 text-center justify-center">
                Selengkapnya <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/tentang#visi-misi" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 text-center justify-center">
                Visi & Misi
              </Link>
            </motion.div>

            <div className="flex items-center gap-8 pt-8">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 leading-none">22</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">Pengurus Aktif</span>
              </div>
              <div className="w-px h-10 bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-3xl font-black text-slate-900 leading-none">100+</span>
                <span className="text-xs font-bold text-slate-400 uppercase mt-1">Anggota Alumni</span>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1 }}
            className="flex-1 relative"
          >
            <div className="relative rounded-[60px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(5,150,105,0.15)] bg-white p-4">
              <SantriSlideshow />
            </div>
            
            {/* Shapes */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-600 rounded-full blur-3xl -z-10 opacity-30" />
          </motion.div>
        </div>
      </section>

      {/* Stats Features */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <Link to="/karya" className="flex items-start gap-5 group cursor-pointer hover:bg-emerald-50/50 p-4 -m-4 rounded-2xl transition-colors">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
              <BookOpen className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">Karya</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">Ketuk unutuk melihat Karya selembaran anggota IAA Cabang Bangkalan.</p>
            </div>
          </Link>
          <Link to="/struktur-pengurus" className="flex items-start gap-5 group cursor-pointer hover:bg-emerald-50/50 p-4 -m-4 rounded-2xl transition-colors">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
              <Users className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">Struktur Pengurus Cabang</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">Ketuk untuk melihat struktur organisasi IAA Cabang Bangkalan.</p>
            </div>
          </Link>
          <Link to="/prestasi" className="flex items-start gap-5 group cursor-pointer hover:bg-emerald-50/50 p-4 -m-4 rounded-2xl transition-colors">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
              <Award className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">IAA Berprestasi</h3>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">Ketuk untuk melihat daftar prestasi santri alumni Annuqayah.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* Berita Area */}
          <div id="berita" className="flex-[2] space-y-12">
            <div className="flex items-end justify-between border-b border-slate-200 pb-6">
              <div className="space-y-1">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 font-display">
                  <Newspaper className="w-8 h-8 text-emerald-600" />
                  Dokumentasi Kegiatan
                </h2>
                <p className="text-slate-400 font-medium">Jejak kegiatan dan pengabdian alumni santri</p>
              </div>
              <Link to="/dokumentasi" className="text-emerald-700 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayDocs.slice(0, 3).map((doc, idx) => (
                <div key={idx} className={idx === 0 ? "md:col-span-2" : ""}>
                  <DocumentationCard {...doc} onClick={() => {}} />
                </div>
              ))}
            </div>
          </div>

          {/* Acara Area (Sidebar feel on desktop) */}
          <div id="pengurus-sidebar" className="flex-1 space-y-10">
            <div className="bg-emerald-900 rounded-[40px] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-black">Struktur Pengurus</h3>
                  <p className="text-emerald-200 text-sm mt-2 leading-relaxed">
                    Mengenal lebih dekat para pengurus yang berdedikasi dalam menjalankan roda organisasi IAA Cabang Bangkalan.
                  </p>
                </div>
                
                <Link to="/struktur-pengurus" className="w-full bg-white text-emerald-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors shadow-lg active:scale-95">
                  Lihat Struktur Organisasi <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-24 translate-x-32 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 translate-y-10" />
            </div>

            {/* Support / Quick Links */}
            <div className="bg-slate-100 rounded-[40px] p-8 space-y-6">
              <h4 className="font-bold text-slate-900 text-lg">Butuh Bantuan?</h4>
              <div className="space-y-4">
                <Link to="/developer" className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-md transition-shadow group cursor-pointer">
                  <span className="font-bold text-slate-700 group-hover:text-emerald-700">Pusat Informasi Dev</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
                <Link to="/faq" className="flex items-center justify-between p-4 bg-white rounded-2xl hover:shadow-md transition-shadow group">
                  <span className="font-bold text-slate-700 group-hover:text-emerald-700">FAQ Registrasi</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="container mx-auto px-6 pb-24">
        <motion.div 
          whileInView={{ scale: [0.95, 1], opacity: [0, 1] }}
          viewport={{ once: true }}
          className="bg-emerald-700 rounded-[60px] p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight font-display">Melanjutkan jejak Pengabdian Menyatukan langkah Alumni</h2>
            <p className="text-emerald-100 text-lg italic">"Berjuang tak harus Menang"</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://www.instagram.com/iaa_bangkalan?igsh=MWliYjZ6cHNxYmFlcw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white text-emerald-900 px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform active:scale-95 text-center"
              >
                Daftar IAA
              </a>
            </div>
          </div>
          
          {/* Decorative */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full translate-x-32 translate-y-32 blur-3xl" />
        </motion.div>
      </section>
    </>
  );
};

const MemberCard = ({ member, index }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="group"
  >
    <div className="relative rounded-[40px] overflow-hidden bg-white shadow-xl border border-slate-100 p-3 aspect-[3/4.5]">
      <div className="h-full rounded-[30px] overflow-hidden relative">
        <img 
          src={getImageUrl(member.image)} 
          alt={member.name} 
          className="w-full h-full object-cover grayscale transition-all duration-700 scale-100 group-hover:scale-110 group-hover:grayscale-0"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&h=600&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <h4 className="font-bold text-lg leading-tight font-display">{member.name}</h4>
          <div className="h-0.5 w-8 bg-emerald-400 my-2 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest">{member.title}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const StrukturPengurus = () => {
  const { data: dbOfficers, loading } = useFirestoreCollection('officers');

  const harianStatic = [
    { name: "Moh. Nujai Miyul Munawwir", title: "Ketua Umum", image: "https://picsum.photos/seed/chairman/400/600", division: "Badan Pengurus Harian" },
    { name: "Mohammad Waqidi", title: "Wakil Ketua Umum", image: "https://picsum.photos/seed/deputy/400/600", division: "Badan Pengurus Harian" },
    { name: "Ayunda Ratna Sari", title: "Sekretaris Umum", image: "https://picsum.photos/seed/sec/400/600", division: "Badan Pengurus Harian" },
    { name: "Ismi Lailatin", title: "Wakil Sekretaris Umum", image: "https://picsum.photos/seed/vsec/400/600", division: "Badan Pengurus Harian" },
    { name: "Fitriani", title: "Bendahara", image: "https://picsum.photos/seed/treas/400/600", division: "Badan Pengurus Harian" },
  ];

  const divisiStatic = [
    {
      title: "Divisi Kaderisasi",
      members: [
        { name: "Kamaliyyatul Baroroh", title: "Koordinator", image: "https://picsum.photos/seed/kader1/400/600" },
        { name: "Syifa Bilbina Khozaimi", title: "Anggota", image: "https://picsum.photos/seed/kader2/400/600" },
        { name: "Syafika Aqsha Iradati", title: "Anggota", image: "https://picsum.photos/seed/kader3/400/600" },
        { name: "Ahmad Riyadi", title: "Anggota", image: "https://picsum.photos/seed/kader4/400/600" },
        { name: "Nihayatus Saadah", title: "Anggota", image: "https://picsum.photos/seed/kader5/400/600" },
      ]
    },
    {
      title: "Divisi Pendidikan",
      members: [
        { name: "Lailatul Munawwaroh", title: "Koordinator", image: "https://picsum.photos/seed/pend1/400/600" },
        { name: "R.B. Ainul Yakin", title: "Anggota", image: "https://picsum.photos/seed/pend2/400/600" },
        { name: "Shofiatul Mahmudah", title: "Anggota", image: "https://picsum.photos/seed/pend3/400/600" },
        { name: "Khoirul Anami", title: "Anggota", image: "https://picsum.photos/seed/pend4/400/600" },
        { name: "Barotut Taqiyah", title: "Anggota", image: "https://picsum.photos/seed/pend5/400/600" },
      ]
    },
    {
      title: "Divisi Infokom",
      members: [
        { name: "Feri Luthfi Aji", title: "Koordinator", image: "https://picsum.photos/seed/info1/400/600" },
        { name: "Elly Andriani", title: "Anggota", image: "https://picsum.photos/seed/info2/400/600" },
        { name: "Alfiana Idlatus Syahril Ilah", title: "Anggota", image: "https://picsum.photos/seed/info3/400/600" },
        { name: "Zainul Firdaus Al-Hasany", title: "Anggota", image: "https://picsum.photos/seed/info4/400/600" },
      ]
    },
    {
      title: "Divisi Kewirausahaan",
      members: [
        { name: "Romzah", title: "Koordinator", image: "https://picsum.photos/seed/wira1/400/600" },
        { name: "Moh Nabil Al-farisi", title: "Anggota", image: "https://picsum.photos/seed/wira2/400/600" },
        { name: "Unsiatul Hasanah", title: "Anggota", image: "https://picsum.photos/seed/wira3/400/600" },
        { name: "Fandy Ahmad Priabudi", title: "Anggota", image: "https://picsum.photos/seed/wira4/400/600" },
      ]
    }
  ];

  const displayData = dbOfficers.length > 0 
    ? [
        { title: "Badan Pengurus Harian", members: dbOfficers.filter(m => m.division === "Badan Pengurus Harian").sort((a, b) => (a.rank || 0) - (b.rank || 0)) },
        { title: "Divisi Kaderisasi", members: dbOfficers.filter(m => m.division === "Divisi Kaderisasi").sort((a, b) => (a.rank || 0) - (b.rank || 0)) },
        { title: "Divisi Pendidikan", members: dbOfficers.filter(m => m.division === "Divisi Pendidikan").sort((a, b) => (a.rank || 0) - (b.rank || 0)) },
        { title: "Divisi Infokom", members: dbOfficers.filter(m => m.division === "Divisi Infokom").sort((a, b) => (a.rank || 0) - (b.rank || 0)) },
        { title: "Divisi Kewirausahaan", members: dbOfficers.filter(m => m.division === "Divisi Kewirausahaan").sort((a, b) => (a.rank || 0) - (b.rank || 0)) },
      ].filter(d => d.members.length > 0)
    : [
        { title: "Badan Pengurus Harian", members: harianStatic },
        ...divisiStatic
      ];

  return (
    <section className="container mx-auto px-6 py-24 min-h-screen">
      <div className="text-center space-y-4 mb-20">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display">Struktur Pengurus Cabang</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Sinergi alumni dalam mengabdi dan meneruskan estafet perjuangan Annuqayah di Bangkalan.</p>
      </div>

      {displayData.map((d, dIdx) => (
        <div key={dIdx} className="mb-24">
          <div className="flex items-center gap-4 mb-16">
            <div className={`h-px flex-1 ${dIdx === 0 ? 'bg-emerald-200' : 'bg-slate-200'}`} />
            <h3 className={`text-xl md:text-2xl font-black text-slate-900 uppercase tracking-[0.1em] px-4 font-display ${dIdx === 0 ? 'tracking-[0.2em]' : ''}`}>
              {d.title}
            </h3>
            <div className={`h-px flex-1 ${dIdx === 0 ? 'bg-emerald-200' : 'bg-slate-200'}`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {d.members.map((p, idx) => (
              <MemberCard key={idx} member={p} index={idx + dIdx * 5} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

const Karya = () => {
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const { data: dbWorks } = useFirestoreCollection('works');

  const karyaStatic = [
    { title: "Karya Selembaran 01", image: "https://picsum.photos/seed/k1/1200/1800" },
    { title: "Karya Selembaran 02", image: "https://picsum.photos/seed/k2/1200/1800" },
    { title: "Karya Selembaran 03", image: "https://picsum.photos/seed/k3/1200/1800" },
    { title: "Karya Selembaran 04", image: "https://picsum.photos/seed/k4/1200/1800" },
    { title: "Karya Selembaran 05", image: "https://picsum.photos/seed/k5/1200/1800" },
    { title: "Karya Selembaran 06", image: "https://picsum.photos/seed/k6/1200/1800" },
  ];

  const displayData = dbWorks.length > 0 ? dbWorks : karyaStatic;

  return (
    <section className="container mx-auto px-6 py-24 min-h-screen">
      <div className="text-center space-y-4 mb-24">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display">Karya Selembaran</h2>
        <p className="text-slate-500 max-w-2xl mx-auto italic font-medium">"Kumpulan publikasi kreatif Selembaran dari Pengurus dan Anggota IAA Cabang Bangkalan."</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {displayData.map((k, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedImage(k)}
            className="group relative cursor-pointer"
          >
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl bg-white border border-slate-100 p-4 transition-all duration-500 group-hover:shadow-emerald-200/50 group-hover:border-emerald-100 group-hover:-translate-y-2">
              <div className="relative rounded-[30px] overflow-hidden aspect-[3/4.5]">
                <img 
                  src={getImageUrl(k.image)} 
                  alt={k.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&h=600&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-emerald-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30 transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="mt-6 px-2 text-center pb-2">
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors font-display tracking-tight">{k.title}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        image={selectedImage?.image} 
        caption={selectedImage?.title}
      />
    </section>
  );
};

const Dokumentasi = () => {
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const { data: dbDocs } = useFirestoreCollection('documentation');

  const displayData = dbDocs.length > 0 ? dbDocs : documentationData;

  return (
    <section className="container mx-auto px-6 py-24 min-h-screen">
      <div className="text-center space-y-4 mb-20">
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display">Dokumentasi Kegiatan</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Kumpulan momen berharga dalam setiap langkah perjuangan dan pengabdian IAA Cabang Bangkalan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayData.map((doc, idx) => (
          <DocumentationCard 
            key={idx} 
            {...doc} 
            onClick={() => setSelectedDoc(doc)}
          />
        ))}
      </div>

      <Modal 
        isOpen={!!selectedDoc} 
        onClose={() => setSelectedDoc(null)} 
        image={selectedDoc?.image} 
        caption={selectedDoc?.caption}
      />
    </section>
  );
};

const Tentang = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Tentang */}
      <section className="bg-emerald-900 py-24 text-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black font-display mb-6"
            >
              Tentang Kami
            </motion.h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Mengenal lebih dekat Ikatan Alumni Annuqayah Cabang Bangkalan, wadah perjuangan dan pengabdian alumni santri di tanah Madura.
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-24 translate-x-24 blur-3xl" />
      </section>

      {/* Profil Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 space-y-8">
              <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-widest">
                Profil Lengkap
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 font-display">Sejarah & Filosofi IAA Bangkalan</h3>
              <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
                <p>
                   Ikatan Alumni Annuqayah (IAA) Cabang Bangkalan merupakan organisasi ekstra kampus yang beranggotakan alumni Pondok Pesantren Annuqayah yang berdomisili di daerah Kabupaten Bangkalan. Ikatan Alumni Annuqayah (IAA) Cabang Bangakalan berdiri sejak tahun 2011 dan merupakan bagian dari organisasi nasional Ikatan Alumni Annuqayah (IAA). 
                </p>
                <p>
                  Berdirinya Ikatan Alumni Annuqayah (IAA) Cabang Bangkalan pada tahun 2011 dilatarbelakangi dengan kerinduan alumni (mahasiswa) terhadap suasana pondok pesantren yang kental dengan berbagai ajaran islam dan pengasuhan dari masyayikh Pondok Pesantren Annuqayah. Keinginan untuk memiliki ikatan sesama alumni sebagai keluarga yang saling membantu di perantauan juga menjadi alasan berdirinya organisasi ini. Ikatan Alumni Annuqayah (IAA) diharapkan dapat menjadi pengingat untuk terus melestarikan budaya kesantrian dan menjunjung tinggi akhlaqul karimah bagi setiap alumninya.
                </p>
              </div>
            </div>
            
            <div className="flex-1 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-emerald-50 rounded-[60px] p-12 lg:p-20 flex items-center justify-center relative shadow-2xl shadow-emerald-100"
              >
                <img 
                  src="/image/logo_iaa.png" 
                  alt="Logo IAA" 
                  className="w-full max-w-[300px] h-auto object-contain drop-shadow-2xl"
                  referrerPolicy="no-referrer"
                />
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-200/50 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-100 rounded-full blur-2xl" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Misi Section */}
      <section id="visi-misi" className="py-24 bg-slate-50 scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Visi */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-12 rounded-[50px] shadow-xl border border-slate-100"
            >
              <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 font-display mb-6 uppercase tracking-tight">Visi</h3>
              <p className="text-slate-600 text-xl leading-relaxed italic">
                "Terwujudnya alumni Annuqayah yang solid, mandiri, dan kontributif dalam menyebarkan nilai-nilai Islam Moderat dan menjaga norma-norma kepesantrenan di era yang semakin maju."
              </p>
            </motion.div>

            {/* Misi */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-emerald-700 p-12 rounded-[50px] shadow-xl text-white overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black font-display mb-6 uppercase tracking-tight">Misi</h3>
                <ul className="space-y-6">
                  {[
                    "Menjalin silaturahmi yang berkelanjutan antar alumni Annuqayah di Bangkalan.",
                    "Melestarikan nilai-nilai pesantren dan budaya santri dalam kehidupan sosial.",
                    "Pemberdayaan potensi ekonomi, literasi, dan sosiokultural anggota alumni."
                  ].map((m, idx) => (
                    <li key={idx} className="flex gap-4">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-emerald-50">{m}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-24 translate-y-24 blur-3xl font-display" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Prestasi = () => {
  const [selectedPrestasi, setSelectedPrestasi] = useState<any>(null);
  const { data: dbPrestasi } = useFirestoreCollection('achievements');

  const prestasiStatic = [
    { 
      name: "Ahmad Mujtaba", 
      award: "Juara 1 Musabaqah Tilawatil Quran", 
      level: "Tingkat Internasional - Kairo",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop",
      year: "2024"
    },
    { 
      name: "Siti Aminah", 
      award: "Gold Medal Karya Tulis Ilmiah", 
      level: "Tingkat Nasional",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop",
      year: "2023"
    },
    { 
      name: "Zainul Arifin", 
      award: "Juara 2 Pidato Bahasa Arab", 
      level: "Se-Jawa Timur",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=2098&auto=format&fit=crop",
      year: "2024"
    },
    { 
      name: "Lailatul Qodriyah", 
      award: "Juara Harapan 1 Kaligrafi Kontemporer", 
      level: "Piala Gubernur",
      image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop",
      year: "2023"
    }
  ];

  const displayData = dbPrestasi.length > 0 ? dbPrestasi : prestasiStatic;

  return (
    <section className="container mx-auto px-6 py-24 min-h-screen">
      <div className="text-center space-y-4 mb-20">
        <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          Hall of Fame
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display">IAA Berprestasi</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Apresiasi bagi alumni santri yang telah mengharumkan nama Annuqayah di berbagai tingkat kompetisi.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayData.map((p, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedPrestasi(p)}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-[40px] overflow-hidden shadow-xl border border-slate-100 p-4 transition-all duration-500 hover:shadow-emerald-200 hover:-translate-y-2">
              <div className="relative aspect-[3/4] rounded-[30px] overflow-hidden mb-6">
                <img 
                  src={getImageUrl(p.image)} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&h=600&fit=crop";
                  }}
                />
                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {p.year}
                </div>
              </div>
              <div className="space-y-2 px-2 pb-2">
                <h4 className="font-bold text-slate-900 text-lg leading-tight font-display">{p.name}</h4>
                <div className="flex flex-col gap-1">
                  <p className="text-emerald-600 text-sm font-bold leading-tight">{p.award}</p>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{p.level}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={!!selectedPrestasi} 
        onClose={() => setSelectedPrestasi(null)} 
        image={selectedPrestasi?.image} 
        caption={`${selectedPrestasi?.award} - ${selectedPrestasi?.name}`}
      />
    </section>
  );
};

const DeveloperInfo = () => {
  const devData = {
    name: "RBDev.",
    role: "Developer_IAA ",
    bio: "Membangun sistem informasi yang efisien dan estetik untuk mendukung kemajuan organisasi Alumni Annuqayah. Fokus pada pengembangan web modern dan skalabilitas aplikasi.",
    contacts: [
      { name: "GitHub", icon: <Github className="w-6 h-6" />, value: "github.com/RBYakin", link: "https://github.com/RBYakin", color: "bg-slate-800" },
      { name: "Instagram", icon: <Instagram className="w-6 h-6" />, value: "@rb.yakin_", link: "https://www.instagram.com/rb.yakin_?igsh=MThkODFqMHJoZWQ2OQ==", color: "bg-pink-600" },
      { name: "Email", icon: <Mail className="w-6 h-6" />, value: "email/rbyakin206@gmail.com", link: "rbyakin206@gmail.com", color: "bg-emerald-600" }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="container mx-auto px-6 font-display">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display">Pusat Informasi Dev</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg font-sans">Hubungi pengembang aplikasi untuk pertanyaan teknis, saran, atau kolaborasi pengembangan sistem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[50px] p-10 shadow-xl border border-slate-100 flex flex-col items-center text-center space-y-6"
            >
              <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                <UserCircle className="w-20 h-20 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-display">{devData.name}</h3>
                <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs mt-1">{devData.role}</p>
              </div>
              <p className="text-slate-500 leading-relaxed font-sans">
                {devData.bio}
              </p>
            </motion.div>

            {/* Contact Grid */}
            <div className="grid grid-cols-1 gap-4 font-sans">
              {devData.contacts.map((contact, idx) => (
                <motion.a 
                  key={idx}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-6 p-6 bg-white rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all group"
                >
                  <div className={`w-14 h-14 ${contact.color} text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    {contact.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{contact.name}</p>
                    <p className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">{contact.value}</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-300 ml-auto group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FAQRegistrasi = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Siapa saja yang bisa mendaftar menjadi anggota IAA Bangkalan?",
      answer: "Keanggotaan IAA Bangkalan terbuka untuk seluruh alumni Pondok Pesantren Annuqayah (semua cabang/daerah di pesantren) yang saat ini berdomisili, bekerja, atau menempuh pendidikan di wilayah Kabupaten Bangkalan."
    },
    {
      question: "Bagaimana tahapan cara mendaftar?",
      answer: "Pendaftaran dapat dilakukan dengan cara daring melalui Instagram IAA Bangkalan yang disediakan di website ini (Daftar IAA) atau menghubungi Admin untuk informasi lebih lanjut."
    },
    {
      question: "Apakah ada biaya pendaftaran untuk menjadi anggota?",
      answer: "Untuk saat ini, pendaftaran anggota baru tidak dipungut biaya (Gratis). Namun, anggota diharapkan berkontribusi dalam kegiatan rutin bulanan melalui iuran sukarela yang dikelola secara transparan untuk operasional organisasi."
    },
    {
      question: "Apa saja syarat dokumen yang diperlukan?",
      answer: "Syarat utama adalah identitas diri (KTP/KTM) dan bukti sebagai alumni Annuqayah (bisa berupa ijazah, kartu alumni pusat, atau verifikasi dari rekan alumni lainnya)."
    },
    {
      question: "Berapa lama proses verifikasi pendaftaran?",
      answer: "Proses verifikasi biasanya memakan waktu 1-3 hari kerja. Setelah diverifikasi oleh divisi kaderisasi, Anda akan dimasukkan ke dalam basis data anggota dan grup komunikasi resmi IAA Cabang Bangkalan."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Pusat Bantuan
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-display">FAQ Registrasi</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">Semua yang perlu Anda ketahui tentang proses pendaftaran dan keanggotaan IAA Cabang Bangkalan.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={false}
              className="border border-slate-200 rounded-[30px] overflow-hidden transition-all duration-300"
            >
              <button 
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 sm:p-8 text-left bg-white hover:bg-slate-50 transition-colors group"
              >
                <span className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors pr-8">
                  {faq.question}
                </span>
                <div className={`p-2 rounded-full bg-slate-100 group-hover:bg-emerald-100 transition-colors transform ${activeIndex === index ? 'rotate-180 bg-emerald-100' : ''}`}>
                  <ChevronDown className={`w-5 h-5 text-slate-500 group-hover:text-emerald-600 ${activeIndex === index ? 'text-emerald-600' : ''}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-8 pb-8 text-slate-500 leading-relaxed text-lg border-t border-slate-50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-emerald-900 rounded-[50px] text-center text-white relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <h4 className="text-2xl font-bold font-display">Masih punya pertanyaan lainnya?</h4>
            <p className="text-emerald-100 opacity-80 max-w-lg mx-auto">Jika Anda tidak menemukan jawaban yang dicari, tim admin kami siap membantu Anda secara langsung.</p>
            <Link to="/developer" className="inline-block bg-white text-emerald-900 px-10 py-4 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform active:scale-95">
              Hubungi Admin Dev
            </Link>
          </div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
        </div>
      </div>
    </div>
  );
};

const ProgramKerja = () => {
  const prodi = [
    { 
      title: "Badan Pengurus Harian", 
      icon: <ClipboardCheck className="w-8 h-8 text-emerald-600" />,
      items: ["Evaluasi Program Kerja", "PHBI (Peringatan Hari Besar Islam)", "Kajian kitab kuning"] 
    },
    { 
      title: "Divisi Kaderisasi", 
      icon: <Users className="w-8 h-8 text-emerald-600" />,
      items: ["Meet Up Maba", "Malam Keakraban", "IAA Have Fun", "IAA Go to Ziarah", "Visit IAA"] 
    },
    { 
      title: "Divisi Pendidikan", 
      icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
      items: ["Kajian Time", "Kursus SDB (Semarak Dua Bahasa)", "PEKA (Pecinta Karya IAA)", "Nyerrat Asareng"] 
    },
    { 
      title: "Divisi Infokom", 
      icon: <Share2 className="w-8 h-8 text-emerald-600" />,
      items: ["Desain Pamflet Acara", "Desain Ucapan Selamat", "Admin Sosial Media", "Dokumentasi & Film"] 
    },
    { 
      title: "Divisi Kewirausahaan", 
      icon: <ShoppingBag className="w-8 h-8 text-emerald-600" />,
      items: ["Buka stand saat acara kampus", "Jastip Makanana"] 
    }
  ];

  return (
    <section className="container mx-auto px-6 py-24 min-h-screen">
      <div className="text-center space-y-4 mb-20">
        <div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
          Agenda Strategis
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 font-display">Program Kerja Utama</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">Sinergi pengabdian melalui berbagai inisiatif program kerja di setiap divisi IAA Cabang Bangkalan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {prodi.map((p, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-10 rounded-[50px] shadow-xl border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-emerald-100 group"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              {p.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-6 font-display">{p.title}</h3>
            <ul className="space-y-4 font-sans">
              {p.items.map((item, i) => (
                <li key={i} className="flex items-start gap-4 text-slate-600 group-hover:text-slate-900 transition-colors">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0" />
                  <span className="font-medium text-lg leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 selection:bg-emerald-100 selection:text-emerald-900">
          <ScrollToTop />
          <Navbar />
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tentang" element={<Tentang />} />
            <Route path="/prestasi" element={<Prestasi />} />
            <Route path="/developer" element={<DeveloperInfo />} />
            <Route path="/faq" element={<FAQRegistrasi />} />
            <Route path="/dokumentasi" element={<Dokumentasi />} />
            <Route path="/program-kerja" element={<ProgramKerja />} />
            <Route path="/struktur-pengurus" element={<StrukturPengurus />} />
            <Route path="/karya" element={<Karya />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

const Login = () => {
  const { user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      setError('Email atau Password salah. Silakan coba lagi.');
    }
  };

  if (user && isAdmin) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
        <Award className="w-10 h-10 text-emerald-600" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Selamat Datang, Admin</h2>
      <Link to="/admin" className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-100 hover:scale-105 transition-transform">
        Buka Dashboard
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 md:p-14 rounded-[50px] shadow-2xl max-w-md w-full border border-slate-100"
      >
        <div className="text-center space-y-6 mb-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto">
            <UserCircle className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 font-display tracking-tight">Login Admin</h2>
            <p className="text-slate-500 font-medium">Gunakan akun admin yang telah didaftarkan di sistem.</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Email Admin</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                required
                placeholder="developer@iaabangkalan.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Password</label>
            <div className="relative">
              <X className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium"
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm font-bold bg-red-50 p-4 rounded-xl border border-red-100 text-center"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            className="w-full bg-emerald-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-100 active:scale-95"
          >
            <LogIn className="w-6 h-6" />
            Masuk ke Sistem
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium">Lupa akun? Hubungi Developer Utama.</p>
        </div>
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('officers');
  const [isSeeding, setIsSeeding] = useState(false);

  const seedInitialData = async () => {
    if (!confirm('Apakah Anda ingin memindahkan SEMUA data contoh (Pengurus, Prestasi, Karya, Dokumentasi) ke database?')) return;
    setIsSeeding(true);
    try {
      // Clear existing documentation if confirming "Ganti" logic
      const docSnap = await getDocs(collection(db, 'documentation'));
      for (const d of docSnap.docs) {
        await deleteDoc(doc(db, 'documentation', d.id));
      }

      // 1. Officers (Lengkap)
      const officers = [
        // BPH
        { name: "Moh. Nujai Miyul Munawwir", title: "Ketua Umum", image: "https://picsum.photos/seed/chairman/400/600", division: "Badan Pengurus Harian", rank: 1 },
        { name: "Mohammad Waqidi", title: "Wakil Ketua Umum", image: "https://picsum.photos/seed/deputy/400/600", division: "Badan Pengurus Harian", rank: 2 },
        { name: "Ayunda Ratna Sari", title: "Sekretaris Umum", image: "https://picsum.photos/seed/sec/400/600", division: "Badan Pengurus Harian", rank: 3 },
        { name: "Ismi Lailatin", title: "Wakil Sekretaris Umum", image: "https://picsum.photos/seed/vsec/400/600", division: "Badan Pengurus Harian", rank: 4 },
        { name: "Fitriani", title: "Bendahara", image: "https://picsum.photos/seed/treas/400/600", division: "Badan Pengurus Harian", rank: 5 },
        // Kaderisasi
        { name: "Kamaliyyatul Baroroh", title: "Koordinator", image: "https://picsum.photos/seed/kader1/400/600", division: "Divisi Kaderisasi", rank: 6 },
        { name: "Syifa Bilbina Khozaimi", title: "Anggota", image: "https://picsum.photos/seed/kader2/400/600", division: "Divisi Kaderisasi", rank: 7 },
        { name: "Syafika Aqsha Iradati", title: "Anggota", image: "https://picsum.photos/seed/kader3/400/600", division: "Divisi Kaderisasi", rank: 8 },
        { name: "Ahmad Riyadi", title: "Anggota", image: "https://picsum.photos/seed/kader4/400/600", division: "Divisi Kaderisasi", rank: 9 },
        { name: "Nihayatus Saadah", title: "Anggota", image: "https://picsum.photos/seed/kader5/400/600", division: "Divisi Kaderisasi", rank: 10 },
        // Pendidikan
        { name: "Lailatul Munawwaroh", title: "Koordinator", image: "https://picsum.photos/seed/pend1/400/600", division: "Divisi Pendidikan", rank: 11 },
        { name: "R.B. Ainul Yakin", title: "Anggota", image: "https://picsum.photos/seed/pend2/400/600", division: "Divisi Pendidikan", rank: 12 },
        { name: "Shofiatul Mahmudah", title: "Anggota", image: "https://picsum.photos/seed/pend3/400/600", division: "Divisi Pendidikan", rank: 13 },
        { name: "Khoirul Anami", title: "Anggota", image: "https://picsum.photos/seed/pend4/400/600", division: "Divisi Pendidikan", rank: 14 },
        { name: "Barotut Taqiyah", title: "Anggota", image: "https://picsum.photos/seed/pend5/400/600", division: "Divisi Pendidikan", rank: 15 },
        // Infokom
        { name: "Feri Luthfi Aji", title: "Koordinator", image: "https://picsum.photos/seed/info1/400/600", division: "Divisi Infokom", rank: 16 },
        { name: "Elly Andriani", title: "Anggota", image: "https://picsum.photos/seed/info2/400/600", division: "Divisi Infokom", rank: 17 },
        { name: "Alfiana Idlatus Syahril Ilah", title: "Anggota", image: "https://picsum.photos/seed/info3/400/600", division: "Divisi Infokom", rank: 18 },
        { name: "Zainul Firdaus Al-Hasany", title: "Anggota", image: "https://picsum.photos/seed/info4/400/600", division: "Divisi Infokom", rank: 19 },
        // Kewirausahaan
        { name: "Romzah", title: "Koordinator", image: "https://picsum.photos/seed/wira1/400/600", division: "Divisi Kewirausahaan", rank: 20 },
        { name: "Moh Nabil Al-farisi", title: "Anggota", image: "https://picsum.photos/seed/wira2/400/600", division: "Divisi Kewirausahaan", rank: 21 },
        { name: "Unsiatul Hasanah", title: "Anggota", image: "https://picsum.photos/seed/wira3/400/600", division: "Divisi Kewirausahaan", rank: 22 },
        { name: "Fandy Ahmad Priabudi", title: "Anggota", image: "https://picsum.photos/seed/wira4/400/600", division: "Divisi Kewirausahaan", rank: 23 },
      ];

      // 2. Achievements
      const achievements = [
        { name: "Ahmad Mujtaba", award: "Juara 1 Musabaqah Tilawatil Quran", level: "Tingkat Internasional - Kairo", image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470", year: "2024" },
        { name: "Siti Aminah", award: "Gold Medal Karya Tulis Ilmiah", level: "Tingkat Nasional", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070", year: "2023" },
      ];

      // 3. Works
      const works = [
        { title: "Karya Selembaran 01", image: "https://picsum.photos/seed/k1/1200/1800" },
        { title: "Karya Selembaran 02", image: "https://picsum.photos/seed/k2/1200/1800" },
      ];

      // 4. Documentation
      const docs = [
        {
          caption: "Pelantikan Pengurus Baru IAA Cabang Bangkalan Periode 2026/2027",
          image: "https://drive.google.com/file/d/1vBaCqnBkUECayVv13l3SewAB_QRVdLc9/view?usp=drive_link"
        },
        {
          caption: "Rapat Kerja : Menyusun langkah pengabdian terhadap Organisasi",
          image: "https://drive.google.com/file/d/1v5Wla9gNZkYD7fRPuFsaS8cJyAUXAjoV/view?usp=sharing"
        },
        {
          caption: "Musyawarah Cabang Akhir kepengurusan periode 2025/2026",
          image: "https://drive.google.com/file/d/1uwkFcFyd8UKMgU3-HtkPUG8IIWMQgaOW/view?usp=drivesdk"
        }
      ];

      for (const m of officers) await addDoc(collection(db, 'officers'), { ...m, createdAt: serverTimestamp() });
      for (const a of achievements) await addDoc(collection(db, 'achievements'), { ...a, createdAt: serverTimestamp() });
      for (const w of works) await addDoc(collection(db, 'works'), { ...w, createdAt: serverTimestamp() });
      for (const d of docs) await addDoc(collection(db, 'documentation'), { ...d, createdAt: serverTimestamp() });
      
      alert('SEMUA data berhasil disalin ke database! Silakan cek di Dashboard.');
      window.location.reload(); // Paksa reload untuk memastikan state terbaru
    } catch (err: any) {
      console.error("Seed Error:", err);
      alert('Gagal menyalin data: ' + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-emerald-600" /></div>;
  if (!user || !isAdmin) return <Login />;

  const tabs = [
    { id: 'officers', label: 'Pengurus', icon: <Users className="w-5 h-5" /> },
    { id: 'achievements', label: 'Prestasi', icon: <Award className="w-5 h-5" /> },
    { id: 'works', label: 'Karya', icon: <BookOpen className="w-5 h-5" /> },
    { id: 'documentation', label: 'Dokumentasi', icon: <Newspaper className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-24">
      <div className="container mx-auto px-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 font-display">Dashboard Admin</h2>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Pengelola Sistem Informasi - </p>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-black uppercase">{user?.email}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={seedInitialData}
              disabled={isSeeding}
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-100 transition-all shadow-sm border border-emerald-100 disabled:opacity-50"
            >
              {isSeeding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
              Generate Data Awal
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" /> Keluar
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-[30px] shadow-sm w-fit border border-slate-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[50px] p-8 md:p-12 shadow-xl border border-slate-100">
          <FirestoreManager collectionName={activeTab} />
        </div>
      </div>
    </div>
  );
};

const FirestoreManager = ({ collectionName }: { collectionName: string }) => {
  const { data, loading } = useFirestoreCollection(collectionName);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fields: any = {
    officers: [
      { name: 'name', label: 'Nama Lengkap', type: 'text' },
      { name: 'title', label: 'Jabatan', type: 'text' },
      { name: 'division', label: 'Divisi', type: 'text' },
      { name: 'image', label: 'URL Foto', type: 'url' },
      { name: 'rank', label: 'Urutan (Angka)', type: 'number' }
    ],
    achievements: [
      { name: 'name', label: 'Nama Peraih', type: 'text' },
      { name: 'award', label: 'Nama Penghargaan', type: 'text' },
      { name: 'level', label: 'Tingkat', type: 'text' },
      { name: 'year', label: 'Tahun', type: 'text' },
      { name: 'image', label: 'URL Foto', type: 'url' }
    ],
    works: [
      { name: 'title', label: 'Judul Karya', type: 'text' },
      { name: 'image', label: 'URL Foto', type: 'url' }
    ],
    documentation: [
      { name: 'caption', label: 'Keterangan', type: 'text' },
      { name: 'image', label: 'URL Foto', type: 'url' }
    ]
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
        alert('Data berhasil diperbarui!');
      } else {
        await addDoc(collection(db, collectionName), {
          ...formData,
          createdAt: serverTimestamp()
        });
        alert('Data berhasil ditambahkan!');
      }
      setFormData({});
      setIsAdding(false);
      setEditingId(null);
    } catch (err) {
      handleFirestoreError(err, editingId ? 'write' : 'create', collectionName);
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setEditingId(item.id);
    setIsAdding(true);
    // Scroll to form
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus data ini?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (err) {
        handleFirestoreError(err, 'delete', collectionName);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-black text-slate-900 uppercase font-display tracking-tight">Daftar Data {collectionName}</h3>
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setIsAdding(!isAdding);
              if (!isAdding) {
                setFormData({});
                setEditingId(null);
              }
            }}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:scale-105 transition-transform"
          >
            {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isAdding ? 'Batal' : 'Tambah Baru'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleAdd}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-slate-50 rounded-[40px] border border-slate-200 overflow-hidden"
          >
            {fields[collectionName].map((f: any) => (
              <div key={f.name} className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">{f.label}</label>
                <input 
                  type={f.type} 
                  required
                  placeholder={f.label}
                  value={formData[f.name] || ''}
                  onChange={e => setFormData({ ...formData, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 outline-none transition-all font-medium"
                />
              </div>
            ))}
            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full bg-emerald-700 text-white font-bold py-5 rounded-2xl hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> {editingId ? 'Simpan Perubahan' : 'Simpan Data ke Database'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center p-20 text-slate-400"><Loader2 className="w-12 h-12 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item: any) => (
            <div key={item.id} className="bg-slate-50 p-5 rounded-[40px] border border-slate-100 relative group overflow-hidden">
              <div className="aspect-square rounded-[30px] overflow-hidden mb-4 bg-slate-200">
                <img 
                  src={getImageUrl(item.image)} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=400&h=600&fit=crop";
                  }}
                />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-900 truncate font-display">{item.name || item.title || item.caption}</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.title || item.award || item.role}</p>
              </div>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(item)}
                  className="bg-white text-emerald-600 p-2 rounded-full shadow-lg hover:bg-emerald-50"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {data.length === 0 && <p className="col-span-full text-center py-20 text-slate-400 italic">Belum ada data di koleksi ini.</p>}
        </div>
      )}
    </div>
  );
};

