'use strict';

class MyDate extends Date {
  #months;
  constructor() {
    super();
    this.#months = [
      'січня',
      'лютого',
      'березня',
      'квітня',
      'травня',
      'червня',
      'липня',
      'серпня',
      'вересня',
      'жовтня',
      'листопада',
      'грудня',
    ];
  }
  getDate = () => {
    const text = `${super.getDate()} ` + `${this.#months[super.getMonth()]}`;
    return text;
  };

  getTomorrowsDate = () => {
    const today = super.getDate();
    let tomorrow = new MyDate();
    tomorrow.setDate(today + 1);
    const text = `${tomorrow.getDate()}`;
    return text;
  };

  getWeek = () => {
    let today = super.getDate();
    let date = new MyDate();
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(date.getDate());
      date.setDate(++today);
    }
    return week;
  };
}

module.exports = { MyDate };
