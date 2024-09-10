//Global Variables
const floorInput = document.getElementById('floors');
const liftInput = document.getElementById('lifts');
let lifts = [];
let queue = [];
let intervalId; //For clearing the interval
let liftLeftForFloors = [];

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
      <div class="btn-view">
        <button onclick="saveFloorId(${i}, 'up')" class="btn-up ${
      i === noOfFloors ? 'hide' : ''
    }">Up</button>
        <button onclick="saveFloorId(${i}, 'down')" class="btn-down ${
      i === 1 ? 'hide' : ''
    }">Down</button>
      </div>
        <div class="lift-view" data-floor="${i}">
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

    let leftDoor = document.createElement('div');
    let rightDoor = document.createElement('div');

    leftDoor.classList.add('lift-door', 'lift-door-left');
    rightDoor.classList.add('lift-door', 'lift-door-right');

    leftDoor.id = `ld${i}`;
    rightDoor.id = `rd${i}`;

    lift.appendChild(leftDoor);
    lift.appendChild(rightDoor);

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

function closeDoor(e) {
  console.log('This is closeDoor', e.target.id);
  let divId = e.target.id;
  let liftId = divId.substring(2);

  let leftDoor = document.getElementById(`ld${liftId}`);
  let rightDoor = document.getElementById(`rd${liftId}`);

  rightDoor.removeEventListener('webkitTransitionEnd', closeDoor);

  leftDoor.style.transform = 'translateX(0)';
  rightDoor.style.transform = 'translateX(0)';

  leftDoor.style.transition = 'all 2.5s ease-out';
  rightDoor.style.transition = 'all 2.5s ease-out';

  setTimeout(() => {
    stopLift(liftId);
  }, 2800);
}

function doorAnimation(e) {
  let divId = e.target.id;
  console.log('This is dooor animation', divId);
  let liftId = divId.substring(1);
  console.log('This is doorAnimationId', liftId);

  let lift = document.getElementById(`l${liftId}`);
  lift.removeEventListener('webkitTransitionEnd', doorAnimation);

  let leftDoor = document.getElementById(`ld${liftId}`);
  let rightDoor = document.getElementById(`rd${liftId}`);

  leftDoor.removeEventListener('webkitTransitionEnd', doorAnimation);
  rightDoor.removeEventListener('webkitTransitionEnd', doorAnimation);

  rightDoor.addEventListener('webkitTransitionEnd', closeDoor);

  leftDoor.style.transform = 'translateX(-100%)';
  rightDoor.style.transform = 'translateX(100%)';

  leftDoor.style.transition = 'all 2.5s ease-out';
  rightDoor.style.transition = 'all 2.5s ease-out';
}

function saveFloorId(id, type) {
  if (!liftLeftForFloors.includes(id)) {
    liftLeftForFloors.push(id);
    queue.push(id);
  }
  console.log(`Save floor id ${id} and type ${type} in queue.`);
}

function stopLift(liftId) {
  console.log('These are lifts', lifts);
  console.log('This is the stop id', liftId, typeof liftId);
  for (lift of lifts) {
    if (lift.id === Number(liftId)) {
      lift.moving = false;
      console.log('Lift Stopped with id', liftId);
    }
  }

  liftLeftForFloors.shift();
}

function moveLift(lift, floor) {
  let distance = -1 * (floor - 1) * 175;
  let liftId = lift.id;
  let from = lift.currentFloor;
  lift.currentFloor = floor;
  lift.moving = true;
  let liftDiv = lift.lift;
  liftDiv.addEventListener('webkitTransitionEnd', doorAnimation);
  liftDiv.style.transform = `translateY(${distance}%)`;
  let time = 2.5 * Math.abs(from - floor);
  liftDiv.style.transitionDuration = `${time}s`;

  if (time === 0) {
    let e = {};
    e.target = {};
    e.target.id = `l${liftId}`;
    doorAnimation(e);
  }

  console.log('This is distance', distance);
  // setTimeout(() => {
  //   stopLift(liftId);
  // }, time * 1000);
}

function checkScheduling() {
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
  let floors = floorInput.value;
  let lifts = liftInput.value;
  if (floors < 1) {
    alert('Floors must be greater than 0');
    return;
  }
  if (lifts < 1) {
    alert('Lifts must be greater 0');
    return;
  }
  clearInterval(intervalId);
  queue = [];
  lifts = [];
  createFloorAndLifts();
  intervalId = setInterval(checkScheduling, 300);
}
