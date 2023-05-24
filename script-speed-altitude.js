document.addEventListener('DOMContentLoaded', function() {
  let calculateSpeedAltitudeBtn = document.getElementById('calculateSpeedAltitudeBtn');
  calculateSpeedAltitudeBtn.addEventListener('click', calculateSpeedAltitude);
});

function calculateSpeedAltitude() {
  let distanceInput = document.getElementById('distanceInput');
  let speedOutput = document.getElementById('speedOutput');
  let altitudeOutput = document.getElementById('altitudeOutput');
  let chartCanvas = document.getElementById('chartAltitude');


  let distance = parseFloat(distanceInput.value);

  // Заданные диапазоны скорости и высоты
  let minSpeed = 500;
  let maxSpeed = 1000;
  let minAltitude = 1000;
  let maxAltitude = 6000;

  let epsilon = 10;
  let iterations = 1000;

  let found = false;
  let speed = 0;
  let altitude = 0;

  // Бинарный поиск для приближенного вычисления скорости и высоты
  while (minSpeed <= maxSpeed) {
    speed = (minSpeed + maxSpeed) / 2;

    while (minAltitude <= maxAltitude) {
      altitude = (minAltitude + maxAltitude) / 2;

      let calculatedDistance = calculateDistance(speed, altitude);

      if (Math.abs(calculatedDistance - distance) < epsilon) {
        found = true;
        break;
      } else if (calculatedDistance < distance) {
        minAltitude = altitude + epsilon;
      } else {
        maxAltitude = altitude - epsilon;
      }

      minAltitude = parseFloat(minAltitude.toFixed(2)); // Округляем значения высоты
      maxAltitude = parseFloat(maxAltitude.toFixed(2)); // Округляем значения высоты
    }

    if (found) {
      break;
    } else if (calculateDistance(speed, minAltitude) < distance) {
      minSpeed = speed + epsilon;
    } else {
      maxSpeed = speed - epsilon;
    }

    minSpeed = parseFloat(minSpeed.toFixed(2)); // Округляем значения скорости
    maxSpeed = parseFloat(maxSpeed.toFixed(2)); // Округляем значения скорости
    minAltitude = 1000;
    maxAltitude = 6000;
  }

  // Вывод результата
  if (found) {
    speedOutput.textContent = speed.toFixed(2);
    altitudeOutput.textContent = altitude.toFixed(2);
  } else {
    speedOutput.textContent = 'Ошибка';
    altitudeOutput.textContent = 'Ошибка';
  }

  // Создание графика
  let chartData = [];
  let prevAltitude = minAltitude;

  let minY = Infinity;
  let maxY = -Infinity;

  for (let currentSpeed = minSpeed; currentSpeed <= maxSpeed; currentSpeed += epsilon) {
    let currentAltitude = calculateAltitude(distance, currentSpeed);

    if (Math.abs(currentAltitude - prevAltitude) >= 50) {
      chartData.push({ x: currentAltitude, y: currentSpeed });
      prevAltitude = currentAltitude;
      minY = Math.min(minY, currentSpeed);
      maxY = Math.max(maxY, currentSpeed);
    }
  }


  let ctx = chartCanvas.getContext('2d');

  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  let minX = chartData.reduce((min, dataPoint) => Math.min(min, dataPoint.x), Infinity);
  let maxX = chartData.reduce((max, dataPoint) => Math.max(max, dataPoint.x), -Infinity);
  let minYAxis = minY - 100;
  let maxYAxis = maxY + 100; 

  window.chartInstance = new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'График скорости-высоты',
        data: chartData,
        backgroundColor: 'rgba(54, 162, 235, 1)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointRadius: 3,
        pointHoverRadius: 5,
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Высота (метры)'
          },
          type: 'linear',
          position: 'bottom',
          min: minX - 1000,  // Установка начального значения оси x с учетом отступа
          max: maxX + 1000,  // Установка конечного значения оси x с учетом отступа
          ticks: {
            stepSize: 1000
          }
        },
        y: {
          title: {
            display: true,
            text: 'Скорость (км/ч)'
          },
          type: 'linear',
          position: 'left',
          min: minYAxis,
          max: maxYAxis,
          ticks: {
            stepSize: 100
          }
        }
      }
    }
  });
}

function calculateDistance(speed, altitude) {
  // Коэффициенты для расчета дальности
  let coefficientA = 1.5;
  let coefficientB = 2.0;

  // Формула для расчета дальности
  let distance = coefficientA * speed + coefficientB * altitude;

  return distance;
}

function calculateAltitude(distance, speed) {
  // Коэффициенты для расчета высоты
  let coefficientA = 1.5;
  let coefficientB = 2.0;

  // Формула для расчета высоты
  let altitude = (distance - coefficientA * speed) / coefficientB;

  return altitude;
}
