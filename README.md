# Aquatic Animal Welfare Tracker 🐟🦐🐙

An AI-powered tool that aggregates public data on aquatic animal farming practices, maps current welfare standards coverage by species and country, identifies gaps where no welfare standard exists, and produces structured reports highlighting the highest-impact intervention targets.

## 🎯 The Problem

Aquatic animals—fish, crustaceans, and cephalopods—are the most numerically farmed animals on earth with over **100+ billion** individuals slaughtered annually. Despite growing scientific consensus on their capacity for pain and suffering (sentience), they are systematically excluded from most welfare frameworks, certification schemes, and advocacy databases.

## 🚀 The Solution

This tool addresses the aquatic welfare data gap by providing:
1. **Comprehensive Data Aggregation**: Compiling fragmented data on species production, scientific evidence of sentience, and regulatory landscapes.
2. **Global Welfare Mapping**: Visualizing the state of aquatic welfare legislation and certification around the world.
3. **AI-Powered Gap Analysis**: Calculating priority scores based on a multi-factor algorithm (Production Scale, Sentience Evidence, Standards Gap, Regulatory Gap, Feasibility) to pinpoint where intervention will have the greatest impact.
4. **Structured Report Generation**: Automatically generating detailed markdown reports based on species type, region, or production system to assist advocates and policy makers.

## 💻 Technology Stack

*   **Frontend**: Next.js 14+ (App Router), React, Vanilla CSS with custom glassmorphic Dark Mode design system.
*   **Backend**: Next.js API Routes.
*   **AI/ML**: Custom multi-factor scoring algorithm for gap analysis, heuristic clustering for priority alignment, and AI narrative generation for reporting.
*   **Visualizations**: Recharts (bar, pie, radar charts), React-Leaflet (interactive map), React-Markdown.

## 📂 Data Sources

The data compiled in this application is based on the latest available sources (2022-2024):
*   **Production**: FAO FishStatJ 2024, SOFIA Report 2024.
*   **Welfare Standards**: Direct analyses of ASC, BAP, GlobalGAP, RSPCA Assured, Naturland, and EU Organic certification standards.
*   **Sentience**: Academic literature (e.g., LSE Review of Sentience in Cephalopod Molluscs and Decapod Crustaceans).

## 🛠️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd aquatic-welfare-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## 🧠 AI/ML Approach

The core logic of the tracker is built around the **Welfare Gap Score**, a composite score ranging from 0 to 1, calculated using:
* `P_score` (Production Scale): Normalized by maximum species production volume.
* `S_score` (Sentience Evidence): Weighted indicator based on the strength of scientific evidence.
* `C_score` (Standards Gap): `$1 - \text{Percentage covered by certification}$`.
* `R_score` (Regulatory Gap): Lack of legal framework in top 5 producing countries.
* `F_score` (Feasibility): Assessed based on existing technology and farming techniques.

The algorithm dynamically re-evaluates priorities when filters (like "Crustaceans only") are applied, ensuring real-time responsive analytics.

## 🔗 Disclaimer

*This is a prototype built for the OpenPaws Project test. Data points provided in the `src/data` directory are simulated combinations of real-world reports and approximated metrics for demonstration purposes.*
