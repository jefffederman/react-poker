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
});

var PlayerActions = React.createClass({
  getInitialState: function() {
    return { playerCount: 2};
  },
  createOptions: function() {
    return [1,2,3,4,5,6,7,8,9].map(function(i) {
      return (
        <option key={i}>{i}</option>
      );
    });
  },
  handlePlayerCountChange: function(e) {
    this.setState({ playerCount: e.target.value });
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var self = this;
    // 2015-05-31 Run into CORS preflight/redirect issues if we use JSON data
    var data = "playerCount=" + this.state.playerCount;
    $.ajax({
      method: this.props.httpMethod,
      url: this.props.action,
      data: data,
      dataType: 'json',
      crossDomain: true,
      success: function(data, textStatus, jqXHR) {
        self.renderPokerTable(data, self.showWinners);
      }
    });
  },
  showWinners: function(json) {
    if (json['winners']) {
      React.render(
        <Winners winners={json['winners']} />,
        document.getElementById('winners')
      );
    }
  },
  renderPokerTable: function(json, callback) {
    var holeCards = json.players.map(function(p) { return p['holeCards']; });
    React.unmountComponentAtNode(document.getElementById('winners'));
    React.render(
      <PlayerActions action={json['formAction']} street={json['street']} handId={json['handId']} httpMethod={json['httpMethod']} />,
      document.getElementById('deal-button')
    );
    React.render(
      <PokerTable holeCards={holeCards} boardCards={json['board']} />,
      document.getElementById('poker-table')
    );
    if (typeof callback === 'function') {
      callback(json);
    }
  },
  render: function() {
    return(
      <form onSubmit={this.handleSubmit} action={this.props.action} method={this.props.httpMethod}>
        <select name='playerCount' onChange={this.handlePlayerCountChange} value={this.state.playerCount}>
          {this.createOptions()}
        </select>
        <button>Deal {this.props.street}</button>
      </form>
    );
  }
});

// Init

React.render(
  <PokerTable boardCards={[]} holeCards={[]} />, document.getElementById('poker-table')
);

React.render(
  <PlayerActions action='http://localhost:3000/hands/' street='preflop' httpMethod='POST' />,
  document.getElementById('deal-button')
);