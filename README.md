# StockLens Operations Intelligence

StockLens is a local-first inventory and IMEI operations web app prepared from the supplied `amaya_log_BOT.xlsx` master register. It is intentionally built as plain HTML, CSS, and JavaScript so it can be uploaded directly to InfinityFree without Node.js or a build step.

## Included behavior

The app loads the cleaned master data from `data/records.json`. It normalizes the 49 legacy dates that appeared before 2020 to **2026-08-01**, keeps August 2026 as the operational period, and skips two exact repeated source fingerprints. It does not erase genuine IMEI history: if one individual IMEI appears in multiple sale, repair, stock, resell, or other records, StockLens flags it as an **actual duplicate** and the IMEI Intelligence view shows the full event history.

Import is available for `.xlsx`, `.xls`, `.csv`, and `.json`. Imported rows are normalized and only fingerprints not already in the browser register are added. Export downloads the current register as CSV. The Inventory view is filterable by search, wing, status, and date. Offers and stock allocations are saved locally in the browser and can later be synced to Supabase using the included schema.

The interface supports English, Bengali, and Chinese. Currency display supports Bangladeshi taka (BDT), Chinese yuan (CNY), and US dollars (USD). The default rates in `app.js` are editable business display rates, not a live financial feed.

## InfinityFree deployment

1. Unzip the package.
2. Upload **all contents** into the domain's `public_html` folder in the InfinityFree file manager or FTP client.
3. Keep `index.html`, `app.js`, `styles.css`, `supabase-config.js`, and the complete `data` folder together.
4. Open the domain. No build command is required.

The `.htaccess` file provides a clean fallback for client-side navigation and browser caching.

## GitHub Pages

Create a repository, upload the same files, enable **Settings → Pages → Deploy from branch**, and select the root folder. The app is static and does not require GitHub Actions.

## Supabase option

Create a Supabase project, open the SQL editor, and run `supabase-schema.sql`. If cloud sync is added later, place only the project URL and public anon key in `supabase-config.js`. Never put a `service_role` key in frontend files. The current app remains fully usable without Supabase because it stores edits in the browser's local storage.

## Source workbook notes

The ZIP also contained `Logistics_ Un_CP.xlsx`, which is a large operational workbook with many source sheets, and an empty `uno task yeasin.xlsx`. The production register is based on the already consolidated `amaya_log_BOT.xlsx` → `Master_Records` sheet because it contains the normalized 24,209-row operational register, IMEI master index, summaries, and exceptions. The empty workbook is intentionally not imported.

## IMEI audit workspace

Open **IMEI intelligence** and search an IMEI. For repeated IMEIs, StockLens now shows a chronological event timeline with date, inferred event type, model, customer/party, status, and source workbook/sheet. It also compares model, party, and status changes.

The review panel provides non-final decision signals:

- **Ownership check:** likely ours when an inventory, receiving, lot, warehouse, stock, or master event is present; otherwise it requests ownership proof.
- **Warranty signal:** review eligible when a sale and return are linked and the return occurs within 365 days of the latest sale event.
- **Refund signal:** refund review when both a sale and a return are linked in chronological order.
- **Review flags:** missing inventory evidence, return without sale, model changes, customer changes, and status changes.

These are decision-support rules, not a legal warranty or refund approval. The source invoice, delivery record, return authorization, device condition, and warranty policy should still be checked before approval.
