var windowLoadApp = window.onload;
window.onload = function () {
    if (windowLoadApp) {
        windowLoadApp();
    }

    var app = Sammy('#content', function () {
        var $content = $('#content');
        this.get('#/', function (context) {
            context.redirect('#/home');
        });

        this.get('#/home', function () {
            loadPeople();
        });

        this.get('#/person/:id', function () {
            var personInfo;
            db.getById(this.params.id)
                .then(function (response) {
                    personInfo = response;
                    return templates.get('personInfo');
                }, function (error) {
                    $content.html(error);
                })
                .then(function (template) {
                    var personHtml = template({ result: personInfo });
                    $content.html(personHtml);
                });
        });

        this.get('#/remove/:id', function (context) {
            db.remove(this.params.id)
                .then(function (response) {
                    context.redirect('#/home');
                    loadPeople();
                }, function (error) {
                    $content.html(error);
                });
        });

        this.get('#/clear', function (context) {
            db.clear()
                .then(function (response) {
                    context.redirect('#/home');
                    loadPeople();
                }, function (error) {
                    $content.html(error);
                });
        });

        this.get('#/add', function (context) {
            templates.get('add')
                .then(function (template) {
                    $content.html(template);
                    $('#addBtn').on('click', function () {
                        var name = $('#nameInput').val(),
                            age = $('#ageInput').val(),
                            addedPerson;
                        db.add(name, age)
                            .then(function (person) {
                                context.redirect('#/person/' + person.id);
                            }, function (error) {
                                $content.html(error);
                            });
                    });
                });
        });

        this.get('#/add/:name/:age', function (context) {
            db.add(this.params.name, this.params.age)
                .then(function (response) {
                    context.redirect('#/home');
                    loadPeople();
                }, function (error) {
                    $content.html(error);
                });
        });

        function loadPeople() {
            var people;
            db.get()
                .then(function (response) {
                    people = response;
                    return templates.get('people');
                }, function (error) {
                    $content.html(error);
                })
                .then(function (template) {
                    var peopleHtml = template({ result: people });
                    $content.html(peopleHtml);
                });
        }
    });

    $(function () {
        app.run('#/home');
    });
}