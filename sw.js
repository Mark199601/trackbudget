// TrackBudget Service Worker
// Caches the app shell so it works offline.
// Strategy: network-first for the app HTML (so updates show immediately when online,
// falling back to cache when offline), cache-first for static assets,
// always skip Google API calls (they need fresh auth).

const CACHE = 'trackbudget-v1-2-19-29'; // -29: the statement card is drawn at the width it is shown, so its text matches the app's sizes (PSS #689), no border line (PSS #690, #692), same text sizes, colours and side-by-side buttons as the details (PSS #693); a reimbursement payment's details have one Edit button and the page link in its note (PSS #690). Earlier -28: buttons in a transaction's details are the same size as the Discard question (PSS #686); Share statement is a plain share icon at the top (PSS #687, #688). Earlier -27: fees show as a red pill beside the name, colored icon squares (PSS #679); a change made just before leaving the app is saved when you come back (PLS #680); split bills, loans and batch payments show a status line, tap it for a popup with who paid and when (PSS #681); loans and loan payments have Edit in their details like every other entry (PSS #682, PLS #683); Receipt replaced by Share statement on split bills and loans (PSS #684), shown as a clean statement card sent as a picture (PSS #685). Earlier -26: Loan profit and Rate change sit under their payment again, shown by its pill (PLS #678). Earlier -25: a gain or loss on a transfer or reimbursement shows as a pill beside its name (PSS #677). Earlier -24: Who paid? shows Me, Loans and Reimbursements in their own boxes (PSS #676). Earlier -23: Who paid? lists Loans and Reimbursements apart, extra over what they owe is your gain (PLS #675). Includes -22: budget plan, clear locks, limit edited at the top without moving rows, Top up to usual, bills first with a not-a-bill x, ring numbers centred (#667-#674). Earlier -21: inside a Settings page or report, just a back arrow in the heading (PSS #666). Earlier -20: smoother moves: popups fade and zoom, sections fade in, reports and Settings pages slide in and back (PSS #665). Earlier -19: 36 theme colors, lightest to darkest in each group, Purple marked default (PSS #664). Earlier -18: iPhone top bar matches the heading color (PSS #662), heading fixed at the top (PSS #663). Earlier -17: page heading sharp on newer iPhones, fixed strip at the top edge (PSS #661). Earlier -16: theme color saved with your data and synced to your other devices, Light/Dark stays per device (PLS #658). Heading no longer blurred on iPhone (PSS #659). Earlier -15: theme color, 30 choices in Settings (PSS #657), tighter Dashboard top (PSS #656). Earlier -14: new Dashboard look: crystal mosaic balance card, Income/Spent/Kept tiles, Budgets and goals with rings, Kept each month chart, Recent grouped by day (PSS #655). Earlier -13: Import backup refuses a file that is not a TrackBudget backup (PLS #633), net worth chart on iPad (PSS #634), tidier screens: empty accounts folded, heatmap from the first month, chart labels, Calendar on a computer (PSS #635), Account health one line (PSS #636), thin Trends bars (PSS #637), budget and contract pace lines (PSS #638, #639), forms polish: fee rows, amber Archive and Write off, linked payments list with unlink one, Split with, Total received, installment category groups, growing notes, vacation trips grouped (PSS #640-#651), Undo write-off reopens the loan (PLS #652), Receive total follows the account currency (PLS #653), sync keeps typed-in installment months (PLS #654). Earlier -12: -12: 55 more emoji (PSS #616), emoji search by word and every emoji with keywords (PSS #617, #618), 68 line icons for main categories (PSS #619), cleaner icon row in forms (PSS #620), icons suggested while typing a name (PSS #621), money and shopping words in icon search (PSS #622), word forms and newer words (PSS #623), whole-word icon and category guesses (PSS #624), subcategory names in normal text and a tighter top on the PC Settings page, page centred on a big screen (PSS #625), category helper finds the right place in your own categories (PLS #626), Ways to save reads whole words (PLS #627), ATM alert whole word (PLS #628), mid-month budget alert uses the budget's own spending (PLS #629), second look at those fixes: more need words, starter ATM subcategory kept after a rename, no tip when two categories tie (PLS #630). Earlier -11: more emoji in the icon list, all from Unicode 11 or older (PSS #615). Earlier -10: account card amount fits (PSS #613), Edit forms and Bank reconciliation in the Add list look (PSS #614). Earlier -9: answers kept only while a screen is drawn, so a save step never reads an old one (PLS #592), P0.01 owed on a split bill is not Paid in full (PLS #593), old payments editable by part (PLS #594), old loan note kept (PLS #595), sync never asks about Loan profit entries (PLS #596), no arrows in amount boxes (PSS #597), small wording and date fixes (PSS #598), amounts with commas in edit forms and tidier rows (PSS #599), first letter no longer cut in edit forms (PSS #600), centavos and icons (PSS #601), Planning top buttons follow the tab (PSS #602), contract buckets planned like a budget in the home currency (PLS #603), one time left for Contract, Dashboard and Analytics (PLS #604), linked accounts on top of a bucket sheet (PSS #605), contract milestones follow its dates and day count starts at 1 (PLS/PSS #606), an account counts in one bucket only, date checks in Edit contract, past contracts labelled right (PLS/PSS #607), deleted, archived or sold links handled in buckets (PLS/PSS #608), whole-app check: edit forms refuse an amount under half a centavo and a refused save changes nothing (PLS #609), an investment worth 0 stays 0, archive of an account with money asks first (PLS #610), Add loan, investment, budget and installment forms refuse bad numbers (PLS #611). Earlier -8: a loan paid back in parts books its profit by the running total (PLS #586), write-off at cost (PLS #587), paid in full to the centavo (PLS #588), an extra P0.01 booked (PLS #589), centavos on what is left and P0.01 owed in net worth (PLS #590), Combine both not asking about an installment end date from an older save (PLS #591). Earlier -7: expected receivable in the same currency (PLS #585), faster screens (PLS #584), installment end month (PLS #580), setup screen for new users (PLS #581), month before in every time zone (PLS #582), keep data (PLS #583). Earlier -6: one counting rule for the Overview donut, Year over year and Today strip (PLS #576); rate history fits a phone, plain Calendar totals, line icons for alerts, Vacation Discard back to list (PSS #576); one main button colour (PSS #577); Re-categorize and Reset app in form look (PSS #578); 4 account cards a row on a computer (PSS #579). Earlier -5: audit fixes, one button and heading look, one desktop width, one balance rule and one budget-spend rule, faster Dashboard and Overview, storage-full popup (PLS/PSS #575); External party letter, Nov 1-30, backup reminder once, names with symbols on more screens, wording (PLS/PSS #574). Earlier -4: names with symbols shown exactly as typed and their buttons work (PLS #573), Overview income donut counts forgiven debt (PLS #572), spending heatmap counts days like monthly spending (PLS #570), Income diversification names sources as Income (PLS #569). Earlier -3: tap a payment under a bill or loan to edit just that part, sync keeps running totals right when both devices changed the same thing (PLS #566), Compare before syncing with Combine both (PLS #567), Combine both keeps deletes, takes linked entries with a left-out one, marks entries added twice, lets one-side accounts, loans and installments be left out, newer save wins single values (PLS #568). -2: Analytics debug: smart alerts on local time and month vs month (PLS #555, #556), 13 unseen checks retired (PSS #557), Calendar bill currency (PLS #558), By day follows the period (PLS #559), rate reminder (PLS #560), Exchange rates start at the first rate (PLS #561). Summary income vs all of last month (PLS #562), Vacation days left out of usual spending (PLS/PSS #563). One cash figure (PLS #564), crypto guides 2 decimals (PSS #565). fee in Edit remittance and Edit transfer (PLS #550), amount sign follows the account in Edit remittance (PSS #551). Edit has what Add has: outside party, installment total and category, transfer fee payer (PLS #552). Budget name in Edit budget (PLS #553), unused Add target removed (PSS #554). -1: gain or loss pill on loan payments (PSS #548), sync no longer asks about Insights notes (PLS #549). // v1.2.19: loan profit and rate change on every payment (PLS #542-#546), Paid by in Edit (#537), net worth trend (#538), centavos (#543), retired dead screens (PSS #547). Was v1.2.18: Paid by someone who owes you, a loan paid back by paying for your expense (PLS #533, PSS #534). Was v1.2.17: currency conversions everywhere, loan and split-bill payment fixes, edit forms follow the account currency, investments same-currency accounts (PLS/PSS #489-#532). Was v1.2.16: Ways to save on the Dashboard with a pop-up, warning while adding, Insights Summary on top (PLS/PSS #487, #488), Analytics fixes (PLS #484, #486, PSS #485). Was -15-1: Analytics fixes, minus in Saved and Savings rate, Expenses and Budgets not cut, 80/20 opens that month (PLS #484, #486, PSS #485). v1.2.15 (his call: major change gets a new number). Was -14-11: flexible Transactions filter, several types, accounts and categories, amount range, quick dates, summary card (PLS #481), Discard changes? line lined up (PSS #482), Insights tile amounts no longer cut on small phones (PSS #483). -10: Transactions in an account shows only that account (PLS #480). -9: Undo last sync copy moved to IndexedDB (PLS #479). -8: account sheet buttons no longer spread out on PC (PSS #477 fix). v1.2.14 continued: Excel export offline, receivables per person, plain wording, bigger tap areas, Add from an account, no Idle alert (PLS #473-#474, #477-#478, PSS #475-#476); PLS #631: amounts keep their currency's decimals in loans/investments/fees/budget limits, bucket plan Apply spreads first, installment months check only when changed, plural rule skips news/bus/gas; PLS #632: contract goal currency change refills unlocked buckets, balance correction and archive checks use the currency's smallest unit
const APP_SHELL = ['./', './index.html'];
// PLS #473: the Excel export library lives on cdnjs; keep a copy so export works offline
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache => Promise.all([
      cache.addAll(APP_SHELL).catch(() => {}),
      cache.add(new Request(XLSX_URL, { mode: 'cors' })).catch(() => {}) // PLS #473
    ]))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Never intercept Google APIs (Drive auth, etc.) — must hit network
  if (url.includes('googleapis.com') || url.includes('google.com') ||
      url.includes('accounts.google') || url.includes('gstatic.com')) {
    return;
  }
  // Only handle GET
  if (e.request.method !== 'GET') return;

  // Network-first for the app HTML / navigations: always serve the freshest index.html when
  // online (this app is a single HTML file), falling back to cache only when offline. This is
  // what makes a normal refresh pick up new deploys immediately — no double-refresh needed.
  const isAppHtml = e.request.mode === 'navigate' ||
                    url.endsWith('/') || url.endsWith('/index.html');
  if (isAppHtml) {
    e.respondWith(
      fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
        }
        return resp;
      }).catch(() => caches.match(e.request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Return cached, refresh in background
        fetch(e.request).then(resp => {
          if (resp && resp.status === 200 && (resp.type === 'basic' || url === XLSX_URL)) { // PLS #473
            caches.open(CACHE).then(cache => cache.put(e.request, resp));
          }
        }).catch(() => {});
        return cached;
      }
      // Not cached — fetch and cache
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200 && (resp.type === 'basic' || url === XLSX_URL)) { // PLS #473
          const respClone = resp.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, respClone));
        }
        return resp;
      }).catch(() => caches.match('./index.html'));
    })
  );
});

// Listen for manual cache refresh
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
  if (e.data === 'CLEAR_CACHE') {
    caches.delete(CACHE).then(() => e.source.postMessage('CACHE_CLEARED'));
  }
});
