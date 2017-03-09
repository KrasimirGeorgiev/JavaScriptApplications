var person = (function () {
    var validator,
        currentId = 0,
        person = Object.create({}),
        CONSTANTS = {
            CONST_PLAYER_NAME_ERROR_VALUE: "Person name",
            CONST_PLAYER_AGE_ERROR_VALUE: "Person age",
            CONST_PLAYER_NAME_MIN_LENGTH: 3,
            CONST_PLAYER_NAME_MAX_LENGTH: 25,
            CONST_PERSON_MIN_AGE: 18,
            CONST_PERSON_MAX_AGE: 65,
        };

    Object.defineProperty(person, 'init', {
        value: function (name, age) {
            this.name = name;
            this.age = age;
            this._id = ++currentId;
            return this;
        }
    });

    Object.defineProperty(person, 'id', {
        get: function () {
            return this._id;
        }
    });

    Object.defineProperty(person, 'name', {
        get: function () {
            return this._name;
        },
        set: function (val) {
            validator.validateStringAndLength(val, CONSTANTS.CONST_PLAYER_NAME_ERROR_VALUE, CONSTANTS.CONST_PLAYER_NAME_MIN_LENGTH, CONSTANTS.CONST_PLAYER_NAME_MAX_LENGTH);
            this._name = val;
        }
    });

    Object.defineProperty(person, 'age', {
        get: function () {
            return this._age;
        },
        set: function (val) {
            validator.validateNumberRange(val, CONSTANTS.CONST_PLAYER_AGE_ERROR_VALUE, CONSTANTS.CONST_PERSON_MIN_AGE, CONSTANTS.CONST_PERSON_MAX_AGE);
            this._age = val;
        }
    });

    validator = {
        validateIfUndefined: function (val, name) {
            name = name || 'Value';
            if (val === undefined) {
                throw new Error(name + ' cannot be undefined');
            }
        },
        validateIfNumber: function (val, name) {
            name = name || 'Value';
            this.validateIfUndefined(val, name);
            val = +val;
            if (typeof val !== 'number') {
                throw new Error(name + ' must be a number');
            }
        },
        validateNumberRange: function (val, name, min, max) {
            name = name || 'Value';
            this.validateIfNumber(val, name);
            if (val < min || max < val) {
                throw new Error(name + ' must be in range [' + min + ', ' + max + ']');
            }
        },
        validateString: function (val, name) {
            name = name || 'Value';
            this.validateIfUndefined(val, name);
            if (typeof val !== 'string') {
                throw new Error(name + ' must be a string');
            }
        },
        validateStringAndLength: function (val, name, min, max) {
            name = name || 'Value';
            this.validateString(val, name);
            if (val.length < min
                || max < val.length) {
                throw new Error(name + ' length must be between ' + min +
                    ' and ' + max + ' symbols');
            }
        },
    };

    return person;
}());