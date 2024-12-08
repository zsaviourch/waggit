"use client";

import React from "react";
import { Entity } from "aframe-react";
import "aframe";

declare namespace AFRAME {
  let registerComponent: any;
}

AFRAME.registerComponent("timer", {
  schema: {
    duration: { type: "number", default: 300 },
    position: { type: "string", default: "top" },
  },

  init() {
    const { duration, position } = this.data;

    const timerContainer = document.createElement("a-entity");

    const timerFrame = document.createElement("a-box");
    timerFrame.setAttribute("color", "#333");
    timerFrame.setAttribute("depth", "0.1");
    timerFrame.setAttribute("width", "1.0");
    timerFrame.setAttribute("height", "0.6");
    timerFrame.setAttribute("position", "0 0 0");
    timerFrame.setAttribute("material", "roughness: 0.5; metalness: 0.1;");

    const cornerRadius = 0.1;
    const corners = [
      { position: "-0.5 0.3 0", rotation: "0 0 0" },
      { position: "0.5 0.3 0", rotation: "0 0 0" },
      { position: "-0.5 -0.3 0", rotation: "0 0 0" },
      { position: "0.5 -0.3 0", rotation: "0 0 0" },
    ];

    corners.forEach((corner) => {
      const cornerRadius = 0.1;
      const cornerRing = document.createElement("a-ring");
      cornerRing.setAttribute("color", "#333"); // Matching the frame color
      cornerRing.setAttribute("radius-inner", cornerRadius.toString()); // Convert number to string
      cornerRing.setAttribute("radius-outer", (cornerRadius + 0.05).toString());
      cornerRing.setAttribute("position", corner.position);
      cornerRing.setAttribute("rotation", corner.rotation);

      cornerRing.setAttribute("material", "roughness: 0.5; metalness: 0.1;");
      timerContainer.appendChild(cornerRing);
    });

    // Adding a border/glowing effect (border on top of the frame)
    // const borderGlow = document.createElement("a-ring");
    // borderGlow.setAttribute("color", "#00FF00"); // Green glow border
    // borderGlow.setAttribute("radius-inner", "0.47");
    // borderGlow.setAttribute("radius-outer", "0.5");
    // borderGlow.setAttribute("position", "0 0 0.05");
    // borderGlow.setAttribute("rotation", "0 0 0"); // Flat to face camera
    // borderGlow.setAttribute("emissive", "#00FF00"); // Make glow effect emissive

    const timerText = document.createElement("a-text");
    timerText.setAttribute("value", this.formatTime(duration));
    timerText.setAttribute("align", "center");
    timerText.setAttribute("position", "0 0 0.2");
    timerText.setAttribute("scale", "1.2 1.2 1.2");
    timerText.setAttribute("font", "https://cdn.aframe.io/fonts/mozillavr.fnt");
    timerText.setAttribute("color", "#00FF00");

    const timerIcon = document.createElement("a-text");
    timerIcon.setAttribute("value", "⏱️");
    timerIcon.setAttribute("align", "center");
    timerIcon.setAttribute("position", "-0.6 0.2 0");
    timerIcon.setAttribute("scale", "0.8 0.8 0.8");
    timerIcon.setAttribute("color", "#FFD700");

    timerContainer.appendChild(timerFrame);
    //timerContainer.appendChild(borderGlow);
    timerContainer.appendChild(timerIcon);
    timerContainer.appendChild(timerText);

    const yPosition = position === "top" ? "1.5" : "-1.5";
    timerContainer.setAttribute("position", `0 ${yPosition} -2`);

    this.el.appendChild(timerContainer);
    this.timerText = timerText;

    this.startCountdown(duration);
  },

  startCountdown(duration: number) {
    let timeLeft = duration;

    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      this.timerText.setAttribute("value", this.formatTime(timeLeft));
      this.updateColor(timeLeft);

      if (timeLeft <= 10) {
        const vibration = timeLeft % 2 === 0 ? "0.01" : "-0.01";
        this.timerText.setAttribute("position", `0.3 ${vibration} 0`);
      }

      timeLeft--;
    }, 1000);
  },

  formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  },

  updateColor(timeLeft: number) {
    let color = "#00FF00";

    if (timeLeft <= 60) {
      color = "#FF0000";
    } else if (timeLeft <= 180) {
      color = "#FFFF00";
    }

    this.timerText.setAttribute("color", color);
  },
});

type TimerPropsType = {
  position?: "top" | "bottom";
  timerProps?: {
    duration?: number;
    position?: "top" | "bottom";
  };
};

export const Timer: React.FC<TimerPropsType> = ({
  position = "top",
  timerProps = {},
}) => {
  const timerPosition = position === "top" ? "0 3.5 -3" : "0 -1.5 -3";

  return <Entity position={timerPosition} timer={timerProps} />;
};
