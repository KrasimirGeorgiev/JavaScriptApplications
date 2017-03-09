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