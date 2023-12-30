/* --- Data generation  --- */
export function generateData(settings) {
  const workingData = {};
  
  for(let i = 0; i < settings.numTunes; i++) {
    workingData[`pols${i}`] = {
      genere: "rørospols",
      rehersals: generateRandomRehersals(
	new Date(settings.startDate),
	new Date(settings.endDate),
	settings.maxRehersals
      )
    };
  }

  console.log(workingData);
  return workingData;
}

function generateRandomRehersals(startDate, endDate, maxNumRehersals) {
  const rehersals = {};
  const minLenDays = 7;  
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

