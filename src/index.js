import './css/styles.css';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';
import { debounce } from 'debounce';

const refs = {
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  sorgQvary: document.querySelector('#search-box'),
};

const DEBOUNCE_DELAY = 300;
refs.sorgQvary.addEventListener(
  'input',
  debounce(rendSorgQvary, DEBOUNCE_DELAY)
);

function rendSorgQvary() {
  const inputValue = refs.sorgQvary.value.trim();
  clierCountry();
  if (inputValue !== '') {
    fetchCountries(inputValue).then(checkResolve).catch(err);
  }
}

function clierCountry() {
  refs.countryList.textContent = '';
  refs.countryInfo.textContent = '';
}

function checkResolve(resolve) {
  if (resolve.length === 1) {
    renderOneCountry(resolve);
  } else if (resolve.length >= 10) {
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (resolve.length >= 2 && resolve.length < 10) {
    renderCountryList(resolve);
  } else {
    Notify.failure('Opps');
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
           <b>${country.name.official}</p>
                  </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}
function renderOneCountry(countries) {
  const markup = countries
    .map(country => {
      return `<li>
        <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
           <b>${country.name.official}</b></p>
              <p><b>Capital</b>: ${country.capital}</p>
              <p><b>Population</b>: ${country.population}</p>
              <p><b>Languages</b>: ${Object.values(country.languages)} </p>
                  </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}
function err() {
  Notify.failure('Oops, there is no country with that name');
}
