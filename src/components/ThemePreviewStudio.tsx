// components/ThemePreviewStudio.tsx (UPDATED - Full width version)

import { applyPalette, type ColorPalette, colorPalettes } from '../lib/color-palettes';
import { useThemeMode, type ThemeMode } from '../hooks/useThemeMode';
import React, { useState, useEffect } from 'react';

const categories = ['All', 'SaaS', 'E-commerce', 'Finance', 'Healthcare', 'Entertainment', 'Creative', 'Education', 'Food', 'Health', 'Travel', 'Business', 'Tech', 'Media', 'Social', 'Lifestyle', 'Green Tech'];

export const ThemePreviewStudio: React.FC = () => {
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette>(colorPalettes[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  const { mode, setMode } = useThemeMode();

  const filteredPalettes = colorPalettes.filter((palette: ColorPalette) => {
    const matchesSearch = palette.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          palette.productType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || palette.productType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleThemeChange = (palette: ColorPalette) => {
    setSelectedPalette(palette);
    applyPalette(palette, mode);
    localStorage.setItem('selected-theme-id', String(palette.id));
  };

  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    applyPalette(selectedPalette, newMode);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  useEffect(() => {
    const savedId = localStorage.getItem('selected-theme-id');
    if (savedId) {
      const saved = colorPalettes.find((p: ColorPalette) => p.id === parseInt(savedId));
      if (saved) {
        setSelectedPalette(saved);
        applyPalette(saved, mode);
      }
    } else {
      applyPalette(selectedPalette, mode);
    }
  }, []);

  useEffect(() => {
    applyPalette(selectedPalette, mode);
  }, [mode, selectedPalette]);

  const colorTokens = [
    { label: 'Primary', value: selectedPalette.primary, onValue: selectedPalette.onPrimary },
    { label: 'Secondary', value: selectedPalette.secondary, onValue: selectedPalette.onSecondary },
    { label: 'Accent', value: selectedPalette.accent, onValue: selectedPalette.onAccent },
    { label: 'Background', value: 'var(--color-background)' },
    { label: 'Foreground', value: 'var(--color-foreground)' },
    { label: 'Card', value: 'var(--color-card)', onValue: 'var(--color-card-foreground)' },
    { label: 'Muted', value: 'var(--color-muted)', onValue: 'var(--color-muted-foreground)' },
    { label: 'Border', value: 'var(--color-border)' },
    { label: 'Destructive', value: selectedPalette.destructive, onValue: selectedPalette.onDestructive },
    { label: 'Ring', value: selectedPalette.ring },
  ];

  const getActualColorValue = (cssVar: string) => {
    if (cssVar.startsWith('var(')) {
      const varName = cssVar.match(/var\((--[^)]+)\)/)?.[1];
      if (varName) {
        return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      }
    }
    return cssVar;
  };

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Header - Full width */}
      <header className="w-full border-b sticky top-0 z-10 backdrop-blur-sm" style={{ 
        backgroundColor: 'var(--color-background)',
        borderBottomColor: 'var(--color-border)'
      }}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                🎨 Theme Preview Studio
              </h1>
              <p className="text-sm mt-1 opacity-70" style={{ color: 'var(--color-muted-foreground)' }}>
                Browse, preview, and select color palettes for your project
              </p>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              {/* Mode Toggle Group */}
              <div className="flex rounded-lg border flex-1 sm:flex-none" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => handleModeChange('default')}
                  className="flex-1 sm:flex-none px-3 py-2 text-sm font-medium rounded-l-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: mode === 'default' ? 'var(--color-primary)' : 'transparent',
                    color: mode === 'default' ? 'var(--color-on-primary)' : 'var(--color-foreground)',
                    borderRight: mode !== 'default' ? `1px solid var(--color-border)` : 'none'
                  }}
                >
                  🎨 Default
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('light')}
                  className="flex-1 sm:flex-none px-3 py-2 text-sm font-medium transition-all hover:scale-105"
                  style={{
                    backgroundColor: mode === 'light' ? 'var(--color-primary)' : 'transparent',
                    color: mode === 'light' ? 'var(--color-on-primary)' : 'var(--color-foreground)',
                    borderRight: `1px solid var(--color-border)`
                  }}
                >
                  ☀️ Light
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('dark')}
                  className="flex-1 sm:flex-none px-3 py-2 text-sm font-medium rounded-r-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: mode === 'dark' ? 'var(--color-primary)' : 'transparent',
                    color: mode === 'dark' ? 'var(--color-on-primary)' : 'var(--color-foreground)'
                  }}
                >
                  🌙 Dark
                </button>
              </div>

              {/* Export Button */}
              <button
                type="button"
                onClick={() => {
                  const cssVars = colorTokens.map(t => {
                    const value = t.value.startsWith('var(') ? getActualColorValue(t.value) : t.value;
                    return `--color-${t.label.toLowerCase()}: ${value};`;
                  }).join('\n');
                  copyToClipboard(cssVars, 'CSS Variables');
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)'
                }}
              >
                📋 Export CSS
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full width with padding */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Controls Bar */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
              🔍 Search themes
            </label>
            <input
              type="text"
              placeholder="Type theme name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                borderColor: 'var(--color-border)',
                '--tw-ring-color': 'var(--color-ring)' // ✅ Standard way to override Tailwind ring color
              } as React.CSSProperties}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
              📂 Category
            </label>
            <select
              aria-label="Select category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                borderColor: 'var(--color-border)',
                '--tw-ring-color': 'var(--color-ring)' // ✅ Standard way to override Tailwind ring color
              } as React.CSSProperties} 
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-foreground)' }}>
              🎯 Active theme
            </label>
            <select
              aria-label="Select active theme"
              value={selectedPalette.id}
              onChange={(e) => {
                const palette = colorPalettes.find((p: ColorPalette) => p.id === parseInt(e.target.value));
                if (palette) handleThemeChange(palette);
              }}
              className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition-all font-medium"
              style={{
                backgroundColor: 'var(--color-background)',
                color: 'var(--color-foreground)',
                borderColor: 'var(--color-border)',
                '--tw-ring-color': 'var(--color-ring)' // ✅ Standard way to override Tailwind ring color
              } as React.CSSProperties}     
            >
              {filteredPalettes.map((palette: ColorPalette) => (
                <option key={palette.id} value={palette.id}>
                  {palette.name} — {palette.productType} {mode === 'default' && palette.preferredMode === 'dark' ? '🌙' : mode === 'default' && palette.preferredMode === 'light' ? '☀️' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Theme Info Card */}
        <div className="rounded-xl p-6 mb-8 border" style={{
          backgroundColor: 'var(--color-muted)',
          borderColor: 'var(--color-border)'
        }}>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
                {selectedPalette.name}
                {mode === 'default' && (
                  <span className="text-xs sm:text-sm ml-2 font-normal" style={{ color: 'var(--color-muted-foreground)' }}>
                    ({selectedPalette.preferredMode === 'dark' ? '🌙 Dark mode preferred' : '☀️ Light mode preferred'})
                  </span>
                )}
                {mode === 'light' && (
                  <span className="text-xs sm:text-sm ml-2 font-normal" style={{ color: 'var(--color-muted-foreground)' }}>
                    (☀️ Force light mode)
                  </span>
                )}
                {mode === 'dark' && (
                  <span className="text-xs sm:text-sm ml-2 font-normal" style={{ color: 'var(--color-muted-foreground)' }}>
                    (🌙 Force dark mode)
                  </span>
                )}
              </h2>
              <p className="text-sm mt-1 opacity-80" style={{ color: 'var(--color-muted-foreground)' }}>
                {selectedPalette.productType} • ID: {selectedPalette.id}
              </p>
              <p className="text-xs mt-2 opacity-70" style={{ color: 'var(--color-muted-foreground)' }}>
                📝 {selectedPalette.notes}
              </p>
            </div>
            {copiedItem === 'CSS Variables' && (
              <span className="px-3 py-1.5 rounded-lg text-sm whitespace-nowrap" style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-on-accent)'
              }}>
                ✓ Copied!
              </span>
            )}
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
            ✨ Live preview
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Card Preview */}
            <div className="rounded-xl p-6 shadow-sm border" style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)'
            }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-card-foreground)' }}>
                Card component
              </h3>
              <p className="text-sm mb-6 opacity-80" style={{ color: 'var(--color-card-foreground)' }}>
                Standard card with buttons and interactive elements
              </p>
              
              <div className="space-y-3">
                <button className="w-full px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 hover:scale-[1.02]" style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)'
                }}>
                  Primary action
                </button>
                
                <button className="w-full px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 hover:scale-[1.02]" style={{
                  backgroundColor: 'var(--color-secondary)',
                  color: 'var(--color-on-secondary)'
                }}>
                  Secondary action
                </button>
                
                <button className="w-full px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 hover:scale-[1.02]" style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-on-accent)'
                }}>
                  Accent action
                </button>

                <div className="pt-3" style={{ borderTop: `1px solid var(--color-border)` }}>
                  <a href="#" className="text-sm hover:underline transition-all" style={{ color: 'var(--color-ring)' }}>
                    🔗 Link with ring color
                  </a>
                </div>
              </div>
            </div>

            {/* Interactive Preview */}
            <div className="rounded-xl p-6 shadow-sm border" style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)'
            }}>
              <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-card-foreground)' }}>
                Interactive elements
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-card-foreground)' }}>
                    Input field
                  </label>
                  <input
                    type="text"
                    placeholder="Type something..."
                    className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      color: 'var(--color-foreground)',
                      borderColor: 'var(--color-border)',
                      '--tw-ring-color': 'var(--color-ring)' // ✅ Standard way to override Tailwind ring color
                    } as React.CSSProperties}       
                  />
                </div>

                <div className="p-4 rounded-lg" style={{
                  backgroundColor: 'var(--color-muted)',
                  color: 'var(--color-muted-foreground)'
                }}>
                  <p className="text-sm">ℹ️ Muted section with secondary information and less emphasis</p>
                </div>

                <button className="w-full px-4 py-2.5 rounded-lg font-medium transition-all hover:opacity-90 hover:scale-[1.02]" style={{
                  backgroundColor: 'var(--color-destructive)',
                  color: 'var(--color-on-destructive)'
                }}>
                  ⚠️ Destructive action
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Color Tokens Grid */}
        <div>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
            🎨 Color tokens
          </h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {colorTokens.map((token) => {
              const actualValue = token.value.startsWith('var(') ? getActualColorValue(token.value) : token.value;
              const actualOnValue = token.onValue?.startsWith('var(') ? getActualColorValue(token.onValue) : token.onValue;
              
              return (
                <div
                  key={token.label}
                  onClick={() => copyToClipboard(actualValue, token.label)}
                  className="rounded-xl p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-md border"
                  style={{
                    backgroundColor: 'var(--color-card)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-semibold text-sm" style={{ color: 'var(--color-card-foreground)' }}>
                      {token.label}
                    </span>
                    {copiedItem === token.label && (
                      <span className="text-xs px-2 py-0.5 rounded" style={{
                        backgroundColor: 'var(--color-accent)',
                        color: 'var(--color-on-accent)'
                      }}>✓</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2 items-center mb-2">
                    <div 
                      className="w-10 h-10 rounded-lg border shadow-sm transition-all shrink-0"
                      style={{ 
                        backgroundColor: actualValue,
                        borderColor: 'var(--color-border)'
                      }}
                    />
                    <code className="text-xs font-mono break-all" style={{ color: 'var(--color-card-foreground)' }}>
                      {actualValue}
                    </code>
                  </div>
                  
                  {actualOnValue && (
                    <div className="flex gap-2 items-center">
                      <div 
                        className="w-10 h-10 rounded-lg border shadow-sm transition-all shrink-0"
                        style={{ 
                          backgroundColor: actualOnValue,
                          borderColor: 'var(--color-border)'
                        }}
                      />
                      <code className="text-xs font-mono opacity-70 break-all" style={{ color: 'var(--color-card-foreground)' }}>
                        on-{token.label.toLowerCase()}
                      </code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 text-center border-t" style={{ borderTopColor: 'var(--color-border)' }}>
          <p className="text-xs opacity-60" style={{ color: 'var(--color-muted-foreground)' }}>
            💡 Click any color token to copy its hex value • Theme preference saved locally • {colorPalettes.length}+ themes available • Mode: {mode === 'default' ? 'Theme default' : mode === 'light' ? 'Force light' : 'Force dark'}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default ThemePreviewStudio;