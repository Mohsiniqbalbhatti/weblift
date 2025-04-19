import React from "react";

const QuickGuide = () => {
  return (
    <div className="  pt-5  text-light">
      <h1 className="mb-4 mt-5">🧭 Quick Guide to Using Our Platform</h1>

      <section className="mb-5">
        <h3>🚀 Deploying Static Sites</h3>
        <p>
          You can deploy your static sites in <strong>two ways</strong>:
        </p>

        <h5>1. 📁 File Drop Zone Deployment</h5>
        <ul>
          <li>Select a folder using the file drop zone.</li>
          <li>
            The folder must contain <code>index.html</code> at the root level.
          </li>
          <li>Include other files like CSS, JS, assets, etc.</li>
          <li>
            The system will validate contents, ask for a site name, and check
            availability.
          </li>
          <li>
            If valid, the site is deployed and a <strong>live view link</strong>{" "}
            is generated.
          </li>
          <li>
            The site appears in your <strong>dashboard</strong>.
          </li>
        </ul>

        <h5>2. 🧑‍💻 GitHub Repository Deployment</h5>
        <ul>
          <li>
            Go to <strong>Create New Project</strong> &gt;{" "}
            <strong>GitHub Repo</strong>.
          </li>
          <li>If not logged in, authenticate with GitHub.</li>
          <li>
            Select a repo, enter project name, and provide build command (e.g.,{" "}
            <code>npm run build</code>).
          </li>
          <li>
            After creation, you'll be redirected to the project page with a{" "}
            <strong>Trigger Deployment</strong> button.
          </li>
          <li>
            Trigger deployment, monitor real-time logs, and view build status.
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h3>🖥️ Dashboard Functionalities</h3>
        <h5>✅ Project List</h5>
        <p>
          Shows all your deployed projects with name, type, owner, and
          timestamps.
        </p>

        <h5>🔍 Project Search</h5>
        <p>
          Use <strong>Search Sites</strong> input to filter projects by name.
        </p>

        <h5>👥 Join a Team</h5>
        <ul>
          <li>
            Click <strong>Join Team</strong> to open the invite modal.
          </li>
          <li>
            Enter invite code to join as a <strong>Visitor</strong>.
          </li>
          <li>Ask admin to upgrade your role to Editor or Admin.</li>
        </ul>
      </section>

      <section className="mb-5">
        <h3>📦 Deployment Log Viewer</h3>
        <ul>
          <li>
            Visit any project's <strong>Deployment tab</strong>.
          </li>
          <li>Click a deployment to view real-time logs.</li>
          <li>
            Status shows <strong>Success</strong> or fetch errors.
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h3>⚙️ Permissions</h3>
        <ul>
          <li>
            <strong>Admins</strong> can edit project metadata and manage team
            roles.
          </li>
        </ul>
      </section>

      <section className="mb-5">
        <h3>🌐 Supported Static Frameworks</h3>
        <ul>
          <li>
            <strong>React.js:</strong> <code>npm run build</code> →{" "}
            <code>/build</code>
          </li>
          <li>
            <strong>Next.js:</strong> <code>next export</code> →{" "}
            <code>/out</code>
          </li>
          <li>
            <strong>Astro:</strong> <code>npm run build</code> or{" "}
            <code>astro build</code> → <code>/dist</code>
          </li>
          <li>
            <strong>Vue.js:</strong> <code>npm run build</code> →{" "}
            <code>/dist</code>
          </li>
          <li>
            <strong>SvelteKit:</strong> Static adapter →{" "}
            <code>npm run build</code>
          </li>
        </ul>
        <p>
          <strong>Note:</strong> Backend routes/SSR are not supported — only
          static front-end content.
        </p>
      </section>

      <section className="mb-5">
        <h3>📁 GitHub Deployment Folder Structure Requirement</h3>
        <pre>
          <code>{`my-app/
├── public/
├── src/
├── package.json
└── ...`}</code>
        </pre>
        <ul>
          <li>
            Must contain <code>package.json</code> in the root.
          </li>
          <li>
            Build command should run from root and generate static output.
          </li>
          <li>
            Output must include <code>index.html</code>.
          </li>
        </ul>
        <p>
          <strong>Common Issue:</strong> Deployment fails if actual code is in
          nested folders like <code>/frontend/</code>.
        </p>
        <p>
          <strong>Solution:</strong> Restructure project or configure custom
          working directory.
        </p>
      </section>
    </div>
  );
};

export default QuickGuide;
