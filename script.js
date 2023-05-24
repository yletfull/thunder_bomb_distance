function openTab(tabName, button) {
    // Получаем все элементы с классом "tabcontent" и скрываем их
    let tabContents = document.getElementsByClassName('tabcontent');
    for (let i = 0; i < tabContents.length; i++) {
      tabContents[i].style.display = 'none';
    }
  
    // Получаем все элементы с классом "tablink" и удаляем класс "active"
    let tabLinks = document.getElementsByClassName('tablink');
    for (let i = 0; i < tabLinks.length; i++) {
      tabLinks[i].classList.remove('active');
    }
  
    // Показываем выбранный таб и добавляем класс "active" к кнопке
    document.getElementById(tabName).style.display = 'block';
    button.classList.add('active');
  }
  
  // По умолчанию открываем первую вкладку
  openTab('distanceTab', document.getElementsByClassName('tablink')[0]);
  