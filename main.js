let boardCount = 1;
let colors = Array(16).fill('#000000');
let isMouseDown = false;

document.addEventListener('mousedown', () => isMouseDown = true);
document.addEventListener('mouseup', () => isMouseDown = false);

function updateBrightnessLabel(val) {
  document.getElementById('brightVal').innerText = val;
}

function changeBoardCount() {
  boardCount = parseInt(document.getElementById('boardCount').value);
  const totalLeds = boardCount * 16;
  
  const oldColors = colors;
  colors = Array(totalLeds).fill('#000000');
  for (let i = 0; i < Math.min(oldColors.length, totalLeds); i++) {
    colors[i] = oldColors[i];
  }

  renderBoards();
}

function renderBoards() {
  const container = document.getElementById('boardsContainer');
  container.innerHTML = '';

  for (let b = 0; b < boardCount; b++) {
    const boardWrapper = document.createElement('div');
    boardWrapper.className = 'board-wrapper';
    
    const title = document.createElement('div');
    title.className = 'board-title';
    title.innerText = 'Board ' + (b + 1) + ' (LEDs ' + (b * 16) + '-' + (b * 16 + 15) + ')';
    boardWrapper.appendChild(title);

    const table = document.createElement('table');
    table.className = 'matrix-table';

    for (let r = 0; r < 4; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < 4; c++) {
        // Serpentine calculation: even columns go top->bottom, odd columns go bottom->top
        const localIndex = (c % 2 === 0) ? (c * 4 + r) : (c * 4 + (3 - r));
        const globalIndex = (b * 16) + localIndex;
        
        const td = document.createElement('td');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cell';
        btn.id = 'cell-' + globalIndex;
        btn.style.backgroundColor = colors[globalIndex] || '#000000';
        btn.setAttribute('onclick', 'paintCell(' + globalIndex + ')');
        btn.setAttribute('onmouseenter', 'paintCellHover(' + globalIndex + ')');
        
        td.appendChild(btn);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    boardWrapper.appendChild(table);
    container.appendChild(boardWrapper);
  }
}

function paintCell(index) {
  const selectedColor = document.getElementById('colorPicker').value;
  colors[index] = selectedColor;
  
  const cellBtn = document.getElementById('cell-' + index);
  if (cellBtn) {
    cellBtn.style.backgroundColor = selectedColor;
  }
}

function paintCellHover(index) {
  if (isMouseDown) {
    paintCell(index);
  }
}

function clearMatrix() {
  colors = Array(boardCount * 16).fill('#000000');
  for (let i = 0; i < colors.length; i++) {
    const cellBtn = document.getElementById('cell-' + i);
    if (cellBtn) {
      cellBtn.style.backgroundColor = '#000000';
    }
  }
  document.getElementById('codeOutput').value = '';
}

function generateCode() {
  const totalPixels = boardCount * 16;
  const brightness = document.getElementById('brightness').value;
  const hexFormatted = colors.map(c => '0x' + c.replace('#', '').toUpperCase());

  let code = '#include <Adafruit_NeoPixel.h>\n\n';
  code += '#define PIN 9\n';
  code += '#define NUMPIXELS ' + totalPixels + '\n\n';
  code += 'Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);\n\n';
  code += 'const uint32_t matrixColors[' + totalPixels + '] = {\n';
  code += '  ' + hexFormatted.join(', ') + '\n';
  code += '};\n\n';
  code += 'void setup() {\n';
  code += '  pixels.begin();\n';
  code += '  pixels.setBrightness(' + brightness + ');\n';
  code += '}\n\n';
  code += 'void loop() {\n';
  code += '  for (int i = 0; i < ' + totalPixels + '; i++) {\n';
  code += '    pixels.setPixelColor(i, matrixColors[i]);\n';
  code += '  }\n';
  code += '  pixels.show();\n';
  code += '}\n';

  document.getElementById('codeOutput').value = code;
}