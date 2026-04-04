import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  ArrowRight,
  GraduationCap,
} from "@phosphor-icons/react";
import { learnArticles } from "../data/mockData";

const categories = [
  "All",
  "Basics",
  "Investing",
  "Getting Started",
  "Advanced",
];

export default function Learn() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? learnArticles
      : learnArticles.filter((a) => a.category === activeCategory);

  return (
    <main className="min-h-screen pt-[72px] pb-20 md:pb-8">
      {/* Hero */}
      <section className="bg-gradient-secondary border-b border-border-subtle">
        <div className="max-w-[1440px] mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap size={32} weight="duotone" className="text-cyan" />
              <h1 className="text-h1 font-sans text-foreground">
                Learning Center
              </h1>
            </div>
            <p className="text-body-lg font-body text-neutral-300 max-w-xl">
              Master web3 real estate investing with our comprehensive guides
              and tutorials.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 h-9 rounded-full text-body-sm font-body transition-colors cursor-pointer
                ${
                  activeCategory === cat
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-card border border-border-subtle text-muted-foreground hover:text-foreground hover:border-cyan"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {filtered.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-card border border-border-subtle rounded-lg overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform duration-300 group"
              role="article"
              aria-label={article.title}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,15%,10%)] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="text-caption font-body px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-h4 font-sans text-foreground mb-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-body-sm font-body text-muted-foreground mb-4 line-clamp-2">
                  {article.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock size={14} weight="duotone" />
                    <span className="text-caption font-body">
                      {article.readTime} read
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-cyan text-body-sm font-body group-hover:gap-2 transition-all">
                    <BookOpen size={14} weight="duotone" />
                    <span>Read</span>
                    <ArrowRight size={14} weight="duotone" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-16 bg-gradient-secondary border border-border-subtle rounded-lg p-8 text-center"
        >
          <GraduationCap
            size={48}
            weight="duotone"
            className="text-cyan mx-auto mb-4"
          />
          <h2 className="text-h2 font-sans text-foreground mb-3">
            Ready to Start Investing?
          </h2>
          <p className="text-body font-body text-muted-foreground mb-6 max-w-md mx-auto">
            You've learned the basics. Now explore our marketplace and make your
            first tokenized real estate investment.
          </p>
          <a
            href="/marketplace"
            className="inline-flex items-center gap-2 px-6 h-12 rounded-md bg-gradient-primary text-primary-foreground font-body font-normal text-body cursor-pointer hover:brightness-110 transition-all"
          >
            Explore Marketplace
            <ArrowRight size={18} weight="duotone" />
          </a>
        </motion.div>
      </div>
    </main>
  );
}
