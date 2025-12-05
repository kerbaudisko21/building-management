#!/usr/bin/env ts-node

/**
 * PWA Icon Generator (TypeScript)
 *
 * Prerequisites:
 * npm install sharp @types/sharp
 * npm install -g ts-node typescript
 *
 * Usage:
 * 1. Place your source icon (at least 512x512) in: public/icon-source.png
 * 2. Run: ts-node generate-icons.ts
 *    OR: npx ts-node generate-icons.ts
 * 3. Icons will be generated in: public/icons/
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Icon sizes for PWA
const sizes: number[] = [72, 96, 128, 144, 152, 192, 384, 512];

// Paths
const iconsDir = path.join(process.cwd(), 'public', 'icons');
const sourceIcon = path.join(process.cwd(), 'public', 'icon-source.png');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Check if source icon exists
if (!fs.existsSync(sourceIcon)) {
    console.error('❌ Error: icon-source.png not found in public/');
    console.log('📝 Please add a source icon (at least 512x512) at: public/icon-source.png');
    process.exit(1);
}

// Generate icons
async function generateIcons(): Promise<void> {
    console.log('🎨 Generating PWA icons...\n');

    for (const size of sizes) {
        const outputPath = path.join(iconsDir, `icon-${size}x${size}.png`);

        try {
            await sharp(sourceIcon)
                .resize(size, size, {
                    fit: 'contain',
                    background: { r: 99, g: 102, b: 241, alpha: 1 } // Indigo-500
                })
                .png()
                .toFile(outputPath);

            console.log(`✅ Generated: icon-${size}x${size}.png`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error(`❌ Error generating ${size}x${size}:`, errorMessage);
        }
    }

    console.log('\n🎉 All icons generated successfully!');
    console.log('📁 Icons location: public/icons/');
}

// Run generator
generateIcons().catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
});