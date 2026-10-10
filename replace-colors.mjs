import fs from 'fs';
import path from 'path';

const map = {
  '#FAF8F3': 'background',
  '#1A1714': 'foreground',
  '#9F3647': 'primary',
  '#F3EDE3': 'secondary',
  '#A09080': 'muted-foreground',
  '#F5EFE6': 'accent',
  '#E5DDD0': 'border',
  '#A8823A': 'ring',
  '#E8CC88': 'chart-3',
  '#6B5E52': 'chart-4',
  '#4A4038': 'neutral-dark',
  '#D0C4B0': 'muted-icon',
  '#9E6E1A': 'warning',
  '#B0A090': 'muted-text-light',
  '#EEE6D7': 'muted-surface',
  '#722230': 'primary-dark',
  '#315F79': 'brand-blue',
  '#B59410': 'brand-gold',
  '#3A3530': 'footer-border',
  '#2E2925': 'footer-border-dark',
  '#FCFEFB': 'card',
  '#7D6E63': 'muted-foreground',
  '#C0B4A8': 'muted-foreground',
  '#721515': 'primary-dark'
};

const regex = /(bg|text|border|shadow|from|to|via|fill|stroke|ring|divide)-\[#([a-fA-F0-9]{6})\]/g;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  const newContent = content.replace(regex, (match, prefix, hex) => {
    const hexUpper = '#' + hex.toUpperCase();
    if (map[hexUpper]) {
      changed = true;
      return `${prefix}-${map[hexUpper]}`;
    }
    return match; // If hex not in map, keep it unchanged
  });

  if (changed) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

const targetDir = process.argv[2] || 'app';
walkDir(path.join(process.cwd(), targetDir));
console.log('Done!');
