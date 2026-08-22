"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { downloadProductCsvTemplate, PRODUCT_CSV_HEADERS } from "@/lib/product-csv";
import { downloadProductExcelTemplate, exportRowsToExcel } from "@/lib/product-excel";

type ImportRow = Record<string, unknown>;

type PreviewRow = {
  row: number;
  id: string;
  name: string;
  slug: string;
  action: "create" | "update";
  issues: string[];
  pricingTiers: { min_days: number; per_day_cents: number }[];
  sourceRow?: ImportRow;
};

type ImportResponse = {
  error?: string;
  rows?: PreviewRow[];
  created?: number;
  updated?: number;
  skipped?: number;
  imported?: number;
};

async function readImportResponse(response: Response): Promise<ImportResponse> {
  const responseText = await response.text();
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    if (responseText.trimStart().startsWith("<")) {
      throw new Error(
        `The import service returned an HTML page (${response.status}). Refresh the admin page, sign in again, and try the upload once more.`,
      );
    }
    throw new Error(`The import service returned an unexpected response (${response.status}).`);
  }

  try {
    return JSON.parse(responseText) as ImportResponse;
  } catch {
    throw new Error(`The import service returned invalid JSON (${response.status}).`);
  }
}

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

const ROWS_PER_PAGE = 50;

