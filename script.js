const githubPingURL = "https://raw.githubusercontent.com/<username>/<repo>/main/ping.json";

// Cek Minecraft Server
async function checkMinecraft(ip, port) {
    try {
        const res = await fetch(`https://api.mcstatus.io/v2/status/bedrock/${ip}:${port}`);
        if (!res.ok) throw new Error();
        return "Online";
    } catch {
        return "Offline";
    }
}

// Cek ICMP via GitHub (ping.json)
async function fetchPing() {
    try {
        const res = await fetch(githubPingURL);
        return await res.json();
    } catch {
        return { error: true };
    }
}

async function updateStatus() {

    // SERVER LIST
    const servers = [
        { name: "Server 1", ip: "nl-1.nura.host", port: 19132 },
        { name: "Server 2", ip: "nl-2.nura.host", port: 19132 },
        { name: "Server 3", ip: "nl-3.nura.host", port: 19132 },
        { name: "Server 4", ip: "nl-4.nura.host", port: 19132 },
        { name: "Server 5", ip: "nl-5.nura.host", port: 19132 },
    ];

    // TAMPILKAN SERVER STATUS
    const serverBox = document.getElementById("serverStatus");
    serverBox.innerHTML = "";

    for (const s of servers) {
        const status = await checkMinecraft(s.ip, s.port);
        serverBox.innerHTML += `
            <p>${s.name}: 
                <span class="${status === "Online" ? "status-up" : "status-down"}">
                    ${status}
                </span>
            </p>
        `;
    }

    // CEK NODE (PING.JSON)
    const nodeBox = document.getElementById("nodeStatus");
    const pingData = await fetchPing();

    if (pingData.error) {
        nodeBox.innerHTML = `<p class="status-down">Gagal mengambil ping.json</p>`;
        return;
    }

    let html = "";
    for (const key in pingData) {
        html += `<p>${key}: <span class="status-up">${pingData[key]}</span> ms</p>`;
    }

    nodeBox.innerHTML = html;
}

updateStatus();
setInterval(updateStatus, 5000); // refresh setiap 5 detik
