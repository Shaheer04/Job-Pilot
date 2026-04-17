// content.js
console.log("JobPilot Content Script Loaded. Refresh detected.");

let currentFloatingBtn = null;

// Listen for selection changes
document.addEventListener('mousedown', (e) => {
  // If clicking outside the floating button, remove it
  if (currentFloatingBtn && !currentFloatingBtn.contains(e.target)) {
    removeFloatingBtn();
  }
});

document.addEventListener('mouseup', (e) => {
  // Small delay to ensure selection is complete
  setTimeout(() => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const selectedText = selection.toString().trim();

    // Only show if we have text and no modal is currently open
    if (selectedText.length > 5 && !document.getElementById("jobpilot-modal-root")) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Ensure rect is valid (sometimes it's all zeros)
      if (rect.width === 0 || rect.height === 0) return;
      
      // Position button above the selection
      const x = rect.left + window.scrollX + (rect.width / 2);
      const y = rect.top + window.scrollY - 45;
      
      showFloatingBtn(x, y, selectedText);
    }
  }, 10);
});

function showFloatingBtn(x, y, text) {
  removeFloatingBtn();

  const btn = document.createElement('button');
  btn.className = 'jobpilot-floating-btn';
  // Use a span for the text to ensure it's styled correctly
  btn.innerHTML = `
    <img src="${chrome.runtime.getURL('logo.svg')}" style="width: 18px; height: 18px; vertical-align: middle;" />
    <span style="vertical-align: middle;">Send to JobPilot</span>
  `;
  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;
  btn.style.transform = 'translateX(-50%)';

  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Floating button clicked!");
    showExtractionModal(text, window.location.hostname);
    removeFloatingBtn();
  };

  document.body.appendChild(btn);
  currentFloatingBtn = btn;
}

function removeFloatingBtn() {
  if (currentFloatingBtn) {
    currentFloatingBtn.remove();
    currentFloatingBtn = null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("3. Content: Message received!", request.action);
  if (request.action === "CLIP_JOB") {
    const jobData = scrapeJobPage();
    sendResponse(jobData);
  } else if (request.action === "START_EXTRACTION") {
    console.log("4. Content: Starting Modal Show...");
    showExtractionModal(request.text, request.source);
    sendResponse({ status: "modal_triggered" });
  }
  return true;
});

