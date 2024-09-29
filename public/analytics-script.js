// File: public/analytics-script.js

(function() {
  function sendAnalytics(event) {
    const data = new FormData();
    data.append('event', event);
    data.append('url', window.location.href);
    data.append('referrer', document.referrer);
    data.append('userAgent', navigator.userAgent);
    data.append('language', navigator.language);
    data.append('timestamp', new Date().toISOString());

    fetch('https://analytics-dashboard-ivory.vercel.app/api/analytics', {
      method: 'POST',
      body: data
    }).catch(console.error);
  }

  // Send pageview event when the script loads
  sendAnalytics('pageview');

  // Optionally, you can track other events
  // For example, track clicks:
  document.addEventListener('click', function() {
    sendAnalytics('click');
  });
})();