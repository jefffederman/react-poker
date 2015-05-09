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
    'holeCards': [0,1],
    'flop': [0,1,2],
    'turn': [0],
    'river': [0],
  }[street];
  var self = this;
  return numCards.map(function() {
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
    return(
      <div className="holeCards">
        <Card value={this.props.cards[0]}/>
        <Card value={this.props.cards[1]}/>
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



// Main loop
var deck = new SimpleDeck().shuffle();

React.render(
  <HoleCards cards={deck.deal('holeCards')} />, document.getElementById('seats')
);

React.render(
  <BoardCards cards={deck.deal('flop')} />, document.getElementById('board')
);