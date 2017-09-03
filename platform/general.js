(function() {
    "use strict";
    const request = require('request-promise');
    const config = require('config');
    const Analyze = require('../tools/analyze');

    // Default texts
    const defaultOf = {
        price: config.get('defaults.price'),
        hi: config.get('defaults.hi'),
        bye: config.get('defaults.bye'),
        thanks: config.get('defaults.thanks'),
        compliment: config.get('defaults.compliment'),
        confused: config.get('defaults.confused'),
    };
    const searching = {
        defaults: config.get('search.defaults'),
        replace: {
            verb: config.get('search.replace.verb'),
            object: config.get('search.replace.object'),
            before: config.get('search.replace.before'),
            after: config.get('search.replace.after'),
            icons: config.get('search.replace.icons'),
        },
    };

    /**
     * Class to handle the messages sent by the user.
     * 
     */
    class General {
        /**
         * Sets the platform.
         * 
         * @param {object} platform The platform to be used.
         * 
         */
        constructor(platform) {
            this.platform = platform;
        }
        /**
         * Sets user id.
         * 
         * @param {Int} uid User identification.
         * 
         */
        setUid(uid) {
            this.platform.setUid(uid);
        }
        /**
         * Sets the text sent by the user.
         * 
         * @param {String} text Text send by the user.
         *
         */
        setText(text) {
            this.text = text;
        }
        /**
         * Returns a callback after the @ms time.
         * 
         * @param {Int} ms Time in milliseconds to wai.
         * @reutrn	{Function} Callback
         * 
         */
        wait(ms) {
            return new Promise(async(resolve) => {
                setTimeout(resolve, ms);
            });
        }
        /**
         * Treats the message sent by the user
         *
         */
        treat() {
            const { intent, ...search } = Analyze.content(this.text);
            // console.log(intent);
            if (intent.isAllowed) {
                this.platform.sendText(getSearchingText(search));
                console.log(search);
                // TODO: search and send the information
                return;
            }
            if (intent.hasPrice) {
                this.platform.sendText(defaultOf.price[getRandom(defaultOf.price.length)]);
                // TODO: search and send the prices
                return;
            }
            if (intent.hasGreeting) {
                this.platform.sendText(defaultOf.hi[getRandom(defaultOf.hi.length)]);
                return;
            }
            if (intent.hasBye) {
                this.platform.sendText(defaultOf.bye[getRandom(defaultOf.bye.length)]);
                return;
            }
            if (intent.hasThanks) {
                this.platform.sendText(defaultOf.thanks[getRandom(defaultOf.thanks.length)]);
                return;
            }
            if (intent.hasCompliment) {
                this.platform.sendText(defaultOf.compliment[getRandom(defaultOf.compliment.length)]);
                return;
            }
            this.platform.sendText(defaultOf.confused[getRandom(defaultOf.confused.length)]);
            // TODO: send buttons of help
            return;
        }
    }
    module.exports = General;
    /**
     * Generates a random between 0 and length - 1.
     * 
     * @param {Int} length Max number allowed - 1.
     * @return  {Int} The random number.
     * 
     */
    function getRandom(length) {
        return Math.floor(Math.random() * length);
    }
    /**
     * Returns a random text term for searching results.
     * 
     * @param {Object} search options to be used at replace.
     * @return  {String} The text to be sent.
     * 
     */
    function getSearchingText(search) {
        const message = {
            text: searching.defaults[getRandom(searching.defaults.length)],
            verb: searching.replace.verb[getRandom(searching.replace.verb.length)],
            object: searching.replace.object[getRandom(searching.replace.object.length)],
            before: searching.replace.before[getRandom(searching.replace.before.length)].replace('{time}', search.timeShow),
            after: searching.replace.after[getRandom(searching.replace.after.length)].replace('{time}', search.timeShow),
            icons: searching.replace.icons[getRandom(searching.replace.icons.length)],
        };
        const schedule = search.check === 'gte' ? message.after : message.before;
        message.text = message.text.replace('{verb}', message.verb);
        message.text = message.text.replace('{object}', message.object);
        message.text = message.text.replace('{from}', search.from);
        message.text = message.text.replace('{to}', search.to);
        message.text = message.text.replace('{schedule}', schedule);
        message.text += ` ${message.icons}`;
        return message.text;
    }
})();