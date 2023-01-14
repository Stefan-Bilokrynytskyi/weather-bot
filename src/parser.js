'use strict';

const cheerio = require('cheerio');
const axios = require('axios');

class Parser {
  #weatherData;
  constructor() {
    this.#weatherData = {
      CITY_NAME: '#header > div.cityName.cityNameShort > h1 > strong',
      MIN_TEMP: '#bd1 > div.temperature > div.min > span',
      MAX_TEMP: '#bd1 > div.temperature > div.max > span',
      RIGHT_NOW:
        '#bd1c > div.wMain.clearfix > div.lSide > div.imgBlock > p.today-temp',
      MIN_TEMP_TMRW: '#bd2 > div.temperature > div.min > span',
      MAX_TEMP_TMRW: '#bd2 > div.temperature > div.max > span',
      PEOPLE_PROG: '#bd1c > div.oDescription.clearfix > div.rSide > div',
    };
  }

  get weatherData() {
    return this.#weatherData;
  }

  parse = async (cityName, ...types) => {
    throw new Error('this method must be implemented');
  };
}

class todayParser extends Parser {
  #weatherData;
  constructor() {
    super();
    this.#weatherData = super.weatherData;
  }

  parse = async (cityName, ...types) => {
    const cityURL = encodeURI(cityName.toLowerCase());
    let skyDescription = [];
    const data = await axios
      .get(
        `https://ua.sinoptik.ua/%D0%BF%D0%BE%D0%B3%D0%BE%D0%B4%D0%B0-${cityURL}`
      )
      .then((html) => {
        const $ = cheerio.load(html.data);

        const res = new Array();

        for (const type of types) {
          res.push($(this.#weatherData[type]).text());
        }
        $('.main').each((i, element) => {
          skyDescription.push(
            $(element).find('.weatherIco')['0']['attribs']['title']
          );
        });

        res.push(skyDescription[0]);
        return res;
      });
    return data;
  };
}

class tomorrowParser extends Parser {
  #weatherData;
  constructor() {
    super();
    this.#weatherData = super.weatherData;
  }

  parse = async (cityName, ...types) => {
    const cityURL = encodeURI(cityName.toLowerCase());
    let skyDescription = [];
    const data = await axios
      .get(
        `https://ua.sinoptik.ua/%D0%BF%D0%BE%D0%B3%D0%BE%D0%B4%D0%B0-${cityURL}`
      )
      .then((html) => {
        const $ = cheerio.load(html.data);

        const res = new Array();

        for (const type of types) {
          res.push($(this.#weatherData[type]).text());
        }
        $('.main').each((i, element) => {
          skyDescription.push(
            $(element).find('.weatherIco')['0']['attribs']['title']
          );
        });

        res.push(skyDescription[1]);
        return res;
      });
    return data;
  };
}

class weekParser extends Parser {
  #weatherData;
  constructor() {
    super();
    this.#weatherData = super.weatherData;
  }

  parse = async (cityName) => {
    const cityURL = encodeURI(cityName.toLowerCase());
    let min = [];
    let max = [];
    let skyDescription = [];
    const data = await axios
      .get(
        `https://ua.sinoptik.ua/%D0%BF%D0%BE%D0%B3%D0%BE%D0%B4%D0%B0-${cityURL}`
      )
      .then((html) => {
        const $ = cheerio.load(html.data);

        $('.min').each((i, element) => {
          min.push($(element).find('span').text());
        });
        $('.max').each((i, element) => {
          max.push($(element).find('span').text());
        });
        $('.main').each((i, element) => {
          skyDescription.push(
            $(element).find('.weatherIco')['0']['attribs']['title']
          );
        });

        const name = $(this.#weatherData['CITY_NAME']).text();
        return [min, max, skyDescription, name];
      });
    return data;
  };
}

class peopleParser extends Parser {
  #weatherData;
  constructor() {
    super();
    this.#weatherData = super.weatherData;
  }

  parse = async (type) => {
    const data = await axios.get(`https://ua.sinoptik.ua/`).then((html) => {
      const $ = cheerio.load(html.data);

      return $(this.#weatherData[type]).text();
    });
    return data;
  };
}

module.exports = { todayParser, tomorrowParser, weekParser, peopleParser };
