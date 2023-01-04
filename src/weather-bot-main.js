'use strict';

const { Telegraf } = require('telegraf');

const { todayParser, tomorrowParser, weekParser } = require('./parser.js');
const { MyDate } = require('./date.js');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const date = new MyDate();
const tdyParser = new todayParser();
const tmrwParser = new tomorrowParser();
const wParser = new weekParser();

bot.start((ctx) => ctx.reply('Welcome'));

bot.help((ctx) => {
  ctx.reply(
    '/today + назва міста – погода у цьому місту сьогодні\n' +
      '/tmrw + назва міста – погода у цьому місту завтра\n' +
      '/week + назва міста – погода у цьому місту на наступні 7 днів\n'
  );
});
bot.command('today', async (ctx) => {
  try {
    const input = ctx.message.text.split(' ').slice(1).join(' ');
    console.log(ctx.message.from.username + ': ' + input);
    const [max, min, now, cityName, sky] = await tdyParser.parse(
      input,
      'MAX_TEMP',
      'MIN_TEMP',
      'RIGHT_NOW',
      'CITY_NAME'
    );
    const text =
      `Погода на сьогодні, ${date.getDate()}, ${cityName}:\n` +
      `Зараз — ${now}.\n` +
      `Мінімальна температура — ${min}С.\n` +
      `Максимальна температура — ${max}С.\n` +
      `${sky}.`;
    ctx.reply(text, { reply_to_message_id: ctx.message.message_id });
  } catch (err) {
    console.log(err.message);
    ctx.reply('Не можу знайти це місто', {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.command('tmrw', async (ctx) => {
  try {
    const input = ctx.message.text.split(' ').slice(1).join(' ');
    console.log(ctx.message.from.username + ': ' + input);

    const [max, min, cityName, skyDescription] = await tmrwParser.parse(
      input,
      'MAX_TEMP_TMRW',
      'MIN_TEMP_TMRW',
      'CITY_NAME'
    );
    const text =
      `Завтра, ${date.getTomorrowsDate()}, ${cityName} буде від ${min}С до ${max}С.\n` +
      `${skyDescription}`;
    ctx.reply(text, { reply_to_message_id: ctx.message.message_id });
  } catch (err) {
    console.log(err.message);
    ctx.reply('Не можу знайти це місто', {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.command('week', async (ctx) => {
  try {
    const input = ctx.message.text.split(' ').slice(1).join(' ');
    console.log(ctx.message.from.username + ': ' + input);
    const week = date.getWeek();
    const [min, max, skyDescription, cityName] = await wParser.parse(input);
    let text = '';
    for (let i = 0; i < max.length; i++) {
      text +=
        ` ${week[i]}, ${cityName} буде від ${min[i]}С до ${max[i]}С.\n` +
        `${skyDescription[i]} \n`;
    }
    ctx.reply(text, { reply_to_message_id: ctx.message.message_id });
  } catch (err) {
    console.log(err.message);
    ctx.reply('Не можу знайти це місто', {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});

bot.launch();
