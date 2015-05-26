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

var DealButton = React.createClass({
  handleClick: function() {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
      if (xhr.status !== 200) {
        throw new Error('request failed');
      }
      var json = JSON.parse(xhr.response);
      var holeCards = json.players.map(function(p) { return p['holeCards']; });
      React.render(
        <DealButton street={json['street']} handId={json['handId']}/>, document.getElementById('deal-button')
      );
      React.render(
        <Table holeCards={holeCards} boardCards={json['board']} />,
        document.getElementById('room')
      );
    }

    if (this.props.street == 'preflop') {
      xhr.open('POST', 'http://localhost:3000/hands', true);
    } else {
      xhr.open('GET', 'http://localhost:3000/hands/' + this.props.handId + '/' + this.props.street, true)
    }

    xhr.send();
  },
  render: function() {
    return (
      <button onClick={this.handleClick}>Deal {this.props.street}</button>
    );
  }
});

// Init
React.render(
  <DealButton street='preflop'/>, document.getElementById('deal-button')
);

React.render(
  <Table boardCards={[]} holeCards={[]} />, document.getElementById('room')
);
