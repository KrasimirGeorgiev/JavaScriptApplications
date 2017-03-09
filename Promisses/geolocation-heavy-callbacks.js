(function () {
    var locationElement = document.getElementById("location-element");

    function visualizeGeolocation(imageCreationFunction) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                parseLatAndLongCoords(position, imageCreationFunction,
                    function (errorMessage) {
                        console.log("Could not parse coords: " + errorMessage);
                    });
            },
            function (error) {
                console.log("Could not access geolocation: " + error);
            });
    }

    function parseLatAndLongCoords(geolocationPosition, success, error) {
        var coords = geolocationPosition.coords;
        if (coords) {
            console.log(coords);
            success(coords);
        }
        else {
            error("Could not fing coords object. Are you sure you are passing a navigator.geolocation.getCurrentPosition result?");
        }
    }

    function createGeolocationImage(coords) {
        var imgElement = document.createElement("img"),
            imgSrc = "http://maps.googleapis.com/maps/api/staticmap?center=" + coords.latitude + "," + coords.longitude + "&zoom=14&size=400x400&key=AIzaSyC3DOVUE3Cop9-Ja7JAqjcgeUuEcb91raM";

        imgElement.setAttribute("src", imgSrc);

        locationElement.appendChild(imgElement);
    }

    visualizeGeolocation(createGeolocationImage);
}());