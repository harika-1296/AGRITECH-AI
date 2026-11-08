# 🌱 AgriTech AI — From Harvest to Fair Return

### An Agentic AI-Powered Agricultural Market Intelligence & Farmer Decision-Support Platform

<p align="center">

**Your Harvest. Your Choice. Your Fair Return.**

*Helping farmers make informed selling decisions through AI-powered market intelligence, transparent earnings calculations, and multilingual assistance.*

</p>

---

## 🚀 About the Project

**AgriTech AI** is an AI-powered agricultural decision-support platform designed to help Indian farmers make smarter, more informed decisions about selling their agricultural produce.

Farmers often struggle to identify the most profitable market for their harvest. A market offering the highest selling price does not necessarily provide the highest actual earnings after transportation, loading, commission, and other expenses.

AgriTech AI addresses this challenge by bringing market comparison, logistics analysis, earnings calculation, storage intelligence, and AI-powered recommendations together in one platform.

Instead of simply showing farmers market prices, AgriTech AI helps them understand **how much they could actually earn and which selling option may be financially better.**

Our initial demonstration focuses on tomato farmers in Telangana, with an architecture designed for future expansion to other crops and regions.

---

## 🎯 Problem Statement

Indian farmers face several challenges when deciding where and when to sell their harvest:

- Limited access to consolidated agricultural market information.
- Difficulty comparing prices across different markets.
- High transportation and handling expenses.
- Lack of clarity about actual net earnings.
- Limited access to understandable digital advisory services.
- Language barriers when using technology.
- Uncertainty when deciding whether to sell immediately or store produce for later.

These challenges can result in farmers making selling decisions without having a complete picture of their potential returns.

## 💡 Our Solution

AgriTech AI provides an intelligent decision-support system that helps farmers:

1. Explore agricultural market opportunities.
2. Compare crop prices across different markets.
3. Estimate transportation and other selling expenses.
4. Calculate expected net earnings.
5. Explore storage and future-selling scenarios.
6. Receive explainable AI-powered recommendations.
7. Interact through multilingual text and voice assistance.

**Our central innovation:** We focus on net earnings rather than simply the highest market price.

---

## ⭐ Key Features

### 1. Farmer Dashboard
- Personalized farmer dashboard.
- Crop and harvest overview.
- Market intelligence highlights.
- Estimated earnings.
- Selling decision overview.

### 2. Agri Mitra — Multilingual AI Voice Assistant
- Interactive conversational interface.
- Text-based farmer queries.
- Browser-based speech recognition where supported.
- Spoken responses using speech synthesis.
- Telugu, Hindi, and English language options.

### 3. Agentic AI Orchestration

AgriTech AI uses five specialized AI-agent modules that coordinate through a shared decision context.

| AI Agent | Responsibility |
|---|---|
| Farmer Context Agent | Understands farmer details, location, crop, quantity, and preferences. |
| Market Intelligence Agent | Compares available market prices and identifies opportunities. |
| Logistics Intelligence Agent | Evaluates transportation and other logistical expenses. |
| Storage Intelligence Agent | Analyzes storage options and future-selling scenarios. |
| Decision Intelligence Agent | Combines agent outputs and generates explainable recommendations. |

The agents follow a coordinated decision-making workflow rather than operating as isolated informational modules.

### 4. Market Intelligence
- Multiple agricultural market comparisons.
- Market-wise crop prices.
- Distance and estimated transportation expenses.
- Market filtering and sorting.
- Price trend visualization.
- Market suitability comparison.

### 5. Net Earnings Calculator

The central financial decision-support feature.

**Calculation methodology:**

Gross Revenue = Quantity × Selling Price

Total Expenses = Transportation + Loading + Commission + Other Expenses

**Estimated Net Earnings = Gross Revenue − Total Expenses**

Farmers can compare multiple markets and identify which option offers the highest estimated net return.

### 6. Storage Intelligence
- Explore storage opportunities.
- Compare selling immediately versus storing and selling later.
- Evaluate estimated storage and transportation expenses.
- Compare different future-price scenarios.
- Understand risks associated with delayed selling.

### 7. AI Recommendation Centre
- Personalized selling recommendations.
- Transparent financial calculations.
- Explanation of why an option is recommended.
- Alternative market comparisons.
- Risk and data-completeness indicators.

### 8. Farmer Profile & Settings
- Farmer profile information.
- Location and crop preferences.
- Language preferences.
- Personalized demonstration experience.

---

## 🔄 How AgriTech AI Works

The platform follows an end-to-end agricultural decision-support workflow:

```text
       FARMER INPUT
            |
            v
    FARMER CONTEXT AGENT
            |
            v
   MARKET INTELLIGENCE AGENT
            |
            v
   LOGISTICS INTELLIGENCE AGENT
            |
            v
    STORAGE INTELLIGENCE AGENT
            |
            v
   DECISION INTELLIGENCE AGENT
            |
            v
    NET EARNINGS COMPARISON
            |
            v
    EXPLAINABLE AI ADVISORY
            |
            v
       FARMER DECISION
```

The farmer remains in control of the final selling decision.

AgriTech AI provides recommendations and decision support. It does not automatically sell produce, initiate payments, or commit farmers to transactions.

---

## 🧮 What Makes AgriTech AI Different?

Consider a farmer with 50 quintals of tomatoes.

