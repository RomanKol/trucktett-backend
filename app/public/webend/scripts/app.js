//
//  DOM Elements
//
var loginEl = document.getElementById('login'),
    loginMailEl = loginEl.querySelectorAll('input')[0],
    loginPasswordEl = loginEl.querySelectorAll('input')[1],
    loginBtnEl = loginEl.querySelector('button');

var navEl = document.getElementById('nav'),
    navProfileTabEl = navEl.querySelectorAll('button')[0],
    navUsersTabEl = navEl.querySelectorAll('button')[1],
    navGameTabEl = navEl.querySelectorAll('button')[2],
    navChatTabEl = navEl.querySelectorAll('button')[3];

var profileEl = document.getElementById('user'),
    profileCardEl = profileEl.querySelector('.card'),
    profileDetailstEl = profileEl.querySelector('.details'),
    profileNearbyEl = profileEl.querySelector('.mapNearby');

var usersEl = document.getElementById('users'),
    usersBtnEl = usersEl.querySelector('button'),
    usersListEl = usersEl.querySelector('.list'),
    usersCardEl = usersEl.querySelector('.card'),
    usersMapEl = usersEl.querySelector('.map');

var gameEl = document.getElementById('game'),
    gameQueueEl = gameEl.querySelector('button'),
    gameBodyEl = gameEl.querySelector('ul'),
    gameCardEl = gameEl.querySelector('.card');

var chatEl = document.getElementById('chat'),
    chatMessageEl = chatEl.querySelector('input'),
    chatSendEl = chatEl.querySelector('button'),
    chatBodyEl = chatEl.querySelector('ul');

//
//  User Objects
//
var user = {},
    token,
    userPlayer,
    game,
    users;

//
//  Socket
//
var socket = io();

//
//  Login Handler
//
loginBtnEl.addEventListener('click', function () {

    mail = loginMailEl.value,
    password = loginPasswordEl.value;

    if (mail != '' && password != '') {

        var loginReq = new XMLHttpRequest();
            loginReq.open('POST', '/trucktett/login', true);
            loginReq.setRequestHeader('Content-Type', 'application/json');

        loginReq.onload = function() {
          if (this.status >= 200 && this.status < 400) {
            data = JSON.parse(this.response);

            if (data.login) {
                token = data.token;
                user = data.user;

                tabToggle(navEl, loginEl);
                tabToggle(profileEl);

                profileCardEl.appendChild(buildCard(user, false));
                buildUserProfile(user, profileDetailstEl);
                getNearBy(user.loc, profileNearbyEl);

                var usersReq = new XMLHttpRequest();
                    usersReq.open('GET', '/trucktett/users/', true);
                    usersReq.setRequestHeader('x-access-token', token);


                usersReq.onload = function() {
                    if (this.status >= 200 && this.status < 400) {
                        users = JSON.parse(this.response);

                        users.forEach(function (user, index) {
                            liEl = document.createElement('div');
                            liEl.dataset.userid = user._id;
                            liEl.classList.add('col-md-12', 'mb', 'user');

                            wrapperEl = document.createElement('div');
                            wrapperEl.classList.add('bg-info');

                            usernameEl = document.createElement('h4');
                            usernameEl.textContent = user.username;

                            wrapperEl.appendChild(usernameEl);

                            liEl.appendChild(wrapperEl);

                            usersListEl.appendChild(liEl);
                        });
                    }
                };
                usersReq.send();
            }
          }
        };

        loginReq.send(JSON.stringify({
            mail: mail,
            password: password
        }));
    }
});

//
//  Tabs
//
navProfileTabEl.addEventListener('click', function () {
    tabToggle(profileEl);
});
navUsersTabEl.addEventListener('click', function () {
    tabToggle(usersEl);
});
navGameTabEl.addEventListener('click', function () {
    tabToggle(gameEl);
});
navChatTabEl.addEventListener('click', function () {
    tabToggle(chatEl);
});

function tabToggle (tab) {
    var els = document.querySelectorAll('section');

    for (i = 0; i < els.length; i++) {
        if (!els[i].classList.contains('hidden')) {
            els[i].classList.add('hidden');
        }
    }

    tab.classList.remove('hidden');
}

//
//  Users
//
usersListEl.addEventListener('click', function (evt) {

    if (evt.target !== evt.currentTarget){
        el = evt.target;

        // Bubble To Clicked Tile Element
        while ( !el.classList.contains('user') ){
            el = el.parentElement;
        }

        profile = users.find(function (usert) {
            return usert._id == el.dataset.userid;
        });

        if ( usersCardEl.children[0] ) {
            usersCardEl.removeChild(usersCardEl.children[0])
        }

        cardEl = buildCard(profile, false);

        usersCardEl.appendChild(cardEl);

        var geo = {lat: profile.loc[0], lng: profile.loc[1]};

        var map = new google.maps.Map(usersMapEl, {
            zoom: 12,
            center: geo,
            disableDefaultUI: true,
            zoomControl: true
        });

        var marker = new google.maps.Marker({
            position: geo,
            map: map,
            title: profile.username
        });

    }
});

