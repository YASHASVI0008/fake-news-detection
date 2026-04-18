// ==================== CONFIG ====================
const API_BASE = "http://localhost:5000";

// ==================== TYPING ANIMATION ====================
const phrases = [
  "Detect Truth.",
  "Expose Lies.",
  "Protect Whistleblowers.",
  "Fight Misinformation.",
  "Stay Anonymous."
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedElement = document.getElementById('typed-text');

function typeEffect() {
  if (!typedElement) return;

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typedElement.textContent = currentPhrase.substring(0, charIndex--);
  } else {
    typedElement.textContent = currentPhrase.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    return setTimeout(typeEffect, 2000);
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    return setTimeout(typeEffect, 500);
  }

  setTimeout(typeEffect, isDeleting ? 50 : 100);
}

if (typedElement) setTimeout(typeEffect, 500);

// ==================== SECTION SWITCH ====================
function show(sectionId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(sectionId)?.classList.add("active");

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (sectionId === "reports") loadReports();
}

// ==================== ANONYMOUS ID ====================
function revealId() {
  const id = document.getElementById("anonId");

  if (id.classList.contains("revealed")) {
    id.innerText = "SW-XXXXXX";
    id.classList.remove("revealed");
    showToast("🔒 ID hidden");
  } else {
    let storedId = localStorage.getItem("safeWitness_anonId");
    if (!storedId) {
      storedId = "SW-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      localStorage.setItem("safeWitness_anonId", storedId);
    }
    id.innerText = storedId;
    id.classList.add("revealed");
    showToast("🔓 ID revealed");
  }
}

// ==================== TOAST ====================
function showToast(msg) {
  document.querySelectorAll('.toast-msg').forEach(t => t.remove());

  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerText = msg;

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ==================== LOAD REPORTS ====================
async function loadReports() {
  const container = document.getElementById("reportsContainer");

  try {
    const res = await fetch(`${API_BASE}/api/reports/all`);
    const reports = await res.json();

    if (!reports.length) {
      container.innerHTML = `<div class="card">📭 No reports yet</div>`;
      return;
    }

    container.innerHTML = reports.map(rep => `
      <div class="report-item">
        <div style="display:flex; justify-content:space-between;">
          <strong>${rep.anonId}</strong>
          <span class="status-badge">${rep.status}</span>
        </div>
        <p>📌 ${rep.type} | 📍 ${rep.city}</p>
        <p>${rep.description}</p>
      </div>
    `).join("");

  } catch (err) {
    container.innerHTML = `<div class="card">❌ Failed to load reports</div>`;
  }
}

// ==================== SUBMIT REPORT ====================
async function submitReport() {
  const formData = new FormData();

  formData.append("type", document.getElementById("reportType").value);
  formData.append("description", document.getElementById("reportDesc").value);
  formData.append("city", document.getElementById("cityInput").value);

  const file = document.getElementById("evidenceFile").files[0];
  if (file) formData.append("file", file);

  await fetch("http://localhost:5000/api/reports/create", {
    method: "POST",
    body: formData
  });

  loadReports();
}

// ==================== INIT ====================
function init() {
  loadReports();
  show("home");

  document.getElementById("submitReportBtn")
    ?.addEventListener("click", submitReport);

  console.log("🚀 SafeWitness Ready");
}

// ==================== GLOBAL ====================
window.show = show;
window.revealId = revealId;

document.addEventListener("DOMContentLoaded", init);