const arrowIcon = '<span class="arrow-icon" aria-hidden="true"><svg viewBox="0 0 18 18"><path d="M3 15 15 3M7 3h8v8"/></svg></span>';
document.querySelectorAll('a').forEach(link => { link.innerHTML = link.innerHTML.replaceAll('↗', arrowIcon).replaceAll('↘', arrowIcon); });
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => document.body.classList.add('navigated')));
