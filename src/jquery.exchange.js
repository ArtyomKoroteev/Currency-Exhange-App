(($) => {
  $.fn.exchange = (defaults) => {
    defaults = $.extend({
      fromCurrencySelectEl: '[data-exchange-from-currency]',
      toCurrencySelectEl: '[data-exchange-to-currency]',
      convertBtn: '[data-exchange-convert]',
      viceVersaBtn: '[data-exchange-vice-versa]',
      fromValueEl: '[data-exchange-from-value]',
      toValueEl: '[data-exchange-to-value]',
    }, defaults);

    for (const iterator in defaults) {
      if ({}.hasOwnProperty.call(defaults, iterator)) {
        defaults[iterator] = $(defaults[iterator]);
      }
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
          for (const key in data) {
            if ({}.hasOwnProperty.call(data, key)) {
              exchange = data[key] * textValue;
              $toValue.text(exchange);
            }
          }
          API_URL = API_URL_RESET;
        });
      } else {
        alert('input cannot be empty or zero');
      }
    };
  };
  $.widget('exchange.rateHistory', {
    options: {
      baseColor: '#337ab7',
      from: 'USD',
      to: 'UAH',
      key: 'dbd8a80ca3e4aebe84d5',
      days: 7,
    },
    _create() {
      this.element.css('background', this.options.baseColor);
      this._refresh();
    },
    _refresh() {
      let now = new Date();
      let END_DAY = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
      let START_DAY = `${now.getFullYear()}-${now.getMonth()+1}-${(now.getDate() - (this.options.days-1))}`;
      let CURRENCY = `${this.options.from}_${this.options.to}`;
      const KEY = this.options.key;
      let API_URL = `https://free.currencyconverterapi.com/api/v6/convert?q=${CURRENCY}&compact=y&compact=ultra&apiKey=${KEY}&date=${START_DAY}&endDate=${END_DAY}`;
      let values = [];
      let date = [];
      $.get(API_URL, (data) => {

        this.element.html('');
        data = data.results[CURRENCY].val;
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            values.push(data[key]);
            date.push(key);
            this.element.append('<div class="bar"></div>');
            console.log(data);
          }
        }
        let maxValue = Math.max.apply(null, values);
        let minValue = Math.floor(Math.min.apply(null, values));
        this.element.find('.bar').each((i, elem) => {
          $(elem).css('height', `${(values[i]*100)/maxValue}%`);
          $(elem).text(`${date[i]} ${values[i]}`);
        });
      });
    },
    _setOptions() {
      this._superApply(arguments);
      this._refresh();
    },
    _destroy() {
      this.element.html('');
    },
  });

})(jQuery);