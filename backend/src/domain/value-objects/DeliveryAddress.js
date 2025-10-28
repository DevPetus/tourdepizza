// Value Object: DeliveryAddress
// Immutable value object representing a delivery address

class DeliveryAddress {
  constructor(street, city, state, zipCode, country = 'USA', instructions = '') {
    this._street = street;
    this._city = city;
    this._state = state;
    this._zipCode = zipCode;
    this._country = country;
    this._instructions = instructions;
    Object.freeze(this);
  }

  get street() {
    return this._street;
  }

  get city() {
    return this._city;
  }

  get state() {
    return this._state;
  }

  get zipCode() {
    return this._zipCode;
  }

  get country() {
    return this._country;
  }

  get instructions() {
    return this._instructions;
  }

  equals(other) {
    if (!(other instanceof DeliveryAddress)) {
      return false;
    }
    return this._street === other._street &&
           this._city === other._city &&
           this._state === other._state &&
           this._zipCode === other._zipCode &&
           this._country === other._country;
  }

  validate() {
    const errors = [];
    
    if (!this._street || this._street.trim() === '') {
      errors.push('Street address is required');
    }
    
    if (!this._city || this._city.trim() === '') {
      errors.push('City is required');
    }
    
    if (!this._state || this._state.trim() === '') {
      errors.push('State is required');
    }
    
    if (!this._zipCode || !/^\d{5}(-\d{4})?$/.test(this._zipCode)) {
      errors.push('Valid ZIP code is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toString() {
    return `${this._street}, ${this._city}, ${this._state} ${this._zipCode}, ${this._country}`;
  }

  toJSON() {
    return {
      street: this._street,
      city: this._city,
      state: this._state,
      zipCode: this._zipCode,
      country: this._country,
      instructions: this._instructions
    };
  }
}

module.exports = DeliveryAddress;
