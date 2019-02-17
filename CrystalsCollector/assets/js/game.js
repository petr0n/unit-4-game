/* crystal collector */

$(document).ready(function() {

    var crystalCollector = (function(){

        const btnEls = $('.btn');
        const winsEl = $('.wins');
        const lossesEl = $('.losses');
        const randomNumEl = $('.randomNum');
        const playerNumEl = $('.playerNum');
        const messageEl = $('.message');
        let wins = 0;
        let losses = 0;
        let gameRunning = false;

        function init(){
            randomNum = Math.floor(Math.random() * (120 - 19 + 1)) + 19;
            playerNum = 0;
            btnEls.attr('disabled',false);
            playerNumEl.text(0);
            new play();
        };

        function getRandomCrystalNum() {
            return randomCrystalNum = Math.floor(Math.random() * (12 - 1 + 1)) + 1;
        };

        function play(){
            if (!gameRunning) {
                gameRunning = true;
                randomNumEl.text(randomNum);
                btnEls.each(function(x){
                    $(this).attr('data-click-val', getRandomCrystalNum());
                    crystalGenerator($(this))
                });

                btnEls.on('click.btn', function(){
                    playerNum += parseInt($(this).attr('data-click-val'));
                    $('.playerNum').text(playerNum);
                    if (playerNum > randomNum) {
                        btnEls.attr('disabled','disabled').off('click.btn'); //disable buttons after loss for a moment
                        messageEl.text('YOU LOSE!!')
                            .addClass('lose')
                            .slideDown('fast')
                            .delay(3000)
                            .slideUp('slow', function(){
                            losses++;
                            lossesEl.text(losses);
                            gameRunning = false;
                            init();
                        });
                    } else if (playerNum === randomNum) {
                        btnEls.attr('disabled','disabled').off('click.btn'); //disable buttons after win for a moment
                        messageEl.text('YOU WIN!!')
                            .removeClass('lose')
                            .slideDown('fast')
                            .delay(3000)
                            .slideUp('slow', function(){
                            wins++;
                            winsEl.text(wins);
                            gameRunning = false;
                            init();
                        });
                    }    
                });
            }
        };

        function crystalGenerator(btn){
            isGenerating = false;
            var timing = 100;

            var generateGems = setInterval(function(){
                var randomCrystalImg = 'gem_' + (Math.floor(Math.random() * (20 - 1 + 1)) + 1) + '.png';
                isGenerating = true;
                btn.html('<img src="assets/images/' + randomCrystalImg +'">');
            }, timing);

            // after 3 seconds stop it
            setTimeout(function(){
                clearInterval(generateGems);
                isGenerating = false;
            }, 2000);
        };

        init();
    });
    crystalCollector();


});
