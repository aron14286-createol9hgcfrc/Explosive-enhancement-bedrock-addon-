import { world } from "@minecraft/server";

world.beforeEvents.explosion.subscribe((event) => {
  const { source, dimension } = event;

  if (!source) return; // in case explosion has no source

  const pos = source.location;
  const blockPos = {
    x: Math.floor(pos.x),
    y: Math.floor(pos.y),
    z: Math.floor(pos.z),
  };

  const block = dimension.getBlock(blockPos);
  const inWater =
    block?.typeId === "minecraft:water" ||
    block?.typeId === "minecraft:flowing_water";

  if (inWater) {
    spawnUnderwaterEffects(dimension, pos);
  } else {
    spawnNormalEffects(dimension, pos);
  }
});

function spawnNormalEffects(dim, pos) {
  const particlePos = { x: pos.x, y: pos.y + 0.5, z: pos.z };

  // Primary explosion effects
  dim.spawnParticle("ee:blastwave", particlePos);
  dim.spawnParticle("ee:fireball", particlePos);
  dim.spawnParticle("ee:spark", pos);
  dim.spawnParticle("ee:smoke", pos);

  // Directional smoke plumes
  dim.spawnParticle("ee:smoke", { x: pos.x + 0.75, y: pos.y + 0.5, z: pos.z });
  dim.spawnParticle("ee:smoke", { x: pos.x - 0.75, y: pos.y + 0.5, z: pos.z });
  dim.spawnParticle("ee:smoke", { x: pos.x, y: pos.y + 0.5, z: pos.z + 0.75 });
  dim.spawnParticle("ee:smoke", { x: pos.x, y: pos.y + 0.5, z: pos.z - 0.75 });
}

function spawnUnderwaterEffects(dim, pos) {
  dim.spawnParticle("ee:underwater_blast", { x: pos.x, y: pos.y + 0.5, z: pos.z });
  // add any other underwater particles here
}
