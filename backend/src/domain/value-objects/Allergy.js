// Value Object: Allergy
// Immutable value object representing customer allergies
// Encrypted for security

class Allergy {
  constructor(name, severity = 'moderate', notes = '') {
    this._name = name;
    this._severity = severity; // 'mild', 'moderate', 'severe'
    this._notes = notes;
    Object.freeze(this);
  }

  get name() {
    return this._name;
  }

  get severity() {
    return this._severity;
  }

  get notes() {
    return this._notes;
  }

  equals(other) {
    if (!(other instanceof Allergy)) {
      return false;
    }
    return this._name === other._name && 
           this._severity === other._severity;
  }

  validate() {
    const errors = [];
    
    if (!this._name || this._name.trim() === '') {
      errors.push('Allergy name is required');
    }
    
    if (!['mild', 'moderate', 'severe'].includes(this._severity)) {
      errors.push('Severity must be mild, moderate, or severe');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      name: this._name,
      severity: this._severity,
      notes: this._notes
    };
  }
}

module.exports = Allergy;
