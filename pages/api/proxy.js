<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>new tab</title>
  <style>
    body {
      margin: 0;
      background-color: #0d0d0d;
      color: #f2f2f2;
      font-family: "Segoe UI", sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      overflow: hidden;
    }

    .loading-bars {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 10px;
      padding: 0 40px;
      transition: transform 0.8s ease, opacity 0.8s ease;
      transform-origin: right;
    }

    .loading-bars.squish {
      transform: scaleX(0);
      opacity: 0;
    }

    .bar {
      width: 100%;
      height: 6px;
      background: #1a1a1a;
      border-radius: 4px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      width: 0%;
      background: #00ff88;
      transition: width 0.3s ease;
    }

    .content {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    #statusMessage {
      font-size: 1.2rem;
      opacity: 1;
    }

    .disclaimer {
      color: #666;
      font-size: 12px;
      text-align: center;
      padding: 10px 20px;
      z-index: 2;
    }

    .input-bar {
      display: flex;
      justify-content: center;
      padding: 0 20px 20px 20px;
      z-index: 2;
    }

    input {
      width: 80%;
      max-width: 700px;
      padding: 14px 18px;
      font-size: 16px;
      border: none;
      border-radius: 25px;
      background-color: #1a1a1a;
      color: white;
      transition: all 0.25s ease;
      outline: none;
    }

    input:hover, input:focus {
      background-color: #262626;
      transform: scale(1.05);
    }

    #codeFlow {
      position: fixed;
      top: 0; left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      color: #0f0;
      font-family: monospace;
      font-size: 14px;
      display: none;
      z-index: 10;
      pointer-events: none;
      user-select: none;
      padding: 20px;
      white-space: pre-wrap;
      overflow-y: auto;
    }

    #finalLoading {
      position: fixed;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      width: 300px;
      height: 8px;
      background: #1a1a1a;
      border-radius: 4px;
      overflow: hidden;
      display: none;
      z-index: 11;
    }

    #finalLoadingFill {
      height: 100%;
      width: 0;
      background: #00ff88;
      transition: width 1.5s ease;
    }

    #presetModal {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.9);
      display: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 20;
      color: white;
      padding: 20px;
      box-sizing: border-box;
    }

    #presetModal h2 {
      margin-bottom: 20px;
    }

    #presetList {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      justify-content: center;
      max-width: 600px;
    }

    .presetButton {
      background: #1a1a1a;
      border: 2px solid #00ff88;
      border-radius: 20px;
      padding: 12px 24px;
      cursor: pointer;
      transition: background 0.3s ease;
      color: white;
    }

    .presetButton:hover {
      background: #00ff88;
      color: black;
    }

    #closePreset {
      margin-top: 30px;
      color: #888;
      cursor: pointer;
    }

    #closePreset:hover {
      color: #00ff88;
    }
  </style>
