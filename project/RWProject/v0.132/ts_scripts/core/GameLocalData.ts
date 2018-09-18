/* =========================================================================
 *
 *  GameLocalData.ts
 *  local storage for game
 *
 * ========================================================================= */
module ECS{
    export class GameLocalData{
        id:string;
        constructor(id:string){
            this.id = id;
        }
        
        store(key:any, value:any) 
        {
            localStorage.setItem(this.id + '.' + key, value);
        }

        get(key:any) 
        {
            return localStorage.getItem(this.id + '.' + key) || 0;
        }

        remove(key:any)
        {
            localStorage.removeItem(this.id + '.' + key);
        }

        reset() 
        {
            for(var i in localStorage) 
            {
                if(i.indexOf(this.id + '.') !== -1) localStorage.removeItem(i);
            }
        }
    }
}