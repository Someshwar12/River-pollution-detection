<div align="center">

# River Pollution Detection & Monitoring System

### *AI-assisted river pollution analysis using image segmentation, water-quality data, and temporal modeling*

<p>
  <img src="https://img.shields.io/badge/Status-Academic%20Prototype-1f883d?style=for-the-badge" alt="Status">
  <img src="https://img.shields.io/badge/U--Net-Image%20Segmentation-0969da?style=for-the-badge" alt="U-Net">
  <img src="https://img.shields.io/badge/LSTM-Time--Series-8250df?style=for-the-badge" alt="LSTM">
  <img src="https://img.shields.io/badge/MERN%20%2B%20Python-Full%20Stack-f0821f?style=for-the-badge" alt="Stack">
  <img src="https://img.shields.io/badge/License-MIT-6e7781?style=for-the-badge" alt="MIT License">
</p>

<p>
  <strong>RiverWatch AI</strong> is an end-to-end academic prototype that combines
  computer vision, environmental measurements, and temporal modeling in a
  single web-based analysis platform.
</p>

<p>
  <a href="https://github.com/Someshwar12/River-pollution-detection">Repository</a>
</p>

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [What the System Does](#what-the-system-does)
4. [System Architecture](#system-architecture)
5. [Analysis Pipeline](#analysis-pipeline)
6. [Computer Vision Pipeline](#computer-vision-pipeline)
7. [Water-Quality Analysis](#water-quality-analysis)
8. [Time-Series Analysis](#time-series-analysis)
9. [Web Application](#web-application)
10. [Technology Stack](#technology-stack)
11. [Repository Structure](#repository-structure)
12. [Input Data](#input-data)
13. [Running the Project](#running-the-project)
14. [Results & Observations](#results--observations)
15. [Limitations](#limitations)
16. [Research Context](#research-context)
17. [Future Improvements](#future-improvements)
18. [License](#license)

---

# Overview

River pollution is a multidimensional environmental problem. A useful monitoring system cannot rely on a single signal: visible pollution in imagery, water-quality measurements, and temporal changes can provide different pieces of evidence.

This project explores an integrated approach by combining:

- **Drone/aerial river imagery**
- **Image segmentation using U-Net**
- **Water-quality measurements**
- **Pollution classification**
- **Time-series analysis using LSTM**
- **A full-stack web interface for visualization and analysis**

The system is designed as an academic prototype rather than a certified environmental monitoring instrument. Its purpose is to demonstrate how computer vision, environmental data analysis, deep learning, and web engineering can be brought together into one end-to-end application.

<table>
<tr>
<td width="20%" align="center"><strong>Computer Vision</strong><br><sub>U-Net Segmentation</sub></td>
<td width="20%" align="center"><strong>Deep Learning</strong><br><sub>TensorFlow / Keras</sub></td>
<td width="20%" align="center"><strong>Time-Series</strong><br><sub>LSTM Modeling</sub></td>
<td width="20%" align="center"><strong>Full Stack</strong><br><sub>React + Node + Express</sub></td>
<td width="20%" align="center"><strong>Data Layer</strong><br><sub>MongoDB + Python</sub></td>
</tr>
</table>

---

# Problem Statement

Traditional water-quality assessment often depends on physical sampling and laboratory measurements. These methods provide valuable information but can be expensive, spatially limited, and difficult to use continuously over large areas.

At the same time, aerial imagery can reveal visible surface characteristics such as:

- floating vegetation,
- discolored water,
- visible contamination patterns,
- concentrated regions of interest,
- changes in surface appearance.

However, imagery alone does not provide a complete picture of water quality.

The project therefore investigates a combined pipeline:

```text
                    River Environment
                           │
             ┌─────────────┴─────────────┐
             │                           │
             ▼                           ▼
      Aerial / River Images       Environmental Data
             │                           │
             ▼                           ▼
       U-Net Segmentation        Statistical Analysis
             │                           │
             └─────────────┬─────────────┘
                           ▼
                  Pollution Analysis
                           │
                           ▼
                    Temporal Modeling
                         (LSTM)
                           │
                           ▼
                 Web-based Visualization
```

---

# What the System Does

The application brings several analysis components into a single workflow.

> **Interface at a glance:** the current prototype includes a dark-themed RiverWatch AI dashboard with dedicated views for image upload, analysis results, water-quality parameters, segmentation overlays, analytics, recent samples, environmental impact assessment, and administrative export tools.



| Component | Purpose |
|---|---|
| Image ingestion | Accept river imagery for analysis |
| Image segmentation | Identify spatial regions of interest using U-Net |
| Pollution classification | Estimate a pollution category from analyzed inputs |
| Water-quality analysis | Present pH, temperature, turbidity, dissolved oxygen, TDS and conductivity |
| Environmental assessment | Summarize water-quality/ecosystem/compliance indicators |
| Time-series modeling | Analyze pollution-related temporal behavior using LSTM |
| Visualization | Present results through a browser-based interface |
| Reporting | Provide a consolidated analysis view |

The application is therefore not just an image-classification demo. It combines **visual**, **tabular**, and **temporal** signals.

---

# System Architecture

The current application follows a MERN + Python architecture.

```text
┌──────────────────────────────────────────────────────────────┐
│                         WEB CLIENT                           │
│                                                              │
│                     React.js Frontend                        │
│                                                              │
│  Upload / Analysis / Water Quality / Segmentation / Reports  │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               │ HTTP / API
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                         NODE SERVER                          │
│                                                              │
│                    Node.js + Express.js                       │
│                                                              │
│  Routes → Controllers → Services → Database / AI Service     │
└───────────────┬──────────────────────────────┬───────────────┘
                │                              │
                │                              │
                ▼                              ▼
┌──────────────────────────────┐      ┌────────────────────────┐
│       MongoDB Database       │      │     Python AI Service  │
│                              │      │                        │
│  Application / analysis data │      │  U-Net                │
│  and system records          │      │  LSTM                 │
│                              │      │  Image processing      │
└──────────────────────────────┘      │  ML inference          │
                                      └────────────────────────┘
```

### Main application layers

**Frontend**

React is responsible for the interactive user interface and presentation of analysis results.

**Backend**

Node.js and Express.js provide the application API, request handling, services, routes, and communication with the database and AI service.

**AI service**

The Python service contains the machine-learning and computer-vision components.

**Database**

MongoDB is used for application data and persistent system records.

---

# Analysis Pipeline

The project can be understood as five major stages:

```text
1. Acquire Data
       │
       ▼
2. Preprocess
       │
       ├──────────────► Images
       │                  │
       │                  ▼
       │               U-Net
       │                  │
       │                  ▼
       │             Segmentation
       │
       └──────────────► Water-quality data
                          │
                          ▼
                     Statistical /
                     threshold analysis
                          │
                          ▼
3. Pollution Analysis
       │
       ├──────────────► Visual evidence
       ├──────────────► Water-quality evidence
       └──────────────► Temporal evidence
                          │
                          ▼
4. LSTM Time-Series Analysis
       │
       ▼
5. Web Visualization & Reporting
```

The three analytical directions are complementary:

```text
                 ┌──────────────────┐
                 │  Visual Analysis  │
                 │      U-Net        │
                 └────────┬─────────┘
                          │
                          ▼
                    Spatial evidence

                 ┌──────────────────┐
                 │ Water Parameters │
                 │ pH / DO / etc.   │
                 └────────┬─────────┘
                          │
                          ▼
                    Quality evidence

                 ┌──────────────────┐
                 │ Temporal Analysis│
                 │      LSTM        │
                 └────────┬─────────┘
                          │
                          ▼
                    Trend evidence

                          │
                          ▼
                Integrated assessment
```

---

# Computer Vision Pipeline

## U-Net Image Segmentation

The project uses a **U-Net-based segmentation model** for pixel-level image analysis.

The objective of segmentation is different from ordinary image classification.

Instead of producing only:

```text
Image → "Polluted"
```

the segmentation pipeline attempts to produce a spatial mask:

```text
Input Image
     │
     ▼
  U-Net
     │
     ▼
Predicted Mask
     │
     ▼
Spatial regions of interest
```

The project includes visual comparisons between:

- input image,
- ground-truth mask,
- predicted mask.

These comparisons are important because a classification score alone does not reveal *where* the model is detecting a region.

## Segmentation visualization

The application also provides an overlay-style visualization in which detected regions are represented using a pollution legend:

```text
● High Pollution
● Moderate Pollution
● Clean Water
```

This allows the user to inspect the model output in the context of the original river image.

### Important interpretation

The segmentation results shown during development demonstrate the complete inference and visualization pipeline, but they should not be interpreted as proof of production-grade segmentation accuracy.

The supplied model outputs show visible differences between ground-truth masks and predicted masks in some examples. This is documented as a limitation rather than hidden behind the UI.

---

# Water-Quality Analysis

The application also works with structured environmental measurements.

The supplied dataset contains parameters including:

| Parameter | Example role |
|---|---|
| Temperature | Thermal condition |
| River Flow | Hydrological context |
| Rainfall | Environmental/weather context |
| Pollution | Pollution-related measurement |
| pH | Acidity/alkalinity |
| DO | Dissolved oxygen |
| Turbidity | Water clarity / suspended material indicator |
| Conductivity | Dissolved ionic content indicator |

The interface presents selected measurements as a dedicated **Water Quality Parameters** section.

Example values visible in the supplied application screenshots include:

```text
pH                 8.5
Temperature        19.3 °C
Turbidity          10.6 NTU
Dissolved Oxygen    3.9 mg/L
TDS                349.0 mg/L
Conductivity       320.7 µS/cm
```

These values are presented as application outputs from the analyzed record. They are not, by themselves, sufficient to establish that water is safe for human consumption.

---

# Environmental Impact Assessment

The web application contains an Environmental Impact Assessment section with three high-level indicators:

```text
┌──────────────────────┐
│ WATER QUALITY STATUS │
│                      │
│ Safe                 │
└──────────────────────┘

┌──────────────────────┐
│ ECOSYSTEM IMPACT     │
│                      │
│ Low                  │
└──────────────────────┘

┌──────────────────────┐
│ COMPLIANCE STATUS    │
│                      │
│ Meets Standards      │
└──────────────────────┘
```

The interface also provides recommended actions based on the analysis.

One displayed recommendation in the supplied interface is:

> Above average pollution levels detected

These labels are application-level interpretations and should be treated as **decision-support outputs**, not regulatory certification.

---

# Pollution Classification

The application includes a pollution classification component.

A supplied analysis screen shows:

```text
Pollution Classification

HIGH

Confidence: 77%
```

The purpose of this component is to provide a compact interpretation of the analyzed input.

The confidence value should be understood as the model/application's reported confidence, not as a guarantee that the environmental condition has been independently verified.

---

# Time-Series Analysis

## LSTM Model

The project also investigates temporal pollution behavior using an **LSTM (Long Short-Term Memory)** neural network.

The intended workflow is:

```text
Historical Pollution Data
          │
          ▼
    Sequence Creation
          │
          ▼
        LSTM
          │
          ▼
 Temporal Prediction
          │
          ▼
 Trend Visualization
```

The LSTM component is intended to capture temporal relationships that are difficult to represent using a single independent observation.

## Prediction visualization

The supplied `LSTM Prediction vs Actual` plot shows:

- an actual time-series curve,
- a predicted curve.

The example demonstrates that the model captures part of the broad temporal movement but also exhibits substantial deviation from the actual series.

This is an important result: the current LSTM implementation should be treated as an **experimental temporal modeling component**, not as a validated forecasting system.

---

# Web Application

The frontend brings the analytical components together into an interactive interface.

## Analysis Results

The supplied UI includes:

### Pollution Classification

Displays the predicted pollution category and confidence.

### Water Quality Parameters

Displays:

- pH
- temperature
- turbidity
- dissolved oxygen
- TDS
- conductivity

### Environmental Impact Assessment

Summarizes:

- water quality status,
- ecosystem impact,
- compliance status.

### Recommended Actions

Provides application-generated observations based on the analysis.

### AI Segmentation Analysis

Provides side-by-side:

```text
Original Image
       │
       ▼
AI Segmentation Overlay
```

along with a pollution-level legend.

### Reporting

The interface includes:

```text
Save Result
Export Report
```

allowing the analysis to be preserved or exported from the application.

---

# Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| AI service | Python |
| Image segmentation | U-Net |
| Time-series modeling | LSTM |
| Numerical/data processing | Python ML/data ecosystem |
| Image processing | Computer-vision pipeline |
| API communication | HTTP / REST-style application API |
| Version control | Git / GitHub |

The project intentionally separates the application layer from the Python-based AI layer.

```text
React
  │
  ▼
Node.js / Express
  │
  ├──────────────► MongoDB
  │
  └──────────────► Python AI Service
                         │
                         ├── U-Net
                         ├── LSTM
                         └── Image / data processing
```

---

# Repository Structure

The current project structure is organized into three major application areas:

```text
river-pollution-detection/
│
├── ai-service/
│   ├── data/
│   ├── models/
│   ├── saved_models/
│   ├── static/
│   ├── training_scripts/
│   ├── utils/
│   ├── app.py
│   ├── requirements.txt
│   └── .env
│
├── client/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── .gitignore
├── LICENSE
├── package.json
└── README.md
```

### Directory responsibilities

| Directory | Responsibility |
|---|---|
| `client/` | React frontend |
| `server/` | Node.js / Express backend |
| `ai-service/` | Python AI and ML pipeline |
| `ai-service/models/` | Model definitions |
| `ai-service/saved_models/` | Trained model artifacts |
| `ai-service/training_scripts/` | Training and experimentation scripts |
| `server/controllers/` | Request/controller logic |
| `server/services/` | Application/service-layer logic |
| `server/models/` | MongoDB data models |
| `server/routes/` | API routes |
| `client/src/` | Frontend source code |

Local runtime data such as MongoDB files, virtual environments, environment variables, generated segmentation outputs, dependencies, and uploaded runtime files should remain excluded through `.gitignore`.

---

# Input Data

The project works with two broad categories of input.

## 1. Environmental / tabular data

The supplied data includes fields such as:

```text
Temperature
River_Flow
Rainfall
Pollution
pH
DO
Turbidity
Conductivity
```

These variables provide numerical environmental context for pollution analysis.

## 2. River imagery

The project also contains aerial/drone-style river images.

Example image identifiers visible in the supplied dataset include:

```text
DJI_0043
DJI_0110
DJI_0143
DJI_0154
DJI_0183
DJI_0204
DJI_0249
DJI_0251
DJI_0254
DJI_0270
DJI_0363
DJI_0439
DJI_0497
DJI_0533
DJI_0536
```

These images form the visual component of the pollution-analysis pipeline.

---

# Running the Project

The repository contains separate frontend, backend, and Python AI environments.

## Prerequisites

Install:

- Node.js
- npm
- Python
- Git
- MongoDB

The exact package versions should be taken from the project's package manifests and Python requirements rather than assumed from this README.

---

## 1. Clone the repository

```bash
git clone https://github.com/Someshwar12/River-pollution-detection.git
cd River-pollution-detection
```

---

## 2. Install root dependencies

If the root `package.json` is configured to orchestrate the application:

```bash
npm install
```

---

## 3. Install client dependencies

```bash
cd client
npm install
```

---

## 4. Install server dependencies

```bash
cd ../server
npm install
```

---

## 5. Create the Python environment

From the AI service directory:

```bash
cd ../ai-service

python -m venv venv
```

### Windows

```powershell
venv\Scripts\Activate.ps1
```

### Linux/macOS

```bash
source venv/bin/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

---

## 6. Configure environment variables

Create local `.env` files where required by the application.

Do not commit:

```text
.env
server/.env
ai-service/.env
client/.env
```

Use an `.env.example` file for documenting required configuration variables without exposing secrets.

---

## 7. Start the AI service

From:

```text
ai-service/
```

run the Python application according to the entry point configured in `app.py`.

For example:

```bash
python app.py
```

---

## 8. Start the backend

From:

```text
server/
```

run the configured development server, for example:

```bash
npm run dev
```

or use the script defined in `server/package.json`.

---

## 9. Start the frontend

From:

```text
client/
```

run:

```bash
npm run dev
```

The exact local URL is determined by the Vite configuration.

---

# Results & Observations

The project demonstrates several different levels of output.

## Visual segmentation

The U-Net pipeline successfully produces predicted masks that can be visualized alongside the input image.

However, the supplied prediction examples show differences from the corresponding ground-truth masks. This indicates that segmentation quality remains an area for further improvement.

## Pollution classification

The application can produce a pollution category together with a confidence value.

One supplied example reports:

```text
HIGH
Confidence: 77%
```

This demonstrates the end-to-end classification interface, but a single prediction should not be treated as sufficient environmental evidence.

## Water-quality analysis

The application successfully integrates multiple environmental measurements into one analysis screen.

This provides a more structured view than relying only on an image model.

## Temporal modeling

The LSTM component produces a predicted temporal series and visualizes it against the actual series.

The supplied plot shows that the prediction follows the general direction of the signal in some regions but does not closely reproduce the full variability of the observed series.

This suggests that the temporal component requires further experimentation before being considered a reliable forecasting model.

---

# Limitations

A central goal of the project is to distinguish between **demonstrating a complete system** and **claiming that every model is production-ready**.

## 1. Segmentation quality

The supplied U-Net predictions do not consistently match the ground-truth masks.

Potential areas for improvement include:

- better data preprocessing,
- stronger augmentation,
- class balancing,
- improved annotation quality,
- architecture experimentation,
- hyperparameter tuning,
- more systematic evaluation using IoU/Dice metrics.

## 2. LSTM prediction quality

The supplied LSTM plot shows a noticeable gap between actual and predicted values.

The current model should therefore be considered experimental rather than a validated forecasting solution.

Future evaluation should include explicit metrics such as:

- MAE
- RMSE
- MAPE where appropriate
- R²
- baseline comparison

## 3. Environmental interpretation

Water-quality status and compliance labels depend on the rules and thresholds implemented by the application.

They should not be interpreted as official environmental certification or laboratory validation.

## 4. Visual ambiguity

Aerial imagery can contain visual patterns that are not necessarily caused by pollution.

For example:

- vegetation,
- reflections,
- shadows,
- lighting,
- water movement,
- suspended sediment

can produce visually similar patterns.

## 5. Limited real-world validation

The project is an academic prototype. Its outputs have not been presented here as a replacement for:

- laboratory water testing,
- regulatory environmental monitoring,
- field instrumentation,
- professional ecological assessment.

---

# Future Improvements

The project provides several natural directions for further development.

## Computer Vision

- Improve U-Net segmentation accuracy
- Add IoU and Dice evaluation
- Experiment with U-Net variants
- Improve image augmentation
- Handle class imbalance
- Evaluate on a separate unseen test set
- Add uncertainty estimation

## Time-Series Modeling

- Establish persistence/seasonal baselines
- Tune sequence length
- Compare LSTM with GRU and tree-based models
- Add lag and rolling features
- Perform proper temporal train/validation/test splitting
- Evaluate multi-step forecasting
- Quantify prediction uncertainty

## Environmental Intelligence

- Integrate geospatial information
- Add weather and rainfall history
- Correlate visual observations with measured parameters
- Add anomaly detection
- Build location-based pollution trends
- Integrate sensor/IoT data

## MLOps / Engineering

- Containerize the AI service
- Add automated testing
- Add model versioning
- Track experiments
- Add model monitoring
- Add structured API documentation
- Implement CI/CD
- Add reproducible training pipelines

## Product

- Improve dashboard interaction
- Add historical analysis
- Add map-based visualization
- Add downloadable technical reports
- Add user roles and access control
- Improve explainability of model outputs

---

# Research Context

This project was developed as an academic AI/Data Science project focused on applying machine learning to environmental monitoring.

The work brings together multiple areas:

```text
Computer Vision
      +
Deep Learning
      +
Time-Series Modeling
      +
Environmental Data Analysis
      +
Full-Stack Development
```

The project has also been documented in research-oriented academic work, including publication of the associated Zeta project separately as part of the user's academic portfolio. The two projects should be treated as distinct systems rather than conflated implementations.

---

# Engineering Philosophy

The project follows several practical principles.

### 1. Show the complete pipeline

The goal is not only to train a neural network.

```text
Data
 ↓
Processing
 ↓
Model
 ↓
Inference
 ↓
API
 ↓
Frontend
 ↓
Human-readable result
```

### 2. Make model output inspectable

Where possible, the application exposes visual and numerical evidence instead of presenting only a final label.

### 3. Separate AI from application logic

The Python AI service is separated from the Node.js application backend.

This makes the model layer independently replaceable.

### 4. Be explicit about limitations

Model demonstrations are not automatically equivalent to validated real-world performance.

The current README therefore documents the observed limitations instead of presenting the system as more accurate than the supplied evidence supports.

---

# Project Status

## Academic Prototype

The project currently demonstrates an integrated pipeline containing:

- [x] River image processing
- [x] U-Net segmentation pipeline
- [x] Segmentation visualization
- [x] Pollution classification interface
- [x] Water-quality parameter analysis
- [x] Environmental impact assessment interface
- [x] LSTM time-series component
- [x] React frontend
- [x] Node.js / Express backend
- [x] MongoDB integration
- [x] Python AI service
- [x] Analysis result visualization
- [x] Result saving/export interface

The current implementation should be viewed as an **academic end-to-end prototype**. Model performance, environmental thresholds, and real-world deployment requirements require additional validation before operational use.

---

# License

This project is licensed under the **MIT License**.

See [`LICENSE`](LICENSE) for the complete license text.

---

<div align="center">

### River Pollution Detection & Monitoring System

**Computer Vision · Deep Learning · Environmental Data · Full-Stack AI**

Built as an academic project by **Someshwar Pratap Singh**

</div>
