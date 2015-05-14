var SimpleDeck = function() {
  var ranks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
  var suits = ['c', 'd', 'h', 's'];
  var cards = [];
  suits.forEach(function(suit) {
    ranks.forEach(function(rank) {
      cards.push(rank + suit);
    });
  });
  this.cards = cards;
};

SimpleDeck.prototype.dealCard = function() {
  return this.cards.shift();
};

SimpleDeck.prototype.deal = function(street) {
  var numCards = {
    'holeCards': 2,
    'flop': 3,
    'turn': 1,
    'river': 1,
  }[street];
  var self = this;
  return _.times(numCards, function() {
    return self.dealCard();
  });
}

SimpleDeck.prototype.shuffle = function() {
  var shuffled = [];
  while(this.cards.length) {
    var randomIndex = Math.floor(Math.random() * this.cards.length);
    var element = this.cards.splice(randomIndex, 1);
    shuffled.push(element[0]);
  }
  this.cards = shuffled;
  return this;
};

var Pip = React.createClass({
  render: function() {
    var rank = this.props.value[0];
    var suit = {
      "c": "♣︎",
      "d": "♦︎",
      "h": "♥︎",
      "s": "♠︎"
    }[this.props.value[1]];

    return (
      <div className="pip">
        <div className="rank">{{rank}}</div>
        <div className="suit">{{suit}}</div>
      </div>
    );
  }
});

var Card = React.createClass({
  render: function() {
    var classString = "card ";
    var suit = {
      "c": "clubs",
      "d": "diamonds",
      "h": "hearts",
      "s": "spades"
    }[this.props.value[1]];
    classString += suit;
    return (
      <div className={classString}>
        <Pip value={this.props.value} />
      </div>
    );
  }
});

var HoleCards = React.createClass({
  render: function() {
    var createCard = function(card) {
      return <Card value={card} key={card} />;
    };
    return(
      <div className="hole-cards">
        {this.props.cards.map(createCard)}
      </div>
    );
  }
});

var BoardCards = React.createClass({
  render: function() {
    var createCard = function(card) {
      return <Card value={card}/>;
    };
    return (
      <div className="board">
        {this.props.cards.map(createCard)}
      </div>
    );
  }
});

var Table = React.createClass({
  render: function() {
    var createHoleCards = function(holeCards) {
      return <HoleCards cards={holeCards} key={holeCards} />
    };
    return (
      <div className="table">
        <BoardCards cards={this.props.boardCards} />
        {this.props.holeCards.map(createHoleCards)}
      </div>
    );
  }
});

var Board = function() {
  this.flop = [];
  this.turn = [];
  this.river = [];
};

Board.prototype.dealFlop = function(deck) {
  this.flop = deck.deal('flop');
};

Board.prototype.dealTurn = function(deck) {
  this.turn = deck.deal('turn');
};

Board.prototype.dealRiver = function(deck) {
  this.river = deck.deal('river');
};

Board.prototype.cards = function() {
  return this.flop.concat(this.turn, this.river);
};

// DealButton state will be populated from server...
var DealButton = React.createClass({
  streets: ['Preflop', 'Flop', 'Turn', 'River'],
  counter: 0,
  holeCards: [],
  getInitialState: function() {
    return {
      street: this.streets[this.counter]
    };
  },
  handleClick: function() {
    if (this.state.street == 'Preflop') {
      initHand();
      this.holeCards = _.times(this.props.players, function() {
        return deck.deal('holeCards');
      });
    } else {
      var methodName = "deal" + this.state.street;
      board[methodName](deck);
    }
    React.render(
      <Table holeCards={this.holeCards} boardCards={board.cards()} />,
      document.getElementById('room')
    );
    this.counter++;
    this.setState({ street: this.streets[this.counter % 4]});
  },
  render: function() {
    return (
      <button onClick={this.handleClick}>Deal {this.state.street}</button>
    );
  }
});

var PlayersCountSelect = React.createClass({
  handleChange: function() {
    React.render(
      <DealButton players={event.target.value}/>, document.getElementById('deal-button')
    );
  },
  render: function() {
    var createOption = function(i) {
      var value = i + 1;
      return <option value={value} key={value}>{{value}}</option>
    };
    return (
      <div className="players-count-select">
        <select onChange={this.handleChange} defaultValue="2">
          {_.times(this.props.players, createOption)}
        </select>
      </div>
    );
  }
});

var StartButton = React.createClass({
  handleClick: function() {

  },
  render: function() {
    return (
      <div className="start-button">
        <PlayersCountSelect players="9" />
        <button onClick={this.handleClick}>Start Game</button>
      </div>
    );
  }
})

function initHand() {
  deck = new SimpleDeck().shuffle();
  board = new Board();
}

// Main loop
var deck, board;
initHand();

React.render(
  <StartButton />, document.getElementById('start-button')
);

React.render(
  <Table boardCards={[]} holeCards={[]} />, document.getElementById('room')
);
