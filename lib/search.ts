import { products as allProducts, Product } from "@/data/products";

// Synonym mappings for query expansion
const SYNONYMS: Record<string, string[]> = {
  // Price synonyms
  'cheap': ['budget', 'affordable', 'inexpensive', 'economical', 'low cost', 'value', 'low price'],
  'expensive': ['premium', 'high end', 'flagship', 'luxury', 'top tier', 'costly'],
  
  // Performance synonyms
  'fast': ['quick', 'rapid', 'high performance', 'speedy', 'swift', 'snappy'],
  'slow': ['sluggish', 'low performance', 'basic', 'entry level'],
  'powerful': ['high performance', 'strong', 'capable', 'robust', 'high end'],
  
  // Quality synonyms
  'good': ['quality', 'excellent', 'great', 'best', 'top', 'superior', 'premium'],
  'bad': ['poor', 'low quality', 'inferior', 'cheap'],
  
  // Size synonyms
  'small': ['compact', 'mini', 'tiny', 'portable', 'travel size'],
  'large': ['big', 'huge', 'full size', 'oversized', 'xl'],
  
  // Feature synonyms
  'silent': ['quiet', 'noiseless', 'low noise', 'whisper quiet'],
  'loud': ['noisy', 'high volume', 'booming'],
  'wireless': ['cordless', 'bluetooth', 'bt', 'wifi', 'wire free'],
  'wired': ['cable', 'corded', 'usb'],
  'rgb': ['colored', 'colorful', 'multicolor', 'lighting', 'led'],
  'mechanical': ['mech', 'clicky', 'tactile'],
  'ergonomic': ['comfortable', 'ergo', 'health focused'],
  
  // Product type synonyms
  'laptop': ['notebook', 'portable computer', 'lappy'],
  'desktop': ['pc', 'computer', 'workstation', 'tower'],
  'headphone': ['headset', 'earphone', 'earbud', 'headfone', 'headphones'],
  'keyboard': ['kb', 'keypad', 'keys'],
  'monitor': ['display', 'screen', 'lcd', 'led display'],
  'mouse': ['mice', 'pointer', 'clicker'],
  'ram': ['memory', 'ddr', 'dimm'],
  'ssd': ['solid state', 'storage', 'drive'],
  'gpu': ['graphics card', 'video card', 'vga'],
  'processor': ['cpu', 'chip'],
  'webcam': ['camera', 'web camera', 'video camera'],
  'mic': ['microphone', 'mike'],
  'microphone': ['mic', 'mike'],
  'livestream': ['live stream', 'streaming', 'broadcast'],
  'streaming': ['live stream', 'livestream', 'broadcast'],
  'chair': ['seat', 'seating'],
  'table': ['desk', 'workstation'],
  'cabinet': ['case', 'tower', 'chassis'],
};

// Calculate Levenshtein distance for typo detection
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  if (len1 === 0) return len2;
  if (len2 === 0) return len1;

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

// Apply typo correction to query
function correctTypos(query: string): string {
  const words = query.toLowerCase().split(/\s+/);
  const correctedWords = words.map(word => {
    // Normalize common plurals to singular
    const pluralMap: Record<string, string> = {
      'ssds': 'ssd',
      'gpus': 'gpu',
      'psus': 'psu',
      'rams': 'ram',
      'laptops': 'laptop',
      'keyboards': 'keyboard',
      'monitors': 'monitor',
      'headphones': 'headphone',
      'speakers': 'speaker',
      'webcams': 'webcam',
      'processors': 'processor',
      'motherboards': 'motherboard',
      'cabinets': 'cabinet',
      'mice': 'mouse',
      'mics': 'mic',
      'microphones': 'microphone',
      'microphone': 'mic'
    };
    
    // Apply plural normalization first
    if (pluralMap[word]) {
      return pluralMap[word];
    }
    
    // Skip very short words and numbers
    if (word.length <= 2 || /^\d+$/.test(word)) return word;
    
    // Common product terms to check against
    const vocabulary = [
      'laptop', 'notebook', 'keyboard', 'mouse', 'monitor', 'display',
      'headphone', 'headset', 'speaker', 'webcam', 'camera',
      'processor', 'intel', 'amd', 'ryzen', 'gaming', 'wireless',
      'bluetooth', 'mechanical', 'optical', 'ergonomic', 'portable',
      'budget', 'premium', 'cheap', 'expensive', 'quality', 'silent',
      'under', 'above', 'around', 'cabinet', 'case', 'tower',
      'cooler', 'cooling', 'power', 'supply', 'motherboard',
      'graphics', 'card', 'stand', 'mount', 'table', 'desk', 'chair',
      'ssd', 'ram', 'gpu', 'psu', 'rgb', 'ddr4', 'ddr5', 'nvme',
      'touchscreen', 'backlit', 'noise', 'cancelling', 'tkl',
      'tenkeyless', 'hotswap', 'switch', 'adjustable', 'microphone',
      'nvidia', 'rtx', 'gtx', 'quiet', 'performance', 'components',
      'parts', 'hardware', 'peripheral', 'accessories', 'mic',
      'streaming', 'recording', 'condenser', 'usb'
    ];
    
    // Find closest match if distance is small
    let bestMatch = word;
    let minDistance = Infinity;
    
    for (const term of vocabulary) {
      const distance = levenshteinDistance(word, term);
      // Only correct if distance is 1 or 2 and word is similar length
      if (distance <= 2 && distance < minDistance && Math.abs(word.length - term.length) <= 2) {
        minDistance = distance;
        bestMatch = term;
      }
    }
    
    // Only apply correction if distance is 1-2 (likely typo)
    return minDistance <= 2 && minDistance < word.length * 0.4 ? bestMatch : word;
  });
  
  return correctedWords.join(' ');
}

// Expand query with synonyms
function expandQueryWithSynonyms(query: string): string {
  const words = query.toLowerCase().split(/\s+/);
  const expandedTerms: string[] = [query]; // Include original query
  
  // For each word, check if we have synonyms
  words.forEach(word => {
    if (SYNONYMS[word]) {
      // Add each synonym as an alternative search term
      SYNONYMS[word].forEach(synonym => {
        const expandedQuery = query.replace(new RegExp(`\\b${word}\\b`, 'gi'), synonym);
        if (expandedQuery !== query) {
          expandedTerms.push(expandedQuery);
        }
      });
    }
  });
  
  return expandedTerms.join(' | '); // Use pipe to indicate alternatives
}

// Helper functions for RGB detection
function detectRgbFeatures(text: string) {
  const hasExplicitNonRgb = /no\s+rgb|without\s+rgb|non-rgb|no\s+integrated\s+rgb/.test(text);
  const hasRgbMention = /\brgb\b(?!.*(?:no|without|non))/.test(text) || /rgb\s+lighting|vibrant\s+rgb/.test(text);
  const hasRgb = hasRgbMention && !hasExplicitNonRgb;
  const hasNonRgb = hasExplicitNonRgb; // Only explicitly non-RGB products
  return { hasRgb, hasNonRgb };
}

function detectQueryFeatures(query: string) {
  const hasRgbKeyword = /\brgb\b/.test(query) && !/non[\s-]?rgb|no\s+rgb|without\s+rgb/.test(query);
  const hasNonRgbKeyword = /non[\s-]?rgb|without\s+rgb|no\s+rgb/.test(query);
  return { hasRgbKeyword, hasNonRgbKeyword };
}

// Helper function to create product text for searching
function getProductText(product: Product): string {
  return `${product.name} ${JSON.stringify(product.details || '')}`.toLowerCase();
}

// Helper function to parse price from query
function parsePrice(query: string): number | null {
  // Normalize 'k' suffix to thousands (e.g., 2k → 2000, 3.5k → 3500)
  const normalizedQuery = query.replace(/(\d+(?:\.\d+)?)\s*k\b/gi, (match, num) => {
    return String(parseFloat(num) * 1000);
  });
  
  const pricePattern = /(?:under|below|less\s+than)\s+(?:rs\.?\s*|₹\s*)?(\d+(?:,\d+)*)/i;
  const priceMatch = normalizedQuery.match(pricePattern);
  return priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
}

