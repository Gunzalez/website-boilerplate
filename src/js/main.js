DomReady.ready(function() {
    const main = {};

    const props = {
        screenWidth: window.innerWidth
    };

    const utils = {
        show: function(el) {
            el.classList.add("enter");
            const timer = setTimeout(function() {
                el.classList.add("active");
                el.classList.remove("enter");
                clearTimeout(timer);
            }, 250);
        },

        hide: function(el) {
            el.classList.add("leave");
            const timer = setTimeout(function() {
                el.classList.remove("active", "leave");
                clearTimeout(timer);
            }, 250);
        },

        isValidEmail: function(value) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        },

        isEmptyOrNull: function(value) {
            return value.trim().length < 1;
        },

        reportError: function(field) {
            field.parentNode.classList.add("error");
        }
    };

    main.tabs = {
        props: {
            autoPlay: true
        },

        startAutoPlay: function() {
            if (main.tabs.props.autoPlay) {
                const container = document.getElementById("tabs-content");

                container.addEventListener("mouseenter", function(event) {
                    event.target.classList.add("hovering");
                });
                container.addEventListener("mouseleave", function(event) {
                    event.target.classList.remove("hovering");
                });
                main.tabs.autoPlay();
            }
        },

        autoPlay: function() {
            const loop = setInterval(function() {
                if (main.tabs.props.autoPlay) {
                    if (
                        !document
                            .getElementById("tabs-content")
                            .classList.contains("hovering")
                    ) {
                        const tabs = document.querySelectorAll("#tabs .tab"),
                            activeTab = document.querySelectorAll("#tabs .active")[0],
                            index = [].slice
                                .call(document.querySelectorAll("#tabs .tab"))
                                .indexOf(activeTab);
                            let newIndex = index + 1;

                        if (newIndex === tabs.length) {
                            newIndex = 0;
                        }

                        document
                            .querySelectorAll("#tabs .active")[0]
                            .classList.remove("active");
                        document
                            .querySelectorAll("#tabs .tab")
                            [newIndex].classList.add("active");

                        utils.hide(document.querySelectorAll("#tabs-content .active")[0]);
                        const delay = setTimeout(function() {
                            utils.show(
                                document.querySelectorAll("#tabs-content .tab-content")[
                                    newIndex
                                    ]
                            );
                            clearTimeout(delay);
                        }, 250);
                    }
                } else {
                    clearInterval(loop);
                }
            }, 7000);
        },

        init: function() {
            const links = document.querySelectorAll("#tabs .tab");

            // pre-loading
            const backgrounds = ["bg-design", "bg-engineering", "bg-consultancy"],
                imgArr = [];
            for (const b = 0; b < backgrounds.length; b++) {
                imgArr[b] = new Image();
                imgArr[b].src = "images/" + backgrounds[b] + ".png";
            }

            // attach events
            if (links && links.length) {
                for (let l = 0; l < links.length; l++) {
                    links[l].onclick = function(e) {
                        e.preventDefault();

                        if (!e.target.classList.contains("active")) {
                            // swap active class on tabs
                            document
                                .querySelectorAll("#tabs .active")[0]
                                .classList.remove("active");
                            e.target.classList.add("active");

                            // get content reference
                            const contentID = e.target.getAttribute("data-tab-content");

                            // hide/show appropriate tab
                            utils.hide(document.querySelectorAll("#tabs-content .active")[0]);
                            const delay = setTimeout(function() {
                                utils.show(document.getElementById(contentID));
                                clearTimeout(delay);
                            }, 250);
                        }

                        main.tabs.props.autoPlay = false;

                        if (main.navigation.el.classList.contains("show")) {
                            main.navigation.hide();
                        }
                    };
                }

                main.tabs.startAutoPlay();
            }
        }
    };

    main.contact = {
        el: document.getElementById("contact-form"),

        props: {
            error: false
        },

        validate: function(field) {
            if (field.type === "checkbox") {
                if (!field.checked) {
                    this.props.error = true;
                    utils.reportError(field.parentNode);
                }
            } else if (field.type === "email") {
                if (!utils.isValidEmail(field.value)) {
                    this.props.error = true;
                    utils.reportError(field);
                }
            } else {
                if (utils.isEmptyOrNull(field.value)) {
                    this.props.error = true;
                    utils.reportError(field);
                }
            }
        },

        init: function() {
            if (this.el) {
                this.el.addEventListener("submit", function(event) {
                    main.contact.props.error = false;
                    const errorFields = document.querySelectorAll(".error");
                    for (let e = 0; e < errorFields.length; e++) {
                        errorFields[e].classList.remove("error");
                    }

                    const requiredFields = document.querySelectorAll("[required]");
                    for (let r = 0; r < requiredFields.length; r++) {
                        main.contact.validate(requiredFields[r]);
                    }

                    if (main.contact.props.error) {
                        event.preventDefault();
                    }
                });
            }
        }
    };

    main.navigation = {
        el: document.querySelector("#page-navigation"),

        init: function() {
            const trigger = document.querySelector("#trigger"),
                closeBtn = document.querySelector("#close");

            if (trigger) {
                trigger.addEventListener("click", function(e) {
                    e.preventDefault();
                    main.navigation.show();
                });
            }

            if (closeBtn) {
                closeBtn.addEventListener("click", function(e) {
                    e.preventDefault();
                    main.navigation.hide();
                });
            }
        },

        show: function() {
            if (main.navigation.el) {
                const screenWidth = window.innerWidth,
                    pageWith = document.querySelectorAll(".page")[0].offsetWidth;

                let rightMargin = (screenWidth - pageWith) / 2 - 7;
                rightMargin = rightMargin > 0 ? rightMargin : 0;

                main.navigation.el.style.marginRight = rightMargin + "px";

                main.navigation.el.classList.add("show");
                setTimeout(function() {
                    main.navigation.el.classList.add("on");
                }, 0);
            }
        },

        hide: function() {
            if (main.navigation.el) {
                main.navigation.el.classList.remove("on");
                setTimeout(function() {
                    main.navigation.el.classList.remove("show");
                }, 250);
            }
        },

        resize: function() {
            if (
                main.navigation.el &&
                main.navigation.el.classList.contains("show")
            ) {
                main.navigation.hide();
            }
        }
    };

    main.gallery = {
        el: document.querySelector(".gallery-images a"),

        init: function() {
            if (main.gallery.el) {
                const thumbs = document.querySelectorAll(".gallery-images a"),
                    imagesArr = [];

                for (let t = 0; t < thumbs.length; t++) {
                    thumbs[t].addEventListener("click", function(e) {
                        e.preventDefault();
                        const link = e.target.parentNode;
                        if (!link.classList.contains("active")) {
                            document
                                .querySelectorAll(".gallery-images .active")[0]
                                .classList.remove("active");
                            link.classList.add("active");
                            document.querySelector("#main-image").src = link.href;
                            document.querySelector("#main-image").alt = link.title;
                        }
                    });

                    // pre-loading images
                    imagesArr[t] = new Image();
                    imagesArr[t].src = thumbs[t].href;
                }
            }
        }
    };

    main.pageBackground = {
        el: document.querySelectorAll(".page")[0],

        props: {
            bgs: ["bg-page", "bg-page-2", "bg-page-3"]
        },

        preLoad: function(Images, Callback) {
            // Keep the count of the verified images
            let allLoaded = 0;

            // The object that will be returned in the callback
            const _log = {
                success: [],
                error: []
            };

            // Executed every time an img is successfully or wrong loaded
            const verifier = function() {
                allLoaded++;

                // triggers the end callback when all images has been tested
                if (allLoaded === Images.length) {
                    Callback.call(undefined, _log);
                }
            };

            for (let index = 0; index < Images.length; index++) {
                // Prevent that index has the same value by wrapping it inside an anonymous fn
                (function(i) {
                    // Image path provided in the array e.g image.png
                    const imgSource = "images/" + Images[i] + ".png",
                        img = new Image();

                    img.addEventListener(
                        "load",
                        function() {
                            _log.success.push(imgSource);
                            verifier();
                        },
                        false
                    );

                    img.addEventListener(
                        "error",
                        function() {
                            _log.error.push(imgSource);
                            verifier();
                        },
                        false
                    );

                    img.src = imgSource;
                })(index);
            }
        },

        autoPlay: function(_) {
            let bgIndex = 0;
            setInterval(function() {
                bgIndex++;
                if (bgIndex === main.pageBackground.props.bgs.length) {
                    bgIndex = 0;
                }
                main.pageBackground.el.style.backgroundImage =
                    "url('images/" +
                    main.pageBackground.props.bgs[bgIndex] +
                    ".png')";
            }, 7000);
        },

        init: function() {
            main.pageBackground.preLoad(
                main.pageBackground.props.bgs,
                main.pageBackground.autoPlay
            );
        }
    };

    main.pageBackground.init();

    main.gallery.init();

    main.navigation.init();

    main.tabs.init();

    main.contact.init();

    window.onresize = function() {
        const newWidth = window.innerWidth,
            oldWidth = props.screenWidth;

        if (oldWidth !== newWidth) {
            props.screenWidth = newWidth;
            main.navigation.resize();
        }
    };
});
