function renderStats(health, attackBoost) {
    const healthBars = document.querySelectorAll('.tileP .health');
    healthBars.forEach(bar => {
        bar.style.width = health + '%';
    });

    const attackBars = document.querySelectorAll('.tileP .attack');
    attackBars.forEach(bar => {
        if (attackBoost > 0) {
            bar.style.width = attackBoost + '%';
            bar.style.backgroundColor = '#ffff00';
        } else {
            bar.style.width = '0%';
        }
    });
}