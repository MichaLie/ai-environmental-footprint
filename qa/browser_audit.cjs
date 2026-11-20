const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { chromium, request: playwrightRequest } = require('playwright');

const englishUrl = process.env.BASE_URL || 'http://127.0.0.1:4173/index.html';
const czechUrl = new URL('cs.html', englishUrl).href;
const outputDir = path.resolve(__dirname, '../qa-output/playwright');
const checkExternalLinks = process.env.CHECK_EXTERNAL_LINKS === '1';
fs.mkdirSync(outputDir, { recursive: true });

const pageConfig = {
  en: {
    url: englishUrl,
    file: 'index.html',
    lang: 'en',
    otherFile: 'cs.html',
    switchText: 'Česky',
    lensButton: 'System',
    lensText: 'Model size',
    taskButton: 'Problem solving',
    taskNumber: '2,192 J',
    taskBack: 'Conversation',
    scoreText: '5 of 5',
    conclusion: 'The honest answer is conditional, not evasive',
    labels: {
      hero: 'Updated 20 November 2026',
      evidenceEyebrow: 'Sources and methodology',
      evidenceHeading: 'Where the numbers come from',
      methodsSummary: 'Methods and limitations'
    },
    protectedText: ['0.24 Wh', '0.03 gCO₂e', '0.26 mL', '0.14 Wh', '0.06 Wh', '0.02 Wh', '95 J', '2,192 J', '23×', '≈25×', '>100×', '500 mL', '10–50', '66 billion L', 'nearly 800 billion L', '731–1,125 million m³', '24–44 MtCO₂e', '485 TWh', '950 TWh', '1,000 TWh', '+17%', '+50%', '≈77 Wh', '229 kg CO₂e', '3,230 hours', '649 TWh', '521–843 TWh', '9.5–15.3%', '23%', '22%', '5%', '39.3 million', '11,390', '493 tCO₂e', '2.769 million', '32 elements', '1.2–5.0 million', '131.0–224.8 kt', '≥500 kW', '2026 → 2027', '12 May 2026', 'CZK 1 billion']
  },
  cs: {
    url: czechUrl,
    file: 'cs.html',
    lang: 'cs',
    otherFile: 'index.html',
    switchText: 'English',
    lensButton: 'Systém',
    lensText: 'velikost',
    taskButton: 'Řešení problémů',
    taskNumber: '2 192 J',
    taskBack: 'Konverzace',
    scoreText: '5 z 5',
    conclusion: 'Poctivá odpověď závisí na kontextu',
    labels: {
      hero: 'Aktualizováno 20. listopadu 2026',
      evidenceEyebrow: 'Zdroje a metodika',
      evidenceHeading: 'Odkud čísla pocházejí',
      methodsSummary: 'Metody a omezení'
    },
    protectedText: ['0,24 Wh', '0,03 gCO₂e', '0,26 ml', '0,14 Wh', '0,06 Wh', '0,02 Wh', '95 J', '2 192 J', '23×', '≈25×', '>100×', '500 ml', '10–50', '66 miliard l', 'téměř 800 miliard l', '731–1 125 milionů m³', '24–44 Mt CO₂e', '485 TWh', '950 TWh', '1 000 TWh', '+17 %', '+50 %', '≈77 Wh', '229 kg CO₂e', '3 230 hodin', '649 TWh', '521–843 TWh', '9,5–15,3 %', '23 %', '22 %', '5 %', '39,3 milionu', '11 390', '493 t CO₂e', '2,769 milionu', '32 prvků', '1,2–5,0 milionu', '131,0–224,8 kt', '≥500 kW', '2026 → 2027', '12. května 2026', '1 miliardu Kč']
  }
};

const checks = [];
const observations = [];
const failures = [];
const externalLinkAudit = [];
const languageLinkAudit = [];
const directFileAudits = [];
let parityAudit = null;

