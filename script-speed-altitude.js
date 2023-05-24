function calculateSpeedAltitude() {
    let distanceInput = document.getElementById('distanceInput');
    let speedOutput = document.getElementById('speedOutput');
    let altitudeOutput = document.getElementById('altitudeOutput');
  
    let distance = parseFloat(distanceInput.value);
    
    // Расчет скорости и высоты
    let speed = distance / coefficientA;
    let altitude = (distance - coefficientA * speed) / coefficientB;
  
    // Вывод рассчитанных значений
    speedOutput.textContent = speed.toFixed(2);
    altitudeOutput.textContent = altitude.toFixed(2);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    let calculateSpeedAltitudeBtn = document.getElementById('calculateSpeedAltitudeBtn');
    calculateSpeedAltitudeBtn.addEventListener('click', calculateSpeedAltitude);
  });
  