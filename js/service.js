if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Passed'))
      .catch((err) => console.log('Something went wrong..'));
  }