function check(name, condition, detail = '') {
  const passed = Boolean(condition);
  checks.push({ name, passed, detail });
  if (!passed) failures.push(`${name}${detail ? `: ${detail}` : ''}`);
}

function sameArray(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function inspectViewport(browser, language, viewportLabel, viewport, options = {}) {
  const config = pageConfig[language];
  const label = `${language}-${viewportLabel}`;
  const context = await browser.newContext({
    viewport,
    colorScheme: 'light',
    reducedMotion: options.reducedMotion || 'no-preference'
  });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));
  page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`));

  const response = await page.goto(config.url, { waitUntil: 'networkidle' });
  check(`${label}: page returned HTTP 200`, response && response.status() === 200, response ? String(response.status()) : 'no response');
  await page.evaluate(async () => {
    for (const element of document.querySelectorAll('.reveal')) {
      element.scrollIntoView({ block: 'center' });
      await new Promise(resolve => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(250);

  const revealState = await page.evaluate(() => ({
    shown: document.querySelectorAll('.reveal.in').length,
    total: document.querySelectorAll('.reveal').length
  }));
  check(`${label}: scroll reveals every animated section`, revealState.shown === revealState.total, `${revealState.shown}/${revealState.total}`);
  if (revealState.shown !== revealState.total) {
    await page.evaluate(() => document.querySelectorAll('.reveal').forEach(element => element.classList.add('in')));
  }

  const audit = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const internalLinks = [...document.querySelectorAll('a[href^="#"]')].map(link => link.getAttribute('href'));
    const missingAnchors = internalLinks.filter(href => href === '#' || !document.getElementById(decodeURIComponent(href.slice(1))));
    const externalLinks = [...document.querySelectorAll('a[href^="http"]')];
    const unsafeExternalLinks = externalLinks
      .filter(link => link.target === '_blank')
      .filter(link => !link.relList.contains('noopener') || !link.relList.contains('noreferrer'))
      .map(link => link.href);
    const emptyControls = [...document.querySelectorAll('button, a')]
      .filter(node => !(node.textContent || '').trim() && !node.getAttribute('aria-label'))
      .map(node => node.outerHTML.slice(0, 160));
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(node => ({ level: Number(node.tagName.slice(1)), text: node.textContent.trim() }));
    const headingSkips = headings.slice(1).filter((heading, index) => heading.level > headings[index].level + 1);
    const sectionWithoutH2 = [...document.querySelectorAll('main section')]
      .filter(section => !section.querySelector(':scope > h2'))
      .map(section => section.id || '(no id)');
    const citedSources = [...document.querySelectorAll('sup a[href^="#src-"]')].map(link => link.getAttribute('href'));
    const missingCitedSources = citedSources.filter(href => !document.querySelector(href));
    const relativeFileLinks = [...document.querySelectorAll('a[href]')]
      .map(link => link.getAttribute('href'))
      .filter(href => href && !/^(?:#|https?:|mailto:|tel:|data:)/i.test(href));
    const runtimeAssetRefs = [...document.querySelectorAll(
      'script[src], link[rel="stylesheet"][href], img[src], source[src], video[src], audio[src], iframe[src]'
    )].map(node => node.getAttribute('src') || node.getAttribute('href'));
    const visibleText = document.body.innerText;
    const processFacingPhrases = [
      'validation summary', '13 cited sources', '20 cited sources', '22 cited sources', '33 claims checked', '41 claims checked', '46 claims checked', 'material public claims',
      '5 evidence types', 'kept distinct', 'standalone html', 'no external assets',
      'evidence snapshot', 'audit trail', 'source pdfs were opened', 'same ai-assisted workflow',
      'future reuse', 'souhrn validace', 'zkontrolovaných tvrzení', 'samostatné html'
    ].filter(phrase => visibleText.toLowerCase().includes(phrase));
    const languageSwitch = document.querySelector('.language-switch');
    return {
      lang: document.documentElement.lang,
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      mainCount: document.querySelectorAll('main').length,
      sectionCount: document.querySelectorAll('main section').length,
      sourceCount: document.querySelectorAll('.source-list > li').length,
      quizCount: document.querySelectorAll('.qcard').length,
      lensCount: document.querySelectorAll('.lens-tabs button').length,
      taskCount: document.querySelectorAll('.switch button').length,
      relativeFileLinks,
      runtimeAssetRefs,
      processFacingPhrases,
      publicationLabels: {
        hero: document.querySelector('.hero > .eyebrow')?.textContent.trim() || '',
        evidenceEyebrow: document.querySelector('#evidence > .eyebrow')?.textContent.trim() || '',
        evidenceHeading: document.querySelector('#evidence > h2')?.textContent.trim() || '',
        methodsSummary: document.querySelector('#evidence details > summary')?.textContent.trim() || '',
        auditStripCount: document.querySelectorAll('.audit-strip').length
      },
      languageSwitch: languageSwitch ? {
        text: languageSwitch.textContent.trim(),
        href: languageSwitch.getAttribute('href'),
        hreflang: languageSwitch.getAttribute('hreflang'),
        ariaLabel: languageSwitch.getAttribute('aria-label')
      } : null,
      alternateLinks: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(link => ({ hreflang: link.hreflang, href: link.getAttribute('href') })),
      duplicates,
      missingAnchors,
      unsafeExternalLinks,
      emptyControls,
      headingSkips,
      sectionWithoutH2,
      missingCitedSources,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      visibleText,
      sectionIds: [...document.querySelectorAll('main section')].map(section => section.id),
      sourceIds: [...document.querySelectorAll('.source-list > li')].map(item => item.id),
      citationHrefs: citedSources,
      externalHrefs: externalLinks.map(link => link.href),
      externalResourceCount: performance.getEntriesByType('resource').filter(entry => /^https?:/.test(entry.name) && !entry.name.startsWith(location.origin)).length
    };
  });

  check(`${label}: document language is ${config.lang}`, audit.lang === config.lang, audit.lang);
  check(`${label}: title is present`, audit.title.length > 0, audit.title);
  check(`${label}: exactly one h1 and one main landmark`, audit.h1Count === 1 && audit.mainCount === 1, `${audit.h1Count} h1; ${audit.mainCount} main`);
  check(`${label}: thirteen narrative sections render`, audit.sectionCount === 13, String(audit.sectionCount));
  check(`${label}: twenty-eight public sources render`, audit.sourceCount === 28, String(audit.sourceCount));
  check(`${label}: all interactive groups render`, audit.quizCount === 5 && audit.lensCount === 6 && audit.taskCount === 2, `${audit.quizCount} quiz; ${audit.lensCount} lenses; ${audit.taskCount} tasks`);
  check(`${label}: only the reciprocal language page is linked locally`, sameArray(audit.relativeFileLinks, [config.otherFile]), JSON.stringify(audit.relativeFileLinks));
  check(`${label}: no runtime asset dependencies`, audit.runtimeAssetRefs.length === 0, audit.runtimeAssetRefs.join(', '));
  check(
    `${label}: publication-facing copy replaces QA metadata`,
    audit.processFacingPhrases.length === 0
      && audit.publicationLabels.auditStripCount === 0
      && audit.publicationLabels.hero.includes(config.labels.hero)
      && audit.publicationLabels.evidenceEyebrow === config.labels.evidenceEyebrow
      && audit.publicationLabels.evidenceHeading === config.labels.evidenceHeading
      && audit.publicationLabels.methodsSummary === config.labels.methodsSummary,
    JSON.stringify({ phrases: audit.processFacingPhrases, labels: audit.publicationLabels })
  );
  check(`${label}: reciprocal language control is complete`, audit.languageSwitch && audit.languageSwitch.text === config.switchText && audit.languageSwitch.href === config.otherFile && audit.languageSwitch.hreflang !== config.lang && audit.languageSwitch.ariaLabel, JSON.stringify(audit.languageSwitch));
  check(`${label}: English and Czech alternate links are declared`, sameArray(audit.alternateLinks, [{ hreflang: 'en', href: 'index.html' }, { hreflang: 'cs', href: 'cs.html' }]), JSON.stringify(audit.alternateLinks));
  check(`${label}: no duplicate ids`, audit.duplicates.length === 0, audit.duplicates.join(', '));
  check(`${label}: internal anchors and citations resolve`, audit.missingAnchors.length === 0 && audit.missingCitedSources.length === 0, [...audit.missingAnchors, ...audit.missingCitedSources].join(', '));
  check(`${label}: external new-tab links are isolated`, audit.unsafeExternalLinks.length === 0, audit.unsafeExternalLinks.join(', '));
  check(`${label}: controls have accessible text`, audit.emptyControls.length === 0, audit.emptyControls.join(' | '));
  check(`${label}: heading structure is complete`, audit.headingSkips.length === 0 && audit.sectionWithoutH2.length === 0, JSON.stringify({ skips: audit.headingSkips, sections: audit.sectionWithoutH2 }));
  check(`${label}: no horizontal overflow`, audit.overflow <= 1, `${audit.overflow}px`);
  check(`${label}: conclusion is visible`, audit.visibleText.includes(config.conclusion));
  check(`${label}: protected claims and values are present`, config.protectedText.every(value => audit.visibleText.includes(value)), config.protectedText.filter(value => !audit.visibleText.includes(value)).join(', '));
  check(`${label}: page loads no external subresources`, audit.externalResourceCount === 0, String(audit.externalResourceCount));

  await page.getByRole('button', { name: config.lensButton, exact: true }).click();
  check(`${label}: lens control updates content`, (await page.locator('#lens-panel').innerText()).toLowerCase().includes(config.lensText.toLowerCase()));
  check(`${label}: lens pressed state updates`, await page.getByRole('button', { name: config.lensButton, exact: true }).getAttribute('aria-pressed') === 'true');

  await page.getByRole('button', { name: config.taskButton, exact: true }).click();
  check(`${label}: task switch shows the problem-solving value`, (await page.locator('#task-number').innerText()).replace(/\u00a0/g, ' ').includes(config.taskNumber));
  check(`${label}: task switch preserves benchmark scope`, (await page.locator('#task-ratio').innerText()).includes('23×'));
  await page.getByRole('button', { name: config.taskBack, exact: true }).click();
  check(`${label}: task switch returns to 95 J`, (await page.locator('#task-number').innerText()).includes('95 J'));

  for (const card of await page.locator('.qcard').all()) {
    await card.locator('button[data-choice="unsupported"]').click();
  }
  check(`${label}: claim check resolves perfectly`, (await page.locator('#qscore').innerText()).includes(config.scoreText));

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });
  await page.waitForFunction(() => window.scrollY === 0);
  check(`${label}: visual capture starts at page top`, await page.evaluate(() => window.scrollY === 0), String(await page.evaluate(() => window.scrollY)));
  await page.screenshot({ path: path.join(outputDir, `${label}-fold.png`), fullPage: false });
  await page.screenshot({ path: path.join(outputDir, `${label}.png`), fullPage: true });

  await page.goto(config.url, { waitUntil: 'load' });
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    window.scrollTo(0, 0);
  });
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim() }));
  check(`${label}: first keyboard stop is a usable link`, firstFocus.tag === 'A' && firstFocus.text === config.switchText, JSON.stringify(firstFocus));
  check(`${label}: no console, page or request errors`, consoleErrors.length === 0 && pageErrors.length === 0 && failedRequests.length === 0, [...consoleErrors, ...pageErrors, ...failedRequests].join(' | '));

  observations.push({ label, language, viewport, audit, consoleErrors, pageErrors, failedRequests, firstFocus, screenshots: [`${label}-fold.png`, `${label}.png`] });
  await context.close();
}

async function inspectDirectFile(browser, language) {
  const config = pageConfig[language];
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  const failedRequests = [];
  const pageErrors = [];
  page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()} :: ${request.failure()?.errorText || 'failed'}`));
  page.on('pageerror', error => pageErrors.push(error.message));

  const fileUrl = pathToFileURL(path.resolve(__dirname, `../site/${config.file}`)).href;
  await page.goto(fileUrl, { waitUntil: 'load' });
  const audit = await page.evaluate(() => ({
    protocol: location.protocol,
    lang: document.documentElement.lang,
    title: document.title,
    sourceCount: document.querySelectorAll('.source-list > li').length,
    switchHref: document.querySelector('.language-switch')?.getAttribute('href') || '',
    runtimeAssetRefs: [...document.querySelectorAll(
      'script[src], link[rel="stylesheet"][href], img[src], source[src], video[src], audio[src], iframe[src]'
    )].map(node => node.getAttribute('src') || node.getAttribute('href'))
  }));

  check(`Direct file ${language}: opens through file protocol`, audit.protocol === 'file:', audit.protocol);
  check(`Direct file ${language}: complete narrative renders`, audit.lang === config.lang && audit.title.length > 0 && audit.sourceCount === 28, `${audit.lang}; ${audit.title}; ${audit.sourceCount} sources`);
  check(`Direct file ${language}: reciprocal page is the only local dependency`, audit.switchHref === config.otherFile && fs.existsSync(path.resolve(__dirname, `../site/${config.otherFile}`)), audit.switchHref);
  check(`Direct file ${language}: no runtime asset dependencies`, audit.runtimeAssetRefs.length === 0, audit.runtimeAssetRefs.join(', '));
  await page.getByRole('button', { name: config.lensButton, exact: true }).click();
  check(`Direct file ${language}: embedded interactions work`, (await page.locator('#lens-panel').innerText()).toLowerCase().includes(config.lensText.toLowerCase()));
  await page.locator('.language-switch').click();
  await page.waitForLoadState('load');
  check(`Direct file ${language}: reciprocal language navigation works`, await page.evaluate(expected => document.documentElement.lang === expected, pageConfig[language === 'en' ? 'cs' : 'en'].lang));
  check(`Direct file ${language}: no failed requests or page errors`, failedRequests.length === 0 && pageErrors.length === 0, [...failedRequests, ...pageErrors].join(' | '));

  await context.close();
  return { language, fileUrl, audit, failedRequests, pageErrors };
}

