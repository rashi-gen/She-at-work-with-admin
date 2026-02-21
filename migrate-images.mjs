// fix-remaining.mjs
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import crypto from 'crypto';
import https from 'https';
import http from 'http';
import path from 'path';
import os from 'os';

const TEMP_DIR = os.tmpdir();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Exactly the 3 remaining items
const REMAINING = [
  {
    file: './src/data/Blogs.ts',
    url: 'https://sheatwork.com/wp-content/uploads/2022/05/medium-shot-people-working-together.jpg',
    folder: 'blogs-images',
    resourceType: 'image',
  },
  {
    file: './src/data/news.ts',
    url: 'https://sheatwork.com/wp-content/uploads/2020/09/sheatwork-AatmaNirbharShe-Focus-Bihar-report.pdf',
    folder: 'news-images',
    resourceType: 'raw', // ✅ PDF must use 'raw'
  },
];

function getPublicId(url) {
  const filename = url.split('/').pop()?.split('?')[0] || 'file';
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
  const hash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
  return `${hash}-${nameWithoutExt}`;
}

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    const ext = path.extname(url.split('?')[0]) || '.bin';
    const filename = path.join(TEMP_DIR, `fix-${Date.now()}${ext}`);
    const file = fs.createWriteStream(filename);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(filename);
        return downloadFile(response.headers.location).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(filename); });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function compressIfNeeded(filePath, resourceType) {
  if (resourceType !== 'image') return filePath;
  const size = fs.statSync(filePath).size;
  if (size <= 10 * 1024 * 1024) return filePath;

  console.log(`   ⚠️  Too large (${(size/1024/1024).toFixed(1)} MB), compressing...`);
  const { default: sharp } = await import('sharp');
  const out = filePath.replace(/\.[^/.]+$/, '') + '-compressed.jpg';
  await sharp(filePath).resize({ width: 1920, withoutEnlargement: true }).jpeg({ quality: 75 }).toFile(out);
  console.log(`   🗜️  Compressed to ${(fs.statSync(out).size/1024/1024).toFixed(1)} MB`);
  return out;
}

async function run() {
  console.log('🔧 Fixing 3 remaining WordPress URLs...\n');

  // Group by file so we only read/write each file once
  const byFile = {};
  for (const item of REMAINING) {
    if (!byFile[item.file]) byFile[item.file] = [];
    byFile[item.file].push(item);
  }

  let totalSuccess = 0;
  let totalFail = 0;

  for (const [filePath, items] of Object.entries(byFile)) {
    console.log(`📄 Processing: ${filePath}`);
    let content = fs.readFileSync(filePath, 'utf-8');

    for (const { url, folder, resourceType } of items) {
      const emoji = resourceType === 'raw' ? '📄' : resourceType === 'video' ? '🎥' : '🖼️';
      console.log(`\n${emoji} ${path.basename(url)}`);

      try {
        const publicId = getPublicId(url);

        // Resume: check if already on Cloudinary
        try {
          const existing = await cloudinary.api.resource(publicId, { resource_type: resourceType });
          console.log(`   ⏭ Already on Cloudinary: ${existing.secure_url}`);
          replaceInContent(content, url, existing.secure_url);
          content = replaceInContent(content, url, existing.secure_url);
          totalSuccess++;
          continue;
        } catch {}

        console.log(`   📥 Downloading...`);
        const tempFile = await downloadFile(url);
        console.log(`   📦 ${(fs.statSync(tempFile).size/1024/1024).toFixed(1)} MB`);

        const uploadFile = await compressIfNeeded(tempFile, resourceType);

        const result = await cloudinary.uploader.upload(uploadFile, {
          public_id: publicId,
          overwrite: false,
          resource_type: resourceType,
          asset_folder: folder,
          use_filename: false,
        });

        fs.unlink(tempFile, () => {});
        if (uploadFile !== tempFile) fs.unlink(uploadFile, () => {});

        content = replaceInContent(content, url, result.secure_url);
        console.log(`   ✅ ${result.secure_url}`);
        totalSuccess++;
      } catch (err) {
        console.error(`   ❌ ${err.message}`);
        totalFail++;
      }
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`\n💾 Saved: ${filePath}`);
  }

  console.log('\n─────────────────────────────────');
  console.log(`✅ Successful: ${totalSuccess}`);
  console.log(`❌ Failed:     ${totalFail}`);
  if (totalFail === 0) console.log('\n🎉 All WordPress URLs fully migrated!');
}

function replaceInContent(content, originalUrl, newUrl) {
  // Replace escaped version (with \/)
  const escapedUrl = originalUrl.replace(/\//g, '\\/');
  const escapedPattern = escapedUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Replace unescaped version
  const unescapedPattern = originalUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  return content
    .replace(new RegExp(escapedPattern, 'g'), newUrl)
    .replace(new RegExp(unescapedPattern, 'g'), newUrl);
}

run().catch(console.error);
