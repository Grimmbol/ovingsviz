const contentWrapper = document.querySelector("main")
const legalStates = ["bad", "ok", "good", "banger"]
const timelineRowStates = createRandomTimelineStates(20, 20) 

for (timelineRowState of timelineRowStates) {
  const timelineRow = createTimelineRowFromState(timelineRowState)
  contentWrapper.append(timelineRow)
}


function createTimelineRowFromState(timelineRowState) {

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
  const resultTimelineRow = []
  for(let stateIndex = 0; stateIndex < maxStates; stateIndex += 1) {
    const randomState = legalStates[
      Math.floor(Math.random() * legalStates.length)
    ]
    resultTimelineRow.push(randomState)
  }

  return resultTimelineRow
}
