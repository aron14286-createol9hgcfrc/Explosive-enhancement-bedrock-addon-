import { world, system } from "@minecraft/server";

// This mimics the Java "spawnParticles" logic
world.afterEvents.entityDie.subscribe((event) => {
    const entity = event.deadEntity;
    
    // We target TNT, Creepers, and Fireballs
    const targets = ["minecraft:tnt", "minecraft:creeper", "minecraft:fireball"];
    if (targets.includes(entity.typeId)) {
        const pos = entity.location;
        const dim = entity.dimension;
        const power = 4.0; // Standard TNT power; you can adjust this

        // Check if underwater (The "blockIsInWater" Java logic)
        const block = dim.getBlock(pos);
        if (block.isLiquid) {
            spawnUnderwaterEffects(dim, pos, power);
        } else {
            spawnNormalEffects(dim, pos, power);
        }
    }
});

function spawnNormalEffects(dim, pos, power) {
    // Blast Wave & Fireball
    dim.spawnParticle("ee:blast_wave", { x: pos.x, y: pos.y + 0.5, z: pos.z });
    
    // Mushroom Cloud (Ported from your spawnMushroomCloud Java code)
    const velY = (power * 0.4) / 1.85;
    const xzVel = 0.15 * power * 0.5;

    // Center smoke
    dim.spawnParticle("ee:smoke", pos); 
    // Expanding smoke (replicating the 4 directional offsets from the Java code)
    dim.spawnVelocityParticle("ee:smoke", pos, { x: xzVel, y: velY, z: 0 });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: -xzVel, y: velY, z: 0 });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: 0, y: velY, z: xzVel });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: 0, y: velY, z: -xzVel });
}

function spawnUnderwaterEffects(dim, pos, power) {
    dim.spawnParticle("ee:underwater_blast", pos);
    
    // Bubble logic (Ported from your spawnBubbles Java code)
    for (let i = 0; i < 20; i++) { // CONFIG.bubbleAmount
        const vX = (Math.random() * 2 - 1) * 0.5;
        const vY = Math.random() * 1.0;
        const vZ = (Math.random() * 2 - 1) * 0.5;
        dim.spawnVelocityParticle("minecraft:bubble_column_bubble", pos, { x: vX, y: vY, z: vZ });
    }
}
