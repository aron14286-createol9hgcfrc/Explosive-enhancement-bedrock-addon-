import { world } from "@minecraft/server";

world.afterEvents.explosion.subscribe((event) => {
  const dim = event.dimension;
  
  // Use a safe fallback position - explosions always have dimension
  const pos = { x: event.source?.location?.x ?? 0, y: event.source?.location?.y ?? 64, z: event.source?.location?.z ?? 0 };
  
  const blockPos = { x: Math.floor(pos.x), y: Math.floor(pos.y), z: Math.floor(pos.z) };
  const block = dim.getBlock(blockPos);
  
  const inWater = block?.typeId === "minecraft:water" || block?.typeId === "minecraft:flowing_water";
  
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
  
  // Directional smoke
  dim.spawnParticle("ee:smoke", { x: pos.x + 0.75, y: pos.y + 0.5, z: pos.z });
  dim.spawnParticle("ee:smoke", { x: pos.x - 0.75, y: pos.y + 0.5, z: pos.z });
  dim.spawnParticle("ee:smoke", { x: pos.x, y: pos.y + 0.5, z: pos.z + 0.75 });
  dim.spawnParticle("ee:smoke", { x: pos.x, y: pos.y + 0.5, z: pos.z - 0.75 });
}

function spawnUnderwaterEffects(dim, pos) {
  dim.spawnParticle("ee:underwater_blast", { x: pos.x, y: pos.y + 0.5, z: pos.z });
  
  for (let i = 0; i < 20; i++) {
    dim.spawnParticle("minecraft:bubble_column_bubble", {
      x: pos.x + (Math.random() * 2 - 1) * 0.5,
      y: pos.y + Math.random(),
      z: pos.z + (Math.random() * 2 - 1) * 0.5
    });
  }
}
