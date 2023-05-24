document.addEventListener('DOMContentLoaded', function() {
    let calculateBtn = document.getElementById('calculateBtn');
    calculateBtn.addEventListener('click', calculateDistance);
  });
  
  function calculateDistance() {
    let speedInput = document.getElementById('speedInput');
    let altitudeInput = document.getElementById('altitudeInput');
    let distanceOutput = document.getElementById('distanceOutput');
    let tableOutput = document.getElementById('tableOutput').getElementsByTagName('tbody')[0];
  
    let speed = parseFloat(speedInput.value);
    let altitude = parseFloat(altitudeInput.value);
  
    // Коэффициенты для расчета дальности
    let coefficientA = 1.5;
    let coefficientB = 2.0;
  
    // Формула для расчета дальности
    let distance = coefficientA * speed + coefficientB * altitude;
  
    // Вывод рассчитанной дальности
    distanceOutput.textContent = distance.toFixed(2);
  
    // Расчет и вывод таблицы для диапазона скоростей
    tableOutput.innerHTML = '';
  
    let startSpeed = speed - 200;
    let endSpeed = speed + 200;
  
    for (let currentSpeed = startSpeed; currentSpeed <= endSpeed; currentSpeed += 50) {
      let row = document.createElement('tr');
      let altitudeCell = document.createElement('td');
      let speedCell = document.createElement('td');
      let distanceCell = document.createElement('td');
  
      altitudeCell.textContent = altitude;
      speedCell.textContent = currentSpeed;
      distanceCell.textContent = (coefficientA * currentSpeed + coefficientB * altitude).toFixed(2);
  
      row.appendChild(altitudeCell);
      row.appendChild(speedCell);
      row.appendChild(distanceCell);
  
      if (altitude === parseFloat(altitudeInput.value) && currentSpeed === speed) {
        row.classList.add('highlight');
      }
  
      tableOutput.appendChild(row);
    }
  }
  