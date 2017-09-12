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
            theme: "PhysicsSimulationLab"
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
            scriptLocation: toAbsolute(window.location.href, document.querySelector('script[src$="psftjs.bootstrap.js"]').getAttribute('src')).replace('/psftjs.bootstrap.js', ''),
        };

        var loc = this.runtime.scriptLocation + '/';

        this._psftjsLibraries = [
            loc + 'lib/bootstrap/bootstrap.min.js',
            loc + 'lib/bootstrap/bootstrap-slider.min.js',
            loc + 'lib/jquery.jqplot.min.js',
            loc + 'lib/three/three.min.js'
        ];

        this._threejsPlugins = [
            loc + 'lib/three/control/TrackballControls.js',
            loc + 'lib/three/libs/stats.min.js',
            loc + 'lib/three/utils/Detector.js'
        ];

        this._jqplotPlugins = [
            loc + 'lib/jqplot_plugins/jqplot.canvasTextRenderer.js',
            loc + 'lib/jqplot_plugins/jqplot.canvasAxisTickRenderer.js',
            loc + 'lib/jqplot_plugins/jqplot.canvasAxisLabelRenderer.js',
            loc + 'lib/jqplot_plugins/jqplot.logAxisRenderer.js',
            loc + 'lib/jqplot_plugins/jqplot.highlighter.js',
            loc + 'lib/jqplot_plugins/jqplot.cursor.js',
            loc + 'lib/plot2D.js'
        ];


        this._components = [
            loc + 'psftjs.util.js',
            loc + 'psftjs.runtime.js',
            loc + 'psftjs.boot.js',
            loc + 'psftjs.ui.js',
            loc + 'psftjs.view.js'
        ];
        this._components.push(loc + 'psftjs.view._' + this.config.viewEngine.toLowerCase() + '.js');


        this.view = {};
        this.ui = {};


        this.bootstrap = function() {
            var self = this;
            this.bootstrap.loading(self.config.theme);

            switch (self.config.theme) {
                case "PhysicsSimulationLab":
                    loadScript(loc + 'lib/jquery-3.1.1.min.js', function() {
                        loadScript(loc + 'lib/tether.min.js', function() {
                            loadMultipleScripts(self._psftjsLibraries, function() {
                                console.log("PSL libraries successfully loaded.");
                                loadMultipleScripts(self._threejsPlugins, function() {
                                    loadMultipleScripts(self._jqplotPlugins, function() {
                                        console.log("PSL-plugins libraries successfully loaded.");
                                        loadMultipleScripts(self._components, function() {
                                            console.log("PSL components successfully loaded.");
                                            self.boot(function() {
                                                self.bootstrap.finishLoading();
                                            });
                                        });
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
                script.src = url;
                //script.src = url + '?' + new Date().getTime();
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
            preload.setAttribute('id', 'PSL-loading');
            preload.className = 'PSL-loading';
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