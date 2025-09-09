document.addEventListener("DOMContentLoaded", function () {
  const searchbtn = document.getElementById("search");
  const username = document.getElementById("userid");
  const status = document.querySelector(".status");
  const card = document.querySelector(".stat-card");
  const themeToggle = document.getElementById("theme-toggle");

  // 🌙 Dark/Light Mode Toggle
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    themeToggle.textContent = document.body.classList.contains("light-mode")
      ? "🌞"
      : "🌙";
  });

  // ✅ Validate Username
  function validateusername(user) {
    if (user.trim() === "") {
      alert("Username shouldn't be empty");
      return false;
    }
    const regex = /^[a-zA-Z0-9 _-]{1,20}$/;
    const ismatch = regex.test(user);
    if (!ismatch) {
      alert("Invalid username");
    }
    return ismatch;
  }

  // ✅ Update Circle Progress (with % animation)
  function update(solved, total, percentEl, labelEl, circle) {
    const targetPercent = Math.round((solved / total) * 100);
    let current = 0;

    const interval = setInterval(() => {
      if (current >= targetPercent) {
        clearInterval(interval);
      } else {
        current++;
        circle.style.setProperty("--progress-degree", `${current}%`);
        percentEl.textContent = current + "%";
      }
    }, 15);

    // Show solved/total below the circle
    labelEl.textContent = `${solved}/${total}`;
  }

  // ✅ Display Data
  function displaydata(data) {
    const totalEasy = data.totalEasy;
    const totalMedium = data.totalMedium;
    const totalHard = data.totalHard;
    const easysolved = data.easySolved;
    const mediumsolved = data.mediumSolved;
    const hardsolved = data.hardSolved;

    // Elements
    const easyPercent = document.getElementById("easy-percent");
    const mediumPercent = document.getElementById("medium-percent");
    const hardPercent = document.getElementById("hard-percent");

    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");

    const easyCircle = document.querySelector(".easy");
    const mediumCircle = document.querySelector(".medium");
    const hardCircle = document.querySelector(".hard");

    // Update circles
    update(easysolved, totalEasy, easyPercent, easyLabel, easyCircle);
    update(mediumsolved, totalMedium, mediumPercent, mediumLabel, mediumCircle);
    update(hardsolved, totalHard, hardPercent, hardLabel, hardCircle);

    // Stats cards
    const carddata = [
      { label: "Overall Acceptance", value: data.acceptanceRate },
      { label: "Contribution Points", value: data.contributionPoints },
      { label: "Ranking", value: data.ranking },
    ];

    card.innerHTML = carddata
      .map(
        (d) => `
        <div class="cards">
          <h4>${d.label}</h4>
          <p>${d.value}</p>
        </div>`
      )
      .join("");
  }

  // ✅ Fetch Data
  async function fetchdata(user) {
    const url = `https://leetcode-stats-api.herokuapp.com/${user}`;
    try {
      searchbtn.textContent = "Searching...";
      searchbtn.disabled = true;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Unable to fetch");
      }
      const data = await res.json();
      displaydata(data);
    } catch (e) {
      status.innerHTML = "<p>No data found</p>";
    } finally {
      searchbtn.textContent = "Search";
      searchbtn.disabled = false;
    }
  }

  // ✅ Search Button Click
  searchbtn.addEventListener("click", function () {
    const user = username.value;
    if (validateusername(user)) {
      fetchdata(user);
    }
  });
});
