/* game code goes here */

$(document).ready(function() {
    var starWarsRPG = (function(){

        const playersContainerEl = $('.players');
        const playerEl = playersContainerEl.find('.player');
        const attackBtnEl = $('.attack');
        const heroEl = $('.hero');
        const opponentEl = $('.opponent');
        const enemiesContainerEl = $('.enemies-wrapper');
        const deadContainerEl = $('.dead');

        const winsEl = $('.wins');
        const lossesEl = $('.losses');

        let wins = 0;
        let losses = 0;

        let stats = {
            'healthPts': 0,
            'attackPwr': 0,
            'ctrAttackPwr': 0
        };

        let heroStats = Object.assign({}, stats);
        let opponentStats = Object.assign({}, stats);

        function init(){
            play();
        };

        function play(){
            heroSetup();
        };

        function heroSetup(){
            playerEl.on('click.one', function(){
                var hero = $(this);
                playerEl.off('click.one');
                //hero.appendTo(heroEl); // move hero to "stage"
                moveAnimate(hero,heroEl);

                heroPlayerEl = heroEl.find('.player');
                Object.keys(heroStats).forEach(function(key, index){
                    heroStats[key] = heroPlayerEl.attr('data-' + key);
                });
                heroStats['gameHealthPts'] = heroPlayerEl.attr('data-healthPts');
                heroStats['gameAttactPwr'] = heroPlayerEl.attr('data-attackPwr');

                // fade out choose character h2
                $('.players-wrapper h2').slideUp();
                enemiesContainerEl.slideDown();
                enemiesSetup();
            });
        };

        function enemiesSetup(){
            playersContainerEl.find('.player').appendTo(enemiesContainerEl); // move remaining players to "enemies"
            var enemies = enemiesContainerEl.find('.player');
            enemies.on('click.two', function(){
                var opponent = $(this);
                enemies.off('click.two');
                opponentSetup(opponent);
            });
        };

        function opponentSetup(opponent){
                moveAnimate(opponent,opponentEl); // move enemy to "stage"
                opponentPlayerEl = opponentEl.find('.player');
                Object.keys(opponentStats).forEach(function(key, index){
                    opponentStats[key] = opponentPlayerEl.attr('data-' + key);
                });
                opponentStats['gameHealthPts'] = opponentPlayerEl.attr('data-healthPts');
                // console.log('opponentStats')
                // console.log(opponentPlayerEl);
                // console.log(opponentStats);
                // before any attack make sure hero attack is reset
                heroStats['gameAttactPwr'] = heroPlayerEl.attr('data-attackPwr');
                attack();
        };

        function attack() {
            // activate button
            attackBtnEl.attr('disabled', false);
            var attackCtr = 1;
            attackBtnEl.on('click.attk', function(){
                // reduce opponent healthPts by attackPwr
                heroStats.gameAttactPwr = parseInt(heroStats.attackPwr) * attackCtr;
                // console.log('heroStats.gameAttactPwr ' + heroStats.gameAttactPwr);
                let oppGameHP = opponentStats.gameHealthPts - heroStats.gameAttactPwr;
                if (oppGameHP <= 0){
                    // dead
                    alert('opponent dead');
                    // opponentPlayerEl.appendTo(deadContainerEl);
                    moveAnimate(opponentPlayerEl,deadContainerEl);
                    attackCtr = 1;
                    attackBtnEl.attr('disabled', 'disabled');
                    pickNewOpponent();
                } else {
                    opponentStats.gameHealthPts = oppGameHP;
                    opponentPlayerEl.find('.health').text(opponentStats.gameHealthPts);
                }

                // reduce hero healthPts by ctrAttackPwr
                let heroGameHP = heroStats.gameHealthPts - opponentStats.ctrAttackPwr;
                if (heroGameHP <= 0) {
                    //dead
                    alert('hero dead');
                } else {
                    heroStats.gameHealthPts = heroGameHP;
                    heroPlayerEl.find('.health').text(heroStats.gameHealthPts);
                }
                attackCtr++;
            });
        };

        function pickNewOpponent() {
            var getRemainingEnemies = enemiesContainerEl.find('.player');
            getRemainingEnemies.on('click', function(){
                opponentSetup($(this));
                heroStats.gameAttactPwr = parseInt(heroStats.attackPwr);
                // console.log('pick heroStats.gameAttactPwr: ' + heroStats.gameAttactPwr);
                attackBtnEl.off('click.attk');
                attack();
            });
        }

        init();
    });

    starWarsRPG();

    function moveAnimate(element, newParent){
        //Allow passing in either a jQuery object or selector
        element = $(element);
        newParent= $(newParent);

        var oldOffset = element.offset();
        element.appendTo(newParent);
        var newOffset = element.offset();

        var temp = element.clone().appendTo('body');
        temp.css({
                'position': 'absolute',
                'left': oldOffset.left,
                'top': oldOffset.top,
                'z-index': 1000
        });
        element.hide();
        temp.animate({'top': newOffset.top, 'left': newOffset.left}, 'slow', function(){
             element.show();
             temp.remove();
        });
}

});