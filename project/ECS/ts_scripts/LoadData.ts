/* =========================================================================
 *
 *  LoadData.ts
 *  load data from json file
 *
 * ========================================================================= */
/// <reference path="./System.ts" />
module Utils{
    export function loadData(path:string,jsondata:ECS.JsonDataComponent,callback: () => void){
        let cxhr = new XMLHttpRequest();
        cxhr.open('GET', path, true);
        cxhr.onreadystatechange = function() {
            if (cxhr.readyState === 4 && cxhr.status === 200) {
                jsondata.data = cxhr.responseText;
                if(callback)callback();
            }
        };
        cxhr.send(null);
    }
}
