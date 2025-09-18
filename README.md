# YouTube Video Generator

A comprehensive web application for automated YouTube video generation using AI-driven scripts, voiceovers, and visual content creation. Built with React, Vite, and TailwindCSS.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Fonts & Licensing](#fonts--licensing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Dual Generation Modes:** Generate videos by niche (AI finds topics) or by specific topic input
- **AI Video Generation:** Complete automated pipeline from script generation to final video output
- **Voice Selection:** Choose from a variety of AI-generated voices with detailed voice management
- **Video Kind Customization:** Define and manage different video types with custom generation and refinement prompts
- **Visual Style Configuration:** Manage different visual styles and image generation settings
- **AI Topic Finder:** Get AI-suggested trending topics for your niche with intelligent recommendations
- **Script Refinement:** Optional AI-powered script refinement for improved content quality
- **Cost Tracking:** Real-time cost monitoring with configurable pricing for different AI services
- **Token Configuration:** Manage API tokens for various AI services (OpenAI, Claude, ElevenLabs, etc.)
- **Dashboard:** Comprehensive view of all generated videos with status tracking and detailed information
- **Usage Analytics:** Visualize cost breakdowns and usage statistics across different services
- **Miscellaneous Cost Tracking:** Track additional costs beyond standard AI service fees

---

## Tech Stack

- **Frontend:** React 18, React Router DOM, Vite
- **Styling:** TailwindCSS 4.x, custom CSS, PostCSS
- **UI/UX:** Lucide React Icons, React Icons, responsive design
- **Forms & Validation:** Formik, Yup validation schemas
- **HTTP Requests:** Axios, Fetch API
- **Component Library:** React Select for enhanced dropdowns
- **Development:** ESLint, Vite dev server with HMR

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm (v8+ recommended)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Usage

1. **Generate a Video:**
   - Select generation mode: "Trigger by Niche" (AI finds topics) or "Trigger by Topic" (specific topic)
   - Enter niche or topic details based on selected mode
   - Choose video kind, duration (in minutes with decimal precision), and AI voice
   - Select visual style for image generation
   - Optionally add miscellaneous costs for accurate cost tracking
   - Enable script refinement for improved content quality
   - Submit to trigger the automated AI video generation pipeline

2. **Configure Services:**
   - **Token Configuration:** Set up API tokens for OpenAI, Claude, ElevenLabs, and other AI services
   - **Cost Configuration:** Define pricing for each service to track generation costs accurately
   - **Voice Management:** Browse and select from available AI voices with detailed information
   - **Video Kinds:** Create and manage video types with custom generation and refinement prompts
   - **Visual Styles:** Configure different image generation styles and settings

3. **Monitor Progress:**
   - View all generated videos in the dashboard table with real-time status updates
   - Click any video row to view detailed information, scripts, and download links
   - Use the refresh button to update video statuses and see newly completed generations
   - Track costs and usage analytics across different AI services

4. **AI-Powered Features:**
   - **Topic Finder:** Use AI to discover trending topics within your chosen niche
   - **Script Refinement:** Automatically improve generated scripts for better engagement
   - **Visual Content:** Generate appropriate images and visual content for your videos

---

## Project Structure

```
├── public/                # Static assets
├── src/
│   ├── assets/
│   │   ├── fonts/         # Roboto Condensed & Ruda fonts (OFL licensed)
│   │   └── styles/        # CSS files (index.css, media.css, normalize.css)
│   ├── components/        # Reusable React components
│   │   ├── VideoGenerationForm.jsx    # Main video generation form
│   │   ├── VideosTable.jsx           # Dashboard table for generated videos
│   │   ├── VoiceModal.jsx            # Voice selection modal
│   │   ├── VideoKindModal.jsx        # Video kind management modal
│   │   ├── ImageKindModal.jsx        # Visual style configuration modal
│   │   ├── TopicFinderModal.jsx      # AI topic suggestion modal
│   │   ├── InstructionsModal.jsx     # Help and instructions modal
│   │   ├── CostConfigSection.jsx     # Cost configuration component
│   │   ├── TokenConfiguration.jsx    # API token management
│   │   ├── UsageChart.jsx           # Usage analytics visualization
│   │   └── Modal.jsx                # Base modal component
│   ├── pages/             # Main application pages
│   │   ├── Dashboard.jsx             # Main dashboard page
│   │   └── VideoDetails.jsx         # Individual video details page
│   ├── App.jsx            # App entry point with routing
│   └── main.jsx           # ReactDOM entry point
├── .env                   # Environment variables (API base URL, etc.)
├── index.html             # Main HTML file
├── tailwind.config.js     # TailwindCSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite build configuration
├── .eslintrc.cjs         # ESLint configuration
├── package.json           # Project metadata & dependencies
└── README.md              # This documentation
```

---

## Fonts & Licensing

- **Roboto Condensed** and **Ruda** fonts are included under the [SIL Open Font License 1.1](https://openfontlicense.org/).
- See `src/assets/fonts/Roboto_Condensed,Ruda/Roboto_Condensed/OFL.txt` and `src/assets/fonts/Ruda/OFL.txt` for full license texts.

---

## Environment Setup

Create a `.env` file in the root directory with the following variable:

```env
VITE_BASE_URL=your_backend_api_url
```

Replace `your_backend_api_url` with the URL of your backend API server that handles the video generation pipeline.

---

## API Integration

This frontend application requires a backend API server that provides the following endpoints:

### Video Management
- `GET /runs_to_display` - Fetch all generated videos for dashboard
- `GET /run_to_display/{id}` - Fetch detailed information for a specific video
- `POST /run_flow` - Trigger video generation pipeline with parameters

### Configuration Endpoints
- `GET /default_values` - Fetch default form values and settings
- `GET /get-voices` - Fetch available AI voices
- `GET /get_video_kinds` - Fetch video kind configurations
- `GET /get_visual_styles` - Fetch visual style options
- `GET /video_models` - Fetch available video generation models

### Cost and Token Management
- `GET /get_prices` - Fetch current pricing configuration for AI services
- `POST /save_prices` - Save updated pricing configuration
- `GET /get_yt_token` - Fetch YouTube API token information
- `POST /update_yt_token` - Update YouTube refresh token

### Content Management
- `POST /save_video_kinds` - Save video kind configurations
- `POST /save_visual_styles` - Save visual style configurations
- `POST /upload_style_guide` - Upload style guide images
- `DELETE /delete_style_guide_image/{filename}` - Delete style guide images

### AI Features
- `GET /topic-finder` - Get AI-suggested topics for a given prompt
- `POST /{id}/regenerate_image` - Regenerate specific images for a video
- `POST /{id}/replace_image` - Replace an image in a video with a new one

---
