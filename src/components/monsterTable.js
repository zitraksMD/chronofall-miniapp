import monster1 from "../Assets/monster1.png";
import monster2 from "../Assets/monster2.png";
import monster3 from "../Assets/monster3.png";
import monster4 from "../Assets/monster4.png";
import boss1 from "../Assets/boss1.png";
import finalBoss from "../Assets/final-boss.png";

const monsterTable = [
  { name: "Monster 1", image: monster1, hp: 90, damage:1},
  { name: "Monster 2", image: monster2, hp: 110, damage:2},
  { name: "Boss 1", image: boss1, hp: 400, damage:4, isBoss: true },
  { name: "Monster 3", image: monster3, hp: 150, damage:2 },
  { name: "Monster 4", image: monster4, hp: 210, damage:3 },
  { name: "Final Boss", image: finalBoss, hp: 570, damage:5, isBoss: true }
];

export default monsterTable;
