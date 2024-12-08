"use client";

import React, { useEffect } from "react";
import { Entity } from "aframe-react";
import "aframe";

declare namespace AFRAME {
  let registerComponent: any, utils: any;
}

declare module "aframe-react" {
  interface EntityProps {
    position?: string;
    "coin-pulse"?: { value: string; duration: number };
    postprocessing?: string;
  }
}

AFRAME.registerComponent("coin-pulse", {
  schema: {
    value: { type: "string", default: "0.00" },
    duration: { type: "number", default: 300 },
  },

  init() {
    const { value, duration } = this.data;

    const outerSphere = document.createElement("a-entity");
    outerSphere.setAttribute("geometry", "primitive: sphere; radius: 2.5;");
    outerSphere.setAttribute(
      "material",
      "color: #86A8E7; opacity: 0.5; emissive: #86A8E7; emissiveIntensity: 2.5;"
    );
    outerSphere.setAttribute("position", "0 0 -3");
    outerSphere.setAttribute(
      "animation",
      "property: scale; to: 1.5 1.5 1.5; dir: alternate; dur: 1000; loop: true;"
    );
    this.el.appendChild(outerSphere);

    const innerSphere = document.createElement("a-entity");
    innerSphere.setAttribute("geometry", "primitive: sphere; radius: 2.5;");
    innerSphere.setAttribute(
      "material",
      "color: #5F76E8; emissive: #5F76E8; emissiveIntensity: 2;"
    );
    innerSphere.setAttribute("position", "0 0 -3");
    this.el.appendChild(innerSphere);

    this.innerSphere = innerSphere;
    this.outerSphere = outerSphere;

    const coinText = document.createElement("a-text");
    coinText.setAttribute("value", `BTC: ${value}`);
    coinText.setAttribute("color", "#E8C547");
    coinText.setAttribute("position", "0 -0.2 1");
    coinText.setAttribute("scale", "2 2 2");
    coinText.setAttribute("align", "center");
    coinText.setAttribute("font", "kelsonsans");
    this.el.appendChild(coinText);

    this.startTimer(duration);
  },

  startTimer(duration: number) {
    let timeLeft = duration;

    const timerInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
      } else {
        const progress: number = 1 - timeLeft / duration;
        this.updateOuterSphere(progress);
        timeLeft--;
      }
    }, 1000);
  },

  updateOuterSphere(progress: number) {
    const outerSphere = this.outerSphere;
    const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.5; // Pulsing effect on the outer sphere
    outerSphere.setAttribute("scale", `${scale + 1} ${scale + 1} ${scale + 1}`);

    const opacity = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
    outerSphere.setAttribute("material", `opacity: ${opacity};`);
  },

  remove() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  },
});

type CoinPulseProps = {
  position?: string;
  coinValue?: string;
  duration?: number;
};

export const CoinPulse: React.FC<CoinPulseProps> = ({
  position = "0 0 0",
  coinValue = "0.00",
  duration = 300,
}) => (
  <Entity
    position={position}
    coin-pulse={{ coinValue, duration }}
    postprocessing="bloom: true; bloomThreshold: 0.5; bloomStrength: 3; bloomRadius: 1;"
  />
);
