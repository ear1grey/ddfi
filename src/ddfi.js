if (rdfx === undefined) {
    var rdfx = {};
}

rdfx.ddfi = (function () {
    "use strict";
    var
        /*
        Fields that are displayed for all tyes of file
        (as used by the addStandardText function)
        */
        fields = ['size', 'type', 'lastModifiedDate'],


        /*
        placeholder for content to be injected into the document
        */
        info = document.querySelector("#info"),


        /*
        tages a targetID and an object
        The object is a series of name value pairs where
        the name is the name of the a tag to be created and
        its value is itself an object of nv pairs that are
        the attributes to add to the tag, e.g.
        {
           "img":{"alt":"example", "class":"awesome"},
           "img":{"alt":"another", "class":"cool"}
        }
        */
        addNodes = function (targetID, spec) {
            var x, k, l;
            for (k in spec) {
                if (spec.hasOwnProperty(k)) {
                    x = document.createElement(k);
                    for (l in spec[k]) {
                        if (spec[k].hasOwnProperty(l)) {
                            if (l === 'textContent') {
                                x.textContent = spec[k][l];
                            } else {
                                x.setAttribute(l, spec[k][l]);
                            }
                        }
                    }
                    document.querySelector(targetID).appendChild(x);
                }
            }
        },


        propToHTML = function (targetID, name, value) {
            document.querySelector(targetID).innerHTML +=
                "<div><span class='propname'>" +
                name + "</span><span class='prop'>" +
                value + "</span></div>";
        },

        /*
        Helper function for handlers that outputs standard text for any file
        */
        addStandardText = function (file, targetID) {
            var i;
            addNodes(targetID, {
                "h1": {
                    "textContent": file.name
                }
            });
            for (i = 0; i < fields.length; i += 1) {
                propToHTML(targetID, fields[i], file[fields[i]]);
            }
            propToHTML(targetID, "MD5", md5(event.target.result));
        },


        /*
        Handler for files that can be rendered using the HTML5 img tag
        */
        imageHandler = function (file, targetID) {
            var
                reader = new FileReader(),
                callback = function () {

                    addStandardText(file, targetID);

                    addNodes(targetID, {
                        "img": {
                            "width": "100%",
                            "alt": "An image the user inserted into the page",
                            'src': event.target.result,
                            'class': 'preview'
                        }
                    });
                };
            reader.addEventListener("load", callback);
            reader.readAsDataURL(file);
        },


        /*
        Handler for files that can be rendered using the HTML5 video tag
        */
        videoHandler = function (file, targetID) {
            var
                reader = new FileReader(),
                callback = function () {
                    addStandardText(targetID, file);
                    addNodes(targetID, {
                        "video": {
                            "width": "100%",
                            "alt": "An image the user inserted into the page",
                            'src': event.target.result,
                            'class': 'preview',
                            'controls': ""
                        }
                    });
                };
            reader.addEventListener("load", callback);
            reader.readAsDataURL(file);
        },

        /*
        Basic handler for files that do not have a bespoke
        rendering function.
        */
        genericHandler = function (file, targetID) {
            var
                reader = new FileReader(),
                callback = function () {
                    addStandardText(file, targetID);
                };
            reader.addEventListener("load", callback);
            reader.readAsDataURL(file);
        },


        /*
        Associate media types with bespoke handler functions.
        NB: handlers must be defined before this object or
        they show up as undefined.
        Perhaps have each handler function defined as an object that
        can state what types it handles, and then have objects register
        on discovery.
        */
        handler = {
            "image/jpeg": imageHandler,
            "image/png": imageHandler,
            "audio/ogg": videoHandler,
            "video/ogg": videoHandler,
            "video/ogv": videoHandler,
            "video/webm": videoHandler
        },



        /*
        Use the media type string of the file to select and invoke a bespoke
        handler for it, or invoke the generic handler if there is none
        */
        invokeSpecialHandler = function (file, targetID) {
            var handlerFunc = handler[file.type];
            if (handlerFunc) {
                handlerFunc(file, targetID);
            } else {
                genericHandler(file, targetID);
            }
        },


        /*
        Prepare for and invoke inspection that is necessary
        for individual files.
        */
        inspectFile = function (file) {
            var
                id = "id" + Math.random().toString(16).slice(2),
                x = "<section id='" + id + "' class='box data'></section>";

            info.innerHTML = info.innerHTML + x; // gain help for specific media types
            invokeSpecialHandler(file, "#" + id);
        },


        /*
        Loop over a files array that is generated by a
        drag and drop (or a file upload dialogue)
        */
        inspect = function (files) {
            var i;
            info.innerHTML = "";
            for (i = 0; i < files.length; i += 1) {
                inspectFile(files[i]);
            }
        },


        /*
        Setup the target (the page) to be aware of drag and drop events
        and to inspect whatever is dropped.
        */
        registerDragListeners = function (target) {
            target.addEventListener("dragover", function (e) {
                e.preventDefault();
            });
            target.addEventListener("drop", function (e) {
                e.preventDefault();
                inspect(e.dataTransfer.files);
            });
        };

    return {
        "go": registerDragListeners
    };
}());

window.addEventListener("load", function () {
    "use strict";
    rdfx.ddfi.go(window);
});
