function downloadXML() {
    bootbox.prompt({
        title: "Title",
        value: "downloaded_file",
        callback: function (result) {

            if (result !== null && result !== "") {
                var colorNormal = $("#color-picker-shadow-input").val();
                var colorPressed = getPressedColor(colorNormal);
                var buttonIsFlat = !$("#bevelled").hasClass('active');
                var startColor = colorNormal;
                var centerColor = get600Color(colorNormal);
                var endColor = get700Color(colorNormal);
                var startColorPressed = colorPressed;
                var centerColorPressed = get600Color(colorPressed);
                var endColorPressed = get700Color(colorPressed);
                var bottomLeftRadius = $("#shadow-round-bl").val() + "dp";
                var bottomRightRadius = $("#shadow-round-br").val() + "dp";
                var topLeftRadius = $("#shadow-round-tl").val() + "dp";
                var topRightRadius = $("#shadow-round-tr").val() + "dp";


                var xmlParent = '<?xml version="1.0" encoding="utf-8"?>' +
                    '\n<selector xmlns:android="http://schemas.android.com/apk/res/android">' +
                    '\n<item android:drawable="@drawable/selector_' + result + '_button_pressed" android:state_enabled="true" android:state_pressed="true" />' +
                    '\n<item android:drawable="@drawable/selector_' + result + '_button_pressed" android:state_activated="true" android:state_enabled="true" />' +
                    '\n<item android:drawable="@drawable/selector_' + result + '_button_pressed" android:state_enabled="true" android:state_selected="true" />' +
                    '\n<item android:drawable="@drawable/selector_' + result + '_button_normal" />\n</selector>';

                var xmlPressed = '';
                var xmlNormal = '';

                if (buttonIsFlat === true) {

                    xmlPressed = '<?xml version="1.0" encoding="utf-8"?>' +
                        '\n<shape xmlns:android="http://schemas.android.com/apk/res/android">' +
                        '\n<solid android:color="' + colorPressed + '" />' +
                        '\n<corners android:bottomLeftRadius="' + bottomLeftRadius +
                        '"\nandroid:bottomRightRadius="' + bottomRightRadius +
                        '"\nandroid:topLeftRadius="' + topLeftRadius +
                        '"\nandroid:topRightRadius="' + topRightRadius + '" />' +
                        '\n</shape>';

                    xmlNormal = '<?xml version="1.0" encoding="utf-8"?>' +
                        '\n<shape xmlns:android="http://schemas.android.com/apk/res/android">' +
                        '\n<solid android:color="' + colorNormal + '" />' +
                        '\n<corners android:bottomLeftRadius="' + bottomLeftRadius +
                        '"\nandroid:bottomRightRadius="' + bottomRightRadius +
                        '"\nandroid:topLeftRadius="' + topLeftRadius +
                        '"\nandroid:topRightRadius="' + topRightRadius + '" />' +
                        '\n</shape>';
                } else {
                    xmlPressed = '<?xml version="1.0" encoding="utf-8"?>' +
                        '\n<shape xmlns:android="http://schemas.android.com/apk/res/android">' +
                        '\n<corners android:bottomLeftRadius="' + bottomLeftRadius +
                        '"\nandroid:bottomRightRadius="' + bottomRightRadius +
                        '"\nandroid:topLeftRadius="' + topLeftRadius +
                        '"\nandroid:topRightRadius="' + topRightRadius + '" />' +
                        '\n<gradient android:angle="-90" ' +
                        '\nandroid:centerColor="' + centerColorPressed +
                        '"\nandroid:endColor="' + endColorPressed +
                        '"\nandroid:startColor="' + startColorPressed + '" />' +
                        '\n</shape>';

                    xmlNormal = '<?xml version="1.0" encoding="utf-8"?>' +
                        '\n<shape xmlns:android="http://schemas.android.com/apk/res/android">' +
                        '\n<corners android:bottomLeftRadius="' + bottomLeftRadius +
                        '"\nandroid:bottomRightRadius="' + bottomRightRadius +
                        '"\nandroid:topLeftRadius="' + topLeftRadius +
                        '"\nandroid:topRightRadius="' + topRightRadius + '" />' +
                        '\n<gradient android:angle="-90" ' +
                        '\nandroid:centerColor="' + centerColor +
                        '"\nandroid:endColor="' + endColor +
                        '"\nandroid:startColor="' + startColor + '" />' +
                        '\n</shape>';
                }

                var zip = new JSZip();
                zip.folder(result)
                    .file('selector_' + result + '_button_normal.xml', xmlNormal)
                    .file('selector_' + result + '_button_pressed.xml', xmlPressed)
                    .file('selector_' + result + '_button.xml', xmlParent);
                zip.generateAsync({type: "blob"})
                    .then(function (content) {
                        saveAs(content, result + ".zip");
                    });


            }
        }
    });
}


function setRoundSimple(val) {
    $("#shadow-round-tl").val(val);
    $("#shadow-round-tr").val(val);
    $("#shadow-round-bl").val(val);
    $("#shadow-round-br").val(val);
}


function get600Color(color) {
    return getColorObject(tinycolor(color).darken(6), '600').hex;
}


function get700Color(color) {
    return getColorObject(tinycolor(color).darken(12), '700').hex;
}

function getPressedColor(color) {
    return getColorObject(tinycolor(color).darken(9), '550').hex;
}

function getColorObject(value, name) {
    var c = tinycolor(value);
    return {
        name: name,
        hex: c.toHexString(),
        darkContrast: c.isLight()
    };
}


