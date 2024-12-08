"use client";

import React from "react";
import { Entity } from "aframe-react";
import "aframe";

declare namespace AFRAME {
  let registerComponent: any, utils: any;
}

AFRAME.registerComponent("pixel-art-bitcoin", {
  schema: {
    pixelSize: { type: "number", default: 0.2 },
    color: { type: "string", default: "#F7931A" },
    shineColor: { type: "string", default: "white" },
    shineOpacity: { type: "number", default: 0.5 },
  },

  init() {
    const bitcoinPixels = [
      "....######....",
      "...#......#...",
      "..#........#..",
      ".#..######..#.",
      ".#..#....#..#.",
      ".#..######..#.",
      ".#..#....#..#.",
      "..#.######.#..",
      "...#......#...",
      "....######....",
    ];

    const { pixelSize, color } = this.data;

    const totalWidth = bitcoinPixels[0].length * pixelSize;
    const totalHeight = bitcoinPixels.length * pixelSize;

    bitcoinPixels.forEach((row, y) => {
      row.split("").forEach((pixel, x) => {
        if (pixel === "#") {
          const box = document.createElement("a-box");
          box.setAttribute(
            "position",
            `${x * pixelSize - totalWidth / 2} ${
              -y * pixelSize + totalHeight / 2
            } 0`
          );
          box.setAttribute("width", pixelSize.toString());
          box.setAttribute("height", pixelSize.toString());
          box.setAttribute("depth", "0.05");
          box.setAttribute("material", `color: ${color}`);
          this.el.appendChild(box);
        }
      });
    });

    const plane = document.createElement("a-plane");

    plane.setAttribute("position", `${0} ${0} 0.01`);

    plane.setAttribute(
      "geometry",
      `width: ${totalWidth}; height: ${totalHeight}`
    );
    plane.setAttribute(
      "material",
      `color: ${this.data.shineColor}; opacity: ${this.data.shineOpacity}; transparent: true`
    );
    plane.setAttribute(
      "animation",
      "property: material.opacity; from: 0.1; to: 0.5; dur: 2000; loop: true; dir: alternate"
    );

    this.el.appendChild(plane);
  },

  remove() {
    while (this.el.firstChild) {
      this.el.removeChild(this.el.firstChild);
    }
  },
});

type PixelArtBitcoinProps = {
  position?: string;
  pixelArtBitcoinProps?: {
    pixelSize?: number;
    color?: string;
    shineColor?: string;
    shineOpacity?: number;
  };
};

export const PixelArtBitcoin: React.FC<PixelArtBitcoinProps> = ({
  position = "0 0 0",
  pixelArtBitcoinProps = {},
}) => <Entity position={position} pixel-art-bitcoin={pixelArtBitcoinProps} />;
