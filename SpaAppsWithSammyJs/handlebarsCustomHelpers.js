Handlebars.registerHelper('link', function (id, name) {
    var link = '<a class="greenLink" href="#/person/' + id + '">' + name + '</a>';
    return new Handlebars.SafeString(link);
});