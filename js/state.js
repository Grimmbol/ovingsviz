import RehersalExplorer from "./conponents/rehersalExplorer.js";
import { generateData } from "./generate.js";

const dataDisplayWrapper = document.querySelector("rehersal-viz");
const statsDisplayWrapper = document.querySelector("stats");
const generateButton = document.querySelector("header .generate");
let timelineRenderSettings = {
  startDate: "2023-01-01",
  endDate: "2023-07-01"
};

const dataGenerationSettings = {
  startDate: timelineRenderSettings.startDate,
  endDate: timelineRenderSettings.endDate,
  maxRehersals: 4,
  numTunes: 4
};

const data = {
  grautpols: {
    genere: "rørospols",
    rehersals: {
      "2024-01-01":"bad",
      "2024-01-08":"good"
    }
  }
}

const rehersalViz = new RehersalViz();
/*
rehersalViz.setRenderSettings(timelineRenderSettings);
rehersalViz.setRenderElement(dataDisplayWrapper);
rehersalViz.setData(data);
rehersalViz.displayData();*/


generateButton.addEventListener('click', (event) => {
  const newData = generateData(dataGenerationSettings);
  rehersalViz.setData(newData);
  rehersalViz.displayData();
});
