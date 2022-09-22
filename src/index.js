import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './api/fetchCountries';
import countryList from './templates/countryList.hbs';
import countryInfo from './templates/countryInfo.hbs';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const searchInputEl = document.querySelector('input#search-box');
const countriesListEl = document.querySelector('.country-list');
const oneCountryInfoEl = document.querySelector('.country-info');

// ** при установке hbs
// **(https://www.npmjs.com/package/parcel-transformer-hbs) в .parcelrc добавить:
// "transformers": {
//   "*.hbs": ["parcel-transformer-hbs"]
// }
const clearElementMarkup = element => {
  element.innerHTML = '';
};

const onSearchInputEl = event => {
  const searchCountry = event.target.value.trim();

  fetchCountries(searchCountry)
    .then(data => {
      //   console.log(data);
      if (data.length >= 10) {
        clearElementMarkup(countriesListEl);
        // countriesListEl.innerHTML = '';

        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2) {
        countriesListEl.innerHTML = countryList(data);
        clearElementMarkup(oneCountryInfoEl);
        return;
      }
      if (data.length === 1) {
        clearElementMarkup(countriesListEl);

        const oneCountry = data[0];
        oneCountryInfoEl.innerHTML = countryInfo({
          ...oneCountry,
          languages: Object.values(oneCountry.languages).join(', '),
        });
      }
    })
    .catch(err => {
      //   if (err.message === '404') {
      //     Notiflix.Notify.failure('Oops, there is no country with that name');
      //   }
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

searchInputEl.addEventListener(
  'input',
  debounce(onSearchInputEl, DEBOUNCE_DELAY)
);
