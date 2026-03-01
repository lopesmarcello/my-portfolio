"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAbout, AboutData } from "@/lib/api";
import TechStack from "@/components/TechStack";
import LiquidEther from "@/components/LiquidEther";

export default function Home() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAbout();
        setAbout(data);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-pulse">
            <div className="w-24 h-24 bg-green-500 rounded-full opacity-50 mx-auto mb-4" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!about) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Falha ao carregar dados do portfólio</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section with LiquidEther Background */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* LiquidEther Background */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={
              isDark
                ? ["#16a34a", "#15803d", "#059669"]
                : ["#60a5fa", "#3b82f6", "#2563eb"]
            }
            mouseForce={25}
            cursorSize={120}
            autoDemo={true}
            autoSpeed={0.3}
            autoIntensity={1.5}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col justify-center order-2 md:order-1">
                <h1 className="text-5xl md:text-6xl font-bold dark:text-white text-gray-900 drop-shadow-lg mb-4 leading-tight">
                  Olá, eu sou{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r dark:from-green-200 dark:to-green-100 from-blue-600 to-blue-500">
                    {about.name}
                  </span>
                </h1>
                <p className="text-2xl md:text-3xl font-semibold dark:text-gray-100 text-gray-700 drop-shadow-md mb-6">
                  {about.title}
                </p>
                <p className="text-lg dark:text-gray-200 text-gray-600 drop-shadow-md mb-8 leading-relaxed max-w-lg">
                  {about.description}
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/curriculum"
                    className="px-8 py-3 dark:bg-white dark:text-green-700 bg-gray-900 text-white font-bold rounded-lg dark:hover:bg-gray-100 hover:bg-gray-800 transition-all hover:scale-105 shadow-lg"
                  >
                    Ver meu CV
                  </Link>
                  <Link
                    href="/content"
                    className="px-8 py-3 border-2 dark:border-white border-gray-900 dark:text-white text-gray-900 font-bold rounded-lg dark:hover:bg-white dark:hover:text-green-700 hover:bg-gray-900 hover:text-white transition-all hover:scale-105 shadow-lg"
                  >
                    Ler meu Blog
                  </Link>
                </div>
              </div>

              {/* Placeholder for photo */}
              <div className="order-1 md:order-2">
                <div className="w-full aspect-square rounded-2xl dark:bg-white/20 bg-gray-900/20 backdrop-blur-sm border dark:border-white/30 border-gray-900/30 flex items-center justify-center shadow-2xl">
                  <div className="text-center dark:text-white text-gray-900">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-sm font-semibold drop-shadow-md">Your photo here</p>
                    <p className="text-xs opacity-75 drop-shadow-md">UPDATE_PHOTO_URL</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {about.links && about.links.length > 0 && (
              <div className="flex gap-4 mt-12">
                {about.links.map((link) => (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full dark:bg-white/20 bg-gray-900/20 backdrop-blur-sm dark:text-white text-gray-900 dark:hover:bg-white dark:hover:text-green-700 hover:bg-gray-900 hover:text-white transition-all hover:scale-110 shadow-lg dark:border-white/30 border border-gray-900/30"
                    title={link.label}
                  >
                    <span className="text-lg">{link.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      {about.technologies && about.technologies.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-950 py-20">
          <TechStack technologies={about.technologies} />
        </section>
      )}

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-8">
            Sobre Mim
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {about.aboutText}
              </p>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  Links Rápidos
                </h3>
                <div className="flex flex-wrap gap-3">
                  {about.links && about.links.map((link) => (
                    <a
                      key={`${link.label}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 hover:border-green-500 dark:hover:border-green-400 transition-colors font-medium"
                    >
                      {link.label}
                      <span>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-950 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-6">
                Destaques
              </h3>
              <p className="text-green-800 dark:text-green-200">
                Esta seção apresenta projetos e conquistas em destaque. Mais conteúdo em breve.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
