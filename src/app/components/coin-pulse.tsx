"use client";

import React, { useEffect, useState } from "react";
import { Entity } from "aframe-react";
import "aframe";
import { fetchBitcoinPrice } from "../api/bitcoin-api";

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

    // Create an image of the Bitcoin logo
    const bitcoinIcon = document.createElement("a-image");
    bitcoinIcon.setAttribute("src", "/logos/bitcoin-logo.png");
    bitcoinIcon.setAttribute("position", "0 0 1"); // Position above the text

    // Create an Image object to get the width and height
    const img = new Image();
    img.src = "/logos/bitcoin-logo.png";
    img.onload = () => {
      const aspectRatio = img.width / img.height; // Calculate the aspect ratio
      bitcoinIcon.setAttribute("scale", `${aspectRatio} 1 1`); // Scale the logo and adjust aspect ratio
    };

    this.el.appendChild(bitcoinIcon);

    // Create text for the Bitcoin value
    this.coinText = document.createElement("a-text");
    this.coinText.setAttribute("value", `${value}`);
    this.coinText.setAttribute("color", "#E8C547");
    this.coinText.setAttribute("position", "0 -0.8 1"); // Position below the logo
    this.coinText.setAttribute("scale", "2 2 2");
    this.coinText.setAttribute("align", "center");
    this.coinText.setAttribute("font", "kelsonsans");
    this.el.appendChild(this.coinText);

    this.startTimer(duration);
  },

  update() {
    const { value } = this.data;
    if (this.coinText) {
      this.coinText.setAttribute("value", `${value}`);
    }
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
    const scale = 1 + Math.sin(progress * Math.PI * 2) * 0.5;
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
}) => {
  const [bitcoinPrice, setBitcoinPrice] = useState<string>("0.00");

  useEffect(() => {
    const getPrice = async () => {
      const price = await fetchBitcoinPrice();
      setBitcoinPrice(price.toString()); // Ensure the price is a string
    };

    getPrice();
    const interval = setInterval(getPrice, 100000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <Entity
      position={position}
      coin-pulse={{ value: bitcoinPrice, duration }}
      postprocessing="bloom: true; bloomThreshold: 0.5; bloomStrength: 3; bloomRadius: 1;"
    />
  );
};
