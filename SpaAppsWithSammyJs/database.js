var db = (function (personClass) {
    var people = [];

    function get() {
        var result,
            deferred = Q.defer();

        result = people.map(function (person) {
            return {
                name: person.name,
                age: person.age,
                id: person.id,
            }
        });

        setTimeout(function () {
            deferred.resolve(result);
        }, 100);

        return deferred.promise;
    }

    function count() {
        var result,
            deferred = Q.defer();

        setTimeout(function () {
            deferred.resolve(people.length);
        }, 100);

        return deferred.promise;
    }

    function getById(id) {
        var result,
            deferred = Q.defer();

        setTimeout(function () {
            var clonePerson,
                person = people.find(function (person, index, array) {
                    return person.id == id;
                });

            if (person) {
                clone = getClonePerson(person);
                deferred.resolve(clone);
            } else {
                deferred.reject("Person not found!");
            }
        }, 100);

        return deferred.promise;
    }

    function add(name, age) {
        var person,
            clone,
            deferred = Q.defer();
        person = Object.create(personClass).init(name, age);
        people.push(person);
        clone = getClonePerson(person);

        setTimeout(function () {
            deferred.resolve(clone);
        }, 100);

        return deferred.promise;
    }

    function remove(id) {
        var index,
            removedPerson,
            deferred = Q.defer();
        index = people.findIndex(function (person) {
            return person.id == id;
        });

        setTimeout(function () {
            if (index !== -1) {
                removedPerson = people.splice(index, 1);
                deferred.resolve(getClonePerson(removedPerson));
            } else {
                deferred.reject('Person does not exists!');
            }
        }, 100);

        return deferred.promise;
    }

    function clear() {
        var deferred = Q.defer();

        setTimeout(function () {
            people = [];
            deferred.resolve();
        }, 100);

        return deferred.promise;
    }

    function getClonePerson(person) {
        return {
            name: person.name,
            age: person.age,
            id: person.id
        };
    }

    return {
        get: get,
        count: count,
        getById: getById,
        add: add,
        remove: remove,
        clear: clear,
    };
}(person));