async function inspectParity(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const pages = {};
  for (const language of ['en', 'cs']) {
    const page = await context.newPage();
    await page.goto(pageConfig[language].url, { waitUntil: 'load' });
    pages[language] = await page.evaluate(() => ({
      sectionIds: [...document.querySelectorAll('main section')].map(node => node.id),
      sourceIds: [...document.querySelectorAll('.source-list > li')].map(node => node.id),
      externalHrefs: [...document.querySelectorAll('a[href^="http"]')].map(node => node.href),
      citationHrefs: [...document.querySelectorAll('sup a[href^="#src-"]')].map(node => node.getAttribute('href')),
      quizCount: document.querySelectorAll('.qcard').length,
      lensKeys: [...document.querySelectorAll('.lens-tabs button')].map(node => node.dataset.lens),
      taskKeys: [...document.querySelectorAll('.switch button')].map(node => node.dataset.task)
    }));
    await page.close();
  }

  check('Parity: narrative section order is identical', sameArray(pages.en.sectionIds, pages.cs.sectionIds), JSON.stringify(pages));
  check('Parity: source identity and order are identical', sameArray(pages.en.sourceIds, pages.cs.sourceIds), JSON.stringify({ en: pages.en.sourceIds, cs: pages.cs.sourceIds }));
  check('Parity: external source URLs and order are identical', sameArray(pages.en.externalHrefs, pages.cs.externalHrefs), JSON.stringify({ en: pages.en.externalHrefs, cs: pages.cs.externalHrefs }));
  check('Parity: claim citation sequence is identical', sameArray(pages.en.citationHrefs, pages.cs.citationHrefs), `${pages.en.citationHrefs.length}/${pages.cs.citationHrefs.length}`);
  check('Parity: interactive evidence schema is identical', pages.en.quizCount === pages.cs.quizCount && sameArray(pages.en.lensKeys, pages.cs.lensKeys) && sameArray(pages.en.taskKeys, pages.cs.taskKeys), JSON.stringify({ en: pages.en, cs: pages.cs }));

  await context.close();
  return pages;
}

