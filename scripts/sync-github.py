"""Collect the public profile shown by the portfolio, using GitHub as the source."""
import json
import re
from datetime import date, datetime, timezone
from html.parser import HTMLParser
from urllib.request import Request, urlopen


def fetch(url):
    request = Request(url, headers={"User-Agent": "bonllavier-portfolio"})
    with urlopen(request, timeout=30) as response:
        return response.read().decode()


class Profile(HTMLParser):
    def __init__(self):
        super().__init__()
        self.badges = {}
        self.found_profile = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "vcard-username" in attrs.get("class", "").split():
            self.found_profile = True
        if tag == "img" and attrs.get("data-hovercard-type") == "achievement":
            slug = attrs["data-hovercard-url"].split("/achievements/")[1].split("/")[0]
            self.badges[slug] = dict(name=attrs["alt"].removeprefix("Achievement: "),
                                    image=attrs["src"], slug=slug)


class Calendar(HTMLParser):
    def __init__(self):
        super().__init__()
        self.days = {}
        self.heading = ""
        self.in_heading = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "h2":
            self.in_heading = attrs.get("id") == "js-contribution-activity-description"
        if tag == "td" and "data-date" in attrs:
            self.days[date.fromisoformat(attrs["data-date"])] = int(attrs["data-level"])

    def handle_endtag(self, tag):
        if tag == "h2":
            self.in_heading = False

    def handle_data(self, data):
        if self.in_heading:
            self.heading += data


profile = Profile()
profile.feed(fetch("https://github.com/bonllavier"))
calendar = Calendar()
calendar.feed(fetch("https://github.com/users/bonllavier/contributions"))
days = sorted(calendar.days)
total = re.search(r"([\d,]+)\s+contributions?\b", calendar.heading)
if not (profile.found_profile and total and 365 <= len(days) <= 372
        and (days[-1] - days[0]).days + 1 == len(days)
        and all(0 <= level <= 4 for level in calendar.days.values())):
    raise ValueError("Incomplete GitHub profile or calendar")

repos = json.loads(fetch("https://api.github.com/users/bonllavier/repos?sort=pushed&direction=desc&per_page=3"))
# Publishing the data branch updates this portfolio's pushed_at timestamp.
projects = [dict(name=r["name"], url=r["html_url"], stars=r["stargazers_count"])
            for r in repos if r["name"] != "bonllavier.github.io"][:2]
print(json.dumps(dict(updated=datetime.now(timezone.utc).isoformat(), start=days[0].isoformat(),
                      levels="".join(str(calendar.days[d]) for d in days),
                      total=int(total[1].replace(",", "")), projects=projects,
                      achievements=list(profile.badges.values())), indent=2))