//
//  Game
//
gameQueueEl.addEventListener('click', function (e) {
    socket.emit('queue', user._id);
});

socket.on('queue', function (msg) {
    item = document.createElement('li');
    item.innerText = msg.msg;
    gameBodyEl.appendChild(item);

    if(msg.ready) {
        loadGame(msg);
    }
})

socket.on('game', function (msg) {

    if (msg.round > 0) {

        profile = game.players.find(function (usert) {
            return usert._id == user._id;
        });

        if (msg.player == user._id) {
            gameStatus("You have won this turn", 'success');
        } else {
            gameStatus(profile.username + " has won this turn", 'danger');
        }

        collectCards(msg.player);

        gameStatus("Round " + (11 - msg.round) + " starts", 'primary');

        if ( gameCardEl.children[0] ) {
            gameCardEl.removeChild(gameCardEl.children[0])
        }

        cardEl = buildCard(profile.deck[0], true);
        gameCardEl.appendChild(cardEl);


    } else {

        if ( gameCardEl.children[0] ) {
            gameCardEl.removeChild(gameCardEl.children[0])
        }

        end = document.createElement('h3');
        end.textContent = 'End';
        gameCardEl.appendChild(end);

        gameStatus('Game Over');

        if (user._id == msg.player) {
            gameStatus('Congratulation! You won this game', 'success');
        } else {
            game.players.forEach(function (player, index) {
                if(player._id == msg.player) {
                    gameStatus(player.username + ' won the game!', 'danger')
                }
            });
        }

        gameStatus('Queue for a new round of Turcktett', 'success');
    }

});

function collectCards (winnerId) {
    cards = [];

    game.players.forEach(function (player, index) {
        if(player.deck.length > 0) {
            cards.push(player.deck.shift());
        }
    });

    game.players.forEach(function (player, index) {
        if(player._id == winnerId) {
            cards.forEach(function (card) {
                player.deck.push(card);
            });
        }

        if(player._id == user._id) {
            gameStatus('You have now ' + player.deck.length + ' cards', 'info');
        } else {
            gameStatus(player.username + ' has now ' + player.deck.length + ' cards', 'info');
        }

    });
}

function gameStatus (msg, clss) {

    item = document.createElement('li');
    item.classList.add('bg-' + clss);

    item.innerText = msg;
    gameBodyEl.appendChild(item);
    gameBodyEl.scrollTop = gameBodyEl.scrollHeight;
}

function loadGame (msg) {
    var gameReq = new XMLHttpRequest();
        gameReq.open('GET', '/trucktett/games/' + msg.gameId, true);
        gameReq.setRequestHeader('x-access-token', token);

    gameReq.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        game = JSON.parse(this.response);

        gameStatus('Game Data loaded', 'info');
        gameStatus('Round 1 starts', 'primary');

        userPlayer = game.players.find(function(player) {
            return player._id == user._id;
        });

        clickable = false;
        if (msg.player == user._id) {
            clickable = true;
            gameStatus("It's your turn!\nChoose a Attribute", 'success');
        } else {
            starter = game.players.find(function(player) {
                return player._id == msg.player;
            });
            gameStatus("It's " + starter.username + "'s turn!", 'danger');
        }

        cardEl = buildCard(userPlayer.deck[0], clickable);

        if ( gameCardEl.children[0] ) {
            gameCardEl.removeChild(gameCardEl.children[0])
        }

        gameCardEl.appendChild(cardEl);

      }
    };

    gameReq.onerror = function() {
      alert('Server nicht erreichtbar');
    };

    gameReq.send();
}

function buildCard (profile, clickable) {

    cardEl = document.createElement('div');

    cardImageEl = document.createElement('img');
    //loadUserImage(profile._id, cardImageEl);
    cardImageEl.src = 'https://placeholdit.imgix.net/~text?txtsize=32&txt=' + profile.username + '&w=300&h=150';

    cardNameEl = document.createElement('h3');
    cardNameEl.textContent = profile.username;

    cardTruckEl = document.createElement('p');
    cardTruckEl.textContent = profile.truck;

    cardMottoEl = document.createElement('p');
    cardMottoEl.textContent = profile.motto;

    cardAttributes = document.createElement('table');
    cardAttributes.classList.add('table', 'table-striped', 'hover');

    if(clickable) {
        cardAttributes.addEventListener('click', cardAttributesClickEventHandler);
    }

    for (attribute in profile.attributes) {
        tr = document.createElement('tr');
        tr.dataset.attribute = attribute;

        tdKey = document.createElement('td');
        tdKey.textContent = attribute;

        tdVal = document.createElement('td');
        tdVal.textContent = profile.attributes[attribute];

        tr.appendChild(tdKey);
        tr.appendChild(tdVal)
        cardAttributes.appendChild(tr);
    }

    cardEl.appendChild(cardImageEl);
    cardEl.appendChild(cardNameEl);
    cardEl.appendChild(cardTruckEl);
    cardEl.appendChild(cardMottoEl);
    cardEl.appendChild(cardAttributes);

    return cardEl;
}

