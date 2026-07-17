import { useState } from 'react';
import { motion } from 'motion/react';
import { portfolioData } from '../../data/portfolioData';
import { SkillCategory } from '../../types';
import { Code2, Layout, Server, Database, Settings, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');

  const categories: { key: SkillCategory | 'All'; label: string; icon: any }[] = [
    { key: 'All', label: 'All Tech', icon: <Code2 className="w-4 h-4" /> },
    { key: 'Languages', label: 'Languages', icon: <Code2 className="w-4 h-4" /> },
    { key: 'Frontend', label: 'Frontend', icon: <Layout className="w-4 h-4" /> },
    { key: 'Backend', label: 'Backend', icon: <Server className="w-4 h-4" /> },
    { key: 'Databases', label: 'Databases', icon: <Database className="w-4 h-4" /> },
    { key: 'Tools', label: 'Tools', icon: <Settings className="w-4 h-4" /> },
    { key: 'Core CS', label: 'Core CS', icon: <GraduationCap className="w-4 h-4" /> }
  ];

  // Group skills by category for bento view
  const categoriesList: SkillCategory[] = ['Languages', 'Frontend', 'Backend', 'Databases', 'Tools', 'Core CS'];
  
  const getCategoryIcon = (cat: SkillCategory) => {
    switch (cat) {
      case 'Languages': return <Code2 className="w-4 h-4 text-accent-primary" />;
      case 'Frontend': return <Layout className="w-4 h-4 text-accent-primary" />;
      case 'Backend': return <Server className="w-4 h-4 text-accent-primary" />;
      case 'Databases': return <Database className="w-4 h-4 text-accent-primary" />;
      case 'Tools': return <Settings className="w-4 h-4 text-accent-primary" />;
      case 'Core CS': return <GraduationCap className="w-4 h-4 text-accent-primary" />;
    }
  };

  const filteredSkills = selectedCategory === 'All'
    ? portfolioData.skills
    : portfolioData.skills.filter(s => s.category === selectedCategory);

  return (
    <section 
      id="skills" 
      className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-border-subtle"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <span className="font-mono text-xs text-accent-primary tracking-widest uppercase block">
            02 // Capabilities
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-text-primary">
            Technical Stack
          </h2>
        </div>

        {/* Filter Navigation (Interactive pill tabs) */}
        <div className="flex flex-wrap gap-2 max-w-full overflow-x-auto pb-2 scrollbar-none" id="skills-filters">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide border transition-all duration-300 whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-accent-soft text-accent-primary border-accent-primary/30'
                  : 'bg-bg-surface text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-active'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Skills Layout Grid */}
      {selectedCategory === 'All' ? (
        /* Bento Grid Presentation for All View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="skills-bento-grid">
          {categoriesList.map((cat) => {
            const categorySkills = portfolioData.skills.filter(s => s.category === cat);
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-bg-surface border border-border-subtle hover:border-border-active rounded-xl p-6 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center space-x-3 border-b border-border-subtle pb-4 mb-4">
                    <div className="p-2 rounded bg-bg-main border border-border-subtle">
                      {getCategoryIcon(cat)}
                    </div>
                    <h3 className="font-display text-base font-semibold text-text-primary">
                      {cat}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {categorySkills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-1.5 bg-bg-main/60 border border-border-subtle rounded px-2.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:border-accent-primary/30 transition-all duration-300"
                      >
                        <CheckCircle2 className="w-3 h-3 text-accent-primary/60" />
                        <span className="font-sans font-medium">{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border-subtle/50 flex justify-between items-center text-[10px] font-mono text-text-tertiary">
                  <span>CATEGORY CODE: {cat.toUpperCase().replace(/\s+/g, '_')}</span>
                  <span>{categorySkills.length} ITEMS</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* Filtered Grid Presentation */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4" id="skills-filtered-grid">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-bg-surface border border-border-subtle hover:border-accent-primary/30 rounded-lg p-4 flex items-center space-x-3 transition-all duration-300 hover:-translate-y-0.5 group"
            >
              <div className="w-2 h-2 rounded-full bg-accent-primary/50 group-hover:bg-accent-primary transition-colors"></div>
              <div>
                <span className="font-sans text-sm font-semibold text-text-primary block">
                  {skill.name}
                </span>
                <span className="font-mono text-[10px] text-text-tertiary uppercase tracking-wider block mt-0.5">
                  {skill.level}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
