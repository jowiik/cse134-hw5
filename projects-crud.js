/**
 * projects-crud.js
 * Handles Create, Update, Delete operations for projects in localStorage.
 * Works with the same storage key as projects-page.js.
 */

// Same storage key as projects-page.js
const STORAGE_KEY = 'portfolio-projects-local';

// DOM Elements
const form = document.getElementById('crud-form');
const statusEl = document.getElementById('crud-status');
const projectListEl = document.getElementById('crud-project-list');
const btnCreate = document.getElementById('btn-create');
const btnUpdate = document.getElementById('btn-update');
const btnDelete = document.getElementById('btn-delete');

/**
 * Load projects array from localStorage
 * @returns {Array} Array of project objects
 */
function loadProjectsFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * Save projects array to localStorage
 * @param {Array} projects - Array of project objects
 */
function saveProjectsToStorage(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

/**
 * Find index of a project by its id
 * @param {Array} projects - Array of project objects
 * @param {string} id - Project id to find
 * @returns {number} Index of project, or -1 if not found
 */
function findProjectIndexById(projects, id) {
  return projects.findIndex(p => p.id === id);
}

/**
 * Get form field values as an object
 * @returns {Object} Project object from form values
 */
function getFormValues() {
  return {
    id: document.getElementById('project-id').value.trim(),
    title: document.getElementById('project-title').value.trim(),
    image: document.getElementById('project-image').value.trim(),
    alt: document.getElementById('project-alt').value.trim(),
    desc: document.getElementById('project-desc').value.trim(),
    link: document.getElementById('project-link').value.trim(),
    tags: document.getElementById('project-tags').value.trim()
  };
}

/**
 * Clear all form fields
 */
function clearForm() {
  form.reset();
}

/**
 * Show a status message
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', or 'info'
 */
function showStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = 'crud-status';
  if (type === 'success') {
    statusEl.classList.add('crud-status-success');
  } else if (type === 'error') {
    statusEl.classList.add('crud-status-error');
  }
}

/**
 * Render the list of projects currently in localStorage
 */
function renderProjectList() {
  const projects = loadProjectsFromStorage();
  
  if (projects.length === 0) {
    projectListEl.innerHTML = '<li class="crud-empty">No projects in localStorage. Use "Load Remote" on the Projects page first, or create a new project.</li>';
    return;
  }

  projectListEl.innerHTML = projects.map(p => `
    <li class="crud-project-item">
      <strong>${p.title || '(no title)'}</strong>
      <code>${p.id}</code>
      ${p.tags ? `<span class="crud-project-tags">${p.tags}</span>` : ''}
    </li>
  `).join('');
}

/**
 * CREATE: Add a new project to localStorage
 */
function createProject() {
  const values = getFormValues();
  
  if (!values.id) {
    showStatus('ID is required.', 'error');
    return;
  }

  const projects = loadProjectsFromStorage();
  const existingIndex = findProjectIndexById(projects, values.id);

  if (existingIndex !== -1) {
    showStatus(`A project with ID "${values.id}" already exists. Use Update instead.`, 'error');
    return;
  }

  projects.push(values);
  saveProjectsToStorage(projects);
  
  showStatus(`Created project "${values.id}". Go to Projects page and click "Load Local" to see it.`, 'success');
  clearForm();
  renderProjectList();
}

/**
 * UPDATE: Modify an existing project in localStorage
 */
function updateProject() {
  const values = getFormValues();
  
  if (!values.id) {
    showStatus('ID is required to update a project.', 'error');
    return;
  }

  const projects = loadProjectsFromStorage();
  const index = findProjectIndexById(projects, values.id);

  if (index === -1) {
    showStatus(`No project found with ID "${values.id}".`, 'error');
    return;
  }

  // Update all fields (overwrite with form values)
  projects[index] = values;
  saveProjectsToStorage(projects);
  
  showStatus(`Updated project "${values.id}". Go to Projects page and click "Load Local" to see changes.`, 'success');
  renderProjectList();
}

/**
 * DELETE: Remove a project from localStorage
 */
function deleteProject() {
  const id = document.getElementById('project-id').value.trim();
  
  if (!id) {
    showStatus('ID is required to delete a project.', 'error');
    return;
  }

  const projects = loadProjectsFromStorage();
  const index = findProjectIndexById(projects, id);

  if (index === -1) {
    showStatus(`No project found with ID "${id}".`, 'error');
    return;
  }

  const deletedTitle = projects[index].title || id;
  projects.splice(index, 1);
  saveProjectsToStorage(projects);
  
  showStatus(`Deleted project "${deletedTitle}". Go to Projects page and click "Load Local" to confirm.`, 'success');
  clearForm();
  renderProjectList();
}

// Event Listeners
if (btnCreate) {
  btnCreate.addEventListener('click', createProject);
}

if (btnUpdate) {
  btnUpdate.addEventListener('click', updateProject);
}

if (btnDelete) {
  btnDelete.addEventListener('click', deleteProject);
}

// Initial render of project list
renderProjectList();

