/* game code goes here */

$(document).ready(function() {
    var starWarsRPG = (function(){

        const playersEl = $('.players');
        const playerEl = playersEl.find('.player');
        const attackBtnEl = $('.attack');
        const heroEl = $('.hero');
        const opponentEl = $('.opponent');
        const enemiesWrapperEl = $('.enemies-wrapper');
        const enemiesEl = $('.enemies');
        const deadWrapperEl = $('.dead-wrapper');
        const deadEl = $('.dead');
        const messageEl = $('.message');
        const youDiedEl = $('.you-died');
        const lightsaberOn1 = new Audio('assets/audio/Lightsaber-Turn-On.mp3');
        const lightsaberOn2 = new Audio('assets/audio/coolsaber.mp3');

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
                // play lightsaber on
                lightsaberOn1.play();
                var hero = $(this);
                playerEl.off('click.one');
                // move hero to "stage"
                moveAnimate(hero,heroEl);

                heroPlayerEl = heroEl.find('.player');
                Object.keys(heroStats).forEach(function(key, index){
                    heroStats[key] = heroPlayerEl.attr('data-' + key);
                });
                heroStats['gameHealthPts'] = heroPlayerEl.attr('data-healthPts');
                heroStats['gameAttactPwr'] = heroPlayerEl.attr('data-attackPwr');

                // fade out choose character h2
                $('.players-wrapper').slideUp(500, function(){
                    enemiesWrapperEl.slideDown();
                    $('html, body').animate({ scrollTop: 100 }, 'slow');                    
                });
                enemiesSetup();
            });
        };

        function enemiesSetup(){
            playersEl.find('.player').appendTo(enemiesEl); // move remaining players to "enemies"
            var enemies = enemiesEl.find('.player');
            enemies.on('click.two', function(){
                // play lightsaber on
                lightsaberOn2.play();
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
            enemiesWrapperEl.slideUp(300, function (){
                messageEl.text('FIGHT!').slideDown();
                $('html, body').animate({ scrollTop: 100 }, 'slow');
            });
            // before any attack make sure hero attack is reset
            heroStats['gameAttactPwr'] = heroPlayerEl.attr('data-attackPwr');
            attack();
        };

        function attack() {
            // activate button
            attackBtnEl.attr('disabled', false);
            var attackCtr = 1;
            attackBtnEl.on('click.attk', function(){
                // play lightsaber sound
                var lightsaberClashMP3 = new Audio(getRandomSaberSound());
                lightsaberClashMP3.play();
                // reduce opponent healthPts by attackPwr
                heroStats.gameAttactPwr = parseInt(heroStats.attackPwr) * attackCtr;
                let oppGameHP = opponentStats.gameHealthPts - heroStats.gameAttactPwr;
                if (oppGameHP <= 0){
                    // dead
                    messageEl.text('Round Won!').slideDown();
                    deadWrapperEl.slideDown(300, function(){
                        moveAnimate(opponentPlayerEl,deadEl);
                    });
                    attackCtr = 1;
                    attackBtnEl.attr('disabled', 'disabled');
                    enemiesWrapperEl.slideDown(500, function (){
                        $('html, body').animate({ scrollTop: 100 }, 'slow');
                    });
                    pickNewOpponent();
                } else {
                    opponentStats.gameHealthPts = oppGameHP;
                    opponentPlayerEl.find('.health').text(opponentStats.gameHealthPts);
                }

                // reduce hero healthPts by ctrAttackPwr
                let heroGameHP = heroStats.gameHealthPts - opponentStats.ctrAttackPwr;
                if (heroGameHP <= 0) { // hero died
                    gameOver();
                } else {
                    heroStats.gameHealthPts = heroGameHP;
                    heroPlayerEl.find('.health').text(heroStats.gameHealthPts);
                }
                attackCtr++;
            });
        };

        function pickNewOpponent() {
            var getRemainingEnemies = enemiesWrapperEl.find('.player');
            getRemainingEnemies.on('click', function(){
                // play lightsaber on
                lightsaberOn2.play();
                opponentSetup($(this));
                heroStats.gameAttactPwr = parseInt(heroStats.attackPwr);
                attackBtnEl.off('click.attk');
                attack();
            });
        }

        function gameOver(){
            messageEl.text('YOU LOSE!').slideDown(500, function (){
                $('html, body').animate({ scrollTop: 100 }, 'slow');
            });
        }

        function getRandomSaberSound() {
            var num = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
            return 'assets/audio/Lightsaber-Clash' + num + '.mp3';
        };

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