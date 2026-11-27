// The one place the workshop's details live. Pages that load this file
// (the thank-you page, and later pages) show these dates automatically.
// Dates are YYYY-MM-DD, times are 24-hour, all in India time.
window.ASPW = {
  name: "The Art & Science of Photography",
  start: "2026-12-19",          // first day
  end: "2026-12-20",            // last day (consecutive days)
  startTime: "09:30",
  endTime: "17:30",
  arriveBy: "9:15 am",
  venue: "Toehold, Jayanagar, Bengaluru",
  bring: "Your camera, charged, with an empty memory card",
  fee: 7500,                    // before GST, used for tracking
  fullCreditBy: "2026-12-14",   // cancel on or before this date: 100% credit note
  halfCreditTo: "2026-12-17"    // from the day after fullCreditBy to this date: 50% credit note
};

// Ready-made text and links built from the details above.
(function (w) {
  var tz = "Asia/Kolkata";
  function d(s) { return new Date(s + "T12:00:00+05:30"); }
  function parts(s) {
    var o = {};
    new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: tz })
      .formatToParts(d(s)).forEach(function (p) { o[p.type] = p.value; });
    o.mon = o.month.slice(0, 3);
    return o;
  }
  function addDays(s, n) { var x = d(s); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); }
  function time12(t) {
    var h = +t.slice(0, 2), m = t.slice(3);
    return (h % 12 || 12) + ":" + m + " " + (h < 12 ? "am" : "pm");
  }
  var a = parts(w.start), b = parts(w.end);
  var days = Math.round((d(w.end) - d(w.start)) / 864e5) + 1;
  var sameMonth = a.month === b.month && a.year === b.year;
  var half = parts(addDays(w.fullCreditBy, 1)), halfTo = parts(w.halfCreditTo), full = parts(w.fullCreditBy);

  w.text = {
    firstDay: a.day + " " + a.month,                                    // 19 December
    datesLong: sameMonth                                                // Saturday 19 and Sunday 20 December 2026
      ? a.weekday + " " + a.day + " and " + b.weekday + " " + b.day + " " + b.month + " " + b.year
      : a.weekday + " " + a.day + " " + a.month + " and " + b.weekday + " " + b.day + " " + b.month + " " + b.year,
    datesShort: sameMonth                                               // 19–20 Dec
      ? a.day + "–" + b.day + " " + b.mon
      : a.day + " " + a.mon + " – " + b.day + " " + b.mon,
    firstWeekday: a.weekday,                                            // Saturday
    time: time12(w.startTime) + " – " + time12(w.endTime) + (days > 1 ? ", " + (days === 2 ? "both" : "all") + " days" : ""),
    startTime: time12(w.startTime),                                     // 9:30 am
    days: days,
    fullCreditBy: full.weekday + " " + full.day + " " + full.mon,       // Monday 14 Dec
    halfCredit: half.weekday + " " + half.day + " and " + halfTo.weekday + " " + halfTo.day + " " + halfTo.mon
  };

  // Calendar entries: one event per day via a daily repeat.
  var stamp = function (day, t) { return day.replace(/-/g, "") + "T" + t.replace(":", "") + "00"; };
  var title = "Photography workshop with Jayanth (Toehold)";
  var details = w.name + ". " + w.bring + ".";
  w.calendar = {
    google: "https://calendar.google.com/calendar/render?action=TEMPLATE"
      + "&text=" + encodeURIComponent(title)
      + "&dates=" + stamp(w.start, w.startTime) + "/" + stamp(w.start, w.endTime)
      + "&ctz=" + tz
      + (days > 1 ? "&recur=" + encodeURIComponent("RRULE:FREQ=DAILY;COUNT=" + days) : "")
      + "&location=" + encodeURIComponent(w.venue)
      + "&details=" + encodeURIComponent(details),
    ics: [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Toehold Academy//ASPW//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VTIMEZONE", "TZID:Asia/Kolkata", "BEGIN:STANDARD", "DTSTART:19700101T000000",
      "TZOFFSETFROM:+0530", "TZOFFSETTO:+0530", "TZNAME:IST", "END:STANDARD", "END:VTIMEZONE",
      "BEGIN:VEVENT", "UID:aspw-" + w.start + "@campaigns.toehold.academy",
      "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z",
      "DTSTART;TZID=Asia/Kolkata:" + stamp(w.start, w.startTime),
      "DTEND;TZID=Asia/Kolkata:" + stamp(w.start, w.endTime),
      days > 1 ? "RRULE:FREQ=DAILY;COUNT=" + days : "",
      "SUMMARY:" + title, "LOCATION:" + w.venue.replace(/,/g, "\\,"), "DESCRIPTION:" + details.replace(/,/g, "\\,"),
      "END:VEVENT", "END:VCALENDAR"
    ].filter(Boolean).join("\r\n")
  };
})(window.ASPW);
