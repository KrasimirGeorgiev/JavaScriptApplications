var shipGame = (function (storage) {
    var validator,
        shipGame = Object.create({}),
        CONSTANTS = {
            CONST_GUESSED_NUMBER_ERROR_NAME: "Guessed number",
            CONST_HIGH_SCORE_DISPLAYED_PLAYERS_ERROR_NAME: "Displayed players",
            CONST_PLAYER_NAME_ERROR_NAME: "Player name",
            CONST_PLAYER_NAME_MIN_LENGTH: 3,
            CONST_PLAYER_NAME_MAX_LENGTH: 25,
            CONST_GUESSED_NUMBER_MIN: 1000,
            CONST_GUESSED_NUMBER_MAX: 9999,
            CONST_GUESSED_NUMBER_LENGTH: 4,
            CONST_HIGH_SCORE_STORAGE_KEY: 'shipGameHighScoreKey',
        },
        highScore = storage.getObject(CONSTANTS.CONST_HIGH_SCORE_STORAGE_KEY) || [];

    Object.defineProperty(shipGame, 'init', {
        value: function (playerName, endCallback) {
            this.playerName = playerName;
            this._score = 0;
            this.endCallback = endCallback;
            this.hasStarted = true;
            this.numberToGuess = generateShipGameNumber();
            return this;
        },
        enumerable: true
    });

    Object.defineProperty(shipGame, 'playerName', {
        get: function () {
            return this._playerName;
        },
        set: function (val) {
            validator.validateStringAndLength(val, CONSTANTS.CONST_PLAYER_NAME_ERROR_NAME, CONSTANTS.CONST_PLAYER_NAME_MIN_LENGTH, CONSTANTS.CONST_PLAYER_NAME_MAX_LENGTH);
            this._playerName = val;
        },
        enumerable: true
    });

    Object.defineProperty(shipGame, 'score', {
        get: function () {
            return this._score;
        }
    });

    Object.defineProperty(shipGame, 'guess', {
        value: function (number) {
            var guessResult,
                highScoreTable;
            if (!this.hasStarted) {
                throw new Error('Game is not initiated!');
            }

            validator.validateNumberRange(number, CONSTANTS.CONST_GUESSED_NUMBER_ERROR_NAME, CONSTANTS.CONST_GUESSED_NUMBER_MIN, CONSTANTS.CONST_GUESSED_NUMBER_MAX);
            this._score += 1;
            guessResult = getGameMatches(number, this.numberToGuess);
            if (guessResult.rams === 4) {
                updateHighScore(this._score, this._playerName);
                highScoreTable = getHighScoreRanking();
                this.hasStarted = false;
                this.endCallback(highScoreTable, this._score);
                return -1;
            }

            return guessResult;
        }
    });

    Object.defineProperty(shipGame, 'getHighScore', {
        value: function (count) {
            var highScoreTable;

            if (count) {
                validator.validatePossitiveNumber(count, CONSTANTS.CONST_GUESSED_NUMBER_ERROR_NAME);
            }

            highScoreTable = getHighScoreRanking(count);

            return highScoreTable;
        }
    });

    function generateShipGameNumber() {
        var numericString = '';
        numericString += generateDigit({ min: 1, max: 9 });
        numericString += generateDigit({ min: 0, max: 9 });
        numericString += generateDigit({ min: 0, max: 9 });
        numericString += generateDigit({ min: 0, max: 9 });

        return (numericString | 0);
    }

    function generateDigit(options) {
        options = options || {};
        min = options.min || 0;
        max = options.max || 9;

        return ((Math.random() * (max - min + 1)) + min) | 0;
    }

    function getGameMatches(guessNumber, numberToGuess) {
        guessNumberAsString = '' + guessNumber;
        numberToGuess = '' + numberToGuess;
        var ramsIndexes = Array.apply(null, Array(CONSTANTS.CONST_GUESSED_NUMBER_LENGTH)).map(Boolean.prototype.valueOf, false), // [false, false, false, false ]                
            rams = countRams(guessNumberAsString, numberToGuess, ramsIndexes),
            sheeps = countSheeps(guessNumberAsString, numberToGuess, ramsIndexes);
        //console.log(numberToGuess + ' N');
        //console.log(guessNumber + ' G');
        return {
            sheeps: sheeps,
            rams: rams,
        }
    }

    function countRams(guessNumberAsString, numberToGuess, ramsIndexes) {
        var i,
            length,
            rams = 0;
        for (i = 0, length = guessNumberAsString.length; i < length; i += 1) {
            if (guessNumberAsString[i] === numberToGuess[i]) {
                rams += 1;
                ramsIndexes[i] = true;
            }
        }

        //console.log('rams: ' + rams);
        //console.log('R ' + ramsIndexes);
        return rams;
    }

    function countSheeps(guessNumberAsString, numberToGuess, ramsIndexes) { // ramsIndexes === takenIndexes
        var i,
            j,
            length,
            sheeps = 0,
        occupiedIndexes = ramsIndexes.slice();

        for (i = 0, length = guessNumberAsString.length; i < length; i += 1) {
            for (j = 0; j < length; j += 1) {
                if (i !== j && ramsIndexes[i] === false && occupiedIndexes[j] === false && guessNumberAsString[j] === numberToGuess[i]) {
                    sheeps += 1;
                    ramsIndexes[i] = true;
                    occupiedIndexes[j] = true;
                    break;
                }
            }
        }

        //console.log('sheeps: ' + sheeps);
        //console.log('S ' + occupiedIndexes);

        return sheeps;
    }

    function updateHighScore(score, playerName) {
        var highScoreRanking = getHighScoreRanking(),
            scoreObj = {
                name: playerName,
                score: score,
            }
        highScoreRanking.push(scoreObj);
        highScoreRanking.sort(function (x, y) {
            return x.score - y.score;
        });

        setHighScoreRanking(highScoreRanking);
    }

    function getHighScoreRanking(count) {
        var ranking = storage.getObject(CONSTANTS.CONST_HIGH_SCORE_STORAGE_KEY) || [];
        if (count) {
            ranking = ranking.slice(0, count);
        }

        ranking = ranking.map(function (playerScore) { // deep copy for preventing evel hackers
            return {
                name: playerScore.name,
                score: playerScore.score,
            }
        });

        return ranking;
    }

    function setHighScoreRanking(highScoreRanking) {
        storage.setObject(CONSTANTS.CONST_HIGH_SCORE_STORAGE_KEY, highScoreRanking);
    }

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
            if (typeof val !== 'number') {
                throw new Error(name + ' must be a number');
            }
        },
        validatePossitiveNumber: function (val, name) {
            name = name || 'Value';
            this.validateIfNumber(val, name);
            if (val < 1) {
                throw new Error(name + ' must be possitive!');
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

    return shipGame;
}(localStorage));