function loadUserImage (userid, imgEl) {
    window.URL = window.URL || window.webkitURL;  // Take care of vendor prefixes.

    var userImgReq = new XMLHttpRequest();
    userImgReq.open('GET', '/trucktett/users/' + userid + '/image', true);
    userImgReq.setRequestHeader('x-access-token', token);
    userImgReq.responseType = 'blob';

    userImgReq.onload = function(e) {
      if (this.status == 200) {
        var blob = this.response;

        imgEl.onload = function(e) {
            window.URL.revokeObjectURL(imgEl.src); // Clean up after yourself.
        };

        imgEl.src = window.URL.createObjectURL(blob);

      }
    };

    userImgReq.send();
}

function cardAttributesClickEventHandler (evt) {

    el = evt.target;

    if (el.nodeName !== 'TR') {

        while ( el.nodeName !== 'TR' ){
            el = el.parentElement;
        }

        socket.emit('game', {
            attribute: el.dataset.attribute,
            gt: true
        });
    }
}

function buildUserProfile (profile, el) {

    aboutHEl = document.createElement('h3');
    aboutHEl.textContent = 'About';

    aboutEl = document.createElement('table');
    aboutEl.classList.add('table', 'table-striped');

    for (key in profile.about) {
        tr = document.createElement('tr');

        tdKey = document.createElement('td');
        tdKey.textContent = key;

        tdVal = document.createElement('td');
        tdVal.textContent = profile.about[key];

        tr.appendChild(tdKey);
        tr.appendChild(tdVal)
        aboutEl.appendChild(tr);
    }

    locHEl = document.createElement('h3');
    locHEl.textContent = 'Location';

    locsEl = document.createElement('p');
    locsEl.textContent = 'Lat / Lng: ' + profile.loc[0] + ' / ' + profile.loc[1];

    mapEl = document.createElement('div');
    mapEl.classList.add('map');

    var geo = {lat: profile.loc[0], lng: profile.loc[1]};

    var map = new google.maps.Map(mapEl, {
        zoom: 12,
        center: geo,
        disableDefaultUI: true,
        zoomControl: true
    });

    var marker = new google.maps.Marker({
        position: geo,
        map: map,
        title: profile.username
    });


    el.appendChild(aboutHEl);
    el.appendChild(aboutEl);
    el.appendChild(locHEl);
    el.appendChild(locsEl);
    el.appendChild(mapEl);
}

function getNearBy (loc, el) {

    var geo = {lat: loc[0], lng: loc[1]};

    var map = new google.maps.Map(el, {
        center: geo,
        disableDefaultUI: true,
        zoomControl: true
    });

    var bounds = new google.maps.LatLngBounds();

    var nearbyReq = new XMLHttpRequest();
        nearbyReq.open('GET', '/trucktett/users/nearby', true);
        nearbyReq.setRequestHeader('Content-Type', 'application/json');
        nearbyReq.setRequestHeader('x-access-token', token);
        nearbyReq.setRequestHeader('lng', loc[0]);
        nearbyReq.setRequestHeader('lat', loc[1]);
        nearbyReq.setRequestHeader('distance', 2000);

    nearbyReq.onload = function() {

        if (this.status >= 200 && this.status < 400) {
            data = JSON.parse(this.response);

            var infowindow = new google.maps.InfoWindow();

            var marker, i;

            data.forEach( function (mapUser) {

                latLng = new google.maps.LatLng(mapUser.loc[0], mapUser.loc[1])

                marker = new google.maps.Marker({
                    position: latLng,
                    label: mapUser.username,
                    map: map
                });

                bounds.extend(marker.position);

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                        infowindow.setContent(user.username);
                        infowindow.open(map, marker);
                    }
                })(marker, i));
            });

            map.fitBounds(bounds);
        }
    };

    nearbyReq.send();
}

//
//  Chat
//
chatSendEl.addEventListener('click', function (e) {
    if(chatMessageEl.value != '') {
        socket.emit('chat', {user: user.username, message: chatMessageEl.value});
        chatMessageEl.value = '';
    }
});

socket.on('chat', function (msg) {
    message = document.createElement('li');
    messageHeader = document.createElement('div');
    messageBody = document.createElement('p');

    messageHeader.innerText = msg.user + ':';
    messageBody.innerText = msg.message;

    message.appendChild(messageHeader);
    message.appendChild(messageBody);
    chatBodyEl.appendChild(message);

    chatBodyEl.scrollTop = chatBodyEl.scrollHeight;
});

//
//  Login Data
//

console.log('*****************************************\n| user 1:   johannawhitney@imperium.com |\n| password: password                    |\n-----------------------------------------\n| user 2:   maryanngillespie@zinca.com  |\n| password: password                    |\n*****************************************');