# Collins Spanish Audio Companion 🔉

An interactive web application providing audio pronunciations for the **Collins Easy Learning Spanish Dictionary**. This companion tool enhances vocabulary learning with instant audio playback for every Spanish word in the dictionary. Built with React, TypeScript, and designed for seamless audio playback on both desktop and mobile devices.


## ✨ Features

- **📚 Comprehensive Word List**: Browse over 3,600 Spanish words organized alphabetically
- **🔊 Audio Playback**: One-click audio pronunciation for every word
- **🔍 Smart Fuzzy Search**: Real-time search with accent-insensitive matching
- **🎯 Quick Navigation**: Jump to any letter instantly with the A-Z navigation overlay
- **📱 Mobile-Optimized**: Responsive design with touch-friendly controls and optimized keyboard behavior

## 🚀 Demo

Visit the live demo: [Coming Soon]

## 📸 Screenshots

### Desktop View
- Full alphabet navigation
- Search functionality
- Word list with audio playback

### Mobile View
- Optimized layout for small screens
- Slide-in alphabet navigation
- Fixed search bar with keyboard-aware behavior

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) with TypeScript
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio Management**: HTML5 Audio API with React Context
- **Version Control**: Git with [Git LFS](https://git-lfs.github.com/) for audio files

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) (v1.0 or higher)
- [Git LFS](https://git-lfs.github.com/) (for audio files)
- Node.js (v18 or higher) - optional, as Bun is the primary runtime

## 🏃 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:maeve-du/collins-spanish-audio-companion.git
cd collins-spanish-audio-companion
```

### 2. Install Git LFS and Pull Audio Files

```bash
# Install Git LFS (if not already installed)
# macOS
brew install git-lfs

# Windows
# Download from https://git-lfs.github.com/

# Linux
sudo apt-get install git-lfs

# Initialize Git LFS
git lfs install

# Pull the audio files
git lfs pull
```

### 3. Install Dependencies

```bash
bun install
```

### 4. Start Development Server

```bash
bun run dev
```

The app will be available at `http://localhost:5173`

## 📦 Building for Production

```bash
bun run build
```

The production-ready files will be in the `dist/` directory.

### Preview Production Build

```bash
bun run preview
```

## 🗂️ Project Structure

```
es-dict-audio-app/
├── public/
│   ├── audio/                      # Audio files organized by letter
│   │   ├── words starting with the letter a/
│   │   ├── words starting with the letter b/
│   │   └── ...
│   ├── words.json                  # Word data
│   └── Spanish-icon.png
├── src/
│   ├── components/                 # React components
│   │   ├── AlphabetNav.tsx        # A-Z navigation overlay
│   │   ├── AlphabetSection.tsx    # Letter section renderer
│   │   ├── SearchBar.tsx          # Search input & controls
│   │   ├── WordItem.tsx           # Individual word display
│   │   └── WordList.tsx           # Main word list container
│   ├── contexts/
│   │   └── AudioPlayerContext.tsx # Global audio state management
│   ├── hooks/
│   │   └── useWords.ts            # Word data loading hook
│   ├── lib/
│   │   ├── audio-config.ts        # Audio URL configuration
│   │   ├── search.ts              # Fuzzy search algorithm
│   │   ├── utils.ts               # Utility functions
│   │   └── words.ts               # Word processing utilities
│   ├── App.tsx                     # Main app component
│   ├── main.tsx                    # App entry point
│   └── index.css                   # Global styles
├── .gitattributes                  # Git LFS configuration
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🎵 Audio Files

This project uses **Git LFS** (Large File Storage) to manage the 3,600+ MP3 audio files efficiently. 

### Audio File Structure

Audio files are organized by the first letter of each word:
```
public/audio/
├── words starting with the letter a/
│   ├── abajo.mp3
│   ├── abierto.mp3
│   └── ...
├── words starting with the letter b/
│   ├── bailar.mp3
│   └── ...
└── ...
```

### Working with Audio Files

- **First-time setup**: Run `git lfs pull` after cloning
- **Adding new audio files**: They will automatically be tracked by Git LFS
- **Checking LFS status**: Run `git lfs ls-files` to see all tracked files

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
# Optional: Custom audio base URL for cloud deployment
VITE_AUDIO_BASE_URL=https://your-cdn.com/audio
```

If not set, the app defaults to `/audio` for local files.

## 🎨 Customization

### Styling

The app uses Tailwind CSS v4 with a custom theme. Main color scheme:
- Background: Warm cream (`#FFF8EB`)
- Primary: Custom accent color
- Components: shadcn/ui with custom variants

Modify `src/index.css` for theme adjustments.

### Adding New Words

1. Add MP3 files to the appropriate `public/audio/words starting with the letter X/` folder
2. Update `public/words.json` with the new entries:
```json
{
  "word": "nuevo",
  "translation": "new"
}
```

## 🧪 Testing

```bash
# Run linter
bun run lint

# Type checking
bunx tsc --noEmit
```

## 📱 Mobile Optimizations

The app includes several mobile-specific optimizations:

- **Viewport Height Management**: Fixed height to prevent layout shifts when the keyboard opens
- **Body Scroll Lock**: Prevents background scrolling when search is active
- **Touch-Optimized Navigation**: Large tap targets and smooth animations
- **Keyboard Hints**: `enterKeyHint="search"` for better UX

## 🐛 Known Issues

- Audio files require Git LFS - ensure it's installed before cloning
- First load may take longer due to the large word list (3,600+ words)
- Safari on iOS may require user interaction before first audio playback (autoplay policy)


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



---


[@maeve-du](https://github.com/maeve-du)


**Built with ❤️ for Spanish language learners**
