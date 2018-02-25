'use strict';

const config = require('../config');
const logger = require('../lib/logger');

module.exports = (bot => {
    return {
        generator: (msg, args) => {
            const code = args.join(' ');
            if (msg.author.id !== config.ownerID) {
                const text = `Nieautoryzowane użycie eval przez ${msg.author.username}. Próba wykonania ${code}`;
                bot.getDMChannel(config.ownerID).then((channel) => bot.createMessage(channel.id, text));
                logger.info(text);
                return 'Brak wystarczających uprawnień. Próba nadużycia została zgłoszona!';
            }
            if (args.length === 0)
                return 'Błędne argumenty lub brak argumentów.';

            try {
                let evalved = eval(code);
                if (typeof evalved !== 'string') {
                    evalved = require('util').inspect(evalved);
                }
                logger.info(`Pomyślnie wykonano eval ${code}`);
                bot.getDMChannel(config.ownerID).then((channel) => bot.createMessage(channel.id, 'Pomyślnie wykonano eval'));
            } catch (err) {
                logger.error(`Błąd przy wykonywaniu eval: ${err} ${code}`);
                bot.getDMChannel(config.ownerID).then((channel) => bot.createMessage(channel.id, `Błąd przy wykonywaniu eval: ${err}`));
            }
        },
        options: {
            deleteCommand: true
        }
    };
});

