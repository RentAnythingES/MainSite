/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const publicDirectory = path.resolve(process.cwd(), "public");
const outputPath = process.env.IMAGE_SEO_AUDIT_OUTPUT;
const rasterExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const expectedFormats = new Map([
  [".avif", "heif"],
  [".gif", "gif"],
  [".jpeg", "jpeg"],
  [".jpg", "jpeg"],
  [".png", "png"],
  [".webp", "webp"],
]);

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(filePath) : [filePath];
  });
}

function publicPath(filePath) {
  return `/${path.relative(publicDirectory, filePath).split(path.sep).join("/")}`;
}

async function inspectAsset(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const bytes = fs.readFileSync(filePath);
  const metadata = await sharp(bytes, { animated: true }).metadata();
  const errors = [];
  const warnings = [];
  const expectedFormat = expectedFormats.get(extension);

  if (bytes.length > 1_500_000) errors.push("asset_exceeds_1_5mb");
  else if (bytes.length > 500_000) warnings.push("asset_exceeds_500kb");
  if (expectedFormat && metadata.format !== expectedFormat) {
    errors.push(`extension_format_mismatch:${extension}:${metadata.format}`);
  }
  if ((metadata.width || 0) > 3000 || (metadata.height || 0) > 3000) {
    warnings.push("dimensions_exceed_3000px");
  }

  return {
    path: publicPath(filePath),
    bytes: bytes.length,
    width: metadata.width || null,
    height: metadata.height || null,
    format: metadata.format || null,
    hash: crypto.createHash("sha256").update(bytes).digest("hex"),
    errors,
    warnings,
  };
}

async function main() {
  const rasterFiles = collectFiles(publicDirectory).filter((filePath) =>
    rasterExtensions.has(path.extname(filePath).toLowerCase()),
  );
  const assets = await Promise.all(rasterFiles.map(inspectAsset));
  const assetsByHash = new Map();
  for (const asset of assets) {
    const group = assetsByHash.get(asset.hash) || [];
    group.push(asset);
    assetsByHash.set(asset.hash, group);
  }
  const duplicateGroups = [...assetsByHash.values()].filter((group) => group.length > 1);
  const errors = assets.flatMap((asset) => asset.errors.map((error) => `${asset.path}:${error}`));
  const warnings = assets.flatMap((asset) => asset.warnings.map((warning) => `${asset.path}:${warning}`));

  for (const group of duplicateGroups) {
    warnings.push(`duplicate_assets:${group.map((asset) => asset.path).join(",")}`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      assets: assets.length,
      totalBytes: assets.reduce((total, asset) => total + asset.bytes, 0),
      errors: errors.length,
      warnings: warnings.length,
      duplicateGroups: duplicateGroups.length,
    },
    errors,
    warnings,
    assets: assets.sort((left, right) => right.bytes - left.bytes),
  };

  if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.summary, null, 2));
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
