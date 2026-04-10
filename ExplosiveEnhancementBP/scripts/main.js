import { world, system } from "@minecraft/server";

// 1. LISTEN FOR EXPLOSIONS (The Trigger)
world.afterEvents.entityDie.subscribe((event) => {
    const entity = event.deadEntity;
    
    // Target the specific entities from the Java mod
    const targets = ["minecraft:tnt", "minecraft:creeper", "minecraft:large_fireball", "minecraft:fireball"];
    
    if (targets.includes(entity.typeId)) {
        const pos = entity.location;
        const dim = entity.dimension;
        const power = 4.0; // Standard power value used for calculations

        // 2. CHECK FOR WATER (The Handler)
        const block = dim.getBlock(pos);
        if (block && block.isLiquid) {
            spawnUnderwaterEffects(dim, pos, power);
        } else {
            spawnNormalEffects(dim, pos, power);
        }
    }
});

// 3. LAND EXPLOSION LOGIC
function spawnNormalEffects(dim, pos, power) {
    const particlePos = { x: pos.x, y: pos.y + 0.5, z: pos.z };

    // Primary Layers
    dim.spawnParticle("ee:blastwave", particlePos);
    dim.spawnParticle("ee:fireball", particlePos);
    dim.spawnParticle("ee:spark", pos);
    
    // Mushroom Cloud Math (Ported from Java)
    const velY = (power * 0.4) / 1.85;
    const xzVel = 0.15 * power * 0.5;

    // Center smoke
    dim.spawnParticle("ee:smoke", pos); 
    
    // Directional smoke plumes
    dim.spawnVelocityParticle("ee:smoke", pos, { x: xzVel, y: velY, z: 0 });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: -xzVel, y: velY, z: 0 });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: 0, y: velY, z: xzVel });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: 0, y: velY, z: -xzVel });
}

// 4. UNDERWATER EXPLOSION LOGIC
function spawnUnderwaterEffects(dim, pos, power) {
    // Aquatic shockwave
    dim.spawnParticle("ee:underwater_blast", { x: pos.x, y: pos.y + 0.5, z: pos.z });
    
    // High-velocity bubble burst
    for (let i = 0; i < 20; i++) { 
        const vX = (Math.random() * 2 - 1) * 0.5;
        const vY = Math.random() * 1.0;
        const vZ = (Math.random() * 2 - 1) * 0.5;
        
        dim.spawnVelocityParticle("minecraft:bubble_column_bubble", pos, { x: vX, y: vY, z: vZ });
    }
}
