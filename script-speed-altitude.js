document.addEventListener('DOMContentLoaded', function() {
  let calculateSpeedAltitudeBtn = document.getElementById('calculateSpeedAltitudeBtn');
  calculateSpeedAltitudeBtn.addEventListener('click', calculateSpeedAltitude);
});

function calculateSpeedAltitude() {
  let distanceInput = document.getElementById('distanceInput');
  let speedOutput = document.getElementById('speedOutput');
  let altitudeOutput = document.getElementById('altitudeOutput');
  let chartCanvas = document.getElementById('chartAltitude');
  let launchAngleInput = document.getElementById('launchAngleInput');

  let distance = parseFloat(distanceInput.value);
  let resistanceCoefficient = 1.0;
  let launchAngle = parseFloat(launchAngleInput.value);
  let launchAngleRadians = launchAngle * (Math.PI / 180);
  let bomb = document.getElementById('bombSelect').value;

  // Коэффициенты для расчета дальности в зависимости от выбранной бомбы
  let coefficientA = 1.5;
  let coefficientB = 2.0;
  
  let bombCoefficientA = coefficientA;
  let bombCoefficientB = coefficientB;

  // Установка коэффициентов для выбранной бомбы
  if (bomb === 'gbu-10') {
    bombCoefficientA = 2.0;
    bombCoefficientB = 2.5;
  } else if (bomb === 'gbu-12') {
    bombCoefficientA = 1.5;
    bombCoefficientB = 2.0;
  } else if (bomb === 'gbu-16') {
    bombCoefficientA = 1.2;
    bombCoefficientB = 1.8;
  }

  if (bomb === 'gbu-10') {
    resistanceCoefficient = 0.8;
  } else if (bomb === 'gbu-12') {
    resistanceCoefficient = 0.9;
  } else if (bomb === 'gbu-16') {
    resistanceCoefficient = 1.0;
  }

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

      let calculatedDistance = calculateDistance(speed, altitude, launchAngleRadians, resistanceCoefficient);

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
    } else if (calculateDistance(speed, minAltitude, launchAngleRadians) < distance) {
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

  let minX = Infinity;
  let maxX = -Infinity;

  for (let currentSpeed = minSpeed; currentSpeed <= maxSpeed; currentSpeed += epsilon) {
    let currentAltitude = calculateAltitude(distance, currentSpeed, launchAngleRadians);

    if (Math.abs(currentAltitude - prevAltitude) >= 50) {
      chartData.push({ x: currentAltitude, y: currentSpeed });
      prevAltitude = currentAltitude;
      minX = Math.min(minY, currentSpeed);
      maxX = Math.max(maxY, currentSpeed);
    }
  }

  let ctx = chartCanvas.getContext('2d');

  if (window.chartInstance) {
    window.chartInstance.destroy();
  }

  let minY = chartData.reduce((min, dataPoint) => Math.min(min, dataPoint.x), Infinity);
  let maxY = chartData.reduce((max, dataPoint) => Math.max(max, dataPoint.x), -Infinity);
  let minXAxis = minY - 100;
  let maxXAxis = maxY + 100; 

  // Загрузка изображения бомбы
  let bombImage = new Image();
  bombImage.src = './assets/bomb.svg';

  bombImage.onload = function() {
    // Создание графика с использованием изображения бомбы
    window.chartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'График скорости-высоты',
          data: chartData,
          backgroundColor: 'rgba(54, 162, 235, 1)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointStyle: bombImage,
          pointRadius: 15,
          pointHoverRadius: 15,
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Скорость (км/ч)' // Изменен текст оси X
            },
            type: 'linear',
            position: 'bottom',
            min: minXAxis,
            max: maxXAxis,
            ticks: {
              stepSize: 100
            }
          },
          y: {
            title: {
              display: true,
              text: 'Высота (метры)' // Изменен текст оси Y
            },
            type: 'linear',
            position: 'left',
            min: minY - 1000,  // Установка начального значения оси Y с учетом отступа
            max: maxY + 1000,  // Установка конечного значения оси Y с учетом отступа
            ticks: {
              stepSize: 1000
            }
          }
        }
      }
    });
  };
}

function calculateDistance(speed, altitude, launchAngleRadians, resistanceCoefficient) {
  // Коэффициенты для расчета дальности
  let coefficientA = 1.5;
  let coefficientB = 2.0;

  // Формула для расчета дальности с учетом угла пуска
  let distance = (coefficientA * speed + coefficientB * altitude * resistanceCoefficient) * Math.cos(launchAngleRadians);

  return distance;
}

function calculateAltitude(distance, speed, launchAngleRadians) {
  // Коэффициенты для расчета высоты
  let coefficientA = 1.5;
  let coefficientB = 2.0;

  // Формула для расчета высоты с учетом угла пуска
  let altitude = (distance - coefficientA * speed * Math.cos(launchAngleRadians)) / (coefficientB * Math.cos(launchAngleRadians));

  return altitude;
}
