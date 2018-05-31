//**********************************************//
//
// eStatのインスタンスを生成
//
//**********************************************//
// APIの種類を生成する
function underbar_case(s) {
    return s.replace(/\.?([A-Z]+)/g, function(x, y) { return "_" + y; }).replace(/^_/, "").toUpperCase();
}
// キャピタルにする
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// url queryの作成
function build_queries(q) {
    return Object.keys(q).map(function(key) { return key + (q[key] ? "=" + q[key] : ""); }).join("&");
}

function drawTooltip(d, axis, tooltip) {
    var _tooltip_html = '';
    tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    tooltip.transition()
        .duration(200)
        .style("opacity", .9);
    var tooltip_html = ''
    tooltip_html += d[axis].name + ':' + d.$
    tooltip_html += d.unit != undefined ? d.unit : '';
    tooltip.html(tooltip_html)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 5) + "px");
    tooltip.style("visibility", "visible");
}

function moveTooltip(d, tooltip) {
    return tooltip.style("top", (event.pageY - 20) + "px").style("left", (event.pageX + 10) + "px");
}

function removeTooltip(d, tooltip) {
    return tooltip.style("visibility", "hidden");
}


var estatAPI = function(o) {
    return new Promise(function(resolve, reject) {
        var url = estatAPI.buildUrl(o);
        var api = underbar_case(o.api);
        if (o.userData != undefined) {
            if (o.api == estatAPI.config.GET_META_INFO) {
                o.userData.METADATA.GET_META_INFO.PARAMETER.STATS_DATA_ID = null
                resolve(o.userData.METADATA)
            } else {
                resolve(o.userData.STATDATA)
            }
        } else {
            $.getJSON(url).done(function(data) {
                if (data[api].RESULT.STATUS !== 0) {
                    reject({
                        status: data[api].RESULT.STATUS,
                        error_msg: data[api].RESULT.ERROR_MSG
                    });
                    return;
                }
                resolve(data);
            }).fail(function(e) {
                reject(e);
            });
        }
    });

};
estatAPI.config = {
    URL: "http://api.e-stat.go.jp/rest/2.0/app/json/",
    GET_STATS_LIST: "getStatsList",
    GET_META_INFO: "getMetaInfo",
    GET_STATS_DATA: "getStatsData",
    metaGetFlg: 'N'
}
estatAPI.buildUrl = function(o) {
    var q = {
        appId: o.appId
    };
    if (o.api === estatAPI.config.GET_STATS_LIST) {
        throw new Error('unimplemented');
    } else if (o.api === estatAPI.config.GET_META_INFO) {
        q.statsDataId = o.statsDataId;
    } else if (o.api === estatAPI.config.GET_STATS_DATA) {
        q.statsDataId = o.statsDataId;
        q.metaGetFlg = estatAPI.config.metaGetFlg;
        Object.keys(o.filters).filter(function(key) {
            return key === "time" || key === "area" || /^cat/.test(key);
        }).forEach(function(key) {
            var params = o.filters[key];
            if (typeof params === "string") {
                q["cd" + capitalize(key)] = params;
                return;
            }
            if (params.lv) {
                q["lv" + capitalize(key)] = params.lv;
            }
            if (params.cd) {
                q["cd" + capitalize(key)] = params.cd;
            }
            if (params.from) {
                q["cd" + capitalize(key) + "From"] = params.from;
            }
            if (params.to) {
                q["cd" + capitalize(key) + "To"] = params.to;
            }
        });
    }
    return estatAPI.config.URL + o.api + "?" + build_queries(q);
};