// Helper function to check if product matches frequency query
function matchesFrequency(text: string, keyword: string): boolean {
  // Regular text matching
  if (text.includes(keyword)) return true;
  
  // Special handling for frequency terms - normalize MHz/MT/s equivalence
  const freqMatch = keyword.match(/^(\d+)(mhz|mts|mt\/s)$/i);
  if (freqMatch) {
    const freqNumber = freqMatch[1];
    const normalizedFreq = `${freqNumber}mhz`;
    return text.includes(freqNumber) || text.includes(normalizedFreq) || text.includes(`${freqNumber} mhz`);
  }
  
  return false;
}

// Helper function to apply hierarchical fallback for category products
function applyHierarchicalFallback(
  categoryProducts: Product[],
  query: string,
  categoryKeywords: string[],
  maxPrice: number | null
): Product[] {
  const q = query.toLowerCase();
  
  // Extract all non-category keywords for exact matching
  const keywords = q.split(' ').filter(word => 
    word.length > 2 && !categoryKeywords.includes(word.toLowerCase())
  );
  
  // If we have keywords, try exact match
  if (keywords.length > 0) {
    const exactMatch = categoryProducts.filter(p => {
      const text = getProductText(p);
      return keywords.every(keyword => matchesFrequency(text, keyword));
    });
    
    // If exact match found, return it
    if (exactMatch.length > 0) {
      return applyPriceAndSort(exactMatch, maxPrice);
    }
  }
  
  // Fallback: return all products in category
  return applyPriceAndSort(categoryProducts, maxPrice);
}

