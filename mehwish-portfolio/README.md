# 🚀 Mehwish Batool — Personal Portfolio

> **"Building modern web & app experiences"**  
> A sleek, fully responsive personal portfolio built with React + Vite — featuring a live CV generator, filterable project gallery, animated UI, and a password-protected admin panel.

---

## 📸 Preview

| Section | Description |
|--------|-------------|
| **Hero** | Animated stats counter, floating profile card, social links, CV download |
| **About** | Bio, info grid, career timeline |
| **Projects** | Filterable gallery by category (Web, Mobile, AI, Systems) |
| **Skills** | Tech grouped by Frontend, Backend, Mobile, AI & Systems |
| **Contact** | Contact form + social links |
| **Admin Panel** | Password-protected panel to update info and manage projects |

---

## ✨ Features

- **Fully Responsive** — Optimized for all screen sizes including mobile, tablet, and desktop
- **Animated Hero Section** — Live stats counter with scroll-reveal animations
- **CV Generator** — One-click downloadable CV with profile photo, skills, timeline, and contact info rendered as print-ready HTML
- **Project Gallery** — Filter projects by category with smooth transitions
- **Skills Section** — Tech stack displayed in grouped, color-coded cards
- **Admin Panel** — Secure, password-protected dashboard to:
  - Edit personal info (name, tagline, university, bio, links, etc.)
  - Add, edit, and delete projects in real time
  - Changes persist via `localStorage`
- **Scroll-to-Top Button** — Appears after scrolling, smooth return to top
- **Dark Theme** — Professional dark UI with vibrant accent colors

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, JavaScript (ES6+), HTML5, CSS3 |
| **Styling** | Inline CSS-in-JS, Google Fonts (Syne, Inter) |
| **State** | React Hooks (`useState`, `useEffect`, `useRef`) |
| **Storage** | `localStorage` for persistent project/info data |
| **CV Export** | Dynamic HTML generation with Base64 embedded photo |
| **Build Tool** | Vite 5 |

---

## 📁 Project Structure

```
my-portfolio/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx          # Main application — all components in one file
│   ├── App.css          # Global styles
│   ├── index.css        # Base/reset styles
│   └── main.jsx         # React entry point
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

> All React components (`Nav`, `Hero`, `About`, `Projects`, `Skills`, `Contact`, `Footer`, `AdminPanel`) live in `src/App.jsx` as a single-file architecture.

---

## ⚡ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ali-Hassan-edu/my-portfolio/my-portfolio.git

# 2. Navigate into the project directory
cd my-portfolio

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder, ready to deploy.

### Preview Production Build

```bash
npm run preview
```

---

## 🔐 Admin Panel

The portfolio includes a hidden admin panel for managing content without touching code.

**How to access:**
1. Scroll to the bottom of the page and click the **Admin** button (or navigate to `#admin`)
2. Enter the admin password: `ali2024`
3. Use the tabs to:
   - **Info** — Update your name, bio, tagline, university, contact links, and stats
   - **Projects** — Edit or delete existing projects
   - **Add Project** — Add a new project with title, category, year, description, color, icon, and link

> All changes are saved to `localStorage` and persist across browser sessions. To reset to defaults, clear site data in browser DevTools.

---

## 📄 CV Generator

Click **"Download CV"** in the hero section to generate a professionally formatted CV that includes:

- Profile photo (embedded)
- Name, tagline, university, and contact details
- Stats (years of experience, projects count, technologies)
- Profile summary / bio
- Education & experience timeline
- Technical skills grouped by category
- Availability status

The CV opens in a new browser tab as print-ready HTML. Use **Ctrl+P** (or **Cmd+P**) and select **"Save as PDF"** to export.

---

## 🎨 Customization

To personalize the portfolio, open `src/App.jsx` and update the following constants at the top of the file:

```js
const DEFAULT_INFO = {
  name: "Your Name",
  tagline: "Your tagline here",
  bio: "Your bio...",
  university: "Your University",
  location: "Your City, Country",
  email: "your@email.com",
  linkedin: "https://linkedin.com/in/yourprofile",
  github: "https://github.com/yourusername",
  available: true,
  yearsExp: 2,
  projectsCount: 14,
};
```

To change the **admin password**, update:

```js
const ADMIN_PASS = "your_new_password";
```

To replace the **profile photo**, replace the `PHOTO` constant at the top of `App.jsx` with a new Base64-encoded JPEG string.

---

## 🚀 Deployment

This project can be deployed to any static hosting platform:

| Platform | Command / Notes |
|----------|-----------------|
| **Vercel** | Connect GitHub repo, auto-detects Vite |
| **Netlify** | `npm run build` → deploy `dist/` folder |
| **GitHub Pages** | Use `vite-plugin-gh-pages` or manual deploy |
| **Firebase Hosting** | `firebase deploy` after `npm run build` |

---

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🤝 Contact

**Mehwish Batool**  
📧 [mehwishkhan2438@gmail.com](mailto:mehwishkhan2438@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/mehwish-batool-77029837b)  
💻 [GitHub](https://github.com/mehwish-batool)  
📍 Pakistan

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <strong>Mehwish Batool</strong> · COMSATS University, Vehari
</p>
