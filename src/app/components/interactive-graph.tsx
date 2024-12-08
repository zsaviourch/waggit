import React, { useEffect, useRef } from "react";
import { Entity } from "aframe-react";
import "aframe";
import * as THREE from "three";

declare namespace AFRAME {
  let registerComponent: any, utils: any;
}

AFRAME.registerComponent("interactive-graph", {
  init() {
    this.createGraph();
  },

  update() {
    this.removeGraph();
    this.createGraph();
  },

  remove() {
    this.removeGraph();
  },

  createGraph() {
    const axisColor = "#000000";

    let xAxis = this.el.querySelector("#x-axis");
    if (!xAxis) {
      xAxis = document.createElement("a-entity");
      xAxis.setAttribute("id", "x-axis");
      xAxis.setAttribute(
        "line",
        "start: 0 0 0; end: 10 0 0; color: black; linewidth: 3"
      );
      this.el.appendChild(xAxis);
    }

    let yAxis = this.el.querySelector("#y-axis");
    if (!yAxis) {
      yAxis = document.createElement("a-entity");
      yAxis.setAttribute("id", "y-axis");
      yAxis.setAttribute(
        "line",
        "start: 0 0 0; end: 0 10 0; color: black; linewidth: 3"
      );
      this.el.appendChild(yAxis);
    }

    const xLabel = document.createElement("a-text");
    xLabel.setAttribute("value", "Date/Time");
    xLabel.setAttribute("color", "#000000");
    xLabel.setAttribute("position", "5 -0.25 0");
    xLabel.setAttribute("align", "center");

    const yLabel = document.createElement("a-text");
    yLabel.setAttribute("value", "Value($)");
    yLabel.setAttribute("color", "#000000");
    yLabel.setAttribute("position", "-0.5 5 0");
    yLabel.setAttribute("align", "center");

    this.el.appendChild(xLabel);
    this.el.appendChild(yLabel);

    const points = this.data.data || [];
    if (Array.isArray(points)) {
      const lineGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array(points.length * 3);

      points.forEach((dataPoint, index) => {
        const x = isNaN(dataPoint.x) ? 0 : dataPoint.x;
        const y = isNaN(dataPoint.y) ? 0 : dataPoint.y;
        const z = 0;

        positions.set([x, y, z], index * 3);
      });

      lineGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const lineMaterial = new THREE.LineBasicMaterial({ color: "#00ff00" });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      this.el.object3D.add(line);

      points.forEach((dataPoint, index) => {
        const xLabel = document.createElement("a-text");
        xLabel.setAttribute("value", `${dataPoint.x}`);
        xLabel.setAttribute("color", "#000000");
        xLabel.setAttribute("position", `${dataPoint.x} -0.25 0`);
        xLabel.setAttribute("align", "center");

        const yLabel = document.createElement("a-text");
        yLabel.setAttribute("value", `${dataPoint.y}`);
        yLabel.setAttribute("color", "#000000");
        yLabel.setAttribute("position", `-0.5 ${dataPoint.y} 0`);
        yLabel.setAttribute("align", "center");

        this.el.appendChild(xLabel);
        this.el.appendChild(yLabel);
      });
    } else {
      console.error("Data is not an array:", points);
    }
  },

  removeGraph() {
    const lines = Array.from(this.el.querySelectorAll("a-entity"));
    const labels = Array.from(this.el.querySelectorAll("a-text"));

    lines.forEach((line) => this.el.removeChild(line));
    labels.forEach((label) => this.el.removeChild(label));
  },
});

type InteractiveGraphProps = {
  position?: string;
  data: Array<{ x: number; y: number; label: string }>;
};

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  position = "0 0 0",
  data,
}) => {
  return (
    <Entity
      position={position}
      interactive-graph={`data: ${JSON.stringify(data)}`}
    />
  );
};