export default function ImportProductsPage() {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [importSummary, setImportSummary] = useState<{ created: number; updated: number; skipped?: number } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllRows, setShowAllRows] = useState(false);
  const [showOnlyInvalid, setShowOnlyInvalid] = useState(false);

  const previewImport = async (nextRows: ImportRow[]) => {
    setLoading(true);
    setError("");
    setNotice("");
    setImportSummary(null);
    setCurrentPage(1);
    try {
      const response = await fetch("/api/admin/products/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "preview", products: nextRows }),
      });
      const data = await readImportResponse(response);
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
    setImportSummary(null);
    let parsedRows: ImportRow[] = [];

    if (file.name.toLowerCase().endsWith(".csv") || file.name.toLowerCase().endsWith(".txt")) {
      parsedRows = parseCsv(await file.text());
    } else if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) {
      // For Excel files, we'll send to the API for parsing
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", "preview");

      setLoading(true);
      setError("");
      setNotice("");
      try {
        const response = await fetch("/api/admin/products/import", {
          method: "POST",
          body: formData,
        });
        const data = await readImportResponse(response);
        if (!response.ok) throw new Error(data.error || "Could not preview this file");
        setPreview(data.rows || []);
        // We need to get the parsed rows for commit
        // For Excel, we'll store the file and re-upload on commit
        (window as unknown as { __excelFile?: File }).__excelFile = file;
      } catch (previewError) {
        setPreview([]);
        setError(previewError instanceof Error ? previewError.message : "Could not preview this file");
      } finally {
        setLoading(false);
      }
      return;
    } else {
      setError("Unsupported file format. Please use CSV or Excel (.xlsx)");
      setPreview([]);
      return;
    }

    setRows(parsedRows);
    if (parsedRows.length === 0) {
      setPreview([]);
      setError("The file needs a header row and at least one product row.");
      return;
    }
    await previewImport(parsedRows);
  };

  const downloadCsvTemplate = downloadProductCsvTemplate;
  const downloadExcelTemplate = downloadProductExcelTemplate;

  const exportInvalidRows = () => {
    const exportRows = invalidRows
      .map((row) => row.sourceRow)
      .filter((row): row is ImportRow => Boolean(row));

    if (exportRows.length === 0) return;

    const baseName = (fileName || "import").replace(/\.[^.]+$/, "");
    exportRowsToExcel(exportRows, `${baseName}-issues.xlsx`);
  };

  const commitImport = async () => {
    setImporting(true);
    setError("");
    try {
      // Check if we have an Excel file stored
      const excelFile = (window as unknown as { __excelFile?: File }).__excelFile;
      if (excelFile && !rows.length) {
        // Upload Excel file for commit
        const formData = new FormData();
        formData.append("file", excelFile);
        formData.append("mode", "commit");

        const response = await fetch("/api/admin/products/import", {
          method: "POST",
          body: formData,
        });
        const data = await readImportResponse(response);
        if (!response.ok) throw new Error(data.error || "Import failed");
        setImportSummary({ created: data.created || 0, updated: data.updated || 0, skipped: data.skipped || 0 });
        const skippedSuffix = (data.skipped || 0) > 0 ? ` ${data.skipped} row${data.skipped === 1 ? "" : "s"} skipped because they had issues.` : "";
        setNotice(`${data.imported} product${data.imported === 1 ? "" : "s"} saved to the database.${skippedSuffix}`);
        delete (window as unknown as { __excelFile?: File }).__excelFile;
      } else {
        // Use JSON rows (CSV path)
        const response = await fetch("/api/admin/products/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "commit", products: rows }),
        });
        const data = await readImportResponse(response);
        if (!response.ok) throw new Error(data.error || "Import failed");
        setImportSummary({ created: data.created || 0, updated: data.updated || 0, skipped: data.skipped || 0 });
        const skippedSuffix = (data.skipped || 0) > 0 ? ` ${data.skipped} row${data.skipped === 1 ? "" : "s"} skipped because they had issues.` : "";
        setNotice(`${data.imported} product${data.imported === 1 ? "" : "s"} saved to the database.${skippedSuffix}`);
      }
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
  const validRows = preview.filter((row) => row.issues.length === 0);

  // Filter and paginate rows
  const filteredPreview = useMemo(() => {
    let result = preview;
    if (showOnlyInvalid) {
      result = invalidRows;
    }
    return result;
  }, [preview, invalidRows, showOnlyInvalid]);

  const paginatedRows = useMemo(() => {
    if (showAllRows) return filteredPreview;
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredPreview.slice(start, start + ROWS_PER_PAGE);
  }, [filteredPreview, currentPage, showAllRows]);

  const totalPages = Math.ceil(filteredPreview.length / ROWS_PER_PAGE);

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-sm text-neutral-500 hover:text-white">← Products</Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Import Products</h1>
          <p className="mt-1 text-sm text-neutral-500">Import a reviewed catalogue without publishing unfinished listings. Valid rows are imported immediately; rows with issues are skipped and listed below.</p>
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
      {notice && <div className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-300">{notice}</div>}
      {importSummary && (
        <div className="mb-4 rounded-lg border border-teal-500/20 bg-teal-500/10 p-4 text-sm text-teal-100">
          <p className="font-semibold">Import complete</p>
          <p className="mt-1 text-teal-200">{importSummary.updated} updated · {importSummary.created} created · 0 duplicates created</p>
        </div>
      )}

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-white">1. Prepare your file</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-400">
              Exported rows update the matching product by ID. Leave the ID blank only for genuinely new products; the database will assign their IDs automatically. The brand column may be left blank. Images are deliberately not imported from computer paths; upload each image through the product editor before activating the item.
              Choose CSV or Excel format — both use the same column structure.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-400">
              Use <span className="font-mono text-neutral-300">category_slug</span> for the primary owner. Optional secondary categories are pipe-separated in <span className="font-mono text-neutral-300">secondary_category_slugs</span>.
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={downloadCsvTemplate} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800">Download CSV template</button>
            <button onClick={downloadExcelTemplate} className="rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-200 hover:bg-neutral-800">Download Excel template</button>
          </div>
        </div>
        <p className="mt-4 font-mono text-xs text-teal-300">{PRODUCT_CSV_HEADERS.join(", ")}</p>
      </section>

      <section className="mt-5 rounded-xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="font-semibold text-white">2. Upload and preview</h2>
        <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-8 text-center transition-colors hover:border-teal-500/60">
          <span className="text-sm text-neutral-300">{loading ? "Checking catalogue rows..." : fileName || "Choose a CSV or Excel file"}</span>
          <input type="file" accept=".csv,text/csv,.xlsx,.xls" disabled={loading} className="sr-only" onChange={(event) => {
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
              <p className="mt-1 text-sm text-neutral-400">
                {preview.length} row{preview.length === 1 ? "" : "s"} checked ·
                {invalidRows.length === 0
                  ? <span className="text-emerald-400">All valid — ready to import</span>
                  : <span className="text-amber-300">{invalidRows.length} need attention, {validRows.length} valid</span>}
              </p>
            </div>
            <button
              onClick={() => void commitImport()}
              disabled={importing || preview.length === 0 || validRows.length === 0}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {importing ? "Saving to database..." : "Import to Database"}
            </button>
          </div>

          {/* Filter controls */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            <label className="flex items-center gap-2 text-neutral-300">
              <input
                type="checkbox"
                checked={showOnlyInvalid}
                onChange={(e) => { setShowOnlyInvalid(e.target.checked); setCurrentPage(1); }}
                className="rounded border-neutral-700 text-teal-600 focus:ring-teal-500"
              />
              Show only rows with issues ({invalidRows.length})
            </label>
            <button
              onClick={exportInvalidRows}
              disabled={invalidRows.length === 0}
              className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
              title="Download the rows with issues as an Excel file you can edit and re-upload"
            >
              <span aria-hidden="true">📥</span> Export issue rows
            </button>
            <label className="flex items-center gap-2 text-neutral-300">
              <input
                type="checkbox"
                checked={showAllRows}
                onChange={(e) => { setShowAllRows(e.target.checked); setCurrentPage(1); }}
                className="rounded border-neutral-700 text-teal-600 focus:ring-teal-500"
              />
              Show all rows ({filteredPreview.length})
            </label>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="p-3">Row</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {paginatedRows.map((row) => (
                  <tr key={row.row} className={row.issues.length > 0 ? "bg-amber-500/5" : "hover:bg-neutral-800/30"}>
                    <td className="p-3 text-neutral-500 font-mono">{row.row}</td>
                    <td className="p-3 text-white">{row.name || "—"}</td>
                    <td className="p-3 font-mono text-xs text-neutral-400">{row.slug || "—"}</td>
                    <td className="p-3"><span className={row.action === "update" ? "text-sky-300" : "text-teal-300"}>{row.action === "update" ? "Update existing" : "Create new"}</span></td>
                    <td className="p-3">
                      {row.issues.length === 0 ? (
                        <span className="text-emerald-400">Ready as draft</span>
                      ) : (
                        <span className="text-amber-300" title={row.issues.join("\n")}>
                          {row.issues.slice(0, 2).join(" · ")}
                          {row.issues.length > 2 && <span> +{row.issues.length - 2} more</span>}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500">
                      {showOnlyInvalid && invalidRows.length === 0
                        ? "No invalid rows — all rows are valid!"
                        : "No rows to display"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!showAllRows && totalPages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-neutral-500">
                Showing {Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filteredPreview.length)}–{Math.min(currentPage * ROWS_PER_PAGE, filteredPreview.length)} of {filteredPreview.length} rows
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 text-sm text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-neutral-400">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-neutral-700 text-sm text-neutral-300 hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {showAllRows && filteredPreview.length > ROWS_PER_PAGE && (
            <p className="mt-3 text-xs text-neutral-500">Showing all {filteredPreview.length} rows. Uncheck &quot;Show all rows&quot; to enable pagination.</p>
          )}
        </section>
      )}
    </div>
  );
}
