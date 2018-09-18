/* =========================================================================
 *
 *  Component.ts
 *  Each entity can obtain many components
 *
 * ========================================================================= */
/// <reference path="./HashSet.ts" />
module ECS {
    export class Component {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
    }

}
