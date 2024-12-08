"use client";

import React from "react";
import { Scene, Entity } from "aframe-react";
import "aframe";
import { CoinPulse } from "./components/coin-pulse";
import { Timer } from "./components/timer"; // Make sure the Timer component is imported

const Home = () => {
  return (
    <div>
      {/* Add a gradient background using CSS */}
      <div className="background-gradient" />

      <div className="aframe-container">
        <Scene
          embedded
          renderer="colorManagement: true"
          vr-mode-ui="enabled: false"
        >
          <Timer position="top" timerProps={{ duration: 300 }} />{" "}
          {/* Fixed this line */}
          <CoinPulse position="0 2 -5" coinValue="0.05" duration={600} />
        </Scene>
      </div>

      <style jsx>{`
        .background-gradient {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1; /* Ensure it's behind the scene */
          background: linear-gradient(180deg, #1e1e2f, #292946);
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
