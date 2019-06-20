DomReady.ready(function() {
  var sugarShaker = {};

  var props = {
    screenWidth: window.innerWidth
  };

  var utils = {
    show: function(el) {
      el.classList.add("enter");
      var timer = setTimeout(function() {
        el.classList.add("active");
        el.classList.remove("enter");
        clearTimeout(timer);
      }, 250);
    },

    hide: function(el) {
      el.classList.add("leave");
      var timer = setTimeout(function() {
        el.classList.remove("active", "leave");
        clearTimeout(timer);
      }, 250);
    },

    isValidEmail: function(value) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(value);
    },

    isEmptyOrNull: function(value) {
      return value.trim().length < 1;
    },

    reportError: function(field) {
      field.parentNode.classList.add("error");
    }
  };

  sugarShaker.tabs = {
    props: {
      autoPlay: true
    },

    startAutoPlay: function() {
      if (sugarShaker.tabs.props.autoPlay) {
        var container = document.getElementById("tabs-content");

        container.addEventListener("mouseenter", function(event) {
          event.target.classList.add("hovering");
        });
        container.addEventListener("mouseleave", function(event) {
          event.target.classList.remove("hovering");
        });
        sugarShaker.tabs.autoPlay();
      }
    },

    autoPlay: function() {
      var loop = setInterval(function() {
        if (sugarShaker.tabs.props.autoPlay) {
          if (
            !document
              .getElementById("tabs-content")
              .classList.contains("hovering")
          ) {
            var tabs = document.querySelectorAll("#tabs .tab"),
              activeTab = document.querySelectorAll("#tabs .active")[0],
              index = [].slice
                .call(document.querySelectorAll("#tabs .tab"))
                .indexOf(activeTab),
              newIndex = index + 1;

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
            var delay = setTimeout(function() {
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
      var links = document.querySelectorAll("#tabs .tab");

      // pre-loading
      var backgrounds = ["bg-design", "bg-engineering", "bg-consultancy"],
        imgArr = [];
      for (var b = 0; b < backgrounds.length; b++) {
        imgArr[b] = new Image();
        imgArr[b].src = "images/" + backgrounds[b] + ".png";
      }

      // attach events
      if (links && links.length) {
        for (var l = 0; l < links.length; l++) {
          links[l].onclick = function(e) {
            e.preventDefault();

            if (!e.target.classList.contains("active")) {
              // swap active class on tabs
              document
                .querySelectorAll("#tabs .active")[0]
                .classList.remove("active");
              e.target.classList.add("active");

              // get content reference
              var contentID = e.target.getAttribute("data-tab-content");

              // hide/show appropriate tab
              utils.hide(document.querySelectorAll("#tabs-content .active")[0]);
              var delay = setTimeout(function() {
                utils.show(document.getElementById(contentID));
                clearTimeout(delay);
              }, 250);
            }

            sugarShaker.tabs.props.autoPlay = false;

            if (sugarShaker.navigation.el.classList.contains("show")) {
              sugarShaker.navigation.hide();
            }
          };
        }

        sugarShaker.tabs.startAutoPlay();
      }
    }
  };

  sugarShaker.contact = {
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
          sugarShaker.contact.props.error = false;
          var errorFields = document.querySelectorAll(".error");
          for (var e = 0; e < errorFields.length; e++) {
            errorFields[e].classList.remove("error");
          }

          var requiredFields = document.querySelectorAll("[required]");
          for (var r = 0; r < requiredFields.length; r++) {
            sugarShaker.contact.validate(requiredFields[r]);
          }

          if (sugarShaker.contact.props.error) {
            event.preventDefault();
          }
        });
      }
    }
  };

  sugarShaker.navigation = {
    el: document.querySelector("#page-navigation"),

    init: function() {
      var trigger = document.querySelector("#trigger"),
        closeBtn = document.querySelector("#close");

      if (trigger) {
        trigger.addEventListener("click", function(e) {
          e.preventDefault();
          sugarShaker.navigation.show();
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener("click", function(e) {
          e.preventDefault();
          sugarShaker.navigation.hide();
        });
      }
    },

    show: function() {
      if (sugarShaker.navigation.el) {
        var screenWidth = window.innerWidth,
          pageWith = document.querySelectorAll(".page")[0].offsetWidth,
          rightMargin = (screenWidth - pageWith) / 2 - 7;

        rightMargin = rightMargin > 0 ? rightMargin : 0;
        sugarShaker.navigation.el.style.marginRight = rightMargin + "px";

        sugarShaker.navigation.el.classList.add("show");
        setTimeout(function() {
          sugarShaker.navigation.el.classList.add("on");
        }, 0);
      }
    },

    hide: function() {
      if (sugarShaker.navigation.el) {
        sugarShaker.navigation.el.classList.remove("on");
        setTimeout(function() {
          sugarShaker.navigation.el.classList.remove("show");
        }, 250);
      }
    },

    resize: function() {
      if (
        sugarShaker.navigation.el &&
        sugarShaker.navigation.el.classList.contains("show")
      ) {
        sugarShaker.navigation.hide();
      }
    }
  };

  sugarShaker.gallery = {
    el: document.querySelector(".gallery-images a"),

    init: function() {
      if (sugarShaker.gallery.el) {
        var thumbs = document.querySelectorAll(".gallery-images a"),
          imagesArr = [];

        for (var t = 0; t < thumbs.length; t++) {
          thumbs[t].addEventListener("click", function(e) {
            e.preventDefault();
            var link = e.target.parentNode;
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

  sugarShaker.pageBackground = {
    el: document.querySelectorAll(".page")[0],

    props: {
      bgs: ["bg-page", "bg-page-2", "bg-page-3"]
    },

    preLoad: function(Images, Callback) {
      // Keep the count of the verified images
      var allLoaded = 0;

      // The object that will be returned in the callback
      var _log = {
        success: [],
        error: []
      };

      // Executed every time an img is successfully or wrong loaded
      var verifier = function() {
        allLoaded++;

        // triggers the end callback when all images has been tested
        if (allLoaded === Images.length) {
          Callback.call(undefined, _log);
        }
      };

      for (var index = 0; index < Images.length; index++) {
        // Prevent that index has the same value by wrapping it inside an anonymous fn
        (function(i) {
          // Image path provided in the array e.g image.png
          var imgSource = "images/" + Images[i] + ".png",
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
      var bgIndex = 0;
      setInterval(function() {
        bgIndex++;
        if (bgIndex === sugarShaker.pageBackground.props.bgs.length) {
          bgIndex = 0;
        }
        sugarShaker.pageBackground.el.style.backgroundImage =
          "url('images/" +
          sugarShaker.pageBackground.props.bgs[bgIndex] +
          ".png')";
      }, 7000);
    },

    init: function() {
      sugarShaker.pageBackground.preLoad(
        sugarShaker.pageBackground.props.bgs,
        sugarShaker.pageBackground.autoPlay
      );
    }
  };

  sugarShaker.pageBackground.init();

  sugarShaker.gallery.init();

  sugarShaker.navigation.init();

  sugarShaker.tabs.init();

  sugarShaker.contact.init();

  window.onresize = function() {
    var newWidth = window.innerWidth,
      oldWidth = props.screenWidth;

    if (oldWidth !== newWidth) {
      props.screenWidth = newWidth;
      sugarShaker.navigation.resize();
    }
  };
});
