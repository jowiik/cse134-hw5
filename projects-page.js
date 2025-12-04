/**
 * projects-page.js
 * Handles loading project data from localStorage (local) or My JSON Server (remote)
 * and dynamically populating <project-card> elements.
 */

// Remote URL for My JSON Server
// TODO: Replace YOUR_GITHUB_USERNAME with your actual GitHub username
const REMOTE_URL =
  'https://my-json-server.typicode.com/JosephDKim/portfolio-api/remoteProjects';

// Fallback data for testing (used if remote fetch fails)
const FALLBACK_PROJECTS = [
  {
    id: 'sea-otter-savvy',
    title: 'Sea Otter Savvy (Blueprint)',
    image: 'seaottersavvy-icon.jpg',
    alt: 'Sea Otter Savvy app map screen',
    desc: 'Cross-platform wildlife conservation app built with React Native + Expo, featuring GIS overlays and real-time mapping.',
    link: 'https://medium.com/@ucsdcblueprint/sea-otter-savvy',
    tags: 'React Native, TypeScript, Firebase'
  },
  {
    id: 'concard',
    title: 'Concard — Business Card Editor',
    image: 'concard-icon.png',
    alt: 'Screenshot of the Concard business card editor',
    desc: 'In-browser business card editor supporting PNG/JPEG/JSON export and a customizable design canvas.',
    link: 'https://cse110-sp25-group29.github.io/cse110-sp25-group29/source/assets/homepage.html',
    tags: 'HTML/CSS/JS'
  },
  {
    id: 'spotify-mc',
    title: 'Spotify MC',
    image: 'spotify-icon.jpeg',
    alt: 'Spotify logo icon',
    desc: 'Python tool that uses the Spotify Web API and text-to-speech to announce currently playing tracks.',
    link: 'https://github.com/JosephDKim/spotify-mc',
    tags: 'Python, Spotify API'
  }
];

// localStorage key
const STORAGE_KEY = 'portfolio-projects-local';

/**
 * Renders an array of project objects as <project-card> elements
 * @param {Array} projectArray - Array of project objects
 */
function renderProjects(projectArray) {
  const list = document.getElementById('projects-list');
  if (!list) return;

  list.innerHTML = '';

  projectArray.forEach(project => {
    const card = document.createElement('project-card');
    card.dataset.title = project.title;
    card.dataset.image = project.image;
    card.dataset.alt = project.alt || project.title;
    card.dataset.desc = project.desc;
    card.dataset.link = project.link;
    card.dataset.linkLabel = 'View Project';
    if (project.tags) {
      card.dataset.tags = project.tags;
    }
    list.appendChild(card);
  });
}

// Load Local button event listener
// Only reads from localStorage - won't work if cache is cleared
const loadLocalBtn = document.getElementById('load-local-btn');
if (loadLocalBtn) {
  loadLocalBtn.addEventListener('click', () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // No data in localStorage
      return;
    }
    const projects = JSON.parse(stored);
    renderProjects(projects);
  });
}

// Load Remote button event listener
// Fetches from My JSON Server and saves to localStorage
const loadRemoteBtn = document.getElementById('load-remote-btn');
if (loadRemoteBtn) {
  loadRemoteBtn.addEventListener('click', async () => {
    let projectsToUse;

    try {
      const res = await fetch(REMOTE_URL);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const remoteProjects = await res.json();

      // Map remote data to the shape expected by renderProjects
      projectsToUse = remoteProjects.map(p => ({
        id: p.id,
        title: p.title,
        image: p.image,
        alt: p.title,
        desc: p.desc,
        link: p.link,
        tags: p.tags || ''
      }));
    } catch (err) {
      // Use fallback data if fetch fails
      console.error('Remote fetch failed, using fallback data:', err);
      projectsToUse = FALLBACK_PROJECTS;
    }

    // Save to localStorage so Load Local can use it later
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsToUse));

    // Render the cards
    renderProjects(projectsToUse);
  });
}
