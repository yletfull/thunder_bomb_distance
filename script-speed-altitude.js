document.addEventListener('DOMContentLoaded', function() {
    let calculateSpeedAltitudeBtn = document.getElementById('calculateSpeedAltitudeBtn');
    calculateSpeedAltitudeBtn.addEventListener('click', calculateSpeedAltitude);
  });
  
  function calculateSpeedAltitude() {
    let distanceInput = document.getElementById('distanceInput');
    let speedOutput = document.getElementById('speedOutput');
    let altitudeOutput = document.getElementById('altitudeOutput');
  
    let distance = parseFloat(distanceInput.value);
  
    // Заданные диапазоны скорости и высоты
    let minSpeed = 700;
    let maxSpeed = 900;
    let minAltitude = 2000;
    let maxAltitude = 5000;
  
    // Начальные значения для итераций
    let speed = (minSpeed + maxSpeed) / 2;
    let altitude = (minAltitude + maxAltitude) / 2;
    let step = 100;
    let epsilon = 0.01;
    let iterations = 1000;
  
    // Итерации для приближенного вычисления скорости и высоты
    for (let i = 0; i < iterations; i++) {
      let calculatedDistance = calculateDistance(speed, altitude);
  
      // Проверка на достижение заданного значения расстояния
      if (Math.abs(calculatedDistance - distance) < epsilon) {
        speedOutput.textContent = speed.toFixed(2);
        altitudeOutput.textContent = altitude.toFixed(2);
        return;
      }
  
      // Изменение скорости и высоты в большую или меньшую сторону
      if (calculatedDistance < distance) {
        minSpeed = speed;
      } else {
        maxSpeed = speed;
      }
  
      if (calculatedDistance < distance) {
        minAltitude = altitude;
      } else {
        maxAltitude = altitude;
      }
  
      // Увеличение или уменьшение скорости и высоты в зависимости от текущего значения расстояния
      if (calculatedDistance < distance) {
        speed = (speed + maxSpeed) / 2;
        altitude = (altitude + maxAltitude) / 2;
      } else {
        speed = (speed + minSpeed) / 2;
        altitude = (altitude + minAltitude) / 2;
      }
  
      // Уменьшение шага для более точных итераций
      step /= 2;
    }
  
    // Вывод сообщения об ошибке, если не удалось найти достаточно близкое значение скорости и высоты
    speedOutput.textContent = "Ошибка";
    altitudeOutput.textContent = "Ошибка";
  }
  
  function calculateDistance(speed, altitude) {
    // Коэффициенты для расчета дальности
    let coefficientA = 1.5;
    let coefficientB = 2.0;
  
    // Формула для расчета дальности
    let distance = coefficientA * speed + coefficientB * altitude;
  
    return distance;
  }
  