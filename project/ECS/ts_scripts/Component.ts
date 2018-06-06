/* =========================================================================
 *
 *  Component.ts
 *  Each entity can obtain many components
 *
 * ========================================================================= */
/// <reference path="./Config.ts" />
/// <reference path="./HashSet.ts" />
module ECS {
    export class Component {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
    }

    export class JsonDataComponent extends Component {
        data: string
        constructor(value: string = "") {
            super("jsondata");
            this.data = value;
        }
    }

    export class GlobalComponent extends Component {
        data: Utils.HashSet<any>;
        constructor(data: Utils.HashSet<any>) {
            super("global");
            this.data = data;
        }
    }
}
