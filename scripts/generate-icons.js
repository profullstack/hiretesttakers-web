/**
 * Icon Generator Script
 * 
 * Generates all necessary favicon and app icons from a source logo image.
 * Supports PWA, iOS, Android, and desktop platforms.
 * 
 * Usage: node scripts/generate-icons.js [source-image-path]
 * Example: node scripts/generate-icons.js static/logo.png
 */

import sharp from 'sharp';
import { mkdir, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Icon sizes needed for different platforms
const ICON_SIZES = [
  // Favicon
  { name: 'favicon.ico', size: 32, format: 'png' },
  { name: 'favicon-16x16.png', size: 16, format: 'png' },
  { name: 'favicon-32x32.png', size: 32, format: 'png' },
  
  // Apple Touch Icons
  { name: 'apple-touch-icon.png', size: 180, format: 'png' },
  { name: 'apple-touch-icon-57x57.png', size: 57, format: 'png' },
  { name: 'apple-touch-icon-60x60.png', size: 60, format: 'png' },
  { name: 'apple-touch-icon-72x72.png', size: 72, format: 'png' },
  { name: 'apple-touch-icon-76x76.png', size: 76, format: 'png' },
  { name: 'apple-touch-icon-114x114.png', size: 114, format: 'png' },
  { name: 'apple-touch-icon-120x120.png', size: 120, format: 'png' },
  { name: 'apple-touch-icon-144x144.png', size: 144, format: 'png' },
  { name: 'apple-touch-icon-152x152.png', size: 152, format: 'png' },
  { name: 'apple-touch-icon-180x180.png', size: 180, format: 'png' },
  
  // Android/Chrome
  { name: 'android-chrome-192x192.png', size: 192, format: 'png' },
  { name: 'android-chrome-512x512.png', size: 512, format: 'png' },
  
  // Microsoft
  { name: 'mstile-70x70.png', size: 70, format: 'png' },
  { name: 'mstile-144x144.png', size: 144, format: 'png' },
  { name: 'mstile-150x150.png', size: 150, format: 'png' },
  { name: 'mstile-310x150.png', size: 310, width: 310, height: 150, format: 'png' },
  { name: 'mstile-310x310.png', size: 310, format: 'png' },
  
  // PWA
  { name: 'icon-192.png', size: 192, format: 'png' },
  { name: 'icon-512.png', size: 512, format: 'png' },
  
  // Desktop/Linux
  { name: 'icon-48x48.png', size: 48, format: 'png' },
  { name: 'icon-72x72.png', size: 72, format: 'png' },
  { name: 'icon-96x96.png', size: 96, format: 'png' },
  { name: 'icon-128x128.png', size: 128, format: 'png' },
  { name: 'icon-256x256.png', size: 256, format: 'png' }
];

async function ensureDir(dirPath) {
  try {
    await access(dirPath);
  } catch {
    await mkdir(dirPath, { recursive: true });
  }
}

async function generateIcons(sourcePath) {
  const outputDir = join(__dirname, '..', 'static', 'icons');
  
  console.log('🎨 Generating icons from:', sourcePath);
  console.log('📁 Output directory:', outputDir);
  
  await ensureDir(outputDir);
  
  // Load source image
  const sourceImage = sharp(sourcePath);
  const metadata = await sourceImage.metadata();
  
  console.log(`📐 Source image: ${metadata.width}x${metadata.height} (${metadata.format})`);
  
  if (metadata.width < 512 || metadata.height < 512) {
    console.warn('⚠️  Warning: Source image should be at least 512x512 for best results');
  }
  
  let generated = 0;
  let failed = 0;
  
  // Generate each icon size
  for (const icon of ICON_SIZES) {
    try {
      const outputPath = join(outputDir, icon.name);
      
      let resizer = sharp(sourcePath);
      
      if (icon.width && icon.height) {
        // Custom dimensions (e.g., for wide tiles)
        resizer = resizer.resize(icon.width, icon.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        });
      } else {
        // Square icons
        resizer = resizer.resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        });
      }
      
      await resizer.png().toFile(outputPath);
      
      console.log(`✅ Generated: ${icon.name}`);
      generated++;
    } catch (error) {
      console.error(`❌ Failed to generate ${icon.name}:`, error.message);
      failed++;
    }
  }
  
  console.log(`\n🎉 Icon generation complete!`);
  console.log(`   Generated: ${generated} icons`);
  if (failed > 0) {
    console.log(`   Failed: ${failed} icons`);
  }
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Add icon links to src/app.html`);
  console.log(`   2. Create static/manifest.json for PWA`);
  console.log(`   3. Test icons on different devices`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  // Check for --source flag
  const sourceIndex = args.indexOf('--source');
  if (sourceIndex !== -1 && args[sourceIndex + 1]) {
    return args[sourceIndex + 1];
  }
  
  // Check for positional argument (no flag)
  if (args.length > 0 && !args[0].startsWith('--')) {
    return args[0];
  }
  
  // Default
  return join(__dirname, '..', 'static', 'favicon.png');
}

// Main execution
const sourcePath = parseArgs();

try {
  await generateIcons(sourcePath);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('\n💡 Usage:');
  console.error('   node scripts/generate-icons.js');
  console.error('   node scripts/generate-icons.js path/to/logo.svg');
  console.error('   node scripts/generate-icons.js --source path/to/logo.svg');
  process.exit(1);
}