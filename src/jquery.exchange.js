(($) => {
  $.fn.exchange = (defaults) => {
    // console.log(this);
    defaults = $.extend({
      fromCurrencySelectEl: '[data-exchange-from-currency]',
      toCurrencySelectEl: '[data-exchange-to-currency]',
      convertBtn: '[data-exchange-convert]',
      viceVersaBtn: '[data-exchange-vice-versa]',
      fromValueEl: '[data-exchange-from-value]',
      toValueEl: '[data-exchange-to-value]',
    }, defaults);

    // eslint-disable-next-line guard-for-in
    for (const iterator in defaults) {
      defaults[iterator] = $(defaults[iterator]);
    }
    let $fromCurrency = defaults.fromCurrencySelectEl;
    let $toCurrency = defaults.toCurrencySelectEl;
    const $fromValue = defaults.fromValueEl;
    const $convertBtn = defaults.convertBtn;
    const $viseVersa = defaults.viceVersaBtn;
    const $toValue = defaults.toValueEl;
    const API_URL_RESET = `http://free.currencyconverterapi.com/api/v6/convert?q={from}_{to}&compact=ultra&apiKey=31bf09a9cfc18c66804c`;
    let API_URL = `http://free.currencyconverterapi.com/api/v6/convert?q={from}_{to}&compact=ultra&apiKey=31bf09a9cfc18c66804c`;
    const REG_EXP = /{from}_{to}/g;
    let exchange = 0;
    let textValue = 0;

    $convertBtn.on('click', () => {
      _regExpCheck(REG_EXP);
      _checkForRequest();
    });

    $viseVersa.on('click', () => {
      _changeCurrencyBlocks();
      _regExpCheck(REG_EXP);
      _checkForRequest();
    });

    const _regExpCheck = (regExp) => {
      if (API_URL.match(regExp)) {
        API_URL = API_URL.replace(regExp, `${$fromCurrency.val()}_${$toCurrency.val()}`);
      }
    };

    const _changeCurrencyBlocks = () => {
      let from = $fromCurrency.val();
      let to = $toCurrency.val();
      $toCurrency = $toCurrency.val(from);
      $fromCurrency = $fromCurrency.val(to);
      textValue = Number($fromValue.val());
    };
    const _checkForRequest = () => {
      if ($fromValue.val() != '' && $fromValue.val() != 0) {
        textValue = Number($fromValue.val());
        $.getJSON(API_URL, (data) => {
          // eslint-disable-next-line guard-for-in
          for (const key in data) {
            exchange = data[key] * textValue;
            $toValue.text(exchange);
          }
          API_URL = API_URL_RESET;
        });
      } else {
        alert('input cannot be empty or zero');
      }
    };
  };
})(jQuery);
