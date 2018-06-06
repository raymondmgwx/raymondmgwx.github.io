/* =========================================================================
 *
 *  Utils.ts
 *  Tools
 *
 * ========================================================================= */
module Utils {

    export class Selection{
        selectedYear:any;
        selectedTest:any;
        outcomeCategories:Object;
        missileCategories:Object;
        constructor(selectedYear: any, selectedTest: any, missileLookup: any,outcomeLookup:any) {
            this.selectedYear = selectedYear;
            this.selectedTest = selectedTest;
            this.outcomeCategories = new Object();
            for (var i in outcomeLookup) {
                this.outcomeCategories[i] = true;
            }
            this.missileCategories = new Object();
            for (var i in missileLookup) {
                this.missileCategories[i] = true;
            }
        }
        getOutcomeCategories(){
            var list = [];
            for (var i in this.outcomeCategories) {
                if (this.outcomeCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        }
        getMissileCategories() {
            var list = [];
            for (var i in this.missileCategories) {
                if (this.missileCategories[i]) {
                    list.push(i);
                }
            }
            return list;
        }
    }
}