</head>
<body>

  <div class="loading-bars" id="loadingBars">
    <div class="bar"><div class="bar-fill" id="bar1"></div></div>
    <div class="bar"><div class="bar-fill" id="bar2"></div></div>
    <div class="bar"><div class="bar-fill" id="bar3"></div></div>
    <div class="bar"><div class="bar-fill" id="bar4"></div></div>
    <div class="bar"><div class="bar-fill" id="bar5"></div></div>
  </div>

  <div class="content">
    <div id="statusMessage">GoGard++</div>
  </div>

  <div class="disclaimer">This does not break any Glitch ToS, so please don't take down my project. Google Sites doesn't work so don't use it.</div>

  <div class="input-bar">
    <input
      id="urlInput"
      type="text"
      placeholder="Enter a full URL like https://example.com"
      autocomplete="off"
      spellcheck="false"
    />
  </div>

  <pre id="codeFlow"></pre>

  <div id="finalLoading">
    <div id="finalLoadingFill"></div>
  </div>

  <div id="presetModal">
    <h2>Choose a Preset Site</h2>
    <div id="presetList"></div>
    <div id="closePreset" onclick="closePresetModal()">Cancel</div>
  </div>

  <script>
    const input = document.getElementById("urlInput");
    const status = document.getElementById("statusMessage");

    const bars = [
      document.getElementById("bar1"),
      document.getElementById("bar2"),
      document.getElementById("bar3"),
      document.getElementById("bar4"),
      document.getElementById("bar5"),
    ];

    const fullDomains = [".com", ".net", ".org", ".io", ".gov", ".edu", ".co", ".me"];
    const loadingBars = document.getElementById("loadingBars");
    const codeFlow = document.getElementById("codeFlow");
    const finalLoading = document.getElementById("finalLoading");
    const finalLoadingFill = document.getElementById("finalLoadingFill");
    const presetModal = document.getElementById("presetModal");
    const presetList = document.getElementById("presetList");

    const presetSites = [
      { name: "gamest1", url: "https://only-games.github.io/" },
      { name: "gamest2", url: "https://unblockedgames200.github.io/" },
      { name: "gamest3", url: "https://coolunblockedgames.github.io/" },
      { name: "gamest4", url: "https://unblocked-2025.github.io/" },
      { name: "gamest5", url: "https://faf-games.github.io/" }
    ];

    const hackerPhrases = [
      "bypassing GoGuard...",
      "connecting to server...",
      "initializing proxy...",
      "decrypting data...",
      "injecting payload...",
      "scanning ports...",
      "firewall disabled...",
      "accessing darknet...",
      "routing through VPN...",
      "establishing secure tunnel...",
      "uploading exploit...",
      "masking IP address...",
      "reconfiguring DNS...",
      "spoofing credentials...",
      "launching payload..."
    ];

    // Updated proxyBase to dynamically use current origin:
    const proxyBase = window.location.origin + "/api/proxy?url=";

    // Update progress bars as user types
    input.addEventListener("input", updateBars);

    // Handle enter key press
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        startOpenSequence(input.value.trim());
      }
    });

    // Tab key for presets
    input.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const val = input.value.trim();
        if ((val.startsWith("http://") || val.startsWith("https://")) && presetSites.length > 0) {
          openPresetModal();
        } else {
          alert("Please type a valid full URL before viewing presets.");
        }
      }
    });

    function updateBars() {
      const value = input.value.trim();
      const hasProtocol = value.startsWith("http://") || value.startsWith("https://");
      const hasValidDomain = fullDomains.some(domain => value.endsWith(domain) || value.endsWith(domain + "(prox)"));

      for (let i = 0; i < bars.length; i++) {
        if (hasProtocol && hasValidDomain) {
          bars[i].style.width = "100%";
        } else {
          const base = Math.min(value.length / 30, 1);
          bars[i].style.width = (base * 100 * ((i + 1) / bars.length)) + "%";
        }
      }

      // Change status message color to green if valid
      if (hasProtocol && hasValidDomain) {
        status.textContent = "Ready to open! Press Enter";
        status.style.color = "#00ff88";
      } else {
        status.textContent = "GoGard++";
        status.style.color = "#f2f2f2";
      }
    }

    function openIframeWindow(url) {
      // Squish loading bars away
      loadingBars.classList.add("squish");

      // Clear input and disable it while loading
      input.disabled = true;

      // Show codeFlow area
      codeFlow.style.display = "block";
      codeFlow.textContent = "";

      // Final loading bar setup
      finalLoading.style.display = "block";
      finalLoadingFill.style.width = "0%";

      // Simulate "hacker" loading text
      let phraseIndex = 0;

      function addPhrase() {
        if (phraseIndex < hackerPhrases.length) {
          codeFlow.textContent += hackerPhrases[phraseIndex] + "\n";
          codeFlow.scrollTop = codeFlow.scrollHeight;
          phraseIndex++;
          setTimeout(addPhrase, 400);
        } else {
          // After phrases, animate final loading bar
          finalLoadingFill.style.width = "100%";
          setTimeout(() => {
            // Open new window proxied
            window.open(proxyBase + encodeURIComponent(url), "_blank");

            // Reset UI
            loadingBars.classList.remove("squish");
            input.disabled = false;
            codeFlow.style.display = "none";
            finalLoading.style.display = "none";
            input.value = "";
            updateBars();
            status.textContent = "GoGard++";
            status.style.color = "#f2f2f2";
          }, 1500);
        }
      }

      addPhrase();
    }

    function startOpenSequence(val) {
      if (!val) return alert("Please enter a URL.");

      let url = val;

      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      // Handle (prox) suffix
      if (url.endsWith("(prox)")) {
        url = url.slice(0, -6);
      }

      openIframeWindow(url);
    }

    // Preset modal code
    function openPresetModal() {
      presetModal.style.display = "flex";
      presetList.innerHTML = "";
      presetSites.forEach(site => {
        const btn = document.createElement("button");
        btn.textContent = site.name;
        btn.className = "presetButton";
        btn.onclick = () => {
          startOpenSequence(site.url + "(prox)");
          closePresetModal();
        };
        presetList.appendChild(btn);
      });
    }

    function closePresetModal() {
      presetModal.style.display = "none";
    }
  </script>
</body>
</html>
