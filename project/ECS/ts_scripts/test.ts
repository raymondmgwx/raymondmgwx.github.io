/// <reference path="./Component.ts" />
/// <reference path="./Entity.ts" />
/// <reference path="./HashSet.ts" />

var human = new ECS.Entity();
var hair = new ECS.AppearanceComponent();
var hand = new ECS.PositionComponent();
human.addComponent(hair);
human.addComponent(hand);
human.removeComponent(hand);