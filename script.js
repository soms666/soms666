const arrowIcon = '<span class="arrow-icon" aria-hidden="true"><svg viewBox="0 0 18 18"><path d="M3 15 15 3M7 3h8v8"/></svg></span>';
document.querySelectorAll('a').forEach(link => { link.innerHTML = link.innerHTML.replaceAll('↗', arrowIcon).replaceAll('↘', arrowIcon); });
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => document.body.classList.add('navigated')));

fetch('data/latest.json?v=' + Date.now()).then(response => response.json()).then(({ items, journal, ride, rideArchive = [] }) => {
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
  const routes = rideArchive.length ? rideArchive : (ride ? [ride] : []);
  const routeDate = (date) => date ? new Date(date).toLocaleString('sv-SE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '') : 'DATE —';
  if (routes.length) {
    const card = document.querySelector('[data-route-card]');
    const line = document.querySelector('[data-route-line]');
    if (card && line) {
      card.hidden = false;
      const renderRoute = (selected) => {
        line.setAttribute('points', selected.route.map(point => `${point.x},${point.y}`).join(' '));
        const totem = selected.totem || 'THE FOX';
        document.querySelector('[data-route-totem]').textContent = `TOTEM: ${totem}`;
        document.querySelector('[data-route-map-label]').textContent = `TOTEM · ${totem}`;
        document.querySelector('[data-route-distance]').textContent = `${selected.distanceKm} km`;
        document.querySelector('[data-route-duration]').textContent = selected.durationMinutes ? `${Math.floor(selected.durationMinutes / 60)}h ${selected.durationMinutes % 60}m` : '—';
        document.querySelector('[data-route-speed]').textContent = selected.averageKmh ? `${selected.averageKmh} km/h` : '—';
        document.querySelector('[data-route-date]').textContent = selected.date ? new Date(selected.date).toLocaleDateString('sv-SE') : 'DATE —';
        document.querySelector('[data-route-active]').textContent = selected.activeMinutes ? `ACTIVE ${Math.floor(selected.activeMinutes / 60)}h ${selected.activeMinutes % 60}m` : 'ACTIVE —';
        document.querySelector('[data-route-stopped]').textContent = selected.stoppedMinutes ? `STOPPED ${Math.floor(selected.stoppedMinutes / 60)}h ${selected.stoppedMinutes % 60}m` : 'STOPPED —';
        document.querySelector('[data-route-stops]').textContent = `STOPS ${selected.stopCount ?? '—'}`;
        document.querySelector('[data-route-elevation]').textContent = `ELEVATION +${selected.elevationGainM ?? '—'}m / -${selected.elevationLossM ?? '—'}m`;
        document.querySelector('[data-route-segments]').textContent = selected.segmentsKm?.length ? `SEGMENTS ${selected.segmentsKm.join(' · ')} km` : 'SEGMENTS —';
      };
      renderRoute(routes[0]);
      const list = document.querySelector('[data-route-list]');
      const archive = document.querySelector('[data-route-archive]');
      if (list && archive && routes.length > 1) {
        archive.hidden = false;
        routes.slice(0, 10).forEach((route, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.textContent = `${routeDate(route.date)} · ${route.distanceKm} km`;
          button.classList.toggle('is-selected', index === 0);
          button.addEventListener('click', () => {
            list.querySelectorAll('button').forEach((item) => item.classList.remove('is-selected'));
            button.classList.add('is-selected');
            renderRoute(routes[index]);
          });
          list.append(button);
        });
      }
    }
  }
}).catch(() => {});
