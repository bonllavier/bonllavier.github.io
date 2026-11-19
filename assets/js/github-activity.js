const weeks = document.querySelector('.github-weeks');
const monthName = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });

function drawCalendar(start, levels) {
    const date = new Date(start + 'T00:00:00Z');
    const fragment = document.createDocumentFragment();
    let week;
    for (const [index, level] of levels.entries()) {
        const weekday = date.getUTCDay();
        if (index === 0 || weekday === 0) {
            week = document.createElement('div');
            week.className = 'github-week';
            if (date.getUTCDate() <= 7) week.dataset.month = monthName.format(date);
            fragment.append(week);
        }
        const cell = document.createElement('i');
        cell.style.gridRow = weekday + 2;
        cell.dataset.level = level;
        week.append(cell);
        date.setUTCDate(date.getUTCDate() + 1);
    }
    weeks.replaceChildren(fragment);
}

drawCalendar(weeks.dataset.start, [...weeks.dataset.levels]);

const timestamp = document.querySelector('.github-updated time');
const formatDate = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' });

function showTimestamp(date) {
    timestamp.dateTime = date;
    timestamp.textContent = formatDate.format(new Date(date));
}

const localBadgeIcons = new Map(
    Array.from(document.querySelectorAll('.github-badges a'), link => [
        new URL(link.href).searchParams.get('achievement'), link.querySelector('img').src
    ])
);

function renderActivity(feed) {
    if (Date.parse(feed.updated) < Date.parse(timestamp.dateTime)) return;

    const badges = feed.achievements.map(badge => {
        const link = document.createElement('a');
        link.href = 'https://github.com/bonllavier?tab=achievements&achievement=' + encodeURIComponent(badge.slug);
        link.title = badge.name;
        const image = new Image(44, 44);
        const fallback = localBadgeIcons.get(badge.slug);
        if (fallback) {
            image.addEventListener('error', () => { image.src = fallback; }, { once: true });
        }
        image.src = badge.image;
        image.alt = badge.name;
        link.append(image);
        return link;
    });

    const cards = feed.projects.map(repo => {
        const card = document.createElement('a');
        card.href = repo.url;
        const name = document.createElement('strong');
        name.textContent = repo.name;
        const stars = document.createElement('span');
        stars.textContent = '☆ ' + repo.stars;
        stars.setAttribute('aria-label', repo.stars + ' stars');
        card.append(name, stars);
        return card;
    });

    drawCalendar(feed.start, [...feed.levels]);
    document.querySelector('#contribution-count').textContent = feed.total + ' contributions in the last year';
    document.querySelector('.github-badges').replaceChildren(...badges);
    document.querySelector('.github-achievements').hidden = badges.length === 0;
    const projects = document.querySelector('.github-projects');
    projects.replaceChildren(projects.querySelector('h3'), ...cards, projects.querySelector('.github-history'));
    showTimestamp(feed.updated);
}

const feedURL = 'https://raw.githubusercontent.com/bonllavier/bonllavier.github.io/github-activity/activity.json';
const cacheKey = 'bonllavier-public-github-activity-v1';

async function refreshActivity() {
    if (document.hidden) return;
    try {
        const response = await fetch(feedURL, { cache: 'no-cache' });
        if (!response.ok) return;
        const feed = await response.json();
        renderActivity(feed);
        localStorage.setItem(cacheKey, JSON.stringify(feed));
    } catch {
        // Keep the most recent verified snapshot and its timestamp visible.
    }
}

showTimestamp(timestamp.dateTime);
try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) renderActivity(JSON.parse(cached));
} catch {
    // The embedded snapshot also works with browser storage disabled.
}
refreshActivity();
document.addEventListener('visibilitychange', refreshActivity);
window.addEventListener('online', refreshActivity);
setInterval(refreshActivity, 15 * 60 * 1000);
