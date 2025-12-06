import { products as allProducts, Product } from "@/data/products";

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

// Helper function removed - was unused

// Local AI parser (inspired by Python model)
function parseQueryWithLocalAI(query: string): SearchCriteria | null {
  const q = query.toLowerCase().trim();
  
  // Category patterns (updated to match singular category names)
  const categoryPatterns = {
    'Laptop': /\b(laptop|laptops|notebook|notebooks|gaming laptop|portable laptop)\b/,
    'Ram': /\b(ram|rams|memory|ddr[2-6])\b/,
    'Processor': /\b(processor|processors|cpu|cpus|intel|amd|ryzen|i3|i5|i7|i9)\b/,
    'Keyboard': /\b(keyboard|keyboards)\b/,
    'Mouse': /\b(mouse|mice)\b/,
    'Headphone': /\b(headphone|headphones|headset|headsets|earphone|earphones)\b/,
    'Webcam': /\b(webcam|webcams|camera|cameras)\b/,
    'Chair': /\b(chair|chairs)\b/,
    'Table': /\b(desk|desks|table|tables)\b/
  };

  // Feature patterns
  const featurePatterns = {
    rgb: /\brgb\b(?!.*(?:no|without|non))/,
    nonRgb: /\b(non[\s-]?rgb|no\s+rgb|without\s+rgb|no\s+integrated\s+rgb)\b/,
    wireless: /\b(wireless|bluetooth|bt\s)\b/,
    wired: /(wired|cable|3\.5mm|aux|jack)/i,
    microphone: /(mic|microphone|with\s+mic)/i,
    gaming: /\bgaming\b/,
    mechanical: /\bmechanical\b/,
    noiseCancelling: /\b(noise\s+cancel|noise\s+reduction)\b/,
    ergonomic: /\bergonomic\b/,
    portable: /\bportable\b/,
    ddr3: /\bddr3\b/i,
    ddr4: /\bddr4\b/i,
    ddr5: /\bddr5\b/i,
    ddr6: /\bddr6\b/i,
    silent: /\b(silent|quiet)\b/i,
    tkl: /\b(tkl|tenkeyless|ten\s*key\s*less)\b/i,
    hotSwap: /\b(hot[\s-]?swap|swappable)\b/i,
    // Processor brands
    intel: /\bintel\b/i,
    amd: /\bamd\b/i,
    // Specific processor models
    intelI3: /\bintel[\s-]*(?:core[\s-]*)?i3\b/i,
    intelI5: /\bintel[\s-]*(?:core[\s-]*)?i5\b/i,
    intelI7: /\bintel[\s-]*(?:core[\s-]*)?i7\b/i,
    intelI9: /\bintel[\s-]*(?:core[\s-]*)?i9\b/i,
    // AMD patterns - flexible to work with or without "amd" prefix
    amdRyzen3: /\b(?:amd[\s-]*)?ryzen[\s-]*3\b/i,
    amdRyzen5: /\b(?:amd[\s-]*)?ryzen[\s-]*5\b/i,
    amdRyzen7: /\b(?:amd[\s-]*)?ryzen[\s-]*7\b/i,
    amdRyzen9: /\b(?:amd[\s-]*)?ryzen[\s-]*9\b/i,
    // Graphics
    nvidia: /\bnvidia\b/i,
    rtx: /\brtx\b/i,
    gtx: /\bgtx\b/i,
    // Storage types
    ssd: /\bssd\b/i,
    hdd: /\bhdd\b/i,
    // Display features
    touchscreen: /\b(touch\s*screen|touchscreen)\b/i,
    // Resolution patterns
    res4k: /\b(4k|uhd|3840.*2160|ultra[\s-]?hd)\b/i,
    res1440p: /\b(1440p|2560.*1440|qhd|quad[\s-]?hd)\b/i,
    res1080p: /\b(1080p|1920.*1080|fhd|full[\s-]?hd)\b/i,
    res720p: /\b(720p|1280.*720|hd)\b/i,
    // Headphone types
    overEar: /\b(over[\s-]?ear|over[\s-]?the[\s-]?ear)\b/i,
    onEar: /\b(on[\s-]?ear)\b/i,
    inEar: /\b(in[\s-]?ear|earbuds?)\b/i,
    // Additional features
    noiseCancellation: /\b(noise[\s-]?cancel|anc|active[\s-]?noise)\b/i,
    backlit: /\b(backlit|back[\s-]?light|illuminated)\b/i,
    foldable: /\bfoldable\b/i,
    waterproof: /\b(waterproof|water[\s-]?resistant|ipx)\b/i,
    adjustable: /\badjustable\b/i
  };

  // Price pattern
  const pricePattern = /(?:under|below|less\s+than)\s+(?:rs\.?\s*|₹\s*)?(\d+(?:,\d+)*)/i;
  const priceMatch = q.match(pricePattern);

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
  if (featurePatterns.noiseCancelling.test(q)) {
    detectedFeatures.noiseCancelling = true;
  }
  if (featurePatterns.ergonomic.test(q)) {
    detectedFeatures.ergonomic = true;
  }
  if (featurePatterns.portable.test(q)) {
    detectedFeatures.portable = true;
  }
  
  // DDR detection
  let detectedDdr = null;
  if (featurePatterns.ddr6.test(q)) {
    detectedDdr = 'ddr6';
  } else if (featurePatterns.ddr5.test(q)) {
    detectedDdr = 'ddr5';
  } else if (featurePatterns.ddr4.test(q)) {
    detectedDdr = 'ddr4';
  } else if (featurePatterns.ddr3.test(q)) {
    detectedDdr = 'ddr3';
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

  // Only return structured criteria if we detected meaningful patterns
  if (detectedCategories.length > 0 || Object.keys(detectedFeatures).length > 0 || priceMatch || frequencyMatch || capacityMatch || detectedResolution || detectedDdr || detectedDpi) {
    return {
      category: detectedCategories.length === 1 ? detectedCategories[0] : detectedCategories,
      features: {
        // Map to existing interface properties
        lighting: detectedFeatures.rgb === true ? 'rgb' : (detectedFeatures.rgb === false ? 'non-rgb' : null),
        connectivity: detectedFeatures.wireless ? 'wireless' : (detectedFeatures.wired ? 'wired' : null),

        gaming: detectedFeatures.gaming === true ? true : null,
        mechanical: detectedFeatures.mechanical === true ? true : null,
        ergonomic: detectedFeatures.ergonomic === true ? true : null,
        silent: detectedFeatures.silent === true ? true : (detectedFeatures.noiseCancelling === true ? true : null),
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
        maxPrice: priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null,
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
        console.log(`🤖 Custom AI Service result for "${query}":`, result.criteria, `(${Math.round(result.confidence * 100)}% confidence)`);
        
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
    console.log(`🧠 Local AI result for "${query}":`, localAIResult);
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
      // Add uppercase variants for AI service compatibility
      'Laptop': 'Laptop',
      'Headphone': 'Headphone', 
      'Keyboard': 'Keyboard',
      'Mouse': 'Mouse',
      'Chair': 'Chair',
      'Table': 'Table',
      'Processor': 'Processor',
      'Ram': 'Ram',
      'Webcam': 'Webcam'
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
        '1080p': /1080p|1920.*1080|fhd|full hd/i,
        'fhd': /fhd|1080p|full hd/i,
        'hd': /hd|720p/i
      };
      if (!resMap[features.resolution]?.test(text)) return false;
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
  const priceMatch = q.match(/(?:under|below|less\s+than)\s+(?:rs\.?\s+|₹\s*)?(\d+(?:,\d+)*)/i);
  const maxPrice = priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null;
  
  // Helper function to apply price filter
  const applyPriceFilter = (products: Product[]) => {
    if (!maxPrice) return products;
    return products.filter(p => {
      const priceStr = String(p.price).replace(/[^\d]/g, '');
      const price = parseInt(priceStr) || 0;
      return price <= maxPrice;
    });
  };
  
  // Special handling for DDR memory queries - should only show RAM products
  const isDDRQuery = /\b(ddr[2-6])\b/i.test(q);
  
  // Special handling for DDR queries - only show RAM products with hierarchical fallback
  if (isDDRQuery) {
    const ramProducts = allProducts.filter(p => p.category === 'Ram');
    const ddrMatch = q.match(/\b(ddr[2-6])\b/i);
    
    if (ddrMatch) {
      const ddrType = ddrMatch[1].toLowerCase();
      
      // Extract all non-DDR, non-category keywords for exact matching
      const keywords = q.split(' ').filter(word => 
        word.length > 2 && 
        !['ddr3', 'ddr4', 'ddr5', 'ddr6', 'ram', 'rams', 'memory'].includes(word.toLowerCase())
      );
      
      // Try exact match: DDR type + all other specifications
      const exactMatch = ramProducts.filter(p => {
        const text = getProductText(p);
        
        // Must have the DDR type
        if (!text.includes(ddrType)) return false;
        
        // Must match all other keywords
        return keywords.every(keyword => {
          // Handle frequency normalization - normalize MT/s variants to MHz for matching
          let normalizedKeyword = keyword.toLowerCase();
          const freqMatch = keyword.match(/^(\d+)(mhz|mts|mt\/s)$/i);
          if (freqMatch) {
            const freqNumber = freqMatch[1];
            normalizedKeyword = `${freqNumber}mhz`;
            // Also check for the raw number in case product lists it differently
            return text.includes(freqNumber) || text.includes(normalizedKeyword);
          }
          return text.includes(normalizedKeyword);
        });
      });
      
      // If exact match found, return it
      if (exactMatch.length > 0) {
        const filtered = applyPriceFilter(exactMatch);
        return filtered
          .map(p => ({
            product: p,
            score: (p.rating || 0) * 2
          }))
          .sort((a, b) => b.score - a.score)
          .map(item => item.product);
      }
      
      // Fallback: all DDR products of this type only
      const ddrOnlyMatch = ramProducts.filter(p => {
        const text = getProductText(p);
        return text.includes(ddrType);
      });
      
      if (ddrOnlyMatch.length > 0) {
        const filtered = applyPriceFilter(ddrOnlyMatch);
        return filtered
          .map(p => ({
            product: p,
            score: (p.rating || 0) * 2
          }))
          .sort((a, b) => b.score - a.score)
          .map(item => item.product);
      }
      
      // Final fallback: all RAM (should not reach here for valid DDR queries)
      const filtered = applyPriceFilter(ramProducts);
      return filtered
        .map(p => ({
          product: p,
          score: (p.rating || 0) * 2
        }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
    }
  }

  // Special handling for desktop - don't let it match "desk" pattern
  if (q.trim() === 'desktop') {
    // For desktop queries, use ALL products (no category filtering)
    const candidates = allProducts;
    
    // Special handling for desktop queries (no category filtering)

    const filtered = candidates.filter(p => {
      const text = getProductText(p);
      
      // Special handling for desktop queries - show ALL desktop computer components
      if (isDesktopQuery) {
        // Include ALL products from desktop computer component categories
        if (['Processors', 'RAM', 'Keyboards', 'Mouse', 'Webcams', 'Headphones'].includes(p.category)) {
          return true;
        }
        
        // Exclude furniture categories (chairs, tables)
        if (['Chairs', 'Tables'].includes(p.category)) {
          return false;
        }
        
        // For any other categories, include if they mention desktop
        return text.includes('desktop');
      }
      
      return false; // This shouldn't be reached for desktop queries
    });
    
    // Apply price filter to desktop results
    const priceFiltered = applyPriceFilter(filtered);
    
    return priceFiltered
      .map(p => ({
        product: p,
        score: (p.rating || 0) * 2
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 200) // Show ALL desktop results
      .map(item => item.product);
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
    'webcams?|cameras?': 'Webcams'
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
    const categoryProducts = allProducts.filter(p => p.category === targetCategory);
    
    // First try: exact match with all specified features
    const exactMatch = categoryProducts.filter(p => {
      const text = getProductText(p);
      
      // Check all keyword requirements
      const keywords = q.split(' ').filter(word => word.length > 2 && 
        !['ram', 'rams', 'memory', 'keyboard', 'keyboards', 'mouse', 'mice', 'laptop', 'laptops', 
          'headphone', 'headphones', 'webcam', 'webcams', 'processor', 'processors'].includes(word));
      
      // All non-category keywords must match
      return keywords.every(keyword => {
        // Handle frequency normalization - normalize MT/s variants to MHz for matching
        let normalizedKeyword = keyword;
        const freqMatch = keyword.match(/^(\d+)(mhz|mts|mt\/s)$/i);
        if (freqMatch) {
          const freqNumber = freqMatch[1];
          normalizedKeyword = `${freqNumber}mhz`;
          // Also check for the raw number in case product lists it differently
          return text.includes(freqNumber) || text.includes(normalizedKeyword);
        }
        return text.includes(normalizedKeyword);
      });
    });
    
    // If exact match found, return it
    if (exactMatch.length > 0) {
      const filtered = applyPriceFilter(exactMatch);
      return filtered
        .map(p => ({
          product: p,
          score: (p.rating || 0) * 2
        }))
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
    }
    
    // Fallback: return all products in category
    const filtered = applyPriceFilter(categoryProducts);
    return filtered
      .map(p => ({
        product: p,
        score: (p.rating || 0) * 2
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
  }

  // Extract keywords and apply AND logic for multi-feature queries
  const keywords = q.split(' ').filter(word => word.length > 2);
  
  // Special handling for price-only queries (like "under rs 1000")
  const isPriceOnlyQuery = maxPrice && keywords.filter(word => 
    !['under', 'below', 'less', 'than', 'rs', 'rs.', '₹'].includes(word) && 
    !/^\d+$/.test(word)
  ).length === 0;
  
  if (isPriceOnlyQuery) {
    // For price-only queries, show all products under the price limit
    const allFiltered = applyPriceFilter(allProducts);
    return allFiltered
      .map(p => ({
        product: p,
        score: (p.rating || 0) * 2
      }))
      .sort((a, b) => b.score - a.score)
      .map(item => item.product);
  }

  const candidates = allProducts;
  
  // Special handling for brand queries
  const isBrandQuery = /^(intel|amd|nvidia|corsair|logitech|razer|asus|hp|dell|lenovo|msi|acer)$/i.test(q.trim());
  
  // Special handling for desktop queries
  const isDesktopQuery = /^desktop$/i.test(q.trim());
  
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
        if ((brandName === 'intel' || brandName === 'amd') && p.category === 'Processors') {
          return nameMatch;
        }
         
        // For other categories, only include if brand is prominently in the name
        return nameMatch;
      }
      
      // Special handling for DDR memory queries
      if (isDDRQuery && p.category === 'Ram') {
        const ddrMatch = q.match(/\b(ddr[2-6])\b/i);
        if (ddrMatch) {
          const ddrType = ddrMatch[1].toLowerCase();
          return text.includes(ddrType);
        }
      }
      
      // For general keyword queries, use keyword matching with frequency normalization
      const matchedKeywords = keywords.filter(word => {
        // Regular text matching
        if (text.includes(word)) return true;
        
        // Special handling for frequency terms - normalize MHz/MT/s equivalence
        const freqMatch = word.match(/^(\d+)(mhz|mts|mt\/s)$/i);
        if (freqMatch) {
          const freqNumber = freqMatch[1];
          // Normalize to MHz format and also check raw number
          const normalizedFreq = `${freqNumber}mhz`;
          return text.includes(freqNumber) || text.includes(normalizedFreq) || text.includes(`${freqNumber} mhz`);
        }
        
        return false;
      });
      return matchedKeywords.length >= Math.min(2, keywords.length);
    });
    
  // Apply price filter to final results
  const priceFiltered = applyPriceFilter(filtered);
  
  return priceFiltered
    .map(p => ({
      product: p,
      score: keywords.reduce((acc, word) => {
        const text = getProductText(p);
        return acc + (text.includes(word) ? 3 : 0);
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

// Main search function
export default async function search(query: string, opts?: { debug?: boolean }) {
  console.log(`🔍 Starting search for "${query}", total products available: ${allProducts.length}`);
  
  // Normalize the query for consistent handling across AI and fallback
  const normalizedQuery = query
    .replace(/(\d+)\s*(mt\/s|mts|MT\/S|MTS)\b/gi, '$1 mhz')
    .replace(/(\d+)(mt\/s|mts|MT\/S|MTS)\b/gi, '$1mhz');
    
  try {
    // Try AI parsing first
    const criteria = await parseSearchQuery(query);
    console.log(`🤖 AI Parsing result for "${query}":`, criteria);
    
    if (criteria) {
      const results = filterProducts(criteria);
      console.log(`✅ AI-filtered results: ${results.length} products`);
      
      // Smart processor prioritization: if specific processor model detected, prioritize Processor category
      if (criteria.features.processorModel && results.length > 0) {
        const processorResults = results.filter(p => p.category === 'Processor');
        if (processorResults.length > 0) {
          console.log(`🎯 Processor Priority: Found ${processorResults.length} specific processors for "${query}"`);
          return {
            ids: processorResults.map(p => p.id),
            source: "ai-structured",
            query,
            ...(opts?.debug && { debug: { criteria, resultCount: processorResults.length, prioritized: 'processors' } })
          };
        }
      }
      
      // If perfect match found, return it
      if (results.length > 0) {
        console.log(`🤖 AI Search: Found ${results.length} results for "${query}"`);
        return {
          ids: results.map(p => p.id),
          source: "ai-structured",
          query,
          ...(opts?.debug && { debug: { criteria, resultCount: results.length } })
        };
      }
      
      // If no perfect matches, try progressive fallback with relaxed criteria
      const fallbackResults = getProgressiveFallback(criteria);
      if (fallbackResults.length > 0) {
        console.log(`🤖➡️ AI Partial Fallback: Found ${fallbackResults.length} results for "${query}"`);
        return {
          ids: fallbackResults.map(p => p.id),
          source: "ai-partial",
          query,
          ...(opts?.debug && { debug: { originalCriteria: criteria, resultCount: fallbackResults.length } })
        };
      }
    }
  } catch (error) {
    if (opts?.debug) {
      console.log("AI search failed, using fallback:", error);
    }
    console.log(`❌ AI Failed: Using simple fallback for "${query}"`);
  }
  
  // Final fallback to simple search with improved AND logic
  const results = simpleFallback(normalizedQuery);
  console.log(`🔍 Simple Fallback: Found ${results.length} results for "${query}"`);
  console.log(`📋 Sample results:`, results.slice(0, 3).map(p => `${p.name} (${p.category})`));
  return {
    ids: results.map(p => p.id),
    source: "fallback", 
    query: normalizedQuery,
    ...(opts?.debug && { debug: { resultCount: results.length } })
  };
}