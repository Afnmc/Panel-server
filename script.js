const githubPingURL =
  "https://raw.githubusercontent.com/Afnmc/Panel-server/main/ping.json";

let chart;
let pingData = [];

async function loadPingJSON() {
  try {
    const res = await fetch(githubPingURL + "?cache=" + Date.now());
    const data = await res.json();

    pingData = data.history;

    document.getElementById("lastUpdate").textContent = data.updated;
    renderChart();
  } catch (err) {
    console.log("Gagal fetch JSON:", err);
  }
}

function renderChart() {
  const ctx = document.getElementById("pingChart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Ping (ms)",
          data: pingData,
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { type: "time", time: { unit: "minute" } },
        y: { beginAtZero: true }
      },
      plugins: { legend: { labels: { color: "#e5e5e5" } } }
    }
  });
}

// refresh tiap 10 detik
loadPingJSON();
setInterval(loadPingJSON, 10000);
