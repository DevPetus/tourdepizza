// Value Object: Payment
// Immutable value object representing payment information

class Payment {
  constructor(method, cardNumber, cardHolder, expirationDate, cvv, billingAddress) {
    this._method = method; // 'credit_card', 'debit_card', 'cash'
    this._cardNumber = cardNumber ? this.maskCardNumber(cardNumber) : null;
    this._cardHolder = cardHolder;
    this._expirationDate = expirationDate;
    this._cvv = cvv ? '***' : null; // Never store actual CVV
    this._billingAddress = billingAddress;
    Object.freeze(this);
  }

  get method() {
    return this._method;
  }

  get cardNumber() {
    return this._cardNumber;
  }

  get cardHolder() {
    return this._cardHolder;
  }

  get expirationDate() {
    return this._expirationDate;
  }

  get billingAddress() {
    return this._billingAddress;
  }

  maskCardNumber(cardNumber) {
    // Keep only last 4 digits visible
    if (!cardNumber) return null;
    const cleaned = cardNumber.replace(/\s/g, '');
    return '**** **** **** ' + cleaned.slice(-4);
  }

  validate() {
    const errors = [];
    
    if (!['credit_card', 'debit_card', 'cash'].includes(this._method)) {
      errors.push('Payment method must be credit_card, debit_card, or cash');
    }
    
    if (this._method !== 'cash') {
      if (!this._cardNumber) {
        errors.push('Card number is required');
      }
      
      if (!this._cardHolder || this._cardHolder.trim() === '') {
        errors.push('Card holder name is required');
      }
      
      if (!this._expirationDate || !/^\d{2}\/\d{2}$/.test(this._expirationDate)) {
        errors.push('Expiration date must be in MM/YY format');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      method: this._method,
      cardNumber: this._cardNumber,
      cardHolder: this._cardHolder,
      expirationDate: this._expirationDate,
      billingAddress: this._billingAddress
    };
  }
}

module.exports = Payment;
