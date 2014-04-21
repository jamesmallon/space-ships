
/*
 * Plugin: tmsSpaceship
 * Version: 1.0
 * Author: Thiago Mallon Santos
 * E-mail: thiagomallon@gmail.com
 * Date Modified: 16/04/2014
 */

jQuery.tmsSpaceship = function() {

    /** pega tag title da página */
    var title = $('title');

    /** objeto com possíveis naves principais */
    var flys = {
        fly_a: 'spaceship.png',
        fly_b: 'spaceship_b.png',
        fly_c: 'spaceship_c.png',
        fly_d: 'spaceship_d.png'
    };

    /** evento modifica valor da tag title da página */
    setInterval(function() {
        if (title.html() !== 'Spaceship') {
            title.html('Spaceship');
        } else if (title.html() === 'Spaceship') {
            title.html('Mallon CO.');
        }
    }, 1000);

    /** função coloca elementos no body */
    (function() {
        $('body').append("<h3 style='color: gainsboro; margin: 0 auto; width: 17em;'> Use a,w,d,s and space to play </h3>");
        $('body').append("<div id='box_spaceship'></div>");
        $('#box_spaceship').append("<div id='informations'></div>");
        // $('#box_spaceship').css('width', '810px');
        $('#informations').prepend('<div style="position: absolute;"><audio autoplay controls name="media"><source src="sounds/to_glory.mp3" type="audio/mp3"></audio></div>');
        // $('#box_spaceship').append("<div id='btn_a'><span id='direita'>&#8680;</span><br /><span id='esquerda'>&#8678;</span></div>");
        $('#box_spaceship').append("<div id='screen'></div>");
        // $('#box_spaceship').append("<div id='btn_b'><span id='cima'>&#8679;</span><br /><span id='atirar'>&#10050;</span><br /><span id='baixo'>&#8681;</span></div>");
        $('#box_spaceship').append("<div id='possible_flys'></div>");
        $('#box_spaceship').append("<div id='shot_sounds'></div>");
        $('#box_spaceship').append("<div id='explosion_sounds'></div>");
        putPossibleFlys();
        $('#screen').append("<div id='fly'><img src='img/" + flys.fly_a + "'></div>");
        $('#informations').append("<table></table>");
        $('#informations table').append("<tr><td>Pontuação:</td><td><span id='pontuacao'>00</span></td></tr>");
        $('#informations table').append("<tr></td><td>Velocidade Oponente:</td><td><span id='enemySpeed'>100</span></td></tr>");
    }());

    /** função disponibiliza possíveis naves para jogador */
    function putPossibleFlys() {
        for (var key in flys) {
            $('#possible_flys').append('<img class="flys" src="img/' + flys[key] + '">');
        }
    }

    /** função captura clique nas possíveis naves do fly */
    $('#possible_flys img').click(function() {
        $('#fly img').attr('src', $(this).attr('src'));
    });

    /** evento altera a posição do background da div screen */
    setInterval(function() {
        $('#screen').css('background-position', scenarioPosition);
        scenarioPosition -= 1;
    }, 200);

    /** propriedades do fly */
    var fly = $('#fly'), // armazena fly
            flyMarginLeft = 0, // armazena margem esquerda do fly
            flyMarginTop = 0, // armazena margem de topo do fly    
            flyShotCount = 1, // armazena quantidade de tiros ativos do fly
            flyShotTimer = null, // armazena timer do fly shot
            flySpeed = 500;

    /** propriedades do screen */
    var screen = $('#screen'), // armazena screen
            scenarioPosition = -71; // posição inicial do cenário

    /** propriedades do fly_enemy */
    var flyEnemy = null, // armazenará fly_enemy
            flyEnemyMarginLeft = 545, // armazena margem esquerda do fly_enemy
            flyEnemyMarginTop = 0, // armazena margem de topo do fly_enemy
            flyEnemyTimer = 0, // armazena timer do fly_enemy
            flyEnemySpeed = 100, // armazena velocidade do inimigo
            flyScore = 0; // armazena pontuação do fly

    /** função seta randomicamente a margem do topo do fly_enemy */
    function setFlyEnemyMarginTop() {
        flyEnemyMarginTop = parseInt(Math.floor(Math.random() * 29) + 1 + "0");
        flyEnemy.css('margin-top', flyEnemyMarginTop);
    }

    /** função incrementa pontuação do jogador */
    function decrementScore() {
        flyScore = parseInt($('#pontuacao').html());
        $('#pontuacao').html(flyScore - 10);
    }

    /** função implementa movimentação do fly_enemy */
    function moverFlyEnemy() {
        flyEnemyTimer = setInterval(function() {
            if (flyEnemyMarginLeft > 0) {
                flyEnemyMarginLeft -= 5;
                flyEnemy.css('margin-left', flyEnemyMarginLeft);
            } else {
                decrementScore();
                setFlyEnemy();
            }
        }, flyEnemySpeed);
    }

    /** função seta configurações iniciais de flyEnemy */
    function setFlyEnemy() {
        flyEnemy.html('<img src="img/spaceship_enemy_' + (Math.floor(Math.random() * 3) + 1) + '.png">');
        flyEnemyMarginLeft = 545;
        flyEnemy.css('margin-left', flyEnemyMarginLeft);
        clearInterval(flyEnemyTimer);
        setFlyEnemyMarginTop();
        moverFlyEnemy();
    }

    /** função self-invoke, adiciona inimigos à tela */
    (function() {
        screen.append('<div id="fly_enemy"></div>');
        flyEnemy = $('#fly_enemy');
        setFlyEnemy();
    }());

    /** função move fly para a direita */
    function moveRight() {
        fly.stop(true, true);
        if (flyMarginLeft < 585) {
            flyMarginLeft += 5;
            fly.animate({
                marginLeft: flyMarginLeft
            }, 500);
        }
    }

    /** função move fly para a esquerda */
    function moveLeft() {
        fly.stop(true, true);
        if (flyMarginLeft > 0) {
            flyMarginLeft -= 5;
            fly.animate({
                marginLeft: flyMarginLeft
            }, flySpeed);
        }
    }

    /** função move fly para baixo */
    function moveBottom() {
        fly.stop(true, true);
        if (flyMarginTop < 300) {
            flyMarginTop += 5;
            fly.animate({
                marginTop: flyMarginTop
            }, flySpeed);
        }
    }

    /** função move fly para cima */
    function moveTop() {
        fly.stop(true, true);
        if (flyMarginTop > 0) {
            flyMarginTop -= 5;
            fly.animate({
                marginTop: flyMarginTop
            }, flySpeed);
        }
    }

    /** função aumenta velocidade do fly enemy */
    function incrementFlyEnemySpeed() {
        if (flyScore % 50 === 0) {
            $('#enemySpeed').html((200 - flyEnemySpeed));
            flyEnemySpeed -= 1;
        }
    }

    /** função incrementa pontuação do jogador */
    function incrementScore() {
        flyScore = parseInt($('#pontuacao').html());
        $('#pontuacao').html(flyScore + 10);
        incrementFlyEnemySpeed();
    }

    /** função remove explosão da tela */
    function removeExplosion(explosionCount) {
        $('#explosion_' + explosionCount).fadeOut("slow", function() {
            $('#explosion_' + explosionCount).remove();
        });
    }

    /* função implementa som às explosões das naves */
    function doExplosionSound() {
        $('#explosion_sounds').append('<video autoplay name="media"><source src="sounds/spaceship_explosion.mp3" type="audio/mp3"></video>');
    }

    /** função cria explosão na tela, após colisão do tiro com o oponente */
    function showExplosion(mL, mT, explosionCount) {
        doExplosionSound();
        $('#screen').append('<img id="explosion_' + explosionCount + '">');
        $('#explosion_' + explosionCount).css({
            position: 'absolute',
            'margin-left': mL,
            'margin-top': mT
        }).attr("src", "img/explosion.png");
        removeExplosion(explosionCount);
    }

    /** função verifica se tiro está no mesmo espaço do inimigo */
    function checkShotPosition(shotCount) {
        var flyShotML = parseInt($('#flyShot_' + shotCount).css('margin-left').replace('px', ''));
        var flyShotMT = parseInt($('#flyShot_' + shotCount).css('margin-top').replace('px', ''));
        if ((flyShotML === flyEnemyMarginLeft || (flyShotML - 5) === flyEnemyMarginLeft) &&
                (flyShotMT === flyEnemyMarginTop || (flyShotMT + 15) >= flyEnemyMarginTop && (flyShotMT - 15) <= flyEnemyMarginTop)) {
            $('#flyShot_' + shotCount).remove();
            showExplosion(flyEnemyMarginLeft, flyEnemyMarginTop, shotCount);
            setFlyEnemy();
            incrementScore();
        }
    }

    /** função movimenta tiros do fly */
    function moveFlyShoting(shotCount, flyShotMarginLeft) {
        flyShotTimer = setInterval(function() {
            if (flyShotMarginLeft < 585) {
                flyShotMarginLeft += 5;
                $('#flyShot_' + shotCount).css('margin-left', flyShotMarginLeft);
                checkShotPosition(shotCount);
            } else {
                $('#flyShot_' + shotCount).remove();
            }
        }, 60);
    }

    /** função movimenta tiro do fly */
    function moveFlyShot(shotCount) {
        var flyShotMarginLeft = parseInt($('#flyShot_' + shotCount).css('margin-left').replace('px', ''));
        moveFlyShoting(shotCount, flyShotMarginLeft);
    }

    /** função seta shot do fly */
    function setFlyShot() {
        flyShotCount += 1;
        screen.append('<div id="flyShot_' + flyShotCount + '">&rsaquo;</div>');
        $('#flyShot_' + flyShotCount).css({
            position: 'absolute',
            color: 'gainsboro',
            'font-size': '30px',
            'font-weight': 'bolder',
            'margin-left': (flyMarginLeft + 25),
            'margin-top': (flyMarginTop)
        });
        moveFlyShot(flyShotCount);
    }

    /** função desacelera o fly */
    function stopFly() {
        flySpeed = 300;
    }

    /* função implementa som aos tiros do fly */
    function doFlyShotSound() {
        $('#shot_sounds').html('<video autoplay name="media"><source src="sounds/laser_shot.wav" type="audio/wav"></video>');
    }

    /** função pega código de tecla digitada e implementa ação */
    function getMoves(move) {
        switch (move) {
            case 32:
                doFlyShotSound(); // função implementa som aos tiros do fly
                setFlyShot(); // função seta tiro do fly
                break;
            case 65:
                moveLeft(); // função implementa movimentação do fly para a esquerda
                break;
            case 68:
                moveRight(); // função implementa movimentação do fly para a direita
                break;
            case 83:
                moveBottom(); // função implementa movimentação do fly para baixo
                break;
            case 87:
                moveTop(); // função implementa movimentação do fly para cima
                break;
            default:
                //alert(move);
                break;
        }
    }

    function stopMoves(move) {
        switch (move) {
            case 65:
                stopFly();
                moveLeft(); // função implementa movimentação do fly para a esquerda
                break;
            case 68:
                stopFly();
                moveRight(); // função implementa movimentação do fly para a direita
                break;
            case 83:
                stopFly();
                moveBottom(); // função implementa movimentação do fly para baixo
                break;
            case 87:
                stopFly();
                moveTop(); // função implementa movimentação do fly para cima
                break;
        }
    }
    /*
     $('#esquerda').click(function() {
     moveLeft();
     });
     $('#cima').click(function() {
     moveTop();
     });
     $('#direita').click(function() {
     moveRight();
     });
     $('#baixo').click(function() {
     moveBottom();
     });
     $('#atirar').click(function() {
     setFlyShot();
     });
     */

    /** captura código de teclas apertadas */
    $('body').keydown(function(e) {
        getMoves(e.keyCode);
    });

    /** captura código de teclas soltadas */
    $('body').keyup(function(e) {
        stopMoves(e.keyCode);
    });

};
