# Just Data

**[✨ Live Demo](https://www.justdata.cloud/)**

**Just Data** is a modern, intuitive analytics platform designed to bridge the gap between raw data and beautiful, actionable insights. By simplifying the process of creating dashboards, we empower users to visualize their data without the steep learning curve of complex BI tools.

## 🚀 Features

-   **Seamless Data Import**: Drag and drop your Excel files (.xlsx, .xls) to instantly parse and validate your datasets.
-   **Visual Dashboard Configurator**: A guided, step-by-step wizard to build your dashboard from scratch.
-   **Rich Visualization Library**:
    -   **Bar Charts**: Compare categories with ease (stacked, grouped options).
    -   **Line Charts**: Track trends over time.
    -   **Pie/Donut Charts**: Visualize proportions.
    -   **Scatter Plots**: Identify correlations and clusters.
    -   **Mixed Charts**: Combine different chart types for deeper analysis.
-   **Advanced Customization**: Fine-tune every aspect of your charts, including colors, legends, tooltips, and axes.
-   **Interactive Dashboards**: Resize and rearrange charts on a grid canvas to create the perfect layout.
-   **Dynamic Filtering**: Apply global filters (e.g., Date Ranges, Dropdowns) to interactively slice and dice data across all charts simultaneously.
-   **Smart Reporting**: Export your entire dashboard as a high-quality PDF report for effortless sharing.
-   **Dashboard Management**: Save, edit, and organize multiple dashboards in one place.

## 📸 Gallery

### 1. Dashboard List
![Dashboard List](screenshots/justdata%20-%20dashboards%20list.png)

### 2. Data Source Import
![Data Source](screenshots/justdata%20-%20datasource.png)

### 3. Visual Chart Builder
![Chart Builder](screenshots/justdata%20-%20chart%20builder.png)

### 4. Dynamic Filters
![Filters](screenshots/justdata%20-%20filters.png)

### 5. Interactive Dashboard View
![Dashboard View](screenshots/justdata%20-%20dashboard%20view.png)

## 🎯 Target Audience

Just Data is built for professionals who need quick, professional-grade visualizations:

-   **Data Analysts**: Spin up reports and visual prototypes rapidly.
-   **Startup Founders**: Track KPIs and metrics without investing in expensive enterprise infrastructure.
-   **Product Managers**: Monitor product health and user engagement metrics at a glance.

## 🛠️ Technical Overview

### Architecture
The platform is built as a highly responsive Single Page Application (SPA) using **React 18** and **Vite**. We prioritize performance and user experience, ensuring that even large datasets are handled smoothly.

**Core Stack:**
-   **Frontend Framework**: React
-   **Build Tool**: Vite (for lightning-fast HMR and bundling)
-   **Styling**: TailwindCSS (Utility-first CSS framework for bespoke design)
-   **Icons**: Lucide React
-   **Visualization Engine**: Apache ECharts (via `echarts-for-react`) - chosen for its performance and extensive configuration options.
-   **Routing**: React Router DOM
-   **Data Parsing**: `xlsx` library for robust Excel file handling.

### 💾 Data Persistence Strategy
To provide a seamless "cloud-like" experience without requiring a backend server for this version, we implement a robust **Local Storage Simulation**:

1.  **Dataset Storage**: When you upload an Excel file, the parsed JSON data is stored in the browser's `localStorage` with a unique ID.
2.  **References**: Dashboards store references (IDs) to these datasets rather than duplicating the data, mimicking a relational database structure.
3.  **Persistence**: All configurations, chart settings, and layouts are serialized and saved locally. This means you can refresh the page or close the browser, and your work will be waiting for you when you return (as long as you use the same browser).
