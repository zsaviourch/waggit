"use client";

import React, { useEffect } from "react";
import { Scene, Entity } from "aframe-react";
import "aframe";
import { BitcoinTimer } from "./components/bitcoin-timer";

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
          {/* Example content in the scene */}
          <BitcoinTimer position="0 2 -5" bitcoinValue="0.05" duration={600} />
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
