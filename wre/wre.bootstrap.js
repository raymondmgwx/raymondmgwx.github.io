//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  W-RayEngine            //////////   v0.0                                                              //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 4, 16, 2017  by Raymond Wang                             //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->


(function() {

    function _WRE(config) {
        console.log("Instantiating WRG");
        this.config = {
            viewEngine: "WebGL",
            contentWidth: 1024,
            contentHeight: 728,
            theme: "W-RayEngine"
        };
        if (config) {
            for (var a in config) {
                this.config[a] = config[a];
            }
        }
        this._config = {
            contentPageAttrName: "data-WRE-page",
            contentPageTitleAttrName: "data-WRE-pagetitle"
        };
        this.runtime = {
            platform: "WebGL",
            browser: "Chrome",
            scriptLocation: toAbsolute(window.location.href, document.querySelector('script[src$="wre.bootstrap.js"]').getAttribute('src')).replace('/wre.bootstrap.js', ''),
        };

        var loc = this.runtime.scriptLocation + '/';

        this._wreLibraries = [
            loc + 'lib/bootstrap/bootstrap.min.js',
            loc + 'lib/numeric-1.2.6.min.js',
            loc + 'lib/webgl/webgl-util.js',
            loc + 'lib/webgl/webgl-debug.js',
            loc + 'lib/webgl/wre.point.js',
            loc + 'lib/webgl/wre.vector3.js',
            loc + 'lib/webgl/wre.vector4.js',
            loc + 'lib/webgl/wre.raylines.js',
            loc + 'lib/webgl/wre.mathutils.js',
            loc + 'lib/webgl/wre.matrix4x4.js',
            loc + 'lib/webgl/wre.camera.js',
            loc + 'lib/webgl/wre.draggablepoints.js',
            loc + 'lib/webgl/wre.inputeventhandler.js',
            loc + 'lib/webgl/wre.bezier.js',
            loc + 'lib/webgl/wre.hermite.js',
            loc + 'lib/webgl/wre.bspline.js',
            loc + 'lib/webgl/wre.beziersurface.js',
            loc + 'lib/webgl/wre.nurbsutils.js',
            loc + 'lib/webgl/wre.nurbscurve.js'
        ];

        this._canvas2dLibraries = [
            loc + 'lib/canvas2d/wre.vector2.js',
            loc + 'lib/canvas2d/wre.2dline.js'
        ];

        this._imvcWebLibraries = [
            loc + 'lib/bootstrap/bootstrap.min.js',
            loc + 'lib/imvc-web-theme/lib/wow/dist/wow.js',
            loc + 'lib/imvc-web-theme/lib/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.js',
            loc + 'lib/imvc-web-theme/lib/isotope/dist/isotope.pkgd.js',
            loc + 'lib/imvc-web-theme/lib/imagesloaded/imagesloaded.pkgd.js',
            loc + 'lib/imvc-web-theme/lib/flexslider/jquery.flexslider.js',
            loc + 'lib/imvc-web-theme/lib/owl.carousel/dist/owl.carousel.min.js',
            loc + 'lib/imvc-web-theme/lib/smoothscroll.js',
            loc + 'lib/imvc-web-theme/lib/magnific-popup/dist/jquery.magnific-popup.js',
            loc + 'lib/imvc-web-theme/lib/simple-text-rotator/jquery.simple-text-rotator.min.js',
            loc + 'lib/imvc-web-theme/js/plugins.js'
        ];

        this._components = [
            loc + 'wre.util.js',
            loc + 'wre.runtime.js',
            loc + 'wre.boot.js',
            loc + 'wre.ui.js',
            loc + 'wre.view.js'

        ];
        this._components.push(loc + 'wre.view._' + this.config.viewEngine.toLowerCase() + '.js');


        this.view = {};
        this.ui = {};


        this.bootstrap = function() {
            var self = this;

            setUIMode(self);

            this.bootstrap.loading(self.config.theme);

            switch (self.config.theme) {
                case "W-RayEngine":
                    loadScript(loc + 'lib/jquery-3.1.1.min.js', function() {
                        loadScript(loc + 'lib/tether.min.js', function() {
                            loadMultipleScripts(self._canvas2dLibraries, function() {
                                console.log("WRE canvas2d library successfully loaded.");
                            });


                            loadMultipleScripts(self._wreLibraries, function() {
                                console.log("WRE libraries successfully loaded.");
                                loadMultipleScripts(self._components, function() {
                                    console.log("WRE components successfully loaded.");
                                    self.boot(function() {
                                        self.bootstrap.finishLoading();
                                    });
                                });
                            });
                        });
                    });
                    break;
                case "Image-Visual-Lab":
                    loadScript(loc + 'lib/jquery-3.1.1.min.js', function() {
                        loadScript(loc + 'lib/tether.min.js', function() {
                            loadMultipleScripts(self._imvcWebLibraries, function() {
                                console.log("WRE imvc web theme successfully loaded.");
                            });

                            loadMultipleScripts(self._canvas2dLibraries, function() {
                                console.log("WRE canvas2d library successfully loaded.");
                                loadMultipleScripts(self._components, function() {
                                    console.log("WRE components successfully loaded.");
                                    self.boot(function() {
                                        self.bootstrap.finishLoading();
                                    });
                                });
                            });
                        });
                    });
                    break;
            }



            function loadScript(url, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                if (script.readyState) { //IE
                    script.onreadystatechange = function() {
                        if (script.readyState == "loaded" || script.readyState == "complete") {
                            script.onreadystatechange = null;
                            //console.log(url + " loaded.");
                            callback();
                        }
                    };
                } else { //Others
                    script.onload = function() {
                        //console.log(url + " loaded.");
                        callback();
                    };
                }
                //script.src = url;
                script.src = url + '?' + new Date().getTime();
                document.getElementsByTagName("head")[0].appendChild(script);
            }

            function loadMultipleScripts(urlArray, callback) {
                // /console.log(urlArray.length);
                var counter = urlArray.length;
                for (var i = 0; i < urlArray.length; i++) {
                    loadScript(urlArray[i], function() {
                        counter = counter - 1;
                        if (counter == 0) {
                            callback();
                        }
                    });
                }
            }
        };
        this.bootstrap.loading = function(theme) {
            console.log('Start loading...');
            var preload = document.createElement('div');
            preload.setAttribute('id', 'WRE-loading');
            preload.className = 'WRE-loading';
            preload.style.position = "absolute";
            preload.style.bottom = 0;
            preload.style.top = 0;
            preload.style.left = 0;
            preload.style.right = 0;
            preload.style.backgroundColor = '#eee';
            preload.style.zIndex = 20000;


            var preloadImg = document.createElement('img');
            preloadImg.setAttribute('src', loc + 'theme/' + theme + '/images/loading.gif');
            preloadImg.setAttribute('width', '32px');
            preloadImg.setAttribute('height', '32px');
            preloadImg.style.backgroundColor = 'transparent';
            preloadImg.style.position = "absolute";
            preloadImg.style.bottom = 0;
            preloadImg.style.top = 0;
            preloadImg.style.left = 0;
            preloadImg.style.right = 0;
            preloadImg.style.display = 'block';
            preloadImg.style.margin = 'auto auto';
            // preloadImg.style.width = '52px';
            // preloadImg.style.height = '52px';

            preload.appendChild(preloadImg);
            document.body.appendChild(preload);
            this.loading.dom = preload;
        };
        this.bootstrap.finishLoading = function() {
            document.body.removeChild(this.loading.dom);
            console.log('Loading finished.');
        };


        this.bootstrap();

        function getReqQuery() {
            if (window.location.href.split('?').length == 1) {
                return {};
            }
            var queryString = window.location.href.split('?')[1];

            var queryObj = {};

            if (queryString != '') {
                var querys = queryString.split("&");
                for (var i = 0; i < querys.length; i++) {
                    var key = querys[i].split('=')[0];
                    var value = querys[i].split('=')[1];
                    queryObj[key] = value;
                }
            }
            //var queryObj = $.url().param();
            //console.log(queryObj);
            return queryObj;
        }

        function setUIMode(self) {

            if (getReqQuery().theme != null) {
                self.config.theme = getReqQuery().theme;
                console.log("theme set to " + self.config.theme + ".");
            }


        }

        function toAbsolute(base, relative) {
            base = base.split('?')[0];
            var stack = base.split("/"),
                parts = relative.split("/");
            stack.pop(); // remove current file name (or empty string)
            // (omit if "base" is the current folder without trailing slash)
            for (var i = 0; i < parts.length; i++) {
                if (parts[i] == ".")
                    continue;
                if (parts[i] == "..")
                    stack.pop();
                else
                    stack.push(parts[i]);
            }
            return stack.join("/");
        }
    }

    window.WRE = new _WRE();
})();