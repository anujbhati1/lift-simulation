//Global Variables
const floorInput = document.getElementById('floors');
const liftInput = document.getElementById('lifts');
let lifts = [];
let queue = [];
let intervalId; //For clearing the interval

function createFloorAndLifts() {
  const container = document.getElementById('container');
  container.innerHTML = '';

  let noOfFloors = floorInput.value;
  let noOfLifts = liftInput.value;

  // Create floors
  for (let i = noOfFloors; i >= 1; i--) {
    const floor = document.createElement('div');
    floor.className = 'floor';
    // floor.dataset.floor = i;
    floor.innerHTML = `
      <div class="floor">
        <div class="lift-view" data-floor="${i}">
          <div class="btn-view">
            <button onclick="saveFloorId(${i}, 'up')" class="btn-up">Up</button>
            <button onclick="saveFloorId(${i}, 'down')" class="btn-down">Down</button>
          </div>
        </div>
        <div class="text-box">Floor ${i}</div>
      </div>
    `;
    container.appendChild(floor);
  }

  //Create Lifts and place lifts
  const liftContainer = document.createElement('div');
  liftContainer.className = 'lift-container';
  for (let i = 1; i <= noOfLifts; i++) {
    const lift = document.createElement('div');
    lift.className = 'lift';
    lift.id = `l${i}`;
    lift.style.left = `${15 + 10 * i}%`;
    let liftObj = {
      id: i,
      lift: lift,
      currentFloor: 1,
      moving: false,
    };

    lifts.push(liftObj);

    liftContainer.appendChild(lift);
  }
  container.appendChild(liftContainer);
}

function selectLiftForFloor(floor) {
  let selectedLiftId;
  let minDistance = Infinity;

  for (lft of lifts) {
    if (!lft.moving && Math.abs(floor - lft.currentFloor) < minDistance) {
      minDistance = Math.abs(floor - lft.currentFloor);
      selectedLiftId = lft;
    }
  }

  return selectedLiftId;
}

function saveFloorId(id, type) {
  queue.push(id);
  console.log(`Save floor id ${id} and type ${type} in queue.`);
}

function stopLift(liftId) {
  for (lift of lifts) {
    if (lift.id === liftId) {
      lift.moving = false;
    }
  }
  console.log('Lift Stopped with id', liftId);
}

function moveLift(lift, floor) {
  let distance = -1 * (floor - 1) * 175;
  let liftId = lift.id;
  let from = lift.currentFloor;
  lift.currentFloor = floor;
  lift.moving = true;
  let liftDiv = lift.lift;
  liftDiv.style.transform = `translateY(${distance}%)`;
  let time = 2 * Math.abs(from - floor);
  liftDiv.style.transitionDuration = `${time}s`;

  console.log('This is distance', distance);
  setTimeout(() => {
    stopLift(liftId);
  }, time);
}

function checkScheduling() {
  console.log('Check schedulling called');
  if (queue.length === 0) return;
  floorId = queue.shift();
  let lift = selectLiftForFloor(floorId);
  if (!lift) {
    queue.unshift(floorId);
    return;
  }
  moveLift(lift, floorId);
  console.log('!!!', lift, floorId);
}

function startSimulation() {
  clearInterval(intervalId);
  queue = [];
  lifts = [];
  createFloorAndLifts();
  intervalId = setInterval(checkScheduling, 500);
}
