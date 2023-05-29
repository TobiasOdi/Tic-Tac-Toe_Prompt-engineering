let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

let WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontale Gewinnkombinationen
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertikale Gewinnkombinationen
  [0, 4, 8], [2, 4, 6] // Diagonale Gewinnkombinationen
];

function init() {
    render();
}

function render() {
  const table = document.createElement('table');
  const contentDiv = document.getElementById('content');
  
  for (let i = 0; i < 3; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement('td');
      const index = i * 3 + j;
      if (fields[index] === 'cross') {
        cell.innerHTML = generateCrossSVG();
      } else if (fields[index] === 'circle') {
        cell.innerHTML = generateCircleSVG();
      }
      cell.setAttribute('onclick', `handleClick(${index})`); // Hinzufügen des onclick-Attributs
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  
    contentDiv.innerHTML = '';
    contentDiv.appendChild(table);
}

function generateCircleSVG() {
  const svgCode = `
    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70">
      <circle cx="35" cy="35" r="30" fill="none" stroke="#00B0EF" stroke-width="5">
        <animate attributeName="r" from="0" to="30" dur="500ms" fill="freeze" />
      </circle>
    </svg>
  `;

  return svgCode;
}

function generateCrossSVG() {
  const width = 70;
  const height = 70;
  const color = "yellow";
  
  const svgCode = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <line x1="0" y1="0" x2="${width}" y2="${height}" stroke="${color}" stroke-width="5">
        <animate attributeName="x2" from="0" to="${width}" dur="500ms" fill="freeze" />
        <animate attributeName="y2" from="0" to="${height}" dur="500ms" fill="freeze" />
      </line>
      <line x1="${width}" y1="0" x2="0" y2="${height}" stroke="${color}" stroke-width="5">
        <animate attributeName="x2" from="${width}" to="0" dur="500ms" fill="freeze" />
        <animate attributeName="y2" from="0" to="${height}" dur="500ms" fill="freeze" />
      </line>
    </svg>
  `;

  return svgCode;
}
  
function handleClick(index) {
  const cell = event.target;
  const symbol = fields[index];

  if (!symbol) {
    if (fields.filter(field => field !== null).length % 2 === 0) {
      fields[index] = 'circle';
      cell.innerHTML = generateCircleSVG();
    } else {
      fields[index] = 'cross';
      cell.innerHTML = generateCrossSVG();
    }

    cell.removeAttribute('onclick'); // Entfernen des onclick-Attributs

    if (isGameFinished()) {
      // Spiel vorbei
      const winCombination = getWinningCombination();
      drawWinningLine(winCombination);
    }
  }
}

function isGameFinished(){
  return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if(fields[a] === fields[b] && fields[b] === fields[c] && fields[c] !== null) {
      return WINNING_COMBINATIONS[i];
    }
  }
  return null;
}

function drawWinningLine(combination) {
  const lineColor = '#ffffff';
  const lineWidth = 5;
  const startCell = document.querySelectorAll(`td`)[combination[0]];
  const endCell = document.querySelectorAll(`td`)[combination[2]];
  const startRect = startCell.getBoundingClientRect();
  const endRect = endCell.getBoundingClientRect();

  const contentRect = document.getElementById('content').getBoundingClientRect();

  const lineLength = Math.sqrt(
    Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
  );
  const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

  const line =  document.createElement('div');
  line.style.position = 'absolute';
  line.style.width = `${lineLength}px`;
  line.style.height = `${lineWidth}px`;
  line.style.backgroundColor = lineColor;
  line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top}px`;
  line.style.left = `${startRect.left + startRect.width / 2 - contentRect.left}px`;
  line.style.transform = `rotate(${lineAngle}rad)`;
  line.style.transformOrigin = 'top left';
  document.getElementById('content').appendChild(line);
}

function restartGaem(){
  fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  ]
  render();
}
  