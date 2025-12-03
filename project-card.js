class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['data-title', 'data-image', 'data-alt', 'data-desc', 'data-link', 'data-link-label', 'data-tags'];
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('data-title') || 'Untitled Project';
    const image = this.getAttribute('data-image') || '';
    const alt = this.getAttribute('data-alt') || 'Project image';
    const desc = this.getAttribute('data-desc') || 'No description provided.';
    const link = this.getAttribute('data-link') || '';
    const linkLabel = this.getAttribute('data-link-label') || 'Learn more';
    const tags = this.getAttribute('data-tags') || '';

    const tagsList = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --card-bg: #fff;
          --card-border: 1px solid rgba(0,0,0,.1);
          --card-radius: 0.6rem;
          --card-padding: clamp(0.9rem, 0.6rem + 1vw, 1.25rem);
          --card-shadow: none;
          --card-gap: clamp(0.9rem, 0.6rem + 1vw, 1.25rem);
          --card-heading-color: #0b1220;
          --card-text-color: #0b1220;
          --card-muted-color: #5a6472;
          --card-link-color: #0a66c2;
          --media-bg: #f4f6f8;
          --media-radius: 0.45rem;
          --tag-border: 1px solid rgba(0,0,0,.18);
          --tag-radius: 0.35rem;
          --tag-padding: 0.25em 0.6em;
          --tag-size: 0.85rem;
        }

        * {
          box-sizing: border-box;
        }

        .card {
          display: flex;
          flex-direction: column;
          gap: var(--card-gap);
          background: var(--card-bg);
          border: var(--card-border);
          border-radius: var(--card-radius);
          padding: var(--card-padding);
          box-shadow: var(--card-shadow);
        }

        /* Desktop: horizontal layout */
        @media (min-width: 56rem) {
          .card {
            flex-direction: row;
            align-items: stretch;
          }
        }

        /* Image container */
        picture {
          display: block;
          margin: 0;
          border-radius: var(--media-radius);
          overflow: hidden;
          background: var(--media-bg);
          flex-shrink: 0;
        }

        /* Mobile: full width image */
        @media (max-width: 55.99rem) {
          picture {
            width: 100%;
          }
        }

        /* Desktop: fixed width image on left */
        @media (min-width: 56rem) {
          picture {
            width: min(22rem, 38%);
          }
        }

        img {
          width: 100%;
          height: auto;
          aspect-ratio: 16 / 10;
          object-fit: cover;
          display: block;
        }

        /* Content wrapper */
        .content {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          flex: 1;
          min-width: 0;
        }

        h2 {
          margin: 0;
          font-size: clamp(1.1rem, 1rem + 0.5vw, 1.45rem);
          color: var(--card-heading-color);
          font-family: inherit;
          line-height: 1.3;
        }

        .description {
          margin: 0;
          line-height: 1.65;
          color: var(--card-text-color);
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem 0.5rem;
          padding: 0;
          margin: 0;
          list-style: none;
        }

        .tags:empty {
          display: none;
        }

        .tags li {
          font-size: var(--tag-size);
          padding: var(--tag-padding);
          border: var(--tag-border);
          border-radius: var(--tag-radius);
          color: var(--card-muted-color);
        }

        .link {
          text-decoration: none;
          color: var(--card-link-color);
          font-weight: 700;
          display: inline-block;
          margin-top: auto;
        }

        .link:hover {
          text-decoration: underline;
        }

        .link:empty,
        .link[href=""] {
          display: none;
        }
      </style>

      <article class="card">
        ${image ? `
        <picture>
          <img src="${image}" alt="${alt}">
        </picture>
        ` : ''}
        <div class="content">
          <h2>${title}</h2>
          <p class="description">${desc}</p>
          ${tagsList.length > 0 ? `
          <ul class="tags">
            ${tagsList.map(tag => `<li>${tag}</li>`).join('')}
          </ul>
          ` : ''}
          ${link ? `<a class="link" href="${link}" target="_blank" rel="noopener noreferrer">${linkLabel}</a>` : ''}
        </div>
      </article>
    `;
  }
}

customElements.define('project-card', ProjectCard);
