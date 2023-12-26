const dataDisplayWrapper = document.querySelector("rehersal-viz");
const statsDisplayWrapper = document.querySelector("stats");
const generateButton = document.querySelector("header .generate");
let timelineRenderSettings = {
  startDate: "2023-01-01",
  endDate: "2023-02-01"
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
  const renderPlan = createRenderPlan(data, timelineRenderSettings);
  const newDomRender = createDomRender(renderPlan);

  console.log(renderPlan);
  
  dataDisplayWrapper.appendChild(newDomRender);
}


/* --- render helpers --- */

/**
 * A render plan is ordered, both in segments and timelines
 * It should contain exactly *what* and *how* the program needs
 * to render the data, not *why*
 */
function createRenderPlan(rehersalData, renderSettings) {
  const firstDay = Date.parse(renderSettings.startDate);
  const lastDay = Date.parse(renderSettings.endDate);
  const timelineElementWidthString = window.getComputedStyle(dataDisplayWrapper).width;
  const timelineElementWidth =
	parseInt(
	  timelineElementWidthString
	    .substring(0, timelineElementWidthString.search("px"))
	) - 80;
  
  const timeBetweenStartAndEnd = lastDay - firstDay;
  const resultRenderPlan = [];
    
  for(let tune in rehersalData){
    const title = tune;
    const tuneData = rehersalData[tune]; 
    const genere = tuneData.genere;
    const rehersals = tuneData.rehersals;


    const renderSegmentsForTune = [];
    let lastTimestamp = firstDay;
    let lengthSoFar = 0;
    
    for(let rehersalDate in rehersals) {
      const rehersalState = rehersals[rehersalDate];

      const rehersalTimestamp = Date.parse(rehersalDate);
      const timeSinceLastTimestamp = rehersalTimestamp - lastTimestamp;
      const pixelLengthForTimestamp =
	    (timeSinceLastTimestamp / timeBetweenStartAndEnd) * timelineElementWidth;
      lastTimestamp = rehersalTimestamp;
      lengthSoFar += pixelLengthForTimestamp;

      
      renderSegmentsForTune.push({
	length: `${pixelLengthForTimestamp}px`,
	state: rehersalState
      });
    }

    if(lengthSoFar < timelineElementWidth) {
      const lastSegment = renderSegmentsForTune[renderSegmentsForTune.length - 1];
      const lengthOfLastSegment = parseInt(
	lastSegment.length.substring(0, lastSegment.length.search("px"))
      );
      const missingDistance = timelineElementWidth - lengthSoFar;
      const newSegmentDistance = lengthOfLastSegment + missingDistance;
      lastSegment.length = `${newSegmentDistance}px`;
    }
    
    resultRenderPlan.push({
      tuneInfo: {
	title: title,
	genere: genere,
      },
      segments: renderSegmentsForTune
    });
  }
  
  return resultRenderPlan;
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

/* --- Data generation  --- */
function generateData() {
  const workingData = {};
  const numTunes = 20;
  const maxRehersals = 100;
  
  for(let i = 0; i < numTunes; i++) {
    workingData[`pols${i}`] = {
      genere: "rørospols",
      rehersals: generateRandomRehersals(
	new Date(timelineRenderSettings.startDate),
	new Date(timelineRenderSettings.endDate),
	maxRehersals
      )
    };
  }

  console.log(workingData);
  
  data = workingData;
}

function generateRandomRehersals(startDate, endDate, maxNumRehersals) {
  const rehersals = {};
  const minLenDays = 1;  
  let maxRemainingRehersals = maxNumRehersals;
  let currentLastDate = startDate;
  while(maxRemainingRehersals > 0 && currentLastDate <= endDate) {
    const newRehersalDate =
	  getRandomDateInTimespan(
	    currentLastDate,
	    endDate,
	    minLenDays
	  );

    if(newRehersalDate > endDate) {
      break;
    }
    
    const newRehersalDateString =
      `${newRehersalDate.getFullYear()}-${newRehersalDate.getMonth() + 1}-${newRehersalDate.getDate()}`;
    rehersals[newRehersalDateString] = getRandomRehersalState();

    maxRemainingRehersals -= 1;
    currentLastDate = newRehersalDate;
  }

  return rehersals;
}

function getRandomRehersalState() {
  const rehersalStates = ["bad", "ok", "good", "banger"];
  const randomIndex = getRandomInt(0, rehersalStates.length);

  return rehersalStates[randomIndex];
}


function getRandomDateInTimespan(start, end, minLenDays) {
  const startMillis = start.getTime();
  const endMillis = end.getTime();

  const randomDayOffsetRangeDays =
	Math.floor((endMillis - startMillis) / (3600 * 24 * 1000));

  const randomNumDays = getRandomInt(minLenDays, randomDayOffsetRangeDays);
  const newOffsetDateMillis = startMillis + (randomNumDays * 3600 * 24 * 1000);
  
  const newOffsetDate = new Date(newOffsetDateMillis);
  
  return new Date(newOffsetDate);
}

/** From MDN 
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
*/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

