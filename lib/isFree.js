function isFree(title) {
  title = title.toLowerCase(); // eslint-disable-line no-param-reassign

  // at first we need to check this basic condition
  if (/((?<!-)(\b(free)\b)|100%|\$0|€0|0\$|0€)/gi.test(title)) {
    // and then we ignore threads which requires to buy something to get a game for 'free'
    if (!(/(\b(buy|purchase|twitch prime|ps plus|free weekend|vip deal)\b)|ps\+/gi.test(title))) {
      if (/free to play/gi.test(title)) {
        return true; // if title includes 'free to play' we are sure the game is for free
      }

      // looks for "XX% off"
      const discountInTitle = title.match(/(\b([0-9.]+% off)\b)|(\b([0-9.]+%off)\b)/gi);
      if (discountInTitle) {
        if (discountInTitle.includes('100% off') || discountInTitle.includes('100%off')) {
          return true; // if title includes '100% off we are sure the game is for free
        }
        return false; // title includes XX% off, game is not for free
      }

      // looks for prices
      let priceInTitle = title.match(/(USD|EUR|€|£|\$)\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s?(USD|EUR|€|£|\$)|(USD|EUR|€|£|\$)\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/gi);
      if (priceInTitle) {
        // removes currency symbol; replaces comma with dot; parses to float
        priceInTitle = priceInTitle.map(price => price.replace(/[^0-9.,-]+/g, '')).map(price => parseFloat(price.replace(/,/g, '.')));
        if (priceInTitle.includes(0)) {
          return true; // there is something which costs 0
        }
        return false; // title includes price different from 0, game is not for free
      }

      // looks for any precentage values
      let precentageInTitle = title.match(/[0-9.]+%/g);
      if (precentageInTitle) {
        precentageInTitle = precentageInTitle.map(title => title.slice(0, -1)); // eslint-disable-line no-shadow, max-len
        if (precentageInTitle.includes('100') || precentageInTitle.includes('0')) {
          return true; // most likely -100%, game is for free
        }
        return false; // there is precentage value diffrent from 100, game is not for free
      }

      return true;
    }

    // return false because we were most likely required to buy something first
    return false;
  }

  // return false because thread title didn't match first condition
  return false;
}

module.exports = isFree;
