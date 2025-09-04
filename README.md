# Autonomous Vehicle QKD Simulation

A real-time 3D simulation of Quantum Key Distribution (QKD) between autonomous vehicles, built with React, TypeScript, and Three.js.

## Features

- **3D Vehicle Simulation**: Interactive 3D scene with moving autonomous vehicles
- **QKD Protocol Visualization**: Step-by-step demonstration of quantum key distribution
- **Eavesdropper Detection**: Toggle Eve (eavesdropper) to see how QKD detects security breaches
- **Real-time Analysis**: Integration with Google's Gemini AI for quantum security insights
- **Modern UI**: Responsive design with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key (optional, for AI analysis features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd qkd-vehicle-simulation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp env.example .env
   # Edit .env and add your Gemini API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Visit `http://localhost:3000`

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Add environment variables** in Vercel dashboard:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key

### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your Git repository

3. **Add environment variables** in Netlify dashboard:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key

### Manual Hosting

Build the project and serve the `dist` folder:

```bash
npm run build
npm run preview
```

## How It Works

### Quantum Key Distribution (QKD)

1. **Photon Transmission**: Alice (Vehicle 1) sends polarized photons to Bob (Vehicle 2)
2. **Basis Comparison**: Vehicles publicly compare measurement bases
3. **Key Sifting**: Only bits measured with matching bases are kept
4. **Error Detection**: Statistical analysis detects eavesdropping attempts

### Eavesdropper Detection

When Eve intercepts photons:
- She must guess the correct basis for measurement
- Incorrect guesses introduce errors in the key
- High error rates (>10%) indicate eavesdropping

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Three.js** - 3D graphics
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide React** - Icons

## API Integration

The simulation integrates with Google's Gemini AI for real-time analysis of QKD events. Set the `VITE_GEMINI_API_KEY` environment variable to enable this feature.

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
