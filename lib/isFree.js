function isFree(title) {
  title = title.toLowerCase(); // eslint-disable-line
  title = title.replace(/\s{2,}/gi, ' '); // eslint-disable-line

  if (!(/((?<!-)(\b(free)\b)|100%|\$0|€0|0\$|0€)/gi.test(title))) {
    return false;
  }

  // ignore threads which require users to buy something to get a free game
  if ((/(\b(buy|purchase|twitch prime|ps plus|free weekend|vip deal|amazon prime)\b)|ps\+/gi.test(title))) {
    return false;
  }

  // percentage discounts
  const discountInTitle = title.match(/(\b([0-9.]+%? ?off)\b)|-100%/gi);
  if (discountInTitle) {
    const conditions = ['100% off', '100%off', '100 off', '100off', '-100%'];
    if (discountInTitle.some((value) => conditions.includes(value))) {
      return true;
    }
  }

  // look for prices
  const priceInTitle = title.match(/(USD|EUR|€|£|\$)\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))|(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)\s?(USD|EUR|€|£|\$)|(USD|EUR|€|£|\$)\s?(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/gi);
  if (priceInTitle) {
    // remove currency symbol, replace comma with dot, parse to float
    const pricesInTitle = priceInTitle
      .map((price) => price.replace(/[^0-9.,-]+/g, ''))
      .map((price) => parseFloat(price.replace(/,/g, '.')));

    if (pricesInTitle.includes(0)) {
      return true;
    }
  }

  if (/free to play/gi.test(title)) {
    return true;
  }

  if (/free\s?\/\s?normally/gi.test(title)) {
    return true;
  }

  return false;
}

module.exports = isFree;
