// popup.js
const API_URL = "https://shaheer-ipynb-jobpilot-api.hf.space";

document.addEventListener("DOMContentLoaded", async () => {
  const loginView = document.getElementById("login-view");
  const mainView = document.getElementById("main-view");
  const loading = document.getElementById("loading");
  const jobDetails = document.getElementById("job-details");

  function showLogin() {
    loginView.classList.remove("hidden");
    mainView.classList.add("hidden");
  }

  function showMain() {
    loginView.classList.add("hidden");
    mainView.classList.remove("hidden");
  }

  // 1. Check Auth
  const { access_token } = await chrome.storage.local.get(["access_token"]);

  if (!access_token) {
    showLogin();
  } else {
    showMain();
  }

  // Login Handler
  document.getElementById("login-btn").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorDiv = document.getElementById("login-error");
    const btn = document.getElementById("login-btn");

    btn.innerText = "Authenticating...";
    btn.disabled = true;

    try {
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) throw new Error("Invalid credentials");

      const data = await response.json();
      await chrome.storage.local.set({ access_token: data.access });
      showMain();
    } catch (err) {
      errorDiv.innerText = err.message;
      errorDiv.classList.remove("hidden");
      btn.innerText = "Initialize Access";
      btn.disabled = false;
    }
  });

  // Logout Handler
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await chrome.storage.local.remove(["access_token"]);
    showLogin();
  });

  async function startExtraction(rawText = null, forcedSource = null) {
    loading.innerText = rawText ? "Extracting from selection..." : "Scanning page...";
    
    if (rawText) {
      processText(rawText, forcedSource);
      return;
    }

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url.includes("linkedin.com") && !tab.url.includes("indeed.com")) {
      loading.innerText = "Please open a job on LinkedIn or Indeed.";
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "CLIP_JOB" }, (response) => {
      if (!response || !response.description) {
        loading.innerText = "Could not find job details on this page.";
        return;
      }
      processText(response.description, null, response);
    });
  }

  async function processText(description, forcedSource = null, scrapedData = null) {
    loading.innerText = "AI is extracting details...";
    const { access_token } = await chrome.storage.local.get(["access_token"]);

    try {
      const extractRes = await fetch(`${API_URL}/api/ai/extract/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify({ description })
      });

      if (!extractRes.ok) throw new Error("Extraction failed");
      const details = await extractRes.json();

      loading.classList.add("hidden");
      jobDetails.classList.remove("hidden");

      document.getElementById("job-title").value = details.title || scrapedData?.title || "";
      document.getElementById("job-company").value = details.company || scrapedData?.company || "";
      document.getElementById("job-location").value = details.location || scrapedData?.location || "";
      document.getElementById("job-type").value = details.job_type || "Full-time";
      document.getElementById("job-salary").value = details.salary_range || "";
      
      window.currentJobDescription = description;
      window.currentJobSource = forcedSource || details.source || "Unknown";
    } catch (err) {
      loading.innerText = "Error: " + err.message;
    }
  }

  document.getElementById("save-btn").addEventListener("click", async () => {
    const btn = document.getElementById("save-btn");
    btn.disabled = true;
    btn.innerText = "Saving...";

    const jobData = {
      title: document.getElementById("job-title").value,
      company: document.getElementById("job-company").value,
      location: document.getElementById("job-location").value,
      job_type: document.getElementById("job-type").value,
      salary_range: document.getElementById("job-salary").value,
      description: window.currentJobDescription,
      source: window.currentJobSource,
      applied_date: new Date().toISOString().split('T')[0]
    };

    try {
      const { access_token } = await chrome.storage.local.get(["access_token"]);
      const response = await fetch(`${API_URL}/api/jobs/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access_token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) throw new Error("Failed to save job");

      btn.innerText = "Added to Tracker!";
      btn.style.backgroundColor = "#4caf50";
      btn.style.color = "white";
      
      setTimeout(() => window.close(), 1500);
    } catch (err) {
      alert("Error: " + err.message);
      btn.disabled = false;
      btn.innerText = "Add to Tracker";
    }
  });
});
