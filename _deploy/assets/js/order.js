document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('orderForm');
  if (!form) return;

  const dimW = document.getElementById('dimW');
  const dimL = document.getElementById('dimL');
  const dimH = document.getElementById('dimH');
  const margin = document.getElementById('margin');
  const calcVolume = document.getElementById('calcVolume');

  function currentVolume() {
    const w = parseFloat(dimW.value) || 0;
    const l = parseFloat(dimL.value) || 0;
    const h = parseFloat(dimH.value) || 0;
    const m = parseFloat(margin.value) || 0;
    return w * l * h * (1 + m / 100);
  }

  function recalc() {
    calcVolume.textContent = currentVolume().toFixed(2);
  }

  [dimW, dimL, dimH, margin].forEach(el => el.addEventListener('input', recalc));

  const NEARBY_FACTORIES = [
    { name: '대성레미콘 화성공장', location: '경기도 화성시 향남읍', distance: '2.3km', stock: 120, eta: '35분' },
    { name: '한라레미콘 평택공장', location: '경기도 평택시 청북읍', distance: '4.1km', stock: 85, eta: '50분' },
    { name: '동양레미콘 오산공장', location: '경기도 오산시 세교동', distance: '5.6km', stock: 40, eta: '1시간 10분' },
    { name: '삼표레미콘 안성공장', location: '경기도 안성시 공도읍', distance: '7.8km', stock: 200, eta: '1시간 25분' },
  ];

  const factoryResults = document.getElementById('factoryResults');
  const factoryList = document.getElementById('factoryList');
  const orderConfirm = document.getElementById('orderConfirm');
  const orderConfirmText = document.getElementById('orderConfirmText');
  const resetBtn = document.getElementById('orderReset');

  function renderFactoryList(neededVolume) {
    factoryList.innerHTML = '';
    NEARBY_FACTORIES.forEach(f => {
      const sufficient = f.stock >= neededVolume;
      const li = document.createElement('li');
      li.className = 'factory-card' + (sufficient ? '' : ' factory-card--insufficient');
      li.innerHTML = `
        <div class="factory-info">
          <span class="factory-distance">${f.distance}</span>
          <h3>${f.name}</h3>
          <p class="factory-location">${f.location}</p>
        </div>
        <div class="factory-stats">
          <div class="factory-stat">
            <span class="factory-stat-label">보유 재고</span>
            <span class="factory-stat-value">${f.stock} m³</span>
          </div>
          <div class="factory-stat">
            <span class="factory-stat-label">예상 도착</span>
            <span class="factory-stat-value">${f.eta}</span>
          </div>
        </div>
        ${sufficient
          ? `<button type="button" class="btn btn-primary btn-sm" data-factory="${f.name}">선택</button>`
          : `<span class="factory-badge">재고 부족</span>`}
      `;
      factoryList.appendChild(li);
    });

    factoryList.querySelectorAll('button[data-factory]').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-factory');
        factoryResults.hidden = true;
        orderConfirmText.innerHTML = `<strong>${name}</strong>에 매칭 요청을 보냈습니다.<br>공장이 재고와 배차 가능 여부를 확인한 뒤 곧 응답을 드립니다.`;
        orderConfirm.hidden = false;
        orderConfirm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const needed = currentVolume();
    renderFactoryList(needed);
    form.hidden = true;
    factoryResults.hidden = false;
    factoryResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  resetBtn.addEventListener('click', () => {
    orderConfirm.hidden = true;
    factoryResults.hidden = true;
    form.hidden = false;
    form.reset();
    recalc();
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
