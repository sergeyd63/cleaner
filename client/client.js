const socket = io.connect('http://localhost:4040');

let floorPlan = [
    ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", "#", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", "#", "#", " ", "#", "#", "#", "#", "#", " ", " ", " ", " ", " ", "#", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", "#", "#", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", "#", "#", "#", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", "#", "#", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", "#", "#", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ["#", " ", "#", "#", "#", "#", "#", "#", "#", "#", " ", " ", " ", " ", "#", "#", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", " ", "#"],
    ["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]
];

generateVew();

socket.emit('floor', {
    floorPlan,
    start: { h: 2, v: 0 }
});

socket.on('clean', (data) => {
    let currentCell = document.getElementById(`${data.pos.h}:${data.pos.v}`);
    let stats = document.getElementById('divData');
    let robotProgress = document.getElementById('robotProgress');
    let imgDone = document.getElementById('imgDone');

    stats.innerHTML = `Cleaned: ${data.stats.cleaned} out of ${data.stats.totalToClean}`;
    robotProgress.value = data.stats.cleaned * 100 / data.stats.totalToClean;
    robotProgress.innerHTML = `${data.stats.cleaned * 100 / data.stats.totalToClean}%`;
    if (data.stats.cleaned * 100 / data.stats.totalToClean === 100) {
        imgDone.classList.add('show');
    }

    if (currentCell) {
        currentCell.innerHTML = data.status;
        currentCell.classList.add('blue');
    }
});

socket.on('position', (data) => {
    let currentCell = document.getElementById(`${data.pos.h}:${data.pos.v}`);
    let prev = document.getElementsByClassName('blue');

    if (prev.length > 0) {
        prev[0].classList.remove('blue');
    }

    if (currentCell) {
        currentCell.classList.add('blue');
    }
});

function generateVew() {
    let base = document.getElementById('app');

    for (let i = 0; i < floorPlan.length; i++) {
        let row = document.createElement('div');
        row.id = `row${i}`;
        row.classList.add('row')
        base.appendChild(row);
        for (let j = 0; j < floorPlan[i].length; j++) {
            let cell = document.createElement('div');
            cell.id = `${i}:${j}`;
            cell.innerHTML = floorPlan[i][j] === '#' ? 'W' : 'D';
            cell.classList.add('cell');
            row.appendChild(cell);
        }
    }
}