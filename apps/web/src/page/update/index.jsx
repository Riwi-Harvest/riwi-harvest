import Button from "@/components/ui/button";
import { useState } from "@harvest/core";

function ConstructionLogs({ onStop }) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.gap = "8px";

  const source = new EventSource("http://localhost:3000/vinagre");
  const logs = [];

  function getColor(status) {
    switch (status) {
      case "active": return "lightgreen";
      case "inactive": return "lightgray";
      case "pending": return "khaki";
      default: return "white";
    }
  }

  function render() {
    container.innerHTML = "";
    for (let i = 0; i < logs.length; i++) {
      const { name, status } = logs[i];
      const box = document.createElement("div");
      box.textContent = `${name} - ${status}`;
      box.style.padding = "8px";
      box.style.border = "1px solid #333";
      box.style.borderRadius = "6px";
      box.style.background = getColor(status);
      container.appendChild(box);
    }

    // Botón para detener
    const stopBtn = document.createElement("button");
    stopBtn.textContent = "Detener";
    stopBtn.onclick = () => {
      source.close();
      if (onStop) onStop();
    };
    container.appendChild(stopBtn);
  }

  source.onmessage = (e) => {
    let msg;
    try {
      msg = JSON.parse(e.data);
    } catch {
      return;
    }

    if (msg && msg.name) {
      const idx = logs.findIndex((x) => x.name === msg.name);
      if (idx !== -1) {
        logs[idx] = msg;
      } else {
        logs.push(msg);
      }
      render();
    }
  };

  source.onerror = () => {
    logs.push({ name: "Error", status: "inactive" });
    source.close();
    render();
    if (onStop) onStop();
  };

  render();
  return container;
}

export default function Update() {
  const [construction, setConstruction] = useState(false);

  return (
    <div className="p-4">
      <Button
        onClick={() => {
          setConstruction(true);
        }}
      >
        <i class="fa-solid fa-rotate"></i>
        Iniciar sincronización
      </Button>
      {construction ? <ConstructionLogs /> : null}
    </div>
  )
}
