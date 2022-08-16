import { AppController } from './appController.js';
import { loadBars } from './service/localService.js';
import { FilterView } from './filter/filter.js';
import { BarView, LoadBarView } from './bar/bar.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-app.js';
import {
  getDatabase,
  ref,
  onValue,
} from 'https://www.gstatic.com/firebasejs/9.9.2/firebase-database.js';
import { toBar } from './service/jsonToModel.js';

const rootElement = document.getElementById('site-wrapper');
const appController = AppController();

BarView(appController, rootElement);
LoadBarView(appController, rootElement);

const firebaseConfig = {
  apiKey: 'AIzaSyDI3prh3nfLmqVdDt8l8P_TWqSK7V16Xb0',
  authDomain: 'hopspot-1f33c.firebaseapp.com',
  databaseURL:
    'https://hopspot-1f33c-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'hopspot-1f33c',
  storageBucket: 'hopspot-1f33c.appspot.com',
  messagingSenderId: '155429392759',
  appId: '1:155429392759:web:24425f36bbe74b52049172',
  measurementId: 'G-3S3V7078J8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const bars = ref(db, 'bars/');
onValue(bars, (snapshot) => {
  const bars = snapshot.val();
  bars.map((bar) => toBar(bar)).forEach((bar) => appController.addBar(bar));
});

loadBars().forEach((bar) => appController.addBar(bar));

//OpenFilter
document.getElementById('open-filter').addEventListener('click', () => {
  FilterView(appController, rootElement);
});
