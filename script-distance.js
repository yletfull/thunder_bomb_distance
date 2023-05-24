document.addEventListener('DOMContentLoaded', function() {
  let calculateDistanceBtn = document.getElementById('calculateBtn');

  calculateDistanceBtn.addEventListener('click', calculateDistance);

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

    // Загрузка изображения бомбы
    let bombImage = new Image();
    bombImage.src = './assets/bomb.svg';

    bombImage.onload = function() {
      // Создание графика с использованием изображения бомбы
      window.chartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
          datasets: [{
            label: `График дальности полета при высоте ${altitudeInput.value} метров`,
            data: chartData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            pointStyle: bombImage,
            pointRadius: 15,
            pointHoverRadius: 15,
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
    };
  }
});