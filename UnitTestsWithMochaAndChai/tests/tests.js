var expect = require('chai').expect;

var localStorage = {},
	ranking = {};
localStorage.setObject = function(key, value){
	ranking[key] = value;
};

localStorage.getObject = function(key){
	return ranking[key];
};

var shipGame = (function (storage) {
    var shipGame = Object.create({}),
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

describe('#GAME', function () {
    describe('#GAME INIT', function () {
        it('expects to generate a random number in interval 1000-9999.', function () {
            var playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName),
                number = game.numberToGuess;
            expect(number).to.be.least(1000);
            expect(number).to.be.most(9999);
        });

        it('expects the leftmost digit must not be 0 (zero)', function () {
            var playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName),
                number = game.numberToGuess,
                leftMost = number.toString()[0];
            expect(number).to.not.be.a('0');

        });

        it('expects init to set player name correctly', function () {
            var playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName),
                actual = game.playerName;
            expect(actual).to.equal(playerName);
        });

        it('expects to throw when player name is 2 symbols or less!', function () {
            var playerName = 'Pe';
            function test() {
                Object.create(shipGame).init(playerName);
            }

            expect(test).to.throw();
        });

        it('expects to throw when guesses but game is not initiated!', function () {
            function test() {
                shipGame.guess(1234);
            }

            expect(test).to.throw();
        });
    });

    describe('#GUESS', function () {
        it('expect answer to be in correct format.', function () {
            var result,
                playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);
            game.numberToGuess = 1234;
            result = game.guess(2567);
            expect(result.sheeps).to.equal(1);
            expect(result.rams).to.equal(0);
        });

        it('expect answer to be 1 sheep when player guesses 1 sheep.', function () {
            var result,
                playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);
            game.numberToGuess = 1234;
            result = game.guess(2567);
            expect(result.sheeps).to.equal(1);
        });

        it('expect answer to be 1 ram when player guesses 1 ram.', function () {
            var result,
                playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);
            game.numberToGuess = 1234;
            result = game.guess(5267);
            expect(result.rams).to.equal(1);
        });

        it('expect answer to be 1 ram and 0 sheeps when player guesses 1 ram and the guesses number has sheep mathing number.', function () {
            var result,
                playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);
            game.numberToGuess = 1234;
            result = game.guess(7226);
            expect(result.rams).to.equal(1);
        });

        it('expect answer to be 1 ram and 1 sheeps when player guesses 1 ram and the numberToGuess has another number with the same value and the guesses number has sheep mathing number.', function () {
            var result,
                playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);
            game.numberToGuess = 1232;
            result = game.guess(7226);
            expect(result.rams).to.equal(1);
        });

        it('expect to increase score with every guess.', function () {
            var score,
                playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);
            game.numberToGuess = 1232;
            game.guess(7226);
            game.guess(4343);
            score = game.score;
            expect(score).to.equal(2);
        });

        it('expect to execute callback when player guesses all 4 numbers.', function () {
            function callBack() {
                hasGuessedAll = true;
            }

            var result,
                hasGuessedAll = false,
                playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName, callBack);
            game.numberToGuess = 1232;
            result = game.guess(1232);
            expect(hasGuessedAll).to.equal(true);
        });

        it('expect to throw when guesses with no parram.', function () {
            var playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);

            function test() {
                game.guess();
            }

            expect(test).to.throw();
        });

        it('expect to throw when parram is not a number.', function () {
            var playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);

            function test() {
                game.guess({ number: 1234 });
            }

            expect(test).to.throw();
        });

        it('expect to throw when parram is not in range.', function () {
            var playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName);

            function test() {
                game.guess(0931);
            }

            expect(test).to.throw();
        });

        it('expect to throw when game is over and guesses again.', function () {
            var result,
                playerName = 'Pesho',
                game = Object.create(shipGame).init(playerName, callBack);
            game.numberToGuess = 1232;
            game.guess(1232);

            function test() {
                game.guess(1232);
            }

            function callBack() {
            }

            expect(test).to.throw();
        });
    });

    describe('#GET HIGH SCORE', function () {
        it('expect high score to be array.', function () {
            var game = Object.create(shipGame).init('Tosho'),
                highScore = game.getHighScore();
            expect(Array.isArray(highScore)).to.equal(true);
        });

        it('expect HIGH SCORE to has to players more if two players finish the game.', function () {
            var difference,
                game = Object.create(shipGame).init('Tosho'),
                highScoreLengthBeforePlaying = game.getHighScore().length;
            initAndPlay('Pesho');
            initAndPlay('Gosho');
            difference = game.getHighScore().length - highScoreLengthBeforePlaying;
            expect(difference).to.equal(2);

            function initAndPlay(playerName) {
                var game = Object.create(shipGame).init(playerName, callBack);
                game.numberToGuess = 1234;
                game.guess(3232);
                game.guess(1234);
            }

            function callBack() {

            }
        });

        it('expect HIGH SCORE players to be in correct format.', function () {
            var hasCorrectFormat,
                game = Object.create(shipGame).init('Tosho'),
                highScore = game.getHighScore();
            hasCorrectFormat = highScore[0].name !== undefined || highScore[0].score !== undefined;
            expect(hasCorrectFormat).to.equal(true);
        });


        it('expect if count is greater than the total count of players in the high-score, return the actual number of player in the high-score.', function () {
            var game = Object.create(shipGame).init('Tosho'),
                highScoreLength = game.getHighScore().length,
                highScoreLengthExceeded = game.getHighScore(highScoreLength + 5).length;
            expect(highScoreLengthExceeded).to.equal(highScoreLength);
        });

        it('expect HIGH SCORE to return count players.', function () {
            var difference,
                game = Object.create(shipGame).init('Tosho'),
                playersToDisplayCount = game.getHighScore(3).length;
            expect(playersToDisplayCount).to.equal(3);
        });
    });
});