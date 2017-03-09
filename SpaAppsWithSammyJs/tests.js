describe("DATABASE", function () {
    var database = Object.create(db);

    beforeEach(function (done) {
        database.clear()
            .then(function (response) {
                done();
            });
    });

    describe("add(name, age)", function () {
        it('expects to throw if name is undefined', function () {
            function add() {
                database.add();
            }

            expect(add).to.throw();
        });

        it('expects to throw if name is not a string', function () {
            function add() {
                database.add(3, 21);
            }

            expect(add).to.throw();
        });

        it('expects to throw if name is too short', function () {
            function add() {
                database.add('Mo', 21);
            }

            expect(add).to.throw();
        });

        it('expects to throw if name is too long', function () {
            function add() {
                database.add('MochaChaiJqueryAndAngularJsMVVMJAVA', 21);
            }

            expect(add).to.throw();
        });

        it('expects to throw if age is undefined', function () {
            function add() {
                database.add('Mocha');
            }

            expect(add).to.throw();
        });

        it('expects to throw if is underage', function () {
            function add() {
                database.add('Mocha', 15);
            }

            expect(add).to.throw();
        });

        it('expects to throw if is overage', function () {
            function add() {
                database.add('Mocha', 15);
            }

            expect(add).to.throw();
        });

        it('expects to have initial count 0', function () {
            database.count()
                .then(function (response) {
                    expect(response).to.equal(0);
                });
        });

        it('expects to increase count with 1 on every adding', function (done) {
            database.add('Mocho', 22)
                .then(function (response) {
                    return database.add('Mocha', 23);
                })
                .then(function (response) {
                    return database.count()
                })
                .then(function (count) {
                    expect(count).to.eql(2);
                    done();
                });
        });
    });

    describe("remove(id)", function () {
        it('expects to decrease count with 1 on every remove', function (done) {
            var id1;
            database.add('Mocho', 22)
                .then(function (response) {
                    id1 = response.id;
                    return database.add('Mocha', 23);
                })
                .then(function (response) {
                    return database.remove(id1)
                })
                .then(function (response) {
                    return database.count()
                })
                .then(function (response) {
                    expect(response).to.equal(1);
                    done();
                });
        });

        it('expects to return error if person does not exists', function (done) {
            database.remove(10)
                .then(function (response) {
                }, function (error) {
                    expect(error).to.eql('Person does not exists!');
                    done();
                });
        });

        it('expects to remove person successfully', function (done) {
            var id1;
            database.add('Mocho', 22)
                .then(function (response) {
                    id1 = response.id;
                    return database.remove(id1);
                })
                .then(function (response) {
                    return database.remove(id1);
                })
                .then(function (response) {
                }, function (error) {
                    expect(error).to.eql('Person does not exists!');
                    done();
                });
        });
    });

    describe('getById(id)', function () {
        it('expects to find person if exists', function (done) {
            var person,
                foundPerson;
            database.add('Pesho', 22)
                    .then(function (response) {
                        person = response;
                        return database.getById(person.id);
                    })
                .then(function (response) {
                    foundPerson = response;
                    expect(person).to.eql(foundPerson);
                    done();
                });
        });

        it('expects to return error if person not found', function (done) {
            database.getById(person.id)
                .then(function (response) {
                }, function (error) {
                    expect(error).to.not.be.an('undefined');
                    done();
                });
        });
    });

    describe('clear()', function () {
        it('expects to delete people', function () {
            var count;
            database.add('Pesho', 23)
                .then(function (response) {
                    return database.clear();
                })
                .then(function (response) {
                    return database.count();
                })
                .then(function (count) {
                    expect(count).to.eql(0);
                });
        });
    });

    describe('get', function () {
        it('expect to return empty array if no people', function (done) {
            database.get()
                .then(function (response) {
                    expect(response).to.be.eql([]);
                    done();
                });
        });

        it('expect to return array of people if any', function (done) {
            var responseJSONString,
                expectedJSONString,
                id1,
                id2,
                name1 = 'Gosho',
                name2 = 'Pesho',
                age1 = 32,
                age2 = 33,
                responseJSONString
            ;
            database.add(name1, age1)
                .then(function (response) {
                    id1 = response.id;
                    return database.add(name2, age2);
                })
                .then(function (response) {
                    id2 = response.id;
                    return database.get();
                })
                .then(function (response) {
                    expect(response).to.be.eql([{ name: name1, age: age1, id: id1 }, { name: name2, age: age2, id: id2 }]);
                    done();
                });
        });
    });
});