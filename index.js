function initSimulation() {
  const floors = document.getElementById('floors').value;
  const lifts = document.getElementById('lifts').value;

  const container = document.getElementById('container');
  container.innerHTML = '';

  // Create floors
  for (let i = floors; i >= 1; i--) {
    const floor = document.createElement('div');
    floor.className = 'floor';
    floor.innerHTML = `
      <div class="floor">
        <div class="lift-view">
          <div class="btn-view">
            <button onclick="callLift(${i}, 'up')" class="btn-up">Up</button>
            <button onclick="callLift(${i}, 'down')" class="btn-down">Down</button>
          </div>
        </div>
        <div class="text-box">Floor ${i}</div>
      </div>
    `;
    container.appendChild(floor);
  }

  //Create Lifts
  const liftContainer = document.createElement('div');
  liftContainer.className = 'lift-container';
  for (let i = lifts; i >= 1; i--) {
    const lift = document.createElement('div');
    lift.className = 'lift';
    lift.id = `l${i}`;
    liftContainer.appendChild(lift);
  }
  container.appendChild(liftContainer);
}

function callLift(liftId, moveTo) {
  const elevators = document.getElementsByClassName('lift-container');
  const elevator = elevators[0];
}
