import { world, system } from "@minecraft/server";

world.beforeEvents.explosion.subscribe((event) => {
  const { source, dimension } = event;

  // Exit if there is no source entity (like a bed explosion)
  if (!source) return;

  // Capture the location while the entity still exists
  const pos = { x: source.location.x, y: source.location.y, z: source.location.z };

  // Use system.run to move from 'read-only' before-event mode 
  // to 'read-write' mode so we can spawn particles
  system.run(() => {
    const blockPos = {
      x: Math.floor(pos.x),
      y: Math.floor(pos.y),
      z: Math.floor(pos.z),
    };

    const block = dimension.getBlock(blockPos);
    // Check if the explosion happened in water
    const inWater = block?.typeId.includes("water");

    if (inWater) {
      spawnUnderwaterEffects(dimension, pos);
    } else {
      spawnNormalEffects(dimension, pos);
    }
  });
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
  // Add bubbles or other underwater effects here
  dim.spawnParticle("minecraft:water_evaporation_bucket_emitter", pos); 
}
