function spawnNormalEffects(dim, pos, power) {
    // Blast Wave & Fireball
    dim.spawnParticle("ee:blast_wave", { x: pos.x, y: pos.y + 0.5, z: pos.z });
    dim.spawnParticle("ee:fireball", { x: pos.x, y: pos.y + 0.5, z: pos.z }); // Added fireball
    dim.spawnParticle("ee:spark", pos); // Added sparks
    
    // Mushroom Cloud
    const velY = (power * 0.4) / 1.85;
    const xzVel = 0.15 * power * 0.5;

    dim.spawnParticle("ee:smoke", pos); 
    dim.spawnVelocityParticle("ee:smoke", pos, { x: xzVel, y: velY, z: 0 });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: -xzVel, y: velY, z: 0 });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: 0, y: velY, z: xzVel });
    dim.spawnVelocityParticle("ee:smoke", pos, { x: 0, y: velY, z: -xzVel });
}
