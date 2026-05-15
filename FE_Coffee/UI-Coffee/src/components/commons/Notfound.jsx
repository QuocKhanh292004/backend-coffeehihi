import React, { useState, useEffect } from 'react';
import { Search, Home, ArrowLeft, RefreshCw } from 'lucide-react';

export default function NotFound() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation((prev) => (prev + 1) % 360);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const parallaxX = (mousePosition.x - window.innerWidth / 2) / 50;
    const parallaxY = (mousePosition.y - window.innerHeight / 2) / 50;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden relative flex items-center justify-center p-8 font-['Space_Grotesk']">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-32 h-32 border-4 border-slate-700/20 rotate-12"
                    style={{
                        transform: `translate(${parallaxX * 2}px, ${parallaxY * 2}px) rotate(${rotation * 0.5}deg)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                />
                <div
                    className="absolute top-40 right-20 w-24 h-24 bg-orange-400/20 rounded-full"
                    style={{
                        transform: `translate(${-parallaxX * 3}px, ${-parallaxY * 3}px) scale(${1 + Math.sin(rotation * 0.05) * 0.2})`,
                        transition: 'transform 0.1s ease-out'
                    }}
                />
                <div
                    className="absolute bottom-20 left-1/4 w-16 h-16 border-4 border-dashed border-slate-600/30 rounded-full"
                    style={{
                        transform: `translate(${parallaxX * 1.5}px, ${parallaxY * 1.5}px) rotate(${-rotation}deg)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                />
                <div
                    className="absolute bottom-32 right-1/4 w-20 h-20 bg-gradient-to-br from-orange-300/30 to-amber-400/30 rotate-45"
                    style={{
                        transform: `translate(${-parallaxX * 2}px, ${-parallaxY * 2}px) rotate(${45 + rotation * 0.3}deg)`,
                        transition: 'transform 0.1s ease-out'
                    }}
                />
                <div className="absolute top-1/3 right-10 w-12 h-12 border-4 border-slate-700/20 rounded-lg animate-bounce" />
                <div className="absolute bottom-1/3 left-16 w-8 h-8 bg-orange-500/30 rounded-full animate-pulse" />

                {/* Dotted path lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ transform: `translate(${parallaxX * 0.5}px, ${parallaxY * 0.5}px)` }}>
                    <path
                        d="M 200 100 Q 300 200 400 150"
                        stroke="#334155"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        fill="none"
                        opacity="0.2"
                    />
                    <path
                        d="M 600 300 Q 700 200 800 250"
                        stroke="#334155"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                        fill="none"
                        opacity="0.2"
                    />
                </svg>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-4xl w-full">
                {/* Illustration container */}
                <div className="mb-8 flex justify-center relative">
                    <div
                        className="relative"
                        style={{
                            transform: `translate(${parallaxX}px, ${parallaxY}px)`,
                            transition: 'transform 0.1s ease-out'
                        }}
                    >
                        {/* Character illustration (simplified representation) */}
                        <div className="relative">
                            {/* Head */}
                            <div className="w-24 h-24 bg-orange-100 rounded-full mx-auto relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-12 bg-slate-800 rounded-b-full" />
                                {/* Face details */}
                                <div className="absolute top-14 left-7 w-3 h-3 bg-slate-800 rounded-full" />
                                <div className="absolute top-14 right-7 w-3 h-3 bg-slate-800 rounded-full" />
                                <div className="absolute top-18 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-orange-300 rounded-full" />
                            </div>

                            {/* Body with sweater */}
                            <div className="w-32 h-24 bg-gradient-to-br from-orange-400 to-amber-500 rounded-t-3xl mx-auto mt-2 relative">
                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold opacity-80">
                                    Adventure
                                </div>
                            </div>

                            {/* Floating search icon */}
                            <div className="absolute -top-4 -right-8 bg-white rounded-full p-3 shadow-lg animate-bounce">
                                <Search className="w-5 h-5 text-slate-700" />
                            </div>

                            {/* Floating globe icon */}
                            <div
                                className="absolute -top-2 -left-12 bg-slate-700 rounded-full p-3 shadow-lg"
                                style={{
                                    animation: 'float 3s ease-in-out infinite'
                                }}
                            >
                                <div className="w-5 h-5 rounded-full border-2 border-white relative">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-full h-0.5 bg-white" />
                                        <div className="w-0.5 h-full bg-white absolute" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error card */}
                <div className="bg-white rounded-3xl shadow-2xl p-12 border-4 border-slate-800 relative overflow-hidden">
                    {/* Decorative corner elements */}
                    <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-orange-400 rounded-tl-3xl" />
                    <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-orange-400 rounded-br-3xl" />

                    <div className="text-center relative z-10">
                        <h1 className="text-slate-800 font-bold text-2xl mb-6 tracking-tight">
                            ERREUR!
                        </h1>

                        {/* Giant 404 with striped pattern */}
                        <div className="relative mb-8">
                            <div className="text-[180px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 relative">
                                <div className="absolute inset-0 text-[180px] font-black leading-none">
                  <span className="text-orange-400" style={{
                      WebkitTextStroke: '8px white',
                      textStroke: '8px white'
                  }}>404</span>
                                </div>
                                <span className="relative" style={{
                                    background: 'repeating-linear-gradient(45deg, #fb923c, #fb923c 20px, #fbbf24 20px, #fbbf24 40px)',
                                    WebkitBackgroundClip: 'text',
                                    backgroundClip: 'text'
                                }}>404</span>
                            </div>
                        </div>

                        <h2 className="text-slate-800 font-bold text-3xl mb-8">
                            Désolé, Page Introuvable !
                        </h2>

                        <p className="text-slate-600 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                            La page que vous recherchez semble avoir pris des vacances... ou peut-être n'a-t-elle jamais existé ! 🏖️
                        </p>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2">
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                               Quay lại trang chủ
                            </button>

                            <button className="group bg-white text-slate-800 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl border-2 border-slate-800 transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                Page précédente
                            </button>

                            <button className="group bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2">
                                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>


                <p className="text-center mt-8 text-slate-600 text-sm">
                    Erreur 404 • Cette page n'existe pas • Besoin d'aide ? Contactez le support
                </p>
            </div>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
        </div>
    );
}

