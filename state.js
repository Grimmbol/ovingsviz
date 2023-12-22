const dataDisplayWrapper = document.querySelector("rehersal-viz")
const statsDisplayWrapper = document.querySelector("stats")
const generateButton = document.querySelector("header .generate")
let data = null
let stats = null

generateData()
produceStats()
displayData()
displayStats()

generateButton.addEventListener('click', (event) => {
  clear()
  generateData()
  displayData()
  produceStats()
  displayStats()
})

/* --- high-level api --- */
function generateData() {
  data = createRandomTimelineStates(20, 20)
}


function displayData() {
  for (timelineRowState of data) {
    const timelineRow = createTimelineRowFromState(timelineRowState)
    dataDisplayWrapper.append(timelineRow)
  }
}


function displayStats() {
  for (let metric in stats) {
    const metricName = metric
    const metricValue = stats[metric]
    const metricWrapper = generateMetricWrapper(metricName, metricValue)
    statsDisplayWrapper.appendChild(metricWrapper)
  }
}

function produceStats() {
  const tempStats = {
    bad: 0,
    ok: 0,
    good: 0,
    banger: 0
  }

  for(let timeLineRow of data) {
    for(let entry of timeLineRow) {
      tempStats[entry] += 1
    }
  }
  
  stats = tempStats
}

function clear() {
  dataDisplayWrapper.replaceChildren()
  statsDisplayWrapper.replaceChildren()
  data = null
  stats = null
}

/* --- render helpers --- */
function generateMetricWrapper(metricName, metricValue) {
  const metricWrapper = document.createElement("div")
  metricWrapper.className = "metric"
  
  const metricNameDisplay = document.createElement("strong")
  const metricValueDisplay = document.createElement("span")

  metricNameDisplay.textContent = metricName + ": "
  metricValueDisplay.textContent = metricValue

  metricWrapper.appendChild(metricNameDisplay)
  metricWrapper.appendChild(metricValueDisplay)

  return metricWrapper
}

/* --- generation functions --- */
function createTimelineRowFromState(timelineRowState) {
  const legalStates = ["bad", "ok", "good", "banger"]
  const timelineRowElement = document.createElement("div")
  timelineRowElement.className = "timeline-row"
  for (const state of timelineRowState) {
    if(!legalStates.includes(state)) {
      console.error(
	`Could not create segment for state ${state}: legal states are ${legalStates}`
      )
      continue
    }
    const newSegment = document.createElement("span")
    newSegment.className = "segment"
    newSegment.setAttribute("state", state)

    timelineRowElement.appendChild(newSegment)
    
  }

  return timelineRowElement
}

function createRandomTimelineStates(numRows, maxStates) {
  const resultStates = []
  for(let curRowIndex = 0; curRowIndex < numRows; curRowIndex += 1) {
    const randomRow = createRandomTimelineRow(maxStates)
    resultStates.push(randomRow)
  }

  return resultStates
}

function createRandomTimelineRow(maxStates) {
  const legalStates = ["bad", "ok", "good", "banger"]
  const resultTimelineRow = []
  for(let stateIndex = 0; stateIndex < maxStates; stateIndex += 1) {
    const randomState = legalStates[
      Math.floor(Math.random() * legalStates.length)
    ]
    resultTimelineRow.push(randomState)
  }

  return resultTimelineRow
}
