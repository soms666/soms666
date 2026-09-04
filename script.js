const arrowIcon = '<span class="arrow-icon" aria-hidden="true"><svg viewBox="0 0 18 18"><path d="M3 15 15 3M7 3h8v8"/></svg></span>';
document.querySelectorAll('a').forEach(link => { link.innerHTML = link.innerHTML.replaceAll('↗', arrowIcon).replaceAll('↘', arrowIcon); });
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => document.body.classList.add('navigated')));

fetch('data/latest.json?v=' + Date.now()).then(response => response.json()).then(({ items, journal, ride }) => {
  if (!items?.length) return;
  document.querySelectorAll('.ride-card').forEach((card, index) => {
    const item = items[index];
    if (!item) return;
    card.href = `https://www.youtube.com/watch?v=${item.videoId}`;
    card.querySelector('.card-image').style.backgroundImage = `linear-gradient(0deg,rgba(5,7,9,.82),transparent),url('https://i.ytimg.com/vi/${item.videoId}/maxresdefault.jpg')`;
    card.querySelector('.card-body h3').textContent = item.title;
    card.querySelector('.card-body p').textContent = item.description || 'A fresh note from the road.';
  });
  const journalTitle = document.querySelector('.journal-text h3');
  const journalBody = document.querySelector('.journal-text p:not(.eyebrow)');
  if (journalTitle) journalTitle.textContent = journal.title;
  if (journalBody) journalBody.textContent = journal.body;
  if (ride?.route?.length) {
    const card = document.querySelector('[data-route-card]');
    const line = document.querySelector('[data-route-line]');
    if (card && line) {
      card.hidden = false;
      line.setAttribute('points', ride.route.map(point => `${point.x},${point.y}`).join(' '));
      document.querySelector('[data-route-distance]').textContent = `${ride.distanceKm} km`;
      document.querySelector('[data-route-duration]').textContent = ride.durationMinutes ? `${Math.floor(ride.durationMinutes / 60)}h ${ride.durationMinutes % 60}m` : '—';
      document.querySelector('[data-route-speed]').textContent = ride.averageKmh ? `${ride.averageKmh} km/h` : '—';
    }
  }
}).catch(() => {});
