// NextPhases -- Master Script (stabilized)

(function () {
    'use strict';

    // ============================================================================
    // GLOBAL PRICING DATA - Single Source of Truth
    // ============================================================================
    // Budget tiers for default project types (Web, App, etc.)
    const budgetMapDefault = {
        USD_ZW: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-300-600', label: 'Starter: USD 300 - 600' },
            { value: 'usd-600-1000', label: 'Standard: USD 600 - 1,000' },
            { value: 'usd-1000-1800', label: 'Professional: USD 1,000 - 1,800' },
            { value: 'usd-1800+', label: 'Enterprise: USD 1,800+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_USCA: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-700-1500', label: 'Starter: USD 700 - 1,500' },
            { value: 'usd-1500-2500', label: 'Standard: USD 1,500 - 2,500' },
            { value: 'usd-2500-4000', label: 'Professional: USD 2,500 - 4,000' },
            { value: 'usd-4000+', label: 'Enterprise: USD 4,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_WE: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-500-900', label: 'Starter: USD 500 - 900' },
            { value: 'usd-900-1500', label: 'Standard: USD 900 - 1,500' },
            { value: 'usd-1500-2500', label: 'Professional: USD 1,500 - 2,500' },
            { value: 'usd-2500+', label: 'Enterprise: USD 2,500+' }
        ],
        USD_NAM: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-800-1500', label: 'Starter: USD 800 - 1,500' },
            { value: 'usd-1500-2800', label: 'Standard: USD 1,500 - 2,800' },
            { value: 'usd-2800-5000', label: 'Professional: USD 2,800 - 5,000' },
            { value: 'usd-5000+', label: 'Enterprise: USD 5,000+' }
        ],
        USD: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-300-700', label: 'Starter: USD 300 - 700' },
            { value: 'usd-700-1500', label: 'Standard: USD 700 - 1,500' },
            { value: 'usd-1500-3000', label: 'Professional: USD 1,500 - 3,000' },
            { value: 'usd-3000+', label: 'Enterprise: USD 3,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        ZMW: [
            { value: '', label: 'Select budget range' },
            { value: 'zmw-2000-3500', label: 'Starter: ZMW 2,000 - 3,500' },
            { value: 'zmw-3500-5500', label: 'Standard: ZMW 3,500 - 5,500' },
            { value: 'zmw-5500-8000', label: 'Professional: ZMW 5,500 - 8,000' },
            { value: 'zmw-8000+', label: 'Enterprise: ZMW 8,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        ZAR: [
            { value: '', label: 'Select budget range' },
            { value: 'zar-2500-4500', label: 'Starter: ZAR 2,500 - 4,500' },
            { value: 'zar-4500-7000', label: 'Standard: ZAR 4,500 - 7,000' },
            { value: 'zar-7000-10000', label: 'Professional: ZAR 7,000 - 10,000' },
            { value: 'zar-10000+', label: 'Enterprise: ZAR 10,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        GBP: [
            { value: '', label: 'Select budget range' },
            { value: 'gbp-500-900', label: 'Starter: GBP 500 - 900' },
            { value: 'gbp-900-1400', label: 'Standard: GBP 900 - 1,400' },
            { value: 'gbp-1400-2000', label: 'Professional: GBP 1,400 - 2,000' },
            { value: 'gbp-2000+', label: 'Enterprise: GBP 2,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        AUD: [
            { value: '', label: 'Select budget range' },
            { value: 'aud-1200-2200', label: 'Starter: AUD 1,200 - 2,200' },
            { value: 'aud-2200-3800', label: 'Standard: AUD 2,200 - 3,800' },
            { value: 'aud-3800-6000', label: 'Professional: AUD 3,800 - 6,000' },
            { value: 'aud-6000+', label: 'Enterprise: AUD 6,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        NZD: [
            { value: '', label: 'Select budget range' },
            { value: 'nzd-1300-2400', label: 'Starter: NZD 1,300 - 2,400' },
            { value: 'nzd-2400-4000', label: 'Standard: NZD 2,400 - 4,000' },
            { value: 'nzd-4000-6500', label: 'Professional: NZD 4,000 - 6,500' },
            { value: 'nzd-6500+', label: 'Enterprise: NZD 6,500+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        CAD: [
            { value: '', label: 'Select budget range' },
            { value: 'cad-900-1800', label: 'Starter: CAD 900 - 1,800' },
            { value: 'cad-1800-3200', label: 'Standard: CAD 1,800 - 3,200' },
            { value: 'cad-3200-5500', label: 'Professional: CAD 3,200 - 5,500' },
            { value: 'cad-5500+', label: 'Enterprise: CAD 5,500+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        CHF: [
            { value: '', label: 'Select budget range' },
            { value: 'chf-600-1100', label: 'Starter: CHF 600 - 1,100' },
            { value: 'chf-1100-1800', label: 'Standard: CHF 1,100 - 1,800' },
            { value: 'chf-1800-2800', label: 'Professional: CHF 1,800 - 2,800' },
            { value: 'chf-2800+', label: 'Enterprise: CHF 2,800+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        EUR_EAST: [
            { value: '', label: 'Select budget range' },
            { value: 'eur-350-650', label: 'Starter: EUR 350 - 650' },
            { value: 'eur-650-1100', label: 'Standard: EUR 650 - 1,100' },
            { value: 'eur-1100-1800', label: 'Professional: EUR 1,100 - 1,800' },
            { value: 'eur-1800+', label: 'Enterprise: EUR 1,800+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_GULF: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-1000-1800', label: 'Starter: USD 1,000 - 1,800' },
            { value: 'usd-1800-3200', label: 'Standard: USD 1,800 - 3,200' },
            { value: 'usd-3200-5500', label: 'Professional: USD 3,200 - 5,500' },
            { value: 'usd-5500+', label: 'Enterprise: USD 5,500+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_ASIA_PREM: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-800-1500', label: 'Starter: USD 800 - 1,500' },
            { value: 'usd-1500-2500', label: 'Standard: USD 1,500 - 2,500' },
            { value: 'usd-2500-4200', label: 'Professional: USD 2,500 - 4,200' },
            { value: 'usd-4200+', label: 'Enterprise: USD 4,200+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_ASIA_STD: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-450-850', label: 'Starter: USD 450 - 850' },
            { value: 'usd-850-1400', label: 'Standard: USD 850 - 1,400' },
            { value: 'usd-1400-2400', label: 'Professional: USD 1,400 - 2,400' },
            { value: 'usd-2400+', label: 'Enterprise: USD 2,400+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_ASIA_AFD: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-350-650', label: 'Starter: USD 350 - 650' },
            { value: 'usd-650-1100', label: 'Standard: USD 650 - 1,100' },
            { value: 'usd-1100-1900', label: 'Professional: USD 1,100 - 1,900' },
            { value: 'usd-1900+', label: 'Enterprise: USD 1,900+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_LATAM: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-350-650', label: 'Starter: USD 350 - 650' },
            { value: 'usd-650-1100', label: 'Standard: USD 650 - 1,100' },
            { value: 'usd-1100-1900', label: 'Professional: USD 1,100 - 1,900' },
            { value: 'usd-1900+', label: 'Enterprise: USD 1,900+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        EUR: [
            { value: '', label: 'Select budget range' },
            { value: 'eur-550-1000', label: 'Starter: EUR 550 - 1,000' },
            { value: 'eur-1000-1600', label: 'Standard: EUR 1,000 - 1,600' },
            { value: 'eur-1600-2300', label: 'Professional: EUR 1,600 - 2,300' },
            { value: 'eur-2300+', label: 'Enterprise: EUR 2,300+' },
            { value: 'flexible', label: 'Flexible' }
        ]
    };

    // Budget tiers specifically for System Development projects
    const budgetMapSystems = {
        USD_ZW: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-700-1200', label: 'Starter: USD 700 - 1,200' },
            { value: 'usd-1200-2000', label: 'Standard: USD 1,200 - 2,000' },
            { value: 'usd-2000-3500', label: 'Professional: USD 2,000 - 3,500' },
            { value: 'usd-3500+', label: 'Enterprise: USD 3,500+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_USCA: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-2000-3500', label: 'Starter: USD 2,000 - 3,500' },
            { value: 'usd-3500-6000', label: 'Standard: USD 3,500 - 6,000' },
            { value: 'usd-6000-10000', label: 'Professional: USD 6,000 - 10,000' },
            { value: 'usd-10000+', label: 'Enterprise: USD 10,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_WE: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-1000-2000', label: 'Starter: USD 1,000 - 2,000' },
            { value: 'usd-2000-3500', label: 'Standard: USD 2,000 - 3,500' },
            { value: 'usd-3500-6000', label: 'Professional: USD 3,500 - 6,000' },
            { value: 'usd-6000+', label: 'Enterprise: USD 6,000+' }
        ],
        USD_NAM: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-2000-3500', label: 'Starter: USD 2,000 - 3,500' },
            { value: 'usd-3500-6000', label: 'Standard: USD 3,500 - 6,000' },
            { value: 'usd-6000-10000', label: 'Professional: USD 6,000 - 10,000' },
            { value: 'usd-10000+', label: 'Enterprise: USD 10,000+' }
        ],
        USD: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-700-1200', label: 'Starter: USD 700 - 1,200' },
            { value: 'usd-1200-2000', label: 'Standard: USD 1,200 - 2,000' },
            { value: 'usd-2000-3500', label: 'Professional: USD 2,000 - 3,500' },
            { value: 'usd-3500+', label: 'Enterprise: USD 3,500+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        ZMW: [
            { value: '', label: 'Select budget range' },
            { value: 'zmw-5000-8000', label: 'Starter: ZMW 5,000 - 8,000' },
            { value: 'zmw-8000-12000', label: 'Standard: ZMW 8,000 - 12,000' },
            { value: 'zmw-12000-18000', label: 'Professional: ZMW 12,000 - 18,000' },
            { value: 'zmw-18000+', label: 'Enterprise: ZMW 18,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        ZAR: [
            { value: '', label: 'Select budget range' },
            { value: 'zar-6500-10000', label: 'Starter: ZAR 6,500 - 10,000' },
            { value: 'zar-10000-15000', label: 'Standard: ZAR 10,000 - 15,000' },
            { value: 'zar-15000-22000', label: 'Professional: ZAR 15,000 - 22,000' },
            { value: 'zar-22000+', label: 'Enterprise: ZAR 22,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        GBP: [
            { value: '', label: 'Select budget range' },
            { value: 'gbp-1200-2000', label: 'Starter: GBP 1,200 - 2,000' },
            { value: 'gbp-2000-3200', label: 'Standard: GBP 2,000 - 3,200' },
            { value: 'gbp-3200-5000', label: 'Professional: GBP 3,200 - 5,000' },
            { value: 'gbp-5000+', label: 'Enterprise: GBP 5,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        AUD: [
            { value: '', label: 'Select budget range' },
            { value: 'aud-3000-5500', label: 'Starter: AUD 3,000 - 5,500' },
            { value: 'aud-5500-9000', label: 'Standard: AUD 5,500 - 9,000' },
            { value: 'aud-9000-15000', label: 'Professional: AUD 9,000 - 15,000' },
            { value: 'aud-15000+', label: 'Enterprise: AUD 15,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        NZD: [
            { value: '', label: 'Select budget range' },
            { value: 'nzd-3500-6000', label: 'Starter: NZD 3,500 - 6,000' },
            { value: 'nzd-6000-10000', label: 'Standard: NZD 6,000 - 10,000' },
            { value: 'nzd-10000-16000', label: 'Professional: NZD 10,000 - 16,000' },
            { value: 'nzd-16000+', label: 'Enterprise: NZD 16,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        CAD: [
            { value: '', label: 'Select budget range' },
            { value: 'cad-2500-4500', label: 'Starter: CAD 2,500 - 4,500' },
            { value: 'cad-4500-7500', label: 'Standard: CAD 4,500 - 7,500' },
            { value: 'cad-7500-13000', label: 'Professional: CAD 7,500 - 13,000' },
            { value: 'cad-13000+', label: 'Enterprise: CAD 13,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        CHF: [
            { value: '', label: 'Select budget range' },
            { value: 'chf-1600-2800', label: 'Starter: CHF 1,600 - 2,800' },
            { value: 'chf-2800-4500', label: 'Standard: CHF 2,800 - 4,500' },
            { value: 'chf-4500-7000', label: 'Professional: CHF 4,500 - 7,000' },
            { value: 'chf-7000+', label: 'Enterprise: CHF 7,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        EUR_EAST: [
            { value: '', label: 'Select budget range' },
            { value: 'eur-900-1600', label: 'Starter: EUR 900 - 1,600' },
            { value: 'eur-1600-2800', label: 'Standard: EUR 1,600 - 2,800' },
            { value: 'eur-2800-4500', label: 'Professional: EUR 2,800 - 4,500' },
            { value: 'eur-4500+', label: 'Enterprise: EUR 4,500+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_GULF: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-2500-4500', label: 'Starter: USD 2,500 - 4,500' },
            { value: 'usd-4500-7500', label: 'Standard: USD 4,500 - 7,500' },
            { value: 'usd-7500-12000', label: 'Professional: USD 7,500 - 12,000' },
            { value: 'usd-12000+', label: 'Enterprise: USD 12,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_ASIA_PREM: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-2000-3500', label: 'Starter: USD 2,000 - 3,500' },
            { value: 'usd-3500-6000', label: 'Standard: USD 3,500 - 6,000' },
            { value: 'usd-6000-10000', label: 'Professional: USD 6,000 - 10,000' },
            { value: 'usd-10000+', label: 'Enterprise: USD 10,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_ASIA_STD: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-1100-2000', label: 'Starter: USD 1,100 - 2,000' },
            { value: 'usd-2000-3500', label: 'Standard: USD 2,000 - 3,500' },
            { value: 'usd-3500-6000', label: 'Professional: USD 3,500 - 6,000' },
            { value: 'usd-6000+', label: 'Enterprise: USD 6,000+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_ASIA_AFD: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-850-1500', label: 'Starter: USD 850 - 1,500' },
            { value: 'usd-1500-2500', label: 'Standard: USD 1,500 - 2,500' },
            { value: 'usd-2500-4500', label: 'Professional: USD 2,500 - 4,500' },
            { value: 'usd-4500+', label: 'Enterprise: USD 4,500+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        USD_LATAM: [
            { value: '', label: 'Select budget range' },
            { value: 'usd-850-1500', label: 'Starter: USD 850 - 1,500' },
            { value: 'usd-1500-2600', label: 'Standard: USD 1,500 - 2,600' },
            { value: 'usd-2600-4500', label: 'Professional: USD 2,600 - 4,500' },
            { value: 'usd-4500+', label: 'Enterprise: USD 4,500+' },
            { value: 'flexible', label: 'Flexible' }
        ],
        EUR: [
            { value: '', label: 'Select budget range' },
            { value: 'eur-1400-2200', label: 'Starter: EUR 1,400 - 2,200' },
            { value: 'eur-2200-3500', label: 'Standard: EUR 2,200 - 3,500' },
            { value: 'eur-3500-5500', label: 'Professional: EUR 3,500 - 5,500' },
            { value: 'eur-5500+', label: 'Enterprise: EUR 5,500+' },
            { value: 'flexible', label: 'Flexible' }
        ]
    };

    // Pricing display values mapped to tiers and currencies (Default Projects)
    // Extracted from budgetMapDefault - single source of truth
    const pricingDisplayData = {
        starter: {
            ZMW: 'ZMW 2,000 - 3,500',
            ZAR: 'ZAR 2,500 - 4,500',
            USD_ZW: 'USD 300 - 600',         // Zimbabwe/Southern Africa
            USD_USCA: 'USD 700 - 1,500',     // US & Canada
            USD_WE: 'USD 500 - 900',         // West & East Africa
            USD_NAM: 'USD 800 - 1,500',      // North Africa & Middle East
            USD: 'USD 300 - 700',            // Generic/International fallback
            GBP: 'GBP 500 - 900',
            EUR: 'EUR 550 - 1,000',
            AUD: 'AUD 1,200 - 2,200',
            NZD: 'NZD 1,300 - 2,400',
            CAD: 'CAD 900 - 1,800',
            CHF: 'CHF 600 - 1,100',
            EUR_EAST: 'EUR 350 - 650',
            USD_GULF: 'USD 1,000 - 1,800',
            USD_ASIA_PREM: 'USD 800 - 1,500',
            USD_ASIA_STD: 'USD 450 - 850',
            USD_ASIA_AFD: 'USD 350 - 650',
            USD_LATAM: 'USD 350 - 650'
        },
        standard: {
            ZMW: 'ZMW 3,500 - 5,500',
            ZAR: 'ZAR 4,500 - 7,000',
            USD_ZW: 'USD 600 - 1,000',
            USD_USCA: 'USD 1,500 - 2,500',
            USD_WE: 'USD 900 - 1,500',
            USD_NAM: 'USD 1,500 - 2,800',
            USD: 'USD 700 - 1,500',
            GBP: 'GBP 900 - 1,400',
            EUR: 'EUR 1,000 - 1,600',
            AUD: 'AUD 2,200 - 3,800',
            NZD: 'NZD 2,400 - 4,000',
            CAD: 'CAD 1,800 - 3,200',
            CHF: 'CHF 1,100 - 1,800',
            EUR_EAST: 'EUR 650 - 1,100',
            USD_GULF: 'USD 1,800 - 3,200',
            USD_ASIA_PREM: 'USD 1,500 - 2,500',
            USD_ASIA_STD: 'USD 850 - 1,400',
            USD_ASIA_AFD: 'USD 650 - 1,100',
            USD_LATAM: 'USD 650 - 1,100'
        },
        professional: {
            ZMW: 'ZMW 5,500 - 8,000',
            ZAR: 'ZAR 7,000 - 10,000',
            USD_ZW: 'USD 1,000 - 1,800',
            USD_USCA: 'USD 2,500 - 4,000',
            USD_WE: 'USD 1,500 - 2,500',
            USD_NAM: 'USD 2,800 - 5,000',
            USD: 'USD 1,500 - 3,000',
            GBP: 'GBP 1,400 - 2,000',
            EUR: 'EUR 1,600 - 2,300',
            AUD: 'AUD 3,800 - 6,000',
            NZD: 'NZD 4,000 - 6,500',
            CAD: 'CAD 3,200 - 5,500',
            CHF: 'CHF 1,800 - 2,800',
            EUR_EAST: 'EUR 1,100 - 1,800',
            USD_GULF: 'USD 3,200 - 5,500',
            USD_ASIA_PREM: 'USD 2,500 - 4,200',
            USD_ASIA_STD: 'USD 1,400 - 2,400',
            USD_ASIA_AFD: 'USD 1,100 - 1,900',
            USD_LATAM: 'USD 1,100 - 1,900'
        },
        enterprise: {
            ZMW: 'ZMW 8,000+',
            ZAR: 'ZAR 10,000+',
            USD_ZW: 'USD 1,800+',
            USD_USCA: 'USD 4,000+',
            USD_WE: 'USD 2,500+',
            USD_NAM: 'USD 5,000+',
            USD: 'USD 3,000+',
            GBP: 'GBP 2,000+',
            EUR: 'EUR 2,300+',
            AUD: 'AUD 6,000+',
            NZD: 'NZD 6,500+',
            CAD: 'CAD 5,500+',
            CHF: 'CHF 2,800+',
            EUR_EAST: 'EUR 1,800+',
            USD_GULF: 'USD 5,500+',
            USD_ASIA_PREM: 'USD 4,200+',
            USD_ASIA_STD: 'USD 2,400+',
            USD_ASIA_AFD: 'USD 1,900+',
            USD_LATAM: 'USD 1,900+'
        }
    };

    // Pricing display values for System Development projects
    // Extracted from budgetMapSystems - single source of truth
    const pricingDisplayDataSystems = {
        starter: {
            ZMW: 'ZMW 5,000 - 8,000',
            ZAR: 'ZAR 6,500 - 10,000',
            USD_ZW: 'USD 700 - 1,200',       // Zimbabwe/Southern Africa
            USD_USCA: 'USD 2,000 - 3,500',   // US & Canada
            USD_WE: 'USD 1,000 - 2,000',     // West & East Africa
            USD_NAM: 'USD 2,000 - 3,500',    // North Africa & Middle East
            USD: 'USD 700 - 1,200',          // Generic/International fallback
            GBP: 'GBP 1,200 - 2,000',
            EUR: 'EUR 1,400 - 2,200',
            AUD: 'AUD 3,000 - 5,500',
            NZD: 'NZD 3,500 - 6,000',
            CAD: 'CAD 2,500 - 4,500',
            CHF: 'CHF 1,600 - 2,800',
            EUR_EAST: 'EUR 900 - 1,600',
            USD_GULF: 'USD 2,500 - 4,500',
            USD_ASIA_PREM: 'USD 2,000 - 3,500',
            USD_ASIA_STD: 'USD 1,100 - 2,000',
            USD_ASIA_AFD: 'USD 850 - 1,500',
            USD_LATAM: 'USD 850 - 1,500'
        },
        standard: {
            ZMW: 'ZMW 8,000 - 12,000',
            ZAR: 'ZAR 10,000 - 15,000',
            USD_ZW: 'USD 1,200 - 2,000',
            USD_USCA: 'USD 3,500 - 6,000',
            USD_WE: 'USD 2,000 - 3,500',
            USD_NAM: 'USD 3,500 - 6,000',
            USD: 'USD 1,200 - 2,000',
            GBP: 'GBP 2,000 - 3,200',
            EUR: 'EUR 2,200 - 3,500',
            AUD: 'AUD 5,500 - 9,000',
            NZD: 'NZD 6,000 - 10,000',
            CAD: 'CAD 4,500 - 7,500',
            CHF: 'CHF 2,800 - 4,500',
            EUR_EAST: 'EUR 1,600 - 2,800',
            USD_GULF: 'USD 4,500 - 7,500',
            USD_ASIA_PREM: 'USD 3,500 - 6,000',
            USD_ASIA_STD: 'USD 2,000 - 3,500',
            USD_ASIA_AFD: 'USD 1,500 - 2,500',
            USD_LATAM: 'USD 1,500 - 2,600'
        },
        professional: {
            ZMW: 'ZMW 12,000 - 18,000',
            ZAR: 'ZAR 15,000 - 22,000',
            USD_ZW: 'USD 2,000 - 3,500',
            USD_USCA: 'USD 6,000 - 10,000',
            USD_WE: 'USD 3,500 - 6,000',
            USD_NAM: 'USD 6,000 - 10,000',
            USD: 'USD 2,000 - 3,500',
            GBP: 'GBP 3,200 - 5,000',
            EUR: 'EUR 3,500 - 5,500',
            AUD: 'AUD 9,000 - 15,000',
            NZD: 'NZD 10,000 - 16,000',
            CAD: 'CAD 7,500 - 13,000',
            CHF: 'CHF 4,500 - 7,000',
            EUR_EAST: 'EUR 2,800 - 4,500',
            USD_GULF: 'USD 7,500 - 12,000',
            USD_ASIA_PREM: 'USD 6,000 - 10,000',
            USD_ASIA_STD: 'USD 3,500 - 6,000',
            USD_ASIA_AFD: 'USD 2,500 - 4,500',
            USD_LATAM: 'USD 2,600 - 4,500'
        },
        enterprise: {
            ZMW: 'ZMW 18,000+',
            ZAR: 'ZAR 22,000+',
            USD_ZW: 'USD 3,500+',
            USD_USCA: 'USD 10,000+',
            USD_WE: 'USD 6,000+',
            USD_NAM: 'USD 10,000+',
            USD: 'USD 3,500+',
            GBP: 'GBP 5,000+',
            EUR: 'EUR 5,500+',
            AUD: 'AUD 15,000+',
            NZD: 'NZD 16,000+',
            CAD: 'CAD 13,000+',
            CHF: 'CHF 7,000+',
            EUR_EAST: 'EUR 4,500+',
            USD_GULF: 'USD 12,000+',
            USD_ASIA_PREM: 'USD 10,000+',
            USD_ASIA_STD: 'USD 6,000+',
            USD_ASIA_AFD: 'USD 4,500+',
            USD_LATAM: 'USD 4,500+'
        }
    };

    // ============================================================================
    // PRICING HELPER FUNCTIONS
    // ============================================================================
    function getRegionConfig(regionCode) {
        const map = {
            // ── AFRICA ──────────────────────────────────────────────
            'zambia':                   { label: 'Zambia',                currency: 'ZMW',           budgetKey: 'ZMW' },
            'south-africa':             { label: 'South Africa',          currency: 'ZAR',           budgetKey: 'ZAR' },
            'zimbabwe-usd':             { label: 'Zimbabwe',              currency: 'USD',           budgetKey: 'USD_ZW' },
            'botswana':                 { label: 'Botswana',              currency: 'USD',           budgetKey: 'USD_ZW' },
            'namibia':                  { label: 'Namibia',               currency: 'USD',           budgetKey: 'USD_ZW' },
            'mozambique':               { label: 'Mozambique',            currency: 'USD',           budgetKey: 'USD_ZW' },
            'southern-africa-usd':      { label: 'Southern Africa',       currency: 'USD',           budgetKey: 'USD_ZW' },
            'nigeria':                  { label: 'Nigeria',               currency: 'USD',           budgetKey: 'USD_WE' },
            'ghana':                    { label: 'Ghana',                 currency: 'USD',           budgetKey: 'USD_WE' },
            'kenya':                    { label: 'Kenya',                 currency: 'USD',           budgetKey: 'USD_WE' },
            'uganda':                   { label: 'Uganda',                currency: 'USD',           budgetKey: 'USD_WE' },
            'tanzania':                 { label: 'Tanzania',              currency: 'USD',           budgetKey: 'USD_WE' },
            'ethiopia':                 { label: 'Ethiopia',              currency: 'USD',           budgetKey: 'USD_WE' },
            'cameroon':                 { label: 'Cameroon',              currency: 'USD',           budgetKey: 'USD_WE' },
            'senegal':                  { label: 'Senegal',               currency: 'USD',           budgetKey: 'USD_WE' },
            'west-east-africa':         { label: 'West & East Africa',    currency: 'USD',           budgetKey: 'USD_WE' },
            'egypt':                    { label: 'Egypt',                 currency: 'USD',           budgetKey: 'USD_NAM' },
            'morocco':                  { label: 'Morocco',               currency: 'USD',           budgetKey: 'USD_NAM' },
            'algeria':                  { label: 'Algeria',               currency: 'USD',           budgetKey: 'USD_NAM' },
            'tunisia':                  { label: 'Tunisia',               currency: 'USD',           budgetKey: 'USD_NAM' },
            'libya':                    { label: 'Libya',                 currency: 'USD',           budgetKey: 'USD_NAM' },
            'north-africa-me':          { label: 'North Africa & Middle East', currency: 'USD',      budgetKey: 'USD_NAM' },
            // ── MIDDLE EAST ─────────────────────────────────────────
            'uae':                      { label: 'UAE',                   currency: 'USD',           budgetKey: 'USD_GULF' },
            'saudi-arabia':             { label: 'Saudi Arabia',          currency: 'USD',           budgetKey: 'USD_GULF' },
            'kuwait':                   { label: 'Kuwait',                currency: 'USD',           budgetKey: 'USD_GULF' },
            'qatar':                    { label: 'Qatar',                 currency: 'USD',           budgetKey: 'USD_GULF' },
            'bahrain':                  { label: 'Bahrain',               currency: 'USD',           budgetKey: 'USD_GULF' },
            'oman':                     { label: 'Oman',                  currency: 'USD',           budgetKey: 'USD_GULF' },
            'israel':                   { label: 'Israel',                currency: 'USD',           budgetKey: 'USD_GULF' },
            'jordan':                   { label: 'Jordan',                currency: 'USD',           budgetKey: 'USD_NAM' },
            'lebanon':                  { label: 'Lebanon',               currency: 'USD',           budgetKey: 'USD_NAM' },
            'iraq':                     { label: 'Iraq',                  currency: 'USD',           budgetKey: 'USD_NAM' },
            'yemen':                    { label: 'Yemen',                 currency: 'USD',           budgetKey: 'USD_NAM' },
            // ── EUROPE — WESTERN ────────────────────────────────────
            'uk':                       { label: 'United Kingdom',        currency: 'GBP',           budgetKey: 'GBP' },
            'switzerland':              { label: 'Switzerland',           currency: 'CHF',           budgetKey: 'CHF' },
            'germany':                  { label: 'Germany',               currency: 'EUR',           budgetKey: 'EUR' },
            'france':                   { label: 'France',                currency: 'EUR',           budgetKey: 'EUR' },
            'italy':                    { label: 'Italy',                 currency: 'EUR',           budgetKey: 'EUR' },
            'spain':                    { label: 'Spain',                 currency: 'EUR',           budgetKey: 'EUR' },
            'netherlands':              { label: 'Netherlands',           currency: 'EUR',           budgetKey: 'EUR' },
            'belgium':                  { label: 'Belgium',               currency: 'EUR',           budgetKey: 'EUR' },
            'austria':                  { label: 'Austria',               currency: 'EUR',           budgetKey: 'EUR' },
            'ireland':                  { label: 'Ireland',               currency: 'EUR',           budgetKey: 'EUR' },
            'portugal':                 { label: 'Portugal',              currency: 'EUR',           budgetKey: 'EUR' },
            'finland':                  { label: 'Finland',               currency: 'EUR',           budgetKey: 'EUR' },
            'greece':                   { label: 'Greece',                currency: 'EUR',           budgetKey: 'EUR' },
            'luxembourg':               { label: 'Luxembourg',            currency: 'EUR',           budgetKey: 'EUR' },
            'cyprus':                   { label: 'Cyprus',                currency: 'EUR',           budgetKey: 'EUR' },
            'malta':                    { label: 'Malta',                 currency: 'EUR',           budgetKey: 'EUR' },
            'iceland':                  { label: 'Iceland',               currency: 'EUR',           budgetKey: 'EUR' },
            'norway':                   { label: 'Norway',                currency: 'EUR',           budgetKey: 'EUR' },
            'sweden':                   { label: 'Sweden',                currency: 'EUR',           budgetKey: 'EUR' },
            'denmark':                  { label: 'Denmark',               currency: 'EUR',           budgetKey: 'EUR' },
            'europe':                   { label: 'Europe',                currency: 'EUR',           budgetKey: 'EUR' },
            // ── EUROPE — EASTERN ────────────────────────────────────
            'poland':                   { label: 'Poland',                currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'czech-republic':           { label: 'Czech Republic',        currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'romania':                  { label: 'Romania',               currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'hungary':                  { label: 'Hungary',               currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'bulgaria':                 { label: 'Bulgaria',              currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'slovakia':                 { label: 'Slovakia',              currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'slovenia':                 { label: 'Slovenia',              currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'croatia':                  { label: 'Croatia',               currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'estonia':                  { label: 'Estonia',               currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'latvia':                   { label: 'Latvia',                currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'lithuania':                { label: 'Lithuania',             currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'serbia':                   { label: 'Serbia',                currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'albania':                  { label: 'Albania',               currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'bosnia':                   { label: 'Bosnia and Herzegovina', currency: 'EUR',          budgetKey: 'EUR_EAST' },
            'montenegro':               { label: 'Montenegro',            currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'north-macedonia':          { label: 'North Macedonia',       currency: 'EUR',           budgetKey: 'EUR_EAST' },
            'moldova':                  { label: 'Moldova',               currency: 'USD',           budgetKey: 'EUR_EAST' },
            'ukraine':                  { label: 'Ukraine',               currency: 'USD',           budgetKey: 'EUR_EAST' },
            'belarus':                  { label: 'Belarus',               currency: 'USD',           budgetKey: 'EUR_EAST' },
            'georgia':                  { label: 'Georgia',               currency: 'USD',           budgetKey: 'EUR_EAST' },
            'armenia':                  { label: 'Armenia',               currency: 'USD',           budgetKey: 'EUR_EAST' },
            'azerbaijan':               { label: 'Azerbaijan',            currency: 'USD',           budgetKey: 'EUR_EAST' },
            'russia':                   { label: 'Russia',                currency: 'USD',           budgetKey: 'EUR_EAST' },
            'turkey':                   { label: 'Turkey',                currency: 'USD',           budgetKey: 'EUR_EAST' },
            'europe-east':              { label: 'Eastern Europe',        currency: 'EUR',           budgetKey: 'EUR_EAST' },
            // ── OCEANIA ─────────────────────────────────────────────
            'australia':                { label: 'Australia',             currency: 'AUD',           budgetKey: 'AUD' },
            'new-zealand':              { label: 'New Zealand',           currency: 'NZD',           budgetKey: 'NZD' },
            // ── NORTH AMERICA ───────────────────────────────────────
            'us-canada':                { label: 'US & Canada',           currency: 'USD',           budgetKey: 'USD_USCA' },
            'united-states':            { label: 'United States',         currency: 'USD',           budgetKey: 'USD_USCA' },
            'canada':                   { label: 'Canada',                currency: 'CAD',           budgetKey: 'CAD' },
            // ── LATIN AMERICA ───────────────────────────────────────
            'brazil':                   { label: 'Brazil',                currency: 'USD',           budgetKey: 'USD_LATAM' },
            'mexico':                   { label: 'Mexico',                currency: 'USD',           budgetKey: 'USD_LATAM' },
            'argentina':                { label: 'Argentina',             currency: 'USD',           budgetKey: 'USD_LATAM' },
            'colombia':                 { label: 'Colombia',              currency: 'USD',           budgetKey: 'USD_LATAM' },
            'chile':                    { label: 'Chile',                 currency: 'USD',           budgetKey: 'USD_LATAM' },
            'peru':                     { label: 'Peru',                  currency: 'USD',           budgetKey: 'USD_LATAM' },
            'ecuador':                  { label: 'Ecuador',               currency: 'USD',           budgetKey: 'USD_LATAM' },
            'bolivia':                  { label: 'Bolivia',               currency: 'USD',           budgetKey: 'USD_LATAM' },
            'uruguay':                  { label: 'Uruguay',               currency: 'USD',           budgetKey: 'USD_LATAM' },
            'paraguay':                 { label: 'Paraguay',              currency: 'USD',           budgetKey: 'USD_LATAM' },
            'venezuela':                { label: 'Venezuela',             currency: 'USD',           budgetKey: 'USD_LATAM' },
            'guatemala':                { label: 'Guatemala',             currency: 'USD',           budgetKey: 'USD_LATAM' },
            'honduras':                 { label: 'Honduras',              currency: 'USD',           budgetKey: 'USD_LATAM' },
            'nicaragua':                { label: 'Nicaragua',             currency: 'USD',           budgetKey: 'USD_LATAM' },
            'costa-rica':               { label: 'Costa Rica',            currency: 'USD',           budgetKey: 'USD_LATAM' },
            'panama':                   { label: 'Panama',                currency: 'USD',           budgetKey: 'USD_LATAM' },
            'jamaica':                  { label: 'Jamaica',               currency: 'USD',           budgetKey: 'USD_LATAM' },
            'trinidad-tobago':          { label: 'Trinidad and Tobago',   currency: 'USD',           budgetKey: 'USD_LATAM' },
            // ── ASIA — PREMIUM ──────────────────────────────────────
            'singapore':                { label: 'Singapore',             currency: 'USD',           budgetKey: 'USD_ASIA_PREM' },
            'japan':                    { label: 'Japan',                 currency: 'USD',           budgetKey: 'USD_ASIA_PREM' },
            'south-korea':              { label: 'South Korea',           currency: 'USD',           budgetKey: 'USD_ASIA_PREM' },
            'hong-kong':                { label: 'Hong Kong',             currency: 'USD',           budgetKey: 'USD_ASIA_PREM' },
            'taiwan':                   { label: 'Taiwan',                currency: 'USD',           budgetKey: 'USD_ASIA_PREM' },
            'asia-premium':             { label: 'Premium Asia',          currency: 'USD',           budgetKey: 'USD_ASIA_PREM' },
            // ── ASIA — STANDARD ─────────────────────────────────────
            'china':                    { label: 'China',                 currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'malaysia':                 { label: 'Malaysia',              currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'indonesia':                { label: 'Indonesia',             currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'thailand':                 { label: 'Thailand',              currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'philippines':              { label: 'Philippines',           currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'vietnam':                  { label: 'Vietnam',               currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'myanmar':                  { label: 'Myanmar',               currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'cambodia':                 { label: 'Cambodia',              currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'brunei':                   { label: 'Brunei',                currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'mongolia':                 { label: 'Mongolia',              currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            'asia-standard':            { label: 'Southeast Asia',        currency: 'USD',           budgetKey: 'USD_ASIA_STD' },
            // ── ASIA — AFFORDABLE ───────────────────────────────────
            'india':                    { label: 'India',                 currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            'pakistan':                 { label: 'Pakistan',              currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            'bangladesh':               { label: 'Bangladesh',            currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            'sri-lanka':                { label: 'Sri Lanka',             currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            'nepal':                    { label: 'Nepal',                 currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            'afghanistan':              { label: 'Afghanistan',           currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            'kazakhstan':               { label: 'Kazakhstan',            currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            'uzbekistan':               { label: 'Uzbekistan',            currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            'asia-affordable':          { label: 'South Asia',            currency: 'USD',           budgetKey: 'USD_ASIA_AFD' },
            // ── FALLBACK ────────────────────────────────────────────
            'other-international':      { label: 'Other / International', currency: 'USD',           budgetKey: 'USD' }
        };
        return map[regionCode] || map['other-international'];
    }

    function detectRegionByLocale() {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const locale = (navigator.language || '').toUpperCase();
        const region = locale.includes('-') ? locale.split('-')[1] : '';

        // Africa
        if (tz.indexOf('Africa/Lusaka') === 0 || region === 'ZM') return 'zambia';
        if (region === 'ZW') return 'zimbabwe-usd';
        if (tz.indexOf('Africa/Johannesburg') === 0 || region === 'ZA') return 'south-africa';
        if (region === 'BW') return 'botswana';
        if (region === 'NA') return 'namibia';
        if (region === 'MZ') return 'mozambique';
        if (region === 'NG') return 'nigeria';
        if (region === 'GH') return 'ghana';
        if (region === 'KE' || tz.indexOf('Africa/Nairobi') === 0) return 'kenya';
        if (region === 'UG') return 'uganda';
        if (region === 'TZ') return 'tanzania';
        if (region === 'ET') return 'ethiopia';
        if (region === 'CM') return 'cameroon';
        if (region === 'SN') return 'senegal';
        if (region === 'EG' || tz.indexOf('Africa/Cairo') === 0) return 'egypt';
        if (region === 'MA') return 'morocco';
        if (region === 'DZ') return 'algeria';
        if (region === 'TN') return 'tunisia';
        if (region === 'LY') return 'libya';

        // Middle East (Gulf)
        if (region === 'AE' || tz.indexOf('Asia/Dubai') === 0) return 'uae';
        if (region === 'SA') return 'saudi-arabia';
        if (region === 'KW') return 'kuwait';
        if (region === 'QA') return 'qatar';
        if (region === 'BH') return 'bahrain';
        if (region === 'OM') return 'oman';
        if (region === 'IL') return 'israel';

        // Middle East (Standard)
        if (region === 'JO') return 'jordan';
        if (region === 'LB') return 'lebanon';
        if (region === 'IQ') return 'iraq';
        if (region === 'YE') return 'yemen';

        // UK
        if (tz.indexOf('Europe/London') === 0 || region === 'GB') return 'uk';

        // Oceania
        if (region === 'AU' || tz.indexOf('Australia/') === 0) return 'australia';
        if (region === 'NZ' || tz.indexOf('Pacific/Auckland') === 0) return 'new-zealand';

        // North America
        if (region === 'US') return 'united-states';
        if (region === 'CA') return 'canada';

        // Latin America
        if (region === 'BR' || tz.indexOf('America/Sao_Paulo') === 0) return 'brazil';
        if (region === 'MX' || tz.indexOf('America/Mexico_City') === 0) return 'mexico';
        if (region === 'AR') return 'argentina';
        if (region === 'CO') return 'colombia';
        if (region === 'CL') return 'chile';
        if (region === 'PE') return 'peru';
        if (region === 'EC') return 'ecuador';
        if (region === 'BO') return 'bolivia';
        if (region === 'UY') return 'uruguay';
        if (region === 'PY') return 'paraguay';
        if (region === 'VE') return 'venezuela';
        if (region === 'GT') return 'guatemala';
        if (region === 'HN') return 'honduras';
        if (region === 'NI') return 'nicaragua';
        if (region === 'CR') return 'costa-rica';
        if (region === 'PA') return 'panama';
        if (region === 'JM') return 'jamaica';
        if (region === 'TT') return 'trinidad-tobago';

        // Asia Premium
        if (region === 'SG' || tz.indexOf('Asia/Singapore') === 0) return 'singapore';
        if (region === 'JP' || tz.indexOf('Asia/Tokyo') === 0) return 'japan';
        if (region === 'KR') return 'south-korea';
        if (region === 'HK') return 'hong-kong';
        if (region === 'TW') return 'taiwan';

        // Asia Standard
        if (region === 'CN' || tz.indexOf('Asia/Shanghai') === 0) return 'china';
        if (region === 'MY' || tz.indexOf('Asia/Kuala_Lumpur') === 0) return 'malaysia';
        if (region === 'ID' || tz.indexOf('Asia/Jakarta') === 0) return 'indonesia';
        if (region === 'TH' || tz.indexOf('Asia/Bangkok') === 0) return 'thailand';
        if (region === 'PH') return 'philippines';
        if (region === 'VN') return 'vietnam';
        if (region === 'MM') return 'myanmar';
        if (region === 'KH') return 'cambodia';
        if (region === 'MN') return 'mongolia';

        // Asia Affordable
        if (region === 'IN' || tz.indexOf('Asia/Kolkata') === 0) return 'india';
        if (region === 'PK') return 'pakistan';
        if (region === 'BD') return 'bangladesh';
        if (region === 'LK') return 'sri-lanka';
        if (region === 'NP') return 'nepal';
        if (region === 'AF') return 'afghanistan';
        if (region === 'KZ') return 'kazakhstan';
        if (region === 'UZ') return 'uzbekistan';

        // Switzerland
        if (region === 'CH') return 'switzerland';

        // Eastern Europe
        if (region === 'PL') return 'poland';
        if (region === 'CZ') return 'czech-republic';
        if (region === 'RO') return 'romania';
        if (region === 'HU') return 'hungary';
        if (region === 'BG') return 'bulgaria';
        if (region === 'SK') return 'slovakia';
        if (region === 'SI') return 'slovenia';
        if (region === 'HR') return 'croatia';
        if (region === 'EE') return 'estonia';
        if (region === 'LV') return 'latvia';
        if (region === 'LT') return 'lithuania';
        if (region === 'RS') return 'serbia';
        if (region === 'AL') return 'albania';
        if (region === 'BA') return 'bosnia';
        if (region === 'ME') return 'montenegro';
        if (region === 'MK') return 'north-macedonia';
        if (region === 'MD') return 'moldova';
        if (region === 'UA') return 'ukraine';
        if (region === 'BY') return 'belarus';
        if (region === 'GE') return 'georgia';
        if (region === 'AM') return 'armenia';
        if (region === 'AZ') return 'azerbaijan';
        if (region === 'RU') return 'russia';
        if (region === 'TR') return 'turkey';

        // Western Europe (catch-all)
        if (tz.indexOf('Europe/') === 0) return 'europe';

        // Other Africa
        if (tz.indexOf('Africa/') === 0) return 'west-east-africa';

        return 'other-international';
    }

    function detectCurrencyByRegion() {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const locale = (navigator.language || '').toUpperCase();
        const region = locale.includes('-') ? locale.split('-')[1] : '';

        if (tz.indexOf('Africa/Lusaka') === 0 || region === 'ZM') return 'ZMW';
        if (tz.indexOf('Africa/Johannesburg') === 0 || region === 'ZA') return 'ZAR';
        if (tz.indexOf('Europe/London') === 0 || region === 'GB') return 'GBP';
        if (tz.indexOf('Europe/') === 0 && region !== 'GB') return 'EUR';
        if (region === 'US' || region === 'CA') return 'USD';
        return 'USD';
    }

    // Get pricing tier display values for pricing page
    // @param {string} currencyCode - Currency code (ZMW, USD, etc.)
    // @param {boolean} isSystemProject - If true, returns system pricing; otherwise default pricing
    // @returns {object} Pricing tiers keyed by tier name
    function getPricingTierValues(currencyCode, isSystemProject = false) {
        const dataMap = isSystemProject ? pricingDisplayDataSystems : pricingDisplayData;
        if (!dataMap.starter[currencyCode]) {
            currencyCode = 'USD';
        }
        return {
            starter: dataMap.starter[currencyCode],
            standard: dataMap.standard[currencyCode],
            professional: dataMap.professional[currencyCode],
            enterprise: dataMap.enterprise[currencyCode]
        };
    }

    // Update pricing display on pricing.html page
    // @param {string} currencyCode - Currency code (ZMW, USD, etc.)
    // @param {boolean} isSystemProject - If true, uses system pricing; otherwise default pricing
    function updatePricingDisplay(currencyCode, isSystemProject = false) {
        const priceElements = document.querySelectorAll('.price-amount');
        if (!priceElements.length) return;

        const tierValues = getPricingTierValues(currencyCode, isSystemProject);

        priceElements.forEach(function (el) {
            const tier = el.closest('[data-tier]')?.getAttribute('data-tier');
            if (tier && tierValues[tier]) {
                const displayValue = tierValues[tier];
                el.textContent = displayValue;
                el.classList.remove('priceShuffleIn');
                void el.offsetWidth; // trigger reflow
                el.classList.add('priceShuffleIn');
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadNavbar()
            .catch(() => {
                // If navbar fetch fails, continue with any in-page navbar.
            })
            .finally(() => {
                ensureGamesNavLink();
                normalizeNavbarPaths();
                setActiveNavLink();
                injectStructuredData();
                promoteWhatsAppLinks();
                initThemeToggle();
                initMoonAnimation();
                initScrollAnimations();
                initMobileNav();
                initSmartNavbar();
                initScrollToTop();
                initSmoothScrollLinks();
                initHeroEntrance();
                initWelcomeGuide();
                initGlobalParallax();
                initTeamDetails();
                initMagneticButtons();
                initTierFeatures();
                initPricingCurrency();
                initShowcaseCarousel();

                if (document.getElementById('contactForm')) {
                    initContactForm();
                    prefillFromURL();
                }

                initFAQAccordion();
                updateCopyrightYear();
                loadFooter();
            });
    });

    function resolveSitePath(path) {
        return path.startsWith('/') ? path : '/' + path;
    }

    function injectStructuredData() {
        if (!document.head || document.head.querySelector('script[data-nextphases-schema]')) return;

        const schemas = [
            {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'NextPhases.dev',
                url: 'https://nextphases.dev',
                logo: 'https://nextphases.dev/Logo_transparent.png',
                sameAs: [
                    'https://www.youtube.com/@nextphases',
                    'https://x.com/NextPhases',
                    'https://www.tiktok.com/@nextphases.dev?lang=en',
                    'https://www.instagram.com/nextphases.dev/',
                    'https://www.linkedin.com/company/nextphases',
                    'https://discord.gg/DkybgpuRwp'
                ],
                description: 'Software development company building websites, SaaS platforms, applications, and digital products for businesses globally.',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Lusaka',
                    addressCountry: 'Zambia'
                }
            },
            {
                '@context': 'https://schema.org',
                '@type': 'LocalBusiness',
                name: 'NextPhases.dev',
                image: 'https://nextphases.dev/Logo_transparent.png',
                url: 'https://nextphases.dev',
                telephone: '+260978131906',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Lusaka',
                    addressCountry: 'ZM'
                },
                priceRange: '$$'
            }
        ];

        schemas.forEach((schema, index) => {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.dataset.nextphasesSchema = index === 0 ? 'organization' : 'localbusiness';
            script.textContent = JSON.stringify(schema, null, 2);
            document.head.appendChild(script);
        });
    }

    function promoteWhatsAppLinks() {
        const waUrl = 'https://wa.me/260978131906?text=Hi%20NextPhases%2C%20I%27d%20like%20to%20discuss%20a%20project.';

        // Ensure nav has a Contact button linking to /contact.html
        document.querySelectorAll('.main-nav .cta-button').forEach(link => {
            const href = (link.getAttribute('href') || '').trim();
            // If it's empty or points to contact.html, make it a Contact link
            if (!href || /contact\.html$/i.test(href)) {
                link.setAttribute('href', '/contact.html');
                link.removeAttribute('target');
                link.removeAttribute('rel');
                link.textContent = 'Contact';
            }
        });

        const contactMethods = document.querySelector('.contact-methods');
        if (contactMethods && !contactMethods.querySelector('[data-whatsapp-contact]')) {
            const whatsappMethod = document.createElement('div');
            whatsappMethod.className = 'contact-method';
            whatsappMethod.setAttribute('data-whatsapp-contact', 'true');
            whatsappMethod.innerHTML = '<div class="contact-method-icon"><i class="fab fa-whatsapp"></i></div><div><h4>WhatsApp Us</h4><a href="' + waUrl + '" target="_blank" rel="noopener">+260 978 131 906</a></div>';
            const firstMethod = contactMethods.querySelector('.contact-method');
            if (firstMethod) firstMethod.insertAdjacentElement('afterend', whatsappMethod);
            else contactMethods.insertBefore(whatsappMethod, contactMethods.firstElementChild);
        }

        document.querySelectorAll('.footer-socials').forEach(container => {
            if (container.querySelector('a[aria-label="WhatsApp"]')) return;
            const discordLink = container.querySelector('a[aria-label="Discord"]');
            const whatsappLink = document.createElement('a');
            whatsappLink.href = waUrl;
            whatsappLink.className = 'social-link';
            whatsappLink.target = '_blank';
            whatsappLink.rel = 'noopener';
            whatsappLink.setAttribute('aria-label', 'WhatsApp');
            whatsappLink.innerHTML = '<i class="fab fa-whatsapp"></i>';
            if (discordLink) container.insertBefore(whatsappLink, discordLink);
            else container.appendChild(whatsappLink);
        });

        document.querySelectorAll('.footer-contact-list').forEach(list => {
            if (list.querySelector('a[href^="https://wa.me/"]')) return;
            const whatsappItem = document.createElement('li');
            whatsappItem.innerHTML = '<i class="fab fa-whatsapp"></i><a href="' + waUrl + '" target="_blank" rel="noopener">WhatsApp: +260 978 131 906</a>';
            list.insertBefore(whatsappItem, list.firstElementChild);
        });
    }

    function ensureGamesNavLink() {
        const navMenu = document.getElementById('navMenu');
        if (!navMenu) return;
        if (navMenu.querySelector('.nav-link[href*="games"]')) return;

        const gamesItem = document.createElement('li');
        const gamesLink = document.createElement('a');
        gamesLink.className = 'nav-link';
        gamesLink.href = resolveSitePath('/games/');
        gamesLink.textContent = 'Games';
        gamesItem.appendChild(gamesLink);

        const anchorItem = navMenu.querySelector('.nav-link[href*="testimonials"]');
        if (anchorItem && anchorItem.parentElement) {
            anchorItem.parentElement.insertAdjacentElement('beforebegin', gamesItem);
        } else {
            navMenu.appendChild(gamesItem);
        }
    }

    function loadNavbar() {
        const mount = document.getElementById('navbarMount');
        if (!mount) return Promise.resolve();

        return fetch(resolveSitePath('navbar.html'))
            .then(response => {
                if (!response.ok) throw new Error('Navbar not found');
                return response.text();
            })
            .then(html => {
                mount.outerHTML = html;
            });
    }

    function normalizeNavbarPaths() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;

        nav.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href') || '';
            if (!href || /^(#|mailto:|tel:|https?:|javascript:)/i.test(href)) return;
            if (href.charAt(0) !== '/') return;
            link.setAttribute('href', resolveSitePath(href));
        });

        nav.querySelectorAll('img[src^="/"]').forEach(img => {
            const src = img.getAttribute('src') || '';
            img.setAttribute('src', resolveSitePath(src));
        });
    }

    function setActiveNavLink() {
        const currentPath = (window.location.pathname || '').toLowerCase();
        const navLinks = document.querySelectorAll('#navMenu .nav-link');
        if (!navLinks.length) return;

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = (link.getAttribute('href') || '').toLowerCase();
            if (!href) return;

            if (href.indexOf('/games/') >= 0 && currentPath.indexOf('/games/') >= 0) {
                link.classList.add('active');
                return;
            }

            const normalizedHref = href.replace(/^\./, '');
            if (normalizedHref !== '/' && currentPath.indexOf(normalizedHref) >= 0) {
                link.classList.add('active');
            }
        });

        if (currentPath === '/' || currentPath.indexOf('/index.html') >= 0 || /\/team-portfolio\/?$/i.test(currentPath)) {
            const homeLink = document.querySelector('#navMenu .nav-link[href*="index.html"]');
            if (homeLink) homeLink.classList.add('active');
        }

    }

    // =============================================
    // TEAM MEMBER DETAILS MODAL
    // =============================================
    function initTeamDetails() {
        const teamCards = document.querySelectorAll('.clickable-team');
        const detailPanel = document.getElementById('teamDetailPanel');
        const overlay = document.getElementById('teamDetailOverlay');
        const closeBtn = document.getElementById('detailClose');
        const detailName = document.getElementById('detailName');
        const detailRole = document.getElementById('detailRole');
        const detailText = document.getElementById('detailText');
        const detailAvatar = document.querySelector('.detail-avatar');

        if (!teamCards.length || !detailPanel || !overlay || !closeBtn || !detailName || !detailRole || !detailText || !detailAvatar) return;

        const teamData = {
            thuma: {
                name: 'Thuma',
                role: 'CTO & CMO',
                bio: 'Thuma leads the technical vision and growth strategy. He keeps the product architecture sound while shaping the brand and outward-facing direction of NextPhases.',
                icon: '<i class="fas fa-laptop-code"></i>'
            },
            simon: {
                name: 'Simon',
                role: 'COO',
                bio: 'Simon keeps delivery, timelines, and client communication running smoothly so projects land with clarity, consistency, and operational discipline.',
                icon: '<i class="fas fa-cogs"></i>'
            },
            shaun: {
                name: 'Shaun',
                role: 'VP Engineering',
                bio: 'Shaun helps guide code quality, implementation standards, and hands-on engineering across the stack while keeping delivery practical and polished.',
                icon: '<i class="fas fa-code"></i>'
            },
            chris: {
                name: 'Chris',
                role: 'CEO & CCO',
                bio: 'Chris leads the company voice, client relationships, and commercial direction so the team stays aligned with customers and growth opportunities.',
                icon: '<i class="fas fa-handshake"></i>'
            },
            lans: {
                name: 'Lans',
                role: 'Intern Developer',
                bio: 'Lans is now an active part of the team, contributing to live development work while sharpening practical full-stack skills through real client and product tasks.',
                icon: '<i class="fas fa-star"></i>'
            }
        };

        let typingTimer = null;
        let typingRun = 0;

        function clearTyping() {
            typingRun += 1;
            if (typingTimer) {
                clearTimeout(typingTimer);
                typingTimer = null;
            }
            detailText.classList.remove('typing');
        }

        function setActiveCard(activeCard) {
            teamCards.forEach(card => card.classList.remove('active-member'));
            if (activeCard) activeCard.classList.add('active-member');
        }

        function typeText(text) {
            const run = typingRun;
            let i = 0;
            detailText.textContent = '';
            detailText.classList.add('typing');

            function next() {
                if (run !== typingRun) return;
                if (i < text.length) {
                    detailText.textContent += text.charAt(i);
                    i += 1;
                    typingTimer = setTimeout(next, 14);
                } else {
                    detailText.classList.remove('typing');
                    typingTimer = null;
                }
            }

            next();
        }

        function open(member, sourceCard) {
            const data = teamData[member];
            if (!data) return;

            clearTyping();
            setActiveCard(sourceCard);

            detailName.textContent = data.name;
            detailRole.textContent = data.role;
            detailAvatar.innerHTML = data.icon;

            overlay.classList.add('active');
            detailPanel.classList.add('active');
            typeText(data.bio);
        }

        function close() {
            clearTyping();
            setActiveCard(null);
            overlay.classList.remove('active');
            detailPanel.classList.remove('active');
            detailText.textContent = '';
        }

        teamCards.forEach(card => {
            card.addEventListener('click', () => {
                const member = card.getAttribute('data-member');
                open(member, card);
            });
        });

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            close();
        });

        overlay.addEventListener('click', close);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && detailPanel.classList.contains('active')) close();
        });
    }

    // =============================================
    // THEME TOGGLE
    // =============================================
    function initThemeToggle() {
        const themeToggleGroup = document.querySelector('.theme-toggle-group');
        const themeButtons = themeToggleGroup ? themeToggleGroup.querySelectorAll('button[data-theme-mode]') : [];
        const html = document.documentElement;

        // Get saved theme or default to 'system'
        const saved = localStorage.getItem('theme') || 'system';
        let theme = saved;

        // If theme is 'system', detect from OS preference
        if (theme === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        html.setAttribute('data-theme', theme);
        html.setAttribute('data-theme-mode', saved); // Store the actual mode (light/dark/system)

        function setActiveButton(mode) {
            if (!themeButtons.length) return;
            themeButtons.forEach(btn => {
                const btnMode = btn.getAttribute('data-theme-mode');
                const isActive = btnMode === mode;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                btn.hidden = !isActive;
            });
        }

        setActiveButton(saved);

        if (!themeToggleGroup) return;

        // Listen for system theme changes
        if (saved === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleSystemChange = (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                html.setAttribute('data-theme', newTheme);
            };

            if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', handleSystemChange);
            else if (mediaQuery.addListener) mediaQuery.addListener(handleSystemChange);
        }

        // Create a theme cycling list: light -> dark -> system -> light
        const themeCycle = ['light', 'dark', 'system'];
        
        // Set up clicking on any button to cycle through themes
        themeToggleGroup.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-theme-mode]');
            if (!button) return;

            e.preventDefault();
            e.stopPropagation();

            const currentMode = html.getAttribute('data-theme-mode') || 'system';
            const currentIndex = themeCycle.indexOf(currentMode);
            const nextIndex = (currentIndex + 1) % themeCycle.length;
            const nextMode = themeCycle[nextIndex];

            // Determine actual theme to apply
            let actualTheme = nextMode;
            if (nextMode === 'system') {
                actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            html.setAttribute('data-theme', actualTheme);
            html.setAttribute('data-theme-mode', nextMode);
            localStorage.setItem('theme', nextMode);
            themeToggleGroup.classList.add('is-switching');
            setActiveButton(nextMode);
            window.setTimeout(() => themeToggleGroup.classList.remove('is-switching'), 340);
        });
    }

    // =============================================
    // SMART NAVBAR
    // =============================================
    function initSmartNavbar() {
        const nav = document.getElementById('mainNav');
        if (!nav) return;

        let lastScroll = 0;
        let ticking = false;
        const threshold = 80;

        window.addEventListener('scroll', () => {
            if (ticking) return;

            window.requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                const menu = document.getElementById('navMenu');
                const menuOpen = !!(menu && menu.classList.contains('active'));

                if (menuOpen) {
                    nav.classList.remove('hidden');
                    lastScroll = currentScroll;
                    ticking = false;
                    return;
                }

                if (currentScroll <= threshold) {
                    nav.classList.remove('hidden');
                } else if (currentScroll > lastScroll + 5) {
                    nav.classList.add('hidden');
                } else if (currentScroll < lastScroll - 5) {
                    nav.classList.remove('hidden');
                }

                lastScroll = currentScroll;
                ticking = false;
            });

            ticking = true;
        });
    }

    // =============================================
    // MOBILE NAVIGATION
    // =============================================
    function initMobileNav() {
        const nav = document.getElementById('mainNav');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        let navMenuClose = document.getElementById('navMenuClose');
        const navContainer = document.querySelector('.nav-container');

        if (!navToggle || !navMenu) return;

        // Normalize mixed nav markup so mobile drawer stays consistent across pages.
        document.querySelectorAll('.nav-menu-logo').forEach(el => el.remove());
        document.querySelectorAll('.nav-menu-header').forEach(el => el.remove());
        navMenu.querySelectorAll('.nav-menu-socials, .nav-menu-tagline').forEach(el => el.remove());

        const navHeader = document.createElement('li');
        navHeader.className = 'nav-menu-header';
        navMenu.insertBefore(navHeader, navMenu.firstElementChild);

        const topLeft = document.createElement('div');
        topLeft.className = 'nav-menu-top-left';
        topLeft.setAttribute('aria-hidden', 'true');
        navHeader.appendChild(topLeft);

        if (!navMenuClose) {
            navMenuClose = document.createElement('button');
            navMenuClose.className = 'nav-menu-close';
            navMenuClose.id = 'navMenuClose';
            navMenuClose.setAttribute('aria-label', 'Close menu');
            navMenuClose.innerHTML = '<i class="fas fa-times"></i>';
        }
        navHeader.appendChild(navMenuClose);

        const socials = document.createElement('li');
        socials.className = 'nav-menu-socials';
        socials.innerHTML = [
            '<a href="https://x.com/NextPhases" class="nav-social-link" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>',
            '<a href="https://www.youtube.com/@nextphases" class="nav-social-link" target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>',
            '<a href="https://www.tiktok.com/@nextphases.dev?lang=en" class="nav-social-link" target="_blank" rel="noopener" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>',
            '<a href="https://www.instagram.com/nextphases.dev/" class="nav-social-link" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>',
            '<a href="https://www.linkedin.com/company/nextphases" class="nav-social-link" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>',
            '<a href="https://discord.gg/DkybgpuRwp" class="nav-social-link" target="_blank" rel="noopener" aria-label="Discord"><i class="fab fa-discord"></i></a>',
            '<a href="https://wa.me/260978131906?text=Hi%20NextPhases%2C%20I%27d%20like%20to%20discuss%20a%20project." class="nav-social-link" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>'  // WhatsApp link uses 260978131906
        ].join('');

        const navInteractiveSelector = '.nav-link, .cta-button';
        const clearPressingState = () => {
            navMenu.querySelectorAll('.is-pressing').forEach(link => link.classList.remove('is-pressing'));
        };

        const contactLink = navMenu.querySelector('a[href*="contact"]');
        if (contactLink && contactLink.parentElement) {
            const tagline = document.createElement('li');
            tagline.className = 'nav-menu-tagline';
            tagline.innerHTML = [
                '<span class="tagline-line">Engineering your</span>',
                '<span class="tagline-line">next phase of</span>',
                '<span class="tagline-line success-word">success</span>'
            ].join('');
            contactLink.parentElement.insertAdjacentElement('afterend', tagline);
        }

        navMenu.appendChild(socials);

        let hoveredLink = null;

        function setHoveredLink(link) {
            if (hoveredLink && hoveredLink !== link) {
                hoveredLink.classList.remove('is-hovering');
            }
            hoveredLink = link || null;
            if (hoveredLink) hoveredLink.classList.add('is-hovering');
        }

        function setMenuOpen(isOpen) {
            navMenu.classList.toggle('active', isOpen);
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            document.body.classList.toggle('nav-open', isOpen);

            if (!isOpen) {
                clearPressingState();
                setHoveredLink(null);
            }

            if (isOpen && nav) {
                nav.classList.remove('hidden');
            }

            const spans = navToggle.querySelectorAll('span');
            if (spans.length >= 3) {
                if (isOpen) {
                    spans[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                    spans[1].style.opacity = '0';
                    spans[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
                } else {
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                    clearPressingState();
                }
            }
        }

        navToggle.setAttribute('aria-expanded', 'false');

        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenuOpen(!navMenu.classList.contains('active'));
        });

        navMenuClose.addEventListener('click', (e) => {
            e.stopPropagation();
            setMenuOpen(false);
        });

        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && (!navContainer || !navContainer.contains(e.target))) {
                setMenuOpen(false);
            }
        });

        navMenu.querySelectorAll(navInteractiveSelector).forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href') || '';
                const url = new URL(link.href, window.location.href);
                const samePage = url.pathname === window.location.pathname && url.search === window.location.search;

                if (samePage) {
                    e.preventDefault();
                    setMenuOpen(false);
                    return;
                }

                e.preventDefault();
                clearPressingState();
                setHoveredLink(link);
                link.classList.add('is-pressing');

                window.setTimeout(() => {
                    clearPressingState();
                    setHoveredLink(null);
                    setMenuOpen(false);
                    window.location.href = href;
                }, 120);
            });

            const clearOwnPressing = () => link.classList.remove('is-pressing');
            link.addEventListener('pointerup', clearOwnPressing);
            link.addEventListener('pointercancel', clearOwnPressing);
            link.addEventListener('pointerenter', () => setHoveredLink(link));
            link.addEventListener('pointerleave', () => {
                clearOwnPressing();
                if (hoveredLink === link) setHoveredLink(null);
            });
            link.addEventListener('touchend', clearOwnPressing, { passive: true });
            link.addEventListener('touchcancel', clearOwnPressing, { passive: true });
            link.addEventListener('contextmenu', clearOwnPressing);
        });

        document.addEventListener('pointerup', clearPressingState);
        document.addEventListener('touchend', clearPressingState, { passive: true });
        document.addEventListener('touchcancel', clearPressingState, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) clearPressingState();
        });

        document.addEventListener('pointermove', (e) => {
            if (!navMenu.classList.contains('active')) return;
            const target = e.target && e.target.closest ? e.target.closest(navInteractiveSelector) : null;
            if (target && navMenu.contains(target)) {
                setHoveredLink(target);
            }
        });

        navMenu.querySelectorAll('.nav-social-link').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) setMenuOpen(false);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) setMenuOpen(false);
        });
    }

    // =============================================
    // SCROLL TO TOP
    // =============================================
    function initScrollToTop() {
        const btn = document.getElementById('scrollToTop');
        if (!btn) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) btn.classList.add('visible');
            else btn.classList.remove('visible');
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // =============================================
    // SMOOTH SCROLL LINKS
    // =============================================
    function initSmoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const navHeight = document.querySelector('.main-nav') ? document.querySelector('.main-nav').offsetHeight : 70;
                const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            });
        });
    }

    // =============================================
    // HERO ENTRANCE
    // =============================================
    function initHeroEntrance() {
        const heroElements = document.querySelectorAll('.hero > *');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            setTimeout(() => {
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 220 + index * 120);
        });
    }

    // =============================================
    // SIMPLE SCROLL ANIMATIONS (AOS-like)
    // =============================================
    function initScrollAnimations() {
        const targets = document.querySelectorAll('[data-aos]');
        if (!targets.length || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0', 10);
                setTimeout(() => entry.target.classList.add('aos-animate'), delay);
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        targets.forEach(el => observer.observe(el));
    }

    // =============================================
    // BACKGROUND ANIMATION -- page-aware
    // =============================================
    function initMoonAnimation() {
        const canvas = document.getElementById('moonCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        const path = (window.location.pathname || '').toLowerCase();
        const normalizedPath = path.replace(/\/+$/, '');
        const page = normalizedPath.split('/').pop() || 'index.html';

        // Nested routes like /games/ and /games/nsolo/ need pathname checks.
        if (normalizedPath.indexOf('/games/nsolo') >= 0) {
            initNsoloSeedsAnimation(canvas, ctx);
            return;
        }
        if (normalizedPath.indexOf('/games') >= 0) {
            initGameSymbolsAnimation(canvas, ctx);
            return;
        }

        if (page.indexOf('services') >= 0) {
            initCodeAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('portfolio') >= 0) {
            initGridAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('about') >= 0) {
            initOrbitAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('contact') >= 0) {
            initPaperPlaneAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('testimonials') >= 0) {
            initQuotesAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('privacy') >= 0 || page.indexOf('terms') >= 0) {
            initLinesAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('games') >= 0 && page.indexOf('nsolo') < 0) {
            initGameSymbolsAnimation(canvas, ctx);
            return;
        }
        if (page.indexOf('nsolo') >= 0) {
            initNsoloSeedsAnimation(canvas, ctx);
            return;
        }

        // Home page: richer moon-phase scene.
        initMoonPhaseAnimation(canvas, ctx);
    }

    function initMoonPhaseAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { moon1: '#60a5fa', moon2: '#3b82f6', star: '#2dd4bf', accent: '#a78bfa' }
                : { moon1: '#3b82f6', moon2: '#1e3a8a', star: '#14b8a6', accent: '#7c3aed' };
        }

        const stars = [];
        const starCount = 80;
        for (let i = 0; i < starCount; i += 1) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 0.6 + Math.random() * 1.8,
                opacity: 0.09 + Math.random() * 0.2,
                twinkleSpeed: 0.008 + Math.random() * 0.02,
                twinklePhase: Math.random() * Math.PI * 2
            });
        }

        const moons = [];
        const moonCount = 34;
        for (let i = 0; i < moonCount; i += 1) {
            moons.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                phase: Math.random(),
                size: 20 + Math.random() * 65,
                speedX: (Math.random() - 0.5) * 0.32,
                speedY: (Math.random() - 0.5) * 0.32,
                opacity: 0.08 + Math.random() * 0.16,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.0012
            });
        }

        const phaseRings = [];
        for (let i = 0; i < 4; i += 1) {
            phaseRings.push({
                x: canvas.width * (0.2 + i * 0.2),
                y: canvas.height * (0.25 + (i % 2) * 0.42),
                r: 90 + Math.random() * 140,
                a: Math.random() * Math.PI * 2,
                speed: 0.002 + Math.random() * 0.002
            });
        }

        function drawStar(star) {
            const c = getColors();
            const twinkle = Math.sin(star.twinklePhase) * 0.5 + 0.5;
            ctx.save();
            ctx.globalAlpha = star.opacity * twinkle;
            ctx.fillStyle = c.star;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        function drawMoon(moon) {
            const c = getColors();
            ctx.save();
            ctx.globalAlpha = moon.opacity;
            ctx.translate(moon.x, moon.y);
            ctx.rotate(moon.rotation);
            ctx.translate(-moon.x, -moon.y);

            const gradient = ctx.createRadialGradient(
                moon.x - moon.size * 0.3,
                moon.y - moon.size * 0.3,
                0,
                moon.x,
                moon.y,
                moon.size
            );
            gradient.addColorStop(0, c.moon1);
            gradient.addColorStop(1, c.moon2);

            ctx.beginPath();
            ctx.arc(moon.x, moon.y, moon.size, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            ctx.globalCompositeOperation = 'destination-out';
            const shadowOffset = (moon.phase - 0.5) * moon.size * 2;
            ctx.beginPath();
            ctx.ellipse(moon.x + shadowOffset, moon.y, moon.size, moon.size, 0, 0, Math.PI * 2);
            ctx.fill();

            if (moon.size > 42) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.globalAlpha = moon.opacity * 0.25;
                ctx.fillStyle = c.moon2;
                ctx.beginPath();
                ctx.arc(moon.x + moon.size * 0.2, moon.y - moon.size * 0.3, moon.size * 0.12, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(moon.x - moon.size * 0.3, moon.y + moon.size * 0.2, moon.size * 0.08, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }

        function drawPhaseRing(ring) {
            const c = getColors();
            ctx.save();
            ctx.globalAlpha = 0.12;
            ctx.strokeStyle = c.accent;
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.arc(ring.x, ring.y, ring.r, ring.a, ring.a + Math.PI * 1.1);
            ctx.stroke();
            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.twinklePhase += star.twinkleSpeed;
                star.x += 0.04;
                star.y += 0.012;
                if (star.x > canvas.width) star.x = 0;
                if (star.y > canvas.height) star.y = 0;
                drawStar(star);
            });

            phaseRings.forEach(ring => {
                ring.a += ring.speed;
                drawPhaseRing(ring);
            });

            moons.forEach(moon => {
                moon.x += moon.speedX;
                moon.y += moon.speedY;
                if (moon.x < -moon.size) moon.x = canvas.width + moon.size;
                if (moon.x > canvas.width + moon.size) moon.x = -moon.size;
                if (moon.y < -moon.size) moon.y = canvas.height + moon.size;
                if (moon.y > canvas.height + moon.size) moon.y = -moon.size;
                moon.phase += 0.00012;
                if (moon.phase > 1) moon.phase = 0;
                moon.rotation += moon.rotationSpeed;
                drawMoon(moon);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initCodeAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { primary: '#60a5fa', secondary: '#2dd4bf', accent: '#a78bfa' }
                : { primary: '#2563eb', secondary: '#0d9488', accent: '#7c3aed' };
        }

        const symbols = ['</>', '{}', '[]', '()', '<', '>', '{', '}', ';', '=', '+', '*', '=>'];
        const particles = [];
        const particleCount = 42; // stronger than before for services page

        for (let i = 0; i < particleCount; i += 1) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                size: 20 + Math.random() * 34,
                speedX: (Math.random() - 0.5) * 0.6,
                speedY: (Math.random() - 0.5) * 0.55,
                opacity: 0.14 + Math.random() * 0.2,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.006,
                color: Math.random() > 0.5 ? 'primary' : (Math.random() > 0.5 ? 'secondary' : 'accent')
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            particles.forEach(particle => {
                particle.x += particle.speedX;
                particle.y += particle.speedY;
                particle.rotation += particle.rotationSpeed;

                if (particle.x < -55) particle.x = canvas.width + 55;
                if (particle.x > canvas.width + 55) particle.x = -55;
                if (particle.y < -55) particle.y = canvas.height + 55;
                if (particle.y > canvas.height + 55) particle.y = -55;

                ctx.save();
                ctx.globalAlpha = particle.opacity;
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.font = particle.size + 'px "Courier New", monospace';
                ctx.fillStyle = colors[particle.color];
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(particle.symbol, 0, 0);
                ctx.restore();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initGridAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { node: '#60a5fa', line: '#3b82f6', pulse: '#2dd4bf' }
                : { node: '#3b82f6', line: '#93c5fd', pulse: '#14b8a6' };
        }

        const nodes = [];
        const nodeCount = 18;
        const connectionDistance = 200;

        for (let i = 0; i < nodeCount; i += 1) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: 3 + Math.random() * 4,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            ctx.strokeStyle = colors.line;
            for (let i = 0; i < nodes.length; i += 1) {
                for (let j = i + 1; j < nodes.length; j += 1) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        ctx.globalAlpha = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;
                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                node.pulsePhase += node.pulseSpeed;
                const pulse = Math.sin(node.pulsePhase) * 0.5 + 0.5;

                ctx.globalAlpha = 0.2 * pulse;
                ctx.fillStyle = colors.pulse;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 0.6 + pulse * 0.4;
                ctx.fillStyle = colors.node;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fill();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initOrbitAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { orbit1: '#60a5fa', orbit2: '#2dd4bf', orbit3: '#a78bfa', orbit4: '#f472b6' }
                : { orbit1: '#3b82f6', orbit2: '#14b8a6', orbit3: '#7c3aed', orbit4: '#ec4899' };
        }

        const orbiters = [];
        const centerCount = 4;

        for (let i = 0; i < centerCount; i += 1) {
            const center = {
                x: (canvas.width / (centerCount + 1)) * (i + 1),
                y: canvas.height / 2 + (Math.random() - 0.5) * 200,
                satellites: []
            };

            const satelliteCount = 2 + Math.floor(Math.random() * 3);
            for (let j = 0; j < satelliteCount; j += 1) {
                center.satellites.push({
                    angle: (Math.PI * 2 / satelliteCount) * j,
                    distance: 60 + Math.random() * 80,
                    speed: 0.01 + Math.random() * 0.02,
                    size: 3 + Math.random() * 5,
                    color: ['orbit1', 'orbit2', 'orbit3', 'orbit4'][Math.floor(Math.random() * 4)]
                });
            }

            orbiters.push(center);
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            orbiters.forEach(orbiter => {
                ctx.globalAlpha = 0.15;
                ctx.fillStyle = colors.orbit1;
                ctx.beginPath();
                ctx.arc(orbiter.x, orbiter.y, 8, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 0.08;
                ctx.strokeStyle = colors.orbit1;
                ctx.lineWidth = 1;
                orbiter.satellites.forEach(sat => {
                    ctx.beginPath();
                    ctx.arc(orbiter.x, orbiter.y, sat.distance, 0, Math.PI * 2);
                    ctx.stroke();
                });

                orbiter.satellites.forEach(sat => {
                    sat.angle += sat.speed;
                    const x = orbiter.x + Math.cos(sat.angle) * sat.distance;
                    const y = orbiter.y + Math.sin(sat.angle) * sat.distance;

                    ctx.globalAlpha = 0.4;
                    ctx.fillStyle = colors[sat.color];
                    ctx.beginPath();
                    ctx.arc(x, y, sat.size, 0, Math.PI * 2);
                    ctx.fill();
                });
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initPaperPlaneAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { plane: '#60a5fa', trail: '#3b82f6', accent: '#f59e0b' }
                : { plane: '#3b82f6', trail: '#93c5fd', accent: '#f97316' };
        }

        const planes = [];
        const planeCount = 9;

        for (let i = 0; i < planeCount; i += 1) {
            planes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: 0.5 + Math.random() * 0.9,
                vy: (Math.random() - 0.5) * 0.35,
                size: 18 + Math.random() * 22,
                opacity: 0.1 + Math.random() * 0.18,
                rotation: 0,
                bobPhase: Math.random() * Math.PI * 2,
                bobSpeed: 0.02 + Math.random() * 0.02,
                trail: []
            });
        }

        function drawPlane(plane) {
            const colors = getColors();
            const bob = Math.sin(plane.bobPhase) * 5;

            ctx.save();
            ctx.globalAlpha = plane.opacity;
            ctx.translate(plane.x, plane.y + bob);
            ctx.rotate(plane.rotation);

            ctx.fillStyle = colors.plane;
            ctx.beginPath();
            ctx.moveTo(plane.size, 0);
            ctx.lineTo(-plane.size * 0.6, -plane.size * 0.4);
            ctx.lineTo(-plane.size * 0.4, 0);
            ctx.lineTo(-plane.size * 0.6, plane.size * 0.4);
            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = plane.opacity * 0.45;
            ctx.strokeStyle = colors.trail;
            ctx.lineWidth = 2;
            ctx.beginPath();
            plane.trail.forEach((point, i) => {
                if (i === 0) ctx.moveTo(point.x - plane.x, point.y - plane.y);
                else ctx.lineTo(point.x - plane.x, point.y - plane.y);
            });
            ctx.stroke();

            ctx.restore();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            planes.forEach(plane => {
                plane.x += plane.vx;
                plane.y += plane.vy;
                plane.bobPhase += plane.bobSpeed;
                plane.rotation = Math.atan2(plane.vy, plane.vx);

                plane.trail.unshift({ x: plane.x, y: plane.y });
                if (plane.trail.length > 14) plane.trail.pop();

                if (plane.x > canvas.width + 55) {
                    plane.x = -55;
                    plane.trail = [];
                }
                if (plane.y < -55) plane.y = canvas.height + 55;
                if (plane.y > canvas.height + 55) plane.y = -55;

                drawPlane(plane);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initQuotesAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { quote: '#60a5fa', star: '#fbbf24' }
                : { quote: '#3b82f6', star: '#f59e0b' };
        }

        const elements = [];

        for (let i = 0; i < 11; i += 1) {
            elements.push({
                type: 'quote',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                char: '"',
                size: 30 + Math.random() * 40,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: 0.08 + Math.random() * 0.13,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.003
            });
        }

        for (let i = 0; i < 14; i += 1) {
            elements.push({
                type: 'star',
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 8 + Math.random() * 14,
                speedX: (Math.random() - 0.5) * 0.25,
                speedY: (Math.random() - 0.5) * 0.25,
                opacity: 0.1 + Math.random() * 0.16,
                pulsePhase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.03 + Math.random() * 0.03
            });
        }

        function drawStar(x, y, size, rotation) {
            ctx.beginPath();
            for (let i = 0; i < 5; i += 1) {
                const angle = (Math.PI / 2.5) * i + rotation;
                const radius = i % 2 === 0 ? size : size / 2;
                const px = x + Math.cos(angle) * radius;
                const py = y + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            elements.forEach(el => {
                el.x += el.speedX;
                el.y += el.speedY;

                if (el.x < -55) el.x = canvas.width + 55;
                if (el.x > canvas.width + 55) el.x = -55;
                if (el.y < -55) el.y = canvas.height + 55;
                if (el.y > canvas.height + 55) el.y = -55;

                if (el.type === 'quote') {
                    el.rotation += el.rotationSpeed;
                    ctx.save();
                    ctx.globalAlpha = el.opacity;
                    ctx.translate(el.x, el.y);
                    ctx.rotate(el.rotation);
                    ctx.font = el.size + 'px Georgia, serif';
                    ctx.fillStyle = colors.quote;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(el.char, 0, 0);
                    ctx.restore();
                } else {
                    el.pulsePhase += el.pulseSpeed;
                    const pulse = Math.sin(el.pulsePhase) * 0.5 + 0.5;
                    ctx.globalAlpha = el.opacity * (0.6 + pulse * 0.4);
                    ctx.fillStyle = colors.star;
                    drawStar(el.x, el.y, el.size, el.pulsePhase);
                }
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initLinesAnimation(canvas, ctx) {
        function getColors() {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            return theme === 'dark'
                ? { line: '#475569', accent: '#60a5fa' }
                : { line: '#cbd5e1', accent: '#3b82f6' };
        }

        const lines = [];
        const lineCount = 35;

        for (let i = 0; i < lineCount; i += 1) {
            lines.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                width: 80 + Math.random() * 180,
                speedX: 0.1 + Math.random() * 0.22,
                opacity: 0.05 + Math.random() * 0.08,
                isAccent: Math.random() > 0.86
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const colors = getColors();

            lines.forEach(line => {
                line.x += line.speedX;
                if (line.x > canvas.width + line.width) line.x = -line.width;

                ctx.globalAlpha = line.opacity;
                ctx.strokeStyle = line.isAccent ? colors.accent : colors.line;
                ctx.lineWidth = line.isAccent ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(line.x, line.y);
                ctx.lineTo(line.x + line.width, line.y);
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    function initGameSymbolsAnimation(canvas, ctx) {
        /* Floating retro game symbols: ▲ ● ■ ◆ ★ */
        const symbols = ['▲', '●', '■', '◆', '★', '▷', '○', '□'];
        const particles = [];
        const count = 68;

        function getPalette() {
            const t = document.documentElement.getAttribute('data-theme') || 'light';
            return t === 'dark'
                ? ['#2dd4bf', '#2dd4bf', '#60a5fa', '#a78bfa', '#fbbf24']
                : ['#14b8a6', '#14b8a6', '#2563eb', '#7c3aed', '#f59e0b'];
        }

        for (let i = 0; i < count; i++) {
            const palette = getPalette();
            particles.push({
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * 200,
                symbol: symbols[Math.floor(Math.random() * symbols.length)],
                size: 12 + Math.random() * 22,
                speed: 0.32 + Math.random() * 0.65,
                opacity: 0.11 + Math.random() * 0.15,
                drift: (Math.random() - 0.5) * 0.4,
                rotation: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.01,
                color: palette[Math.floor(Math.random() * palette.length)]
            });
        }

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.y -= p.speed;
                p.x += p.drift;
                p.rotation += p.rotSpeed;
                if (p.y < -30) {
                    p.y = canvas.height + 20;
                    p.x = Math.random() * canvas.width;
                }
                ctx.save();
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.font = p.size + 'px sans-serif';
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rotation);
                ctx.fillText(p.symbol, -p.size / 2, p.size / 2);
                ctx.restore();
            });
            requestAnimationFrame(frame);
        }
        frame();
    }

    function initNsoloSeedsAnimation(canvas, ctx) {
        /* Mancala seed drift — small circles drifting in gentle arcs */
        function getPalette() {
            const t = document.documentElement.getAttribute('data-theme') || 'light';
            return t === 'dark'
                ? ['#2dd4bf', '#2dd4bf', '#60a5fa', '#a78bfa']
                : ['#14b8a6', '#14b8a6', '#2563eb', '#7c3aed'];
        }

        const seeds = [];
        const count = 58;

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const palette = getPalette();
            seeds.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 3 + Math.random() * 5,
                speed: 0.26 + Math.random() * 0.48,
                angle: angle,
                angleSpeed: (Math.random() - 0.5) * 0.008,
                opacity: 0.1 + Math.random() * 0.14,
                arcRadius: 40 + Math.random() * 120,
                phase: Math.random() * Math.PI * 2,
                color: palette[Math.floor(Math.random() * palette.length)]
            });
        }

        function frame() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            seeds.forEach(s => {
                s.phase += s.speed * 0.012;
                s.angle += s.angleSpeed;
                s.x += Math.cos(s.angle) * s.speed * 0.5;
                s.y += Math.sin(s.angle) * s.speed * 0.5;
                if (s.x < -10) s.x = canvas.width + 10;
                if (s.x > canvas.width + 10) s.x = -10;
                if (s.y < -10) s.y = canvas.height + 10;
                if (s.y > canvas.height + 10) s.y = -10;

                ctx.save();
                ctx.globalAlpha = s.opacity;
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    // =============================================
    // CONTACT FORM
    // =============================================
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const successMsg = document.getElementById('formSuccess');
        const errorMsg = document.getElementById('formError');
        if (!form) return;

        const submitBtn = form.querySelector('.submit-button');
        const regionSelect = form.querySelector('#region');
        const currencySelect = form.querySelector('#currency');
        const currencyLabel = form.querySelector('#currencyLabel');
        const projectTypeSelect = form.querySelector('#projectType');
        const budgetSelect = form.querySelector('#budget');
        const budgetHint = form.querySelector('#budgetHint');

        // Default budget tiers for all project types except System Development
        const budgetMapDefault = {
            USD_ZW: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-300-600', label: 'Starter: USD 300 - 600' },
                { value: 'usd-600-1000', label: 'Standard: USD 600 - 1,000' },
                { value: 'usd-1000-1800', label: 'Professional: USD 1,000 - 1,800' },
                { value: 'usd-1800+', label: 'Enterprise: USD 1,800+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            USD_USCA: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-700-1500', label: 'Starter: USD 700 - 1,500' },
                { value: 'usd-1500-2500', label: 'Standard: USD 1,500 - 2,500' },
                { value: 'usd-2500-4000', label: 'Professional: USD 2,500 - 4,000' },
                { value: 'usd-4000+', label: 'Enterprise: USD 4,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            USD_WE: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-500-900', label: 'Starter: USD 500 - 900' },
                { value: 'usd-900-1500', label: 'Standard: USD 900 - 1,500' },
                { value: 'usd-1500-2500', label: 'Professional: USD 1,500 - 2,500' },
                { value: 'usd-2500+', label: 'Enterprise: USD 2,500+' }
            ],
            USD_NAM: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-800-1500', label: 'Starter: USD 800 - 1,500' },
                { value: 'usd-1500-2800', label: 'Standard: USD 1,500 - 2,800' },
                { value: 'usd-2800-5000', label: 'Professional: USD 2,800 - 5,000' },
                { value: 'usd-5000+', label: 'Enterprise: USD 5,000+' }
            ],
            USD: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-300-700', label: 'Starter: USD 300 - 700' },
                { value: 'usd-700-1500', label: 'Standard: USD 700 - 1,500' },
                { value: 'usd-1500-3000', label: 'Professional: USD 1,500 - 3,000' },
                { value: 'usd-3000+', label: 'Enterprise: USD 3,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZMW: [
                { value: '', label: 'Select budget range' },
                { value: 'zmw-2000-3500', label: 'Starter: ZMW 2,000 - 3,500' },
                { value: 'zmw-3500-5500', label: 'Standard: ZMW 3,500 - 5,500' },
                { value: 'zmw-5500-8000', label: 'Professional: ZMW 5,500 - 8,000' },
                { value: 'zmw-8000+', label: 'Enterprise: ZMW 8,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZAR: [
                { value: '', label: 'Select budget range' },
                { value: 'zar-2500-4500', label: 'Starter: ZAR 2,500 - 4,500' },
                { value: 'zar-4500-7000', label: 'Standard: ZAR 4,500 - 7,000' },
                { value: 'zar-7000-10000', label: 'Professional: ZAR 7,000 - 10,000' },
                { value: 'zar-10000+', label: 'Enterprise: ZAR 10,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            GBP: [
                { value: '', label: 'Select budget range' },
                { value: 'gbp-500-900', label: 'Starter: GBP 500 - 900' },
                { value: 'gbp-900-1400', label: 'Standard: GBP 900 - 1,400' },
                { value: 'gbp-1400-2000', label: 'Professional: GBP 1,400 - 2,000' },
                { value: 'gbp-2000+', label: 'Enterprise: GBP 2,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            EUR: [
                { value: '', label: 'Select budget range' },
                { value: 'eur-550-1000', label: 'Starter: EUR 550 - 1,000' },
                { value: 'eur-1000-1600', label: 'Standard: EUR 1,000 - 1,600' },
                { value: 'eur-1600-2300', label: 'Professional: EUR 1,600 - 2,300' },
                { value: 'eur-2300+', label: 'Enterprise: EUR 2,300+' },
                { value: 'flexible', label: 'Flexible' }
            ]
        };

        // Budget tiers specifically for System Development
        const budgetMapSystems = {
            USD_ZW: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-700-1200', label: 'Starter: USD 700 - 1,200' },
                { value: 'usd-1200-2000', label: 'Standard: USD 1,200 - 2,000' },
                { value: 'usd-2000-3500', label: 'Professional: USD 2,000 - 3,500' },
                { value: 'usd-3500+', label: 'Enterprise: USD 3,500+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            USD_USCA: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-2000-3500', label: 'Starter: USD 2,000 - 3,500' },
                { value: 'usd-3500-6000', label: 'Standard: USD 3,500 - 6,000' },
                { value: 'usd-6000-10000', label: 'Professional: USD 6,000 - 10,000' },
                { value: 'usd-10000+', label: 'Enterprise: USD 10,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            USD_WE: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-1000-2000', label: 'Starter: USD 1,000 - 2,000' },
                { value: 'usd-2000-3500', label: 'Standard: USD 2,000 - 3,500' },
                { value: 'usd-3500-6000', label: 'Professional: USD 3,500 - 6,000' },
                { value: 'usd-6000+', label: 'Enterprise: USD 6,000+' }
            ],
            USD_NAM: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-2000-3500', label: 'Starter: USD 2,000 - 3,500' },
                { value: 'usd-3500-6000', label: 'Standard: USD 3,500 - 6,000' },
                { value: 'usd-6000-10000', label: 'Professional: USD 6,000 - 10,000' },
                { value: 'usd-10000+', label: 'Enterprise: USD 10,000+' }
            ],
            USD: [
                { value: '', label: 'Select budget range' },
                { value: 'usd-700-1200', label: 'Starter: USD 700 - 1,200' },
                { value: 'usd-1200-2000', label: 'Standard: USD 1,200 - 2,000' },
                { value: 'usd-2000-3500', label: 'Professional: USD 2,000 - 3,500' },
                { value: 'usd-3500+', label: 'Enterprise: USD 3,500+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZMW: [
                { value: '', label: 'Select budget range' },
                { value: 'zmw-5000-8000', label: 'Starter: ZMW 5,000 - 8,000' },
                { value: 'zmw-8000-12000', label: 'Standard: ZMW 8,000 - 12,000' },
                { value: 'zmw-12000-18000', label: 'Professional: ZMW 12,000 - 18,000' },
                { value: 'zmw-18000+', label: 'Enterprise: ZMW 18,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            ZAR: [
                { value: '', label: 'Select budget range' },
                { value: 'zar-6500-10000', label: 'Starter: ZAR 6,500 - 10,000' },
                { value: 'zar-10000-15000', label: 'Standard: ZAR 10,000 - 15,000' },
                { value: 'zar-15000-22000', label: 'Professional: ZAR 15,000 - 22,000' },
                { value: 'zar-22000+', label: 'Enterprise: ZAR 22,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            GBP: [
                { value: '', label: 'Select budget range' },
                { value: 'gbp-1200-2000', label: 'Starter: GBP 1,200 - 2,000' },
                { value: 'gbp-2000-3200', label: 'Standard: GBP 2,000 - 3,200' },
                { value: 'gbp-3200-5000', label: 'Professional: GBP 3,200 - 5,000' },
                { value: 'gbp-5000+', label: 'Enterprise: GBP 5,000+' },
                { value: 'flexible', label: 'Flexible' }
            ],
            EUR: [
                { value: '', label: 'Select budget range' },
                { value: 'eur-1400-2200', label: 'Starter: EUR 1,400 - 2,200' },
                { value: 'eur-2200-3500', label: 'Standard: EUR 2,200 - 3,500' },
                { value: 'eur-3500-5500', label: 'Professional: EUR 3,500 - 5,500' },
                { value: 'eur-5500+', label: 'Enterprise: EUR 5,500+' },
                { value: 'flexible', label: 'Flexible' }
            ]
        };

        function getRegionConfig(regionCode) {
            const map = {
                'zambia': {
                    label: 'Zambia', currency: 'ZMW', budgetKey: 'ZMW'
                },
                'zimbabwe-usd': {
                    label: 'Zimbabwe', currency: 'USD', budgetKey: 'USD_ZW'
                },
                'southern-africa-usd': {
                    label: 'Southern Africa', currency: 'USD', budgetKey: 'USD_ZW'
                },
                'west-east-africa': {
                    label: 'West & East Africa', currency: 'USD', budgetKey: 'USD_WE'
                },
                'north-africa-me': {
                    label: 'North Africa & Middle East', currency: 'USD', budgetKey: 'USD_NAM'
                },
                'south-africa': {
                    label: 'South Africa', currency: 'ZAR', budgetKey: 'ZAR'
                },
                'uk': {
                    label: 'UK', currency: 'GBP', budgetKey: 'GBP'
                },
                'europe': {
                    label: 'Europe', currency: 'EUR', budgetKey: 'EUR'
                },
                'us-canada': {
                    label: 'US & Canada', currency: 'USD', budgetKey: 'USD_USCA'
                },
                'other-international': {
                    label: 'Other / International', currency: 'USD', budgetKey: 'USD'
                }
            };
            return map[regionCode] || map['other-international'];
        }

        function detectRegionByLocale() {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            const locale = (navigator.language || '').toUpperCase();
            const region = locale.includes('-') ? locale.split('-')[1] : '';

            if (tz.indexOf('Africa/Lusaka') === 0 || region === 'ZM') return 'zambia';
            if (region === 'ZW') return 'zimbabwe-usd';
            if (tz.indexOf('Africa/Johannesburg') === 0 || region === 'ZA') return 'south-africa';
            if (tz.indexOf('Europe/London') === 0 || region === 'GB') return 'uk';
            if (tz.indexOf('Europe/') === 0 && region !== 'GB') return 'europe';
            if (region === 'US' || region === 'CA') return 'us-canada';
            if (tz.indexOf('Africa/') === 0) return 'zambia';
            return 'other-international';
        }

        function detectCurrencyByRegion() {
            if (regionSelect) return getRegionConfig(detectRegionByLocale()).currency;

            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
            const locale = (navigator.language || '').toUpperCase();
            const region = locale.includes('-') ? locale.split('-')[1] : '';

            if (tz.indexOf('Africa/Lusaka') === 0 || region === 'ZM') return 'ZMW';
            if (tz.indexOf('Africa/Johannesburg') === 0 || region === 'ZA') return 'ZAR';
            if (tz.indexOf('Europe/London') === 0 || region === 'GB') return 'GBP';
            if (tz.indexOf('Europe/') === 0 && region !== 'GB') return 'EUR';
            if (region === 'US' || region === 'CA') return 'USD';
            return 'USD';
        }

        function getBudgetKey() {
            if (regionSelect) return getRegionConfig(regionSelect.value).budgetKey;
            return currencySelect ? currencySelect.value : 'USD';
        }

        function renderBudgetOptions(currencyCode) {
            if (!budgetSelect) return;

            const projectType = projectTypeSelect ? projectTypeSelect.value : '';
            const isSystems = projectType === 'system';
            const budgetMap = isSystems ? budgetMapSystems : budgetMapDefault;

            const options = budgetMap[currencyCode] || budgetMap.USD;
            budgetSelect.innerHTML = options.map(option => '<option value="' + option.value + '">' + option.label + '</option>').join('');

            if (budgetHint) {
                const tierType = isSystems ? ' (System Development pricing)' : '';
                if (regionSelect) {
                    const region = getRegionConfig(regionSelect.value);
                    budgetHint.textContent = 'Budget adjusted for ' + region.label + ' (' + region.currency + ')' + tierType + '.';
                } else {
                    budgetHint.textContent = 'Budget adjusted for ' + currencyCode + tierType + '. You can change currency or project type manually.';
                }
            }
            
            // Apply pre-selected plan from URL if available
            if (form.dataset.preselectedPlan && budgetSelect) {
                const planKey = form.dataset.preselectedPlan;
                const options = budgetSelect.querySelectorAll('option');
                for (let option of options) {
                    if (option.value.includes(planKey)) {
                        budgetSelect.value = option.value;
                        break;
                    }
                }
            }
        }

        // Read URL parameters and pre-fill form
        const urlParams = new URLSearchParams(window.location.search);
        const planParam = urlParams.get('plan');
        
        if (planParam) {
            // Map plan names to budget value patterns
            const planToBudgetPattern = {
                'starter': 'starter',
                'standard': 'standard',
                'professional': 'professional',
                'enterprise': 'enterprise'
            };
            
            const planKey = planToBudgetPattern[planParam.toLowerCase()];
            
            if (planKey) {
                // Set project type if needed (will be reset by budget rendering)
                // Scroll to form after a small delay to ensure everything is rendered
                setTimeout(() => {
                    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
                
                // Store the plan to be selected after budget options are rendered
                form.dataset.preselectedPlan = planKey;
            }
        }

        // Handle region button clicks (new UI)
        const regionButtons = form.querySelectorAll('.region-btn');

        function syncRegionSelection(regionCode) {
            const regionConfig = getRegionConfig(regionCode);

            if (regionSelect) {
                regionSelect.value = regionCode;
            }

            if (currencySelect) {
                currencySelect.value = regionConfig.currency;
            }

            if (currencyLabel) {
                currencyLabel.textContent = regionConfig.currency;
            }

            if (regionButtons.length > 0) {
                regionButtons.forEach(btn => {
                    btn.classList.toggle('active', btn.getAttribute('data-region') === regionCode);
                });
            }

            renderBudgetOptions(regionConfig.budgetKey);
        }

        if (regionButtons.length > 0) {
            regionButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const region = btn.getAttribute('data-region');
                    if (!region) return;
                    syncRegionSelection(region);
                });
            });
        }

        if (regionSelect) {
            const detectedRegion = detectRegionByLocale();
            syncRegionSelection(detectedRegion);

            regionSelect.addEventListener('change', () => {
                syncRegionSelection(regionSelect.value);
            });
        } else if (currencySelect) {
            const detectedCurrency = detectCurrencyByRegion();
            currencySelect.value = detectedCurrency;
            renderBudgetOptions(detectedCurrency);
            currencySelect.addEventListener('change', () => renderBudgetOptions(currencySelect.value));
        } else {
            renderBudgetOptions('USD');
        }

        // Update budget options when project type changes
        if (projectTypeSelect) {
            projectTypeSelect.addEventListener('change', () => {
                renderBudgetOptions(getBudgetKey());
            });
        }

        let formLoadTime = Date.now();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const honeypot = form.querySelector('#website');
            if (honeypot && honeypot.value) {
                if (successMsg) successMsg.style.display = 'flex';
                form.reset();
                return;
            }

            if (Date.now() - formLoadTime < 3000) {
                if (successMsg) successMsg.style.display = 'flex';
                form.reset();
                return;
            }

            if (successMsg) successMsg.style.display = 'none';
            if (errorMsg) errorMsg.style.display = 'none';

            const formData = {
                name: form.querySelector('#name') ? form.querySelector('#name').value : '',
                email: form.querySelector('#email') ? form.querySelector('#email').value : '',
                company: form.querySelector('#company') ? form.querySelector('#company').value : '',
                projectType: form.querySelector('#projectType') ? form.querySelector('#projectType').value : '',
                currency: form.querySelector('#currency') ? form.querySelector('#currency').value : 'USD',
                budget: form.querySelector('#budget') ? form.querySelector('#budget').value : '',
                timeline: form.querySelector('#timeline') ? form.querySelector('#timeline').value : '',
                message: form.querySelector('#message') ? form.querySelector('#message').value : '',
                timestamp: new Date().toISOString()
            };

            if (!validateEmail(formData.email)) {
                const emailInput = form.querySelector('#email');
                if (emailInput) {
                    emailInput.style.borderColor = '#dc2626';
                    emailInput.focus();
                }
                return;
            }

            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }

            try {
                const endpoint = 'https://formspree.io/f/xgoldrwl';
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Submission failed');

                // Trigger plane-fly animation on success
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('sending');

                    // Wait for animation to finish before showing success message
                    setTimeout(() => {
                        submitBtn.classList.remove('sending');
                        submitBtn.disabled = false;

                        if (successMsg) {
                            successMsg.style.display = 'flex';
                            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }

                        form.reset();
                        if (regionSelect) {
                            syncRegionSelection(detectRegionByLocale());
                        } else if (currencySelect) {
                            const detectedCurrency = detectCurrencyByRegion();
                            currencySelect.value = detectedCurrency;
                            renderBudgetOptions(detectedCurrency);
                        }

                        formLoadTime = Date.now();
                    }, 700); // Match the plane-fly animation duration
                } else {
                    if (successMsg) {
                        successMsg.style.display = 'flex';
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }

                    form.reset();
                    if (regionSelect) {
                        syncRegionSelection(detectRegionByLocale());
                    } else if (currencySelect) {
                        const detectedCurrency = detectCurrencyByRegion();
                        currencySelect.value = detectedCurrency;
                        renderBudgetOptions(detectedCurrency);
                    }

                    formLoadTime = Date.now();
                }
            } catch (error) {
                // Trigger plane-crash animation on error
                if (submitBtn) {
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('crash');

                    // Wait for animation to finish before showing error message
                    setTimeout(() => {
                        submitBtn.classList.remove('crash');
                        submitBtn.disabled = false;

                        if (errorMsg) {
                            errorMsg.style.display = 'flex';
                            errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    }, 600); // Match the plane-crash animation duration
                } else {
                    if (errorMsg) {
                        errorMsg.style.display = 'flex';
                        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }
            }
        });

        const emailInput = form.querySelector('#email');
        if (emailInput) {
            emailInput.addEventListener('blur', () => {
                if (emailInput.value && !validateEmail(emailInput.value)) emailInput.style.borderColor = '#dc2626';
                else emailInput.style.borderColor = '';
            });
            emailInput.addEventListener('input', () => {
                emailInput.style.borderColor = '';
            });
        }
    }

    // =============================================
    // URL PARAMS
    // =============================================
    function prefillFromURL() {
        const params = new URLSearchParams(window.location.search);
        const serviceParam = params.get('service');
        if (!serviceParam) return;

        const projectType = document.getElementById('projectType');
        if (!projectType) return;

        const optionMap = {
            website: 'website',
            webapp: 'webapp',
            mobile: 'mobile',
            system: 'system',
            consulting: 'consulting'
        };

        const value = optionMap[serviceParam];
        if (value) projectType.value = value;
    }

    // =============================================
    // UTILITIES
    // =============================================
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function scrollToContact() {
        const contact = document.getElementById('contact');
        if (!contact) return;

        const nav = document.querySelector('.main-nav');
        const navHeight = nav ? nav.offsetHeight : 70;
        const pos = contact.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: pos, behavior: 'smooth' });
    }

    window.scrollToContact = scrollToContact;

    function updateCopyrightYear() {
        const yearSpan = document.getElementById('year');
        if (yearSpan) yearSpan.textContent = String(new Date().getFullYear());
    }

    // =============================================
    // FOOTER INJECTION
    // =============================================
    function loadFooter() {
        if (document.querySelector('body > footer') || document.querySelector('main + footer')) {
            updateCopyrightYear();
            return;
        }

        const fallbackFooter = [
            '<footer>',
            '  <div class="footer-content">',
            '    <div class="footer-grid">',
            '      <div class="footer-brand">',
            '        <div class="footer-logo"><svg class="footer-icon" viewBox="0 0 397 395" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M139.589 352.085C87.7618 345.654 81.9704 339.492 46.5888 319.085C43.3888 319.485 43.5888 322.251 44.0888 323.585C47.5888 327.418 54.6888 335.285 55.0888 336.085C55.4888 336.885 62.5888 343.418 66.0888 346.585C68.5888 349.251 74.3888 354.885 77.5888 356.085C78.0888 356.085 89.0888 366.585 99.0888 370.085C99.0888 371.085 127.589 384.085 135.589 386.085C135.989 386.885 155.755 390.751 165.589 392.585C171.755 393.418 185.089 394.885 189.089 394.085C189.489 394.885 204.922 393.751 212.589 393.085L215.589 392.585C225.089 391.251 246.889 387.385 258.089 382.585C258.589 383.085 300.589 363.585 313.089 352.585C314.289 352.985 332.922 334.418 342.089 325.085C346.755 320.085 357.589 307.285 363.589 296.085C364.589 294.085 374.089 281.085 379.089 265.585C380.589 263.585 386.589 247.585 390.089 231.585C393.51 215.947 395.589 195.585 395.589 195.085V164.085C395.255 157.085 393.489 139.585 389.089 125.585C383.589 108.085 384.589 110.585 383.589 108.085C382.089 105.585 376.589 91.5845 374.089 88.0845C371.589 84.5845 363.089 69.5845 362.589 69.5845C362.089 69.5845 355.589 59.0845 351.089 55.0845C348.589 53.0845 338.089 40.5845 328.589 33.5845C320.589 28.0845 310.589 21.0845 304.589 18.0845C303.589 17.0845 290.589 12.0845 290.089 11.5845C289.589 11.0845 282.089 8.58453 285.089 9.58452C279.589 7.08452 259.589 2.58453 255.089 2.08452C253.978 1.96105 240.589 0.0845171 239.589 0.584517C238.589 1.08452 238.589 3.08452 239.589 3.58452C246.089 6.08452 265.589 13.0845 282.589 27.5845C302.589 47.1845 312.922 61.7512 315.589 66.5845C321.422 76.4178 334.289 102.385 339.089 127.585C341.589 132.085 342.589 179.585 339.089 196.585C335.589 213.585 326.089 243.085 310.589 267.085C306.089 273.585 290.089 294.585 272.089 309.085C257.689 320.685 245.755 327.585 241.589 329.585C223.255 339.085 177.189 356.885 139.589 352.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/><path d="M122.089 321.085C126.922 321.418 138.689 322.085 147.089 322.085C147.589 322.585 152.589 320.085 149.589 317.085C147.255 316.918 141.189 316.085 135.589 314.085C131.422 312.585 121.689 308.685 116.089 305.085C112.422 302.918 103.689 297.285 98.0888 292.085C93.9221 288.251 84.3888 278.985 79.5888 272.585C76.5888 268.418 69.6888 258.185 66.0888 250.585C63.7554 245.251 58.6888 232.885 57.0888 226.085C55.5888 220.085 54.5888 214.085 54.0888 205.585C53.5862 197.041 52.5888 193.085 53.5888 187.085C53.5888 179.585 54.5888 174.085 55.5888 167.585C56.5888 161.085 57.0888 158.085 60.0888 150.085C62.0888 141.585 64.5888 136.085 68.0888 128.585C70.5888 124.085 76.3888 114.085 79.5888 110.085C81.0888 107.751 85.1888 102.085 89.5888 98.0845C91.2554 95.9179 95.4888 90.8845 99.0888 88.0845C101.089 86.0845 106.214 82.5845 109.589 79.5845C111.089 78.2512 114.689 75.2845 117.089 74.0845C119.255 72.4179 124.389 68.7845 127.589 67.5845C131.089 64.5845 136.089 63.0845 146.589 58.5845C150.589 57.0845 160.289 53.7845 167.089 52.5845C188.089 49.0845 174.589 51.0845 183.589 50.0845H198.589C200.755 49.9179 206.689 49.9845 213.089 51.5845C216.922 52.2512 226.189 54.1845 232.589 56.5845C238.589 58.5845 247.275 61.6776 253.089 64.5845C257.089 66.5845 262.089 70.0845 266.589 73.0845C271.089 76.0845 274.089 77.0845 278.589 81.5845C283.089 85.5845 286.589 89.0845 288.089 90.5845C289.364 91.8593 297.089 100.585 298.089 101.085C299.089 101.585 301.089 100.085 301.089 99.0845C301.089 98.0845 301.089 96.5845 298.089 92.5845C295.089 87.0845 294.589 86.0845 290.589 79.5845C286.589 73.0845 287.089 72.5845 282.089 66.5845C277.089 60.5845 276.089 59.5845 273.089 56.0845C268.589 51.5845 262.589 45.5845 258.089 41.5845C249.589 35.0845 244.089 30.5845 236.089 26.0845C226.344 20.6032 219.589 17.5845 206.089 13.5845C205.589 13.5845 187.089 8.58453 176.589 8.58453H156.589C156.089 8.58453 138.089 10.5845 133.589 11.5845C120.776 14.5413 116.706 16.041 107.496 19.4346L107.089 19.5845C93.0888 26.0845 84.5888 30.5845 82.5888 31.5845C80.5888 32.5845 63.5888 45.0845 61.5888 47.0845C59.5888 49.0845 53.0888 54.5845 50.0888 58.0845C47.0888 61.5845 39.0888 69.0845 36.0888 73.5845L26.0888 88.5845C24.0888 91.5845 18.5888 100.585 14.5888 109.585C14.0888 110.085 9.08878 122.585 6.58876 130.585C1.58876 149.585 1.58877 155.085 1.08876 158.085C0.924354 159.071 -0.411244 184.585 1.58876 195.585C3.58876 210.585 3.55029 210.085 5.08876 215.085C7.08876 221.585 9.08876 228.585 13.0888 237.085C14.5888 240.751 18.4888 249.285 22.0888 254.085C27.0888 261.085 27.0888 262.87 32.0888 268.585C35.5888 272.585 45.5888 283.585 54.0888 290.585C62.5888 296.585 66.5888 300.085 72.5888 303.085C77.5888 306.585 96.5888 314.085 98.5888 315.085C100.189 315.885 114.922 319.418 122.089 321.085Z" stroke="currentColor" stroke-width="2"/></svg><span>NextPhases</span></div>',
            '        <p class="footer-tagline">Engineering your next phase of success.</p>',
            '        <div class="footer-socials">',
            '          <a href="https://www.youtube.com/@nextphases" class="social-link" target="_blank" rel="noopener" aria-label="YouTube"><i class="fab fa-youtube"></i></a>',
            '          <a href="https://x.com/NextPhases" class="social-link" target="_blank" rel="noopener" aria-label="Twitter"><i class="fab fa-twitter"></i></a>',
            '          <a href="https://www.tiktok.com/@nextphases.dev?lang=en" class="social-link" target="_blank" rel="noopener" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>',
            '          <a href="https://www.instagram.com/nextphases.dev/" class="social-link" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>',
            '          <a href="https://www.linkedin.com/company/nextphases" class="social-link" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>',
            '          <a href="https://discord.gg/DkybgpuRwp" class="social-link" target="_blank" rel="noopener" aria-label="Discord"><i class="fab fa-discord"></i></a>',
            '        </div>',
            '      </div>',
            '      <div class="footer-column"><h4>Services</h4><ul><li><a href="/services.html#web-dev">Web Development</a></li><li><a href="/services.html#app-dev">App Development</a></li><li><a href="/services.html#consulting">Consulting</a></li></ul></div>',
            '      <div class="footer-column"><h4>Projects</h4><ul><li><a href="/portfolio.html#examguard">ExamGuard</a></li><li><a href="/games/nsolo">Nsolo</a></li><li><a href="/portfolio.html">View All</a></li></ul></div>',
            '      <div class="footer-column"><h4>Company</h4><ul><li><a href="/about.html">About Us</a></li><li><a href="/testimonials.html">Testimonials</a></li><li><a href="/contact.html">Contact</a></li><li><a href="/privacy.html">Privacy Policy</a></li><li><a href="/terms.html">Terms of Service</a></li></ul></div>',
            '      <div class="footer-column"><h4>Get in Touch</h4><ul class="footer-contact-list"><li><i class="fas fa-envelope"></i><a href="mailto:info@nextphases.dev">info@nextphases.dev</a></li><li><i class="fas fa-map-marker-alt"></i><span>Lusaka, Zambia</span></li></ul></div>',
            '    </div>',
            '    <div class="footer-bottom"><p>&copy; <span id="year"></span> NextPhases. All Rights Reserved.</p></div>',
            '  </div>',
            '</footer>'
        ].join('');

        function injectFooter(html) {
            const scrollBtn = document.querySelector('.scroll-to-top');
            if (scrollBtn) scrollBtn.insertAdjacentHTML('beforebegin', html);
            else document.body.insertAdjacentHTML('beforeend', html);
            updateCopyrightYear();
            promoteWhatsAppLinks();
        }

        fetch(resolveSitePath('footer.html'))
            .then(response => {
                if (!response.ok) throw new Error('Footer not found');
                return response.text();
            })
            .then(injectFooter)
            .catch(() => {
                injectFooter(fallbackFooter);
            });
    }

    // =============================================
    // WELCOME GUIDE
    // =============================================
    function initWelcomeGuide() {
        const helpButton = document.getElementById('helpGuideButton');
        const panel = document.querySelector('.smart-help-panel');
        if (!helpButton || !panel) return;
        const closeButton = panel.querySelector('.smart-help-close');

        panel.setAttribute('aria-hidden', 'true');

        function openPanel() {
            panel.classList.add('is-visible');
            panel.setAttribute('aria-hidden', 'false');
            helpButton.classList.add('is-active');
            if (closeButton) closeButton.focus({ preventScroll: true });
        }

        function closePanel() {
            panel.classList.remove('is-visible');
            panel.setAttribute('aria-hidden', 'true');
            helpButton.classList.remove('is-active');
        }

        function hintButton() {
            if (panel.classList.contains('is-visible')) return;
            helpButton.classList.remove('is-active');
            void helpButton.offsetWidth;
            helpButton.classList.add('is-active');
            window.setTimeout(() => helpButton.classList.remove('is-active'), 420);
        }

        helpButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (panel.classList.contains('is-visible')) closePanel();
            else openPanel();
        });

        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault();
                closePanel();
                helpButton.focus({ preventScroll: true });
            });
        }

        document.addEventListener('click', (e) => {
            if (!panel.classList.contains('is-visible')) return;
            if (panel.contains(e.target) || helpButton.contains(e.target)) return;
            closePanel();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePanel();
        });

        setTimeout(() => {
            if (!panel.classList.contains('is-visible')) helpButton.classList.add('is-active');
        }, 1400);

        window.setInterval(() => {
            if (!panel.classList.contains('is-visible')) hintButton();
        }, 42000);
    }
    function initGlobalParallax() {
        // Skip on touch devices and when user prefers reduced motion
        if ('ontouchstart' in window) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!window.matchMedia('(pointer: fine)').matches) return;

        var moonCanvas = document.getElementById('moonCanvas');
        var parallaxEls = document.querySelectorAll('[data-parallax], .background-animation');
        if (!moonCanvas && parallaxEls.length === 0) return;

        // Ensure the canvas scales up slightly so parallax shift never reveals edges
        if (moonCanvas) {
            moonCanvas.style.transformOrigin = 'center center';
            moonCanvas.style.willChange = 'transform';
        }

        function resetParallaxElements() {
            parallaxEls.forEach(function (el) {
                el.style.transform = '';
            });
        }

        resetParallaxElements();

        var px = 0.5, py = 0.5, tx = 0.5, ty = 0.5;
        var active = false, rafId = null;

        document.addEventListener('mousemove', function (e) {
            tx = e.clientX / window.innerWidth;
            ty = e.clientY / window.innerHeight;
            if (!active) { active = true; rafId = requestAnimationFrame(tick); }
        }, { passive: true });

        function tick() {
            px += (tx - px) * 0.055;
            py += (ty - py) * 0.055;
            var mx = (px - 0.5) * -18;
            var my = (py - 0.5) * -12;
            if (moonCanvas) {
                moonCanvas.style.transform = 'translate(' + mx.toFixed(2) + 'px,' + my.toFixed(2) + 'px) scale(1.06)';
            }
            var d = Math.abs(tx - px) + Math.abs(ty - py);
            if (d < 0.001) { active = false; cancelAnimationFrame(rafId); }
            else { rafId = requestAnimationFrame(tick); }
        }
    }
    function initMagneticButtons() {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if ('ontouchstart' in window) return;

        document.querySelectorAll('.cta-button:not([data-magnetic])').forEach(function (btn) {
            btn.dataset.magnetic = '1';
            btn.addEventListener('mousemove', function (e) {
                var r = btn.getBoundingClientRect();
                var dx = (e.clientX - r.left - r.width  / 2) * 0.15;
                var dy = (e.clientY - r.top  - r.height / 2) * 0.15;
                btn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
            });
            btn.addEventListener('mouseleave', function () {
                btn.style.transform = '';
            });
        });
    }

    // =============================================
    // TIER FEATURES EXPANSION
    // =============================================
    function initTierFeatures() {
        const features = document.querySelectorAll('.tier-features .feature');
        
        features.forEach(feature => {
            // Make feature clickable
            feature.style.cursor = 'pointer';
            
            feature.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Check if already expanded
                const isExpanded = this.classList.contains('feature-expanded');
                
                // Close all other expanded features in this list
                const siblings = this.parentElement.querySelectorAll('.feature');
                siblings.forEach(sibling => {
                    if (sibling !== this && sibling.classList.contains('feature-expanded')) {
                        sibling.classList.remove('feature-expanded');
                        const explanation = sibling.nextElementSibling;
                        if (explanation && explanation.classList.contains('feature-explanation')) {
                            explanation.remove();
                        }
                    }
                });
                
                if (isExpanded) {
                    // Collapse
                    this.classList.remove('feature-expanded');
                    const explanation = this.nextElementSibling;
                    if (explanation && explanation.classList.contains('feature-explanation')) {
                        explanation.style.maxHeight = '0';
                        explanation.style.opacity = '0';
                        setTimeout(() => explanation.remove(), 300);
                    }
                } else {
                    // Expand
                    this.classList.add('feature-expanded');
                    const explanationText = this.getAttribute('data-explanation');
                    const explanationDiv = document.createElement('li');
                    explanationDiv.className = 'feature-explanation';
                    explanationDiv.style.cssText = 'list-style:none;padding:12px 0 0 32px;color:var(--text-muted);font-size:0.9rem;line-height:1.5;margin-bottom:8px;max-height:0;opacity:0;overflow:hidden;transition:max-height 0.3s ease, opacity 0.3s ease;';
                    explanationDiv.textContent = explanationText;
                    
                    this.insertAdjacentElement('afterend', explanationDiv);
                    
                    // Trigger animation
                    requestAnimationFrame(() => {
                        explanationDiv.style.maxHeight = '100px';
                        explanationDiv.style.opacity = '1';
                    });
                }
            });
        });
    }

    // =============================================
    // PRICING PAGE REGION & CURRENCY CONVERTER
    // =============================================
    function initPricingCurrency() {
        const regionSelect = document.getElementById('pricingRegion');
        const projectTypeToggle = document.getElementById('projectTypeToggle');
        
        if (!regionSelect) return;

        // Map regions to pricing currency codes
        const regionToCurrency = {
            'detected': null,           // Will auto-detect
            'zambia': 'ZMW',
            'south-africa': 'ZAR',
            'zimbabwe-usd': 'USD_ZW',
            'west-east-africa': 'USD_WE',
            'north-africa-me': 'USD_NAM',
            'us-canada': 'USD_USCA',
            'uk': 'GBP',
            'europe': 'EUR',
            'other-international': 'USD'
        };

        function updatePrices() {
            let selectedRegion = regionSelect.value;
            let currencyCode = regionToCurrency[selectedRegion];
            
            // Auto-detect if "detected" selected
            if (selectedRegion === 'detected' || !currencyCode) {
                const userRegion = detectRegionByLocale();
                const regionConfig = getRegionConfig(userRegion);
                currencyCode = regionConfig.budgetKey;
            }
            
            const isSystemProject = projectTypeToggle?.checked || false;
            updatePricingDisplay(currencyCode, isSystemProject);
        }

        regionSelect.addEventListener('change', updatePrices);
        
        if (projectTypeToggle) {
            projectTypeToggle.addEventListener('change', updatePrices);
        }

        // Auto-detect on first visit
        if (!sessionStorage.getItem('pricingRegionSet')) {
            const userRegion = detectRegionByLocale();
            const regionConfig = getRegionConfig(userRegion);
            
            // Find matching region value
            let selectedRegionValue = 'other-international';
            for (let [region, currency] of Object.entries(regionToCurrency)) {
                if (currency === regionConfig.budgetKey) {
                    selectedRegionValue = region;
                    break;
                }
            }
            
            regionSelect.value = selectedRegionValue;
            updatePrices();
            sessionStorage.setItem('pricingRegionSet', 'true');
        } else {
            updatePrices();
        }
    }

    // =============================================
    // SHOWCASE CAROUSEL
    // =============================================
    function initShowcaseCarousel() {
        const carousel = document.getElementById('showcaseCarousel');
        if (!carousel) return;

        const slidesWrap = carousel.querySelector('.slides');
        const slides = carousel.querySelectorAll('.slide');
        let index = 0;
        let autoId = null;
        let pointerDown = false;
        let startX = 0;
        let lastX = 0;
        let velocity = 0;
        let dragOffset = 0;
        let momentumFrame = null;
        const pricingTiers = document.querySelectorAll('.pricing-tier[data-showcase]');

        function goTo(i) {
            index = (i + slides.length) % slides.length;
            slidesWrap.style.transition = 'transform 0.45s ease';
            slidesWrap.style.transform = 'translateX(' + (-index * 100) + '%)';
            slides.forEach((s, si) => s.classList.toggle('active', si === index));
            // update pricing-tier pseudo backgrounds: find tiers mapped to this slide and show subtle background
            pricingTiers.forEach(tier => {
                const showIdx = Number(tier.getAttribute('data-showcase'));
                if (showIdx === index) {
                    const slide = slides[index];
                    const img = slide.querySelector('img');
                    if (img) {
                        tier.classList.add('has-showcase');
                        tier.style.setProperty('--showcase-image', 'url("' + img.src + '")');
                    }
                } else {
                    tier.classList.remove('has-showcase');
                    tier.style.removeProperty('--showcase-image');
                }
            });
        }

        function next() { goTo(index + 1); }

        function startAutoRotate() {
            stopAutoRotate();
            autoId = setInterval(next, 5500);
        }

        function stopAutoRotate() {
            if (autoId) clearInterval(autoId);
            autoId = null;
        }

        function onPointerDown(e) {
            pointerDown = true;
            startX = e.clientX;
            lastX = e.clientX;
            velocity = 0;
            dragOffset = 0;
            slidesWrap.style.transition = 'none';
            stopAutoRotate();
            // Cancel any ongoing momentum
            if (momentumFrame) {
                cancelAnimationFrame(momentumFrame);
                momentumFrame = null;
            }
            if (slidesWrap.setPointerCapture) slidesWrap.setPointerCapture(e.pointerId);
        }

        function onPointerMove(e) {
            if (!pointerDown) return;
            dragOffset = e.clientX - startX;
            velocity = e.clientX - lastX;
            lastX = e.clientX;
            const offsetPct = (dragOffset / Math.max(1, carousel.clientWidth)) * 100;
            slidesWrap.style.transform = 'translateX(' + ((-index * 100) + offsetPct) + '%)';
        }

        function onPointerUp(e) {
            if (!pointerDown) return;
            pointerDown = false;
            if (slidesWrap.releasePointerCapture) {
                try { slidesWrap.releasePointerCapture(e.pointerId); } catch (_) {}
            }

            const width = Math.max(1, carousel.clientWidth);
            const movedEnough = Math.abs(dragOffset) > width * 0.18;
            const fastSwipe = Math.abs(velocity) > 8;

            // If a fast swipe happened or the user dragged a lot, animate to next/prev.
            // Otherwise, use inertial momentum if available to create a smooth roulette feel.
            if (fastSwipe || movedEnough) {
                goTo(index + (dragOffset < 0 ? 1 : -1));
                startAutoRotate();
                return;
            }

            // Momentum-based easing: decay velocity and update transform until it settles,
            // then snap back to the nearest slide.
            function runMomentum() {
                // apply simple decay
                velocity *= 0.92;
                dragOffset += velocity;

                const offsetPct = (dragOffset / Math.max(1, width)) * 100;
                slidesWrap.style.transform = 'translateX(' + ((-index * 100) + offsetPct) + '%)';

                if (Math.abs(velocity) > 0.5) {
                    momentumFrame = requestAnimationFrame(runMomentum);
                } else {
                    // Decide final position based on how far we drifted
                    const finalMoved = Math.abs(dragOffset) > width * 0.12;
                    if (finalMoved) {
                        goTo(index + (dragOffset < 0 ? 1 : -1));
                    } else {
                        goTo(index);
                    }
                    momentumFrame = null;
                    startAutoRotate();
                }
            }

            // Start momentum if there is any residual velocity
            if (Math.abs(velocity) > 1) {
                runMomentum();
            } else {
                // No momentum, just snap back
                goTo(index);
                startAutoRotate();
            }
        }

        slidesWrap.addEventListener('pointerdown', onPointerDown);
        slidesWrap.addEventListener('pointermove', onPointerMove);
        slidesWrap.addEventListener('pointerup', onPointerUp);
        slidesWrap.addEventListener('pointercancel', onPointerUp);

        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);

        // touch: pause on touchstart, resume on touchend
        carousel.addEventListener('touchstart', stopAutoRotate, { passive: true });
        carousel.addEventListener('touchend', startAutoRotate, { passive: true });

        // start autoplay
        startAutoRotate();
    }

    // =============================================
    // FAQ ACCORDION
    // =============================================
    function initFAQAccordion() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length === 0) return;

        faqItems.forEach(item => {
            const summary = item.querySelector('summary');
            const details = item;
            
            // Prevent multiple details elements from being open simultaneously
            summary.addEventListener('click', (e) => {
                // Prevent toggle if already opening/open (let native behavior handle it first)
                if (details.open) {
                    details.open = false;
                    e.preventDefault();
                } else {
                    // Close ALL other items in the grid before opening this one
                    const faqGrid = item.closest('.faq-grid');
                    if (faqGrid) {
                        faqGrid.querySelectorAll('.faq-item').forEach(other => {
                            if (other !== item) {
                                other.open = false;
                            }
                        });
                    }
                    // Small delay to ensure previous items are closed
                    setTimeout(() => {
                        details.open = true;
                    }, 0);
                    e.preventDefault();
                }
            });

            // Add smooth animation class when opening
            details.addEventListener('toggle', () => {
                if (details.open) {
                    details.classList.add('faq-open');
                    // Scroll into view with smooth behavior on mobile
                    if (window.innerWidth < 768) {
                        setTimeout(() => {
                            details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 100);
                    }
                } else {
                    details.classList.remove('faq-open');
                }
            });
        });
    }
})();




