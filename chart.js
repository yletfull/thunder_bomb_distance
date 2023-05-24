document.addEventListener('DOMContentLoaded', function() {
    let chartData = [];
    for (let currentSpeed = startSpeed; currentSpeed <= endSpeed; currentSpeed += 50) {
      let distance = coefficientA * currentSpeed + coefficientB * altitude;
      chartData.push({ x: distance, y: currentSpeed });
    }
  
    let chartCanvas = document.getElementById('chart');
    let ctx = chartCanvas.getContext('2d');
  
    new Chart(ctx, {
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
  });
  