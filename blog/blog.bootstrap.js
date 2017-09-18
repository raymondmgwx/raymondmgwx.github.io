//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////                                                                      //
////  Blog                  //////////   v0.0                                                               //
//////////////////////////////////////                                                                      //
//////////////////////////////////////  Copyright 2017-2018,                                                //
//////////////////////////////////////  Last vist: 09, 18, 2017  by Raymond Wang                            //
//////////////////////////////////////                                                                      //
/////////////////////////////////////////////////////////////////////////////////////////////////WANG  XU///-->

(function() {

    function _WRE(config) {
        console.log("Instantiating WRG");
        this.config = {
            viewEngine: "WebGL",
            contentWidth: 1024,
            contentHeight: 728,
            theme: "Blog"
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
            scriptLocation: toAbsolute(window.location.href, document.querySelector('script[src$="blog.bootstrap.js"]').getAttribute('src')).replace('/blog.bootstrap.js', ''),
        };

        var loc = this.runtime.scriptLocation + '/';

        this._psftjsLibraries = [
            loc + 'lib/bootstrap/bootstrap.min.js'
        ];

        this._components = [
            loc + 'blog.util.js',
            loc + 'blog.runtime.js',
            loc + 'blog.boot.js',
            loc + 'blog.ui.js',
            loc + 'blog.view.js'
        ];
        this._components.push(loc + 'blog.view._' + this.config.viewEngine.toLowerCase() + '.js');


        this.view = {};
        this.ui = {};


        this.bootstrap = function() {
            var self = this;
            this.bootstrap.loading(self.config.theme);

            switch (self.config.theme) {
                case "Blog":
                    loadScript(loc + 'lib/jquery-3.1.1.min.js', function() {
                        loadScript(loc + 'lib/tether.min.js', function() {
                            loadMultipleScripts(self._psftjsLibraries, function() {
                                console.log("Blog libraries successfully loaded.");
                                loadMultipleScripts(self._components, function() {
                                    console.log("Blog components successfully loaded.");
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
            preload.setAttribute('id', 'Blog-loading');
            preload.className = 'Blog-loading';
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