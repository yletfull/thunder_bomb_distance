document.addEventListener('DOMContentLoaded', function() {
  let calculateDistanceBtn = document.getElementById('calculateBtn');
  let calculateSpeedAltitudeBtn = document.getElementById('calculateSpeedAltitudeBtn');

  calculateDistanceBtn.addEventListener('click', calculateDistance);
  calculateSpeedAltitudeBtn.addEventListener('click', calculateSpeedAltitude);

  function calculateDistance() {
    let speedInput = document.getElementById('speedInput');
    let altitudeInput = document.getElementById('altitudeInput');
    let tableOutput = document.getElementById('tableOutput').getElementsByTagName('tbody')[0];

    let speed = parseFloat(speedInput.value);
    let altitude = parseFloat(altitudeInput.value);

    // Коэффициенты для расчета дальности
    let coefficientA = 1.5;
    let coefficientB = 2.0;

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

    // Создание графика
    let chartData = [];
    for (let currentSpeed = startSpeed; currentSpeed <= endSpeed; currentSpeed += 50) {
      let distance = coefficientA * currentSpeed + coefficientB * altitude;
      chartData.push({ x: distance, y: currentSpeed });
    }

    let chartCanvas = document.getElementById('chart');
    let ctx = chartCanvas.getContext('2d');

    if (window.chartInstance) {
      window.chartInstance.destroy();
    }

    window.chartInstance = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: `График дальности полета при высоте ${altitudeInput.value} метров`,
          data: chartData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: 'Дистанция (метры)'
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Начальная скорость (км/ч)'
            }
          }
        }
      }
    });
  }

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
    speedOutput.textContent = 'Ошибка';
    altitudeOutput.textContent = 'Ошибка';
  }

});
