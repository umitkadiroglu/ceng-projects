$(function() {
  const FADE_TIME = 150; // ms

  // Initialize variables
  const $window = $(window);
  const $usernameInput = $('.usernameInput'); // Input for username
  const $messages = $('.messages');           // Messages area
  const $inputMessage = $('.inputMessage');   // Input message input box

  const $loginPage = $('.login.page');        // The login page
  const $chatPage = $('.chat.page');          // The chatroom page

  const socket = io();


  // get editor from its id
  const getEl = id => document.getElementById(id);
  const editor = getEl("editor");
  
  // when the keyup event triggered, send the editor value using socket
  editor.addEventListener("keyup", evt => {
    const text = editor.value;
    socket.send(text);
  });

  socket.on('message', data => {
    editor.value = data;
  });

  // Setting a username
  let username;
  let $currentInput = $usernameInput.focus();

  const addParticipantsMessage = (data) => {
    let message = '';
    if (data.numUsers === 1) {
      message += `there's 1 participant`;
    } else {
      message += `there are ${data.numUsers} participants`;
    }
    log(message);
  }

  // Sets the client's username
  const setUsername = () => {
    username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }



  // Log a message
  const log = (message, options) => {
    const $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }
  const addMessageElement = (el, options) => {
    const $el = $(el);
    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }

    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }



  // Keyboard events

  $window.keydown(event => {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    // When the client hits ENTER on their keyboard
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', () => {
    updateTyping();
  });

  // Click events

  // Focus input when clicking anywhere on login page
  $loginPage.click(() => {
    $currentInput.focus();
  });

  // Focus input when clicking on the message input's border
  $inputMessage.click(() => {
    $inputMessage.focus();
  });

  // Socket events

  // Login
  socket.on('login', (data) => {
    connected = true;
    // Display the welcome message
    const message = 'Collaborative Code Editor';
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  // New message
  socket.on('new message', (data) => {
    addChatMessage(data);
  });

  // User joined
  socket.on('user joined', (data) => {
    log(`${data.username} joined`);
    addParticipantsMessage(data);
  });

  // User left
  socket.on('user left', (data) => {
    log(`${data.username} left`);
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  // User disconnect

  socket.on('disconnect', () => {
    log('you have been disconnected');
  });

  socket.on('reconnect', () => {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', () => {
    log('attempt to reconnect has failed');
  });

  

});
