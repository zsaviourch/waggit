"use client";

import React, { useEffect } from "react";
import { Scene, Entity } from "aframe-react";
import "aframe";
import { PixelArtBitcoin } from "@/app/components/pixel-art-bitcoin";
import { InteractiveGraph } from "./components/interactive-graph";
import { BitcoinLiveSampleData } from "./data/bitcoin-live-sample-data";

const Home = () => {
  useEffect(() => {
    // Ensure the A-Frame scene is set up and rotating the cube
    const box = document.querySelector("a-box");
    let rotation = 0;

    if (box) {
      // Set up an interval to rotate the cube
      const interval = setInterval(() => {
        rotation += 0.5;
        box.setAttribute("rotation", `0 ${rotation} 0`);
      }, 100); // Update rotation every 100ms

      // Cleanup on unmount
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <div>
      <div className="aframe-container">
        <Scene
          embedded
          renderer="colorManagement: true"
          vr-mode-ui="enabled: false"
        >
          <PixelArtBitcoin
            position="-5 0 -5"
            pixelArtBitcoinProps={{
              pixelSize: 0.05,
              color: "#F7931A",
              shineColor: "white",
              shineOpacity: 0.4,
            }}
          />

          <InteractiveGraph position="-5 -2 -5" data={BitcoinLiveSampleData} />

          <Entity primitive="a-sky" color="#ECECEC" />
        </Scene>
      </div>

      <style jsx>{`
        h1 {
          text-align: center;
        }
        .aframe-container {
          width: 100%;
          height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default Home;
