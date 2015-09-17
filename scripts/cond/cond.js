
// cond command module.
function Cond () {



  var STATUSES = [ 
    'red',
    'blue',
    'green',
    'brown',
    'purple',
    'pink',
    'yellow',
    'dead',
    'skull',
    'sleepy',
    'half-heart',
    'half-haze',
    'interdiction',
    'snail',
    'lightning-helix',
    'spanner',
    'chained-heart',
    'chemical-bolt',
    'death-zone',
    'drink-me',
    'edge-crack',
    'ninja-mask',
    'stopwatch',
    'fishing-net',
    'overdrive',
    'strong',
    'fist',
    'padlock',
    'three-leaves',
    'fluffy-wing',
    'pummeled',
    'tread',
    'arrowed',
    'aura',
    'back-pain',
    'black-flag',
    'bleeding-eye',
    'bolt-shield',
    'broken-heart',
    'cobweb',
    'broken-shield',
    'flying-flag',
    'radioactive',
    'trophy',
    'broken-skull',
    'frozen-orb',
    'rolling-bomb',
    'white-tower',
    'grab',
    'screaming',
    'grenade',
    'sentry-gun',
    'all-for-one',
    'angel-outfit',
    'archery-target' 
  ];

  return {
    // Externals
  };

}

// Store the command's state in the CLIMachs global.
CLIMachs.cond = CLIMachs.cond || Cond();

// Start up the command when the sandbox ready event is emitted.
on( 'ready', CLIMachs.cond.onReady );