// Helper function to apply price filter and sort by rating
function applyPriceAndSort(products: Product[], maxPrice: number | null): Product[] {
  let filtered = products;
  
  if (maxPrice) {
    filtered = products.filter(p => {
      const priceStr = String(p.price).replace(/[^\d]/g, '');
      const price = parseInt(priceStr) || 0;
      return price <= maxPrice;
    });
  }
  
  return filtered
    .map(p => ({
      product: p,
      score: (p.rating || 0) * 2
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}

// Local AI parser (inspired by Python model)
function parseQueryWithLocalAI(query: string): SearchCriteria | null {
  const q = query.toLowerCase().trim();
  
  // Category patterns (updated to match singular category names)
  const categoryPatterns = {
    'Laptop': /\b(laptop|laptops|notebook|notebooks|gaming laptop|portable laptop)\b/,
    'Monitor': /\b(monitor|monitors|display|screen|gaming monitor|ips monitor|led monitor|lcd monitor|va monitor|oled monitor)\b/,
    'SSD': /\b(ssd|solid state drive|nvme|m\.2|m2)\b/,
    'Ram': /\b(ram|rams|memory|ddr[2-6])\b/,
    'Processor': /\b(processor|processors|cpu|cpus|intel|amd|ryzen|i3|i5|i7|i9)\b/,
    'Keyboard': /\b(keyboard|keyboards)\b/,
    'Mouse': /\b(mouse|mice)\b/,
    'Headphone': /\b(headphone|headphones|headset|headsets|earphone|earphones)\b/,
    'Webcam': /\b(webcam|webcams|camera|cameras)\b/,
    'Chair': /\b(chair|chairs)\b/,
    'Table': /\b(desk|desks|table|tables)\b/,
    'Speaker': /\b(speaker|speakers|sound[\s-]?bar|soundbar|audio[\s-]?system)\b/,
    'GPU': /\b(gpu|gpus|graphics[\s-]?card|video[\s-]?card|geforce|radeon)\b/,
    'Cabinet': /\b(cabinet|cabinets|case|cases|pc[\s-]?case|computer[\s-]?case|tower|chassis)\b/,
    'CPUFan': /\b(cpu[\s-]?fan|cpu[\s-]?cooler|processor[\s-]?fan|processor[\s-]?cooler)\b/,
    'CoolingFan': /\b(cooling[\s-]?fan|case[\s-]?fan|chassis[\s-]?fan|exhaust[\s-]?fan|intake[\s-]?fan)\b/,
    'PSU': /\b(psu|power[\s-]?supply|smps|power[\s-]?supply[\s-]?unit)\b/,
    'MonitorStand': /\b(monitor[\s-]?stand|monitor[\s-]?arm|monitor[\s-]?mount|vesa[\s-]?mount|desk[\s-]?mount)\b/,
    'Motherboard': /\b(motherboard|motherboards|mobo|mainboard|main[\s-]?board)\b/
  }

  // Feature patterns
  const featurePatterns = {
    // RGB / LIGHTING
    rgb: /\brgb\b(?!.*(?:no|without|non))/i,
    nonRgb: /\b(non[\s-]?rgb|no\s+rgb|without\s+rgb|no\s+integrated\s+rgb)\b/i,
    backlit: /\b(backlit|back[\s-]?light|illuminated)\b/i,
  
    // CONNECTIVITY
    wireless: /\b(wireless|bluetooth|bt\s|2\.4ghz|ble|low[\s-]?energy)\b/i,
    wired: /\b(wired|cable|3\.5mm|aux|jack)\b/i,
    usbC: /\busb[-\s]?c\b/i,
    thunderbolt: /\b(thunderbolt|tb3|tb4)\b/i,
  
    // AUDIO FEATURES (Headphones)
    microphone: /\b(mic|microphone|with\s+mic)\b/i,
    noiseCancellation: /\b(noise[\s-]?cancel|anc|active[\s-]?noise|noise\s+reduction)\b/i,
    overEar: /\b(over[\s-]?ear|over[\s-]?the[\s-]?ear)\b/i,
    onEar: /\b(on[\s-]?ear)\b/i,
    inEar: /\b(in[\s-]?ear|earbuds?)\b/i,
    foldable: /\bfoldable\b/i,
    waterproof: /\b(waterproof|water[\s-]?resistant|ipx)\b/i,
    audioCodecs: /\b(aptx|aptx[-\s]?hd|ldac|aac|sbc)\b/i,
    impedance: /\b(\d{2,3}ohm|ohm)\b/i,
    sensitivity: /\b(db\s?spl|sensitivity)\b/i,
    detachableCable: /\b(detachable\s+cable|removable\s+cable)\b/i,
  
    // KEYBOARD / MOUSE FEATURES
    mechanical: /\bmechanical\b/i,
    tkl: /\b(tkl|tenkeyless|ten\s*key\s*less)\b/i,
    hotSwap: /\b(hot[\s-]?swap|swappable|hot[-\s]?swappable)\b/i,
    silent: /\b(silent|quiet)\b/i,
    ergonomic: /\bergonomic\b/i,
  
    switchType: /\b(linear|tactile|clicky)\b/i,
    switchBrand: /\b(cherry|gateron|kailh|holy[pog]?)\b/i,
    keycap: /\b(pbt|abs|double[-\s]?shot)\b/i,
  
    mouseDpi: /\b(\d{3,4}\s?dpi)\b/i,               // 800dpi, 1600dpi, 12000dpi
    pollingRate: /\b(125hz|250hz|500hz|1000hz)\b/i,
    sensorType: /\b(optical|laser|pmw|pixart)\b/i,
  
    // PROCESSOR FEATURES
    intel: /\bintel\b/i,
    amd: /\bamd\b/i,
  
    intelI3: /\bintel[\s-]*(?:core[\s-]*)?i3\b/i,
    intelI5: /\bintel[\s-]*(?:core[\s-]*)?i5\b/i,
    intelI7: /\bintel[\s-]*(?:core[\s-]*)?i7\b/i,
    intelI9: /\bintel[\s-]*(?:core[\s-]*)?i9\b/i,
  
    amdRyzen3: /\b(?:amd[\s-]*)?ryzen[\s-]*3\b/i,
    amdRyzen5: /\b(?:amd[\s-]*)?ryzen[\s-]*5\b/i,
    amdRyzen7: /\b(?:amd[\s-]*)?ryzen[\s-]*7\b/i,
    amdRyzen9: /\b(?:amd[\s-]*)?ryzen[\s-]*9\b/i,
  
    nvidia: /\bnvidia\b/i,
    rtx: /\brtx\b/i,
    gtx: /\bgtx\b/i,
  
    // STORAGE (SSD / HDD)
    ssd: /\bssd\b/i,
    nvme: /\b(nvme|m\.2|m2|gen[\s-]3|gen[\s-]4|gen[\s-]5)\b/i,
    sata: /\b(sata[\s-]?ssd|sata3|2\.5[\s-]?inch)\b/i,
    external: /\b(external[\s-]?ssd|portable[\s-]?ssd|usb[\s-]?ssd|type[\s-]?c[\s-]?ssd)\b/i,
    hdd: /\bhdd\b/i,
  
    tbw: /\b(tbw|terabytes?[\s-]?written)\b/i,
    encryption: /\b(aes|hardware[\s-]?encryption|tcg[\s-]?opal|opalf?)\b/i,
    formFactor: /\b(2\.5["\s-]?inch|2\.5in|2280|2242)\b/i,
    heatsink: /\b(heatsink|heat[\s-]?sink|thermal[\s-]?pad)\b/i,
    smart: /\b(s\.?m\.?a\.?r\.?t\.?)\b/i,
    controllerBrand: /\b(phison|silicon[\s-]?motion|samsung[\s-]?controller)\b/i,
    ldpc: /\b(ldpc|ecc|error[\s-]?correction)\b/i,

    // RAM FEATURES
    ramCapacity: /\b(4gb|8gb|16gb|32gb|64gb|128gb)\b/i,
    ramSpeed: /\b(\d{3,5}\s?(mhz|mt\/s|mts))\b/i,
    ramFormFactor: /\b(sodimm|so-dimm|dimm)\b/i,
    ramEcc: /\b(ecc|error[\s-]?correcting)\b/i,
    ramNonEcc: /\b(non[\s-]?ecc|unbuffered)\b/i,
    ramChannel: /\b(single[\s-]?channel|dual[\s-]?channel|quad[\s-]?channel)\b/i,
    ramCasLatency: /\b(cl\d{1,2})\b/i,
    ramXmp: /\b(xmp|intel\s+extreme\s+memory\s+profile)\b/i,
    ramExpo: /\b(expo|amd\s+expo)\b/i,
    ramRgb: /\b(ram\s*rgb|rgb\s*ram|rgb\s*memory)\b/i,
    ramDdr3: /\bddr[\s-]?3\b/i,
    ramDdr4: /\bddr[\s-]?4\b/i,
    ramDdr5: /\bddr[\s-]?5\b/i,
    ramDdr6: /\bddr[\s-]?6\b/i,
  
    // DISPLAY / MONITOR FEATURES
    touchscreen: /\b(touch\s*screen|touchscreen)\b/i,
    curved: /\b(curved|ultra[\s-]?wide|uwqhd)\b/i,
    ultrawide: /\b(ultra[\s-]?wide|21[:x]9|32[:x]9)\b/i,
  
    ips: /\bips\b/i,
    va: /\bva[\s-]?panel\b/i,
    tn: /\btn[\s-]?panel\b/i,
  
    monitorRefreshRate: /\b(60hz|75hz|90hz|120hz|144hz|165hz|180hz|200hz|240hz|360hz)\b/i,
    monitorHdr: /\b(hdr|hdr10|dolby[\s-]?vision)\b/i,
    freesync: /\bfreesync\b/i,
    gsync: /\bg[-\s]?sync\b/i,
  
    heightAdjust: /\b(height[\s-]?adjust|ergonomic|adjustable[\s-]?stand)\b/i,
    monitorSpeakers: /\b(built[\s-]?in[\s-]?speakers|speakers)\b/i,
    bezelLess: /\b(bezel[\s-]?less|frameless|borderless)\b/i,
    wallMount: /\b(vesa|wall[\s-]?mount)\b/i,
  
    responseTime: /\b([01]?\.\d+ms|\d+ms)\b/i,  // 1ms, 0.5ms, 4ms
    colorGamut: /\b(srgb|dci[-\s]?p3|adobe[-\s]?rgb)\b/i,
    bitDepth: /\b(8[-\s]?bit|10[-\s]?bit|12[-\s]?bit)\b/i,
  
    inputPorts: /\b(hdmi|displayport|dp\b|usb[-\s]?c|thunderbolt)\b/i,
    backlightType: /\b(mini[\s-]?led|oled|led[\s-]?backlight)\b/i,
    antiGlare: /\b(anti[-\s]?glare|matte|low[\s-]?glare)\b/i,
    blueLight: /\b(blue[\s-]?light|low[\s-]?blue)\b/i,
    flickerFree: /\b(flicker[\s-]?free)\b/i,
  
    aspectRatio: /\b(16[:x]9|21[:x]9|32[:x]9)\b/i,
    panelSize: /\b([1-9][0-9]?(?:\.[0-9])?\s?(?:inch|inches|"))\b/i,
  
    // RESOLUTION (Monitors / Laptops)
    res4k: /\b(4k|uhd|3840.*2160|ultra[\s-]?hd)\b/i,
    res1440p: /\b(2k|1440p|2560.*1440|qhd|quad[\s-]?hd)\b/i,
    res1080p: /\b(1080p|1920.*1080|fhd|full[\s-]?hd)\b/i,
    res720p: /\b(720p|1280.*720|hd)\b/i,
  
    // SPEAKER FEATURES
    speakerWattage: /\b(\d+\s?w|\d+\s?watts?)\b/i,
    speakerChannels: /\b(2\.0|2\.1|5\.1|7\.1)\b/i,
    speakerSubwoofer: /\b(subwoofer|bass|sub)\b/i,
    speakerSoundbar: /\b(soundbar|sound[\s-]?bar)\b/i,
  
    // GPU FEATURES
    gpuVram: /\b(\d+gb\s?vram|\d+gb\s?gddr|gddr[56])\b/i,
    gpuRayTracing: /\b(ray[\s-]?tracing|rtx|dlss)\b/i,
    gpuRefreshRate: /\b(144hz|165hz|240hz)\b/i,
  
    // CABINET/CASE FEATURES
    cabinetSize: /\b(atx|micro[\s-]?atx|mini[\s-]?itx|e[\s-]?atx|full[\s-]?tower|mid[\s-]?tower|mini[\s-]?tower)\b/i,
    cabinetRgb: /\b(rgb[\s-]?lighting|tempered[\s-]?glass|glass[\s-]?panel)\b/i,
    cabinetFanSupport: /\b(fan[\s-]?support|\d+mm[\s-]?fan|radiator[\s-]?support)\b/i,
  
    // CPU FAN / COOLING FAN FEATURES
    fanSize: /\b(80mm|92mm|120mm|140mm|200mm)\b/i,
    fanRpm: /\b(\d{3,4}\s?rpm)\b/i,
    fanAirflow: /\b(\d+\s?cfm|cfm)\b/i,
    fanNoise: /\b(\d+\s?db|dba|silent|quiet)\b/i,
    liquidCooling: /\b(liquid[\s-]?cooling|aio|all[\s-]?in[\s-]?one|water[\s-]?cooling)\b/i,
    heatPipes: /\b(heat[\s-]?pipe|\d+[\s-]?heat[\s-]?pipe)\b/i,
  
    // PSU FEATURES
    psuWattage: /\b(\d{3,4}w|\d{3,4}\s?watt)\b/i,
    psuEfficiency: /\b(80[\s+]?plus|bronze|silver|gold|platinum|titanium)\b/i,
    psuModular: /\b(modular|semi[\s-]?modular|fully[\s-]?modular|non[\s-]?modular)\b/i,
  
    // MONITOR STAND FEATURES
    standVesa: /\b(vesa|75x75|100x100|vesa[\s-]?compatible)\b/i,
    standArm: /\b(arm|articulating|gas[\s-]?spring|dual[\s-]?monitor)\b/i,
    standAdjustable: /\b(height[\s-]?adjustable|tilt|swivel|rotate|pivot)\b/i,
  
    // MOTHERBOARD FEATURES
    motherboardChipset: /\b(b550|b650|b760|x570|x670|z690|z790|h610|h670)\b/i,
    motherboardSocket: /\b(am4|am5|lga1700|lga1200)\b/i,
    motherboardFormFactor: /\b(atx|micro[\s-]?atx|mini[\s-]?itx|e[\s-]?atx)\b/i,
    motherboardPcie: /\b(pcie[\s-]?4\.0|pcie[\s-]?5\.0|gen[\s-]?4|gen[\s-]?5)\b/i,
  
    // GENERAL PRODUCT METADATA
    portable: /\bportable\b/i,
    adjustable: /\badjustable\b/i,
    warranty: /\b(warranty|years?\s+warranty)\b/i,
    refurbished: /\b(refurbished|renewed)\b/i,
    releaseYear: /\b(20\d{2})\b/,                 // 2015–2099
    priceTier: /\b(budget|mid[\s-]?range|flagship|premium)\b/i,
    gaming: /\bgaming\b/i
  };

  // Price pattern
  const maxPrice = parsePrice(q);

  // Detect categories
  const detectedCategories: string[] = [];
  for (const [category, pattern] of Object.entries(categoryPatterns)) {
    if (pattern.test(q)) {
      detectedCategories.push(category);
    }
  }

  // Detect features
  const detectedFeatures: Record<string, boolean> = {};
  
  if (featurePatterns.rgb.test(q)) {
    detectedFeatures.rgb = true;
  }
  if (featurePatterns.nonRgb.test(q)) {
    detectedFeatures.rgb = false;
  }
  if (featurePatterns.wireless.test(q)) {
    detectedFeatures.wireless = true;
  }
  if (featurePatterns.wired.test(q)) {
    detectedFeatures.wired = true;
  }
  if (featurePatterns.microphone.test(q)) {
    detectedFeatures.microphone = true;
  }
  if (featurePatterns.gaming.test(q)) {
    detectedFeatures.gaming = true;
  }
  if (featurePatterns.silent.test(q)) {
    detectedFeatures.silent = true;
  }
  if (featurePatterns.tkl.test(q)) {
    detectedFeatures.tkl = true;
  }
  if (featurePatterns.hotSwap.test(q)) {
    detectedFeatures.hotSwap = true;
  }
  if (featurePatterns.intel.test(q)) {
    detectedFeatures.intel = true;
  }
  if (featurePatterns.amd.test(q)) {
    detectedFeatures.amd = true;
  }
  
  // Detect specific processor models
  let specificProcessor = null;
  if (featurePatterns.intelI9.test(q)) {
    specificProcessor = 'intel-i9';
    detectedFeatures.intel = true;
  } else if (featurePatterns.intelI7.test(q)) {
    specificProcessor = 'intel-i7';
    detectedFeatures.intel = true;
  } else if (featurePatterns.intelI5.test(q)) {
    specificProcessor = 'intel-i5';
    detectedFeatures.intel = true;
  } else if (featurePatterns.intelI3.test(q)) {
    specificProcessor = 'intel-i3';
    detectedFeatures.intel = true;
  } else if (featurePatterns.amdRyzen9.test(q)) {
    specificProcessor = 'amd-ryzen-9';
    detectedFeatures.amd = true;
  } else if (featurePatterns.amdRyzen7.test(q)) {
    specificProcessor = 'amd-ryzen-7';
    detectedFeatures.amd = true;
  } else if (featurePatterns.amdRyzen5.test(q)) {
    specificProcessor = 'amd-ryzen-5';
    detectedFeatures.amd = true;
  } else if (featurePatterns.amdRyzen3.test(q)) {
    specificProcessor = 'amd-ryzen-3';
    detectedFeatures.amd = true;
  }
  
  if (featurePatterns.nvidia.test(q)) {
    detectedFeatures.nvidia = true;
  }
  if (featurePatterns.rtx.test(q)) {
    detectedFeatures.rtx = true;
  }
  if (featurePatterns.ssd.test(q)) {
    detectedFeatures.ssd = true;
  }
  if (featurePatterns.touchscreen.test(q)) {
    detectedFeatures.touchscreen = true;
  }
  if (featurePatterns.noiseCancellation.test(q)) {
    detectedFeatures.noiseCancellation = true;
  }
  if (featurePatterns.backlit.test(q)) {
    detectedFeatures.backlit = true;
  }
  if (featurePatterns.overEar.test(q)) {
    detectedFeatures.overEar = true;
  }
  if (featurePatterns.adjustable.test(q)) {
    detectedFeatures.adjustable = true;
  }
  if (featurePatterns.mechanical.test(q)) {
    detectedFeatures.mechanical = true;
  }
  if (featurePatterns.ergonomic.test(q)) {
    detectedFeatures.ergonomic = true;
  }
  if (featurePatterns.portable.test(q)) {
    detectedFeatures.portable = true;
  }
  
  // DDR detection
  let detectedDdr = null;
  if (featurePatterns.ramDdr3.test(q)) {
    detectedDdr = 'ddr3';
  } else if (featurePatterns.ramDdr4.test(q)) {
    detectedDdr = 'ddr4';
  } else if (featurePatterns.ramDdr5.test(q)) {
    detectedDdr = 'ddr5';
  } else if (featurePatterns.ramDdr6.test(q)) {
    detectedDdr = 'ddr6';
  }
  
  // Resolution detection
  let detectedResolution = null;
  if (featurePatterns.res4k.test(q)) {
    detectedResolution = '4k';
  } else if (featurePatterns.res1440p.test(q)) {
    detectedResolution = '1440p';
  } else if (featurePatterns.res1080p.test(q)) {
    detectedResolution = '1080p';
  } else if (featurePatterns.res720p.test(q)) {
    detectedResolution = '720p';
  }
  
  // DPI detection for mice
  const dpiMatch = q.match(/(\d+)\s*dpi/i);
  const detectedDpi = dpiMatch ? parseInt(dpiMatch[1]) : null;

  // Extract frequency and capacity
  const frequencyMatch = q.match(/(\d+)\s*(mhz|mt\/s|mts)/i);
  const capacityMatch = q.match(/(\d+)\s*(gb|tb)/i);

  // Infer categories for resolution-only queries (4k, 1080p, etc.)
  if (detectedResolution && detectedCategories.length === 0) {
    // Resolution queries typically apply to webcams, laptops, or monitors
    // For now, prioritize webcams for 4k queries since they're most common
    if (detectedResolution === '4k') {
      detectedCategories.push('Webcam', 'Laptop');
    } else {
      detectedCategories.push('Webcam', 'Laptop');
    }
  }

  // Handle broad "PC components" queries
  if (/\b(pc\s+components?|computer\s+components?|pc\s+parts?|computer\s+parts?|build\s+pc|pc\s+build)\b/i.test(q) && detectedCategories.length === 0) {
    // Return PC component categories
    detectedCategories.push('Processor', 'GPU', 'Ram', 'SSD', 'Motherboard', 'PSU', 'Cabinet', 'CPUFan', 'CoolingFan');
  }

  // Only return structured criteria if we detected meaningful patterns
  if (detectedCategories.length > 0 || Object.keys(detectedFeatures).length > 0 || maxPrice || frequencyMatch || capacityMatch || detectedResolution || detectedDdr || detectedDpi) {
    return {
      category: detectedCategories.length === 1 ? detectedCategories[0] : detectedCategories,
      features: {
        // Map to existing interface properties
        lighting: detectedFeatures.rgb === true ? 'rgb' : (detectedFeatures.rgb === false ? 'non-rgb' : null),
        connectivity: detectedFeatures.wireless ? 'wireless' : (detectedFeatures.wired ? 'wired' : null),

        gaming: detectedFeatures.gaming === true ? true : null,
        mechanical: detectedFeatures.mechanical === true ? true : null,
        ergonomic: detectedFeatures.ergonomic === true ? true : null,
        silent: detectedFeatures.silent === true ? true : (detectedFeatures.noiseCancellation === true ? true : null),
        microphone: detectedFeatures.microphone === true ? true : null,
        tkl: detectedFeatures.tkl === true ? true : null,
        hotSwap: detectedFeatures.hotSwap === true ? true : null,
        intel: detectedFeatures.intel === true ? true : null,
        amd: detectedFeatures.amd === true ? true : null,
        nvidia: detectedFeatures.nvidia === true ? true : null,
        rtx: detectedFeatures.rtx === true ? true : null,
        ssd: detectedFeatures.ssd === true ? true : null,
        touchscreen: detectedFeatures.touchscreen === true ? true : null,
        noiseCancellation: detectedFeatures.noiseCancellation === true ? true : null,
        backlit: detectedFeatures.backlit === true ? true : null,
        overEar: detectedFeatures.overEar === true ? true : null,
        adjustable: detectedFeatures.adjustable === true ? true : null,
        // Set other features to null by default
        brand: null,
        processorModel: specificProcessor,
        ddr: detectedDdr,
        resolution: detectedResolution,
        fps: null,
        surround: null,
        dpi: detectedDpi,
        storage: null
      },
      specs: {
        maxPrice: maxPrice,
        minRating: null,
        frequency: frequencyMatch ? frequencyMatch[0] : null,
        capacity: capacityMatch ? capacityMatch[0] : null
      }
    };
  }

  return null;
}

// AI Parser: Convert natural language to structured search criteria
async function parseSearchQuery(query: string): Promise<SearchCriteria | null> {
  // Try custom Python AI service if URL is configured
  const aiServiceUrl = process.env.AI_SERVICE_URL;
  
  if (aiServiceUrl) {
    try {
      const response = await fetch(`${aiServiceUrl}/parse-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(3000), // 3 second timeout
      });

      if (response.ok) {
        const result = await response.json();
        
        // Validate response structure
        if (!result || !result.criteria) {
          console.log(`🚫 Custom AI Service returned invalid response for "${query}"`);
          return null;
        }
        
        // Filter out null values for cleaner console output
        const cleanCriteria = {
          category: result.criteria.category,
          features: Object.fromEntries(
            Object.entries(result.criteria.features).filter(([_, v]) => v !== null)
          ),
          specs: Object.fromEntries(
            Object.entries(result.criteria.specs).filter(([_, v]) => v !== null)
          ),
        };
        
        console.log(`🤖 Custom AI Service result for "${query}":`, cleanCriteria, `(${Math.round(result.confidence * 100)}% confidence)`);
        
        if (result.success && result.confidence > 0.5) {
          return result.criteria;
        }
      }
    } catch (error) {
      console.log(`🚫 Custom AI Service failed for "${query}":`, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  // Enhanced local AI logic (inspired by your Python model)
  const localAIResult = parseQueryWithLocalAI(query);
  if (localAIResult) {
    return localAIResult;
  }
  
  console.log(`🔍 No external AI services available for "${query}", using local AI fallback`);
  return null;
}

// Local Database Filter: Apply structured criteria to products
function filterProducts(criteria: SearchCriteria): Product[] {
  let candidates = allProducts;
  
  // Filter by category
  if (criteria.category) {
    const categoryMap: Record<string, string> = {
      'laptop': 'Laptop',
      'headphone': 'Headphone', 
      'keyboard': 'Keyboard',
      'mouse': 'Mouse',
      'chair': 'Chair',
      'table': 'Table',
      'processor': 'Processor',
      'ram': 'Ram',
      'webcam': 'Webcam',
      'monitor': 'Monitor',
      'ssd': 'SSD',
      'speaker': 'Speaker',
      'gpu': 'GPU',
      'cabinet': 'Cabinet',
      'case': 'Cabinet',
      'cpufan': 'CPUFan',
      'coolingfan': 'CoolingFan',
      'psu': 'PSU',
      'monitorstand': 'MonitorStand',
      'motherboard': 'Motherboard',
      'mic': 'Mic',
      'microphone': 'Mic',
    
      // Uppercase variants for AI service compatibility
      'Laptop': 'Laptop',
      'Headphone': 'Headphone', 
      'Keyboard': 'Keyboard',
      'Mouse': 'Mouse',
      'Chair': 'Chair',
      'Table': 'Table',
      'Processor': 'Processor',
      'Ram': 'Ram',
      'RAM': 'Ram', 
      'Webcam': 'Webcam',
      'Monitor': 'Monitor',
      'SSD': 'SSD',
      'Speaker': 'Speaker',
      'GPU': 'GPU',
      'Cabinet': 'Cabinet',
      'Case': 'Cabinet',
      'CPUFan': 'CPUFan',
      'CoolingFan': 'CoolingFan',
      'PSU': 'PSU',
      'MonitorStand': 'MonitorStand',
      'Motherboard': 'Motherboard',
      'Mic': 'Mic'
    };
    
    // Handle both single category (string) and multiple categories (array)
    const categories = Array.isArray(criteria.category) ? criteria.category : [criteria.category];
    const targetCategories = categories.filter(Boolean).map(cat => categoryMap[cat!]).filter(Boolean);
    
    if (targetCategories.length > 0) {
      candidates = candidates.filter(p => targetCategories.includes(p.category));
    }
  }

  // Apply feature filters
  const { features, specs } = criteria;
  
  candidates = candidates.filter(product => {
    const text = getProductText(product);
    
    // Brand filter
    if (features.brand && !text.includes(features.brand.toLowerCase())) {
      return false;
    }
    
    // Connectivity filter
    if (features.connectivity) {
      const hasWireless = /wireless|bluetooth|2\.4ghz/.test(text);
      const hasWired = /wired|cable|usb/.test(text);
      
      if (features.connectivity === 'wireless' && !hasWireless) return false;
      if (features.connectivity === 'wired' && !hasWired && hasWireless) return false;
      if (features.connectivity === 'dual' && !(hasWireless && hasWired)) return false;
    }
    
    // RGB/Lighting filter
    if (features.lighting) {
      const { hasRgb, hasNonRgb } = detectRgbFeatures(text);
      if (features.lighting === 'rgb' && !hasRgb) return false;
      if (features.lighting === 'non-rgb' && !hasNonRgb) return false;
    }
    
    // Mechanical filter
    if (features.mechanical !== null) {
      const isMechanical = text.includes('mechanical');
      if (features.mechanical && !isMechanical) return false;
      if (!features.mechanical && isMechanical) return false;
    }
    
    // DDR filter
    if (features.ddr) {
      const ddrPattern = new RegExp(`\\b${features.ddr}\\b`, 'i');
      if (!ddrPattern.test(text)) return false;
    }
    
    // Resolution filter
    if (features.resolution) {
      const resMap: Record<string, RegExp> = {
        '4k': /4k|3840.*2160|uhd/i,
        '1440p': /1440p|2560.*1440|qhd|quad[\s-]?hd/i,
        '1080p': /1080p|1920.*1080|fhd|full[\s-]?hd/i,
        '720p': /720p|1280.*720|\bhd\b/i,
        'fhd': /fhd|1080p|full[\s-]?hd/i,
        'hd': /\bhd\b|720p/i
      };
    
      const pattern = resMap[features.resolution];
      if (pattern && !pattern.test(text)) return false;
    }
    
    // FPS filter
    if (features.fps) {
      const fps = features.fps.replace('fps', '');
      if (!text.includes(fps)) return false;
    }
    
    // Gaming filter
    if (features.gaming !== null) {
      const isGaming = text.includes('gaming');
      if (features.gaming && !isGaming) return false;
      if (!features.gaming && isGaming) return false;
    }
    
    // Silent filter
    if (features.silent !== null) {
      const isSilent = /silent|quiet|noiseless/.test(text);
      if (features.silent && !isSilent) return false;
    }
    
    // Ergonomic filter
    if (features.ergonomic !== null) {
      const isErgonomic = text.includes('ergonomic');
      if (features.ergonomic && !isErgonomic) return false;
    }
    
    // Microphone filter
    if (features.microphone !== null) {
      const hasMicrophone = /(mic|microphone)/i.test(text);
      if (features.microphone && !hasMicrophone) return false;
    }
    
    // TKL (Tenkeyless) filter
    if (features.tkl !== null) {
      const isTkl = /(tkl|tenkeyless|ten\s*key\s*less)/i.test(text);
      if (features.tkl && !isTkl) return false;
    }
    
    // Hot-swap filter
    if (features.hotSwap !== null) {
      const isHotSwap = /(hot[\s-]?swap|swappable)/i.test(text);
      if (features.hotSwap && !isHotSwap) return false;
    }
    
    // Processor brand filters
    if (features.intel !== null) {
      const hasIntel = /\bintel\b/i.test(text);
      if (features.intel && !hasIntel) return false;
    }
    
    if (features.amd !== null) {
      const hasAmd = /\bamd\b/i.test(text);
      if (features.amd && !hasAmd) return false;
    }
    
    // Graphics filters
    if (features.nvidia !== null) {
      const hasNvidia = /\bnvidia\b/i.test(text);
      if (features.nvidia && !hasNvidia) return false;
    }
    
    if (features.rtx !== null) {
      const hasRtx = /\brtx\b/i.test(text);
      if (features.rtx && !hasRtx) return false;
    }
    
    // Storage filter
    if (features.ssd !== null) {
      const hasSsd = /\bssd\b/i.test(text);
      if (features.ssd && !hasSsd) return false;
    }
    
    // Display filter
    if (features.touchscreen !== null) {
      const hasTouchscreen = /\b(touch\s*screen|touchscreen)\b/i.test(text);
      if (features.touchscreen && !hasTouchscreen) return false;
    }
    
    // Audio filter
    if (features.noiseCancellation !== null) {
      const hasNoiseCancellation = /\b(noise[\s-]?cancel|anc|active[\s-]?noise)\b/i.test(text);
      if (features.noiseCancellation && !hasNoiseCancellation) return false;
    }
    
    // Backlit filter
    if (features.backlit !== null) {
      const hasBacklit = /\b(backlit|back[\s-]?light|illuminated)\b/i.test(text);
      if (features.backlit && !hasBacklit) return false;
    }
    
    // Headphone type filter
    if (features.overEar !== null) {
      const isOverEar = /\b(over[\s-]?ear|over[\s-]?the[\s-]?ear)\b/i.test(text);
      if (features.overEar && !isOverEar) return false;
    }
    
    // Adjustable filter
    if (features.adjustable !== null) {
      const isAdjustable = /\badjustable\b/i.test(text);
      if (features.adjustable && !isAdjustable) return false;
    }
    
    // Processor model filter
    if (features.processorModel) {
      let processorPattern;
      switch (features.processorModel) {
        case 'intel-i3':
          processorPattern = /\bintel[\s-]*(?:core[\s-]*)?i3\b/i;
          break;
        case 'intel-i5':
          processorPattern = /\bintel[\s-]*(?:core[\s-]*)?i5\b/i;
          break;
        case 'intel-i7':
          processorPattern = /\bintel[\s-]*(?:core[\s-]*)?i7\b/i;
          break;
        case 'intel-i9':
          processorPattern = /\bintel[\s-]*(?:core[\s-]*)?i9\b/i;
          break;
        case 'amd-ryzen-3':
          processorPattern = /\bamd[\s-]*ryzen[\s-]*3\b/i;
          break;
        case 'amd-ryzen-5':
          processorPattern = /\bamd[\s-]*ryzen[\s-]*5\b/i;
          break;
        case 'amd-ryzen-7':
          processorPattern = /\bamd[\s-]*ryzen[\s-]*7\b/i;
          break;
        case 'amd-ryzen-9':
          processorPattern = /\bamd[\s-]*ryzen[\s-]*9\b/i;
          break;
      }
      if (processorPattern && !processorPattern.test(text)) {
        return false;
      }
    }
    
    // Surround sound filter
    if (features.surround !== null) {
      const hasSurround = /surround|7\.1|5\.1/.test(text);
      if (features.surround && !hasSurround) return false;
    }
    
    // DPI filter
    if (features.dpi) {
      const dpiPattern = new RegExp(`${features.dpi}\\s*dpi`, 'i');
      if (!dpiPattern.test(text)) return false;
    }
    
    // Storage filter
    if (features.storage) {
      if (!text.includes(features.storage)) return false;
    }
    
    return true;
  });
  
  // Apply spec filters
  if (specs.maxPrice) {
    candidates = candidates.filter(p => {
      // Handle various price formats: "10,599", "₹10,599", "Rs.10599", etc.
      const priceStr = String(p.price).replace(/[^\d]/g, '');
      const price = parseInt(priceStr) || 0;
      const withinBudget = price <= specs.maxPrice!;
      return withinBudget;
    });
  }
  
  if (specs.minRating) {
    candidates = candidates.filter(p => (p.rating || 0) >= specs.minRating!);
  }
  
  if (specs.frequency) {
    candidates = candidates.filter(p => {
      const text = `${p.name} ${p.details || ''}`.toLowerCase();
      // Extract just the number from frequency (e.g., "5000mhz" -> "5000")
      const freqNumber = specs.frequency!.replace(/[^0-9]/g, '');
      // Check if the frequency number appears in the product text
      // Since AI now normalizes all frequencies to 'mhz', we just need to check the number
      return text.includes(freqNumber);
    });
  }

  if (specs.capacity) {
    const capNum = specs.capacity.replace(/[^0-9]/g, '');
    candidates = candidates.filter(p => {
      const text = getProductText(p);
      const lower = text.toLowerCase();
  
      return (
        lower.includes(specs.capacity!.toLowerCase()) || 
        lower.includes(`${capNum}gb`) ||  
        lower.includes(`${capNum} gb`)  
      );
    });
  }
  
  // Score and sort results
  return candidates
    .map(p => ({ 
      product: p, 
      score: calculateRelevanceScore(p, criteria) 
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}

// Simple relevance scoring
function calculateRelevanceScore(product: Product, criteria: SearchCriteria): number {
  let score = 0;
  const text = `${product.name} ${product.details || ''}`.toLowerCase();
  
  // Base category match
  if (criteria.category) score += 10;
  
  // Feature matches
  Object.values(criteria.features).forEach(feature => {
    if (feature && typeof feature === 'string' && text.includes(feature)) {
      score += 5;
    }
  });
  
  // Rating bonus
  score += (product.rating || 0) * 2;
  
  return score;
}

// Simple fallback for when AI parsing fails - with better AND logic
function simpleFallback(query: string): Product[] {
  const q = query.toLowerCase();
  console.log(`🔧 Simple fallback processing: "${q}"`);
  
  // Extract price constraints from query - handle all spacing and currency variations  
  const maxPrice = parsePrice(q);
  
  // Special handling for DDR memory queries - should only show RAM products
  const isDDRQuery = /\b(ddr[2-6])\b/i.test(q);
  
  // Special handling for DDR queries - only show RAM products with hierarchical fallback
  if (isDDRQuery) {
    const ramProducts = allProducts.filter(p => p.category.toLowerCase() === 'ram');
    console.log(`🔍 Found ${ramProducts.length} RAM products`);
    const ddrMatch = q.match(/\b(ddr[2-6])\b/i);
    
    if (ddrMatch) {
      const ddrType = ddrMatch[1].toLowerCase();
      const categoryKeywords = ['ddr3', 'ddr4', 'ddr5', 'ddr6', 'ram', 'rams', 'memory'];
      
      // Filter for DDR type first
      const ddrTypeProducts = ramProducts.filter(p => {
        const text = getProductText(p);
        return text.includes(ddrType);
      });
      
      console.log(`🔍 Found ${ddrTypeProducts.length} ${ddrType.toUpperCase()} products`);
      
      if (ddrTypeProducts.length > 0) {
        const results = applyHierarchicalFallback(ddrTypeProducts, q, categoryKeywords, maxPrice);
        console.log(`🔍 After hierarchical fallback: ${results.length} products`);
        return results;
      }
      
      // Final fallback: all RAM
      console.log(`🔍 Using final fallback: all RAM products`);
      return applyPriceAndSort(ramProducts, maxPrice);
    }
  }

  // Special handling for desktop - don't let it match "desk" pattern
  if (q.trim() === 'desktop') {
    const filtered = allProducts.filter(p => {
      const text = getProductText(p);
      
      // Show ALL desktop computer components
      if (['Processors', 'RAM', 'Keyboards', 'Mouse', 'Webcams', 'Headphones'].includes(p.category)) {
        return true;
      }
      
      // Exclude furniture
      if (['Chairs', 'Tables'].includes(p.category)) {
        return false;
      }
      
      // For any other categories, include if they explicitly mention desktop
      return text.includes('desktop');
    });
    
    return applyPriceAndSort(filtered, maxPrice).slice(0, 200);
  }

  // Basic category detection
  const categories = {
    'laptops?|notebooks?': 'Laptops',
    'headphones?|headsets?|earphones?': 'Headphones',
    'keyboards?': 'Keyboards', 
    'mouse|mice': 'Mouse',
    'chairs?': 'Chairs',
    'desks?|tables?': 'Tables',
    'processors?|cpus?': 'Processors',
    'rams?|memory': 'RAM',
    'webcams?|cameras?': 'Webcams',
    'monitors?': 'Monitors',
    'ssds?': 'SSD',
    'speakers?|soundbars?': 'Speakers',
    'gpus?|graphics?\\s?cards?|video\\s?cards?': 'GPUs',
    'cabinets?|cases?|pc\\s?cases?': 'Cabinets',
    'cpu\\s?fans?|cpu\\s?coolers?': 'CPUFans',
    'cooling\\s?fans?|case\\s?fans?': 'CoolingFans',
    'psus?|power\\s?suppl(?:y|ies)': 'PSUs',
    'monitor\\s?stands?|monitor\\s?arms?': 'MonitorStands',
    'motherboards?|mobos?': 'Motherboards'
  };
  
  let targetCategory = null;
  for (const [pattern, category] of Object.entries(categories)) {
    if (new RegExp(`\\b(${pattern})\\b`).test(q)) {
      targetCategory = category;
      break;
    }
  }

  // If we have a target category, implement hierarchical fallback
  if (targetCategory) {
    const categoryProducts = allProducts.filter(p => p.category.toLowerCase() === targetCategory.toLowerCase());
    const categoryKeywords = ['ram', 'rams', 'memory', 'keyboard', 'keyboards', 'mouse', 'mice', 
      'laptop', 'laptops', 'headphone', 'headphones', 'webcam', 'webcams', 'processor', 'processors'];
    
    return applyHierarchicalFallback(categoryProducts, q, categoryKeywords, maxPrice);
  }

  // Extract keywords and apply AND logic for multi-feature queries
  const keywords = q.split(' ').filter(word => word.length > 2);
  
  // Special handling for price-only queries (like "under rs 1000")
  const isPriceOnlyQuery = maxPrice && keywords.filter(word => 
    !['under', 'below', 'less', 'than', 'rs', 'rs.', '₹'].includes(word) && 
    !/^\d+$/.test(word)
  ).length === 0;
  
  if (isPriceOnlyQuery) {
    return applyPriceAndSort(allProducts, maxPrice);
  }

  const candidates = allProducts;
  
  // Special handling for brand queries
  const isBrandQuery = /^(intel|amd|nvidia|corsair|logitech|razer|asus|hp|dell|lenovo|msi|acer)$/i.test(q.trim());
  
  // Special handling for feature combinations
  const hasWirelessKeyword = /wireless|bluetooth/.test(q);
  const { hasRgbKeyword, hasNonRgbKeyword } = detectQueryFeatures(q);
  const hasMechanicalKeyword = /mechanical/.test(q);
  const hasGamingKeyword = /gaming/.test(q);
  
  // Debug query feature detection
  console.log(`🔍 Query "${q}" - RGB: ${hasRgbKeyword}, Non-RGB: ${hasNonRgbKeyword}`);
  

  
  const filtered = candidates
    .filter(p => {
      const text = getProductText(p);
      
      // Check for specific feature combinations with proper AND logic
      const hasWireless = /wireless|bluetooth|bt\s/.test(text);
      const { hasRgb, hasNonRgb } = detectRgbFeatures(text);
      const hasMechanical = /mechanical/.test(text);
      const hasGaming = /gaming|gamer/.test(text);
      
      // Apply feature filters based on what's in the query
      if (hasWirelessKeyword && !hasWireless) return false;
      if (hasRgbKeyword && !hasRgb) return false;
      if (hasNonRgbKeyword && !hasNonRgb) {
        // Debug RGB filtering
        if (q.includes('non rgb')) {
          console.log(`🔍 Filtering out "${p.name}" - hasNonRgb: ${hasNonRgb}, hasRgb: ${hasRgb}, text: "${text.substring(0, 100)}..."`);
        }
        return false;
      }
      if (hasMechanicalKeyword && !hasMechanical) return false;
      if (hasGamingKeyword && !hasGaming) return false;
      
      // For category + feature combinations, we already filtered by category above
      // Now just ensure the features match
      if (targetCategory && (hasWirelessKeyword || hasRgbKeyword || hasNonRgbKeyword || hasMechanicalKeyword || hasGamingKeyword)) {
        return true; // All feature requirements already checked above
      }
      
      // For single category queries, return all products in that category
      if (keywords.length === 1 && targetCategory) {
        const categoryKeyword = keywords[0];
        if (['headphone', 'headphones', 'laptop', 'laptops', 'keyboard', 'keyboards', 'mouse', 'mice', 'chair', 'chairs', 'desk', 'desks', 'table', 'tables', 'webcam', 'webcams', 'camera', 'cameras', 'processor', 'processors', 'cpu', 'cpus', 'ram', 'rams', 'memory'].includes(categoryKeyword)) {
          return true;
        }
      }
      
      // For brand queries, prioritize products where the brand appears in the name
      if (isBrandQuery && keywords.length === 1) {
        const brandName = keywords[0];
        const nameMatch = p.name.toLowerCase().includes(brandName);
        
        // For Intel/AMD, strongly prefer processors
        if ((brandName === 'intel' || brandName === 'amd') && p.category.toLowerCase() === 'processor') {
          return nameMatch;
        }
         
        // For other categories, only include if brand is prominently in the name
        return nameMatch;
      }
      
      // Special handling for DDR memory queries
      if (isDDRQuery && p.category.toLowerCase() === 'ram') {
        const ddrMatch = q.match(/\b(ddr[2-6])\b/i);
        if (ddrMatch) {
          const ddrType = ddrMatch[1].toLowerCase();
          return text.includes(ddrType);
        }
      }
      
      // For general keyword queries, use keyword matching with frequency normalization
      const matchedKeywords = keywords.filter(word => matchesFrequency(text, word));
      return matchedKeywords.length >= Math.min(2, keywords.length);
    });
    
  // Apply price filter and return sorted results with keyword scoring
  const priceFiltered = maxPrice ? filtered.filter(p => {
    const priceStr = String(p.price).replace(/[^\d]/g, '');
    const price = parseInt(priceStr) || 0;
    return price <= maxPrice;
  }) : filtered;
  
  return priceFiltered
    .map(p => ({
      product: p,
      score: keywords.reduce((acc, word) => {
        const text = getProductText(p);
        return acc + (matchesFrequency(text, word) ? 3 : 0);
      }, 0) + (p.rating || 0) * 2
    }))
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}

// Types
interface SearchCriteria {
  category?: string | string[]; // Support both single and multiple categories
  features: {
    brand?: string | null;
    connectivity?: 'wireless' | 'wired' | 'dual' | null;
    lighting?: 'rgb' | 'non-rgb' | null;
    rgb?: boolean | null; // Add explicit rgb boolean
    wireless?: boolean | null; // Add explicit wireless boolean
    mechanical?: boolean | null;
    gaming?: boolean | null;
    noiseCancelling?: boolean | null;
    ergonomic?: boolean | null;
    portable?: boolean | null;
    microphone?: boolean | null;
    tkl?: boolean | null;
    hotSwap?: boolean | null;
    intel?: boolean | null;
    amd?: boolean | null;
    nvidia?: boolean | null;
    rtx?: boolean | null;
    ssd?: boolean | null;
    touchscreen?: boolean | null;
    noiseCancellation?: boolean | null;
    backlit?: boolean | null;
    overEar?: boolean | null;
    adjustable?: boolean | null;
    processorModel?: string | null;
    ddr?: string | null;
    resolution?: string | null;
    fps?: string | null;
    silent?: boolean | null;
    surround?: boolean | null;
    dpi?: number | null;
    storage?: string | null;
    size?: string | null;
  };
  specs: {
    maxPrice?: number | null;
    minRating?: number | null;
    frequency?: string | null;
    capacity?: string | null;
  };
}

// Progressive fallback with brand preservation: exact match → brand only → category only
function getProgressiveFallback(originalCriteria: SearchCriteria): Product[] {
  // If no category, can't do progressive fallback
  if (!originalCriteria.category || originalCriteria.category.length === 0) {
    return [];
  }
  
  // Progressive 3-step fallback:
  // Step 1: Already tried exact match (that's why we're here)
  // Step 2: Try preserving important brand features (Intel/AMD for processors)
  const importantFeatures: Record<string, boolean> = {};
  if (originalCriteria.features.intel) importantFeatures.intel = true;
  if (originalCriteria.features.amd) importantFeatures.amd = true;
  if (originalCriteria.features.nvidia) importantFeatures.nvidia = true;
  if (originalCriteria.features.rtx) importantFeatures.rtx = true;
  
  if (Object.keys(importantFeatures).length > 0) {
    const brandOnlyResults: SearchCriteria = {
      category: originalCriteria.category,
      features: importantFeatures,
      specs: {
        maxPrice: originalCriteria.specs.maxPrice, // Preserve price constraint
        minRating: originalCriteria.specs.minRating, // Preserve rating constraint
        frequency: null, // Clear frequency constraint for fallback
        capacity: null   // Clear capacity constraint for fallback
      }
    };
    
    const brandResults = filterProducts(brandOnlyResults);
    if (brandResults.length > 0) {
      return brandResults;
    }
  }
  
  // Step 3: Show all products in the category, but preserve price and rating constraints
  const categoryOnlyResults: SearchCriteria = {
    category: originalCriteria.category,
    features: {},
    specs: {
      maxPrice: originalCriteria.specs.maxPrice, // Preserve price constraint
      minRating: originalCriteria.specs.minRating, // Preserve rating constraint
      frequency: null, // Clear frequency constraint for fallback
      capacity: null   // Clear capacity constraint for fallback
    }
  };
  
  return filterProducts(categoryOnlyResults);
}

// Try to parse the query using AI service (or local AI) and return structured criteria
async function tryParseCriteria(query: string, opts?: { debug?: boolean }): Promise<SearchCriteria | null> {
  try {
    const criteria = await parseSearchQuery(query);
    if (opts?.debug) console.log(`parseSearchQuery returned:`, criteria);
    return criteria;
  } catch (err) {
    if (opts?.debug) console.log('tryParseCriteria error:', err);
    return null;
  }
}

// Build the response object when AI returned structured criteria
function buildAiResponse(criteria: SearchCriteria, query: string, correctedQuery: string, opts?: { debug?: boolean }) {
  const results = filterProducts(criteria);
  if (opts?.debug) console.log(`AI filtered results count: ${results.length}`);

  // Smart processor prioritization: if specific processor model detected, prioritize Processor category
  if (criteria.features.processorModel && results.length > 0) {
    const processorResults = results.filter(p => p.category.toLowerCase() === 'processor');
    if (processorResults.length > 0) {
      if (opts?.debug) console.log(`Processor priority: ${processorResults.length} items`);
      return {
        ids: processorResults.map(p => p.id),
        source: "ai-structured",
        query: correctedQuery,
        originalQuery: query !== correctedQuery ? query : undefined,
        ...(opts?.debug && { debug: { criteria, resultCount: processorResults.length, prioritized: 'processors' } })
      };
    }
  }

  if (results.length > 0) {
    return {
      ids: results.map(p => p.id),
      source: "ai-structured",
      query: correctedQuery,
      originalQuery: query !== correctedQuery ? query : undefined,
      ...(opts?.debug && { debug: { criteria, resultCount: results.length } })
    };
  }

  // If no perfect matches, try progressive fallback with relaxed criteria
  const fallbackResults = getProgressiveFallback(criteria);
  if (fallbackResults.length > 0) {
    return {
      ids: fallbackResults.map(p => p.id),
      source: "ai-partial",
      query: correctedQuery,
      originalQuery: query !== correctedQuery ? query : undefined,
      ...(opts?.debug && { debug: { originalCriteria: criteria, resultCount: fallbackResults.length } })
    };
  }

  return null;
}

// Build the response object for final simple fallback
function buildFallbackResponse(results: Product[], normalizedQuery: string, originalQuery: string, opts?: { debug?: boolean }) {
  return {
    ids: results.map(p => p.id),
    source: "fallback",
    query: normalizedQuery,
    originalQuery: originalQuery !== normalizedQuery ? originalQuery : undefined,
    ...(opts?.debug && { debug: { resultCount: results.length } })
  };
}

// Main search function
export default async function search(query: string, opts?: { debug?: boolean }) {
  console.log(`🔍 Starting search for "${query}", total products available: ${allProducts.length}`);
  
  // Apply typo correction
  const correctedQuery = correctTypos(query);
  if (correctedQuery !== query.toLowerCase()) {
    console.log(`✏️ Typo correction: "${query}" → "${correctedQuery}"`);
  }
  
  // Expand with synonyms for better matching
  const expandedQuery = expandQueryWithSynonyms(correctedQuery);
  const queryVariants = expandedQuery.split(' | ');
  console.log(`📚 Query variants (${queryVariants.length}):`, queryVariants);
  
  // Normalize the query for consistent handling across AI and fallback
  const normalizedQuery = correctedQuery
    .replace(/(\d+)\s*(mt\/s|mts|MT\/S|MTS)\b/gi, '$1 mhz')
    .replace(/(\d+)(mt\/s|mts|MT\/S|MTS)\b/gi, '$1mhz');
    
  try {
    // Try AI parsing with corrected query first
    const criteria = await tryParseCriteria(correctedQuery, opts);
    if (criteria) {
      console.log(`🤖 AI Parsing result for "${correctedQuery}": category="${criteria.category}"`);
    }

    if (criteria) {
      const aiResponse = buildAiResponse(criteria, query, correctedQuery, opts);
      if (aiResponse) return aiResponse;
    }
  } catch (error) {
    if (opts?.debug) {
      console.log("AI search failed, using fallback:", error);
    }
    console.log(`❌ AI Failed: Using simple fallback for "${correctedQuery}"`);
  }
  
  // Try with synonym variations if original query failed
  let bestResults: Product[] = [];
  let bestScore = 0;
  
  for (const variant of queryVariants) {
    const variantNormalized = variant
      .replace(/(\d+)\s*(mt\/s|mts|MT\/S|MTS)\b/gi, '$1 mhz')
      .replace(/(\d+)(mt\/s|mts|MT\/S|MTS)\b/gi, '$1mhz');
    
    const results = simpleFallback(variantNormalized);
    
    // Calculate aggregate score for this variant's results
    const score = results.reduce((sum, p) => sum + (p.rating || 0), 0);
    
    if (results.length > bestResults.length || (results.length === bestResults.length && score > bestScore)) {
      bestResults = results;
      bestScore = score;
      console.log(`🎯 Better variant found: "${variant}" (${results.length} results, score: ${score})`);
    }
  }
  
  console.log(`🔍 Best results: Found ${bestResults.length} results using typo correction and synonyms`);
  console.log(`📋 Sample results:`, bestResults.slice(0, 3).map(p => `${p.name} (${p.category})`));
  return buildFallbackResponse(bestResults, correctedQuery, query, opts);
}