async function showExtractionModal(rawText, source) {
  console.log("5. Content: Creating Modal Elements...");
  document.getElementById("jobpilot-modal-root")?.remove();

  const root = document.createElement("div");
  root.id = "jobpilot-modal-root";
  root.innerHTML = `
    <div class="jobpilot-modal-overlay" style="display: flex !important;">
      <div class="jobpilot-modal-card">
        <div class="jobpilot-modal-header">
          <h3>JobPilot Clipper</h3>
          <button id="jobpilot-close-btn">&times;</button>
        </div>
        <div id="jobpilot-modal-body">
          <div class="jobpilot-loading">AI is extracting details...</div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(root);
  console.log("6. Content: Modal appended to body.");

  document.getElementById("jobpilot-close-btn").onclick = () => {
    console.log("Modal closed by user.");
    root.remove();
  };

  requestExtraction(rawText, source);
}

function requestExtraction(rawText, source) {
  console.log("7. Content: Requesting AI extraction from background proxy...");
  chrome.runtime.sendMessage({
    action: "CALL_API",
    endpoint: "/api/ai/extract/",
    method: "POST",
    body: { description: rawText }
  }, (response) => {
    console.log("8. Content: Received proxy response:", response);
    if (response.success) {
      console.log("9. Content: Rendering Form...");
      renderModalForm(response.data, rawText, source);
    } else {
      console.warn("9. Content: Extraction Error or Auth needed:", response.error);
      if (response.error === "AUTH_REQUIRED" || response.error === "AUTH_EXPIRED") {
        renderLoginForm(rawText, source);
      } else {
        document.getElementById("jobpilot-modal-body").innerHTML = `
          <div class="jobpilot-error-msg">${response.error}</div>
          <button class="jobpilot-modal-btn" id="jobpilot-close-error">OK</button>
        `;
        document.getElementById("jobpilot-close-error").onclick = () => document.getElementById("jobpilot-modal-root").remove();
      }
    }
  });
}

function renderLoginForm(rawText, source) {
  const body = document.getElementById("jobpilot-modal-body");
  body.innerHTML = `
    <div class="jobpilot-form">
      <p style="font-size: 12px; color: #c0c1ff; margin-bottom: 12px; text-align: center;">Session expired. Please log in to continue.</p>
      <div id="jp-login-error" class="jobpilot-error-msg" style="display:none;"></div>
      <div class="jobpilot-field">
        <label>Username</label>
        <input type="text" id="jp-username" placeholder="Username">
      </div>
      <div class="jobpilot-field">
        <label>Password</label>
        <input type="password" id="jp-password" placeholder="••••••••">
      </div>
      <button class="jobpilot-modal-btn" id="jp-login-btn">Log In & Extract</button>
    </div>
  `;

  document.getElementById("jp-login-btn").onclick = () => {
    const username = document.getElementById("jp-username").value;
    const password = document.getElementById("jp-password").value;
    const btn = document.getElementById("jp-login-btn");
    const errorDiv = document.getElementById("jp-login-error");

    btn.disabled = true;
    btn.innerText = "Authenticating...";

    chrome.runtime.sendMessage({
      action: "LOGIN",
      body: { username, password }
    }, (response) => {
      if (response.success) {
        body.innerHTML = `<div class="jobpilot-loading">AI is extracting details...</div>`;
        requestExtraction(rawText, source);
      } else {
        errorDiv.innerText = response.error;
        errorDiv.style.display = "block";
        btn.disabled = false;
        btn.innerText = "Log In & Extract";
      }
    });
  };
}

function renderModalForm(details, description, source) {
  const body = document.getElementById("jobpilot-modal-body");
  body.innerHTML = `
    <div class="jobpilot-form">
      <div class="jobpilot-field">
        <label>Job Title</label>
        <input type="text" id="jp-title" value="${details.title || ''}">
      </div>
      <div class="jobpilot-field">
        <label>Company</label>
        <input type="text" id="jp-company" value="${details.company || ''}">
      </div>
      <div class="jobpilot-field">
        <label>Location</label>
        <input type="text" id="jp-location" value="${details.location || ''}">
      </div>
      <div class="jobpilot-grid">
        <div class="jobpilot-field">
          <label>Experience</label>
          <input type="text" id="jp-experience" value="${details.experience_required || ''}" placeholder="e.g. 2-3 years">
        </div>
        <div class="jobpilot-field">
          <label>Salary</label>
          <input type="text" id="jp-salary" value="${details.salary_range || ''}" placeholder="e.g. $80k">
        </div>
      </div>
      <div class="jobpilot-field">
        <label>Key Skills (comma separated)</label>
        <input type="text" id="jp-skills" value="${(details.key_skills || []).join(', ')}">
      </div>
      <button class="jobpilot-modal-btn" id="jp-save-btn">Add to Tracker</button>
    </div>
  `;

  document.getElementById("jp-save-btn").onclick = () => {
    const btn = document.getElementById("jp-save-btn");
    btn.disabled = true;
    btn.innerText = "Saving...";

    const skillsInput = document.getElementById("jp-skills").value;
    const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(s => s !== "");

    const jobData = {
      title: document.getElementById("jp-title").value,
      company: document.getElementById("jp-company").value,
      location: document.getElementById("jp-location").value,
      salary_range: document.getElementById("jp-salary").value,
      experience_required: document.getElementById("jp-experience").value,
      key_skills: skillsArray,
      description: description,
      source: source || details.source || "External",
      applied_date: new Date().toISOString().split('T')[0]
    };

    chrome.runtime.sendMessage({
      action: "CALL_API",
      endpoint: "/api/jobs/",
      method: "POST",
      body: jobData
    }, (response) => {
      if (response.success) {
        btn.innerText = "Added!";
        btn.style.background = "#4caf50";
        setTimeout(() => document.getElementById("jobpilot-modal-root").remove(), 1500);
      } else {
        alert("Error: " + response.error);
        btn.disabled = false;
        btn.innerText = "Add to Tracker";
      }
    });
  };
}

function scrapeJobPage() {
  const url = window.location.href;
  let description = "";
  let title = "";
  let company = "";
  let location = "";

  if (url.includes("linkedin.com")) {
    title = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.innerText || 
            document.querySelector(".jobs-unified-top-card__job-title")?.innerText;
    company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.innerText ||
              document.querySelector(".jobs-unified-top-card__company-name")?.innerText;
    location = document.querySelector(".job-details-jobs-unified-top-card__bullet")?.innerText ||
               document.querySelector(".jobs-unified-top-card__bullet")?.innerText;
    description = document.querySelector(".jobs-description-content__text")?.innerText || 
                  document.querySelector("#job-details")?.innerText;

  } else if (url.includes("indeed.com")) {
    title = document.querySelector(".jobsearch-JobInfoHeader-title")?.innerText;
    company = document.querySelector("[data-company-name='true']")?.innerText;
    location = document.querySelector(".jobsearch-JobInfoHeader-subtitle div:last-child")?.innerText;
    description = document.querySelector("#jobDescriptionText")?.innerText;
  }

  return {
    title: title?.trim(),
    company: company?.trim(),
    location: location?.trim(),
    description: description?.trim(),
    url: url
  };
}
