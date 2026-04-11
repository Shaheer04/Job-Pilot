// content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "CLIP_JOB") {
    const jobData = scrapeJobPage();
    sendResponse(jobData);
  }
  return true;
});

function scrapeJobPage() {
  const url = window.location.href;
  let description = "";
  let title = "";
  let company = "";
  let location = "";

  if (url.includes("linkedin.com")) {
    // LinkedIn Job Page
    title = document.querySelector(".job-details-jobs-unified-top-card__job-title")?.innerText || 
            document.querySelector(".jobs-unified-top-card__job-title")?.innerText;
    company = document.querySelector(".job-details-jobs-unified-top-card__company-name")?.innerText ||
              document.querySelector(".jobs-unified-top-card__company-name")?.innerText;
    location = document.querySelector(".job-details-jobs-unified-top-card__bullet")?.innerText ||
               document.querySelector(".jobs-unified-top-card__bullet")?.innerText;
    
    // Grab the main JD text
    description = document.querySelector(".jobs-description-content__text")?.innerText || 
                  document.querySelector("#job-details")?.innerText;

  } else if (url.includes("indeed.com")) {
    // Indeed Job Page
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
