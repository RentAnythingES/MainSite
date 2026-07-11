"use client";

import Link from "next/link";
import { useState } from "react";

type ImportRow = Record<string, string>;

type PreviewRow = {
  row: number;
  name: string;
  slug: string;
  issues: string[];
  pricingTiers: { min_days: number; per_day_cents: number }[];
};

const TEMPLATE = `name,brand,category_slug,subcategory,description,stock_total,price_1_day,price_3_days,price_7_days,price_14_days
Example Compact Stroller,Example Brand,baby-gear,Strollers,Lightweight stroller for families visiting Valencia,1,20,15,11,8`;

function parseCsv(csv: string): ImportRow[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(cell.trim());
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(cell.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  row.push(cell.trim());
  if (row.some(Boolean)) rows.push(row);
  if (rows.length < 2) return [];

  const headers = rows[0].map((header) => header.trim().toLowerCase());
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

export default function ImportProductsPage() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const previewImport = async (nextRows: ImportRow[]) => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "preview", products: nextRows }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not preview this file");
      setPreview(data.rows || []);
    } catch (previewError) {
      setPreview([]);
      setError(previewError instanceof Error ? previewError.message : "Could not preview this file");
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const parsedRows = parseCsv(await file.text());
    setRows(parsedRows);
    if (parsedRows.length === 0) {
      setPreview([]);
      setError("The CSV needs a header row and at least one product row.");
      return;
    }
    await previewImport(parsedRows);
  };

  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([TEMPLATE], { type: "text/csv;charset=utf-8" }));
    link.download = "rentanything-product-import-template.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const commitImport = async () => {
    setImporting(true);
    setError("");
    try {
      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "commit", products: rows }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Import failed");
      setNotice(`${data.imported} product${data.imported === 1 ? "" : "s"} imported as inactive drafts. Add an image, review the information, then activate each product.`);
      setRows([]);
      setPreview([]);
      setFileName("");
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const invalidRows = preview.filter((row) => row.issues.length > 0);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-white">← Products</Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Import Products</h1>
          <p className="mt-1 text-sm text-neutral-500">Import a reviewed catalogue without publishing unfinished listings.</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      {notice && <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</div>}

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-white">1. Prepare your CSV</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-400">
              Products import as inactive drafts. Images are deliberately not imported from computer paths; upload each image through the product editor before activating the item.
            </p>
          </div>
          <button onClick={downloadTemplate} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800">Download template</button>
        </div>
        <p className="mt-4 font-mono text-xs text-teal-300">name, brand, category_slug, subcategory, description, stock_total, price_1_day, price_3_days, price_7_days, price_14_days</p>
      </section>

      <section className="mt-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="font-semibold text-white">2. Upload and preview</h2>
        <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-8 text-center transition-colors hover:border-teal-500/60">
          <span className="text-sm text-neutral-300">{loading ? "Checking catalogue rows..." : fileName || "Choose a CSV file"}</span>
          <input type="file" accept=".csv,text/csv" disabled={loading} className="sr-only" onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void handleFile(file);
            event.currentTarget.value = "";
          }} />
        </label>
      </section>

      {preview.length > 0 && (
        <section className="mt-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-white">3. Review before import</h2>
              <p className="mt-1 text-sm text-neutral-400">{preview.length} row{preview.length === 1 ? "" : "s"} checked · {invalidRows.length === 0 ? "ready to import" : `${invalidRows.length} need attention`}</p>
            </div>
            <button onClick={() => void commitImport()} disabled={importing || invalidRows.length > 0} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40">
              {importing ? "Importing..." : "Import inactive drafts"}
            </button>
          </div>
          <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500"><tr><th className="p-3">Row</th><th className="p-3">Product</th><th className="p-3">Slug</th><th className="p-3">Result</th></tr></thead>
              <tbody className="divide-y divide-neutral-800">
                {preview.slice(0, 30).map((row) => <tr key={row.row}><td className="p-3 text-neutral-500">{row.row}</td><td className="p-3 text-white">{row.name || "—"}</td><td className="p-3 font-mono text-xs text-neutral-400">{row.slug || "—"}</td><td className="p-3">{row.issues.length === 0 ? <span className="text-emerald-400">Ready as draft</span> : <span className="text-amber-300">{row.issues.join(" · ")}</span>}</td></tr>)}
              </tbody>
            </table>
          </div>
          {preview.length > 30 && <p className="mt-3 text-xs text-neutral-500">Showing the first 30 rows. All rows are still validated before import.</p>}
        </section>
      )}
    </div>
  );
}
