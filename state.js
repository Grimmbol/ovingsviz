const dataDisplayWrapper = document.querySelector("rehersal-viz");
const statsDisplayWrapper = document.querySelector("stats");
const generateButton = document.querySelector("header .generate");
let settings = {
  startDate: "2023-01-01",
  endDate: "2023-06-01"
};
let data = null;
let stats = null;

generateData();
produceStats();
displayData();
displayStats();

generateButton.addEventListener('click', (event) => {
  clear();
  generateData();
  displayData();
  produceStats();
  displayStats();
});

/* --- high-level api --- */
function generateData() {
  data = {
    gørpols: {
      sjanger: "rørospols",
      øvinger: {
	"2023-01-01": "bad",
	"2023-01-08": "good"
      } 
    },
    svinsen: {
      sjanger: "vals",
      øvinger: {
	"2023-01-01": "bad",
	"2023-01-08": "good"
      } 
    },
  };
}

function displayStats() {
  for (let metric in stats) {
    const metricName = metric;
    const metricValue = stats[metric];
    const metricWrapper = generateMetricWrapper(metricName, metricValue);
    statsDisplayWrapper.appendChild(metricWrapper);
  }
}

function produceStats() {
  const tempStats = {
    bad: 0,
    ok: 0,
    good: 0,
    banger: 0
  };
}

function clear() {
  dataDisplayWrapper.replaceChildren();
  statsDisplayWrapper.replaceChildren();
  data = null;
  stats = null;
}

function displayData() {
  const renderPlan = createRenderPlan(data, settings);
  const newDomRender = createDomRender(renderPlan);

  dataDisplayWrapper.appendChild(newDomRender);
}


/* --- render helpers --- */

/**
 * A render plan is ordered, both in segments and timelines
 * It should contain exactly what the 
 */
function createRenderPlan(rehersalData, renderSettings) {
  return [
    {
      tuneInfo: {
	title: "Gørpols",
	genere: "rørospols",
      },
      segments: [
	{
	  length: "50px",
	  state: "ok"
	},
	{
	  length: "100px",
	  state: "good"
	}
      ]
    },

    {
      tuneInfo: {
	title: "Svinsen",
	genere: "vals",
      },
      segments: [
	{
	  length: "50px",
	  state: "bad"
	},
	{
	  length: "100px",
	  state: "ok"
	},
	{
	  length: "50px",
	  state: "good"
	},
      ]
    }
  ];
}

function createDomRender(renderPlan) {
  const timelineRowsWrapper = document.createElement("div");

  for(let tuneRenderPlan of renderPlan) {
    const timelineRow = document.createElement("div");
    timelineRow.className = "timeline-row";

    attatchInfoToTimelineRow(timelineRow, tuneRenderPlan.tuneInfo);
    attatchSegmentsToTimelineRow(timelineRow, tuneRenderPlan.segments);

    timelineRowsWrapper.appendChild(timelineRow);
  }

  return timelineRowsWrapper;
}

function attatchSegmentsToTimelineRow(timelineRow, tuneSegments) {
  const tuneTimelineElem = document.createElement("div");
  tuneTimelineElem.className = "tune-timeline";

  for(let segment of tuneSegments) {
    const segmentElement = document.createElement("div");
    segmentElement.className = "timeline-segment";
    segmentElement.setAttribute("state", segment.state);
    segmentElement.style.width = segment.length;

    tuneTimelineElem.appendChild(segmentElement);
  }

  timelineRow.appendChild(tuneTimelineElem);
}

function attatchInfoToTimelineRow(timelineRow, tuneInfo) {
  const tuneInfoElem = document.createElement("div");
  tuneInfoElem.className = "tune-info";

  const title = document.createElement("h2");
  title.textContent = tuneInfo.title;

  const genere = document.createElement("span");
  genere.textContent = tuneInfo.genere;

  tuneInfoElem.appendChild(title);
  tuneInfoElem.appendChild(genere);

  timelineRow.appendChild(tuneInfoElem);
}


function generateMetricWrapper(metricName, metricValue) {
  const metricWrapper = document.createElement("div");
  metricWrapper.className = "metric";
  
  const metricNameDisplay = document.createElement("strong");
  const metricValueDisplay = document.createElement("span");

  metricNameDisplay.textContent = metricName + ": ";
  metricValueDisplay.textContent = metricValue;

  metricWrapper.appendChild(metricNameDisplay);
  metricWrapper.appendChild(metricValueDisplay);

  return metricWrapper;
}
