/* =========================================================================
 *
 *  Assemblages.js
 *  bind all of the components
 *
 * ========================================================================= */
/// <reference path="./Entity.ts" />
/// <reference path="./Component.ts" />
 module ECS{
    export class Assemblages{
        constructor() {}
        CollisionRect(){
            var entity = new ECS.Entity();
            entity.addComponent(new ECS.AppearanceComponent());
            entity.addComponent(new ECS.CollisionComponent());
            entity.addComponent(new ECS.PositionComponent());
            return entity;
        }
    }
}