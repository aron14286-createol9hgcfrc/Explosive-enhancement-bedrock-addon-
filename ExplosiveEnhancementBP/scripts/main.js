import { world, MolangVariableMap } from "@minecraft/server";

world.afterEvents.explosion.subscribe((event) => {
  const dim = event.dimension;
  const pos = event.location ?? event.source?.location;

  if (!pos) return;

  const blockPos = {
    x: Math.floor(pos.x),
    y: Math.floor(pos.y),
    z: Math.floor(pos.z),
  };

  const block = dim.getBlock(blockPos);
  const inWater =
    block?.typeId === "minecraft:water" ||
    block?.typeId === "minecraft:flowing_water";

  if (inWater) {
    spawnUnderwaterEffects(dim, pos);
  } else {
    spawnNormalEffects(dim, pos);
  }
});

function spawnNormalEffects(dim, pos) {
  const particlePos = { x: pos.x, y: pos.y + 0.5, z: pos.z };

  dim.spawnParticle("ee:blastwave", particlePos);
  dim.spawnParticle("ee:fireball", particlePos);
  dim.spawnParticle("ee:spark", pos);
  dim.spawnParticle("ee:smoke", pos);

  const molang = new MolangVariableMap();

  for (const offset of [
    { x: 0.75, y: 0, z: 0 },
    { x: -0.75, y: 0, z: 0 },
    { x: 0, y: 0, z: 0.75 },
    { x: 0, y: 0, z: -0.75 },
  ]) {
    dim.spawnParticle(
      "ee:smoke",
      { x: pos.x + offset.x, y: pos.y + 0.5, z: pos.z + offset.z },
      molang
    );
  }
}

function spawnUnderwaterEffects(dim, pos) {
  dim.spawnParticle("ee:underwaterblastwave", {
    x: pos.x,
    y: pos.y + 0.5,
    z: pos.z,
  });

  for (let i = 0; i < 20; i++) {
    dim.spawnParticle("minecraft:bubble_column_bubble", {
      x: pos.x + (Math.random() * 2 - 1) * 0.5,
      y: pos.y + Math.random(),
      z: pos.z + (Math.random() * 2 - 1) * 0.5,
    });
  }
}
