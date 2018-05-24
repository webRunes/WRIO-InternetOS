const
  get_balance_crd = require('./get_balance_crd'),
  check_balance_popup = (current_balance, cb) =>
    setTimeout(
      () => {
        balance = get_balance_crd();
        balance !== current_balance
          ? cb(balance)
          : check_balance_popup(balance, cb)
      },
      1000
  );

module.exports = () =>
  check_balance_popup(
    get_balance_crd()
  )
