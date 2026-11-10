/**
 * seed-dynamodb.mjs
 * Seeds the buyology-products DynamoDB table with all products.
 * Run with: node scripts/seed-dynamodb.mjs
 */

import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" });

const products = [
  // ── EXISTING 15 ──────────────────────────────────────────────────────────
  {
    id: "prod-001", name: "Sony WH-1000XM5", slug: "sony-wh-1000xm5",
    currentPrice: 279.99, budgetThreshold: 300.00, reviewScore: 4.8,
    stockLevel: "high", priceTrend: "down", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 350.00 }, { date: "2024-06-01", price: 310.00 }, { date: "2025-01-01", price: 279.99 }],
    alternatives: ["prod-002", "prod-003"]
  },
  {
    id: "prod-002", name: "Apple AirPods Pro (2nd Gen)", slug: "apple-airpods-pro-2nd-gen",
    currentPrice: 229.99, budgetThreshold: 250.00, reviewScore: 4.7,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 249.00 }, { date: "2024-06-01", price: 229.99 }],
    alternatives: ["prod-001", "prod-003"]
  },
  {
    id: "prod-003", name: "Bose QuietComfort 45", slug: "bose-quietcomfort-45",
    currentPrice: 249.00, budgetThreshold: 260.00, reviewScore: 4.5,
    stockLevel: "low", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 279.00 }, { date: "2024-06-01", price: 249.00 }],
    alternatives: ["prod-001", "prod-002"]
  },
  {
    id: "prod-004", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24",
    currentPrice: 799.99, budgetThreshold: 850.00, reviewScore: 4.6,
    stockLevel: "high", priceTrend: "down", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 899.99 }, { date: "2024-06-01", price: 849.99 }, { date: "2025-01-01", price: 799.99 }],
    alternatives: ["prod-005", "prod-006"]
  },
  {
    id: "prod-005", name: "Apple iPhone 15", slug: "apple-iphone-15",
    currentPrice: 899.00, budgetThreshold: 900.00, reviewScore: 4.7,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 929.00 }, { date: "2024-06-01", price: 899.00 }],
    alternatives: ["prod-004", "prod-006"]
  },
  {
    id: "prod-006", name: "Google Pixel 8", slug: "google-pixel-8",
    currentPrice: 599.00, budgetThreshold: 650.00, reviewScore: 4.4,
    stockLevel: "high", priceTrend: "down", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 699.00 }, { date: "2024-06-01", price: 649.00 }, { date: "2025-01-01", price: 599.00 }],
    alternatives: ["prod-004", "prod-005"]
  },
  {
    id: "prod-007", name: "Anker PowerCore 26800", slug: "anker-powercore-26800",
    currentPrice: 49.99, budgetThreshold: 60.00, reviewScore: 4.3,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 59.99 }, { date: "2024-06-01", price: 49.99 }],
    alternatives: ["prod-008"]
  },
  {
    id: "prod-008", name: "Belkin BoostCharge Pro", slug: "belkin-boostcharge-pro",
    currentPrice: 79.99, budgetThreshold: 80.00, reviewScore: 4.2,
    stockLevel: "low", priceTrend: "up", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 69.99 }, { date: "2024-06-01", price: 74.99 }, { date: "2025-01-01", price: 79.99 }],
    alternatives: ["prod-007"]
  },
  {
    id: "prod-009", name: "Generic BrandX Earbuds", slug: "generic-brandx-earbuds",
    currentPrice: 19.99, budgetThreshold: 30.00, reviewScore: 1.8,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 24.99 }, { date: "2024-06-01", price: 19.99 }],
    alternatives: ["prod-002", "prod-010"]
  },
  {
    id: "prod-010", name: "Sony SRS-XB23 Speaker", slug: "sony-srs-xb23",
    currentPrice: 89.99, budgetThreshold: 100.00, reviewScore: 4.3,
    stockLevel: "out", priceTrend: "flat", discontinued: true, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 99.99 }, { date: "2024-06-01", price: 89.99 }],
    alternatives: ["prod-011"]
  },
  {
    id: "prod-011", name: "FakeAudioPro Headphones", slug: "fakeaudiopro-headphones",
    currentPrice: 39.99, budgetThreshold: 50.00, reviewScore: 3.9,
    stockLevel: "high", priceTrend: "up", discontinued: false, suspectedCounterfeit: true,
    priceHistory: [{ date: "2024-01-01", price: 34.99 }, { date: "2024-06-01", price: 39.99 }],
    alternatives: ["prod-001", "prod-002"]
  },
  {
    id: "prod-012", name: "Logitech MX Master 3S", slug: "logitech-mx-master-3s",
    currentPrice: 89.99, budgetThreshold: 100.00, reviewScore: 4.9,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 99.99 }, { date: "2024-06-01", price: 89.99 }],
    alternatives: ["prod-007", "prod-008"]
  },
  {
    id: "prod-013", name: "Charlotte Tilbury Moisturiser", slug: "charlotte-tilbury-moisturiser",
    currentPrice: 45.00, budgetThreshold: 50.00, reviewScore: 4.6,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 55.00 }, { date: "2025-01-01", price: 45.00 }],
    alternatives: ["prod-014", "prod-015"]
  },
  {
    id: "prod-014", name: "Fenty Beauty Foundation", slug: "fenty-beauty-foundation",
    currentPrice: 38.00, budgetThreshold: 40.00, reviewScore: 4.4,
    stockLevel: "high", priceTrend: "flat", discontinued: true, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 40.00 }, { date: "2025-01-01", price: 38.00 }],
    alternatives: ["prod-013", "prod-015"]
  },
  {
    id: "prod-015", name: "NARS Lipstick", slug: "nars-lipstick",
    currentPrice: 32.00, budgetThreshold: 28.00, reviewScore: 3.8,
    stockLevel: "high", priceTrend: "unknown", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-06-01", price: 32.00 }],
    alternatives: ["prod-013", "prod-014"]
  },

  // ── 15 NEW PRODUCTS ───────────────────────────────────────────────────────
  {
    id: "prod-016", name: "Samsung Galaxy Watch 6", slug: "samsung-galaxy-watch-6",
    currentPrice: 269.99, budgetThreshold: 300.00, reviewScore: 4.4,
    stockLevel: "high", priceTrend: "down", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 329.99 }, { date: "2024-06-01", price: 299.99 }, { date: "2025-01-01", price: 269.99 }],
    alternatives: ["prod-017", "prod-018"]
  },
  {
    id: "prod-017", name: "Apple Watch Series 9", slug: "apple-watch-series-9",
    currentPrice: 399.00, budgetThreshold: 400.00, reviewScore: 4.8,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 429.00 }, { date: "2024-06-01", price: 399.00 }],
    alternatives: ["prod-016", "prod-018"]
  },
  {
    id: "prod-018", name: "Fitbit Charge 6", slug: "fitbit-charge-6",
    currentPrice: 139.95, budgetThreshold: 150.00, reviewScore: 4.1,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 159.95 }, { date: "2024-06-01", price: 139.95 }],
    alternatives: ["prod-016", "prod-017"]
  },
  {
    id: "prod-019", name: "iPad Air (M2)", slug: "ipad-air-m2",
    currentPrice: 599.00, budgetThreshold: 620.00, reviewScore: 4.8,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 649.00 }, { date: "2025-01-01", price: 599.00 }],
    alternatives: ["prod-020", "prod-004"]
  },
  {
    id: "prod-020", name: "Samsung Galaxy Tab S9", slug: "samsung-galaxy-tab-s9",
    currentPrice: 699.99, budgetThreshold: 700.00, reviewScore: 4.5,
    stockLevel: "low", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 799.99 }, { date: "2025-01-01", price: 699.99 }],
    alternatives: ["prod-019"]
  },
  {
    id: "prod-021", name: "Dyson V15 Detect", slug: "dyson-v15-detect",
    currentPrice: 649.99, budgetThreshold: 650.00, reviewScore: 4.7,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 699.99 }, { date: "2025-01-01", price: 649.99 }],
    alternatives: ["prod-022"]
  },
  {
    id: "prod-022", name: "Shark IZ462H Cordless", slug: "shark-iz462h-cordless",
    currentPrice: 279.99, budgetThreshold: 300.00, reviewScore: 4.3,
    stockLevel: "high", priceTrend: "down", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 329.99 }, { date: "2025-01-01", price: 279.99 }],
    alternatives: ["prod-021"]
  },
  {
    id: "prod-023", name: "The Ordinary Niacinamide 10%", slug: "the-ordinary-niacinamide",
    currentPrice: 7.90, budgetThreshold: 10.00, reviewScore: 4.5,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 7.90 }],
    alternatives: ["prod-024", "prod-025"]
  },
  {
    id: "prod-024", name: "CeraVe Moisturising Cream", slug: "cerave-moisturising-cream",
    currentPrice: 16.99, budgetThreshold: 20.00, reviewScore: 4.8,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 18.99 }, { date: "2025-01-01", price: 16.99 }],
    alternatives: ["prod-023", "prod-025"]
  },
  {
    id: "prod-025", name: "Neutrogena Hydro Boost", slug: "neutrogena-hydro-boost",
    currentPrice: 19.97, budgetThreshold: 22.00, reviewScore: 4.4,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 21.97 }, { date: "2025-01-01", price: 19.97 }],
    alternatives: ["prod-023", "prod-024"]
  },
  {
    id: "prod-026", name: "Maybelline Fit Me Foundation", slug: "maybelline-fit-me-foundation",
    currentPrice: 8.98, budgetThreshold: 12.00, reviewScore: 4.2,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 9.98 }, { date: "2025-01-01", price: 8.98 }],
    alternatives: ["prod-014", "prod-027"]
  },
  {
    id: "prod-027", name: "MAC Studio Fix Powder", slug: "mac-studio-fix-powder",
    currentPrice: 33.00, budgetThreshold: 35.00, reviewScore: 4.6,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 35.00 }, { date: "2025-01-01", price: 33.00 }],
    alternatives: ["prod-026", "prod-014"]
  },
  {
    id: "prod-028", name: "Kindle Paperwhite (2024)", slug: "kindle-paperwhite-2024",
    currentPrice: 139.99, budgetThreshold: 150.00, reviewScore: 4.7,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-06-01", price: 149.99 }, { date: "2025-01-01", price: 139.99 }],
    alternatives: ["prod-029"]
  },
  {
    id: "prod-029", name: "Kobo Libra Colour", slug: "kobo-libra-colour",
    currentPrice: 169.99, budgetThreshold: 170.00, reviewScore: 4.5,
    stockLevel: "high", priceTrend: "flat", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-06-01", price: 179.99 }, { date: "2025-01-01", price: 169.99 }],
    alternatives: ["prod-028"]
  },
  {
    id: "prod-030", name: "LG C3 OLED 55\"", slug: "lg-c3-oled-55",
    currentPrice: 1199.99, budgetThreshold: 1300.00, reviewScore: 4.9,
    stockLevel: "high", priceTrend: "down", discontinued: false, suspectedCounterfeit: false,
    priceHistory: [{ date: "2024-01-01", price: 1799.99 }, { date: "2024-06-01", price: 1399.99 }, { date: "2025-01-01", price: 1199.99 }],
    alternatives: ["prod-004", "prod-019"]
  }
];

async function seed() {
  let succeeded = 0;
  let failed = 0;

  for (const product of products) {
    try {
      await client.send(new PutItemCommand({
        TableName: "buyology-products",
        Item: marshall(product, { removeUndefinedValues: true })
      }));
      console.log(`✓ ${product.id} — ${product.name}`);
      succeeded++;
    } catch (err) {
      console.error(`✗ ${product.id} — ${product.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. ${succeeded} seeded, ${failed} failed.`);
}

seed();