async function inspectLanguageNavigation(browser) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const page = await context.newPage();
  await page.goto(englishUrl, { waitUntil: 'load' });
  await page.locator('.language-switch').click();
  await page.waitForLoadState('load');
  check('Language control: English opens Czech page', new URL(page.url()).pathname.endsWith('/cs.html') && await page.evaluate(() => document.documentElement.lang === 'cs'), page.url());
  await page.locator('.language-switch').click();
  await page.waitForLoadState('load');
  check('Language control: Czech returns to English page', new URL(page.url()).pathname.endsWith('/index.html') && await page.evaluate(() => document.documentElement.lang === 'en'), page.url());
  await context.close();
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  try {
    await inspectViewport(browser, 'en', 'desktop', { width: 1440, height: 1000 });
    await inspectViewport(browser, 'en', 'mobile', { width: 390, height: 844 }, { reducedMotion: 'reduce' });
    await inspectViewport(browser, 'cs', 'desktop', { width: 1440, height: 1000 });
    await inspectViewport(browser, 'cs', 'mobile', { width: 390, height: 844 }, { reducedMotion: 'reduce' });
    directFileAudits.push(await inspectDirectFile(browser, 'en'));
    directFileAudits.push(await inspectDirectFile(browser, 'cs'));
    parityAudit = await inspectParity(browser);
    await inspectLanguageNavigation(browser);

    const request = await playwrightRequest.newContext();
    if (checkExternalLinks) {
      const pageHtml = fs.readFileSync(path.resolve(__dirname, '../site/index.html'), 'utf8');
      const externalUrls = [...new Set([...pageHtml.matchAll(/href="(https?:\/\/[^"#]+)"/g)].map(match => match[1]))];
      for (const url of externalUrls) {
        try {
          const response = await request.get(url, { timeout: 45000, maxRedirects: 12 });
          const status = response.status();
          const outcome = status >= 200 && status < 400 ? 'REACHABLE' : [401, 403, 405, 429].includes(status) ? 'ACCESS_BLOCKED' : 'FAILED';
          externalLinkAudit.push({ url, status, outcome, finalUrl: response.url() });
          check(`External source link is not dead: ${url}`, outcome !== 'FAILED', `${status} ${outcome}`);
        } catch (error) {
          externalLinkAudit.push({ url, status: null, outcome: 'NETWORK_ERROR', error: error.message });
          check(`External source link is not dead: ${url}`, false, error.message);
        }
      }
    }
    for (const item of [{ language: 'en', url: englishUrl }, { language: 'cs', url: czechUrl }]) {
      const response = await request.get(item.url, { timeout: 15000 });
      languageLinkAudit.push({ language: item.language, url: item.url, status: response.status() });
      check(`Language page is reachable: ${item.language}`, response.status() === 200, String(response.status()));
    }
    await request.dispose();
  } finally {
    await browser.close();
  }

  const report = {
    generatedAt: new Date().toISOString(),
    pages: { en: englishUrl, cs: czechUrl },
    passed: failures.length === 0,
    summary: { checks: checks.length, passed: checks.filter(item => item.passed).length, failed: failures.length },
    failures,
    checks,
    observations,
    directFileAudits,
    parityAudit,
    languageLinkAudit,
    externalLinkAudit: externalLinkAudit.sort((a, b) => a.url.localeCompare(b.url))
  };
  fs.writeFileSync(path.join(outputDir, 'playwright-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report.summary));
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
})().catch(error => {
  console.error(error);
  process.exit(1);
});