$(document).ready(function () {

    $("#round-toggle").click(function () {
        var advanced = "advanced";
        var simple = "simple";

        if ($(this).text() == advanced) {
            $(this).text(simple);
            $("#round-simple").hide();
            $("#round-advanced").fadeIn("slow");
        } else {
            $(this).text(advanced);
            setRoundSimple($("#round-simple-input").val());
            $("#round-advanced").hide();
            $("#round-simple").fadeIn("slow");
        }

        // drawButton();
        $(this).blur();
    });

    $("#round-simple-input").on("input", function () {
        setRoundSimple($(this).val());
        var val = $("#round-simple-input").val();
        $("#android-button").css({"border-radius": "" + val + "px"});
        $("#android-button-pressed").css({"border-radius": "" + val + "px"});
    });

    $("#shadow-round-bl").on("input", function () {
        $("#android-button").css({"border-bottom-left-radius": "" + $(this).val() + "px"});
        $("#android-button-pressed").css({"border-bottom-left-radius": "" + $(this).val() + "px"});
    });

    $("#shadow-round-br").on("input", function () {
        $("#android-button").css({"border-bottom-right-radius": "" + $(this).val() + "px"});
        $("#android-button-pressed").css({"border-bottom-right-radius": "" + $(this).val() + "px"});
    });

    $("#shadow-round-tl").on("input", function () {
        $("#android-button").css({"border-top-left-radius": "" + $(this).val() + "px"});
        $("#android-button-pressed").css({"border-top-left-radius": "" + $(this).val() + "px"});
    });

    $("#shadow-round-tr").on("input", function () {
        $("#android-button").css({"border-top-right-radius": "" + $(this).val() + "px"});
        $("#android-button-pressed").css({"border-top-right-radius": "" + $(this).val() + "px"});
    });

    $("#color-picker-shadow").colorpicker().on("changeColor", function (ev) {
        var val = $("#color-picker-shadow-input").val();
        $("#android-button").css({"background": "" + val + ""});
        $("#android-button-pressed").css({"background": "" + getPressedColor(val) + ""});
        var bevelled = $("#bevelled");
        if (bevelled.hasClass('active')) {
            bevelled.click();
        }
    });

    $("#flat").on("click", function (ev) {
        var color = $("#color-picker-shadow-input").val();
        var button = $("#android-button");
        button.css({"background": "" + color + ""});

        var button_pressed = $("#android-button-pressed");
        button_pressed.css({"background": "" + getPressedColor(color) + ""});
    });

    $("#bevelled").on("click", function (ev) {
        var color = $("#color-picker-shadow-input").val();
        var button = $("#android-button");
        button.css({"background-image": "-moz-linear-gradient(top, " + color + " 0%, " + get600Color(color) + " 50%, " + get700Color(color) + " 100%)"});
        button.css({"background-image": "linear-gradient(top," + color + " 0%, " + get600Color(color) + " 50%, " + get700Color(color) + " 100%)"});
        button.css({"background-image": "-webkit-linear-gradient(top," + color + " 0%, " + get600Color(color) + " 50%, " + get700Color(color) + " 100%)"});
        button.css({"background-image": "-o-linear-gradient(top," + color + " 0%, " + get600Color(color) + " 50%, " + get700Color(color) + " 100%)"});
        button.css({"background-image": "-ms-linear-gradient(top," + color + " 0%, " + get600Color(color) + " 50%, " + get700Color(color) + " 100%)"});
        button.css({"background-image": "-webkit-gradient(linear, right top, right bottom, color-stop(0%," + color + "), color-stop(50%," + get600Color(color) + "), color-stop(100%," + get700Color(color) + ")"});


        var button_pressed = $("#android-button-pressed");
        var pressedColor = getPressedColor(color);
        button_pressed.css({"background-image": "-moz-linear-gradient(top, " + pressedColor + " 0%, " + get600Color(pressedColor) + " 50%, " + get700Color(pressedColor) + " 100%)"});
        button_pressed.css({"background-image": "linear-gradient(top," + pressedColor + " 0%, " + get600Color(pressedColor) + " 50%, " + get700Color(pressedColor) + " 100%)"});
        button_pressed.css({"background-image": "-webkit-linear-gradient(top," + pressedColor + " 0%, " + get600Color(pressedColor) + " 50%, " + get700Color(pressedColor) + " 100%)"});
        button_pressed.css({"background-image": "-o-linear-gradient(top," + pressedColor + " 0%, " + get600Color(pressedColor) + " 50%, " + get700Color(pressedColor) + " 100%)"});
        button_pressed.css({"background-image": "-ms-linear-gradient(top," + pressedColor + " 0%, " + get600Color(pressedColor) + " 50%, " + get700Color(pressedColor) + " 100%)"});
        button_pressed.css({"background-image": "-webkit-gradient(linear, right top, right bottom, color-stop(0%," + pressedColor + "), color-stop(50%," + get600Color(pressedColor) + "), color-stop(100%," + get700Color(pressedColor) + ")"});

    });

    $("#btn-width-input").on("input", function () {
        $("#android-button").css({"width": "" + $(this).val() + ""});
        $("#android-button-pressed").css({"width": "" + $(this).val() + ""});
    });

    $("#btn-height-input").on("input", function () {
        $("#android-button").css({"height": "" + $(this).val() + ""});
        $("#android-button-pressed").css({"height": "" + $(this).val() + ""});
    });

    $('#copyright').html("&copy; " + new Date().getFullYear() + ", Adeyinka Adediji");


});