The following illustrative figures demonstrate why the highest listed market price does not always mean the highest net earnings.

| Particulars | Market A | Market B | Market C |
|---|---:|---:|---:|
| Price per quintal | ₹2,000 | ₹1,950 | ₹1,900 |
| Gross Revenue | ₹1,00,000 | ₹97,500 | ₹95,000 |
| Transportation | ₹3,000 | ₹1,000 | ₹500 |
| Other Expenses | ₹1,000 | ₹750 | ₹500 |
| **Net Earnings** | **₹96,000** | **₹95,750** | **₹94,000** |

These are illustrative demonstration values, not verified live market prices.

The example demonstrates how transportation and other expenses can change the financial attractiveness of a market.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS, CSS |
| Icons | Lucide |
| Data Visualization | Recharts |
| Development Environment | Visual Studio Code |
| Version Control | Git and GitHub |
| Deployment | Vercel |
| Voice Interaction | Browser Speech Recognition and Speech Synthesis |

### AI Architecture

The application uses modular agent-oriented components, shared decision context, structured data exchange, and an explainable recommendation workflow.

The architecture is designed to support future integration with external AI models and agricultural data services.

---

## 🏗️ Project Structure

```text
AGRITECH-AI/
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── components/
│   │   ├── Logo.tsx
│   │   ├── Sidebar.tsx
│   │   └── ui.tsx
│   │
│   ├── lib/
│   │   ├── agents.ts
│   │   ├── appContext.tsx
│   │   ├── calc.ts
│   │   ├── demoData.ts
│   │   ├── format.ts
│   │   ├── i18n.ts
│   │   ├── types.ts
│   │   └── voice.ts
│   │
│   ├── pages/
│   │   ├── AgentOrchestrationPage.tsx
│   │   ├── CalculatorPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── MarketIntelligencePage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── RecommendationPage.tsx
│   │   ├── StorageIntelligencePage.tsx
│   │   └── VoiceAssistantPage.tsx
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## ⚙️ Installation & Setup

Follow these steps to run AgriTech AI locally.

### Prerequisites

- Node.js (compatible with the project's dependencies).
- npm.
- Git.
- Visual Studio Code (recommended).

### Step 1: Clone the Repository

```bash
git clone https://github.com/harika-1296/AGRITECH-AI.git
```

### Step 2: Navigate to the Project Directory

```bash
cd AGRITECH-AI
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Development Server

```bash
npm run dev
```

### Step 5: Open in Your Browser

Open the localhost URL displayed in your terminal.

### Step 6: Create a Production Build

```bash
npm run build
```

---

## 🌍 Initial Pilot & Target Users

**Initial pilot region:** Telangana, India.

**Initial demonstration crop:** Tomatoes.

**Primary users:** Farmers who need accessible information to compare agricultural selling opportunities and estimate their potential returns.

**Supported language options:** Telugu, Hindi, and English.

The architecture is intended to be extensible to additional crops, markets, and geographical regions.

---

## 📊 Data Sources & Future Integrations

The platform identifies the following potential data sources and integration opportunities:

| Source | Potential Application |
|---|---|
| AGMARKNET | Agricultural market price information |
| data.gov.in | Public agricultural datasets |
| e-NAM | Electronic agricultural market information |
| OpenStreetMap | Geographic and location information |
| Routing Services | Distance and transportation estimation |
| WDRA | Warehousing and storage-related information |

**Data transparency:** Demonstration market prices, storage records, and calculations may use simulated data. The prototype does not claim live integration with the above services unless an integration is explicitly implemented and verified.

---

## 🔒 Responsible AI & Farmer-Centric Design

AgriTech AI is designed around transparency, accessibility, and farmer autonomy.

- Recommendations are accompanied by understandable explanations.
- Financial calculations are visible and traceable.
- Simulated data is distinguished from verified information.
- Future market prices are treated as uncertain.
- Confidence indicators should reflect data completeness and freshness.
- Farmers retain complete control over their decisions.
- The system does not automatically execute financial or selling transactions.

---

## 🚧 Future Roadmap

Our vision is to evolve AgriTech AI from a demonstration prototype into a practical agricultural decision-support ecosystem.

Planned development opportunities include:

- Integration with verified live agricultural market data.
- Expansion to multiple crops and Indian states.
- Real-time location and route intelligence.
- Verified storage facility discovery.
- Advanced multilingual AI models.
- More robust voice-based interaction.
- Weather-aware agricultural decision support.
- Personalized farmer advisory.
- Improved agent orchestration and explainability.
- Field testing and farmer feedback.

These are future development opportunities and should not be confused with currently implemented functionality.

---

## 👥 Team VYRON

**Project:** AgriTech AI — From Harvest to Fair Return

**Hackathon:** TECH4BHARAT 2026

**Institution:** Marri Laxman Reddy Institute of Technology and Management (MLRITM), Hyderabad, Telangana.

**Team Name:** VYRON

---

## 💚 Our Vision

We believe that farmers deserve more than just market prices.

They deserve accessible information, transparent calculations, and intelligent tools that help them make informed decisions about their hard-earned harvest.

AgriTech AI aims to bridge the gap between agricultural market information and practical farmer decision-making.

**We don't just help farmers find a market. We help them understand their potential return.**

---

<p align="center">

### 🌱 AgriTech AI

**From Harvest to Fair Return.**

*Built with purpose by Team VYRON.*

</p>

