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
        <Pip value={this.props.value} key={this.props.value} />
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
      return <Card value={card} key={card}/>;
    };
    return (
      <div className="board">
        {this.props.cards.map(createCard)}
      </div>
    );
  }
});

var PokerTable = React.createClass({
  render: function() {
    var createHoleCards = function(holeCards) {
      return <HoleCards cards={holeCards} key={holeCards} />
    };
    return (
      <div className="poker-table">
        <BoardCards cards={this.props.boardCards} />
        {this.props.holeCards.map(createHoleCards)}
      </div>
    );
  }
});

var Winners = React.createClass({
  winners: function() {
    return this.props.winners.map(function(winner) {
      return winner['name'] + ' with ' + winner['handType'];
    }).join(', ');
  },
  render: function() {
    var label = "Winner is "
    if (this.props.winners.length > 1) {
      label = "Winners are "
    }
    return(
      <div>
        <h4>{label}{this.winners()}</h4>
      </div>
    );
  }
})

var DealButton = React.createClass({
  showWinners: function(json) {
    if (json['winners']) {
      React.render(
        <Winners winners={json['winners']} />,
        document.getElementById('winners')
      );
    }
  },
  handleClick: function() {
    var xhr = new XMLHttpRequest();
    var self = this;
    xhr.onload = function() {
      if (xhr.status !== 200) {
        throw new Error('request failed');
      }
      var json = JSON.parse(xhr.response);
      self.renderPokerTable(json, self.showWinners);
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
  },
  renderPokerTable: function(json, callback) {
    var holeCards = json.players.map(function(p) { return p['holeCards']; });
    React.unmountComponentAtNode(document.getElementById('winners'));
    React.render(
      <DealButton street={json['street']} handId={json['handId']}/>, document.getElementById('deal-button')
    );
    React.render(
      <PokerTable holeCards={holeCards} boardCards={json['board']} />,
      document.getElementById('poker-table')
    );
    if (typeof callback === 'function') {
      callback(json);
    }
  }
});

// Init
React.render(
  <DealButton street='preflop'/>, document.getElementById('deal-button')
);

React.render(
  <PokerTable boardCards={[]} holeCards={[]} />, document.getElementById('poker-table')
);
